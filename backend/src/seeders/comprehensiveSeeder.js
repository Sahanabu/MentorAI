const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Subject = require('../models/Subject');
const Assessment = require('../models/Assessment');
const Backlog = require('../models/Backlog');
const MentorAssignment = require('../models/MentorAssignment');
const Prediction = require('../models/Prediction');
const { USER_ROLES, ENTRY_TYPES } = require('../config/constants');

class ComprehensiveSeeder {
  async seedAll() {
    try {
      console.log('Starting comprehensive database seeding...');
      
      // Clear existing data
      await this.clearDatabase();
      
      // Seed in order of dependencies
      const users = await this.seedUsers();
      const schemes = await this.seedSchemes();
      const subjects = await this.seedSubjects(users.teachers);
      await this.seedMentorAssignments(users.mentors, users.students);
      await this.seedAssessments(users.students, subjects);
      await this.seedBacklogs(users.students, subjects);
      await this.seedAttendance(users.students, subjects, users.teachers);
      await this.seedPredictions(users.students, subjects);
      
      console.log('Database seeding completed successfully!');
      return true;
    } catch (error) {
      console.error('Seeding failed:', error);
      throw error;
    }
  }

  async clearDatabase() {
    console.log('Clearing existing data...');
    const Attendance = require('../models/Attendance');
    await Promise.all([
      User.deleteMany({}),
      Scheme.deleteMany({}),
      Subject.deleteMany({}),
      Assessment.deleteMany({}),
      Backlog.deleteMany({}),
      MentorAssignment.deleteMany({}),
      Prediction.deleteMany({}),
      Attendance.deleteMany({})
    ]);
  }

  async seedUsers() {
    console.log('Seeding users...');
    
    const users = {
      hods: [],
      mentors: [],
      teachers: [],
      students: []
    };

    // Create HODs
    const hodData = [
      {
        email: 'hod.cs@college.edu',
        password: await bcrypt.hash('password123', 12),
        role: USER_ROLES.HOD,
        profile: { firstName: 'Dr. Rajesh', lastName: 'Kumar' },
        department: 'CS',
        teacherInfo: { employeeId: 'EMP001', specialization: ['Computer Science'] }
      },
      {
        email: 'hod.ec@college.edu',
        password: await bcrypt.hash('password123', 12),
        role: USER_ROLES.HOD,
        profile: { firstName: 'Dr. Priya', lastName: 'Sharma' },
        department: 'EC',
        teacherInfo: { employeeId: 'EMP002', specialization: ['Electronics'] }
      }
    ];

    users.hods = await User.insertMany(hodData);

    // Create Mentors
    const mentorData = [];
    const mentorNames = [
      ['Dr. Amit', 'Singh'], ['Dr. Sneha', 'Patel'], ['Dr. Ravi', 'Gupta'],
      ['Dr. Kavya', 'Reddy'], ['Dr. Suresh', 'Nair'], ['Dr. Meera', 'Joshi']
    ];

    for (let i = 0; i < mentorNames.length; i++) {
      mentorData.push({
        email: `mentor${i + 1}@college.edu`,
        password: await bcrypt.hash('password123', 12),
        role: USER_ROLES.MENTOR,
        profile: { firstName: mentorNames[i][0], lastName: mentorNames[i][1] },
        department: i < 3 ? 'CS' : 'EC',
        teacherInfo: { employeeId: `EMP${100 + i}`, specialization: ['Mentoring'] }
      });
    }

    users.mentors = await User.insertMany(mentorData);

    // Create Teachers
    const teacherData = [];
    const teacherNames = [
      ['Prof. Anita', 'Desai'], ['Prof. Vikram', 'Shah'], ['Prof. Sunita', 'Rao'],
      ['Prof. Kiran', 'Mehta'], ['Prof. Deepak', 'Jain'], ['Prof. Pooja', 'Agarwal']
    ];

    for (let i = 0; i < teacherNames.length; i++) {
      teacherData.push({
        email: `teacher${i + 1}@college.edu`,
        password: await bcrypt.hash('password123', 12),
        role: USER_ROLES.TEACHER,
        profile: { firstName: teacherNames[i][0], lastName: teacherNames[i][1] },
        department: i < 3 ? 'CS' : 'EC',
        teacherInfo: { employeeId: `EMP${200 + i}`, specialization: ['Teaching'] }
      });
    }

    users.teachers = await User.insertMany(teacherData);

    // Create Students
    const studentData = [];
    const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
                       'Ananya', 'Diya', 'Aadhya', 'Kavya', 'Anika', 'Riya', 'Myra', 'Sara', 'Priya', 'Isha'];
    const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Nair', 'Joshi', 'Agarwal', 'Mehta'];

