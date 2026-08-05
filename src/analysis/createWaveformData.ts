export interface WaveformData {
  minimums: Float32Array
  maximums: Float32Array
  bucketCount: number
}

export function createWaveformData(
  audioBuffer: AudioBuffer,
  requestedBucketCount: number,
): WaveformData {
  if (!Number.isInteger(requestedBucketCount)) {
    throw new Error(
      'The waveform bucket count must be an integer.',
    )
  }

  if (requestedBucketCount <= 0) {
    throw new Error(
      'The waveform bucket count must be greater than zero.',
    )
  }

  if (audioBuffer.length === 0) {
    throw new Error(
      'Waveform data cannot be created from an empty audio buffer.',
    )
  }

  const bucketCount = Math.min(
    requestedBucketCount,
    audioBuffer.length,
  )

  const minimums = new Float32Array(bucketCount)
  const maximums = new Float32Array(bucketCount)

  for (let bucketIndex = 0; bucketIndex < bucketCount; bucketIndex += 1) {
    const startSample = Math.floor(
      (bucketIndex * audioBuffer.length) / bucketCount,
    )

    const endSample = Math.max(
      startSample + 1,
      Math.floor(
        ((bucketIndex + 1) * audioBuffer.length) / bucketCount,
      ),
    )

    let bucketMinimum = 1
    let bucketMaximum = -1

    for (
      let sampleIndex = startSample;
      sampleIndex < endSample;
      sampleIndex += 1
    ) {
      let monoSample = 0

      for (
        let channelIndex = 0;
        channelIndex < audioBuffer.numberOfChannels;
        channelIndex += 1
      ) {
        monoSample +=
          audioBuffer.getChannelData(channelIndex)[sampleIndex]
      }

      monoSample /= audioBuffer.numberOfChannels

      if (monoSample < bucketMinimum) {
        bucketMinimum = monoSample
      }

      if (monoSample > bucketMaximum) {
        bucketMaximum = monoSample
      }
    }

    minimums[bucketIndex] = bucketMinimum
    maximums[bucketIndex] = bucketMaximum
  }

  return {
    minimums,
    maximums,
    bucketCount,
  }
}