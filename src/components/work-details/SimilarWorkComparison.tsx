import React from 'react';
import { Work } from '../../types/work';
import { GitCompare, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SimilarWorkComparisonProps {
  work: Work;
}

export const SimilarWorkComparison: React.FC<SimilarWorkComparisonProps> = ({ work }) => {
  const significantDivergences = work.benchmarks.filter(b => b.isSignificant);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">
            <GitCompare size={16} color="var(--gov-blue-primary)" />
            <span>Peer Cohort Benchmark Comparison</span>
          </div>
          <div className="card-subtitle">
            Current work vs. historical average of comparable works in {work.state} ({work.category})
          </div>
        </div>
        <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
          Cohort Size: N = 48
        </span>
      </div>

      {/* Structured Comparison Table */}
      <div className="table-container" style={{ marginBottom: '16px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Metric Dimension</th>
              <th style={{ width: '22%' }}>Current Work ({work.workId})</th>
              <th style={{ width: '22%' }}>Peer Cohort Average</th>
              <th style={{ width: '31%' }}>Variance Analysis</th>
            </tr>
          </thead>
          <tbody>
            {work.benchmarks.map((benchmark, idx) => (
              <tr key={idx} style={{ backgroundColor: benchmark.isSignificant ? '#fffdf7' : 'transparent' }}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {benchmark.metric}
                </td>
                <td style={{ fontWeight: 700, color: benchmark.isSignificant ? '#b45309' : 'var(--text-primary)' }} className="num-tabular">
                  {benchmark.currentWorkValue}
                </td>
                <td style={{ color: 'var(--text-secondary)' }} className="num-tabular">
                  {benchmark.peerAverageValue}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    {benchmark.isSignificant ? (
                      <AlertCircle size={13} color="#d97706" style={{ flexShrink: 0 }} />
                    ) : (
                      <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0 }} />
                    )}
                    <span style={{ color: benchmark.isSignificant ? '#92400e' : 'var(--text-muted)' }}>
                      {benchmark.varianceNote}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Synthesis Takeaway Note */}
      <div style={{
        padding: '12px 14px',
        backgroundColor: '#f8fafc',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        lineHeight: 1.5
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>Investigative Benchmark Synthesis:</strong>{' '}
        This work differs from comparable works primarily in{' '}
        {significantDivergences.map(d => d.metric.toLowerCase()).join(', ')}.{' '}
        Statistical deviation highlights areas where administrative pace deviates from established norms, establishing priority areas for engineering physical review.
      </div>
    </div>
  );
};
