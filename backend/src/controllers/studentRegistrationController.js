const XLSX = require('xlsx');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Upload and register students from Excel
const uploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No Excel file uploaded'
      });
    }

    // Parse Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const students = XLSX.utils.sheet_to_json(worksheet);

    const results = {
      success: [],
      errors: [],
      duplicates: []
    };

    for (const studentData of students) {
      try {
        const { USN, name, email, phone, department, semester, section } = studentData;

        // Validate required fields
        if (!USN || !name || !department) {
          results.errors.push({
            USN: USN || 'N/A',
            error: 'Missing required fields (USN, name, department)'
          });
          continue;
        }

        // Check if student already exists
        const existingStudent = await User.findOne({ 
          $or: [{ usn: USN }, { email: email }] 
        });

        if (existingStudent) {
          results.duplicates.push({
            USN,
            message: 'Student already exists'
          });
          continue;
        }

        // Create student with USN as default password
        const hashedPassword = await bcrypt.hash(USN, 10);

        const newStudent = new User({
          usn: USN,
          name,
          email: email || `${USN}@college.edu`,
          phone: phone || '',
          password: hashedPassword,
          role: 'student',
          department: department.toUpperCase(),
          semester: semester || 1,
          section: section || 'A',
          isActive: true,
          createdBy: req.user.id
        });

        await newStudent.save();
        results.success.push({
          USN,
          name,
          message: 'Student registered successfully'
        });

      } catch (error) {
        results.errors.push({
          USN: studentData.USN || 'N/A',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Student registration completed',
      results: {
        total: students.length,
        successful: results.success.length,
        errors: results.errors.length,
        duplicates: results.duplicates.length
      },
      details: results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing student registration',
      error: error.message
    });
  }
};

// Get registration template
const getTemplate = (req, res) => {
  try {
    const templateData = [
      {
        USN: '1MS21CS001',
        name: 'John Doe',
        email: 'john.doe@college.edu',
        phone: '9876543210',
        department: 'CS',
        semester: 1,
        section: 'A'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=student_registration_template.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating template',
      error: error.message
    });
  }
};

// Get all students by department
const getStudentsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const students = await User.find({
      role: 'student',
      department: department.toUpperCase(),
      isActive: true
    }).select('-password').sort({ usn: 1 });

    res.json({
      success: true,
      students,
      count: students.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Deactivate students (for graduation/transfer)
const deactivateStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;

    await User.updateMany(
      { _id: { $in: studentIds }, role: 'student' },
      { isActive: false, deactivatedAt: new Date(), deactivatedBy: req.user.id }
    );

    res.json({
      success: true,
      message: 'Students deactivated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating students',
      error: error.message
    });
  }
};

module.exports = {
  uploadStudents,
  getTemplate,
  getStudentsByDepartment,
  deactivateStudents
};