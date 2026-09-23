import React, { useState, useMemo } from 'react';
import { useSpectrum } from '../context/SpectrumContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SignalModal } from '../components/common/SignalModal';
import { Signal } from '../types/spectrum';
import { Search, Layers, ArrowUpDown, Eye, Cpu } from 'lucide-react';

export const SignalsPage: React.FC = () => {
  const { signals, setSelectedSignal, setActiveTab, runAIAnalysis } = useSpectrum();

  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'frequency' | 'strength' | 'confidence' | 'anomalyScore'>('anomalyScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [modalSignal, setModalSignal] = useState<Signal | null>(null);

  const filteredSignals = useMemo(() => {
    return signals.filter((s: Signal) => {
      const matchSearch = 
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.frequency.toString().includes(search) ||
        s.modulation.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || s.priority === priorityFilter;
      const matchType = typeFilter === 'All' || s.type === typeFilter;

      return matchSearch && matchStatus && matchPriority && matchType;
    }).sort((a: Signal, b: Signal) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }, [signals, search, statusFilter, priorityFilter, typeFilter, sortField, sortAsc]);

  const toggleSort = (field: 'frequency' | 'strength' | 'confidence' | 'anomalyScore') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header & Filter Bar */}
      <div className="p-4 rounded-sm border border-[#18274E] bg-[#070D1F] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Signal Intelligence Database
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Active catalogued RF emitters in sensor reception range
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Showing <strong className="text-cyan-400">{filteredSignals.length}</strong> of {signals.length} signals
          </div>
        </div>

        {/* Search & Filter Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, freq, modulation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded border border-slate-800 bg-[#060B18] text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 rounded border border-slate-800 bg-[#060B18] text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Normal">Normal</option>
              <option value="Monitor">Monitor</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Anomalous">Anomalous</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full py-2 px-3 rounded border border-slate-800 bg-[#060B18] text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Monitor">Monitor</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 rounded border border-slate-800 bg-[#060B18] text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Digital">Digital</option>
              <option value="Pulsed">Pulsed / Radar</option>
              <option value="Unknown">Unknown / Burst</option>
            </select>
          </div>
        </div>
      </div>

      {/* Signal Database Table */}
      <div className="rounded-sm border border-[#18274E] bg-[#070D1F] overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-[#091228] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Signal ID</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-cyan-400 select-none"
                onClick={() => toggleSort('frequency')}
              >
                <div className="flex items-center gap-1">
                  <span>Frequency</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Modulation</th>
              <th className="py-3 px-4">Bandwidth</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-cyan-400 select-none"
                onClick={() => toggleSort('strength')}
              >
                <div className="flex items-center gap-1">
                  <span>Strength</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-cyan-400 select-none"
                onClick={() => toggleSort('confidence')}
              >
                <div className="flex items-center gap-1">
                  <span>Confidence</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-cyan-400 select-none"
                onClick={() => toggleSort('anomalyScore')}
              >
                <div className="flex items-center gap-1">
                  <span>Anomaly Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {filteredSignals.map((sig: Signal) => {
              const isAnomaly = sig.status === 'Anomalous';
              return (
                <tr 
                  key={sig.id}
                  onClick={() => setModalSignal(sig)}
                  className={`hover:bg-[#0C1736] cursor-pointer transition-colors ${
                    isAnomaly ? 'bg-red-950/10' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-cyan-400">
                    {sig.id}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {sig.frequency} {sig.frequencyUnit}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {sig.type}
                  </td>
                  <td className="py-3 px-4 text-cyan-300">
                    {sig.modulation}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {sig.bandwidth} MHz
                  </td>
                  <td className="py-3 px-4 text-slate-200">
                    {sig.strength} dBm
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">
                    {sig.confidence}%
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${isAnomaly ? 'text-red-400' : 'text-slate-300'}`}>
                      {sig.anomalyScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={sig.priority} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={sig.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setSelectedSignal(sig);
                          setActiveTab('ai');
                          runAIAnalysis(sig.id);
                        }}
                        title="Run AI Inference"
                        className="p-1.5 rounded hover:bg-cyan-950 border border-transparent hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setModalSignal(sig)}
                        title="View Telemetry"
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredSignals.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No signals found matching your current filter criteria.
          </div>
        )}
      </div>

      <SignalModal signal={modalSignal} onClose={() => setModalSignal(null)} />
    </div>
  );
};
