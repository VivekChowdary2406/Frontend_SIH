import React, { useState } from 'react';
import IndiaMapData from '@svg-maps/india';
import { StateAnalytics } from '../../types/state';
import { dataService } from '../../services/dataService';

interface IndiaMapProps {
  selectedStateName?: string;
  onSelectState?: (stateName: string) => void;
  className?: string;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  selectedStateName,
  onSelectState,
  className = ''
}) => {
  const [hoveredState, setHoveredState] = useState<{
    name: string;
    stateData?: StateAnalytics;
    x: number;
    y: number;
  } | null>(null);

  const states = dataService.getStates();

  // Helper to match map location name to our state mock data
  const getStateData = (locationName: string): StateAnalytics | undefined => {
    return states.find(
      s => s.name.toLowerCase() === locationName.toLowerCase() ||
           s.name.toLowerCase().includes(locationName.toLowerCase()) ||
           locationName.toLowerCase().includes(s.name.toLowerCase())
    );
  };

  // Determine fill color based on state metrics
  const getStateFill = (stateData: StateAnalytics | undefined, isSelected: boolean) => {
    if (isSelected) return '#176b52'; // Leaf green for selected
    if (!stateData) return '#e8efe9';

    if (stateData.highRiskWorks >= 2) {
      return '#fca5a5'; // High risk tint
    }
    if (stateData.mediumRiskWorks >= 2) {
      return '#fed7aa'; // Medium risk tint
    }
    if (stateData.utilizationRate > 75) {
      return '#86efac'; // Strong utilization
    }
    return '#c2dfd2'; // Standard surveillance green
  };

  const handleMouseMove = (e: React.MouseEvent, locationName: string, stateData?: StateAnalytics) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredState({
      name: locationName,
      stateData,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      className={`relative rounded-lg p-3 bg-white border border-[#dfe7e2] shadow-[0_2px_8px_rgba(19,47,34,0.045)] flex flex-col items-center justify-center ${className}`}
      style={{ minHeight: '440px' }}
    >
      {/* Legend & Header */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-[#dfe7e2] mb-2 text-xs">
        <div className="font-semibold text-[#16251f] flex items-center gap-1.5 font-['DM_Sans']">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#176b52]" />
          <span>Interactive National Surveillance Map</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#647b70]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#176b52]" /> Active/Selected
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#fca5a5]" /> High Alert
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#fed7aa]" /> Observation
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#c2dfd2]" /> Monitored
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full flex items-center justify-center overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={IndiaMapData.viewBox || "0 0 612 696"}
          className="w-full max-w-[480px] h-auto transition-all duration-200"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(17,39,30,0.03))' }}
          aria-label="Map of India"
        >
          {IndiaMapData.locations.map((loc: any) => {
            const stateData = getStateData(loc.name);
            const isSelected = selectedStateName 
              ? loc.name.toLowerCase() === selectedStateName.toLowerCase() ||
                Boolean(stateData && stateData.name.toLowerCase() === selectedStateName.toLowerCase())
              : false;

            const fill = getStateFill(stateData, isSelected);

            return (
              <path
                key={loc.id}
                id={loc.id}
                name={loc.name}
                d={loc.path}
                fill={fill}
                stroke={isSelected ? '#11271e' : '#ffffff'}
                strokeWidth={isSelected ? '2.5' : '1'}
                strokeLinejoin="round"
                className="cursor-pointer transition-all duration-150 hover:opacity-85"
                style={{
                  outline: 'none',
                  filter: isSelected ? 'drop-shadow(0 2px 4px rgba(17,39,30,0.3))' : undefined,
                }}
                onClick={() => {
                  if (onSelectState) {
                    onSelectState(stateData ? stateData.name : loc.name);
                  }
                }}
                onMouseEnter={(e) => handleMouseMove(e, loc.name, stateData)}
                onMouseMove={(e) => handleMouseMove(e, loc.name, stateData)}
                onMouseLeave={() => setHoveredState(null)}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredState && (
          <div 
            className="absolute pointer-events-none z-30 bg-[#11271e] text-white p-2.5 rounded-md shadow-lg text-xs"
            style={{
              left: `${Math.min(hoveredState.x + 12, 340)}px`,
              top: `${Math.max(hoveredState.y - 45, 10)}px`,
              minWidth: '150px'
            }}
          >
            <div className="font-bold text-sm text-[#fef3c7] font-['DM_Sans']">
              {hoveredState.stateData?.name || hoveredState.name}
            </div>
            {hoveredState.stateData ? (
              <div className="mt-1 space-y-0.5 text-[11px] text-[#e2e8f0]">
                <div>Constituencies: <strong>{hoveredState.stateData.mpsCount}</strong></div>
                <div>Monitored Works: <strong>{hoveredState.stateData.totalWorks}</strong></div>
                <div>Fund Utilization: <strong>{hoveredState.stateData.utilizationRate.toFixed(1)}%</strong></div>
                <div className="text-[#fca5a5]">High Risk Signals: <strong>{hoveredState.stateData.highRiskWorks}</strong></div>
              </div>
            ) : (
              <div className="text-[11px] text-[#94a3b8] mt-0.5">Surveillance Zone</div>
            )}
            <div className="mt-1 pt-1 border-t border-[#234537] text-[10px] text-[#98b0a4]">
              Click state to inspect telemetry
            </div>
          </div>
        )}
      </div>

      <div className="w-full text-center text-[11px] text-[#647b70] mt-1 pt-1 border-t border-[#dfe7e2]">
        Click any state or territory to filter localized allocation & anomaly telemetry
      </div>
    </div>
  );
};
