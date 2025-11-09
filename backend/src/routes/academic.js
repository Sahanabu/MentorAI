const express = require('express');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const academicController = require('../controllers/academicController');
const router = express.Router();

// Schemes routes
router.get('/schemes', authenticate, academicController.getSchemes);
router.post('/schemes', authenticate, checkRole(['HOD']), academicController.createScheme);
router.get('/schemes/:schemeId', authenticate, academicController.getSchemeById);
router.put('/schemes/:schemeId', authenticate, checkRole(['HOD']), academicController.updateScheme);

// Subjects routes
router.get('/subjects', authenticate, academicController.getSubjects);
router.post('/subjects', authenticate, checkRole(['HOD']), academicController.createSubject);
router.get('/subjects/:subjectId', authenticate, academicController.getSubjectById);
router.put('/subjects/:subjectId', authenticate, academicController.updateSubject);
router.get('/subjects/student/:studentId', authenticate, academicController.getStudentSubjects);

// Student performance routes
router.get('/students/:studentId/performance', authenticate, academicController.getStudentSemesterPerformance);
router.put('/students/:studentId/progress', authenticate, academicController.updateStudentProgress);

module.exports = router;
