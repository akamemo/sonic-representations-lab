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

## Product Experience

### Product Positioning

Synesthesia is a web-based interactive laboratory for analysing, understanding and artistically representing sound.

It is primarily designed for:

- engineering students;
- music technology students;
- computer science students.

It should also remain approachable to:

- musicians;
- producers;
- creative coders;
- digital artists.

The principal experience goal is:

> Help users understand one sound through multiple complementary representations.

Synesthesia is not intended to behave like a DAW, a conventional audio plug-in or a technical analytics dashboard.

It should feel like a calm, living scientific space in which users can observe, compare and experiment.

---

### Experience Structure

The application follows a continuous experimental journey:

```text
Welcome
  ↓
Select Audio
  ↓
Prepare and Analyse
  ↓
Analysis Complete
  ↓
Start Exploring
  ↓
Microscope Mode ↔ Canvas Mode
  ↓
Experiment Wrap-Up
  ↓
Start New Experiment
```

Complexity is progressively disclosed.

Before an audio file is selected, the user sees only the information required to understand the project and begin.

Analytical, artistic and export controls appear only when they become relevant.

---

### Welcome Experience

The welcome screen uses a centered, minimal composition.

It includes:

- the Synesthesia name;
- the subtitle **An Interactive Laboratory for Sound Exploration**;
- a concise mission statement;
- one clear **Upload Audio** action;
- drag-and-drop support;
- supported-format information;
- a local-processing privacy notice;
- a subtle living pixel-wave background.

Working mission statement:

> Explore how sound can be analysed, understood and artistically represented through multiple complementary views.

The selected welcome direction is:

> **Option A — Centered Pixel Wave Background**

The pixel wave provides visual identity and responds subtly to application state without competing with the upload action.

When an audio file is dragged over the page, the interface should respond and display:

> Drop your audio to begin the experiment.

The welcome screen should not show plots, descriptor values, playback controls, visualization presets or export controls.

---

### Local Processing

The intended application architecture is client-side.

The welcome screen communicates:

> Your audio never leaves your device. All analysis is performed locally in your browser.

This statement must remain aligned with the implemented architecture.

The project should avoid server dependencies unless a later feature clearly justifies them.

---

### Analysis Preparation

After audio selection, Synesthesia prepares all analytical data required by both laboratory modes.

The shared analysis pipeline provides:

#### Time and Frequency Representations

- waveform data;
- magnitude spectrum;
- spectrogram.

#### Scalar Descriptors

- RMS energy;
- spectral centroid;
- spectral spread;
- spectral flatness;
- spectral flux;
- onset strength.

#### Multidimensional Representation

- 12-band mel energies.

The mel representation is treated as a perception-oriented multidimensional representation rather than as another scalar descriptor.

The application should communicate meaningful preparation stages, potentially including:

- decoding audio;
- preparing time-domain data;
- computing FFT-based analysis;
- constructing spectral representations;
- extracting descriptors;
- preparing mel energies;
- preparing Canvas data.

The displayed stages must correspond honestly to the implemented pipeline.

---

### Analysis Complete and Entry

When preparation finishes, Synesthesia enters a distinct **Analysis Complete** state.

Suggested supporting copy:

> Your audio has been transformed into multiple complementary representations.

The **Start Exploring** action becomes available only after all required preparation succeeds.

Selecting it does not trigger further analysis. It initiates a short transition into the prepared laboratory workspace.

This interaction separates:

- waiting for computation;
- deliberately beginning exploration.

---

### Shared Laboratory Workspace

Microscope and Canvas are two modes in one shared workspace.

The shell contains:

- lightweight application identity;
- a persistent mode selector;
- the primary content area;
- a contextual inspector or settings area;
- persistent playback controls;
- access to experiment-ending actions.

Switching between modes preserves:

- the loaded audio;
- playback position;
- prepared analysis data;
- experiment state;
- eligible visualization settings.

It does not decode or analyse the audio again.

---

### Microscope Mode

Microscope Mode supports analytical observation and learning.

Its MVP views are:

- waveform;
- magnitude spectrum;
- spectrogram;
- 12-band mel-energy representation;
- descriptor inspector;
- educational explanations.

The interface should focus on one principal representation at a time so that each view has sufficient space and clarity.

The descriptor inspector should expose the six scalar descriptors and remain synchronized with playback.

Educational content should explain:

- what the selected view represents;
- how to interpret it;
- what the user should listen for;
- how audible change relates to visible change.

---

### Canvas Mode

Canvas Mode provides a generative interpretation of the same prepared audio analysis.

Its purpose is not to edit audio or analytical values.

The data relationship is:

```text
Immutable Audio Analysis
  ↓
Curated Visualization Mapping
  ↓
Generative Canvas
```

Users may modify only visualization mappings and presentation settings.

Descriptor values remain immutable.

Canvas uses:

