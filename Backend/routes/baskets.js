const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const BasketService = require('../services/BasketService');
const ClusterPurchaseService = require('../services/ClusterPurchaseService');
const ContractService = require('../services/ContractService');
const PricingService = require('../services/PricingService');

const Basket = require('../database/models/Basket');
const User = require('../database/models/User');

let basketService;
let clusterPurchaseService;
let contractService;
let pricingService;

const initializeBasketServices = () => {
  basketService = new BasketService(Basket, User);
  clusterPurchaseService = new ClusterPurchaseService();
  contractService = new ContractService();
  pricingService = new PricingService();
};

initializeBasketServices();

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name, description, tokens, weights, riskLevel, category } = req.body;

    if (!name || !tokens || !weights) {
      return res.status(400).json({
        success: false,
        message: 'Name, tokens, and weights are required'
      });
    }

    const basketData = {
      name,
      description,
      tokens,
      weights,
      riskLevel,
      category
    };

    const result = await basketService.createBasket(req.user.userId, basketData);

    const statusCode = result.success ? 201 : 400;
    res.status(statusCode).json(result);

  } catch (error) {
    res.status(500).json(basketService.formatError(error, 500));
  }
});

router.post('/ai-create', async (req, res) => {
  try {
    const { basketName, tokens, description, riskLevel, category, metadata } = req.body;

    if (!basketName || !tokens) {
      return res.status(400).json({
        success: false,
        message: 'Basket name and tokens are required'
      });
    }

    const aiRecommendation = {
      basketName,
      tokens,
      description,
      riskLevel,
      category
    };

    const result = await basketService.createAIBasket(aiRecommendation, metadata);

    const statusCode = result.success ? 201 : 400;
    res.status(statusCode).json(result);

  } catch (error) {
    res.status(500).json(basketService.formatError(error, 500));
  }
});

router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const result = await basketService.getUserBaskets(userId);
    res.json(result);

  } catch (error) {
    res.status(500).json(basketService.formatError(error, 500));
  }
});

router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const result = await basketService.getPopularBaskets(limit);
    res.json(result);

  } catch (error) {
    res.status(500).json(basketService.formatError(error, 500));
  }
});

// Get public clusters for dashboard display
router.get('/public/clusters', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const baskets = await Basket.findPublicBaskets(limit);

    res.json({
      success: true,
      data: baskets.map(basket => basket.toPublicJSON()),
      message: 'Public clusters retrieved successfully'
    });

  } catch (error) {
    res.status(500).json(basketService.formatError(error, 500));
  }
});

// Get featured clusters for homepage
router.get('/public/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const baskets = await Basket.findFeaturedBaskets(limit);

    res.json({
      success: true,
      data: baskets.map(basket => basket.toPublicJSON()),
      message: 'Featured clusters retrieved successfully'
    });

  } catch (error) {
    res.status(500).json(basketService.formatError(error, 500));
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    const result = await basketService.getBasketsByCategory(category, limit);
    res.json(result);

  } catch (error) {
    res.status(500).json(basketService.formatError(error, 500));
  }
});

router.get('/:basketId', async (req, res) => {
  try {
    const { basketId } = req.params;
    const userId = req.query.userId;

    const result = await basketService.getBasketById(basketId, userId);

    // Increment view count for public baskets
    if (result.success && result.data.visibility === 'public') {
      const basket = await Basket.findById(basketId);
      if (basket) {
        await basket.incrementViews();
      }
    }

    res.json(result);

  } catch (error) {
    res.status(404).json(basketService.formatError(error, 404));
  }
});

router.put('/:basketId', authenticateToken, async (req, res) => {
  try {
    const { basketId } = req.params;
    const updateData = req.body;

    const result = await basketService.updateBasket(basketId, req.user.userId, updateData);
    res.json(result);

  } catch (error) {
    res.status(400).json(basketService.formatError(error, 400));
  }
});

router.delete('/:basketId', authenticateToken, async (req, res) => {
  try {
    const { basketId } = req.params;

    const result = await basketService.deleteBasket(basketId, req.user.userId);
    res.json(result);

  } catch (error) {
    res.status(400).json(basketService.formatError(error, 400));
  }
});

