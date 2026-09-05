import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { dashboardService } from '../services/api/dashboardService';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  ClockAlert, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Hourglass,
  Calendar,
  RotateCcw
} from 'lucide-react';

export const DelayMonitoringPage: React.FC = () => {
  const { navigateToWork } = useApp();
  const [query, setQuery] = useState('');
  const [minDelayProb, setMinDelayProb] = useState<number>(0);

  // Local works always available (mock fallback)
  const ongoingWorks = dataService.getWorks({ 
    status: 'ONGOING', 
    query, 
    sortBy: 'delayProbability', 
    sortOrder: 'desc',
    pageSize: 50 
  }).data.filter(w => w.delayProbability >= minDelayProb);

  // Live delay counts — enriched from backend if available
  const [liveHighCount, setLiveHighCount] = useState<number | null>(null);
  useEffect(() => {
    dashboardService.getDelays({ threshold: 70 })
      .then(data => { if (data?.high_delay_risk_count != null) setLiveHighCount(data.high_delay_risk_count); })
      .catch(() => {});
  }, []);

  const criticalDelayCount = liveHighCount ?? ongoingWorks.filter(w => w.delayProbability >= 70).length;
  const moderateDelayCount = ongoingWorks.filter(w => w.delayProbability >= 40 && w.delayProbability < 70).length;
  const onTrackCount = ongoingWorks.filter(w => w.delayProbability < 40).length;

  const getElapsedMonths = (sanctionDateStr: string) => {
    const sanction = new Date(sanctionDateStr);
    const now = new Date();
    return Math.max(1, Math.round((now.getTime() - sanction.getTime()) / (1000 * 60 * 60 * 24 * 30.4)));
  };

  const getProbColor = (p: number) => {
    if (p >= 70) return '#dc2626';
    if (p >= 40) return '#d97706';
    return '#16a34a';
  };

  const getDelayRiskLevel = (p: number): 'HIGH' | 'MEDIUM' | 'LOW' => {
    if (p >= 70) return 'HIGH';
    if (p >= 40) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <DisclaimerBanner customText="Delay probability is a predictive machine learning estimation, not proof of delay. High probability indicates candidate priority for physical milestone review by the authorized district engineer." />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Ongoing Works Delay Probability Surveillance
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Predicted probability of unusually long completion across ongoing MPLADS civil projects
          </p>
        </div>
      </div>

      {/* Delay KPI Tiers */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-alert">
          <div className="kpi-label">Predicted High Delay (&ge;70%)</div>
          <div className="kpi-value num-tabular" style={{ color: '#dc2626' }}>{criticalDelayCount} Works</div>
          <div className="kpi-subtext">Priority for progress inspection</div>
        </div>

        <div className="kpi-card kpi-warning">
          <div className="kpi-label">Predicted Moderate Delay (40-69%)</div>
          <div className="kpi-value num-tabular" style={{ color: '#d97706' }}>{moderateDelayCount} Works</div>
          <div className="kpi-subtext">Lagging cohort milestone baseline</div>
        </div>

        <div className="kpi-card kpi-normal">
          <div className="kpi-label">On-Track Trajectory (&lt;40%)</div>
          <div className="kpi-value num-tabular" style={{ color: '#16a34a' }}>{onTrackCount} Works</div>
          <div className="kpi-subtext">Within expected delivery pace</div>
        </div>
      </div>

      {/* Filter & Threshold Bar */}
      <div className="filter-bar">
        <div className="search-input-box" style={{ flex: '1 1 280px' }}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search ongoing works by Work ID, title, MP, state..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Threshold:</label>
          <select 
            className="filter-select"
            value={minDelayProb}
            onChange={(e) => setMinDelayProb(Number(e.target.value))}
          >
            <option value={0}>All Ongoing Works</option>
            <option value={40}>Moderate & High (&ge; 40%)</option>
            <option value={70}>High Predicted Risk (&ge; 70%)</option>
          </select>
        </div>

        {(query || minDelayProb > 0) && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => { setQuery(''); setMinDelayProb(0); }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 23. Focused Table for Ongoing Works */}
      <div className="table-container">
        <table className="data-table" role="table" aria-label="Delay surveillance ledger">
          <thead>
            <tr>
              <th style={{ width: '13%' }}>Work ID</th>
              <th style={{ width: '22%' }}>Work</th>
              <th style={{ width: '13%' }}>MP</th>
              <th style={{ width: '10%' }}>State</th>
              <th style={{ width: '11%' }}>Sanction Amount</th>
              <th style={{ width: '11%' }}>Time Since Sanction</th>
              <th style={{ width: '8%' }}>Status</th>
              <th style={{ width: '12%' }}>Predicted Delay Probability</th>
            </tr>
          </thead>
          <tbody>
            {ongoingWorks.map((work) => {
              const elapsed = getElapsedMonths(work.sanctionDate);
              const delayRisk = getDelayRiskLevel(work.delayProbability);

              return (
                <tr 
                  key={work.workId}
                  className="row-clickable"
                  onClick={() => navigateToWork(work.workId)}
                  title="Click to inspect Work Details and delay prediction signals"
                >
                  <td>
                    <span className="mono-tag" style={{ color: 'var(--gov-blue-primary)' }}>
                      {work.workId}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {work.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {work.category}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: '12px' }}>{work.mpName}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{work.constituency}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{work.state}</span>
                  </td>
                  <td className="num-tabular" style={{ fontWeight: 600 }}>
                    ₹{(work.sanctionAmount / 100000).toFixed(2)}L
                  </td>
                  <td className="num-tabular" style={{ fontSize: '12px' }}>
                    {elapsed} Months
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>
                      Since {work.sanctionDate}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={work.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span 
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 800, 
                          color: getProbColor(work.delayProbability),
                          minWidth: '38px' 
                        }} 
                        className="num-tabular"
                      >
                        {work.delayProbability}%
                      </span>
                      <span className={`risk-tag ${delayRisk.toLowerCase()}`} style={{ fontSize: '10px' }}>
                        {delayRisk}
                      </span>
                    </div>
                    <div style={{ width: '80px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
                      <div 
                        style={{ 
                          width: `${work.delayProbability}%`, 
                          height: '100%', 
                          backgroundColor: getProbColor(work.delayProbability) 
                        }} 
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
