import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Home } from 'lucide-react';
import { dataService } from '../../services/dataService';

export const Breadcrumbs: React.FC = () => {
  const { currentRoute, setCurrentRoute, selectedWorkId, activeWorkTab, setActiveWorkTab } = useApp();

  const activeWork = selectedWorkId ? dataService.getWorkById(selectedWorkId) : undefined;

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'overview': return 'Overview';
      case 'financial': return 'Financial Position';
      case 'execution': return 'Execution Milestones';
      case 'payments': return 'Payments Ledger';
      case 'investigation': return 'Explainable AI Investigation';
      default: return tab;
    }
  };

  const getRouteName = (route: string) => {
    switch (route) {
      case 'dashboard': return 'National Overview';
      case 'works': return 'Works Directory';
      case 'work-details': return 'Works';
      case 'payments': return 'Payments Surveillance';
      case 'delay-monitoring': return 'Delay Monitoring';
      case 'alerts': return 'Investigation Alerts';
      case 'similar-works': return 'Potentially Similar Works';
      case 'mp-analytics': return 'MP Analytics';
      case 'state-analytics': return 'State Analytics';
      case 'settings': return 'Audit Logs & Settings';
      default: return route;
    }
  };

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb navigation">
      <span 
        className="breadcrumb-item" 
        style={{ cursor: 'pointer' }} 
        onClick={() => setCurrentRoute('dashboard')}
      >
        <Home size={12} />
        <span>MPLADS</span>
      </span>

      {currentRoute !== 'dashboard' && (
        <>
          <ChevronRight size={11} className="breadcrumb-sep" />
          {currentRoute === 'work-details' ? (
            <>
              <span 
                className="breadcrumb-item" 
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentRoute('works')}
              >
                Works
              </span>
              <ChevronRight size={11} className="breadcrumb-sep" />
              <span 
                className="breadcrumb-item"
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveWorkTab('overview')}
              >
                {selectedWorkId}
              </span>
              {activeWorkTab !== 'overview' && (
                <>
                  <ChevronRight size={11} className="breadcrumb-sep" />
                  <span className="breadcrumb-item active">
                    {getTabLabel(activeWorkTab)}
                  </span>
                </>
              )}
            </>
          ) : (
            <span className="breadcrumb-item active">
              {getRouteName(currentRoute)}
            </span>
          )}
        </>
      )}
    </nav>
  );
};
