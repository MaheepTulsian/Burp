require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');

const { router: authRouter, initializeAuthService } = require('./routes/auth');
const User = require('./database/models/User');

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

app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5001'],
  credentials: true
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
    } else {
      // Use in-memory database for testing
      mongoUri = 'mongodb://localhost:27017/burp-test';
      console.log('💾 Using in-memory database for testing');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to database');

    initializeAuthService(User);
    console.log('✅ Auth service initialized');

  } catch (error) {
    console.warn('⚠️ Database connection failed, using mock mode:', error.message);

    // Create mock User model for testing
    function MockUser(data) {
      this._id = 'mock-id-' + Math.random().toString(36);
      this.walletAddress = data.walletAddress;
      this.email = data.email;
      this.createdAt = new Date();
    }

    MockUser.prototype.save = function() {
      return Promise.resolve(this);
    };

    MockUser.findOne = () => Promise.resolve(null);
    MockUser.findById = () => Promise.resolve(null);
    MockUser.findByIdAndUpdate = () => Promise.resolve(null);
    MockUser.findByIdAndDelete = () => Promise.resolve(null);

    initializeAuthService(MockUser);
    console.log('✅ Mock auth service initialized');
  }
};

app.use('/auth', authRouter);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BURP Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

app.get('/api/blockchain/status', (req, res) => {
  res.json({
    success: true,
    data: {
      ethereum: {
        rpc: process.env.ETHEREUM_RPC_URL ? 'configured' : 'not configured',
        chainId: process.env.CHAIN_ID || '1'
      },
      hedera: {
        network: process.env.HEDERA_NETWORK || 'testnet',
        accountId: process.env.HEDERA_ACCOUNT_ID ? 'configured' : 'not configured'
      },
      integrations: {
        pyusd: process.env.PYUSD_CONTRACT_ADDRESS ? 'configured' : 'not configured',
        oneinch: process.env.ONEINCH_API_KEY ? 'configured' : 'not configured',
        pyth: process.env.PYTH_NETWORK_URL ? 'configured' : 'not configured',
        selfProtocol: process.env.SELF_PROTOCOL_API_KEY ? 'configured' : 'not configured'
      }
    },
    message: 'Blockchain status retrieved'
  });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /api/blockchain/status',
      'POST /auth/nonce',
      'POST /auth/authenticate',
      'POST /auth/signup',
      'POST /auth/login',
      'GET /auth/profile',
      'PUT /auth/profile',
      'GET /auth/validate'
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
📡 Blockchain Status: http://localhost:${PORT}/api/blockchain/status

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