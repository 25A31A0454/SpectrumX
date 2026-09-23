import React, { useState, useEffect } from 'react';
import { useSpectrum } from '../context/SpectrumContext';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { AnomalyGauge } from '../components/common/AnomalyGauge';
import { SpectrumChart } from '../components/spectrum/SpectrumChart';
import { SignalModal } from '../components/common/SignalModal';
import { DemoController } from '../components/demo/DemoController';
import { 
  Radio, 
  Cpu, 
  Activity, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ShieldAlert, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { Signal, Alert } from '../types/spectrum';

export const DashboardPage: React.FC = () => {
  const { 
    systemHealth, 
    signals, 
    alerts, 
    priorityCounts, 
    setSelectedSignal,
    setActiveTab,
    runAIAnalysis,
    isAnalyzingSignal
  } = useSpectrum();

  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
  const [modalSignal, setModalSignal] = useState<Signal | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Most prominent / anomalous signal detected
  const featuredSignal = signals.find((s: Signal) => s.status === 'Anomalous') || signals.find((s: Signal) => s.id === 'SIG-003') || signals[0];

  const recentAlerts = alerts.slice(0, 4);

  return (
    <div className="space-y-6 font-mono">
      {/* SIH Demo Controller if active */}
      <DemoController />

      {/* Top Section: System Status (4 Required Status Cards + Live Clock) */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            System Operational Status
          </span>
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold bg-[#070D1F] px-3 py-1 rounded border border-slate-800">
            <Clock className="w-3.5 h-3.5" />
            <span>UTC/LOCAL: {currentTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: SDR Connected */}
          <div className="p-3.5 rounded-sm border border-emerald-500/30 bg-[#070D1F] relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase">
              <span>SDR Connected</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="mt-2 text-sm font-bold text-white tracking-wide">
              {systemHealth.sdrDevice}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Sample Rate: 20 MS/s • USB 3.0 Link
            </div>
          </div>

          {/* Card 2: Scanner Active */}
          <div className="p-3.5 rounded-sm border border-cyan-500/30 bg-[#070D1F] relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase">
              <span>Scanner Active</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {systemHealth.scannerStatus}
              </span>
            </div>
            <div className="mt-2 text-sm font-bold text-white tracking-wide">
              Scanning: {systemHealth.scanRange}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Sweep Cadence: {systemHealth.scanRateHz} sweeps/sec
            </div>
          </div>

          {/* Card 3: AI Engine Online */}
          <div className="p-3.5 rounded-sm border border-cyan-500/30 bg-[#070D1F] relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase">
              <span>AI Engine Online</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="mt-2 text-sm font-bold text-white tracking-wide truncate">
              {systemHealth.aiModelVersion}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Analyses Performed: {systemHealth.aiAnalysesPerformed}
            </div>
          </div>

          {/* Card 4: Database Online */}
          <div className="p-3.5 rounded-sm border border-emerald-500/30 bg-[#070D1F] relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase">
              <span>Database Online</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ONLINE
              </span>
            </div>
            <div className="mt-2 text-sm font-bold text-white tracking-wide">
              {systemHealth.dbEngine}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Signals Logged: {systemHealth.signalsProcessed.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Spectrum Scanner (Center) & Signal Detection Action Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spectrum Scanner (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <SpectrumChart 
            height={320} 
            onSelectSignal={(sig: Signal) => setModalSignal(sig)}
          />

          {/* Quick Frequency Spectrum Range Quick-Picks */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-sm border border-slate-800 bg-[#070D1F] text-xs">
            <span className="text-slate-400 text-[11px]">RF Bands:</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveTab('spectrum')} className="px-2.5 py-1 rounded bg-[#0A1329] border border-slate-700 hover:border-cyan-400 text-cyan-300">
                0.1–1.0 GHz (VHF/UHF)
              </button>
              <button onClick={() => setActiveTab('spectrum')} className="px-2.5 py-1 rounded bg-[#0A1329] border border-slate-700 hover:border-cyan-400 text-cyan-300">
                2.4 GHz (ISM Wi-Fi)
              </button>
              <button onClick={() => setActiveTab('spectrum')} className="px-2.5 py-1 rounded bg-[#0A1329] border border-slate-700 hover:border-cyan-400 text-cyan-300">
                3.72 GHz (Anomaly Sector)
              </button>
              <button onClick={() => setActiveTab('spectrum')} className="px-2.5 py-1 rounded bg-[#0A1329] border border-slate-700 hover:border-cyan-400 text-cyan-300">
                5.8 GHz (ISM/UNII)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Signal Detection Card & Anomaly Progress */}
        <div className="space-y-4">
          {/* Signal Detected Notification Box */}
          <div className={`p-4 rounded-sm border transition-all ${
            featuredSignal.status === 'Anomalous'
              ? 'border-red-500/60 bg-red-950/20 glow-red'
              : 'border-cyan-500/40 bg-[#070D1F]'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                featuredSignal.status === 'Anomalous' ? 'text-red-400' : 'text-cyan-400'
              }`}>
                <Radio className="w-4 h-4 animate-pulse" />
                SIGNAL DETECTED
              </span>
              <StatusBadge status={featuredSignal.status} size="sm" />
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="text-slate-400">Frequency:</span>
                <span className="text-white font-bold text-base">{featuredSignal.frequency} GHz</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-slate-400">Signal Strength:</span>
                <span className="text-white font-bold">{featuredSignal.strength} dBm</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-slate-400">Bandwidth:</span>
                <span className="text-white font-bold">{featuredSignal.bandwidth} MHz</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-slate-400">Modulation:</span>
                <span className="text-cyan-400 font-bold">{featuredSignal.modulation}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={`font-bold ${
                  featuredSignal.status === 'Anomalous' ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {featuredSignal.status === 'Anomalous' ? 'Anomaly Detected' : featuredSignal.status}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex gap-2">
              <button
                onClick={async () => {
                  setSelectedSignal(featuredSignal);
                  setActiveTab('ai');
                  await runAIAnalysis(featuredSignal.id);
                }}
                disabled={isAnalyzingSignal}
                className="w-full py-2.5 px-3 rounded border border-cyan-400 bg-cyan-600/30 hover:bg-cyan-500/50 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 glow-cyan transition-all"
              >
                <Cpu className="w-4 h-4 text-cyan-300" />
                <span>{isAnalyzingSignal ? 'ANALYZING...' : 'ANALYZE SIGNAL'}</span>
              </button>
              <button
                onClick={() => setModalSignal(featuredSignal)}
                className="p-2.5 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                title="Full Signal Telemetry"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Anomaly Gauge */}
          <AnomalyGauge score={featuredSignal.anomalyScore} status={featuredSignal.status} />

          {/* Priority Engine Counter Cards */}
          <div className="p-4 rounded-sm border border-[#18274E] bg-[#070D1F] space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Priority Assessment Matrix
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded border border-red-500/40 bg-red-950/30">
                <div className="text-[10px] text-red-400 font-bold">HIGH</div>
                <div className="text-lg font-bold text-white">{priorityCounts.High}</div>
              </div>
              <div className="p-2 rounded border border-orange-500/40 bg-orange-950/30">
                <div className="text-[10px] text-orange-400 font-bold">SUSPICIOUS</div>
                <div className="text-lg font-bold text-white">{priorityCounts.Suspicious}</div>
              </div>
              <div className="p-2 rounded border border-yellow-500/40 bg-yellow-950/30">
                <div className="text-[10px] text-yellow-400 font-bold">MONITOR</div>
                <div className="text-lg font-bold text-white">{priorityCounts.Monitor}</div>
              </div>
              <div className="p-2 rounded border border-emerald-500/40 bg-emerald-950/30">
                <div className="text-[10px] text-emerald-400 font-bold">NORMAL</div>
                <div className="text-lg font-bold text-white">{priorityCounts.Normal}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signal Intelligence KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Signals"
          value={signals.length}
          subtext="Catalogued in Sector"
          icon={<Radio className="w-4 h-4 text-cyan-400" />}
          variant="cyan"
          trend="+2 new in last 5m"
        />
        <StatCard
          label="Anomalies Detected"
          value={signals.filter((s: Signal) => s.status === 'Anomalous').length}
          subtext="Unregistered Spectral Breach"
          icon={<ShieldAlert className="w-4 h-4 text-red-400" />}
          variant="red"
          badge="CRITICAL"
        />
        <StatCard
          label="Priority Alerts"
          value={alerts.filter((a: Alert) => a.status === 'Active').length}
          subtext="Requiring Operator Action"
          icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
          variant="amber"
          badge="ACTIVE"
        />
        <StatCard
          label="Active Transmitters"
          value={signals.filter((s: Signal) => s.strength > -80).length}
          subtext="Signal Power > -80 dBm"
          icon={<Zap className="w-4 h-4 text-emerald-400" />}
          variant="green"
        />
      </div>

      {/* Bottom Section: Recent Alerts Queue */}
      <div className="p-4 rounded-sm border border-[#18274E] bg-[#070D1F] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Recent Spectrum Alerts
          </span>
          <button
            onClick={() => setActiveTab('alerts')}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] font-bold"
          >
            <span>View All Alerts ({alerts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentAlerts.map((alt: Alert) => (
            <div
              key={alt.id}
              onClick={() => {
                const matched = signals.find((s: Signal) => s.id === alt.signalId);
                if (matched) setModalSignal(matched);
                else setActiveTab('alerts');
              }}
              className="p-3 rounded border border-slate-800 hover:border-cyan-500/60 bg-[#091024] cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-bold">{alt.id}</span>
                <StatusBadge status={alt.severity} size="sm" />
              </div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                {alt.type}
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                {alt.frequency} GHz • {alt.strength} dBm
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-800">
                <span>{alt.modulation}</span>
                <span>{alt.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signal Details Modal if selected */}
      <SignalModal signal={modalSignal} onClose={() => setModalSignal(null)} />
    </div>
  );
};
