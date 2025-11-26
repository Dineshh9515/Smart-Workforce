const mongoose = require('mongoose');

const technicianSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    required: true,
    enum: ["Field Technician", "Supervisor", "Planner", "Engineer", "Other"]
  },
  primarySkill: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    default: []
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  status: {
    type: String,
    enum: ["Available", "On Job", "On Leave", "Inactive"],
    default: "Available"
  },
  shiftType: {
    type: String,
    enum: ["Day", "Night", "Rotational"],
    default: "Day"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Technician', technicianSchema);
