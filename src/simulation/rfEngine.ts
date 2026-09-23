import { Signal, SpectrumPoint } from '../types/spectrum';

// Helper to generate IQ constellation points
export function generateIQPoints(modulation: string, count: number = 100): { i: number; q: number }[] {
  const points: { i: number; q: number }[] = [];
  const noise = 0.08;

  switch (modulation) {
    case 'QPSK': {
      const states = [
        { i: 0.7, q: 0.7 },
        { i: -0.7, q: 0.7 },
        { i: -0.7, q: -0.7 },
        { i: 0.7, q: -0.7 },
      ];
      for (let k = 0; k < count; k++) {
        const base = states[k % states.length];
        points.push({
          i: base.i + (Math.random() - 0.5) * noise * 2,
          q: base.q + (Math.random() - 0.5) * noise * 2,
        });
      }
      break;
    }
    case '16-QAM': {
      const grid = [-0.9, -0.3, 0.3, 0.9];
      for (let k = 0; k < count; k++) {
        const gi = grid[Math.floor(Math.random() * grid.length)];
        const gq = grid[Math.floor(Math.random() * grid.length)];
        points.push({
          i: gi + (Math.random() - 0.5) * noise * 1.5,
          q: gq + (Math.random() - 0.5) * noise * 1.5,
        });
      }
      break;
    }
    case 'OFDM': {
      // Gaussian circular cloud
      for (let k = 0; k < count; k++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1 || 0.001)) * Math.cos(2.0 * Math.PI * u2);
        const z1 = Math.sqrt(-2.0 * Math.log(u1 || 0.001)) * Math.sin(2.0 * Math.PI * u2);
        points.push({ i: z0 * 0.45, q: z1 * 0.45 });
      }
      break;
    }
    case 'FSK': {
      // Two circles / dual frequency tracks
      for (let k = 0; k < count; k++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = k % 2 === 0 ? 0.45 : 0.85;
        points.push({
          i: Math.cos(angle) * radius + (Math.random() - 0.5) * 0.06,
          q: Math.sin(angle) * radius + (Math.random() - 0.5) * 0.06,
        });
      }
      break;
    }
    default: {
      // Unknown / Anomaly: Asymmetric fractured constellation with high phase jitter
      for (let k = 0; k < count; k++) {
        const angle = (k / count) * Math.PI * 4;
        const r = 0.5 + 0.3 * Math.sin(angle * 3) + (Math.random() - 0.5) * 0.35;
        points.push({
          i: Math.cos(angle) * r,
          q: Math.sin(angle) * r + (Math.random() - 0.5) * 0.25,
        });
      }
      break;
    }
  }
  return points;
}

