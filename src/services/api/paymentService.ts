/**
 * Payments & Disbursements API Service (FastAPI /api/v1/payments)
 */

import { apiClient } from '../apiClient';
import { PaymentTransaction } from '../../types/payment';
import { PaymentCreateRequest } from '../../types/api';

export const paymentService = {
  /**
   * GET /api/v1/payments/work/{work_id}
   */
  async getPaymentsForWork(workId: string): Promise<PaymentTransaction[]> {
    return apiClient.get<PaymentTransaction[]>(`/api/v1/payments/work/${encodeURIComponent(workId)}`);
  },

  /**
   * POST /api/v1/payments
   */
  async recordPayment(data: PaymentCreateRequest): Promise<PaymentTransaction> {
    return apiClient.post<PaymentTransaction>('/api/v1/payments', data);
  },

  /**
   * GET /api/v1/payments/{payment_id}
   */
  async getPayment(paymentId: string): Promise<PaymentTransaction> {
    return apiClient.get<PaymentTransaction>(`/api/v1/payments/${encodeURIComponent(paymentId)}`);
  }
};
