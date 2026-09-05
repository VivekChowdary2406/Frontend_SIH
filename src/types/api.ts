/**
 * Typed API interfaces for FastAPI Swagger specification
 * Ministry of Statistics & Programme Implementation - MPLADS AI Monitor
 */

import { Work, RiskLevel, WorkStatus, HouseType, WorkCategory } from './work';
import { PaymentTransaction, PaymentStatus, PaymentAnomalyType } from './payment';
import { SystemAlert, AlertStatus, AlertType } from './alert';
import { MPProfile } from './mp';

// ==========================================
// 1. Root & Health
// ==========================================
export interface HealthCheckResponse {
  status: 'healthy' | 'ok' | string;
  version?: string;
  timestamp?: string;
  uptime_seconds?: number;
  database?: string;
  model_engine?: string;
}

// ==========================================
// 2. Authentication
// ==========================================
export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: 'bearer' | string;
  refresh_token?: string;
  expires_in?: number;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface UserProfile {
  user_id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'INVESTIGATING_OFFICER' | 'DISTRICT_COLLECTOR' | 'AUDITOR' | 'VIEWER';
  designation?: string;
  department?: string;
  state?: string;
  district?: string;
  is_active: boolean;
  created_at?: string;
  last_login?: string;
}

// ==========================================
// 3. Users Management
// ==========================================
export interface UserCreateRequest {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'INVESTIGATING_OFFICER' | 'DISTRICT_COLLECTOR' | 'AUDITOR' | 'VIEWER';
  designation?: string;
  department?: string;
  state?: string;
  district?: string;
}

export interface UserUpdateRequest {
  name?: string;
  role?: string;
  designation?: string;
  department?: string;
  state?: string;
  district?: string;
  is_active?: boolean;
}

// ==========================================
// 4. Dashboard & Analytics
// ==========================================
export interface DashboardSummaryResponse {
  total_works: number;
  total_sanctioned_amount: number; // in Rupees
  total_expenditure: number; // in Rupees
  utilization_rate: number; // percentage
  works_by_status: {
    sanctioned: number;
    ongoing: number;
    completed: number;
  };
  works_by_risk: {
    high: number;
    medium: number;
    low: number;
  };
  active_alerts_count: number;
  total_mps: number;
  recent_high_priority_works: Work[];
}

export interface TrendDataPoint {
  period: string; // e.g., '2024-Q1', '2024-04'
  sanctioned_amount: number;
  disbursed_amount: number;
  works_count: number;
  high_risk_count: number;
}

export interface TrendsResponse {
  financial_trends: TrendDataPoint[];
  category_distribution: Array<{
    category: string;
    works_count: number;
    sanctioned_amount: number;
    expenditure: number;
  }>;
  state_trends: Array<{
    state: string;
    utilization_rate: number;
    high_risk_count: number;
  }>;
}

export interface DelayAnalysisItem {
  work_id: string;
  title: string;
  state: string;
  constituency: string;
  sanction_date: string;
  expected_completion_date?: string;
  predicted_delay_probability: number; // 0 to 100
  predicted_delay_months: number;
  delay_severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  key_delay_factors: string[];
}

export interface DelayAnalysisResponse {
  total_monitored: number;
  high_delay_risk_count: number;
  average_predicted_delay_months: number;
  delays: DelayAnalysisItem[];
}

// ==========================================
// 5. Members of Parliament (MPs)
// ==========================================
export interface MPCreateRequest {
  name: string;
  house: HouseType;
  state: string;
  constituency: string;
  allocated_funds?: number;
  calamity_consent_given?: boolean;
}

export interface MPUpdateRequest {
  name?: string;
  house?: HouseType;
  state?: string;
  constituency?: string;
  allocated_funds?: number;
  calamity_consent_given?: boolean;
}

export interface MPAllocationResponse {
  mp_id: string;
  financial_year: string;
  entitlement: number;
  released_amount: number;
  unreleased_amount: number;
  recommended_works_amount: number;
  sanctioned_amount: number;
  disbursed_amount: number;
  balance_available: number;
}

