const ActivityLog = require('../models/ActivityLog');

// @desc    Get activity logs
// @route   GET /api/activity-logs
// @access  Public
const getActivityLogs = async (req, res, next) => {
  try {
    const { type, entityType, limit = 50 } = req.query;
    const query = {};

    if (type) query.type = type;
    if (entityType) query.entityType = entityType;

    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(logs);
  } catch (error) {
    next(error);
  }
};

// Helper function to create log internally
const createLog = async (data) => {
  try {
    await ActivityLog.create(data);
  } catch (error) {
    console.error('Error creating activity log:', error);
  }
};

module.exports = {
  getActivityLogs,
  createLog
};
