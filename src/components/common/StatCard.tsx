import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'cyan' | 'red' | 'green' | 'amber' | 'slate';
  badge?: string;
  trend?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  variant = 'cyan',
  badge,
  trend,
  className = '',
}) => {
  const borderVariants = {
    cyan: 'border-cyan-500/30 hover:border-cyan-400/60 bg-gradient-to-b from-[#0B1530] to-[#070D1F]',
    red: 'border-red-500/40 hover:border-red-400/70 bg-gradient-to-b from-[#250D15] to-[#0D0509]',
    green: 'border-emerald-500/30 hover:border-emerald-400/60 bg-gradient-to-b from-[#09221B] to-[#06120E]',
    amber: 'border-amber-500/30 hover:border-amber-400/60 bg-gradient-to-b from-[#241708] to-[#120B04]',
    slate: 'border-slate-800 hover:border-slate-700 bg-gradient-to-b from-[#0B1224] to-[#060A14]',
  }[variant];

  const textVariants = {
    cyan: 'text-cyan-400 text-glow-cyan',
    red: 'text-red-400 text-glow-red',
    green: 'text-emerald-400',
    amber: 'text-amber-400',
    slate: 'text-slate-200',
  }[variant];

  return (
    <div className={`relative p-4 rounded-sm border transition-all duration-200 backdrop-blur-sm shadow-lg ${borderVariants} ${className}`}>
      {/* Corner technical tick marks */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400/40" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400/40" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400/40" />

      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-medium">
          {label}
        </span>
        {icon && <div className="text-slate-400 p-1 rounded bg-slate-900/60">{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className={`text-2xl lg:text-3xl font-mono font-bold tracking-tight ${textVariants}`}>
          {value}
        </div>
        {badge && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
            {badge}
          </span>
        )}
      </div>

      {(subtext || trend) && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
          <span>{subtext}</span>
          {trend && <span className="text-cyan-400 font-semibold">{trend}</span>}
        </div>
      )}
    </div>
  );
};
