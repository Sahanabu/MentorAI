const express = require('express');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const backlogController = require('../controllers/backlogController');
const router = express.Router();

// Student backlog operations
router.get('/student/:studentId', authenticate, backlogController.getStudentBacklogs);
router.post('/', authenticate, checkRole(['TEACHER', 'HOD']), backlogController.createBacklog);
router.put('/:backlogId/attempt', authenticate, checkRole(['TEACHER', 'HOD']), backlogController.addBacklogAttempt);
router.put('/:backlogId/clear', authenticate, checkRole(['TEACHER', 'HOD']), backlogController.clearBacklog);

// Department statistics (HOD only)
router.get('/department/:department', authenticate, checkRole(['HOD']), backlogController.getDepartmentBacklogStats);
router.get('/department/:department/trends', authenticate, checkRole(['HOD']), backlogController.getBacklogTrends);

// Auto-create backlogs
router.post('/auto-create', authenticate, checkRole(['HOD']), backlogController.autoCreateBacklogs);

module.exports = router;