// ==========================================
// 6. Works Management
// ==========================================
export interface WorkCreateRequest {
  work_id?: string;
  title: string;
  description: string;
  mp_id: string;
  state: string;
  constituency: string;
  house: HouseType;
  category: WorkCategory;
  financial_year: string;
  sanction_amount: number;
  sanction_date: string;
  expected_completion_date?: string;
  latitude?: number;
  longitude?: number;
}

export interface WorkUpdateRequest {
  title?: string;
  description?: string;
  category?: WorkCategory;
  sanction_amount?: number;
  expenditure?: number;
  status?: WorkStatus;
  expected_completion_date?: string;
  actual_completion_date?: string;
  review_status?: 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  review_notes?: string[];
}

// ==========================================
// 7. Payments & Disbursements
// ==========================================
export interface PaymentCreateRequest {
  work_id: string;
  amount: number;
  date: string;
  vendor: string;
  vendor_pan?: string;
  disbursement_stage: string;
  transaction_ref?: string;
}

// ==========================================
// 8. Fund Management
// ==========================================
export interface FundsSummaryResponse {
  annual_national_outlay: number;
  total_released_to_districts: number;
  total_expenditure_reported: number;
  unspent_balance_in_districts: number;
  calamity_relief_transferred: number;
  utilization_percentage: number;
  active_state_breakdown: Array<{
    state: string;
    allocated: number;
    released: number;
    spent: number;
    utilization: number;
  }>;
}

export interface FundAllocationCreateRequest {
  financial_year: string;
  state: string;
  district: string;
  allocated_amount: number;
  installments_schedule?: Array<{ installment: number; amount: number; release_date: string }>;
}

export interface CalamityConsentRequest {
  mp_id: string;
  calamity_type: string;
  affected_state: string;
  affected_district: string;
  contribution_amount: number; // max ₹1.00 Cr per calamity guideline
  consent_date: string;
}

export interface CalamityConsentResponse {
  consent_id: string;
  mp_id: string;
  mp_name: string;
  affected_state: string;
  affected_district: string;
  contribution_amount: number;
  status: 'SUBMITTED' | 'VERIFIED' | 'DISBURSED';
  submitted_at: string;
}

// ==========================================
// 9. Inspections
// ==========================================
export interface InspectionRecord {
  inspection_id: string;
  work_id: string;
  work_title?: string;
  inspecting_officer: string;
  officer_designation: string;
  inspection_date: string;
  physical_progress_percentage: number;
  quality_rating: 'SATISFACTORY' | 'SUBSTANDARD' | 'CRITICAL_DEFECT';
  discrepancies_noted: string;
  gps_coordinates?: { latitude: number; longitude: number };
  photo_urls?: string[];
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'ACTION_REQUIRED';
}

export interface InspectionSubmitRequest {
  work_id: string;
  inspecting_officer: string;
  officer_designation: string;
  inspection_date: string;
  physical_progress_percentage: number;
  quality_rating: 'SATISFACTORY' | 'SUBSTANDARD' | 'CRITICAL_DEFECT';
  discrepancies_noted?: string;
  latitude?: number;
  longitude?: number;
  photo_urls?: string[];
}

export interface InspectionUpdateRequest {
  physical_progress_percentage?: number;
  quality_rating?: 'SATISFACTORY' | 'SUBSTANDARD' | 'CRITICAL_DEFECT';
  discrepancies_noted?: string;
  status?: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'ACTION_REQUIRED';
}

// ==========================================
// 10. Risk Management & Anomalies
// ==========================================
export interface WorkRiskResponse {
  work_id: string;
  composite_risk_score: number; // 0 - 100
  risk_level: RiskLevel;
  financial_risk_score: number;
  payment_risk_score: number;
  delay_risk_score: number;
  execution_risk_score: number;
  signals: Array<{
    id: string;
    name: string;
    score: number;
    severity: RiskLevel;
    evidence: string;
    why_it_matters: string;
    weight: number;
  }>;
  key_finding: string;
  interpretation: string;
  suggested_review_actions: string[];
  peer_comparison: {
    peer_group_name: string;
    peer_group_size: number;
    metrics: Array<{
      metric_name: string;
      current_value: string | number;
      peer_average: string | number;
      variance_description: string;
    }>;
  };
}

