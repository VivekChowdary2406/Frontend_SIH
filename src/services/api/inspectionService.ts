/**
 * Inspections API Service (FastAPI /api/v1/inspections)
 */

import { apiClient } from '../apiClient';
import { 
  InspectionRecord, 
  InspectionSubmitRequest, 
  InspectionUpdateRequest, 
  PaginatedResponse 
} from '../../types/api';

export const inspectionService = {
  /**
   * GET /api/v1/inspections
   */
  async listInspections(params?: { 
    work_id?: string; 
    officer?: string; 
    status?: string; 
    page?: number; 
    limit?: number; 
  }): Promise<PaginatedResponse<InspectionRecord> | InspectionRecord[]> {
    return apiClient.get<PaginatedResponse<InspectionRecord> | InspectionRecord[]>('/api/v1/inspections', params);
  },

  /**
   * POST /api/v1/inspections
   */
  async submitInspection(data: InspectionSubmitRequest): Promise<InspectionRecord> {
    return apiClient.post<InspectionRecord>('/api/v1/inspections', data);
  },

  /**
   * GET /api/v1/inspections/{inspection_id}
   */
  async getInspection(inspectionId: string): Promise<InspectionRecord> {
    return apiClient.get<InspectionRecord>(`/api/v1/inspections/${encodeURIComponent(inspectionId)}`);
  },

  /**
   * PUT /api/v1/inspections/{inspection_id}
   */
  async updateInspection(inspectionId: string, data: InspectionUpdateRequest): Promise<InspectionRecord> {
    return apiClient.put<InspectionRecord>(`/api/v1/inspections/${encodeURIComponent(inspectionId)}`, data);
  }
};
