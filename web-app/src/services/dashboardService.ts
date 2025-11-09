import { apiService } from './api';

export interface StudentDashboardData {
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
    level: 'SAFE' | 'NEEDS_ATTENTION' | 'AT_RISK';
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

export interface MentorDashboardData {
  stats: {
    totalStudents: number;
    atRiskStudents: number;
    interventions: number;
    averageCGPA: number;
    attendanceRate: number;
    improvementRate: number;
  };
  atRiskStudents: Array<{
    id: string;
    usn: string;
    name: string;
    cgpa: number;
    attendance: number;
    riskLevel: 'SAFE' | 'NEEDS_ATTENTION' | 'AT_RISK';
    lastIntervention?: string;
  }>;
  performanceData: Array<{
    month: string;
    avgCGPA: number;
    attendance: number;
  }>;
  riskDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export interface HODDashboardData {
  departmentStats: {
    totalStudents: number;
    atRiskStudents: number;
    avgCGPA: number;
    avgAttendance: number;
  };
  performanceTrends: Array<{
    semester: string;
    avgCGPA: number;
    students: number;
  }>;
  riskDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  mentorPerformance: Array<{
    mentor: string;
    students: number;
    atRisk: number;
    avgCGPA: number;
  }>;
  subjectAnalytics: Array<{
    subject: string;
    avgMarks: number;
    passRate: number;
  }>;
}

class DashboardService {
  async getStudentDashboard(): Promise<StudentDashboardData> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Get student analytics
    const analyticsResponse = await apiService.get(`/analytics/student/${user.id}`);
    const analytics = analyticsResponse.data;
    
    // Get latest prediction
    const predictionResponse = await apiService.get(`/predictions/student/${user.id}/latest`);
    const prediction = predictionResponse.data;
    
    return {
      profile: {
        usn: user.usn,
        name: `${user.profile.firstName} ${user.profile.lastName}`,
        semester: user.studentInfo.currentSemester,
        department: user.department,
        cgpa: user.studentInfo.cgpa
      },
      currentSemester: {
        sgpa: analytics.semesterSGPA[user.studentInfo.currentSemester]?.sgpa || 0,
        subjects: analytics.assessments.length,
        attendance: analytics.assessments.reduce((sum: number, a: any) => sum + a.attendance.percentage, 0) / analytics.assessments.length || 0,
        backlogs: analytics.backlogs.active.length
      },
      riskAssessment: {
        level: prediction?.prediction.riskLevel || 'SAFE',
        factors: this.extractRiskFactors(prediction?.inputFeatures),
        confidence: prediction?.prediction.confidence * 100 || 0
      },
      performanceData: analytics.performanceTrend || [],
      subjectPerformance: analytics.assessments.map((a: any) => ({
        subject: a.subjectId.subjectName,
        marks: a.totalMarks || 0,
        total: 100
      })),
      aiInsights: this.generateAIInsights(analytics, prediction)
    };
  }

  async getMentorDashboard(): Promise<MentorDashboardData> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Get mentor analytics
    const analyticsResponse = await apiService.get(`/analytics/mentor/${user.id}`);
    const analytics = analyticsResponse.data;
    
    // Get mentor students
    const studentsResponse = await apiService.get(`/mentors/${user.id}/students`);
    const students = studentsResponse.data;
    
    // Get at-risk students
    const atRiskResponse = await apiService.get(`/mentors/${user.id}/at-risk`);
    const atRiskStudents = atRiskResponse.data;
    
    return {
      stats: {
        totalStudents: analytics.totalStudents,
        atRiskStudents: atRiskStudents.length,
        interventions: 0, // Would come from interventions API
        averageCGPA: analytics.performanceStats?.averageMarks / 10 || 0,
        attendanceRate: analytics.performanceStats?.averageAttendance || 0,
        improvementRate: analytics.passRate || 0
      },
      atRiskStudents: atRiskStudents.map((student: any) => ({
        id: student.student.id,
        usn: student.student.usn,
        name: `${student.student.profile.firstName} ${student.student.profile.lastName}`,
        cgpa: student.student.studentInfo.cgpa,
        attendance: student.student.attendance || 0,
        riskLevel: student.prediction.riskLevel,
        lastIntervention: student.lastUpdated
      })),
      performanceData: [], // Would need historical data
      riskDistribution: analytics.riskDistribution?.map((item: any) => ({
        name: item._id,
        value: item.count,
        color: this.getRiskColor(item._id)
      })) || []
    };
  }

