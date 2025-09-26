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
- **Authentication**: MetaMask wallet signatures + JWT
- **Database**: MongoDB for user and portfolio data
- **API Design**: RESTful endpoints for all operations

### **Essential API Endpoints**
```
# Authentication
POST /auth/nonce              - Generate wallet signature nonce
POST /auth/authenticate       - Verify signature and issue JWT
GET  /auth/profile           - Get user profile data

# Core Platform
GET  /health                 - System health check
GET  /api/blockchain/status  - Integration status check
```

### **Current Implementation Status**
✅ **MetaMask wallet authentication**
✅ **Secure nonce-based signature verification**
✅ **JWT session management**
✅ **Clean API architecture**
✅ **Production-ready backend**

---

**ETHGlobal New Delhi 2025 Hackathon Submission**

*Focus: Chat-driven AI investment platform with sponsor integrations (1inch, Pyth, PyUSD, SELF)*