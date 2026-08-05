import FFT from 'fft.js'

export interface MagnitudeSpectrum {
  magnitudes: Float64Array
  binCount: number
  fftSize: number
}

export function createMagnitudeSpectrum(
  windowedFrame: Float64Array,
): MagnitudeSpectrum {
  const fftSize = windowedFrame.length

  validateFftSize(fftSize)

  const fft = new FFT(fftSize)
  const complexSpectrum = fft.createComplexArray()

  fft.realTransform(
    complexSpectrum,
    windowedFrame,
  )

  const binCount = fftSize / 2 + 1
  const magnitudes = new Float64Array(binCount)

  for (
    let binIndex = 0;
    binIndex < binCount;
    binIndex += 1
  ) {
    const realPart =
      complexSpectrum[2 * binIndex] ?? 0

    const imaginaryPart =
      complexSpectrum[2 * binIndex + 1] ?? 0

    magnitudes[binIndex] = Math.hypot(
      realPart,
      imaginaryPart,
    )
  }

  return {
    magnitudes,
    binCount,
    fftSize,
  }
}

function validateFftSize(fftSize: number): void {
  if (
    !Number.isInteger(fftSize) ||
    fftSize <= 1
  ) {
    throw new Error(
      'The FFT size must be an integer greater than one.',
    )
  }

  const isPowerOfTwo =
    (fftSize & (fftSize - 1)) === 0

  if (!isPowerOfTwo) {
    throw new Error(
      'The FFT size must be a power of two.',
    )
  }
}