const express = require('express');
const router = express.Router();
const passport = require('passport');
const Auth = require('../models/auth.model');

// Save user interests
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { interests } = req.body;
    
    if (!interests || !Array.isArray(interests) || interests.length < 3) {
      return res.status(400).json({ message: 'Please select at least 3 interests' });
    }

    // Update user interests
    const user = await Auth.findByIdAndUpdate(
      req.user._id,
      { interests },
      { new: true }
    );

    res.json({ message: 'Interests saved successfully', interests: user.interests });
  } catch (error) {
    res.status(500).json({ message: 'Error saving interests', error: error.message });
  }
});

// Get user interests
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await Auth.findById(req.user._id);
    res.json({ interests: user.interests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interests', error: error.message });
  }
});

module.exports = router;
