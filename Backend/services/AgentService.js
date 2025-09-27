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
      console.log('🎯 [AgentService] generatePortfolio called with profile:', userProfile.collected_info);

      if (!this.openaiApiKey) {
        console.warn('⚠️ [AgentService] OpenAI API key not configured, using fallback portfolio');
        return this.generateFallbackPortfolio(userProfile);
      }

      const tokensData = await this.getTokensWhitelist();
      console.log('📊 [AgentService] Token whitelist loaded:', tokensData.length, 'tokens');

      // Use Agent2 for portfolio construction
      const portfolio = await this.callAgent2(userProfile, tokensData);
      console.log('🤖 [AgentService] Agent2 portfolio result:', {
        success: !!portfolio,
        tokenCount: portfolio?.selected_tokens?.length || 0
      });

      if (portfolio) {
        return this.formatSuccess({
          status: "portfolio_complete",
          user_profile: userProfile,
          selected_tokens: portfolio.selected_tokens,
          portfolio_summary: portfolio.portfolio_summary,
          risk_analysis: {
            overall_risk: userProfile.collected_info.risk_tolerance,
            diversification_score: this.calculateDiversificationScore(portfolio.selected_tokens),
            volatility_estimate: this.estimatePortfolioVolatility(portfolio.selected_tokens)
          },
          generated_at: new Date().toISOString()
        }, 'Portfolio generated successfully');
      } else {
        console.warn('⚠️ [AgentService] Agent2 failed, using fallback');
        return this.generateFallbackPortfolio(userProfile);
      }

    } catch (error) {
      console.error('❌ [AgentService] Portfolio generation error:', error.message);
      return this.generateFallbackPortfolio(userProfile);
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

  async processUserChat(chatMessage, conversationHistory = [], userContext = null) {
    try {
      const chatMetrics = this.initializeChatMetrics(chatMessage, conversationHistory);
      console.log('\n🧠 [AgentService] Processing user chat');
      console.log('💬 [AgentService] Input message:', chatMessage?.slice(0, 200) + (chatMessage?.length > 200 ? '...' : ''));
      console.log('📊 [AgentService] Chat metrics:', chatMetrics);

      if (!this.openaiApiKey) {
        console.warn('⚠️ [AgentService] OpenAI API key not configured, using fallback');
        return this.fallbackChatResponse(chatMessage, conversationHistory);
      }

      const startTime = Date.now();

      // Use actual OpenAI to process the chat
      const response = await this.callAgent1(chatMessage, conversationHistory);

      const processingTime = Date.now() - startTime;
      console.log('🤖 [AgentService] Agent1 response received in', processingTime + 'ms');

      // Enhanced analytics
      const responseMetrics = this.analyzeResponse(response, processingTime, chatMetrics);
      console.log('📈 [AgentService] Response analytics:', responseMetrics);

      // Check if the response contains a complete profile JSON
      const profileMatch = this.extractProfileFromResponse(response);

      if (profileMatch) {
        console.log('🎯 [AgentService] Profile complete detected, generating portfolio');
        this.logConversationCompletion(chatMetrics, responseMetrics);

        // Generate portfolio using the complete profile
        const portfolioResult = await this.generatePortfolio(profileMatch);

        if (portfolioResult.success) {
          const finalResponse = this.generateFinalChatResponse(profileMatch, portfolioResult.data);

          return this.formatSuccess({
            user_analysis: profileMatch,
            portfolio: portfolioResult.data,
            chat_response: finalResponse,
            is_complete: true,
            conversation_metrics: {
              ...chatMetrics,
              ...responseMetrics,
              completion_status: 'success',
              total_processing_time: processingTime
            }
          }, 'Profile complete and portfolio generated');
        }
      }

      // Regular conversation response
      return this.formatSuccess({
        user_analysis: null,
        portfolio: null,
        chat_response: response,
        is_complete: false,
        step: Math.floor(conversationHistory.length / 2) + 1,
        conversation_metrics: {
          ...chatMetrics,
          ...responseMetrics,
          completion_status: 'continuing',
          processing_time: processingTime
        }
      }, 'Conversation continuing');

    } catch (error) {
      console.error('❌ [AgentService] processUserChat error:', {
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      });
      return this.formatError(error, 500, 'Failed to process user chat');
    }
  }

  initializeChatMetrics(message, history) {
    return {
      message_length: message?.length || 0,
      conversation_turn: Math.floor(history.length / 2) + 1,
      estimated_step: this.estimateConversationStep(history),
      user_engagement_score: this.calculateEngagementScore(message),
      conversation_quality: this.assessConversationQuality(history),
      timestamp: new Date().toISOString()
    };
  }

  analyzeResponse(response, processingTime, inputMetrics) {
    return {
      response_length: response?.length || 0,
      processing_time_ms: processingTime,
      response_quality: this.assessResponseQuality(response),
      contains_profile_completion: response?.includes('"status": "profile_complete"'),
      estimated_completion_progress: this.estimateCompletionProgress(response, inputMetrics.estimated_step)
    };
  }

  estimateConversationStep(history) {
    const turns = Math.floor(history.length / 2);
    if (turns === 0) return 1; // Introduction
    if (turns <= 2) return 2; // Theme confirmation
    if (turns <= 3) return 3; // Timeline
    if (turns <= 4) return 4; // Preferences
    return 5; // Summary
  }

  calculateEngagementScore(message) {
    if (!message) return 0;

    let score = 0;
    const length = message.length;

    // Length scoring
    if (length > 100) score += 3;
    else if (length > 50) score += 2;
    else if (length > 20) score += 1;

    // Content quality indicators
    if (message.includes('interested') || message.includes('prefer')) score += 2;
    if (message.includes('defi') || message.includes('bitcoin') || message.includes('ethereum')) score += 1;
    if (message.includes('?')) score += 1; // User asking questions shows engagement

    return Math.min(10, score);
  }

  assessConversationQuality(history) {
    if (history.length === 0) return 'new';
    if (history.length < 4) return 'early';
    if (history.length < 8) return 'developing';
    if (history.length < 12) return 'mature';
    return 'extended';
  }

  assessResponseQuality(response) {
    if (!response) return 'poor';

    const length = response.length;
    const hasStructure = response.includes('"status"') || response.includes('STEP');
    const isInformative = length > 100 && length < 1000;

    if (hasStructure && isInformative) return 'excellent';
    if (isInformative) return 'good';
    if (length > 50) return 'adequate';
    return 'poor';
  }

  estimateCompletionProgress(response, currentStep) {
    if (response?.includes('"status": "profile_complete"')) return 100;

    const stepProgress = {
      1: 20, // Introduction
      2: 40, // Theme confirmation
      3: 60, // Timeline
      4: 80, // Preferences
      5: 95  // Summary
    };

    return stepProgress[currentStep] || 0;
  }

  logConversationCompletion(chatMetrics, responseMetrics) {
    console.log('✅ [AgentService] Conversation completed successfully');
    console.log('📊 [AgentService] Final metrics:', {
      total_turns: chatMetrics.conversation_turn,
      conversation_quality: chatMetrics.conversation_quality,
      user_engagement: chatMetrics.user_engagement_score,
      processing_efficiency: responseMetrics.processing_time_ms < 3000 ? 'fast' : 'slow',
      completion_path: 'standard_flow'
    });
  }

  async callAgent1(userMessage, conversationHistory) {
    const OpenAI = require('openai');
    const client = new OpenAI({ apiKey: this.openaiApiKey });

    const INVESTMENT_AGENT_SYSTEM_PROMPT = `
You are Burp's Investment Strategist - an expert crypto analyst who builds personalized investment profiles through intelligent conversation. Your goal is to understand each user's unique investment DNA and translate it into actionable portfolio parameters.

CORE OBJECTIVE: Extract precise investment preferences through strategic questioning, then output a complete investor profile for AI-driven portfolio construction.

CONVERSATION ARCHITECTURE:

STEP 1: SECTOR INTELLIGENCE BRIEF
Present crypto ecosystem with strategic context:
- Infrastructure Layer: Bitcoin as digital gold, Ethereum as the smart contract foundation
- DeFi Protocols: Uniswap, Aave, Compound driving financial innovation
- Scaling Solutions: Polygon, Arbitrum, Optimism solving throughput challenges
- Next-Generation Platforms: Solana, Avalanche competing for developer mindshare
- Emerging Verticals: AI computation, gaming economies, real-world asset tokenization

Ask with purpose: "Which of these crypto sectors aligns with your investment thesis?"

STEP 2: STRATEGIC VALIDATION
Reflect their choice with market intelligence. If they chose DeFi: "DeFi has shown resilience through multiple cycles and continues expanding total value locked. Are you drawn to the established protocols or interested in emerging DeFi innovations?"
Confirm investment narrative and refine focus areas.

STEP 3: INVESTMENT HORIZON ANALYSIS
Frame timeframes with market cycle context:
- Tactical (6-18 months): Positioning for next market cycle, capturing momentum
- Strategic (2-4 years): Protocol adoption cycles, ecosystem maturation
- Generational (5+ years): Fundamental technology adoption, societal integration

Ask directly: "What investment timeframe matches your capital allocation strategy?"

STEP 4: PORTFOLIO PHILOSOPHY DEEP DIVE
Probe investment approach with contextual questions:
"Do you prefer concentrated positions in high-conviction assets, or diversified exposure across multiple opportunities? Are you interested in yield-generating assets through staking or liquidity provision? How do you view volatility - as risk to minimize or opportunity to capture?"

STEP 5: STRATEGIC PROFILE SYNTHESIS
Present comprehensive analysis with calculated risk assessment:
"Based on our discussion, I see you as a [X]/10 risk profile investor focused on [THEME] with [TIMEFRAME] horizon. Your approach suggests [SPECIFIC INSIGHTS]. This profiles translates to [PORTFOLIO APPROACH]. Does this capture your investment strategy accurately?"

ADVANCED RISK CALIBRATION (0-10):
Calculate sophisticated risk score using:
- Language Analysis: Conservative terminology (preserve, stable, safe) versus growth language (opportunity, upside, aggressive)
- Asset Class Preferences: Stablecoins/BTC (risk-reducer), ETH/major alts (balanced), emerging tokens (risk-amplifier)
- Temporal Risk Factor: Long horizon (patience = lower risk), short horizon (timing pressure = higher risk)
- Concentration Preference: Diversified approach (risk-managed) versus concentrated bets (risk-seeking)
- Market Sophistication: Basic concepts (conservative) versus advanced strategies (risk-comfortable)

COMMUNICATION EXCELLENCE:
- Speak with authority but remain accessible
- Provide context that educates while collecting data
- Reference real market dynamics and protocol developments
- Match user's sophistication level without talking down
- Build logical flow between questions
- Validate understanding before progression

INPUT VALIDATION & RECOVERY:
- Vague responses: "Help me understand what specifically interests you about [THEIR_MENTION]"
- Off-topic: "That's valuable context. Let's capture how that influences your crypto investment approach"
- Contradictory: "I want to ensure I understand correctly - you mentioned both [A] and [B]. Which better represents your core investment priority?"

ENHANCED OUTPUT SCHEMA:
{
  "status": "profile_complete",
  "collected_info": {
    "investment_theme": "precise thematic focus with nuance",
    "risk_tolerance": 7,
    "time_horizon": "strategic/tactical/generational",
    "preferred_sectors": ["specific", "protocol", "categories"],
    "specific_preferences": ["detailed", "investment", "criteria"],
    "sophistication_level": "beginner/intermediate/advanced",
    "volatility_tolerance": "low/moderate/high"
  },
  "conversation_summary": "Strategic synthesis of investor profile and key decision drivers",
  "risk_factors_analyzed": ["language_tone", "asset_preference", "time_pressure", "concentration_style"],
  "confidence_assessment": 0.9
}

OPERATIONAL DIRECTIVES:
1. Maintain forward momentum - each response advances toward completion
2. Extract maximum insight from minimal questions
3. Demonstrate crypto market knowledge while staying focused
4. Adapt sophistication level to user's demonstrated knowledge
5. Validate critical assumptions before final synthesis

EXPERT POSITIONING: You combine deep crypto market knowledge with strategic portfolio thinking. Users should feel they're speaking with someone who understands both the technology and the investment landscape.

CONVERSATION INITIATION: Launch directly into Step 1 with an authoritative but welcoming sector overview.
`;

    // Build messages array
    const messages = [{ role: "system", content: INVESTMENT_AGENT_SYSTEM_PROMPT }];

    // Add conversation history
    conversationHistory.forEach(msg => {
      messages.push({ role: msg.role, content: msg.content });
    });

    // Add current user message
    messages.push({ role: "user", content: userMessage });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  }

  extractProfileFromResponse(response) {
    try {
      // Look for JSON block in the response
      const match = response.match(/\{[\s\S]*\}/);
      if (match) {
        const profile = JSON.parse(match[0]);
        if (profile.status === "profile_complete") {
          return profile;
        }
      }
    } catch (e) {
      console.log('🔍 [AgentService] No valid profile JSON found in response');
    }
    return null;
  }

  fallbackChatResponse(userMessage, conversationHistory) {
    // Fallback logic when OpenAI is not available
    const conversationLength = conversationHistory.length;
    const lowerMessage = userMessage.toLowerCase();

    if (conversationLength <= 2) {
      const responseMessage = lowerMessage.includes('defi') || lowerMessage.includes('gaming') || lowerMessage.includes('ai')
        ? `Great choice! I see you're interested in ${lowerMessage.includes('defi') ? 'DeFi' : lowerMessage.includes('gaming') ? 'gaming' : 'AI'} investing. What's your investment timeline - short-term, medium-term, or long-term?`
        : "Great choice! I see you're interested in crypto investing. What's your investment timeline - short-term, medium-term, or long-term?";

      return this.formatSuccess({
        chat_response: responseMessage,
        is_complete: false,
        step: 2
      }, 'Conversation continuing');
    } else if (conversationLength <= 4) {
      return this.formatSuccess({
        chat_response: "Perfect! Do you have any specific preferences? For example, avoiding speculative assets or preferring established projects?",
        is_complete: false,
        step: 3
      }, 'Conversation continuing');
    } else {
      // Generate fallback profile based on user input
      const theme = lowerMessage.includes('defi') ? 'DeFi focus' :
                   lowerMessage.includes('gaming') ? 'Gaming and metaverse' :
                   lowerMessage.includes('ai') ? 'AI and technology' :
                   'Balanced crypto portfolio';

      const fallbackProfile = {
        status: "profile_complete",
        collected_info: {
          investment_theme: theme,
          risk_tolerance: 5,
          time_horizon: "medium_term",
          preferred_sectors: ["Layer-1", "DeFi"],
          specific_preferences: ["Established projects"]
        },
        conversation_summary: `User profile complete with ${theme.toLowerCase()} approach`
      };

      return this.formatSuccess({
        user_analysis: fallbackProfile,
        portfolio: null,
        chat_response: "Perfect! Based on our conversation, I'll create a balanced portfolio for you. Would you like to proceed?",
        is_complete: true
      }, 'Profile complete');
    }
  }

  generateFinalChatResponse(userProfile, portfolioData) {
    const tokens = portfolioData.selected_tokens || [];
    const mainTokens = tokens.slice(0, 3).map(t => t.symbol).join(', ');
    const theme = userProfile.collected_info.investment_theme;
    const risk = userProfile.collected_info.risk_tolerance;
    
    return `Perfect! Based on our conversation, I've created a ${tokens.length}-token portfolio focusing on ${theme} with ${risk}/10 risk tolerance. Your portfolio includes ${mainTokens} and other carefully selected assets. The expected return is ${12 + risk * 2}%+ annually with proper diversification across ${portfolioData.risk_analysis?.diversification_score || 'multiple'} categories. Would you like to proceed with creating this investment cluster?`;
  }

  async getTrendingThemes() {
    // In production, this could fetch from external APIs or database
    return [
      { theme: 'AI & Technology', description: 'Artificial intelligence and tech infrastructure tokens', risk: 6 },
      { theme: 'DeFi Blue Chips', description: 'Established decentralized finance protocols', risk: 5 },
      { theme: 'Layer 1 Dominance', description: 'Leading blockchain platforms and ecosystems', risk: 4 },
      { theme: 'Gaming & Metaverse', description: 'Virtual worlds and blockchain gaming tokens', risk: 7 },
      { theme: 'Stable & Yield', description: 'Stablecoins and yield-generating assets', risk: 2 }
    ];
  }

  async callAgent2(userProfile, tokensData) {
    try {
      console.log('🤖 [AgentService] Calling Agent2 for cluster construction');

      // Import and use the actual Agent2
      const { createCluster } = require('../Agents/agent2.js');

      const clusterResult = await createCluster(userProfile, tokensData);

      if (clusterResult && clusterResult.selected_tokens) {
        console.log('✅ [AgentService] Agent2 cluster created successfully');

        // Return in expected format for AgentService
        return {
          selected_tokens: clusterResult.selected_tokens,
          portfolio_summary: clusterResult.summary || clusterResult.cluster?.description || 'AI-generated cluster',
          cluster: clusterResult.cluster,
          user_profile: clusterResult.user_profile
        };
      }

      console.warn('⚠️ [AgentService] Agent2 returned invalid result');
      return null;

    } catch (error) {
      console.error('❌ [AgentService] Agent2 error:', error.message);
      return null;
    }
  }

  generateFallbackPortfolio(userProfile) {
    console.log('🔄 [AgentService] Generating fallback portfolio');

    const theme = userProfile.collected_info.investment_theme;
    const riskTolerance = userProfile.collected_info.risk_tolerance;

    // Create a basic fallback portfolio based on risk tolerance
    let selectedTokens;
    if (riskTolerance <= 3) {
      // Conservative portfolio
      selectedTokens = [
        { symbol: 'BTC', name: 'Bitcoin', allocation: 40, rationale: 'Digital gold and store of value' },
        { symbol: 'ETH', name: 'Ethereum', allocation: 30, rationale: 'Leading smart contract platform' },
        { symbol: 'USDC', name: 'USD Coin', allocation: 20, rationale: 'Stable value preservation' },
        { symbol: 'USDT', name: 'Tether', allocation: 10, rationale: 'Liquidity and stability' }
      ];
    } else if (riskTolerance <= 7) {
      // Moderate portfolio
      selectedTokens = [
        { symbol: 'BTC', name: 'Bitcoin', allocation: 30, rationale: 'Digital gold and store of value' },
        { symbol: 'ETH', name: 'Ethereum', allocation: 25, rationale: 'Smart contract platform leader' },
        { symbol: 'SOL', name: 'Solana', allocation: 15, rationale: 'High-performance blockchain' },
        { symbol: 'AVAX', name: 'Avalanche', allocation: 15, rationale: 'Scalable DeFi platform' },
        { symbol: 'USDC', name: 'USD Coin', allocation: 15, rationale: 'Stability and liquidity' }
      ];
    } else {
      // Aggressive portfolio
      selectedTokens = [
        { symbol: 'ETH', name: 'Ethereum', allocation: 25, rationale: 'Smart contract innovation' },
        { symbol: 'SOL', name: 'Solana', allocation: 20, rationale: 'High-performance ecosystem' },
        { symbol: 'AVAX', name: 'Avalanche', allocation: 15, rationale: 'Scalable infrastructure' },
        { symbol: 'MATIC', name: 'Polygon', allocation: 15, rationale: 'Ethereum scaling solution' },
        { symbol: 'UNI', name: 'Uniswap', allocation: 12, rationale: 'Leading DEX protocol' },
        { symbol: 'AAVE', name: 'Aave', allocation: 8, rationale: 'DeFi lending leader' },
        { symbol: 'BTC', name: 'Bitcoin', allocation: 5, rationale: 'Portfolio anchor' }
      ];
    }

    return this.formatSuccess({
      status: "portfolio_complete",
      user_profile: userProfile,
      selected_tokens: selectedTokens,
      portfolio_summary: `Fallback ${selectedTokens.length}-token portfolio focusing on ${theme} with ${riskTolerance}/10 risk tolerance`,
      risk_analysis: {
        overall_risk: riskTolerance,
        diversification_score: selectedTokens.length,
        volatility_estimate: `${30 + riskTolerance * 10}% annually`
      },
      generated_at: new Date().toISOString()
    }, 'Fallback portfolio generated successfully');
  }
}

module.exports = AgentService;