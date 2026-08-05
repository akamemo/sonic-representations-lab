interface AnalysisCompleteScreenProps {
  file: File
  audioBuffer: AudioBuffer
  onStartExploring: () => void
  onStartOver: () => void
}

function formatDuration(
  durationSeconds: number,
): string {
  const totalSeconds = Math.floor(
    Math.max(0, durationSeconds),
  )
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`
}

export function AnalysisCompleteScreen({
  file,
  audioBuffer,
  onStartExploring,
  onStartOver,
}: AnalysisCompleteScreenProps) {
  return (
    <main className="phase-screen screen-enter">
      <section className="phase-card phase-card--complete">
        <div
          className="phase-card__symbol"
          aria-hidden="true"
        >
          ✓
        </div>

        <p className="phase-card__eyebrow">
          Experiment ready
        </p>

        <h1>Audio prepared</h1>

        <p className="phase-card__filename">
          {file.name}
        </p>

        <dl className="phase-summary">
          <div>
            <dt>Duration</dt>
            <dd>
              {formatDuration(audioBuffer.duration)}
            </dd>
          </div>

          <div>
            <dt>Sample rate</dt>
            <dd>{audioBuffer.sampleRate} Hz</dd>
          </div>

          <div>
            <dt>Channels</dt>
            <dd>{audioBuffer.numberOfChannels}</dd>
          </div>
        </dl>

        <div className="phase-card__actions">
          <button
            className="primary-action"
            type="button"
            onClick={onStartExploring}
          >
            Start exploring
          </button>

          <button
            className="secondary-action"
            type="button"
            onClick={onStartOver}
          >
            Choose another file
          </button>
        </div>
      </section>
    </main>
  )
}