const Purchase = require('../models/Purchase');
const Course = require('../models/Course');
const crypto = require('crypto');

// Generate a unique transaction ID
const generateTransactionId = () => {
  return `TXN${Date.now()}${crypto.randomBytes(4).toString('hex')}`;
};

// Initiate course purchase
exports.initiatePurchase = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    // Check if user has already purchased this course
    const existingPurchase = await Purchase.findOne({
      user: req.user.id,
      course: course._id
    });

    if (existingPurchase) {
      return res.status(400).json({
        status: 'fail',
        message: 'You have already purchased this course'
      });
    }

    // Create a new purchase record
    const purchase = await Purchase.create({
      user: req.user.id,
      course: course._id,
      amount: course.price,
      paymentMethod: req.body.paymentMethod,
      transactionId: generateTransactionId(),
      status: 'pending'
    });

    res.status(201).json({
      status: 'success',
      data: {
        purchase,
        paymentDetails: {
          amount: course.price,
          transactionId: purchase.transactionId,
          course: {
            title: course.title,
            mentor: course.mentor
          }
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Confirm payment and complete purchase
exports.confirmPurchase = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const purchase = await Purchase.findOne({ transactionId });
    
    if (!purchase) {
      return res.status(404).json({
        status: 'fail',
        message: 'Purchase not found'
      });
    }

    // In a real payment integration, we would verify the payment status here
    // For now, we'll simply mark it as completed
    purchase.status = 'completed';
    await purchase.save();

    // Add user to course's enrolled students
    await Course.findByIdAndUpdate(purchase.course, {
      $addToSet: { enrolledStudents: purchase.user }
    });

    res.status(200).json({
      status: 'success',
      data: {
        purchase
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get user's purchased courses
exports.getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      user: req.user.id,
      status: 'completed'
    }).populate({
      path: 'course',
      select: 'title thumbnail videos totalDuration',
      populate: {
        path: 'mentor',
        select: 'name'
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        purchases
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update course progress
exports.updateProgress = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      user: req.user.id,
      course: req.params.courseId,
      status: 'completed'
    });

    if (!purchase) {
      return res.status(404).json({
        status: 'fail',
        message: 'Purchase not found or course not bought'
      });
    }

    const { videoId, timestamp, completed } = req.body;

    // Update last watched video
    purchase.progress.lastWatched = {
      video: videoId,
      timestamp
    };

    // Mark video as completed if specified
    if (completed && !purchase.progress.completedVideos.includes(videoId)) {
      purchase.progress.completedVideos.push(videoId);
    }

    // Calculate completion percentage
    const course = await Course.findById(req.params.courseId);
    purchase.progress.completionPercentage = 
      (purchase.progress.completedVideos.length / course.videos.length) * 100;

    await purchase.save();

    res.status(200).json({
      status: 'success',
      data: {
        progress: purchase.progress
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
