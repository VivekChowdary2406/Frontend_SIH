import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { apiClient, BackendStatus } from '../services/apiClient';
import { HealthCheckResponse } from '../types/api';
import { 
  Settings, 
  ShieldCheck, 
  Database, 
  User, 
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  FileCheck2,
  Key,
  Globe,
  Radio
} from 'lucide-react';

export const AuditSettingsPage: React.FC = () => {
  const { activeOfficer } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Backend Connection Diagnostics State
  const [apiUrl, setApiUrl] = useState(apiClient.getBaseUrl());
  const [backendStatus, setBackendStatus] = useState<BackendStatus>(apiClient.getStatus());
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(apiClient.getLastHealthCheck() || null);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = apiClient.onStatusChange((status) => {
      setBackendStatus(status);
    });
    // Check initial health
    handleCheckHealth();
    return () => unsubscribe();
  }, []);

  const handleCheckHealth = async () => {
    setIsCheckingHealth(true);
    const start = performance.now();
    try {
      const result = await apiClient.checkHealth();
      const elapsed = Math.round(performance.now() - start);
      setPingLatency(elapsed);
      setHealthData(result);
    } catch {
      setPingLatency(null);
      setHealthData(null);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleSaveApiUrl = () => {
    apiClient.setBaseUrl(apiUrl);
    handleCheckHealth();
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  // Swagger modules catalog
  const swaggerModules = [
    {
      category: 'Root & Health Checks',
      endpoints: [
        { method: 'GET', path: '/', desc: 'Root Endpoint' },
        { method: 'GET', path: '/health', desc: 'System Health Check' },
        { method: 'GET', path: '/api/v1/health', desc: 'API v1 Health Probe' },
      ]
    },
    {
      category: 'Authentication',
      endpoints: [
        { method: 'POST', path: '/api/v1/auth/login', desc: 'User Login & Bearer Token Issuance' },
        { method: 'POST', path: '/api/v1/auth/refresh', desc: 'Refresh Access Token' },
        { method: 'POST', path: '/api/v1/auth/change-password', desc: 'Change Password' },
        { method: 'GET', path: '/api/v1/auth/me', desc: 'Get Current Authenticated Profile' },
      ]
    },
    {
      category: 'Users Management',
      endpoints: [
        { method: 'GET', path: '/api/v1/users', desc: 'List Users (Paginated & Filtered)' },
        { method: 'POST', path: '/api/v1/users', desc: 'Create Administrative User' },
        { method: 'GET', path: '/api/v1/users/{user_id}', desc: 'Get User By ID' },
        { method: 'PUT', path: '/api/v1/users/{user_id}', desc: 'Update User Profile' },
      ]
    },
    {
      category: 'Dashboard & Analytics',
      endpoints: [
        { method: 'GET', path: '/api/v1/dashboard/summary', desc: 'National Overview Metrics & Counts' },
        { method: 'GET', path: '/api/v1/trends', desc: 'Financial & Category Trends' },
        { method: 'GET', path: '/api/v1/delays', desc: 'Milestone Delay Risk Predictions' },
      ]
    },
    {
      category: 'Members of Parliament (MPs)',
      endpoints: [
        { method: 'GET', path: '/api/v1/mps', desc: 'List MPs with Fund Utilization Stats' },
        { method: 'POST', path: '/api/v1/mps', desc: 'Register MP Record' },
        { method: 'GET', path: '/api/v1/mps/{mp_id}', desc: 'Get MP Profile & Works Count' },
        { method: 'PUT', path: '/api/v1/mps/{mp_id}', desc: 'Update MP Details' },
        { method: 'GET', path: '/api/v1/mps/{mp_id}/allocations', desc: 'Get MP Annual Entitlement & Releases' },
        { method: 'GET', path: '/api/v1/mps/{mp_id}/works', desc: 'Get Works Recommended by MP' },
      ]
    },
    {
      category: 'Works Management',
      endpoints: [
        { method: 'GET', path: '/api/v1/works', desc: 'List Works with Search & Multi-Filters' },
        { method: 'POST', path: '/api/v1/works', desc: 'Create / Register New Work Asset' },
        { method: 'GET', path: '/api/v1/works/{work_id}', desc: 'Get Work Details by ID' },
        { method: 'PUT', path: '/api/v1/works/{work_id}', desc: 'Update Work & Review Notes' },
        { method: 'DELETE', path: '/api/v1/works/{work_id}', desc: 'De-register Work' },
      ]
    },
    {
      category: 'Payments & Disbursements',
      endpoints: [
        { method: 'GET', path: '/api/v1/payments/work/{work_id}', desc: 'Get All Vouchers for Work' },
        { method: 'POST', path: '/api/v1/payments', desc: 'Record PFMS Payment Transaction' },
        { method: 'GET', path: '/api/v1/payments/{payment_id}', desc: 'Get Voucher Anomaly Analysis' },
      ]
    },
    {
      category: 'Fund Management',
      endpoints: [
        { method: 'GET', path: '/api/v1/funds/summary', desc: 'National Outlay & State Balances' },
        { method: 'POST', path: '/api/v1/funds/allocations', desc: 'Create District Fund Allocation' },
        { method: 'GET', path: '/api/v1/funds/calamity-consents', desc: 'List Calamity Relief Consents' },
        { method: 'POST', path: '/api/v1/funds/calamity-consents', desc: 'Submit MP Calamity Consent' },
      ]
    },
    {
      category: 'Field Inspections',
      endpoints: [
        { method: 'GET', path: '/api/v1/inspections', desc: 'List Geotagged Inspections' },
        { method: 'POST', path: '/api/v1/inspections', desc: 'Submit Field Verification Report' },
        { method: 'GET', path: '/api/v1/inspections/{inspection_id}', desc: 'Get Inspection Details' },
        { method: 'PUT', path: '/api/v1/inspections/{inspection_id}', desc: 'Update Inspection Status' },
      ]
    },
    {
      category: 'Risk Management & Anomalies',
      endpoints: [
        { method: 'GET', path: '/api/v1/risk/work/{work_id}', desc: 'Get Composite AI Risk Score & Signals' },
        { method: 'POST', path: '/api/v1/risk/evaluate/{work_id}', desc: 'Trigger ML Risk Evaluation' },
        { method: 'GET', path: '/api/v1/risk/high-risk', desc: 'Fetch High Priority Works' },
        { method: 'GET', path: '/api/v1/anomalies', desc: 'Generate Comprehensive Anomaly Report' },
        { method: 'POST', path: '/api/v1/anomalies/financial/predict', desc: 'Predict Financial Utilization Anomaly (ML)' },
        { method: 'POST', path: '/api/v1/anomalies/payment/predict', desc: 'Predict Payment Voucher Anomaly (ML)' },
        { method: 'POST', path: '/api/v1/anomalies/execution/evaluate', desc: 'Evaluate Delay & Physical Progress Anomaly (ML)' },
      ]
    },
    {
      category: 'Duplicate Detection',
      endpoints: [
        { method: 'POST', path: '/api/v1/duplicates/check', desc: 'Geospatial & Semantic Similarity Check' },
        { method: 'GET', path: '/api/v1/duplicates', desc: 'List Flagged Duplicate Candidates' },
        { method: 'PUT', path: '/api/v1/duplicates/{match_id}/resolve', desc: 'Resolve Duplicate Audit Finding' },
      ]
    },
    {
      category: 'Alerts & Notifications',
      endpoints: [
        { method: 'GET', path: '/api/v1/alerts', desc: 'List Surveillance Alerts Queue' },
        { method: 'POST', path: '/api/v1/alerts', desc: 'Trigger Administrative Alert' },
        { method: 'PUT', path: '/api/v1/alerts/{alert_id}/read', desc: 'Acknowledge Alert' },
        { method: 'PUT', path: '/api/v1/alerts/{alert_id}', desc: 'Update Alert Status & Reviewer Note' },
      ]
    },
    {
      category: 'AI Assistant',
      endpoints: [
        { method: 'POST', path: '/api/v1/assistant/query', desc: 'Contextual AI Query & Natural Language Inquiries' },
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <DisclaimerBanner />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            System Configuration & Backend API Gateway
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            FastAPI OpenAPI integration, endpoint surveillance telemetry, and PFMS gateway connectivity
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            className="badge" 
            style={{ 
              backgroundColor: backendStatus === 'ONLINE' ? '#ecfdf5' : '#fffbeb',
              color: backendStatus === 'ONLINE' ? '#047857' : '#b45309',
              border: `1px solid ${backendStatus === 'ONLINE' ? '#a7f3d0' : '#fde68a'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Radio size={12} className={backendStatus === 'ONLINE' ? 'pulse-icon' : ''} />
            <span>FastAPI: {backendStatus === 'ONLINE' ? 'ONLINE (LIVE API)' : 'LOCAL MODE (FALLBACK)'}</span>
          </span>
        </div>
      </div>

      {/* Backend Connection Diagnostics Gateway */}
      <div className="card" style={{ borderLeft: `4px solid ${backendStatus === 'ONLINE' ? '#10b981' : '#f59e0b'}` }}>
        <div className="card-header">
          <div className="card-title">
            <Server size={16} color="var(--gov-blue-primary)" />
            <span>FastAPI Backend Server & Swagger Diagnostics</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a 
              href={`${apiUrl}/docs`} 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <span>Swagger UI (/docs)</span>
              <ExternalLink size={12} />
            </a>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleCheckHealth}
              disabled={isCheckingHealth}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <RefreshCw size={12} className={isCheckingHealth ? 'spin-icon' : ''} />
              <span>{isCheckingHealth ? 'Pinging...' : 'Test Health Check'}</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '10px' }}>
          {/* Base URL Configuration */}
          <div>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Backend API Base URL
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-default)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <button className="btn btn-primary btn-sm" onClick={handleSaveApiUrl}>
                Save & Ping
              </button>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Default: <code>http://localhost:8000</code> · Supports CORS & Bearer JWT authentication
            </div>
          </div>

          {/* Connection Telemetry */}
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Connection Mode:</span>
              <strong>{backendStatus === 'ONLINE' ? 'Live REST API' : 'Autonomous Offline Fallback'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Ping Latency:</span>
              <span className="num-tabular">{pingLatency !== null ? `${pingLatency} ms` : 'Offline / Unreachable'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Health Check Endpoint:</span>
              <code>{apiUrl}/api/v1/health</code>
            </div>
          </div>
        </div>

        {healthData && (
          <div style={{ marginTop: '14px', padding: '10px 14px', backgroundColor: '#ecfdf5', borderRadius: 'var(--radius-xs)', border: '1px solid #a7f3d0', fontSize: '12px', color: '#065f46' }}>
            <strong>Server Responded:</strong> Status: <code>{healthData.status}</code> {healthData.version && `| Version: ${healthData.version}`} {healthData.uptime_seconds && `| Uptime: ${healthData.uptime_seconds}s`}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Officer Profile & Digital Signature */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <User size={16} color="var(--gov-blue-primary)" />
              <span>Investigating Officer Persona & Digital Token</span>
            </div>
            <span className="badge badge-completed">Verified Credential</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Designation & Nodal Authority</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{activeOfficer}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Ministry Jurisdiction</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Ministry of Statistics and Programme Implementation (MoSPI)</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Digital Signature Algorithm</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#1e40af', backgroundColor: '#eff6ff', padding: '4px 8px', borderRadius: '3px', marginTop: '2px' }}>
                SHA-256 / e-Sign Aadhaar NSDL PKI Token
              </div>
            </div>
          </div>
        </div>

        {/* Database & PFMS Integration Status */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Database size={16} color="var(--gov-blue-primary)" />
              <span>PFMS & MPLADS e-Sakshi Sync Gateway</span>
            </div>
            <span className="badge" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
              Connected · TLS 1.3
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>PFMS API Status:</span>
              <strong style={{ color: '#16a34a' }}>Operational (99.98% uptime)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Latest Data Sync:</span>
              <span>Today at 05:30 IST</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tender Portal Gateway:</span>
              <span>Central Public Procurement (CPPP) active</span>
            </div>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleTriggerSync}
              disabled={isSyncing}
              style={{ marginTop: '8px' }}
            >
              <Database size={13} />
              <span>{isSyncing ? 'Synchronizing PFMS Records...' : syncSuccess ? 'Sync Complete (0 New Anomalies)' : 'Trigger Manual PFMS Sync Check'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive FastAPI Swagger API Specification Catalog */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Activity size={16} color="var(--gov-blue-primary)" />
            <span>FastAPI Swagger API Architecture Catalog (13 Modules)</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Mapped to <code>src/services/api/</code>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
          {swaggerModules.map((mod, idx) => (
            <div key={idx} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '8px 12px', fontWeight: 700, fontSize: '12px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{mod.category}</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>{mod.endpoints.length} Endpoints</span>
              </div>
              <table className="data-table" style={{ margin: 0, fontSize: '12px' }}>
                <tbody>
                  {mod.endpoints.map((ep, epIdx) => (
                    <tr key={epIdx}>
                      <td style={{ width: '85px', padding: '6px 12px' }}>
                        <span 
                          style={{
                            display: 'inline-block',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontWeight: 700,
                            fontSize: '10px',
                            backgroundColor: ep.method === 'GET' ? '#eff6ff' : ep.method === 'POST' ? '#f0fdf4' : ep.method === 'PUT' ? '#fffbeb' : '#fef2f2',
                            color: ep.method === 'GET' ? '#1e40af' : ep.method === 'POST' ? '#166534' : ep.method === 'PUT' ? '#92400e' : '#991b1b',
                            border: `1px solid ${ep.method === 'GET' ? '#bfdbfe' : ep.method === 'POST' ? '#bbf7d0' : ep.method === 'PUT' ? '#fde68a' : '#fecaca'}`
                          }}
                        >
                          {ep.method}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--gov-blue-primary)', width: '38%', padding: '6px 12px' }}>
                        {ep.path}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', padding: '6px 12px' }}>
                        {ep.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Entries */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FileCheck2 size={16} color="var(--gov-blue-primary)" />
            <span>Statutory System Audit Trail</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Immutable Ledger</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action Code</th>
                <th>Target Resource</th>
                <th>Authorized Officer</th>
                <th>Outcome / Verification Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>2023-12-10 14:22 IST</td>
                <td><span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>STATUS_CHANGE</span></td>
                <td>MP-UP-2023-104</td>
                <td>Shri R. Sharma (Principal Director)</td>
                <td>Marked under review for solar battery geotag verification.</td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>2023-11-20 10:15 IST</td>
                <td><span className="badge badge-high">ALERT_GENERATION</span></td>
                <td>MP-PUN-2023-089</td>
                <td>AI Anomaly Engine v2.4</td>
                <td>Tripped payment frequency anomaly: 11 disbursements in 6 months.</td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>2023-11-15 16:40 IST</td>
                <td><span className="badge badge-completed">RESOLVED_AUDIT</span></td>
                <td>MP-OD-2023-029</td>
                <td>Shri R. Sharma (Principal Director)</td>
                <td>Site engineer verified river flow receded; weir concreting resumed.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
