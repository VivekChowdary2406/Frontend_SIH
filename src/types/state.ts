export interface StateAnalytics {
  stateId: string;
  name: string;
  mpsCount: number;
  totalWorks: number;
  sanctionedTotal: number; // in Rupees
  expenditureTotal: number; // in Rupees
  utilizationRate: number;
  completedWorks: number;
  ongoingWorks: number;
  highRiskWorks: number;
  mediumRiskWorks: number;
  lowRiskWorks: number;
}
