import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { MPProfile } from '../types/mp';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Search, 
  Briefcase, 
  HeartHandshake
} from 'lucide-react';

export const MPAnalyticsPage: React.FC = () => {
  const { navigateToWork, selectedMPId, setSelectedMPId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const allMPs = dataService.getMPs(searchQuery);

  const activeMP = dataService.getMPById(selectedMPId) || allMPs[0];

  // Filter works belonging to this MP by mpId (reliable) with name fallback
  const mpWorks = activeMP
    ? dataService.getWorks({ pageSize: 50 }).data.filter(
        w => w.mpId === activeMP.mpId || w.mpName === activeMP.name
      )
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <DisclaimerBanner />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            MP Performance & Fund Utilization Analytics
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Parliamentarian-level recommendation velocity, fund sanctions, and risk anomaly incidence
          </p>
        </div>
      </div>

      {/* MP Selector & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-box" style={{ flex: '1 1 300px' }}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search Member of Parliament by name, state, or constituency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Selected MP:</label>
          <select
            className="filter-select"
            value={selectedMPId}
            onChange={(e) => setSelectedMPId(e.target.value)}
          >
            {allMPs.map(m => (
              <option key={m.mpId} value={m.mpId}>
                {m.name} ({m.constituency}, {m.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active MP Dossier Card */}
      {activeMP && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Profile Header */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
                    {activeMP.house === 'LOK_SABHA' ? 'Lok Sabha' : 'Rajya Sabha'}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {activeMP.mpId}
                  </span>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {activeMP.name}
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Constituency: <strong>{activeMP.constituency}</strong> · State: <strong>{activeMP.state}</strong>
                </div>
              </div>

              {activeMP.calamityConsentGiven && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#166534'
                }}>
                  <HeartHandshake size={16} />
                  <div>
                    <strong>Calamity Fund Contribution:</strong>
                    <div>₹{(activeMP.calamityAmountContributed / 100000).toFixed(2)} Lakhs Consented</div>
                  </div>
                </div>
              )}
            </div>

            {/* Financial Metrics Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              marginTop: '18px',
              padding: '14px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Entitlement</div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }} className="num-tabular">
                  ₹{(activeMP.allocatedFunds / 10000000).toFixed(2)} Cr
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Recommended Amount</div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gov-blue-primary)', marginTop: '2px' }} className="num-tabular">
                  ₹{(activeMP.recommendedAmount / 10000000).toFixed(2)} Cr
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Admin Sanctioned</div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }} className="num-tabular">
                  ₹{(activeMP.sanctionedAmount / 10000000).toFixed(2)} Cr
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Actual Expenditure</div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#047857', marginTop: '2px' }} className="num-tabular">
                  ₹{(activeMP.expenditure / 10000000).toFixed(2)} Cr
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Utilization Rate</div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: activeMP.utilizationRate >= 80 ? '#16a34a' : '#d97706', marginTop: '2px' }} className="num-tabular">
                  {activeMP.utilizationRate.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Project Portfolio Table for this MP */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Briefcase size={16} color="var(--gov-blue-primary)" />
                <span>Recommended Works Portfolio ({mpWorks.length} Projects)</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-completed">{activeMP.completedWorksCount} Completed</span>
                <span className="badge badge-ongoing">{activeMP.ongoingWorksCount} Ongoing</span>
                {activeMP.highRiskWorksCount > 0 && (
                  <span className="badge badge-high">{activeMP.highRiskWorksCount} High Risk</span>
                )}
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Work ID</th>
                    <th>Project Scope</th>
                    <th>Category</th>
                    <th>Sanction (₹)</th>
                    <th>Expenditure (₹)</th>
                    <th>Status</th>
                    <th>Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {mpWorks.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                        No works logged in the active database for this MP.
                      </td>
                    </tr>
                  ) : (
                    mpWorks.map(w => (
                      <tr 
                        key={w.workId}
                        className="row-clickable"
                        onClick={() => navigateToWork(w.workId)}
                      >
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--gov-blue-primary)' }}>
                          {w.workId}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{w.title}</div>
                        </td>
                        <td>{w.category}</td>
                        <td className="num-tabular">₹{(w.sanctionAmount / 100000).toFixed(2)}L</td>
                        <td className="num-tabular">₹{(w.expenditure / 100000).toFixed(2)}L</td>
                        <td><StatusBadge status={w.status} /></td>
                        <td><RiskBadge level={w.finalRiskLevel} score={w.finalRiskScore} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
