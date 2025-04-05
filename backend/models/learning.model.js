const mongoose = require('mongoose');

// Schema for individual videos
const videoSchema = new mongoose.Schema({
  video_id: {
    type: String,
    required: true,
    unique: true
  },
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
  order: Number
});

// Schema for learning modules
const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  order: Number,
  videos: [videoSchema]
}, {
  timestamps: true
});

const Module = mongoose.model('Module', moduleSchema);

// Function to initialize default modules
async function initializeModules() {
  try {
    // Clear existing modules
    await Module.deleteMany({});
    console.log('Cleared existing modules');

    const defaultModules = [
      {
        title: 'Organic Farming Basics',
        description: 'Learn the fundamentals of organic farming',
        order: 1,
        videos: [
          {
            video_id: 'org_1_1',
            title: 'Introduction to Organic Farming',
            description: 'Basic principles and benefits',
            url: '/videos/organic/intro.mp4',  
            duration: 300,
            order: 1
          },
          {
            video_id: 'org_1_2',
            title: 'Soil Management',
            description: 'Organic soil preparation techniques',
            url: '/videos/organic/soil.mp4',
            duration: 360,
            order: 2
          },
          {
            video_id: 'org_1_3',
            title: 'Natural Pest Control',
            description: 'Managing pests without chemicals',
            url: '/videos/organic/pest.mp4',
            duration: 420,
            order: 3
          }
        ]
      },
      {
        title: 'Water Management',
        description: 'Efficient water usage techniques',
        order: 2,
        videos: [
          {
            video_id: 'water_2_1',
            title: 'Water Conservation',
            description: 'Basic water saving techniques',
            url: '/videos/water/conservation.mp4',
            duration: 300,
            order: 1
          },
          {
            video_id: 'water_2_2',
            title: 'Irrigation Systems',
            description: 'Modern irrigation methods',
            url: '/videos/water/irrigation.mp4',
            duration: 360,
            order: 2
          },
          {
            video_id: 'water_2_3',
            title: 'Rainwater Harvesting',
            description: 'Collecting and using rainwater',
            url: '/videos/water/rainwater.mp4',
            duration: 420,
            order: 3
          }
        ]
      },
      {
        title: 'Sustainable Practices',
        description: 'Long-term sustainable farming methods',
        order: 3,
        videos: [
          {
            video_id: 'sust_3_1',
            title: 'Crop Rotation',
            description: 'Benefits and implementation',
            url: '/videos/sustainable/rotation.mp4',
            duration: 300,
            order: 1
          },
          {
            video_id: 'sust_3_2',
            title: 'Composting',
            description: 'Creating and using compost',
            url: '/videos/sustainable/compost.mp4',
            duration: 360,
            order: 2
          },
          {
            video_id: 'sust_3_3',
            title: 'Natural Fertilizers',
            description: 'Making organic fertilizers',
            url: '/videos/sustainable/fertilizer.mp4',
            duration: 420,
            order: 3
          }
        ]
      },
      {
        title: 'Modern Farming',
        description: 'Modern agricultural techniques',
        order: 4,
        videos: [
          {
            video_id: 'mod_4_1',
            title: 'Smart Farming',
            description: 'Technology in agriculture',
            url: '/videos/modern/smart.mp4',
            duration: 300,
            order: 1
          },
          {
            video_id: 'mod_4_2',
            title: 'Data-Driven Decisions',
            description: 'Using data for better yields',
            url: '/videos/modern/data.mp4',
            duration: 360,
            order: 2
          },
          {
            video_id: 'mod_4_3',
            title: 'Future of Farming',
            description: 'Emerging agricultural trends',
            url: '/videos/modern/future.mp4',
            duration: 420,
            order: 3
          }
        ]
      }
    ];

    await Module.insertMany(defaultModules);
    console.log('Default modules initialized');
  } catch (error) {
    console.error('Error initializing modules:', error);
  }
}

module.exports = {
  Module,
  initializeModules
};
