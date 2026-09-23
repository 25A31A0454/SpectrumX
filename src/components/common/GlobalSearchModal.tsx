import React, { useState, useMemo } from 'react';
import { useSpectrum } from '../../context/SpectrumContext';
import { Search, X, Radio, AlertTriangle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, signals, alerts, setSelectedSignal, setActiveTab } = useSpectrum();
  const [localQuery, setLocalQuery] = useState('');

  const filteredSignals = useMemo(() => {
    if (!localQuery.trim()) return [];
    const q = localQuery.toLowerCase();
    return signals.filter(
      s => s.id.toLowerCase().includes(q) ||
           s.frequency.toString().includes(q) ||
           s.modulation.toLowerCase().includes(q) ||
           s.type.toLowerCase().includes(q) ||
           s.location.toLowerCase().includes(q)
    );
  }, [signals, localQuery]);

  const filteredAlerts = useMemo(() => {
    if (!localQuery.trim()) return [];
    const q = localQuery.toLowerCase();
    return alerts.filter(
      a => a.id.toLowerCase().includes(q) ||
           a.type.toLowerCase().includes(q) ||
           a.frequency.toString().includes(q) ||
           a.severity.toLowerCase().includes(q)
    );
  }, [alerts, localQuery]);

  if (!isSearchOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm"
      onClick={() => setIsSearchOpen(false)}
    >
      <div 
        className="w-full max-w-xl bg-[#091024] border border-cyan-500/40 rounded shadow-2xl p-4 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Search signals, frequencies (e.g. 3.72), alerts, modulations..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
          <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto mt-3 space-y-4">
          {/* Signal Results */}
          {filteredSignals.length > 0 && (
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Signals ({filteredSignals.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredSignals.map(sig => (
                  <div
                    key={sig.id}
                    onClick={() => {
                      setSelectedSignal(sig);
                      setActiveTab('signals');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded border border-slate-800 hover:border-cyan-500 bg-[#060B18] cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-cyan-400 mr-2">{sig.id}</span>
                      <span className="text-slate-200">{sig.frequency} GHz</span>
                      <span className="text-slate-500 mx-2">•</span>
                      <span className="text-slate-400">{sig.modulation}</span>
                    </div>
                    <StatusBadge status={sig.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alert Results */}
          {filteredAlerts.length > 0 && (
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Alerts ({filteredAlerts.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredAlerts.map(alt => (
                  <div
                    key={alt.id}
                    onClick={() => {
                      setActiveTab('alerts');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded border border-slate-800 hover:border-red-500 bg-[#060B18] cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-red-400 mr-2">{alt.id}</span>
                      <span className="text-slate-200">{alt.type}</span>
                      <span className="text-slate-500 mx-2">•</span>
                      <span className="text-slate-400">{alt.frequency} GHz</span>
                    </div>
                    <StatusBadge status={alt.severity} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {localQuery && filteredSignals.length === 0 && filteredAlerts.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching signals or alerts found for "{localQuery}".
            </div>
          )}

          {!localQuery && (
            <div className="p-4 text-center text-xs text-slate-500 space-y-1">
              <div>Quick suggestions:</div>
              <div className="flex justify-center gap-2 pt-1">
                <button onClick={() => setLocalQuery('3.72')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px]">3.72 GHz</button>
                <button onClick={() => setLocalQuery('Anomalous')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-red-400 text-[11px]">Anomalous</button>
                <button onClick={() => setLocalQuery('OFDM')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-yellow-400 text-[11px]">OFDM</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
