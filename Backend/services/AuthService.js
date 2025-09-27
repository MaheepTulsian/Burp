const BaseService = require('./BaseService');
const { generateToken } = require('../middleware/auth');
const {
  createNonce,
  verifySignature,
  verifyTypedSignature,
  isValidEthereumAddress
} = require('../utils/walletAuth');

class AuthService extends BaseService {
  constructor(userModel) {
    super();
    this.userModel = userModel;
  }

  async generateNonce(walletAddress) {
    try {
      if (!isValidEthereumAddress(walletAddress)) {
        throw new Error('Invalid Ethereum wallet address');
      }

      const { nonce, signMessage } = createNonce(walletAddress);

      return this.formatResponse({
        nonce,
        signMessage,
        walletAddress: walletAddress.toLowerCase()
      }, 'Nonce generated successfully');
    } catch (error) {
      throw error;
    }
  }

  async authenticateWallet(walletAddress, signature, nonce, useTypedSignature = false, domain = null) {
    try {
      let verificationResult;

      if (useTypedSignature && domain) {
        verificationResult = await verifyTypedSignature(walletAddress, signature, nonce, domain);
      } else {
        verificationResult = await verifySignature(walletAddress, signature, nonce);
      }

      if (!verificationResult.isValid) {
        throw new Error(verificationResult.error || 'Signature verification failed');
      }

      const normalizedAddress = verificationResult.walletAddress;

      let user = await this.userModel.findOne({ walletAddress: normalizedAddress });

      if (!user) {
        user = new this.userModel({
          walletAddress: normalizedAddress,
          createdAt: new Date()
        });
        await user.save();
      }

      const token = generateToken(user._id, normalizedAddress);

      return this.formatResponse({
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      }, 'Authentication successful');
    } catch (error) {
      throw error;
    }
  }

  async signup(walletAddress, signature, nonce, additionalData = {}) {
    try {
      const verificationResult = await verifySignature(walletAddress, signature, nonce);

      if (!verificationResult.isValid) {
        throw new Error(verificationResult.error || 'Signature verification failed');
      }

      const normalizedAddress = verificationResult.walletAddress;

      const existingUser = await this.userModel.findOne({ walletAddress: normalizedAddress });

      if (existingUser) {
        throw new Error('User with this wallet address already exists');
      }

      const userData = {
        walletAddress: normalizedAddress,
        ...additionalData,
        createdAt: new Date()
      };

      const user = new this.userModel(userData);
      await user.save();

      const token = generateToken(user._id, normalizedAddress);

      return this.formatResponse({
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      }, 'User created successfully');
    } catch (error) {
      throw error;
    }
  }

  async login(walletAddress, signature, nonce) {
    try {
      const verificationResult = await verifySignature(walletAddress, signature, nonce);

      if (!verificationResult.isValid) {
        throw new Error(verificationResult.error || 'Signature verification failed');
      }

      const normalizedAddress = verificationResult.walletAddress;

      const user = await this.userModel.findOne({ walletAddress: normalizedAddress });

      if (!user) {
        throw new Error('User not found. Please sign up first.');
      }

      const token = generateToken(user._id, normalizedAddress);

      return this.formatResponse({
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      }, 'Login successful');
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      return this.formatResponse({
        id: user._id,
        walletAddress: user.walletAddress,
        email: user.email,
        createdAt: user.createdAt
      }, 'Profile retrieved successfully');
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const allowedUpdates = ['email', 'preferences'];
      const filteredUpdates = {};

      allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredUpdates[field] = updateData[field];
        }
      });

      const user = await this.userModel.findByIdAndUpdate(
        userId,
        filteredUpdates,
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return this.formatResponse({
        id: user._id,
        walletAddress: user.walletAddress,
        email: user.email,
        createdAt: user.createdAt
      }, 'Profile updated successfully');
    } catch (error) {
      throw error;
    }
  }

  async validateSession(userId, walletAddress) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user || user.walletAddress !== walletAddress) {
        throw new Error('Invalid session');
      }

      return this.formatResponse({
        valid: true,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          email: user.email
        }
      }, 'Session is valid');
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;