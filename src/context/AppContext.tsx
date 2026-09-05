import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorkTab } from '../types/work';
import { SystemAlert, AlertStatus } from '../types/alert';
import { dataService } from '../services/dataService';

export type AppRoute = 
  | 'landing'
  | 'dashboard'
  | 'works'
  | 'work-details'
  | 'payments'
  | 'delay-monitoring'
  | 'risk-monitoring'
  | 'alerts'
  | 'similar-works'
  | 'mp-analytics'
  | 'state-analytics'
  | 'settings';

interface AppContextType {
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  selectedWorkId: string | null;
  activeWorkTab: WorkTab;
  setActiveWorkTab: (tab: WorkTab) => void;
  navigateToWork: (workId: string) => void;
  navigateToWorkTab: (workId: string, tab: WorkTab) => void;
  selectedMPId: string;
  setSelectedMPId: (id: string) => void;
  navigateToMP: (mpId: string) => void;
  selectedStateId: string;
  setSelectedStateId: (id: string) => void;
  navigateToState: (stateId: string) => void;
  globalGeographicScope: string;
  setGlobalGeographicScope: (scope: string) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  activeOfficer: string;
  alerts: SystemAlert[];
  unreadAlertsCount: number;
  handleUpdateAlertStatus: (alertId: string, status: AlertStatus, note?: string) => void;
  handleUpdateWorkReview: (workId: string, status: 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED', note: string) => void;
  refreshTrigger: number;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('dashboard');
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>('WS/UP/2025/001');
  const [activeWorkTab, setActiveWorkTab] = useState<WorkTab>('overview');
  const [selectedMPId, setSelectedMPId] = useState<string>('MP-058');
  const [selectedStateId, setSelectedStateId] = useState<string>('ST-UP');
  const [globalGeographicScope, setGlobalGeographicScope] = useState<string>('ALL');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const activeOfficer = 'Shri R. Sharma, Principal Director (MPLADS Investigation)';

  const navigateToWork = (workId: string) => {
    setSelectedWorkId(workId);
    setActiveWorkTab('overview');
    setCurrentRoute('work-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToWorkTab = (workId: string, tab: WorkTab) => {
    setSelectedWorkId(workId);
    setActiveWorkTab(tab);
    setCurrentRoute('work-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToMP = (mpId: string) => {
    setSelectedMPId(mpId);
    setCurrentRoute('mp-analytics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToState = (stateId: string) => {
    setSelectedStateId(stateId);
    setCurrentRoute('state-analytics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const alerts = dataService.getAlerts();
  const unreadAlertsCount = alerts.filter(a => a.status === 'NEW' || a.status === 'UNDER_REVIEW').length;

  const handleUpdateAlertStatus = (alertId: string, status: AlertStatus, note?: string) => {
    dataService.updateAlertStatus(alertId, status, note);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUpdateWorkReview = (
    workId: string, 
    status: 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED', 
    note: string
  ) => {
    dataService.updateWorkReview(workId, status, note, activeOfficer);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        selectedWorkId,
        activeWorkTab,
        setActiveWorkTab,
        navigateToWork,
        navigateToWorkTab,
        selectedMPId,
        setSelectedMPId,
        navigateToMP,
        selectedStateId,
        setSelectedStateId,
        navigateToState,
        globalGeographicScope,
        setGlobalGeographicScope,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        activeOfficer,
        alerts,
        unreadAlertsCount,
        handleUpdateAlertStatus,
        handleUpdateWorkReview,
        refreshTrigger,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
