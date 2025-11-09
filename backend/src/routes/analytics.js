const express = require('express');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const predictionService = require('../services/predictionService');
const router = express.Router();

// Get at-risk students analytics
router.get('/at-risk', authenticate, async (req, res) => {
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
    const atRiskStudents = await Promise.all(
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
              mean_subject_prediction: 75,
              active_backlog_count: student.studentInfo.activeBacklogCount || 0,
              previous_sgpa: previousSGPA,
              attendance_average: attendanceAvg
            }
          );
        } catch (error) {
          console.error('AI prediction error:', error);
        }

        // Determine risk level and factors
        let riskLevel = 'Low';
        let riskFactors = [];
        let predictedRisk = 0;

        if (student.cgpa < 7.0) {
          riskFactors.push('Poor CGPA');
          riskLevel = 'High';
          predictedRisk = 90;
        } else if (student.cgpa < 8.0) {
          riskFactors.push('Average CGPA');
          riskLevel = 'Medium';
          predictedRisk = 70;
        }

        if (attendanceAvg < 75) {
          riskFactors.push('Low Attendance');
          riskLevel = 'High';
          predictedRisk = Math.max(predictedRisk, 85);
        } else if (attendanceAvg < 85) {
          riskFactors.push('Irregular Attendance');
          if (riskLevel === 'Low') riskLevel = 'Medium';
          predictedRisk = Math.max(predictedRisk, 60);
        }

        if ((student.studentInfo.activeBacklogCount || 0) > 1) {
          riskFactors.push('Multiple Backlogs');
          riskLevel = 'High';
          predictedRisk = Math.max(predictedRisk, 95);
        } else if ((student.studentInfo.activeBacklogCount || 0) > 0) {
          riskFactors.push('Backlog');
          if (riskLevel === 'Low') riskLevel = 'Medium';
          predictedRisk = Math.max(predictedRisk, 75);
        }

        if (riskFactors.length === 0) {
          riskFactors.push('Recent Performance Dip');
          predictedRisk = 45;
        }

        // Determine trend
        let trend = 'Stable';
        if (studentAssessments.length >= 2) {
          const currentSGPA = latestAssessment?.gradePoints || 0;
          const prevSGPA = studentAssessments[1]?.gradePoints || 0;
          if (currentSGPA > prevSGPA + 0.5) trend = 'Improving';
          else if (currentSGPA < prevSGPA - 0.5) trend = 'Declining';
        }

        // Determine status
        let status = 'Active';
        if (riskLevel === 'High' && predictedRisk > 90) status = 'Critical';
        else if (riskLevel === 'High') status = 'Urgent';

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
          riskFactors,
          backlogs: student.studentInfo.activeBacklogCount || 0,
          trend,
          predictedRisk,
          status,
          aiPrediction
        };
      })
    );

    // Filter only at-risk students (Medium and High)
    const filteredAtRisk = atRiskStudents.filter(s => s.riskLevel !== 'Low');

    res.json({
      success: true,
      data: filteredAtRisk
    });
  } catch (error) {
    console.error('Get at-risk students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch at-risk students'
    });
  }
});

module.exports = router;
