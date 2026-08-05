# Synesthesia

**An Interactive Laboratory for Sound Exploration**

Synesthesia is a browser-based educational application for exploring music and sound through synchronized analytical and artistic representations generated from a shared Digital Signal Processing (DSP) analysis pipeline.

Rather than focusing on audio editing, the project encourages users to understand how measurable audio features relate to perceptual and visual phenomena through two complementary interactive views.

---

## Project Status

**Phase:** Core implementation

Current features include:

- Local audio loading (browser only)
- Native file picker and drag-and-drop upload
- Local decoding using the Web Audio API
- Playback controls
- Scientific "Microscope" view
- Artistic "Canvas" view
- Shared DSP analysis pipeline
- Audio descriptor extraction:
  - RMS Energy
  - Spectral Centroid
  - Spectral Flatness
  - Spectral Flux
- Interactive descriptor visualisation
- Organism-based artistic visualisation driven by audio descriptors

---

## Concept

Synesthesia explores the relationship between measurable properties of sound and visual expression.

The application provides two synchronized perspectives:

### 🔬 Microscope

A scientific view exposing waveform, descriptor values and analytical representations of the audio signal.

### 🎨 Canvas

An artistic visualization in which a pixel-art organism behaves according to the analysed audio.

Instead of arbitrary visual effects, the organism follows a biologically inspired physiology:

| Descriptor | Physiological Mapping |
|------------|----------------------|
| RMS Energy | Vitality, size and breathing |
| Spectral Centroid | Pigmentation and metabolism |
| Spectral Flatness | Cytoplasm organisation |
| Spectral Flux | Membrane reactions and transient excitation |

---

## Technologies

- React
- TypeScript
- Vite
- Web Audio API
- HTML5 Canvas

---

## Running the project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

---

## Repository Structure

| File | Purpose |
|------|---------|
| `PROJECT.md` | Project definition and scope |
| `ARCHITECTURE.md` | Application architecture |
| `DSP_NOTES.md` | DSP implementation notes |
| `DESIGN_LOG.md` | Design decisions and development history |
| `ROADMAP.md` | Milestones and remaining work |
| `TESTING.md` | Testing procedures |
| `src/` | Application source code |

---

## Current Development Focus

Current work is centred on:

- refining the organism-based Canvas representation;
- improving descriptor readability;
- implementing moving-window waveform and descriptor visualisations;
- polishing the interface for the final submission.

---

## License

This project was developed as part of the Advanced Coding Tools and Methodologies course (ACTAM).

A project license has not yet been selected.