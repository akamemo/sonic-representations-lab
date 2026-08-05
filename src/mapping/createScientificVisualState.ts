import type { RmsTimeline } from '../analysis/createRmsTimeline'
import type { SpectralCentroidTimeline } from '../analysis/createSpectralCentroidTimeline'
import type { SpectralFluxTimeline } from '../analysis/createSpectralFluxTimeline'
import { getTimelineValueAtTime } from '../analysis/getTimelineValueAtTime'
import type { SpectralFlatnessTimeline } from '../analysis/createSpectralFlatnessTimeline'

export interface ScientificVisualState {
  intensity: number
  colorTemperature: number
  structuralDisorder: number
  motionActivity: number
}

export function createScientificVisualState(
  rmsTimeline: RmsTimeline,
  spectralCentroidTimeline: SpectralCentroidTimeline,
  spectralFlatnessTimeline: SpectralFlatnessTimeline,
  spectralFluxTimeline: SpectralFluxTimeline,
  currentTime: number,
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

  const maximumRms =
    findMaximumValue(rmsTimeline.values)

  const maximumCentroid =
    findMaximumValue(
      spectralCentroidTimeline.values,
    )

  const maximumFlux =
    findMaximumValue(
      spectralFluxTimeline.values,
    )

  return {
  intensity: normalizeValue(
    currentRms,
    maximumRms,
  ),
  colorTemperature: normalizeValue(
    currentCentroid,
    maximumCentroid,
  ),
  structuralDisorder: clamp01(
    currentFlatness,
  ),
  motionActivity: normalizeValue(
    currentFlux,
    maximumFlux,
  ),
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
    Math.max(value / maximum, 0),
    1,
  )
}

function clamp01(value: number): number {
  return Math.min(
    Math.max(value, 0),
    1,
  )
}