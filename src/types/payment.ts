export type PaymentStatus = 'CLEARED' | 'PROCESSING' | 'FLAGGED_FOR_REVIEW';

export type PaymentAnomalyType = 
  | 'RAPID_SUCCESSION'
  | 'RAPID_SEQUENCE'
  | 'POTENTIAL_SPLIT'
  | 'ADVANCE_SKEW'
  | 'ROUND_AMOUNT'
  | 'FRONT_LOADED'
  | 'UNUSUAL_HOURS'
  | 'VENDOR_CONCENTRATION'
  | 'NONE';

export interface PaymentTransaction {
  paymentId: string;
  workId: string;
  workTitle?: string;
  date: string;
  vendor: string;
  vendorPanMasked: string;
  amount: number; // in Rupees
  paymentStatus: PaymentStatus;
  isAnomalous: boolean;
  anomalyType: PaymentAnomalyType;
  anomalyReason?: string;
  transactionRef: string;
  disbursementStage: string;
}
