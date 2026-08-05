export function createMonoSignal(
  audioBuffer: AudioBuffer,
): Float32Array {
  if (audioBuffer.length === 0) {
    throw new Error(
      'A mono signal cannot be created from an empty audio buffer.',
    )
  }

  if (audioBuffer.numberOfChannels <= 0) {
    throw new Error(
      'A mono signal requires at least one audio channel.',
    )
  }

  const monoSignal = new Float32Array(
    audioBuffer.length,
  )

  for (
    let channelIndex = 0;
    channelIndex < audioBuffer.numberOfChannels;
    channelIndex += 1
  ) {
    const channel =
      audioBuffer.getChannelData(channelIndex)

    for (
      let sampleIndex = 0;
      sampleIndex < audioBuffer.length;
      sampleIndex += 1
    ) {
      monoSignal[sampleIndex] +=
        channel[sampleIndex] /
        audioBuffer.numberOfChannels
    }
  }

  return monoSignal
}