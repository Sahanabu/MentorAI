const express = require('express');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const predictionService = require('../services/predictionService');
const router = express.Router();

// Get teacher's students for a subject
router.get('/teacher/students', authenticate, async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { subjectId } = req.query;

    // For now, get all students in the same department as the teacher
    // In a real implementation, you'd filter by subjects the teacher teaches
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const students = await User.find({
      role: 'student',
      department: teacher.department,
      isActive: true
    }).select('usn profile studentInfo cgpa lastLogin');

    // Get assessments for these students
    const studentIds = students.map(s => s._id);
    const assessments = await Assessment.find({
      studentId: { $in: studentIds }
    }).sort({ semester: -1 });

    // Calculate data for each student
    const studentsWithData = await Promise.all(
      students.map(async (student) => {
        const studentAssessments = assessments.filter(a =>
          a.studentId.toString() === student._id.toString()
        );

        // Calculate attendance average
        const attendanceAvg = studentAssessments.length > 0
          ? studentAssessments.reduce((sum, a) => sum + (a.attendance.percentage || 0), 0) / studentAssessments.length
          : 0;

        // Get latest semester data
        const latestAssessment = studentAssessments[0];

        // Get AI prediction for subject performance
        let aiPrediction = null;
        try {
          aiPrediction = await predictionService.predictSubjectPerformance(
            student._id.toString(),
            subjectId || 'default_subject',
            {
              attendance_percentage: attendanceAvg,
              best_of_two_internals: 20, // Would be calculated from actual internals
              assignment_marks: 15, // Would be calculated from assignments
              behavior_score: 8 // Would be from assessment
            }
          );
        } catch (error) {
          console.error('AI prediction error:', error);
        }

        // Determine risk level
        let riskLevel = 'Low';
        if (student.cgpa < 7.0 || attendanceAvg < 75 || (student.studentInfo.activeBacklogCount || 0) > 1) {
          riskLevel = 'High';
        } else if (student.cgpa < 8.0 || attendanceAvg < 85) {
          riskLevel = 'Medium';
        }

        return {
          id: student._id,
          name: `${student.profile.firstName} ${student.profile.lastName}`,
          usn: student.usn,
          semester: student.studentInfo.currentSemester || 5,
          branch: student.department,
          email: student.email,
          phone: student.profile.phone,
          attendance: Math.round(attendanceAvg),
          sgpa: latestAssessment?.gradePoints || 0,
          cgpa: student.cgpa || 0,
          riskLevel,
          backlogs: student.studentInfo.activeBacklogCount || 0,
          mentor: 'Dr. Priya Sharma', // Would be populated from mentor relationship
          aiPrediction
        };
      })
    );

    res.json({
      success: true,
      data: studentsWithData
    });
  } catch (error) {
    console.error('Get teacher students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
});

module.exports = router;
