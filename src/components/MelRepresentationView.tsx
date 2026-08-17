import {
  useEffect,
  useRef,
  useState,
} from 'react'
import type { SpectralAnalysis } from '../analysis/createSpectralAnalysis'

interface MelRepresentationViewProps {
  spectralAnalysis: SpectralAnalysis
  currentTime: number
}

interface GraphSize {
  width: number
  height: number
}

const minimumDecibels = -80

const leftMargin = 64
const rightMargin = 34
const topMargin = 16
const bottomMargin = 32

export function MelRepresentationView({
  spectralAnalysis,
  currentTime,
}: MelRepresentationViewProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null)

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null)

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
    const canvas =
      canvasRef.current

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

    const context =
      canvas.getContext('2d')

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

    const frameIndex =
      Math.min(
        Math.max(
          Math.floor(
            (
              Math.max(
                0,
                currentTime,
              ) *
              spectralAnalysis.sampleRate
            ) /
              spectralAnalysis.hopSize,
          ),
          0,
        ),
        spectralAnalysis.frameCount - 1,
      )

    const melOffset =
      frameIndex *
      spectralAnalysis.melBandCount

    let maximumEnergy = 0

    for (
      let bandIndex = 0;
      bandIndex <
      spectralAnalysis.melBandCount;
      bandIndex += 1
    ) {
      maximumEnergy =
        Math.max(
          maximumEnergy,
          spectralAnalysis.melEnergies[
            melOffset +
              bandIndex
          ] ?? 0,
        )
    }

    context.font =
      '10px "Courier New", monospace'

    /*
     * Horizontal dB grid.
     */
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
        `${Math.round(
          decibels,
        )}`,
        leftMargin - 7,
        y,
      )
    }

    /*
     * Axes.
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
     * Mel-band bars.
     */
    const bandGap = 4

    const availableBandWidth =
      plotWidth /
      spectralAnalysis.melBandCount

    const barWidth =
      Math.max(
        1,
        availableBandWidth -
          bandGap,
      )

    context.fillStyle =
      '#7251aa'

    for (
      let bandIndex = 0;
      bandIndex <
      spectralAnalysis.melBandCount;
      bandIndex += 1
    ) {
      const energy =
        spectralAnalysis.melEnergies[
          melOffset +
            bandIndex
        ] ?? 0

      const relativeEnergy =
        maximumEnergy > 0
          ? energy /
            maximumEnergy
          : 0

      const decibels =
        relativeEnergy > 0
          ? Math.max(
              minimumDecibels,
              10 *
                Math.log10(
                  relativeEnergy,
                ),
            )
          : minimumDecibels

      const normalizedEnergy =
        (
          decibels -
          minimumDecibels
        ) /
        Math.abs(
          minimumDecibels,
        )

      const barHeight =
        normalizedEnergy *
        plotHeight

      const x =
        leftMargin +
        bandIndex *
          availableBandWidth +
        bandGap / 2

      const y =
        topMargin +
        plotHeight -
        barHeight

      context.fillRect(
        x,
        y,
        barWidth,
        barHeight,
      )
    }

    /*
     * Frequency labels.
     *
     * Label only selected bands to keep
     * the axis readable.
     */
    context.fillStyle =
      '#687184'

    context.textAlign = 'center'
    context.textBaseline = 'top'

    const labelIndexes =
      new Set([
        0,
        Math.floor(
          (
            spectralAnalysis.melBandCount -
            1
          ) / 3,
        ),
        Math.floor(
          (
            spectralAnalysis.melBandCount -
            1
          ) *
          2 /
          3,
        ),
        spectralAnalysis.melBandCount -
          1,
      ])

    for (
      let bandIndex = 0;
      bandIndex <
      spectralAnalysis.melBandCount;
      bandIndex += 1
    ) {
      if (
        !labelIndexes.has(
          bandIndex,
        )
      ) {
        continue
      }

      const centreFrequency =
        spectralAnalysis
          .melCentreFrequencies[
            bandIndex
          ] ?? 0

      const x =
        leftMargin +
        (
          bandIndex +
          0.5
        ) *
          availableBandWidth

      context.fillText(
        formatFrequency(
          centreFrequency,
        ),
        x,
        topMargin +
          plotHeight +
          7,
      )
    }
  }, [
    graphSize,
    spectralAnalysis,
    currentTime,
  ])

  return (
    <section
      className="mel-representation-view"
      aria-labelledby="mel-representation-title"
    >
      <div
        className="mel-representation-view__heading"
      >
        <h2 id="mel-representation-title">
          Mel-band energies
        </h2>

        <span>
          Current frame ·{' '}
          {spectralAnalysis.melBandCount}{' '}
          bands
        </span>
      </div>

      <div
        ref={containerRef}
        className="mel-representation-view__graph"
        role="img"
        aria-label="Mel-band energy distribution for the current playback position"
      >
        <canvas
          ref={canvasRef}
          className="mel-representation-view__canvas"
          aria-hidden="true"
        />
      </div>

      <p className="mel-representation-view__note">
        Mel bands group spectral energy using a
        perceptually spaced frequency scale.
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