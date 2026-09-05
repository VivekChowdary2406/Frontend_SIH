export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type WorkStatus = 'SANCTIONED' | 'ONGOING' | 'COMPLETED';
export type HouseType = 'LOK_SABHA' | 'RAJYA_SABHA';

export type WorkCategory = 
  | 'Drinking Water'
  | 'Education & Libraries'
  | 'Health & Family Welfare'
  | 'Roads, Pathways & Bridges'
  | 'Sanitation & Public Health'
  | 'Electricity & Solar Lighting'
  | 'Irrigation & Flood Control'
  | 'Sports & Youth Development'
  | 'Community Infrastructure';

export interface RiskSignal {
  id: string;
  name: string;
  score: number; // 0 to 100
  severity: RiskLevel;
  shortExplanation: string;
  evidence: string;
  whyItMatters: string;
  contributingWeight: number; // Percentage contributing to overall risk
}

export interface ExecutionMilestone {
  date: string;
  title: string;
  description: string;
  type: 'RECOMMENDATION' | 'SANCTION' | 'PAYMENT' | 'INSPECTION' | 'COMPLETION';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

export interface SimilarWorkBenchmark {
  metric: string;
  currentWorkValue: string | number;
  peerAverageValue: string | number;
  varianceNote: string;
  isSignificant: boolean;
}

export interface Work {
  workId: string;
  title: string;
  description: string;
  mpId: string;
  mpName: string;
  state: string;
  constituency: string;
  house: HouseType;
  category: WorkCategory;
  financialYear: string;
  recommendationDate: string;
  sanctionDate: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
  status: WorkStatus;
  sanctionAmount: number; // In Rupees
  expenditure: number; // In Rupees
  utilizationPercentage: number;
  
  firstPaymentDate?: string;
  latestPaymentDate?: string;
  
  // AI Risk Signals
  financialAnomalyScore: number; // 0-100
  paymentAnomalyScore: number; // 0-100
  delayProbability: number; // 0-100 (percentage)
  executionAnomalyScore: number; // 0-100
  duplicateSimilarityScore: number; // 0-100
  finalRiskScore: number; // 0-100
  finalRiskLevel: RiskLevel;
  
  riskReasons: string[];
  signals: RiskSignal[];
  timeline: ExecutionMilestone[];
  benchmarks: SimilarWorkBenchmark[];
  
  // Review Status
  reviewStatus?: 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  reviewNotes?: string[];
  reviewedBy?: string;
  lastReviewDate?: string;
}

export type WorkTab = 'overview' | 'financial' | 'execution' | 'payments' | 'investigation';
