import React from 'react';
import { Work } from '../../../types/work';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Hourglass, 
  AlertCircle,
  FileCheck,
  Building
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface WorkExecutionTabProps {
  work: Work;
}

export const WorkExecutionTab: React.FC<WorkExecutionTabProps> = ({ work }) => {
  // Calculate elapsed time since sanction
  const sanctionDate = new Date(work.sanctionDate);
  const now = new Date();
  const elapsedMonths = Math.max(1, Math.round((now.getTime() - sanctionDate.getTime()) / (1000 * 60 * 60 * 24 * 30.4)));

  return (
    <div className="tab-pane-container">
      {/* 20. Execution Status & Key Milestones Matrix */}
      <div className="execution-metrics-row">
        <div className="execution-metric-tile">
          <span className="exe-metric-label">Current Status</span>
          <div style={{ marginTop: '4px' }}>
            <StatusBadge status={work.status} />
          </div>
          <span className="exe-metric-sub">Physical Civil Phase</span>
        </div>

        <div className="execution-metric-tile">
          <span className="exe-metric-label">Time Since Sanction</span>
          <span className="exe-metric-val num-tabular">{elapsedMonths} Months</span>
          <span className="exe-metric-sub">Since {work.sanctionDate}</span>
        </div>

        <div className="execution-metric-tile">
          <span className="exe-metric-label">Scheduled Completion</span>
          <span className="exe-metric-val">{work.expectedCompletionDate || '2025-06-30'}</span>
          <span className="exe-metric-sub">Target Contract Deadline</span>
        </div>

        <div className="execution-metric-tile">
          <span className="exe-metric-label">Predicted Delay Risk</span>
          <span className="exe-metric-val num-tabular" style={{ color: work.delayProbability > 60 ? '#dc2626' : '#16a34a' }}>
            {work.delayProbability}%
          </span>
          <span className="exe-metric-sub">Probability of Overrun</span>
        </div>
      </div>

      {/* Critical Administrative & Operational Dates */}
      <div className="card">
        <div className="card-header-clean">
          <div className="chart-title">
            <Calendar size={15} color="var(--gov-blue-primary)" />
            <span>Execution Milestones Tracker</span>
          </div>
          <span className="text-badge">{work.timeline.length} Milestones Recorded</span>
        </div>

        <div className="execution-dates-summary">
          <div className="exe-summary-item">
            <span className="exe-summary-label">Recommendation Date:</span>
            <strong className="exe-summary-val">{work.recommendationDate}</strong>
          </div>
          <div className="exe-summary-item">
            <span className="exe-summary-label">Sanction Date:</span>
            <strong className="exe-summary-val">{work.sanctionDate}</strong>
          </div>
          <div className="exe-summary-item">
            <span className="exe-summary-label">First Payment:</span>
            <strong className="exe-summary-val">{work.firstPaymentDate || '2024-07-10'}</strong>
          </div>
          <div className="exe-summary-item">
            <span className="exe-summary-label">Latest Payment:</span>
            <strong className="exe-summary-val">{work.latestPaymentDate || '2024-11-28'}</strong>
          </div>
        </div>

        {/* Chronological Execution Timeline */}
        <div className="timeline-container" style={{ marginTop: '20px' }}>
          {work.timeline.map((milestone, idx) => {
            const isCompleted = milestone.status === 'COMPLETED';
            const isLatest = idx === work.timeline.length - 1;

            return (
              <div key={idx} className="timeline-item">
                <div className="timeline-marker-wrap">
                  <div className={`timeline-marker ${isCompleted ? 'completed' : 'pending'}`}>
                    {isCompleted ? <CheckCircle2 size={13} color="#ffffff" /> : <Hourglass size={12} color="#64748b" />}
                  </div>
                  {!isLatest && <div className="timeline-line" />}
                </div>

                <div className="timeline-content">
                  <div className="timeline-header-line">
                    <span className="timeline-title">{milestone.title}</span>
                    <span className="timeline-date">{milestone.date}</span>
                  </div>
                  <p className="timeline-desc">{milestone.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
