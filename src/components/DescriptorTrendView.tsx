import {
  useEffect,
  useRef,
  useState,
} from 'react'
import type { NumericTimeline } from '../analysis/getTimelineValueAtTime'

interface DescriptorTrendViewProps {
  timeline: NumericTimeline
  currentTime: number
  duration: number
  accessibleLabel: string
}

const graphHeight = 120

export function DescriptorTrendView({
  timeline,
  currentTime,
  duration,
  accessibleLabel,
}: DescriptorTrendViewProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null)

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null)

  const [graphWidth, setGraphWidth] =
    useState(0)

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const resizeObserver =
      new ResizeObserver((entries) => {
        const entry = entries[0]

        if (!entry) {
          return
        }

        const measuredWidth = Math.max(
          1,
          Math.floor(entry.contentRect.width),
        )

        setGraphWidth((previousWidth) =>
          previousWidth === measuredWidth
            ? previousWidth
            : measuredWidth,
        )
      })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas || graphWidth <= 0) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const pixelRatio = Math.max(
      1,
      window.devicePixelRatio || 1,
    )

    canvas.width = Math.floor(
      graphWidth * pixelRatio,
    )

    canvas.height = Math.floor(
      graphHeight * pixelRatio,
    )

    context.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0,
    )

    context.clearRect(
      0,
      0,
      graphWidth,
      graphHeight,
    )

    context.fillStyle =
      'rgba(255, 255, 255, 0.28)'

    context.fillRect(
      0,
      0,
      graphWidth,
      graphHeight,
    )

    context.strokeStyle =
      'rgba(23, 32, 51, 0.12)'

    context.lineWidth = 1

    for (
      let division = 1;
      division < 4;
      division += 1
    ) {
      const y =
        (division / 4) * graphHeight

      context.beginPath()
      context.moveTo(0, y)
      context.lineTo(graphWidth, y)
      context.stroke()
    }

    let minimumValue = Number.POSITIVE_INFINITY
    let maximumValue = Number.NEGATIVE_INFINITY

    for (
      let index = 0;
      index < timeline.values.length;
      index += 1
    ) {
      const value =
        timeline.values[index] ?? 0

      minimumValue = Math.min(
        minimumValue,
        value,
      )

      maximumValue = Math.max(
        maximumValue,
        value,
      )
    }

    if (!Number.isFinite(minimumValue)) {
      minimumValue = 0
    }

    if (!Number.isFinite(maximumValue)) {
      maximumValue = 0
    }

    const valueRange = Math.max(
      maximumValue - minimumValue,
      Number.EPSILON,
    )

    const horizontalDivisor = Math.max(
      1,
      timeline.frameCount - 1,
    )

    context.strokeStyle = '#7251aa'
    context.lineWidth = 1.5
    context.beginPath()

    for (
      let frameIndex = 0;
      frameIndex < timeline.frameCount;
      frameIndex += 1
    ) {
      const x =
        (frameIndex / horizontalDivisor) *
        graphWidth

      const value =
        timeline.values[frameIndex] ?? 0

      const normalizedValue =
        (value - minimumValue) / valueRange

      const y =
        graphHeight -
        normalizedValue *
          graphHeight *
          0.86 -
        graphHeight * 0.07

      if (frameIndex === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    }

    context.stroke()
  }, [graphWidth, timeline])

  const playbackProgress =
    duration > 0
      ? Math.min(
          Math.max(currentTime / duration, 0),
          1,
        )
      : 0

  return (
    <div
      ref={containerRef}
      className="descriptor-trend"
      role="img"
      aria-label={accessibleLabel}
    >
      <canvas
        ref={canvasRef}
        className="descriptor-trend__canvas"
      />

      <div
        className="descriptor-trend__playhead"
        style={{
          left: `${playbackProgress * 100}%`,
        }}
        aria-hidden="true"
      />
    </div>
  )
}