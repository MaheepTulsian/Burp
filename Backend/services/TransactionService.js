const BaseService = require('./BaseService');

class TransactionService extends BaseService {
  constructor(TransactionModel) {
    super();
    this.Transaction = TransactionModel;
  }

  async createTransaction(data) {
    try {
      const tx = new this.Transaction(data);
      await tx.save();
      return this.formatResult(tx, 'Transaction created');
    } catch (error) {
      return this.formatError(error, 400, 'Failed to create transaction');
    }
  }

  async getUserTransactions(userId, limit = 50) {
    try {
      const txs = await this.Transaction.find({ userId }).sort({ createdAt: -1 }).limit(limit);
      return this.formatResult(txs, 'User transactions retrieved');
    } catch (error) {
      return this.formatError(error, 500, 'Failed to fetch transactions');
    }
  }

  async getTransactionById(txId) {
    try {
      const tx = await this.Transaction.findById(txId);
      if (!tx) return this.formatError(new Error('Not found'), 404, 'Transaction not found');
      return this.formatResult(tx, 'Transaction retrieved');
    } catch (error) {
      return this.formatError(error, 500, 'Failed to fetch transaction');
    }
  }
}

module.exports = TransactionService;
