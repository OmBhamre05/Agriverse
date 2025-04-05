const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Auth = require('../models/auth.model');

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Register with phone and password
router.post('/register', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Check if user exists
    const existingUser = await Auth.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await Auth.create({
      phone,
      password,
      role: 'user'
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login with phone and password
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Authentication error', error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: info.message || 'Authentication failed' });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, role: user.role } });
  })(req, res, next);
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// Get current user
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;
