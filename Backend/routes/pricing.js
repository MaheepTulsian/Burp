const express = require('express');
const router = express.Router();
const PricingService = require('../services/PricingService');

const pricingService = new PricingService();

router.get('/token/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Token symbol is required'
      });
    }

    const result = await pricingService.getPythPrice(symbol);
    res.json(result);

  } catch (error) {
    res.status(400).json(pricingService.formatError(error, 400));
  }
});

router.post('/tokens/batch', async (req, res) => {
  try {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Symbols array is required'
      });
    }

    if (symbols.length > 20) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 20 symbols allowed per request'
      });
    }

    const result = await pricingService.getMultiplePrices(symbols);
    res.json(result);

  } catch (error) {
    res.status(400).json(pricingService.formatError(error, 400));
  }
});

router.post('/basket/value', async (req, res) => {
  try {
    const { tokens, amounts } = req.body;

    if (!tokens || !amounts || !Array.isArray(tokens) || !Array.isArray(amounts)) {
      return res.status(400).json({
        success: false,
        message: 'Tokens and amounts arrays are required'
      });
    }

    if (tokens.length !== amounts.length) {
      return res.status(400).json({
        success: false,
        message: 'Tokens and amounts arrays must have the same length'
      });
    }

    const result = await pricingService.calculateBasketValue(tokens, amounts);
    res.json(result);

  } catch (error) {
    res.status(400).json(pricingService.formatError(error, 400));
  }
});

router.get('/token/:symbol/history', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { from, to } = req.query;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Token symbol is required'
      });
    }

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'From and to timestamps are required'
      });
    }

    const fromTime = new Date(from).getTime();
    const toTime = new Date(to).getTime();

    if (isNaN(fromTime) || isNaN(toTime)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid timestamp format'
      });
    }

    const result = await pricingService.getHistoricalPrices(symbol, fromTime, toTime);
    res.json(result);

  } catch (error) {
    res.status(400).json(pricingService.formatError(error, 400));
  }
});

router.get('/token/:symbol/performance', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe } = req.query;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Token symbol is required'
      });
    }

    const validTimeframes = ['1h', '24h', '7d', '30d'];
    const selectedTimeframe = timeframe && validTimeframes.includes(timeframe) ? timeframe : '24h';

    const result = await pricingService.getPricePerformance(symbol, selectedTimeframe);
    res.json(result);

  } catch (error) {
    res.status(400).json(pricingService.formatError(error, 400));
  }
});

router.get('/stats', async (req, res) => {
  try {
    const result = await pricingService.getPriceStats();
    res.json(result);

  } catch (error) {
    res.status(500).json(pricingService.formatError(error, 500));
  }
});

router.post('/cache/clear', async (req, res) => {
  try {
    const result = pricingService.clearCache();
    res.json(result);

  } catch (error) {
    res.status(500).json(pricingService.formatError(error, 500));
  }
});

router.get('/supported-tokens', async (req, res) => {
  try {
    const supportedTokens = {
      'ETH': {
        symbol: 'ETH',
        name: 'Ethereum',
        address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        priceId: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace'
      },
      'BTC': {
        symbol: 'BTC',
        name: 'Bitcoin',
        address: '0x1BFD67037B42Cf2047067bd4F2C47D9BfD6',
        priceId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43'
      },
      'MATIC': {
        symbol: 'MATIC',
        name: 'Polygon',
        address: '0x0000000000000000000000000000000000001010',
        priceId: '0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52'
      },
      'USDC': {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        priceId: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a'
      },
      'USDT': {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        priceId: '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b'
      }
    };

    res.json({
      success: true,
      data: {
        tokens: supportedTokens,
        count: Object.keys(supportedTokens).length,
        network: 'Polygon',
        chainId: 137
      },
      message: 'Supported tokens retrieved successfully'
    });

  } catch (error) {
    res.status(500).json(pricingService.formatError(error, 500));
  }
});

module.exports = router;