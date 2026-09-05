import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { IndiaMap } from '../components/common/IndiaMap';
import { 
  MapPin, 
  Briefcase
} from 'lucide-react';

export const StateAnalyticsPage: React.FC = () => {
  const { navigateToWork, selectedStateId, setSelectedStateId } = useApp();
  const states = dataService.getStates();

  const activeState = states.find(s => s.stateId === selectedStateId) || states[0];
  const stateWorks = activeState ? dataService.getWorks({ state: activeState.name, pageSize: 50 }).data : [];

  const handleStateSelect = (stateName: string) => {
    const matched = states.find(
      s => s.name.toLowerCase() === stateName.toLowerCase() ||
           s.name.toLowerCase().includes(stateName.toLowerCase()) ||
           stateName.toLowerCase().includes(s.name.toLowerCase())
    );
    if (matched) {
      setSelectedStateId(matched.stateId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <DisclaimerBanner />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            State & Union Territory Level Utilization Analytics
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Cross-state comparative analysis of MPLADS fund utilization, physical completions, and anomaly concentration
          </p>
        </div>
      </div>

      {/* State Quick-Selection Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {states.map((st) => (
          <button
            key={st.stateId}
            className={`btn ${st.stateId === selectedStateId ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setSelectedStateId(st.stateId)}
          >
            <MapPin size={12} />
            <span>{st.name}</span>
            <span style={{ fontSize: '10px', opacity: 0.8 }}>({st.totalWorks})</span>
          </button>
        ))}
      </div>

      {/* Interactive Map & State Profile Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 440px) 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Interactive India Map */}
        <IndiaMap
          selectedStateName={activeState?.name}
          onSelectState={handleStateSelect}
        />

        {/* Active State Profile Card */}
        {activeState && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {activeState.name} State Monitoring Profile
                  </h2>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Statewide allocation across {activeState.mpsCount} Parliamentary Constituencies
                  </div>
                </div>
                <span className="badge" style={{ backgroundColor: '#edf7f3', color: '#176b52', border: '1px solid #c0d8cc' }}>
                  State ID: {activeState.stateId}
                </span>
              </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              padding: '14px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total MPs</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }} className="num-tabular">
                  {activeState.mpsCount}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Sanctioned</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-blue-primary)', marginTop: '2px' }} className="num-tabular">
                  ₹{(activeState.sanctionedTotal / 10000000).toFixed(1)} Cr
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Expenditure</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#047857', marginTop: '2px' }} className="num-tabular">
                  ₹{(activeState.expenditureTotal / 10000000).toFixed(1)} Cr
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Utilization Rate</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: activeState.utilizationRate >= 80 ? '#16a34a' : '#d97706', marginTop: '2px' }} className="num-tabular">
                  {activeState.utilizationRate.toFixed(1)}%
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Delivery Ratio</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }} className="num-tabular">
                  {activeState.completedWorks} / {activeState.totalWorks}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Projects completed</div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>High Risk Works</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#dc2626', marginTop: '2px' }} className="num-tabular">
                  {activeState.highRiskWorks}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Under review</div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Works Drill-down in this State (Full Width) */}
      {activeState && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Briefcase size={16} color="var(--gov-blue-primary)" />
              <span>Sanctioned Works in {activeState.name} ({stateWorks.length} Records)</span>
            </div>
          </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Work ID</th>
                    <th>Project Scope</th>
                    <th>MP Sponsor</th>
                    <th>Category</th>
                    <th>Sanction (₹)</th>
                    <th>Status</th>
                    <th>Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {stateWorks.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                        No works logged in the active database for this state.
                      </td>
                    </tr>
                  ) : (
                    stateWorks.map(w => (
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
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{w.constituency}</div>
                        </td>
                        <td>{w.mpName}</td>
                        <td>{w.category}</td>
                        <td className="num-tabular">₹{(w.sanctionAmount / 100000).toFixed(2)}L</td>
                        <td><StatusBadge status={w.status} /></td>
                        <td><RiskBadge level={w.finalRiskLevel} score={w.finalRiskScore} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};
