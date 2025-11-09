export type UserRole = 'HOD' | 'MENTOR' | 'TEACHER' | 'STUDENT';

export interface User {
  _id: string;
  usn?: string;
  email: string;
  role: UserRole;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
  };
  department: string;
  studentInfo?: {
    admissionYear: number;
    entryType: 'REGULAR' | 'LATERAL';
    currentSemester: number;
    mentorId?: string;
    cgpa: number;
    activeBacklogCount: number;
  };
  teacherInfo?: {
    employeeId?: string;
    specialization: string[];
    subjectsTeaching: string[];
  };
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  semester: number;
  cgpa: number;
  attendance: number;
  backlogs: number;
  mentorId?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface PerformanceData {
  subject: string;
  marks: number;
  total: number;
  percentage: number;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
  subject: string;
}

export interface AIInsight {
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  confidence: number;
}

export interface DashboardStats {
  totalStudents: number;
  atRisk: number;
  averageAttendance: number;
  averageCGPA: number;
}
