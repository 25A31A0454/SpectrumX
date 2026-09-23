import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Signal, 
  Alert, 
  SpectrumPoint, 
  SystemHealth, 
  DemoPhase, 
  NavTab 
} from '../types/spectrum';
import { INITIAL_SIGNALS, generateSpectrumFFT, generateIQPoints } from '../simulation/rfEngine';
import { analyzeSignalAI } from '../simulation/aiClassifier';
import { soundFx } from '../utils/audioSynth';

interface SpectrumContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  signals: Signal[];
  selectedSignal: Signal | null;
  setSelectedSignal: (sig: Signal | null) => void;
  spectrumData: SpectrumPoint[];
  isScanning: boolean;
  startScan: () => void;
  stopScan: () => void;
  toggleScan: () => void;
  selectedBand: string;
  setSelectedBand: (band: string) => void;
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  resolveAlert: (alertId: string) => void;
  clearDemoAlerts: () => void;
  priorityCounts: { High: number; Suspicious: number; Monitor: number; Normal: number };
  systemHealth: SystemHealth;
  // Demo Mode
  demoActive: boolean;
  demoPlaying: boolean;
  demoPhase: DemoPhase;
  startDemo: () => void;
  pauseDemo: () => void;
  resetDemo: () => void;
  nextDemoPhase: () => void;
  prevDemoPhase: () => void;
  jumpToDemoPhase: (phase: DemoPhase) => void;
  // AI Analysis trigger
  runAIAnalysis: (signalId: string) => Promise<Signal>;
  isAnalyzingSignal: boolean;
  // Audio & UI
  isMuted: boolean;
  toggleMute: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const SpectrumContext = createContext<SpectrumContextType | undefined>(undefined);

