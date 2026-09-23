import React from 'react';
import { PriorityLevel, SignalStatus } from '../../types/spectrum';

interface StatusBadgeProps {
  status: PriorityLevel | SignalStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showDot = true 
}) => {
  const norm = (status || '').toLowerCase();

  let colorClasses = 'bg-slate-800/80 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  if (norm === 'high' || norm === 'anomalous' || norm === 'critical') {
    colorClasses = 'bg-red-950/70 text-red-400 border-red-500/40 glow-red';
    dotColor = 'bg-red-500 shadow-[0_0_8px_#ef4444]';
  } else if (norm === 'suspicious') {
    colorClasses = 'bg-orange-950/70 text-orange-400 border-orange-500/40 glow-amber';
    dotColor = 'bg-orange-500 shadow-[0_0_8px_#f97316]';
  } else if (norm === 'monitor') {
    colorClasses = 'bg-yellow-950/70 text-yellow-400 border-yellow-500/40';
    dotColor = 'bg-yellow-400 shadow-[0_0_8px_#facc15]';
  } else if (norm === 'normal' || norm === 'active' || norm === 'online') {
    colorClasses = 'bg-emerald-950/70 text-emerald-400 border-emerald-500/40 glow-green';
    dotColor = 'bg-emerald-400 shadow-[0_0_8px_#10b981]';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wider',
    lg: 'text-sm px-3.5 py-1.5 font-medium tracking-wide',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono uppercase font-semibold border rounded-sm ${colorClasses} ${sizeClasses}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />}
      {status}
    </span>
  );
};
