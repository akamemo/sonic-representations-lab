export interface RmsTimeline {
  values: Float32Array
  frameSize: number
  hopSize: number
  frameCount: number
  sampleRate: number
}

export interface RmsAnalysisOptions {
  frameSize?: number
  hopSize?: number
}

const defaultFrameSize = 2048
const defaultHopSize = 1024

export function createRmsTimeline(
  audioBuffer: AudioBuffer,
  options: RmsAnalysisOptions = {},
): RmsTimeline {
  const frameSize =
    options.frameSize ?? defaultFrameSize

  const hopSize =
    options.hopSize ?? defaultHopSize

  validateAnalysisOptions(
    audioBuffer,
    frameSize,
    hopSize,
  )

  const frameCount = Math.max(
    1,
    Math.ceil(
      (audioBuffer.length - frameSize) /
        hopSize,
    ) + 1,
  )

  const values = new Float32Array(frameCount)

  const channelData = Array.from(
    {
      length: audioBuffer.numberOfChannels,
    },
    (_, channelIndex) =>
      audioBuffer.getChannelData(channelIndex),
  )

  for (
    let frameIndex = 0;
    frameIndex < frameCount;
    frameIndex += 1
  ) {
    const frameStart =
      frameIndex * hopSize

    const frameEnd = Math.min(
      frameStart + frameSize,
      audioBuffer.length,
    )

    let squaredSampleSum = 0
    let analysedSampleCount = 0

    for (
      let sampleIndex = frameStart;
      sampleIndex < frameEnd;
      sampleIndex += 1
    ) {
      let monoSample = 0

      for (
        let channelIndex = 0;
        channelIndex <
        audioBuffer.numberOfChannels;
        channelIndex += 1
      ) {
        monoSample +=
          channelData[channelIndex][sampleIndex]
      }

      monoSample /=
        audioBuffer.numberOfChannels

      squaredSampleSum +=
        monoSample * monoSample

      analysedSampleCount += 1
    }

    values[frameIndex] =
      analysedSampleCount > 0
        ? Math.sqrt(
            squaredSampleSum /
              analysedSampleCount,
          )
        : 0
  }

  return {
    values,
    frameSize,
    hopSize,
    frameCount,
    sampleRate: audioBuffer.sampleRate,
  }
}

function validateAnalysisOptions(
  audioBuffer: AudioBuffer,
  frameSize: number,
  hopSize: number,
): void {
  if (audioBuffer.length === 0) {
    throw new Error(
      'RMS analysis cannot process an empty audio buffer.',
    )
  }

  if (
    audioBuffer.numberOfChannels <= 0
  ) {
    throw new Error(
      'RMS analysis requires at least one audio channel.',
    )
  }

  if (
    !Number.isInteger(frameSize) ||
    frameSize <= 0
  ) {
    throw new Error(
      'The RMS frame size must be a positive integer.',
    )
  }

  if (
    !Number.isInteger(hopSize) ||
    hopSize <= 0
  ) {
    throw new Error(
      'The RMS hop size must be a positive integer.',
    )
  }
}