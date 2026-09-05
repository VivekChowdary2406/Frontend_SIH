/**
 * Risk Management & Anomalies API Service (FastAPI /api/v1/risk & anomalies)
 */

import { apiClient } from '../apiClient';
import { Work } from '../../types/work';
import { 
  WorkRiskResponse, 
  AnomalyReportResponse, 
  PaginatedResponse 
} from '../../types/api';

export const riskService = {
  /**
   * GET /api/v1/risk/work/{work_id}
   */
  async getWorkRisk(workId: string): Promise<WorkRiskResponse> {
    return apiClient.get<WorkRiskResponse>(`/api/v1/risk/work/${encodeURIComponent(workId)}`);
  },

  /**
   * POST /api/v1/risk/evaluate/{work_id}
   */
  async evaluateWorkRisk(workId: string): Promise<WorkRiskResponse> {
    return apiClient.post<WorkRiskResponse>(`/api/v1/risk/evaluate/${encodeURIComponent(workId)}`);
  },

  /**
   * GET /api/v1/risk/high-risk
   */
  async getHighRiskWorks(params?: { 
    threshold?: number; 
    limit?: number; 
    state?: string; 
  }): Promise<Work[]> {
    return apiClient.get<Work[]>('/api/v1/risk/high-risk', params);
  },

  /**
   * GET /api/v1/anomalies
   */
  async getAnomalyReport(params?: { 
    type?: string; 
    state?: string; 
  }): Promise<AnomalyReportResponse> {
    return apiClient.get<AnomalyReportResponse>('/api/v1/anomalies', params);
  }
};
