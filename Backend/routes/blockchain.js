const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const ContractService = require('../services/ContractService');
const ClusterPurchaseService = require('../services/ClusterPurchaseService');

const contractService = new ContractService();
const clusterPurchaseService = new ClusterPurchaseService();

router.get('/status', async (req, res) => {
  try {
    const result = await contractService.getBlockchainStatus();
    res.json(result);

  } catch (error) {
    res.status(500).json(contractService.formatError(error, 500));
  }
});

// Contract integration disabled - using API-only mode
// router.post('/baskets/create', authenticateToken, async (req, res) => {
//   try {
//     const { basketName, tokens, weights, aiSignature } = req.body;

//     if (!basketName || !tokens || !weights || !aiSignature) {
//       return res.status(400).json({
//         success: false,
//         message: 'Basket name, tokens, weights, and AI signature are required'
//       });
//     }

//     if (tokens.length !== weights.length) {
//       return res.status(400).json({
//         success: false,
//         message: 'Tokens and weights arrays must have the same length'
//       });
//     }

//     const result = await contractService.createBasket(basketName, tokens, weights, aiSignature);
//     res.json(result);

//   } catch (error) {
//     res.status(400).json(contractService.formatError(error, 400));
//   }
// });

// Contract integration disabled - using API-only mode for now
// router.post('/baskets/:basketId/invest', authenticateToken, async (req, res) => {
//   try {
//     const { basketId } = req.params;
//     const { amount } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid investment amount is required'
//       });
//     }

//     const result = await contractService.investInBasket(
//       parseInt(basketId),
//       amount,
//       req.user.walletAddress
//     );

//     res.json(result);

//   } catch (error) {
//     res.status(400).json(contractService.formatError(error, 400));
//   }
// });

// router.get('/baskets/:basketId', async (req, res) => {
//   try {
//     const { basketId } = req.params;

//     const result = await contractService.getBasketInfo(parseInt(basketId));
//     res.json(result);

//   } catch (error) {
//     res.status(404).json(contractService.formatError(error, 404));
//   }
// });

// router.get('/baskets/:basketId/value', async (req, res) => {
//   try {
//     const { basketId } = req.params;

//     const result = await contractService.calculateBasketValue(parseInt(basketId));
//     res.json(result);

//   } catch (error) {
//     res.status(404).json(contractService.formatError(error, 404));
//   }
// });

// router.get('/users/:userAddress/baskets', authenticateToken, async (req, res) => {
//   try {
//     const { userAddress } = req.params;

//     if (req.user.walletAddress.toLowerCase() !== userAddress.toLowerCase()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied'
//       });
//     }

//     const result = await contractService.getUserBaskets(userAddress);
//     res.json(result);

//   } catch (error) {
//     res.status(404).json(contractService.formatError(error, 404));
//   }
// });

// router.post('/swaps/execute', authenticateToken, async (req, res) => {
//   try {
//     const { tokenIn, tokenOut, amountIn, minAmountOut, oneInchData } = req.body;

//     if (!tokenIn || !tokenOut || !amountIn || !minAmountOut || !oneInchData) {
//       return res.status(400).json({
//         success: false,
//         message: 'All swap parameters are required'
//       });
//     }

//     const result = await contractService.executeSwap(
//       tokenIn,
//       tokenOut,
//       amountIn,
//       minAmountOut,
//       oneInchData
//     );

//     res.json(result);

//   } catch (error) {
//     res.status(400).json(contractService.formatError(error, 400));
//   }
// });

// router.get('/tokens/:tokenAddress/price', async (req, res) => {
//   try {
//     const { tokenAddress } = req.params;

//     if (!tokenAddress || !/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid token address is required'
//       });
//     }

//     const result = await contractService.getTokenPrice(tokenAddress);
//     res.json(result);

//   } catch (error) {
//     res.status(404).json(contractService.formatError(error, 404));
//   }
// });

router.post('/1inch/quote', async (req, res) => {
  try {
    const { tokenIn, tokenOut, amount } = req.body;

    if (!tokenIn || !tokenOut || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Token addresses and amount are required'
      });
    }

    const result = await clusterPurchaseService.getQuote(tokenIn, tokenOut, amount);
    res.json(result);

  } catch (error) {
    res.status(400).json(clusterPurchaseService.formatError(error, 400));
  }
});

router.post('/1inch/swap', authenticateToken, async (req, res) => {
  try {
    const { tokenIn, tokenOut, amount, slippage } = req.body;

    if (!tokenIn || !tokenOut || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Token addresses and amount are required'
      });
    }

    const result = await clusterPurchaseService.executeSwap(
      tokenIn,
      tokenOut,
      amount,
      req.user.walletAddress,
      slippage || 1
    );

    res.json(result);

  } catch (error) {
    res.status(400).json(clusterPurchaseService.formatError(error, 400));
  }
});

router.get('/1inch/tokens', async (req, res) => {
  try {
    const result = await clusterPurchaseService.getSupportedTokens();
    res.json(result);

  } catch (error) {
    res.status(500).json(clusterPurchaseService.formatError(error, 500));
  }
});

router.get('/contracts/info', async (req, res) => {
  try {
    const contractAddresses = {
      clusterBasket: process.env.CLUSTER_BASKET_ADDRESS || 'Not deployed',
      clusterDEX: process.env.CLUSTER_DEX_ADDRESS || 'Not deployed',
      clusterPricing: process.env.CLUSTER_PRICING_ADDRESS || 'Not deployed'
    };

    const chainInfo = {
      chainId: process.env.CHAIN_ID || '137',
      network: 'Polygon',
      rpcUrl: process.env.ETHEREUM_RPC_URL || 'Not configured'
    };

    res.json({
      success: true,
      data: {
        contracts: contractAddresses,
        network: chainInfo,
        deploymentStatus: {
          allDeployed: Object.values(contractAddresses).every(addr => addr !== 'Not deployed'),
          deployedCount: Object.values(contractAddresses).filter(addr => addr !== 'Not deployed').length,
          totalContracts: Object.keys(contractAddresses).length
        },
        timestamp: new Date().toISOString()
      },
      message: 'Contract information retrieved successfully'
    });

  } catch (error) {
    res.status(500).json(contractService.formatError(error, 500));
  }
});

module.exports = router;