import coins from './coins.js';
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const user_preference = {
  "status": "profile_complete",
  "collected_info": {
    "investment_theme": "Stablecoins, Utility Tokens, Memecoins (including Dogecoin)",
    "risk_tolerance": 6,
    "time_horizon": "long_term",
    "preferred_sectors": [
      "Stablecoins",
      "Utility Tokens",
      "Memecoins"
    ],
    "specific_preferences": [
      "Dogecoin"
    ]
  },
  "conversation_summary": "User selected stablecoins, utility tokens, and memecoins (including Dogecoin) as their investment theme with a long-term horizon of 4 to 5 years and a risk tolerance of 6."
};

// ==== System Prompt ====
const PORTFOLIO_AGENT_SYSTEM_PROMPT = `
You are Burp's Portfolio Construction Agent.

You receive:
1. User's investment profile in JSON format.
2. A whitelist of crypto tokens with metadata.

TASK:
- Step 1: Analyze user's profile (theme, risk tolerance, time horizon, preferences).
- Step 2: Select the best 5–8 tokens from whitelist aligned with user preferences.
- Step 3: Allocate weights based on:
    • Risk tolerance (0–10)
    • Volatility (lower volatility gets more weight for low risk tolerance)
    • Market cap (higher market cap gets more weight)
    • User preference boosts
    • Time horizon
- Step 4: Respect diversification rules:
    • Min 5, max 8 tokens
    • No token > 35%
    • At least two sectors
    • Sum allocations = 100%

ALLOCATION FORMULA:
1. Inverse volatility weight: w1 = 1 / volatility
2. Market cap weight: w2 = market_cap / sum(market_caps)
3. Combined weight: w = α * w1 + (1 - α) * w2, with α=0.7
4. Risk tolerance scaling: multiply w by (R/10) * avg_volatility / volatility
5. User preference factor: multiply w by preference_factor
6. Apply caps, floors, normalize to sum = 100

FINAL OUTPUT FORMAT:
{
  "status": "portfolio_complete",
  "user_profile": { ...copy of input profile... },
  "selected_tokens": [
    {"symbol": "BTC", "allocation": 25},
    {"symbol": "ETH", "allocation": 20},
    {"symbol": "DOGE", "allocation": 15}
  ],
  "portfolio_summary": "Brief explanation of choice and allocations."
}
`;

// ==== Setup OpenAI ====
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


// ==== Portfolio Agent Function ====
async function runPortfolioAgent() {
  const messages = [
    { role: "system", content: PORTFOLIO_AGENT_SYSTEM_PROMPT },
    {
      role: "user",
      content: JSON.stringify({
        whitelist_tokens: coins,
        user_preferences: user_preference.collected_info || [],
      }),
    },
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.7,
    max_tokens: 1500,
  });

  const reply = response.choices[0].message.content;

  try {
    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const portfolioJSON = JSON.parse(jsonMatch[0]);
      console.log("\n✅ Portfolio Constructed:");
      console.log(JSON.stringify(portfolioJSON, null, 2));
      return portfolioJSON;
    }
  } catch (error) {
    console.error("Error parsing portfolio JSON:", error);
  }

  console.log("\nPortfolio Agent Response:\n", reply);
  return null;
}

// ==== Main ====
(async () => {
  console.log("🤖 Running Portfolio Constructor Agent...\n");
  const portfolio = await runPortfolioAgent(user_preference);
})();
