import { Work, WorkStatus, RiskLevel, WorkCategory, HouseType } from '../types/work';
import { PaymentTransaction } from '../types/payment';
import { SystemAlert, AlertStatus, AlertType } from '../types/alert';
import { MPProfile } from '../types/mp';
import { StateAnalytics } from '../types/state';
import { SimilarWorkPair } from '../types/investigator';

import { mockWorks } from '../data/mockWorks';
import { mockPayments } from '../data/mockPayments';
import { mockAlerts } from '../data/mockAlerts';
import { mockMPs } from '../data/mockMPs';
import { mockStates } from '../data/mockStates';
import { mockSimilarWorkPairs } from '../data/mockSimilarWorks';

import { 
  dashboardService, 
  workService, 
  paymentService, 
  alertService, 
  mpService, 
  duplicateService 
} from './api';

export interface WorksFilterOptions {
  query?: string;
  state?: string;
  house?: HouseType | 'ALL';
  category?: WorkCategory | 'ALL';
  status?: WorkStatus | 'ALL';
  riskLevel?: RiskLevel | 'ALL';
  financialYear?: string | 'ALL';
  sortBy?: 'riskScore' | 'sanctionAmount' | 'expenditure' | 'delayProbability' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardKPIs {
  totalMPs: number;
  totalWorks: number;
  totalSanctionedAmount: number;
  totalExpenditure: number;
  averageUtilizationRate: number;
  completedWorks: number;
  ongoingWorks: number;
  sanctionedWorks: number;
  highRiskWorks: number;
  mediumRiskWorks: number;
  lowRiskWorks: number;
  unresolvedAlertsCount: number;
}

class DataService {
  private works: Work[] = [...mockWorks];
  private payments: PaymentTransaction[] = [...mockPayments];
  private alerts: SystemAlert[] = [...mockAlerts];
  private mps: MPProfile[] = [...mockMPs];
  private states: StateAnalytics[] = [...mockStates];
  private similarPairs: SimilarWorkPair[] = [...mockSimilarWorkPairs];

  // Dashboard Aggregates
  getDashboardKPIs(): DashboardKPIs {
    const totalSanctioned = this.works.reduce((acc, w) => acc + w.sanctionAmount, 0);
    const totalExp = this.works.reduce((acc, w) => acc + w.expenditure, 0);
    const completed = this.works.filter(w => w.status === 'COMPLETED').length;
    const ongoing = this.works.filter(w => w.status === 'ONGOING').length;
    const sanctioned = this.works.filter(w => w.status === 'SANCTIONED').length;
    
    const highRisk = this.works.filter(w => w.finalRiskLevel === 'HIGH').length;
    const mediumRisk = this.works.filter(w => w.finalRiskLevel === 'MEDIUM').length;
    const lowRisk = this.works.filter(w => w.finalRiskLevel === 'LOW').length;

    const unresolvedAlerts = this.alerts.filter(a => a.status === 'NEW' || a.status === 'UNDER_REVIEW').length;

    return {
      totalMPs: this.mps.length,
      totalWorks: this.works.length,
      totalSanctionedAmount: totalSanctioned,
      totalExpenditure: totalExp,
      averageUtilizationRate: totalSanctioned > 0 ? (totalExp / totalSanctioned) * 100 : 0,
      completedWorks: completed,
      ongoingWorks: ongoing,
      sanctionedWorks: sanctioned,
      highRiskWorks: highRisk,
      mediumRiskWorks: mediumRisk,
      lowRiskWorks: lowRisk,
      unresolvedAlertsCount: unresolvedAlerts
    };
  }

