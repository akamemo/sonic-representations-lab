import {
  useEffect,
  useRef,
} from 'react'

interface CanvasResources {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
}

const columnCount = 120
const targetFrameDuration = 1000 / 24

/*
 * Handcrafted normalized silhouette.
 * Values are interpolated across the complete canvas width.
 */
const landscapeProfile = [
  0.10, 0.12, 0.13, 0.16, 0.18,
  0.22, 0.28, 0.34, 0.41, 0.48,
  0.54, 0.58, 0.61, 0.64, 0.60,
  0.55, 0.50, 0.46, 0.43, 0.47,
  0.54, 0.62, 0.70, 0.76, 0.72,
  0.64, 0.56, 0.50, 0.45, 0.42,
  0.46, 0.52, 0.58, 0.63, 0.59,
  0.51, 0.43, 0.36, 0.30, 0.26,
  0.22, 0.19, 0.16, 0.14, 0.12,
]

function getCanvasResources(
  canvas: HTMLCanvasElement | null,
): CanvasResources | null {
  if (!canvas) {
    return null
  }

  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  return {
    canvas,
    context,
  }
}

export function PixelWaveBackground() {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const resources =
  getCanvasResources(canvasRef.current)

if (!resources) {
  return
}

const {
  canvas: canvasElement,
  context: drawingContext,
} = resources

    const reducedMotionQuery =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      )

    const coarsePointerQuery =
      window.matchMedia('(pointer: coarse)')

    let width = 0
    let height = 0
    let animationFrameId = 0
    let lastFrameTime = 0
    let pointerX: number | null = null
    let smoothedPointerX: number | null = null

    function resizeCanvas(): void {
      const bounds =
        canvasElement.getBoundingClientRect()

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
    }

    function handlePointerMove(
      event: PointerEvent,
    ): void {
      if (coarsePointerQuery.matches) {
        return
      }

      const bounds =
        canvasElement.getBoundingClientRect()

      pointerX = Math.min(
        Math.max(
          event.clientX - bounds.left,
          0,
        ),
        bounds.width,
      )
    }

    function handlePointerLeave(): void {
      pointerX = null
    }

    function getProfileValue(
      progress: number,
    ): number {
      const profilePosition =
        progress *
        (landscapeProfile.length - 1)

      const lowerIndex =
        Math.floor(profilePosition)

      const upperIndex = Math.min(
        lowerIndex + 1,
        landscapeProfile.length - 1,
      )

      const interpolation =
        profilePosition - lowerIndex

      const lowerValue =
        landscapeProfile[lowerIndex] ?? 0

      const upperValue =
        landscapeProfile[upperIndex] ?? 0

      return (
        lowerValue +
        (upperValue - lowerValue) *
          interpolation
      )
    }

    function updatePointerPosition(): void {
      if (
        pointerX !== null &&
        smoothedPointerX === null
      ) {
        smoothedPointerX = pointerX
      }

      if (
        pointerX !== null &&
        smoothedPointerX !== null
      ) {
        smoothedPointerX +=
          (pointerX - smoothedPointerX) *
          0.1

        return
      }

      if (smoothedPointerX !== null) {
        smoothedPointerX +=
          (width / 2 - smoothedPointerX) *
          0.018
      }
    }

    function drawWave(
      elapsedSeconds: number,
    ): void {
      drawingContext.clearRect(
        0,
        0,
        width,
        height,
      )

      updatePointerPosition()

      const reducedMotion =
        reducedMotionQuery.matches

      const horizontalPadding =
        Math.max(18, width * 0.02)

      const availableWidth =
        width - horizontalPadding * 2

      const pixelSize = Math.max(
        2,
        Math.min(4, width / 380),
      )

      const pixelGap = pixelSize + 2

      for (
        let columnIndex = 0;
        columnIndex < columnCount;
        columnIndex += 1
      ) {
        const progress =
          columnIndex /
          Math.max(1, columnCount - 1)

        const x =
          horizontalPadding +
          progress * availableWidth

        const profileValue =
          getProfileValue(progress)

        const breathing =
          reducedMotion
            ? 0
            : Math.sin(
                elapsedSeconds * 0.55 +
                  progress * Math.PI * 8,
              ) *
              height *
              0.012

        let pointerInfluence = 0

        if (
          !reducedMotion &&
          !coarsePointerQuery.matches &&
          smoothedPointerX !== null
        ) {
          const distance =
            Math.abs(
              x - smoothedPointerX,
            )

          const influenceRadius =
            Math.max(
              100,
              width * 0.13,
            )

          const normalizedDistance =
            Math.min(
              distance /
                influenceRadius,
              1,
            )

          const influence =
            1 -
            normalizedDistance *
              normalizedDistance

          pointerInfluence =
            Math.max(0, influence) *
            height *
            0.07
        }

        const columnHeight = Math.min(
          height * 0.83,
          Math.max(
            height * 0.14,
            profileValue *
              height *
              0.76 +
              breathing +
              pointerInfluence,
          ),
        )

        const pixelCount = Math.max(
          1,
          Math.ceil(
            columnHeight / pixelGap,
          ),
        )

        const topY =
          height -
          pixelCount * pixelGap

        for (
          let pixelIndex = 0;
          pixelIndex < pixelCount;
          pixelIndex += 1
        ) {
          const depth =
            pixelIndex /
            Math.max(
              1,
              pixelCount - 1,
            )

          const opacity = Math.min(
            0.56,
            0.1 +
              depth * 0.38 +
              profileValue * 0.08,
          )

          drawingContext.fillStyle =
            `rgba(79, 146, 104, ${opacity})`

          drawingContext.fillRect(
            Math.round(x),
            Math.round(
              topY +
                pixelIndex *
                  pixelGap,
            ),
            pixelSize,
            pixelSize,
          )
        }
      }
    }

    function animate(
      timestamp: number,
    ): void {
      const elapsed =
        timestamp - lastFrameTime

      if (
        elapsed >= targetFrameDuration
      ) {
        lastFrameTime =
          timestamp -
          (elapsed %
            targetFrameDuration)

        drawWave(timestamp / 1000)
      }

      animationFrameId =
        window.requestAnimationFrame(
          animate,
        )
    }

    resizeCanvas()

    window.addEventListener(
      'resize',
      resizeCanvas,
    )

    window.addEventListener(
      'pointermove',
      handlePointerMove,
    )

    document.documentElement.addEventListener(
      'pointerleave',
      handlePointerLeave,
    )

    if (reducedMotionQuery.matches) {
      drawWave(0)
    } else {
      animationFrameId =
        window.requestAnimationFrame(
          animate,
        )
    }

    return () => {
      window.cancelAnimationFrame(
        animationFrameId,
      )

      window.removeEventListener(
        'resize',
        resizeCanvas,
      )

      window.removeEventListener(
        'pointermove',
        handlePointerMove,
      )

      document.documentElement.removeEventListener(
        'pointerleave',
        handlePointerLeave,
      )
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pixel-wave-background"
      aria-hidden="true"
    />
  )
}