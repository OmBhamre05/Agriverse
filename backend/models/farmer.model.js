const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  auth_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  farm_size: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  aadhaar: {
    type: String,
    required: true
  },
  satbara: {
    type: String,
    required: true
  },
  verification_score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  rating_score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  total_score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  rank: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold'],
    default: 'Bronze'
  },
  commission_rate: {
    type: Number,
    default: 15 // Default to Bronze rate
  }
}, {
  timestamps: true
});

// Calculate total score and update rank/commission
farmerSchema.methods.updateScores = function() {
  // Update verification status first (threshold is 50)
  this.is_verified = this.verification_score >= 50;
  
  // Total score = 40% verification + 60% rating
  this.total_score = (this.verification_score * 0.4) + (this.rating_score * 0.6);
  
  // Update rank and commission based on total score
  if (this.total_score >= 60) {
    this.rank = 'Gold';
    this.commission_rate = 5;
  } else if (this.total_score >= 30) {
    this.rank = 'Silver';
    this.commission_rate = 10;
  } else {
    this.rank = 'Bronze';
    this.commission_rate = 15;
  }
};

module.exports = mongoose.model('Farmer', farmerSchema);
