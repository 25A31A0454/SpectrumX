import React, { useState } from 'react';
import { useSpectrum } from '../context/SpectrumContext';
import { SpectrumChart } from '../components/spectrum/SpectrumChart';
import { WaterfallCanvas } from '../components/spectrum/WaterfallCanvas';
import { SpectrumControls } from '../components/spectrum/SpectrumControls';
import { ConstellationPlot } from '../components/spectrum/ConstellationPlot';
import { StatusBadge } from '../components/common/StatusBadge';
import { SignalModal } from '../components/common/SignalModal';
import { Signal } from '../types/spectrum';
import { Radio, Eye, Cpu } from 'lucide-react';

export const SpectrumPage: React.FC = () => {
  const { signals, selectedSignal, setSelectedSignal, setActiveTab, runAIAnalysis } = useSpectrum();
  const [modalSignal, setModalSignal] = useState<Signal | null>(null);

  const activeSignal = selectedSignal || signals[0];

  return (
    <div className="space-y-6 font-mono">
      {/* Top Controls Bar */}
      <SpectrumControls />

      {/* Main Spectrum Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): FFT Sweeper + Waterfall Spectrogram */}
        <div className="lg:col-span-2 space-y-6">
          {/* Large Real-Time Spectrum Chart */}
          <SpectrumChart 
            height={360} 
            onSelectSignal={(sig: Signal) => setSelectedSignal(sig)}
          />

          {/* HTML5 Canvas 2D Live Waterfall Spectrogram */}
          <WaterfallCanvas height={200} />
        </div>

        {/* Right Column: Selected Signal Telemetry & Constellation */}
        <div className="space-y-6">
          <div className="p-4 rounded-sm border border-[#18274E] bg-[#070D1F] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase tracking-wider text-xs">
                  Active Peak Inspector
                </span>
              </div>
              <StatusBadge status={activeSignal.status} size="sm" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-baseline justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Signal Identifier:</span>
                <span className="text-cyan-400 font-bold">{activeSignal.id}</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Center Frequency:</span>
                <span className="text-white font-bold">{activeSignal.frequency} GHz</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Signal Strength:</span>
                <span className="text-white font-bold">{activeSignal.strength} dBm</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Bandwidth:</span>
                <span className="text-white font-bold">{activeSignal.bandwidth} MHz</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Modulation:</span>
                <span className="text-cyan-300 font-bold">{activeSignal.modulation}</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Classification:</span>
                <span className="text-white">{activeSignal.type}</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">AI Confidence:</span>
                <span className="text-emerald-400 font-bold">{activeSignal.confidence}%</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Anomaly Index:</span>
                <span className={`${activeSignal.anomalyScore > 0.7 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {activeSignal.anomalyScore.toFixed(2)}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-slate-400">Array Bearing:</span>
                <span className="text-slate-200">{activeSignal.bearing ?? 0}° Azimuth</span>
              </div>
            </div>

            {/* Actions for Selected Signal */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={async () => {
                  setActiveTab('ai');
                  await runAIAnalysis(activeSignal.id);
                }}
                className="w-full py-2.5 px-3 rounded border border-cyan-500 bg-cyan-600/30 hover:bg-cyan-500/50 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 glow-cyan transition-all"
              >
                <Cpu className="w-4 h-4 text-cyan-300" />
                <span>ANALYZE WITH AI ENGINE</span>
              </button>
              <button
                onClick={() => setModalSignal(activeSignal)}
                className="w-full py-2 px-3 rounded border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs flex items-center justify-center gap-2"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>EXPAND FULL TELEMETRY</span>
              </button>
            </div>
          </div>

          {/* I/Q Constellation Plot */}
          <ConstellationPlot
            samples={activeSignal.iqSamples}
            modulation={activeSignal.modulation}
            status={activeSignal.status}
            size={220}
          />
        </div>
      </div>

      <SignalModal signal={modalSignal} onClose={() => setModalSignal(null)} />
    </div>
  );
};
