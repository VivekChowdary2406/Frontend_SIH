import React, { ReactNode } from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'No matching results found for the selected query or filter criteria.',
  icon = <SearchX size={36} color="#94a3b8" />,
  action
}) => {
  return (
    <div style={{
      padding: '48px 20px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)'
    }}>
      <div>{icon}</div>
      <h3 style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px' }}>{description}</p>
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  );
};
