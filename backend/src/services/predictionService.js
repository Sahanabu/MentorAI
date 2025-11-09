const axios = require('axios');

class PredictionService {
  constructor() {
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  }

  /**
   * Call AI service for subject prediction
   */
  async predictSubjectPerformance(studentId, subjectId, features) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/predict/subject`, {
        student_id: studentId,
        subject_id: subjectId,
        features
      });

      return response.data.prediction;
    } catch (error) {
      console.error('AI Service subject prediction error:', error.message);
      // Return fallback prediction
      return {
        predicted_score: 75,
        confidence: 0.5,
        risk_level: 'NEEDS_ATTENTION',
        model_version: 'fallback'
      };
    }
  }

  /**
   * Call AI service for semester prediction
   */
  async predictSemesterSGPA(studentId, semester, features) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/predict/semester`, {
        student_id: studentId,
        semester,
        features
      });

      return response.data.prediction;
    } catch (error) {
      console.error('AI Service semester prediction error:', error.message);
      // Return fallback prediction
      return {
        predicted_sgpa: 7.5,
        confidence: 0.5,
        risk_level: 'NEEDS_ATTENTION',
        model_version: 'fallback'
      };
    }
  }

  /**
   * Get risk analysis for a student
   */
  async getRiskAnalysis(studentId) {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/risk-analysis/${studentId}`);
      return response.data.analysis;
    } catch (error) {
      console.error('AI Service risk analysis error:', error.message);
      return {
        overall_risk: 'NEEDS_ATTENTION',
        risk_factors: ['Unable to analyze'],
        recommendations: ['Manual review required']
      };
    }
  }
}

module.exports = new PredictionService();
