import React, { useState } from 'react';
import { useSpectrum } from '../../context/SpectrumContext';
import { StatusBadge } from '../common/StatusBadge';
import { AnomalyGauge } from '../common/AnomalyGauge';
import { ConstellationPlot } from '../spectrum/ConstellationPlot';
import { ExplainableAIPanel } from './ExplainableAIPanel';
import { AI_INFERENCE_STAGES } from '../../simulation/aiClassifier';
import { 
  Cpu, 
  Play, 
  Sparkles, 
  CheckCircle, 
  Activity, 
  History
} from 'lucide-react';

export const AIAnalysisWorkspace: React.FC = () => {
  const { 
    signals, 
    selectedSignal, 
    setSelectedSignal, 
    runAIAnalysis, 
    isAnalyzingSignal 
  } = useSpectrum();

  const [currentStageIndex, setCurrentStageIndex] = useState<number>(4);

  const signal = selectedSignal || signals[0];

  const handleRunAnalysis = async () => {
    if (!signal) return;
    // Step through the simulated pipeline stages
    setCurrentStageIndex(0);
    const stepInterval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < 4) return prev + 1;
        clearInterval(stepInterval);
        return 4;
      });
    }, 280);

    await runAIAnalysis(signal.id);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner: AI Engine Status & Signal Selector */}
      <div className="p-4 rounded-sm border border-cyan-500/30 bg-[#070D1F] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                SpectrumX Deep Neural RF Engine
              </h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-amber-500/40 bg-amber-950/50 text-amber-300 font-bold">
                AI SIMULATION
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Model: ResNet-RF + Transformer Constellation Classifier (Trained on 1.2M RF Bursts)
            </p>
          </div>
        </div>

        {/* Signal Target Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Target Signal:</span>
          <select
            value={signal?.id}
            onChange={(e) => {
              const found = signals.find((s) => s.id === e.target.value);
              if (found) setSelectedSignal(found);
            }}
            className="py-1.5 px-3 rounded border border-slate-700 bg-[#060B18] text-slate-200 text-xs font-bold outline-none focus:border-cyan-400"
          >
            {signals.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                {s.id} — {s.frequency} GHz ({s.status})
              </option>
            ))}
          </select>

          {/* Prominent Run AI Analysis Button */}
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzingSignal}
            className="flex items-center gap-2 py-2 px-5 rounded border border-cyan-400 bg-cyan-600/30 hover:bg-cyan-500/50 text-cyan-200 font-bold text-xs transition-all shadow-lg glow-cyan disabled:opacity-50"
          >
            {isAnalyzingSignal ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                <span>INFERENCE IN PROGRESS...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-cyan-300 fill-cyan-300" />
                <span>RUN AI ANALYSIS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Multi-stage Inference Pipeline Bar */}
      <div className="p-4 rounded-sm border border-[#18274E] bg-[#091024]">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Neural Inference Pipeline Stages
          </span>
          <span className="text-[10px] text-cyan-400">
            {isAnalyzingSignal ? 'Processing Frame Batch...' : 'Inference Ready'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {AI_INFERENCE_STAGES.map((stg, idx) => {
            const isDone = currentStageIndex >= idx;
            const isCurrent = currentStageIndex === idx && isAnalyzingSignal;

            return (
              <div
                key={stg.stage}
                className={`p-2.5 rounded border transition-all ${
                  isCurrent
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 glow-cyan animate-pulse'
                    : isDone
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                    : 'border-slate-800 bg-[#060B18] text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold">STAGE 0{stg.stage}</span>
                  {isDone ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
                <div className="text-[11px] font-bold truncate text-white">{stg.name}</div>
                <div className="text-[9px] text-slate-400 font-sans truncate mt-0.5">{stg.detail}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Classification & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Classification Output Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-sm border border-[#18274E] bg-[#070D1F] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                  Classification Inference Output
                </span>
                <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                  <span>{signal.id}</span>
                  <span className="text-cyan-400">@ {signal.frequency} GHz</span>
                </h3>
              </div>
              <StatusBadge status={signal.status} size="lg" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded border border-slate-800 bg-[#060B18]">
                <span className="text-slate-400 text-[10px] block mb-1">Signal Type</span>
                <span className="text-white font-bold text-sm">{signal.type}</span>
              </div>
              <div className="p-3 rounded border border-slate-800 bg-[#060B18]">
                <span className="text-slate-400 text-[10px] block mb-1">Modulation</span>
                <span className="text-cyan-400 font-bold text-sm">{signal.modulation}</span>
              </div>
              <div className="p-3 rounded border border-slate-800 bg-[#060B18]">
                <span className="text-slate-400 text-[10px] block mb-1">RF Bandwidth</span>
                <span className="text-white font-bold text-sm">{signal.bandwidth} MHz</span>
              </div>
              <div className="p-3 rounded border border-slate-800 bg-[#060B18]">
                <span className="text-slate-400 text-[10px] block mb-1">Power Level</span>
                <span className="text-white font-bold text-sm">{signal.strength} dBm</span>
              </div>
            </div>

            {/* Confidence Gauge Bar */}
            <div className="p-3 rounded border border-slate-800 bg-[#060B18] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">AI Confidence Level</span>
                <span className="text-emerald-400 font-bold text-sm text-glow-cyan">
                  {signal.confidence}% Confidence
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_12px_#00f0ff]"
                  style={{ width: `${signal.confidence}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% (Uncertain)</span>
                <span>50%</span>
                <span>100% (High Confidence)</span>
              </div>
            </div>

            {/* Anomaly Gauge */}
            <AnomalyGauge score={signal.anomalyScore} status={signal.status} />
          </div>

          {/* Explainable AI Collapsible Panel */}
          <ExplainableAIPanel signal={signal} />
        </div>

        {/* Right Column: I/Q Constellation & Detection Timeline */}
        <div className="space-y-6">
          {/* I/Q Constellation Plot */}
          <ConstellationPlot
            samples={signal.iqSamples}
            modulation={signal.modulation}
            status={signal.status}
            size={240}
          />

          {/* Signal Detection Historical Timeline */}
          <div className="p-4 rounded-sm border border-[#18274E] bg-[#070D1F] space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-cyan-400" />
                Signal Timeline
              </span>
              <span className="text-[10px] text-slate-400">{signal.duration} active</span>
            </div>

            <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-2 before:w-[1px] before:bg-slate-800">
              <div className="flex items-start gap-3 pl-5 relative">
                <span className="absolute left-1 top-1 w-2 h-2 rounded-full bg-emerald-400" />
                <div>
                  <div className="text-white font-bold">First Carrier Ingestion</div>
                  <div className="text-[10px] text-slate-400">{signal.firstDetected} — Power -98 dBm</div>
                </div>
              </div>

              <div className="flex items-start gap-3 pl-5 relative">
                <span className="absolute left-1 top-1 w-2 h-2 rounded-full bg-cyan-400" />
                <div>
                  <div className="text-white font-bold">FFT Peak Recognized</div>
                  <div className="text-[10px] text-slate-400">Power surged to {signal.strength} dBm</div>
                </div>
              </div>

              <div className="flex items-start gap-3 pl-5 relative">
                <span className={`absolute left-1 top-1 w-2 h-2 rounded-full ${
                  signal.status === 'Anomalous' ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
                }`} />
                <div>
                  <div className="text-white font-bold">AI Classification Verdict</div>
                  <div className="text-[10px] text-slate-400">
                    {signal.lastDetected} — {signal.status.toUpperCase()} ({signal.confidence}% confidence)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
