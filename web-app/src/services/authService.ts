import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';
import { apiService } from './api';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      // Store tokens
      apiService.setAuthTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userRole', response.data.user.role.toLowerCase());
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    
    if (response.success && response.data) {
      // Store tokens
      apiService.setAuthTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userRole', response.data.user.role.toLowerCase());
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage
      apiService.clearAuthTokens();
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
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

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role.toLowerCase();
  }
}

export const authService = new AuthService();