const twoPi = 2 * Math.PI

export function createHannWindow(
  size: number,
): Float32Array {
  if (!Number.isInteger(size) || size <= 1) {
    throw new Error(
      'The Hann window size must be an integer greater than one.',
    )
  }

  const window = new Float32Array(size)
  const denominator = size - 1

  for (
    let sampleIndex = 0;
    sampleIndex < size;
    sampleIndex += 1
  ) {
    window[sampleIndex] =
      0.5 -
      0.5 *
        Math.cos(
          (twoPi * sampleIndex) / denominator,
        )
  }

  return window
}