# Synesthesia

**An Interactive Laboratory for Sound Exploration**

A browser-based application for exploring analytical and artistic representations of sound generated from a shared DSP analysis pipeline.

## Project Status

**Phase:** Early implementation  
**Current milestone:** Audio loading and validation

### Implemented

- Vite, React, and TypeScript application scaffold
- Initial retro laboratory-inspired welcome interface
- Local audio selection through the native file picker
- Drag-and-drop file input
- Initial extension validation for WAV, MP3, FLAC, OGG, and M4A
- Selected filename, format, and file-size display
- Unsupported-format feedback

### Next

- Move file handling behind a dedicated audio-loading boundary
- Decode the selected file using the Web Audio API
- Display duration, sample rate, and channel count

## Concept

Synesthesia is an interactive environment that allows users to upload an audio track and explore it through synchronized analytical and artistic views.

Rather than editing sound, the application encourages users to understand and reinterpret it through multiple complementary representations generated from the same DSP analysis.

The project is designed around the ACTAM course themes of:

- coding as exploration;
- coding as creation;
- coding as understanding;
- sound and music as primary application contexts.

## Planned MVP

- Audio-file upload
- Playback controls
- Waveform visualization
- Magnitude spectrum
- Spectrogram
- Six audio descriptors:
  - RMS energy
  - spectral centroid
  - spectral flatness
  - spectral rolloff
  - zero-crossing rate
  - onset strength
- Analytical “Microscope” view
- Artistic “Canvas” view
- Contextual explanations of audio features

See [PROJECT.md](PROJECT.md) for the complete scope.

## Repository Guide

| File or folder | Purpose |
|---|---|
| `PROJECT.md` | Defines the project, users, MVP, exclusions, and grading alignment |
| `ARCHITECTURE.md` | Describes the technical structure and data flow |
| `DSP_NOTES.md` | Documents DSP algorithms, parameters, and limitations |
| `DESIGN_LOG.md` | Records dated design and engineering decisions |
| `ROADMAP.md` | Tracks milestones and feature priorities |
| `TESTING.md` | Defines testing procedures and acceptance criteria |
| `SETUP_GUIDE.md` | Explains how to create, clone, update, and publish the repository |
| `docs/sketches/` | Interface sketches and wireframes |
| `docs/diagrams/` | Architecture and signal-flow diagrams |
| `docs/screenshots/` | Development screenshots and final interface images |
| `src/` | Application source code |

## Documentation Rule

Every meaningful technical or design decision should be recorded when it is made, not reconstructed at the end.

## License

A license has not yet been selected.
