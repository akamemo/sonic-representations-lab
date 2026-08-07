import {
  useEffect,
  useRef,
} from 'react'
import type { ScientificVisualState } from '../mapping/createScientificVisualState'

interface ScientificCanvasViewProps {
  visualState: ScientificVisualState
  isPlaying: boolean
}

interface ScientificCanvasResources {
  stage: HTMLDivElement
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
}

interface SmoothedVisualState {
  intensity: number
  colorTemperature: number
  structuralDisorder: number
  motionActivity: number
}

const maximumFrameRate = 30
const frameDuration = 1000 / maximumFrameRate

function getScientificCanvasResources(
  stage: HTMLDivElement | null,
  canvas: HTMLCanvasElement | null,
): ScientificCanvasResources | null {
  if (!stage || !canvas) {
    return null
  }

  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  return {
    stage,
    canvas,
    context,
  }
}

export function ScientificCanvasView({
  visualState,
  isPlaying,
}: ScientificCanvasViewProps) {
  const stageRef =
    useRef<HTMLDivElement | null>(null)

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null)

  const visualStateRef =
    useRef(visualState)

    const smoothedVisualStateRef =
    useRef<SmoothedVisualState>({
    intensity: clamp01(
      visualState.intensity,
    ),
    colorTemperature: clamp01(
  visualState.colorTemperature,
),
    structuralDisorder: clamp01(
      visualState.structuralDisorder,
    ),
    motionActivity: clamp01(
      visualState.motionActivity,
    ),
  })

  const isPlayingRef =
    useRef(isPlaying)

  const drawFrameRef =
    useRef<((timestamp: number) => void) | null>(
      null,
    )

  const animationFrameRef =
    useRef<number | null>(null)

  useEffect(() => {
  visualStateRef.current = visualState

  if (!isPlaying) {
    smoothedVisualStateRef.current = {
      intensity: clamp01(
        visualState.intensity,
      ),
      colorTemperature: clamp01(
  visualState.colorTemperature,
),
      structuralDisorder: clamp01(
        visualState.structuralDisorder,
      ),
      motionActivity: clamp01(
        visualState.motionActivity,
      ),
    }

    drawFrameRef.current?.(
      window.performance.now(),
    )
  }
}, [visualState, isPlaying])

  useEffect(() => {
    isPlayingRef.current = isPlaying

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(
        animationFrameRef.current,
      )

      animationFrameRef.current = null
    }

    if (!isPlaying) {
      drawFrameRef.current?.(
        window.performance.now(),
      )

      return
    }

    let previousFrameTime = 0

    function animate(timestamp: number): void {
      const elapsed =
        timestamp - previousFrameTime

      if (elapsed >= frameDuration) {
        previousFrameTime =
          timestamp -
          (elapsed % frameDuration)

        drawFrameRef.current?.(timestamp)
      }

      animationFrameRef.current =
        window.requestAnimationFrame(
          animate,
        )
    }

    animationFrameRef.current =
      window.requestAnimationFrame(
        animate,
      )

    return () => {
      if (
        animationFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(
          animationFrameRef.current,
        )

        animationFrameRef.current = null
      }
    }
  }, [isPlaying])

  useEffect(() => {
    const resources =
  getScientificCanvasResources(
    stageRef.current,
    canvasRef.current,
  )

if (!resources) {
  return
}

const {
  stage: stageElement,
  canvas: canvasElement,
  context: drawingContext,
} = resources

    let width = 1
    let height = 1

    function resizeCanvas(): void {
      const bounds =
        stageElement.getBoundingClientRect()

      width = Math.max(
        1,
        Math.floor(bounds.width),
      )

      height = Math.max(
        1,
        Math.floor(bounds.height),
      )

      const pixelRatio = Math.min(
        Math.max(
          window.devicePixelRatio || 1,
          1,
        ),
        2,
      )

      canvasElement.width = Math.floor(
        width * pixelRatio,
      )

      canvasElement.height = Math.floor(
        height * pixelRatio,
      )

      drawingContext.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0,
      )

      drawFrameRef.current?.(
        window.performance.now(),
      )
    }

    function drawFrame(
  timestamp: number,
): void {
  const targetState =
    visualStateRef.current

  const smoothedState =
    smoothedVisualStateRef.current

  const targetIntensity = clamp01(
  targetState.intensity,
)

const targetColorTemperature =
  clamp01(
    targetState.colorTemperature,
  )

const targetStructuralDisorder =
  clamp01(
    targetState.structuralDisorder,
  )

const targetMotionActivity =
  clamp01(
    targetState.motionActivity,
  )

smoothedState.intensity +=
  (
    targetIntensity -
    smoothedState.intensity
  ) * 0.08

smoothedState.colorTemperature +=
  (
    targetColorTemperature -
    smoothedState.colorTemperature
  ) * 0.04

smoothedState.structuralDisorder +=
  (
    targetStructuralDisorder -
    smoothedState.structuralDisorder
  ) * 0.05

const motionSmoothingRate =
  targetMotionActivity >
  smoothedState.motionActivity
    ? 0.24
    : 0.055

smoothedState.motionActivity +=
  (
    targetMotionActivity -
    smoothedState.motionActivity
  ) * motionSmoothingRate

const intensity =
  smoothedState.intensity

const colorTemperature =
  smoothedState.colorTemperature

const structuralDisorder =
  smoothedState.structuralDisorder

const motionActivity =
  smoothedState.motionActivity

const visualColorTemperature =
  remapClamped(
    colorTemperature,
    0.04,
    0.42,
  )

const visualStructuralDisorder =
  remapClamped(
    structuralDisorder,
    0.015,
    0.12,
  )

const visualMotionActivity =
  remapClamped(
    motionActivity,
    0.04,
    0.7,
  )

  drawingContext.clearRect(
    0,
    0,
    width,
    height,
  )

  /*
   * Render at a deliberately low logical resolution.
   * The visible canvas scales these cells into pixel art.
   */
  const logicalWidth = 160
  const logicalHeight = 100

  const cellWidth =
    width / logicalWidth

  const cellHeight =
    height / logicalHeight

  const elapsedSeconds =
    timestamp / 1000

  const centreX =
    logicalWidth * 0.5

  const centreY =
  logicalHeight *
  (
    0.54 -
    visualColorTemperature * 0.08
  )

  /*
   * RMS controls the organism's occupied area.
   */
  const baseRadiusX =
    18 + intensity * 40

  const baseRadiusY =
    13 + intensity * 27

  /*
   * Quiet idle breathing remains subtle.
   */
  const breathing =
    isPlayingRef.current
      ? Math.sin(
          elapsedSeconds * 1.15,
        ) *
        (
          0.6 +
          intensity * 1.4
        )
      : 0

  const transientPulse =
  visualMotionActivity * 5.5

const radiusX =
  baseRadiusX +
  breathing +
  transientPulse

const radiusY =
  baseRadiusY +
  breathing * 0.72 +
  transientPulse * 0.72

  for (
    let logicalY = 0;
    logicalY < logicalHeight;
    logicalY += 1
  ) {
    for (
      let logicalX = 0;
      logicalX < logicalWidth;
      logicalX += 1
    ) {
      const normalizedX =
        (logicalX - centreX) /
        Math.max(radiusX, 0.001)

      const normalizedY =
        (logicalY - centreY) /
        Math.max(radiusY, 0.001)

      const angle =
        Math.atan2(
          normalizedY,
          normalizedX,
        )

      /*
       * Several smooth waves deform the membrane
       * without producing sharp edges.
       */
      const idleMembraneVariation =
  Math.sin(
    angle * 3 +
      elapsedSeconds * 0.42,
  ) *
    0.055 +
  Math.sin(
    angle * 5 -
      elapsedSeconds * 0.31,
  ) *
    0.035 +
  Math.sin(
    angle * 7 +
      elapsedSeconds * 0.18,
  ) *
    0.018

const eventMembraneVariation =
  Math.sin(
    angle * 6 -
      elapsedSeconds * 2.8,
  ) *
  visualMotionActivity *
  0.11

const localExcitation =
  Math.max(
    0,
    Math.cos(
      angle -
        elapsedSeconds * 1.7,
    ),
  ) *
  visualMotionActivity *
  0.14

const membraneVariation =
  idleMembraneVariation +
  eventMembraneVariation +
  localExcitation

      const distance =
        Math.sqrt(
          normalizedX *
            normalizedX +
          normalizedY *
            normalizedY,
        )

      const membraneLimit =
        1 + membraneVariation

      if (distance > membraneLimit) {
        continue
      }

      /*
       * Deterministic internal texture.
       * It moves slowly but remains part of one body.
       */
      const coherentFlow =
  Math.sin(
    logicalX * 0.23 +
      logicalY * 0.11 +
      elapsedSeconds * 0.45,
  ) +
  Math.cos(
    logicalX * 0.09 -
      logicalY * 0.19 -
      elapsedSeconds * 0.33,
  )

const granularNoise =
  Math.sin(
    logicalX * 0.83 +
      logicalY * 1.07 +
      elapsedSeconds * 0.18,
  ) *
  Math.cos(
    logicalX * 1.19 -
      logicalY * 0.77 -
      elapsedSeconds * 0.21,
  )

const textureWave =
  coherentFlow *
    (1 - visualStructuralDisorder) +
  granularNoise *
    visualStructuralDisorder

      const depth =
        Math.max(
          0,
          1 -
            distance /
              Math.max(
                membraneLimit,
                0.001,
              ),
        )

      const membrane =
        distance >
        membraneLimit - 0.075

        const clusterSize = 4

const clusterX =
  Math.floor(
    logicalX / clusterSize,
  )

const clusterY =
  Math.floor(
    logicalY / clusterSize,
  )

const clusterDensity =
  pseudoRandom(
    clusterX,
    clusterY,
  )

  const densityVariation =
  (
    clusterDensity - 0.5
  ) *
  visualStructuralDisorder *
  20

      /*
 * Centroid moves through a restrained
 * laboratory palette:
 *
 * low  → deep blue/violet
 * mid  → cyan/mint
 * high → yellow-green
 */
const baseHue =
  230 -
  visualColorTemperature * 155

const hue =
  baseHue +
  textureWave * 7 +
  depth * 6

      const saturation =
  membrane
    ? 62 +
      visualColorTemperature * 12
    : 54 +
      depth * 18 +
      visualColorTemperature * 10

const lightness =
  membrane
    ? 68 +
      visualColorTemperature * 12
    : 30 +
      depth * 24 +
      visualColorTemperature * 14 +
      textureWave * 4 +
      densityVariation

      const opacity =
  membrane
    ? 0.92
    : 0.58 +
      depth * 0.26 +
      textureWave * 0.04

      if (
  !membrane &&
  visualStructuralDisorder > 0.72
) {
  const poreNoise =
    pseudoRandom(
      logicalX + 97,
      logicalY + 193,
    )

  const poreProbability =
    (
      visualStructuralDisorder -
      0.72
    ) *
    0.08

  if (
    poreNoise <
    poreProbability
  ) {
    continue
  }
}

      drawingContext.fillStyle =
        `hsla(${hue}, ${saturation}%, ` +
        `${lightness}%, ${opacity})`

      drawingContext.fillRect(
        Math.floor(
          logicalX * cellWidth,
        ),
        Math.floor(
          logicalY * cellHeight,
        ),
        Math.ceil(cellWidth),
        Math.ceil(cellHeight),
      )
    }
  }
}

drawFrameRef.current = drawFrame

const resizeObserver =
  new ResizeObserver(() => {
    resizeCanvas()
  })

    resizeObserver.observe(stageElement)
    resizeCanvas()

    return () => {
      resizeObserver.disconnect()
      drawFrameRef.current = null
    }
  }, [])

  const intensity = clamp01(
  visualState.intensity,
)

