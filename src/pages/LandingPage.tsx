import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Landmark, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Activity, 
  Search, 
  Scale, 
  IndianRupee, 
  Clock, 
  CopyCheck, 
  Layers, 
  FileSearch,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentRoute, navigateToWork } = useApp();

  const handleOpenSystem = () => {
    setCurrentRoute('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-page-container">
      {/* Institutional Top Sovereign Strip */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-brand">
            <div className="gov-emblem-landing">
              <Landmark size={20} color="#fbbf24" />
            </div>
            <div>
              <div className="landing-brand-title">भारत सरकार · Government of India</div>
              <div className="landing-brand-subtitle">Ministry of Statistics & Programme Implementation (MoSPI)</div>
            </div>
          </div>
          <div className="landing-header-actions">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                navigateToWork('WS/UP/2025/001');
              }}
            >
              <FileSearch size={14} />
              <span>Inspect Canonical Work (WS/UP/2025/001)</span>
            </button>
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleOpenSystem}
            >
              <span>Enter Command System</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-pill">
            <span className="landing-pill-dot" />
            <span>AI-Assisted Governance & Vigilance Infrastructure</span>
          </div>

          <h1 className="landing-hero-title">
            MPLADS MONITORING SYSTEM
          </h1>

          <p className="landing-hero-subtitle">
            AI-assisted intelligence for monitoring public development works.
          </p>

          <p className="landing-hero-desc">
            Monitor MPLADS works, identify unusual patterns, understand risk signals, and support evidence-based human review.
          </p>

          <div className="landing-cta-row">
            <button 
              className="landing-primary-btn"
              onClick={handleOpenSystem}
              id="open-monitoring-system-btn"
            >
              <span>OPEN MONITORING SYSTEM</span>
              <ArrowRight size={16} />
            </button>

            <button 
              className="landing-secondary-btn"
              onClick={() => {
                setCurrentRoute('works');
              }}
            >
              <span>Explore Works Directory</span>
            </button>
          </div>

          {/* Trust Statement Callout */}
          <div className="landing-trust-banner">
            <div className="landing-trust-icon">
              <Scale size={18} color="#047857" />
            </div>
            <div className="landing-trust-text">
              <strong>Mandatory Nodal Protocol:</strong> "AI findings indicate unusual patterns and do not establish wrongdoing. Final assessment remains with the authorized human reviewer."
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Pipeline: HOW IT WORKS */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-section-eyebrow">Operational Methodology</span>
            <h2 className="landing-section-title">HOW IT WORKS</h2>
            <p className="landing-section-desc">
              A 5-stage sovereign architecture transforming disparate public finance and engineering milestones into explainable investigative intelligence.
            </p>
          </div>

          <div className="pipeline-flow">
            <div className="pipeline-step">
              <div className="pipeline-step-num">01</div>
              <div className="pipeline-step-icon">
                <Database size={20} />
              </div>
              <div className="pipeline-step-title">MPLADS DATA</div>
              <p className="pipeline-step-desc">
                Continuous ingestion of PFMS transactions, tender releases, district approval orders, and geo-tagged measurement entries.
              </p>
            </div>

            <div className="pipeline-arrow">
              <ChevronRight size={18} />
            </div>

            <div className="pipeline-step">
              <div className="pipeline-step-num">02</div>
              <div className="pipeline-step-icon">
                <Cpu size={20} />
              </div>
              <div className="pipeline-step-title">AI / ML ANALYSIS</div>
              <p className="pipeline-step-desc">
                Machine learning trajectory models, anomaly detection heuristics, and peer cohort benchmark comparisons.
              </p>
            </div>

            <div className="pipeline-arrow">
              <ChevronRight size={18} />
            </div>

            <div className="pipeline-step">
              <div className="pipeline-step-num">03</div>
              <div className="pipeline-step-icon">
                <Activity size={20} />
              </div>
              <div className="pipeline-step-title">RISK SIGNALS</div>
              <p className="pipeline-step-desc">
                Multi-dimensional composite scoring across financial velocity, payment clustering, execution lags, and similarity overlap.
              </p>
            </div>

            <div className="pipeline-arrow">
              <ChevronRight size={18} />
            </div>

            <div className="pipeline-step highlight">
              <div className="pipeline-step-num">04</div>
              <div className="pipeline-step-icon">
                <Search size={20} />
              </div>
              <div className="pipeline-step-title">EXPLAINABLE INVESTIGATION</div>
              <p className="pipeline-step-desc">
                Contextual workspace providing ground-truth evidence, peer comparisons, and queryable causal rationales for every flagged flag.
              </p>
            </div>

            <div className="pipeline-arrow">
              <ChevronRight size={18} />
            </div>

            <div className="pipeline-step">
              <div className="pipeline-step-num">05</div>
              <div className="pipeline-step-icon">
                <Scale size={20} />
              </div>
              <div className="pipeline-step-title">HUMAN REVIEW</div>
              <p className="pipeline-step-desc">
                Authorized district or ministry officials review verifiable evidence, register findings, and determine administrative actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Major Capabilities Grid */}
      <section className="landing-section bg-subtle">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-section-eyebrow">Surveillance Capabilities</span>
            <h2 className="landing-section-title">Core Monitoring & Investigation Modules</h2>
            <p className="landing-section-desc">
              Designed specifically for nodal officers, district collectors, and parliamentary vigilance bodies.
            </p>
          </div>

          <div className="capabilities-grid">
            <div className="capability-card">
              <div className="capability-icon">
                <IndianRupee size={20} />
              </div>
              <div className="capability-title">Financial Monitoring</div>
              <p className="capability-desc">
                Tracks sanction allocations, expenditure velocity, and budget utilization rates against stage milestone completion benchmarks.
              </p>
            </div>

            <div className="capability-card">
              <div className="capability-icon">
                <Layers size={20} />
              </div>
              <div className="capability-title">Payment Monitoring</div>
              <p className="capability-desc">
                Surveillance of individual PFMS payment vouchers to detect atypical frequency, rapid tranche bursts, and threshold splitting.
              </p>
            </div>

            <div className="capability-card">
              <div className="capability-icon">
                <Clock size={20} />
              </div>
              <div className="capability-title">Execution Monitoring</div>
              <p className="capability-desc">
                Audits timelines from initial MP recommendation to technical sanction, first disbursement, and on-ground physical inspection.
              </p>
            </div>

            <div className="capability-card">
              <div className="capability-icon">
                <Activity size={20} />
              </div>
              <div className="capability-title">Delay-Risk Prediction</div>
              <p className="capability-desc">
                Calculates predicted probability of unusually long completion early in the work lifecycle to prevent dormant stalls.
              </p>
            </div>

            <div className="capability-card">
              <div className="capability-icon">
                <CopyCheck size={20} />
              </div>
              <div className="capability-title">Similar-Work Detection</div>
              <p className="capability-desc">
                Identifies geospatial and bill-of-quantities overlaps between sanctioned works to detect potential duplicate asset authorizations.
              </p>
            </div>

            <div className="capability-card capability-flagship">
              <div className="capability-icon">
                <FileSearch size={20} />
              </div>
              <div className="capability-title">Explainable Risk Investigation</div>
              <p className="capability-desc">
                Flagship conversational workspace providing scannable evidence, peer cohort comparisons, and actionable inquiry workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sovereign Bottom Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-left">
            <div className="landing-footer-brand">
              <Landmark size={18} color="#94a3b8" />
              <span>MPLADS Monitoring & Investigation System</span>
            </div>
            <p className="landing-footer-note">
              Designed in compliance with the Ministry of Statistics and Programme Implementation Guidelines on Public Works Surveillance.
            </p>
          </div>
          <div className="landing-footer-right">
            <button 
              className="btn btn-primary"
              onClick={handleOpenSystem}
            >
              <span>Access Monitoring Dashboard →</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
