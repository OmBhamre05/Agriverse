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
  thumbnail: {
    type: String,
    required: [true, 'A course must have a thumbnail']
  },
  mentor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A course must belong to a mentor']
  },
  state: {
    type: String,
    required: [true, 'Please specify the state/region']
  },
  language: {
    type: String,
    required: [true, 'Please specify the language of the course'],
    enum: ['Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati']
  },
  videos: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    url: {
      type: String,
      required: true
    },
    duration: Number,
    order: {
      type: Number,
      required: true
    }
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
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    review: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be below 0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => val === 0 ? 0 : Math.round(val * 10) / 10 // Round to 1 decimal place if not zero
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

// Middleware to calculate average rating before saving
courseSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((acc, item) => acc + item.rating, 0) / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

// Middleware to calculate total duration before saving
courseSchema.pre('save', function(next) {
  if (this.videos && this.videos.length > 0) {
    this.totalDuration = this.videos.reduce((acc, video) => acc + (video.duration || 0), 0);
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
