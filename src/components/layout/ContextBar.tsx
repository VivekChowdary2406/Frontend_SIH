import React from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { WorkTab } from '../../types/work';
import { 
  FileSearch, 
  IndianRupee, 
  Clock, 
  CreditCard, 
  Sparkles, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const ContextBar: React.FC = () => {
  const { 
    selectedWorkId, 
    currentRoute, 
    activeWorkTab, 
    navigateToWorkTab, 
    navigateToWork 
  } = useApp();

  if (!selectedWorkId) return null;

  const work = dataService.getWorkById(selectedWorkId);
  if (!work) return null;

  const tabs: { id: WorkTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <FileSearch size={13} /> },
    { id: 'financial', label: 'Financial', icon: <IndianRupee size={13} /> },
    { id: 'execution', label: 'Execution', icon: <Clock size={13} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={13} /> },
    { id: 'investigation', label: 'AI Investigation', icon: <Sparkles size={13} /> },
  ];

  const isDetailsPage = currentRoute === 'work-details';

  return (
    <div className={`context-bar ${isDetailsPage ? 'context-bar-docked' : 'context-bar-floating'}`}>
      <div className="context-bar-left">
        <div className="context-bar-meta">
          <span className="context-bar-eyebrow">VIEWING WORK</span>
          <span className="context-bar-workid">{work.workId}</span>
          <span className="context-bar-title" title={work.title}>{work.title}</span>
          <span className="context-bar-location">{work.state}</span>
        </div>
        <div className="context-bar-risk">
          <RiskBadge level={work.finalRiskLevel} score={work.finalRiskScore} />
        </div>
      </div>

      <div className="context-bar-right">
        {isDetailsPage ? (
          <div className="context-bar-tabs">
            {tabs.map((tab) => {
              const isActive = activeWorkTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`context-tab-btn ${isActive ? 'active' : ''} ${tab.id === 'investigation' ? 'tab-ai' : ''}`}
                  onClick={() => navigateToWorkTab(work.workId, tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <button 
            className="context-resume-btn"
            onClick={() => navigateToWork(work.workId)}
            title="Resume investigation for this work"
          >
            <span>Resume Work Investigation</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};
