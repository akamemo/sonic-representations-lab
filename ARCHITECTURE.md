# Architecture

## Architectural Goal

Separate decoding, playback, analysis, mapping and rendering so that each layer has one clear responsibility.

The Canvas renderer does not inspect raw audio descriptors, and Microscope views do not own playback. Both consume shared application state prepared from the same audio file.

## High-Level Data Flow

```text
Local audio file
      |
      v
decodeAudioFile()
      |
      v
   AudioBuffer
      |
      +----------------------------+
      |                            |
      v                            v
PlaybackController             Offline analysis
      |                            |
      |                 +----------+-------------------+
      |                 |                              |
      |                 v                              v
      |          RMS timeline                 Shared spectral analysis
      |                                             |
      |                         +-------------------+-------------------+
      |                         |                   |                   |
      |                         v                   v                   v
      |                    Spectrum /          Spectral           12-band Mel
      |                    Spectrogram         descriptors           energies
      |                                             |
      |                                +------------+-------------+
      |                                |            |             |
      |                                v            v             v
      |                             Centroid     Flatness        Flux
      |                                                           |
      |                                                           v
      |                                                     Onset Strength
      |                                                           
      +----------------------------+
                                   |
                                   v
                              React state
                                   |
                    +--------------+--------------+
                    |                             |
                    v                             v
               Microscope                    Mapping layer
                                                  |
                                                  v
                                       ScientificVisualState
                                                  |
                                                  v
                                        ScientificCanvasView
```

## Application State

`App.tsx` owns the experiment-level state:

- application phase (`welcome`, `loading`, `complete`, `laboratory`);
- selected file;
- decoded `AudioBuffer`;
- prepared analysis timelines;
- playback status and current time;
- seek-preview state;
- current Laboratory mode.

The analysis is performed when a file is decoded. Switching between Microscope and Canvas reuses the existing results rather than recomputing them.

## Playback Architecture

`PlaybackController` wraps the Web Audio API.

Responsibilities:

- create and manage an `AudioContext`;
- create a fresh `AudioBufferSourceNode` when playback starts or resumes;
- maintain the playback offset;
- pause, stop and seek;
- report status changes;
- distinguish natural playback completion from programmatic source stopping;
- dispose of the audio context when the current experiment is replaced.

While playback is active, `App.tsx` samples the controller's current time approximately every 100 ms. Canvas also runs its own animation loop for rendering, but both modes derive their analytical position from the shared playback time.

## Analysis Architecture

### RMS path

```text
AudioBuffer
   |
   v
createRmsTimeline()
   |
   v
Float32Array timeline
```

RMS performs its own multichannel-to-mono averaging per sample because it works directly in the time domain.

### Shared spectral path

```text
AudioBuffer
   |
   v
createMonoSignal()
   |
   v
frame signal (2048 samples, 1024 hop)
   |
   v
Hann window
   |
   v
fft.js real FFT
   |
   v
magnitude spectrum
   |
   +--> stored magnitude frames
   +--> 12-band Mel energies
```

The stored spectral analysis is reused by:

- magnitude spectrum;
- spectrogram;
- spectral centroid;
- spectral flatness;
- spectral flux.

Onset Strength is derived from the Spectral Flux timeline rather than recalculating spectra.

## Timeline Synchronization

Descriptor timelines expose at least:

- `values`;
- `frameCount`;
- `hopSize`;
- `sampleRate`.

`getTimelineValueAtTime()` converts playback time to a frame index. This keeps descriptor values and Canvas mappings synchronized with the same playhead.

## Microscope Architecture

`LaboratoryScreen` selects one representation at a time:

- `DetailedWaveformView`;
- `SpectrumView`;
- `SpectrogramView`;
- `MelRepresentationView`.

Descriptor selection is independent of representation selection.

`DescriptorTrendView` is reused for RMS, Centroid, Flatness and Flux. Onset Strength is displayed as a non-clickable live indicator because its principal role in the current design is transient-event control in Canvas.

## Mapping Architecture

`createScientificVisualState()` is the boundary between analysis and artistic rendering.

Input:

- five descriptor timelines;
- current playback time;
- selected mapping preset.

Output:

```ts
interface ScientificVisualState {
  intensity: number
  colorTemperature: number
  structuralDisorder: number
  motionActivity: number
  impulse: number
}
```

The renderer consumes only this visual state. It does not know which audio descriptor produced a given visual parameter.

### Presets

- `resonance`
- `refraction`
- `fluxfield`

All three reuse the same renderer. They differ only in routing and mapping-specific scaling.

This makes preset comparison meaningful: analysis and rendering are held constant while the descriptor-to-visual relationship changes.

## Canvas Renderer

`ScientificCanvasView` uses Canvas 2D at a deliberately low logical resolution to produce the pixel-art organism.

Core behaviors include:

- body size / occupied area;
- color tendency;
- internal structural order;
- membrane activity;
- transient onset excitation;
- asymmetric smoothing for fast attack and slower decay of impulse;
- deterministic procedural texture.

The renderer is capped at 30 frames per second and adapts its backing canvas to device pixel ratio.

## Current Source Structure

```text
src/
├── analysis/
│   ├── createOnsetStrengthTimeline.ts
│   ├── createRmsTimeline.ts
│   ├── createSpectralAnalysis.ts
│   ├── createSpectralCentroidTimeline.ts
│   ├── createSpectralFlatnessTimeline.ts
│   ├── createSpectralFluxTimeline.ts
│   └── getTimelineValueAtTime.ts
├── audio/
│   └── decodeAudioFile.ts
├── components/
│   ├── DescriptorTrendView.tsx
│   ├── DetailedWaveformView.tsx
│   ├── MelRepresentationView.tsx
│   ├── PixelFlaskIcon.tsx
│   ├── PixelLockIcon.tsx
│   ├── PixelWaveBackground.tsx
│   ├── PlaybackPanel.tsx
│   ├── ScientificCanvasView.tsx
│   ├── SpectrogramView.tsx
│   ├── SpectrumView.tsx
│   └── UploadZone.tsx
├── dsp/
│   ├── calculateMelEnergies.ts
│   ├── createHannWindow.ts
│   ├── createMagnitudeSpectrum.ts
│   ├── createMelFilterBank.ts
│   ├── createMonoSignal.ts
│   ├── createWindowedFrame.ts
│   └── melScale.ts
├── mapping/
│   └── createScientificVisualState.ts
├── playback/
│   └── PlaybackController.ts
├── screens/
│   ├── AnalysisCompleteScreen.tsx
│   ├── LaboratoryScreen.tsx
│   ├── LoadingScreen.tsx
│   └── WelcomeScreen.tsx
├── App.css
├── App.tsx
├── index.css
└── main.tsx
```

## Intentional Boundaries

- No backend.
- No microphone pipeline.
- No state-management library.
- No WebGL.
- No duplicate FFT per spectral descriptor.
- No descriptor interpretation inside the Canvas renderer.
- No recomputation when switching Laboratory modes or Canvas presets.

These constraints keep the MVP small enough to understand and present in full.
