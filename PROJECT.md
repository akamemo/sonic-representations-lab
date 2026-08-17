# Project Definition

## Project Name

**Synesthesia**

*An Interactive Laboratory for Sound Exploration*

## One-Sentence Description

A browser-based environment that lets users inspect one audio signal through synchronized analytical and artistic representations generated from the same DSP analysis.

## Motivation

Sound is normally experienced by listening. Synesthesia explores how software can expose measurable properties of an audio signal and reinterpret those properties visually without pretending that an artistic mapping is an objective physical translation.

## Central Question

> How can the same audio signal be represented in ways that support both technical understanding and creative exploration?

## Intended Users

Primary:

- engineering students;
- music-technology students;
- computer-science students.

Secondary:

- musicians;
- producers;
- creative coders;
- digital artists;
- curious non-expert users.

## Core Product Principle

Synesthesia separates two complementary purposes:

- **Microscope** supports observation and understanding.
- **Canvas** supports interpretation and comparison.

Both modes use the same decoded audio and prepared analysis timelines.

## Primary User Journey

1. Open the application.
2. Select or drag-and-drop a local audio file.
3. Allow the browser to decode and analyse the file.
4. Enter the Laboratory.
5. Play, pause, stop and seek through the recording.
6. Inspect time-domain, frequency-domain and Mel representations in Microscope.
7. Inspect live descriptor values and descriptor trends.
8. Switch to Canvas without losing playback position.
9. Compare the same analysis through Resonance, Refraction and Fluxfield mappings.
10. Start a new experiment when finished.

## Implemented MVP

### Audio Input and Playback

- local file picker;
- drag-and-drop;
- extension validation for WAV, MP3, FLAC, OGG and M4A;
- Web Audio API decoding;
- duration, sample-rate and channel metadata;
- play, pause, stop and seek;
- synchronized current-time state;
- local browser processing only.

Actual decode support is browser-dependent.

### Microscope

Representations:

- waveform;
- magnitude spectrum;
- spectrogram;
- 12-band Mel-energy representation.

Descriptors:

- RMS Energy;
- Spectral Centroid;
- Spectral Flatness;
- Spectral Flux;
- Onset Strength.

RMS, Centroid, Flatness and Flux expose trend plots. Onset Strength is treated as a live event indicator.

### Canvas

One pixel-art organism renderer is driven by a five-parameter visual state:

- intensity;
- colour temperature;
- structural disorder;
- motion activity;
- impulse.

Three curated presets change only the descriptor-to-visual mapping:

| Preset | Intensity | Colour | Structure | Motion | Impulse |
|---|---|---|---|---|---|
| Resonance | RMS | Centroid | Flatness | Flux | Onset |
| Refraction | Centroid | RMS | Flux | Flatness | Onset |
| Fluxfield | Flux | Flatness | RMS | Centroid | Onset |

This design preserves the same analysis and renderer while demonstrating that mapping choices change the interpretation of the same data.

## Implemented Analytical Core

### Scalar descriptors

- RMS Energy
- Spectral Centroid
- Spectral Flatness
- Spectral Flux
- Onset Strength

### Multidimensional representation

- 12-band Mel energies

Spectral Spread, rolloff, zero-crossing rate, pitch, chroma, MFCCs and beat/tempo analysis were considered during design but are **not part of the current MVP**.

## Technical Constraints

The project intentionally uses:

- React;
- TypeScript;
- Vite;
- Web Audio API;
- Canvas 2D;
- client-side processing;
- one shared FFT analysis for spectral features.

The spectral pipeline follows:

> **One FFT per spectral frame; multiple descriptors and representations derived from the shared result.**

## Out of Scope for the MVP

- microphone input;
- recording;
- playlists;
- backend services;
- machine learning;
- source separation;
- pitch/key/chord recognition;
- beat and tempo estimation;
- user-editable mapping graphs;
- WebGL;
- export workflows;
- complex particle physics.

## Definition of Done

The MVP is complete when a user can:

1. load and decode a compatible audio file;
2. control and seek playback;
3. inspect waveform, spectrum, spectrogram and Mel representations;
4. inspect the five implemented descriptors;
5. switch between Microscope and Canvas without recomputing the audio;
6. compare three Canvas mapping strategies while playback continues;
7. understand that Microscope measurements are analytical while Canvas mappings are interpretive;
8. complete the primary journey without console errors or broken controls.

**Current status: MVP implemented and stabilized.**
