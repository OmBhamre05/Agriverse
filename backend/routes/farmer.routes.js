const express = require('express');
const router = express.Router();
const passport = require('passport');
const Farmer = require('../models/farmer.model');
const Auth = require('../models/auth.model');

// Middleware to check if user is authenticated
const authenticate = passport.authenticate('jwt', { session: false });

// Register as a farmer
router.post('/register', authenticate, async (req, res) => {
  try {
    // Check if user is already registered as farmer
    const existingFarmer = await Farmer.findOne({ auth_id: req.user._id });
    if (existingFarmer) {
      return res.status(400).json({ message: 'Already registered as farmer' });
    }

    // Create new farmer profile
    const farmer = new Farmer({
      auth_id: req.user._id,
      name: req.body.name,
      location: req.body.location,
      farm_size: req.body.farm_size,
      phone: req.body.phone,
      aadhaar: req.body.aadhaar,
      satbara: req.body.satbara
    });

    await farmer.save();

    // Update user role to farmer
    await Auth.findByIdAndUpdate(req.user._id, { role: 'farmer', farmer_id: farmer._id });

    res.status(201).json({ 
      message: 'Farmer registration successful',
      farmer
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error registering farmer',
      error: error.message 
    });
  }
});

// Get farmer profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ auth_id: req.user._id });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }
    res.json(farmer);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching farmer profile',
      error: error.message 
    });
  }
});

// Update farmer verification score
router.put('/verification', authenticate, async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ auth_id: req.user._id });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    // Update verification score
    farmer.verification_score = req.body.verification_score;
    farmer.updateScores(); // This will update total_score, rank, and commission_rate
    await farmer.save();

    res.json({
      message: 'Verification score updated',
      farmer
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating verification score',
      error: error.message 
    });
  }
});

// Get farmer verification status
router.get('/verification-status', authenticate, async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ auth_id: req.user._id });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    res.json({
      verification_score: farmer.verification_score,
      is_verified: farmer.is_verified,
      rank: farmer.rank,
      commission_rate: farmer.commission_rate
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching verification status',
      error: error.message 
    });
  }
});

module.exports = router;
