// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IPyth {
    struct Price {
        int64 price;
        uint64 conf;
        int32 expo;
        uint256 publishTime;
    }

    function getPrice(bytes32 id) external view returns (Price memory);
    function updatePriceFeeds(bytes[] calldata priceUpdateData) external payable;
}

contract ClusterPricing is Ownable {
    mapping(address => bytes32) public tokenToPriceId;
    mapping(bytes32 => uint256) public lastPriceUpdate;
    mapping(string => uint256) public basketLastValuation;

    uint256 public maxAge = 300; // 5 minutes

    event PriceUpdated(bytes32 indexed priceId, int64 price, uint256 timestamp);
    event BasketValuationUpdated(string indexed basketId, uint256 totalValue);

    IPyth public pyth;

    // ✅ Pass msg.sender to Ownable
    constructor(address _pyth) Ownable(msg.sender) {
        pyth = IPyth(_pyth);
    }

    function setTokenPriceId(address token, bytes32 priceId) external onlyOwner {
        tokenToPriceId[token] = priceId;
    }

    function getPythPrice(bytes32 priceId) public view returns (int64 price, uint256 publishTime) {
        IPyth.Price memory p = pyth.getPrice(priceId);
        return (p.price, p.publishTime);
    }

    function isPriceStale(bytes32 priceId, uint256 maxAllowedAge) public view returns (bool) {
        (, uint256 publishTime) = getPythPrice(priceId);
        return block.timestamp - publishTime > maxAllowedAge;
    }

    function updateAllPrices(bytes[] calldata priceData) external payable {
        pyth.updatePriceFeeds(priceData);
        // Normally loop to store lastPriceUpdate per feed
    }

    function getTokenPrice(address token) external view returns (int64 price) {
        bytes32 pid = tokenToPriceId[token];
        (price, ) = getPythPrice(pid);
    }

    function calculateBasketTotalValue(string memory basketId) external view returns (uint256) {
        // Integrate with basket contract in production
        return basketLastValuation[basketId];
    }
}
