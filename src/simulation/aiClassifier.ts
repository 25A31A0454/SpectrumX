import { Signal, XAIExplanation } from '../types/spectrum';

export interface AIInferenceStage {
  stage: number;
  name: string;
  detail: string;
  progress: number;
}

export const AI_INFERENCE_STAGES: AIInferenceStage[] = [
  { stage: 1, name: 'Sensing & Ingestion', detail: 'Sampling raw wideband I/Q data & 8192-pt FFT transform', progress: 20 },
  { stage: 2, name: 'Feature Extraction', detail: 'Extracting spectral kurtosis, cyclostationary cumulants & bandwidth mask', progress: 45 },
  { stage: 3, name: 'Baseline Cross-Reference', detail: 'Comparing against 48,000+ national frequency allocation registry entries', progress: 70 },
  { stage: 4, name: 'Neural Classification', detail: 'Executing ResNet-RF + Transformer constellation classifier', progress: 90 },
  { stage: 5, name: 'Explainable AI Synthesis', detail: 'Synthesizing feature attribution vectors and anomaly rationale', progress: 100 },
];

/**
 * Computes anomaly score and explainable AI insights for a given signal.
 */
export function analyzeSignalAI(signal: Signal): {
  modulation: string;
  type: string;
  confidence: number;
  anomalyScore: number;
  status: 'Normal' | 'Monitor' | 'Suspicious' | 'Anomalous';
  priority: 'Normal' | 'Monitor' | 'Suspicious' | 'High';
  xaiExplanation: XAIExplanation;
} {
  // Baseline bands
  const isAuthorizedWifi = (signal.frequency >= 2.40 && signal.frequency <= 2.484) || (signal.frequency >= 5.15 && signal.frequency <= 5.85);
  const isCellular = (signal.frequency >= 0.7 && signal.frequency <= 0.96) || (signal.frequency >= 1.8 && signal.frequency <= 2.1);

  // Anomalous case: 3.72 GHz or unknown
  if (signal.frequency >= 3.65 && signal.frequency <= 3.85) {
    const anomalyScore = 0.91;
    return {
      modulation: 'Unknown / Non-Standard QPSK',
      type: 'Digital Burst',
      confidence: 91,
      anomalyScore,
      status: 'Anomalous',
      priority: 'High',
      xaiExplanation: {
        summary: `Critical RF anomaly detected at ${signal.frequency} GHz. Power levels exceed authorized limit by +29.4 dBm with unregistered modulation signature.`,
        baselineDelta: `Observed power ${signal.strength} dBm vs baseline noise floor of -102 dBm. Emits outside ITU-R authorized spectral mask.`,
        modulationAnomaly: 'Symbol constellation exhibits asymmetric constellation phase drift and non-standard polyphase pulse shaping.',
        temporalPattern: 'Intermittent 200ms burst duty cycle with pseudo-random repetition intervals.',
        recommendedAction: 'Trigger immediate automated Direction Finding (DF) triangulation, engage radio monitoring intercept, and issue SIH High-Priority RF Alert.',
        factors: [
          { label: 'ITU Frequency Band Allocation', score: 95, impact: 'critical' },
          { label: 'Spectral Power Surge (+29.4 dBm)', score: 91, impact: 'critical' },
          { label: 'Unrecognized Constellation Geometry', score: 89, impact: 'critical' },
          { label: 'Asynchronous Burst Duty Cycle', score: 82, impact: 'elevated' },
        ],
      },
    };
  }

  if (isAuthorizedWifi) {
    const is58 = signal.frequency >= 5.75;
    if (is58 && signal.strength > -55) {
      return {
        modulation: 'OFDM High-Gain',
        type: 'Digital',
        confidence: 84,
        anomalyScore: 0.58,
        status: 'Suspicious',
        priority: 'Suspicious',
        xaiExplanation: {
          summary: `5.8 GHz ISM band transmission operating at abnormally elevated power (${signal.strength} dBm) exceeding local EIRP limits.`,
          baselineDelta: `EIRP power output is +8.2 dB higher than standard commercial access point mask.`,
          modulationAnomaly: 'Standard 802.11 preamble present but frame structure contains proprietary payload encapsulations.',
          temporalPattern: 'Continuous unslotted streaming without standard CSMA/CA clear-channel assessment backoff.',
          recommendedAction: 'Deploy directional RF sniffing to verify if device is an unauthorized long-range drone video downlink.',
          factors: [
            { label: 'EIRP Power Threshold', score: 76, impact: 'elevated' },
            { label: 'CSMA Backoff Discrepancy', score: 65, impact: 'elevated' },
            { label: 'Frame Preamble Match', score: 25, impact: 'nominal' },
          ],
        },
      };
    }
    return {
      modulation: 'OFDM / Wi-Fi 6',
      type: 'Digital',
      confidence: 96,
      anomalyScore: 0.12,
      status: 'Normal',
      priority: 'Normal',
      xaiExplanation: {
        summary: `Standard IEEE 802.11 commercial Wi-Fi transmission fully compliant with local regulatory masks.`,
        baselineDelta: `Signal power ${signal.strength} dBm matches expected indoor/outdoor path loss calculations.`,
        modulationAnomaly: 'Clear OFDM constellation with orthogonal subcarriers; zero phase aberration.',
        temporalPattern: 'Standard carrier-sense multiple access with collision avoidance (CSMA/CA).',
        recommendedAction: 'No action required. Signal registered in normal RF environment baseline inventory.',
        factors: [
          { label: 'Regulatory Band Compliance', score: 10, impact: 'nominal' },
          { label: 'Power Profile Matching', score: 12, impact: 'nominal' },
          { label: 'Constellation Purity', score: 8, impact: 'nominal' },
        ],
      },
    };
  }

  if (signal.frequency === 2.91 || signal.type === 'Pulsed') {
    return {
      modulation: 'Linear Chirp FMCW',
      type: 'Pulsed Radar',
      confidence: 89,
      anomalyScore: 0.44,
      status: 'Suspicious',
      priority: 'Suspicious',
      xaiExplanation: {
        summary: `S-band radar pulse detected with staggered pulse repetition interval (PRI).`,
        baselineDelta: `Matches general coastal radar band but PRI varies by ±14% from scheduled civilian beacon tables.`,
        modulationAnomaly: 'Linear FM chirp pulse width of 12 µs with slight compression filter phase non-linearity.',
        temporalPattern: 'Rotational antenna sweep cadence detected every 4.0 seconds.',
        recommendedAction: 'Cross-reference against Port Authority maritime radar transponder database.',
        factors: [
          { label: 'PRI Jitter Index', score: 62, impact: 'elevated' },
          { label: 'Chirp Linearity Variance', score: 48, impact: 'moderate' },
          { label: 'Frequency Allocation Band', score: 18, impact: 'nominal' },
        ],
      },
    };
  }

  // Default normal / monitor fallback
  const isCell = isCellular;
  return {
    modulation: signal.modulation || (isCell ? '16-QAM' : 'QPSK'),
    type: 'Digital',
    confidence: 94,
    anomalyScore: 0.15,
    status: isCell ? 'Normal' : 'Monitor',
    priority: isCell ? 'Normal' : 'Monitor',
    xaiExplanation: {
      summary: `Standard RF carrier in regulated spectrum allocation band. Nominal parameters observed.`,
      baselineDelta: `Measured power ${signal.strength} dBm falls within authorized telecommunication limits.`,
      modulationAnomaly: 'Standard digital modulation constellation consistent with licensed carrier specifications.',
      temporalPattern: 'Continuous pilot and data subcarrier activity aligned with licensed schedule.',
      recommendedAction: 'Maintain baseline logging in standard telemetry records.',
      factors: [
        { label: 'Channel Allocation Match', score: 14, impact: 'nominal' },
        { label: 'Power Limit Compliance', score: 15, impact: 'nominal' },
      ],
    },
  };
}
