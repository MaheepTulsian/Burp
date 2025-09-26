const BaseService = require('./BaseService');

class StrategyService extends BaseService {
  constructor(strategyModel) {
    super();
    this.strategyModel = strategyModel;
  }

  async create(strategyData) {
    await this.validateData(strategyData, ['name', 'type', 'config']);

    const strategy = new this.strategyModel(strategyData);
    await strategy.save();

    return this.formatResponse(strategy, 'Strategy created successfully');
  }

  async findById(id) {
    const strategy = await this.strategyModel.findById(id);

    if (!strategy) {
      throw new Error('Strategy not found');
    }

    return this.formatResponse(strategy);
  }

  async findAll(query = {}) {
    const strategies = await this.strategyModel.find(query);
    return this.formatResponse(strategies);
  }

  async findByType(type) {
    const strategies = await this.strategyModel.find({ type });
    return this.formatResponse(strategies);
  }

  async findActiveStrategies() {
    const strategies = await this.strategyModel.find({ isActive: true });
    return this.formatResponse(strategies);
  }

  async update(id, updateData) {
    const strategy = await this.strategyModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!strategy) {
      throw new Error('Strategy not found');
    }

    return this.formatResponse(strategy, 'Strategy updated successfully');
  }

  async activate(id) {
    const strategy = await this.strategyModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!strategy) {
      throw new Error('Strategy not found');
    }

    return this.formatResponse(strategy, 'Strategy activated successfully');
  }

  async deactivate(id) {
    const strategy = await this.strategyModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!strategy) {
      throw new Error('Strategy not found');
    }

    return this.formatResponse(strategy, 'Strategy deactivated successfully');
  }

  async updatePerformanceMetrics(id, metrics) {
    await this.validateData(metrics, ['totalReturn', 'sharpeRatio']);

    const strategy = await this.strategyModel.findByIdAndUpdate(
      id,
      { performanceMetrics: metrics },
      { new: true }
    );

    if (!strategy) {
      throw new Error('Strategy not found');
    }

    return this.formatResponse(strategy, 'Performance metrics updated successfully');
  }

  async delete(id) {
    const strategy = await this.strategyModel.findByIdAndDelete(id);

    if (!strategy) {
      throw new Error('Strategy not found');
    }

    return this.formatResponse(null, 'Strategy deleted successfully');
  }
}

module.exports = StrategyService;