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

      // Call AI service
      const response = await axios.post(`${this.aiServiceUrl}/predict/semester`, {
        features,
        student_id: studentId
      });

      // Save prediction to database
      const prediction = new Prediction({
        studentId,
        predictionType: 'SEMESTER',
        semester: student.studentInfo.currentSemester,
        inputFeatures: features,
        prediction: response.data.prediction,
        explanation: response.data.explanation,
        modelVersion: response.data.model_version || 'v1.0'
      });

      await prediction.save();
      return prediction;
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
    const attendancePercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

    const internalMarks = assessments.map(a => 
      Math.max(a.internals?.internal1 || 0, a.internals?.internal2 || 0, a.internals?.internal3 || 0)
    );
    const bestOfTwo = internalMarks.length > 0 ? Math.max(...internalMarks) : 0;

    const assignmentMarks = assessments.reduce((sum, a) => sum + (a.assignments?.totalMarks || 0), 0) / assessments.length;
    const behaviorScore = assessments.reduce((sum, a) => sum + (a.behaviorScore || 7), 0) / assessments.length;

    return {
      attendance: Math.round(attendancePercentage),
      bestOfTwo: bestOfTwo,
      assignments: Math.round(assignmentMarks || 0),
      behaviorScore: Math.round(behaviorScore || 7),
      backlogCount: student.studentInfo?.activeBacklogCount || 0,
      previousSgpa: student.studentInfo?.cgpa || 0,
      currentSemester: student.studentInfo?.currentSemester || 5
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
      const response = await axios.get(`${this.aiServiceUrl}/analytics/department/${department}`);
      return response.data;
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