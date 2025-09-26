class BaseService {
  constructor() {
    this.name = this.constructor.name;
  }

  async create(data) {
    throw new Error(`create method not implemented in ${this.name}`);
  }

  async findById(id) {
    throw new Error(`findById method not implemented in ${this.name}`);
  }

  async findAll(query = {}) {
    throw new Error(`findAll method not implemented in ${this.name}`);
  }

  async update(id, data) {
    throw new Error(`update method not implemented in ${this.name}`);
  }

  async delete(id) {
    throw new Error(`delete method not implemented in ${this.name}`);
  }

  async validateData(data, requiredFields = []) {
    const errors = [];

    requiredFields.forEach(field => {
      if (!data[field]) {
        errors.push(`${field} is required`);
      }
    });

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    return true;
  }

  formatResponse(data, message = 'Success') {
    return {
      success: true,
      message,
      data
    };
  }

  formatError(error, statusCode = 500) {
    return {
      success: false,
      message: error.message || 'Internal server error',
      statusCode,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    };
  }
}

module.exports = BaseService;