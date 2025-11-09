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
        const { USN, name, email, phone, department, semester, section, admissionYear, entryType, fatherName, motherName, address, dateOfBirth, gender, category, bloodGroup } = studentData;

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

        // Extract admission year from USN (2KA21CS001 -> 2021)
        const usnYear = parseInt('20' + USN.substring(3, 5));
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        
        // Calculate current semester based on USN year
        let calculatedSemester = 1;
        if (currentMonth >= 6) { // After June, odd semesters
          calculatedSemester = ((currentYear - usnYear) * 2) + 1;
        } else { // Before June, even semesters
          calculatedSemester = (currentYear - usnYear) * 2;
        }
        calculatedSemester = Math.max(1, Math.min(8, calculatedSemester));

        // Create student with USN as default password
        const hashedPassword = await bcrypt.hash(USN, 10);

        const newStudent = new User({
          usn: USN,
          email: email || `${USN}@college.edu`,
          password: hashedPassword,
          role: 'student',
          profile: {
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' ') || name.split(' ')[0],
            phone: phone || '',
            fatherName: fatherName || '',
            motherName: motherName || '',
            address: address || '',
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            gender: gender || '',
            category: category || '',
            bloodGroup: bloodGroup || ''
          },
          department: department.toUpperCase(),
          studentInfo: {
            admissionYear: usnYear,
            entryType: entryType || 'CET',
            currentSemester: semester || calculatedSemester,
            section: section || 'A'
          },
          isActive: true,
          createdBy: req.user.userId
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
        USN: '2KA21CS001',
        name: 'John Doe',
        email: 'john.doe@college.edu',
        phone: '9876543210',
        department: 'CS',
        semester: 1,
        section: 'A',
        admissionYear: 2021,
        entryType: 'CET',
        fatherName: 'Robert Doe',
        motherName: 'Jane Doe',
        address: '123 Main Street, Bangalore',
        dateOfBirth: '2003-05-15',
        gender: 'Male',
        category: 'General',
        bloodGroup: 'O+'
      },
      {
        USN: '2KA21CS002',
        name: 'Jane Smith',
        email: 'jane.smith@college.edu',
        phone: '9876543211',
        department: 'CS',
        semester: 1,
        section: 'A',
        admissionYear: 2021,
        entryType: 'COMEDK',
        fatherName: 'Michael Smith',
        motherName: 'Sarah Smith',
        address: '456 Oak Avenue, Mysore',
        dateOfBirth: '2003-08-22',
        gender: 'Female',
        category: 'OBC',
        bloodGroup: 'A+'
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
      { isActive: false, deactivatedAt: new Date(), deactivatedBy: req.user.userId }
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