  // Works Exploration & Filtering
  getWorks(options: WorksFilterOptions = {}): PaginatedResult<Work> {
    let result = [...this.works];

    if (options.query && options.query.trim() !== '') {
      const q = options.query.toLowerCase().trim();
      result = result.filter(w => 
        w.workId.toLowerCase().includes(q) ||
        w.title.toLowerCase().includes(q) ||
        w.mpName.toLowerCase().includes(q) ||
        w.constituency.toLowerCase().includes(q) ||
        w.state.toLowerCase().includes(q)
      );
    }

    if (options.state && options.state !== 'ALL') {
      result = result.filter(w => w.state.toLowerCase() === options.state?.toLowerCase());
    }

    if (options.house && options.house !== 'ALL') {
      result = result.filter(w => w.house === options.house);
    }

    if (options.category && options.category !== 'ALL') {
      result = result.filter(w => w.category === options.category);
    }

    if (options.status && options.status !== 'ALL') {
      result = result.filter(w => w.status === options.status);
    }

    if (options.riskLevel && options.riskLevel !== 'ALL') {
      result = result.filter(w => w.finalRiskLevel === options.riskLevel);
    }

    if (options.financialYear && options.financialYear !== 'ALL') {
      result = result.filter(w => w.financialYear === options.financialYear);
    }

    // Sorting
    const sortBy = options.sortBy || 'riskScore';
    const sortOrder = options.sortOrder || 'desc';

    result.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortBy === 'riskScore') {
        valA = a.finalRiskScore;
        valB = b.finalRiskScore;
      } else if (sortBy === 'sanctionAmount') {
        valA = a.sanctionAmount;
        valB = b.sanctionAmount;
      } else if (sortBy === 'expenditure') {
        valA = a.expenditure;
        valB = b.expenditure;
      } else if (sortBy === 'delayProbability') {
        valA = a.delayProbability;
        valB = b.delayProbability;
      } else if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? a.sanctionDate.localeCompare(b.sanctionDate)
          : b.sanctionDate.localeCompare(a.sanctionDate);
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const totalCount = result.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const pagedData = result.slice(startIndex, startIndex + pageSize);

    return {
      data: pagedData,
      totalCount,
      page,
      pageSize,
      totalPages
    };
  }

  getWorkById(workId: string): Work | undefined {
    const target = workId.toLowerCase().trim();
    const cleanTarget = target.replace(/[-_/]/g, '');
    return this.works.find(w => 
      w.workId.toLowerCase() === target ||
      w.workId.toLowerCase().replace(/[-_/]/g, '') === cleanTarget
    );
  }

  searchEntities(searchTerm: string) {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      return {
        exactWork: undefined,
        matchedWorks: [],
        matchedMPs: [],
        matchedStates: [],
        matchedAlerts: []
      };
    }
    const cleanQ = q.replace(/[-_/]/g, '');
    
    // Direct Work ID match
    const exactWork = this.works.find(w => 
      w.workId.toLowerCase() === q || 
      w.workId.toLowerCase().replace(/[-_/]/g, '') === cleanQ
    );

    const matchedWorks = this.works.filter(w => 
      w.workId.toLowerCase().includes(q) ||
      w.title.toLowerCase().includes(q) ||
      w.mpName.toLowerCase().includes(q) ||
      w.constituency.toLowerCase().includes(q) ||
      w.state.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedMPs = this.mps.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.constituency.toLowerCase().includes(q) ||
      m.state.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedStates = this.states.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.stateId.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedAlerts = this.alerts.filter(a =>
      a.alertId.toLowerCase().includes(q) ||
      a.workId.toLowerCase().includes(q) ||
      a.workTitle.toLowerCase().includes(q) ||
      a.reason.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      exactWork,
      matchedWorks,
      matchedMPs,
      matchedStates,
      matchedAlerts
    };
  }

  getTopAttentionWorks(limit = 4): Work[] {
    return [...this.works]
      .filter(w => w.finalRiskLevel === 'HIGH' || w.finalRiskLevel === 'MEDIUM')
      .sort((a, b) => b.finalRiskScore - a.finalRiskScore)
      .slice(0, limit);
  }

