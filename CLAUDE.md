# BURP - Blockchain Unified Rebalancing Platform

## **Project Evolution: Crypto Baskets → Cluster-Based AI Investment Platform**

### **Core Concept**
BURP transforms investment accessibility through AI-powered cluster architecture where users interact via chat to create and invest in personalized cryptocurrency baskets. The platform democratizes institutional-level portfolio management through autonomous AI agents.

### **System Architecture**
- **Chat AI Agent**: Processes natural language → Returns basket recommendations as JSON
- **Cluster-Based Backend**: Specialized microservices for each integration
- **Smart Contract Layer**: 3 core contracts handling basket management, DEX routing, and pricing
- **MetaMask Integration**: Wallet-only authentication for seamless user experience

### **Key Sponsor Integrations**

#### **1inch DEX Aggregation**
- **Optimal Trade Execution**: All trades route through 1inch for best prices and gas efficiency
- **Multi-DEX Access**: Aggregate liquidity across Uniswap, SushiSwap, Curve, and 50+ DEXes
- **Smart Routing**: Automatic path optimization for complex multi-hop swaps
- **Gas Optimization**: Minimal transaction costs through intelligent routing

#### **Pyth Network Oracles**
- **Real-time Price Feeds**: High-frequency market data for AI decision making
- **Portfolio Valuation**: Accurate real-time portfolio value calculations
- **Price Staleness Protection**: Ensure data freshness for trading decisions
- **Multi-chain Support**: Consistent pricing across different blockchain networks

#### **PayPal PyUSD Integration**
- **Mainstream Adoption**: Familiar payment method for traditional users
- **Stable Value**: USD-pegged token reduces crypto volatility concerns
- **Instant Settlement**: Fast payments without traditional banking delays
- **Global Access**: Borderless investment platform

#### **SELF Protocol AI Agents**
- **Autonomous Strategy Creation**: AI generates personalized investment strategies
- **Continuous Learning**: Agents adapt based on market conditions and user preferences
- **Risk Management**: Automated portfolio rebalancing and risk assessment
- **Decentralized Compute**: Agents run on distributed infrastructure

### **User Journey**
```
1. Connect MetaMask wallet
2. Chat: "Create a DeFi basket for $1000 with moderate risk"
3. AI returns JSON: {"ETH": 40%, "UNI": 25%, "AAVE": 20%, "LINK": 15%}
4. User approves and invests via PyUSD/ETH through 1inch
5. Pyth provides real-time monitoring and portfolio valuation
6. SELF agents continuously optimize and rebalance
```

### **Smart Contracts Required**

#### **ClusterBasket.sol**
- Basket creation from AI recommendations
- User investment tracking and ownership
- Portfolio composition management
- Automated rebalancing triggers

#### **ClusterDEX.sol**
- 1inch API integration for optimal swaps
- PyUSD handling and conversion logic
- Multi-token swap execution
- Slippage protection and MEV resistance

#### **ClusterPricing.sol**
- Pyth Network price feed integration
- Portfolio valuation calculations
- Price staleness checks and fallbacks
- Historical performance tracking

### **Technology Stack**
- **Frontend**: React + TypeScript + Chat Interface
- **Backend**: Node.js with MetaMask authentication
- **Blockchain**: Multi-chain (Polygon for transactions, Base for settlements)
- **AI**: SELF Protocol autonomous agents
- **Pricing**: Pyth Network real-time oracles
- **Trading**: 1inch DEX aggregation
- **Payments**: PyUSD for mainstream adoption

### **Key Features**
- **Conversational Interface**: Natural language investment requests
- **AI-Generated Baskets**: Personalized portfolio recommendations
- **One-Click Investment**: Simplified user experience
- **Real-time Monitoring**: Live portfolio tracking via Pyth
- **Optimal Execution**: Best prices through 1inch routing
- **Mainstream Access**: PyUSD integration for traditional users
- **Autonomous Management**: SELF agents handle rebalancing

### **Core Value Propositions**
1. **Accessibility**: Chat-based interface removes complexity barriers
2. **Intelligence**: AI-powered personalized investment strategies
3. **Efficiency**: Optimal execution through 1inch aggregation
4. **Transparency**: Real-time pricing via Pyth oracles
5. **Mainstream Ready**: PyUSD integration for familiar payments

### **Development Priority**
**Core MVP Flow**: Chat → AI basket creation → Investment via 1inch → Price monitoring via Pyth → PyUSD payments for accessibility

