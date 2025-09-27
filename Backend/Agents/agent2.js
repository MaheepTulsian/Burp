const coins = require('./coins.js').default;
const OpenAI = require('openai');
require('dotenv').config();

// ==== System Prompt ====
const PORTFOLIO_AGENT_SYSTEM_PROMPT = `
You are Burp's Cluster Construction Agent. You create crypto investment clusters (portfolios) based on user preferences.

You receive:
1. User's investment profile with theme, risk tolerance, time horizon, and preferences
2. A comprehensive whitelist of crypto tokens with detailed metadata

YOUR TASK:
Create a personalized crypto cluster with the following specifications:

CLUSTER REQUIREMENTS:
- Title: Creative cluster name based on user's theme (e.g., "DeFi Titans", "Stable Growth", "AI Revolution")
- Subtitle: Brief description of the cluster's strategy
- Description: Comprehensive 300-word paragraph explaining the cluster strategy, market outlook, and investment rationale
- Token Selection: 5-8 carefully chosen tokens
- Allocation: Percentage weights that sum to 100%
- Ordering: Tokens listed in descending order by allocation percentage

SELECTION CRITERIA:
1. Theme Alignment: Prioritize tokens matching user's investment theme
2. Risk Management: Adjust volatility based on risk tolerance (0-10 scale)
3. Market Position: Consider market cap and liquidity for stability
4. Diversification: Include multiple sectors/categories
5. User Preferences: Boost specific tokens mentioned by user

ALLOCATION STRATEGY:
- Conservative (Risk 0-3): Focus on stablecoins and blue chips, max 30% per token
- Moderate (Risk 4-7): Balanced mix with established alts, max 35% per token
- Aggressive (Risk 8-10): Growth tokens and emerging projects, max 40% per token

DESCRIPTION GUIDELINES:
Write a compelling 300-word description that includes:
- Market analysis and current trends
- Why this cluster fits the user's profile
- How tokens complement each other
- Expected performance and timeline
- Risk considerations and mitigation
- Growth potential and catalysts

MANDATORY RULES:
- Minimum 5 tokens, maximum 8 tokens
- All allocations must sum to exactly 100%
- Order tokens by allocation percentage (highest first)
- Include rationale for each token selection
- Description must be approximately 300 words

FINAL OUTPUT FORMAT (JSON ONLY):
{
  "status": "cluster_complete",
  "selected_tokens": [
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "allocation": 30,
      "rationale": "Digital gold and portfolio anchor"
    },
    {
      "symbol": "ETH",
      "name": "Ethereum",
      "allocation": 25,
      "rationale": "Smart contract platform leader"
    }
  ],
  "cluster": {
    "title": "Creative cluster name",
    "subtitle": "Strategy description (1 sentence)",
    "description": "Comprehensive 300-word explanation of cluster strategy, market outlook, investment rationale, risk analysis, and growth potential",
    "total_tokens": 6,
    "risk_level": "moderate",
    "expected_return": "15-25%"
  },
  "user_profile": { ...copy of input profile... },
  "summary": "Brief explanation of cluster design and allocation strategy"
}
`;

// ==== Setup OpenAI ====
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


// ==== Cluster Agent Function ====
async function createCluster(userProfile, tokensWhitelist) {
  try {
    console.log('🎯 [Agent2] Creating cluster for theme:', userProfile.collected_info?.investment_theme);

    const messages = [
      { role: "system", content: PORTFOLIO_AGENT_SYSTEM_PROMPT },
      {
        role: "user",
        content: JSON.stringify({
          whitelist_tokens: tokensWhitelist,
          user_preferences: userProfile.collected_info
        }),
      },
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const reply = response.choices[0].message.content;
    console.log('🤖 [Agent2] OpenAI response received, parsing cluster JSON...');

    // Extract JSON from response
    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const clusterResult = JSON.parse(jsonMatch[0]);
      console.log('✅ [Agent2] Cluster parsed successfully:', clusterResult.cluster?.title);

      // Validate and process selected_tokens (most important for reveal)
      if (clusterResult.selected_tokens && Array.isArray(clusterResult.selected_tokens)) {
        // Ensure tokens are ordered by allocation (descending)
        clusterResult.selected_tokens.sort((a, b) => b.allocation - a.allocation);

        // Validate allocations sum to 100
        const totalAllocation = clusterResult.selected_tokens.reduce((sum, token) => sum + token.allocation, 0);
        console.log('📊 [Agent2] Total allocation:', totalAllocation + '%');

        if (Math.abs(totalAllocation - 100) > 1) {
          console.warn('⚠️ [Agent2] Normalizing allocations to 100%');
          clusterResult.selected_tokens.forEach(token => {
            token.allocation = Math.round((token.allocation / totalAllocation) * 100 * 100) / 100;
          });
        }

        // Ensure required fields for reveal display
        clusterResult.selected_tokens.forEach(token => {
          if (!token.name) token.name = token.symbol;
          if (!token.rationale) token.rationale = 'Selected for portfolio diversification';
        });

        console.log('💎 [Agent2] Selected tokens for reveal:',
          clusterResult.selected_tokens.map(t => `${t.symbol}: ${t.allocation}%`).join(', '));

        return clusterResult;
      } else {
        console.error('❌ [Agent2] No valid selected_tokens found in response');
        return null;
      }
    }

    console.warn('⚠️ [Agent2] No valid JSON found in response');
    return null;

  } catch (error) {
    console.error('❌ [Agent2] Error creating cluster:', error.message);
    return null;
  }
}

// ==== Export for use in other modules ====
module.exports = {
  createCluster
};

// ==== Test function (if run directly) ====
async function testAgent() {
  console.log("🧪 Testing Cluster Agent...\n");

  const testProfile = {
    "status": "profile_complete",
    "collected_info": {
      "investment_theme": "DeFi and Layer-1 dominance",
      "risk_tolerance": 6,
      "time_horizon": "medium_term",
      "preferred_sectors": ["DeFi", "Layer-1"],
      "specific_preferences": ["Established projects"]
    }
  };

  const cluster = await createCluster(testProfile, coins);
  if (cluster) {
    console.log("\n🎯 Test Cluster Result:");
    console.log('Title:', cluster.cluster?.title);
    console.log('Selected Tokens:', cluster.selected_tokens?.map(t => `${t.symbol}: ${t.allocation}%`));
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testAgent();
}
