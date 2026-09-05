export interface StructuredInvestigationResponse {
  query: string;
  timestamp: string;
  keyFinding: string;
  evidence: string[];
  comparison?: {
    metric: string;
    currentValue: string;
    peerAverage: string;
    explanation: string;
  };
  interpretation: string;
  suggestedReview: string[];
  confidenceNote?: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'USER' | 'COPILOT';
  text?: string;
  structuredResponse?: StructuredInvestigationResponse;
  timestamp: string;
}

export interface SimilarWorkPair {
  pairId: string;
  primaryWorkId: string;
  comparisonWorkId: string;
  similarityScore: number; // 0-100
  categoryMatch: boolean;
  geographicProximityKm: number;
  timeWindowMonths: number;
  matchedAttributes: string[];
  explanation: string;
  recommendation: string;
  reviewStatus: 'PENDING_REVIEW' | 'CONFIRMED_SEPARATE' | 'UNDER_INVESTIGATION';
}
