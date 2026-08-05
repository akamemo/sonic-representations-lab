import type {
  ChangeEvent,
  DragEvent,
} from 'react'
import { UploadZone } from '../components/UploadZone'
import { PixelFlaskIcon } from '../components/PixelFlaskIcon'
import { PixelWaveBackground } from '../components/PixelWaveBackground'
import { PixelLockIcon } from '../components/PixelLockIcon'

interface WelcomeScreenProps {
  hasSelectedFile: boolean
  isDragging: boolean
  errorMessage: string | null
  onFileSelection: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void
  onDragOver: (
    event: DragEvent<HTMLLabelElement>,
  ) => void
  onDragLeave: (
    event: DragEvent<HTMLLabelElement>,
  ) => void
  onDrop: (
    event: DragEvent<HTMLLabelElement>,
  ) => void
}

export function WelcomeScreen({
  hasSelectedFile,
  isDragging,
  errorMessage,
  onFileSelection,
  onDragOver,
  onDragLeave,
  onDrop,
}: WelcomeScreenProps) {
  return (
    <main className="welcome-screen screen-enter">
      <PixelWaveBackground />

      <header className="top-bar">
        <a
          className="brand"
          href="/"
          aria-label="Synesthesia home"
        >
          <span
            className="brand__mark"
            aria-hidden="true"
          >
            ✣
          </span>

          <span>SYNESTHESIA</span>
        </a>

        <button
          className="about-button"
          type="button"
        >
          About
        </button>
      </header>

      <section className="welcome-content">
        <div className="laboratory-symbol">
  <PixelFlaskIcon
    className="laboratory-symbol__flask"
    title="Laboratory flask"
  />
</div>

        <p className="welcome-content__eyebrow">
          Interactive audio laboratory
        </p>

        <h1>SYNESTHESIA</h1>

        <p className="welcome-content__subtitle">
          An Interactive Laboratory
          <br />
          for Sound Exploration
        </p>

        <p className="welcome-content__description">
          Explore how sound can be analysed, understood,
          and represented through multiple complementary
          views.
        </p>

        <UploadZone
          hasSelectedFile={hasSelectedFile}
          isDragging={isDragging}
          onFileSelection={onFileSelection}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />

        {errorMessage && (
          <div
            className="file-feedback"
            aria-live="polite"
          >
            <p className="file-feedback__error">
              {errorMessage}
            </p>
          </div>
        )}
      </section>

      <footer className="privacy-note">
        <PixelLockIcon
  className="privacy-note__icon"
  title="Private local processing"
/>

        <span>
          Your audio never leaves your device.
          <br />
          All analysis is performed locally in your browser.
        </span>
      </footer>

      <div
        className="decorative-grid"
        aria-hidden="true"
      />
    </main>
  )
}