  // Payments
  getPayments(options: { workId?: string; anomalousOnly?: boolean; query?: string } = {}): PaymentTransaction[] {
    let result = [...this.payments];

    if (options.workId) {
      result = result.filter(p => p.workId.toLowerCase() === options.workId?.toLowerCase());
    }

    if (options.anomalousOnly) {
      result = result.filter(p => p.isAnomalous);
    }

    if (options.query && options.query.trim() !== '') {
      const q = options.query.toLowerCase().trim();
      result = result.filter(p =>
        p.paymentId.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        p.workId.toLowerCase().includes(q) ||
        (p.workTitle && p.workTitle.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => b.date.localeCompare(a.date));
  }

  getPaymentsForWork(workId: string): PaymentTransaction[] {
    return this.getPayments({ workId });
  }

  // Alerts
  getAlerts(options: { status?: AlertStatus | 'ALL'; severity?: RiskLevel | 'ALL'; type?: AlertType | 'ALL'; query?: string } = {}): SystemAlert[] {
    let result = [...this.alerts];

    if (options.status && options.status !== 'ALL') {
      result = result.filter(a => a.status === options.status);
    }

    if (options.severity && options.severity !== 'ALL') {
      result = result.filter(a => a.severity === options.severity);
    }

    if (options.type && options.type !== 'ALL') {
      result = result.filter(a => a.type === options.type);
    }

    if (options.query && options.query.trim() !== '') {
      const q = options.query.toLowerCase().trim();
      result = result.filter(a =>
        a.alertId.toLowerCase().includes(q) ||
        a.workId.toLowerCase().includes(q) ||
        a.workTitle.toLowerCase().includes(q) ||
        a.mpName.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => b.score - a.score);
  }

  updateAlertStatus(alertId: string, status: AlertStatus, note?: string): boolean {
    const alert = this.alerts.find(a => a.alertId === alertId);
    if (!alert) return false;
    alert.status = status;
    if (note) {
      alert.reviewerNotes = `${alert.reviewerNotes ? alert.reviewerNotes + ' | ' : ''}${new Date().toISOString().split('T')[0]}: ${note}`;
    }
    if (status === 'RESOLVED') {
      alert.resolvedAt = new Date().toISOString().split('T')[0];
    }
    return true;
  }

  // MPs and States
  getMPs(query?: string): MPProfile[] {
    if (!query || query.trim() === '') return this.mps;
    const q = query.toLowerCase().trim();
    return this.mps.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.constituency.toLowerCase().includes(q) ||
      m.state.toLowerCase().includes(q)
    );
  }

  getMPById(mpId: string): MPProfile | undefined {
    return this.mps.find(m => m.mpId.toLowerCase() === mpId.toLowerCase());
  }

  getStates(): StateAnalytics[] {
    return this.states;
  }

  getStateById(stateId: string): StateAnalytics | undefined {
    return this.states.find(s => s.stateId.toLowerCase() === stateId.toLowerCase());
  }

  // Similar Pairs
  getSimilarWorkPairs(): SimilarWorkPair[] {
    return this.similarPairs;
  }

  // Update Work Review Status & Notes
  updateWorkReview(workId: string, status: 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED', note: string, officer: string): boolean {
    const work = this.works.find(w => w.workId.toLowerCase() === workId.toLowerCase());
    if (!work) return false;
    work.reviewStatus = status;
    work.reviewedBy = officer;
    work.lastReviewDate = new Date().toISOString().split('T')[0];
    if (!work.reviewNotes) work.reviewNotes = [];
    if (note.trim()) {
      work.reviewNotes.push(`${work.lastReviewDate} (${officer}): ${note.trim()}`);
    }
    return true;
  }

  // ==========================================
  // Async Methods connected to FastAPI Backend
  // with graceful fallback to local data
  // ==========================================
  async fetchDashboardKPIs(params?: { state?: string; financial_year?: string }): Promise<DashboardKPIs> {
    try {
      const summary = await dashboardService.getSummary(params);
      if (summary) {
        return {
          totalMPs: summary.total_mps || this.mps.length,
          totalWorks: summary.total_works || this.works.length,
          totalSanctionedAmount: summary.total_sanctioned_amount || 0,
          totalExpenditure: summary.total_expenditure || 0,
          averageUtilizationRate: summary.utilization_rate || 0,
          completedWorks: summary.works_by_status?.completed || 0,
          ongoingWorks: summary.works_by_status?.ongoing || 0,
          sanctionedWorks: summary.works_by_status?.sanctioned || 0,
          highRiskWorks: summary.works_by_risk?.high || 0,
          mediumRiskWorks: summary.works_by_risk?.medium || 0,
          lowRiskWorks: summary.works_by_risk?.low || 0,
          unresolvedAlertsCount: summary.active_alerts_count || 0
        };
      }
    } catch {
      // Backend offline, fall back to local mock data
    }
    return this.getDashboardKPIs();
  }

  async fetchWorks(options: WorksFilterOptions = {}): Promise<PaginatedResult<Work>> {
    try {
      const res = await workService.listWorks({
        search: options.query,
        state: options.state !== 'ALL' ? options.state : undefined,
        status: options.status !== 'ALL' ? options.status : undefined,
        risk_level: options.riskLevel !== 'ALL' ? options.riskLevel : undefined,
        category: options.category !== 'ALL' ? options.category : undefined,
        financial_year: options.financialYear !== 'ALL' ? options.financialYear : undefined,
        page: options.page,
        limit: options.pageSize
      });
      if (Array.isArray(res)) {
        return {
          data: res,
          totalCount: res.length,
          page: 1,
          pageSize: res.length,
          totalPages: 1
        };
      } else if (res && (res as any).items) {
        return {
          data: (res as any).items,
          totalCount: (res as any).total,
          page: (res as any).page,
          pageSize: (res as any).page_size,
          totalPages: (res as any).total_pages
        };
      }
    } catch {
      // Fall back
    }
    return this.getWorks(options);
  }

  async fetchWorkById(workId: string): Promise<Work | undefined> {
    try {
      const work = await workService.getWork(workId);
      if (work) return work;
    } catch {
      // Fall back
    }
    return this.getWorkById(workId);
  }

  async fetchPayments(workId: string): Promise<PaymentTransaction[]> {
    try {
      const payments = await paymentService.getPaymentsForWork(workId);
      if (payments && payments.length > 0) return payments;
    } catch {
      // Fall back
    }
    return this.getPaymentsForWork(workId);
  }

  async fetchAlerts(params?: { status?: string; severity?: string; type?: string }): Promise<SystemAlert[]> {
    try {
      const res = await alertService.listAlerts(params);
      if (Array.isArray(res)) return res;
      if (res && (res as any).items) return (res as any).items;
    } catch {
      // Fall back
    }
    return this.getAlerts(params as any);
  }

  async fetchMPs(query?: string): Promise<MPProfile[]> {
    try {
      const res = await mpService.listMPs({ search: query });
      if (Array.isArray(res)) return res;
      if (res && (res as any).items) return (res as any).items;
    } catch {
      // Fall back
    }
    return this.getMPs(query);
  }

  async fetchMPById(mpId: string): Promise<MPProfile | undefined> {
    try {
      const mp = await mpService.getMP(mpId);
      if (mp) return mp;
    } catch {
      // Fall back
    }
    return this.getMPById(mpId);
  }

  async updateAlertStatusAsync(alertId: string, status: AlertStatus, note?: string): Promise<boolean> {
    try {
      await alertService.updateAlert(alertId, {
        status,
        reviewer_notes: note
      });
    } catch {
      // Fall back
    }
    return this.updateAlertStatus(alertId, status, note);
  }

  async updateWorkReviewAsync(workId: string, status: 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED', note: string, officer: string): Promise<boolean> {
    try {
      await workService.updateWork(workId, {
        review_status: status,
        review_notes: note ? [note] : undefined
      });
    } catch {
      // Fall back
    }
    return this.updateWorkReview(workId, status, note, officer);
  }
}

export const dataService = new DataService();
