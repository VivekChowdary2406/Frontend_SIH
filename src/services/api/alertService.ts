/**
 * Alerts & Notifications API Service (FastAPI /api/v1/alerts)
 */

import { apiClient } from '../apiClient';
import { SystemAlert } from '../../types/alert';
import { 
  AlertCreateRequest, 
  AlertUpdateRequest, 
  PaginatedResponse 
} from '../../types/api';

export const alertService = {
  /**
   * GET /api/v1/alerts
   */
  async listAlerts(params?: { 
    status?: string; 
    severity?: string; 
    type?: string; 
    state?: string; 
    page?: number; 
    limit?: number; 
  }): Promise<PaginatedResponse<SystemAlert> | SystemAlert[]> {
    return apiClient.get<PaginatedResponse<SystemAlert> | SystemAlert[]>('/api/v1/alerts', params);
  },

  /**
   * POST /api/v1/alerts
   */
  async createAlert(data: AlertCreateRequest): Promise<SystemAlert> {
    return apiClient.post<SystemAlert>('/api/v1/alerts', data);
  },

  /**
   * PUT /api/v1/alerts/{alert_id}/read
   */
  async markAlertRead(alertId: string): Promise<{ success: boolean; alert_id: string }> {
    return apiClient.put<{ success: boolean; alert_id: string }>(`/api/v1/alerts/${encodeURIComponent(alertId)}/read`);
  },

  /**
   * PUT /api/v1/alerts/{alert_id}
   */
  async updateAlert(alertId: string, data: AlertUpdateRequest): Promise<SystemAlert> {
    return apiClient.put<SystemAlert>(`/api/v1/alerts/${encodeURIComponent(alertId)}`, data);
  }
};
