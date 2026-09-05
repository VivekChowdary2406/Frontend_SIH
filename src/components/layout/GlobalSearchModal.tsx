import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { 
  Search, 
  Briefcase, 
  Users, 
  MapPin, 
  ShieldAlert, 
  ArrowRight, 
  X, 
  CheckCircle,
  CornerDownLeft
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isGlobalSearchOpen, 
    setIsGlobalSearchOpen, 
    navigateToWork, 
    navigateToMP, 
    navigateToState, 
    setCurrentRoute 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsGlobalSearchOpen]);

  useEffect(() => {
    if (isGlobalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setSearchTerm('');
    }
  }, [isGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const {
    exactWork,
    matchedWorks,
    matchedMPs,
    matchedStates,
    matchedAlerts
  } = dataService.searchEntities(searchTerm);

  const hasAnyResults = exactWork || matchedWorks.length > 0 || matchedMPs.length > 0 || matchedStates.length > 0 || matchedAlerts.length > 0;

  const handleSelectWork = (workId: string) => {
    setIsGlobalSearchOpen(false);
    navigateToWork(workId);
  };

  const handleSelectMP = (mpId: string) => {
    setIsGlobalSearchOpen(false);
    navigateToMP(mpId);
  };

  const handleSelectState = (stateId: string) => {
    setIsGlobalSearchOpen(false);
    navigateToState(stateId);
  };

  const handleSelectAlert = (workId: string) => {
    setIsGlobalSearchOpen(false);
    navigateToWork(workId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (exactWork) {
        handleSelectWork(exactWork.workId);
      } else if (matchedWorks.length > 0) {
        handleSelectWork(matchedWorks[0].workId);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsGlobalSearchOpen(false)}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-input-row">
          <Search size={18} color="#64748b" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by Work ID (e.g. WS/UP/2025/001), MP, State..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            className="btn-icon" 
            onClick={() => setIsGlobalSearchOpen(false)}
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>

        <div className="search-results-list">
          {searchTerm.trim() === '' ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Universal Government Intelligence Search
              </div>
              <div>Try typing <strong>WS/UP/2025/001</strong>, <strong>Uttar Pradesh</strong>, or <strong>Dr. Anandvardhan Mishra</strong></div>
              <div style={{ marginTop: '12px', fontSize: '11px', color: '#94a3b8' }}>
                Press <kbd style={{ padding: '2px 5px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '3px' }}>ESC</kbd> to close
              </div>
            </div>
          ) : !hasAnyResults ? (
            <div style={{ padding: '28px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
              No matches found for "{searchTerm}". Verify the Work ID or spelling.
            </div>
          ) : (
            <>
              {/* Exact Work ID Recognized Callout */}
              {exactWork && (
                <div 
                  className="search-exact-card"
                  onClick={() => handleSelectWork(exactWork.workId)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="search-exact-icon">
                      <CheckCircle size={16} color="#047857" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="entity-tag entity-tag-work">WORK ID MATCH</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px', color: 'var(--gov-blue-primary)' }}>
                          {exactWork.workId}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                        {exactWork.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {exactWork.state} · MP: {exactWork.mpName} · Sanction: ₹{(exactWork.sanctionAmount / 10000000).toFixed(2)} Cr
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RiskBadge level={exactWork.finalRiskLevel} score={exactWork.finalRiskScore} />
                    <div className="search-enter-badge">
                      <span>Open</span>
                      <CornerDownLeft size={11} />
                    </div>
                  </div>
                </div>
              )}

              {/* Works Section */}
              {matchedWorks.length > 0 && (!exactWork || matchedWorks.length > 1) && (
                <div>
                  <div className="search-group-header">
                    <span>Works Directory ({matchedWorks.length})</span>
                  </div>
                  {matchedWorks.map(w => (
                    <div 
                      key={w.workId} 
                      className="search-result-item"
                      onClick={() => handleSelectWork(w.workId)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <Briefcase size={15} color="var(--gov-blue-primary)" style={{ flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {w.title}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{w.workId}</span> · {w.state} · {w.mpName}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span className="entity-tag entity-tag-work">WORK</span>
                        <RiskBadge level={w.finalRiskLevel} score={w.finalRiskScore} showIcon={false} />
                        <ArrowRight size={13} color="#94a3b8" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MP Profiles Section */}
              {matchedMPs.length > 0 && (
                <div>
                  <div className="search-group-header">
                    <span>Members of Parliament ({matchedMPs.length})</span>
                  </div>
                  {matchedMPs.map(m => (
                    <div 
                      key={m.mpId} 
                      className="search-result-item"
                      onClick={() => handleSelectMP(m.mpId)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <Users size={15} color="#059669" style={{ flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {m.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {m.constituency}, {m.state} · {m.house === 'LOK_SABHA' ? 'Lok Sabha' : 'Rajya Sabha'} · {m.totalWorksCount} Works
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="entity-tag entity-tag-mp">MP PROFILE</span>
                        <ArrowRight size={13} color="#94a3b8" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* States Section */}
              {matchedStates.length > 0 && (
                <div>
                  <div className="search-group-header">
                    <span>States & Union Territories ({matchedStates.length})</span>
                  </div>
                  {matchedStates.map(s => (
                    <div 
                      key={s.stateId} 
                      className="search-result-item"
                      onClick={() => handleSelectState(s.stateId)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <MapPin size={15} color="#d97706" style={{ flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {s.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {s.mpsCount} MPs · {s.totalWorks} Works · {s.utilizationRate.toFixed(1)}% Utilization
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="entity-tag entity-tag-state">STATE</span>
                        <ArrowRight size={13} color="#94a3b8" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Alerts Section */}
              {matchedAlerts.length > 0 && (
                <div>
                  <div className="search-group-header">
                    <span>Investigation Alerts ({matchedAlerts.length})</span>
                  </div>
                  {matchedAlerts.map(a => (
                    <div 
                      key={a.alertId} 
                      className="search-result-item"
                      onClick={() => handleSelectAlert(a.workId)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <ShieldAlert size={15} color="#dc2626" style={{ flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {a.reason}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {a.workId} · {a.workTitle}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="entity-tag entity-tag-alert">ALERT</span>
                        <ArrowRight size={13} color="#94a3b8" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
