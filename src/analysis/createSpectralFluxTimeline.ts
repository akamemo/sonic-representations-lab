import type { SpectralAnalysis } from './createSpectralAnalysis'

export interface SpectralFluxTimeline {
  values: Float32Array
  frameCount: number
  hopSize: number
  sampleRate: number
  fftSize: number
}

export function createSpectralFluxTimeline(
  spectralAnalysis: SpectralAnalysis,
): SpectralFluxTimeline {
  validateSpectralAnalysis(spectralAnalysis)

  const {
    magnitudes,
    frameCount,
    binCount,
    hopSize,
    sampleRate,
    fftSize,
  } = spectralAnalysis

  const values = new Float32Array(frameCount)

  /*
   * The first frame has no previous spectrum to compare against.
   */
  values[0] = 0

  for (
    let frameIndex = 1;
    frameIndex < frameCount;
    frameIndex += 1
  ) {
    const currentFrameOffset =
      frameIndex * binCount

    const previousFrameOffset =
      (frameIndex - 1) * binCount

    let positiveDifferenceSum = 0
    let currentMagnitudeSum = 0

    /*
     * Skip bin zero because it represents the DC component.
     */
    for (
      let binIndex = 1;
      binIndex < binCount;
      binIndex += 1
    ) {
      const currentMagnitude =
        magnitudes[
          currentFrameOffset + binIndex
        ] ?? 0

      const previousMagnitude =
        magnitudes[
          previousFrameOffset + binIndex
        ] ?? 0

      const magnitudeIncrease =
        currentMagnitude - previousMagnitude

      if (magnitudeIncrease > 0) {
        positiveDifferenceSum +=
          magnitudeIncrease
      }

      currentMagnitudeSum +=
        currentMagnitude
    }

    /*
     * Normalizing by the current frame's total magnitude
     * reduces the direct influence of overall signal level.
     */
    values[frameIndex] =
      currentMagnitudeSum > 0
        ? positiveDifferenceSum /
          currentMagnitudeSum
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
      'Spectral flux analysis requires at least one frame.',
    )
  }

  if (spectralAnalysis.binCount <= 1) {
    throw new Error(
      'Spectral flux analysis requires at least two frequency bins.',
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
      'Spectral flux analysis requires a positive sample rate.',
    )
  }

  if (spectralAnalysis.hopSize <= 0) {
    throw new Error(
      'Spectral flux analysis requires a positive hop size.',
    )
  }

  if (spectralAnalysis.fftSize <= 1) {
    throw new Error(
      'Spectral flux analysis requires a valid FFT size.',
    )
  }
}