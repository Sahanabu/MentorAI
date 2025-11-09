const express = require('express');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const mentorAssignmentController = require('../controllers/mentorAssignmentController');

const router = express.Router();

// Get assignment data (students, mentors, current assignments)
router.get('/data', 
  authenticate, 
  checkRole(['HOD']), 
  mentorAssignmentController.getAssignmentData
);

// Auto-distribute students evenly among mentors
router.post('/auto-distribute', 
  authenticate, 
  checkRole(['HOD']), 
  mentorAssignmentController.autoDistribute
);

// Manual assignment of students to mentor
router.post('/manual-assign', 
  authenticate, 
  checkRole(['HOD']), 
  mentorAssignmentController.manualAssign
);

// Remove student from mentor
router.post('/remove', 
  authenticate, 
  checkRole(['HOD']), 
  mentorAssignmentController.removeAssignment
);

module.exports = router;