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

    // Validate Excel format
    const formatErrors = validateExcelFormat(students);
    if (formatErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Excel format validation failed',
        formatErrors
      });
    }

    const results = {
      success: [],
      errors: [],
      duplicates: []
    };

    for (const studentData of students) {
      try {
        const { USN, Name } = studentData;

        // Validate required fields
        if (!USN || !Name) {
          results.errors.push({
            USN: USN || 'N/A',
            error: 'Missing required fields (USN, Name)'
          });
          continue;
        }

        // Extract department from USN (2KA21CS001 -> CS)
        const department = USN.substring(5, 7).toUpperCase();

        // Check if student already exists
        const existingStudent = await User.findOne({ usn: USN });

        if (existingStudent) {
          results.duplicates.push({
            USN,
            message: 'Student already exists'
          });
          continue;
        }

        // Extract academic year and student number from USN (2KA23CS001 -> 2023, 001)
        const academicYear = parseInt('20' + USN.substring(3, 5));
        const studentNumber = parseInt(USN.substring(7, 10));
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        
        // Determine entry type based on student number
        const isLateralEntry = studentNumber >= 400 && studentNumber <= 500;
        const entryType = isLateralEntry ? 'Lateral' : 'CET';
        
        // Calculate current semester
        let calculatedSemester = 1;
        const yearsDiff = currentYear - academicYear;
        
        if (isLateralEntry) {
          // Lateral entry students start from 3rd semester
          if (currentMonth >= 6) { // After June, odd semesters
            calculatedSemester = 3 + (yearsDiff * 2) + 1;
          } else { // Before June, even semesters
            calculatedSemester = 3 + (yearsDiff * 2);
          }
        } else {
          // Regular students start from 1st semester
          if (currentMonth >= 6) { // After June, odd semesters
            calculatedSemester = (yearsDiff * 2) + 1;
          } else { // Before June, even semesters
            calculatedSemester = yearsDiff * 2;
          }
        }
        
        calculatedSemester = Math.max(1, Math.min(8, calculatedSemester));

        // Create student with USN as default password
        const hashedPassword = await bcrypt.hash(USN, 10);

        const newStudent = new User({
          usn: USN,
          email: `temp_${USN}@temp.edu`,
          password: hashedPassword,
          role: 'student',
          profile: {
            firstName: Name.split(' ')[0],
            lastName: Name.split(' ').slice(1).join(' ') || Name.split(' ')[0]
          },
          department: department,
          studentInfo: {
            admissionYear: academicYear,
            entryType: entryType,
            currentSemester: calculatedSemester
          },
          isActive: true,
          createdBy: req.user.userId,
          profileCompleted: false
        });

        await newStudent.save();
        results.success.push({
          USN,
          name: Name,
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
        Name: 'John Doe'
      },
      {
        USN: '2KA21CS002',
        Name: 'Jane Smith'
      },
      {
        USN: '2KA21CS003',
        Name: 'Alice Johnson'
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

// Validate Excel format
const validateExcelFormat = (students) => {
  const errors = [];

  // Check if file is empty
  if (!students || students.length === 0) {
    errors.push('Excel file is empty or has no data rows');
    return errors;
  }

  // Check required columns
  const firstRow = students[0];
  const requiredColumns = ['USN', 'Name'];
  const actualColumns = Object.keys(firstRow);

  // Check if required columns exist
  for (const column of requiredColumns) {
    if (!actualColumns.includes(column)) {
      errors.push(`Missing required column: ${column}`);
    }
  }

  // Check for extra columns
  const extraColumns = actualColumns.filter(col => !requiredColumns.includes(col));
  if (extraColumns.length > 0) {
    errors.push(`Unexpected columns found: ${extraColumns.join(', ')}. Only USN and Name columns are allowed.`);
  }

  // Validate data format for each row
  students.forEach((student, index) => {
    const rowNumber = index + 2; // Excel row number (header is row 1)
    
    // Check USN format
    if (!student.USN) {
      errors.push(`Row ${rowNumber}: USN is required`);
    } else if (typeof student.USN !== 'string' && typeof student.USN !== 'number') {
      errors.push(`Row ${rowNumber}: USN must be text or number`);
    } else {
      const usnStr = student.USN.toString().toUpperCase();
      if (!usnStr.match(/^2KA\d{2}[A-Z]{2}\d{3}$/)) {
        errors.push(`Row ${rowNumber}: Invalid USN format '${student.USN}'. Expected format: 2KA21CS001`);
      }
    }

    // Check Name
    if (!student.Name) {
      errors.push(`Row ${rowNumber}: Name is required`);
    } else if (typeof student.Name !== 'string') {
      errors.push(`Row ${rowNumber}: Name must be text`);
    } else if (student.Name.trim().length < 2) {
      errors.push(`Row ${rowNumber}: Name must be at least 2 characters`);
    }
  });

  return errors;
};

module.exports = {
  uploadStudents,
  getTemplate,
  getStudentsByDepartment,
  deactivateStudents
};