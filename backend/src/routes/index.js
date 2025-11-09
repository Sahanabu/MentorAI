const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const academicRoutes = require('./academic');
const assessmentRoutes = require('./assessments');
const mentorRoutes = require('./mentors');
const backlogRoutes = require('./backlogs');
const analyticsRoutes = require('./analytics');
const predictionRoutes = require('./predictions');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/academic', academicRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/mentors', mentorRoutes);
router.use('/backlogs', backlogRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/predictions', predictionRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'MentorTrack AI Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      academic: '/api/academic',
      assessments: '/api/assessments',
      mentors: '/api/mentors',
      backlogs: '/api/backlogs',
      analytics: '/api/analytics',
      predictions: '/api/predictions'
    }
  });
});

module.exports = router;