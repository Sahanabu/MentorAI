const express = require('express');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const aiService = require('../services/aiService');

const router = express.Router();

// Generate prediction for specific student
router.post('/generate/:studentId', 
  authenticate, 
  checkRole(['HOD', 'MENTOR', 'TEACHER']), 
  async (req, res, next) => {
    try {
      const { studentId } = req.params;
      const prediction = await aiService.generateStudentPrediction(studentId);
      
      res.json({
        success: true,
        message: 'Prediction generated successfully',
        data: prediction
      });
    } catch (error) {
      next(error);
    }
  }
);

// Generate predictions for all students in department
router.post('/generate-department', 
  authenticate, 
  checkRole(['HOD']), 
  async (req, res, next) => {
    try {
      const { department } = req.user;
      const results = await aiService.generateDepartmentPredictions(department);
      
      res.json({
        success: true,
        message: 'Department predictions generated',
        data: results
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get department risk analytics
router.get('/analytics/department', 
  authenticate, 
  checkRole(['HOD']), 
  async (req, res, next) => {
    try {
      const { department } = req.user;
      const analytics = await aiService.getDepartmentRiskAnalytics(department);
      
      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;