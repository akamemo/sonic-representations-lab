export type PlaybackStatus =
  | 'ready'
  | 'playing'
  | 'paused'
  | 'stopped'
  | 'ended'

type StatusListener = (status: PlaybackStatus) => void

export class PlaybackController {
  private readonly audioContext: AudioContext
  private readonly audioBuffer: AudioBuffer
  private readonly statusListener: StatusListener

  private sourceNode: AudioBufferSourceNode | null = null
  private playbackOffset = 0
  private contextStartTime = 0
  private status: PlaybackStatus = 'ready'
  private disposed = false

  constructor(
    audioBuffer: AudioBuffer,
    statusListener: StatusListener,
  ) {
    this.audioBuffer = audioBuffer
    this.statusListener = statusListener
    this.audioContext = new AudioContext()
  }

  async play(): Promise<void> {
    this.assertNotDisposed()

    if (this.status === 'playing') {
      return
    }

    if (this.playbackOffset >= this.audioBuffer.duration) {
      this.playbackOffset = 0
    }

    await this.startSource()
  }

  pause(): void {
    this.assertNotDisposed()

    if (this.status !== 'playing') {
      return
    }

    this.playbackOffset = this.getCurrentTime()
    this.stopCurrentSource()
    this.setStatus('paused')
  }

  stop(): void {
    this.assertNotDisposed()

    this.stopCurrentSource()
    this.playbackOffset = 0
    this.setStatus('stopped')
  }

  async seek(time: number): Promise<void> {
    this.assertNotDisposed()

    const targetTime = Math.min(
      Math.max(time, 0),
      this.audioBuffer.duration,
    )

    const wasPlaying = this.status === 'playing'

    this.stopCurrentSource()
    this.playbackOffset = targetTime

    if (targetTime >= this.audioBuffer.duration) {
      this.setStatus('ended')
      return
    }

    if (wasPlaying) {
      await this.startSource()
      return
    }

    this.setStatus(targetTime === 0 ? 'stopped' : 'paused')
  }

  getCurrentTime(): number {
    if (this.status !== 'playing') {
      return this.playbackOffset
    }

    const elapsedTime =
      this.audioContext.currentTime - this.contextStartTime

    return Math.min(
      this.playbackOffset + elapsedTime,
      this.audioBuffer.duration,
    )
  }

  getDuration(): number {
    return this.audioBuffer.duration
  }

  getStatus(): PlaybackStatus {
    return this.status
  }

  async dispose(): Promise<void> {
    if (this.disposed) {
      return
    }

    this.stopCurrentSource()
    this.disposed = true

    if (this.audioContext.state !== 'closed') {
      await this.audioContext.close()
    }
  }

  private async startSource(): Promise<void> {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    const sourceNode = this.audioContext.createBufferSource()

    sourceNode.buffer = this.audioBuffer
    sourceNode.connect(this.audioContext.destination)

    this.sourceNode = sourceNode
    this.contextStartTime = this.audioContext.currentTime
    this.setStatus('playing')

    sourceNode.addEventListener(
      'ended',
      () => {
        const endedNaturally =
          this.sourceNode === sourceNode &&
          this.status === 'playing'

        if (!endedNaturally) {
          return
        }

        this.sourceNode = null
        this.playbackOffset = this.audioBuffer.duration
        this.setStatus('ended')
      },
      { once: true },
    )

    sourceNode.start(0, this.playbackOffset)
  }

  private stopCurrentSource(): void {
    if (!this.sourceNode) {
      return
    }

    const sourceNode = this.sourceNode
    this.sourceNode = null

    try {
      sourceNode.stop()
    } catch {
      // The source may already have stopped naturally.
    }

    sourceNode.disconnect()
  }

  private setStatus(status: PlaybackStatus): void {
    this.status = status
    this.statusListener(status)
  }

  private assertNotDisposed(): void {
    if (this.disposed) {
      throw new Error(
        'The playback controller has already been disposed.',
      )
    }
  }
}