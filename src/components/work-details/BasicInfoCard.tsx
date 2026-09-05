import React from 'react';
import { Work } from '../../types/work';
import { Info } from 'lucide-react';

interface BasicInfoCardProps {
  work: Work;
}

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ work }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Info size={16} color="var(--gov-blue-primary)" />
          <span>Basic Work Profile</span>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
          Scope & Engineering Description
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          {work.description}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Constituency & State</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
            {work.constituency}, {work.state}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Nodal Parliamentary Body</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
            {work.house === 'LOK_SABHA' ? 'Lok Sabha (Lower House)' : 'Rajya Sabha (Upper House)'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Sector & Work Category</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
            {work.category}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Financial Allocation Year</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
            FY {work.financialYear}
          </div>
        </div>
      </div>
    </div>
  );
};
