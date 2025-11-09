const axios = require('axios');
const Prediction = require('../models/Prediction');
const Assessment = require('../models/Assessment');
const User = require('../models/User');

class AIService {
  constructor() {
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  }

  /**
   * Generate predictions for a student
   */
  async generateStudentPrediction(studentId) {
    try {
      // Get student data
      const student = await User.findById(studentId).populate('studentInfo');
      if (!student) throw new Error('Student not found');

      // Get latest assessments
      const assessments = await Assessment.find({ studentId })
        .populate('subjectId')
        .sort({ createdAt: -1 })
        .limit(10);

      // Prepare features for AI model
      const features = this.prepareFeatures(student, assessments);

      // Call enhanced AI service
      const response = await axios.post(`${this.aiServiceUrl}/api/predict/comprehensive`, features);

      if (response.data.success) {
        // Save prediction to database
        const prediction = new Prediction({
          studentId,
          predictionType: 'SEMESTER',
          semester: student.studentInfo.currentSemester,
          inputFeatures: features,
          prediction: {
            riskLevel: response.data.risk_assessment.risk_level,
            probability: response.data.risk_assessment.confidence,
            predictedScore: response.data.performance_prediction.predicted_score,
            confidence: response.data.performance_prediction.confidence
          },
          explanation: {
            topFeatures: response.data.insights.map(insight => ({
              feature: insight.title,
              impact: 0.8,
              description: insight.description
            }))
          },
          modelVersion: response.data.model_version || 'v2.0'
        });

        await prediction.save();
        return prediction;
      } else {
        throw new Error('AI service returned error');
      }
    } catch (error) {
      console.error('AI prediction failed:', error);
      // Return fallback prediction
      return this.getFallbackPrediction(studentId);
    }
  }

  /**
   * Prepare features from student data
   */
  prepareFeatures(student, assessments) {
    const totalClasses = assessments.reduce((sum, a) => sum + (a.attendance?.totalClasses || 0), 0);
    const attendedClasses = assessments.reduce((sum, a) => sum + (a.attendance?.attendedClasses || 0), 0);
    const attendancePercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 85;

    const internalMarks = assessments.map(a => 
      Math.max(a.internals?.internal1 || 0, a.internals?.internal2 || 0, a.internals?.internal3 || 0)
    );
    const bestOfTwo = internalMarks.length > 0 ? Math.max(...internalMarks) : 16;

    const assignmentMarks = assessments.reduce((sum, a) => sum + (a.assignments?.totalMarks || 0), 0) / (assessments.length || 1);
    const behaviorScore = assessments.reduce((sum, a) => sum + (a.behaviorScore || 8), 0) / (assessments.length || 1);

    return {
      attendance: Math.round(attendancePercentage),
      internal_marks: bestOfTwo,
      assignment_marks: Math.round(assignmentMarks || 15),
      behavior_score: Math.round(behaviorScore || 8),
      previous_cgpa: student.studentInfo?.cgpa || 7.5,
      backlog_count: student.studentInfo?.activeBacklogCount || 0,
      semester: student.studentInfo?.currentSemester || 5,
      study_hours: 6.0,
      family_income: 3,
      extracurricular: Math.random() > 0.5 ? 1 : 0
    };
  }

  /**
   * Generate predictions for all students in department
   */
  async generateDepartmentPredictions(department) {
    const students = await User.find({
      role: 'STUDENT',
      department,
      isActive: true
    });

    const results = [];
    for (const student of students) {
      try {
        const prediction = await this.generateStudentPrediction(student._id);
        results.push({ studentId: student._id, success: true, prediction });
      } catch (error) {
        results.push({ studentId: student._id, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Get risk analytics for department
   */
  async getDepartmentRiskAnalytics(department) {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/api/analytics/department/${department}`);
      if (response.data.success) {
        return response.data.analytics;
      } else {
        throw new Error('AI analytics service error');
      }
    } catch (error) {
      console.error('AI analytics failed:', error);
      return this.getFallbackAnalytics(department);
    }
  }

  /**
   * Fallback prediction when AI service is unavailable
   */
  getFallbackPrediction(studentId) {
    return new Prediction({
      studentId,
      predictionType: 'SEMESTER',
      semester: 5,
      inputFeatures: {
        attendance: 85,
        bestOfTwo: 16,
        assignments: 15,
        behaviorScore: 8,
        backlogCount: 0,
        previousSgpa: 8.0
      },
      prediction: {
        riskLevel: 'SAFE',
        probability: 0.85,
        predictedScore: 75,
        confidence: 0.80
      },
      explanation: {
        topFeatures: [
          { feature: 'attendance', impact: 0.3, description: 'Good attendance pattern' },
          { feature: 'internals', impact: 0.25, description: 'Consistent internal performance' }
        ]
      },
      modelVersion: 'fallback'
    });
  }

  /**
   * Fallback analytics when AI service is unavailable
   */
  getFallbackAnalytics(department) {
    return {
      riskDistribution: [
        { level: 'SAFE', count: 65, percentage: 70 },
        { level: 'NEEDS_ATTENTION', count: 20, percentage: 22 },
        { level: 'AT_RISK', count: 8, percentage: 8 }
      ],
      performanceTrends: [
        { month: 'Jan', avgScore: 78 },
        { month: 'Feb', avgScore: 80 },
        { month: 'Mar', avgScore: 82 }
      ]
    };
  }
}

module.exports = new AIService();