### **Security & Authentication**
- **MetaMask Integration**: Wallet signature-based authentication
- **Nonce Protection**: Replay attack prevention
- **JWT Tokens**: Secure session management
- **Smart Contract Audits**: Multi-signature and timelock protections

## **Backend Architecture**

### **Core Infrastructure**
- **Framework**: Node.js with Express
- **Authentication**: Frontend MetaMask → Backend account creation
- **Database**: MongoDB for user and portfolio data
- **API Design**: RESTful endpoints for all operations

### **Authentication Flow (LOCKED SPECIFICATION)**
```
1. Frontend: MetaMask signature verification
2. Frontend → Backend: Send verified wallet + signature
3. Backend: Create/verify account + issue JWT
4. Backend → Frontend: Return session token
```

### **Essential API Endpoints**
```
# Account Management (Frontend MetaMask Integration)
POST /api/auth/create-account  - Create account from frontend verification
POST /auth/nonce               - Generate wallet signature nonce
POST /auth/authenticate        - Verify signature and issue JWT
GET  /auth/profile            - Get user profile data

# Contract Integration
POST /api/baskets/create       - AI creates investment basket
POST /api/baskets/:id/invest   - User invests in basket
GET  /api/prices/:token        - Get real-time token price
POST /api/swaps/execute        - Execute 1inch swap

# Core Platform
GET  /health                   - System health check
GET  /api/blockchain/status    - Integration status check
```

### **Account Creation Service (LOCKED IMPLEMENTATION)**
```javascript
// Frontend → Backend Account Creation Flow
POST /api/auth/create-account
{
  "walletAddress": "0x742d35Cc6634C0532925a3b8d6Ac6C3D0Ed8C32",
  "signature": "0x...",        // Signed message proving ownership
  "nonce": "abc123",           // Anti-replay protection
  "userProfile": {             // Optional user data
    "email": "user@example.com",
    "preferences": {...}
  }
}

// Backend Response
{
  "success": true,
  "data": {
    "user": {
      "id": "userId",
      "walletAddress": "0x...",
      "email": "user@example.com",
      "createdAt": "2025-01-01T00:00:00Z"
    },
    "token": "jwt-session-token"
  }
}
```

### **Enhanced User Model (LOCKED SCHEMA)**
```javascript
{
  walletAddress: String (unique, required),
  email: String (optional),
  preferences: Object,
  accountCreatedAt: Date,
  lastLoginAt: Date,
  isActive: Boolean
}
```

### **Current Implementation Status**

#### **✅ Backend (Complete)**
- **MetaMask wallet authentication**
- **Secure nonce-based signature verification**
- **JWT session management**
- **Clean API architecture**
- **Production-ready authentication microservice**

#### **✅ Smart Contracts (Complete & LOCKED)**

##### **ClusterBasket.sol** - Core Investment Management
```solidity
// LOCKED CONTRACT SPECIFICATIONS
- AI-authorized basket creation via onlyAI modifier
- Weighted portfolio management (weights sum to 100%)
- User investment tracking with UserHolding struct
- Autonomous rebalancing by SELF AI agents
- Integration with ClusterDEX and ClusterPricing contracts

Key Functions:
• createBasketFromAI() - AI creates new investment baskets
• investInBasket() - Users invest in existing baskets
• updateBasketWeights() - AI rebalances portfolio composition
• calculateUserShare() - Proportional ownership calculation
```

##### **ClusterDEX.sol** - 1inch & PyUSD Integration
```solidity
// LOCKED CONTRACT SPECIFICATIONS
- Direct I1inchRouter integration for optimal swaps
- IPyUSD interface for PayPal USD operations
- Batch swapping for multi-token basket purchases
- Configurable slippage protection (default 5%)
- MEV protection via ReentrancyGuard

Key Functions:
• executeSwapVia1inch() - Execute single token swaps
• batchSwapForBasket() - Multi-token swaps for basket purchases
• setSlippageProtection() - Risk management controls
```

##### **ClusterPricing.sol** - Pyth Network Integration
```solidity
// LOCKED CONTRACT SPECIFICATIONS
- IPyth interface for real-time price feeds
- Price staleness detection (5-minute max age)
- Token-to-PriceID mapping for multi-asset support
- Batch price updates for gas efficiency
- Portfolio valuation calculations

Key Functions:
• getPythPrice() - Fetch real-time prices from Pyth
• isPriceStale() - Validate price data freshness
• updateAllPrices() - Batch price feed updates
• calculateBasketTotalValue() - Real-time portfolio valuation
```

