# Project Definition

# Project Definition

## Project Name

**Synesthesia**

### Subtitle

*An Interactive Laboratory for Sound Exploration*

## Naming Rationale

The name *Synesthesia* is used as an artistic metaphor

The application explores how measurable properties of sound can be represented visually, encouraging users to experience the same signal through multiple complementary representations.

## One-Sentence Description

A web-based environment that lets users inspect one audio signal through analytical and artistic representations generated from the same DSP features.

## Project Motivation

Sound is usually experienced only through listening. This project investigates how code can reveal, explain, and reinterpret the internal structure of sound through interactive visual representations.

## Central Question

> How can the same audio signal be represented in ways that support both technical understanding and creative exploration?

## Intended Users

- Music-technology students
- Musicians interested in sound analysis
- Creative coders
- Curious non-expert users

## Primary User Journey

1. Open the web application.
2. Upload an audio file.
3. Inspect its metadata.
4. Play, pause, and seek through the track.
5. Explore waveform, spectrum, and spectrogram views.
6. Inspect time-varying audio features.
7. Switch to the artistic Canvas view.
8. Observe how the same features control a generative visual composition.
9. Read concise explanations of the relationships between sound and image.

## Minimum Viable Product (MVP)

The goal of the MVP is to demonstrate the core concept of **Synesthesia**: that a single audio signal can be explored through multiple complementary representations generated from one shared DSP analysis pipeline.

The application should be complete enough to provide an engaging experience while remaining lightweight, understandable, and technically robust.

---

### 1. Audio Input

The application accepts a single audio file uploaded by the user.

The MVP supports:

- client-side audio decoding;
- filename display;
- duration;
- sample rate;
- channel count;
- play, pause and restart;
- seeking through the audio timeline.

Microphone input, recording and playlists are intentionally postponed.

---

### 2. Microscope Mode

Microscope Mode provides an analytical view of the uploaded audio.

It includes:

- waveform;
- magnitude spectrum;
- linear spectrogram;
- compact Mel-band representation;
- synchronized playback cursor;
- live descriptor values;
- contextual explanations.

The objective is to help users understand how different analytical representations describe the same sound.

---

### 3. Core Audio Features

The analytical core consists of six scalar descriptors:

- RMS Energy
- Spectral Centroid
- Spectral Spread
- Spectral Flatness
- Spectral Flux
- Onset Strength

These describe complementary aspects of the signal:

| Descriptor | Interpretation |
|------------|----------------|
| RMS Energy | Signal intensity |
| Spectral Centroid | Spectral brightness |
| Spectral Spread | Spectral distribution |
| Spectral Flatness | Tonal versus noise-like behaviour |
| Spectral Flux | Spectral change over time |
| Onset Strength | Appearance of new acoustic events |

Each descriptor must include:

- normalized values suitable for visualization;
- mathematical documentation;
- plain-language explanation;
- documented artistic mapping.

---

### 4. Perceptual Representation

In addition to the scalar descriptors, the MVP computes a **12-band Mel-energy representation**.

Unlike the scalar descriptors, this representation is multidimensional and captures the distribution of energy across perceptually spaced frequency bands.

The Mel representation is shared by both application modes:

- Microscope Mode for educational visualization;
- Canvas Mode for artistic control.

---

### 5. Canvas Mode

Canvas Mode transforms analytical information into a generative visual composition.

The MVP includes:

- one generative visual engine;
- two curated visualization presets;
- synchronized playback;
- descriptor-driven animation;
- Mel-driven internal structure;
- explanation of every mapping.

The initial mapping philosophy is:

| Audio Feature | Visual Behaviour |
|---------------|------------------|
| RMS Energy | Scale and brightness |
| Spectral Centroid | Colour tendency |
| Spectral Spread | Spatial dispersion |
| Spectral Flatness | Geometric regularity |
| Spectral Flux | Motion intensity |
| Onset Strength | Bursts and visual events |
| Mel Bands | Internal visual structure |

---

### 6. Educational Layer

A central objective of Synesthesia is education through interaction.

The interface should clearly explain:

- waveform versus spectrum;
- spectrum versus spectrogram;
- linear versus Mel representations;
- the meaning of every descriptor;
- the reasoning behind every visual mapping.

Canvas Mode is explicitly presented as an artistic interpretation of sound rather than an objective translation.

---

### 7. Technical Constraints

The MVP is intentionally lightweight.

It will be implemented using:

- React;
- TypeScript;
- Vite;
- Web Audio API;
- Canvas 2D;
- client-side processing only;
- GitHub Pages deployment.

The analysis pipeline follows one guiding principle:

> **One FFT per frame. Many representations derived from it.**

The FFT is reused to compute all spectral descriptors and the Mel representation.

---

### 8. Out of Scope

The following features are intentionally excluded from the MVP:

- microphone input;
- pitch detection;
- beat tracking;
- tempo estimation;
- chroma;
- key estimation;
- chord recognition;
- MFCC visualization;
- psychoacoustic roughness;
- machine learning;
- source separation;
- customizable mappings;
- WebGL rendering;
- backend services.

These remain potential extensions after the MVP has been completed and validated.

---

### 9. Definition of Done

The MVP is considered complete when a user can:

1. Upload an audio file.
2. Play, pause and seek through it.
3. Explore waveform, spectrum, spectrogram and Mel representation.
4. Inspect all six descriptors.
5. Switch between Microscope and Canvas modes.
6. Observe synchronized analytical and artistic representations.
7. Understand how every visual behaviour relates to the analysed sound.

## MVP Status

**Confirmed:** 2026-07-26

**Status:** Approved for implementation

## Stretch Goals

- Microphone input
- Comparison between two tracks
- Export a still image
- User-editable feature mappings
- Basic filters with before/after comparison
- Feature timeline annotations
- Track-level “sonic profile”
- Additional generative visual presets

## Success Criteria

The MVP is successful when a user can:

- upload and play an audio file;
- inspect three synchronized analytical views;
- understand at least six audio descriptors;
- observe an artistic visual driven by those descriptors;
- understand why each visual parameter changes.

## ACTAM Evaluation Alignment

### Technical Implementation

- Browser audio decoding and playback
- FFT/STFT-based analysis
- Time-varying feature extraction
- Synchronized visualization
- Modular application structure

### Creativity and Innovation

- Dual analytical and artistic representations
- Explicit sound-to-image mapping system
- Creative interpretation grounded in measurable signal properties

### User Experience and Interface Design

- Clear user journey
- Two coherent modes: Microscope and Canvas
- Contextual explanations
- Immediate audiovisual feedback

### Integration of Course Concepts

- Web technologies
- Web Audio API
- Sound and music processing
- Creative coding
- Coding as exploration, creation, and understanding

### Complexity and Ambition

- Multiple coordinated DSP and visualization modules
- Shared analysis engine
- Real-time synchronization during playback
- Extendable architecture

### Documentation and Presentation

- Public GitHub repository
- GitHub Pages deployment
- Architecture documentation
- DSP notes
- Design log
- Testing evidence
- Development screenshots
