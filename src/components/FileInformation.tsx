interface FileInformationProps {
  file: File
  audioBuffer: AudioBuffer
}

function formatFileSize(bytes: number): string {
  const megabytes = bytes / (1024 * 1024)

  if (megabytes < 0.01) {
    return `${bytes} bytes`
  }

  return `${megabytes.toFixed(2)} MB`
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

function getFileExtension(
  fileName: string,
): string {
  return (
    fileName.split('.').pop()?.toLowerCase() ?? ''
  )
}

export function FileInformation({
  file,
  audioBuffer,
}: FileInformationProps) {
  return (
    <section
      className="track-information"
      aria-labelledby="track-information-title"
    >
      <div className="track-information__heading">
        <div>
          <p className="track-information__eyebrow">
            Current experiment
          </p>

          <h2 id="track-information-title">
            {file.name}
          </h2>
        </div>

        <span className="track-information__status">
          Ready
        </span>
      </div>

      <dl className="track-information__metadata">
        <div>
          <dt>Format</dt>
          <dd>
            {getFileExtension(
              file.name,
            ).toUpperCase()}
          </dd>
        </div>

        <div>
          <dt>Size</dt>
          <dd>{formatFileSize(file.size)}</dd>
        </div>

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
    </section>
  )
}