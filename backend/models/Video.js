const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A video must have a title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'A video must belong to a course']
  },
  url: {
    type: String,
    required: [true, 'A video must have a URL']
  },
  duration: {
    type: Number,
    required: [true, 'A video must have a duration']
  },
  order: {
    type: Number,
    required: [true, 'Video order in the course is required']
  },
  thumbnail: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index to ensure videos are ordered correctly within a course
videoSchema.index({ courseId: 1, order: 1 });

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
