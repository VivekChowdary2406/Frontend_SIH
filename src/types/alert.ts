import { RiskLevel } from './work';

export type AlertType = 
  | 'FINANCIAL_ANOMALY'
  | 'PAYMENT_ANOMALY'
  | 'DELAY_RISK'
  | 'EXECUTION_ANOMALY'
  | 'POTENTIAL_DUPLICATE';

export type AlertStatus = 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export interface SystemAlert {
  alertId: string;
  workId: string;
  workTitle: string;
  mpName: string;
  state: string;
  type: AlertType;
  severity: RiskLevel;
  score: number;
  reason: string;
  dateGenerated: string;
  status: AlertStatus;
  reviewerNotes?: string;
  assignedOfficer?: string;
  resolvedAt?: string;
}
