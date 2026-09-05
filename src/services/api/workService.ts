/**
 * Works Management API Service (FastAPI /api/v1/works)
 */

import { apiClient } from '../apiClient';
import { Work } from '../../types/work';
import { 
  WorkCreateRequest, 
  WorkUpdateRequest, 
  PaginatedResponse 
} from '../../types/api';

export const workService = {
  /**
   * GET /api/v1/works
   */
  async listWorks(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    state?: string; 
    status?: string; 
    risk_level?: string; 
    category?: string; 
    mp_id?: string;
    financial_year?: string;
  }): Promise<PaginatedResponse<Work> | Work[]> {
    return apiClient.get<PaginatedResponse<Work> | Work[]>('/api/v1/works', params);
  },

  /**
   * POST /api/v1/works
   */
  async createWork(data: WorkCreateRequest): Promise<Work> {
    return apiClient.post<Work>('/api/v1/works', data);
  },

  /**
   * GET /api/v1/works/{work_id}
   */
  async getWork(workId: string): Promise<Work> {
    return apiClient.get<Work>(`/api/v1/works/${encodeURIComponent(workId)}`);
  },

  /**
   * PUT /api/v1/works/{work_id}
   */
  async updateWork(workId: string, data: WorkUpdateRequest): Promise<Work> {
    return apiClient.put<Work>(`/api/v1/works/${encodeURIComponent(workId)}`, data);
  },

  /**
   * DELETE /api/v1/works/{work_id}
   */
  async deleteWork(workId: string): Promise<{ success: boolean; message?: string }> {
    return apiClient.delete<{ success: boolean; message?: string }>(`/api/v1/works/${encodeURIComponent(workId)}`);
  }
};
