const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  basketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Basket' },
  clusterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Basket' },
  type: { type: String, enum: ['purchase', 'sell', 'swap'], default: 'purchase' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'PYUSD' },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  transactionHash: { type: String, default: null },
  meta: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
