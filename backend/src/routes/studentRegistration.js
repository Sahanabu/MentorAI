const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticate } = require('../middleware/auth');

const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};
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
router.post('/upload', authenticate, authorize(['hod']), upload.single('studentsFile'), uploadStudents);
router.get('/template', authenticate, authorize(['hod']), getTemplate);
router.get('/department/:department', authenticate, authorize(['hod', 'mentor']), getStudentsByDepartment);
router.put('/deactivate', authenticate, authorize(['hod']), deactivateStudents);

module.exports = router;