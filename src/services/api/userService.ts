/**
 * Users Management API Service (FastAPI /api/v1/users)
 */

import { apiClient } from '../apiClient';
import { 
  UserProfile, 
  UserCreateRequest, 
  UserUpdateRequest, 
  PaginatedResponse 
} from '../../types/api';

export const userService = {
  /**
   * GET /api/v1/users
   */
  async getUsers(params?: { 
    page?: number; 
    limit?: number; 
    role?: string; 
    search?: string; 
  }): Promise<PaginatedResponse<UserProfile> | UserProfile[]> {
    return apiClient.get<PaginatedResponse<UserProfile> | UserProfile[]>('/api/v1/users', params);
  },

  /**
   * POST /api/v1/users
   */
  async createUser(data: UserCreateRequest): Promise<UserProfile> {
    return apiClient.post<UserProfile>('/api/v1/users', data);
  },

  /**
   * GET /api/v1/users/{user_id}
   */
  async getUserById(userId: string): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`/api/v1/users/${userId}`);
  },

  /**
   * PUT /api/v1/users/{user_id}
   */
  async updateUser(userId: string, data: UserUpdateRequest): Promise<UserProfile> {
    return apiClient.put<UserProfile>(`/api/v1/users/${userId}`, data);
  }
};
