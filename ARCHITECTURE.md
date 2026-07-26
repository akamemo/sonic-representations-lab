# Architecture

## Architectural Goal

Keep audio loading, playback, analysis, state management, and visualization separated so that each part can be built and tested independently.

## High-Level Data Flow

```text
Audio file
    |
    v
Audio loader and decoder
    |
    +----------------------> Playback engine
    |
    v
Analysis pipeline
    |
    +--> waveform data
    +--> FFT frames
    +--> spectrogram matrix
    +--> feature timelines
    +--> global feature summary
                |
                v
          Application state
                |
        +-------+-------+
        |               |
        v               v
 Microscope view    Canvas view
```

## Proposed Technology Stack

- React
- TypeScript
- Vite
- Web Audio API
- Canvas 2D initially
- Optional lightweight DSP library only where justified
- GitHub Pages

## Proposed Source Structure

```text
src/
├── audio/
│   ├── audioLoader.ts
│   ├── playbackEngine.ts
│   └── audioTypes.ts
├── analysis/
│   ├── frameAnalysis.ts
│   ├── fft.ts
│   ├── rms.ts
│   ├── spectralCentroid.ts
│   ├── spectralFlatness.ts
│   ├── spectralRolloff.ts
│   ├── zeroCrossingRate.ts
│   └── onsetStrength.ts
├── visualization/
│   ├── waveform/
│   ├── spectrum/
│   ├── spectrogram/
│   └── generativeCanvas/
├── components/
│   ├── UploadPanel.tsx
│   ├── Transport.tsx
│   ├── FeatureInspector.tsx
│   └── MappingControls.tsx
├── state/
│   └── audioStore.ts
├── pages/
│   ├── MicroscopePage.tsx
│   ├── CanvasPage.tsx
│   └── AboutPage.tsx
└── App.tsx
```

## Main Modules

### Audio Loader

Responsibilities:

- validate the selected file;
- decode it into an `AudioBuffer`;
- expose metadata;
- handle decoding errors.

### Playback Engine

Responsibilities:

- start, pause, stop, and seek;
- expose playback position;
- synchronize UI updates;
- avoid duplicated audio nodes.

### Analysis Pipeline

Responsibilities:

- split audio into overlapping frames;
- apply a window function;
- calculate FFT data;
- derive spectrogram and descriptors;
- normalize values for visualization.

### Application State

Responsibilities:

- store the current track;
- store analysis results;
- store playback state;
- store selected view and mapping preset.

### Microscope View

Responsibilities:

- display waveform;
- display spectrum;
- display spectrogram;
- display descriptors and explanations.

### Canvas View

Responsibilities:

- convert normalized feature values into visual parameters;
- animate during playback;
- provide curated mapping presets.

## Early Technical Decisions

- Perform the main analysis after upload rather than requiring real-time microphone processing.
- Keep all processing client-side.
- Use one shared analysis result for both analytical and artistic views.
- Prefer a small number of reliable descriptors over a large number of fragile ones.
- Add optimization only after correctness is verified.

## Open Questions

- FFT implementation: custom educational implementation or tested library?
- Preferred frame size and hop size?
- Canvas 2D or WebGL for the final artwork?
- How much audio duration should be supported comfortably?
- Should stereo files be analysed per channel or downmixed to mono?