router.post('/:basketId/invest', authenticateToken, async (req, res) => {
  try {
    const { basketId } = req.params;
    const { amount, transactionHash } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid investment amount is required'
      });
    }

    const result = await basketService.investInBasket(
      basketId,
      req.user.userId,
      amount,
      transactionHash
    );

    // Increment investment count for successful investments
    if (result.success) {
      const basket = await Basket.findById(basketId);
      if (basket) {
        await basket.incrementInvestments();
      }
    }

    res.json(result);

  } catch (error) {
    res.status(400).json(basketService.formatError(error, 400));
  }
});

router.post('/:basketId/purchase', authenticateToken, async (req, res) => {
  try {
    const { basketId } = req.params;
    const { pyusdAmount } = req.body;

    if (!pyusdAmount || pyusdAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid PYUSD amount is required'
      });
    }

    const basketResult = await basketService.getBasketById(basketId);
    if (!basketResult.success) {
      return res.status(404).json(basketResult);
    }

    const basket = basketResult.data;
    const clusterTokens = basket.tokens.map(token => ({
      symbol: token.symbol,
      address: token.address,
      percentage: token.weight
    }));

    const purchaseResult = await clusterPurchaseService.buyClusterTokens(
      req.user.walletAddress,
      pyusdAmount,
      clusterTokens
    );

    res.json(purchaseResult);

  } catch (error) {
    res.status(400).json(clusterPurchaseService.formatError(error, 400));
  }
});

router.get('/:basketId/value', async (req, res) => {
  try {
    const { basketId } = req.params;

    const basketResult = await basketService.getBasketById(basketId);
    if (!basketResult.success) {
      return res.status(404).json(basketResult);
    }

    const basket = basketResult.data;
    const tokens = basket.tokens.map(token => token.address);
    const amounts = basket.tokens.map(token => token.weight);

    const valueResult = await pricingService.calculateBasketValue(tokens, amounts);
    res.json(valueResult);

  } catch (error) {
    res.status(500).json(pricingService.formatError(error, 500));
  }
});

router.get('/:basketId/performance', async (req, res) => {
  try {
    const { basketId } = req.params;
    const timeframe = req.query.timeframe || '24h';

    const basketResult = await basketService.getBasketById(basketId);
    if (!basketResult.success) {
      return res.status(404).json(basketResult);
    }

    const basket = basketResult.data;
    const performancePromises = basket.tokens.map(token =>
      pricingService.getPricePerformance(token.symbol, timeframe)
    );

    const performanceResults = await Promise.allSettled(performancePromises);
    const tokenPerformances = performanceResults.map((result, index) => ({
      token: basket.tokens[index],
      performance: result.status === 'fulfilled' ? result.value.data : null,
      error: result.status === 'rejected' ? result.reason : null
    }));

    const totalChange = tokenPerformances.reduce((sum, tp) => {
      if (tp.performance) {
        return sum + (tp.performance.changePercent * tp.token.weight / 100);
      }
      return sum;
    }, 0);

    res.json({
      success: true,
      data: {
        basketId,
        timeframe,
        totalChangePercent: totalChange,
        tokenPerformances,
        timestamp: new Date().toISOString()
      },
      message: 'Basket performance retrieved successfully'
    });

  } catch (error) {
    res.status(500).json(basketService.formatError(error, 500));
  }
});

router.get('/stats/overview', async (req, res) => {
  try {
    const result = await basketService.getBasketStats();
    res.json(result);

  } catch (error) {
    res.status(500).json(basketService.formatError(error, 500));
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { tokens } = req.body;

    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({
        success: false,
        message: 'Tokens array is required'
      });
    }

    const clusterTokens = tokens.map(token => ({
      symbol: token.symbol,
      address: token.address,
      percentage: token.weight || token.percentage
    }));

    const result = await clusterPurchaseService.validateClusterTokens(clusterTokens);
    res.json(result);

  } catch (error) {
    res.status(400).json(clusterPurchaseService.formatError(error, 400));
  }
});

// Contract integration disabled - using API-only mode
// router.get('/:basketId/contract-info', async (req, res) => {
//   try {
//     const { basketId } = req.params;

//     const basketResult = await basketService.getBasketById(basketId);
//     if (!basketResult.success) {
//       return res.status(404).json(basketResult);
//     }

//     const contractResult = await contractService.getBasketInfo(basketId);
//     res.json(contractResult);

//   } catch (error) {
//     res.status(500).json(contractService.formatError(error, 500));
//   }
// });

module.exports = router;