export const SpectrumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [signals, setSignals] = useState<Signal[]>(INITIAL_SIGNALS);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(INITIAL_SIGNALS[2]); // SIG-003 by default
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [selectedBand, setSelectedBand] = useState<string>('0.1-6.0'); // GHz
  const [isAnalyzingSignal, setIsAnalyzingSignal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Initial alerts
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'ALT-1082',
      signalId: 'SIG-003',
      severity: 'High',
      type: 'Anomalous Signal Burst',
      frequency: 3.72,
      frequencyUnit: 'GHz',
      strength: -41,
      bandwidth: 20,
      modulation: 'Unknown Modulation',
      confidence: 91,
      timestamp: '10:33:05',
      status: 'Active',
      location: 'Sector 4 (Perimeter Array)',
    },
    {
      id: 'ALT-1081',
      signalId: 'SIG-007',
      severity: 'Suspicious',
      type: 'EIRP Mask Exceedance',
      frequency: 5.80,
      frequencyUnit: 'GHz',
      strength: -52,
      bandwidth: 20,
      modulation: 'Proprietary OFDM',
      confidence: 83,
      timestamp: '10:38:20',
      status: 'Active',
      location: 'Sector 5 (Suburban Outpost)',
    },
    {
      id: 'ALT-1080',
      signalId: 'SIG-004',
      severity: 'Suspicious',
      type: 'Radar PRI Jitter',
      frequency: 2.91,
      frequencyUnit: 'GHz',
      strength: -56,
      bandwidth: 8,
      modulation: 'Linear FMCW Chirp',
      confidence: 88,
      timestamp: '10:28:45',
      status: 'Investigating',
      location: 'Sector 3 (Coastal Radar)',
    },
    {
      id: 'ALT-1079',
      signalId: 'SIG-008',
      severity: 'Monitor',
      type: 'Telemetry Drift',
      frequency: 0.433,
      frequencyUnit: 'GHz',
      strength: -74,
      bandwidth: 0.25,
      modulation: 'FSK Narrowband',
      confidence: 89,
      timestamp: '10:19:50',
      status: 'Active',
      location: 'Industrial telemetry grid',
    },
  ]);

  // System Health
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    sdrDevice: 'RTI SDR / USB 3.0',
    sdrStatus: 'ONLINE',
    scannerStatus: 'ACTIVE',
    scanRange: '0.1 – 6.0 GHz',
    aiEngineStatus: 'ONLINE',
    aiModelVersion: 'SpectrumX AI v1.0 (ResNet-RF)',
    dbStatus: 'ONLINE',
    dbEngine: 'SQLite / Local Storage',
    uptimeSeconds: 14280,
    scanRateHz: 48.5,
    signalsProcessed: 12847,
    aiAnalysesPerformed: 183,
    alertsGenerated: 4,
  });

  // Demo Mode State
  const [demoActive, setDemoActive] = useState<boolean>(false);
  const [demoPlaying, setDemoPlaying] = useState<boolean>(false);
  const [demoPhase, setDemoPhase] = useState<DemoPhase>(1);

  // Frequency range bounds
  const [minFreq, maxFreq] = useMemo(() => {
    switch (selectedBand) {
      case '0.1-1.0': return [0.1, 1.0];
      case '1.0-3.0': return [1.0, 3.0];
      case '3.0-6.0': return [3.0, 6.0];
      case '2.4-ism': return [2.35, 2.55];
      case '5.8-ism': return [5.10, 5.90];
      default: return [0.1, 6.0];
    }
  }, [selectedBand]);

  // Spectrum FFT Data State
  const [spectrumData, setSpectrumData] = useState<SpectrumPoint[]>(() => 
    generateSpectrumFFT(signals, minFreq, maxFreq, 160)
  );

  // Periodically refresh spectrum if scanning is active
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setSpectrumData(generateSpectrumFFT(signals, minFreq, maxFreq, 160));
      setSystemHealth(prev => ({
        ...prev,
        uptimeSeconds: prev.uptimeSeconds + 1,
        signalsProcessed: prev.signalsProcessed + Math.floor(Math.random() * 3),
      }));
    }, 800);
    return () => clearInterval(interval);
  }, [isScanning, signals, minFreq, maxFreq]);

  // Priority counts dynamic calculation
  const priorityCounts = useMemo(() => {
    const counts = { High: 0, Suspicious: 0, Monitor: 0, Normal: 0 };
    signals.forEach(s => {
      if (counts[s.priority] !== undefined) {
        counts[s.priority]++;
      }
    });
    return counts;
  }, [signals]);

  const startScan = useCallback(() => {
    setIsScanning(true);
    setSystemHealth(prev => ({ ...prev, scannerStatus: 'ACTIVE' }));
    soundFx.playClick();
  }, []);

  const stopScan = useCallback(() => {
    setIsScanning(false);
    setSystemHealth(prev => ({ ...prev, scannerStatus: 'PAUSED' }));
    soundFx.playClick();
  }, []);

  const toggleScan = useCallback(() => {
    if (isScanning) stopScan();
    else startScan();
  }, [isScanning, startScan, stopScan]);

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
  }, [isMuted]);

  const addAlert = useCallback((alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
    setSystemHealth(prev => ({ ...prev, alertsGenerated: prev.alertsGenerated + 1 }));
    soundFx.playAlert();
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    soundFx.playClick();
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Resolved' } : a));
  }, []);

  const clearDemoAlerts = useCallback(() => {
    soundFx.playClick();
    setAlerts(prev => prev.filter(a => a.status !== 'Resolved'));
  }, []);

  // Run AI Analysis Simulation
  const runAIAnalysis = useCallback(async (signalId: string): Promise<Signal> => {
    setIsAnalyzingSignal(true);
    soundFx.playClick();

    // Find the signal
    const target = signals.find(s => s.id === signalId) || signals[0];
    
    // Simulate pipeline latency
    await new Promise(resolve => setTimeout(resolve, 1400));

    const analysis = analyzeSignalAI(target);
    const updatedSignal: Signal = {
      ...target,
      modulation: analysis.modulation,
      type: analysis.type,
      confidence: analysis.confidence,
      anomalyScore: analysis.anomalyScore,
      priority: analysis.priority,
      status: analysis.status,
      xaiExplanation: analysis.xaiExplanation,
      iqSamples: generateIQPoints(analysis.modulation.split(' ')[0]),
    };

    setSignals(prev => prev.map(s => s.id === target.id ? updatedSignal : s));
    setSelectedSignal(updatedSignal);
    setIsAnalyzingSignal(false);
    setSystemHealth(prev => ({ ...prev, aiAnalysesPerformed: prev.aiAnalysesPerformed + 1 }));
    soundFx.playAIInference();

    return updatedSignal;
  }, [signals]);

  // Demo Phase State Controller Handler
  const applyDemoPhase = useCallback((phase: DemoPhase) => {
    setDemoPhase(phase);
    switch (phase) {
      case 1: {
        // Normal state: SIG-003 is dormant or subdued
        setSignals(prev => prev.map(s => {
          if (s.id === 'SIG-003') {
            return {
              ...s,
              strength: -98,
              anomalyScore: 0.1,
              status: 'Normal',
              priority: 'Normal',
              modulation: 'Noise Carrier',
            };
          }
          return s;
        }));
        break;
      }
      case 2: {
        // Signal emerges at 3.72 GHz
        soundFx.playSignalDetected();
        setSignals(prev => prev.map(s => {
          if (s.id === 'SIG-003') {
            return {
              ...s,
              strength: -41,
              status: 'Monitor',
              priority: 'Monitor',
            };
          }
          return s;
        }));
        break;
      }
      case 3: {
        // SIGNAL DETECTED notification
        soundFx.playSignalDetected();
        const target = signals.find(s => s.id === 'SIG-003');
        if (target) setSelectedSignal(target);
        break;
      }
      case 4: {
        // AI analysis in progress
        setIsAnalyzingSignal(true);
        break;
      }
      case 5: {
        // AI analysis completed: Unknown modulation, 91% confidence
        setIsAnalyzingSignal(false);
        soundFx.playAIInference();
        setSignals(prev => prev.map(s => {
          if (s.id === 'SIG-003') {
            return {
              ...s,
              modulation: 'Unknown Modulation',
              type: 'Digital Burst',
              confidence: 91,
            };
          }
          return s;
        }));
        break;
      }
      case 6: {
        // Anomaly score increases
        setSignals(prev => prev.map(s => {
          if (s.id === 'SIG-003') {
            return {
              ...s,
              anomalyScore: 0.91,
              status: 'Suspicious',
              priority: 'Suspicious',
            };
          }
          return s;
        }));
        break;
      }
      case 7: {
        // Signal becomes ANOMALOUS
        setSignals(prev => prev.map(s => {
          if (s.id === 'SIG-003') {
            return {
              ...s,
              status: 'Anomalous',
            };
          }
          return s;
        }));
        break;
      }
      case 8: {
        // Priority becomes HIGH
        soundFx.playAlert();
        setSignals(prev => prev.map(s => {
          if (s.id === 'SIG-003') {
            return {
              ...s,
              priority: 'High',
            };
          }
          return s;
        }));
        break;
      }
      case 9: {
        // Generate HIGH PRIORITY ALERT
        soundFx.playAlert();
        const alertExists = alerts.some(a => a.id === 'ALT-DEMO-001');
        if (!alertExists) {
          const newAlert: Alert = {
            id: 'ALT-DEMO-001',
            signalId: 'SIG-003',
            severity: 'High',
            type: 'High Priority Anomaly Burst',
            frequency: 3.72,
            frequencyUnit: 'GHz',
            strength: -41,
            bandwidth: 20,
            modulation: 'Unknown Modulation',
            confidence: 91,
            timestamp: new Date().toLocaleTimeString(),
            status: 'Active',
            location: 'Sector 4 (Perimeter Array)',
          };
          addAlert(newAlert);
        }
        break;
      }
      case 10: {
        // Complete operational state
        const target = signals.find(s => s.id === 'SIG-003');
        if (target) {
          setSelectedSignal({
            ...target,
            strength: -41,
            status: 'Anomalous',
            priority: 'High',
            confidence: 91,
            anomalyScore: 0.91,
          });
        }
        break;
      }
    }
  }, [signals, alerts, addAlert]);

  // Demo auto-advance timer
  useEffect(() => {
    if (!demoActive || !demoPlaying) return;
    const timer = setTimeout(() => {
      if (demoPhase < 10) {
        const next = (demoPhase + 1) as DemoPhase;
        applyDemoPhase(next);
      } else {
        setDemoPlaying(false);
      }
    }, 3800);
    return () => clearTimeout(timer);
  }, [demoActive, demoPlaying, demoPhase, applyDemoPhase]);

  const startDemo = useCallback(() => {
    soundFx.playClick();
    setDemoActive(true);
    setDemoPlaying(true);
    applyDemoPhase(1);
  }, [applyDemoPhase]);

  const pauseDemo = useCallback(() => {
    soundFx.playClick();
    setDemoPlaying(false);
  }, []);

  const resetDemo = useCallback(() => {
    soundFx.playClick();
    setDemoActive(false);
    setDemoPlaying(false);
    setDemoPhase(1);
    setSignals(INITIAL_SIGNALS);
    setSelectedSignal(INITIAL_SIGNALS[2]);
  }, []);

  const nextDemoPhase = useCallback(() => {
    if (demoPhase < 10) {
      const next = (demoPhase + 1) as DemoPhase;
      applyDemoPhase(next);
    }
  }, [demoPhase, applyDemoPhase]);

  const prevDemoPhase = useCallback(() => {
    if (demoPhase > 1) {
      const prev = (demoPhase - 1) as DemoPhase;
      applyDemoPhase(prev);
    }
  }, [demoPhase, applyDemoPhase]);

  const jumpToDemoPhase = useCallback((phase: DemoPhase) => {
    setDemoActive(true);
    applyDemoPhase(phase);
  }, [applyDemoPhase]);

  return (
    <SpectrumContext.Provider
      value={{
        activeTab,
        setActiveTab,
        signals,
        selectedSignal,
        setSelectedSignal,
        spectrumData,
        isScanning,
        startScan,
        stopScan,
        toggleScan,
        selectedBand,
        setSelectedBand,
        alerts,
        addAlert,
        resolveAlert,
        clearDemoAlerts,
        priorityCounts,
        systemHealth,
        demoActive,
        demoPlaying,
        demoPhase,
        startDemo,
        pauseDemo,
        resetDemo,
        nextDemoPhase,
        prevDemoPhase,
        jumpToDemoPhase,
        runAIAnalysis,
        isAnalyzingSignal,
        isMuted,
        toggleMute,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </SpectrumContext.Provider>
  );
};

export const useSpectrum = () => {
  const context = useContext(SpectrumContext);
  if (!context) {
    throw new Error('useSpectrum must be used within a SpectrumProvider');
  }
  return context;
};
