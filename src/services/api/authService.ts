/**
 * Authentication API Service (FastAPI /api/v1/auth)
 */

import { apiClient } from '../apiClient';
import { 
  LoginRequest, 
  AuthTokens, 
  RefreshTokenRequest, 
  ChangePasswordRequest, 
  UserProfile 
} from '../../types/api';

export const authService = {
  /**
   * POST /api/v1/auth/login
   */
  async login(credentials: LoginRequest): Promise<AuthTokens> {
    const data = await apiClient.post<AuthTokens>('/api/v1/auth/login', credentials);
    apiClient.setTokens(data);
    return data;
  },

  /**
   * POST /api/v1/auth/refresh
   */
  async refreshToken(refreshToken?: string): Promise<AuthTokens> {
    const token = refreshToken || apiClient.getRefreshToken();
    if (!token) throw new Error('No refresh token available');
    const body: RefreshTokenRequest = { refresh_token: token };
    const data = await apiClient.post<AuthTokens>('/api/v1/auth/refresh', body);
    apiClient.setTokens(data);
    return data;
  },

  /**
   * POST /api/v1/auth/change-password
   */
  async changePassword(passwords: ChangePasswordRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/api/v1/auth/change-password', passwords);
  },

  /**
   * GET /api/v1/auth/me
   */
  async getCurrentUser(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/api/v1/auth/me');
  },

  /**
   * Clear tokens and log out locally
   */
  logout() {
    apiClient.clearTokens();
  },

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
};
