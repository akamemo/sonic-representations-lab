export async function decodeAudioFile(
  file: File,
): Promise<AudioBuffer> {
  const audioData = await file.arrayBuffer()
  const audioContext = new AudioContext()

  try {
    return await audioContext.decodeAudioData(audioData)
  } catch {
    throw new Error(
      'The selected file could not be decoded as audio.',
    )
  } finally {
    await audioContext.close()
  }
}