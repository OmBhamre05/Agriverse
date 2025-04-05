const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const { Module } = require('../models/learning.model');
const Progress = require('../models/progress.model');
const Farmer = require('../models/farmer.model');

// Multer configuration for proof uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/proofs/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png) are allowed!'));
  }
});

// Middleware to check authentication
const authenticate = passport.authenticate('jwt', { session: false });

// Helper function to initialize progress
async function initializeProgress(userId) {
  try {
    const modules = await Module.find().sort('order');
    const moduleProgress = modules.map(module => ({
      module_id: module._id,
      completed_videos: module.videos.map(video => ({
        video_id: video.video_id,
        completed: false
      }))
    }));

    const progress = await Progress.create({
      auth_id: userId,
      module_progress: moduleProgress,
      total_progress: 0,
      total_proofs: 0
    });

    return progress;
  } catch (error) {
    console.error('Error initializing progress:', error);
    throw error;
  }
}

// Reset all progress (for testing)
router.post('/reset', authenticate, async (req, res) => {
  try {
    await Progress.deleteMany({});
    res.json({ message: 'All progress reset' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting progress', error: error.message });
  }
});

// Get all learning modules
router.get('/modules', authenticate, async (req, res) => {
  try {
    const modules = await Module.find().sort('order');
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules', error: error.message });
  }
});

// Get or initialize user's learning progress
router.get('/progress', authenticate, async (req, res) => {
  try {
    let progress = await Progress.findOne({ auth_id: req.user._id });
    
    if (!progress) {
      progress = await initializeProgress(req.user._id);
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
});

// Mark video as completed
router.post('/complete-video/:videoId', authenticate, async (req, res) => {
  try {
    let progress = await Progress.findOne({ auth_id: req.user._id });
    
    if (!progress) {
      progress = await initializeProgress(req.user._id);
    }

    // Find and update the video completion status
    let videoFound = false;
    for (const module of progress.module_progress) {
      const video = module.completed_videos.find(v => v.video_id === req.params.videoId);
      if (video) {
        video.completed = true;
        videoFound = true;
        break;
      }
    }

    if (!videoFound) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update total progress
    progress.total_progress = progress.calculateProgress();
    await progress.save();

    // If user is a farmer, update verification score
    if (req.user.role === 'farmer' && req.user.farmer_id) {
      const farmer = await Farmer.findById(req.user.farmer_id);
      if (farmer) {
        farmer.verification_score = progress.getVerificationScore();
        farmer.updateScores();
        await farmer.save();
      }
    }

    res.json({
      message: 'Video marked as completed',
      progress: progress,
      total_progress: progress.total_progress,
      verification_score: progress.getVerificationScore()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
});

// Submit proof for a video
router.post('/submit-proof/:videoId', authenticate, upload.single('proof'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No proof image uploaded' });
    }

    let progress = await Progress.findOne({ auth_id: req.user._id });
    
    if (!progress) {
      progress = await initializeProgress(req.user._id);
    }

    // Find and update the video proof
    let videoFound = false;
    for (const module of progress.module_progress) {
      const video = module.completed_videos.find(v => v.video_id === req.params.videoId);
      if (video) {
        video.proof_image = req.file.path;
        video.submission_date = new Date();
        videoFound = true;
        break;
      }
    }

    if (!videoFound) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update total proofs count
    progress.total_proofs = progress.module_progress.reduce((sum, module) => 
      sum + module.completed_videos.filter(v => v.proof_image).length, 0);
    
    await progress.save();

    // If user is a farmer, update verification score
    if (req.user.role === 'farmer' && req.user.farmer_id) {
      const farmer = await Farmer.findById(req.user.farmer_id);
      if (farmer) {
        farmer.verification_score = progress.getVerificationScore();
        farmer.updateScores();
        await farmer.save();
      }
    }

    res.json({
      message: 'Proof submitted successfully',
      progress: progress,
      total_proofs: progress.total_proofs,
      verification_score: progress.getVerificationScore()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting proof', error: error.message });
  }
});

module.exports = router;
