const express = require('express');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const predictionService = require('../services/predictionService');
const router = express.Router();

router.get('/profile', authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Get student dashboard data
router.get('/me/dashboard', authenticate, async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get student details
    const student = await User.findById(studentId).select('usn profile studentInfo cgpa lastLogin');
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get assessments
    const assessments = await Assessment.find({
      studentId
    }).sort({ semester: -1 });

    // Calculate current semester performance
    const currentSemester = student.studentInfo.currentSemester || 5;
    const currentAssessments = assessments.filter(a => a.semester === currentSemester);

    const sgpa = currentAssessments.length > 0
      ? currentAssessments.reduce((sum, a) => sum + (a.gradePoints || 0), 0) / currentAssessments.length
      : 0;

    const attendance = currentAssessments.length > 0
      ? currentAssessments.reduce((sum, a) => sum + (a.attendance.percentage || 0), 0) / currentAssessments.length
      : 0;

    // Get recent assessments
    const recentAssessments = assessments
      .slice(0, 5)
      .map(a => ({
        subject: a.subjectName || 'Subject',
        marks: a.totalMarks || 0,
        grade: a.grade || 'N/A',
        semester: a.semester
      }));

    // Get AI insights
    let aiInsights = [];
    try {
      const riskAnalysis = await predictionService.getRiskAnalysis(studentId.toString());
      aiInsights = [
        {
          type: 'info',
          title: 'Academic Performance',
          description: `Your current CGPA is ${student.cgpa}. ${riskAnalysis.recommendations?.[0] || 'Keep up the good work!'}`,
          confidence: 85
        }
      ];
    } catch (error) {
      console.error('AI insights error:', error);
      aiInsights = [
        {
          type: 'info',
          title: 'Academic Performance',
          description: 'Your performance data is being analyzed.',
          confidence: 70
        }
      ];
    }

    res.json({
      success: true,
      data: {
        student: {
          name: `${student.profile.firstName} ${student.profile.lastName}`,
          usn: student.usn,
          semester: currentSemester,
          cgpa: student.cgpa || 0,
          sgpa: parseFloat(sgpa.toFixed(2)),
          attendance: Math.round(attendance),
          backlogs: student.studentInfo.activeBacklogCount || 0
        },
        recentAssessments,
        totalSubjects: assessments.length,
        passedSubjects: assessments.filter(a => a.isPassed).length,
        aiInsights
      }
    });
  } catch (error) {
    console.error('Get student dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

module.exports = router;
