import React, { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  variant?: 'default' | 'alert' | 'warning' | 'normal';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  icon,
  variant = 'default',
  onClick
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'alert':
        return 'kpi-alert';
      case 'warning':
        return 'kpi-warning';
      case 'normal':
        return 'kpi-normal';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`kpi-card ${getVariantClass()}`} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        {icon && <div className="kpi-icon-wrap">{icon}</div>}
      </div>
      <div className="kpi-value num-tabular">{value}</div>
      {subtext && <div className="kpi-subtext">{subtext}</div>}
    </div>
  );
};
