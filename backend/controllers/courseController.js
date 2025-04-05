const Course = require('../models/Course');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    // Add mentor ID from authenticated user
    req.body.mentor = req.user.id;
    
    const course = await Course.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get all courses (with filters)
exports.getAllCourses = async (req, res) => {
  try {
    let query = Course.find({ status: 'published' }); // Only show published courses to users

    // Filter by state
    if (req.query.state) {
      query = query.find({ state: req.query.state });
    }

    // Filter by language
    if (req.query.language) {
      query = query.find({ language: req.query.language });
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      let priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
      query = query.find({ price: priceFilter });
    }

    // Filter by rating
    if (req.query.minRating) {
      query = query.find({ averageRating: { $gte: Number(req.query.minRating) } });
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort by newest
    }

    // Populate mentor details
    query = query.populate('mentor', 'name expertise');

    const courses = await query;

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
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

// Get single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('mentor', 'name expertise')
      .populate('ratings.user', 'name');

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update course (only by mentor)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    // Check if the logged-in user is the course mentor
    if (course.mentor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only update your own courses'
      });
    }

    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        course: updatedCourse
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Change course status (publish/unpublish/archive)
exports.updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    // Check if the logged-in user is the course mentor
    if (course.mentor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only update your own courses'
      });
    }

    // Validate status
    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid status. Must be draft, published, or archived'
      });
    }

    course.status = status;
    await course.save();

    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Add/Update course video
exports.addCourseVideo = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    // Check if the logged-in user is the course mentor
    if (course.mentor.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only add videos to your own courses'
      });
    }

    // Add new video or update existing one
    const videoIndex = course.videos.findIndex(v => v.order === req.body.order);
    if (videoIndex > -1) {
      course.videos[videoIndex] = { ...course.videos[videoIndex], ...req.body };
    } else {
      course.videos.push(req.body);
    }

    // Sort videos by order
    course.videos.sort((a, b) => a.order - b.order);

    await course.save();

    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Add course rating and review
exports.addCourseRating = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course not found'
      });
    }

    // Check if user has enrolled in the course
    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only rate courses you are enrolled in'
      });
    }

    // Check if user has already rated
    const existingRatingIndex = course.ratings.findIndex(
      rating => rating.user.toString() === req.user.id
    );

    if (existingRatingIndex > -1) {
      // Update existing rating
      course.ratings[existingRatingIndex] = {
        user: req.user.id,
        rating: req.body.rating,
        review: req.body.review
      };
    } else {
      // Add new rating
      course.ratings.push({
        user: req.user.id,
        rating: req.body.rating,
        review: req.body.review
      });
    }

    await course.save();

    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