    // Generate 100 students (50 CS, 50 EC)
    for (let i = 1; i <= 100; i++) {
      const department = i <= 50 ? 'CS' : 'EC';
      const entryType = i % 10 === 0 ? ENTRY_TYPES.LATERAL : ENTRY_TYPES.REGULAR;
      const admissionYear = 2021;
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      
      // Calculate current semester based on admission year
      let currentSemester = 1;
      if (currentMonth >= 6) {
        currentSemester = ((currentYear - admissionYear) * 2) + 1;
      } else {
        currentSemester = (currentYear - admissionYear) * 2;
      }
      currentSemester = Math.max(1, Math.min(8, currentSemester));
      
      const deptNumber = i <= 50 ? i : i - 50;
      const usn = `2KA${admissionYear.toString().slice(-2)}${department}${deptNumber.toString().padStart(3, '0')}`;
      
      studentData.push({
        usn,
        email: `student${i}@college.edu`,
        password: await bcrypt.hash('password123', 12),
        role: USER_ROLES.STUDENT,
        profile: {
          firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
          lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
          phone: `9${Math.floor(Math.random() * 900000000) + 100000000}`
        },
        department,
        studentInfo: {
          admissionYear,
          entryType,
          currentSemester,
          cgpa: Math.round((Math.random() * 4 + 6) * 100) / 100 // CGPA 6.0-10.0
        }
      });
    }

    users.students = await User.insertMany(studentData);
    
