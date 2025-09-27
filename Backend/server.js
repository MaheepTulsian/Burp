require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');

const { router: authRouter, initializeAuthService } = require('./routes/auth');
const basketRouter = require('./routes/baskets');
const pricingRouter = require('./routes/pricing');
const blockchainRouter = require('./routes/blockchain');
const agentsRouter = require('./routes/agents');
const transactionsRouter = require('./routes/transactions');

const User = require('./database/models/User');
const Basket = require('./database/models/Basket');

const app = express();
const PORT = process.env.PORT || 5001;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "http://localhost:5001", "https://mainnet.infura.io", "https://api.1inch.dev"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration - simplified for debugging
app.use(cors({
  // include Vite dev origin (5173) and other local dev ports
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:5001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


const connectDatabase = async () => {
  try {
    let mongoUri;

    // Try MongoDB Atlas or local, fallback to in-memory for testing
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv')) {
      mongoUri = process.env.MONGODB_URI;
      console.log('🌐 Using MongoDB Atlas');
    } else if (process.env.MONGODB_URI) {
      mongoUri = process.env.MONGODB_URI;
      console.log('💾 Using MongoDB URI:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    } else {
      // Use local database for testing
      mongoUri = 'mongodb://localhost:27017/burp-test';
      console.log('💾 Using local MongoDB for testing');
    }

    console.log('🔌 Connecting to database...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to database successfully');
    console.log('📊 Database connection state:', mongoose.connection.readyState);

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Don't fall back to mock mode, throw the error instead
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

// Initialize services with mock data first, will be updated when database connects
initializeAuthService(User);

app.use('/auth', authRouter);
app.use('/api/baskets', basketRouter);
app.use('/api/pricing', pricingRouter);
app.use('/api/blockchain', blockchainRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/transactions', transactionsRouter);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BURP Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    data: {
      server: {
        status: 'running',
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        uptime: process.uptime()
      },
      database: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        host: process.env.MONGODB_URI ? 'atlas' : 'local'
      },
      blockchain: {
        ethereum: {
          rpc: process.env.ETHEREUM_RPC_URL ? 'configured' : 'not configured',
          chainId: process.env.CHAIN_ID || '137'
        },
        contracts: {
          clusterBasket: process.env.CLUSTER_BASKET_ADDRESS ? 'deployed' : 'not deployed',
          clusterDEX: process.env.CLUSTER_DEX_ADDRESS ? 'deployed' : 'not deployed',
          clusterPricing: process.env.CLUSTER_PRICING_ADDRESS ? 'deployed' : 'not deployed'
        }
      },
      integrations: {
        pyusd: process.env.PYUSD_CONTRACT_ADDRESS ? 'configured' : 'not configured',
        oneinch: process.env.ONEINCH_API_URL ? 'configured' : 'not configured',
        pyth: process.env.PYTH_NETWORK_URL ? 'configured' : 'not configured',
        selfProtocol: process.env.SELF_PROTOCOL_API_KEY ? 'configured' : 'not configured'
      },
      features: {
        metaMaskAuth: true,
        basketCreation: true,
        aiBaskets: true,
        priceFeeds: true,
        dexAggregation: true,
        contractInteraction: false // Disabled for API-only mode
      }
    },
    message: 'BURP platform status retrieved'
  });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /api/status',

      '# Authentication Endpoints',
      'POST /auth/nonce',
      'POST /auth/create-account',
      'POST /auth/authenticate',
      'GET /auth/profile',
      'PUT /auth/profile',

      '# Basket Management',
      'POST /api/baskets/create',
      'POST /api/baskets/ai-create',
      'GET /api/baskets/popular',
      'GET /api/baskets/:basketId',
      'POST /api/baskets/:basketId/invest',
      'POST /api/baskets/:basketId/purchase',

      '# AI Agents',
      'GET /api/agents/status',
      'POST /api/agents/chat',
      'POST /api/agents/quick-portfolio',
      'GET /api/agents/recommendations/trending',

      '# Pricing & Market Data',
      'GET /api/pricing/token/:symbol',
      'POST /api/pricing/tokens/batch',
      'GET /api/pricing/token/:symbol/performance',
      'GET /api/pricing/supported-tokens',

      '# Blockchain Operations (API-only mode)',
      'GET /api/blockchain/status',
      'POST /api/blockchain/1inch/quote',
      'POST /api/blockchain/1inch/swap',
      'GET /api/blockchain/contracts/info'
    ]
  });
});

app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`
🚀 BURP Backend Server Started!

📍 Server: http://localhost:${PORT}
🔗 Health: http://localhost:${PORT}/health
📊 Status: http://localhost:${PORT}/api/status

🔗 Key Endpoints:
   • MetaMask Auth: POST /auth/create-account
   • AI Baskets: GET /api/baskets/popular
   • Token Prices: GET /api/pricing/token/:symbol
   • 1inch Integration: POST /api/blockchain/1inch/quote

🔧 Environment: ${process.env.NODE_ENV || 'development'}
💾 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}

Ready for MetaMask wallet authentication! 🦊
      `);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

module.exports = app;