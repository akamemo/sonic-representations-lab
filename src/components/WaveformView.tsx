import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from 'react'
import { createWaveformData } from '../analysis/createWaveformData'

interface WaveformViewProps {
  audioBuffer: AudioBuffer
  currentTime: number
  onSeekStart: () => void
  onSeekPreview: (time: number) => void
  onSeekCommit: (time: number) => void
  onSeekCancel: () => void
}

const waveformBucketCount = 1000
const canvasHeight = 180

export function WaveformView({
  audioBuffer,
  currentTime,
  onSeekStart,
  onSeekPreview,
  onSeekCommit,
  onSeekCancel,
}: WaveformViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const isPointerSeekingRef = useRef(false)

  const waveformData = useMemo(
    () =>
      createWaveformData(
        audioBuffer,
        waveformBucketCount,
      ),
    [audioBuffer],
  )

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      const measuredWidth = Math.max(
        1,
        Math.floor(entry.contentRect.width),
      )

      setCanvasWidth((previousWidth) =>
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

    if (!canvas || canvasWidth <= 0) {
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

    const internalWidth = Math.floor(
      canvasWidth * pixelRatio,
    )

    const internalHeight = Math.floor(
      canvasHeight * pixelRatio,
    )

    if (
      canvas.width !== internalWidth ||
      canvas.height !== internalHeight
    ) {
      canvas.width = internalWidth
      canvas.height = internalHeight
    }

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
      canvasWidth,
      canvasHeight,
    )

    context.fillStyle = 'rgba(255, 255, 255, 0.3)'
    context.fillRect(
      0,
      0,
      canvasWidth,
      canvasHeight,
    )

    const centreY = canvasHeight / 2
    const amplitudeScale = canvasHeight * 0.42

    context.strokeStyle = 'rgba(23, 32, 51, 0.18)'
    context.lineWidth = 1
    context.beginPath()
    context.moveTo(0, centreY)
    context.lineTo(canvasWidth, centreY)
    context.stroke()

    context.strokeStyle = '#4f9268'
    context.lineWidth = 1
    context.beginPath()

    const horizontalDivisor = Math.max(
      1,
      waveformData.bucketCount - 1,
    )

    for (
      let bucketIndex = 0;
      bucketIndex < waveformData.bucketCount;
      bucketIndex += 1
    ) {
      const x =
        (bucketIndex / horizontalDivisor) *
        canvasWidth

      const maximum =
        waveformData.maximums[bucketIndex] ?? 0

      const minimum =
        waveformData.minimums[bucketIndex] ?? 0

      const topY =
        centreY - maximum * amplitudeScale

      const bottomY =
        centreY - minimum * amplitudeScale

      context.moveTo(x, topY)
      context.lineTo(x, bottomY)
    }

    context.stroke()

    const playbackProgress =
      audioBuffer.duration > 0
        ? Math.min(
            Math.max(
              currentTime / audioBuffer.duration,
              0,
            ),
            1,
          )
        : 0

    const cursorX =
      playbackProgress * canvasWidth

    context.strokeStyle = '#7251aa'
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(cursorX, 0)
    context.lineTo(cursorX, canvasHeight)
    context.stroke()
  }, [
    audioBuffer.duration,
    canvasWidth,
    currentTime,
    waveformData,
  ])

  function getPointerTime(
  event: PointerEvent<HTMLCanvasElement>,
): number {
  const canvas = event.currentTarget
  const bounds = canvas.getBoundingClientRect()

  if (bounds.width <= 0) {
    return 0
  }

  const pointerX = event.clientX - bounds.left

  const progress = Math.min(
    Math.max(pointerX / bounds.width, 0),
    1,
  )

  return progress * audioBuffer.duration
}

function handleWaveformPointerDown(
  event: PointerEvent<HTMLCanvasElement>,
): void {
  isPointerSeekingRef.current = true
  event.currentTarget.setPointerCapture(event.pointerId)

  const targetTime = getPointerTime(event)

  onSeekStart()
  onSeekPreview(targetTime)
}

function handleWaveformPointerMove(
  event: PointerEvent<HTMLCanvasElement>,
): void {
  if (!isPointerSeekingRef.current) {
    return
  }

  onSeekPreview(getPointerTime(event))
}

function handleWaveformPointerUp(
  event: PointerEvent<HTMLCanvasElement>,
): void {
  if (!isPointerSeekingRef.current) {
    return
  }

  const targetTime = getPointerTime(event)

  isPointerSeekingRef.current = false

  if (
    event.currentTarget.hasPointerCapture(
      event.pointerId,
    )
  ) {
    event.currentTarget.releasePointerCapture(
      event.pointerId,
    )
  }

  onSeekCommit(targetTime)
}

function handleWaveformPointerCancel(
  event: PointerEvent<HTMLCanvasElement>,
): void {
  isPointerSeekingRef.current = false

  if (
    event.currentTarget.hasPointerCapture(
      event.pointerId,
    )
  ) {
    event.currentTarget.releasePointerCapture(
      event.pointerId,
    )
  }

  onSeekCancel()
}

  return (
    <section
      className="waveform-view"
      aria-labelledby="waveform-title"
    >
      <div className="waveform-view__header">
        <div>
          <p className="waveform-view__eyebrow">
            Time-domain representation
          </p>

          <h2 id="waveform-title">
            Waveform overview
          </h2>
        </div>

        <span className="waveform-view__scale">
          −1&nbsp;&nbsp;0&nbsp;&nbsp;+1
        </span>
      </div>

      <div
        ref={containerRef}
        className="waveform-view__canvas-container"
      >
        <canvas
  ref={canvasRef}
  className="waveform-view__canvas"
  onPointerDown={handleWaveformPointerDown}
  onPointerMove={handleWaveformPointerMove}
  onPointerUp={handleWaveformPointerUp}
  onPointerCancel={handleWaveformPointerCancel}
  role="img"
  aria-label="Interactive audio waveform with a synchronized playback cursor"
  title="Click or drag the waveform to change the playback position"
>
          Your browser does not support canvas-based
          waveform rendering.
        </canvas>
      </div>

      <div
        className="waveform-view__legend"
        aria-hidden="true"
      >
        <span>
          <i className="waveform-view__legend-waveform" />
          Signal amplitude
        </span>

        <span>
          <i className="waveform-view__legend-cursor" />
          Playback position
        </span>
      </div>
    </section>
  )
}