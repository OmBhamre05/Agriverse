const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Auth = require('../models/auth.model');

// Input validation middleware
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email ? emailRegex.test(email) : true; // Optional field
};

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
    const { phone, password, email, name, role = 'user' } = req.body;
    
    // Validate input
    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format. Must be 10 digits.' });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
    
    if (email && !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Check if user exists
    const existingUser = await Auth.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: `User already exists with this ${existingUser.phone === phone ? 'phone number' : 'email'}`
      });
    }

    // Create new user
    const user = await Auth.create({
      phone,
      password,
      email,
      name,
      role: ['user', 'farmer', 'mentor'].includes(role) ? role : 'user'
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login with phone and password
router.post('/login', async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    // Validate input
    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Authentication error', error: err.message });
      }
      if (!user) {
        return res.status(401).json({ message: info.message || 'Invalid credentials' });
      }

      const token = generateToken(user);
      res.json({ 
        token, 
        user: { 
          id: user._id, 
          role: user.role,
          name: user.name,
          phone: user.phone,
          email: user.email
        } 
      });
    })(req, res, next);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
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
