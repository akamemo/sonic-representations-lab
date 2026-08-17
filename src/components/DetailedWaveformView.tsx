import {
  useEffect,
  useRef,
  useState,
} from 'react'

interface DetailedWaveformViewProps {
  audioBuffer: AudioBuffer
  currentTime: number
  startTime: number
  endTime: number
}

export function DetailedWaveformView({
  audioBuffer,
  currentTime,
  startTime,
  endTime,
}: DetailedWaveformViewProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null)

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null)

  interface CanvasSize {
  width: number
  height: number
}

const [canvasSize, setCanvasSize] =
  useState<CanvasSize>({
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
  const canvas =
    canvasRef.current

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

    const pixelRatio =
      Math.max(
        1,
        window.devicePixelRatio || 1,
      )

    canvas.width =
      Math.floor(
        canvasWidth *
          pixelRatio,
      )

    canvas.height =
      Math.floor(
        canvasHeight *
          pixelRatio,
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
      'rgba(255, 255, 255, 0.3)'

    context.fillRect(
      0,
      0,
      canvasWidth,
      canvasHeight,
    )

    const visibleDuration =
      Math.max(
        endTime - startTime,
        0,
      )

    if (visibleDuration <= 0) {
      return
    }

    const leftMargin = 64
    const rightMargin = 34
    const topMargin = 16
    const bottomMargin = 32

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

    const centreY =
      topMargin +
      plotHeight / 2

    const amplitudeScale =
      plotHeight * 0.46

    /*
     * Axes.
     */
    context.strokeStyle =
      'rgba(23, 32, 51, 0.2)'

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
     * Zero-amplitude reference.
     */
    context.strokeStyle =
      'rgba(23, 32, 51, 0.12)'

    context.beginPath()

    context.moveTo(
      leftMargin,
      centreY,
    )

    context.lineTo(
      leftMargin +
        plotWidth,
      centreY,
    )

    context.stroke()

    /*
     * Axis text.
     */
    context.fillStyle =
      '#596275'

    context.font =
      '11px "Courier New", monospace'

    context.textBaseline =
      'middle'

    context.textAlign =
      'right'

    context.fillText(
      '+1.0',
      leftMargin - 7,
      topMargin,
    )

    context.fillText(
      '0.0',
      leftMargin - 7,
      centreY,
    )

    context.fillText(
      '-1.0',
      leftMargin - 7,
      topMargin +
        plotHeight,
    )

    /*
     * Time labels.
     */
    context.textAlign =
      'center'

    context.textBaseline =
      'top'

    const tickCount = 5

    for (
      let tickIndex = 0;
      tickIndex <= tickCount;
      tickIndex += 1
    ) {
      const progress =
        tickIndex /
        tickCount

      const tickX =
        leftMargin +
        progress *
          plotWidth

      const tickTime =
        startTime +
        progress *
          visibleDuration

      context.fillText(
        formatTime(tickTime),
        tickX,
        topMargin +
          plotHeight +
          8,
      )
    }

    /*
     * Waveform samples.
     */
    const channelData =
      audioBuffer.getChannelData(0)

    const sampleRate =
      audioBuffer.sampleRate

    const startSample =
      Math.max(
        0,
        Math.floor(
          startTime *
            sampleRate,
        ),
      )

    const endSample =
      Math.min(
        channelData.length,
        Math.ceil(
          endTime *
            sampleRate,
        ),
      )

    const visibleSampleCount =
      Math.max(
        1,
        endSample -
          startSample,
      )

    context.strokeStyle =
      '#4f9268'

    context.lineWidth = 1

    context.beginPath()

    const horizontalPixels =
      Math.max(
        1,
        Math.floor(
          plotWidth,
        ),
      )

    for (
      let pixelIndex = 0;
      pixelIndex <
      horizontalPixels;
      pixelIndex += 1
    ) {
      const startProgress =
        pixelIndex /
        horizontalPixels

      const endProgress =
        (pixelIndex + 1) /
        horizontalPixels

      const bucketStart =
        startSample +
        Math.floor(
          startProgress *
            visibleSampleCount,
        )

      const bucketEnd =
        Math.min(
          endSample,
          startSample +
            Math.ceil(
              endProgress *
                visibleSampleCount,
            ),
        )

      const bucketLength =
        Math.max(
          1,
          bucketEnd -
            bucketStart,
        )

      const sampleStep =
        Math.max(
          1,
          Math.floor(
            bucketLength / 48,
          ),
        )

      let minimum = 1
      let maximum = -1

      for (
        let sampleIndex =
          bucketStart;
        sampleIndex <
        bucketEnd;
        sampleIndex +=
          sampleStep
      ) {
        const sample =
          channelData[
            sampleIndex
          ] ?? 0

        minimum =
          Math.min(
            minimum,
            sample,
          )

        maximum =
          Math.max(
            maximum,
            sample,
          )
      }

      const x =
        leftMargin +
        pixelIndex

      const topY =
        centreY -
        maximum *
          amplitudeScale

      const bottomY =
        centreY -
        minimum *
          amplitudeScale

      context.moveTo(
        x,
        topY,
      )

      context.lineTo(
        x,
        bottomY,
      )
    }

    context.stroke()

    /*
     * Playback cursor.
     */
    const playbackProgress =
      clamp01(
        (
          currentTime -
          startTime
        ) /
          visibleDuration,
      )

    const cursorX =
      leftMargin +
      playbackProgress *
        plotWidth

    context.strokeStyle =
      '#7251aa'

    context.lineWidth = 2

    context.beginPath()

    context.moveTo(
      cursorX,
      topMargin,
    )

    context.lineTo(
      cursorX,
      topMargin +
        plotHeight,
    )

    context.stroke()
  }, [
  audioBuffer,
  canvasSize,
  currentTime,
  startTime,
  endTime,
])

  return (
  <section className="detailed-waveform-view">
    <div
      ref={containerRef}
      className="detailed-waveform-view__canvas-container"
    >
        <canvas
          ref={canvasRef}
          className="detailed-waveform-view__canvas"
          role="img"
          aria-label="Detailed waveform for the current inspection window"
        >
          Your browser does not support
          canvas-based waveform rendering.
        </canvas>
      </div>
    </section>
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