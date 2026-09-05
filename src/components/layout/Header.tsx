import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Search, Globe, PanelLeftClose, PanelLeftOpen, Clock } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    setIsGlobalSearchOpen, 
    globalGeographicScope, 
    setGlobalGeographicScope,
    isSidebarCollapsed,
    toggleSidebar
  } = useApp();

  const states = dataService.getStates();

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header 
      className="app-header" 
      role="banner"
      style={{
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #dfe7e2',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}
    >
      {/* Left side: Sidebar Roll Controller & Global Search */}
      <div className="header-left" style={{ flex: 1, maxWidth: '520px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label="Toggle sidebar"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #dfe7e2',
            borderRadius: '8px',
            padding: '7px 9px',
            color: '#176b52',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f7f5';
            e.currentTarget.style.borderColor = '#176b52';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#dfe7e2';
          }}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>

        {/* Global Search Input */}
        <div 
          onClick={() => setIsGlobalSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#eef2ef',
            border: '1px solid #dfe7e2',
            borderRadius: '8px',
            padding: '8px 14px',
            color: '#657b70',
            fontSize: '13px',
            cursor: 'pointer',
            flex: 1,
            transition: 'all 0.15s ease'
          }}
        >
          <Search size={16} color="#657b70" />
          <span style={{ color: '#657b70' }}>Search works, MPs, states...</span>
        </div>
      </div>

      {/* Right side: Live Clock + Scope Selector */}
      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Live Clock Widget */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            backgroundColor: '#f5f7f5',
            border: '1px solid #dfe7e2',
            borderRadius: '8px',
          }}
        >
          <Clock size={13} color="#176b52" />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#16251f',
              fontVariantNumeric: 'tabular-nums lining-nums',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.02em'
            }}>
              {timeStr}
            </span>
            <span style={{ fontSize: '10px', color: '#8fa59b', fontVariantNumeric: 'tabular-nums lining-nums' }}>
              {dateStr}
            </span>
          </div>
        </div>

        {/* National Scope Selector */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #dfe7e2',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 500,
            color: '#16251f'
          }}
        >
          <Globe size={14} color="#176b52" />
          <select 
            value={globalGeographicScope}
            onChange={(e) => setGlobalGeographicScope(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '12px',
              fontWeight: 600,
              color: '#16251f',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="ALL">All India</option>
            {states.map(s => (
              <option key={s.stateId} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
