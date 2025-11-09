import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, AuthTokens } from '../../types/auth';
import { apiService } from '../../services/api';

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Store tokens in API service
      apiService.setAuthTokens(
        action.payload.tokens.accessToken,
        action.payload.tokens.refreshToken
      );
    },
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      // Clear tokens from API service
      apiService.clearAuthTokens();
    },
    updateTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;

      // Update tokens in API service
      apiService.setAuthTokens(
        action.payload.accessToken,
        action.payload.refreshToken
      );
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  loginSuccess,
  logout,
  updateTokens,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
