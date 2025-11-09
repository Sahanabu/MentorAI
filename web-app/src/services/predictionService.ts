import { apiService } from './api';

export interface PredictionRequest {
  studentId: string;
  subjectId?: string;
  features: {
    attendance_percentage?: number;
    best_of_two_internals?: number;
    assignment_marks?: number;
    behavior_score?: number;
    active_backlog_count?: number;
    previous_sgpa?: number;
  };
}

export interface PredictionResponse {
  riskLevel: 'SAFE' | 'NEEDS_ATTENTION' | 'AT_RISK';
  probability: number;
  predictedScore: number;
  confidence: number;
  explanation: {
    topFeatures: Array<{
      feature: string;
      impact: number;
      description: string;
    }>;
  };
}

class PredictionService {
  async getStudentLatestPrediction(studentId: string): Promise<PredictionResponse | null> {
    try {
      const response = await apiService.get(`/predictions/student/${studentId}/latest`);
      return response.data;
    } catch (error) {
      console.error('Failed to get latest prediction:', error);
      return null;
    }
  }

  async predictSubjectPerformance(request: PredictionRequest): Promise<PredictionResponse> {
    const response = await apiService.post('/predictions/subject', request);
    return response.data;
  }

  async predictSemesterSGPA(request: PredictionRequest): Promise<PredictionResponse> {
    const response = await apiService.post('/predictions/semester', request);
    return response.data;
  }

  async getBatchPredictions(studentIds: string[]): Promise<PredictionResponse[]> {
    const response = await apiService.post('/predictions/batch', { studentIds });
    return response.data;
  }
}

export const predictionService = new PredictionService();