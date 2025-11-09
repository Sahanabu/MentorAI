const express = require('express');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const mentorController = require('../controllers/mentorController');
const router = express.Router();

// Mentor assignment (HOD only)
router.post('/assign', authenticate, checkRole(['HOD']), mentorController.assignMentors);
router.get('/assignments', authenticate, checkRole(['HOD']), mentorController.getMentorAssignments);

// Mentor operations
router.get('/:mentorId/students', authenticate, checkRole(['MENTOR', 'HOD']), mentorController.getMentorStudents);
router.get('/:mentorId/at-risk', authenticate, checkRole(['MENTOR', 'HOD']), mentorController.getAtRiskStudents);
router.put('/:mentorId/capacity', authenticate, checkRole(['HOD']), mentorController.updateMentorCapacity);
router.post('/reassign', authenticate, checkRole(['HOD']), mentorController.reassignStudent);

// Interventions
router.post('/intervention', authenticate, checkRole(['MENTOR']), mentorController.logIntervention);
router.get('/interventions/:studentId', authenticate, checkRole(['MENTOR', 'HOD']), mentorController.getInterventionHistory);

module.exports = router;
