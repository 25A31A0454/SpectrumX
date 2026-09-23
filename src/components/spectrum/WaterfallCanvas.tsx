import React, { useEffect, useRef } from 'react';
import { useSpectrum } from '../../context/SpectrumContext';
import { SpectrumPoint } from '../../types/spectrum';

interface WaterfallCanvasProps {
  height?: number;
  className?: string;
}

export const WaterfallCanvas: React.FC<WaterfallCanvasProps> = ({ 
  height = 160, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { spectrumData, isScanning } = useSpectrum();

  // Color mapper from dBm power (-110 to -30 dBm) to thermal RGB color
  const getPowerColor = (power: number): [number, number, number] => {
    // Normalize power between 0.0 (-110 dBm) and 1.0 (-30 dBm)
    const norm = Math.min(Math.max((power + 110) / 80, 0), 1);

    if (norm < 0.25) {
      // Dark navy to deep blue
      const t = norm / 0.25;
      return [Math.floor(5 + 10 * t), Math.floor(8 + 25 * t), Math.floor(17 + 80 * t)];
    } else if (norm < 0.5) {
      // Blue to cyan
      const t = (norm - 0.25) / 0.25;
      return [Math.floor(15 + 0 * t), Math.floor(33 + 207 * t), Math.floor(97 + 158 * t)];
    } else if (norm < 0.75) {
      // Cyan to yellow-orange
      const t = (norm - 0.5) / 0.25;
      return [Math.floor(0 + 245 * t), Math.floor(240 - 82 * t), Math.floor(255 - 244 * t)];
    } else {
      // Yellow-orange to intense red-hot
      const t = (norm - 0.75) / 0.25;
      return [Math.floor(245 + 10 * t), Math.floor(158 - 114 * t), Math.floor(11 + 33 * t)];
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const canvasHeight = canvas.height;

    // Shift previous image down by 1 row
    const existing = ctx.getImageData(0, 0, width, canvasHeight - 1);
    ctx.putImageData(existing, 0, 1);

    // Draw top row from current spectrum slice
    const lineImg = ctx.createImageData(width, 1);
    const dataLen = spectrumData.length;

    if (dataLen > 0) {
      for (let x = 0; x < width; x++) {
        // Map pixel x to spectrum point
        const dataIdx = Math.floor((x / width) * dataLen);
        const pt: SpectrumPoint = spectrumData[dataIdx] || { power: -102, frequency: 0 };
        const [r, g, b] = getPowerColor(pt.power);

        const pIdx = x * 4;
        lineImg.data[pIdx] = r;
        lineImg.data[pIdx + 1] = g;
        lineImg.data[pIdx + 2] = b;
        lineImg.data[pIdx + 3] = 255;
      }
    }

    ctx.putImageData(lineImg, 0, 0);
  }, [spectrumData, isScanning]);

  return (
    <div className={`relative rounded-sm border border-[#18274E] bg-[#050811] p-3 font-mono ${className}`}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white uppercase tracking-wider">
            Waterfall Spectrogram
          </span>
          <span className="text-[10px] text-slate-400">
            Time vs Frequency Heatmap
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span>T - 0s</span>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-slate-500">Low</span>
            <div className="w-16 h-2 rounded bg-gradient-to-r from-blue-900 via-cyan-400 via-yellow-400 to-red-500" />
            <span className="text-[9px] text-slate-500">High</span>
          </div>
          <span>T - 12s</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded bg-[#050811]">
        <canvas
          ref={canvasRef}
          width={640}
          height={height}
          className="w-full object-cover block"
        />

        {/* Scan line overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-cyan-400/5 to-transparent h-4 animate-scanline" />
      </div>

      {/* Frequency axis labels */}
      <div className="flex justify-between text-[10px] text-slate-500 pt-1 px-1">
        <span>0.1 GHz</span>
        <span>1.5 GHz</span>
        <span>3.0 GHz</span>
        <span>4.5 GHz</span>
        <span>6.0 GHz</span>
      </div>
    </div>
  );
};
