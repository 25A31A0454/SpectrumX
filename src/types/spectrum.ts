export type PriorityLevel = 'High' | 'Suspicious' | 'Monitor' | 'Normal';
export type SignalStatus = 'Normal' | 'Monitor' | 'Suspicious' | 'Anomalous';

export interface XAIExplanation {
  summary: string;
  baselineDelta: string;
  modulationAnomaly: string;
  temporalPattern: string;
  recommendedAction: string;
  factors: {
    label: string;
    score: number; // 0-100
    impact: 'critical' | 'elevated' | 'moderate' | 'nominal';
  }[];
}

export interface Signal {
  id: string;
  frequency: number; // in GHz
  frequencyUnit: 'GHz' | 'MHz';
  bandwidth: number; // in MHz
  strength: number; // in dBm
  modulation: string; // 'QPSK' | '16-QAM' | 'OFDM' | 'FSK' | 'FM' | 'Unknown' | etc.
  type: string; // 'Digital' | 'Analog' | 'Pulsed' | 'Spread Spectrum' | 'Unknown'
  confidence: number; // 0 - 100
  anomalyScore: number; // 0.0 - 1.0
  priority: PriorityLevel;
  status: SignalStatus;
  firstDetected: string;
  lastDetected: string;
  duration: string;
  location: string;
  bearing?: number; // degrees 0-360
  iqSamples?: { i: number; q: number }[];
  xaiExplanation?: XAIExplanation;
}

export interface Alert {
  id: string;
  signalId: string;
  severity: PriorityLevel;
  type: string;
  frequency: number;
  frequencyUnit: 'GHz' | 'MHz';
  strength: number;
  bandwidth: number;
  modulation: string;
  confidence: number;
  timestamp: string;
  status: 'Active' | 'Investigating' | 'Resolved';
  location: string;
}

export interface SpectrumPoint {
  frequency: number; // GHz
  power: number; // dBm
  isPeak?: boolean;
  signalId?: string;
  label?: string;
  status?: SignalStatus;
}

export interface SystemHealth {
  sdrDevice: string;
  sdrStatus: 'ONLINE' | 'STANDBY' | 'ERROR';
  scannerStatus: 'ACTIVE' | 'PAUSED' | 'IDLE';
  scanRange: string;
  aiEngineStatus: 'ONLINE' | 'STANDBY' | 'BUSY';
  aiModelVersion: string;
  dbStatus: 'ONLINE' | 'SYNCHRONIZING' | 'ERROR';
  dbEngine: string;
  uptimeSeconds: number;
  scanRateHz: number;
  signalsProcessed: number;
  aiAnalysesPerformed: number;
  alertsGenerated: number;
}

export type DemoPhase = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface DemoStepInfo {
  phase: DemoPhase;
  title: string;
  description: string;
  actionHint: string;
  activeSignalId?: string;
}

export type NavTab = 
  | 'dashboard' 
  | 'spectrum' 
  | 'signals' 
  | 'ai' 
  | 'alerts' 
  | 'history' 
  | 'system' 
  | 'about';
