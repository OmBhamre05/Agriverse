const User = require('../models/User');
const Course = require('../models/Course');

// Get mentor profile with courses
exports.getMentorProfile = async (req, res) => {
  try {
    const mentor = await User.findById(req.user.id).select('-password');
    const courses = await Course.find({ mentor: req.user.id })
      .select('title thumbnail status averageRating enrolledStudents price');

    // Calculate total earnings and students
    const totalStudents = courses.reduce((acc, course) => 
      acc + course.enrolledStudents.length, 0);
    
    const stats = {
      totalCourses: courses.length,
      totalStudents,
      earnings: mentor.earnings,
      publishedCourses: courses.filter(course => course.status === 'published').length,
      averageRating: courses.reduce((acc, course) => 
        acc + (course.averageRating || 0), 0) / (courses.length || 1)
    };

    res.status(200).json({
      status: 'success',
      data: {
        mentor,
        stats,
        courses
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update mentor profile
exports.updateMentorProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'bio', 'expertise'];
    const updateData = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const mentor = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: {
        mentor
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get mentor earnings
exports.getMentorEarnings = async (req, res) => {
  try {
    const courses = await Course.find({ mentor: req.user.id })
      .populate({
        path: 'enrolledStudents',
        select: 'name'
      });

    const earningsByMonth = {};
    const earningsByCourse = {};

    courses.forEach(course => {
      earningsByCourse[course.title] = course.enrolledStudents.length * course.price;
      
      // You would typically get this from an Enrollment model with timestamps
      // This is a simplified version
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      earningsByMonth[currentMonth] = (earningsByMonth[currentMonth] || 0) + 
        (course.enrolledStudents.length * course.price);
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalEarnings: Object.values(earningsByCourse).reduce((a, b) => a + b, 0),
        earningsByMonth,
        earningsByCourse
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
