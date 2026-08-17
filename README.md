# Synesthesia

**An Interactive Laboratory for Sound Exploration**

Synesthesia is a browser-based educational application for exploring one audio file through synchronized analytical and artistic representations generated from a shared Digital Signal Processing (DSP) pipeline.

The project is designed around one central idea:

> The same measured audio data can support different, complementary representations.

The application runs entirely in the browser. Uploaded audio is decoded and analysed locally and is not sent to a backend service.

## Project Status

**MVP: complete and stabilized**

The current application includes:

- local audio file selection and drag-and-drop;
- browser-side decoding with the Web Audio API;
- play, pause, stop and seek controls;
- synchronized playback position across the interface;
- Microscope and Canvas laboratory modes;
- waveform, magnitude-spectrum, spectrogram and 12-band Mel views;
- RMS Energy, Spectral Centroid, Spectral Flatness, Spectral Flux and Onset Strength analysis;
- descriptor trend plots for RMS, Centroid, Flatness and Flux;
- live Onset Strength indication;
- a shared pixel-art organism renderer;
- three alternative audio-to-visual mapping presets;
- an About dialog and local-processing privacy notice;
- no backend or cloud processing.

## Laboratory Modes

### Microscope

Microscope is the analytical mode. It provides four complementary representations:

- **Waveform** — time-domain amplitude within a moving inspection window;
- **Magnitude Spectrum** — frequency-domain magnitude for the current spectral frame;
- **Spectrogram** — frequency content over the current inspection window;
- **Mel Representation** — energy in 12 perceptually spaced Mel bands.

The descriptor panel exposes:

- RMS Energy;
- Spectral Centroid;
- Spectral Flatness;
- Spectral Flux;
- Onset Strength.

RMS, Centroid, Flatness and Flux can be selected for a synchronized trend plot. Onset Strength is presented as a live event indicator rather than a dedicated trend view.

### Canvas

Canvas uses the same analysis timelines but routes their values into a single pixel-art organism through different mapping configurations.

| Preset | Vitality | Pigmentation | Structure | Motion | Impulse |
|---|---|---|---|---|---|
| **Resonance** | RMS | Centroid | Flatness | Flux | Onset |
| **Refraction** | Centroid | RMS | Flux | Flatness | Onset |
| **Fluxfield** | Flux | Flatness | RMS | Centroid | Onset |

The renderer does not analyse audio directly. It receives a normalized visual state from the mapping layer. This separation makes the three presets directly comparable: the analysis and renderer remain the same while only the mapping strategy changes.

## DSP Summary

The default spectral analysis uses:

- FFT size: **2048 samples**;
- hop size: **1024 samples**;
- Hann window;
- mono downmix for spectral analysis;
- 12 triangular Mel filters;
- one shared spectral analysis reused by spectral descriptors and representations.

RMS uses a 2048-sample frame and 1024-sample hop.

For implementation details and limitations, see [`DSP_NOTES.md`](DSP_NOTES.md).

## Technology

- React 19
- TypeScript 6
- Vite 8
- Web Audio API
- Canvas 2D
- [`fft.js`](https://www.npmjs.com/package/fft.js)

## Run Locally

Requirements:

- Node.js and npm;
- a modern desktop browser.

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Run the quality checks:

```bash
npm run lint
npm run build
```

Preview the production build:

```bash
npm run preview
```

More detailed instructions are in [`SETUP_GUIDE.md`](SETUP_GUIDE.md).

## Documentation

| File | Purpose |
|---|---|
| [`PROJECT.md`](PROJECT.md) | project definition, scope and definition of done |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | application modules and data flow |
| [`DSP_NOTES.md`](DSP_NOTES.md) | implemented DSP algorithms and parameters |
| [`DESIGN_LOG.md`](DESIGN_LOG.md) | chronological record of major design decisions |
| [`ROADMAP.md`](ROADMAP.md) | completed milestones and remaining work |
| [`TESTING.md`](TESTING.md) | validation strategy and release checklist |
| [`SETUP_GUIDE.md`](SETUP_GUIDE.md) | local setup and Git workflow |
| [`LICENSE_NOTE.md`](LICENSE_NOTE.md) | licensing decision still to be finalized |

## Known Limitations

- Audio decoding ultimately depends on the codecs supported by the user's browser, even though the interface accepts common audio extensions.
- Analysis is prepared after upload rather than streamed from a live microphone.
- The current project has no automated test suite; validation currently relies on TypeScript compilation, ESLint, manual integration testing and synthetic-signal checks.
- Canvas mappings are curated presets rather than user-editable mappings.
- Particle bursts and other additional onset effects remain optional future polish.
- GitHub Pages deployment still needs final verification before submission.

## Course Context

Developed for **Advanced Coding Tools and Methodologies (ACTAM)** as an educational exploration of browser-based DSP, software architecture and audiovisual representation.
