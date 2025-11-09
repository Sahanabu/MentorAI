import { apiService } from './api';

export interface DynamicStudentData {
  profile: {
    usn: string;
    name: string;
    semester: number;
    department: string;
    cgpa: number;
  };
  currentSemester: {
    sgpa: number;
    subjects: number;
    attendance: number;
    backlogs: number;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    confidence: number;
  };
  performanceData: Array<{
    month: string;
    cgpa: number;
  }>;
  subjectPerformance: Array<{
    subject: string;
    marks: number;
    total: number;
  }>;
  aiInsights: Array<{
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
    confidence: number;
  }>;
}

class DynamicDashboardService {
  async getStudentDashboard(): Promise<DynamicStudentData> {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userId = user._id || user.id;
    
    if (!userId) {
      throw new Error('User ID not found. Please login again.');
    }

    try {
      // Get real-time analytics
      const analyticsResponse = await apiService.get(`/analytics/student/${userId}`);
      const analytics = analyticsResponse.data;
      
      // Generate fresh AI prediction
      const predictionResponse = await apiService.post(`/ai-predictions/generate/${userId}`);
      const prediction = predictionResponse.data;
      
      return this.transformToStudentData(user, analytics, prediction);
    } catch (error) {
      console.warn('Using fallback data due to API error:', error);
      return this.getFallbackStudentData(user);
    }
  }

  async getMentorDashboard() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userId = user._id || user.id;
    
