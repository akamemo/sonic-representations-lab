import {
  useRef,
  type ChangeEvent,
  type PointerEvent,
} from 'react'
import type { PlaybackStatus } from '../playback/PlaybackController'

interface PlaybackPanelProps {
  playbackStatus: PlaybackStatus
  currentTime: number
  duration: number
  isSeeking: boolean
  seekPreviewTime: number
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onSeekStart: () => void
  onSeekPreview: (time: number) => void
  onSeekCommit: (time: number) => void
  onSeekCancel: () => void
}

function formatDuration(durationSeconds: number): string {
  const safeDuration = Math.max(0, durationSeconds)
  const totalSeconds = Math.floor(safeDuration)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`
}

export function PlaybackPanel({
  playbackStatus,
  currentTime,
  duration,
  isSeeking,
  seekPreviewTime,
  onPlay,
  onPause,
  onStop,
  onSeekStart,
  onSeekPreview,
  onSeekCommit,
  onSeekCancel,
}: PlaybackPanelProps) {
  const pointerSeekingRef = useRef(false)

  const displayedTime = isSeeking
    ? seekPreviewTime
    : currentTime

  function handlePointerDown(): void {
    pointerSeekingRef.current = true
    onSeekStart()
  }

  function handleSliderChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    if (!pointerSeekingRef.current) {
      return
    }

    onSeekPreview(Number(event.target.value))
  }

  function handlePointerUp(
    event: PointerEvent<HTMLInputElement>,
  ): void {
    const targetTime = Number(event.currentTarget.value)

    pointerSeekingRef.current = false
    onSeekCommit(targetTime)
  }

  function handlePointerCancel(): void {
    pointerSeekingRef.current = false
    onSeekCancel()
  }

  return (
    <div className="playback-panel">
      <div
        className="playback-panel__controls"
        aria-label="Audio playback controls"
      >
        <button
          type="button"
          onClick={onPlay}
          disabled={playbackStatus === 'playing'}
        >
          Play
        </button>

        <button
          type="button"
          onClick={onPause}
          disabled={playbackStatus !== 'playing'}
        >
          Pause
        </button>

        <button
          type="button"
          onClick={onStop}
          disabled={
            playbackStatus === 'ready' ||
            playbackStatus === 'stopped'
          }
        >
          Stop
        </button>
      </div>

      <div className="playback-panel__time">
        <span>{formatDuration(displayedTime)}</span>
        <span aria-hidden="true">/</span>
        <span>{formatDuration(duration)}</span>
      </div>

      <input
        className="playback-panel__seek"
        type="range"
        min={0}
        max={duration}
        step={0.01}
        value={displayedTime}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onChange={handleSliderChange}
        aria-label="Playback position"
      />
    </div>
  )
}