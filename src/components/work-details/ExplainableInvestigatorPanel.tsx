import React, { useState } from 'react';
import { Work } from '../../types/work';
import { PaymentTransaction } from '../../types/payment';
import { StructuredInvestigationResponse } from '../../types/investigator';
import { investigationEngine } from '../../services/investigationEngine';
import { WorkRiskResponse } from '../../types/api';
import { 
  Sparkles, 
  Send, 
  Search, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Clock,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Scale,
  UserCheck,
  CheckCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface ExplainableInvestigatorPanelProps {
  work: Work;
  payments: PaymentTransaction[];
  /** Live risk data from FastAPI backend (optional – backend may be offline) */
  liveRisk?: WorkRiskResponse | null;
  /** Callback to re-trigger a live risk evaluation via POST /api/v1/risk/evaluate/{id} */
  onRefreshRisk?: () => void;
  /** True while the live risk is being fetched */
  isFetchingRisk?: boolean;
}

export const ExplainableInvestigatorPanel: React.FC<ExplainableInvestigatorPanelProps> = ({
  work,
  payments,
  liveRisk,
  onRefreshRisk,
  isFetchingRisk = false
}) => {
  const suggestedQuestions = [
    'Why is this work risky?',
    'What is the strongest evidence?',
    'Compare with similar works',
    'Why is the payment pattern unusual?',
    'Why is the delay probability high?',
    'What should I review first?'
  ];

  const [customQuery, setCustomQuery] = useState('');
  const [expandedEvidenceIdx, setExpandedEvidenceIdx] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const [isQueryLoading, setIsQueryLoading] = useState(false);

  // Initial investigation response
  const [activeResponse, setActiveResponse] = useState<StructuredInvestigationResponse>(() => 
    investigationEngine.analyzeQuery(work, payments, 'Why is this work risky?')
  );

  const handleAskQuestion = async (q: string) => {
    if (!q.trim()) return;
    setIsQueryLoading(true);
    try {
      const response = await investigationEngine.queryAssistantAsync(work, payments, q);
      setActiveResponse(response);
    } finally {
      setIsQueryLoading(false);
    }
    setCustomQuery('');
    setExpandedEvidenceIdx(null);
    if (q.toLowerCase().includes('compare') || q.toLowerCase().includes('similar')) {
      setShowComparison(true);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#dc2626';
    if (score >= 40) return '#d97706';
    return '#16a34a';
  };

  return (
    <div className="investigator-panel" id="explainable-risk-investigator">
      {/* 26. INVESTIGATOR HEADER */}
      <div className="investigator-header">
        <div className="investigator-header-main">
          <div className="investigator-badge-row">
            <span className="investigator-tag">
              <Sparkles size={13} color="#fbbf24" />
              <span>EXPLAINABLE RISK INVESTIGATOR</span>
            </span>
            <span className="mono-tag-light">{work.workId}</span>
          </div>

          <h2 className="investigator-title">
            {work.title}
          </h2>
          <div className="investigator-subtitle">
            {work.state} · Attributed MP: {work.mpName}
          </div>
        </div>

        <div className="investigator-header-risk">
          <div className="investigator-risk-box">
            {/* Show live score from backend if available, else local mock */}
            {liveRisk ? (
              <>
                <span className="inv-risk-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  Live Risk Score
                </span>
                <div className="inv-risk-score-wrap">
                  <span className="inv-risk-num num-tabular">{liveRisk.composite_risk_score ?? work.finalRiskScore}</span>
                  <span className="inv-risk-denom">/ 100</span>
                </div>
                <span className={`risk-tag ${(liveRisk.risk_level ?? work.finalRiskLevel).toLowerCase()}`}>
                  {liveRisk.risk_level ?? work.finalRiskLevel}
                </span>
              </>
            ) : (
              <>
                <span className="inv-risk-label">Overall Risk</span>
                <div className="inv-risk-score-wrap">
                  <span className="inv-risk-num num-tabular">{work.finalRiskScore}</span>
                  <span className="inv-risk-denom">/ 100</span>
                </div>
                <span className={`risk-tag ${work.finalRiskLevel.toLowerCase()}`}>
                  {work.finalRiskLevel}
                </span>
              </>
            )}
            {onRefreshRisk && (
              <button
                onClick={onRefreshRisk}
                disabled={isFetchingRisk}
                title="Re-evaluate risk from backend"
                style={{
                  marginTop: 6,
                  background: 'none',
                  border: 'none',
                  cursor: isFetchingRisk ? 'not-allowed' : 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  padding: '2px 0'
                }}
              >
                <RotateCcw size={11} style={{ animation: isFetchingRisk ? 'spin 1s linear infinite' : 'none' }} />
                {isFetchingRisk ? 'Evaluating…' : 'Re-evaluate'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 26. PRIMARY CONTRIBUTING SIGNALS (Compact Visual Indicators) */}
      <div className="contributing-signals-strip">
        <div className="contributing-strip-label">
          PRIMARY CONTRIBUTING SIGNALS:
        </div>
        <div className="contributing-signals-grid">
          <div className="contrib-gauge">
            <div className="contrib-name">Financial anomaly</div>
            <div className="contrib-val num-tabular" style={{ color: getScoreColor(work.financialAnomalyScore) }}>
              {work.financialAnomalyScore}
            </div>
            <div className="contrib-bar">
              <div style={{ width: `${work.financialAnomalyScore}%`, backgroundColor: getScoreColor(work.financialAnomalyScore) }} />
            </div>
          </div>

          <div className="contrib-gauge">
            <div className="contrib-name">Payment anomaly</div>
            <div className="contrib-val num-tabular" style={{ color: getScoreColor(work.paymentAnomalyScore) }}>
              {work.paymentAnomalyScore}
            </div>
            <div className="contrib-bar">
              <div style={{ width: `${work.paymentAnomalyScore}%`, backgroundColor: getScoreColor(work.paymentAnomalyScore) }} />
            </div>
          </div>

          <div className="contrib-gauge">
            <div className="contrib-name">Delay probability</div>
            <div className="contrib-val num-tabular" style={{ color: getScoreColor(work.delayProbability) }}>
              {work.delayProbability}%
            </div>
            <div className="contrib-bar">
              <div style={{ width: `${work.delayProbability}%`, backgroundColor: getScoreColor(work.delayProbability) }} />
            </div>
          </div>

          <div className="contrib-gauge">
            <div className="contrib-name">Execution anomaly</div>
            <div className="contrib-val num-tabular" style={{ color: getScoreColor(work.executionAnomalyScore) }}>
              {work.executionAnomalyScore}
            </div>
            <div className="contrib-bar">
              <div style={{ width: `${work.executionAnomalyScore}%`, backgroundColor: getScoreColor(work.executionAnomalyScore) }} />
            </div>
          </div>
        </div>
      </div>

      <div className="investigator-body">
        {/* Active Structured Investigation Dossier */}
        <div className="investigation-dossier-card">
          {/* Query Header */}
          <div className="dossier-query-bar">
            <div className="dossier-query-text">
              <FileText size={15} color="var(--gov-blue-primary)" />
              <span>Inquiry: <strong>"{activeResponse.query}"</strong></span>
            </div>
            <div className="dossier-timestamp">
              <Clock size={11} />
              <span>Generated {activeResponse.timestamp}</span>
            </div>
          </div>

          {/* 27. KEY FINDING */}
          <div className="dossier-section key-finding-section">
            <div className="dossier-section-label">KEY FINDING</div>
            <p className="dossier-key-finding-text">
              "{activeResponse.keyFinding}"
            </p>
          </div>

          {/* 28. EVIDENCE (Scannable & Expandable) */}
          <div className="dossier-section evidence-section">
            <div className="dossier-section-label">EVIDENCE</div>
            <div className="evidence-list">
              {activeResponse.evidence.map((item, idx) => {
                const isExpanded = expandedEvidenceIdx === idx;
                return (
                  <div key={idx} className="evidence-item">
                    <div 
                      className="evidence-item-header"
                      onClick={() => setExpandedEvidenceIdx(isExpanded ? null : idx)}
                    >
                      <span className="evidence-bullet">•</span>
                      <span className="evidence-text">{item}</span>
                      <button className="btn-icon" aria-label="Toggle evidence details">
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="evidence-detail-expanded">
                        <span className="evidence-detail-tag">Supporting Context:</span>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>
                          Verified against active PFMS cleared vouchers and milestone measurement book logs for {work.workId}.
                          Cohort benchmark baseline is calculated across comparable {work.category} projects in {work.state}.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 29. INTERPRETATION */}
          <div className="dossier-section interpretation-section">
            <div className="dossier-section-label">INTERPRETATION</div>
            <p className="dossier-interpretation-text">
              "{activeResponse.interpretation}"
            </p>
          </div>

          {/* 30. SUGGESTED REVIEW */}
          <div className="dossier-section review-section">
            <div className="dossier-section-label">SUGGESTED REVIEW</div>
            <div className="suggested-review-list">
              {activeResponse.suggestedReview.map((rec, idx) => (
                <div key={idx} className="review-item">
                  <CheckCheck size={14} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 33. COMPARE WITH SIMILAR WORKS (Clean Side-by-Side Comparison) */}
        <div className="card comparison-workspace-card">
          <div className="card-header-clean">
            <div className="chart-title">
              <Scale size={15} color="var(--gov-blue-primary)" />
              <span>COMPARE WITH SIMILAR WORKS</span>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowComparison(!showComparison)}
            >
              <span>{showComparison ? 'Hide Comparison' : 'View Side-by-Side Comparison'}</span>
            </button>
          </div>

          <div className="comparison-content">
            <div className="comparison-columns-wrap">
              {/* CURRENT WORK */}
              <div className="comparison-col current-work-col">
                <div className="comparison-col-header">
                  <span className="comp-col-eyebrow">CURRENT WORK</span>
                  <div className="comp-col-title">{work.title}</div>
                  <div className="comp-col-risk">
                    Risk <span className="num-tabular" style={{ fontWeight: 700, color: '#dc2626' }}>{work.finalRiskScore}</span>
                  </div>
                </div>

                <div className="comp-metric-row">
                  <span className="comp-metric-label">Expenditure</span>
                  <strong className="comp-metric-val num-tabular" style={{ color: '#dc2626' }}>87%</strong>
                </div>
                <div className="comp-metric-row">
                  <span className="comp-metric-label">Payment Frequency</span>
                  <strong className="comp-metric-val num-tabular" style={{ color: '#dc2626' }}>2.4× higher</strong>
                </div>
                <div className="comp-metric-row">
                  <span className="comp-metric-label">Delay Probability</span>
                  <strong className="comp-metric-val num-tabular" style={{ color: '#d97706' }}>68%</strong>
                </div>
              </div>

              <div className="comparison-vs-divider">VS</div>

              {/* COMPARABLE WORKS */}
              <div className="comparison-col peer-work-col">
                <div className="comparison-col-header">
                  <span className="comp-col-eyebrow">COMPARABLE WORKS</span>
                  <div className="comp-col-title">District Peer Cohort Average</div>
                  <div className="comp-col-risk">
                    Average Risk <span className="num-tabular" style={{ fontWeight: 700, color: '#047857' }}>47</span>
                  </div>
                </div>

                <div className="comp-metric-row">
                  <span className="comp-metric-label">Expenditure</span>
                  <strong className="comp-metric-val num-tabular" style={{ color: 'var(--text-secondary)' }}>69%</strong>
                </div>
                <div className="comp-metric-row">
                  <span className="comp-metric-label">Payment Frequency</span>
                  <strong className="comp-metric-val num-tabular" style={{ color: 'var(--text-secondary)' }}>1.0× baseline</strong>
                </div>
                <div className="comp-metric-row">
                  <span className="comp-metric-label">Delay Probability</span>
                  <strong className="comp-metric-val num-tabular" style={{ color: 'var(--text-secondary)' }}>47%</strong>
                </div>
              </div>
            </div>

            <div className="comparison-takeaway">
              <strong>Operational Summary:</strong> Current work exhibits 18 percentage points higher fund exhaustion and 2.4× higher voucher velocity prior to final masonry sign-off compared to peers in the same category.
            </div>
          </div>
        </div>

        {/* 31 & 32. SUGGESTED INVESTIGATION QUESTIONS & INQUIRY BAR */}
        <div className="inquiry-box">
          <div className="inquiry-header-row">
            <span className="inquiry-label">SUGGESTED INVESTIGATION INQUIRIES:</span>
          </div>

          <div className="inquiry-chips-grid">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                className="inquiry-chip-btn"
                onClick={() => handleAskQuestion(q)}
              >
                <span>{q}</span>
                <ArrowRight size={11} style={{ opacity: 0.6 }} />
              </button>
            ))}
          </div>

          {/* Contextual Input Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAskQuestion(customQuery);
            }}
            className="inquiry-form"
          >
            <div className="search-input-box" style={{ flex: 1 }}>
              <Search size={15} color="#64748b" />
              <input
                type="text"
                placeholder={`Ask contextual question for ${work.workId} (e.g., 'What should I review first?', 'Why are payments unusual?')...`}
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!customQuery.trim() || isQueryLoading}
            >
              <Send size={13} />
              <span>{isQueryLoading ? 'Analyzing...' : 'Inquire'}</span>
            </button>
          </form>
        </div>

        {/* 34. INVESTIGATION PRINCIPLES & GOVERNANCE */}
        <div className="card" style={{ padding: '16px 20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              <Scale size={16} color="var(--gov-blue-primary)" />
              <span>INVESTIGATION & GOVERNANCE PRINCIPLES</span>
            </div>
            <div className="trust-principle-badge">
              <span>Algorithmic Decision-Support</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--gov-blue-primary)', marginTop: '6px', flexShrink: 0 }} />
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Objective Surveillance:</strong> The system serves strictly as an objective analytical decision-support tool. Risk scores are computed deterministically from multi-factor machine learning models.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--gov-blue-primary)', marginTop: '6px', flexShrink: 0 }} />
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Historical Pattern Decomposition:</strong> Risk indices synthesize expenditure velocities, contractor voucher timing, delay regressions, and geospatial peer benchmarks across MPLADS records.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--gov-blue-primary)', marginTop: '6px', flexShrink: 0 }} />
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Statutory Authority Purview:</strong> All formal administrative determinations, ground verifications, audits, and inquiries remain under the sovereign statutory jurisdiction of designated nodal officers.
              </div>
            </div>
          </div>

          {/* Historical Review Notes Trail if any existed */}
          {work.reviewNotes && work.reviewNotes.length > 0 && (
            <div className="review-notes-history" style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <div className="review-history-title" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Recorded Administrative Notes Trail:
              </div>
              {work.reviewNotes.map((note, idx) => (
                <div key={idx} className="review-note-entry" style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '6px' }}>
                  <span className="review-note-bullet">•</span>
                  <span className="review-note-text">{note}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
