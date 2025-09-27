// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface I1inchRouter {
    function swap(bytes calldata data) external payable returns (uint256 returnAmount);
}

interface IPyUSD {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract ClusterDEX is Ownable, ReentrancyGuard {
    struct SwapParams {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 minAmountOut;
        bytes routeData;
    }

    I1inchRouter public router;
    uint256 public maxSlippage = 500; // 5% (in basis points)

    event SwapExecuted(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event BasketPurchaseCompleted(string indexed basketId, address indexed user, uint256 totalSpent);

    constructor(address _router) Ownable(msg.sender) {
        router = I1inchRouter(_router);
    }

    function setSlippageProtection(uint256 newSlippage) external onlyOwner {
        require(newSlippage <= 1000, "Too high");
        maxSlippage = newSlippage;
    }

    function executeSwapVia1inch(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        bytes calldata oneInchData
    ) external nonReentrant returns (uint256) {
        uint256 amountOut = router.swap(oneInchData);
        emit SwapExecuted(tokenIn, tokenOut, amountIn, amountOut);
        return amountOut;
    }

    function batchSwapForBasket(
        string memory basketId,
        SwapParams[] calldata swaps
    ) external nonReentrant {
        uint256 totalSpent;
        for (uint256 i = 0; i < swaps.length; i++) {
            uint256 outAmt = router.swap(swaps[i].routeData);
            emit SwapExecuted(swaps[i].tokenIn, swaps[i].tokenOut, swaps[i].amountIn, outAmt);
            totalSpent += swaps[i].amountIn;
        }
        emit BasketPurchaseCompleted(basketId, msg.sender, totalSpent);
    }
}
