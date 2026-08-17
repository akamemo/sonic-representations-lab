# Design Log

This log records the major decisions that shaped the implemented Synesthesia MVP. Earlier ideas that were later superseded are retained here as design history rather than presented as current functionality.

---

## 2026-07-26 — Unify analytical and artistic concepts

**Context:** The initial project contained separate ideas for a sound microscope and an artistic translation environment.

**Decision:** Build one application with two modes powered by one shared audio-analysis pipeline.

**Reasoning:** The same measurements can support both technical inspection and creative interpretation while avoiding duplicate DSP work.

**Consequences:** Analysis must remain separate from presentation.

---

## 2026-07-26 — Restrict MVP input to uploaded audio

**Decision:** Use local uploaded audio rather than microphone input.

**Reasoning:** Uploaded files are repeatable, easier to test and simpler to synchronize.

**Consequences:** Microphone input remains outside the MVP.

---

## 2026-07-26 — Keep the project DSP-based and interpretable

**Decision:** Exclude machine learning and prioritize a small set of explainable signal features.

**Reasoning:** Every implemented feature should be understandable and defensible within the course schedule.

**Consequences:** The project focuses on deterministic DSP rather than classification or learned models.

---

## 2026-07-26 — Adopt the Synesthesia identity

**Decision:** Use **Synesthesia — An Interactive Laboratory for Sound Exploration** as the product identity.

**Reasoning:** The name communicates cross-modal exploration while the subtitle makes the educational laboratory purpose explicit.

---

## 2026-07-30 — Adopt a restrained pixel-laboratory visual language

**Decision:** Use warm off-white laboratory surfaces, deep navy analytical fields, monospaced typography and restrained pixel-art motifs.

**Reasoning:** The interface should feel exploratory and distinctive without resembling a DAW, dense engineering dashboard or neon/cyberpunk visualizer.

**Consequences:** Pixel art became a consistent visual vocabulary across branding, loading states and Canvas.

---

## 2026-07-30 — Use one file-validation path

**Decision:** Route native file selection and drag-and-drop through shared validation.

**Reasoning:** One boundary prevents inconsistent file rules and duplicate logic.

**Consequences:** The interface checks common audio extensions first; browser decoding remains the final compatibility test.

---

## 2026-08-03 — Separate playback from React rendering

**Decision:** Implement a dedicated `PlaybackController` around the Web Audio API.

**Reasoning:** `AudioBufferSourceNode` instances are one-shot and playback offset/state management is easier to reason about outside UI components.

**Consequences:** React owns observable playback state while the controller owns audio-node lifecycle and timing.

---

## 2026-08-03 — Validate the complete analysis-to-visual pipeline with RMS

**Decision:** Implement RMS as the first timeline descriptor and map it into the first Canvas prototype.

**Reasoning:** RMS is simple to verify and proved that the full path could work:

```text
Audio -> Analysis -> Timeline -> Mapping -> Renderer
```

**Consequences:** Later descriptors could plug into the same architecture.

---

## 2026-08-04 — Reuse one spectral analysis

**Decision:** Compute one windowed FFT per spectral frame and store its magnitudes for reuse.

**Reasoning:** Centroid, Flatness, Flux, Spectrum, Spectrogram and Mel energies all depend on the same spectral data.

**Consequences:** Descriptor modules consume a shared `SpectralAnalysis` rather than performing their own FFTs.

---

## 2026-08-05 — Replace the generic visual prototype with one organism

**Context:** Early abstract/particle-style Canvas experiments were technically reactive but visually weak and difficult to interpret.

**Decision:** Use one low-resolution, continuously morphing pixel-art organism.

**Reasoning:** A single coherent body provides stable visual dimensions such as size, pigmentation, structure, motion and transient reaction.

**Consequences:** Canvas behavior became easier to explain as a mapping problem rather than a collection of unrelated effects.

---

## 2026-08-12 — Complete the Microscope representation set

**Decision:** Finalize four analytical representations:

