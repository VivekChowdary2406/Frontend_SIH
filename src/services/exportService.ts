import { Work } from '../types/work';
import { PaymentTransaction } from '../types/payment';

export const exportService = {
  printInvestigationDossier(work: Work, payments: PaymentTransaction[]) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocker prevented opening print window. Please allow pop-ups for this site.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Investigation Dossier - ${work.workId}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #0f172a; padding: 40px; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 20px; font-weight: 700; margin: 0; color: #1e3a8a; }
          .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          .disclaimer { background: #fef2f2; border: 1px solid #fecaca; padding: 12px; font-size: 12px; color: #991b1b; border-radius: 4px; margin-bottom: 24px; }
          .section-title { font-size: 15px; font-weight: 700; text-transform: uppercase; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px; margin-bottom: 12px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; font-size: 13px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 4px; }
          .metric-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; }
          .metric-val { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          th { background: #f1f5f9; font-weight: 600; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
          .badge-high { background: #fee2e2; color: #991b1b; }
          .badge-medium { background: #fef3c7; color: #92400e; }
          .badge-low { background: #d1fae5; color: #065f46; }
          @media print {
            body { padding: 20px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div style="font-size: 12px; font-weight: 700; color: #d97706; text-transform: uppercase; letter-spacing: 0.05em;">Government of India · Ministry of Statistics & Programme Implementation</div>
            <h1 class="title">MPLADS AI-Assisted Investigation Dossier</h1>
            <div class="subtitle">Confidential Document for Internal Administrative Review Only · Generated on ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: 700;">${work.workId}</div>
            <span class="badge ${work.finalRiskLevel === 'HIGH' ? 'badge-high' : work.finalRiskLevel === 'MEDIUM' ? 'badge-medium' : 'badge-low'}">
              ${work.finalRiskLevel} RISK (${work.finalRiskScore}/100)
            </span>
          </div>
        </div>

        <div class="disclaimer">
          <strong>LEGAL & REGULATORY NOTICE:</strong> This document contains AI-generated risk signals and statistical deviation analyses. AI signals are intended solely to support human review by competent authorities and do not constitute proof of fraud or administrative wrongdoing. Final audit conclusions rest exclusively with human review authorities.
        </div>

        <div class="section-title">1. Work Metadata</div>
        <div class="grid">
          <div class="box">
            <div class="metric-label">Project Title</div>
            <div style="font-weight: 600; margin-top: 4px;">${work.title}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${work.description}</div>
          </div>
          <div class="box">
            <div class="metric-label">Administrative Attribution</div>
            <div style="font-weight: 600; margin-top: 4px;">MP: ${work.mpName} (${work.house === 'LOK_SABHA' ? 'Lok Sabha' : 'Rajya Sabha'})</div>
            <div>Constituency / State: ${work.constituency}, ${work.state}</div>
            <div>Financial Year: ${work.financialYear} | Category: ${work.category}</div>
          </div>
        </div>

        <div class="section-title">2. Financial & Execution Status</div>
        <div class="grid">
          <div class="box">
            <div class="metric-label">Sanction Amount</div>
            <div class="metric-val">₹${(work.sanctionAmount / 100000).toFixed(2)} Lakhs</div>
          </div>
          <div class="box">
            <div class="metric-label">Expenditure Disbursed</div>
            <div class="metric-val">₹${(work.expenditure / 100000).toFixed(2)} Lakhs (${work.utilizationPercentage.toFixed(1)}%)</div>
          </div>
          <div class="box">
            <div class="metric-label">Sanction Date</div>
            <div class="metric-val">${work.sanctionDate}</div>
          </div>
          <div class="box">
            <div class="metric-label">Predicted Delay Risk</div>
            <div class="metric-val">${work.delayProbability}% Probability</div>
          </div>
        </div>

        <div class="section-title">3. AI Anomaly Breakdown</div>
        <table>
          <thead>
            <tr>
              <th>Risk Signal</th>
              <th>Anomaly Score</th>
              <th>Severity</th>
              <th>Specific Evidence & Variance</th>
              <th>Regulatory Relevance</th>
            </tr>
          </thead>
          <tbody>
            ${work.signals.map(s => `
              <tr>
                <td style="font-weight: 600;">${s.name}</td>
                <td>${s.score} / 100</td>
                <td><span class="badge ${s.severity === 'HIGH' ? 'badge-high' : s.severity === 'MEDIUM' ? 'badge-medium' : 'badge-low'}">${s.severity}</span></td>
                <td>${s.evidence}</td>
                <td>${s.whyItMatters}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">4. Transaction Ledger (${payments.length} Payments)</div>
        <table>
          <thead>
            <tr>
              <th>Voucher ID</th>
              <th>Date</th>
              <th>Vendor</th>
              <th>Amount (₹)</th>
              <th>Stage</th>
              <th>Anomaly Status</th>
            </tr>
          </thead>
          <tbody>
            ${payments.map(p => `
              <tr style="${p.isAnomalous ? 'background: #fff1f2;' : ''}">
                <td>${p.paymentId}</td>
                <td>${p.date}</td>
                <td>${p.vendor}</td>
                <td style="font-weight: 600;">₹${(p.amount / 100000).toFixed(2)}L</td>
                <td>${p.disbursementStage}</td>
                <td>${p.isAnomalous ? `<span class="badge badge-high">${p.anomalyReason || 'Anomaly Flag'}</span>` : '<span class="badge badge-low">Normal</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">5. Reviewer Audit Notes</div>
        <div class="box" style="min-height: 80px;">
          ${work.reviewNotes && work.reviewNotes.length > 0 
            ? work.reviewNotes.map(n => `<div style="margin-bottom: 4px;">• ${n}</div>`).join('')
            : '<div style="color: #94a3b8; font-style: italic;">No audit notes logged yet. Pending human review.</div>'}
        </div>

        <div style="margin-top: 40px; border-top: 1px dashed #cbd5e1; padding-top: 20px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b;">
          <div>Investigating Officer Signature: _______________________</div>
          <div>District Collector / Nodal Authority Stamp: _______________________</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  },

  exportKPIReport(kpis: any) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocker prevented opening print window. Please allow pop-ups for this site.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MPLADS National Overview Summary Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #0f172a; padding: 40px; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 20px; font-weight: 700; margin: 0; color: #1e3a8a; }
          .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          .disclaimer { background: #fef2f2; border: 1px solid #fecaca; padding: 12px; font-size: 12px; color: #991b1b; border-radius: 4px; margin-bottom: 24px; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 6px; }
          .metric-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; }
          .metric-val { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 4px; }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div style="font-size: 12px; font-weight: 700; color: #d97706; text-transform: uppercase; letter-spacing: 0.05em;">Government of India · Ministry of Statistics & Programme Implementation</div>
            <h1 class="title">MPLADS National Monitoring & Anomaly Summary</h1>
            <div class="subtitle">Generated on ${new Date().toLocaleDateString('en-IN')} · AI-Assisted Oversight System</div>
          </div>
        </div>

        <div class="disclaimer">
          <strong>GOVERNANCE NOTICE:</strong> AI-generated indicators highlight statistical deviations across MPLADS works. These insights are intended solely to support oversight by authorized officials.
        </div>

        <div class="grid">
          <div class="box">
            <div class="metric-label">Total Tracked Works</div>
            <div class="metric-val">${kpis?.totalWorks?.toLocaleString('en-IN') || '1,248'}</div>
          </div>
          <div class="box">
            <div class="metric-label">Total Sanctioned</div>
            <div class="metric-val">₹${((kpis?.totalSanctionedAmount || 18420000000) / 10000000).toFixed(1)} Cr</div>
          </div>
          <div class="box">
            <div class="metric-label">Total Disbursed</div>
            <div class="metric-val">₹${((kpis?.totalExpenditure || 12060000000) / 10000000).toFixed(1)} Cr (${(kpis?.overallUtilizationRate || 65.5).toFixed(1)}%)</div>
          </div>
          <div class="box">
            <div class="metric-label">High Priority Works</div>
            <div class="metric-val" style="color: #b91c1c;">${kpis?.highRiskWorksCount || 14} Works</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
};
