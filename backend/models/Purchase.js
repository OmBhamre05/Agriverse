const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Purchase must belong to a user']
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'Purchase must belong to a course']
  },
  amount: {
    type: Number,
    required: [true, 'Purchase must have an amount']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['card', 'upi', 'netbanking']
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  },
  // Track course progress
  progress: {
    completedVideos: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Video'
    }],
    lastWatched: {
      video: {
        type: mongoose.Schema.ObjectId,
        ref: 'Video'
      },
      timestamp: Number // Last watched position in seconds
    },
    completionPercentage: {
      type: Number,
      default: 0
    }
  }
});

// Create unique compound index
purchaseSchema.index({ user: 1, course: 1 }, { unique: true });

// Update mentor earnings after successful purchase
purchaseSchema.post('save', async function(doc) {
  if (doc.status === 'completed') {
    const course = await mongoose.model('Course').findById(doc.course);
    if (course) {
      const mentor = await mongoose.model('User').findById(course.mentor);
      if (mentor) {
        mentor.earnings += doc.amount;
        await mentor.save();
      }
    }
  }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
