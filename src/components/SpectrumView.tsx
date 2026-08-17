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

const minimumDecibels = -80
const leftMargin = 64
const rightMargin = 34
const topMargin = 16
const bottomMargin = 32

export function SpectrumView({
  spectralAnalysis,
  currentTime,
}: SpectrumViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  interface GraphSize {
  width: number
  height: number
}

const [graphSize, setGraphSize] =
  useState<GraphSize>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
  const container =
    containerRef.current

  if (!container) {
    return
  }

  function updateSize(): void {
    if (!container) {
      return
    }

    const bounds =
      container.getBoundingClientRect()

    const width = Math.max(
      1,
      Math.floor(bounds.width),
    )

    const height = Math.max(
      1,
      Math.floor(bounds.height),
    )

    setGraphSize(
      (previousSize) => {
        if (
          previousSize.width === width &&
          previousSize.height === height
        ) {
          return previousSize
        }

        return {
          width,
          height,
        }
      },
    )
  }

  const resizeObserver =
    new ResizeObserver(() => {
      updateSize()
    })

  resizeObserver.observe(container)

  updateSize()

    return () => {
    resizeObserver.disconnect()
  }
}, [])

useEffect(() => {
  const canvas = canvasRef.current

const {
  width: graphWidth,
  height: graphHeight,
} = graphSize

if (
  !canvas ||
  graphWidth <= 0 ||
  graphHeight <= 0
) {
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

const nyquistFrequency =
  spectralAnalysis.sampleRate / 2

const frequencyTickCount = 4

context.font =
  '10px "Courier New", monospace'

context.textAlign = 'center'
context.textBaseline = 'top'

for (
  let tickIndex = 0;
  tickIndex <= frequencyTickCount;
  tickIndex += 1
) {
  const progress =
    tickIndex /
    frequencyTickCount

  const x =
    leftMargin +
    progress *
      plotWidth

  const frequency =
    progress *
    nyquistFrequency

  /*
   * Vertical frequency grid line.
   */
  context.strokeStyle =
    'rgba(23, 32, 51, 0.1)'

  context.lineWidth = 1

  context.beginPath()

  context.moveTo(
    x,
    topMargin,
  )

  context.lineTo(
    x,
    topMargin +
      plotHeight,
  )

  context.stroke()

  /*
   * Frequency value.
   */
  context.fillStyle =
    '#687184'

  context.fillText(
    formatFrequency(frequency),
    x,
    topMargin +
      plotHeight +
      7,
  )
}

const decibelTickCount = 4

context.textAlign = 'right'
context.textBaseline = 'middle'

for (
  let tickIndex = 0;
  tickIndex <= decibelTickCount;
  tickIndex += 1
) {
  const progress =
    tickIndex /
    decibelTickCount

  const y =
    topMargin +
    progress *
      plotHeight

  const decibels =
    -progress *
      Math.abs(
        minimumDecibels,
      )

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
    `${Math.round(decibels)}`,
    leftMargin - 7,
    y,
  )
}

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
  leftMargin +
  (
    (binIndex - 1) /
    horizontalDivisor
  ) *
    plotWidth

      const y =
  topMargin +
  (
    1 -
    normalizedMagnitude
  ) *
    plotHeight

      if (binIndex === 1) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    }

    context.stroke()
  }, [
  graphSize,
  currentTime,
  spectralAnalysis,
])

  const nyquistFrequency =
  spectralAnalysis.sampleRate / 2

return (
  <section
    className="spectrum-view"
    aria-labelledby="spectrum-view-title"
  >
    <div className="spectrum-view__heading">
      <h2 id="spectrum-view-title">
        Magnitude spectrum
      </h2>

      <span>
        Current frame · 0 Hz —{' '}
        {Math.round(
          nyquistFrequency,
        ).toLocaleString()}{' '}
        Hz
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
        aria-hidden="true"
      />
    </div>

    <p className="spectrum-view__note">
      Magnitudes are displayed relative to the
      strongest frequency bin in the current
      frame, using a range from −80 dB to 0 dB.
    </p>
  </section>
)
}

function formatFrequency(
  frequency: number,
): string {
  if (frequency >= 1000) {
    return `${(
      frequency / 1000
    ).toFixed(1)}k`
  }

  return `${Math.round(
    frequency,
  )}`
}