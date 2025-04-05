const mongoose = require('mongoose');

// Schema for tracking video completion and proofs
const videoProgressSchema = new mongoose.Schema({
  video_id: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  proof_image: {
    type: String,
    default: null
  },
  submission_date: {
    type: Date,
    default: null
  }
});

// Schema for tracking module progress
const moduleProgressSchema = new mongoose.Schema({
  module_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  completed_videos: [videoProgressSchema],
  module_completed: {
    type: Boolean,
    default: false
  }
});

// Main progress tracking schema
const progressSchema = new mongoose.Schema({
  auth_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
    unique: true
  },
  module_progress: [moduleProgressSchema],
  total_progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  total_proofs: {
    type: Number,
    default: 0,
    min: 0,
    max: 12  // 4 modules * 3 videos = 12 total possible proofs
  }
}, {
  timestamps: true
});

// Method to calculate total progress
progressSchema.methods.calculateProgress = function() {
  if (!this.module_progress.length) return 0;
  
  const totalVideos = this.module_progress.reduce((sum, module) => 
    sum + module.completed_videos.length, 0);
  
  const completedVideos = this.module_progress.reduce((sum, module) => 
    sum + module.completed_videos.filter(video => video.completed).length, 0);
  
  return totalVideos ? Math.round((completedVideos / totalVideos) * 100) : 0;
};

// Method to update verification score
progressSchema.methods.getVerificationScore = function() {
  const progressScore = (this.total_progress / 100) * 60;  // 60% weightage
  const proofScore = (this.total_proofs / 12) * 40;       // 40% weightage
  return progressScore + proofScore;
};

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
