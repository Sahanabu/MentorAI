const express = require('express');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const exportController = require('../controllers/exportController');

const router = express.Router();

// Export analytics reports
router.get('/:type', 
  authenticate, 
  checkRole(['HOD', 'MENTOR', 'TEACHER']), 
  exportController.exportAnalytics
);

module.exports = router;