#### **🔒 SPONSOR INTEGRATION ANALYSIS (LOCKED)**

##### **✅ 1inch DEX Aggregation**
- **Direct Integration**: I1inchRouter.swap() calls in ClusterDEX.sol
- **Optimal Routing**: Leverages 1inch's aggregation for best prices
- **Batch Support**: batchSwapForBasket() for complex portfolio purchases
- **Production Ready**: Interface matches 1inch V5 router specification

##### **✅ Pyth Network Oracles**
- **Real-time Feeds**: IPyth.getPrice() implementation in ClusterPricing.sol
- **Staleness Protection**: 5-minute max age validation
- **Multi-chain Ready**: Standard Pyth interface for cross-chain deployment
- **Gas Efficient**: Batch price updates via updatePriceFeeds()

##### **✅ PayPal PyUSD Integration**
- **Token Interface**: IPyUSD with transfer/transferFrom/balanceOf
- **Settlement Currency**: Primary payment method in ClusterDEX
- **Mainstream Access**: Familiar payment method for traditional users
- **Global Compatibility**: USD-pegged stability across markets

##### **✅ SELF Protocol AI Agents**
- **Authorization Control**: onlyAI modifier in ClusterBasket.sol
- **Signature Verification**: aiSignature parameter for agent authentication
- **Autonomous Operations**: AI creates and rebalances baskets autonomously
- **Decentralized Ready**: Configurable agent address for distributed compute

#### **🔄 Integration Layer (Next Step)**
- **Contract ABIs & Web3 Provider**: Extract ABIs after deployment, setup ethers.js
- **Additional Backend Services**: ContractService, BasketService, DEXService, PricingService
- **API Endpoints**: Contract interaction routes for basket operations
- **Environment Configuration**: Deployed contract addresses, sponsor API keys

#### **📋 1inch API Integration (LOCKED IMPLEMENTATION)**

##### **Token Purchase API Endpoints**
```javascript
// 1. Get Quote (Price Check)
GET https://api.1inch.dev/swap/v5.2/{chainId}/quote
Parameters:
- src: Source token address (PYUSD)
- dst: Destination token address
- amount: Amount in wei
- includeTokensInfo: true
- includeProtocols: true
- includeGas: true

// 2. Execute Swap (Token Purchase)
GET https://api.1inch.dev/swap/v5.2/{chainId}/swap
Parameters:
- src: Source token address
- dst: Destination token address
- amount: Amount in wei
- from: User wallet address
- slippage: Acceptable slippage (1-50)
- disableEstimate: false
- allowPartialFill: false
```

##### **BURP Platform Integration Service**
```javascript
class ClusterPurchaseService {
  async buyClusterTokens(userWallet, pyusdAmount, clusterTokens) {
    const transactions = [];

    for (const token of clusterTokens) {
      // Get 1inch quote
      const quote = await getQuote(
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // PYUSD Polygon
        token.address,
        token.targetAmount
      );

      // Execute 1inch swap
      const swapData = await executeSwap(
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        token.address,
        token.targetAmount,
        userWallet,
        1 // 1% slippage
      );

      transactions.push(swapData.tx);
    }

    return transactions;
  }
}
```

##### **Required Token Addresses (Polygon)**
```javascript
const TOKENS = {
  PYUSD: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  WBTC: '0x1BFD67037B42Cf2047067bd4F2C47D9BfD6',
  MATIC: '0x0000000000000000000000000000000000001010',
  USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
};
```

#### **📋 Deployment Requirements**
```bash
# Additional Dependencies Needed:
npm install @1inch/fusion-sdk @pythnetwork/client axios

# Environment Variables Required:
RPC_URL=https://polygon-mainnet.infura.io/v3/your-key
CLUSTER_BASKET_ADDRESS=0x...deployed-address
CLUSTER_DEX_ADDRESS=0x...deployed-address
CLUSTER_PRICING_ADDRESS=0x...deployed-address

# 1inch API Configuration
ONEINCH_API_KEY=your-1inch-api-key
ONEINCH_API_URL=https://api.1inch.dev
ONEINCH_CHAIN_ID=137

# PayPal PyUSD Token Address (Polygon)
PYUSD_CONTRACT_ADDRESS=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174

# Pyth Network Configuration
PYTH_NETWORK_URL=https://hermes.pyth.network
```

---

**ETHGlobal New Delhi 2025 Hackathon Submission**

*Focus: Chat-driven AI investment platform with sponsor integrations (1inch, Pyth, PyUSD, SELF)*
- to memorize