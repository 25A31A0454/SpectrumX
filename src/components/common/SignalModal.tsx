import React from 'react';
import { Signal } from '../../types/spectrum';
import { StatusBadge } from './StatusBadge';
import { ConstellationPlot } from '../spectrum/ConstellationPlot';
import { X, Cpu, Radio, ShieldAlert, Compass, Clock, Zap } from 'lucide-react';
import { useSpectrum } from '../../context/SpectrumContext';

interface SignalModalProps {
  signal: Signal | null;
  onClose: () => void;
}

export const SignalModal: React.FC<SignalModalProps> = ({ signal, onClose }) => {
  const { runAIAnalysis, setActiveTab, setSelectedSignal, isAnalyzingSignal } = useSpectrum();

  if (!signal) return null;

  const handleRunAI = async () => {
    setSelectedSignal(signal);
    setActiveTab('ai');
    onClose();
    await runAIAnalysis(signal.id);
  };

  const handleViewSpectrum = () => {
    setSelectedSignal(signal);
    setActiveTab('spectrum');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#091024] border border-cyan-500/40 rounded-sm shadow-2xl p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Technical decorative borders */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-cyan-950/50 border border-cyan-500/40 text-cyan-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-bold text-white tracking-wide">
                  {signal.id} — {signal.frequency} {signal.frequencyUnit}
                </span>
                <StatusBadge status={signal.status} size="sm" />
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {signal.location} • Bearing {signal.bearing ?? 0}°
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Left Column: Telemetry */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded border border-slate-800 bg-[#060B18]">
              <span className="text-slate-400 block text-[10px] uppercase mb-1">RF Characteristics</span>
              <div className="grid grid-cols-2 gap-2 text-slate-200">
                <div>Frequency: <span className="text-cyan-400 font-bold">{signal.frequency} GHz</span></div>
                <div>Bandwidth: <span className="text-slate-100 font-bold">{signal.bandwidth} MHz</span></div>
                <div>Strength: <span className="text-slate-100 font-bold">{signal.strength} dBm</span></div>
                <div>Modulation: <span className="text-slate-100 font-bold">{signal.modulation}</span></div>
                <div>Type: <span className="text-slate-100">{signal.type}</span></div>
                <div>Priority: <span className="text-cyan-400">{signal.priority}</span></div>
              </div>
            </div>

            <div className="p-3 rounded border border-slate-800 bg-[#060B18]">
              <span className="text-slate-400 block text-[10px] uppercase mb-1">AI Intelligence Vector</span>
              <div className="grid grid-cols-2 gap-2 text-slate-200">
                <div>AI Confidence: <span className="text-emerald-400 font-bold">{signal.confidence}%</span></div>
                <div>Anomaly Score: <span className={`${signal.anomalyScore > 0.7 ? 'text-red-400 font-bold' : 'text-slate-200'}`}>{signal.anomalyScore.toFixed(2)}</span></div>
              </div>
            </div>

            <div className="p-3 rounded border border-slate-800 bg-[#060B18] text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>First Detected: <strong className="text-slate-200">{signal.firstDetected}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Duration Active: <strong className="text-slate-200">{signal.duration}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Array Azimuth: <strong className="text-slate-200">{signal.bearing ?? 0}° True North</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: I/Q Constellation & XAI Insight */}
          <div className="flex flex-col justify-between">
            <ConstellationPlot
              samples={signal.iqSamples}
              modulation={signal.modulation}
              status={signal.status}
              size={180}
            />

            {signal.xaiExplanation && (
              <div className="mt-3 p-3 rounded border border-red-500/30 bg-red-950/20 text-xs">
                <div className="flex items-center gap-1.5 text-red-400 font-mono font-semibold mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>XAI Alert Insight</span>
                </div>
                <p className="text-slate-300 text-[11px] line-clamp-2">
                  {signal.xaiExplanation.summary}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 font-mono text-xs">
          <button
            onClick={handleViewSpectrum}
            className="px-3.5 py-2 rounded border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Open in Spectrum</span>
          </button>
          <button
            onClick={handleRunAI}
            disabled={isAnalyzingSignal}
            className="px-4 py-2 rounded border border-cyan-500 bg-cyan-600/30 hover:bg-cyan-500/50 text-cyan-200 font-bold transition-all flex items-center gap-2 glow-cyan"
          >
            <Cpu className="w-4 h-4 text-cyan-300" />
            <span>{isAnalyzingSignal ? 'Analyzing...' : 'Run AI Analysis'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
