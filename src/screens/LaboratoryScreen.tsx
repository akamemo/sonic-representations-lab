import { useState } from 'react'
import { PlaybackPanel } from '../components/PlaybackPanel'
import type { PlaybackStatus } from '../playback/PlaybackController'
import type { RmsTimeline } from '../analysis/createRmsTimeline'
import { DescriptorTrendView } from '../components/DescriptorTrendView'
import { ScientificCanvasView } from '../components/ScientificCanvasView'
import {
  createScientificVisualState,
  type VisualMappingPreset,
} from '../mapping/createScientificVisualState'
import type { SpectralAnalysis } from '../analysis/createSpectralAnalysis'
import type { SpectralCentroidTimeline } from '../analysis/createSpectralCentroidTimeline'
import { getTimelineValueAtTime } from '../analysis/getTimelineValueAtTime'
import { SpectrumView } from '../components/SpectrumView'
import type { SpectralFluxTimeline } from '../analysis/createSpectralFluxTimeline'
import type { SpectralFlatnessTimeline } from '../analysis/createSpectralFlatnessTimeline'
import { DetailedWaveformView } from '../components/DetailedWaveformView'
import { SpectrogramView } from '../components/SpectrogramView'
import { MelRepresentationView } from '../components/MelRepresentationView'
import { PixelFlaskIcon } from '../components/PixelFlaskIcon'
import type { OnsetStrengthTimeline } from '../analysis/createOnsetStrengthTimeline'

type LaboratoryMode =
  | 'microscope'
  | 'canvas'

type MicroscopeRepresentation =
  | 'waveform'
  | 'spectrum'
  | 'spectrogram'
  | 'mel'

type MicroscopeDescriptor =
  | 'rms'
  | 'spectralCentroid'
  | 'spectralFlux'
  | 'spectralFlatness'

interface InspectionWindow {
  startTime: number
  endTime: number
  duration: number
}

const inspectionWindowDuration = 10

function getInspectionWindow(
  currentTime: number,
  trackDuration: number,
): InspectionWindow {
  const visibleDuration =
    Math.min(
      inspectionWindowDuration,
      trackDuration,
    )

  if (visibleDuration <= 0) {
    return {
      startTime: 0,
      endTime: 0,
      duration: 0,
    }
  }

  const halfWindow =
    visibleDuration / 2

  const maximumStart =
    Math.max(
      0,
      trackDuration -
      visibleDuration,
    )

  const startTime =
    Math.min(
      Math.max(
        currentTime -
        halfWindow,
        0,
      ),
      maximumStart,
    )

  return {
    startTime,
    endTime:
      startTime +
      visibleDuration,
    duration: visibleDuration,
  }
}

