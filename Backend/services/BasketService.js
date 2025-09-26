const BaseService = require('./BaseService');

class BasketService extends BaseService {
  constructor(basketModel, userModel) {
    super();
    this.Basket = basketModel;
    this.User = userModel;
  }

  async createBasket(userId, basketData) {
    try {
      const { name, description, tokens, weights, riskLevel, category } = basketData;

      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      if (Math.abs(totalWeight - 100) > 0.01) {
        throw new Error('Token weights must sum to 100%');
      }

      if (tokens.length !== weights.length) {
        throw new Error('Number of tokens must match number of weights');
      }

      const basket = new this.Basket({
        userId,
        name,
        description,
        tokens: tokens.map((token, index) => ({
          symbol: token.symbol,
          address: token.address,
          weight: weights[index],
          name: token.name || token.symbol
        })),
        riskLevel: riskLevel || 'moderate',
        category: category || 'custom',
        totalValue: 0,
        isActive: true,
        createdBy: 'user',
        aiGenerated: false
      });

      const savedBasket = await basket.save();

      return this.formatSuccess({
        basketId: savedBasket._id,
        name: savedBasket.name,
        tokens: savedBasket.tokens,
        riskLevel: savedBasket.riskLevel,
        category: savedBasket.category,
        createdAt: savedBasket.createdAt
      }, 'Basket created successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to create basket');
    }
  }

  async createAIBasket(aiRecommendation, metadata = {}) {
    try {
      const { basketName, tokens, description, riskLevel, category } = aiRecommendation;

      const totalWeight = tokens.reduce((sum, token) => sum + token.percentage, 0);
      if (Math.abs(totalWeight - 100) > 0.01) {
        throw new Error('AI recommendation weights must sum to 100%');
      }

      const basket = new this.Basket({
        userId: null,
        name: basketName,
        description: description || `AI-generated ${category || 'diversified'} basket`,
        tokens: tokens.map(token => ({
          symbol: token.symbol,
          address: token.address,
          weight: token.percentage,
          name: token.name || token.symbol,
          rationale: token.reason || ''
        })),
        riskLevel: riskLevel || 'moderate',
        category: category || 'ai-generated',
        totalValue: 0,
        isActive: true,
        createdBy: 'ai',
        aiGenerated: true,
        aiMetadata: {
          model: metadata.model || 'SELF-Protocol-v1',
          confidence: metadata.confidence || 0.85,
          marketConditions: metadata.marketConditions || 'neutral',
          generatedAt: new Date()
        }
      });

      const savedBasket = await basket.save();

      return this.formatSuccess({
        basketId: savedBasket._id,
        name: savedBasket.name,
        tokens: savedBasket.tokens,
        riskLevel: savedBasket.riskLevel,
        category: savedBasket.category,
        aiMetadata: savedBasket.aiMetadata,
        createdAt: savedBasket.createdAt
      }, 'AI basket created successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to create AI basket');
    }
  }

  async getUserBaskets(userId) {
    try {
      const baskets = await this.Basket.find({
        $or: [
          { userId: userId },
          { createdBy: 'ai', isActive: true }
        ]
      }).sort({ createdAt: -1 });

      const userBaskets = baskets.filter(b => b.userId && b.userId.toString() === userId);
      const aiBaskets = baskets.filter(b => b.createdBy === 'ai');

      return this.formatSuccess({
        userBaskets: userBaskets.map(b => this.formatBasketResponse(b)),
        aiBaskets: aiBaskets.slice(0, 10).map(b => this.formatBasketResponse(b)),
        totalUserBaskets: userBaskets.length,
        totalAIBaskets: aiBaskets.length
      }, 'User baskets retrieved successfully');

    } catch (error) {
      return this.formatError(error, 404, 'Failed to retrieve user baskets');
    }
  }

  async getBasketById(basketId, userId = null) {
    try {
      const query = { _id: basketId };
      if (userId) {
        query.$or = [
          { userId: userId },
          { createdBy: 'ai' }
        ];
      }

      const basket = await this.Basket.findOne(query);

      if (!basket) {
        throw new Error('Basket not found or access denied');
      }

      return this.formatSuccess(this.formatBasketResponse(basket), 'Basket retrieved successfully');

    } catch (error) {
      return this.formatError(error, 404, 'Failed to retrieve basket');
    }
  }

