import { useState } from 'react'
import { PlaybackPanel } from '../components/PlaybackPanel'
import { WaveformView } from '../components/WaveformView'
import type { PlaybackStatus } from '../playback/PlaybackController'
import type { RmsTimeline } from '../analysis/createRmsTimeline'
import { DescriptorTrendView } from '../components/DescriptorTrendView'
import { ScientificCanvasView } from '../components/ScientificCanvasView'
import { createScientificVisualState } from '../mapping/createScientificVisualState'
import type { SpectralAnalysis } from '../analysis/createSpectralAnalysis'
import type { SpectralCentroidTimeline } from '../analysis/createSpectralCentroidTimeline'
import { getTimelineValueAtTime } from '../analysis/getTimelineValueAtTime'
import { SpectrumView } from '../components/SpectrumView'
import type { SpectralFluxTimeline } from '../analysis/createSpectralFluxTimeline'
import type { SpectralFlatnessTimeline } from '../analysis/createSpectralFlatnessTimeline'

type LaboratoryMode =
  | 'microscope'
  | 'canvas'
  
type MicroscopeRepresentation =
  | 'waveform'
  | 'spectrum'

type MicroscopeDescriptor =
  | 'rms'
  | 'spectralCentroid'
  | 'spectralFlux'

interface LaboratoryScreenProps {
  file: File
  audioBuffer: AudioBuffer
  rmsTimeline: RmsTimeline
  spectralAnalysis: SpectralAnalysis
  spectralCentroidTimeline: SpectralCentroidTimeline
  spectralFluxTimeline: SpectralFluxTimeline
  spectralFlatnessTimeline: SpectralFlatnessTimeline
  laboratoryMode: LaboratoryMode
  onLaboratoryModeChange: (
    mode: LaboratoryMode,
  ) => void
  playbackStatus: PlaybackStatus
  currentTime: number
  isSeeking: boolean
  seekPreviewTime: number
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onSeekStart: () => void
  onSeekPreview: (time: number) => void
  onSeekCommit: (time: number) => void
  onSeekCancel: () => void
  onStartNewExperiment: () => void
}

const representations = [
  'Waveform',
  'Spectrum',
  'Spectrogram',
  'Mel Representation',
]

const descriptors = [
  'RMS Energy',
  'Spectral Centroid',
  'Spectral Flux',
  'Spectral Flatness',
  'Onset Strength',
]

const canvasPresets = [
  'Scientific',
  'Organic',
  'Geometric',
  'Custom',
]

