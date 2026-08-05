import type { SpectralAnalysis } from './createSpectralAnalysis'

export interface SpectralCentroidTimeline {
  values: Float32Array
  frameCount: number
  hopSize: number
  sampleRate: number
  fftSize: number
}

export function createSpectralCentroidTimeline(
  spectralAnalysis: SpectralAnalysis,
): SpectralCentroidTimeline {
  validateSpectralAnalysis(spectralAnalysis)

  const {
    magnitudes,
    frameCount,
    binCount,
    fftSize,
    hopSize,
    sampleRate,
  } = spectralAnalysis

  const values = new Float32Array(frameCount)
  const frequencyPerBin = sampleRate / fftSize

  for (
    let frameIndex = 0;
    frameIndex < frameCount;
    frameIndex += 1
  ) {
    const frameOffset = frameIndex * binCount

    let weightedFrequencySum = 0
    let magnitudeSum = 0

    /*
     * Bin zero represents DC: 0 Hz.
     * It contributes nothing to the weighted frequency sum,
     * so we begin at bin one.
     */
    for (
      let binIndex = 1;
      binIndex < binCount;
      binIndex += 1
    ) {
      const magnitude =
        magnitudes[frameOffset + binIndex] ?? 0

      const frequency =
        binIndex * frequencyPerBin

      weightedFrequencySum +=
        frequency * magnitude

      magnitudeSum += magnitude
    }

    values[frameIndex] =
      magnitudeSum > 0
        ? weightedFrequencySum / magnitudeSum
        : 0
  }

  return {
    values,
    frameCount,
    hopSize,
    sampleRate,
    fftSize,
  }
}

function validateSpectralAnalysis(
  spectralAnalysis: SpectralAnalysis,
): void {
  if (spectralAnalysis.frameCount <= 0) {
    throw new Error(
      'Spectral centroid analysis requires at least one frame.',
    )
  }

  if (spectralAnalysis.binCount <= 1) {
    throw new Error(
      'Spectral centroid analysis requires at least two frequency bins.',
    )
  }

  const expectedMagnitudeCount =
    spectralAnalysis.frameCount *
    spectralAnalysis.binCount

  if (
    spectralAnalysis.magnitudes.length !==
    expectedMagnitudeCount
  ) {
    throw new Error(
      'The spectral magnitude data does not match its declared dimensions.',
    )
  }

  if (spectralAnalysis.sampleRate <= 0) {
    throw new Error(
      'Spectral centroid analysis requires a positive sample rate.',
    )
  }

  if (spectralAnalysis.fftSize <= 1) {
    throw new Error(
      'Spectral centroid analysis requires a valid FFT size.',
    )
  }
}