export interface AnomalyReportResponse {
  generated_at: string;
  total_anomalies: number;
  financial_anomalies_count: number;
  payment_velocity_anomalies_count: number;
  duplicate_candidates_count: number;
  high_risk_works: Work[];
}

export interface FinancialAnomalyPredictRequest {
  work_id: string;
  sanction_amount: number;
  expenditure: number;
  utilization_percentage?: number;
  category?: string;
  duration_months?: number;
}

export interface FinancialAnomalyPredictResponse {
  work_id: string;
  anomaly_score: number;
  is_anomalous: boolean;
  confidence: number;
  risk_level: RiskLevel;
  contributing_factors: string[];
  recommendation: string;
}

export interface PaymentAnomalyPredictRequest {
  work_id: string;
  payment_amounts: number[];
  payment_dates: string[];
  total_disbursed: number;
  vendor_id?: string;
}

export interface PaymentAnomalyPredictResponse {
  work_id: string;
  anomaly_score: number;
  clustering_detected: boolean;
  velocity_alert: boolean;
  risk_level: RiskLevel;
  reasons: string[];
}

export interface ExecutionAnomalyEvaluateRequest {
  work_id: string;
  sanction_date: string;
  expected_completion_date?: string;
  physical_progress_percentage?: number;
  financial_utilization_percentage?: number;
  dormancy_days?: number;
}

export interface ExecutionAnomalyEvaluateResponse {
  work_id: string;
  execution_score: number;
  delay_probability: number;
  stall_risk: boolean;
  severity: RiskLevel;
  reasons: string[];
}

export interface DuplicateMatchResolveRequest {
  resolution: 'CONFIRMED_DUPLICATE' | 'RESOLVED_DISTINCT';
  reviewer_notes: string;
}

// ==========================================
// 11. Duplicate Detection
// ==========================================
export interface DuplicateCheckRequest {
  title: string;
  description?: string;
  state: string;
  constituency: string;
  category: WorkCategory;
  sanction_amount: number;
  latitude?: number;
  longitude?: number;
}

export interface DuplicateMatchRecord {
  match_id: string;
  primary_work_id: string;
  comparison_work_id: string;
  primary_title: string;
  comparison_title: string;
  similarity_score: number; // 0 to 100
  distance_meters?: number;
  sanction_interval_months: number;
  shared_vendor: boolean;
  explanation: string;
  recommended_action: string;
  status: 'FLAGGED' | 'RESOLVED_DISTINCT' | 'CONFIRMED_DUPLICATE';
}

export interface DuplicateResolveRequest {
  resolution: 'CONFIRMED_DUPLICATE' | 'RESOLVED_DISTINCT';
  reviewer_notes: string;
}

// ==========================================
// 12. Alerts & Notifications
// ==========================================
export interface AlertCreateRequest {
  work_id: string;
  type: AlertType;
  severity: RiskLevel;
  score: number;
  reason: string;
}

export interface AlertUpdateRequest {
  status?: AlertStatus;
  reviewer_notes?: string;
  assigned_officer?: string;
}

// ==========================================
// 13. AI Assistant
// ==========================================
export interface AssistantQueryRequest {
  query: string;
  work_id?: string;
  context_scope?: 'NATIONAL' | 'STATE' | 'WORK' | 'VENDOR';
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AssistantQueryResponse {
  query: string;
  work_id?: string;
  answer: string;
  confidence_score?: number;
  citations?: Array<{ source: string; reference_id: string }>;
  suggested_followups?: string[];
  timestamp: string;
}

// Generic Paginated Response wrapper matching FastAPI
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
