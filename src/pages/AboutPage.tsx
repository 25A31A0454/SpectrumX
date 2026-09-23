import React from 'react';
import { 
  Cpu, 
  ShieldAlert, 
  Workflow, 
  Award, 
  Rocket, 
  Activity
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const workflowSteps = [
    { title: 'RF Environment', desc: 'Over-the-air electromagnetic spectrum spanning 0.1 to 6.0 GHz.', tag: 'Physical' },
    { title: 'SDR / Sensor', desc: 'Software-Defined Radio downconverts and digitizes raw I/Q samples.', tag: 'Hardware' },
    { title: 'Spectrum Sensing', desc: 'High-speed wideband FFT algorithm computes power spectral density.', tag: 'DSP' },
    { title: 'Signal Processing', desc: 'Peak detection, bandwidth extraction, and burst parameter estimation.', tag: 'Analysis' },
    { title: 'AI Classification', desc: 'Deep ResNet-RF + Transformer neural model classifies modulation.', tag: 'Neural AI' },
    { title: 'Anomaly Detection', desc: 'Spectral mask correlation & cyclostationary anomaly evaluation.', tag: 'Inference' },
    { title: 'Priority Engine', desc: 'Multi-criteria scoring: High, Suspicious, Monitor, or Normal.', tag: 'Triage' },
    { title: 'Operator Dashboard', desc: 'Real-time telemetry, Explainable AI insights, and alert dispatch.', tag: 'Console' },
  ];

  return (
    <div className="space-y-8 font-mono max-w-5xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="p-6 rounded-sm border border-cyan-500/40 bg-gradient-to-b from-[#091430] to-[#060B18] shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white tracking-wider">
                SPECTRUM<span className="text-cyan-400">X</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded border border-cyan-400/50 bg-cyan-950/60 text-cyan-300 font-bold">
                SIH PROTOTYPE
              </span>
            </div>
            <h1 className="text-lg font-bold text-cyan-300 mt-1">
              AI-Powered Spectrum Intelligence Platform
            </h1>
            <p className="text-xs text-slate-300 font-sans mt-2 max-w-2xl leading-relaxed">
              Sense → Classify → Prioritize → Respond. SpectrumX combines Software-Defined Radio capabilities with deep neural RF classification to defend critical radio spectrum infrastructure against unauthorized transmissions, spoofing, and interference.
            </p>
          </div>

          <div className="p-3 rounded border border-amber-500/40 bg-amber-950/30 text-amber-300 text-xs max-w-xs font-sans">
            <span className="font-bold font-mono block text-amber-400 mb-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              PROTOTYPE NOTICE
            </span>
            This Smart India Hackathon prototype operates with a high-fidelity synthetic RF simulation engine. Direct physical SDR driver integration (RTL-SDR, HackRF, USRP) is the direct stage-2 production roadmap.
          </div>
        </div>
      </div>

      {/* Problem & Solution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem */}
        <div className="p-5 rounded-sm border border-red-500/30 bg-[#070D1F] space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>The Spectrum Challenge</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            The electromagnetic spectrum is congested, critical, and vulnerable. Illegal transmitters, drone control links, GPS spoofing, and uncoordinated commercial broadcasts can compromise aviation, emergency response, and national defense. Manual spectrum auditing with legacy spectrum analyzers is slow, labor-intensive, and fails to catch brief intermittent bursts.
          </p>
        </div>

        {/* Solution */}
        <div className="p-5 rounded-sm border border-emerald-500/30 bg-[#070D1F] space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase">
            <Award className="w-4 h-4" />
            <span>The SpectrumX Solution</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            SpectrumX automates the entire electronic-spectrum surveillance loop. By fusing wideband real-time sensing with explainable AI signal classification, it spots anomalies in milliseconds, grades threat severity, and arms operators with attribution factors and bearing vectors before interference disrupts operations.
          </p>
        </div>
      </div>

      {/* Architectural Workflow Diagram (Required Flowchart) */}
      <div className="p-6 rounded-sm border border-[#18274E] bg-[#070D1F] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white uppercase tracking-wider text-sm">
              End-to-End Operational Architecture
            </span>
          </div>
          <span className="text-[11px] text-cyan-400">
            Pipeline Throughput: &lt; 25 ms
          </span>
        </div>

        {/* Step Flowchart Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded border border-slate-800 bg-[#060B18] space-y-2 relative group hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-cyan-400 font-bold">STAGE 0{idx + 1}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-400">
                  {step.tag}
                </span>
              </div>
              <h3 className="font-bold text-white text-xs tracking-wide">
                {step.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-sans leading-snug">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology & Benefits Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technology Stack */}
        <div className="p-5 rounded-sm border border-[#18274E] bg-[#070D1F] space-y-4">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Technology Stack
          </span>
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded border border-slate-800 bg-[#060B18]">
              <strong className="text-cyan-400 block">Frontend & Visualization:</strong>
              <span className="text-slate-300 font-sans text-[11px]">React 18, TypeScript, Tailwind CSS, Recharts, HTML5 Canvas 2D Waterfall Spectrogram</span>
            </div>
            <div className="p-2.5 rounded border border-slate-800 bg-[#060B18]">
              <strong className="text-cyan-400 block">AI & Signal Processing:</strong>
              <span className="text-slate-300 font-sans text-[11px]">ResNet-RF + Transformer Constellation Classifier, Cyclostationary Feature Cumulants, Explainable AI (XAI)</span>
            </div>
            <div className="p-2.5 rounded border border-slate-800 bg-[#060B18]">
              <strong className="text-cyan-400 block">Audio Synthesis:</strong>
              <span className="text-slate-300 font-sans text-[11px]">Client-side Web Audio API synthesizer for zero-asset tactical audio alerts</span>
            </div>
          </div>
        </div>

        {/* Future Scope & Hardware Integration */}
        <div className="p-5 rounded-sm border border-[#18274E] bg-[#070D1F] space-y-4">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-400" />
            Future Scope & Roadmap
          </span>
          <ul className="space-y-2 text-xs text-slate-300 font-sans list-disc list-inside">
            <li><strong className="text-white font-mono">Hardware SDR Drivers:</strong> Plug-and-play support for RTL-SDR v4, HackRF One, and Ettus USRP via WebUSB / Native C++ DAQ daemon.</li>
            <li><strong className="text-white font-mono">Direction Finding (DF) Array:</strong> Multi-antenna interferometer phase array for automatic angle-of-arrival (AoA) bearing localization.</li>
            <li><strong className="text-white font-mono">Decentralized Mesh:</strong> Distributed sensor nodes synchronized over PTP (Precision Time Protocol) for Time-Difference-of-Arrival (TDoA) emitter geolocation.</li>
            <li><strong className="text-white font-mono">Automated Regulatory Filing:</strong> One-click generation of ITU and WPC violation dossiers with cryptographic RF packet timestamps.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
