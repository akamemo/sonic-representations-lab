import { PixelFlaskIcon } from '../components/PixelFlaskIcon'

interface LoadingScreenProps {
  fileName: string
}

export function LoadingScreen({
  fileName,
}: LoadingScreenProps) {
  return (
    <main className="phase-screen screen-enter">
      <section
        className="phase-card"
        aria-live="polite"
      >
        <div className="loading-screen__icon">
  <PixelFlaskIcon
    className="loading-screen__flask"
    title="Laboratory flask"
  />
</div>

        <p className="phase-card__eyebrow">
          Preparing experiment
        </p>

        <h1>Decoding audio</h1>

        <p className="phase-card__filename">
          {fileName}
        </p>

        <div
          className="phase-card__activity"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>

        <p className="phase-card__description">
          Reading the local file and preparing its
          time-domain representation.
        </p>
      </section>
    </main>
  )
}