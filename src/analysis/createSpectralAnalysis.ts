import { createHannWindow } from '../dsp/createHannWindow'
import { createMagnitudeSpectrum } from '../dsp/createMagnitudeSpectrum'
import { createMonoSignal } from '../dsp/createMonoSignal'
import { createWindowedFrame } from '../dsp/createWindowedFrame'
import { createMelFilterBank } from '../dsp/createMelFilterBank'
import { calculateMelEnergies} from '../dsp/calculateMelEnergies'

export interface SpectralAnalysis {
  magnitudes: Float32Array
  frameCount: number
  binCount: number
  fftSize: number
  hopSize: number
  sampleRate: number

  melEnergies: Float32Array
  melBandCount: number
  melCentreFrequencies: Float32Array
}

export interface SpectralAnalysisOptions {
  fftSize?: number
  hopSize?: number
}

const defaultFftSize = 2048
const defaultHopSize = 1024
const defaultMelBandCount = 12

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
  const melFilterBank =
  createMelFilterBank({
    sampleRate:
      audioBuffer.sampleRate,
    fftSize,
    bandCount:
      defaultMelBandCount,
  })

const melEnergies =
  new Float32Array(
    frameCount *
      defaultMelBandCount,
  )

const currentMelEnergies =
  new Float32Array(
    defaultMelBandCount,
  )

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
    calculateMelEnergies(
  spectrum.magnitudes,
  melFilterBank,
  currentMelEnergies,
)

const melDestinationOffset =
  frameIndex *
  defaultMelBandCount

melEnergies.set(
  currentMelEnergies,
  melDestinationOffset,
)
  }

  return {
  magnitudes,
  frameCount,
  binCount,
  fftSize,
  hopSize,
  sampleRate:
    audioBuffer.sampleRate,

  melEnergies,
  melBandCount:
    defaultMelBandCount,
  melCentreFrequencies:
    melFilterBank.centreFrequencies,
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