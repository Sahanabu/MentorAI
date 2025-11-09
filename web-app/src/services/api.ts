import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    console.log('API Base URL:', this.baseURL);
    
    this.api = axios.create({
      baseURL: `${this.baseURL}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        (config as any).metadata = { startTime: new Date() };
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time in development
        if (import.meta.env.DEV && (response.config as any).metadata) {
          const endTime = new Date();
          const duration = endTime.getTime() - (response.config as any).metadata.startTime.getTime();
          console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url}: ${duration}ms`);
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('API 401 Error:', {
            url: originalRequest.url,
            method: originalRequest.method,
            hasRefreshToken: !!this.getRefreshToken()
          });
          
          originalRequest._retry = true;

          try {
            // Try to refresh token
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              console.log('Attempting token refresh...');
              const response = await this.refreshToken(refreshToken);
              const { accessToken } = response.data.tokens;
              
              // Update stored token
              this.setToken(accessToken);
              console.log('Token refreshed successfully');
              
              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            console.log('Token refresh failed:', refreshError);
            // Only handle auth error if it's actually an auth endpoint
            if (originalRequest.url?.includes('/auth/') || originalRequest.url?.includes('/profile')) {
              console.log('Triggering auth error handler');
              this.handleAuthError();
            }
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return sessionStorage.getItem('refreshToken');
  }

  private setToken(token: string): void {
    sessionStorage.setItem('accessToken', token);
  }

  private setRefreshToken(token: string): void {
    sessionStorage.setItem('refreshToken', token);
  }

  private removeTokens(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  }

  private async refreshToken(refreshToken: string) {
    return this.api.post('/auth/refresh', { refreshToken });
  }

  private handleAuthError(): void {
    console.log('handleAuthError called:', {
      currentPath: window.location.pathname,
      willRedirect: !window.location.pathname.includes('/login')
    });
    
    this.removeTokens();
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login')) {
      console.log('Redirecting to login due to auth error');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
  }

  private handleApiError(error: any): void {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // Don't show toast for certain errors or missing routes
    const silentErrors = [401, 403, 404];
    if (!silentErrors.includes(error.response?.status)) {
      toast.error(message);
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('API Error:', error);
    }
  }

  // Public methods
  public setAuthTokens(accessToken: string, refreshToken?: string): void {
    if (accessToken) {
      this.setToken(accessToken);
    }
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  }

  public clearAuthTokens(): void {
    this.removeTokens();
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userRole');
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.get(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.patch(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.delete(url, config);
    return response.data;
  }

  // File upload method
  public async uploadFile<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response = await this.api.post(url, formData, config);
    return response.data;
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      await this.api.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;