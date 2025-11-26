const mongoose = require('mongoose');

const availabilitySlotSchema = mongoose.Schema({
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  shift: {
    type: String,
    enum: ["Morning", "Afternoon", "Night", "Full Day"],
    default: "Full Day"
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  reason: {
    type: String
  }
}, {
  timestamps: true
});

// Prevent duplicate slots for same technician on same date
availabilitySlotSchema.index({ technician: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('AvailabilitySlot', availabilitySlotSchema);
