const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Medium"
  },
  status: {
    type: String,
    enum: ["Planned", "Assigned", "In Progress", "Completed", "Cancelled"],
    default: "Planned"
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset'
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician'
  },
  plannedDate: {
    type: Date
  },
  scheduledStart: {
    type: Date
  },
  scheduledEnd: {
    type: Date
  },
  actualStart: {
    type: Date
  },
  actualEnd: {
    type: Date
  },
  notes: {
    type: String
  },
  slaHours: {
    type: Number
  },
  dueAt: {
    type: Date
  },
  isOverdue: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