    console.log(`Created ${users.hods.length} HODs, ${users.mentors.length} mentors, ${users.teachers.length} teachers, ${users.students.length} students`);
    return users;
  }

  async seedSchemes() {
    console.log('Seeding schemes...');
    
    const schemes = [
      {
        schemeYear: 2021,
        department: 'CS',
        semesters: [
          {
            semesterNumber: 5,
            subjects: [
              { subjectCode: '21CS51', subjectName: 'Software Engineering', credits: 3, subjectType: 'THEORY', passThreshold: 40 },
              { subjectCode: '21CS52', subjectName: 'Computer Networks', credits: 4, subjectType: 'THEORY', passThreshold: 40 },
              { subjectCode: '21CS53', subjectName: 'Database Management System', credits: 4, subjectType: 'THEORY', passThreshold: 40 },
              { subjectCode: '21CS54', subjectName: 'Automata Theory', credits: 3, subjectType: 'THEORY', passThreshold: 40 },
              { subjectCode: '21CSL55', subjectName: 'DBMS Lab', credits: 1, subjectType: 'LAB', passThreshold: 40 }
            ]
          },
          {
            semesterNumber: 6,
            subjects: [
              { subjectCode: '21CS61', subjectName: 'Compiler Design', credits: 4, subjectType: 'THEORY', passThreshold: 40 },
              { subjectCode: '21CS62', subjectName: 'Computer Graphics', credits: 3, subjectType: 'THEORY', passThreshold: 40 },
              { subjectCode: '21CS63', subjectName: 'Web Technology', credits: 3, subjectType: 'THEORY', passThreshold: 40 },
              { subjectCode: '21CS64', subjectName: 'Machine Learning', credits: 4, subjectType: 'THEORY', passThreshold: 40 },
              { subjectCode: '21CSL65', subjectName: 'Web Technology Lab', credits: 1, subjectType: 'LAB', passThreshold: 40 }
            ]
          }
        ]
      },
      {
        schemeYear: 2021,
        department: 'EC',
        semesters: [
          {
            semesterNumber: 5,
            subjects: [
              { subjectCode: '21EC51', subjectName: 'Digital Signal Processing', credits: 4, subjectType: 'THEORY', passThreshold: 40 },
              { subjectCode: '21EC52', subjectName: 'Microprocessors', credits: 4, subjectType: 'THEORY', passThreshold: 40 },
              { subjectCode: '21EC53', subjectName: 'Control Systems', credits: 3, subjectType: 'THEORY', passThreshold: 40 },
              { subjectCode: '21EC54', subjectName: 'Communication Systems', credits: 4, subjectType: 'THEORY', passThreshold: 40 },
              { subjectCode: '21ECL55', subjectName: 'Microprocessor Lab', credits: 1, subjectType: 'LAB', passThreshold: 40 }
            ]
          }
        ]
      }
    ];

    return await Scheme.insertMany(schemes);
  }

  async seedSubjects(teachers) {
    console.log('Seeding subjects...');
    
    const subjects = [];
    const csSubjects = [
      { code: '21CS51', name: 'Software Engineering', semester: 5, dept: 'CS' },
      { code: '21CS52', name: 'Computer Networks', semester: 5, dept: 'CS' },
      { code: '21CS53', name: 'Database Management System', semester: 5, dept: 'CS' },
      { code: '21CS61', name: 'Compiler Design', semester: 6, dept: 'CS' },
      { code: '21CS62', name: 'Computer Graphics', semester: 6, dept: 'CS' }
    ];

    const ecSubjects = [
      { code: '21EC51', name: 'Digital Signal Processing', semester: 5, dept: 'EC' },
      { code: '21EC52', name: 'Microprocessors', semester: 5, dept: 'EC' },
      { code: '21EC53', name: 'Control Systems', semester: 5, dept: 'EC' }
    ];

    const allSubjects = [...csSubjects, ...ecSubjects];
    
    for (let i = 0; i < allSubjects.length; i++) {
      const subject = allSubjects[i];
      const teacher = teachers.find(t => t.department === subject.dept) || teachers[0];
      
      subjects.push({
        subjectCode: subject.code,
        subjectName: subject.name,
        credits: Math.floor(Math.random() * 3) + 3, // 3-5 credits
        subjectType: subject.code.includes('L') ? 'LAB' : 'THEORY',
        semester: subject.semester,
        department: subject.dept,
        schemeYear: 2021,
        teacherId: teacher._id,
        passThreshold: 40
      });
    }

    return await Subject.insertMany(subjects);
  }

  async seedMentorAssignments(mentors, students) {
    console.log('Seeding mentor assignments...');
    
    const assignments = [];
    const studentsPerMentor = Math.ceil(students.length / mentors.length);
    
    for (let i = 0; i < mentors.length; i++) {
      const mentor = mentors[i];
      const startIndex = i * studentsPerMentor;
      const endIndex = Math.min(startIndex + studentsPerMentor, students.length);
      const assignedStudents = students.slice(startIndex, endIndex)
        .filter(s => s.department === mentor.department);
      
      if (assignedStudents.length > 0) {
        const assignment = {
          mentorId: mentor._id,
          department: mentor.department,
          assignedStudents: assignedStudents.map(s => s._id),
          maxStudentCount: studentsPerMentor,
          regularStudents: assignedStudents.filter(s => s.studentInfo.entryType === ENTRY_TYPES.REGULAR).map(s => s._id),
          lateralStudents: assignedStudents.filter(s => s.studentInfo.entryType === ENTRY_TYPES.LATERAL).map(s => s._id)
        };
        
        assignments.push(assignment);
        
        // Update students with mentor reference
        await User.updateMany(
          { _id: { $in: assignedStudents.map(s => s._id) } },
          { 'studentInfo.mentorId': mentor._id }
        );
      }
    }
    
    return await MentorAssignment.insertMany(assignments);
  }

  async seedAssessments(students, subjects) {
    console.log('Seeding assessments...');
    
    const assessments = [];
    
    for (const student of students) {
      const studentSubjects = subjects.filter(s => s.department === student.department);
      
      for (const subject of studentSubjects) {
        const attendance = Math.floor(Math.random() * 40) + 60; // 60-100%
        const internal1 = Math.floor(Math.random() * 15) + 10; // 10-25
        const internal2 = Math.floor(Math.random() * 15) + 10;
        const internal3 = Math.floor(Math.random() * 15) + 10;
        const assignmentMarks = Math.floor(Math.random() * 10) + 10; // 10-20
        const finalExam = Math.floor(Math.random() * 40) + 40; // 40-80
        
        assessments.push({
          studentId: student._id,
          subjectId: subject._id,
          semester: subject.semester,
          academicYear: '2023-24',
          internals: {
            internal1,
            internal2,
            internal3
          },
          assignments: {
            totalMarks: assignmentMarks
          },
          attendance: {
            totalClasses: 50,
            attendedClasses: Math.floor(50 * attendance / 100)
          },
          behaviorScore: Math.floor(Math.random() * 3) + 7, // 7-10
          finalExamMarks: finalExam
        });
      }
    }
    
    return await Assessment.insertMany(assessments);
  }

  async seedBacklogs(students, subjects) {
    console.log('Seeding backlogs...');
    
    const backlogs = [];
    
    // Create backlogs for ~20% of students
    const studentsWithBacklogs = students.slice(0, Math.floor(students.length * 0.2));
    
    for (const student of studentsWithBacklogs) {
      const studentSubjects = subjects.filter(s => s.department === student.department);
      const backlogSubject = studentSubjects[Math.floor(Math.random() * studentSubjects.length)];
      
      const backlog = {
        studentId: student._id,
        subjectId: backlogSubject._id,
        subjectCode: backlogSubject.subjectCode,
        subjectName: backlogSubject.subjectName,
        semester: backlogSubject.semester,
        attempts: [{
          attemptNumber: 1,
          examDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          marksObtained: Math.floor(Math.random() * 20) + 20, // 20-40 (failed)
          isPassed: false,
          grade: 'F'
        }],
        isCleared: Math.random() > 0.7, // 30% cleared
        totalAttempts: 1
      };
      
      if (backlog.isCleared) {
        backlog.attempts.push({
          attemptNumber: 2,
          examDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          marksObtained: Math.floor(Math.random() * 20) + 45, // 45-65 (passed)
          isPassed: true,
          grade: Math.random() > 0.5 ? 'C' : 'D'
        });
        backlog.totalAttempts = 2;
        backlog.clearedDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
      }
      
      backlogs.push(backlog);
      
      // Update student's backlog count
      await User.findByIdAndUpdate(student._id, {
        'studentInfo.activeBacklogCount': backlog.isCleared ? 0 : 1
      });
    }
    
    return await Backlog.insertMany(backlogs);
  }

  async seedPredictions(students, subjects) {
    console.log('Seeding predictions...');
    
    const predictions = [];
    
    for (const student of students) {
      // Create semester prediction
      const riskLevels = ['SAFE', 'NEEDS_ATTENTION', 'AT_RISK'];
      const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
      
      predictions.push({
        studentId: student._id,
        predictionType: 'SEMESTER',
        semester: student.studentInfo.currentSemester,
        inputFeatures: {
          attendance: Math.floor(Math.random() * 40) + 60,
          bestOfTwo: Math.floor(Math.random() * 15) + 10,
          assignments: Math.floor(Math.random() * 10) + 10,
          behaviorScore: Math.floor(Math.random() * 3) + 7,
          backlogCount: student.studentInfo.activeBacklogCount || 0,
          previousSgpa: student.studentInfo.cgpa || 0
        },
        prediction: {
          riskLevel,
          probability: Math.random(),
          predictedScore: Math.floor(Math.random() * 30) + 60,
          confidence: Math.random() * 0.3 + 0.7
        },
        explanation: {
          topFeatures: [
            { feature: 'attendance', impact: Math.random() * 0.4 + 0.2, description: 'Attendance impacts performance' },
            { feature: 'internals', impact: Math.random() * 0.3 + 0.1, description: 'Internal marks are important' }
          ]
        },
        modelVersion: 'v1.0'
      });
    }
    
    return await Prediction.insertMany(predictions);
  }

  async seedAttendance(students, subjects, teachers) {
    console.log('Seeding attendance records...');
    const Attendance = require('../models/Attendance');
    
    const attendanceRecords = [];
    const daysBack = 30; // Last 30 days
    
    for (const student of students) {
      const studentSubjects = subjects.filter(s => s.department === student.department);
      
      for (const subject of studentSubjects) {
        const teacher = teachers.find(t => t.department === student.department) || teachers[0];
        
        // Generate attendance for last 30 days
        for (let day = 0; day < daysBack; day++) {
          const date = new Date();
          date.setDate(date.getDate() - day);
          
          // Skip weekends
          if (date.getDay() === 0 || date.getDay() === 6) continue;
          
          // Random periods per day (1-3)
          const periodsPerDay = Math.floor(Math.random() * 3) + 1;
          
          for (let period = 1; period <= periodsPerDay; period++) {
            const isPresent = Math.random() > 0.2; // 80% attendance rate
            
            attendanceRecords.push({
              studentId: student._id,
              subjectId: subject._id,
              teacherId: teacher._id,
              date: new Date(date),
              status: isPresent ? 'present' : 'absent',
              period,
              markedAt: new Date(date.getTime() + (period * 60 * 60 * 1000)) // Add hours for period
            });
          }
        }
      }
    }
    
    return await Attendance.insertMany(attendanceRecords);
  }
}

module.exports = new ComprehensiveSeeder();