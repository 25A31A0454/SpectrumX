import React, { useState, useMemo } from 'react';
import { useSpectrum } from '../context/SpectrumContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SignalModal } from '../components/common/SignalModal';
import { Alert, Signal } from '../types/spectrum';
import { 
  Search, 
  CheckCircle, 
  Radio, 
  Trash2, 
  ShieldAlert,
  Clock
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, signals, resolveAlert, clearDemoAlerts } = useSpectrum();
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [modalSignal, setModalSignal] = useState<Signal | null>(null);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a: Alert) => {
      const matchSearch = 
        a.id.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase()) ||
        a.frequency.toString().includes(search) ||
        a.location.toLowerCase().includes(search.toLowerCase());

      const matchSeverity = 
        filterSeverity === 'All' ? true :
        filterSeverity === 'Resolved' ? a.status === 'Resolved' :
        a.severity === filterSeverity && a.status !== 'Resolved';

      return matchSearch && matchSeverity;
    });
  }, [alerts, search, filterSeverity]);

  const highCount = alerts.filter((a: Alert) => a.severity === 'High' && a.status !== 'Resolved').length;
  const suspCount = alerts.filter((a: Alert) => a.severity === 'Suspicious' && a.status !== 'Resolved').length;
  const monCount = alerts.filter((a: Alert) => a.severity === 'Monitor' && a.status !== 'Resolved').length;
  const resolvedCount = alerts.filter((a: Alert) => a.status === 'Resolved').length;

  return (
    <div className="space-y-6 font-mono">
      {/* Header with Counters & Clear Button */}
      <div className="p-4 rounded-sm border border-[#18274E] bg-[#070D1F] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-red-950/60 border border-red-500/40 text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                RF Incident & Alert Management
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Real-time operational notifications dispatched by the SpectrumX Anomaly Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearDemoAlerts}
              className="py-1.5 px-3 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Resolved</span>
            </button>
          </div>
        </div>

        {/* Filter Pills with Counts */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800 text-xs">
          <button
            onClick={() => setFilterSeverity('All')}
            className={`px-3 py-1.5 rounded transition-all ${
              filterSeverity === 'All'
                ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold'
                : 'bg-[#060B18] border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilterSeverity('High')}
            className={`px-3 py-1.5 rounded transition-all ${
              filterSeverity === 'High'
                ? 'bg-red-950 border border-red-500 text-red-300 font-bold glow-red'
                : 'bg-[#060B18] border border-slate-800 text-slate-400 hover:text-red-400'
            }`}
          >
            High Priority ({highCount})
          </button>
          <button
            onClick={() => setFilterSeverity('Suspicious')}
            className={`px-3 py-1.5 rounded transition-all ${
              filterSeverity === 'Suspicious'
                ? 'bg-orange-950 border border-orange-500 text-orange-300 font-bold glow-amber'
                : 'bg-[#060B18] border border-slate-800 text-slate-400 hover:text-orange-400'
            }`}
          >
            Suspicious ({suspCount})
          </button>
          <button
            onClick={() => setFilterSeverity('Monitor')}
            className={`px-3 py-1.5 rounded transition-all ${
              filterSeverity === 'Monitor'
                ? 'bg-yellow-950 border border-yellow-500 text-yellow-300 font-bold'
                : 'bg-[#060B18] border border-slate-800 text-slate-400 hover:text-yellow-400'
            }`}
          >
            Monitor ({monCount})
          </button>
          <button
            onClick={() => setFilterSeverity('Resolved')}
            className={`px-3 py-1.5 rounded transition-all ${
              filterSeverity === 'Resolved'
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold'
                : 'bg-[#060B18] border border-slate-800 text-slate-400 hover:text-emerald-400'
            }`}
          >
            Resolved ({resolvedCount})
          </button>

          <div className="ml-auto w-full sm:w-64 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search alert ID, type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-800 bg-[#060B18] text-slate-200 text-xs outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Alert Feed Table / Cards */}
      <div className="space-y-3">
        {filteredAlerts.map((alt: Alert) => {
          const isResolved = alt.status === 'Resolved';
          const matchedSignal = signals.find((s: Signal) => s.id === alt.signalId);

          return (
            <div
              key={alt.id}
              className={`p-4 rounded-sm border transition-all ${
                isResolved
                  ? 'border-slate-800/60 bg-[#060B18]/50 opacity-60'
                  : alt.severity === 'High'
                  ? 'border-red-500/50 bg-gradient-to-r from-[#200A10] to-[#0A0E20] glow-red'
                  : alt.severity === 'Suspicious'
                  ? 'border-orange-500/40 bg-gradient-to-r from-[#1E1106] to-[#0A0E20]'
                  : 'border-yellow-500/30 bg-[#070D1F]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <StatusBadge status={alt.severity} size="md" />
                  <span className="font-bold text-white text-sm tracking-wide">
                    {alt.type}
                  </span>
                  <span className="text-cyan-400 font-bold text-xs">
                    {alt.frequency} {alt.frequencyUnit}
                  </span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-slate-300 text-xs">
                    {alt.strength} dBm
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{alt.timestamp}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    isResolved 
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40' 
                      : 'border-amber-500/40 text-amber-300 bg-amber-950/40'
                  }`}>
                    {alt.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Alert Details Body */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <div className="flex flex-wrap gap-4 text-[11px]">
                  <div>
                    Signal ID: <span className="text-cyan-400 font-bold">{alt.signalId}</span>
                  </div>
                  <div>
                    Modulation: <span className="text-white">{alt.modulation}</span>
                  </div>
                  <div>
                    Bandwidth: <span className="text-white">{alt.bandwidth} MHz</span>
                  </div>
                  <div>
                    Confidence: <span className="text-emerald-400 font-bold">{alt.confidence}%</span>
                  </div>
                  <div>
                    Location: <span className="text-slate-400">{alt.location}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {matchedSignal && (
                    <button
                      onClick={() => setModalSignal(matchedSignal)}
                      className="px-2.5 py-1 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Inspect Signal</span>
                    </button>
                  )}

                  {!isResolved && (
                    <button
                      onClick={() => resolveAlert(alt.id)}
                      className="px-3 py-1 rounded border border-emerald-500/40 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded">
            No alerts found matching your selected filter.
          </div>
        )}
      </div>

      <SignalModal signal={modalSignal} onClose={() => setModalSignal(null)} />
    </div>
  );
};
