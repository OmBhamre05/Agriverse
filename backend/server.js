const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initializeModules } = require('./models/learning.model');


// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Initialize default modules
    initializeModules();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Passport config
require('./config/passport')(passport);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/farmer', require('./routes/farmer.routes'));
app.use('/api/learning', require('./routes/learning.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
