/**
 * Duplicate Detection API Service (FastAPI /api/v1/duplicates)
 */

import { apiClient } from '../apiClient';
import { 
  DuplicateCheckRequest, 
  DuplicateMatchRecord, 
  DuplicateResolveRequest 
} from '../../types/api';

export const duplicateService = {
  /**
   * POST /api/v1/duplicates/check
   */
  async checkForDuplicates(candidate: DuplicateCheckRequest): Promise<{
    has_matches: boolean;
    highest_score: number;
    matches: DuplicateMatchRecord[];
  }> {
    return apiClient.post<{
      has_matches: boolean;
      highest_score: number;
      matches: DuplicateMatchRecord[];
    }>('/api/v1/duplicates/check', candidate);
  },

  /**
   * GET /api/v1/duplicates
   */
  async listDuplicates(params?: { 
    threshold?: number; 
    status?: string; 
    state?: string; 
  }): Promise<DuplicateMatchRecord[]> {
    return apiClient.get<DuplicateMatchRecord[]>('/api/v1/duplicates', params);
  },

  /**
   * PUT /api/v1/duplicates/{match_id}/resolve
   */
  async resolveDuplicate(matchId: string, data: DuplicateResolveRequest): Promise<DuplicateMatchRecord> {
    return apiClient.put<DuplicateMatchRecord>(`/api/v1/duplicates/${encodeURIComponent(matchId)}/resolve`, data);
  }
};