export function LaboratoryScreen({
  file,
  audioBuffer,
  rmsTimeline,
  spectralAnalysis,
  spectralCentroidTimeline,
  spectralFluxTimeline,
  spectralFlatnessTimeline,
  laboratoryMode,
  onLaboratoryModeChange,
  playbackStatus,
  currentTime,
  isSeeking,
  seekPreviewTime,
  onPlay,
  onPause,
  onStop,
  onSeekStart,
  onSeekPreview,
  onSeekCommit,
  onSeekCancel,
  onStartNewExperiment,
}: LaboratoryScreenProps) {
  
  const [
    activeRepresentation,
    setActiveRepresentation,
  ] = useState<MicroscopeRepresentation>(
    'waveform',
  )

  const [
    activeDescriptor,
    setActiveDescriptor,
  ] = useState<MicroscopeDescriptor>('rms')

  const displayedTime = isSeeking
    ? seekPreviewTime
    : currentTime

    const currentRmsValue =
  getTimelineValueAtTime(
    rmsTimeline,
    displayedTime,
  )

  const currentCentroidValue =
  getTimelineValueAtTime(
    spectralCentroidTimeline,
    displayedTime,
  )

  const currentFluxValue =
  getTimelineValueAtTime(
    spectralFluxTimeline,
    displayedTime,
  )

  const visualState =
  createScientificVisualState(
    rmsTimeline,
    spectralCentroidTimeline,
    spectralFlatnessTimeline,
    spectralFluxTimeline,
    displayedTime,
  )

  const selectedDescriptor =
  activeDescriptor === 'rms'
    ? {
        name: 'RMS Energy',
        timeline: rmsTimeline,
        currentValue:
          currentRmsValue.toFixed(3),
        accessibleLabel:
          'Normalized RMS energy over the complete audio duration',
        explanation:
          'RMS measures short-term signal energy. The graph is normalized for visual comparison and does not represent perceived loudness directly.',
      }
    : activeDescriptor ===
        'spectralCentroid'
      ? {
          name: 'Spectral Centroid',
          timeline:
            spectralCentroidTimeline,
          currentValue: `${Math.round(
            currentCentroidValue,
          )} Hz`,
          accessibleLabel:
            'Spectral centroid over the complete audio duration',
          explanation:
            'Spectral centroid describes the magnitude-weighted centre of the spectrum. Higher values indicate that more spectral energy is concentrated at higher frequencies.',
        }
      : {
          name: 'Spectral Flux',
          timeline: spectralFluxTimeline,
          currentValue:
            currentFluxValue.toFixed(3),
          accessibleLabel:
            'Spectral flux over the complete audio duration',
          explanation:
            'Spectral flux measures positive changes between consecutive magnitude spectra. Higher values indicate greater short-term spectral change.',
        }

  return (
    <main className="laboratory-screen screen-enter">
      <header className="laboratory-bar">
        <div className="laboratory-bar__brand">
          <span
            className="brand__mark"
            aria-hidden="true"
          >
            ✣
          </span>

          <div>
            <p>SYNESTHESIA</p>
            <span>{file.name}</span>
          </div>
        </div>

        <nav
          className="laboratory-modes"
          aria-label="Laboratory mode"
        >
          <button
            className={`laboratory-modes__button${
              laboratoryMode === 'microscope'
                ? ' laboratory-modes__button--active'
                : ''
            }`}
            type="button"
            aria-pressed={
              laboratoryMode === 'microscope'
            }
            onClick={() =>
              onLaboratoryModeChange('microscope')
            }
          >
            Microscope
          </button>

          <button
            className={`laboratory-modes__button${
              laboratoryMode === 'canvas'
                ? ' laboratory-modes__button--active'
                : ''
            }`}
            type="button"
            aria-pressed={
              laboratoryMode === 'canvas'
            }
            onClick={() =>
              onLaboratoryModeChange('canvas')
            }
          >
            Canvas
          </button>
        </nav>

        <button
          className="secondary-action"
          type="button"
          onClick={onStartNewExperiment}
        >
          Start new experiment
        </button>
      </header>

      <section className="laboratory-workspace">
        {laboratoryMode === 'microscope' ? (
          <div className="microscope-layout">
            <aside className="microscope-context">
              <section className="context-section">
                <p className="context-section__eyebrow">
                  Views
                </p>

                <div className="context-list">
  {representations.map((representation) => {
    const representationId =
      representation === 'Waveform'
        ? 'waveform'
        : representation === 'Spectrum'
          ? 'spectrum'
          : null

    const isAvailable =
      representationId !== null

    const isActive =
      representationId === activeRepresentation

    return (
      <button
        key={representation}
        className={`context-list__button${
          isActive
            ? ' context-list__button--active'
            : ''
        }`}
        type="button"
        disabled={!isAvailable}
        aria-pressed={isActive}
        onClick={() => {
          if (representationId) {
            setActiveRepresentation(
              representationId,
            )
          }
        }}
      >
        {representation}
      </button>
    )
  })}
</div>
              </section>

              <section className="context-section">
                <p className="context-section__eyebrow">
                  Descriptors
                </p>

                <div className="descriptor-list">
  {descriptors.map((descriptor) => {
    const descriptorId =
  descriptor === 'RMS Energy'
    ? 'rms'
    : descriptor ===
        'Spectral Centroid'
      ? 'spectralCentroid'
      : descriptor ===
          'Spectral Flux'
        ? 'spectralFlux'
        : null

    const isAvailable =
      descriptorId !== null

    const isActive =
      descriptorId === activeDescriptor

    let displayedValue = 'Pending'

    if (descriptorId === 'rms') {
      displayedValue =
        currentRmsValue.toFixed(3)
    }

    if (
      descriptorId ===
      'spectralCentroid'
    ) {
      displayedValue = `${Math.round(
        currentCentroidValue,
      )} Hz`
    }

    if (descriptorId === 'spectralFlux') {
  displayedValue =
    currentFluxValue.toFixed(3)
    }

    return (
      <button
        key={descriptor}
        className={`descriptor-list__item${
          isActive
            ? ' descriptor-list__item--active'
            : ''
        }`}
        type="button"
        disabled={!isAvailable}
        aria-pressed={isActive}
        onClick={() => {
          if (descriptorId) {
            setActiveDescriptor(
              descriptorId,
            )
          }
        }}
      >
        <span>{descriptor}</span>
        <span>{displayedValue}</span>
      </button>
    )
  })}
</div>
              </section>

              <section className="context-section">
                <p className="context-section__eyebrow">
                  Experiment
                </p>

                <dl className="compact-metadata">
                  <div>
                    <dt>Duration</dt>
                    <dd>
                      {Math.floor(
                        audioBuffer.duration,
                      )}{' '}
                      s
                    </dd>
                  </div>

                  <div>
                    <dt>Sample rate</dt>
                    <dd>
                      {audioBuffer.sampleRate} Hz
                    </dd>
                  </div>

                  <div>
                    <dt>Channels</dt>
                    <dd>
                      {
                        audioBuffer.numberOfChannels
                      }
                    </dd>
                  </div>
                </dl>
              </section>
            </aside>

            <section className="microscope-main">
              <header className="representation-header">
                <div>
                  <p className="representation-header__eyebrow">
                    Active representation
                  </p>

                  <h1>
  {activeRepresentation === 'waveform'
    ? 'Waveform'
    : 'Magnitude Spectrum'}
</h1>
                </div>

                <span className="representation-header__note">
  {activeRepresentation === 'waveform'
    ? 'Complete duration'
    : 'Current frame'}
</span>
              </header>

              <section className="representation-stage">
  {activeRepresentation === 'waveform' ? (
    <WaveformView
      audioBuffer={audioBuffer}
      currentTime={displayedTime}
      onSeekStart={onSeekStart}
      onSeekPreview={onSeekPreview}
      onSeekCommit={onSeekCommit}
      onSeekCancel={onSeekCancel}
    />
  ) : (
    <SpectrumView
      spectralAnalysis={spectralAnalysis}
      currentTime={displayedTime}
    />
  )}
</section>

              <section
  className="descriptor-trend-panel"
  aria-labelledby="descriptor-trend-title"
>
  <div className="descriptor-trend-panel__heading">
    <div>
      <p className="context-section__eyebrow">
        Descriptor over time
      </p>

      <h2 id="descriptor-trend-title">
        {selectedDescriptor.name}
      </h2>
    </div>

    <span>
      Current:{' '}
      {selectedDescriptor.currentValue}
    </span>
  </div>

  <DescriptorTrendView
    timeline={selectedDescriptor.timeline}
    currentTime={displayedTime}
    duration={audioBuffer.duration}
    accessibleLabel={
      selectedDescriptor.accessibleLabel
    }
  />

  <p className="descriptor-trend-panel__note">
    {selectedDescriptor.explanation}
  </p>
</section>
            </section>
          </div>
        ) : (
          <div className="canvas-layout">
            <section className="canvas-stage">
  <ScientificCanvasView
  visualState={visualState}
  isPlaying={playbackStatus === 'playing'}
/>
</section>

            <aside className="canvas-context">
              <p className="context-section__eyebrow">
                Visualization presets
              </p>

              <div className="preset-list">
                {canvasPresets.map(
                  (preset, index) => (
                    <button
                      key={preset}
                      className={`preset-list__button${
                        index === 0
                          ? ' preset-list__button--active'
                          : ''
                      }`}
                      type="button"
                      disabled={index !== 0}
                    >
                      <strong>{preset}</strong>
                      <span>
                        {preset === 'Scientific'
                          ? 'Direct analytical mapping'
                          : 'Coming later'}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </aside>
          </div>
        )}
      </section>

      <footer className="laboratory-playback">
        <PlaybackPanel
          playbackStatus={playbackStatus}
          currentTime={currentTime}
          duration={audioBuffer.duration}
          isSeeking={isSeeking}
          seekPreviewTime={seekPreviewTime}
          onPlay={onPlay}
          onPause={onPause}
          onStop={onStop}
          onSeekStart={onSeekStart}
          onSeekPreview={onSeekPreview}
          onSeekCommit={onSeekCommit}
          onSeekCancel={onSeekCancel}
        />
      </footer>
    </main>
  )
}