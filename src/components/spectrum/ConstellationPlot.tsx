import React from 'react';

interface ConstellationPlotProps {
  samples?: { i: number; q: number }[];
  modulation: string;
  status?: string;
  size?: number;
  className?: string;
}

export const ConstellationPlot: React.FC<ConstellationPlotProps> = ({
  samples = [],
  modulation,
  status = 'Normal',
  size = 200,
  className = '',
}) => {
  const center = size / 2;
  const scale = size * 0.42;

  // Determine dot color
  let dotColor = '#00F0FF';
  if (status === 'Anomalous') dotColor = '#EF4444';
  else if (status === 'Suspicious') dotColor = '#F97316';
  else if (status === 'Monitor') dotColor = '#FBBF24';

  return (
    <div className={`flex flex-col items-center p-3 rounded border border-slate-800 bg-[#060B18] ${className}`}>
      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
          I/Q Constellation
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-950/40">
          {modulation}
        </span>
      </div>

      <svg width={size} height={size} className="overflow-visible select-none">
        {/* Polar circular grids */}
        <circle cx={center} cy={center} r={scale * 0.33} fill="none" stroke="#18274E" strokeWidth="1" strokeDasharray="2,2" />
        <circle cx={center} cy={center} r={scale * 0.66} fill="none" stroke="#18274E" strokeWidth="1" strokeDasharray="2,2" />
        <circle cx={center} cy={center} r={scale} fill="none" stroke="#1E3264" strokeWidth="1.2" />

        {/* Crosshairs */}
        <line x1={0} y1={center} x2={size} y2={center} stroke="#18274E" strokeWidth="1" />
        <line x1={center} y1={0} x2={center} y2={size} stroke="#18274E" strokeWidth="1" />

        {/* Axis labels */}
        <text x={size - 10} y={center - 4} fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="end">+I</text>
        <text x={center + 4} y={12} fill="#64748B" fontSize="9" fontFamily="monospace">+Q</text>

        {/* Constellation dots */}
        {samples.map((pt, idx) => {
          const cx = center + pt.i * scale;
          const cy = center - pt.q * scale;
          return (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r={2.2}
              fill={dotColor}
              opacity={0.85}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
    </div>
  );
};
