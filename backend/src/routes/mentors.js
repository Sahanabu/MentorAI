const express = require('express');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const predictionService = require('../services/predictionService');
const router = express.Router();

// Get mentor's assigned students
router.get('/students', authenticate, async (req, res) => {
  try {
    const mentorId = req.user._id;

    // Get students assigned to this mentor
    const students = await User.find({
      role: 'student',
      'studentInfo.mentorId': mentorId,
      isActive: true
    }).select('usn profile studentInfo cgpa lastLogin');

    // Get assessments for these students
    const studentIds = students.map(s => s._id);
    const assessments = await Assessment.find({
      studentId: { $in: studentIds }
    }).sort({ semester: -1 });

    // Calculate risk levels and get AI predictions
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
        const previousSGPA = studentAssessments.length > 1 ? studentAssessments[1]?.gradePoints || 0 : null;

        // Get AI prediction for next semester
        let aiPrediction = null;
        try {
          aiPrediction = await predictionService.predictSemesterSGPA(
            student._id.toString(),
            (student.studentInfo.currentSemester || 5) + 1,
            {
              mean_subject_prediction: 75, // Would be calculated from subject predictions
              active_backlog_count: student.studentInfo.activeBacklogCount || 0,
              previous_sgpa: previousSGPA,
              attendance_average: attendanceAvg
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
          cgpa: student.cgpa || 0,
          sgpa: latestAssessment?.gradePoints || 0,
          attendance: Math.round(attendanceAvg),
          riskLevel,
          backlogs: student.studentInfo.activeBacklogCount || 0,
          aiPrediction
        };
      })
    );

    res.json({
      success: true,
      data: studentsWithData
    });
  } catch (error) {
    console.error('Get mentor students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
});

module.exports = router;
