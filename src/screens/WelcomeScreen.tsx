import {
  useEffect,
  useState,
  type ChangeEvent,
  type DragEvent,
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
  const [isAboutOpen, setIsAboutOpen] =
    useState(false)

  useEffect(() => {
    if (!isAboutOpen) {
      return
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ): void {
      if (event.key === 'Escape') {
        setIsAboutOpen(false)
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [isAboutOpen])

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
            <PixelFlaskIcon
  className="welcome-brand__flask"
  title="Synesthesia"
/>
          </span>

          <span>SYNESTHESIA</span>
        </a>

        <button
          className="about-button"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isAboutOpen}
          onClick={() => {
            setIsAboutOpen(true)
          }}
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

      {isAboutOpen && (
        <div
          className="about-dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setIsAboutOpen(false)
            }
          }}
        >
          <section
            className="about-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-dialog-title"
            aria-describedby="about-dialog-description"
          >
            <header className="about-dialog__header">
              <div>
                <p className="about-dialog__eyebrow">
                  About the laboratory
                </p>

                <h2 id="about-dialog-title">
                  SYNESTHESIA
                </h2>
              </div>

              <button
                className="about-dialog__close"
                type="button"
                aria-label="Close About dialog"
                autoFocus
                onClick={() => {
                  setIsAboutOpen(false)
                }}
              >
                ×
              </button>
            </header>

            <div className="about-dialog__body">
              <p id="about-dialog-description">
                Synesthesia is an interactive audio
                laboratory for exploring how the same
                sound can be analysed and represented
                through complementary visual views.
              </p>

              <div className="about-dialog__mode">
                <strong>Microscope</strong>
                <span>
                  Inspect waveform, spectrum,
                  spectrogram and mel representations,
                  together with audio descriptors at
                  the current playback position.
                </span>
              </div>

              <div className="about-dialog__mode">
                <strong>Canvas</strong>
                <span>
                  Transform RMS energy, spectral
                  centroid, spectral flatness,
                  spectral flux and onset strength
                  into a responsive pixel-art
                  visualization using alternative
                  mapping configurations.
                </span>
              </div>

              <p className="about-dialog__note">
                Audio processing is performed locally
                in the browser. The selected audio
                file is not uploaded to a server.
              </p>
            </div>
          </section>
        </div>
      )}

      <div
        className="decorative-grid"
        aria-hidden="true"
      />
    </main>
  )
}