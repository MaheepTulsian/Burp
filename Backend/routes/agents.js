const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const AgentService = require('../services/AgentService');
const BasketService = require('../services/BasketService');

const User = require('../database/models/User');
const Basket = require('../database/models/Basket');

const agentService = new AgentService();
const basketService = new BasketService(Basket, User);

router.get('/status', async (req, res) => {
  try {
    const result = await agentService.getAgentStatus();
    res.json(result);

  } catch (error) {
    res.status(500).json(agentService.formatError(error, 500));
  }
});

router.post('/analyze-preferences', authenticateToken, async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: 'User input is required'
      });
    }

    const result = await agentService.analyzeUserPreferences(userInput);
    res.json(result);

  } catch (error) {
    res.status(500).json(agentService.formatError(error, 500));
  }
});

router.post('/generate-portfolio', authenticateToken, async (req, res) => {
  try {
    const { userProfile } = req.body;

    if (!userProfile || !userProfile.collected_info) {
      return res.status(400).json({
        success: false,
        message: 'User profile with collected_info is required'
      });
    }

    const portfolioResult = await agentService.generatePortfolio(userProfile);

    if (portfolioResult.success) {
      const basketData = {
        name: `AI Portfolio - ${userProfile.collected_info.investment_theme}`,
        description: portfolioResult.data.portfolio_summary,
        tokens: portfolioResult.data.selected_tokens.map(token => ({
          symbol: token.symbol,
          address: '0x' + token.symbol.toLowerCase().padEnd(40, '0'),
          weight: token.allocation,
          name: token.name || token.symbol,
          rationale: token.rationale
        })),
        riskLevel: ['conservative', 'moderate', 'aggressive'][Math.floor(userProfile.collected_info.risk_tolerance / 3.5)],
        category: 'ai-generated',
        aiMetadata: {
          model: 'InvestAI-v1',
          confidence: 0.85,
          marketConditions: 'neutral',
          generatedAt: new Date()
        }
      };

      const basketResult = await basketService.createAIBasket({
        basketName: basketData.name,
        tokens: basketData.tokens,
        description: basketData.description,
        riskLevel: basketData.riskLevel,
        category: basketData.category
      }, basketData.aiMetadata);

      portfolioResult.data.basket_id = basketResult.success ? basketResult.data.basketId : null;
    }

    res.json(portfolioResult);

  } catch (error) {
    res.status(500).json(agentService.formatError(error, 500));
  }
});

router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Chat message is required'
      });
    }

    const result = await agentService.processUserChat(message, conversationHistory || []);
    res.json(result);

  } catch (error) {
    res.status(500).json(agentService.formatError(error, 500));
  }
});

router.post('/quick-portfolio', authenticateToken, async (req, res) => {
  try {
    const { theme, riskLevel, timeHorizon, amount } = req.body;

    if (!theme) {
      return res.status(400).json({
        success: false,
        message: 'Investment theme is required'
      });
    }

    const userInput = {
      theme,
      riskLevel: riskLevel || 5,
      timeHorizon: timeHorizon || 'medium_term',
      amount: amount || 1000
    };

    const preferencesResult = await agentService.analyzeUserPreferences(userInput);

    if (!preferencesResult.success) {
      return res.status(400).json(preferencesResult);
    }

    const portfolioResult = await agentService.generatePortfolio(preferencesResult.data);

    if (portfolioResult.success) {
      const basketData = {
        name: `Quick AI Portfolio - ${theme}`,
        description: `AI-generated portfolio for ${theme} with ${riskLevel}/10 risk level`,
        tokens: portfolioResult.data.selected_tokens.map(token => ({
          symbol: token.symbol,
          address: '0x' + token.symbol.toLowerCase().padEnd(40, '0'),
          weight: token.allocation,
          name: token.name || token.symbol,
          rationale: token.rationale
        })),
        riskLevel: ['conservative', 'moderate', 'aggressive'][Math.floor(riskLevel / 3.5)],
        category: 'ai-generated'
      };

      const basketResult = await basketService.createAIBasket({
        basketName: basketData.name,
        tokens: basketData.tokens,
        description: basketData.description,
        riskLevel: basketData.riskLevel,
        category: basketData.category
      });

      portfolioResult.data.basket_id = basketResult.success ? basketResult.data.basketId : null;
    }

    res.json({
      success: true,
      data: {
        user_preferences: preferencesResult.data,
        portfolio: portfolioResult.success ? portfolioResult.data : null,
        quick_summary: `Generated ${portfolioResult.data?.selected_tokens?.length || 0}-token portfolio for ${theme}`
      },
      message: 'Quick portfolio generated successfully'
    });

  } catch (error) {
    res.status(500).json(agentService.formatError(error, 500));
  }
});

router.get('/tokens/whitelist', async (req, res) => {
  try {
    const tokensData = await agentService.getTokensWhitelist();

    const categories = [...new Set(tokensData.map(token => token.category))];
    const topTokens = tokensData.slice(0, 20);

    res.json({
      success: true,
      data: {
        total_tokens: tokensData.length,
        categories: categories,
        top_tokens: topTokens.map(token => ({
          symbol: token.coin,
          category: token.category,
          tags: token.tags,
          volatility: token.volatility,
          market_cap: token.market_cap
        })),
        sample_analysis: topTokens[0]?.analysis || null
      },
      message: 'Token whitelist retrieved successfully'
    });

  } catch (error) {
    res.status(500).json(agentService.formatError(error, 500));
  }
});

router.get('/recommendations/trending', async (req, res) => {
  try {
    const trendingThemes = [
      { theme: 'AI & Technology', description: 'Artificial intelligence and tech infrastructure tokens', risk: 6 },
      { theme: 'DeFi Blue Chips', description: 'Established decentralized finance protocols', risk: 5 },
      { theme: 'Layer 1 Dominance', description: 'Leading blockchain platforms and ecosystems', risk: 4 },
      { theme: 'Gaming & Metaverse', description: 'Virtual worlds and blockchain gaming tokens', risk: 7 },
      { theme: 'Stable & Yield', description: 'Stablecoins and yield-generating assets', risk: 2 }
    ];

    const recommendations = [];

    for (const theme of trendingThemes) {
      const portfolioResult = await agentService.generatePortfolio({
        collected_info: {
          investment_theme: theme.theme,
          risk_tolerance: theme.risk,
          time_horizon: 'medium_term',
          preferred_sectors: [theme.theme.split(' ')[0]],
          specific_preferences: []
        }
      });

      if (portfolioResult.success) {
        recommendations.push({
          theme: theme.theme,
          description: theme.description,
          risk_level: theme.risk,
          tokens: portfolioResult.data.selected_tokens.slice(0, 5),
          estimated_return: `${15 + theme.risk * 5}% annually`
        });
      }
    }

    res.json({
      success: true,
      data: {
        trending_themes: recommendations,
        generated_at: new Date().toISOString(),
        market_conditions: 'Bullish sentiment with moderate volatility'
      },
      message: 'Trending portfolio recommendations retrieved'
    });

  } catch (error) {
    res.status(500).json(agentService.formatError(error, 500));
  }
});

module.exports = router;