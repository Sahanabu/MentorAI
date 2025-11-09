export interface User {
  _id: string;
  usn?: string;
  email: string;
  role: 'HOD' | 'MENTOR' | 'TEACHER' | 'STUDENT';
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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'HOD' | 'MENTOR' | 'TEACHER' | 'STUDENT';
  usn?: string;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
  department: string;
  studentInfo?: {
    admissionYear: number;
    entryType: 'REGULAR' | 'LATERAL';
  };
  teacherInfo?: {
    employeeId?: string;
    specialization: string[];
  };
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ApiSuccess<T = any> {
  success: true;
  message: string;
  data: T;
}
