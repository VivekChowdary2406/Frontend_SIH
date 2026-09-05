import React from 'react';
import { Info } from 'lucide-react';

interface DisclaimerBannerProps {
  customText?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ customText }) => {
  return (
    <div className="disclaimer-banner" role="alert">
      <Info size={18} style={{ flexShrink: 0, marginTop: 1 }} />
      <div>
        <strong>DECISION SUPPORT NOTICE:</strong>{' '}
        {customText || 'AI-generated risk signals are intended to support human review and do not establish wrongdoing. All anomaly scores and predictions indicate patterns requiring administrative verification by designated authorities.'}
      </div>
    </div>
  );
};
