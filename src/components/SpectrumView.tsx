import {
  useEffect,
  useRef,
  useState,
} from 'react'
import type { SpectralAnalysis } from '../analysis/createSpectralAnalysis'

interface SpectrumViewProps {
  spectralAnalysis: SpectralAnalysis
  currentTime: number
}

const graphHeight = 280
const minimumDecibels = -80

export function SpectrumView({
  spectralAnalysis,
  currentTime,
}: SpectrumViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [graphWidth, setGraphWidth] = useState(0)

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

    context.fillStyle = 'rgba(255, 255, 255, 0.28)'
    context.fillRect(
      0,
      0,
      graphWidth,
      graphHeight,
    )

    drawGrid(
      context,
      graphWidth,
      graphHeight,
    )

    const frameIndex = Math.min(
      Math.max(
        Math.floor(
          (
            Math.max(0, currentTime) *
            spectralAnalysis.sampleRate
          ) /
            spectralAnalysis.hopSize,
        ),
        0,
      ),
      spectralAnalysis.frameCount - 1,
    )

    const frameOffset =
      frameIndex * spectralAnalysis.binCount

    let maximumMagnitude = 0

    for (
      let binIndex = 1;
      binIndex < spectralAnalysis.binCount;
      binIndex += 1
    ) {
      maximumMagnitude = Math.max(
        maximumMagnitude,
        spectralAnalysis.magnitudes[
          frameOffset + binIndex
        ] ?? 0,
      )
    }

    context.strokeStyle = '#7251aa'
    context.lineWidth = 1.5
    context.beginPath()

    const horizontalDivisor = Math.max(
      1,
      spectralAnalysis.binCount - 2,
    )

    for (
      let binIndex = 1;
      binIndex < spectralAnalysis.binCount;
      binIndex += 1
    ) {
      const magnitude =
        spectralAnalysis.magnitudes[
          frameOffset + binIndex
        ] ?? 0

      const relativeMagnitude =
        maximumMagnitude > 0
          ? magnitude / maximumMagnitude
          : 0

      const decibels =
        relativeMagnitude > 0
          ? Math.max(
              minimumDecibels,
              20 * Math.log10(relativeMagnitude),
            )
          : minimumDecibels

      const normalizedMagnitude =
        (decibels - minimumDecibels) /
        Math.abs(minimumDecibels)

      const x =
        ((binIndex - 1) / horizontalDivisor) *
        graphWidth

      const y =
        graphHeight -
        normalizedMagnitude * graphHeight

      if (binIndex === 1) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    }

    context.stroke()
  }, [
    currentTime,
    graphWidth,
    spectralAnalysis,
  ])

  const nyquistFrequency =
    spectralAnalysis.sampleRate / 2

  return (
    <section
      className="spectrum-view"
      aria-labelledby="spectrum-view-title"
    >
      <div className="spectrum-view__header">
        <div>
          <p className="spectrum-view__eyebrow">
            Current analysis frame
          </p>

          <h2 id="spectrum-view-title">
            Magnitude spectrum
          </h2>
        </div>

        <span>
          0 Hz —{' '}
          {Math.round(nyquistFrequency).toLocaleString()} Hz
        </span>
      </div>

      <div
        ref={containerRef}
        className="spectrum-view__graph"
        role="img"
        aria-label="Magnitude spectrum for the current playback position"
      >
        <canvas
          ref={canvasRef}
          className="spectrum-view__canvas"
        />
      </div>

      <div
        className="spectrum-view__axis"
        aria-hidden="true"
      >
        <span>0 Hz</span>
        <span>
          {Math.round(
            nyquistFrequency / 2,
          ).toLocaleString()}{' '}
          Hz
        </span>
        <span>
          {Math.round(
            nyquistFrequency,
          ).toLocaleString()}{' '}
          Hz
        </span>
      </div>

      <p className="spectrum-view__note">
        Magnitudes are displayed relative to the strongest
        frequency bin in the current frame, using a range from
        −80 dB to 0 dB.
      </p>
    </section>
  )
}

function drawGrid(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  context.strokeStyle = 'rgba(23, 32, 51, 0.12)'
  context.lineWidth = 1

  for (
    let verticalDivision = 1;
    verticalDivision < 4;
    verticalDivision += 1
  ) {
    const x =
      (verticalDivision / 4) * width

    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }

  for (
    let horizontalDivision = 1;
    horizontalDivision < 4;
    horizontalDivision += 1
  ) {
    const y =
      (horizontalDivision / 4) * height

    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }
}