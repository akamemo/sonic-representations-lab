# Project Definition

## Working Title

**Sonic Representations Lab**

Alternative titles under consideration:

- Sonic Canvas
- Sound Microscope
- Synesthesia Lab
- Sonic DNA

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

## MVP Scope

### Audio Input and Playback

- Upload one local audio file
- Decode the file in the browser
- Display filename, duration, sample rate, and channel count
- Play, pause, stop, and seek

### Analytical Representations

- Waveform
- Magnitude spectrum
- Spectrogram
- Synchronized playback cursor

### Audio Features

- RMS energy
- Spectral centroid
- Spectral flatness
- Spectral rolloff
- Zero-crossing rate
- Onset strength

### Artistic Representation

- One generative visual canvas
- Audio features mapped to visual parameters
- At least two curated mapping presets
- Live synchronization with playback

### Educational Layer

- Plain-language explanation of each feature
- Explanation of each sound-to-image mapping
- Clear indication that the artistic view is an interpretation, not an objective translation

## Explicitly Out of Scope for the MVP

- Machine-learning classification
- Mood or genre recognition
- Chord detection
- Key detection
- Source separation
- Reliable polyphonic pitch tracking
- User accounts
- Database
- Backend server
- Collaborative editing
- Mobile-first interface
- Professional DAW-style editing
- Real-time microphone input

These can be reconsidered only after the MVP is complete.

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
