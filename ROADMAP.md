# Development Roadmap

## Current Status

**MVP implemented and stabilized — 2026-08-17**

The roadmap below reflects the actual delivered application rather than earlier design proposals.

## 1. Repository and Product Definition

- [x] Establish project repository and documentation.
- [x] Define Synesthesia identity and educational objective.
- [x] Define Microscope and Canvas as complementary modes.
- [x] Restrict MVP to uploaded audio and client-side processing.
- [x] Exclude machine learning and backend services.

## 2. Audio Input and Playback

- [x] Native file picker.
- [x] Drag-and-drop upload.
- [x] Prevent browser default file-opening on drop.
- [x] Validate common audio extensions.
- [x] Decode with Web Audio API.
- [x] Display decoded audio metadata.
- [x] Implement custom playback controller.
- [x] Play, pause and stop.
- [x] Seek and seek-preview behavior.
- [x] Keep playback state synchronized across Laboratory modes.
- [x] Reset complete experiment state when starting again.

## 3. DSP and Analysis

- [x] RMS Energy timeline.
- [x] Mono downmix for shared spectral analysis.
- [x] 2048-point FFT with 1024-sample hop.
- [x] Hann window.
- [x] Shared magnitude-spectrum storage.
- [x] Spectral Centroid timeline.
- [x] Spectral Flatness timeline.
- [x] Spectral Flux timeline.
- [x] Onset Strength derived from Spectral Flux.
- [x] 12-band Mel filter bank and energy analysis.
- [x] Shared timeline lookup by playback time.

## 4. Microscope

- [x] Detailed waveform view.
- [x] Magnitude spectrum.
- [x] Spectrogram.
- [x] 12-band Mel representation.
- [x] Representation switching.
- [x] Live descriptor values.
- [x] Reusable descriptor trend plot.
- [x] RMS trend.
- [x] Spectral Centroid trend.
- [x] Spectral Flatness trend.
- [x] Spectral Flux trend.
- [x] Onset Strength live indicator.
- [x] Moving inspection window.
- [x] Responsive plot sizing.

## 5. Canvas

- [x] Separate analysis from visual mapping.
- [x] Define normalized `ScientificVisualState`.
- [x] Build low-resolution pixel-art organism renderer.
- [x] RMS-driven body response.
- [x] Centroid-driven color behavior.
- [x] Flatness-driven structure behavior.
- [x] Flux-driven continuous motion.
- [x] Onset-driven transient excitation.
- [x] Fast-attack / slow-decay impulse smoothing.
- [x] Live five-parameter readings and mini progress bars.
- [x] Resonance mapping.
- [x] Refraction mapping.
- [x] Fluxfield mapping.
- [x] Dynamic preset descriptions and mapping table.
- [x] Mapping-specific calibration for Refraction and Fluxfield.

## 6. Interface and Product Polish

- [x] Welcome screen and pixel-wave visual identity.
- [x] Purple pixel flask branding.
- [x] Loading and Analysis Complete states.
- [x] Shared Laboratory shell.
- [x] Responsive Microscope and Canvas layout.
- [x] Persistent playback controls.
- [x] Local-processing privacy notice.
- [x] Welcome About dialog.
- [x] Remove dead components/assets.
- [x] Consolidate CSS and remove unused rules.
- [x] Clean key TypeScript/React files and stale comments.

## 7. Validation

- [x] TypeScript production build passes locally.
- [x] ESLint passes locally.
- [x] Manual smoke tests completed during development.
- [x] Microscope and Canvas verified after stabilization cleanup.
- [ ] Formalize repeatable synthetic-signal test evidence.
- [ ] Verify final deployed build in a clean browser session.
- [ ] Perform final browser-compatibility pass.

## 8. Documentation and Presentation

- [x] Update repository documentation to match the implemented MVP.
- [ ] Create final architecture study map.
- [ ] Create DSP study notes / oral-defense guide.
- [ ] Create file-by-file code map.
- [ ] Prepare likely presentation questions and answers.
- [ ] Add final screenshots to repository documentation.
- [ ] Record final deployed URL.

## Remaining Before Submission

### Required

- [ ] Final Git stabilization commit.
- [ ] Push clean repository state.
- [ ] Configure/verify GitHub Pages deployment.
- [ ] Run final release checklist in `TESTING.md`.
- [ ] Prepare presentation/study documentation.

### Optional polish only if schedule permits

- [ ] Strong-onset pixel particle bursts.
- [ ] Additional Canvas calibration after broader listening tests.
- [ ] Export/screenshot features.
- [ ] More formal automated DSP unit tests.

## Explicitly Deferred

- microphone input;
- recording;
- pitch/chroma/key/chord analysis;
- beat and tempo tracking;
- MFCCs;
- source separation;
- machine learning;
- user-programmable mappings;
- WebGL renderer;
- additional visual engines.

The current priority is **understanding, validating, documenting and presenting the stabilized MVP**, not expanding its feature set.
