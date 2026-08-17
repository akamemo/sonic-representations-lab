# Source Code Guide

The `src/` directory contains the complete browser application.

```text
analysis/   descriptor timelines and shared spectral analysis
audio/      local audio decoding
components/ reusable UI and Canvas views
dsp/        low-level DSP helpers
mapping/    descriptor-to-visual-state mappings
playback/   Web Audio playback controller
screens/    application screens and Laboratory shell
```

The main application state lives in `App.tsx`.

For the full architecture and data-flow explanation, see the repository-level [`ARCHITECTURE.md`](../ARCHITECTURE.md).
