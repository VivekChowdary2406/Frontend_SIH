import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { Work, RiskLevel } from '../types/work';
import { RiskBadge } from '../components/common/RiskBadge';
import { EmptyState } from '../components/common/EmptyState';
import { 
  ShieldAlert, 
  Search, 
  X, 
  ArrowRight, 
  SlidersHorizontal, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export type RiskCategoryFilter = 
  | 'ALL' 
  | 'DELAY_RISK' 
  | 'COST_OVERRUN' 
  | 'PAYMENT_ANOMALY' 
  | 'DUPLICATE_WORK' 
  | 'INACTIVE_WORK';

export const RiskMonitoringPage: React.FC = () => {
  const { navigateToWork } = useApp();

  const [query, setQuery] = useState('');
  const [riskLevelFilter, setRiskLevelFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [riskTypeFilter, setRiskTypeFilter] = useState<RiskCategoryFilter>('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'delay' | 'date' | 'expenditure'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Retrieve all works to compute holistic analytics & filtering
  const allWorksResult = dataService.getWorks({ pageSize: 200 });
  const allWorks = allWorksResult.data;
  const allStates = dataService.getStates();

  // Calculate high-level KPIs across full corpus
  const totalMonitored = allWorks.length;
  const highRiskCount = allWorks.filter(w => w.finalRiskLevel === 'HIGH').length;
  const mediumRiskCount = allWorks.filter(w => w.finalRiskLevel === 'MEDIUM').length;
  const lowRiskCount = allWorks.filter(w => w.finalRiskLevel === 'LOW').length;
  const avgRiskScore = totalMonitored > 0 
    ? Math.round(allWorks.reduce((acc, w) => acc + w.finalRiskScore, 0) / totalMonitored)
    : 0;

  // Helper to determine primary risk factor
  const getPrimaryRiskFactor = (work: Work): { name: string; score: number } => {
    if (work.signals && work.signals.length > 0) {
      const topSignal = [...work.signals].sort((a, b) => b.score - a.score)[0];
      return { name: topSignal.name, score: topSignal.score };
    }
    const factors = [
      { name: 'Financial Disparity', score: work.financialAnomalyScore },
      { name: 'Payment Anomaly', score: work.paymentAnomalyScore },
      { name: 'Delay Probability', score: work.delayProbability },
      { name: 'Execution Anomaly', score: work.executionAnomalyScore },
      { name: 'Duplicate Similarity', score: work.duplicateSimilarityScore },
    ];
    return factors.sort((a, b) => b.score - a.score)[0];
  };

  // Filtered & Sorted works
  const filteredWorks = useMemo(() => {
    let result = allWorks.filter(w => {
      // Query filter
      if (query.trim() !== '') {
        const q = query.toLowerCase().trim();
        const match = 
          w.workId.toLowerCase().includes(q) ||
          w.title.toLowerCase().includes(q) ||
          w.mpName.toLowerCase().includes(q) ||
          w.constituency.toLowerCase().includes(q) ||
          w.state.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Risk level filter
      if (riskLevelFilter !== 'ALL' && w.finalRiskLevel !== riskLevelFilter) {
        return false;
      }

      // State filter
      if (stateFilter !== 'ALL' && w.state.toLowerCase() !== stateFilter.toLowerCase()) {
        return false;
      }

      // Risk type filter
      if (riskTypeFilter !== 'ALL') {
        if (riskTypeFilter === 'DELAY_RISK') {
          const hasDelaySignal = w.signals?.some(s => s.name.toLowerCase().includes('delay'));
          if (w.delayProbability < 50 && !hasDelaySignal) return false;
        } else if (riskTypeFilter === 'COST_OVERRUN') {
          const hasFinSignal = w.signals?.some(s => s.name.toLowerCase().includes('cost') || s.name.toLowerCase().includes('financial'));
          if (w.financialAnomalyScore < 50 && !hasFinSignal) return false;
        } else if (riskTypeFilter === 'PAYMENT_ANOMALY') {
          const hasPaySignal = w.signals?.some(s => s.name.toLowerCase().includes('payment'));
          if (w.paymentAnomalyScore < 50 && !hasPaySignal) return false;
        } else if (riskTypeFilter === 'DUPLICATE_WORK') {
          const hasDupSignal = w.signals?.some(s => s.name.toLowerCase().includes('duplicate'));
          if (w.duplicateSimilarityScore < 50 && !hasDupSignal) return false;
        } else if (riskTypeFilter === 'INACTIVE_WORK') {
          const hasExecSignal = w.signals?.some(s => s.name.toLowerCase().includes('execution') || s.name.toLowerCase().includes('inactive'));
          if (w.executionAnomalyScore < 50 && !hasExecSignal) return false;
        }
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === 'score') {
        valA = a.finalRiskScore;
        valB = b.finalRiskScore;
      } else if (sortBy === 'delay') {
        valA = a.delayProbability;
        valB = b.delayProbability;
      } else if (sortBy === 'expenditure') {
        valA = a.expenditure;
        valB = b.expenditure;
      } else if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? a.sanctionDate.localeCompare(b.sanctionDate)
          : b.sanctionDate.localeCompare(a.sanctionDate);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [allWorks, query, riskLevelFilter, riskTypeFilter, stateFilter, sortBy, sortOrder]);

  const totalFilteredCount = filteredWorks.length;
  const totalPages = Math.ceil(totalFilteredCount / pageSize) || 1;
  const paginatedWorks = filteredWorks.slice((page - 1) * pageSize, page * pageSize);

  const hasActiveFilters = 
    query.trim() !== '' || 
    riskLevelFilter !== 'ALL' || 
    riskTypeFilter !== 'ALL' || 
    stateFilter !== 'ALL';

  const handleClearFilters = () => {
    setQuery('');
    setRiskLevelFilter('ALL');
    setRiskTypeFilter('ALL');
    setStateFilter('ALL');
    setPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Informational Scope Note */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          padding: '12px 16px',
          color: '#334155',
          fontSize: '13px',
          lineHeight: '1.4'
        }}
      >
        <Info size={18} color="var(--gov-blue-primary)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <strong>Analytical Risk Surveillance:</strong> Risk Monitoring provides macro-level surveillance across all sanctioned works using multi-factor ML models. For priority items requiring immediate triage, see the <strong>Alerts</strong> queue.
        </div>
      </div>

      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={22} color="var(--gov-blue-primary)" />
            Comprehensive Risk Monitoring
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Predictive machine learning risk scores, anomaly factor decomposition, and surveillance tracking across MPLADS projects
          </p>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Displaying <strong>{paginatedWorks.length}</strong> of <strong>{totalFilteredCount}</strong> filtered works
        </div>
      </div>

      {/* KPI Summary Bar */}
      <div className="kpi-grid" style={{ marginBottom: 0 }}>
        {/* Total Monitored */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Monitored Works</span>
            <div className="kpi-icon-wrap"><SlidersHorizontal size={18} /></div>
          </div>
          <div className="kpi-value">{totalMonitored}</div>
          <div className="kpi-subtext">Active algorithmic surveillance</div>
        </div>

        {/* High Risk */}
        <div className="kpi-card kpi-alert">
          <div className="kpi-header">
            <span className="kpi-label" style={{ color: '#dc2626' }}>High Risk Category</span>
            <div className="kpi-icon-wrap" style={{ color: '#dc2626' }}><ShieldAlert size={18} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#b91c1c' }}>{highRiskCount}</div>
          <div className="kpi-subtext">{totalMonitored > 0 ? Math.round((highRiskCount / totalMonitored) * 100) : 0}% of sanctioned portfolio</div>
        </div>

        {/* Medium Risk */}
        <div className="kpi-card kpi-warning">
          <div className="kpi-header">
            <span className="kpi-label" style={{ color: '#d97706' }}>Medium Risk Category</span>
            <div className="kpi-icon-wrap" style={{ color: '#d97706' }}><AlertTriangle size={18} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#b45309' }}>{mediumRiskCount}</div>
          <div className="kpi-subtext">Flagged for close observation</div>
        </div>

        {/* Low Risk */}
        <div className="kpi-card kpi-normal">
          <div className="kpi-header">
            <span className="kpi-label" style={{ color: '#16a34a' }}>Low Risk Category</span>
            <div className="kpi-icon-wrap" style={{ color: '#16a34a' }}><CheckCircle2 size={18} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#15803d' }}>{lowRiskCount}</div>
          <div className="kpi-subtext">Normal variance parameters</div>
        </div>

        {/* Average Risk Score */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Portfolio Avg Risk Score</span>
            <div className="kpi-icon-wrap"><Sparkles size={18} /></div>
          </div>
          <div className="kpi-value">
            {avgRiskScore}
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>/ 100</span>
          </div>
          <div className="kpi-subtext">Weighted multi-factor index</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Search */}
        <div className="search-input-box" style={{ flex: '1 1 240px' }}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search by Work ID, title, MP, constituency..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          {query && (
            <button className="btn-icon" onClick={() => setQuery('')} title="Clear search">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Risk Level Filter */}
        <div className="filter-group">
          <select 
            className="filter-select"
            value={riskLevelFilter}
            onChange={(e) => {
              setRiskLevelFilter(e.target.value as any);
              setPage(1);
            }}
            aria-label="Filter by Risk Level"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk (≥ 70)</option>
            <option value="MEDIUM">Medium Risk (40 - 69)</option>
            <option value="LOW">Low Risk (&lt; 40)</option>
          </select>
        </div>

        {/* Risk Type Filter */}
        <div className="filter-group">
          <select 
            className="filter-select"
            value={riskTypeFilter}
            onChange={(e) => {
              setRiskTypeFilter(e.target.value as any);
              setPage(1);
            }}
            aria-label="Filter by Risk Type"
          >
            <option value="ALL">All Risk Types</option>
            <option value="DELAY_RISK">Delay Risk</option>
            <option value="COST_OVERRUN">Cost Overrun</option>
            <option value="PAYMENT_ANOMALY">Fund Misuse / Payment Anomaly</option>
            <option value="DUPLICATE_WORK">Duplicate Work</option>
            <option value="INACTIVE_WORK">Inactive / Stalled Work</option>
          </select>
        </div>

        {/* State Filter */}
        <div className="filter-group">
          <select 
            className="filter-select"
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by State"
          >
            <option value="ALL">All States / UTs</option>
            {allStates.map(s => (
              <option key={s.stateId} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <select 
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort by metric"
          >
            <option value="score">Sort: Highest Risk Score</option>
            <option value="delay">Sort: Highest Delay Probability</option>
            <option value="expenditure">Sort: Highest Expenditure</option>
            <option value="date">Sort: Sanction Date</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button 
            className="btn-outline"
            style={{ padding: '6px 12px', height: '34px', fontSize: '12px' }}
            onClick={handleClearFilters}
          >
            <RotateCcw size={13} style={{ marginRight: '6px' }} />
            Reset Filters
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="table-container">
        {paginatedWorks.length === 0 ? (
          <EmptyState
            title="No Matching Risk Profiles Found"
            description="No sanctioned works match the selected risk category or filters. Adjust search parameters to view monitored assets."
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '13%' }}>Work ID</th>
                <th style={{ width: '22%' }}>Project & MP / Constituency</th>
                <th style={{ width: '10%' }}>State</th>
                <th style={{ width: '18%' }}>Primary Risk Factor</th>
                <th style={{ width: '9%', textAlign: 'center' }}>Score</th>
                <th style={{ width: '10%' }}>Risk Level</th>
                <th style={{ width: '8%', textAlign: 'center' }}>Signals</th>
                <th style={{ width: '10%' }}>Sanction Date</th>
                <th style={{ width: '10%', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedWorks.map((work) => {
                const primaryFactor = getPrimaryRiskFactor(work);
                const signalsCount = work.signals?.length || 1;

                return (
                  <tr 
                    key={work.workId}
                    className="row-clickable"
                    onClick={() => navigateToWork(work.workId)}
                  >
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--gov-blue-primary)' }}>
                      <div>{work.workId}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{work.category}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {work.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {work.mpName} · {work.constituency}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        {work.state}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                        {primaryFactor.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                        Anomaly index: {primaryFactor.score}/100
                      </div>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <span 
                        style={{ 
                          fontFamily: 'var(--font-mono)', 
                          fontSize: '13px', 
                          fontWeight: 700,
                          color: work.finalRiskLevel === 'HIGH' ? '#dc2626' : work.finalRiskLevel === 'MEDIUM' ? '#d97706' : '#16a34a'
                        }}
                      >
                        {work.finalRiskScore}
                      </span>
                    </td>

                    <td>
                      <RiskBadge level={work.finalRiskLevel} score={work.finalRiskScore} showIcon={false} />
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <span 
                        style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#f1f5f9',
                          color: '#475569'
                        }}
                      >
                        {signalsCount} {signalsCount === 1 ? 'flag' : 'flags'}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {work.sanctionDate}
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn-primary" 
                        style={{ padding: '5px 10px', fontSize: '11px', borderRadius: '4px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToWork(work.workId);
                        }}
                      >
                        Investigate
                        <ArrowRight size={11} style={{ marginLeft: '4px' }} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="table-pagination">
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Page {page} of {totalPages} ({totalFilteredCount} total works)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-outline" 
                style={{ padding: '4px 8px' }}
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                className="btn-outline" 
                style={{ padding: '4px 8px' }}
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
