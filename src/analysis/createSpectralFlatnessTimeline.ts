import type { SpectralAnalysis } from './createSpectralAnalysis'

export interface SpectralFlatnessTimeline {
  values: Float32Array
  frameCount: number
  hopSize: number
  sampleRate: number
  fftSize: number
}

const minimumMagnitude = 1e-12

export function createSpectralFlatnessTimeline(
  spectralAnalysis: SpectralAnalysis,
): SpectralFlatnessTimeline {
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

  for (
    let frameIndex = 0;
    frameIndex < frameCount;
    frameIndex += 1
  ) {
    const frameOffset =
      frameIndex * binCount

    let logarithmicMagnitudeSum = 0
    let arithmeticMagnitudeSum = 0
    let includedBinCount = 0

    /*
     * Skip bin zero because it represents
     * the DC component.
     */
    for (
      let binIndex = 1;
      binIndex < binCount;
      binIndex += 1
    ) {
      const magnitude = Math.max(
        magnitudes[
          frameOffset + binIndex
        ] ?? 0,
        minimumMagnitude,
      )

      logarithmicMagnitudeSum +=
        Math.log(magnitude)

      arithmeticMagnitudeSum +=
        magnitude

      includedBinCount += 1
    }

    if (
      includedBinCount === 0 ||
      arithmeticMagnitudeSum <= 0
    ) {
      values[frameIndex] = 0
      continue
    }

    const geometricMean =
      Math.exp(
        logarithmicMagnitudeSum /
          includedBinCount,
      )

    const arithmeticMean =
      arithmeticMagnitudeSum /
      includedBinCount

    values[frameIndex] =
      arithmeticMean > 0
        ? clamp01(
            geometricMean /
              arithmeticMean,
          )
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
      'Spectral flatness analysis requires at least one frame.',
    )
  }

  if (spectralAnalysis.binCount <= 1) {
    throw new Error(
      'Spectral flatness analysis requires at least two frequency bins.',
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
      'Spectral flatness analysis requires a positive sample rate.',
    )
  }

  if (spectralAnalysis.hopSize <= 0) {
    throw new Error(
      'Spectral flatness analysis requires a positive hop size.',
    )
  }

  if (spectralAnalysis.fftSize <= 1) {
    throw new Error(
      'Spectral flatness analysis requires a valid FFT size.',
    )
  }
}

function clamp01(value: number): number {
  return Math.min(
    Math.max(value, 0),
    1,
  )
}