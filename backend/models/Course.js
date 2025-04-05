const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A course must have a title'],
    trim: true,
    maxlength: [100, 'Course title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'A course must have a description']
  },
  price: {
    type: Number,
    required: [true, 'A course must have a price']
  },
  mentor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A course must belong to a mentor']
  },
  thumbnail: {
    type: String,
    required: [true, 'A course must have a thumbnail']
  },
  videos: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Video'
  }],
  totalDuration: {
    type: Number,
    default: 0
  },
  enrolledStudents: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'A course must have a category']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for calculating total enrolled students
courseSchema.virtual('totalStudents').get(function() {
  return this.enrolledStudents.length;
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
