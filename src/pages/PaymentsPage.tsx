import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { PaymentTransaction } from '../types/payment';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { EmptyState } from '../components/common/EmptyState';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { navigateToWork } = useApp();
  const [query, setQuery] = useState('');
  const [anomalousOnly, setAnomalousOnly] = useState(false);

  const payments = dataService.getPayments({ query, anomalousOnly });

  const totalDisbursed = payments.reduce((acc, p) => acc + p.amount, 0);
  const anomalousCount = payments.filter(p => p.isAnomalous).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <DisclaimerBanner />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Payments & Expenditure Surveillance Ledger
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Real-time PFMS transaction monitoring, disbursement frequency analysis, and voucher clustering detection
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="kpi-card">
          <div className="kpi-label">Total Transactions Monitored</div>
          <div className="kpi-value num-tabular">{payments.length}</div>
          <div className="kpi-subtext">PFMS-cleared vouchers</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Cumulative Disbursed Value</div>
          <div className="kpi-value num-tabular">
            ₹{totalDisbursed >= 10000000 ? (totalDisbursed / 10000000).toFixed(2) + ' Cr' : (totalDisbursed / 100000).toFixed(2) + ' Lakhs'}
          </div>
          <div className="kpi-subtext">Across monitored works</div>
        </div>
        <div className="kpi-card kpi-alert">
          <div className="kpi-label">Unusual Patterns Flagged</div>
          <div className="kpi-value num-tabular" style={{ color: '#dc2626' }}>{anomalousCount}</div>
          <div className="kpi-subtext">Vouchers requiring audit review</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-box" style={{ flex: '1 1 300px' }}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search by Payment ID, vendor name, or Work ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button
          className={`btn btn-sm ${anomalousOnly ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setAnomalousOnly(!anomalousOnly)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <AlertTriangle size={13} color={anomalousOnly ? '#ffffff' : '#d97706'} />
          <span>{anomalousOnly ? 'Showing Anomalous Only' : 'Filter Anomalous Vouchers'}</span>
        </button>

        {(query || anomalousOnly) && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => { setQuery(''); setAnomalousOnly(false); }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Transactions Table */}
      <div className="table-container">
        {payments.length === 0 ? (
          <EmptyState
            title="No Payment Records Matched"
            description="Try relaxing your search query or reset the anomaly filter."
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '13%' }}>Payment ID</th>
                <th style={{ width: '10%' }}>Clearance Date</th>
                <th style={{ width: '22%' }}>Associated Project</th>
                <th style={{ width: '20%' }}>Vendor & Beneficiary</th>
                <th style={{ width: '12%' }}>Disbursed Amount</th>
                <th style={{ width: '23%' }}>Pattern Surveillance Signal</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.paymentId} style={{ backgroundColor: p.isAnomalous ? '#fffdf7' : 'transparent' }}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--gov-blue-primary)' }}>
                    {p.paymentId}
                  </td>
                  <td>{p.date}</td>
                  <td>
                    <div 
                      style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', lineHeight: 1.3 }}
                      onClick={() => navigateToWork(p.workId)}
                      title="Click to view work details"
                    >
                      {p.workId}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {p.workTitle ? p.workTitle.slice(0, 42) + '...' : ''}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{p.vendor}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PAN: {p.vendorPanMasked}</div>
                  </td>
                  <td style={{ fontWeight: 700 }} className="num-tabular">
                    ₹{p.amount >= 10000000 ? (p.amount / 10000000).toFixed(2) + ' Cr' : (p.amount / 100000).toFixed(2) + ' L'}
                  </td>
                  <td>
                    {p.isAnomalous ? (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <AlertTriangle size={14} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                            Unusual Payment Pattern
                          </div>
                          <div style={{ fontSize: '11px', color: '#7f1d1d', lineHeight: 1.3 }}>
                            {p.anomalyReason}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '12px' }}>
                        <CheckCircle2 size={13} />
                        <span>Standard Milestone Tranche</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
