/**
 * Fund Management API Service (FastAPI /api/v1/funds)
 */

import { apiClient } from '../apiClient';
import { 
  FundsSummaryResponse, 
  FundAllocationCreateRequest, 
  CalamityConsentRequest, 
  CalamityConsentResponse 
} from '../../types/api';

export const fundService = {
  /**
   * GET /api/v1/funds/summary
   */
  async getFundsSummary(financialYear?: string): Promise<FundsSummaryResponse> {
    return apiClient.get<FundsSummaryResponse>('/api/v1/funds/summary', {
      financial_year: financialYear
    });
  },

  /**
   * POST /api/v1/funds/allocations
   */
  async createAllocation(data: FundAllocationCreateRequest): Promise<{ success: boolean; allocation_id?: string }> {
    return apiClient.post<{ success: boolean; allocation_id?: string }>('/api/v1/funds/allocations', data);
  },

  /**
   * GET /api/v1/funds/calamity-consents
   */
  async listCalamityConsents(params?: { mp_id?: string; state?: string }): Promise<CalamityConsentResponse[]> {
    return apiClient.get<CalamityConsentResponse[]>('/api/v1/funds/calamity-consents', params);
  },

  /**
   * POST /api/v1/funds/calamity-consents
   */
  async submitCalamityConsent(data: CalamityConsentRequest): Promise<CalamityConsentResponse> {
    return apiClient.post<CalamityConsentResponse>('/api/v1/funds/calamity-consents', data);
  }
};
