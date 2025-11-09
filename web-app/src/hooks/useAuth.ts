import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { loginSuccess, logout, setLoading, setError } from '../store/slices/authSlice';
import { RegisterRequest, LoginRequest } from '../types/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: any) => state.auth);

  const login = async (credentials: LoginRequest) => {
    dispatch(setLoading(true));
    dispatch(setError(''));

    try {
      const response = await authService.login(credentials);
      dispatch(loginSuccess(response));
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (userData: RegisterRequest) => {
    dispatch(setLoading(true));
    dispatch(setError(''));

    try {
      const response = await authService.register(userData);
      dispatch(loginSuccess(response));
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout: logoutUser,
  };
};
