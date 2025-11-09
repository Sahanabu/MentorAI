const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth, authorize } = require('../middleware/auth');
const {
  uploadStudents,
  getTemplate,
  getStudentsByDepartment,
  deactivateStudents
} = require('../controllers/studentRegistrationController');

const router = express.Router();

// Configure multer for Excel file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `students_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Routes
router.post('/upload', auth, authorize(['hod']), upload.single('studentsFile'), uploadStudents);
router.get('/template', auth, authorize(['hod']), getTemplate);
router.get('/department/:department', auth, authorize(['hod', 'mentor']), getStudentsByDepartment);
router.put('/deactivate', auth, authorize(['hod']), deactivateStudents);

module.exports = router;