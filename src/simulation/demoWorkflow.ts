import { DemoPhase, DemoStepInfo } from '../types/spectrum';

export const DEMO_PHASES_META: Record<DemoPhase, DemoStepInfo> = {
  1: {
    phase: 1,
    title: 'Normal Baseline Monitoring',
    description: 'Scanning 0.1 – 6.0 GHz RF spectrum. All detected carriers (Wi-Fi 2.45 GHz, LTE 0.85 GHz, GPS 1.24 GHz) are within authorized thresholds.',
    actionHint: 'Observing clean RF environment and stable -102 dBm noise floor.',
  },
  2: {
    phase: 2,
    title: 'New RF Energy Emitter Detected',
    description: 'A sharp, high-power carrier bursts at 3.72 GHz (-41 dBm), emerging unexpectedly in an unallocated federal spectrum guard band.',
    actionHint: 'Live FFT spectrum spikes rapidly at 3.72 GHz (+29.4 dB surge).',
    activeSignalId: 'SIG-003',
  },
  3: {
    phase: 3,
    title: 'Signal Detected Notification',
    description: 'SpectrumX RF ingestion pipeline triggers beacon: "SIGNAL DETECTED — 3.72 GHz | -41 dBm | 20 MHz Bandwidth".',
    actionHint: 'Detection marker latched onto spectrum peak; telemetry logged.',
    activeSignalId: 'SIG-003',
  },
  4: {
    phase: 4,
    title: 'Engaging AI Neural Classifier',
    description: 'Multi-stage deep RF inference engine activated: Ingesting 8192 I/Q samples, computing cyclostationary cumulants and constellation geometry.',
    actionHint: 'Status displays "ANALYZING RF SIGNATURE...".',
    activeSignalId: 'SIG-003',
  },
  5: {
    phase: 5,
    title: 'Modulation & Classification Inferred',
    description: 'ResNet-RF model infers: Unknown / Non-Standard Digital Modulation with 91% neural confidence. No civilian standard matches observed packet preamble.',
    actionHint: 'AI Confidence locked at 91%; Constellation shows asymmetric phase dispersion.',
    activeSignalId: 'SIG-003',
  },
  6: {
    phase: 6,
    title: 'Anomaly Score Escalation',
    description: 'Anomaly calculation engine computes 4-vector divergence: Frequency allocation violation (0.95), Power surge (0.91), Constellation distortion (0.89). Anomaly score spikes to 0.91 / 1.00.',
    actionHint: 'Anomaly threshold meter shifts from NORMAL through SUSPICIOUS to ANOMALOUS.',
    activeSignalId: 'SIG-003',
  },
  7: {
    phase: 7,
    title: 'Status Transition: ANOMALOUS',
    description: 'Signal state formally reclassified from Monitor to ANOMALOUS. Explainable AI breakdown generated detailing spectral mask breach.',
    actionHint: 'Glowing red anomaly badge latched to SIG-003.',
    activeSignalId: 'SIG-003',
  },
  8: {
    phase: 8,
    title: 'Priority Escalation: HIGH',
    description: 'Tactical priority engine re-evaluates risk matrix: Escalated to HIGH PRIORITY. Critical action recommended for spectrum enforcement.',
    actionHint: 'High Priority KPI counter increments to +1; Tactical warning sound triggered.',
    activeSignalId: 'SIG-003',
  },
  9: {
    phase: 9,
    title: 'High Priority Alert Dispatched',
    description: 'Automated Alert generated: "HIGH PRIORITY: Anomalous Signal at 3.72 GHz (-41 dBm, 20 MHz, Unknown Modulation, 91% Confidence)". Dispatched to operator console.',
    actionHint: 'Recent Alerts queue updated with interactive incident card.',
    activeSignalId: 'SIG-003',
  },
  10: {
    phase: 10,
    title: 'Operator Intelligence Dossier Ready',
    description: 'Complete operational workflow executed: Sense → Detect → Classify → Anomaly Detection → Prioritize → Alert → Respond. Countermeasures and bearing triangulation logged in database.',
    actionHint: 'System ready for operator investigation, report export, and DF triangulation.',
    activeSignalId: 'SIG-003',
  },
};