export const INITIAL_SIGNALS: Signal[] = [
  {
    id: 'SIG-001',
    frequency: 1.24,
    frequencyUnit: 'GHz',
    bandwidth: 12,
    strength: -68,
    modulation: 'QPSK',
    type: 'Digital',
    confidence: 96,
    anomalyScore: 0.08,
    priority: 'Normal',
    status: 'Normal',
    firstDetected: '10:14:02',
    lastDetected: '10:45:18',
    duration: '31m 16s',
    location: 'Sector 2 (Array North)',
    bearing: 42,
    iqSamples: generateIQPoints('QPSK'),
  },
  {
    id: 'SIG-002',
    frequency: 2.45,
    frequencyUnit: 'GHz',
    bandwidth: 20,
    strength: -48,
    modulation: 'OFDM',
    type: 'Digital',
    confidence: 94,
    anomalyScore: 0.12,
    priority: 'Normal',
    status: 'Normal',
    firstDetected: '10:02:11',
    lastDetected: '10:45:22',
    duration: '43m 11s',
    location: 'Sector 1 (Local Wi-Fi)',
    bearing: 118,
    iqSamples: generateIQPoints('OFDM'),
  },
  {
    id: 'SIG-003',
    frequency: 3.72,
    frequencyUnit: 'GHz',
    bandwidth: 20,
    strength: -41,
    modulation: 'Unknown',
    type: 'Unknown',
    confidence: 91,
    anomalyScore: 0.91,
    priority: 'High',
    status: 'Anomalous',
    firstDetected: '10:33:02',
    lastDetected: '10:45:24',
    duration: '12m 22s',
    location: 'Sector 4 (Perimeter Array)',
    bearing: 284,
    iqSamples: generateIQPoints('Unknown'),
    xaiExplanation: {
      summary: 'Signal characteristics severely deviate from national spectrum plan for 3.70–3.80 GHz band.',
      baselineDelta: '+29.4 dBm surge above localized ambient baseline. Unauthorized spectral burst mask.',
      modulationAnomaly: 'Unrecognized high-order symbol constellation with asynchronous phase rotation.',
      temporalPattern: 'Intermittent 200ms burst duty cycle typical of covert telemetry or uncoordinated relay.',
      recommendedAction: 'Deploy directional DF bearing lock, record wideband I/Q sample, notify Spectrum Authority.',
      factors: [
        { label: 'Band Allocation Compliance', score: 94, impact: 'critical' },
        { label: 'Spectral Power Surge', score: 88, impact: 'critical' },
        { label: 'Modulation Unknown Vector', score: 91, impact: 'critical' },
        { label: 'Temporal Burst Anomaly', score: 79, impact: 'elevated' },
      ],
    },
  },
  {
    id: 'SIG-004',
    frequency: 2.91,
    frequencyUnit: 'GHz',
    bandwidth: 8,
    strength: -56,
    modulation: 'Pulsed',
    type: 'Pulsed',
    confidence: 88,
    anomalyScore: 0.42,
    priority: 'Suspicious',
    status: 'Suspicious',
    firstDetected: '10:28:40',
    lastDetected: '10:45:10',
    duration: '16m 30s',
    location: 'Sector 3 (Coastal Radar)',
    bearing: 195,
    iqSamples: generateIQPoints('FSK'),
    xaiExplanation: {
      summary: 'Radar chirp pulse with irregular PRF (Pulse Repetition Frequency).',
      baselineDelta: '+12 dB above typical S-band radar baseline.',
      modulationAnomaly: 'Linear FM chirp with non-standard frequency deviation.',
      temporalPattern: 'Staggered pulse repetition intervals suggesting electronic countermeasure test.',
      recommendedAction: 'Cross-reference with naval beacon schedule and radar operations registry.',
      factors: [
        { label: 'PRF Jitter', score: 68, impact: 'elevated' },
        { label: 'Power Deviation', score: 45, impact: 'moderate' },
        { label: 'Chirp Linearity', score: 55, impact: 'moderate' },
      ],
    },
  },
  {
    id: 'SIG-005',
    frequency: 5.18,
    frequencyUnit: 'GHz',
    bandwidth: 40,
    strength: -64,
    modulation: '16-QAM',
    type: 'Digital',
    confidence: 97,
    anomalyScore: 0.05,
    priority: 'Normal',
    status: 'Normal',
    firstDetected: '09:45:00',
    lastDetected: '10:45:20',
    duration: '1h 00m',
    location: 'Sector 1 (Infrastructure)',
    bearing: 60,
    iqSamples: generateIQPoints('16-QAM'),
  },
  {
    id: 'SIG-006',
    frequency: 0.85,
    frequencyUnit: 'GHz',
    bandwidth: 10,
    strength: -58,
    modulation: '16-QAM',
    type: 'Digital',
    confidence: 98,
    anomalyScore: 0.04,
    priority: 'Normal',
    status: 'Normal',
    firstDetected: '09:00:15',
    lastDetected: '10:45:15',
    duration: '1h 45m',
    location: 'Base Station Cell Tower #12',
    bearing: 140,
    iqSamples: generateIQPoints('16-QAM'),
  },
  {
    id: 'SIG-007',
    frequency: 5.80,
    frequencyUnit: 'GHz',
    bandwidth: 20,
    strength: -52,
    modulation: 'OFDM',
    type: 'Digital',
    confidence: 83,
    anomalyScore: 0.61,
    priority: 'Suspicious',
    status: 'Suspicious',
    firstDetected: '10:38:15',
    lastDetected: '10:45:19',
    duration: '7m 04s',
    location: 'Sector 5 (Suburban Outpost)',
    bearing: 310,
    iqSamples: generateIQPoints('OFDM'),
    xaiExplanation: {
      summary: 'High power transmission in 5.8 GHz ISM band lacking carrier-sense etiquette.',
      baselineDelta: 'Exceeds maximum allowable EIRP for unlicensed commercial equipment by +8 dB.',
      modulationAnomaly: 'Wideband OFDM with customized preamble sequence.',
      temporalPattern: 'Continuous unslotted transmission indicating proprietary drone video link.',
      recommendedAction: 'Monitor spectral mask emission compliance and track RF bearing vector.',
      factors: [
        { label: 'EIRP Power Exceedance', score: 72, impact: 'elevated' },
        { label: 'Preamble Discrepancy', score: 64, impact: 'elevated' },
      ],
    },
  },
  {
    id: 'SIG-008',
    frequency: 0.433,
    frequencyUnit: 'GHz',
    bandwidth: 0.25,
    strength: -74,
    modulation: 'FSK',
    type: 'Pulsed',
    confidence: 89,
    anomalyScore: 0.32,
    priority: 'Monitor',
    status: 'Monitor',
    firstDetected: '10:19:40',
    lastDetected: '10:45:05',
    duration: '25m 25s',
    location: 'Industrial telemetry grid',
    bearing: 85,
    iqSamples: generateIQPoints('FSK'),
  },
];

