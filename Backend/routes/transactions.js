const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

const Transaction = require('../database/models/Transaction');
const TransactionService = require('../services/TransactionService');

const txService = new TransactionService(Transaction);

// Create a transaction (internal or user-initiated)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { basketId, clusterId, type, amount, currency, transactionHash, meta } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const result = await txService.createTransaction({
      userId,
      basketId,
      clusterId,
      type: type || 'purchase',
      amount,
      currency: currency || 'PYUSD',
      transactionHash: transactionHash || null,
      meta: meta || {}
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(txService.formatError(error, 500));
  }
});

// Get transactions for current user
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 100;
    const result = await txService.getUserTransactions(userId, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json(txService.formatError(error, 500));
  }
});

// Get transaction by id
router.get('/:txId', authenticateToken, async (req, res) => {
  try {
    const { txId } = req.params;
    const result = await txService.getTransactionById(txId);
    res.json(result);
  } catch (error) {
    res.status(500).json(txService.formatError(error, 500));
  }
});

module.exports = router;
