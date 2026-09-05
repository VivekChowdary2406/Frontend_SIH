import React from 'react';
import { Work } from '../../../types/work';
import { useApp } from '../../../context/AppContext';
import { 
  IndianRupee, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  AlertTriangle,
  Clock,
  Layers,
  FileCheck2
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';
import { RiskBadge } from '../../common/RiskBadge';

interface WorkOverviewTabProps {
  work: Work;
}

export const WorkOverviewTab: React.FC<WorkOverviewTabProps> = ({ work }) => {
  const { setActiveWorkTab } = useApp();

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#dc2626';
    if (score >= 40) return '#d97706';
    return '#16a34a';
  };

  const primarySignalText = work.workId === 'WS/UP/2025/001'
    ? 'Unusual payment pattern'
    : work.workId === 'WS/MH/2025/045'
    ? 'Elevated delay probability'
    : work.workId === 'WS/KA/2025/012'
    ? 'Unusual expenditure pattern'
    : work.riskReasons[0] || 'Atypical financial velocity';

  return (
    <div className="tab-pane-container">
      {/* 18. Key Financial & Operational Summary Strip */}
      <div className="overview-kpi-grid">
        <div className="overview-kpi-card">
          <div className="overview-kpi-label">Sanctioned</div>
          <div className="overview-kpi-value num-tabular">
            ₹{(work.sanctionAmount / 10000000).toFixed(1)} Cr
          </div>
          <div className="overview-kpi-subtext">Approved by District Authority</div>
        </div>

        <div className="overview-kpi-card">
          <div className="overview-kpi-label">Expenditure</div>
          <div className="overview-kpi-value num-tabular" style={{ color: 'var(--gov-green-dark)' }}>
            ₹{(work.expenditure / 10000000).toFixed(1)} Cr
          </div>
          <div className="overview-kpi-subtext">Cumulative Disbursed</div>
        </div>

        <div className="overview-kpi-card">
          <div className="overview-kpi-label">Utilization</div>
          <div className="overview-kpi-value num-tabular" style={{ color: work.utilizationPercentage > 85 ? '#dc2626' : 'var(--text-primary)' }}>
            {work.utilizationPercentage.toFixed(0)}%
          </div>
          <div className="overview-kpi-subtext">Of Total Sanction</div>
        </div>

        <div className="overview-kpi-card">
          <div className="overview-kpi-label">Status</div>
          <div style={{ marginTop: '6px' }}>
            <StatusBadge status={work.status} />
          </div>
          <div className="overview-kpi-subtext">Active Milestone Monitoring</div>
        </div>
      </div>

      {/* 18. AI RISK SIGNALS & Primary Investigation Callout */}
      <div className="card ai-signals-overview-card">
        <div className="card-header-clean">
          <div>
            <div className="chart-title">
              <Sparkles size={16} color="var(--gov-blue-primary)" />
              <span>AI RISK SIGNALS</span>
            </div>
            <div className="chart-subtitle">
              Calculated deterministically from transaction frequency, milestone intervals, and cohort variances
            </div>
          </div>
          <div className="composite-risk-indicator">
            <span className="composite-risk-label">Overall Risk:</span>
            <span className="composite-risk-score num-tabular" style={{ color: getScoreColor(work.finalRiskScore) }}>
              {work.finalRiskScore} / 100
            </span>
            <span className={`risk-tag ${work.finalRiskLevel.toLowerCase()}`}>
              {work.finalRiskLevel}
            </span>
          </div>
        </div>

        {/* 4 Primary Signal Gauge Tiles */}
        <div className="signals-tiles-row">
          <div className="signal-tile">
            <div className="signal-tile-name">Financial anomaly</div>
            <div className="signal-tile-score num-tabular" style={{ color: getScoreColor(work.financialAnomalyScore) }}>
              {work.financialAnomalyScore}
            </div>
            <div className="signal-tile-desc">Disbursement vs Milestone curve</div>
          </div>

          <div className="signal-tile">
            <div className="signal-tile-name">Payment anomaly</div>
            <div className="signal-tile-score num-tabular" style={{ color: getScoreColor(work.paymentAnomalyScore) }}>
              {work.paymentAnomalyScore}
            </div>
            <div className="signal-tile-desc">Voucher velocity & clustering</div>
          </div>

          <div className="signal-tile">
            <div className="signal-tile-name">Delay probability</div>
            <div className="signal-tile-score num-tabular" style={{ color: getScoreColor(work.delayProbability) }}>
              {work.delayProbability}%
            </div>
            <div className="signal-tile-desc">Predicted completion extension</div>
          </div>

          <div className="signal-tile">
            <div className="signal-tile-name">Execution anomaly</div>
            <div className="signal-tile-score num-tabular" style={{ color: getScoreColor(work.executionAnomalyScore) }}>
              {work.executionAnomalyScore}
            </div>
            <div className="signal-tile-desc">Site mobilization interval</div>
          </div>
        </div>

        {/* Primary Signal & Prominent CTA Banner */}
        <div className="primary-signal-banner">
          <div className="primary-signal-content">
            <div className="primary-signal-badge">
              <AlertTriangle size={13} />
              <span>Primary Signal</span>
            </div>
            <div className="primary-signal-text">
              {primarySignalText}
            </div>
            <div className="primary-signal-note">
              {work.riskReasons[0]}
            </div>
          </div>

          {/* Prominent CTA */}
          <button 
            className="btn-investigate-flagship"
            onClick={() => setActiveWorkTab('investigation')}
            id="why-is-this-work-risky-btn"
          >
            <Sparkles size={16} />
            <span>WHY IS THIS WORK RISKY?</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Scope & Attribution Summary */}
      <div className="card info-summary-card">
        <div className="card-header-clean">
          <div className="chart-title">
            <Layers size={15} color="var(--gov-blue-primary)" />
            <span>Project Scope & Attribution</span>
          </div>
          <span className="mono-tag">{work.workId}</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
          {work.description}
        </p>
        <div className="info-summary-grid">
          <div>
            <span className="info-label">Member of Parliament</span>
            <span className="info-value">{work.mpName} ({work.house === 'LOK_SABHA' ? 'Lok Sabha' : 'Rajya Sabha'})</span>
          </div>
          <div>
            <span className="info-label">Constituency & State</span>
            <span className="info-value">{work.constituency}, {work.state}</span>
          </div>
          <div>
            <span className="info-label">Sector / Category</span>
            <span className="info-value">{work.category}</span>
          </div>
          <div>
            <span className="info-label">Financial Year</span>
            <span className="info-value">FY {work.financialYear}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
