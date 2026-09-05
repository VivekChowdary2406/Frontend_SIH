/**
 * Dashboard & Analytics API Service (FastAPI /api/v1/dashboard & trends)
 */

import { apiClient } from '../apiClient';
import { 
  DashboardSummaryResponse, 
  TrendsResponse, 
  DelayAnalysisResponse 
} from '../../types/api';

export const dashboardService = {
  /**
   * GET /api/v1/dashboard/summary
   */
  async getSummary(params?: { state?: string; financial_year?: string }): Promise<DashboardSummaryResponse> {
    return apiClient.get<DashboardSummaryResponse>('/api/v1/dashboard/summary', params);
  },

  /**
   * GET /api/v1/trends
   */
  async getTrends(params?: { 
    interval?: 'monthly' | 'quarterly' | 'yearly'; 
    state?: string; 
    category?: string; 
  }): Promise<TrendsResponse> {
    return apiClient.get<TrendsResponse>('/api/v1/trends', params);
  },

  /**
   * GET /api/v1/delays
   */
  async getDelays(params?: { 
    threshold?: number; 
    state?: string; 
    limit?: number; 
  }): Promise<DelayAnalysisResponse> {
    return apiClient.get<DelayAnalysisResponse>('/api/v1/delays', params);
  }
};
