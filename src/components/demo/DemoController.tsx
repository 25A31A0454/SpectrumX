import React from 'react';
import { useSpectrum } from '../../context/SpectrumContext';
import { DEMO_PHASES_META } from '../../simulation/demoWorkflow';
import { DemoPhase } from '../../types/spectrum';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Info
} from 'lucide-react';

export const DemoController: React.FC = () => {
  const { 
    demoActive, 
    demoPlaying, 
    demoPhase, 
    startDemo, 
    pauseDemo, 
    resetDemo, 
    nextDemoPhase, 
    prevDemoPhase,
    jumpToDemoPhase,
    setActiveTab
  } = useSpectrum();

  if (!demoActive) return null;

  const currentMeta = DEMO_PHASES_META[demoPhase];

  return (
    <div className="rounded-sm border border-cyan-500/60 bg-[#091228] p-4 font-mono text-xs shadow-2xl relative overflow-hidden animate-fadeIn glow-cyan">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-400">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider text-sm">
                SIH Guided Demonstration Controller
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border border-cyan-400 bg-cyan-950/60 text-cyan-300">
                Phase {demoPhase} of 10
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-300 bg-amber-950/40">
                {demoPlaying ? 'AUTO-ADVANCING (3.8s)' : 'PAUSED'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevDemoPhase}
            disabled={demoPhase === 1}
            className="p-1.5 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30"
            title="Previous Phase"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {demoPlaying ? (
            <button
              onClick={pauseDemo}
              className="px-3 py-1.5 rounded border border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 flex items-center gap-1.5 font-bold"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSE</span>
            </button>
          ) : (
            <button
              onClick={startDemo}
              className="px-3 py-1.5 rounded border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 flex items-center gap-1.5 font-bold"
            >
              <Play className="w-3.5 h-3.5" />
              <span>RESUME</span>
            </button>
          )}

          <button
            onClick={nextDemoPhase}
            disabled={demoPhase === 10}
            className="p-1.5 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30"
            title="Next Phase"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={resetDemo}
            className="p-1.5 rounded border border-slate-700 bg-slate-900 text-slate-400 hover:text-white ml-2"
            title="Exit & Reset Demo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Step Description Card */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-3 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold text-sm tracking-wide">
              {currentMeta.title}
            </span>
          </div>
          <p className="text-slate-300 text-xs font-sans leading-relaxed">
            {currentMeta.description}
          </p>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 pt-1">
            <Info className="w-3.5 h-3.5" />
            <span>{currentMeta.actionHint}</span>
          </div>
        </div>

        {/* Quick jump to page where action is happening */}
        <div className="flex flex-col gap-2 border-l border-slate-800 pl-4">
          <span className="text-[10px] text-slate-400 uppercase">Quick Jump:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500 text-[11px] text-slate-300"
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('spectrum')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500 text-[11px] text-slate-300"
            >
              Spectrum
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500 text-[11px] text-slate-300"
            >
              AI Engine
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500 text-[11px] text-slate-300"
            >
              Alerts
            </button>
          </div>
        </div>
      </div>

      {/* 10-Phase Stepper Track */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="grid grid-cols-10 gap-1 text-center">
          {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as DemoPhase[]).map((p) => {
            const isCompleted = demoPhase > p;
            const isCurrent = demoPhase === p;
            return (
              <button
                key={p}
                onClick={() => jumpToDemoPhase(p)}
                className={`py-1.5 rounded transition-all ${
                  isCurrent
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_#00f0ff]'
                    : isCompleted
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60'
                    : 'bg-slate-900 border border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
                title={`Jump to Phase ${p}: ${DEMO_PHASES_META[p].title}`}
              >
                <div className="text-[10px] font-bold">P{p}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
