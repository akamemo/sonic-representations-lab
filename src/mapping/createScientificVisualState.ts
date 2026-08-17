import type { RmsTimeline } from '../analysis/createRmsTimeline'
import type { SpectralCentroidTimeline } from '../analysis/createSpectralCentroidTimeline'
import type { SpectralFluxTimeline } from '../analysis/createSpectralFluxTimeline'
import type { SpectralFlatnessTimeline } from '../analysis/createSpectralFlatnessTimeline'
import type { OnsetStrengthTimeline } from '../analysis/createOnsetStrengthTimeline'
import { getTimelineValueAtTime } from '../analysis/getTimelineValueAtTime'

export type VisualMappingPreset =
  | 'resonance'
  | 'refraction'
  | 'fluxfield'

export interface ScientificVisualState {
  intensity: number
  colorTemperature: number
  structuralDisorder: number
  motionActivity: number
  impulse: number
}

export function createScientificVisualState(
  rmsTimeline: RmsTimeline,
  spectralCentroidTimeline: SpectralCentroidTimeline,
  spectralFlatnessTimeline: SpectralFlatnessTimeline,
  spectralFluxTimeline: SpectralFluxTimeline,
  onsetStrengthTimeline: OnsetStrengthTimeline,
  currentTime: number,
  preset: VisualMappingPreset = 'resonance',
): ScientificVisualState {
  const currentRms =
    getTimelineValueAtTime(
      rmsTimeline,
      currentTime,
    )

  const currentCentroid =
    getTimelineValueAtTime(
      spectralCentroidTimeline,
      currentTime,
    )

  const currentFlatness =
    getTimelineValueAtTime(
      spectralFlatnessTimeline,
      currentTime,
    )

  const currentFlux =
    getTimelineValueAtTime(
      spectralFluxTimeline,
      currentTime,
    )

  const currentOnsetStrength =
    getTimelineValueAtTime(
      onsetStrengthTimeline,
      currentTime,
    )

  const maximumRms =
    findMaximumValue(
      rmsTimeline.values,
    )

  const maximumCentroid =
    findMaximumValue(
      spectralCentroidTimeline.values,
    )

  const maximumFlux =
    findMaximumValue(
      spectralFluxTimeline.values,
    )

  const maximumFlatness =
    findMaximumValue(
      spectralFlatnessTimeline.values,
    )

  /*
   * Normalize the continuously varying
   * descriptors once.
   *
   * Presets below only decide where these
   * normalized measurements are routed.
   */
  const normalizedRms =
    normalizeValue(
      currentRms,
      maximumRms,
    )

  const normalizedCentroid =
    normalizeValue(
      currentCentroid,
      maximumCentroid,
    )

  const normalizedFlux =
    normalizeValue(
      currentFlux,
      maximumFlux,
    )

  const normalizedFlatness =
    clamp01(
      currentFlatness,
    )

  const normalizedOnsetStrength =
    clamp01(
      currentOnsetStrength,
    )

  const relativeFlatness =
    normalizeValue(
      currentFlatness,
      maximumFlatness,
    )

  switch (preset) {
    /*
     * REFRACTION
     *
     * Centroid -> intensity / size
     * RMS      -> colour
     * Flux     -> structural disorder
     * Flatness -> membrane motion
     * Onset    -> impulse
     */
    case 'refraction':
      return {
        /*
         * Spectral centroid directly controls
         * occupied size.
         */
        intensity:
          normalizedCentroid,

        /*
         * RMS is compressed into the colour
         * range expected by the renderer.
         */
        colorTemperature:
          0.04 +
          normalizedRms * 0.38,

        /*
         * Flux is mapped into the narrow
         * structural-disorder range for which
         * the renderer was designed.
         */
        structuralDisorder:
          normalizedFlux * 0.12,

        /*
         * Flatness is normalized relative to
         * this recording and expanded across
         * the renderer's motion range.
         */
        motionActivity:
          0.04 +
          relativeFlatness * 0.66,

        impulse:
          normalizedOnsetStrength,
      }

    /*
     * FLUXFIELD
     *
     * Flux     -> intensity / size
     * Flatness -> colour
     * RMS      -> structural disorder
     * Centroid -> membrane motion
     * Onset    -> impulse
     *
     * Structural disorder is tuned to a narrow
     * renderer range. RMS is therefore scaled
     * into that range before being routed here.
     */
    case 'fluxfield':
      return {
        /*
         * Flux controls occupied size.
         */
        intensity:
          normalizedFlux,

        /*
         * Flatness now uses the complete
         * useful pigmentation range.
         */
        colorTemperature:
          0.04 +
          relativeFlatness * 0.38,

        /*
         * RMS occupies the full structural
         * range instead of only scaling from
         * absolute zero.
         */
        structuralDisorder:
          0.015 +
          normalizedRms * 0.105,

        /*
         * Centroid is compressed into the
         * useful motion range.
         */
        motionActivity:
          0.04 +
          normalizedCentroid * 0.66,

        impulse:
          normalizedOnsetStrength,
      }

    /*
     * RESONANCE
     *
     * Baseline Resonance mapping.
     *
     * RMS      -> intensity / size
     * Centroid -> colour
     * Flatness -> structural disorder
     * Flux     -> membrane motion
     * Onset    -> impulse
     */
    case 'resonance':
    default:
      return {
        intensity:
          normalizedRms,

        colorTemperature:
          normalizedCentroid,

        structuralDisorder:
          normalizedFlatness,

        motionActivity:
          normalizedFlux,

        impulse:
          normalizedOnsetStrength,
      }
  }
}

function findMaximumValue(
  values: Float32Array,
): number {
  let maximum = 0

  for (
    let index = 0;
    index < values.length;
    index += 1
  ) {
    maximum = Math.max(
      maximum,
      values[index] ?? 0,
    )
  }

  return maximum
}

function normalizeValue(
  value: number,
  maximum: number,
): number {
  if (maximum <= 0) {
    return 0
  }

  return Math.min(
    Math.max(
      value / maximum,
      0,
    ),
    1,
  )
}

function clamp01(
  value: number,
): number {
  return Math.min(
    Math.max(value, 0),
    1,
  )
}