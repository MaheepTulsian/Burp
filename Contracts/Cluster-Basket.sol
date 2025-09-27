// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Cluster-DEX.sol";
import "./Cluster-Pricing.sol";

contract ClusterBasket is Ownable, ReentrancyGuard {
    struct Basket {
        string basketId;
        address[] tokens;
        uint256[] weights; // total must be 100
        address creator;
        bool isActive;
        uint256 totalInvested;
        uint256 createdAt;
    }

    struct UserHolding {
        uint256 amount;
        uint256 investedAt;
        uint256 lastRebalanced;
    }

    mapping(string => Basket) public baskets;
    mapping(address => mapping(string => UserHolding)) public userHoldings;
    string[] public activeBaskets;

    address public aiAgent;
    ClusterDEX public dex;
    ClusterPricing public pricing;

    event BasketCreated(string indexed basketId, address[] tokens, uint256[] weights);
    event UserInvested(address indexed user, string indexed basketId, uint256 amount);
    event BasketUpdated(string indexed basketId, uint256[] newWeights);

    modifier onlyAI() {
        require(msg.sender == aiAgent, "Not authorized AI agent");
        _;
    }

    // ✅ Explicitly pass msg.sender to Ownable
    constructor(address _aiAgent, address _dex, address _pricing) Ownable(msg.sender) {
        aiAgent = _aiAgent;
        dex = ClusterDEX(_dex);
        pricing = ClusterPricing(_pricing);
    }

    function createBasketFromAI(
        string memory basketId,
        address[] memory tokens,
        uint256[] memory weights,
        bytes memory /aiSignature/
    ) external onlyAI {
        require(baskets[basketId].createdAt == 0, "Basket exists");
        require(tokens.length == weights.length, "Length mismatch");

        uint256 total;
        for (uint256 i = 0; i < weights.length; i++) total += weights[i];
        require(total == 100, "Weights must sum to 100");

        baskets[basketId] = Basket({
            basketId: basketId,
            tokens: tokens,
            weights: weights,
            creator: msg.sender,
            isActive: true,
            totalInvested: 0,
            createdAt: block.timestamp
        });

        activeBaskets.push(basketId);
        emit BasketCreated(basketId, tokens, weights);
    }

    function investInBasket(string memory basketId, uint256 amount) external payable nonReentrant {
        Basket storage b = baskets[basketId];
        require(b.isActive, "Inactive basket");

        // In production: integrate with ClusterDEX to perform swaps
        b.totalInvested += amount;
        UserHolding storage uh = userHoldings[msg.sender][basketId];
        uh.amount += amount;
        uh.investedAt = block.timestamp;

        emit UserInvested(msg.sender, basketId, amount);
    }

    function updateBasketWeights(
        string memory basketId,
        uint256[] memory newWeights
    ) external onlyAI {
        Basket storage b = baskets[basketId];
        require(b.isActive, "Inactive basket");
        require(newWeights.length == b.tokens.length, "Length mismatch");

        uint256 total;
        for (uint256 i = 0; i < newWeights.length; i++) total += newWeights[i];
        require(total == 100, "Weights must sum to 100");

        b.weights = newWeights;
        emit BasketUpdated(basketId, newWeights);
    }

    function getBasketInfo(string memory basketId) external view returns (Basket memory) {
        return baskets[basketId];
    }

    function getUserHolding(address user, string memory basketId)
        external
        view
        returns (UserHolding memory)
    {
        return userHoldings[user][basketId];
    }

    function getActiveBaskets() external view returns (string[] memory) {
        return activeBaskets;
    }

    function calculateUserShare(address user, string memory basketId) external view returns (uint256) {
        Basket storage b = baskets[basketId];
        require(b.totalInvested > 0, "No investment yet");
        return (userHoldings[user][basketId].amount * 1e18) / b.totalInvested;
    }
}