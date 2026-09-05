/**
 * AI Assistant API Service (FastAPI /api/v1/assistant)
 */

import { apiClient } from '../apiClient';
import { AssistantQueryRequest, AssistantQueryResponse } from '../../types/api';

export const assistantService = {
  /**
   * POST /api/v1/assistant/query
   */
  async queryAssistant(request: AssistantQueryRequest): Promise<AssistantQueryResponse> {
    return apiClient.post<AssistantQueryResponse>('/api/v1/assistant/query', request);
  }
};
