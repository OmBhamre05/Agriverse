const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: Number,
    enum: [1, 2], // 1: user(farmer), 2: mentor
    default: 1
  },
  profilePicture: {
    type: String,
    default: 'default.jpg'
  },
  bio: {
    type: String,
    trim: true
  },
  // For mentors only
  expertise: [{
    type: String
  }],
  earnings: {
    type: Number,
    default: 0
  },
  // For farmers only
  purchasedCourses: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Course'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if password is correct
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
