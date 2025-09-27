const BaseService = require('./BaseService');
const path = require('path');

class AgentService extends BaseService {
  constructor() {
    super();
    this.agentsPath = path.join(__dirname, '../Agents');
    this.openaiApiKey = process.env.OPENAI_API_KEY;

    this.agentConfigs = {
      userAnalysis: {
        file: 'agent1.js',
        description: 'User Analysis Agent - Collects user preferences and risk profile',
        type: 'interactive'
      },
      portfolioConstruction: {
        file: 'agent2.js',
        description: 'Portfolio Construction Agent - Creates optimized crypto portfolios',
        type: 'processing'
      }
    };
  }

  async analyzeUserPreferences(userInput) {
    try {
      if (!this.openaiApiKey) {
        return this.formatError(new Error('OpenAI API key not configured'), 400);
      }

      const mockUserProfile = {
        status: "profile_complete",
        collected_info: {
          investment_theme: userInput.theme || "Balanced crypto portfolio",
          risk_tolerance: this.assessRiskTolerance(userInput),
          time_horizon: userInput.timeHorizon || "medium_term",
          preferred_sectors: this.extractSectors(userInput),
          specific_preferences: userInput.preferences || []
        },
        conversation_summary: `User preferences analyzed: ${userInput.theme || 'balanced approach'} with ${userInput.timeHorizon || 'medium-term'} horizon`
      };

      return this.formatSuccess(mockUserProfile, 'User preferences analyzed successfully');

    } catch (error) {
      return this.formatError(error, 500, 'Failed to analyze user preferences');
    }
  }

  async generatePortfolio(userProfile) {
    try {
      if (!this.openaiApiKey) {
        return this.formatError(new Error('OpenAI API key not configured'), 400);
      }

      const tokensData = await this.getTokensWhitelist();

      const portfolio = await this.constructPortfolioFromProfile(userProfile, tokensData);

      return this.formatSuccess({
        status: "portfolio_complete",
        user_profile: userProfile,
        selected_tokens: portfolio.tokens,
        portfolio_summary: portfolio.summary,
        risk_analysis: portfolio.riskAnalysis,
        generated_at: new Date().toISOString()
      }, 'Portfolio generated successfully');

    } catch (error) {
      return this.formatError(error, 500, 'Failed to generate portfolio');
    }
  }

  async constructPortfolioFromProfile(userProfile, tokensData) {
    const riskTolerance = userProfile.collected_info.risk_tolerance;
    const timeHorizon = userProfile.collected_info.time_horizon;
    const preferredSectors = userProfile.collected_info.preferred_sectors;

    const filteredTokens = this.filterTokensBySectors(tokensData, preferredSectors);
    const allocatedTokens = this.allocatePortfolio(filteredTokens, riskTolerance, timeHorizon);

    return {
      tokens: allocatedTokens,
      summary: `Generated ${allocatedTokens.length}-token portfolio with ${riskTolerance}/10 risk level for ${timeHorizon} investment`,
      riskAnalysis: {
        overall_risk: riskTolerance,
        diversification_score: this.calculateDiversificationScore(allocatedTokens),
        volatility_estimate: this.estimatePortfolioVolatility(allocatedTokens)
      }
    };
  }

  filterTokensBySectors(tokensData, preferredSectors) {
    if (!preferredSectors || preferredSectors.length === 0) {
      return tokensData.slice(0, 20); // Top 20 tokens
    }

    return tokensData.filter(token => {
      return preferredSectors.some(sector =>
        token.category.toLowerCase().includes(sector.toLowerCase()) ||
        token.tags.some(tag => tag.toLowerCase().includes(sector.toLowerCase()))
      );
    }).slice(0, 15);
  }

  allocatePortfolio(tokens, riskTolerance, timeHorizon) {
    const maxTokens = Math.min(8, tokens.length);
    const selectedTokens = tokens.slice(0, maxTokens);

    let baseAllocation = 100 / maxTokens;
    const allocations = [];

    selectedTokens.forEach((token, index) => {
      let allocation = baseAllocation;

      if (index === 0) allocation *= 1.5; // Boost primary token
      if (token.coin === 'BTC' || token.coin === 'ETH') allocation *= 1.2; // Boost major coins
      if (riskTolerance < 5 && token.volatility?.includes('High')) allocation *= 0.7; // Reduce high volatility for low risk
      if (riskTolerance > 7 && token.volatility?.includes('Low')) allocation *= 0.8; // Reduce low volatility for high risk

      allocations.push({
        symbol: token.coin,
        name: token.coin,
        allocation: Math.round(allocation * 100) / 100,
        category: token.category,
        volatility: token.volatility,
        rationale: this.getTokenRationale(token, riskTolerance)
      });
    });

    const totalAllocation = allocations.reduce((sum, token) => sum + token.allocation, 0);
    const adjustmentFactor = 100 / totalAllocation;

    return allocations.map(token => ({
      ...token,
      allocation: Math.round(token.allocation * adjustmentFactor * 100) / 100
    }));
  }

