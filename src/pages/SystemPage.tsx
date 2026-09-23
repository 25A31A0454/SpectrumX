import React from 'react';
import { useSpectrum } from '../context/SpectrumContext';
import { StatCard } from '../components/common/StatCard';
import { 
  Server, 
  Cpu, 
  Database, 
  Radio, 
  Clock, 
  ShieldCheck, 
  Zap,
  Activity
} from 'lucide-react';

export const SystemPage: React.FC = () => {
  const { systemHealth, resetDemo } = useSpectrum();

  const formatUptime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const components = [
    {
      name: 'SDR Front-End Interface',
      role: 'RF Downconversion & I/Q Digitization',
      device: systemHealth.sdrDevice,
      status: systemHealth.sdrStatus,
      latency: '1.2 ms',
      throughput: '20.0 MSPS (USB 3.0)',
      icon: <Radio className="w-5 h-5 text-cyan-400" />,
    },
    {
      name: 'AI Neural Classifier Engine',
      role: 'Deep Constellation & Feature Inference',
      device: systemHealth.aiModelVersion,
      status: systemHealth.aiEngineStatus,
      latency: '14.8 ms',
      throughput: '65 inference jobs/min',
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
    },
    {
      name: 'Telemetry Database Layer',
      role: 'Local Time-Series State Store',
      device: systemHealth.dbEngine,
      status: systemHealth.dbStatus,
      latency: '0.4 ms',
      throughput: 'Indexed SQLite Store',
      icon: <Database className="w-5 h-5 text-cyan-400" />,
    },
    {
      name: 'SpectrumX Web Command Core',
      role: 'Operator GUI & WebSocket Event Bus',
      device: 'Vite + React 18 Engine',
      status: 'ONLINE',
      latency: '60 FPS',
      throughput: 'Local Client Loopback',
      icon: <Server className="w-5 h-5 text-emerald-400" />,
    },
    {
      name: 'RF Simulation Engine',
      role: 'Realistic 0.1–6.0 GHz Physical Model',
      device: 'High-Fidelity Synthetic Core',
      status: 'ONLINE',
      latency: '0.8 ms',
      throughput: '250+ Spectral Bins / 20ms',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner */}
      <div className="p-4 rounded-sm border border-[#18274E] bg-[#070D1F] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              System Infrastructure & Diagnostics
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Hardware controller health, real-time bus throughput, and service telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetDemo}
            className="px-3 py-1.5 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs"
          >
            Soft Reboot Services
          </button>
        </div>
      </div>

      {/* KPI Cards: Telemetry Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          label="System Uptime"
          value={formatUptime(systemHealth.uptimeSeconds)}
          subtext="Continuous Sensor Run"
          icon={<Clock className="w-4 h-4 text-cyan-400" />}
          variant="cyan"
        />
        <StatCard
          label="Sweep Cadence"
          value={`${systemHealth.scanRateHz} Hz`}
          subtext="FFT Frames / Sec"
          icon={<Activity className="w-4 h-4 text-emerald-400" />}
          variant="green"
        />
        <StatCard
          label="Signals Processed"
          value={systemHealth.signalsProcessed.toLocaleString()}
          subtext="Total Emitter Bursts"
          icon={<Radio className="w-4 h-4 text-cyan-400" />}
          variant="cyan"
        />
        <StatCard
          label="AI Inferences"
          value={systemHealth.aiAnalysesPerformed}
          subtext="Neural Classifications"
          icon={<Cpu className="w-4 h-4 text-cyan-400" />}
          variant="cyan"
        />
        <StatCard
          label="Alerts Generated"
          value={systemHealth.alertsGenerated}
          subtext="Incidents Flagged"
          icon={<Server className="w-4 h-4 text-amber-400" />}
          variant="amber"
        />
      </div>

      {/* System Component Services List */}
      <div className="p-4 rounded-sm border border-[#18274E] bg-[#070D1F] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
          <span className="font-bold text-white uppercase tracking-wider">
            Subsystem Health Status
          </span>
          <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ALL SUBSYSTEMS NOMINAL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map((comp, idx) => (
            <div
              key={idx}
              className="p-4 rounded border border-slate-800 bg-[#060B18] space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    {comp.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">{comp.name}</h3>
                    <div className="text-[10px] text-slate-400 font-sans">{comp.role}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/40 text-emerald-400 bg-emerald-950/40">
                  {comp.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Model / Driver:</span>
                  <span className="text-slate-200 truncate max-w-[160px]">{comp.device}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Latency:</span>
                  <span className="text-cyan-400">{comp.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Throughput:</span>
                  <span className="text-slate-200">{comp.throughput}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
