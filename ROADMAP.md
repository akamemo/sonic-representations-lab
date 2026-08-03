# Development Roadmap

## Milestone 0 — Repository and project definition

- [x] Create GitHub repository
- [x] Add documentation scaffold
- [x] Confirm project title
- [x] Confirm MVP
- [x] Add first UI sketch
- [x] Commit and push baseline

## Milestone 1 — Interactive audio playback foundation

- [x] Create Vite + React + TypeScript project
- [x] Configure ESLint
- [x] Establish the initial project structure
- [x] Add the initial visual design
- [x] Select an audio file through the file picker
- [x] Support drag-and-drop file selection
- [x] Prevent browser default file-opening behaviour
- [x] Validate supported audio file extensions
- [x] Decode audio using the Web Audio API
- [x] Display filename, format, file size, duration, sample rate and channel count
- [x] Implement a custom playback controller
- [x] Add play, pause and stop controls
- [x] Implement seek through the playback slider
- [x] Generate waveform data from decoded audio
- [x] Render a responsive waveform using the Canvas API
- [x] Synchronize the waveform playhead with playback
- [x] Implement waveform click-to-seek
- [x] Implement waveform drag scrubbing
- [ ] Introduce application state transitions (Welcome → Loading → Laboratory)
- [ ] Deploy first version to GitHub Pages

## Milestone 2 — Signal analysis

- [ ] Implement RMS energy analysis
- [ ] Frame the signal
- [ ] Add Hann window
- [ ] Calculate FFT
- [ ] Display magnitude spectrum
- [ ] Generate spectrogram
- [ ] Verify analysis with test signals

## Milestone 3 — Audio descriptors

- [ ] RMS energy
- [ ] Spectral centroid
- [ ] Spectral flatness
- [ ] Spectral rolloff
- [ ] Zero-crossing rate
- [ ] Onset strength
- [ ] Add feature explanations

## Milestone 4 — Artistic Canvas

- [ ] Define mapping interface
- [ ] Implement first visual preset
- [ ] Synchronize with playback
- [ ] Implement second preset
- [ ] Document mapping rationale

## UX and Interface Design

### Completed: Product and Experience Definition

- [x] Define primary users: engineering, music technology and computer science students.
- [x] Define secondary users: musicians, producers, creative coders and digital artists.
- [x] Define the principal goal: understand sound through complementary representations.
- [x] Establish the interactive-laboratory product metaphor.
- [x] Establish progressive disclosure as a core UX principle.
- [x] Define the interface as calm, minimal, educational and approachable.
- [x] Reject DAW-like, dashboard-like, cyberpunk and dense engineering-software directions.
- [x] Define white space as an intentional part of the experience.

### Completed: End-to-End User Flow

- [x] Define the centered welcome experience.
- [x] Define audio upload and drag-and-drop entry.
- [x] Define a reactive full-screen drag-over state.
- [x] Add the local browser-processing privacy notice.
- [x] Separate upload, analysis, readiness and exploration states.
- [x] Define educational analysis-progress feedback.
- [x] Define the Analysis Complete state.
- [x] Define the Start Exploring interaction.
- [x] Define the transition into the laboratory.
- [x] Define the shared Microscope/Canvas workspace.
- [x] Define the experiment wrap-up.
- [x] Define Start New Experiment as the principal concluding action.
- [x] Define the return to the welcome screen as a complete experience loop.

### Completed: Laboratory Architecture

- [x] Define Microscope and Canvas as two modes in one workspace.
- [x] Define a persistent Microscope/Canvas mode selector.
- [x] Preserve audio and playback state while switching modes.
- [x] Reuse one prepared analysis across both modes.
- [x] Define persistent shared playback controls.
- [x] Define a mode-specific contextual inspector or settings area.
- [x] Avoid recomputation when switching modes.

### Completed: Analytical Interface

