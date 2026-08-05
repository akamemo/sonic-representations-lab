import { createHannWindow } from '../dsp/createHannWindow'
import { createMagnitudeSpectrum } from '../dsp/createMagnitudeSpectrum'
import { createMonoSignal } from '../dsp/createMonoSignal'
import { createWindowedFrame } from '../dsp/createWindowedFrame'

export interface SpectralAnalysis {
  magnitudes: Float32Array
  frameCount: number
  binCount: number
  fftSize: number
  hopSize: number
  sampleRate: number
}

export interface SpectralAnalysisOptions {
  fftSize?: number
  hopSize?: number
}

const defaultFftSize = 2048
const defaultHopSize = 1024

export function createSpectralAnalysis(
  audioBuffer: AudioBuffer,
  options: SpectralAnalysisOptions = {},
): SpectralAnalysis {
  const fftSize =
    options.fftSize ?? defaultFftSize

  const hopSize =
    options.hopSize ?? defaultHopSize

  validateOptions(
    audioBuffer,
    fftSize,
    hopSize,
  )

  const monoSignal =
    createMonoSignal(audioBuffer)

  const window =
    createHannWindow(fftSize)

  const frameCount = Math.max(
    1,
    Math.ceil(
      (monoSignal.length - fftSize) /
        hopSize,
    ) + 1,
  )

  const binCount = fftSize / 2 + 1

  /*
   * All spectra are stored in one flat typed array:
   *
   * frame 0 bins
   * frame 1 bins
   * frame 2 bins
   * ...
   */
  const magnitudes = new Float32Array(
    frameCount * binCount,
  )

  for (
    let frameIndex = 0;
    frameIndex < frameCount;
    frameIndex += 1
  ) {
    const frameStart =
      frameIndex * hopSize

    const windowedFrame =
      createWindowedFrame(
        monoSignal,
        frameStart,
        window,
      )

    const spectrum =
      createMagnitudeSpectrum(
        windowedFrame,
      )

    const destinationOffset =
      frameIndex * binCount

    for (
      let binIndex = 0;
      binIndex < binCount;
      binIndex += 1
    ) {
      magnitudes[
        destinationOffset + binIndex
      ] =
        spectrum.magnitudes[binIndex] ?? 0
    }
  }

  return {
    magnitudes,
    frameCount,
    binCount,
    fftSize,
    hopSize,
    sampleRate: audioBuffer.sampleRate,
  }
}

function validateOptions(
  audioBuffer: AudioBuffer,
  fftSize: number,
  hopSize: number,
): void {
  if (audioBuffer.length === 0) {
    throw new Error(
      'Spectral analysis cannot process an empty audio buffer.',
    )
  }

  if (
    !Number.isInteger(fftSize) ||
    fftSize <= 1
  ) {
    throw new Error(
      'The spectral FFT size must be an integer greater than one.',
    )
  }

  const isPowerOfTwo =
    (fftSize & (fftSize - 1)) === 0

  if (!isPowerOfTwo) {
    throw new Error(
      'The spectral FFT size must be a power of two.',
    )
  }

  if (
    !Number.isInteger(hopSize) ||
    hopSize <= 0
  ) {
    throw new Error(
      'The spectral hop size must be a positive integer.',
    )
  }

  if (hopSize > fftSize) {
    throw new Error(
      'The spectral hop size must not exceed the FFT size.',
    )
  }
}