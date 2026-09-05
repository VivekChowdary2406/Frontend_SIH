import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { SimilarWorkPair } from '../types/investigator';
import { 
  CopyCheck, 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';

export const SimilarWorksPage: React.FC = () => {
  const { navigateToWork } = useApp();
  const pairs = dataService.getSimilarWorkPairs();
  const [selectedPairId, setSelectedPairId] = useState<string>(pairs[0]?.pairId || '');

  const activePair = pairs.find(p => p.pairId === selectedPairId) || pairs[0];

  const workA = activePair ? dataService.getWorkById(activePair.primaryWorkId) : undefined;
  const workB = activePair ? dataService.getWorkById(activePair.comparisonWorkId) : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <DisclaimerBanner customText="A high similarity score does not automatically mean that the works are duplicates. High score indicates lexical, vendor, or geospatial overlap requiring human review to confirm whether works constitute separate phased assets or re-sanctioned scope." />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Potentially Similar Works & Duplicate Asset Surveillance
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Geospatial coordinates and semantic bill-of-quantities matching for asset deduplication review
          </p>
        </div>
      </div>

      {/* Candidate Selector Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {pairs.map((pair) => (
          <button
            key={pair.pairId}
            className={`btn ${pair.pairId === selectedPairId ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedPairId(pair.pairId)}
            style={{ fontSize: '12px' }}
          >
            <CopyCheck size={14} />
            <span>Pair: {pair.primaryWorkId} ⟷ {pair.comparisonWorkId}</span>
            <span 
              className="badge" 
              style={{ 
                backgroundColor: pair.similarityScore >= 80 ? '#fee2e2' : '#fef3c7',
                color: pair.similarityScore >= 80 ? '#991b1b' : '#92400e',
                marginLeft: '6px'
              }}
            >
              {pair.similarityScore}% Match
            </span>
          </button>
        ))}
      </div>

      {/* Main Comparison Section */}
      {activePair && workA && workB && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Overlap Banner */}
          <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-high">Potential Duplicate — Requires Review</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#991b1b' }}>
                    Match Score: {activePair.similarityScore}%
                  </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                  {activePair.explanation}
                </div>
                <div style={{ fontSize: '12px', color: '#1e40af', backgroundColor: '#eff6ff', padding: '8px 12px', borderRadius: 'var(--radius-xs)', border: '1px solid #bfdbfe', marginTop: '8px' }}>
                  <strong>Nodal Recommendation:</strong> {activePair.recommendation}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0, textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Geographic Distance:</span>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  {activePair.geographicProximityKm * 1000} metres
                </strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Sanction Interval:</span>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  {activePair.timeWindowMonths} Months
                </strong>
              </div>
            </div>

            {/* Matched Attribute Pills */}
            <div style={{ marginTop: '14px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Matched Conceptual Attributes
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {activePair.matchedAttributes.map((attr, idx) => (
                  <span 
                    key={idx}
                    style={{
                      fontSize: '11px',
                      backgroundColor: '#fffbeb',
                      color: '#92400e',
                      border: '1px solid #fde68a',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-xs)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle2 size={11} color="#d97706" />
                    <span>{attr}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Side by Side Work Comparison Cards */}
          <div className="comparison-grid">
            {/* WORK A (Active / Ongoing) */}
            <div className="comparison-box">
              <div className="comparison-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#1e40af' }}>WORK A (Subject Work · Ongoing)</span>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigateToWork(workA.workId)}
                >
                  <span>Inspect Work A</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--gov-blue-primary)' }}>
                    {workA.workId}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px', lineHeight: 1.3 }}>
                    {workA.title}
                  </h3>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-app)', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', lineHeight: 1.4 }}>
                  {workA.description}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>MP Sponsor</span>
                    <strong>{workA.mpName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>State / Constituency</span>
                    <strong>{workA.constituency}, {workA.state}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Sanction Amount</span>
                    <strong className="num-tabular">
                      ₹{workA.sanctionAmount >= 10000000 ? (workA.sanctionAmount / 10000000).toFixed(2) + ' Cr' : (workA.sanctionAmount / 100000).toFixed(2) + ' Lakhs'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Sanction Date</span>
                    <strong>{workA.sanctionDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Status</span>
                    <span className="badge badge-ongoing">{workA.status}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Category</span>
                    <strong>{workA.category}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* WORK B (Comparison / Prior Asset) */}
            <div className="comparison-box">
              <div className="comparison-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#047857' }}>WORK B (Baseline Comparison Asset)</span>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigateToWork(workB.workId)}
                >
                  <span>Inspect Work B</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--gov-blue-primary)' }}>
                    {workB.workId}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px', lineHeight: 1.3 }}>
                    {workB.title}
                  </h3>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-app)', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', lineHeight: 1.4 }}>
                  {workB.description}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>MP Sponsor</span>
                    <strong>{workB.mpName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>State / Constituency</span>
                    <strong>{workB.constituency}, {workB.state}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Sanction Amount</span>
                    <strong className="num-tabular">
                      ₹{workB.sanctionAmount >= 10000000 ? (workB.sanctionAmount / 10000000).toFixed(2) + ' Cr' : (workB.sanctionAmount / 100000).toFixed(2) + ' Lakhs'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Sanction Date</span>
                    <strong>{workB.sanctionDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Status</span>
                    <span className="badge badge-completed">{workB.status}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Category</span>
                    <strong>{workB.category}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
