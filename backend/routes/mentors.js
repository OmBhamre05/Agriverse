const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { protect, restrictTo } = require('../middlewares/auth');

// All routes require authentication and mentor role
router.use(protect);
router.use(restrictTo(2));

router.get('/profile', mentorController.getMentorProfile);
router.patch('/profile', mentorController.updateMentorProfile);
router.get('/earnings', mentorController.getMentorEarnings);

module.exports = router;
