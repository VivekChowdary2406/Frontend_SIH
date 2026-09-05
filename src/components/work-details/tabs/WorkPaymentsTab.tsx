import React, { useState } from 'react';
import { PaymentTransaction } from '../../../types/payment';
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  X, 
  ExternalLink,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { Modal } from '../../common/Modal';

interface WorkPaymentsTabProps {
  payments: PaymentTransaction[];
}

export const WorkPaymentsTab: React.FC<WorkPaymentsTabProps> = ({ payments }) => {
  const [filterAnomalous, setFilterAnomalous] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);

  const displayedPayments = filterAnomalous
    ? payments.filter(p => p.isAnomalous)
    : payments;

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const anomalousCount = payments.filter(p => p.isAnomalous).length;

  return (
    <div className="tab-pane-container">
      {/* 21. Summary Strip for this Work's Transactions */}
      <div className="payments-tab-header">
        <div className="payments-tab-kpis">
          <div className="pay-kpi">
            <span className="pay-kpi-label">Total Transactions:</span>
            <strong className="num-tabular">{payments.length} Vouchers</strong>
          </div>
          <div className="pay-kpi">
            <span className="pay-kpi-label">Cumulative Disbursed:</span>
            <strong className="num-tabular" style={{ color: 'var(--gov-green-dark)' }}>
              ₹{(totalAmount / 10000000).toFixed(2)} Cr
            </strong>
          </div>
          <div className="pay-kpi">
            <span className="pay-kpi-label">Atypical Patterns:</span>
            <strong className="num-tabular" style={{ color: anomalousCount > 0 ? '#dc2626' : '#16a34a' }}>
              {anomalousCount} Flagged
            </strong>
          </div>
        </div>

        <div>
          <button
            className={`btn btn-sm ${filterAnomalous ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterAnomalous(!filterAnomalous)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <AlertTriangle size={13} color={filterAnomalous ? '#ffffff' : '#d97706'} />
            <span>{filterAnomalous ? 'Showing Flagged Only' : 'Filter Atypical Vouchers'}</span>
          </button>
        </div>
      </div>

      {/* Scannable Payments Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table" role="table" aria-label="Work payments ledger">
          <thead>
            <tr>
              <th style={{ width: '16%' }}>Payment ID</th>
              <th style={{ width: '12%' }}>Date</th>
              <th style={{ width: '28%' }}>Vendor / Beneficiary</th>
              <th style={{ width: '15%' }}>Amount</th>
              <th style={{ width: '12%' }}>Status</th>
              <th style={{ width: '17%' }}>Anomaly Pattern</th>
            </tr>
          </thead>
          <tbody>
            {displayedPayments.map((p) => (
              <tr 
                key={p.paymentId}
                className={`table-row-hover ${p.isAnomalous ? 'row-anomalous' : ''}`}
                onClick={() => setSelectedPayment(p)}
                style={{ cursor: 'pointer' }}
                title="Click to view voucher detail"
              >
                <td>
                  <span className="mono-tag" style={{ color: 'var(--gov-blue-primary)' }}>
                    {p.paymentId}
                  </span>
                </td>
                <td className="num-tabular" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {p.date}
                </td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                    {p.vendor}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {p.disbursementStage}
                  </div>
                </td>
                <td className="num-tabular" style={{ fontWeight: 700, fontSize: '13px' }}>
                  ₹{(p.amount / 100000).toFixed(2)}L
                </td>
                <td>
                  <span className="badge badge-completed" style={{ fontSize: '10px' }}>
                    {p.paymentStatus}
                  </span>
                </td>
                <td>
                  {p.isAnomalous ? (
                    <span className="badge badge-high" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={10} />
                      {p.anomalyType.replace('_', ' ')}
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Normal progression
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Detail Modal Dialog */}
      {selectedPayment && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPayment(null)}
          title={`Payment Voucher Detail · ${selectedPayment.paymentId}`}
          maxWidth="560px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount Cleared</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-blue-primary)' }} className="num-tabular">
                  ₹{(selectedPayment.amount / 100000).toFixed(2)} Lakhs
                </div>
              </div>
              <span className={`badge ${selectedPayment.isAnomalous ? 'badge-high' : 'badge-completed'}`}>
                {selectedPayment.isAnomalous ? 'Flagged for Review' : 'Normal Clearance'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span className="info-label">Transaction Reference:</span>
                <div className="mono-sub" style={{ marginTop: '2px' }}>{selectedPayment.transactionRef}</div>
              </div>
              <div>
                <span className="info-label">Disbursement Date:</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{selectedPayment.date}</div>
              </div>
              <div>
                <span className="info-label">Contractor Vendor:</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{selectedPayment.vendor}</div>
              </div>
              <div>
                <span className="info-label">Masked PAN:</span>
                <div className="mono-sub" style={{ marginTop: '2px' }}>{selectedPayment.vendorPanMasked}</div>
              </div>
            </div>

            <div>
              <span className="info-label">Civil Disbursement Stage:</span>
              <div style={{ fontWeight: 600, marginTop: '2px', color: 'var(--text-primary)' }}>
                {selectedPayment.disbursementStage}
              </div>
            </div>

            {selectedPayment.isAnomalous && selectedPayment.anomalyReason && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-sm)',
                color: '#991b1b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
                  <AlertTriangle size={14} color="#dc2626" />
                  <span>Algorithmic Detection Reason:</span>
                </div>
                <p style={{ fontSize: '12px', lineHeight: 1.4, color: '#991b1b' }}>
                  {selectedPayment.anomalyReason}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedPayment(null)}>
                Close Detail
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
