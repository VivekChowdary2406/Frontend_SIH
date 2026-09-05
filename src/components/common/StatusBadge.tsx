import React from 'react';
import { WorkStatus } from '../../types/work';
import { Clock, CheckCircle2, FileCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: WorkStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'ONGOING':
      return (
        <span className="badge badge-ongoing">
          <Clock size={12} />
          <span>ONGOING</span>
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="badge badge-completed">
          <CheckCircle2 size={12} />
          <span>COMPLETED</span>
        </span>
      );
    case 'SANCTIONED':
      return (
        <span className="badge badge-sanctioned">
          <FileCheck size={12} />
          <span>SANCTIONED</span>
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};
