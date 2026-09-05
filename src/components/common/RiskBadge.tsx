import React from 'react';
import { RiskLevel } from '../../types/work';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, showIcon = true }) => {
  const getBadgeClass = () => {
    switch (level) {
      case 'HIGH':
        return 'badge-high';
      case 'MEDIUM':
        return 'badge-medium';
      case 'LOW':
      default:
        return 'badge-low';
    }
  };

  const renderIcon = () => {
    if (!showIcon) return null;
    switch (level) {
      case 'HIGH':
        return <ShieldAlert size={12} />;
      case 'MEDIUM':
        return <AlertTriangle size={12} />;
      case 'LOW':
      default:
        return <ShieldCheck size={12} />;
    }
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {renderIcon()}
      <span>
        {level} RISK {score !== undefined ? `(${score})` : ''}
      </span>
    </span>
  );
};