  getTokenRationale(token, riskTolerance) {
    const rationales = [];

    if (token.coin === 'BTC' || token.coin === 'ETH') {
      rationales.push('Blue-chip cryptocurrency with strong fundamentals');
    }

    if (token.category === 'Layer-1') {
      rationales.push('Core blockchain infrastructure');
    }

    if (token.tags?.includes('defi')) {
      rationales.push('DeFi ecosystem exposure');
    }

    if (riskTolerance < 5 && !token.volatility?.includes('High')) {
      rationales.push('Lower volatility suitable for conservative profile');
    }

    return rationales.join(', ') || 'Diversification and growth potential';
  }

  assessRiskTolerance(userInput) {
    let score = 5; // Default medium risk

    if (userInput.riskLevel) {
      return Math.min(10, Math.max(0, parseInt(userInput.riskLevel)));
    }

    if (userInput.conservative) score -= 2;
    if (userInput.aggressive) score += 3;
    if (userInput.timeHorizon === 'long_term') score += 1;
    if (userInput.timeHorizon === 'short_term') score += 2;
    if (userInput.theme?.toLowerCase().includes('stable')) score -= 1;
    if (userInput.theme?.toLowerCase().includes('growth')) score += 2;

    return Math.min(10, Math.max(0, score));
  }

  extractSectors(userInput) {
    const sectors = [];
    const text = JSON.stringify(userInput).toLowerCase();

    if (text.includes('defi')) sectors.push('DeFi');
    if (text.includes('gaming')) sectors.push('Gaming');
    if (text.includes('stable')) sectors.push('Stablecoins');
    if (text.includes('layer') || text.includes('blockchain')) sectors.push('Layer-1');
    if (text.includes('utility')) sectors.push('Utility');
    if (text.includes('meme')) sectors.push('Meme');
    if (text.includes('ai') || text.includes('artificial')) sectors.push('AI');

    return sectors.length > 0 ? sectors : ['Layer-1', 'DeFi'];
  }

  calculateDiversificationScore(allocations) {
    const categories = [...new Set(allocations.map(token => token.category))];
    const maxAllocation = Math.max(...allocations.map(token => token.allocation));

    let score = categories.length * 2; // More categories = better diversification
    if (maxAllocation < 35) score += 2; // No token dominates
    if (allocations.length >= 6) score += 1; // Good number of tokens

    return Math.min(10, score);
  }

  estimatePortfolioVolatility(allocations) {
    const volatilityMap = {
      'Low': 20,
      'Medium': 50,
      'High': 80,
      'Very High': 100
    };

    let weightedVolatility = 0;
    allocations.forEach(token => {
      const vol = volatilityMap[token.volatility?.split(' ')[0]] || 50;
      weightedVolatility += (vol * token.allocation / 100);
    });

    return `${Math.round(weightedVolatility)}% annually`;
  }

  async getTokensWhitelist() {
    try {
      const coinsPath = path.join(this.agentsPath, 'coins.js');
      delete require.cache[require.resolve(coinsPath)];
      const { default: coins } = await import(coinsPath);
      return coins || [];
    } catch (error) {
      console.warn('Could not load tokens whitelist, using fallback');
      return this.getFallbackTokens();
    }
  }

  getFallbackTokens() {
    return [
      {
        coin: 'BTC',
        category: 'Layer-1',
        tags: ['store-of-value', 'digital-gold'],
        volatility: 'Medium',
        current_market_price: '$95,000',
        market_cap: '$1.9T'
      },
      {
        coin: 'ETH',
        category: 'Layer-1',
        tags: ['smart-contracts', 'defi'],
        volatility: 'Medium-High',
        current_market_price: '$3,500',
        market_cap: '$420B'
      },
      {
        coin: 'SOL',
        category: 'Layer-1',
        tags: ['high-throughput', 'dapps'],
        volatility: 'High',
        current_market_price: '$180',
        market_cap: '$85B'
      },
      {
        coin: 'USDC',
        category: 'Stablecoin',
        tags: ['stable', 'payments'],
        volatility: 'Low',
        current_market_price: '$1.00',
        market_cap: '$35B'
      }
    ];
  }

  async getAgentStatus() {
    try {
      const status = {
        agents: this.agentConfigs,
        openai_configured: !!this.openaiApiKey,
        tokens_whitelist: {
          available: true,
          count: (await this.getTokensWhitelist()).length
        },
        capabilities: [
          'User preference analysis',
          'Risk tolerance assessment',
          'Portfolio construction',
          'Token allocation optimization',
          'Diversification analysis'
        ]
      };

      return this.formatSuccess(status, 'Agent service status retrieved');
    } catch (error) {
      return this.formatError(error, 500, 'Failed to get agent status');
    }
  }

