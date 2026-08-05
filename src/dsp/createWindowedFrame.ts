export function createWindowedFrame(
  signal: Float32Array,
  frameStart: number,
  window: Float32Array,
): Float64Array {
  if (!Number.isInteger(frameStart) || frameStart < 0) {
    throw new Error(
      'The frame start position must be a non-negative integer.',
    )
  }

  if (window.length <= 1) {
    throw new Error(
      'A windowed frame requires a valid analysis window.',
    )
  }

  const frame = new Float64Array(window.length)

  for (
    let frameSampleIndex = 0;
    frameSampleIndex < window.length;
    frameSampleIndex += 1
  ) {
    const signalIndex =
      frameStart + frameSampleIndex

    const signalSample =
      signalIndex < signal.length
        ? signal[signalIndex]
        : 0

    frame[frameSampleIndex] =
      signalSample * window[frameSampleIndex]
  }

  return frame
}