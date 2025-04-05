const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Enrollment must belong to a user']
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'Enrollment must belong to a course']
  },
  paymentId: {
    type: String,
    required: [true, 'Payment ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'refunded'],
    default: 'active'
  },
  progress: [{
    video: {
      type: mongoose.Schema.ObjectId,
      ref: 'Video'
    },
    completed: {
      type: Boolean,
      default: false
    },
    watchTime: {
      type: Number,
      default: 0
    }
  }],
  completionPercentage: {
    type: Number,
    default: 0
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

// Index to ensure unique enrollment
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;
