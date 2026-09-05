import { apiClient } from '../apiClient';
import { 
  AnomalyReportResponse,
  FinancialAnomalyPredictRequest,
  FinancialAnomalyPredictResponse,
  PaymentAnomalyPredictRequest,
  PaymentAnomalyPredictResponse,
  ExecutionAnomalyEvaluateRequest,
  ExecutionAnomalyEvaluateResponse
} from '../../types/api';

export const anomalyService = {
  /**
   * GET /api/v1/anomalies — Comprehensive ML Anomaly Report
   */
  async getAnomalyReport(): Promise<AnomalyReportResponse> {
    return apiClient.get<AnomalyReportResponse>('/api/v1/anomalies');
  },

  /**
   * POST /api/v1/anomalies/financial/predict — Predict Financial Anomaly
   */
  async predictFinancialAnomaly(payload: FinancialAnomalyPredictRequest): Promise<FinancialAnomalyPredictResponse> {
    return apiClient.post<FinancialAnomalyPredictResponse>('/api/v1/anomalies/financial/predict', payload);
  },

  /**
   * POST /api/v1/anomalies/payment/predict — Predict Payment Anomaly
   */
  async predictPaymentAnomaly(payload: PaymentAnomalyPredictRequest): Promise<PaymentAnomalyPredictResponse> {
    return apiClient.post<PaymentAnomalyPredictResponse>('/api/v1/anomalies/payment/predict', payload);
  },

  /**
   * POST /api/v1/anomalies/execution/evaluate — Evaluate Execution Anomaly
   */
  async evaluateExecutionAnomaly(payload: ExecutionAnomalyEvaluateRequest): Promise<ExecutionAnomalyEvaluateResponse> {
    return apiClient.post<ExecutionAnomalyEvaluateResponse>('/api/v1/anomalies/execution/evaluate', payload);
  },
};
