import React from 'react';
import { PaymentTransaction } from '../../types/payment';
import { CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface WorkPaymentsListProps {
  payments: PaymentTransaction[];
}

export const WorkPaymentsList: React.FC<WorkPaymentsListProps> = ({ payments }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">
            <CreditCard size={16} color="var(--gov-blue-primary)" />
            <span>Disbursement & Payment Ledger</span>
          </div>
          <div className="card-subtitle">
            PFMS transactions linked directly to this work sanction
          </div>
        </div>
        <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
          {payments.length} Transactions
        </span>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Voucher ID</th>
              <th>Date</th>
              <th>Stage / Milestone</th>
              <th>Beneficiary Vendor</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Anomaly Indicator</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                  No payment vouchers cleared for this work yet.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.paymentId} style={{ backgroundColor: p.isAnomalous ? '#fffdf7' : 'transparent' }}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--gov-blue-primary)' }}>
                    {p.paymentId}
                  </td>
                  <td>{p.date}</td>
                  <td style={{ fontWeight: 500 }}>{p.disbursementStage}</td>
                  <td>
                    <div>{p.vendor}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PAN: {p.vendorPanMasked}</div>
                  </td>
                  <td style={{ fontWeight: 700 }} className="num-tabular">
                    ₹{(p.amount / 100000).toFixed(2)}L
                  </td>
                  <td>
                    {p.paymentStatus === 'CLEARED' ? (
                      <span className="badge badge-completed">CLEARED</span>
                    ) : (
                      <span className="badge badge-high">UNDER REVIEW</span>
                    )}
                  </td>
                  <td>
                    {p.isAnomalous ? (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', maxWidth: '280px' }}>
                        <AlertTriangle size={13} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '11px', color: '#991b1b', lineHeight: 1.3 }}>
                          <strong>Unusual Pattern:</strong> {p.anomalyReason}
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#166534', fontSize: '12px' }}>
                        <CheckCircle2 size={13} />
                        <span>Standard Tranche</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