  async getHODDashboard(): Promise<HODDashboardData> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Get department analytics
    const analyticsResponse = await apiService.get(`/analytics/department/${user.department}`);
    const analytics = analyticsResponse.data;
    
    return {
      departmentStats: {
        totalStudents: analytics.overview.totalStudents,
        atRiskStudents: analytics.overview.atRiskCount,
        avgCGPA: analytics.semesterPerformance.reduce((sum: number, sem: any) => sum + sem.averageMarks, 0) / analytics.semesterPerformance.length / 10 || 0,
        avgAttendance: analytics.semesterPerformance.reduce((sum: number, sem: any) => sum + sem.averageAttendance, 0) / analytics.semesterPerformance.length || 0
      },
      performanceTrends: analytics.semesterPerformance.map((sem: any) => ({
        semester: `Sem ${sem._id}`,
        avgCGPA: sem.averageMarks / 10,
        students: sem.totalStudents
      })),
      riskDistribution: [
        { name: 'Low Risk', value: analytics.overview.totalStudents - analytics.overview.atRiskCount, color: 'hsl(var(--success))' },
        { name: 'Medium Risk', value: Math.floor(analytics.overview.atRiskCount * 0.6), color: 'hsl(var(--warning))' },
        { name: 'High Risk', value: Math.floor(analytics.overview.atRiskCount * 0.4), color: 'hsl(var(--destructive))' }
      ],
      mentorPerformance: [], // Would need mentor-specific analytics
      subjectAnalytics: [] // Would need subject-specific analytics
    };
  }

  private extractRiskFactors(features: any): string[] {
    if (!features) return [];
    
    const factors = [];
    if (features.attendance < 75) factors.push('Low attendance');
    if (features.bestOfTwo < 15) factors.push('Poor internal marks');
    if (features.assignments < 12) factors.push('Low assignment scores');
    if (features.backlogCount > 0) factors.push(`${features.backlogCount} active backlogs`);
    if (features.behaviorScore < 6) factors.push('Behavioral concerns');
    
    return factors.length > 0 ? factors : ['Recent performance dip'];
  }

  private generateAIInsights(analytics: any, prediction: any): Array<{
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
    confidence: number;
  }> {
    const insights = [];
    
    if (prediction?.prediction.riskLevel === 'SAFE') {
      insights.push({
        type: 'success' as const,
        title: 'Strong Performance Trend',
        description: 'Your academic performance is on track. Continue your current study patterns.',
        confidence: prediction.prediction.confidence * 100
      });
    }
    
    if (analytics.backlogs?.active.length > 0) {
      insights.push({
        type: 'warning' as const,
        title: 'Backlog Attention Required',
        description: `You have ${analytics.backlogs.active.length} active backlog(s). Focus on clearing them this semester.`,
        confidence: 90
      });
    }
    
    const avgAttendance = analytics.assessments?.reduce((sum: number, a: any) => sum + a.attendance.percentage, 0) / analytics.assessments?.length || 0;
    if (avgAttendance >= 85) {
      insights.push({
        type: 'info' as const,
        title: 'Excellent Attendance',
        description: `You're maintaining ${Math.round(avgAttendance)}% attendance. Keep it up!`,
        confidence: 95
      });
    }
    
    return insights;
  }

  private getRiskColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'SAFE': return 'hsl(var(--success))';
      case 'NEEDS_ATTENTION': return 'hsl(var(--warning))';
      case 'AT_RISK': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted))';
    }
  }
}

export const dashboardService = new DashboardService();