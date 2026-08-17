import type {
  SpectralFluxTimeline,
} from './createSpectralFluxTimeline'

export interface OnsetStrengthTimeline {
  values: Float32Array
  frameCount: number
  hopSize: number
  sampleRate: number
  fftSize: number
}

export function createOnsetStrengthTimeline(
  spectralFluxTimeline: SpectralFluxTimeline,
): OnsetStrengthTimeline {
  validateSpectralFluxTimeline(
    spectralFluxTimeline,
  )

  const {
    values: fluxValues,
    frameCount,
    hopSize,
    sampleRate,
    fftSize,
  } = spectralFluxTimeline

  const smoothedFlux =
    new Float32Array(frameCount)

  const onsetValues =
    new Float32Array(frameCount)

  /*
   * Short smoothing window.
   *
   * This suppresses isolated numerical
   * jitter while preserving transient shape.
   */
  const shortRadius = 1

  for (
    let frameIndex = 0;
    frameIndex < frameCount;
    frameIndex += 1
  ) {
    let sum = 0
    let count = 0

    const startIndex = Math.max(
      0,
      frameIndex - shortRadius,
    )

    const endIndex = Math.min(
      frameCount - 1,
      frameIndex + shortRadius,
    )

    for (
      let index = startIndex;
      index <= endIndex;
      index += 1
    ) {
      sum +=
        fluxValues[index] ?? 0

      count += 1
    }

    smoothedFlux[frameIndex] =
      count > 0
        ? sum / count
        : 0
  }

  /*
   * Slower local baseline.
   *
   * The onset signal measures how much the
   * short-term novelty rises above its local
   * neighbourhood rather than using absolute
   * spectral change alone.
   */
  const baselineRadius = 6

  let maximumOnsetStrength = 0

  for (
    let frameIndex = 0;
    frameIndex < frameCount;
    frameIndex += 1
  ) {
    const startIndex = Math.max(
      0,
      frameIndex - baselineRadius,
    )

    const endIndex = Math.min(
      frameCount - 1,
      frameIndex + baselineRadius,
    )

    let baselineSum = 0
    let baselineCount = 0

    for (
      let index = startIndex;
      index <= endIndex;
      index += 1
    ) {
      baselineSum +=
        smoothedFlux[index] ?? 0

      baselineCount += 1
    }

    const localBaseline =
      baselineCount > 0
        ? baselineSum /
          baselineCount
        : 0

    const onsetStrength =
      Math.max(
        0,
        (
          smoothedFlux[
            frameIndex
          ] ?? 0
        ) -
          localBaseline,
      )

    onsetValues[
      frameIndex
    ] =
      onsetStrength

    maximumOnsetStrength =
      Math.max(
        maximumOnsetStrength,
        onsetStrength,
      )
  }

  /*
   * Normalize globally to 0–1.
   *
   * This gives Canvas a predictable event
   * intensity scale independent of the
   * recording's absolute novelty range.
   */
  if (maximumOnsetStrength > 0) {
    for (
      let frameIndex = 0;
      frameIndex < frameCount;
      frameIndex += 1
    ) {
      onsetValues[
        frameIndex
      ] /=
        maximumOnsetStrength
    }
  }

  return {
    values: onsetValues,
    frameCount,
    hopSize,
    sampleRate,
    fftSize,
  }
}

function validateSpectralFluxTimeline(
  timeline: SpectralFluxTimeline,
): void {
  if (timeline.frameCount <= 0) {
    throw new Error(
      'Onset-strength analysis requires at least one spectral-flux frame.',
    )
  }

  if (
    timeline.values.length !==
    timeline.frameCount
  ) {
    throw new Error(
      'Spectral-flux values do not match their declared frame count.',
    )
  }

  if (timeline.sampleRate <= 0) {
    throw new Error(
      'Onset-strength analysis requires a positive sample rate.',
    )
  }

  if (timeline.hopSize <= 0) {
    throw new Error(
      'Onset-strength analysis requires a positive hop size.',
    )
  }

  if (timeline.fftSize <= 1) {
    throw new Error(
      'Onset-strength analysis requires a valid FFT size.',
    )
  }
}