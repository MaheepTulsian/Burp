const BaseService = require('./BaseService');

class PortfolioService extends BaseService {
  constructor(portfolioModel) {
    super();
    this.portfolioModel = portfolioModel;
  }

  async create(portfolioData) {
    await this.validateData(portfolioData, ['userId', 'name']);

    const portfolio = new this.portfolioModel({
      ...portfolioData,
      totalValue: 0,
      assets: portfolioData.assets || []
    });

    await portfolio.save();
    return this.formatResponse(portfolio, 'Portfolio created successfully');
  }

  async findById(id) {
    const portfolio = await this.portfolioModel.findById(id).populate('userId');

    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    return this.formatResponse(portfolio);
  }

  async findByUserId(userId) {
    const portfolios = await this.portfolioModel.find({ userId }).populate('userId');
    return this.formatResponse(portfolios);
  }

  async findAll(query = {}) {
    const portfolios = await this.portfolioModel.find(query).populate('userId');
    return this.formatResponse(portfolios);
  }

  async update(id, updateData) {
    const portfolio = await this.portfolioModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    return this.formatResponse(portfolio, 'Portfolio updated successfully');
  }

  async addAsset(portfolioId, assetData) {
    await this.validateData(assetData, ['symbol', 'amount', 'value']);

    const portfolio = await this.portfolioModel.findById(portfolioId);

    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    const existingAssetIndex = portfolio.assets.findIndex(
      asset => asset.symbol === assetData.symbol
    );

    if (existingAssetIndex >= 0) {
      portfolio.assets[existingAssetIndex].amount += assetData.amount;
      portfolio.assets[existingAssetIndex].value += assetData.value;
    } else {
      portfolio.assets.push(assetData);
    }

    portfolio.totalValue = portfolio.assets.reduce((total, asset) => total + asset.value, 0);
    portfolio.updatedAt = new Date();

    await portfolio.save();
    return this.formatResponse(portfolio, 'Asset added to portfolio successfully');
  }

  async removeAsset(portfolioId, symbol) {
    const portfolio = await this.portfolioModel.findById(portfolioId);

    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    portfolio.assets = portfolio.assets.filter(asset => asset.symbol !== symbol);
    portfolio.totalValue = portfolio.assets.reduce((total, asset) => total + asset.value, 0);
    portfolio.updatedAt = new Date();

    await portfolio.save();
    return this.formatResponse(portfolio, 'Asset removed from portfolio successfully');
  }

  async rebalance(portfolioId, newAssetAllocation) {
    const portfolio = await this.portfolioModel.findById(portfolioId);

    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    portfolio.assets = newAssetAllocation;
    portfolio.totalValue = portfolio.assets.reduce((total, asset) => total + asset.value, 0);
    portfolio.updatedAt = new Date();

    await portfolio.save();
    return this.formatResponse(portfolio, 'Portfolio rebalanced successfully');
  }

  async delete(id) {
    const portfolio = await this.portfolioModel.findByIdAndDelete(id);

    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    return this.formatResponse(null, 'Portfolio deleted successfully');
  }
}

module.exports = PortfolioService;