- [x] Define waveform view.
- [x] Define magnitude-spectrum view.
- [x] Define spectrogram view.
- [x] Define 12-band mel-energy view.
- [x] Define the descriptor inspector.
- [x] Include RMS energy.
- [x] Include spectral centroid.
- [x] Include spectral spread.
- [x] Include spectral flatness.
- [x] Include spectral flux.
- [x] Include onset strength.
- [x] Treat mel energies as a multidimensional representation rather than a scalar descriptor.
- [x] Prefer one focused analytical representation at a time.
- [x] Define synchronized educational explanations.

### Completed: Canvas Interaction Model

- [x] Establish analytical outputs as immutable ground truth.
- [x] Separate Audio Parameters from Visualization Settings.
- [x] Restrict editing to the visualization-mapping layer.
- [x] Define Canvas as guided exploration rather than an unrestricted editor.
- [x] Require every exposed mapping to be explainable.
- [x] Require every exposed mapping to have a perceptible visual effect.
- [x] Exclude misleading, ineffective and confusing mappings.
- [x] Use scalar descriptors for high-level visual behaviour.
- [x] Use 12-band mel energies for internal multidimensional structure.
- [x] Define a first-entry educational Canvas overlay.
- [x] Show the overlay once per experiment.

### Completed: Visualization Presets

- [x] Define Scientific as the default preset.
- [x] Define Organic as a fluid interpretive preset.
- [x] Define Geometric as a structured interpretive preset.
- [x] Define Custom as a curated mapping mode.
- [x] Add short educational explanations to every preset.
- [x] Allow preset changes during uninterrupted playback.
- [x] Preserve the playhead and analysis while switching presets.
- [x] Define smooth visual transitions between preset interpretations.
- [x] Allow Custom Mode to remain within meaningful mapping limits.
- [x] Avoid node-editor or programming-environment complexity.

### Completed: Visual Identity

- [x] Compare multiple welcome-layout directions.
- [x] Reject the futuristic dark-neon direction.
- [x] Select **Option A — Centered Pixel Wave Background**.
- [x] Define a restrained retro-computing influence.
- [x] Define a pixel-art and low-bit visual vocabulary.
- [x] Define a contemporary, spacious layout.
- [x] Define warm off-white primary surfaces.
- [x] Define charcoal or deep navy text.
- [x] Define sage green, muted lavender and dusty blue accents.
- [x] Define fine borders, soft corners and minimal shadows.
- [x] Define simplified low-bit-inspired icons.
- [x] Define readable body typography with restrained pixel-inspired display typography.
- [x] Ensure that the pixel direction does not become a heavily themed retro-game interface.
- [x] Define Canvas as an optionally darker visual field within the light laboratory shell.

### Completed: Living Pixel Wave

- [x] Establish the pixel waveform as the signature visual motif.
- [x] Define calm idle behaviour.
- [x] Define reactive drag-over behaviour.
- [x] Define upload acknowledgement behaviour.
- [x] Define analysis transformation behaviour.
- [x] Define the settled Analysis Complete state.
- [x] Define the transition into the laboratory.
- [x] Define reduced prominence in Microscope Mode.
- [x] Define visual priority for Canvas Mode.
- [x] Define the return animation for Start New Experiment.
- [x] Require motion to support comprehension rather than spectacle.
- [x] Require reduced-motion support during implementation.

### Completed: Experiment Ending and Export Placement

- [x] Place export actions near the end of the experiment.
- [x] Avoid cluttering the principal laboratory workspace with export controls.
- [x] Identify saving the current Canvas image as a stretch goal.
- [x] Identify descriptor CSV export as a stretch goal.
- [x] Identify JSON analysis export as a stretch goal.
- [x] Identify descriptor time-series export as a stretch goal.
- [x] Identify mel-energy export as a stretch goal.
- [x] Identify visualization-settings export as a stretch goal.
- [x] Identify a combined experiment package as a stretch goal.
- [x] Avoid making stretch exports dependencies of the MVP.
- [x] Avoid automatically ending the experiment when playback reaches the end.

### Next: Detailed Screen Specifications

