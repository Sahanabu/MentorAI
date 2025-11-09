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

    console.log('User role:', req.user.role, 'Required roles:', roles);
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. User role: ${req.user.role}, Required: ${roles.join(', ')}`
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
router.post('/upload', authenticate, authorize(['HOD']), upload.single('studentsFile'), uploadStudents);
router.get('/template', getTemplate);
router.get('/department/:department', authenticate, authorize(['HOD', 'MENTOR']), getStudentsByDepartment);
router.put('/deactivate', authenticate, authorize(['HOD']), deactivateStudents);

module.exports = router;