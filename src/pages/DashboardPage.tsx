import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { dashboardService } from '../services/api/dashboardService';
import IndiaMapData from '@svg-maps/india';
import { 
  Users, 
  FileText, 
  Check, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar, 
  Download, 
  ShieldCheck, 
  X, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { navigateToWork, setCurrentRoute } = useApp();
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [chartStateFilter, setChartStateFilter] = useState('ALL');
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // High-level KPI metrics matching screenshot exactly
  const [kpiData, setKpiData] = useState({
    totalMPs: 543,
    totalWorks: 1248,
    totalSanctionedCr: '1,842',
    totalExpenditureCr: '1,206',
    utilizationRate: 65,
    completedWorks: 721,
    completedPercent: 58,
    ongoingWorks: 459,
    ongoingPercent: 37,
    highRiskWorks: 68,
    mediumRiskWorks: 174,
    lowRiskWorks: 1006,
  });

  // Silently enrich with live backend summary if FastAPI is running
  useEffect(() => {
    dashboardService.getSummary()
      .then(live => {
        if (!live) return;
        setKpiData(prev => ({
          ...prev,
          totalWorks: live.total_works ?? prev.totalWorks,
          totalSanctionedCr: live.total_sanctioned_amount 
            ? (live.total_sanctioned_amount / 10000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
            : prev.totalSanctionedCr,
          totalExpenditureCr: live.total_expenditure 
            ? (live.total_expenditure / 10000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
            : prev.totalExpenditureCr,
          utilizationRate: live.utilization_rate ? Math.round(live.utilization_rate) : prev.utilizationRate,
          totalMPs: live.total_mps ?? prev.totalMPs,
          completedWorks: live.works_by_status?.completed ?? prev.completedWorks,
          ongoingWorks: live.works_by_status?.ongoing ?? prev.ongoingWorks,
          highRiskWorks: live.works_by_risk?.high ?? prev.highRiskWorks,
        }));
      })
      .catch(() => {});
  }, []);

  // Dual Bar Chart Data: Sanctioned vs Expenditure (Apr - Sep) matching screenshot
  const monthlyComparison = [
    { month: 'Apr', sanctioned: 185, expenditure: 140 },
    { month: 'May', sanctioned: 230, expenditure: 175 },
    { month: 'Jun', sanctioned: 215, expenditure: 190 },
    { month: 'Jul', sanctioned: 280, expenditure: 228 },
    { month: 'Aug', sanctioned: 265, expenditure: 205 },
    { month: 'Sep', sanctioned: 320, expenditure: 250 },
  ];

  // Top 5 Expenditure by State matching screenshot
  const stateExpenditure = [
    { state: 'Uttar Pradesh', amount: 420, percent: 100, color: '#176b52' },
    { state: 'Maharashtra', amount: 310, percent: 74, color: '#1f8a6b' },
    { state: 'Rajasthan', amount: 220, percent: 52, color: '#38a183' },
    { state: 'Madhya Pradesh', amount: 180, percent: 43, color: '#56b69c' },
    { state: 'Bihar', amount: 150, percent: 36, color: '#80ceb8' },
  ];

  // Canonical 5 High-Risk Works from screenshot
  const canonicalHighRiskWorks = [
    {
      workId: 'WS/UP/2025/001',
      title: 'Village Road Construction',
      mp: 'R. Sharma',
      state: 'Uttar Pradesh',
      sanctionAmount: '₹10.00 L',
      expenditure: '₹8.70 L',
      score: 82,
      level: 'High',
      reason: 'Unusual payment pattern'
    },
    {
      workId: 'WS/MH/2025/045',
      title: 'Primary School Building',
      mp: 'S. Patil',
      state: 'Maharashtra',
      sanctionAmount: '₹25.00 L',
      expenditure: '₹23.10 L',
      score: 79,
      level: 'High',
      reason: 'High delay probability'
    },
    {
      workId: 'WS/RJ/2025/078',
      title: 'Water Supply Scheme',
      mp: 'K. Meena',
      state: 'Rajasthan',
      sanctionAmount: '₹15.00 L',
      expenditure: '₹13.20 L',
      score: 76,
      level: 'High',
      reason: 'Unusual expenditure'
    },
    {
      workId: 'WS/MP/2025/102',
      title: 'Community Health Centre',
      mp: 'P. Verma',
      state: 'Madhya Pradesh',
      sanctionAmount: '₹20.00 L',
      expenditure: '₹18.50 L',
      score: 74,
      level: 'High',
      reason: 'Execution anomaly'
    },
    {
      workId: 'WS/BR/2025/210',
      title: 'Drainage Improvement',
      mp: 'A. Kumar',
      state: 'Bihar',
      sanctionAmount: '₹12.00 L',
      expenditure: '₹10.90 L',
      score: 72,
      level: 'High',
      reason: 'Potential duplicate'
    }
  ];

  // Map state fill color helper matching screenshot density legend
  const getChoroplethColor = (stateName: string) => {
    const s = stateName.toLowerCase();
    if (s.includes('uttar pradesh') || s.includes('up')) return '#11271e'; // > 300
    if (s.includes('maharashtra') || s.includes('mh')) return '#176b52'; // 201 - 300
    if (s.includes('rajasthan') || s.includes('madhya pradesh') || s.includes('bihar') || s.includes('karnataka')) return '#38a183'; // 101 - 200
    if (s.includes('gujarat') || s.includes('tamil nadu') || s.includes('west bengal') || s.includes('andhra')) return '#80ceb8'; // 50 - 100
    return '#d1fae5'; // <= 50
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Title & Action Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#176b52', textTransform: 'uppercase', marginBottom: '2px' }}>
            NATIONAL OVERVIEW
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#16251f', fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>
            MPLADS Monitoring Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#647b70', marginTop: '4px' }}>
            AI-assisted monitoring to identify unusual patterns for human review.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#647b70' }}>
            <Calendar size={15} color="#647b70" />
            <div>
              <div style={{ fontSize: '10px', color: '#8fa59b', lineHeight: 1 }}>Last updated</div>
              <div style={{ fontWeight: 600, color: '#16251f', marginTop: '2px' }}>14 Aug 2026, 10:24 AM</div>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#11271e',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(17,39,30,0.15)'
            }}
          >
            <Download size={14} />
            <span>Export report</span>
          </button>
        </div>
      </div>

      {/* Disclaimer Banner matching screenshot */}
      {showDisclaimer && (
        <div
          style={{
            backgroundColor: '#eaf5ee',
            border: '1px solid #cce8d5',
            borderRadius: '8px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '12.5px',
            color: '#16251f'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                backgroundColor: '#176b52', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0 
              }}
            >
              <Check size={12} color="#ffffff" strokeWidth={3} />
            </div>
            <span>
              <strong>This system highlights works and payments that show unusual patterns.</strong> It does not establish wrongdoing. All findings require human review.
            </span>
          </div>

          <button 
            onClick={() => setShowDisclaimer(false)}
            style={{ border: 'none', background: 'transparent', color: '#657b70', cursor: 'pointer', padding: '2px' }}
            title="Dismiss notice"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top 6 KPI Metric Cards matching screenshot */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', 
          gap: '14px' 
        }}
      >
        {/* Card 1: Total MPs */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} color="#0284c7" />
            </div>
            <div style={{ fontSize: '12px', color: '#647b70', fontWeight: 500 }}>Total MPs</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#16251f', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
            {kpiData.totalMPs}
          </div>
          <div style={{ fontSize: '11px', color: '#647b70' }}>
            Across both Houses
          </div>
        </div>

        {/* Card 2: Total works */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={16} color="#2563eb" />
            </div>
            <div style={{ fontSize: '12px', color: '#647b70', fontWeight: 500 }}>Total works</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#16251f', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
            {kpiData.totalWorks.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span>↑ +32 this quarter</span>
          </div>
        </div>

        {/* Card 3: Total sanctioned */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#16a34a', fontSize: '16px' }}>
              ₹
            </div>
            <div style={{ fontSize: '12px', color: '#647b70', fontWeight: 500 }}>Total sanctioned</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#16251f', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
            ₹{kpiData.totalSanctionedCr} Cr
          </div>
          <div style={{ fontSize: '11px', color: '#647b70' }}>
            FY 2025–26
          </div>
        </div>

        {/* Card 4: Total expenditure */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '14px', height: '14px', border: '2px solid #0891b2', borderRadius: '3px' }} />
            </div>
            <div style={{ fontSize: '12px', color: '#647b70', fontWeight: 500 }}>Total expenditure</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#16251f', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
            ₹{kpiData.totalExpenditureCr} Cr
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '11px', color: '#647b70' }}>
              {kpiData.utilizationRate}% utilization
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${kpiData.utilizationRate}%`, height: '100%', backgroundColor: '#176b52', borderRadius: '2px' }} />
            </div>
          </div>
        </div>

        {/* Card 5: Completed works */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={16} color="#16a34a" strokeWidth={3} />
            </div>
            <div style={{ fontSize: '12px', color: '#647b70', fontWeight: 500 }}>Completed works</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#16251f', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
            {kpiData.completedWorks}
          </div>
          <div style={{ fontSize: '11px', color: '#647b70' }}>
            {kpiData.completedPercent}% of total
          </div>
        </div>

        {/* Card 6: Ongoing works */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} color="#0284c7" />
            </div>
            <div style={{ fontSize: '12px', color: '#647b70', fontWeight: 500 }}>Ongoing works</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#16251f', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
            {kpiData.ongoingWorks}
          </div>
          <div style={{ fontSize: '11px', color: '#647b70' }}>
            {kpiData.ongoingPercent}% of total
          </div>
        </div>
      </div>

      {/* Row 2: 3 Risk Status Cards matching screenshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {/* High Risk */}
        <div 
          style={{ 
            backgroundColor: '#fff5f5', 
            border: '1px solid #fecaca', 
            borderRadius: '8px', 
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(19,47,34,0.03)'
          }}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={20} color="#dc2626" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#991b1b' }}>High-risk works</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#dc2626', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums lining-nums', lineHeight: 1.1, marginTop: '2px' }}>
              {kpiData.highRiskWorks}
            </div>
            <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '2px' }}>Requires review</div>
          </div>
        </div>

        {/* Medium Risk */}
        <div 
          style={{ 
            backgroundColor: '#fffbeb', 
            border: '1px solid #fef08a', 
            borderRadius: '8px', 
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(19,47,34,0.03)'
          }}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, color: '#d97706', fontSize: '16px' }}>
            !
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#92400e' }}>Medium-risk works</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#d97706', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums lining-nums', lineHeight: 1.1, marginTop: '2px' }}>
              {kpiData.mediumRiskWorks}
            </div>
            <div style={{ fontSize: '11px', color: '#b45309', marginTop: '2px' }}>Monitor closely</div>
          </div>
        </div>

        {/* Low Risk */}
        <div 
          style={{ 
            backgroundColor: '#f2fbf5', 
            border: '1px solid #bbf7d0', 
            borderRadius: '8px', 
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(19,47,34,0.03)'
          }}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Check size={20} color="#16a34a" strokeWidth={3} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#166534' }}>Low-risk works</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums lining-nums', lineHeight: 1.1, marginTop: '2px' }}>
              {kpiData.lowRiskWorks.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#166534', marginTop: '2px' }}>No immediate action</div>
          </div>
        </div>
      </div>

      {/* Row 3: Middle 3 Analytics Charts matching screenshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '14px' }}>
        
        {/* 1. Sanctioned vs Expenditure Double Bar Chart (5 cols) */}
        <div className="card" style={{ gridColumn: 'span 5', padding: '18px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#16251f' }}>
                Sanctioned vs Expenditure
              </div>
              <div style={{ fontSize: '11px', color: '#647b70', marginTop: '2px' }}>
                Financial year 2025–26 · Amount in ₹ crore
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <select 
                value={chartStateFilter}
                onChange={(e) => setChartStateFilter(e.target.value)}
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#16251f',
                  border: '1px solid #dfe7e2',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">All states</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>
          </div>

          {/* SVG Double Bar Chart matching screenshot */}
          <div style={{ flex: 1, minHeight: '190px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', height: '150px', alignItems: 'flex-end', borderBottom: '1px solid #dfe7e2', paddingBottom: '4px', gap: '8px', position: 'relative' }}>
              {/* Y Axis Guide Lines */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, borderTop: '1px dashed #edf2ef', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: '25%', borderTop: '1px dashed #edf2ef', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '1px dashed #edf2ef', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: '75%', borderTop: '1px dashed #edf2ef', pointerEvents: 'none' }} />

              {/* Y Axis labels */}
              <div style={{ width: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', fontSize: '9px', color: '#8fa59b', textAlign: 'right', paddingRight: '6px' }}>
                <span>400</span>
                <span>300</span>
                <span>200</span>
                <span>100</span>
                <span>0</span>
              </div>

              {/* Bars per Month */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%', zIndex: 1 }}>
                {monthlyComparison.map((m) => {
                  const maxH = 400;
                  const hSanctioned = (m.sanctioned / maxH) * 100;
                  const hExpenditure = (m.expenditure / maxH) * 100;
                  return (
                    <div 
                      key={m.month}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}
                      onMouseEnter={() => setHoveredMonth(m.month)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '100%' }}>
                        {/* Sanctioned (Mint Green) */}
                        <div 
                          style={{
                            width: '14px',
                            height: `${hSanctioned}%`,
                            backgroundColor: '#a7f3d0',
                            borderRadius: '3px 3px 0 0',
                            transition: 'all 0.2s ease',
                            boxShadow: hoveredMonth === m.month ? '0 0 6px rgba(167,243,208,0.8)' : 'none'
                          }}
                          title={`${m.month} Sanctioned: ₹${m.sanctioned} Cr`}
                        />
                        {/* Expenditure (Dark Forest Green) */}
                        <div 
                          style={{
                            width: '14px',
                            height: `${hExpenditure}%`,
                            backgroundColor: '#176b52',
                            borderRadius: '3px 3px 0 0',
                            transition: 'all 0.2s ease',
                            boxShadow: hoveredMonth === m.month ? '0 0 6px rgba(23,107,82,0.8)' : 'none'
                          }}
                          title={`${m.month} Expenditure: ₹${m.expenditure} Cr`}
                        />
                      </div>
                      <span style={{ fontSize: '10px', color: '#647b70', fontWeight: 500 }}>{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend at bottom */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', marginTop: '12px', fontSize: '11px', color: '#16251f' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a7f3d0' }} />
                <span>Sanctioned</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#176b52' }} />
                <span>Expenditure</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Risk Distribution Donut Chart (3 cols) */}
        <div className="card" style={{ gridColumn: 'span 3', padding: '18px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#16251f' }}>
              Risk distribution
            </div>
            <div style={{ fontSize: '11px', color: '#647b70', marginTop: '2px' }}>
              Across all monitored works
            </div>
          </div>

          {/* SVG Donut Chart with Center Label and Legend matching screenshot */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                {/* Low Risk: 81% - emerald green */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#176b52"
                  strokeWidth="4.5"
                  strokeDasharray="81 100"
                  strokeDashoffset="0"
                />
                {/* Medium Risk: 14% - amber */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#eab308"
                  strokeWidth="4.5"
                  strokeDasharray="14 100"
                  strokeDashoffset="-81"
                />
                {/* High Risk: 5% - red */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#dc2626"
                  strokeWidth="4.5"
                  strokeDasharray="5 100"
                  strokeDashoffset="-95"
                />
              </svg>

              {/* Donut Center Label */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#16251f', lineHeight: 1 }}>
                  1,248
                </div>
                <div style={{ fontSize: '9px', color: '#647b70', marginTop: '2px' }}>
                  works
                </div>
              </div>
            </div>

            {/* Right Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#dc2626' }} />
                <span style={{ color: '#16251f' }}>High</span>
                <span style={{ fontWeight: 600, color: '#16251f', marginLeft: 'auto' }}>68 (5%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                <span style={{ color: '#16251f' }}>Medium</span>
                <span style={{ fontWeight: 600, color: '#16251f', marginLeft: 'auto' }}>174 (14%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#176b52' }} />
                <span style={{ color: '#16251f' }}>Low</span>
                <span style={{ fontWeight: 600, color: '#16251f', marginLeft: 'auto' }}>1,006 (81%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Expenditure by state Horizontal Bars (4 cols) */}
        <div className="card" style={{ gridColumn: 'span 4', padding: '18px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#16251f' }}>
                Expenditure by state
              </div>
              <div style={{ fontSize: '11px', color: '#647b70', marginTop: '2px' }}>
                Top 5 states · Amount in ₹ crore
              </div>
            </div>

            <div style={{ fontSize: '11px', fontWeight: 500, color: '#16251f', border: '1px solid #dfe7e2', borderRadius: '6px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Top 5</span>
              <ChevronDown size={12} />
            </div>
          </div>

          {/* Horizontal Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
            {stateExpenditure.map((item) => (
              <div key={item.state} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '92px', fontSize: '11px', fontWeight: 500, color: '#16251f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.state}
                </div>
                <div style={{ flex: 1, height: '14px', backgroundColor: '#f1f5f3', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${item.percent}%`, 
                      height: '100%', 
                      backgroundColor: item.color, 
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }} 
                  />
                </div>
                <div style={{ width: '28px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#16251f' }}>
                  {item.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Bottom Section (High-risk works Table + Works by state India Map) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '14px', alignItems: 'start' }}>
        
        {/* Left: High-risk works table (8 cols) */}
        <div className="card" style={{ gridColumn: 'span 8', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#16251f' }}>
                High-risk works
              </div>
              <div style={{ fontSize: '11px', color: '#647b70', marginTop: '2px' }}>
                Works with highest risk scores
              </div>
            </div>

            <button
              onClick={() => setCurrentRoute('risk-monitoring')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid #dfe7e2',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#16251f',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <span>View all</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #dfe7e2', color: '#647b70', textAlign: 'left', fontWeight: 600 }}>
                  <th style={{ padding: '8px 6px', fontWeight: 600 }}>Work ID</th>
                  <th style={{ padding: '8px 6px', fontWeight: 600 }}>Work title</th>
                  <th style={{ padding: '8px 6px', fontWeight: 600 }}>MP</th>
                  <th style={{ padding: '8px 6px', fontWeight: 600 }}>State</th>
                  <th style={{ padding: '8px 6px', fontWeight: 600 }}>Sanction amount</th>
                  <th style={{ padding: '8px 6px', fontWeight: 600 }}>Expenditure</th>
                  <th style={{ padding: '8px 6px', fontWeight: 600 }}>Risk score</th>
                  <th style={{ padding: '8px 6px', fontWeight: 600 }}>Risk level</th>
                  <th style={{ padding: '8px 6px', fontWeight: 600 }}>Main reason</th>
                </tr>
              </thead>
              <tbody>
                {canonicalHighRiskWorks.map((work) => (
                  <tr 
                    key={work.workId}
                    onClick={() => navigateToWork(work.workId)}
                    style={{ 
                      borderBottom: '1px solid #f1f5f3', 
                      cursor: 'pointer',
                      transition: 'background-color 0.12s ease'
                    }}
                    className="row-clickable"
                  >
                    <td style={{ padding: '10px 6px', fontWeight: 600, color: '#176b52', fontFamily: 'var(--font-mono)' }}>
                      {work.workId}
                    </td>
                    <td style={{ padding: '10px 6px', fontWeight: 600, color: '#16251f' }}>
                      {work.title}
                    </td>
                    <td style={{ padding: '10px 6px', color: '#3b5046' }}>
                      {work.mp}
                    </td>
                    <td style={{ padding: '10px 6px', color: '#3b5046' }}>
                      {work.state}
                    </td>
                    <td style={{ padding: '10px 6px', color: '#16251f', fontWeight: 500 }}>
                      {work.sanctionAmount}
                    </td>
                    <td style={{ padding: '10px 6px', color: '#16251f', fontWeight: 500 }}>
                      {work.expenditure}
                    </td>
                    <td style={{ padding: '10px 6px', fontWeight: 700, color: '#dc2626' }}>
                      {work.score}
                    </td>
                    <td style={{ padding: '10px 6px' }}>
                      <span 
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          borderRadius: '12px',
                          padding: '2px 8px',
                          fontSize: '10px',
                          fontWeight: 600
                        }}
                      >
                        High
                      </span>
                    </td>
                    <td style={{ padding: '10px 6px', color: '#647b70' }}>
                      {work.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Works by state (India choropleth map) (4 cols) */}
        <div className="card" style={{ gridColumn: 'span 4', padding: '18px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#16251f' }}>
              Works by state
            </div>
            <div style={{ fontSize: '11px', color: '#647b70', marginTop: '2px' }}>
              Total works across India
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            {/* SVG Choropleth Map */}
            <div style={{ flex: 1, maxWidth: '230px' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={IndiaMapData.viewBox || "0 0 612 696"}
                style={{ width: '100%', height: 'auto' }}
              >
                {IndiaMapData.locations.map((loc: any) => {
                  const fill = getChoroplethColor(loc.name);
                  return (
                    <path
                      key={loc.id}
                      d={loc.path}
                      fill={fill}
                      stroke="#ffffff"
                      strokeWidth="1"
                      strokeLinejoin="round"
                      style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                      onClick={() => setCurrentRoute('state-analytics')}
                    >
                      <title>{loc.name}</title>
                    </path>
                  );
                })}
              </svg>
            </div>

            {/* Density Legend matching screenshot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10px', color: '#647b70', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '9px', height: '9px', backgroundColor: '#11271e', borderRadius: '2px' }} />
                <span>&gt; 300</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '9px', height: '9px', backgroundColor: '#176b52', borderRadius: '2px' }} />
                <span>201 – 300</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '9px', height: '9px', backgroundColor: '#38a183', borderRadius: '2px' }} />
                <span>101 – 200</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '9px', height: '9px', backgroundColor: '#80ceb8', borderRadius: '2px' }} />
                <span>50 – 100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '9px', height: '9px', backgroundColor: '#d1fae5', borderRadius: '2px' }} />
                <span>≤ 50</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
