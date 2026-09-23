import React, { useState } from 'react';
import { Signal, XAIExplanation } from '../../types/spectrum';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  AlertTriangle, 
  Zap, 
  Activity, 
  FileCheck
} from 'lucide-react';

interface ExplainableAIPanelProps {
  signal: Signal;
  className?: string;
}

export const ExplainableAIPanel: React.FC<ExplainableAIPanelProps> = ({ 
  signal,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'reasoning' | 'baseline' | 'factors'>('reasoning');

  const xai: XAIExplanation = signal.xaiExplanation || {
    summary: 'Signal characteristics evaluated against baseline ITU-R national spectrum allocation rules.',
    baselineDelta: `Current power ${signal.strength} dBm vs local noise floor -102 dBm. Delta: +${(signal.strength - (-102)).toFixed(1)} dB.`,
    modulationAnomaly: `Modulation evaluated as ${signal.modulation}. Constellation purity: ${signal.confidence}%.`,
    temporalPattern: `Observation duration: ${signal.duration}. Intermittent transmission profile.`,
    recommendedAction: 'Maintain automated telemetry logging in standard registry.',
    factors: [
      { label: 'Frequency Allocation Compliance', score: 92, impact: 'critical' },
      { label: 'Spectral Power Spike', score: 88, impact: 'critical' },
      { label: 'Constellation Geometric Distortion', score: 85, impact: 'elevated' },
      { label: 'Temporal Duty Cycle Variance', score: 74, impact: 'moderate' },
    ],
  };

  return (
    <div className={`rounded-sm border border-[#18274E] bg-[#070D1F] font-mono text-xs overflow-hidden ${className}`}>
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#091228] hover:bg-[#0D1A38] transition-colors border-b border-slate-800"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="font-bold text-white uppercase tracking-wider block">
              Explainable AI (XAI) Attribution Engine
            </span>
            <span className="text-[11px] text-cyan-400 font-sans">
              Why was {signal.id} ({signal.frequency} GHz) classified as {signal.status.toUpperCase()}?
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[10px] uppercase font-semibold">
            {isOpen ? 'Collapse Reasoning' : 'Expand Reasoning'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Collapsible Body */}
      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Subtabs */}
          <div className="flex gap-2 border-b border-slate-800 pb-2 text-[11px]">
            <button
              onClick={() => setActiveTab('reasoning')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'reasoning'
                  ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Core Rationale
            </button>
            <button
              onClick={() => setActiveTab('baseline')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'baseline'
                  ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Spectral Mask & Baseline Delta
            </button>
            <button
              onClick={() => setActiveTab('factors')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'factors'
                  ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Feature Attribution Weights
            </button>
          </div>

          {/* Tab 1: Core Reasoning */}
          {activeTab === 'reasoning' && (
            <div className="space-y-3">
              <div className="p-3 rounded border border-slate-800 bg-[#060B18] space-y-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Executive Intelligence Summary
                </span>
                <p className="text-slate-200 leading-relaxed font-sans text-xs">
                  {xai.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded border border-slate-800 bg-[#060B18]">
                  <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5 mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Modulation Anomaly Vector
                  </span>
                  <p className="text-slate-300 text-[11px] font-sans">
                    {xai.modulationAnomaly}
                  </p>
                </div>

                <div className="p-3 rounded border border-slate-800 bg-[#060B18]">
                  <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    Temporal Activity Profile
                  </span>
                  <p className="text-slate-300 text-[11px] font-sans">
                    {xai.temporalPattern}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded border border-emerald-500/30 bg-emerald-950/20 text-emerald-300">
                <span className="text-[10px] uppercase font-bold flex items-center gap-1.5 mb-1">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Recommended Tactical Response
                </span>
                <p className="font-sans text-xs text-slate-200">
                  {xai.recommendedAction}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Baseline Comparison */}
          {activeTab === 'baseline' && (
            <div className="space-y-3">
              <div className="p-3 rounded border border-slate-800 bg-[#060B18] space-y-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Measured vs ITU-R Baseline Deviation
                </span>
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Baseline Mask</span>
                    <span className="text-slate-300 font-bold">-102.0 dBm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Observed Peak</span>
                    <span className="text-red-400 font-bold">{signal.strength} dBm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Surge Delta</span>
                    <span className="text-cyan-400 font-bold">+{(signal.strength - (-102)).toFixed(1)} dB</span>
                  </div>
                </div>
                <p className="text-slate-300 font-sans text-xs mt-2">
                  {xai.baselineDelta}
                </p>
              </div>

              {/* Spectral Mask comparison bar */}
              <div className="p-3 rounded border border-slate-800 bg-[#060B18] space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Emission Mask Compliance</span>
                  <span className="text-red-400 font-bold">NON-COMPLIANT (+29.4 dB Excess)</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded border border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 left-[65%] w-0.5 bg-red-500 z-10" />
                  <div className="w-[88%] h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500" />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>-100 dBm (Noise Floor)</span>
                  <span>-70 dBm (Max Regulatory Mask)</span>
                  <span>-40 dBm (Observed)</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Factor Attribution Weights */}
          {activeTab === 'factors' && (
            <div className="space-y-2.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                Deep Neural Feature Contribution (Integrated Gradients)
              </span>
              {xai.factors.map((factor, idx) => {
                const impactColor = 
                  factor.impact === 'critical' ? 'text-red-400' :
                  factor.impact === 'elevated' ? 'text-orange-400' :
                  factor.impact === 'moderate' ? 'text-yellow-400' : 'text-emerald-400';

                return (
                  <div key={idx} className="p-2.5 rounded border border-slate-800 bg-[#060B18] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 text-xs">{factor.label}</span>
                      <span className={`text-xs font-bold ${impactColor}`}>
                        {factor.score}% ({factor.impact.toUpperCase()})
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded overflow-hidden">
                      <div 
                        className={`h-full ${
                          factor.impact === 'critical' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' :
                          factor.impact === 'elevated' ? 'bg-orange-500' :
                          factor.impact === 'moderate' ? 'bg-yellow-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
