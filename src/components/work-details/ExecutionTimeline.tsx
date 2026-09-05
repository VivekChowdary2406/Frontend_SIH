import React from 'react';
import { Work } from '../../types/work';
import { Clock, CheckCircle2 } from 'lucide-react';

interface ExecutionTimelineProps {
  work: Work;
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({ work }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Clock size={16} color="var(--gov-blue-primary)" />
          <span>Execution Milestone Timeline</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {work.timeline.length} Registered Events
        </div>
      </div>

      <div className="timeline-container">
        {work.timeline.map((event, index) => (
          <div 
            key={index} 
            className={`timeline-step ${event.status === 'COMPLETED' ? 'completed' : ''}`}
          >
            <div className="timeline-bullet">
              {event.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : index + 1}
            </div>
            <div className="timeline-date">{event.date}</div>
            <div className="timeline-title">{event.title}</div>
            <div className="timeline-desc">{event.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