    try {
      // Get mentor analytics
      const analyticsResponse = await apiService.get(`/analytics/mentor/${userId}`);
      const analytics = analyticsResponse.data;
      
      // Get assigned students with fresh predictions
      const studentsResponse = await apiService.get(`/mentors/${userId}/students`);
      const students = studentsResponse.data;
      
      // Get at-risk students
      const atRiskResponse = await apiService.get(`/mentors/${userId}/at-risk`);
      const atRiskStudents = atRiskResponse.data;
      
      return {
        stats: {
          totalStudents: analytics.totalStudents || students.length,
          atRiskStudents: atRiskStudents.length,
          interventions: analytics.interventions || 0,
          averageCGPA: analytics.performanceStats?.averageMarks / 10 || 8.2,
          attendanceRate: analytics.performanceStats?.averageAttendance || 85,
          improvementRate: analytics.passRate || 78
        },
        atRiskStudents: atRiskStudents.map((student: any) => ({
          id: student.student.id,
          usn: student.student.usn,
          name: `${student.student.profile.firstName} ${student.student.profile.lastName}`,
          cgpa: student.student.studentInfo.cgpa,
          attendance: student.student.attendance || 0,
          riskLevel: this.mapRiskLevel(student.prediction?.riskLevel || 'SAFE'),
          lastIntervention: student.lastUpdated
        })),
        performanceData: analytics.performanceTrend || this.generateTrendData(),
        riskDistribution: this.transformRiskDistribution(analytics.riskDistribution)
      };
    } catch (error) {
      console.warn('Using fallback mentor data:', error);
      return this.getFallbackMentorData();
    }
  }

  async getHODDashboard() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    
    try {
      // Get department analytics with AI insights
      const analyticsResponse = await apiService.get(`/analytics/department/${user.department}`);
      const analytics = analyticsResponse.data;
      
      // Get AI-powered department insights
      const aiAnalyticsResponse = await apiService.get('/ai-predictions/analytics/department');
      const aiAnalytics = aiAnalyticsResponse.data;
      
      return {
        departmentStats: {
          totalStudents: analytics.overview.totalStudents,
          atRiskStudents: analytics.overview.atRiskCount,
          avgCGPA: this.calculateAvgCGPA(analytics.semesterPerformance),
          avgAttendance: this.calculateAvgAttendance(analytics.semesterPerformance)
        },
        performanceTrends: analytics.semesterPerformance.map((sem: any) => ({
          semester: `Sem ${sem._id}`,
          avgCGPA: sem.averageMarks / 10,
          students: sem.totalStudents
        })),
        riskDistribution: this.transformAIRiskDistribution(aiAnalytics.risk_distribution),
        aiInsights: aiAnalytics.feature_importance,
        mentorPerformance: analytics.mentorPerformance || [],
        subjectAnalytics: analytics.subjectAnalytics || []
      };
    } catch (error) {
      console.warn('Using fallback HOD data:', error);
      return this.getFallbackHODData();
    }
  }

  async exportAnalytics(type: string, format: string = 'pdf') {
    try {
      const response = await apiService.get(`/analytics/export/${type}?format=${format}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_analytics.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true, message: 'Analytics exported successfully' };
    } catch (error) {
      throw new Error('Failed to export analytics');
    }
  }

  async viewStudentDetails(studentId: string) {
    try {
      const response = await apiService.get(`/students/${studentId}/detailed`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to load student details');
    }
  }

  async updateStudentData(studentId: string, data: any) {
    try {
      const response = await apiService.put(`/students/${studentId}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update student data');
    }
  }

  private transformToStudentData(user: any, analytics: any, prediction: any): DynamicStudentData {
    return {
      profile: {
        usn: user.usn,
        name: `${user.profile.firstName} ${user.profile.lastName}`,
        semester: user.studentInfo.currentSemester,
        department: user.department,
        cgpa: user.studentInfo.cgpa
      },
      currentSemester: {
        sgpa: analytics.semesterSGPA?.[user.studentInfo.currentSemester]?.sgpa || 0,
        subjects: analytics.assessments?.length || 0,
        attendance: this.calculateAttendance(analytics.assessments),
        backlogs: analytics.backlogs?.active?.length || 0
      },
      riskAssessment: {
        level: this.mapRiskLevel(prediction.prediction?.riskLevel || 'SAFE'),
        factors: this.extractRiskFactors(prediction.inputFeatures),
        confidence: (prediction.prediction?.confidence || 0.8) * 100
      },
      performanceData: analytics.performanceTrend || this.generateTrendData(),
      subjectPerformance: this.transformSubjectPerformance(analytics.assessments),
      aiInsights: this.generateAIInsights(analytics, prediction)
    };
  }

  private mapRiskLevel(backendLevel: string): 'low' | 'medium' | 'high' {
    switch (backendLevel) {
      case 'SAFE': return 'low';
      case 'NEEDS_ATTENTION': return 'medium';
      case 'AT_RISK': return 'high';
      default: return 'low';
    }
  }

  private calculateAttendance(assessments: any[]): number {
    if (!assessments || assessments.length === 0) return 85;
    const total = assessments.reduce((sum, a) => sum + (a.attendance?.percentage || 85), 0);
    return Math.round(total / assessments.length);
  }

  private transformSubjectPerformance(assessments: any[]): Array<{subject: string; marks: number; total: number}> {
    if (!assessments) return [];
    return assessments.map((a: any) => ({
      subject: a.subjectId?.subjectName || 'Unknown Subject',
      marks: a.totalMarks || 0,
      total: 100
    }));
  }

  private extractRiskFactors(features: any): string[] {
    if (!features) return ['Performance analysis in progress'];
    
    const factors = [];
    if (features.attendance < 75) factors.push('Low attendance');
    if (features.internal_marks < 15) factors.push('Poor internal marks');
    if (features.assignment_marks < 12) factors.push('Low assignment scores');
    if (features.backlog_count > 0) factors.push(`${features.backlog_count} active backlogs`);
    if (features.behavior_score < 6) factors.push('Behavioral concerns');
    
    return factors.length > 0 ? factors : ['Good academic standing'];
  }

  private generateAIInsights(analytics: any, prediction: any): Array<{type: 'success' | 'warning' | 'info'; title: string; description: string; confidence: number}> {
    const insights = [];
    
    if (prediction?.prediction?.riskLevel === 'SAFE') {
      insights.push({
        type: 'success' as const,
        title: 'Strong Performance Trend',
        description: 'Your academic performance is on track. Continue your current study patterns.',
        confidence: (prediction.prediction.confidence || 0.8) * 100
      });
    }
    
    if (analytics.backlogs?.active?.length > 0) {
      insights.push({
        type: 'warning' as const,
        title: 'Backlog Attention Required',
        description: `You have ${analytics.backlogs.active.length} active backlog(s). Focus on clearing them this semester.`,
        confidence: 90
      });
    }
    
    const avgAttendance = this.calculateAttendance(analytics.assessments);
    if (avgAttendance >= 85) {
      insights.push({
        type: 'info' as const,
        title: 'Excellent Attendance',
        description: `You're maintaining ${avgAttendance}% attendance. Keep it up!`,
        confidence: 95
      });
    }
    
    return insights;
  }

  private generateTrendData() {
    return [
      { month: 'Jan', cgpa: 7.8 },
      { month: 'Feb', cgpa: 8.0 },
      { month: 'Mar', cgpa: 8.2 },
      { month: 'Apr', cgpa: 8.1 },
      { month: 'May', cgpa: 8.3 }
    ];
  }

  private transformRiskDistribution(distribution: any[]) {
    if (!distribution) return [];
    return distribution.map((item: any) => ({
      name: item._id,
      value: item.count,
      color: this.getRiskColor(item._id)
    }));
  }

  private transformAIRiskDistribution(distribution: any) {
    if (!distribution) return [];
    return Object.entries(distribution).map(([key, value]) => ({
      name: key,
      value: value as number,
      color: this.getRiskColor(key)
    }));
  }

  private getRiskColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'SAFE': return 'hsl(var(--success))';
      case 'NEEDS_ATTENTION': return 'hsl(var(--warning))';
      case 'AT_RISK': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted))';
    }
  }

  private calculateAvgCGPA(semesterPerformance: any[]): number {
    if (!semesterPerformance || semesterPerformance.length === 0) return 8.2;
    const total = semesterPerformance.reduce((sum, sem) => sum + sem.averageMarks, 0);
    return (total / semesterPerformance.length) / 10;
  }

  private calculateAvgAttendance(semesterPerformance: any[]): number {
    if (!semesterPerformance || semesterPerformance.length === 0) return 85;
    const total = semesterPerformance.reduce((sum, sem) => sum + sem.averageAttendance, 0);
    return total / semesterPerformance.length;
  }

  private getFallbackStudentData(user: any): DynamicStudentData {
    return {
      profile: {
        usn: user.usn || 'N/A',
        name: `${user.profile?.firstName || 'Student'} ${user.profile?.lastName || ''}`,
        semester: user.studentInfo?.currentSemester || 5,
        department: user.department || 'CS',
        cgpa: user.studentInfo?.cgpa || 8.2
      },
      currentSemester: {
        sgpa: 8.2,
        subjects: 6,
        attendance: 85,
        backlogs: 0
      },
      riskAssessment: {
        level: 'low',
        factors: ['Good academic standing'],
        confidence: 85
      },
      performanceData: this.generateTrendData(),
      subjectPerformance: [
        { subject: 'Data Structures', marks: 85, total: 100 },
        { subject: 'Database Systems', marks: 78, total: 100 },
        { subject: 'Web Development', marks: 91, total: 100 }
      ],
      aiInsights: [
        {
          type: 'success',
          title: 'Strong Performance',
          description: 'Maintaining good academic performance',
          confidence: 85
        }
      ]
    };
  }

  private getFallbackMentorData() {
    return {
      stats: {
        totalStudents: 25,
        atRiskStudents: 3,
        interventions: 12,
        averageCGPA: 8.2,
        attendanceRate: 85,
        improvementRate: 78
      },
      atRiskStudents: [],
      performanceData: this.generateTrendData(),
      riskDistribution: [
        { name: 'Low Risk', value: 20, color: 'hsl(var(--success))' },
        { name: 'Medium Risk', value: 3, color: 'hsl(var(--warning))' },
        { name: 'High Risk', value: 2, color: 'hsl(var(--destructive))' }
      ]
    };
  }

  private getFallbackHODData() {
    return {
      departmentStats: {
        totalStudents: 450,
        atRiskStudents: 45,
        avgCGPA: 8.2,
        avgAttendance: 85
      },
      performanceTrends: [
        { semester: 'Sem 5', avgCGPA: 8.0, students: 120 },
        { semester: 'Sem 6', avgCGPA: 8.2, students: 115 },
        { semester: 'Sem 7', avgCGPA: 8.3, students: 110 }
      ],
      riskDistribution: [
        { name: 'Low Risk', value: 350, color: 'hsl(var(--success))' },
        { name: 'Medium Risk', value: 70, color: 'hsl(var(--warning))' },
        { name: 'High Risk', value: 30, color: 'hsl(var(--destructive))' }
      ],
      aiInsights: {},
      mentorPerformance: [],
      subjectAnalytics: []
    };
  }
}

export const dynamicDashboardService = new DynamicDashboardService();