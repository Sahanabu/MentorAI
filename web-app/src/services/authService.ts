import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';
import { apiService } from './api';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/login', credentials);
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/register', userData);
  }

  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
  }

  async refreshToken(refreshToken: string) {
    return apiService.post('/auth/refresh', { refreshToken });
  }

  async getProfile(): Promise<{ user: User }> {
    return apiService.get<{ user: User }>('/auth/profile');
  }

  async updateProfile(profileData: any): Promise<{ user: User }> {
    return apiService.put<{ user: User }>('/auth/profile', profileData);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiService.put('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword: newPassword,
    });
  }
}

export const authService = new AuthService();