import React, { useState } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { Search, History, BarChart2 } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [search, setSearch] = useState<string>('');

  // Historical log entries
  const historyEntries = [
    { time: '10:45:24', signalId: 'SIG-003', frequency: 3.72, type: 'Digital Burst', modulation: 'Unknown', strength: -41, bandwidth: 20, confidence: 91, status: 'Anomalous', event: 'Spectral Anomaly Confirmed' },
    { time: '10:38:15', signalId: 'SIG-007', frequency: 5.80, type: 'Digital', modulation: 'OFDM', strength: -52, bandwidth: 20, confidence: 83, status: 'Suspicious', event: 'EIRP Exceedance Detected' },
    { time: '10:33:02', signalId: 'SIG-003', frequency: 3.72, type: 'Unknown', modulation: 'Unknown', strength: -41, bandwidth: 20, confidence: 91, status: 'Anomalous', event: 'Initial Signal Ingestion' },
    { time: '10:28:40', signalId: 'SIG-004', frequency: 2.91, type: 'Pulsed', modulation: 'Chirp FMCW', strength: -56, bandwidth: 8, confidence: 88, status: 'Suspicious', event: 'Radar PRF Jitter Flagged' },
    { time: '10:19:40', signalId: 'SIG-008', frequency: 0.433, type: 'Pulsed', modulation: 'FSK', strength: -74, bandwidth: 0.25, confidence: 89, status: 'Monitor', event: 'Telemetry Drift Logged' },
    { time: '10:14:02', signalId: 'SIG-001', frequency: 1.24, type: 'Digital', modulation: 'QPSK', strength: -68, bandwidth: 12, confidence: 96, status: 'Normal', event: 'Carrier Baseline Validated' },
    { time: '10:02:11', signalId: 'SIG-002', frequency: 2.45, type: 'Digital', modulation: 'OFDM', strength: -48, bandwidth: 20, confidence: 94, status: 'Normal', event: 'Wi-Fi 802.11ax Registered' },
    { time: '09:45:00', signalId: 'SIG-005', frequency: 5.18, type: 'Digital', modulation: '16-QAM', strength: -64, bandwidth: 40, confidence: 97, status: 'Normal', event: 'UNII-1 Channel Baseline' },
    { time: '09:00:15', signalId: 'SIG-006', frequency: 0.85, type: 'Digital', modulation: '16-QAM', strength: -58, bandwidth: 10, confidence: 98, status: 'Normal', event: 'LTE Cellular Tower Baseline' },
  ];

  // Frequency band distribution data
  const bandDistData = [
    { band: '0.1-1 GHz', count: 2, color: '#10B981' },
    { band: '1.0-2.0 GHz', count: 1, color: '#10B981' },
    { band: '2.0-3.0 GHz', count: 2, color: '#F97316' },
    { band: '3.0-4.0 GHz', count: 1, color: '#EF4444' }, // Anomaly at 3.72
    { band: '5.0-6.0 GHz', count: 2, color: '#F97316' },
  ];

  const filteredHistory = historyEntries.filter(h =>
    h.signalId.toLowerCase().includes(search.toLowerCase()) ||
    h.frequency.toString().includes(search) ||
    h.modulation.toLowerCase().includes(search.toLowerCase()) ||
    h.event.toLowerCase().includes(search.toLowerCase()) ||
    h.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner */}
      <div className="p-4 rounded-sm border border-[#18274E] bg-[#070D1F] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Signal Telemetry History & Audit Trail
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Chronological log of RF detections, classification transitions, and anomaly incidents
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-800 bg-[#060B18] text-slate-200 text-xs outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Analytics Chart: Frequency Activity Distribution */}
      <div className="p-4 rounded-sm border border-[#18274E] bg-[#070D1F] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            Detected Signals by Frequency Allocation Band
          </span>
          <span className="text-[10px] text-slate-400">
            Red bar denotes band with active critical anomaly (3.0 – 4.0 GHz)
          </span>
        </div>

        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bandDistData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
              <XAxis dataKey="band" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }} allowDecimals={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="p-2 rounded border border-cyan-500/40 bg-[#091024] text-xs font-mono text-slate-200">
                        <div className="font-bold text-white">{d.band}</div>
                        <div>Signals: <span className="text-cyan-400 font-bold">{d.count}</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {bandDistData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-sm border border-[#18274E] bg-[#070D1F] overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-[#091228] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Time (UTC)</th>
              <th className="py-3 px-4">Signal ID</th>
              <th className="py-3 px-4">Frequency</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Strength</th>
              <th className="py-3 px-4">Bandwidth</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Telemetry Event Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {filteredHistory.map((h, idx) => (
              <tr 
                key={idx}
                className={`hover:bg-[#0C1736] transition-colors ${
                  h.status === 'Anomalous' ? 'bg-red-950/15' : ''
                }`}
              >
                <td className="py-3 px-4 text-slate-400 font-bold">
                  {h.time}
                </td>
                <td className="py-3 px-4 font-bold text-cyan-400">
                  {h.signalId}
                </td>
                <td className="py-3 px-4 font-bold text-white">
                  {h.frequency} GHz
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {h.type}
                </td>
                <td className="py-3 px-4 text-slate-200">
                  {h.strength} dBm
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {h.bandwidth} MHz
                </td>
                <td className="py-3 px-4 text-emerald-400 font-bold">
                  {h.confidence}%
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={h.status} size="sm" />
                </td>
                <td className="py-3 px-4 text-slate-300 font-sans text-xs">
                  {h.event}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
