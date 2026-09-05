import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorksPage } from './pages/WorksPage';
import { WorkDetailsPage } from './pages/WorkDetailsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { DelayMonitoringPage } from './pages/DelayMonitoringPage';
import { RiskMonitoringPage } from './pages/RiskMonitoringPage';
import { AlertsPage } from './pages/AlertsPage';
import { SimilarWorksPage } from './pages/SimilarWorksPage';
import { MPAnalyticsPage } from './pages/MPAnalyticsPage';
import { StateAnalyticsPage } from './pages/StateAnalyticsPage';
import { AuditSettingsPage } from './pages/AuditSettingsPage';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();

  const renderActivePage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage />;
      case 'works':
        return <WorksPage />;
      case 'work-details':
        return <WorkDetailsPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'delay-monitoring':
        return <DelayMonitoringPage />;
      case 'risk-monitoring':
        return <RiskMonitoringPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'similar-works':
        return <SimilarWorksPage />;
      case 'mp-analytics':
        return <MPAnalyticsPage />;
      case 'state-analytics':
        return <StateAnalyticsPage />;
      case 'settings':
        return <AuditSettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <AppShell>{renderActivePage()}</AppShell>;
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
