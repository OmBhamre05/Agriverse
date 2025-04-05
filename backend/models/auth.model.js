const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const authSchema = new mongoose.Schema({
  phone: {
    type: String,
    sparse: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Must be 10 digits.`
    }
  },
  password: {
    type: String,
    required: function() {
      return !this.google_id; // Password required only if not using Google OAuth
    },
    minlength: [6, 'Password must be at least 6 characters long']
  },
  google_id: {
    type: String,
    sparse: true,
    unique: true
  },
  email: {
    type: String,
    sparse: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  role: {
    type: String,
    enum: ['user', 'mentor'],
    default: 'user'
  },
  interests: [{
    type: String,
    required: true
  }],
  name: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
authSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Compare password method
authSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('Auth', authSchema);
