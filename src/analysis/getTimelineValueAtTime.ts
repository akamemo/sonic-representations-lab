export interface NumericTimeline {
  values: Float32Array
  frameCount: number
  hopSize: number
  sampleRate: number
}

export function getTimelineValueAtTime(
  timeline: NumericTimeline,
  time: number,
): number {
  if (timeline.frameCount <= 0) {
    return 0
  }

  if (
    timeline.hopSize <= 0 ||
    timeline.sampleRate <= 0
  ) {
    return 0
  }

  const safeTime = Math.max(0, time)

  const frameIndex = Math.min(
    Math.floor(
      (safeTime * timeline.sampleRate) /
        timeline.hopSize,
    ),
    timeline.frameCount - 1,
  )

  return timeline.values[frameIndex] ?? 0
}