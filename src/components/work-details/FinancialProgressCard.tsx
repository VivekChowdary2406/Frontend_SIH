import React from 'react';
import { Work } from '../../types/work';
import { IndianRupee, TrendingUp, AlertCircle } from 'lucide-react';

interface FinancialProgressCardProps {
  work: Work;
}

export const FinancialProgressCard: React.FC<FinancialProgressCardProps> = ({ work }) => {
  const remaining = Math.max(0, work.sanctionAmount - work.expenditure);
  const utilization = work.utilizationPercentage;

  const getProgressColor = () => {
    if (utilization > 90) return '#dc2626';
    if (utilization > 75) return '#d97706';
    return '#10b981';
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <IndianRupee size={16} color="var(--gov-blue-primary)" />
          <span>Financial Status & Utilization</span>
        </div>
        <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
          PFMS Direct DB Verification
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Sanction Amount</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }} className="num-tabular">
            ₹{(work.sanctionAmount / 100000).toFixed(2)} Lakhs
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Approved by DC/DM</div>
        </div>

        <div style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Expenditure</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-blue-primary)', marginTop: '4px' }} className="num-tabular">
            ₹{(work.expenditure / 100000).toFixed(2)} Lakhs
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Cumulative Disbursed</div>
        </div>

        <div style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Utilization Rate</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: getProgressColor(), marginTop: '4px' }} className="num-tabular">
            {utilization.toFixed(1)}%
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Of total sanction</div>
        </div>

        <div style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Unutilized Balance</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '4px' }} className="num-tabular">
            ₹{(remaining / 100000).toFixed(2)} Lakhs
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Remaining in treasury</div>
        </div>
      </div>

      {/* Visual Utilization Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Budget Depletion Progress</span>
          <span style={{ fontWeight: 700, color: getProgressColor() }}>{utilization.toFixed(1)}% Exhausted</span>
        </div>
        <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${Math.min(utilization, 100)}%`, 
              height: '100%', 
              backgroundColor: getProgressColor(), 
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s ease'
            }} 
          />
        </div>
        
        {work.financialAnomalyScore > 60 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#b45309', marginTop: '8px' }}>
            <AlertCircle size={13} />
            <span>AI Signal: Financial utilization velocity is front-loaded relative to typical milestone certification curve.</span>
          </div>
        )}
      </div>
    </div>
  );
};
