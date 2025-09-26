# BURP - Blockchain Unified Rebalancing Platform

## Project Overview

BURP is a decentralized AI-powered crypto investment platform that democratizes institutional-level portfolio management through autonomous AI agents. The platform enables users to invest in thematic cryptocurrency baskets that are automatically managed, rebalanced, and optimized by AI agents running on decentralized infrastructure.

## Core Value Proposition

- **AI-Managed Thematic Investing**: Curated crypto baskets managed by specialized AI agents
- **PYUSD Integration**: Seamless payments and settlements using PayPal's stablecoin
- **Zero-Knowledge Identity**: Privacy-preserving KYC through Self Protocol
- **Optimal Trade Execution**: Best price routing via 1inch aggregation
- **Real-time Price Feeds**: Accurate market data through Pyth Network oracles

## Technical Architecture

### Core Infrastructure
- **Framework**: Node.js with Express backend
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with wallet signature verification
- **AI Agents**: Autonomous portfolio management system
- **Blockchain Integration**: Multi-protocol architecture

### Sponsor Technology Integration

#### PayPal PYUSD Integration
- **Primary Settlement Currency**: All portfolio investments, rebalancing, and withdrawals conducted in PYUSD
- **Seamless Payments**: Users deposit PYUSD to fund investment baskets
- **Cross-border Settlement**: Enable global access to AI-managed crypto portfolios
- **Programmable Payments**: Automated fee distribution and profit sharing

#### Self Protocol - Privacy-First KYC
- **Zero-Knowledge Identity Verification**: Comply with regulations without exposing user data
- **Off-chain SDK Integration**: Verify user identity, age, and country eligibility
- **Sybil Resistance**: Prevent duplicate accounts and gaming of AI strategies
- **Regulatory Compliance**: Enable institutional features while preserving privacy

#### 1inch API Integration
- **Optimal Trade Execution**: Best price routing across multiple DEXes
- **Rebalancing Engine**: AI agents use 1inch for portfolio adjustments
- **Cross-chain Swaps**: Enable multi-blockchain portfolio management
- **Price Feed APIs**: Real-time token pricing for portfolio valuation

#### Pyth Network Oracles
- **Real-time Price Feeds**: High-frequency market data for AI decision making
- **Portfolio Valuation**: Accurate real-time portfolio value calculations
- **Rebalancing Triggers**: AI agents monitor price movements for optimization signals
- **Risk Management**: Volatility and correlation analysis using live market data

### Key Components

#### 1. Authentication System (`middleware/auth.js`)
```javascript
// JWT-based authentication with wallet signatures
const generateToken = (userId, walletAddress) => {
  return jwt.sign(
    { userId, walletAddress },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};
```

#### 2. Wallet Authentication (`utils/walletAuth.js`)
- Ethereum address validation using ethers.js
- Nonce-based signature verification
- Message signing for secure authentication
- Automatic nonce cleanup for security

#### 3. Database Models (`database/models/index.js`)
- **InvestAI**: Core platform descriptions
- **User**: Wallet-based user management
- **Portfolio**: Multi-asset investment portfolios
- **Strategy**: AI-driven investment strategies
- **Transaction**: Blockchain transaction tracking
- **AgentLog**: AI agent activity logging

#### 4. API Routes (`routes/api.js`)
Complete RESTful API covering:
- Investment descriptions (POST/GET `/api/investai`)
- User authentication flow (`/api/auth/*`)
- Portfolio management (`/api/portfolios/*`)
- Strategy creation and retrieval (`/api/strategies/*`)
- Transaction execution (`/api/transactions/*`)
- AI agent logging (`/api/agent-logs/*`)
- Blockchain price feeds (`/api/prices/:symbol`)
- System health monitoring (`/api/health`)

### Environment Configuration

```bash
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://[credentials]

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Blockchain Integration
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=your-hedera-private-key

# DeFi Integration
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
CHAIN_ID=1
DEX_AGGREGATOR_ADDRESS=0x1111111254eeb25477b68fb85ed929f73a960582
PRICE_ORACLE_ADDRESS=0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
```

## AI Agent System

### Four Specialized Agents

1. **Strategy Agent**
   - Market trend analysis
   - Theme creation and management
   - Asset scoring and ranking
   - Rebalancing trigger identification

2. **Portfolio Agent**
   - Dynamic portfolio rebalancing
   - Risk management implementation
   - Yield optimization
   - Tax-efficient trading

3. **Risk Management Agent**
   - Volatility monitoring
   - Correlation analysis
   - Drawdown protection
   - Liquidity assessment

4. **Research Agent**
   - Social sentiment analysis
   - News processing and insights
   - On-chain analytics monitoring
   - Technical analysis

