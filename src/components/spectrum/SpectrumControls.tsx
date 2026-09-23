import React from 'react';
import { useSpectrum } from '../../context/SpectrumContext';
import { Play, Pause, RotateCcw, Sliders, Radio } from 'lucide-react';

export const SpectrumControls: React.FC = () => {
  const { 
    isScanning, 
    startScan, 
    stopScan, 
    selectedBand, 
    setSelectedBand,
    resetDemo,
    systemHealth
  } = useSpectrum();

  const bands = [
    { id: '0.1-6.0', label: 'Wideband (0.1–6.0 GHz)' },
    { id: '0.1-1.0', label: 'VHF/UHF (100–1000 MHz)' },
    { id: '1.0-3.0', label: 'L/S Band (1.0–3.0 GHz)' },
    { id: '3.0-6.0', label: 'C Band (3.0–6.0 GHz)' },
    { id: '2.4-ism', label: '2.4 GHz ISM Band' },
    { id: '5.8-ism', label: '5.8 GHz ISM / UNII' },
  ];

  return (
    <div className="p-4 rounded-sm border border-[#18274E] bg-[#070D1F] font-mono text-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>SDR RF Sweep Controls</span>
        </div>
        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {systemHealth.sdrDevice}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Scan Actions */}
        <div>
          <label className="text-slate-400 text-[10px] uppercase block mb-1">
            Sweep State
          </label>
          <div className="flex gap-2">
            {isScanning ? (
              <button
                onClick={stopScan}
                className="flex-1 py-2 px-3 rounded border border-amber-500/50 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>STOP SCAN</span>
              </button>
            ) : (
              <button
                onClick={startScan}
                className="flex-1 py-2 px-3 rounded border border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>START SCAN</span>
              </button>
            )}
            <button
              onClick={resetDemo}
              title="Reset Sweep & Signals"
              className="p-2 rounded border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Frequency Range Band Selector */}
        <div>
          <label className="text-slate-400 text-[10px] uppercase block mb-1">
            Frequency Range
          </label>
          <select
            value={selectedBand}
            onChange={(e) => setSelectedBand(e.target.value)}
            className="w-full py-2 px-2.5 rounded border border-slate-800 bg-[#060B18] text-slate-200 outline-none focus:border-cyan-500 font-mono text-xs cursor-pointer"
          >
            {bands.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-900 text-slate-200">
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* RF Gain Control */}
        <div>
          <label className="text-slate-400 text-[10px] uppercase block mb-1">
            RF Front-End Gain
          </label>
          <select
            defaultValue="auto"
            className="w-full py-2 px-2.5 rounded border border-slate-800 bg-[#060B18] text-slate-200 outline-none focus:border-cyan-500 font-mono text-xs"
          >
            <option value="auto">AGC (Auto Gain Control)</option>
            <option value="low">+18 dB (Low Noise)</option>
            <option value="med">+34 dB (Balanced)</option>
            <option value="high">+48 dB (Maximum Sensitivity)</option>
          </select>
        </div>

        {/* Resolution Bandwidth (RBW) */}
        <div>
          <label className="text-slate-400 text-[10px] uppercase block mb-1">
            Resolution Bandwidth (RBW)
          </label>
          <div className="flex items-center gap-2 py-2 px-3 rounded border border-slate-800 bg-[#060B18] text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>100 kHz (FFT 8192)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
