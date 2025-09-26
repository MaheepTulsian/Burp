const BaseService = require('./BaseService');

class UserService extends BaseService {
  constructor(userModel) {
    super();
    this.userModel = userModel;
  }

  async create(userData) {
    await this.validateData(userData, ['walletAddress']);

    const existingUser = await this.userModel.findOne({
      walletAddress: userData.walletAddress
    });

    if (existingUser) {
      throw new Error('User with this wallet address already exists');
    }

    const user = new this.userModel(userData);
    await user.save();

    return this.formatResponse(user, 'User created successfully');
  }

  async findById(id) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return this.formatResponse(user);
  }

  async findByWalletAddress(walletAddress) {
    const user = await this.userModel.findOne({ walletAddress });

    if (!user) {
      throw new Error('User not found');
    }

    return this.formatResponse(user);
  }

  async findAll(query = {}) {
    const users = await this.userModel.find(query);
    return this.formatResponse(users);
  }

  async update(id, updateData) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return this.formatResponse(user, 'User updated successfully');
  }

  async delete(id) {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new Error('User not found');
    }

    return this.formatResponse(null, 'User deleted successfully');
  }
}

module.exports = UserService;