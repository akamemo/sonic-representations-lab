import {
  hertzToMel,
  melToHertz,
} from './melScale'

export interface MelFilterBank {
  weights: Float32Array
  centreFrequencies: Float32Array
  bandCount: number
  binCount: number
}

interface CreateMelFilterBankOptions {
  sampleRate: number
  fftSize: number
  bandCount: number
  minimumFrequency?: number
  maximumFrequency?: number
}

export function createMelFilterBank({
  sampleRate,
  fftSize,
  bandCount,
  minimumFrequency = 0,
  maximumFrequency = sampleRate / 2,
}: CreateMelFilterBankOptions): MelFilterBank {
  validateOptions(
    sampleRate,
    fftSize,
    bandCount,
    minimumFrequency,
    maximumFrequency,
  )

  const binCount =
    fftSize / 2 + 1

  const minimumMel =
    hertzToMel(
      minimumFrequency,
    )

  const maximumMel =
    hertzToMel(
      maximumFrequency,
    )

  /*
   * We need two extra points:
   *
   * left edge
   * band centres
   * right edge
   */
  const melPoints =
    new Float64Array(
      bandCount + 2,
    )

  const frequencyPoints =
    new Float64Array(
      bandCount + 2,
    )

  const centreFrequencies =
    new Float32Array(
      bandCount,
    )

  for (
    let pointIndex = 0;
    pointIndex <
    melPoints.length;
    pointIndex += 1
  ) {
    const progress =
      pointIndex /
      (
        melPoints.length -
        1
      )

    const mel =
      minimumMel +
      progress *
        (
          maximumMel -
          minimumMel
        )

    melPoints[pointIndex] =
      mel

    frequencyPoints[pointIndex] =
      melToHertz(mel)
  }

  for (
    let bandIndex = 0;
    bandIndex < bandCount;
    bandIndex += 1
  ) {
    centreFrequencies[
      bandIndex
    ] =
      frequencyPoints[
        bandIndex + 1
      ] ?? 0
  }

  /*
   * Flattened band-major layout:
   *
   * band 0 bins
   * band 1 bins
   * band 2 bins
   * ...
   */
  const weights =
    new Float32Array(
      bandCount *
      binCount,
    )

  for (
    let bandIndex = 0;
    bandIndex < bandCount;
    bandIndex += 1
  ) {
    const leftFrequency =
      frequencyPoints[
        bandIndex
      ] ?? 0

    const centreFrequency =
      frequencyPoints[
        bandIndex + 1
      ] ?? 0

    const rightFrequency =
      frequencyPoints[
        bandIndex + 2
      ] ?? 0

    const weightOffset =
      bandIndex *
      binCount

    for (
      let binIndex = 0;
      binIndex < binCount;
      binIndex += 1
    ) {
      const binFrequency =
        (
          binIndex *
          sampleRate
        ) /
        fftSize

      let weight = 0

      if (
        binFrequency >=
          leftFrequency &&
        binFrequency <=
          centreFrequency
      ) {
        const denominator =
          centreFrequency -
          leftFrequency

        weight =
          denominator > 0
            ? (
                binFrequency -
                leftFrequency
              ) /
              denominator
            : 0
      } else if (
        binFrequency >
          centreFrequency &&
        binFrequency <=
          rightFrequency
      ) {
        const denominator =
          rightFrequency -
          centreFrequency

        weight =
          denominator > 0
            ? (
                rightFrequency -
                binFrequency
              ) /
              denominator
            : 0
      }

      weights[
        weightOffset +
        binIndex
      ] = weight
    }
  }

  return {
    weights,
    centreFrequencies,
    bandCount,
    binCount,
  }
}

function validateOptions(
  sampleRate: number,
  fftSize: number,
  bandCount: number,
  minimumFrequency: number,
  maximumFrequency: number,
): void {
  if (
    !Number.isFinite(sampleRate) ||
    sampleRate <= 0
  ) {
    throw new Error(
      'Mel filter-bank sample rate must be positive.',
    )
  }

  if (
    !Number.isInteger(fftSize) ||
    fftSize <= 1
  ) {
    throw new Error(
      'Mel filter-bank FFT size must be an integer greater than one.',
    )
  }

  const isPowerOfTwo =
    (
      fftSize &
      (
        fftSize -
        1
      )
    ) === 0

  if (!isPowerOfTwo) {
    throw new Error(
      'Mel filter-bank FFT size must be a power of two.',
    )
  }

  if (
    !Number.isInteger(bandCount) ||
    bandCount <= 0
  ) {
    throw new Error(
      'Mel filter-bank band count must be a positive integer.',
    )
  }

  const nyquist =
    sampleRate / 2

  if (
    !Number.isFinite(
      minimumFrequency,
    ) ||
    !Number.isFinite(
      maximumFrequency,
    ) ||
    minimumFrequency < 0 ||
    maximumFrequency <=
      minimumFrequency ||
    maximumFrequency >
      nyquist
  ) {
    throw new Error(
      'Mel filter-bank frequency range is invalid.',
    )
  }
}