const colorTemperature = clamp01(
  visualState.colorTemperature,
)

const structuralDisorder = clamp01(
  visualState.structuralDisorder,
)

const motionActivity = clamp01(
  visualState.motionActivity,
)

  return (
    <section
      className="scientific-canvas"
      aria-label="Scientific particle visualization driven by RMS energy, spectral centroid, and spectral flux"
    >
      <div className="scientific-canvas__heading">
        <p className="scientific-canvas__eyebrow">
          Scientific mapping
        </p>
<h2>
  RMS → vitality · Centroid → metabolism ·
  Flatness → structure · Flux → stimulus
</h2>
      </div>

      <div
        ref={stageRef}
        className="scientific-canvas__particle-stage"
      >
        <canvas
          ref={canvasRef}
          className="scientific-canvas__particle-canvas"
          aria-hidden="true"
        />
      </div>

      <div className="scientific-canvas__readings">
  <div className="scientific-canvas__reading">
    <span>Intensity</span>
    <strong>
      {intensity.toFixed(3)}
    </strong>
  </div>

  <div className="scientific-canvas__reading">
    <span>Colour temperature</span>
    <strong>
      {colorTemperature.toFixed(3)}
    </strong>
  </div>

  <div className="scientific-canvas__reading">
    <span>Structural disorder</span>
    <strong>
      {structuralDisorder.toFixed(3)}
    </strong>
  </div>

  <div className="scientific-canvas__reading">
    <span>Motion activity</span>
    <strong>
      {motionActivity.toFixed(3)}
    </strong>
  </div>
</div>

      <p className="scientific-canvas__description">
        RMS controls vitality, spectral centroid controls
        pigmentation, spectral flatness changes cytoplasm
        organization, and spectral flux triggers temporary
        membrane reactions.
      </p>
    </section>
  )
}

function remapClamped(
  value: number,
  inputMinimum: number,
  inputMaximum: number,
): number {
  if (inputMaximum <= inputMinimum) {
    return 0
  }

  return clamp01(
    (value - inputMinimum) /
      (inputMaximum - inputMinimum),
  )
}

function pseudoRandom(
  x: number,
  y: number,
): number {
  const value =
    Math.sin(
      x * 127.1 +
      y * 311.7,
    ) * 43758.5453

  return value - Math.floor(value)
}

function clamp01(value: number): number {
  return Math.min(
    Math.max(value, 0),
    1,
  )
}