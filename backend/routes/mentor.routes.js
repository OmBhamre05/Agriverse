const express = require('express');
const router = express.Router();
const Course = require('../models/course.model');
const { authenticateToken } = require('../middleware/auth');

// Get mentor stats
router.get('/stats', authenticateToken, async (req, res) => {
  // Check if user is a mentor
  if (req.user.role !== 'mentor') {
    return res.status(403).json({ message: 'Access denied. Only mentors can view stats.' });
  }
  try {
    const mentorId = req.user.id;

    // Get all courses by the mentor
    const courses = await Course.find({ mentor: mentorId });

    // Calculate total students (unique students across all courses)
    const uniqueStudents = new Set();
    courses.forEach(course => {
      course.reviews.forEach(review => {
        uniqueStudents.add(review.user.toString());
      });
    });

    // Calculate total earnings (assuming a revenue share model)
    const totalEarnings = courses.reduce((sum, course) => {
      return sum + (course.price * uniqueStudents.size * 0.7); // 70% revenue share
    }, 0);

    const stats = {
      totalCourses: courses.length,
      totalStudents: uniqueStudents.size,
      totalEarnings: Math.round(totalEarnings),
      averageRating: courses.length ? 
        courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length 
        : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
