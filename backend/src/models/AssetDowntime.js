const mongoose = require('mongoose');

const assetDowntimeSchema = mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  },
  endedAt: {
    type: Date
  },
  reason: {
    type: String
  }
}, {
  timestamps: true
});

assetDowntimeSchema.index({ asset: 1, startedAt: -1 });

module.exports = mongoose.model('AssetDowntime', assetDowntimeSchema);
