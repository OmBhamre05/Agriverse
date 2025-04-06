const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Course = require('../models/course.model');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = file.fieldname === 'thumbnail' ? 'uploads/thumbnails' : 'uploads/videos';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: file => {
      if (file.fieldname === 'thumbnail') {
        return 5 * 1024 * 1024; // 5MB limit for thumbnails
      }
      return 500 * 1024 * 1024; // 500MB limit for videos
    }
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
      if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
        return cb(new Error('Please upload an image file (jpg, jpeg, png, or webp)'));
      }
    } else if (file.fieldname === 'video') {
      if (!file.originalname.match(/\.(mp4|mov|avi|mkv|webm)$/i)) {
        return cb(new Error('Please upload a video file (mp4, mov, avi, mkv, or webm)'));
      }
    }
    cb(null, true);
  }
});

// Get all courses by mentor
router.get('/mentor', authenticateToken, async (req, res) => {
  // Check if user is a mentor
  if (req.user.role !== 'mentor') {
    return res.status(403).json({ message: 'Access denied. Only mentors can view their courses.' });
  }
  try {
    const courses = await Course.find({ mentor: req.user.id })
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get course by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add video to course
router.post('/:id/videos', authenticateToken, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this course' });
    }

    course.videos.push(req.file.filename);
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete video from course
router.delete('/:id/videos/:index', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this course' });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= course.videos.length) {
      return res.status(400).json({ message: 'Invalid video index' });
    }

    const videoFilename = course.videos[index];
    const videoPath = path.join(__dirname, '..', 'uploads', 'videos', videoFilename);
    
    try {
      await fs.unlink(videoPath);
    } catch (err) {
      console.error('Error deleting video file:', err);
    }

    course.videos.splice(index, 1);
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete course
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    // Delete thumbnail
    const thumbnailPath = path.join(__dirname, '..', 'uploads', 'thumbnails', course.thumbnail);
    try {
      await fs.unlink(thumbnailPath);
    } catch (err) {
      console.error('Error deleting thumbnail:', err);
    }

    // Delete videos
    for (const video of course.videos) {
      const videoPath = path.join(__dirname, '..', 'uploads', 'videos', video);
      try {
        await fs.unlink(videoPath);
      } catch (err) {
        console.error('Error deleting video:', err);
      }
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all courses by mentor
router.get('/mentor', authenticateToken, async (req, res) => {
  // Check if user is a mentor
  if (req.user.role !== 'mentor') {
    return res.status(403).json({ message: 'Access denied. Only mentors can view their courses.' });
  }
  try {
    const courses = await Course.find({ mentor: req.user.id })
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific course details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('mentor', 'name')
      .populate('reviews.user', 'name');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new course
router.post('/', 
  authenticateToken,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      if (!req.files.thumbnail || !req.files.video) {
        return res.status(400).json({ message: 'Both thumbnail and video are required' });
      }

      const courseData = {
        ...req.body,
        mentor: req.user.id,
        thumbnail: `/uploads/thumbnails/${req.files.thumbnail[0].filename}`,
        video: `/uploads/videos/${req.files.video[0].filename}`,
      };

      const course = new Course(courseData);
      await course.save();
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

// Update course
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    Object.keys(req.body).forEach(key => {
      course[key] = req.body[key];
    });

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete course
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
