import { HouseType } from './work';

export interface MPProfile {
  mpId: string;
  name: string;
  house: HouseType;
  state: string;
  constituency: string;
  allocatedFunds: number; // ₹ in Crores or Lakhs
  recommendedAmount: number;
  sanctionedAmount: number;
  expenditure: number;
  utilizationRate: number; // percentage
  totalWorksCount: number;
  completedWorksCount: number;
  ongoingWorksCount: number;
  highRiskWorksCount: number;
  mediumRiskWorksCount: number;
  calamityConsentGiven: boolean;
  calamityAmountContributed: number;
}
