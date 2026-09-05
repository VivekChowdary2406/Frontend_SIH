import React from 'react';
import { Work } from '../../../types/work';
import { PaymentTransaction } from '../../../types/payment';
import { 
  IndianRupee, 
  TrendingUp, 
  Calendar, 
  AlertCircle,
  FileCheck,
  CreditCard
} from 'lucide-react';

interface WorkFinancialTabProps {
  work: Work;
  payments: PaymentTransaction[];
}

export const WorkFinancialTab: React.FC<WorkFinancialTabProps> = ({ work, payments }) => {
  const remaining = Math.max(0, work.sanctionAmount - work.expenditure);
  const utilization = work.utilizationPercentage;

  // Cumulative progression calculations
  const sortedPayments = [...payments].sort((a, b) => a.date.localeCompare(b.date));
  let runningTotal = 0;
  const progressionPoints = sortedPayments.map(p => {
    runningTotal += p.amount;
    const pct = Math.min(100, (runningTotal / work.sanctionAmount) * 100);
    return {
      date: p.date,
      voucher: p.paymentId,
      stage: p.disbursementStage,
      amount: p.amount,
      cumulative: runningTotal,
      percentage: pct,
      isAnomalous: p.isAnomalous
    };
  });

  return (
    <div className="tab-pane-container">
      {/* 19. Clean Financial Position Tiles */}
      <div className="financial-metrics-row">
        <div className="financial-metric-card">
          <span className="fin-metric-label">Sanction Amount</span>
          <span className="fin-metric-val num-tabular">
            ₹{(work.sanctionAmount / 10000000).toFixed(2)} Cr
          </span>
          <span className="fin-metric-sub">District Collectorate Approval</span>
        </div>

        <div className="financial-metric-card">
          <span className="fin-metric-label">Expenditure</span>
          <span className="fin-metric-val num-tabular" style={{ color: 'var(--gov-green-dark)' }}>
            ₹{(work.expenditure / 10000000).toFixed(2)} Cr
          </span>
          <span className="fin-metric-sub">Cumulative PFMS Clearances</span>
        </div>

        <div className="financial-metric-card">
          <span className="fin-metric-label">Remaining Amount</span>
          <span className="fin-metric-val num-tabular" style={{ color: 'var(--text-muted)' }}>
            ₹{(remaining / 10000000).toFixed(2)} Cr
          </span>
          <span className="fin-metric-sub">Unreleased in Treasury</span>
        </div>

        <div className="financial-metric-card">
          <span className="fin-metric-label">Utilization</span>
          <span className="fin-metric-val num-tabular" style={{ color: utilization > 85 ? '#dc2626' : 'var(--text-primary)' }}>
            {utilization.toFixed(1)}%
          </span>
          <span className="fin-metric-sub">Of Total Budget</span>
        </div>
      </div>

      {/* Governance & Sanction Milestones */}
      <div className="card">
        <div className="card-header-clean">
          <div className="chart-title">
            <Calendar size={15} color="var(--gov-blue-primary)" />
            <span>Administrative Dates</span>
          </div>
          <span className="badge badge-completed">PFMS Verified</span>
        </div>

        <div className="dates-grid">
          <div className="date-tile">
            <span className="date-label">Recommendation Date</span>
            <span className="date-val">{work.recommendationDate}</span>
            <span className="date-sub">MP Proposal Submission</span>
          </div>

          <div className="date-tile">
            <span className="date-label">Sanction Date</span>
            <span className="date-val">{work.sanctionDate}</span>
            <span className="date-sub">Administrative Order Issued</span>
          </div>

          <div className="date-tile">
            <span className="date-label">First Payment Date</span>
            <span className="date-val">{work.firstPaymentDate || '2024-07-10'}</span>
            <span className="date-sub">Initial Advance Release</span>
          </div>

          <div className="date-tile">
            <span className="date-label">Latest Payment Date</span>
            <span className="date-val">{work.latestPaymentDate || '2024-11-28'}</span>
            <span className="date-sub">Most Recent Voucher</span>
          </div>
        </div>
      </div>

      {/* Payment Progression Curve */}
      <div className="card">
        <div className="card-header-clean">
          <div className="chart-title">
            <TrendingUp size={15} color="var(--gov-blue-primary)" />
            <span>Payment Progression Curve</span>
          </div>
          <span className="text-badge">{payments.length} Vouchers Cleared</span>
        </div>

        {/* Progress Fill Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Budget Depletion Progress</span>
            <span style={{ fontWeight: 700, color: utilization > 85 ? '#dc2626' : 'var(--gov-green-dark)' }}>
              {utilization.toFixed(1)}% Disbursed
            </span>
          </div>
          <div className="progression-bar-track">
            <div 
              className="progression-bar-fill"
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>
        </div>

        {/* Chronological Payment Progression Strip */}
        <div className="progression-steps-list">
          {progressionPoints.map((pt, idx) => (
            <div key={idx} className={`progression-step-row ${pt.isAnomalous ? 'step-anomalous' : ''}`}>
              <div className="step-date-col">
                <span className="step-date">{pt.date}</span>
                <span className="mono-sub">{pt.voucher}</span>
              </div>
              <div className="step-stage-col">
                <span className="step-stage">{pt.stage}</span>
                {pt.isAnomalous && (
                  <span className="step-anomaly-badge">Atypical Velocity</span>
                )}
              </div>
              <div className="step-amount-col num-tabular">
                +₹{(pt.amount / 100000).toFixed(2)}L
              </div>
              <div className="step-cumul-col">
                <div className="step-cumul-val num-tabular">
                  ₹{(pt.cumulative / 10000000).toFixed(2)} Cr
                </div>
                <div className="step-pct-bar">
                  <div style={{ width: `${pt.percentage}%`, height: '100%', backgroundColor: 'var(--gov-blue-primary)', borderRadius: '2px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
