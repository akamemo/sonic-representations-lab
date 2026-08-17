import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { SpectralAnalysis } from '../analysis/createSpectralAnalysis'

interface SpectrogramViewProps {
  spectralAnalysis: SpectralAnalysis
  currentTime: number
  startTime: number
  endTime: number
  accessibleLabel?: string
}

interface CanvasSize {
  width: number
  height: number
}

const minimumDecibels = -80
const maximumDecibels = 0

const leftMargin = 64
const rightMargin = 34
const topMargin = 16
const bottomMargin = 32

const maximumRasterHeight = 220
const maximumRasterWidth = 512

export function SpectrogramView({
  spectralAnalysis,
  currentTime,
  startTime,
  endTime,
  accessibleLabel = 'Spectrogram for the current inspection window',
}: SpectrogramViewProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null)

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null)

  const [canvasSize, setCanvasSize] =
    useState<CanvasSize>({
      width: 0,
      height: 0,
    })

  /*
   * Establish one stable magnitude reference
   * for the entire experiment.
   *
   * This is calculated only when the spectral
   * analysis object changes.
   */
  const globalPeakMagnitude =
    useMemo(() => {
      let maximum = 0

      for (
        let index = 0;
        index <
        spectralAnalysis.magnitudes.length;
        index += 1
      ) {
        maximum = Math.max(
          maximum,
          spectralAnalysis.magnitudes[
            index
          ] ?? 0,
        )
      }

      return Math.max(
        maximum,
        Number.EPSILON,
      )
    }, [spectralAnalysis])

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

      setCanvasSize(
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
      width: canvasWidth,
      height: canvasHeight,
    } = canvasSize

    if (
      !canvas ||
      canvasWidth <= 0 ||
      canvasHeight <= 0
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
      canvasWidth * pixelRatio,
    )

    canvas.height = Math.floor(
      canvasHeight * pixelRatio,
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
      canvasWidth,
      canvasHeight,
    )

    context.fillStyle =
      'rgba(255, 255, 255, 0.28)'

    context.fillRect(
      0,
      0,
      canvasWidth,
      canvasHeight,
    )

    const plotWidth =
      canvasWidth -
      leftMargin -
      rightMargin

    const plotHeight =
      canvasHeight -
      topMargin -
      bottomMargin

    if (
      plotWidth <= 0 ||
      plotHeight <= 0
    ) {
      return
    }

    const visibleDuration = Math.max(
      endTime - startTime,
      Number.EPSILON,
    )

    const secondsPerFrame =
      spectralAnalysis.hopSize /
      spectralAnalysis.sampleRate

    /*
     * Resolve the analysis frames intersecting
     * the current inspection window.
     */
    const firstFrame = clampInteger(
      Math.floor(
        startTime /
          secondsPerFrame,
      ),
      0,
      spectralAnalysis.frameCount - 1,
    )

    const lastFrame = clampInteger(
      Math.ceil(
        endTime /
          secondsPerFrame,
      ),
      firstFrame,
      spectralAnalysis.frameCount - 1,
    )

    const visibleFrameCount =
      lastFrame -
      firstFrame +
      1

    /*
     * Build a compact raster rather than
     * drawing one Canvas rectangle for every
     * FFT bin in every frame.
     */
    const rasterWidth = Math.max(
      1,
      Math.min(
        maximumRasterWidth,
        visibleFrameCount,
      ),
    )

    const rasterHeight = Math.max(
      1,
      Math.min(
        maximumRasterHeight,
        Math.floor(plotHeight),
        spectralAnalysis.binCount,
      ),
    )

    const rasterCanvas =
      document.createElement('canvas')

    rasterCanvas.width =
      rasterWidth

    rasterCanvas.height =
      rasterHeight

    const rasterContext =
      rasterCanvas.getContext('2d')

    if (!rasterContext) {
      return
    }

    const imageData =
      rasterContext.createImageData(
        rasterWidth,
        rasterHeight,
      )

    /*
     * Each raster column samples one point
     * across the visible frame range.
     *
     * Each raster row samples one FFT bin,
     * with high frequencies at the top.
     */
    for (
      let rasterX = 0;
      rasterX < rasterWidth;
      rasterX += 1
    ) {
      const horizontalProgress =
        rasterWidth > 1
          ? rasterX /
            (rasterWidth - 1)
          : 0

      const frameIndex =
        clampInteger(
          Math.round(
            firstFrame +
              horizontalProgress *
                (
                  lastFrame -
                  firstFrame
                ),
          ),
          firstFrame,
          lastFrame,
        )

      const frameOffset =
        frameIndex *
        spectralAnalysis.binCount

      for (
        let rasterY = 0;
        rasterY < rasterHeight;
        rasterY += 1
      ) {
        const verticalProgress =
          rasterHeight > 1
            ? rasterY /
              (rasterHeight - 1)
            : 0

        /*
         * Top of plot = Nyquist.
         * Bottom of plot = 0 Hz.
         */
        const binProgress =
          1 -
          verticalProgress

        const binIndex =
          clampInteger(
            Math.round(
              binProgress *
                (
                  spectralAnalysis.binCount -
                  1
                ),
            ),
            0,
            spectralAnalysis.binCount - 1,
          )

        const magnitude =
          spectralAnalysis.magnitudes[
            frameOffset +
              binIndex
          ] ?? 0

        const relativeMagnitude =
          magnitude /
          globalPeakMagnitude

        const decibels =
          magnitudeToRelativeDecibels(
            relativeMagnitude,
          )

        const normalizedIntensity =
          clamp01(
            (
              decibels -
              minimumDecibels
            ) /
              (
                maximumDecibels -
                minimumDecibels
              ),
          )

        const {
          red,
          green,
          blue,
        } =
          getSpectrogramColour(
            normalizedIntensity,
          )

        const pixelOffset =
          (
            rasterY *
              rasterWidth +
            rasterX
          ) * 4

        imageData.data[
          pixelOffset
        ] = red

        imageData.data[
          pixelOffset + 1
        ] = green

        imageData.data[
          pixelOffset + 2
        ] = blue

        imageData.data[
          pixelOffset + 3
        ] = 255
      }
    }

    rasterContext.putImageData(
      imageData,
      0,
      0,
    )

    /*
     * Scale the compact raster into the
     * available scientific plotting area.
     */
    context.save()

    context.imageSmoothingEnabled =
      true

    context.drawImage(
      rasterCanvas,
      leftMargin,
      topMargin,
      plotWidth,
      plotHeight,
    )

    context.restore()

    /*
     * Draw axes above the image.
     */
    context.strokeStyle =
      'rgba(23, 32, 51, 0.3)'

    context.lineWidth = 1

    context.strokeRect(
      leftMargin,
      topMargin,
      plotWidth,
      plotHeight,
    )

    context.font =
      '10px "Courier New", monospace'

    context.fillStyle =
      '#687184'

    /*
     * Frequency ticks.
     */
    const nyquist =
      spectralAnalysis.sampleRate /
      2

    const frequencyTickCount = 4

    context.textAlign = 'right'
    context.textBaseline = 'middle'

    for (
      let tickIndex = 0;
      tickIndex <= frequencyTickCount;
      tickIndex += 1
    ) {
      const progress =
        tickIndex /
        frequencyTickCount

      const y =
        topMargin +
        progress *
          plotHeight

      const frequency =
        nyquist *
        (
          1 -
          progress
        )

      context.strokeStyle =
        'rgba(255, 255, 255, 0.25)'

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
        formatFrequency(
          frequency,
        ),
        leftMargin - 7,
        y,
      )
    }

    /*
     * Time ticks.
     */
    const timeTickCount = 5

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
        startTime +
        progress *
          visibleDuration

      context.fillStyle =
        '#687184'

      context.fillText(
        formatTime(time),
        x,
        topMargin +
          plotHeight +
          7,
      )
    }

    /*
     * Y-axis label.
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
      'Frequency [Hz]',
      0,
      0,
    )

    context.restore()

    /*
     * Magnitude-scale description.
     */
    context.fillStyle =
      '#687184'

    context.textAlign = 'right'
    context.textBaseline = 'top'

    context.fillText(
      'Magnitude [dB rel.]',
      leftMargin +
        plotWidth,
      3,
    )

    /*
     * Shared playback / preview playhead.
     */
    const playbackProgress =
      clamp01(
        (
          currentTime -
          startTime
        ) /
          visibleDuration,
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
    canvasSize,
    spectralAnalysis,
    globalPeakMagnitude,
    currentTime,
    startTime,
    endTime,
  ])

  return (
    <section
      className="spectrogram-view"
      aria-label={accessibleLabel}
    >
      <div
        ref={containerRef}
        className="spectrogram-view__canvas-container"
      >
        <canvas
          ref={canvasRef}
          className="spectrogram-view__canvas"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}

