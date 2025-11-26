const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String
  },
  passwordHash: {
    type: String
  },
  role: {
    type: String,
    enum: ["ADMIN", "PLANNER", "TECHNICIAN"],
    default: "PLANNER"
  },
  provider: {
    type: String,
    enum: ["local", "github", "google"],
    default: "local"
  },
  providerId: {
    type: String
  },
  linkedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician'
  }
}, {
  timestamps: true
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