  async updateBasket(basketId, userId, updateData) {
    try {
      const basket = await this.Basket.findOne({ _id: basketId, userId: userId });

      if (!basket) {
        throw new Error('Basket not found or access denied');
      }

      if (basket.createdBy === 'ai') {
        throw new Error('Cannot modify AI-generated baskets');
      }

      const allowedUpdates = ['name', 'description', 'tokens', 'riskLevel', 'category'];
      const updates = {};

      for (const key of allowedUpdates) {
        if (updateData[key] !== undefined) {
          updates[key] = updateData[key];
        }
      }

      if (updates.tokens) {
        const totalWeight = updates.tokens.reduce((sum, token) => sum + token.weight, 0);
        if (Math.abs(totalWeight - 100) > 0.01) {
          throw new Error('Token weights must sum to 100%');
        }
      }

      updates.updatedAt = new Date();

      const updatedBasket = await this.Basket.findByIdAndUpdate(basketId, updates, { new: true });

      return this.formatSuccess(this.formatBasketResponse(updatedBasket), 'Basket updated successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to update basket');
    }
  }

  async deleteBasket(basketId, userId) {
    try {
      const basket = await this.Basket.findOne({ _id: basketId, userId: userId });

      if (!basket) {
        throw new Error('Basket not found or access denied');
      }

      if (basket.createdBy === 'ai') {
        throw new Error('Cannot delete AI-generated baskets');
      }

      await this.Basket.findByIdAndUpdate(basketId, {
        isActive: false,
        deletedAt: new Date()
      });

      return this.formatSuccess({
        basketId,
        message: 'Basket deactivated successfully'
      }, 'Basket deleted successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to delete basket');
    }
  }

  async getPopularBaskets(limit = 10) {
    try {
      const baskets = await this.Basket.find({
        createdBy: 'ai',
        isActive: true
      })
      .sort({ 'aiMetadata.confidence': -1, createdAt: -1 })
      .limit(limit);

      return this.formatSuccess({
        baskets: baskets.map(b => this.formatBasketResponse(b)),
        count: baskets.length
      }, 'Popular baskets retrieved successfully');

    } catch (error) {
      return this.formatError(error, 500, 'Failed to retrieve popular baskets');
    }
  }

  async getBasketsByCategory(category, limit = 20) {
    try {
      const baskets = await this.Basket.find({
        category: category,
        isActive: true
      })
      .sort({ createdAt: -1 })
      .limit(limit);

      return this.formatSuccess({
        category,
        baskets: baskets.map(b => this.formatBasketResponse(b)),
        count: baskets.length
      }, `${category} baskets retrieved successfully`);

    } catch (error) {
      return this.formatError(error, 404, 'Failed to retrieve baskets by category');
    }
  }

  async investInBasket(basketId, userId, investmentAmount, transactionHash = null) {
    try {
      const basket = await this.Basket.findById(basketId);

      if (!basket || !basket.isActive) {
        throw new Error('Basket not found or inactive');
      }

      const investment = {
        userId,
        amount: investmentAmount,
        transactionHash,
        investedAt: new Date(),
        tokens: basket.tokens.map(token => ({
          symbol: token.symbol,
          address: token.address,
          weight: token.weight,
          allocatedAmount: (investmentAmount * token.weight) / 100
        }))
      };

      basket.investments = basket.investments || [];
      basket.investments.push(investment);
      basket.totalValue += investmentAmount;

      await basket.save();

      return this.formatSuccess({
        basketId,
        investmentAmount,
        totalBasketValue: basket.totalValue,
        tokenAllocation: investment.tokens,
        transactionHash
      }, 'Investment recorded successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to record investment');
    }
  }

  formatBasketResponse(basket) {
    return {
      id: basket._id,
      name: basket.name,
      description: basket.description,
      tokens: basket.tokens,
      riskLevel: basket.riskLevel,
      category: basket.category,
      totalValue: basket.totalValue,
      isActive: basket.isActive,
      createdBy: basket.createdBy,
      aiGenerated: basket.aiGenerated,
      aiMetadata: basket.aiMetadata,
      investmentCount: basket.investments ? basket.investments.length : 0,
      createdAt: basket.createdAt,
      updatedAt: basket.updatedAt
    };
  }

  async getBasketStats() {
    try {
      const stats = await this.Basket.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalValue: { $sum: '$totalValue' },
            avgValue: { $avg: '$totalValue' }
          }
        }
      ]);

      const totalBaskets = await this.Basket.countDocuments({ isActive: true });
      const aiBaskets = await this.Basket.countDocuments({ createdBy: 'ai', isActive: true });
      const userBaskets = await this.Basket.countDocuments({ createdBy: 'user', isActive: true });

      return this.formatSuccess({
        totalBaskets,
        aiBaskets,
        userBaskets,
        categoryBreakdown: stats
      }, 'Basket statistics retrieved successfully');

    } catch (error) {
      return this.formatError(error, 500, 'Failed to get basket statistics');
    }
  }
}

module.exports = BasketService;