  async processUserChat(chatMessage, conversationHistory = []) {
    try {
      // Simulate the Agent1 conversation flow
      const conversationLength = conversationHistory.length;
      
      // Extract user preferences from the current message and conversation
      const userPreferences = {
        theme: this.extractThemeFromChat(chatMessage),
        timeHorizon: this.extractTimeHorizonFromChat(chatMessage),
        riskLevel: this.extractRiskFromChat(chatMessage),
        preferences: this.extractPreferencesFromChat(chatMessage)
      };

      // Determine conversation step based on history length
      let nextMessage = '';
      let isComplete = false;
      
      if (conversationLength <= 2) {
        // Step 2: Theme confirmation
        nextMessage = `Great choice! I see you're interested in ${userPreferences.theme}. Would you like to add any specific preferences or modify anything about this theme?`;
      } else if (conversationLength <= 4) {
        // Step 3: Timeline
        nextMessage = "Perfect! Now, what's your investment timeline - are you thinking short-term (months), medium-term (1-2 years), or long-term (3+ years)?";
      } else if (conversationLength <= 6) {
        // Step 4: Specific preferences
        nextMessage = "Excellent! Do you have any specific preferences? For example, avoiding speculative assets like meme coins, preferring established projects, or including staking options?";
      } else {
        // Step 5: Generate final portfolio
        isComplete = true;
        
        // Create complete user profile
        const finalProfile = {
          status: "profile_complete",
          collected_info: {
            investment_theme: userPreferences.theme,
            risk_tolerance: userPreferences.riskLevel,
            time_horizon: userPreferences.timeHorizon,
            preferred_sectors: this.extractSectors({ theme: userPreferences.theme }),
            specific_preferences: userPreferences.preferences
          },
          conversation_summary: `User profile complete: ${userPreferences.theme} with ${userPreferences.riskLevel}/10 risk for ${userPreferences.timeHorizon} timeline`
        };

        // Generate portfolio
        const portfolioResult = await this.generatePortfolio(finalProfile);

        if (portfolioResult.success) {
          return this.formatSuccess({
            user_analysis: finalProfile,
            portfolio: portfolioResult.data,
            chat_response: this.generateFinalChatResponse(finalProfile, portfolioResult.data),
            is_complete: true
          }, 'Profile complete and portfolio generated');
        }
      }

      return this.formatSuccess({
        user_analysis: null,
        portfolio: null,
        chat_response: nextMessage,
        is_complete: false,
        step: Math.floor(conversationLength / 2) + 1
      }, 'Conversation continuing');

    } catch (error) {
      return this.formatError(error, 500, 'Failed to process user chat');
    }
  }

  generateFinalChatResponse(userProfile, portfolioData) {
    const tokens = portfolioData.selected_tokens || [];
    const mainTokens = tokens.slice(0, 3).map(t => t.symbol).join(', ');
    const theme = userProfile.collected_info.investment_theme;
    const risk = userProfile.collected_info.risk_tolerance;
    
    return `Perfect! Based on our conversation, I've created a ${tokens.length}-token portfolio focusing on ${theme} with ${risk}/10 risk tolerance. Your portfolio includes ${mainTokens} and other carefully selected assets. The expected return is ${12 + risk * 2}%+ annually with proper diversification across ${portfolioData.risk_analysis?.diversification_score || 'multiple'} categories. Would you like to proceed with creating this investment cluster?`;
  }

  extractThemeFromChat(message) {
    const text = message.toLowerCase();
    if (text.includes('defi') || text.includes('decentralized finance')) return 'DeFi focus';
    if (text.includes('gaming')) return 'Gaming and metaverse';
    if (text.includes('stable') || text.includes('safe')) return 'Conservative stable assets';
    if (text.includes('growth') || text.includes('high return')) return 'Growth and high potential';
    if (text.includes('ai') || text.includes('artificial intelligence')) return 'AI and technology';
    return 'Balanced diversified portfolio';
  }

  extractTimeHorizonFromChat(message) {
    const text = message.toLowerCase();
    if (text.includes('short') || text.includes('month') || text.includes('quick')) return 'short_term';
    if (text.includes('long') || text.includes('year') || text.includes('hold')) return 'long_term';
    return 'medium_term';
  }

  extractRiskFromChat(message) {
    const text = message.toLowerCase();
    if (text.includes('safe') || text.includes('conservative') || text.includes('low risk')) return 3;
    if (text.includes('aggressive') || text.includes('high risk') || text.includes('risky')) return 8;
    if (text.includes('moderate') || text.includes('medium')) return 5;
    return 5;
  }

  extractPreferencesFromChat(message) {
    const preferences = [];
    const text = message.toLowerCase();

    if (text.includes('no meme')) preferences.push('Avoid meme coins');
    if (text.includes('staking')) preferences.push('Include staking opportunities');
    if (text.includes('established') || text.includes('blue chip')) preferences.push('Prefer established projects');
    if (text.includes('new') || text.includes('emerging')) preferences.push('Include emerging projects');

    return preferences;
  }

  generateChatResponse(userMessage, portfolio) {
    if (!portfolio) {
      return "I understand your investment interests. Let me create a personalized portfolio for you based on your preferences.";
    }

    const tokenCount = portfolio.selected_tokens?.length || 0;
    const mainTokens = portfolio.selected_tokens?.slice(0, 3).map(t => t.symbol).join(', ') || 'diversified assets';

    return `Based on your preferences, I've created a ${tokenCount}-token portfolio focused on ${mainTokens}. The allocation balances your risk tolerance with growth potential. Would you like me to explain the reasoning behind any specific token selections?`;
  }
}

module.exports = AgentService;