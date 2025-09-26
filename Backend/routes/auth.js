const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const { authenticateToken } = require('../middleware/auth');
const { createSignMessage } = require('../utils/walletAuth');

let authService;

const initializeAuthService = (userModel) => {
  authService = new AuthService(userModel);
};

router.post('/nonce', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    const result = await authService.generateNonce(walletAddress);

    const signMessage = createSignMessage(result.data.nonce, walletAddress);

    res.json({
      ...result,
      data: {
        ...result.data,
        signMessage
      }
    });
  } catch (error) {
    res.status(400).json(authService.formatError(error, 400));
  }
});

router.post('/authenticate', async (req, res) => {
  try {
    const { walletAddress, signature, nonce, useTypedSignature = false, domain = null } = req.body;

    if (!walletAddress || !signature || !nonce) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address, signature, and nonce are required'
      });
    }

    const result = await authService.authenticateWallet(
      walletAddress,
      signature,
      nonce,
      useTypedSignature,
      domain
    );

    res.json(result);
  } catch (error) {
    res.status(401).json(authService.formatError(error, 401));
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { walletAddress, signature, nonce, email } = req.body;

    if (!walletAddress || !signature || !nonce) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address, signature, and nonce are required'
      });
    }

    const additionalData = {};
    if (email) {
      additionalData.email = email;
    }

    const result = await authService.signup(walletAddress, signature, nonce, additionalData);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json(authService.formatError(error, 400));
  }
});

router.post('/login', async (req, res) => {
  try {
    const { walletAddress, signature, nonce } = req.body;

    if (!walletAddress || !signature || !nonce) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address, signature, and nonce are required'
      });
    }

    const result = await authService.login(walletAddress, signature, nonce);

    res.json(result);
  } catch (error) {
    res.status(401).json(authService.formatError(error, 401));
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await authService.getUserProfile(req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(404).json(authService.formatError(error, 404));
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await authService.updateProfile(req.user.userId, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json(authService.formatError(error, 400));
  }
});

router.get('/validate', authenticateToken, async (req, res) => {
  try {
    const result = await authService.validateSession(req.user.userId, req.user.walletAddress);
    res.json(result);
  } catch (error) {
    res.status(401).json(authService.formatError(error, 401));
  }
});

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json(authService.formatError(error, 500));
  }
});

module.exports = { router, initializeAuthService };