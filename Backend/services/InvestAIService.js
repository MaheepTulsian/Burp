const BaseService = require('./BaseService');

class InvestAIService extends BaseService {
  constructor(investAIModel) {
    super();
    this.investAIModel = investAIModel;
  }

  async create(investAIData) {
    await this.validateData(investAIData, ['description']);

    const investAI = new this.investAIModel(investAIData);
    await investAI.save();

    return this.formatResponse(investAI, 'InvestAI description created successfully');
  }

  async findById(id) {
    const investAI = await this.investAIModel.findById(id);

    if (!investAI) {
      throw new Error('InvestAI description not found');
    }

    return this.formatResponse(investAI);
  }

  async findAll(query = {}) {
    const investAIs = await this.investAIModel
      .find(query)
      .sort({ createdAt: -1 });

    return this.formatResponse(investAIs);
  }

  async findByCategory(category) {
    const investAIs = await this.investAIModel
      .find({ category })
      .sort({ createdAt: -1 });

    return this.formatResponse(investAIs);
  }

  async findActive() {
    const investAIs = await this.investAIModel
      .find({ isActive: true })
      .sort({ createdAt: -1 });

    return this.formatResponse(investAIs);
  }

  async search(searchTerm) {
    const investAIs = await this.investAIModel
      .find({
        $or: [
          { description: { $regex: searchTerm, $options: 'i' } },
          { title: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      })
      .sort({ createdAt: -1 });

    return this.formatResponse(investAIs);
  }

  async update(id, updateData) {
    const investAI = await this.investAIModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!investAI) {
      throw new Error('InvestAI description not found');
    }

    return this.formatResponse(investAI, 'InvestAI description updated successfully');
  }

  async activate(id) {
    const investAI = await this.investAIModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!investAI) {
      throw new Error('InvestAI description not found');
    }

    return this.formatResponse(investAI, 'InvestAI description activated successfully');
  }

  async deactivate(id) {
    const investAI = await this.investAIModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!investAI) {
      throw new Error('InvestAI description not found');
    }

    return this.formatResponse(investAI, 'InvestAI description deactivated successfully');
  }

  async addTag(id, tag) {
    const investAI = await this.investAIModel.findById(id);

    if (!investAI) {
      throw new Error('InvestAI description not found');
    }

    if (!investAI.tags.includes(tag)) {
      investAI.tags.push(tag);
      await investAI.save();
    }

    return this.formatResponse(investAI, 'Tag added successfully');
  }

  async removeTag(id, tag) {
    const investAI = await this.investAIModel.findById(id);

    if (!investAI) {
      throw new Error('InvestAI description not found');
    }

    investAI.tags = investAI.tags.filter(t => t !== tag);
    await investAI.save();

    return this.formatResponse(investAI, 'Tag removed successfully');
  }

  async delete(id) {
    const investAI = await this.investAIModel.findByIdAndDelete(id);

    if (!investAI) {
      throw new Error('InvestAI description not found');
    }

    return this.formatResponse(null, 'InvestAI description deleted successfully');
  }
}

module.exports = InvestAIService;