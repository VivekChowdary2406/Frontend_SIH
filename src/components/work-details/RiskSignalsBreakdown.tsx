import React, { useState } from 'react';
import { Work, RiskSignal } from '../../types/work';
import { ShieldAlert, ChevronDown, ChevronUp, AlertTriangle, Layers, Percent } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface RiskSignalsBreakdownProps {
  work: Work;
}

export const RiskSignalsBreakdown: React.FC<RiskSignalsBreakdownProps> = ({ work }) => {
  const [expandedSignalId, setExpandedSignalId] = useState<string | null>(work.signals[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedSignalId(expandedSignalId === id ? null : id);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#dc2626';
    if (score >= 40) return '#d97706';
    return '#16a34a';
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">
            <ShieldAlert size={16} color="var(--gov-blue-primary)" />
            <span>AI Risk Signals & Anomaly Breakdown</span>
          </div>
          <div className="card-subtitle">
            Comprehensive feature weights and evidence grounding for supervisory review
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Composite Score:</span>{' '}
          <strong style={{ fontSize: '15px', color: getScoreColor(work.finalRiskScore) }}>
            {work.finalRiskScore} / 100
          </strong>
        </div>
      </div>

      {/* High-level Summary Matrix Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '10px',
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: 'var(--bg-app)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Payment Anomaly</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: getScoreColor(work.paymentAnomalyScore), marginTop: '2px' }}>
            {work.paymentAnomalyScore} <span style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>/100</span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Financial Anomaly</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: getScoreColor(work.financialAnomalyScore), marginTop: '2px' }}>
            {work.financialAnomalyScore} <span style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>/100</span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Delay Probability</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: getScoreColor(work.delayProbability), marginTop: '2px' }}>
            {work.delayProbability}%
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Execution Anomaly</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: getScoreColor(work.executionAnomalyScore), marginTop: '2px' }}>
            {work.executionAnomalyScore} <span style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>/100</span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Duplicate Match</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: getScoreColor(work.duplicateSimilarityScore), marginTop: '2px' }}>
            {work.duplicateSimilarityScore}%
          </div>
        </div>
      </div>

      {/* Detailed Signal Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {work.signals.map((signal) => {
          const isExpanded = expandedSignalId === signal.id;
          return (
            <div
              key={signal.id}
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface)',
                overflow: 'hidden',
                transition: 'border-color var(--transition-fast)'
              }}
            >
              {/* Signal Header / Row */}
              <div
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: isExpanded ? '#f8fafc' : '#ffffff'
                }}
                onClick={() => toggleExpand(signal.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: `${getScoreColor(signal.score)}15`,
                      color: getScoreColor(signal.score),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px'
                    }}
                  >
                    {signal.score}
                  </span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {signal.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {signal.shortExplanation}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Percent size={11} />
                    Weight: {signal.contributingWeight}%
                  </span>
                  <RiskBadge level={signal.severity} showIcon={false} />
                  {isExpanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                </div>
              </div>

              {/* Expandable Evidence & Details */}
              {isExpanded && (
                <div style={{
                  padding: '14px 16px',
                  borderTop: '1px solid var(--border-subtle)',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontSize: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Empirical Evidence & Context
                    </div>
                    <div style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-app)', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', lineHeight: 1.4 }}>
                      {signal.evidence}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#b45309', marginBottom: '4px' }}>
                      Regulatory Significance ("Why This Matters")
                    </div>
                    <div style={{ color: '#92400e', backgroundColor: '#fffbeb', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid #fde68a', lineHeight: 1.4 }}>
                      {signal.whyItMatters}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
