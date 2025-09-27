const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid Ethereum wallet address format'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  preferences: {
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'ETH', 'BTC']
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      portfolio: {
        type: Boolean,
        default: true
      },
      trading: {
        type: Boolean,
        default: true
      }
    },
    riskTolerance: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive'],
      default: 'moderate'
    }
  },
  kycStatus: {
    verified: {
      type: Boolean,
      default: false
    },
    selfProtocolId: {
      type: String,
      default: null
    },
    verifiedAt: {
      type: Date,
      default: null
    }
  },
  accountCreatedAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  deactivatedAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.index({ walletAddress: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.isModified('walletAddress')) {
    this.walletAddress = this.walletAddress.toLowerCase();
  }
  next();
});

userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    walletAddress: this.walletAddress,
    email: this.email,
    preferences: this.preferences,
    kycStatus: {
      verified: this.kycStatus.verified,
      verifiedAt: this.kycStatus.verifiedAt
    },
    accountCreatedAt: this.accountCreatedAt,
    lastLoginAt: this.lastLoginAt,
    isActive: this.isActive,
    createdAt: this.createdAt
  };
};

userSchema.statics.findByWallet = function(walletAddress) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() });
};

module.exports = mongoose.model('User', userSchema);