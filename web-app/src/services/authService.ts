import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';
import { apiService } from './api';
import { toast } from 'sonner';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      if (response.success && response.data) {
        console.log('Auth response data:', response.data);
        
        const { user, tokens } = response.data;
        
        if (tokens?.accessToken) {
          // Store tokens
          apiService.setAuthTokens(
            tokens.accessToken,
            tokens.refreshToken
          );
        }
        
        if (user?.role) {
          // Store user data in sessionStorage
          sessionStorage.setItem('user', JSON.stringify(user));
          sessionStorage.setItem('userRole', user.role.toLowerCase());
        }
        
        toast.success('Login successful!');
      }
      
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw new Error(message);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', userData);
      
      if (response.success && response.data) {
        console.log('Register response data:', response.data);
        
        const { user, tokens } = response.data;
        
        if (tokens?.accessToken) {
          // Store tokens
          apiService.setAuthTokens(
            tokens.accessToken,
            tokens.refreshToken
          );
        }
        
        if (user?.role) {
          // Store user data in sessionStorage
          sessionStorage.setItem('user', JSON.stringify(user));
          sessionStorage.setItem('userRole', user.role.toLowerCase());
        }
        
        toast.success('Registration successful!');
      }
      
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw new Error(message);
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear session storage
      apiService.clearAuthTokens();
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
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('accessToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  getUserRole(): string | null {
    return sessionStorage.getItem('userRole');
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role.toLowerCase();
  }
}

export const authService = new AuthService();