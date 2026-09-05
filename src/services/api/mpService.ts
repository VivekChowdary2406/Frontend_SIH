/**
 * Members of Parliament (MPs) API Service (FastAPI /api/v1/mps)
 */

import { apiClient } from '../apiClient';
import { MPProfile } from '../../types/mp';
import { Work } from '../../types/work';
import { 
  MPCreateRequest, 
  MPUpdateRequest, 
  MPAllocationResponse, 
  PaginatedResponse 
} from '../../types/api';

export const mpService = {
  /**
   * GET /api/v1/mps
   */
  async listMPs(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    state?: string; 
    house?: string; 
  }): Promise<PaginatedResponse<MPProfile> | MPProfile[]> {
    return apiClient.get<PaginatedResponse<MPProfile> | MPProfile[]>('/api/v1/mps', params);
  },

  /**
   * POST /api/v1/mps
   */
  async createMP(data: MPCreateRequest): Promise<MPProfile> {
    return apiClient.post<MPProfile>('/api/v1/mps', data);
  },

  /**
   * GET /api/v1/mps/{mp_id}
   */
  async getMP(mpId: string): Promise<MPProfile> {
    return apiClient.get<MPProfile>(`/api/v1/mps/${encodeURIComponent(mpId)}`);
  },

  /**
   * PUT /api/v1/mps/{mp_id}
   */
  async updateMP(mpId: string, data: MPUpdateRequest): Promise<MPProfile> {
    return apiClient.put<MPProfile>(`/api/v1/mps/${encodeURIComponent(mpId)}`, data);
  },

  /**
   * GET /api/v1/mps/{mp_id}/allocations
   */
  async getMPAllocations(mpId: string, financialYear?: string): Promise<MPAllocationResponse[]> {
    return apiClient.get<MPAllocationResponse[]>(`/api/v1/mps/${encodeURIComponent(mpId)}/allocations`, {
      financial_year: financialYear
    });
  },

  /**
   * GET /api/v1/mps/{mp_id}/works
   */
  async getMPWorks(mpId: string, params?: { status?: string; limit?: number }): Promise<Work[]> {
    return apiClient.get<Work[]>(`/api/v1/mps/${encodeURIComponent(mpId)}/works`, params);
  }
};
