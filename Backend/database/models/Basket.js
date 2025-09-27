const mongoose = require('mongoose');

const basketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.createdBy === 'user';
    }
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  tokens: [{
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^0x[a-fA-F0-9]{40}$/.test(v);
        },
        message: 'Invalid token address format'
      }
    },
    name: {
      type: String,
      trim: true
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      validate: {
        validator: function(v) {
          return v >= 0 && v <= 100;
        },
        message: 'Token weight must be between 0 and 100'
      }
    },
    rationale: {
      type: String,
      trim: true,
      maxlength: 200
    }
  }],
  riskLevel: {
    type: String,
    enum: ['conservative', 'moderate', 'aggressive'],
    default: 'moderate'
  },
  category: {
    type: String,
    enum: ['defi', 'gaming', 'metaverse', 'layer1', 'layer2', 'ai', 'meme', 'stable', 'custom', 'ai-generated'],
    default: 'custom'
  },
  totalValue: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiMetadata: {
    model: {
      type: String,
      default: null
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null
    },
    marketConditions: {
      type: String,
      enum: ['bullish', 'bearish', 'neutral', 'volatile'],
      default: null
    },
    generatedAt: {
      type: Date,
      default: null
    }
  },
  investments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    transactionHash: {
      type: String,
      trim: true
    },
    investedAt: {
      type: Date,
      default: Date.now
    },
    tokens: [{
      symbol: String,
      address: String,
      weight: Number,
      allocatedAmount: Number
    }]
  }],
  performance: {
    allTimeHigh: {
      value: {
        type: Number,
        default: 0
      },
      timestamp: {
        type: Date,
        default: null
      }
    },
    allTimeLow: {
      value: {
        type: Number,
        default: 0
      },
      timestamp: {
        type: Date,
        default: null
      }
    },
    returns: {
      daily: {
        type: Number,
        default: 0
      },
      weekly: {
        type: Number,
        default: 0
      },
      monthly: {
        type: Number,
        default: 0
      },
      yearly: {
        type: Number,
        default: 0
      }
    }
  },
  contractInfo: {
    basketId: {
      type: Number,
      default: null
    },
    contractAddress: {
      type: String,
      default: null
    },
    deployedAt: {
      type: Date,
      default: null
    },
    transactionHash: {
      type: String,
      default: null
    }
  },
  deletedAt: {
    type: Date,
    default: null
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

basketSchema.index({ userId: 1, isActive: 1 });
basketSchema.index({ category: 1, isActive: 1 });
basketSchema.index({ createdBy: 1, isActive: 1 });
basketSchema.index({ 'aiMetadata.confidence': -1 });
basketSchema.index({ createdAt: -1 });
basketSchema.index({ totalValue: -1 });

basketSchema.pre('save', function(next) {
  this.updatedAt = new Date();

  const totalWeight = this.tokens.reduce((sum, token) => sum + token.weight, 0);
  if (Math.abs(totalWeight - 100) > 0.01 && this.tokens.length > 0) {
    return next(new Error('Token weights must sum to 100%'));
  }

  if (this.tokens.length > 20) {
    return next(new Error('Maximum 20 tokens allowed per basket'));
  }

  next();
});

basketSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    tokens: this.tokens,
    riskLevel: this.riskLevel,
    category: this.category,
    totalValue: this.totalValue,
    isActive: this.isActive,
    createdBy: this.createdBy,
    aiGenerated: this.aiGenerated,
    aiMetadata: this.aiMetadata,
    performance: this.performance,
    investmentCount: this.investments ? this.investments.length : 0,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

basketSchema.methods.calculateTotalInvestment = function() {
  return this.investments.reduce((sum, investment) => sum + investment.amount, 0);
};

basketSchema.methods.getTokenAllocation = function(investmentAmount) {
  return this.tokens.map(token => ({
    symbol: token.symbol,
    address: token.address,
    weight: token.weight,
    allocatedAmount: (investmentAmount * token.weight) / 100
  }));
};

basketSchema.statics.findActiveBaskets = function() {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

basketSchema.statics.findAIBaskets = function(limit = 10) {
  return this.find({ createdBy: 'ai', isActive: true })
    .sort({ 'aiMetadata.confidence': -1, createdAt: -1 })
    .limit(limit);
};

basketSchema.statics.findByCategory = function(category, limit = 20) {
  return this.find({ category, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

basketSchema.statics.findUserBaskets = function(userId) {
  return this.find({ userId, isActive: true }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Basket', basketSchema);