### Agent Communication
- **Protocol**: Hedera Consensus Service (HCS)
- **Format**: JSON with digital signatures
- **Frequency**: Real-time for price data, hourly for analysis

## Blockchain Integration

### Hedera Hashgraph
- AI agent deployment and management
- Smart contracts for portfolio operations
- Consensus service for agent communication
- 3-second finality for instant rebalancing

### DeFi Protocol Integration
- **1inch API**: Optimal trade execution across DEXes
- **Pyth Network**: Real-time price oracles
- **Polygon**: Layer 2 scaling for cost efficiency

## API Endpoints

### Core Features
```
POST /api/investai              - Save InvestAI description
GET  /api/investai              - Retrieve InvestAI descriptions
```

### Authentication
```
POST /api/auth/nonce            - Get nonce for wallet signature
POST /api/auth/signup           - Register user with wallet signature
POST /api/auth/login            - Login user with wallet signature
GET  /api/auth/profile          - Get authenticated user profile
```

### Portfolio Management
```
POST /api/portfolios            - Create new portfolio
GET  /api/portfolios/user/:userId - Get user portfolios
```

### Strategy & Trading
```
POST /api/strategies            - Create trading strategy
GET  /api/strategies            - Get active strategies
POST /api/transactions          - Execute transaction/swap
GET  /api/transactions/portfolio/:portfolioId - Get portfolio transactions
```

### AI & Monitoring
```
POST /api/agent-logs            - Log AI agent activity
GET  /api/agent-logs            - Get AI agent logs
GET  /api/prices/:symbol        - Get asset price
GET  /api/blockchain/status     - Get blockchain connection status
GET  /api/health               - Health check endpoint
```

## Database Schema

### User Model
```javascript
{
  walletAddress: String (required, unique),
  email: String,
  createdAt: Date
}
```

### Portfolio Model
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  assets: [{
    symbol: String,
    amount: Number,
    value: Number
  }],
  totalValue: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  portfolioId: ObjectId (ref: Portfolio),
  type: Enum ['buy', 'sell', 'swap'],
  fromAsset: String,
  toAsset: String,
  amount: Number,
  txHash: String,
  status: Enum ['pending', 'completed', 'failed'],
  createdAt: Date
}
```

## Security Features

### Wallet-Based Authentication
- Ethereum signature verification
- Nonce-based replay protection
- JWT token management
- Secure message signing

### API Security
- Input validation and sanitization
- Rate limiting protection
- CORS configuration
- Environment variable protection

## Development Setup

### Prerequisites
```bash
Node.js >= 16.0.0
MongoDB >= 5.0
Git
```

### Installation
```bash
# Clone repository
git clone [repository-url]
cd burp/Backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Available Scripts
```bash
npm start      # Production server
npm run dev    # Development with nodemon
```

## Project Structure

```
Backend/
├── .env                    # Environment configuration
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies and scripts
├── server.js              # Application entry point
├── contracts/             # Blockchain smart contracts
├── database/
│   ├── connection.js      # MongoDB connection
│   └── models/
│       └── index.js       # Mongoose models
├── middleware/
│   └── auth.js           # Authentication middleware
├── routes/
│   └── api.js            # API route definitions
└── utils/
    ├── apiLister.js      # API documentation generator
    └── walletAuth.js     # Wallet authentication utilities
```

## Monitoring & Logging

### API Documentation
- Automatic route discovery and documentation
- Categorized endpoint listing
- Real-time server status monitoring
- Comprehensive error logging

### Performance Metrics
- Response time tracking
- Database query optimization
- Blockchain interaction monitoring
- AI agent performance analytics

## Future Roadmap

### Phase 1: Post-Development
- Smart contract security audits
- Advanced AI model training
- Mobile application development
- Beta testing program

### Phase 2: Market Expansion
- Cross-chain deployment
- Institutional features
- Advanced trading strategies
- DAO governance implementation

### Phase 3: Ecosystem Growth
- Third-party API development
- White-label solutions
- Traditional finance integration
- Global regulatory compliance

## Contributing

### Development Guidelines
1. Follow existing code structure and naming conventions
2. Add comprehensive error handling for all endpoints
3. Include proper input validation and sanitization
4. Update documentation for any API changes
5. Test all blockchain integrations on testnets first

### Code Style
- Use consistent indentation (2 spaces)
- Follow REST API best practices
- Include JSDoc comments for complex functions
- Implement proper error handling patterns

## License

This project is part of the ETHGlobal New Delhi 2025 hackathon submission.

---

**Note**: This is an active development project. Always verify blockchain transactions on testnets before mainnet deployment.