- waveform;
- magnitude spectrum;
- spectrogram;
- 12-band Mel representation.

**Reasoning:** Together they provide time-domain, instantaneous frequency-domain, time-frequency and perceptually spaced frequency views.

**Consequences:** Spectral analysis and plot layout were made responsive to the Laboratory workspace.

---

## 2026-08-12 — Finalize the scalar descriptor set

**Decision:** The implemented scalar descriptors are:

- RMS Energy;
- Spectral Centroid;
- Spectral Flatness;
- Spectral Flux;
- Onset Strength.

**Superseded design idea:** Spectral Spread was discussed in early planning but was not required for the final MVP and was not implemented.

**Consequences:** Documentation must distinguish implemented features from earlier candidates.

---

## 2026-08-13 — Treat Onset Strength as an event descriptor

**Decision:** Derive a normalized Onset Strength timeline from Spectral Flux and present it in Microscope as a live indicator rather than adding another descriptor trend plot.

**Reasoning:** Onset Strength adds the most value as a transient event control in Canvas.

**Consequences:** Canvas receives Onset Strength through the `impulse` visual-state parameter.

---

## 2026-08-13 — Use asymmetric impulse smoothing

**Context:** A direct onset-driven expansion felt abrupt and an expanding ring looked visually disconnected from the organism.

**Decision:** Remove the ring and use fast-attack / slower-decay smoothing for impulse.

**Reasoning:** The onset should feel like a physical excitation of the existing organism rather than a separate overlay effect.

**Consequences:** Strong transients produce smoother expansion, membrane deformation and internal bloom.

---

## 2026-08-14 — Keep the same renderer across mapping presets

**Context:** Completely different renderers would make it unclear whether visual differences came from data mapping or from different artwork.

**Decision:** Keep the analysis, visual-state contract and organism renderer fixed. Change only which descriptor drives each existing visual dimension.

**Reasoning:** This gives the preset system educational value: users can compare different interpretations of the same measured data.

**Consequences:** Three mappings were retained after direct visual tests.

---

## 2026-08-14 — Adopt Resonance, Refraction and Fluxfield

**Decision:** Replace the earlier Scientific / Organic / Geometric / Custom concept with three mapping configurations:

### Resonance

- RMS -> vitality
- Centroid -> pigmentation
- Flatness -> structure
- Flux -> motion
- Onset -> impulse

### Refraction

- Centroid -> vitality
- RMS -> pigmentation
- Flux -> structure
- Flatness -> motion
- Onset -> impulse

### Fluxfield

- Flux -> vitality
- Flatness -> pigmentation
- RMS -> structure
- Centroid -> motion
- Onset -> impulse

**Reasoning:** These names identify alternative interpretations without falsely implying different renderers or scientific categories.

**Consequences:** `createScientificVisualState()` owns preset-specific routing and scaling; the Canvas renderer remains unchanged.

---

## 2026-08-17 — Calibrate alternative mappings at the mapping layer

**Decision:** Tune Refraction and Fluxfield with mapping-specific output ranges rather than altering the renderer.

**Reasoning:** Different descriptors have different distributions. Re-routing normalized values without calibration can saturate or underuse visual controls.

**Consequences:** The conceptual mapping remains simple while each preset makes better use of the renderer's useful ranges.

---

## 2026-08-17 — Freeze feature development at the stabilized MVP

**Decision:** Stop adding core features and perform repository cleanup before presentation preparation.

**Completed cleanup:**

- removed dead legacy waveform/file-information code and unused assets;
- consolidated CSS and removed obsolete selectors;
- cleaned key TypeScript/React files and stale comments;
- added functional Welcome-screen About dialog;
- revalidated build, lint and primary visual behavior.

**Reasoning:** A clean, understandable repository is more valuable at submission time than late feature expansion.

**Consequences:** Particle bursts remain optional polish only. The main development focus now moves to testing evidence, deployment, documentation and oral presentation preparation.
