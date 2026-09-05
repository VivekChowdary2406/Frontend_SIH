import React from 'react';
import { Work } from '../../types/work';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { Printer, UserCheck, MapPin, Calendar, Layers } from 'lucide-react';
import { exportService } from '../../services/exportService';
import { dataService } from '../../services/dataService';

interface WorkHeaderProps {
  work: Work;
}

export const WorkHeader: React.FC<WorkHeaderProps> = ({ work }) => {
  const payments = dataService.getPayments({ workId: work.workId });

  const getGaugeClass = () => {
    if (work.finalRiskLevel === 'HIGH') return 'high';
    if (work.finalRiskLevel === 'MEDIUM') return 'med';
    return 'low';
  };

  const handlePrint = () => {
    exportService.printInvestigationDossier(work, payments);
  };

  return (
    <div>
      <DisclaimerBanner />

      <div className="work-details-header">
        <div className="work-header-top">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '12px', 
                fontWeight: 700, 
                color: 'var(--gov-blue-primary)',
                backgroundColor: 'var(--gov-blue-soft)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)'
              }}>
                {work.workId}
              </span>
              <StatusBadge status={work.status} />
              <RiskBadge level={work.finalRiskLevel} />
              {work.reviewStatus && work.reviewStatus !== 'NEW' && (
                <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
                  {work.reviewStatus.replace('_', ' ')}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {work.title}
            </h1>

            <div className="work-meta-chips">
              <span className="meta-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <UserCheck size={12} />
                <strong>MP:</strong> {work.mpName} ({work.house === 'LOK_SABHA' ? 'Lok Sabha' : 'Rajya Sabha'})
              </span>
              <span className="meta-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} />
                {work.constituency}, {work.state}
              </span>
              <span className="meta-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Layers size={12} />
                {work.category}
              </span>
              <span className="meta-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} />
                FY {work.financialYear}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            {/* Risk Gauge Score Display */}
            <div className="risk-gauge-box">
              <div className={`risk-gauge-circle ${getGaugeClass()}`}>
                <span className="num-tabular">{work.finalRiskScore}</span>
                <span style={{ fontSize: '9px', fontWeight: 600, opacity: 0.9 }}>/100</span>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                  Composite Risk Index
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: work.finalRiskLevel === 'HIGH' ? '#dc2626' : work.finalRiskLevel === 'MEDIUM' ? '#d97706' : '#16a34a' }}>
                  {work.finalRiskLevel} PRIORITY
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Decision Support Signal
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handlePrint}
                title="Generate printable investigation dossier"
              >
                <Printer size={14} />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
