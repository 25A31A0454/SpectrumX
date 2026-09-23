import React from 'react';
import { useSpectrum } from '../../context/SpectrumContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Search, 
  User, 
  Activity,
  Flame
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    isScanning, 
    toggleScan, 
    demoActive, 
    demoPlaying, 
    demoPhase, 
    startDemo, 
    pauseDemo, 
    resetDemo,
    isMuted,
    toggleMute,
    setIsSearchOpen
  } = useSpectrum();

  return (
    <header className="h-16 border-b border-[#18274E] bg-[#070D1F]/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 font-mono">
      {/* Left: Branding & Core Workflow Tagline */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2">
          {/* Custom Vector RF Pulsing Logo (No raster images) */}
          <div className="w-8 h-8 rounded border border-cyan-500/50 bg-cyan-950/40 flex items-center justify-center relative overflow-hidden group">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform">
              <path d="M2 12h2l3-6 4 12 4-8 3 4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="absolute inset-0 bg-cyan-400/10 animate-pulse pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-wider">SPECTRUM<span className="text-cyan-400">X</span></span>
              {/* Mandatory Simulation / Demo Data Tag */}
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-amber-500/50 bg-amber-950/60 text-amber-300 font-semibold tracking-wider animate-pulse">
                SIMULATION / DEMO DATA
              </span>
            </div>
            {/* Core Workflow */}
            <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 font-sans">
              <span className="text-cyan-400 font-medium">Sense</span>
              <span className="text-slate-600">→</span>
              <span className="text-blue-400 font-medium">Classify</span>
              <span className="text-slate-600">→</span>
              <span className="text-amber-400 font-medium">Prioritize</span>
              <span className="text-slate-600">→</span>
              <span className="text-emerald-400 font-medium">Respond</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Live Monitoring Status Indicator */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wider">
            {isScanning ? '● LIVE MONITORING' : '○ SCANNER PAUSED'}
          </span>
        </div>

        {/* SIH Demo Mode Trigger Button */}
        <div className="flex items-center gap-1 bg-[#091228] p-1 rounded border border-cyan-500/40">
          {!demoActive ? (
            <button
              onClick={startDemo}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-600/30 hover:bg-cyan-500/50 border border-cyan-400/60 text-cyan-200 text-xs font-bold transition-all glow-cyan"
            >
              <Flame className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>START DEMO</span>
            </button>
          ) : (
            <>
              <span className="text-[11px] text-cyan-400 font-bold px-2">
                PHASE {demoPhase}/10
              </span>
              {demoPlaying ? (
                <button
                  onClick={pauseDemo}
                  title="Pause Demo Walkthrough"
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Pause className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={startDemo}
                  title="Resume Demo Walkthrough"
                  className="p-1 hover:bg-slate-800 rounded text-cyan-400"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={resetDemo}
                title="Reset Demo"
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right: Quick Controls, Search, Audio, Operator Menu */}
      <div className="flex items-center gap-2 lg:gap-3 text-xs">
        {/* Live Scan Toggle */}
        <button
          onClick={toggleScan}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors ${
            isScanning 
              ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40' 
              : 'border-amber-500/40 bg-amber-950/30 text-amber-400 hover:bg-amber-900/40'
          }`}
          title={isScanning ? "Pause live RF sweeps" : "Resume live RF sweeps"}
        >
          {isScanning ? <Activity className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isScanning ? 'PAUSE' : 'RESUME'}</span>
        </button>

        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 rounded border border-slate-800 hover:border-cyan-500/50 bg-[#091228] text-slate-300 hover:text-cyan-400 transition-colors"
          title="Search signals, frequencies, alerts (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Synthesized Audio Mute Toggle */}
        <button
          onClick={toggleMute}
          className="p-2 rounded border border-slate-800 hover:border-slate-700 bg-[#091228] text-slate-300 hover:text-white transition-colors"
          title={isMuted ? "Unmute Tactical Audio Cues" : "Mute Audio Cues"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
        </button>

        {/* Operator Profile Menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-slate-300">
          <div className="w-7 h-7 rounded-full border border-cyan-500/40 bg-cyan-950/60 flex items-center justify-center text-cyan-400">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="hidden xl:block text-left text-[11px] leading-tight">
            <div className="font-bold text-white">OPERATOR // SIH-01</div>
            <div className="text-[9px] text-slate-500">RF INTEL DESK</div>
          </div>
        </div>
      </div>
    </header>
  );
};
