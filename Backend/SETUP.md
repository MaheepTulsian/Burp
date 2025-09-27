# BURP Backend Setup Guide

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Database Setup Options

#### Option A: Local MongoDB (Recommended for Development)
```bash
# Install MongoDB Community Server
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb
# Windows: Download from mongodb.com

# Start MongoDB service
# macOS: brew services start mongodb-community
# Ubuntu: sudo systemctl start mongod
# Windows: Start MongoDB service from Services

# Update .env
MONGODB_URI=mongodb://localhost:27017/burp-dev
```

#### Option B: MongoDB Atlas (Recommended for Production)
```bash
# 1. Create account at mongodb.com/atlas
# 2. Create new cluster (free tier available)
# 3. Get connection string
# 4. Update .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/burp-prod
```

### 3. Test the Setup
```bash
# Start server
npm start

# Test health endpoint
curl https://burp.contactsushil.me/health

# Expected response:
{
  "success": true,
  "message": "BURP Backend is running",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

## 🔧 Development Workflow

### Testing Account Creation
```bash
# Test nonce generation
curl -X POST https://burp.contactsushil.me/auth/nonce \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x742d35Cc6634C0532925a3b8d6Ac6C3D0Ed8C32"}'

# Test account creation (requires frontend MetaMask signature)
curl -X POST https://burp.contactsushil.me/auth/create-account \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b8d6Ac6C3D0Ed8C32",
    "signature": "0x...",
    "nonce": "abc123",
    "userProfile": {
      "email": "user@example.com",
      "preferences": {
        "currency": "USD",
        "riskTolerance": "moderate"
      }
    }
  }'
```

## 📋 Environment Variables Guide

### Required for Basic Operation
```bash
PORT=5001                    # Server port
NODE_ENV=development         # Environment mode
MONGODB_URI=...             # Database connection
JWT_SECRET=...              # JWT signing key (32+ chars)
JWT_EXPIRES_IN=7d           # Token expiration
```

### Required for Contract Integration
```bash
ETHEREUM_RPC_URL=...        # Polygon/Ethereum RPC
CHAIN_ID=137                # Network ID (137=Polygon)
PRIVATE_KEY=...             # AI agent wallet key
CLUSTER_BASKET_ADDRESS=...  # Deployed contract addresses
CLUSTER_DEX_ADDRESS=...
CLUSTER_PRICING_ADDRESS=...
```

### Required for Sponsor Integrations
```bash
ONEINCH_API_KEY=...         # 1inch DEX aggregation
PYTH_NETWORK_URL=...        # Pyth price oracles
PYUSD_CONTRACT_ADDRESS=...  # PayPal USD token
SELF_PROTOCOL_API_KEY=...   # SELF Protocol AI agents
```

## 🔒 Security Checklist

### Development
- ✅ Use strong JWT_SECRET (32+ characters)
- ✅ Enable CORS for localhost only
- ✅ Use test database (burp-dev/burp-test)
- ✅ Never commit .env to git

### Production
- ✅ Use environment variables (not .env file)
- ✅ Enable HTTPS/SSL
- ✅ Restrict CORS to production domains
- ✅ Use MongoDB Atlas with authentication
- ✅ Enable rate limiting
- ✅ Set up monitoring (Sentry/New Relic)

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  walletAddress: "0x...",     // Unique wallet address
  email: "user@example.com",  // Optional email
  preferences: {
    currency: "USD",
    riskTolerance: "moderate",
    notifications: {...}
  },
  kycStatus: {
    verified: false,
    selfProtocolId: null
  },
  accountCreatedAt: Date,
  lastLoginAt: Date,
  isActive: true
}
```

## 🔄 Integration Steps

### After Contract Deployment
1. **Extract Contract ABIs** from build artifacts
2. **Update Environment** with deployed addresses
3. **Add Contract Services** (BasketService, DEXService, PricingService)
4. **Test Integration** with deployed contracts

### Frontend Integration
```javascript
// Frontend sends to backend after MetaMask verification
const response = await fetch('/auth/create-account', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: account,
    signature: signature,
    nonce: nonce,
    userProfile: { email, preferences }
  })
});

const { data } = await response.json();
// data.token - Use for authenticated requests
// data.user - User profile information
// data.isNewAccount - True if account was just created
```

## 🧪 Testing

### Unit Tests
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Integration Tests
```bash
# Test with real database
MONGODB_URI=mongodb://localhost:27017/burp-test npm test

# Test API endpoints
npm run test:api
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/nonce` - Generate signature nonce
- `POST /auth/create-account` - Create account from frontend
- `POST /auth/authenticate` - Legacy authentication
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `DELETE /auth/account` - Deactivate account

### System Endpoints
- `GET /health` - Health check
- `GET /api/blockchain/status` - Integration status

## 🐛 Troubleshooting

### Common Issues

#### "MongoDB connection failed"
```bash
# Check MongoDB is running
# macOS: brew services list | grep mongodb
# Ubuntu: sudo systemctl status mongod

# Check connection string in .env
# Ensure no typos in MONGODB_URI
```

#### "JWT token invalid"
```bash
# Check JWT_SECRET is set and consistent
# Ensure token format: "Bearer <token>"
# Check token expiration (JWT_EXPIRES_IN)
```

#### "Port already in use"
```bash
# Check if another process is using port 5001
lsof -i :5001

# Kill existing process or change PORT in .env
```

### Debug Mode
```bash
# Enable detailed logging
DEBUG=true npm start

# Check logs for detailed error information
```

## 🚀 Production Deployment

### Environment Setup
```bash
# Use production environment variables
NODE_ENV=production
MONGODB_URI=<production-atlas-uri>
JWT_SECRET=<strong-production-secret>

# Enable security features
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=50
```

### Deployment Platforms
- **Vercel**: `vercel --prod`
- **Heroku**: `git push heroku main`
- **AWS/DigitalOcean**: Use PM2 or Docker
- **Railway**: Connect GitHub repository

---

**For questions or issues, refer to the CLAUDE.md documentation or create an issue in the repository.**