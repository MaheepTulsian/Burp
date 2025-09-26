const BaseService = require('./BaseService');

class TransactionService extends BaseService {
  constructor(transactionModel) {
    super();
    this.transactionModel = transactionModel;
  }

  async create(transactionData) {
    await this.validateData(transactionData, ['portfolioId', 'type', 'amount']);

    const transaction = new this.transactionModel({
      ...transactionData,
      status: 'pending'
    });

    await transaction.save();
    return this.formatResponse(transaction, 'Transaction created successfully');
  }

  async findById(id) {
    const transaction = await this.transactionModel.findById(id).populate('portfolioId');

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return this.formatResponse(transaction);
  }

  async findByPortfolioId(portfolioId) {
    const transactions = await this.transactionModel
      .find({ portfolioId })
      .populate('portfolioId')
      .sort({ createdAt: -1 });

    return this.formatResponse(transactions);
  }

  async findAll(query = {}) {
    const transactions = await this.transactionModel
      .find(query)
      .populate('portfolioId')
      .sort({ createdAt: -1 });

    return this.formatResponse(transactions);
  }

  async update(id, updateData) {
    const transaction = await this.transactionModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return this.formatResponse(transaction, 'Transaction updated successfully');
  }

  async updateStatus(id, status, txHash = null) {
    const validStatuses = ['pending', 'completed', 'failed'];

    if (!validStatuses.includes(status)) {
      throw new Error('Invalid transaction status');
    }

    const updateData = { status };
    if (txHash) {
      updateData.txHash = txHash;
    }

    const transaction = await this.transactionModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return this.formatResponse(transaction, 'Transaction status updated successfully');
  }

  async getPendingTransactions() {
    const transactions = await this.transactionModel
      .find({ status: 'pending' })
      .populate('portfolioId')
      .sort({ createdAt: 1 });

    return this.formatResponse(transactions);
  }

  async getTransactionsByType(type) {
    const validTypes = ['buy', 'sell', 'swap'];

    if (!validTypes.includes(type)) {
      throw new Error('Invalid transaction type');
    }

    const transactions = await this.transactionModel
      .find({ type })
      .populate('portfolioId')
      .sort({ createdAt: -1 });

    return this.formatResponse(transactions);
  }

  async delete(id) {
    const transaction = await this.transactionModel.findByIdAndDelete(id);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return this.formatResponse(null, 'Transaction deleted successfully');
  }
}

module.exports = TransactionService;