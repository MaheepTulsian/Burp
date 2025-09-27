const BaseService = require('./BaseService');
const { generateToken } = require('../middleware/auth');
const {
  verifySignature,
  isValidEthereumAddress
} = require('../utils/walletAuth');

class AccountService extends BaseService {
  constructor(userModel) {
    super();
    this.userModel = userModel;
  }

  async createAccount(walletAddress, signature, nonce, profileData = {}) {
    try {
      // Validate wallet address format
      if (!isValidEthereumAddress(walletAddress)) {
        throw new Error('Invalid Ethereum wallet address');
      }

      // Verify signature from frontend
      const verificationResult = await verifySignature(walletAddress, signature, nonce);
      if (!verificationResult.isValid) {
        throw new Error(verificationResult.error || 'Signature verification failed');
      }

      const normalizedAddress = verificationResult.walletAddress;

      // Check if user already exists
      let user = await this.userModel.findOne({ walletAddress: normalizedAddress });

      if (user) {
        // Update last login time for existing user
        user.lastLoginAt = new Date();
        await user.save();
      } else {
        // Create new user account
        const userData = {
          walletAddress: normalizedAddress,
          email: profileData.email || null,
          preferences: profileData.preferences || {},
          accountCreatedAt: new Date(),
          lastLoginAt: new Date(),
          isActive: true
        };

        user = new this.userModel(userData);
        await user.save();
      }

      // Generate JWT session token
      const token = generateToken(user._id, normalizedAddress);

      return this.formatResponse({
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          email: user.email,
          preferences: user.preferences,
          accountCreatedAt: user.accountCreatedAt,
          lastLoginAt: user.lastLoginAt,
          isActive: user.isActive
        },
        token,
        isNewAccount: !user.lastLoginAt || user.accountCreatedAt.getTime() === user.lastLoginAt.getTime()
      }, user ? 'Account verified and logged in' : 'Account created successfully');

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
        {
          ...filteredUpdates,
          lastUpdated: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return this.formatResponse({
        id: user._id,
        walletAddress: user.walletAddress,
        email: user.email,
        preferences: user.preferences,
        lastUpdated: user.lastUpdated
      }, 'Profile updated successfully');

    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      return this.formatResponse({
        id: user._id,
        walletAddress: user.walletAddress,
        email: user.email,
        preferences: user.preferences,
        accountCreatedAt: user.accountCreatedAt,
        lastLoginAt: user.lastLoginAt,
        isActive: user.isActive
      }, 'Profile retrieved successfully');

    } catch (error) {
      throw error;
    }
  }

  async deactivateAccount(userId) {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        {
          isActive: false,
          deactivatedAt: new Date()
        },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return this.formatResponse({
        message: 'Account deactivated successfully'
      }, 'Account deactivated');

    } catch (error) {
      throw error;
    }
  }

  async getAccountStats() {
    try {
      const stats = await this.userModel.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: {
              $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
            },
            newUsersThisMonth: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      '$accountCreatedAt',
                      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]);

      return this.formatResponse(
        stats[0] || { totalUsers: 0, activeUsers: 0, newUsersThisMonth: 0 },
        'Account statistics retrieved'
      );

    } catch (error) {
      throw error;
    }
  }
}

module.exports = AccountService;