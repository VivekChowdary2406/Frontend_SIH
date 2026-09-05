import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { riskService } from '../services/api/riskService';
import { paymentService } from '../services/api/paymentService';
import { apiClient } from '../services/apiClient';
import { WorkTab } from '../types/work';
import { PaymentTransaction } from '../types/payment';
import { WorkRiskResponse } from '../types/api';
import { WorkHeader } from '../components/work-details/WorkHeader';
import { WorkOverviewTab } from '../components/work-details/tabs/WorkOverviewTab';
import { WorkFinancialTab } from '../components/work-details/tabs/WorkFinancialTab';
import { WorkExecutionTab } from '../components/work-details/tabs/WorkExecutionTab';
import { WorkPaymentsTab } from '../components/work-details/tabs/WorkPaymentsTab';
import { ExplainableInvestigatorPanel } from '../components/work-details/ExplainableInvestigatorPanel';
import { EmptyState } from '../components/common/EmptyState';
import { 
  ArrowLeft, 
  FileText, 
  IndianRupee, 
  Clock, 
  CreditCard, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const WorkDetailsPage: React.FC = () => {
  const { selectedWorkId, setCurrentRoute, activeWorkTab, setActiveWorkTab } = useApp();

  // Local (mock) data — always available
  const work = selectedWorkId ? dataService.getWorkById(selectedWorkId) : undefined;
  const [payments, setPayments] = useState<PaymentTransaction[]>(
    selectedWorkId ? dataService.getPayments({ workId: selectedWorkId }) : []
  );

  // Live risk enrichment from FastAPI /api/v1/risk/work/{id}
  const [liveRisk, setLiveRisk] = useState<WorkRiskResponse | null>(null);
  const [isFetchingRisk, setIsFetchingRisk] = useState(false);

  // Fetch live payments when work changes
  useEffect(() => {
    if (!selectedWorkId) return;
    setPayments(dataService.getPayments({ workId: selectedWorkId }));
    if (apiClient.getStatus() === 'ONLINE') {
      paymentService.getPaymentsForWork(selectedWorkId)
        .then(live => { if (live?.length) setPayments(live); })
        .catch(() => {});
    }
  }, [selectedWorkId]);

  // Fetch live risk when Investigation tab is opened
  useEffect(() => {
    if (activeWorkTab !== 'investigation' || !selectedWorkId || liveRisk) return;
    setIsFetchingRisk(true);
    riskService.getWorkRisk(selectedWorkId)
      .then(data => setLiveRisk(data))
      .catch(() => {})
      .finally(() => setIsFetchingRisk(false));
  }, [activeWorkTab, selectedWorkId]);

  const handleRefreshRisk = useCallback(() => {
    if (!selectedWorkId) return;
    setIsFetchingRisk(true);
    setLiveRisk(null);
    riskService.evaluateWorkRisk(selectedWorkId)
      .then(data => setLiveRisk(data))
      .catch(() => {})
      .finally(() => setIsFetchingRisk(false));
  }, [selectedWorkId]);

  if (!work) {
    return (
      <div>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => setCurrentRoute('works')}
          style={{ marginBottom: '16px' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Works Directory</span>
        </button>
        <EmptyState
          title="Work Record Not Found"
          description="The selected Work ID does not exist in the active MPLADS database registry or may have been archived."
          action={
            <button className="btn btn-primary btn-sm" onClick={() => setCurrentRoute('works')}>
              Explore All Works
            </button>
          }
        />
      </div>
    );
  }

  const tabs: { id: WorkTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <FileText size={14} /> },
    { id: 'financial', label: 'Financial', icon: <IndianRupee size={14} /> },
    { id: 'execution', label: 'Execution', icon: <Clock size={14} /> },
    { id: 'payments', label: `Payments (${payments.length})`, icon: <CreditCard size={14} /> },
    { id: 'investigation', label: 'AI Investigation', icon: <Sparkles size={14} /> },
  ];

  return (
    <div className="work-details-workspace">
      {/* Back Navigation Bar */}
      <div className="work-details-top-nav">
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => setCurrentRoute('works')}
        >
          <ArrowLeft size={14} />
          <span>Back to Works</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveWorkTab('investigation')}
          >
            <Sparkles size={13} color="#d97706" />
            <span>Explainable AI Investigator →</span>
          </button>
        </div>
      </div>

      {/* Flagship Work Header */}
      <WorkHeader work={work} />

      {/* 17. Tab Navigation Strip (Progressive Disclosure) */}
      <div className="work-tabs-bar" role="tablist" aria-label="Work Investigation Facets">
        {tabs.map((tab) => {
          const isActive = activeWorkTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={`work-tab-btn ${isActive ? 'active' : ''} ${tab.id === 'investigation' ? 'tab-btn-ai' : ''}`}
              onClick={() => setActiveWorkTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'investigation' && (
                <span className="tab-pill-highlight">Flagship</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents Area */}
      <div className="work-tab-content-area">
        {activeWorkTab === 'overview' && (
          <WorkOverviewTab work={work} />
        )}

        {activeWorkTab === 'financial' && (
          <WorkFinancialTab work={work} payments={payments} />
        )}

        {activeWorkTab === 'execution' && (
          <WorkExecutionTab work={work} />
        )}

        {activeWorkTab === 'payments' && (
          <WorkPaymentsTab payments={payments} />
        )}

        {activeWorkTab === 'investigation' && (
          <ExplainableInvestigatorPanel
            work={work}
            payments={payments}
            liveRisk={liveRisk}
            isFetchingRisk={isFetchingRisk}
            onRefreshRisk={handleRefreshRisk}
          />
        )}
      </div>
    </div>
  );
};