- [ ] Produce the final welcome-screen mockup based on Option A.
- [ ] Define default welcome state.
- [ ] Define file drag-enter state.
- [ ] Define valid file drag-over state.
- [ ] Define invalid file state.
- [ ] Define upload/file-read state.
- [ ] Define analysis-progress state.
- [ ] Define analysis failure and recovery state.
- [ ] Define Analysis Complete state.
- [ ] Define Start Exploring transition state.
- [ ] Produce the shared laboratory-shell mockup.
- [ ] Produce the detailed Microscope Mode mockup.
- [ ] Produce the detailed Canvas Mode mockup.
- [ ] Produce the first-entry Canvas overlay mockup.
- [ ] Produce Scientific preset state.
- [ ] Produce Organic preset state.
- [ ] Produce Geometric preset state.
- [ ] Produce Custom Mode state.
- [ ] Produce the experiment-wrap-up mockup.
- [ ] Produce the Start New Experiment confirmation or state-clearing flow.
- [ ] Define empty, loading, success and error states for all major screens.

### Next: Interaction Specification

- [ ] Define mode-switching behaviour.
- [ ] Define preset-transition duration and easing.
- [ ] Define living pixel-wave state transitions.
- [ ] Define audio transport interactions.
- [ ] Define seek and synchronization behaviour.
- [ ] Define descriptor-inspector interaction.
- [ ] Define analytical-view switching.
- [ ] Define Custom Mode mapping controls.
- [ ] Validate which descriptor-to-property mappings are perceptible.
- [ ] Validate mappings with multiple contrasting audio examples.
- [ ] Define export interactions.
- [ ] Define unsaved-experiment warnings where appropriate.
- [ ] Define keyboard interactions and focus order.
- [ ] Define reduced-motion alternatives.

### Next: Design System

- [ ] Select final display and body typefaces.
- [ ] Define type scale.
- [ ] Define spacing tokens.
- [ ] Define layout grid.
- [ ] Define desktop breakpoints.
- [ ] Define smaller-display behaviour.
- [ ] Define final colour tokens.
- [ ] Verify text and control contrast.
- [ ] Define border widths and corner radii.
- [ ] Define button hierarchy.
- [ ] Define input, tab, selector and slider states.
- [ ] Define focus, hover, active and disabled states.
- [ ] Define pixel-icon construction rules.
- [ ] Define plot styling.
- [ ] Define Canvas frame styling.
- [ ] Define animation tokens.
- [ ] Define accessible status and error presentation.

### Next: Application Architecture

- [ ] Translate the approved interface into a React component hierarchy.
- [ ] Define application state boundaries.
- [ ] Define experiment lifecycle state.
- [ ] Define immutable analysis-data types.
- [ ] Define visualization-settings types separately from analysis types.
- [ ] Define preset configuration structures.
- [ ] Define eligible mapping constraints in code.
- [ ] Define audio transport state.
- [ ] Define render-loop ownership.
- [ ] Define Canvas and analysis-view synchronization.
- [ ] Define local export utilities.
- [ ] Confirm GitHub Pages routing and asset-path requirements.

### Next: Project Initialization

- [ ] Create the React, TypeScript and Vite application.
- [ ] Configure strict TypeScript.
- [ ] Configure linting and formatting.
- [ ] Establish the initial folder structure.
- [ ] Add the design tokens.
- [ ] Implement the shared application shell.
- [ ] Implement the welcome-screen static layout.
- [ ] Implement the living pixel-wave prototype.
- [ ] Implement file selection and drag-and-drop.
- [ ] Commit the first implementation milestone.

### Stretch Goals

- [ ] Save the current Canvas visualization as PNG.
- [ ] Export scalar descriptor values as CSV.
- [ ] Export complete analysis data as JSON.
- [ ] Export descriptor time series.
- [ ] Export 12-band mel-energy data.
- [ ] Save and restore visualization settings.
- [ ] Export a combined experiment package.
- [ ] Add optional low-bit-inspired interface sounds.
- [ ] Add recording input after the upload-first MVP is stable.
- [ ] Explore track comparison after the single-track experience is complete.

## Milestone 6 — Documentation and presentation

- [ ] Complete README
- [ ] Update architecture diagram
- [ ] Finalize DSP notes
- [ ] Record limitations
- [ ] Add test evidence
- [ ] Prepare demonstration sequence
- [ ] Verify GitHub Pages link