- scalar descriptors for high-level visual behaviour;
- 12-band mel energies for multidimensional internal structure;
- onset information for time-localized accents;
- the shared playback position for synchronization.

---

### First Canvas Entry

The first time the user opens Canvas Mode during an experiment, an educational overlay explains:

- Canvas uses the same data presented in Microscope Mode;
- the audio analysis remains unchanged;
- users may alter its visual interpretation;
- users may not edit descriptor values.

The overlay appears once per experiment.

After dismissal, later transitions into Canvas should be immediate.

---

### Visualization Presets

Canvas Mode provides four choices.

#### Scientific

The default and most educationally direct interpretation.

> Emphasizes direct relationships between audio descriptors and visual behaviour.

#### Organic

A fluid interpretation focused on continuous movement and evolving energy.

> Uses smooth, flowing mappings to emphasize continuous changes in the sound.

#### Geometric

A structured interpretation focused on order, pattern and defined form.

> Highlights structure and pattern through ordered geometric mappings.

#### Custom

A guided personal interpretation.

> Create your own interpretation within carefully selected mapping possibilities.

Each option includes a short explanation.

The user may switch presets while playback and visualization continue.

Preset changes should transition smoothly without:

- restarting the track;
- moving the playhead;
- repeating analysis;
- replacing descriptor values.

---

### Curated Customization

Custom Mode supports guided creativity rather than unlimited configuration.

Only mappings that are:

- visible;
- understandable;
- educationally meaningful;
- artistically coherent;
- stable across useful audio examples

should be exposed.

The application should not offer a descriptor-to-property option when:

- the visual result is imperceptible;
- the relationship is confusing;
- it duplicates another control without value;
- it undermines interpretation;
- it has no defensible educational or artistic role.

Potential editable visualization settings include:

- eligible descriptor targets;
- mapping strength;
- response sensitivity;
- smoothing;
- scale;
- motion;
- density;
- colour response;
- onset response;
- mel-band influence.

The final set will be validated through implementation and testing.

---

### Playback

A shared transport remains available in Microscope and Canvas modes.

The MVP transport should support:

- play;
- pause;
- seeking;
- current time;
- total duration;
- volume or mute where feasible.

The playhead synchronizes all time-dependent views and Canvas behaviour.

---

### Experiment Wrap-Up

The application provides a deliberate conclusion to an experiment.

A wrap-up area allows the user to reflect, export available results and begin again.

The primary final action is:

> Start New Experiment

Selecting it clears audio-derived state and returns to the clean welcome screen.

The wrap-up should not automatically interrupt the user when playback ends. Users may continue replaying, comparing views or adjusting mappings.

---

### Export Stretch Goals

Export functions should be located mainly in the experiment wrap-up so that they do not clutter the laboratory workspace.

Potential stretch goals include:

- save the current Canvas visualization as PNG;
- export scalar descriptors as CSV;
- export analysis data as JSON;
- export descriptor time series;
- export 12-band mel-energy data;
- save visualization settings;
- export a combined experiment package.

Future concepts may include:

- comparing tracks;
- restoring experiments;
- sharing experiments.

These features should not compromise the completion of the analytical and visualization MVP.

---

### Visual Identity

The selected interface identity is **Centered Pixel Wave**.

It combines:

- contemporary layout;
- restrained pixel-art influence;
- low-bit-inspired icons;
- scientific visual motifs;
- generous whitespace;
- calm animation;
- a muted, approachable palette.

The preferred visual ingredients are:

- warm off-white surfaces;
- charcoal or deep navy text;
- sage green accents;
- muted lavender accents;
- dusty blue accents;
- light neutral greys;
- crisp fine borders;
- soft corners;
- minimal shadows;
- pixel waveforms;
- pixel spectrum bars;
- small square particles;
- simplified geometric icons.

Pixel styling should support the themes of digital audio and computation without making the application feel like a retro game.

Readable contemporary body typography should be used alongside restrained pixel or monospace-inspired display typography.

Canvas may use a darker visualization field where appropriate, but it should remain visually integrated with the light laboratory shell.

---

### Motion Identity

The living pixel waveform responds to the experience:

```text
Idle
  ↓
Drag Over
  ↓
Upload
  ↓
Analysis
  ↓
Analysis Complete
  ↓
Enter Laboratory
  ↓
Return for a New Experiment
```

Motion should communicate state and continuity rather than spectacle.

The implementation should respect reduced-motion preferences and maintain reliable performance.

---

### Product Principles

The interface and implementation should be evaluated against the following principles:

1. One sound, one shared analysis.
2. Multiple complementary representations.
3. Analytical values remain immutable.
4. Users edit mappings, not descriptors.
5. Only meaningful mappings are exposed.
6. Complexity appears only when it becomes relevant.
7. The visualization supports understanding rather than obscuring it.
8. The interface feels like an experiment, not software configuration.
9. Motion communicates state and relationship.
10. The experience has a clear beginning, exploration phase and conclusion.

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
