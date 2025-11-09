const express = require('express');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const assessmentController = require('../controllers/assessmentController');
const router = express.Router();

// Internal assessments
router.post('/internals', authenticate, checkRole(['TEACHER', 'HOD']), assessmentController.updateInternalMarks);
router.get('/internals/:studentId/:subjectId', authenticate, assessmentController.getInternalMarks);

// Assignments
router.post('/assignments', authenticate, checkRole(['TEACHER', 'HOD']), assessmentController.updateAssignmentMarks);
router.get('/assignments/:studentId/:subjectId', authenticate, assessmentController.getAssignmentMarks);

// Attendance
router.post('/attendance', authenticate, checkRole(['TEACHER', 'HOD']), assessmentController.updateAttendance);
router.get('/attendance/:studentId/:subjectId', authenticate, assessmentController.getAttendance);

// Final exams
router.post('/final-exam', authenticate, checkRole(['TEACHER', 'HOD']), assessmentController.updateFinalExamMarks);
router.get('/final-exam/:studentId/:subjectId', authenticate, assessmentController.getFinalExamMarks);

// Bulk operations
router.post('/bulk-update', authenticate, checkRole(['TEACHER', 'HOD']), assessmentController.bulkUpdateMarks);

// Subject performance (for teachers)
router.get('/subject/:subjectId/performance', authenticate, checkRole(['TEACHER', 'HOD']), assessmentController.getSubjectPerformance);

module.exports = router;