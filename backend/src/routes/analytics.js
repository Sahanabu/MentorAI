const express = require('express');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const analyticsController = require('../controllers/analyticsController');
const router = express.Router();

// Department analytics (HOD)
router.get('/department/:department', authenticate, checkRole(['HOD']), analyticsController.getDepartmentAnalytics);

// Mentor analytics
router.get('/mentor/:mentorId', authenticate, checkRole(['MENTOR', 'HOD']), analyticsController.getMentorAnalytics);

// Subject analytics (Teacher)
router.get('/subject/:subjectId', authenticate, checkRole(['TEACHER', 'HOD']), analyticsController.getSubjectAnalytics);

// Student analytics
router.get('/student/:studentId', authenticate, analyticsController.getStudentAnalytics);

// Performance trends
router.get('/performance-trends', authenticate, analyticsController.getPerformanceTrends);

module.exports = router;
