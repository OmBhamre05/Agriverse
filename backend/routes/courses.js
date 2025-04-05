const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, restrictTo } = require('../middlewares/auth');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourse);

// Protected routes
router.use(protect); // All routes after this middleware require authentication

// Mentor only routes
router.post('/', restrictTo(2), courseController.createCourse);
router.patch('/:id', restrictTo(2), courseController.updateCourse);
router.patch('/:id/status', restrictTo(2), courseController.updateCourseStatus);
router.post('/:id/videos', restrictTo(2), courseController.addCourseVideo);

// Student routes (must be enrolled)
router.post('/:id/ratings', restrictTo(1), courseController.addCourseRating);

module.exports = router;
