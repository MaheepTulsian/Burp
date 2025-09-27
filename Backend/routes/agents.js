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
          address: token.address || generateTokenAddress(token.symbol),
          weight: token.allocation,
          name: token.name || token.symbol,
          rationale: token.rationale
        })),
        riskLevel: mapRiskLevel(userProfile.collected_info.risk_tolerance),
        category: 'ai-generated',
        aiMetadata: {
          model: 'Burp-v1',
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
    console.log('\n🤖 [agents/chat] Authenticated chat request received');
    console.log('📝 [agents/chat] User ID:', req.user?.id || 'Unknown');
    console.log('📝 [agents/chat] Request headers:', {
      origin: req.headers.origin,
      'user-agent': req.headers['user-agent']?.slice(0, 50) + '...',
      authorization: req.headers.authorization ? 'Bearer ***' : 'None'
    });

    const { message, conversationHistory } = req.body;
    console.log('💬 [agents/chat] Message length:', message?.length || 0);
    console.log('💬 [agents/chat] Message preview:', message?.slice(0, 100) + (message?.length > 100 ? '...' : ''));
    console.log('📚 [agents/chat] Conversation history length:', conversationHistory?.length || 0);

    if (!message) {
      console.warn('⚠️ [agents/chat] Missing message in request');
      return res.status(400).json({
        success: false,
        message: 'Chat message is required'
      });
    }

    console.log('🔄 [agents/chat] Processing with AgentService...');
    const startTime = Date.now();
    const result = await agentService.processUserChat(message, conversationHistory || []);
    const processingTime = Date.now() - startTime;

    console.log('✅ [agents/chat] AgentService completed in', processingTime + 'ms');
    console.log('📤 [agents/chat] Response success:', result.success);
    console.log('📤 [agents/chat] Response data keys:', Object.keys(result.data || {}));

    if (result.data?.is_complete) {
      console.log('🎯 [agents/chat] Conversation marked as COMPLETE');
    }

    res.json(result);

  } catch (error) {
    console.error('❌ [agents/chat] Error occurred:', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      timestamp: new Date().toISOString()
    });
    res.status(500).json(agentService.formatError(error, 500));
  }
});

// Public chat endpoint (no authentication) - useful for local/dev or when user is not logged in
router.post('/chat/public', async (req, res) => {
  try {
    // Debug: log incoming request metadata to help diagnose frontend issues
    console.log('\n[agents] /chat/public request from', req.ip, 'headers:', {
      origin: req.headers.origin,
      host: req.headers.host,
      referer: req.headers.referer,
      ua: req.headers['user-agent']
    });
    console.log('[agents] request body:', JSON.stringify(req.body).slice(0, 1000));

    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Chat message is required'
      });
    }

    // Pass user context for basket saving
    const userContext = req.user ? {
      walletAddress: req.user.walletAddress,
      id: req.user.id
    } : null;

    const result = await agentService.processUserChat(message, conversationHistory || [], userContext);

    // If portfolio is complete and we have a cluster, save it as a basket
    if (result.success && result.data.is_complete && result.data.portfolio && userContext) {
      try {
        console.log('💾 [agents/chat] Saving cluster as basket...');

        const portfolio = result.data.portfolio;
        const clusterData = portfolio.cluster;

        if (clusterData && portfolio.selected_tokens) {
          const basketData = {
            basketName: clusterData.title || `AI Cluster - ${result.data.user_analysis.collected_info.investment_theme}`,
            tokens: portfolio.selected_tokens.map(token => ({
              symbol: token.symbol,
              address: generateTokenAddress(token.symbol),
              weight: token.allocation,
              name: token.name || token.symbol,
              rationale: token.rationale
            })),
            description: clusterData.description || portfolio.portfolio_summary,
            riskLevel: mapRiskLevel(result.data.user_analysis.collected_info.risk_tolerance),
            category: 'ai-generated',
            createdBy: userContext.walletAddress
          };

          const basketResult = await basketService.createAIBasket(basketData, {
            model: 'Agent2-v1',
            confidence: 0.9,
            marketConditions: 'optimized',
            generatedAt: new Date(),
            userProfile: result.data.user_analysis.collected_info,
            clusterInfo: clusterData
          });

          if (basketResult.success) {
            console.log('✅ [agents/chat] Basket saved successfully:', basketResult.data.basketId);
            result.data.portfolio.basket_id = basketResult.data.basketId;
            result.data.portfolio.basket_saved = true;
          } else {
            console.error('❌ [agents/chat] Basket saving failed:', basketResult.message);
          }
        }
      } catch (basketError) {
        console.error('❌ [agents/chat] Error saving basket:', basketError.message);
      }
    }

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
          address: token.address || generateTokenAddress(token.symbol),
          weight: token.allocation,
          name: token.name || token.symbol,
          rationale: token.rationale
        })),
        riskLevel: mapRiskLevel(riskLevel),
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
    const trendingThemes = await agentService.getTrendingThemes();

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
          estimated_return: calculateEstimatedReturn(theme.risk)
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

// Helper functions
function generateTokenAddress(symbol) {
  // Generate a deterministic address based on symbol for demo purposes
  // In production, this should fetch real contract addresses
  return '0x' + symbol.toLowerCase().padEnd(40, '0');
}

function mapRiskLevel(riskTolerance) {
  if (riskTolerance <= 3) return 'conservative';
  if (riskTolerance <= 7) return 'moderate';
  return 'aggressive';
}

function calculateEstimatedReturn(riskLevel) {
  const baseReturn = 12;
  const riskMultiplier = 3;
  return `${baseReturn + (riskLevel * riskMultiplier)}% annually`;
}

module.exports = router;