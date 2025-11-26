const mongoose = require('mongoose');

const assetSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  assetTag: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  criticality: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  status: {
    type: String,
    enum: ["Operational", "Under Maintenance", "Down", "Decommissioned"],
    default: "Operational"
  },
  lastMaintenanceDate: {
    type: Date
  },
  nextMaintenanceDue: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Asset', assetSchema);