/**
 * Synthesizes a real-time FFT spectrum array spanning 0.1 GHz to 6.0 GHz.
 * Incorporates thermal noise floor (-105 to -95 dBm) plus Gaussian peaks for active signals.
 */
export function generateSpectrumFFT(
  signals: Signal[],
  minFreq: number = 0.1,
  maxFreq: number = 6.0,
  stepCount: number = 180
): SpectrumPoint[] {
  const points: SpectrumPoint[] = [];
  const step = (maxFreq - minFreq) / stepCount;

  for (let i = 0; i <= stepCount; i++) {
    const f = parseFloat((minFreq + i * step).toFixed(3));
    // Base thermal noise floor ~ -102 dBm with Gaussian noise
    let power = -102 + (Math.random() - 0.5) * 6;

    let matchedSignal: Signal | null = null;
    let isPeak = false;

    // Check contribution from all active signals within their bandwidth
    for (const sig of signals) {
      const halfBwGhz = (sig.bandwidth / 1000) / 2;
      const deltaF = Math.abs(f - sig.frequency);

      // Sinc / Gaussian shape for signal peak
      if (deltaF < halfBwGhz * 2.5) {
        const normalizedDist = deltaF / halfBwGhz;
        const peakHeight = sig.strength - (-102); // dB above noise floor
        const shape = Math.exp(-Math.pow(normalizedDist, 2) * 1.8);
        const signalPowerContribution = -102 + peakHeight * shape;

        if (signalPowerContribution > power) {
          power = signalPowerContribution;
          matchedSignal = sig;
          if (deltaF < step * 0.75) {
            isPeak = true;
          }
        }
      }
    }

    // Add subtle scan jitter
    power += (Math.random() - 0.5) * 1.5;

    points.push({
      frequency: f,
      power: parseFloat(power.toFixed(1)),
      isPeak,
      signalId: matchedSignal ? matchedSignal.id : undefined,
      label: isPeak && matchedSignal ? `${matchedSignal.frequency} GHz` : undefined,
      status: matchedSignal ? matchedSignal.status : undefined,
    });
  }

  return points;
}
