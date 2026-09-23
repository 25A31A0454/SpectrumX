import React from 'react';
import { SignalStatus } from '../../types/spectrum';

interface AnomalyGaugeProps {
  score: number; // 0.0 to 1.0
  status: SignalStatus;
  showLabels?: boolean;
  className?: string;
}

export const AnomalyGauge: React.FC<AnomalyGaugeProps> = ({
  score,
  status,
  showLabels = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max(Math.round(score * 100), 0), 100);

  // Determine stage
  let stage: 'NORMAL' | 'SUSPICIOUS' | 'ANOMALOUS' = 'NORMAL';
  let barColor = 'from-emerald-500 to-emerald-400';
  let glowColor = 'shadow-[0_0_12px_#10b981]';

  if (score >= 0.70 || status === 'Anomalous') {
    stage = 'ANOMALOUS';
    barColor = 'from-orange-500 via-red-500 to-red-600';
    glowColor = 'shadow-[0_0_15px_#ef4444]';
  } else if (score >= 0.35 || status === 'Suspicious') {
    stage = 'SUSPICIOUS';
    barColor = 'from-yellow-500 to-orange-500';
    glowColor = 'shadow-[0_0_12px_#f97316]';
  }

  return (
    <div className={`p-4 rounded-sm border border-slate-800 bg-[#091024]/90 backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
          Anomaly Detection Engine
        </span>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-200">
          Score: {score.toFixed(2)} ({percentage}%)
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden my-2">
        {/* Threshold Markers */}
        <div className="absolute top-0 bottom-0 left-[35%] w-[1px] bg-slate-700 z-10" />
        <div className="absolute top-0 bottom-0 left-[70%] w-[1px] bg-slate-700 z-10" />

        <div
          className={`h-full bg-gradient-to-r ${barColor} ${glowColor} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stage Indicators */}
      {showLabels && (
        <div className="grid grid-cols-3 text-center text-[10px] font-mono font-semibold tracking-wider pt-1">
          <div className={`transition-colors ${stage === 'NORMAL' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
            ● NORMAL (&lt;0.35)
          </div>
          <div className={`transition-colors ${stage === 'SUSPICIOUS' ? 'text-orange-400 font-bold' : 'text-slate-500'}`}>
            ▲ SUSPICIOUS (0.35–0.70)
          </div>
          <div className={`transition-colors ${stage === 'ANOMALOUS' ? 'text-red-400 font-bold animate-pulse' : 'text-slate-500'}`}>
            ⚠ ANOMALOUS (&gt;0.70)
          </div>
        </div>
      )}
    </div>
  );
};
