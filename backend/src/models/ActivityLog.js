const mongoose = require('mongoose');

const activityLogSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "JOB_CREATED",
      "JOB_UPDATED",
      "JOB_STATUS_CHANGED",
      "TECHNICIAN_STATUS_CHANGED",
      "ASSET_STATUS_CHANGED"
    ]
  },
  message: {
    type: String,
    required: true
  },
  entityType: {
    type: String
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
