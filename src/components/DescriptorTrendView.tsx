import {
  useEffect,
  useRef,
  useState,
} from 'react'
import type { NumericTimeline } from '../analysis/getTimelineValueAtTime'

interface DescriptorTrendViewProps {
  timeline: NumericTimeline
  currentTime: number
  inspectionStartTime: number
  inspectionEndTime: number
  accessibleLabel: string
  axisLabel: string
  formatAxisValue: (
    value: number,
  ) => string
}

const graphHeight = 96

export function DescriptorTrendView({
  timeline,
  currentTime,
  inspectionStartTime,
  inspectionEndTime,
  accessibleLabel,
  axisLabel,
  formatAxisValue,
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

  /*
   * Plot dimensions.
   *
   * Space is reserved around the graph
   * for scientific axis labels.
   */
  const leftMargin = 64
  const rightMargin = 34
  const topMargin = 16
  const bottomMargin = 32

  const plotWidth =
    graphWidth -
    leftMargin -
    rightMargin

  const plotHeight =
    graphHeight -
    topMargin -
    bottomMargin

  if (
    plotWidth <= 0 ||
    plotHeight <= 0
  ) {
    return
  }

  /*
   * Global descriptor range.
   *
   * We deliberately calculate this from
   * the complete timeline so the vertical
   * scale does not change while playback
   * moves through the recording.
   */
  let minimumValue =
    Number.POSITIVE_INFINITY

  let maximumValue =
    Number.NEGATIVE_INFINITY

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
    maximumValue -
      minimumValue,
    Number.EPSILON,
  )

  /*
   * Visible time range.
   */
  const visibleDuration =
    Math.max(
      inspectionEndTime -
        inspectionStartTime,
      Number.EPSILON,
    )

  /*
   * Canvas text configuration.
   */
  context.font =
    '10px "Courier New", monospace'

  context.fillStyle =
    '#687184'

  /*
   * Y-axis grid lines and values.
   */
  const yTickCount = 4

  context.textAlign = 'right'
  context.textBaseline = 'middle'

  for (
    let tickIndex = 0;
    tickIndex <= yTickCount;
    tickIndex += 1
  ) {
    const progress =
      tickIndex / yTickCount

    const y =
      topMargin +
      progress *
        plotHeight

    const value =
      maximumValue -
      progress *
        valueRange

    context.strokeStyle =
      'rgba(23, 32, 51, 0.1)'

    context.lineWidth = 1

    context.beginPath()

    context.moveTo(
      leftMargin,
      y,
    )

    context.lineTo(
      leftMargin +
        plotWidth,
      y,
    )

    context.stroke()

    context.fillStyle =
      '#687184'

    context.fillText(
      formatAxisValue(value),
      leftMargin - 7,
      y,
    )
  }

  /*
   * Main Y and X axes.
   */
  context.strokeStyle =
    'rgba(23, 32, 51, 0.24)'

  context.lineWidth = 1

  context.beginPath()

  context.moveTo(
    leftMargin,
    topMargin,
  )

  context.lineTo(
    leftMargin,
    topMargin +
      plotHeight,
  )

  context.lineTo(
    leftMargin +
      plotWidth,
    topMargin +
      plotHeight,
  )

  context.stroke()

  /*
   * X-axis absolute-time labels.
   */
  const timeTickCount = 5

  context.fillStyle =
    '#687184'

  context.textAlign = 'center'
  context.textBaseline = 'top'

  for (
    let tickIndex = 0;
    tickIndex <= timeTickCount;
    tickIndex += 1
  ) {
    const progress =
      tickIndex /
      timeTickCount

    const x =
      leftMargin +
      progress *
        plotWidth

    const time =
      inspectionStartTime +
      progress *
        visibleDuration

    context.fillText(
      formatTime(time),
      x,
      topMargin +
        plotHeight +
        7,
    )
  }

  /*
   * Y-axis descriptor label.
   */
  context.save()

  context.translate(
    14,
    topMargin +
      plotHeight / 2,
  )

  context.rotate(
    -Math.PI / 2,
  )

  context.fillStyle =
    '#687184'

  context.textAlign = 'center'
  context.textBaseline = 'middle'

  context.fillText(
    axisLabel,
    0,
    0,
  )

  context.restore()

  /*
   * Convert descriptor frame indexes
   * into absolute track time.
   */
  const secondsPerFrame =
    timeline.hopSize /
    timeline.sampleRate

  /*
   * Draw only descriptor frames inside
   * the current inspection window.
   */
  context.strokeStyle =
    '#7251aa'

  context.lineWidth = 1.5

  context.beginPath()

  let hasStartedPath = false

  for (
    let frameIndex = 0;
    frameIndex < timeline.frameCount;
    frameIndex += 1
  ) {
    const frameTime =
      frameIndex *
      secondsPerFrame

    if (
      frameTime <
        inspectionStartTime ||
      frameTime >
        inspectionEndTime
    ) {
      continue
    }

    const horizontalProgress =
      (
        frameTime -
        inspectionStartTime
      ) /
      visibleDuration

    const x =
      leftMargin +
      horizontalProgress *
        plotWidth

    const value =
      timeline.values[
        frameIndex
      ] ?? 0

    const normalizedValue =
      (
        value -
        minimumValue
      ) /
      valueRange

    const y =
      topMargin +
      (
        1 -
        normalizedValue
      ) *
        plotHeight

    if (!hasStartedPath) {
      context.moveTo(
        x,
        y,
      )

      hasStartedPath = true
    } else {
      context.lineTo(
        x,
        y,
      )
    }
  }

  if (hasStartedPath) {
    context.stroke()
  }

  /*
   * Current playback position.
   *
   * Drawing the playhead directly on
   * the canvas keeps it aligned with
   * the scientific plot margins.
   */
  const playbackProgress =
    Math.min(
      Math.max(
        (
          currentTime -
          inspectionStartTime
        ) /
          visibleDuration,
        0,
      ),
      1,
    )

  const playheadX =
    leftMargin +
    playbackProgress *
      plotWidth

  context.strokeStyle =
    '#4f9268'

  context.lineWidth = 2

  context.beginPath()

  context.moveTo(
    playheadX,
    topMargin,
  )

  context.lineTo(
    playheadX,
    topMargin +
      plotHeight,
  )

  context.stroke()
}, [
  graphWidth,
  timeline,
  currentTime,
  inspectionStartTime,
  inspectionEndTime,
  axisLabel,
  formatAxisValue,
])

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
        aria-hidden="true"
      />
      </div>
  )
}

function formatTime(
  seconds: number,
): string {
  const safeSeconds =
    Math.max(
      0,
      seconds,
    )

  const minutes =
    Math.floor(
      safeSeconds / 60,
    )

  const remainingSeconds =
    safeSeconds -
    minutes * 60

  return (
    `${minutes}:` +
    remainingSeconds
      .toFixed(1)
      .padStart(4, '0')
  )
}