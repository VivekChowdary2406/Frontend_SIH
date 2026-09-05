import React from 'react';
import { useApp, AppRoute } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Clock, 
  Bell, 
  Layers, 
  Users, 
  BarChart2
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentRoute, 
    setCurrentRoute, 
    unreadAlertsCount,
    isSidebarCollapsed
  } = useApp();

  const handleNav = (route: AppRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { route: AppRoute; label: string; icon: React.ReactNode; badge?: number }[] = [
    { route: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { route: 'works', label: 'Works', icon: <FileText size={18} /> },
    { route: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
    { route: 'delay-monitoring', label: 'Delay monitoring', icon: <Clock size={18} /> },
    { 
      route: 'alerts', 
      label: 'Alerts', 
      icon: <Bell size={18} />, 
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : 4 
    },
    { route: 'similar-works', label: 'Similar works', icon: <Layers size={18} /> },
  ];

  const analyticsItems: { route: AppRoute; label: string; icon: React.ReactNode }[] = [
    { route: 'mp-analytics', label: 'MP analytics', icon: <Users size={18} /> },
    { route: 'state-analytics', label: 'State analytics', icon: <BarChart2 size={18} /> },
  ];

  const isRouteActive = (route: AppRoute) => {
    if (route === 'works' && currentRoute === 'work-details') return true;
    return currentRoute === route;
  };

  return (
    <aside 
      className="sidebar" 
      aria-label="Main Navigation"
      style={{
        width: isSidebarCollapsed ? '64px' : '210px',
        minWidth: isSidebarCollapsed ? '64px' : '210px',
        backgroundColor: '#11271e',
        color: '#9cb5a8',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        borderRight: '1px solid #1a382c',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 40,
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowX: 'hidden'
      }}
    >
      {/* Brand Header */}
      <div 
        style={{ 
          padding: isSidebarCollapsed ? '16px 8px' : '16px 14px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid #1a382c',
          minHeight: '64px',
          boxSizing: 'border-box'
        }}
      >
        <div 
          onClick={() => handleNav('dashboard')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            cursor: 'pointer',
            minWidth: 0
          }}
          title="MPLADS Monitor"
        >
          <div 
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '7px',
              backgroundColor: '#d1fae5',
              color: '#11271e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '17px',
              fontFamily: 'var(--font-heading)',
              flexShrink: 0
            }}
          >
            M
          </div>
          {!isSidebarCollapsed && (
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
                MPLADS
              </div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#a3bdb1', lineHeight: 1.15 }}>
                Monitor
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Nav List */}
      <div 
        style={{ 
          flex: 1, 
          padding: isSidebarCollapsed ? '12px 6px' : '12px 10px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '3px', 
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {navItems.map((item) => {
          const active = isRouteActive(item.route);
          return (
            <button 
              key={item.route}
              onClick={() => handleNav(item.route)}
              title={isSidebarCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                gap: isSidebarCollapsed ? '0' : '11px',
                padding: isSidebarCollapsed ? '9px 0' : '8px 10px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: active ? 600 : 500,
                backgroundColor: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: active ? '#ffffff' : '#9cb5a8',
                border: 'none',
                textAlign: 'left',
                width: '100%',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9cb5a8';
                }
              }}
            >
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: active ? '#34d399' : 'inherit'
                }}
              >
                {item.icon}
              </div>

              {!isSidebarCollapsed && (
                <span 
                  style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {item.label}
                </span>
              )}

              {/* Badge for Expanded View */}
              {!isSidebarCollapsed && item.badge !== undefined && (
                <span 
                  style={{
                    marginLeft: 'auto',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    padding: '1px 6px',
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1
                  }}
                >
                  {item.badge}
                </span>
              )}

              {/* Dot for Collapsed View */}
              {isSidebarCollapsed && item.badge !== undefined && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '12px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#dc2626'
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Analytics Section Divider / Label */}
        {isSidebarCollapsed ? (
          <div 
            style={{ 
              height: '1px', 
              backgroundColor: 'rgba(255, 255, 255, 0.08)', 
              margin: '10px 6px' 
            }} 
          />
        ) : (
          <div style={{ marginTop: '16px', marginBottom: '4px', padding: '0 10px' }}>
            <span 
              style={{ 
                fontSize: '10px', 
                fontWeight: 700, 
                letterSpacing: '0.08em', 
                color: '#527263', 
                textTransform: 'uppercase' 
              }}
            >
              ANALYTICS
            </span>
          </div>
        )}

        {/* Analytics Items */}
        {analyticsItems.map((item) => {
          const active = isRouteActive(item.route);
          return (
            <button 
              key={item.route}
              onClick={() => handleNav(item.route)}
              title={isSidebarCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                gap: isSidebarCollapsed ? '0' : '11px',
                padding: isSidebarCollapsed ? '9px 0' : '8px 10px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: active ? 600 : 500,
                backgroundColor: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: active ? '#ffffff' : '#9cb5a8',
                border: 'none',
                textAlign: 'left',
                width: '100%',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9cb5a8';
                }
              }}
            >
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: active ? '#34d399' : 'inherit'
                }}
              >
                {item.icon}
              </div>

              {!isSidebarCollapsed && (
                <span 
                  style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}

        {/* Spacer to push footer down */}
        <div style={{ flex: 1 }} />

        {/* Sidebar Footer: Mini system summary widget */}
        {!isSidebarCollapsed ? (
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: '#527263', textTransform: 'uppercase', marginBottom: '2px' }}>
              System Snapshot
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#7e9e90' }}>Total works</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', fontVariantNumeric: 'tabular-nums lining-nums' }}>1,248</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#7e9e90' }}>High-risk</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#f87171', fontVariantNumeric: 'tabular-nums lining-nums' }}>68</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#7e9e90' }}>Utilization</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#a3bdb1', fontVariantNumeric: 'tabular-nums lining-nums' }}>65%</span>
            </div>
            {/* Mini utilization bar */}
            <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '65%', height: '100%', backgroundColor: '#34d399', borderRadius: '2px' }} />
            </div>
            <div style={{ fontSize: '10px', color: '#527263', marginTop: '2px' }}>
              FY 2025–26 · MPLADS Monitor
            </div>
          </div>
        ) : (
          /* Collapsed: just a thin accent line */
          <div style={{ margin: '12px 8px 4px', height: '1px', backgroundColor: 'rgba(255,255,255,0.07)' }} />
        )}
      </div>
    </aside>
  );
};