interface LaboratoryScreenProps {
  file: File
  audioBuffer: AudioBuffer
  rmsTimeline: RmsTimeline
  spectralAnalysis: SpectralAnalysis
  spectralCentroidTimeline: SpectralCentroidTimeline
  spectralFluxTimeline: SpectralFluxTimeline
  spectralFlatnessTimeline: SpectralFlatnessTimeline
  onsetStrengthTimeline: OnsetStrengthTimeline
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

const canvasPresets: {
  id: VisualMappingPreset
  name: string
  description: string
}[] = [
  {
    id: 'resonance',
    name: 'Resonance',
    description:
      'Energy-led, perceptually direct',
  },
  {
    id: 'refraction',
    name: 'Refraction',
    description:
      'Brightness reshapes energy',
  },
  {
    id: 'fluxfield',
    name: 'Fluxfield',
    description:
      'Spectral change drives the body',
  },
]

const canvasPresetDetails: Record<
  VisualMappingPreset,
  {
    description: string
    mappings: {
      visualProperty: string
      descriptor: string
    }[]
  }
> = {
  resonance: {
    description:
      'Energy shapes the body while spectral character controls colour, structure and motion.',
    mappings: [
      {
        visualProperty: 'Vitality',
        descriptor: 'RMS Energy',
      },
      {
        visualProperty: 'Pigmentation',
        descriptor: 'Spectral Centroid',
      },
      {
        visualProperty: 'Structure',
        descriptor: 'Spectral Flatness',
      },
      {
        visualProperty: 'Motion',
        descriptor: 'Spectral Flux',
      },
      {
        visualProperty: 'Impulse',
        descriptor: 'Onset Strength',
      },
    ],
  },

  refraction: {
    description:
      'Spectral brightness shapes the body while signal energy shifts its colour and spectral change reorganizes its structure.',
    mappings: [
      {
        visualProperty: 'Vitality',
        descriptor: 'Spectral Centroid',
      },
      {
        visualProperty: 'Pigmentation',
        descriptor: 'RMS Energy',
      },
      {
        visualProperty: 'Structure',
        descriptor: 'Spectral Flux',
      },
      {
        visualProperty: 'Motion',
        descriptor: 'Spectral Flatness',
      },
      {
        visualProperty: 'Impulse',
        descriptor: 'Onset Strength',
      },
    ],
  },

  fluxfield: {
    description:
      'Spectral change becomes the main spatial driver, while timbral descriptors redirect colour, structure and motion.',
    mappings: [
      {
        visualProperty: 'Vitality',
        descriptor: 'Spectral Flux',
      },
      {
        visualProperty: 'Pigmentation',
        descriptor: 'Spectral Flatness',
      },
      {
        visualProperty: 'Structure',
        descriptor: 'RMS Energy',
      },
      {
        visualProperty: 'Motion',
        descriptor: 'Spectral Centroid',
      },
      {
        visualProperty: 'Impulse',
        descriptor: 'Onset Strength',
      },
    ],
  },
}

export function LaboratoryScreen({
  file,
  audioBuffer,
  rmsTimeline,
  spectralAnalysis,
  spectralCentroidTimeline,
  spectralFluxTimeline,
  spectralFlatnessTimeline,
  onsetStrengthTimeline,
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

  const [
    activeVisualMapping,
    setActiveVisualMapping,
  ] =
    useState<VisualMappingPreset>(
      'resonance',
    )

  const activeCanvasPreset =
    canvasPresets.find(
      (preset) =>
        preset.id === activeVisualMapping,
    ) ?? canvasPresets[0]

  const activeCanvasPresetDetails =
    canvasPresetDetails[
    activeVisualMapping
    ]

  const displayedTime = isSeeking
    ? seekPreviewTime
    : currentTime

  const inspectionWindow =
    getInspectionWindow(
      displayedTime,
      audioBuffer.duration,
    )

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

  const currentFlatnessValue =
    getTimelineValueAtTime(
      spectralFlatnessTimeline,
      displayedTime,
    )

  const currentOnsetStrengthValue =
    getTimelineValueAtTime(
      onsetStrengthTimeline,
      displayedTime,
    )

  const visualState =
    createScientificVisualState(
      rmsTimeline,
      spectralCentroidTimeline,
      spectralFlatnessTimeline,
      spectralFluxTimeline,
      onsetStrengthTimeline,
      displayedTime,
      activeVisualMapping,
    )

  const selectedDescriptor =
    activeDescriptor === 'rms'
      ? {
        name: 'RMS Energy',

        timeline: rmsTimeline,

        currentValue:
          currentRmsValue.toFixed(3),

        accessibleLabel:
          'Normalized RMS energy over the current inspection window',

        explanation:
          'RMS measures short-term signal energy. The graph is normalized for visual comparison and does not represent perceived loudness directly.',

        axisLabel:
          'RMS [norm.]',

        formatAxisValue: (
          value: number,
        ): string =>
          value.toFixed(2),
      }
      : activeDescriptor ===
        'spectralCentroid'
        ? {
          name: 'Spectral Centroid',

          timeline:
            spectralCentroidTimeline,

          currentValue:
            `${Math.round(
              currentCentroidValue,
            )} Hz`,

          accessibleLabel:
            'Spectral centroid over the current inspection window',

          explanation:
            'Spectral centroid describes the magnitude-weighted centre of the spectrum. Higher values indicate that more spectral energy is concentrated at higher frequencies.',

          axisLabel:
            'Centroid [Hz]',

          formatAxisValue: (
            value: number,
          ): string =>
            `${Math.round(value)}`,
        }
        : activeDescriptor ===
          'spectralFlux'
          ? {
            name: 'Spectral Flux',

            timeline:
              spectralFluxTimeline,

            currentValue:
              currentFluxValue.toFixed(3),

            accessibleLabel:
              'Spectral flux over the current inspection window',

            explanation:
              'Spectral flux measures positive changes between consecutive magnitude spectra. Higher values indicate greater short-term spectral change.',

            axisLabel:
              'Flux [norm.]',

            formatAxisValue: (
              value: number,
            ): string =>
              value.toFixed(2),
          }
          : {
            name: 'Spectral Flatness',

            timeline:
              spectralFlatnessTimeline,

            currentValue:
              currentFlatnessValue.toFixed(3),

            accessibleLabel:
              'Spectral flatness over the current inspection window',

            explanation:
              'Spectral flatness describes how noise-like or tone-like the spectrum is. Values closer to 1 indicate a flatter, more noise-like spectrum, while lower values indicate stronger tonal concentration.',

            axisLabel:
              'Flat. [0-1]',

            formatAxisValue: (
              value: number,
            ): string =>
              value.toFixed(2),
          }

  return (
    <main className="laboratory-screen screen-enter">
      <header className="laboratory-bar">
        <div className="laboratory-bar__brand">
          <PixelFlaskIcon
            className="laboratory-bar__flask"
            title="Synesthesia laboratory"
          />

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
            className={`laboratory-modes__button${laboratoryMode === 'microscope'
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
            className={`laboratory-modes__button${laboratoryMode === 'canvas'
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
                    const representationId:
                      MicroscopeRepresentation | null =
                      representation === 'Waveform'
                        ? 'waveform'
                        : representation === 'Spectrum'
                          ? 'spectrum'
                          : representation === 'Spectrogram'
                            ? 'spectrogram'
                            : representation === 'Mel Representation'
                              ? 'mel'
                              : null

                    const isAvailable =
                      representationId !== null

                    const isActive =
                      representationId === activeRepresentation

                    return (
                      <button
                        key={representation}
                        className={`context-list__button${isActive
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
                    const descriptorId:
                      MicroscopeDescriptor | null =
                      descriptor === 'RMS Energy'
                        ? 'rms'
                        : descriptor ===
                          'Spectral Centroid'
                          ? 'spectralCentroid'
                          : descriptor ===
                            'Spectral Flux'
                            ? 'spectralFlux'
                            : descriptor ===
                              'Spectral Flatness'
                              ? 'spectralFlatness'
                              : null

                    const isOnsetIndicator =
                      descriptor === 'Onset Strength'

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

                    if (
                      descriptorId ===
                      'spectralFlatness'
                    ) {
                      displayedValue =
                        currentFlatnessValue.toFixed(3)
                    }

                    if (
                      descriptor ===
                      'Onset Strength'
                    ) {
                      displayedValue =
                        currentOnsetStrengthValue.toFixed(3)
                    }

                    if (isOnsetIndicator) {
                      return (
                        <div
                          key={descriptor}
                          className="descriptor-list__item descriptor-list__item--indicator"
                        >
                          <span>
                            {descriptor}
                          </span>

                          <span>
                            {displayedValue}
                          </span>
                        </div>
                      )
                    }

                    return (
                      <button
                        key={descriptor}
                        className={`descriptor-list__item${isActive
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
                  <h1>
                    {activeRepresentation === 'waveform'
                      ? 'Waveform'
                      : activeRepresentation === 'spectrum'
                        ? 'Magnitude Spectrum'
                        : activeRepresentation === 'spectrogram'
                          ? 'Spectrogram'
                          : 'Mel Representation'}
                  </h1>
                </div>

                <span className="representation-header__note">
                  {activeRepresentation === 'waveform' ||
                    activeRepresentation === 'spectrogram'
                    ? `Inspection window · ${inspectionWindow.duration.toFixed(1)} s`
                    : 'Current frame'}
                </span>
              </header>

              <section className="representation-stage">
                {activeRepresentation === 'waveform' ? (
                  <div className="microscope-waveform-inspection">
                    <section className="microscope-detail-panel">
                      <DetailedWaveformView
                        audioBuffer={audioBuffer}
                        currentTime={displayedTime}
                        startTime={
                          inspectionWindow.startTime
                        }
                        endTime={
                          inspectionWindow.endTime
                        }
                      />
                    </section>
                  </div>
                ) : activeRepresentation ===
                  'spectrogram' ? (
                  <SpectrogramView
                    spectralAnalysis={
                      spectralAnalysis
                    }
                    currentTime={
                      displayedTime
                    }
                    startTime={
                      inspectionWindow.startTime
                    }
                    endTime={
                      inspectionWindow.endTime
                    }
                  />
                ) : activeRepresentation ===
                  'mel' ? (
                  <MelRepresentationView
                    spectralAnalysis={
                      spectralAnalysis
                    }
                    currentTime={
                      displayedTime
                    }
                  />
                ) : (
                  <SpectrumView
                    spectralAnalysis={
                      spectralAnalysis
                    }
                    currentTime={
                      displayedTime
                    }
                  />
                )}
              </section>

              <section
                className="descriptor-trend-panel"
                aria-labelledby="descriptor-trend-title"
              >
                <div className="descriptor-trend-panel__heading">
                  <div>
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
                  timeline={
                    selectedDescriptor.timeline
                  }
                  currentTime={displayedTime}
                  inspectionStartTime={
                    inspectionWindow.startTime
                  }
                  inspectionEndTime={
                    inspectionWindow.endTime
                  }
                  accessibleLabel={
                    selectedDescriptor.accessibleLabel
                  }
                  axisLabel={
                    selectedDescriptor.axisLabel
                  }
                  formatAxisValue={
                    selectedDescriptor.formatAxisValue
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
            <section className="canvas-main">
              <header className="canvas-main__header">
                <p className="canvas-main__eyebrow">
                  Canvas
                </p>

                <span className="canvas-main__status">
                  Live analytical mapping
                </span>
              </header>

              <section className="canvas-stage">
                <ScientificCanvasView
                  visualState={visualState}
                  isPlaying={
                    playbackStatus ===
                    'playing'
                  }
                />
              </section>
            </section>

            <aside className="canvas-context">
              <section className="canvas-context__section">
                <p className="context-section__eyebrow">
                  Visualization presets
                </p>

                <div className="preset-list">
                  {canvasPresets.map((preset) => (
                    <button
                      key={preset.id}
                      className={`preset-list__button${activeVisualMapping ===
                          preset.id
                          ? ' preset-list__button--active'
                          : ''
                        }`}
                      type="button"
                      aria-pressed={
                        activeVisualMapping ===
                        preset.id
                      }
                      onClick={() => {
                        setActiveVisualMapping(
                          preset.id,
                        )
                      }}
                    >
                      <strong>
                        {preset.name}
                      </strong>

                      <span>
                        {preset.description}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="canvas-context__section canvas-context__section--about">
                <p className="context-section__eyebrow">
                  About {activeCanvasPreset.name}
                </p>

                <p className="canvas-preset-description">
                  {
                    activeCanvasPresetDetails.description
                  }
                </p>
              </section>

              <section className="canvas-context__section canvas-context__section--mappings">
                <p className="canvas-preset-subheading">
                  Mappings
                </p>

                <dl className="canvas-mapping-summary">
                  {activeCanvasPresetDetails.mappings.map(
                    (mapping) => (
                      <div
                        key={
                          mapping.visualProperty
                        }
                      >
                        <dt>
                          {
                            mapping.visualProperty
                          }
                        </dt>

                        <dd>
                          {mapping.descriptor}
                        </dd>
                      </div>
                    ),
                  )}
                </dl>
              </section>
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