import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { alertService } from '../services/api/alertService';
import { SystemAlert, AlertStatus, AlertType } from '../types/alert';
import { RiskLevel } from '../types/work';
import { PaginatedResponse } from '../types/api';
import { RiskBadge } from '../components/common/RiskBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { navigateToWork, handleUpdateAlertStatus, refreshTrigger } = useApp();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'ALL'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<AlertType | 'ALL'>('ALL');

  const [selectedAlertForAction, setSelectedAlertForAction] = useState<SystemAlert | null>(null);
  const [actionStatus, setActionStatus] = useState<AlertStatus>('UNDER_REVIEW');
  const [actionNote, setActionNote] = useState('');

  // Local alerts from mock store (always available)
  const alerts = dataService.getAlerts({
    status: statusFilter,
    severity: severityFilter,
    type: typeFilter,
    query
  });

  // Mirror mark-as-read to backend when alert action is committed
  const syncAlertReadToBackend = (alertId: string) => {
    alertService.markAlertRead(alertId).catch(() => {});
  };

  const handleOpenActionModal = (alert: SystemAlert, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAlertForAction(alert);
    setActionStatus(alert.status === 'NEW' ? 'UNDER_REVIEW' : alert.status);
    setActionNote('');
  };

  const handleCommitAction = () => {
    if (!selectedAlertForAction) return;
    handleUpdateAlertStatus(selectedAlertForAction.alertId, actionStatus, actionNote);
    // Sync to backend (fire-and-forget, graceful if offline)
    alertService.updateAlert(selectedAlertForAction.alertId, {
      status: actionStatus,
      reviewer_notes: actionNote || undefined,
    }).catch(() => {});
    if (actionStatus === 'RESOLVED') {
      syncAlertReadToBackend(selectedAlertForAction.alertId);
    }
    setSelectedAlertForAction(null);
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="badge badge-high">NEW</span>;
      case 'UNDER_REVIEW':
        return <span className="badge badge-ongoing">UNDER REVIEW</span>;
      case 'RESOLVED':
        return <span className="badge badge-completed">RESOLVED</span>;
      case 'DISMISSED':
        return <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>DISMISSED</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <DisclaimerBanner />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Central Investigation Alerts Queue
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Triaging queue for algorithmic anomaly detections requiring administrative determination
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-box" style={{ flex: '1 1 260px' }}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search alerts by Alert ID, Work ID, MP, or reason..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">All Review Statuses</option>
            <option value="NEW">New (Unreviewed)</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="filter-group">
          <select 
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
          >
            <option value="ALL">All Alert Types</option>
            <option value="FINANCIAL_ANOMALY">Financial Anomaly</option>
            <option value="PAYMENT_ANOMALY">Payment Anomaly</option>
            <option value="DELAY_RISK">Delay Risk</option>
            <option value="EXECUTION_ANOMALY">Execution Anomaly</option>
            <option value="POTENTIAL_DUPLICATE">Potential Duplicate</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div className="filter-group">
          <select 
            className="filter-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
          >
            <option value="ALL">All Severities</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="table-container">
        {alerts.length === 0 ? (
          <EmptyState
            title="No Alerts Found"
            description="There are currently no surveillance alerts matching your selected triage filters."
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '12%' }}>Alert ID</th>
                <th style={{ width: '14%' }}>Category & Score</th>
                <th style={{ width: '22%' }}>Target Project</th>
                <th style={{ width: '28%' }}>Specific Anomaly Rationale</th>
                <th style={{ width: '12%' }}>Review Status</th>
                <th style={{ width: '12%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr 
                  key={alert.alertId}
                  className="row-clickable"
                  onClick={() => navigateToWork(alert.workId)}
                >
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--gov-blue-primary)' }}>
                    <div>{alert.alertId}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{alert.dateGenerated}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>
                      {alert.type.replace('_', ' ')}
                    </div>
                    <div style={{ marginTop: '2px' }}>
                      <RiskBadge level={alert.severity} score={alert.score} showIcon={false} />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {alert.workTitle}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {alert.workId} · {alert.mpName} ({alert.state})
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {alert.reason}
                    </div>
                    {alert.reviewerNotes && (
                      <div style={{ fontSize: '10px', color: '#1e40af', marginTop: '4px', background: '#eff6ff', padding: '3px 6px', borderRadius: '3px' }}>
                        Note: {alert.reviewerNotes}
                      </div>
                    )}
                  </td>
                  <td>
                    {getStatusBadge(alert.status)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToWork(alert.workId);
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span>Review</span>
                        <ArrowRight size={12} />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => handleOpenActionModal(alert, e)}
                        title="Change triage status"
                      >
                        <span>Triage</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Triage Action Modal */}
      {selectedAlertForAction && (
        <Modal
          isOpen={!!selectedAlertForAction}
          onClose={() => setSelectedAlertForAction(null)}
          title={`Triage Surveillance Alert: ${selectedAlertForAction.alertId}`}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setSelectedAlertForAction(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCommitAction}>
                Save Triage Decision
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '13px' }}>
              <strong>Work:</strong> {selectedAlertForAction.workTitle} ({selectedAlertForAction.workId})
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
              <strong>Signal Reason:</strong> {selectedAlertForAction.reason}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                Set Investigation Status
              </label>
              <select
                className="filter-select"
                style={{ width: '100%', padding: '8px' }}
                value={actionStatus}
                onChange={(e) => setActionStatus(e.target.value as AlertStatus)}
              >
                <option value="NEW">NEW (Awaiting Triage)</option>
                <option value="UNDER_REVIEW">UNDER REVIEW (Inquiry Underway)</option>
                <option value="RESOLVED">RESOLVED (Verified & Cleared)</option>
                <option value="DISMISSED">DISMISSED (False Flag / Standard Deviation)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                Investigation Audit Note
              </label>
              <textarea
                rows={3}
                style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
                placeholder="Enter audit finding or verification dispatch reference..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
