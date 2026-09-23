import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import { useSpectrum } from '../../context/SpectrumContext';
import { SpectrumPoint, Signal } from '../../types/spectrum';

interface SpectrumChartProps {
  height?: number;
  showDetails?: boolean;
  onSelectSignal?: (sig: Signal) => void;
}

export const SpectrumChart: React.FC<SpectrumChartProps> = ({ 
  height = 340,
  showDetails = true,
  onSelectSignal
}) => {
  const { spectrumData, signals, setSelectedSignal } = useSpectrum();

  // Peak signals to mark on chart
  const activePeaks = signals.filter(s => s.strength > -90);

  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const pt: SpectrumPoint = data.activePayload[0].payload;
      if (pt.signalId) {
        const found = signals.find(s => s.id === pt.signalId);
        if (found) {
          setSelectedSignal(found);
          if (onSelectSignal) onSelectSignal(found);
        }
      }
    }
  };

  return (
    <div className="relative w-full rounded-sm border border-[#18274E] bg-[#070D1F] p-4 font-mono select-none">
      {/* Chart Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white tracking-wider uppercase">
            Live Spectrum FFT Sweeper
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-950/40">
            0.1 – 6.0 GHz Wideband
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
            <span>RF Power</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-red-500" />
            <span>Alert Threshold (-50 dBm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-slate-600" />
            <span>Noise Floor (-102 dBm)</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={spectrumData} 
            onClick={handleChartClick}
            margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
          >
            <defs>
              {/* Cyan gradient for normal/active spectrum */}
              <linearGradient id="spectrumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.65}/>
                <stop offset="60%" stopColor="#0077B6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#050811" stopOpacity={0.05}/>
              </linearGradient>
            </defs>

            <XAxis 
              dataKey="frequency" 
              tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#18274E' }}
              axisLine={{ stroke: '#18274E' }}
              tickFormatter={(val) => `${val} GHz`}
              interval={18}
            />

            <YAxis 
              domain={[-120, -20]} 
              tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#18274E' }}
              axisLine={{ stroke: '#18274E' }}
              tickFormatter={(val) => `${val} dBm`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as SpectrumPoint;
                  const matchedSig = pt.signalId ? signals.find(s => s.id === pt.signalId) : null;
                  return (
                    <div className="p-2.5 rounded border border-cyan-500/50 bg-[#091024]/95 backdrop-blur-md shadow-xl text-xs font-mono">
                      <div className="text-cyan-400 font-bold mb-1">
                        {pt.frequency} GHz
                      </div>
                      <div className="text-slate-300">
                        Power: <strong className="text-white">{pt.power} dBm</strong>
                      </div>
                      {matchedSig && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[11px] space-y-0.5">
                          <div className="text-white font-bold">{matchedSig.id} ({matchedSig.status})</div>
                          <div className="text-slate-400">Mod: {matchedSig.modulation} • BW: {matchedSig.bandwidth} MHz</div>
                          <div className="text-cyan-400 text-[10px] mt-1 underline">Click to inspect signal</div>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Threshold References */}
            <ReferenceLine y={-50} stroke="#EF4444" strokeDasharray="3 3" strokeWidth={1.2} />
            <ReferenceLine y={-102} stroke="#334155" strokeDasharray="2 2" strokeWidth={1} />

            {/* Signal Peak Annotations */}
            {activePeaks.map(sig => {
              const isAnomaly = sig.status === 'Anomalous';
              const dotColor = isAnomaly ? '#EF4444' : sig.status === 'Suspicious' ? '#F97316' : '#00F0FF';
              return (
                <ReferenceDot
                  key={sig.id}
                  x={sig.frequency}
                  y={sig.strength}
                  r={isAnomaly ? 6 : 4}
                  fill={dotColor}
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                  isFront={true}
                />
              );
            })}

            <Area 
              type="monotone" 
              dataKey="power" 
              stroke="#00F0FF" 
              strokeWidth={1.8} 
              fillOpacity={1} 
              fill="url(#spectrumGradient)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Signal Markers Legend */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Detected Peaks:</span>
            <div className="flex flex-wrap gap-1.5">
              {activePeaks.map(sig => (
                <button
                  key={sig.id}
                  onClick={() => {
                    setSelectedSignal(sig);
                    if (onSelectSignal) onSelectSignal(sig);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${
                    sig.status === 'Anomalous'
                      ? 'border-red-500/60 bg-red-950/50 text-red-300 hover:border-red-400'
                      : sig.status === 'Suspicious'
                      ? 'border-orange-500/60 bg-orange-950/50 text-orange-300 hover:border-orange-400'
                      : 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:border-cyan-400'
                  }`}
                >
                  {sig.frequency} GHz ({sig.id})
                </button>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-slate-500">
            Resolution Bandwidth: 100 kHz • Sweep: 20 ms
          </span>
        </div>
      )}
    </div>
  );
};
