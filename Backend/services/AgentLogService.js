const BaseService = require('./BaseService');

class AgentLogService extends BaseService {
  constructor(agentLogModel) {
    super();
    this.agentLogModel = agentLogModel;
  }

  async create(logData) {
    await this.validateData(logData, ['agentName', 'action', 'status']);

    const agentLog = new this.agentLogModel(logData);
    await agentLog.save();

    return this.formatResponse(agentLog, 'Agent log created successfully');
  }

  async findById(id) {
    const agentLog = await this.agentLogModel.findById(id);

    if (!agentLog) {
      throw new Error('Agent log not found');
    }

    return this.formatResponse(agentLog);
  }

  async findAll(query = {}) {
    const agentLogs = await this.agentLogModel
      .find(query)
      .sort({ timestamp: -1 });

    return this.formatResponse(agentLogs);
  }

  async findByAgent(agentName) {
    const agentLogs = await this.agentLogModel
      .find({ agentName })
      .sort({ timestamp: -1 });

    return this.formatResponse(agentLogs);
  }

  async findByAction(action) {
    const agentLogs = await this.agentLogModel
      .find({ action })
      .sort({ timestamp: -1 });

    return this.formatResponse(agentLogs);
  }

  async findByStatus(status) {
    const validStatuses = ['success', 'error', 'pending'];

    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const agentLogs = await this.agentLogModel
      .find({ status })
      .sort({ timestamp: -1 });

    return this.formatResponse(agentLogs);
  }

  async findByDateRange(startDate, endDate) {
    const agentLogs = await this.agentLogModel
      .find({
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      })
      .sort({ timestamp: -1 });

    return this.formatResponse(agentLogs);
  }

  async getRecentLogs(limit = 50) {
    const agentLogs = await this.agentLogModel
      .find()
      .sort({ timestamp: -1 })
      .limit(limit);

    return this.formatResponse(agentLogs);
  }

  async getAgentActivity(agentName, timeframe = '24h') {
    const timeframes = {
      '1h': 1,
      '24h': 24,
      '7d': 24 * 7,
      '30d': 24 * 30
    };

    const hours = timeframes[timeframe] || 24;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const agentLogs = await this.agentLogModel
      .find({
        agentName,
        timestamp: { $gte: startTime }
      })
      .sort({ timestamp: -1 });

    return this.formatResponse(agentLogs);
  }

  async update(id, updateData) {
    const agentLog = await this.agentLogModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!agentLog) {
      throw new Error('Agent log not found');
    }

    return this.formatResponse(agentLog, 'Agent log updated successfully');
  }

  async delete(id) {
    const agentLog = await this.agentLogModel.findByIdAndDelete(id);

    if (!agentLog) {
      throw new Error('Agent log not found');
    }

    return this.formatResponse(null, 'Agent log deleted successfully');
  }

  async deleteOldLogs(daysOld = 30) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

    const result = await this.agentLogModel.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    return this.formatResponse({
      deletedCount: result.deletedCount
    }, `Deleted ${result.deletedCount} old logs`);
  }
}

module.exports = AgentLogService;