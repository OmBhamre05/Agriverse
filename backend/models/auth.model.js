const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const authSchema = new mongoose.Schema({
  phone: {
    type: String,
    sparse: true,
    unique: true
  },
  password: {
    type: String
  },
  google_id: {
    type: String,
    sparse: true,
    unique: true
  },
  email: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'farmer'],
    default: 'user'
  },
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
authSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
authSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Auth', authSchema);
