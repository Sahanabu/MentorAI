const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Backlog = require('../models/Backlog');
const Prediction = require('../models/Prediction');

class AnalyticsController {
  // Department analytics (HOD)
  async getDepartmentAnalytics(req, res, next) {
    try {
      const { department } = req.params;
      const { academicYear } = req.query;

      // Get total students
      const totalStudents = await User.countDocuments({
        role: 'STUDENT',
        department: department.toUpperCase(),
        isActive: true
      });

      // Get active mentors
      const activeMentors = await User.countDocuments({
        role: 'MENTOR',
        department: department.toUpperCase(),
        isActive: true
      });

      // Get at-risk students count
      const atRiskCount = await Prediction.countDocuments({
        'prediction.riskLevel': { $in: ['AT_RISK', 'NEEDS_ATTENTION'] },
        isValid: true
      });

      // Get semester-wise performance
      const semesterPerformance = await Assessment.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $match: {
            'student.department': department.toUpperCase(),
            isPassed: { $exists: true }
          }
        },
        {
          $group: {
            _id: '$semester',
            totalStudents: { $sum: 1 },
            passedStudents: {
              $sum: { $cond: ['$isPassed', 1, 0] }
            },
            averageMarks: { $avg: '$totalMarks' },
            averageAttendance: { $avg: '$attendance.percentage' }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Get semester-wise student distribution
      const semesterDistribution = await User.aggregate([
        {
          $match: {
            role: 'STUDENT',
            department: department.toUpperCase(),
            isActive: true
          }
        },
        {
          $group: {
            _id: '$studentInfo.currentSemester',
            count: { $sum: 1 },
            regularCount: {
              $sum: { $cond: [{ $eq: ['$studentInfo.entryType', 'REGULAR'] }, 1, 0] }
            },
            lateralCount: {
              $sum: { $cond: [{ $eq: ['$studentInfo.entryType', 'LATERAL'] }, 1, 0] }
            }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Get backlog statistics
      const backlogStats = await Backlog.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $match: {
            'student.department': department.toUpperCase()
          }
        },
        {
          $group: {
            _id: '$isCleared',
            count: { $sum: 1 }
          }
        }
      ]);

      const activeBacklogs = backlogStats.find(stat => stat._id === false)?.count || 0;
      const clearedBacklogs = backlogStats.find(stat => stat._id === true)?.count || 0;

      res.json({
        success: true,
        data: {
          overview: {
            totalStudents,
            activeMentors,
            atRiskCount,
            activeBacklogs,
            clearedBacklogs
          },
          semesterPerformance,
          semesterDistribution,
          passRate: semesterPerformance.length > 0 
            ? semesterPerformance.reduce((sum, sem) => sum + (sem.passedStudents / sem.totalStudents), 0) / semesterPerformance.length * 100
            : 0
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Mentor analytics
  async getMentorAnalytics(req, res, next) {
    try {
      const { mentorId } = req.params;

      // Get mentor's students
      const students = await User.find({
        role: 'STUDENT',
        'studentInfo.mentorId': mentorId,
        isActive: true
      });

      const studentIds = students.map(s => s._id);

      // Get performance statistics
      const performanceStats = await Assessment.aggregate([
        {
          $match: {
            studentId: { $in: studentIds },
            isPassed: { $exists: true }
          }
        },
        {
          $group: {
            _id: null,
            totalAssessments: { $sum: 1 },
            passedAssessments: {
              $sum: { $cond: ['$isPassed', 1, 0] }
            },
            averageMarks: { $avg: '$totalMarks' },
            averageAttendance: { $avg: '$attendance.percentage' }
          }
        }
      ]);

      // Get risk distribution
      const riskDistribution = await Prediction.aggregate([
        {
          $match: {
            studentId: { $in: studentIds },
            isValid: true
          }
        },
        {
          $group: {
            _id: '$prediction.riskLevel',
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          totalStudents: students.length,
          performanceStats: performanceStats[0] || {},
          riskDistribution,
          passRate: performanceStats[0] 
            ? (performanceStats[0].passedAssessments / performanceStats[0].totalAssessments) * 100
            : 0
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Subject analytics (Teacher)
  async getSubjectAnalytics(req, res, next) {
    try {
      const { subjectId } = req.params;
      const { semester, academicYear } = req.query;

      let matchQuery = { subjectId };
      if (semester) matchQuery.semester = parseInt(semester);
      if (academicYear) matchQuery.academicYear = academicYear;

      const analytics = await Assessment.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalStudents: { $sum: 1 },
            passedStudents: {
              $sum: { $cond: ['$isPassed', 1, 0] }
            },
            averageMarks: { $avg: '$totalMarks' },
            averageInternals: { $avg: '$internals.bestOfTwo' },
            averageAssignments: { $avg: '$assignments.totalMarks' },
            averageAttendance: { $avg: '$attendance.percentage' },
            gradeDistribution: {
              $push: '$grade'
            }
          }
        }
      ]);

      // Calculate grade distribution
      const gradeDistribution = {};
      if (analytics[0]?.gradeDistribution) {
        analytics[0].gradeDistribution.forEach(grade => {
          gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
        });
      }

      res.json({
        success: true,
        data: {
          ...analytics[0],
          gradeDistribution,
          passRate: analytics[0] 
            ? (analytics[0].passedStudents / analytics[0].totalStudents) * 100
            : 0
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Student analytics
  async getStudentAnalytics(req, res, next) {
    try {
      const { studentId } = req.params;

      // Get student info
      const student = await User.findById(studentId)
        .populate('studentInfo.mentorId', 'profile.firstName profile.lastName');

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Get all assessments
      const assessments = await Assessment.find({ studentId })
        .populate('subjectId', 'subjectName subjectCode credits')
        .sort({ semester: 1 });

      // Get backlogs
      const backlogs = await Backlog.find({ studentId })
        .populate('subjectId', 'subjectName subjectCode');

      // Get latest predictions
      const latestPrediction = await Prediction.findOne({
        studentId,
        predictionType: 'SEMESTER',
        isValid: true
      }).sort({ createdAt: -1 });

      // Calculate semester-wise SGPA
      const semesterSGPA = {};
      assessments.forEach(assessment => {
        if (!semesterSGPA[assessment.semester]) {
          semesterSGPA[assessment.semester] = {
            totalCredits: 0,
            totalGradePoints: 0,
            subjects: []
          };
        }
        
        const credits = assessment.subjectId.credits;
        semesterSGPA[assessment.semester].totalCredits += credits;
        semesterSGPA[assessment.semester].totalGradePoints += assessment.gradePoints * credits;
        semesterSGPA[assessment.semester].subjects.push(assessment);
      });

      // Calculate SGPA for each semester
      Object.keys(semesterSGPA).forEach(sem => {
        const semData = semesterSGPA[sem];
        semData.sgpa = semData.totalCredits > 0 
          ? semData.totalGradePoints / semData.totalCredits 
          : 0;
      });

      res.json({
        success: true,
        data: {
          student: {
            ...student.toObject(),
            mentor: student.studentInfo.mentorId
          },
          assessments,
          backlogs: {
            active: backlogs.filter(b => !b.isCleared),
            cleared: backlogs.filter(b => b.isCleared)
          },
          semesterSGPA,
          latestPrediction,
          performanceTrend: Object.keys(semesterSGPA).map(sem => ({
            semester: parseInt(sem),
            sgpa: semesterSGPA[sem].sgpa
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Performance trends
  async getPerformanceTrends(req, res, next) {
    try {
      const { department, months = 12 } = req.query;
      
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - parseInt(months));

      const trends = await Assessment.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $match: {
            'student.department': department?.toUpperCase(),
            createdAt: { $gte: startDate },
            isPassed: { $exists: true }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            totalAssessments: { $sum: 1 },
            passedAssessments: {
              $sum: { $cond: ['$isPassed', 1, 0] }
            },
            averageMarks: { $avg: '$totalMarks' },
            averageAttendance: { $avg: '$attendance.percentage' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);

      res.json({
        success: true,
        data: trends.map(trend => ({
          ...trend,
          passRate: (trend.passedAssessments / trend.totalAssessments) * 100
        }))
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();