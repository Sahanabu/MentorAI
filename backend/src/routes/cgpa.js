const express = require('express');
const router = express.Router();
const cgpaController = require('../controllers/cgpaController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Add semester result (Teachers/HOD)
router.post('/students/:studentId/semester-result', 
  authenticate, 
  checkRole(['TEACHER', 'HOD']), 
  cgpaController.addSemesterResult
);

// Get academic summary (All authenticated users)
router.get('/students/:studentId/summary', 
  authenticate, 
  cgpaController.getAcademicSummary
);

// Calculate CGPA (All authenticated users)
router.get('/students/:studentId/cgpa', 
  authenticate, 
  cgpaController.calculateCGPA
);

// Mark as graduated (HOD only)
router.put('/students/:studentId/graduate', 
  authenticate, 
  checkRole(['HOD']), 
  cgpaController.markAsGraduated
);

// Get current students (Teachers/HOD/Mentors)
router.get('/students/current', 
  authenticate, 
  checkRole(['TEACHER', 'HOD', 'MENTOR']), 
  cgpaController.getCurrentStudents
);

// Get graduated students (Teachers/HOD/Mentors)
router.get('/students/graduated', 
  authenticate, 
  checkRole(['TEACHER', 'HOD', 'MENTOR']), 
  cgpaController.getGraduatedStudents
);

module.exports = router;