function magnitudeToRelativeDecibels(
  magnitude: number,
): number {
  if (
    !Number.isFinite(magnitude) ||
    magnitude <= 0
  ) {
    return minimumDecibels
  }

  return Math.max(
    minimumDecibels,
    Math.min(
      maximumDecibels,
      20 *
        Math.log10(
          magnitude,
        ),
    ),
  )
}

function getSpectrogramColour(
  intensity: number,
): {
  red: number
  green: number
  blue: number
} {
  /*
   * Soft laboratory background →
   * Synesthesia purple.
   */
  const shapedIntensity =
    Math.pow(
      clamp01(intensity),
      0.72,
    )

  const background = {
    red: 246,
    green: 245,
    blue: 240,
  }

  const foreground = {
    red: 92,
    green: 66,
    blue: 145,
  }

  return {
    red: interpolateChannel(
      background.red,
      foreground.red,
      shapedIntensity,
    ),

    green: interpolateChannel(
      background.green,
      foreground.green,
      shapedIntensity,
    ),

    blue: interpolateChannel(
      background.blue,
      foreground.blue,
      shapedIntensity,
    ),
  }
}

function interpolateChannel(
  start: number,
  end: number,
  amount: number,
): number {
  return Math.round(
    start +
      (
        end -
        start
      ) *
        amount,
  )
}

function clamp01(
  value: number,
): number {
  return Math.min(
    Math.max(
      value,
      0,
    ),
    1,
  )
}

function clampInteger(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    Math.max(
      Math.round(value),
      minimum,
    ),
    maximum,
  )
}

function formatFrequency(
  frequency: number,
): string {
  if (frequency >= 1000) {
    return (
      `${(
        frequency / 1000
      ).toFixed(1)}k`
    )
  }

  return `${Math.round(
    frequency,
  )}`
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