# Synesthesia — UI Specifications

This document defines the implementation-ready interface specifications for Synesthesia.

It describes the purpose, structure, behaviour, states, transitions, accessibility requirements, responsive behaviour, and implementation considerations for each part of the user experience.

The specifications are organised in the order in which the user encounters them.

## Scope

This document covers:

1. Welcome Experience
2. File Selection and Validation
3. Analysis Progress
4. Analysis Complete
5. Laboratory Shell
6. Microscope Mode
7. Canvas Introduction
8. Canvas Mode
9. Experiment Wrap-Up
10. Experiment Reset
11. Shared Error States

## Specification Template

Each interface section should define:

- Purpose
- Entry conditions
- Exit conditions
- Layout
- Components
- Primary action
- Secondary actions
- Displayed data
- Interactions
- Interface states
- Transitions
- Error handling
- Accessibility notes
- Responsive behaviour
- Implementation notes

---

## 1. Welcome Experience

### Screen Metadata

**Screen ID:** WELCOME

**Application State:** `idle`

**Previous State:** None

**Next State:** `analysing`

---

### Purpose

The Welcome Experience introduces Synesthesia and establishes the application's identity before any audio has been loaded.

Its objectives are to:

- explain the purpose of the application;
- reassure the user that audio processing is performed locally;
- invite experimentation;
- provide a clear entry point through drag-and-drop or file selection;
- create a calm and welcoming first impression.

This screen represents the application's idle state.

---

### Entry Conditions

Displayed when:

- the application is opened;
- an experiment has ended and the user chooses to start a new experiment;
- the application is reset.

No audio has been loaded.

---

### Exit Conditions

The Welcome Experience ends when the user selects a valid audio file.

The application transitions to the Analysis Progress screen.

---

### Layout

The screen is vertically centred with generous whitespace.

Layout hierarchy:

1. Header
2. Hero section
3. Upload area
4. Supported formats
5. Privacy notice
6. Animated pixel-wave background

The layout should remain visually balanced across desktop and tablet devices.

---

### Components

#### Header

Contains:

- Synesthesia logo
- application name

No navigation is required.

---

#### Hero Section

Displays:

**Title**

> Synesthesia

**Subtitle**

> An Interactive Laboratory for Sound Exploration

**Mission statement**

> Explore how sound can be analysed, understood and artistically represented through multiple complementary representations.

---

#### Upload Area

Primary interactive element.

Supports:

- drag and drop
- click to browse files

Displays:

**Upload Audio**

or

**Drag and drop an audio file here**

Supported formats:

**WAV • MP3 • FLAC • OGG**

The upload area should clearly communicate that it is interactive.

---

#### Privacy Notice

Displayed below the upload area.

Text:

> Your audio never leaves your device. All analysis is performed locally in your browser.

This information should always be visible before upload.

---

#### Pixel Wave Background

A subtle animated decorative element.

Purpose:

- reinforce the visual identity;
- provide gentle motion;
- suggest sound without distracting from the interface.

It must never interfere with readability.

---

### Primary Action

**Upload Audio**

---

### Secondary Actions

None.

The interface intentionally focuses on a single action.

---

### Displayed Data

No experiment data is shown.

Only static explanatory content.

---

### Interactions

Supported interactions:

- click upload area;
- drag file over upload area;
- drop valid file;
- keyboard activation of upload button.

The entire upload area behaves as a drop target.

---

### Interface States

#### Idle

Default appearance.

Upload area is visible.

Background animation is running.

---

#### Drag Over (Valid)

Upload area becomes highlighted.

Visual feedback indicates that the file can be dropped.

---

#### Drag Over (Invalid)

Upload area indicates that the file type is unsupported.

Dropping the file is prevented.

---

#### File Selected

A valid file has been accepted.

The interface immediately transitions to the Analysis Progress screen.

No additional confirmation step is shown.

---

### Transitions

Welcome

↓

User selects file

↓

Analysis Progress

Transition duration should feel smooth and uninterrupted.

---

### Error Handling

If the selected file is unsupported:

- remain on the Welcome screen;
- display a concise error message;
- allow immediate retry.

Example:

> Unsupported file format.

If decoding later fails, the Welcome screen is not shown again.

The Analysis screen will report decoding errors separately.

---

### Accessibility Notes

The upload area must be fully keyboard accessible.

Interactive elements require visible focus indicators.

Text must maintain sufficient contrast.

Animations should remain subtle and never flash.

The interface should remain usable with reduced-motion preferences.

---

### Responsive Behaviour

#### Desktop

Hero content remains centred.

Upload area has a comfortable maximum width.

#### Tablet

Spacing decreases slightly while preserving hierarchy.

#### Mobile

Components stack vertically.

Touch targets remain comfortably sized.

The pixel-wave background becomes less prominent.

---

### Implementation Notes

Suggested React component structure:

```text
WelcomeScreen
├── Header
├── Hero
├── UploadArea
├── PrivacyNotice
└── PixelWaveBackground
```

The Welcome screen owns no analysis data.

Its responsibility ends once a valid `File` object has been emitted to the application state.

---

## 2. File Selection and Validation

### Screen Metadata

**Screen ID:** `FILE_VALIDATION`

**Application State:** `idle`

**Previous State:** `idle`

**Next State:** `analysing`

---

### Purpose

File Selection and Validation handles the transition between the Welcome Experience and audio analysis.

Its objectives are to:

- accept an audio file through drag-and-drop or the system file picker;
- verify that the selected file is suitable for processing;
- reject unsupported or unusable files before analysis begins;
- provide clear and recoverable feedback;
- emit a validated `File` object to the application.

This section describes an interaction state of the Welcome Experience rather than a separate full-screen interface.

---

### Entry Conditions

Validation begins when the user:

- selects a file through the system file picker; or
- drops a file onto the upload area.

The application remains visually within the Welcome Experience while validation is performed.

---

### Exit Conditions

#### Successful Validation

When the file passes validation:

- the file is stored as the active experiment source;
- the application state changes to `analysing`;
- the interface transitions to the Analysis Progress screen.

#### Failed Validation

When the file does not pass validation:

- the application remains in the `idle` state;
- the file is not stored as the active experiment source;
- an inline error message is displayed;
- the user may immediately try again.

---

### Validation Scope

Initial validation should verify:

- exactly one file has been provided;
- the file is not empty;
- the file uses an accepted audio format;
- the file can be passed to the browser audio-decoding pipeline;
- the file does not exceed any implementation-defined size or duration limits.

Format validation should not rely only on the file extension.

Where possible, the application should also inspect the file MIME type and later confirm validity through browser decoding.

---

### Accepted Formats

The intended supported formats are:

- WAV
- MP3
- FLAC
- OGG

Actual browser support may vary.

The final source of truth is whether the browser can successfully decode the selected audio file.

---

### Components

Validation is primarily handled by the existing `UploadArea`.

Supporting elements may include:

```text
UploadArea
├── HiddenFileInput
├── UploadInstructions
├── SupportedFormats
├── ValidationMessage
└── RetryInteraction
```

No modal dialog is required.

---

### Primary Interaction

The user provides one audio file.

Accepted input methods:

- click or keyboard activation of the upload area;
- drag and drop onto the upload area.

---

### File Picker Behaviour

The system file picker should be configured to prefer supported audio formats.

Example accept value:

```text
audio/wav,audio/mpeg,audio/flac,audio/ogg,.wav,.mp3,.flac,.ogg
```

The `accept` attribute improves file selection but must not be treated as complete validation.

---

### Drag-and-Drop Behaviour

#### Drag Enter

When a file enters the drop target:

- prevent the browser's default file-opening behaviour;
- determine whether the drag contains a single plausible audio file;
- display either the valid or invalid drag state.

#### Drag Over

While the file remains over the target:

- keep the appropriate visual state active;
- continue preventing default browser behaviour.

#### Drag Leave

When the pointer leaves the upload area:

- return the upload area to its idle state;
- avoid flickering when moving between child elements inside the drop target.

#### Drop

When the file is dropped:

- prevent the browser from navigating to or opening the file;
- remove the drag-over state;
- begin validation.

---

### Interface States

#### Idle

No file is currently being validated.

The upload area displays its normal instructions.

---

#### Valid Drag Over

The current drag appears to contain one supported audio file.

The upload area should:

- become visually emphasized;
- communicate that the file may be dropped;
- preserve readable instructions.

Suggested message:

> Drop your audio file to begin.

---

#### Invalid Drag Over

The current drag is clearly unsuitable.

Possible reasons include:

- multiple files;
- a non-file item;
- an unsupported file type.

The upload area should:

- display a restrained warning state;
- communicate that the current item cannot be accepted;
- avoid aggressive or alarming styling.

Suggested message:

> Please choose one supported audio file.

---

#### Validating

A file has been selected and basic validation is in progress.

Because this process should normally be very brief:

- no full-screen loading state is required;
- the upload area may become temporarily non-interactive;
- repeated submission of the same file should be prevented.

Suggested message:

> Checking audio file…

---

#### Validation Failed

The selected file has been rejected.

The user remains on the Welcome Experience.

The upload area returns to an interactive state.

---

#### Validation Successful

The selected file has passed initial validation.

The application immediately transitions to Analysis Progress.

No separate success message is required.

---

### Error Messages

Messages should be concise, specific and recoverable.

#### No File

> No file was selected.

#### Multiple Files

> Please select one audio file at a time.

#### Unsupported Format

> This audio format is not supported.

#### Empty File

> This file appears to be empty.

#### File Too Large

> This file is too large to analyse in the browser.

#### Audio Too Long

> This audio file is longer than the supported duration.

#### Generic Validation Failure

> This file could not be used. Please try another audio file.

The exact technical cause should not be exposed unless it helps the user resolve the problem.

---

### Error Presentation

Errors should appear:

- inside or immediately below the upload area;
- close to the interaction that caused them;
- without replacing the mission or privacy message;
- without requiring dismissal.

A new selection should clear the previous validation error.

The message should be announced to assistive technologies using an appropriate live region.

---

### Transitions

```text
Welcome — Idle
↓
File selected or dropped
↓
Validation
├── Failure → Welcome — Validation Error
└── Success → Analysis Progress
```

The successful transition should begin only after the active file has been stored safely in application state.

---

### Accessibility Notes

The file picker must be reachable and operable by keyboard.

The upload area must expose an appropriate accessible name and role.

Validation must not depend only on colour.

Error messages should:

- be associated with the upload control;
- use an accessible live region;
- remain visible long enough to be read.

Drag-and-drop must always have an equivalent click-and-keyboard workflow.

---

### Responsive Behaviour

Validation behaviour is consistent across screen sizes.

On touch devices:

- file selection is the primary interaction;
- drag-and-drop instructions may be reduced or hidden;
- the upload target must remain large enough for comfortable touch use.

Error messages should wrap naturally without changing the overall screen hierarchy.

---

### Implementation Notes

Suggested responsibilities:

```text
UploadArea
├── receives user input
├── manages drag presentation state
├── opens the file picker
└── reports selected files

validateAudioFile
├── checks file count
├── checks file size
├── checks extension and MIME type
└── returns a typed validation result

App
├── receives the validated file
├── stores the active file
└── changes the application phase
```

Suggested validation result shape:

```ts
type FileValidationResult =
  | {
      valid: true;
      file: File;
    }
  | {
      valid: false;
      reason:
        | "no-file"
        | "multiple-files"
        | "unsupported-format"
        | "empty-file"
        | "file-too-large"
        | "audio-too-long"
        | "unknown";
      message: string;
    };
```

Basic synchronous validation and actual audio decoding should remain separate.

The file may pass format validation but still fail during decoding. Decoding failures belong to the Analysis Progress error state.

Implementation-defined file-size and duration limits must be documented before they are enforced.

No raw audio data should be uploaded or transmitted.

---

## 3. Analysis Progress

### Screen Metadata

**Screen ID:** `ANALYSIS_PROGRESS`

**Application State:** `analysing`

**Previous State:** `idle`

**Next State:** `analysis-complete`

---

### Purpose

The Analysis Progress screen communicates that Synesthesia is transforming the uploaded audio into a set of complementary analytical representations.

Rather than presenting an indefinite loading indicator, this screen exposes the major stages of the analysis pipeline to reinforce the application's educational purpose.

The objective is to reassure the user that meaningful processing is taking place while maintaining a calm and uninterrupted experience.

---

### Entry Conditions

Displayed immediately after a valid audio file has been accepted and stored.

The selected file becomes the active experiment source.

The analysis pipeline starts automatically.

No user interaction is required.

---

### Exit Conditions

The screen ends when:

- audio decoding has completed successfully;
- all representations have been generated;
- the application is ready for exploration.

The application then transitions automatically to **Analysis Complete**.

---

### Layout

The interface remains simple and focused.

Layout hierarchy:

1. Header
2. Analysis title
3. Short explanation
4. Progress indicator
5. Current analysis stage
6. Optional stage list
7. Animated pixel-wave background

The interface should remain visually calm with minimal distractions.

---

### Components

#### Header

Displays:

- Synesthesia logo
- application name

---

#### Title

> Analysing Your Audio

---

#### Description

> Your audio is being transformed into multiple complementary representations.

---

#### Progress Indicator

Displays overall analysis progress.

The implementation may use:

- a linear progress bar;
- a segmented progress indicator; or
- another restrained visual representation.

Progress should advance only when meaningful milestones are reached.

---

#### Current Stage

Displays the active analysis step.

Examples:

- Decoding audio…
- Computing FFT…
- Building spectrogram…
- Extracting descriptors…
- Preparing laboratory…

Only one stage is highlighted at a time.

---

#### Stage Overview

Displays the complete pipeline:

- Decode Audio
- FFT Analysis
- Spectrogram Generation
- Descriptor Extraction
- Laboratory Preparation

Completed stages should remain visible.

The current stage should be emphasized.

Future stages remain inactive.

---

#### Pixel Wave Background

The animated background continues throughout analysis.

Motion should remain subtle and secondary to the progress information.

---

### Analysis Pipeline

The displayed stages correspond to the internal processing pipeline.

#### Stage 1

Decode Audio

Responsibilities:

- decode browser-supported audio;
- validate decoded buffer.

---

#### Stage 2

FFT Analysis

Responsibilities:

- compute spectral frames;
- prepare reusable frequency-domain data.

---

#### Stage 3

Spectrogram Generation

Responsibilities:

- generate spectrogram data;
- prepare visualization textures if required.

---

#### Stage 4

Descriptor Extraction

Compute:

- RMS Energy
- Spectral Centroid
- Spectral Spread
- Spectral Flatness
- Spectral Flux
- Onset Strength
- Mel-band Energies

---

#### Stage 5

Laboratory Preparation

Responsibilities:

- assemble analysis results;
- initialise visualization structures;
- prepare playback state;
- prepare Microscope and Canvas modes.

---

### Primary Action

None.

The analysis begins automatically.

---

### Secondary Actions

None.

The analysis should not require user decisions.

---

### Displayed Data

The screen may display:

- current analysis stage;
- overall progress;
- uploaded filename (optional);
- audio duration (optional).

No analytical results are shown yet.

---

### Interface States

#### Starting

The analysis has just begun.

The first stage is activated.

---

#### Processing

One analysis stage is currently executing.

Progress advances as stages complete.

---

#### Completing

All stages have completed successfully.

The interface briefly confirms completion before transitioning.

---

#### Failed

The analysis could not be completed.

The user remains informed and may restart the experiment.

---

### Progress Behaviour

Progress should represent completed milestones rather than elapsed time.

If an individual stage requires significantly more time than others, the interface should continue showing activity without appearing frozen.

Artificial progress should be avoided where possible.

---

### Transitions

```text
Validation Successful
↓

Analysis Progress

├── Decode Audio
├── FFT Analysis
├── Spectrogram Generation
├── Descriptor Extraction
└── Laboratory Preparation

↓

Analysis Complete
```

Transitions between stages should be smooth and uninterrupted.

---

### Error Handling

Failures may occur during:

- audio decoding;
- unsupported browser codecs;
- analysis computation;
- insufficient browser resources.

Example messages:

> This audio file could not be decoded.

> The selected audio format is not supported by your browser.

> Analysis could not be completed.

When possible, the user should be offered:

- Start New Experiment

No partially analysed experiment should be preserved.

---

### Accessibility Notes

Progress information must not rely only on animation.

The active stage should be announced to assistive technologies.

Progress updates should avoid excessive announcements.

Text must remain readable while the background animation continues.

---

### Responsive Behaviour

Desktop

Progress information remains centred.

Stage list may appear beneath the progress indicator.

Tablet

Spacing decreases while preserving hierarchy.

Mobile

The stage list may become more compact.

The current stage remains the primary information.

---

### Implementation Notes

Suggested component hierarchy:

```text
AnalysisScreen
├── Header
├── ProgressIndicator
├── CurrentStage
├── StageList
└── PixelWaveBackground
```

Suggested analysis responsibilities:

```text
AnalysisPipeline
├── decodeAudio()
├── computeFFT()
├── generateSpectrogram()
├── extractDescriptors()
└── prepareLaboratory()
```

The progress screen should observe analysis state rather than perform analysis directly.

The DSP pipeline remains independent from the user interface.

The screen should react only to analysis events emitted by the application.

---

## 4. Analysis Complete

### Screen Metadata

**Screen ID:** `ANALYSIS_COMPLETE`

**Application State:** `analysis-complete`

**Previous State:** `analysing`

**Next State:** `exploring`

---

### Purpose

The Analysis Complete screen marks the end of the computational phase and prepares the user to enter the interactive laboratory.

Its objectives are to:

- communicate that analysis has finished successfully;
- reinforce that multiple analytical representations have been created;
- provide a clear transition between analysis and exploration;
- establish anticipation before entering the laboratory.

Unlike the Analysis Progress screen, this interface represents completion rather than ongoing processing.

---

### Entry Conditions

Displayed automatically when the complete analysis pipeline finishes successfully.

All required analysis data has been generated and stored.

The laboratory is fully prepared.

---

### Exit Conditions

The screen ends when the user selects:

**Start Exploring**

The application transitions to the Laboratory Shell.

---

### Layout

The interface remains intentionally minimal.

Layout hierarchy:

1. Header
2. Completion message
3. Short explanation
4. Primary action
5. Pixel-wave background

The overall composition should feel calm and rewarding.

---

### Components

#### Header

Displays:

- Synesthesia logo
- application name

---

#### Completion Title

> Analysis Complete

---

#### Description

> Your audio has been transformed into multiple complementary representations.

---

#### Primary Button

**Start Exploring**

This is the only interactive element.

---

#### Pixel Wave Background

The animated background continues.

Motion should feel slightly more alive than during analysis while remaining subtle.

---

### Primary Action

**Start Exploring**

Transitions directly to the Laboratory Shell.

---

### Secondary Actions

None.

The interface intentionally presents a single next step.

---

### Displayed Data

No analytical values are displayed.

The user has not yet entered the exploration environment.

---

### Interface States

#### Ready

Default state.

The analysis has completed successfully.

The button is enabled.

---

#### Transitioning

After selecting **Start Exploring**:

- button becomes temporarily inactive;
- transition animation begins;
- Laboratory Shell loads.

---

### Transitions

```text
Analysis Progress

↓

Analysis Complete

↓

Start Exploring

↓

Laboratory Shell
```

The transition should feel continuous and uninterrupted.

---

### Accessibility Notes

The completion message should be announced to assistive technologies.

The primary button must receive keyboard focus.

The interface must remain fully usable without animation.

---

### Responsive Behaviour

The layout remains centred on all screen sizes.

The primary button should remain comfortably reachable on touch devices.

---

### Implementation Notes

Suggested component hierarchy:

```text
AnalysisCompleteScreen
├── Header
├── CompletionMessage
├── PrimaryButton
└── PixelWaveBackground
```

The screen owns no analysis logic.

Its sole responsibility is transitioning the user into the interactive laboratory.

No analysis should continue while this screen is displayed.

---

## 5. Laboratory Shell

## 5.1 Overview

The Laboratory is the persistent workspace in which the user explores the analysed audio.

It contains two complementary modes:

- **Microscope**, for inspecting objective audio representations and descriptors.
- **Canvas**, for exploring subjective visual mappings derived from the same analysis data.

The Laboratory Shell coordinates these modes without owning their internal visualization logic.

Its persistent structure is:

```text
LaboratoryShell
├── LaboratoryHeader
├── LaboratoryWorkspace
│   ├── MainPanel
│   └── ContextPanel
└── PlaybackBar
```

The Header, workspace layout and Playback Bar remain present while the active mode changes.

Only the contents of the Main Panel and Context Panel are replaced.

---

## 5.2 Purpose

The Laboratory Shell must:

- provide a stable environment for audio exploration;
- allow switching between Microscope and Canvas;
- preserve the current experiment while switching modes;
- provide one shared playback interface;
- provide one persistent Context Panel region;
- coordinate experiment-level actions;
- minimize CPU, memory and rendering resource consumption.

The Laboratory Shell must not:

- decode the audio file;
- repeat FFT analysis;
- recalculate descriptors;
- modify analysis data;
- create mode-specific visualizations;
- create more than one playback source;
- allow inactive visualizations to continue rendering.

---

## 5.3 Entry Conditions

The Laboratory may be opened only after analysis has completed successfully.

The active experiment must contain:

- file metadata;
- a decoded `AudioBuffer`;
- audio duration;
- waveform data;
- FFT-derived analysis data;
- spectrogram data;
- descriptor timelines;
- onset data;
- 12-band mel-energy data.

Conceptual experiment contract:

```ts
interface LaboratoryExperiment {
  id: string;
  file: AudioFileMetadata;
  audioBuffer: AudioBuffer;
  analysis: AnalysisResult;
}
```

If required experiment data is missing, the Laboratory must display a laboratory-level error rather than attempting to reconstruct the data silently.

---

## 5.4 Initial State

When the user enters the Laboratory:

- Microscope is the active mode;
- playback is stopped;
- the playhead is positioned at `0`;
- the default Microscope representation is displayed;
- the Context Panel displays Microscope controls;
- Canvas state is initialized but Canvas is not mounted;
- no continuous rendering loop runs until required.

The transition is:

```text
Analysis Complete
↓
Start Exploring
↓
Laboratory
↓
Microscope
```

---

## 5.5 Layout

### Desktop

```text
┌───────────────────────────────────────────────────────────┐
│ Laboratory Header                                         │
├─────────────────────────────────────┬─────────────────────┤
│                                     │                     │
│ Main Panel                          │ Context Panel       │
│                                     │                     │
│                                     │                     │
├─────────────────────────────────────┴─────────────────────┤
│ Playback Bar                                              │
└───────────────────────────────────────────────────────────┘
```

The Main Panel receives most of the available width.

The Context Panel remains on the right in both Microscope and Canvas modes.

The Playback Bar spans the complete width of the Laboratory Shell.

### Tablet

The layout should preserve:

- a usable Main Panel;
- visible mode switching;
- access to the Context Panel;
- complete playback functionality.

The Context Panel may use a narrower fixed width or become collapsible when necessary.

### Mobile

Recommended structure:

```text
Laboratory Header
Mode Selector
Main Panel
Context Panel Trigger
Playback Bar
```

The Context Panel should appear as a bottom sheet or side drawer.

It must not permanently reduce the width of the Main Panel on small screens.

---

## 5.6 Component Structure

```text
LaboratoryShell
├── LaboratoryHeader
│   ├── Brand
│   ├── ModeSelector
│   │   ├── MicroscopeTab
│   │   └── CanvasTab
│   └── GlobalActions
│       ├── AboutButton
│       └── ExperimentMenu
├── LaboratoryWorkspace
│   ├── MainPanel
│   │   └── ActiveModeWorkspace
│   │       ├── MicroscopeWorkspace
│   │       └── CanvasWorkspace
│   └── ContextPanel
│       └── ActiveModeContext
│           ├── MicroscopeContext
│           └── CanvasContext
├── PlaybackBar
│   ├── TransportControls
│   ├── SeekControl
│   ├── TimeDisplay
│   └── VolumeControls
├── AboutDialog
├── NewExperimentConfirmationDialog
└── LaboratoryErrorBoundary
```

Only one active workspace may be mounted at a time.

Only one mode-specific Context Panel component may be mounted at a time.

---

## 5.7 Laboratory Header

### Purpose

The Laboratory Header contains:

- application identity;
- mode switching;
- global information;
- experiment-level actions.

It must not contain playback controls or mode-specific visualization controls.

### Structure

```text
LaboratoryHeader
├── Brand
├── ModeSelector
└── GlobalActions
```

### Brand

The Brand displays:

- the Synesthesia logo;
- the application name.

The Brand should remain compact and visually subordinate to the active workspace.

For the initial implementation, it does not need to behave as a navigation link.

### Mode Selector

The Mode Selector contains:

- Microscope;
- Canvas.

It behaves as a two-option tab interface.

Selecting a mode must:

- update the active workspace;
- update the Context Panel contents;
- preserve playback;
- preserve the current playhead position;
- preserve volume and mute state;
- preserve the active experiment;
- preserve each mode’s local interface state;
- stop and unmount the previous mode’s renderer.

Mode selection must not:

- restart audio;
- repeat analysis;
- reset the experiment;
- reset the inactive mode’s configuration.

Suggested semantic structure:

```html
<div role="tablist" aria-label="Laboratory mode">
  <button role="tab" aria-selected="true">
    Microscope
  </button>

  <button role="tab" aria-selected="false">
    Canvas
  </button>
</div>
```

The selected mode must be distinguishable through more than colour alone.

### About / Help

The About action opens information about:

- the purpose of Synesthesia;
- the distinction between analysis and representation;
- Microscope and Canvas;
- basic interaction instructions;
- privacy and client-side processing.

Opening About should preserve the current experiment and playback state.

### Experiment Menu

The Experiment Menu contains:

- **Finish Experiment**
- **Start New Experiment**

It must not contain mode-specific controls.

### Header Exclusions

The following must not appear in the Header:

- play or pause;
- stop;
- seek;
- volume;
- mute;
- representation controls;
- descriptor controls;
- visualization presets;
- mapping controls;
- export controls.

---

## 5.8 Mode Ownership

The Laboratory Shell owns the active mode.

```ts
type LaboratoryMode = "microscope" | "canvas";
```

Conceptual state:

```ts
interface LaboratoryShellState {
  activeMode: LaboratoryMode;
  microscope: MicroscopeViewState;
  canvas: CanvasViewState;
}
```

This state may be implemented through separate hooks or reducers. It does not need to exist as one large React object.

### Switching Sequence

```text
User selects mode
↓
Laboratory Shell updates activeMode
↓
Current workspace cancels rendering
↓
Current workspace unmounts
↓
New workspace mounts
↓
Context Panel content changes
↓
Shared experiment and playback remain unchanged
```

### Default Mode

The default mode is:

```text
Microscope
```

This supports the intended progression:

```text
Analyse
↓
Inspect
↓
Represent
```

---

## 5.9 Mode State Preservation

Each mode maintains independent lightweight interface state.

### Microscope State

Microscope state may include:

```ts
interface MicroscopeViewState {
  selectedRepresentation:
    | "waveform"
    | "spectrum"
    | "spectrogram"
    | "mel";

  selectedDescriptor: DescriptorId | null;
  expandedExplanation: string | null;
}
```

Possible future additions include:

- zoom level;
- selected time range;
- frequency range;
- display toggles.

Switching away from Microscope must not reset these values.

### Canvas State

Canvas state may include:

```ts
interface CanvasViewState {
  selectedPreset:
    | "scientific"
    | "organic"
    | "geometric"
    | "custom";

  mappings: VisualizationMapping[];
  introductionSeen: boolean;
  expandedControlGroup: string | null;
}
```

Switching away from Canvas must not reset:

- the selected preset;
- custom mappings;
- mapping parameters;
- expanded control groups;
- onboarding completion.

### State Restrictions

Mode state may contain configuration and interface selections.

It must not contain:

- copied FFT frames;
- copied spectrogram data;
- copied descriptor timelines;
- copied mel-energy arrays;
- copied audio buffers;
- rendered Canvas frames.

---

## 5.10 Main Panel

### Purpose

The Main Panel is the primary visual workspace.

It displays either:

```text
MicroscopeWorkspace
```

or:

```text
CanvasWorkspace
```

### Shell Responsibility

The Laboratory Shell owns:

- Main Panel placement;
- dimensions;
- responsive behaviour;
- shared surface styling;
- error-boundary placement.

It does not own mode-specific rendering.

### Microscope

When Microscope is active:

```text
MainPanel
└── MicroscopeWorkspace
    ├── SelectedRepresentation
    ├── PlaybackCursor
    └── OptionalDescriptorDisplay
```

### Canvas

When Canvas is active:

```text
MainPanel
└── CanvasWorkspace
    ├── VisualizationCanvas
    └── OptionalIntroductionOverlay
```

### Mode Transition

When the mode changes:

- the Main Panel container remains in place;
- the active workspace is replaced;
- the previous workspace is unmounted;
- a brief crossfade may be used;
- no full-page transition is required;
- the new workspace renders at the authoritative playback time.

---

## 5.11 Context Panel

### Purpose

The Context Panel contains mode-specific:

- controls;
- navigation;
- values;
- explanations;
- mapping information.

### Ownership

The Laboratory Shell owns the Context Panel container.

The active mode owns its contents.

> The Shell owns where the panel exists. The mode owns what the panel means.

### Structure

```text
ContextPanel
├── ContextHeader
├── ContextContent
└── OptionalContextFooter
```

### Microscope Context

Microscope may provide:

```text
MicroscopeContext
├── RepresentationNavigation
├── DescriptorInspector
├── CurrentDescriptorValues
└── EducationalExplanation
```

The user may inspect descriptors but cannot edit their analytical values.

### Canvas Context

Canvas may provide:

```text
CanvasContext
├── VisualizationPresets
├── ActiveMappingSummary
├── MappingControls
└── MappingExplanation
```

Canvas controls modify representation mappings, not descriptor data.

### Position

On desktop, the Context Panel remains on the right in both modes.

It must not switch sides when the mode changes.

### Scrolling

The Context Panel may scroll internally when its content exceeds the available height.

The Header, Main Panel and Playback Bar should remain outside this scrolling area.

### Resizing

A fixed design-token width is preferred for the initial implementation.

User-resizable panels are outside the initial scope because they introduce additional:

- state;
- pointer handling;
- accessibility requirements;
- layout calculations;
- testing requirements.

---

## 5.12 Playback Architecture

Playback is owned by one Laboratory-level controller.

```text
LaboratoryShell
├── PlaybackController
├── LaboratoryHeader
├── LaboratoryWorkspace
└── PlaybackBar
```

There is:

- one decoded audio buffer;
- one active audio source;
- one playback clock;
- one authoritative playhead.

> There is one audio source, one playback clock and one authoritative playhead for the entire experiment.

The Playback Bar sends commands.

Microscope and Canvas observe playback state.

No mode may create its own audio source or playback timer.

---

## 5.13 Playback Bar

### Purpose

The Playback Bar provides shared transport controls for the complete experiment.

It behaves identically in Microscope and Canvas.

### Structure

```text
PlaybackBar
├── TransportControls
│   ├── PlayPauseButton
│   └── StopButton
├── SeekControl
├── TimeDisplay
│   ├── CurrentTime
│   └── Duration
└── VolumeControls
    ├── MuteButton
    └── VolumeSlider
```

### Play / Pause

A single toggle control is recommended.

When playback is stopped or paused:

- selecting it starts or resumes playback.

When playback is active:

- selecting it pauses playback.

### Stop

Stop must:

- stop the active source;
- return the playhead to `0`;
- update the visualization to the first frame;
- set playback state to `stopped`.

```ts
status: "stopped";
currentTime: 0;
```

### Seek

The seek control permits movement between:

```text
0
and
audio duration
```

Seeking must update:

- the shared playback position;
- the active visual workspace;
- the visible time information;
- the audio source when the seek is committed.

Pointer-based seeking should separate visual preview from audio commitment.

```text
Pointer drag begins
↓
Visual playhead previews the requested position
↓
Active workspace redraws at the preview time
↓
Audio source is not recreated for every pointer movement
↓
Pointer is released
↓
Seek is committed to the Playback Controller
```

If audio was playing before the committed seek, playback continues from the new position.

If audio was paused or stopped, the new position remains visible without beginning playback.

Keyboard-based seek adjustments may be committed after each discrete input.

The implementation must avoid repeatedly creating `AudioBufferSourceNode` instances during continuous pointer movement.

### Time Display

The time display uses:

```text
current time / total duration
```

Example:

```text
01:24 / 03:18
```

The visible text does not need to update at display refresh rate.

### Volume

The volume range should use a normalized value:

```ts
0.0 to 1.0
```

### Mute

Mute silences output without discarding the previous volume setting.

---

## 5.14 Playback Controller Contract

Suggested playback state:

```ts
type PlaybackStatus =
  | "stopped"
  | "playing"
  | "paused"
  | "ended"
  | "interrupted";

interface PlaybackSnapshot {
  status: PlaybackStatus;
  currentTime: number;
  duration: number;
  progress: number;
  volume: number;
  muted: boolean;
}
```

Suggested commands:

```ts
interface PlaybackCommands {
  play(): void;
  pause(): void;
  stop(): void;
  seek(time: number): void;
  setVolume(value: number): void;
  toggleMute(): void;
}
```

Conceptual controller interface:

```ts
interface PlaybackController {
  getSnapshot(): PlaybackSnapshot;
  getCurrentTime(): number;

  play(): void;
  pause(): void;
  stop(): void;
  seek(time: number): void;
  setVolume(value: number): void;
  toggleMute(): void;

  reconcileAudioState(): void;
  suspendIfIdle(): Promise<void>;
  dispose(): void;
}
```

The implementation may use:

- a dedicated controller instance;
- React Context;
- custom hooks;
- subscriptions;
- `useSyncExternalStore`;
- mutable references.

High-frequency playback time must not be stored in broad Shell-level React state.

The Playback Controller is also responsible for reconciling application state with the actual state of the browser audio system after an interruption or suspension.

---

## 5.15 Audio Source and AudioContext Lifecycle

`AudioBufferSourceNode` instances are single-use.

They cannot be paused and restarted.

The Playback Controller must encapsulate source recreation and prevent duplicate active sources.

### Play

```text
Confirm or resume AudioContext
↓
Stop and release any stale source
↓
Create AudioBufferSourceNode
↓
Connect source to the audio output chain
↓
Start from the saved playback offset
↓
Store AudioContext start time
```

### Pause

```text
Resolve authoritative current time
↓
Store playback offset
↓
Stop active source
↓
Release source reference
```

Pausing playback must not close or recreate the `AudioContext`.

### Resume

```text
Confirm AudioContext is running
↓
Create a new AudioBufferSourceNode
↓
Start from stored playback offset
```

### Seek

```text
Clamp requested time
↓
Store new playback offset
↓
Stop active source when necessary
↓
Create one new source if playback remains active
```

A visual seek preview must not recreate the source until the seek is committed.

### Stop

```text
Stop active source
↓
Release source reference
↓
Reset playback offset to 0
↓
Set status to stopped
```

### End

When playback reaches the end:

- status becomes `ended`;
- current time equals the duration;
- the final visualization state remains visible;
- selecting Play restarts from `0`;
- switching modes preserves the ended position.

### AudioContext Suspension

The application may suspend the `AudioContext` during extended inactivity to reduce resource consumption.

It must not suspend and resume the context on every ordinary pause.

Resuming a suspended context must occur through a valid user interaction when required by the browser.

### Browser or Device Interruption

Possible interruptions include:

- browser-initiated AudioContext suspension;
- mobile operating-system interruption;
- audio output changes;
- headphone disconnection;
- browser playback restrictions.

After an interruption, the Playback Controller must:

- verify the actual `AudioContext.state`;
- verify whether an active source still exists;
- stop and release stale source references;
- preserve the last valid playback offset;
- avoid creating duplicate sources;
- expose a recoverable playback state to the interface.

UI components must never create or manage their own `AudioBufferSourceNode`.

---

## 5.16 Shared Experiment Data

The following state belongs to the current experiment:

```text
Experiment
├── Experiment ID
├── File metadata
├── AudioBuffer
├── AnalysisResult
├── Playback Controller
├── Microscope State
└── Canvas State
```

The analysis result is immutable after successful analysis.

Conceptual structure:

```ts
interface AnalysisResult {
  sampleRate: number;
  duration: number;
  frameCount: number;
  hopSize: number;

  waveform: WaveformData;
  spectrogram: SpectrogramData;
  descriptorTimelines: DescriptorTimelines;
  melBands: MelBandTimeline;
}
```

Large numerical datasets should favour typed-array-backed representations rather than collections of small JavaScript objects.

For example, descriptor timelines may use a structure-of-arrays design:

```ts
interface DescriptorTimelines {
  rms: Float32Array;
  spectralCentroid: Float32Array;
  spectralSpread: Float32Array;
  spectralFlatness: Float32Array;
  spectralFlux: Float32Array;
  onsetStrength: Float32Array;
}
```

The exact DSP contracts are defined separately.

Onset strength is one of the descriptor timelines and should not require a separate duplicated dataset unless the DSP implementation has a specific technical reason.

---

## 5.17 Analysis Data Rules

### One Authoritative Result

The application stores one authoritative `AnalysisResult`.

Avoid:

```ts
const microscopeAnalysis = structuredClone(analysis);
const canvasAnalysis = structuredClone(analysis);
```

Prefer:

```ts
const analysis = experiment.analysis;
```

The active workspace receives a reference to the same immutable result.

### No Repeated Analysis

The Laboratory, Microscope and Canvas must not repeat:

- audio decoding;
- waveform extraction;
- FFT processing;
- spectrogram generation;
- spectral descriptor extraction;
- onset-strength calculation;
- mel filter-bank calculations.

### No Unnecessary Retention

The experiment should retain only data required for exploration, representation and later export.

The application must not retain unnecessarily:

- the original file object after decoding, unless still required;
- temporary decode buffers;
- intermediate FFT arrays that are not part of the final analysis result;
- obsolete analysis results from previous experiments;
- rendered visualization frames.

### Small Derived Values

Components may derive small display values such as:

- formatted time;
- normalized progress;
- current frame index;
- human-readable descriptor text.

Large analysis arrays must not be copied for UI convenience.

---

## 5.18 Analysis Frame Synchronization

Both modes must use the same time-to-frame calculation.

The active analysis frame should be resolved using:

- current playback time;
- sample rate;
- FFT hop size;
- frame timestamps, when available;
- total frame count.

Conceptual utility:

```ts
interface FrameLocator {
  getFrameIndex(time: number): number;
}
```

A frame locator should return an index or lightweight view into the existing analysis data rather than constructing a new object on every animation frame.

A basic implementation may resemble:

```ts
function getFrameIndexAtTime(
  time: number,
  sampleRate: number,
  hopSize: number,
  frameCount: number
): number {
  const index = Math.floor(
    (time * sampleRate) / hopSize
  );

  return Math.max(
    0,
    Math.min(index, frameCount - 1)
  );
}
```

Microscope and Canvas must not implement separate, inconsistent frame-location logic.

---

## 5.19 Rendering Lifecycle

### Active Workspace Only

Only the active visual workspace may be mounted.

```tsx
function ActiveWorkspace({
  mode,
}: {
  mode: LaboratoryMode;
}) {
  if (mode === "microscope") {
    return <MicroscopeWorkspace />;
  }

  return <CanvasWorkspace />;
}
```

Lightweight state providers or mode-state hooks may remain active if they perform no visualization work.

The application must not keep both visualization canvases mounted and hide one using CSS.

Hidden visual workspaces may retain:

- backing buffers;
- event listeners;
- animation loops;
- drawing resources;
- accessibility-tree entries.

### One Animation Loop

Only the active visual workspace may own a `requestAnimationFrame` loop.

```text
Microscope active
→ Microscope renderer enabled
→ Canvas visual workspace unmounted

Canvas active
→ Canvas renderer enabled
→ Microscope visual workspace unmounted
```

### Render Invalidation

The active renderer should distinguish continuous playback rendering from one-time redraw requests.

Conceptual reasons include:

```ts
type RenderReason =
  | "playback-frame"
  | "seek-preview"
  | "seek-commit"
  | "resize"
  | "representation-change"
  | "descriptor-change"
  | "mapping-change"
  | "preset-change"
  | "mode-entry";
```

A one-time visual change must request one redraw rather than starting a temporary continuous animation loop.

### Cleanup

When a visual workspace unmounts, it must release:

- pending animation frames;
- resize observers;
- pointer listeners;
- keyboard listeners;
- mode-specific subscriptions;
- temporary drawing buffers;
- offscreen resources.

Example cleanup pattern:

```ts
useEffect(() => {
  let frameId: number | null = null;

  function render() {
    // Draw current state.

    if (playbackIsActive()) {
      frameId = requestAnimationFrame(render);
    }
  }

  render();

  return () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }
  };
}, []);
```

The production implementation should schedule frames only while continuous rendering is required.

---

## 5.20 Rendering During Playback

While audio is playing:

```text
requestAnimationFrame
↓
Read authoritative playback time
↓
Resolve current analysis frame index
↓
Draw active visualization
↓
Schedule next frame
```

The active workspace reads time from the Playback Controller.

It must not maintain an independent elapsed-time counter.

This prevents visual drift.

The renderer should avoid allocating new arrays, large objects or persistent drawing entities on every frame.

---

## 5.21 Rendering While Paused

When playback is paused:

- continuous rendering stops;
- the current visual frame remains visible;
- changing a representation requests one redraw;
- changing a descriptor requests one redraw;
- changing a mapping requests one redraw;
- previewing or committing a seek requests one redraw;
- resizing requests one redraw.

```text
Paused
→ No continuous animation loop

Visual state changes
→ Renderer is invalidated
→ Draw once
```

This behaviour is required to reduce idle CPU consumption.

---

## 5.22 Page Visibility and Playback Interruption

Visual rendering must pause when the document is hidden.

Recommended behaviour:

- audio may continue playing;
- Canvas and Microscope rendering stop;
- no missed visual frames are rendered later;
- when the document becomes visible, the active workspace immediately resynchronizes with the authoritative playback time.

The application should use:

```ts
document.visibilityState
```

The active renderer must not attempt to replay or interpolate every frame missed while the page was hidden.

If the browser suspends audio while the page is hidden, the Playback Controller must reconcile its state before resuming.

A hidden page must never retain an unnecessary visual animation loop.

---

## 5.23 Canvas Resolution

Canvas backing resolution should account for device pixel ratio while preventing uncontrolled GPU and memory use.

Conceptual calculation:

```ts
const effectivePixelRatio = Math.min(
  window.devicePixelRatio,
  MAX_CANVAS_PIXEL_RATIO
);
```

The final cap should be selected through performance testing.

Canvas resizing must:

- occur only when dimensions change;
- avoid running during every animation frame;
- consolidate repeated resize events;
- redraw once after resizing.

If the canvas is resized to zero dimensions while hidden or during a layout transition, the renderer should wait for a valid size rather than allocating an invalid backing buffer.

---

## 5.24 Adaptive Visual Complexity

Canvas may reduce decorative complexity to maintain responsive rendering.

Adjustable factors may include:

- particle count;
- trail length;
- sampling density;
- decorative grid density;
- blur or glow usage;
- background redraw frequency;
- interpolation detail.

The priority order is:

1. correct playback;
2. audio-visual synchronization;
3. readable interaction;
4. analytical integrity;
5. decorative complexity.

Descriptor values and analytical data must never be altered to improve rendering performance.

Only the visual representation may be simplified.

Rendering should target smooth interaction on supported devices and reduce visual complexity when frame delivery becomes unstable.

The implementation is not required to maintain a fixed frame rate on every device.

---

## 5.25 Resource Consumption Requirements

Resource efficiency is a formal requirement.

### CPU

The Laboratory must:

- run no more than one animation loop;
- stop continuous rendering while paused where possible;
- pause visual rendering in hidden tabs;
- avoid recalculating unchanged mappings every frame;
- avoid repeated layout measurement;
- avoid broad React rerenders from high-frequency playback updates;
- avoid recreating the audio source continuously during seek dragging.

### Memory

The Laboratory must:

- store one `AudioBuffer`;
- store one authoritative `AnalysisResult`;
- avoid duplicated typed arrays;
- avoid large per-frame object allocation;
- avoid storing rendered frames;
- release inactive Canvas resources;
- reuse drawing buffers where practical;
- prevent unbounded particle creation;
- remove listeners and observers during cleanup;
- release references to discarded experiments;
- revoke temporary object URLs.

### Canvas and GPU

The Laboratory must:

- mount one primary visualization canvas at a time;
- cap effective rendering resolution where necessary;
- avoid oversized offscreen canvases;
- avoid unnecessary full-canvas redraws;
- reduce decorative complexity before compromising synchronization.

### React

Playback time must not update the complete Laboratory Shell at display refresh rate.

Avoid Shell-level code such as:

```ts
setCurrentTime(audioContext.currentTime);
```

inside every animation frame.

Prefer:

- controller getter functions;
- mutable clock references;
- localized subscriptions;
- direct Canvas drawing;
- lower-frequency state updates for visible text.

---

## 5.26 Context Panel Update Frequency

The Context Panel should not rerender every time playback time changes.

Current descriptor values may update at a lower UI frequency than the visualization.

For example:

- visualization rendering may follow the display refresh rate;
- numerical values may update several times per second;
- formatted time text may update several times per second;
- static explanations update only when the selection changes.

Mapping controls should rerender only when:

- the preset changes;
- a mapping changes;
- a control group changes;
- the active mode changes.

Mapping changes apply immediately and become part of the current experiment.

The Laboratory does not require a separate Save action for mapping changes.

---

## 5.27 Canvas Introduction

The Canvas introduction appears the first time the user enters Canvas during the current experiment.

Suggested state:

```ts
interface CanvasSessionState {
  introductionSeen: boolean;
}
```

It must not appear every time the user returns to Canvas.

Starting a new experiment resets this state.

If playback is active when the introduction appears:

- playback pauses;
- the current playback time is preserved;
- the introduction is displayed;
- playback does not resume automatically;
- the user resumes through an explicit action.

The final onboarding interaction is specified in the Canvas section.

---

## 5.28 Global Actions and Dialog Playback Behaviour

### About / Help

Opening About:

- preserves the active experiment;
- preserves the current mode;
- does not pause playback by default;
- does not unmount the active workspace.

Closing About returns focus to the opening control.

### Finish Experiment

Selecting **Finish Experiment** transitions to:

```text
Laboratory
↓
Reflection / Export
```

Before leaving the Laboratory:

- active playback stops;
- the active source is released;
- the final playhead position may be preserved as experiment metadata;
- Laboratory rendering loops are cancelled;
- the experiment and visualization configuration remain available to Reflection.

The Laboratory Playback Controller must not remain active after the Laboratory unmounts.

Reflection may define a separate playback or preview interface later if required.

### Start New Experiment

Selecting **Start New Experiment** opens a confirmation dialog.

Opening this destructive confirmation must:

- pause playback;
- preserve the current playback time;
- preserve the current experiment while the dialog remains open.

Suggested copy:

**Title**

```text
Start a new experiment?
```

**Message**

```text
Your current audio, exploration settings and visualization mappings will be cleared.
```

**Actions**

- Cancel
- Start New Experiment

The destructive action must be visually distinct.

It should not receive initial focus.

If the user cancels:

- the experiment remains unchanged;
- playback remains paused;
- playback does not resume automatically.

After confirmation, the application must:

- stop playback;
- release the active source;
- dispose of the Playback Controller;
- cancel animation frames;
- remove subscriptions and listeners;
- release temporary rendering resources;
- revoke temporary object URLs;
- remove references to the original file when no longer needed;
- clear the `AudioBuffer`;
- clear the `AnalysisResult`;
- reset Microscope state;
- reset Canvas state;
- reset Canvas onboarding;
- return to Welcome.

### Mobile Context Panel

Opening or closing the mobile Context Panel does not pause playback.

### Laboratory-Level Error

An unrecoverable laboratory-level error stops playback and releases the active source.

---

## 5.29 Loading and Initialization

The Laboratory should not normally display a full-screen loading state because analysis has already completed.

Local initialization may occur for:

- Canvas dimensions;
- rendering resources;
- browser audio activation;
- recovery from a suspended `AudioContext`.

Any loading indicator must remain local to the affected region.

Examples:

```text
Preparing visualization…
```

```text
Select Play to activate browser audio.
```

The complete Laboratory Shell should remain visible.

---

## 5.30 Error Handling

### Laboratory-Level Error

Examples include:

- missing `AnalysisResult`;
- missing `AudioBuffer`;
- invalid experiment state;
- unrecoverable Playback Controller failure;
- missing required browser support.

Playback must stop when an unrecoverable Laboratory-level error occurs.

Suggested presentation:

**Title**

```text
The laboratory could not be opened
```

**Message**

```text
The current experiment is missing required audio or analysis data.
```

**Action**

```text
Start New Experiment
```

### Playback Error

Playback errors should not discard the analysis result.

The Laboratory remains visible and displays an inline message near the Playback Bar.

Example:

```text
Audio playback could not start. Select Play again to activate browser audio.
```

Recoverable playback errors may expose a retry action.

The retry must reconcile the existing Playback Controller before creating a new source.

### Browser or Device Interruption

If browser or device behaviour interrupts playback:

- the visual workspace must not continue using a false playback state;
- the controller records the last valid playback position;
- stale sources are released;
- the interface displays a recoverable status when user action is required.

### Mode-Specific Rendering Error

A Microscope or Canvas rendering error should remain local to the Main Panel when possible.

Available recovery actions may include:

- retry visualization;
- switch mode;
- reset the current visualization configuration.

### Context Error

If explanatory content cannot be displayed, the primary visualization should remain usable.

Fallback:

```text
Additional information is currently unavailable.
```

---

## 5.31 Accessibility

### Landmarks

Recommended semantic structure:

```html
<header>
  Laboratory Header
</header>

<main>
  <section aria-label="Active laboratory workspace">
    Main Panel
  </section>

  <aside>
    Context Panel
  </aside>
</main>

<footer>
  Playback Bar
</footer>
```

The Main Panel and Context Panel may both exist within the page’s primary `<main>` landmark.

### Mode Selector

The Mode Selector must support:

- `role="tablist"`;
- `role="tab"`;
- `aria-selected`;
- arrow-key navigation;
- Enter or Space activation;
- visible keyboard focus.

Focus should remain on the active tab after switching modes.

### Main Panel

The Main Panel must have an accessible name reflecting the active mode.

Examples:

```text
Microscope visualization workspace
```

```text
Canvas visualization workspace
```

Canvas visualizations require a concise textual alternative describing:

- the selected representation or preset;
- the active mappings;
- the current playback state.

The interface must not attempt to narrate every animation frame.

### Context Panel

The Context Panel should use an `<aside>` or equivalent complementary landmark.

Its accessible name changes with the active mode.

Examples:

```text
Microscope controls and explanation
```

```text
Canvas mappings and controls
```

### Playback Controls

Controls require explicit accessible names.

Examples:

- Play audio
- Pause audio
- Stop and return to beginning
- Seek through audio
- Mute audio
- Unmute audio
- Audio volume

The seek control should expose:

- minimum value;
- maximum value;
- committed playback value;
- formatted time where supported.

A visual seek preview should not produce excessive screen-reader announcements while dragging.

### Dialogs

Dialogs require:

- an accessible title;
- focus movement into the dialog;
- focus containment;
- Escape-to-close behaviour;
- focus return to the opening control.

### Status Announcements

`aria-live` should be used only for significant changes such as:

- playback errors;
- interruption recovery;
- active mode confirmation;
- experiment reset confirmation.

Do not announce continuously changing:

- playback time;
- descriptor values;
- seek previews;
- visual frames.

### Reduced Motion

The interface must respect:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is requested:

- remove nonessential crossfades;
- remove decorative panel movement;
- simplify onboarding transitions;
- avoid unnecessary animated effects;
- preserve only motion required for meaningful audio representation.

---

## 5.32 Keyboard Behaviour

| Key | Context | Behaviour |
|---|---|---|
| Left / Right Arrow | Mode Selector | Move between Microscope and Canvas |
| Enter / Space | Mode Selector | Activate focused mode |
| Space | Workspace, outside editable controls | Play or pause |
| Escape | Dialog or mobile Context Panel | Close active overlay |
| Home | Seek control | Move to beginning |
| End | Seek control | Move to end |
| Arrow keys | Seek control | Adjust and commit playback position |
| Arrow keys | Volume control | Adjust volume |

Global shortcuts must not override the expected behaviour of:

- sliders;
- selects;
- text inputs;
- buttons;
- other interactive controls.

Space-to-play is optional for the initial implementation but should be supported if it can be implemented without input conflicts.

---

## 5.33 Focus and Responsive Panel Behaviour

### Entering the Laboratory

Initial focus should move to:

- the Laboratory heading; or
- the Microscope tab.

It should not automatically move to Play.

### Switching Modes

Focus remains on the selected mode tab.

It must not automatically jump into the Main Panel.

### Mobile Context Panel

When opened:

- focus moves into the panel;
- focus remains contained while the panel behaves as a modal surface;
- closing returns focus to the trigger.

### Responsive Breakpoint Changes

When the viewport changes between mobile and desktop layouts:

- experiment state remains unchanged;
- active mode remains unchanged;
- mode-specific selections remain unchanged;
- desktop Context Panel is visible by default;
- mobile drawer state does not force the desktop panel closed;
- entering mobile layout does not automatically open the drawer;
- returning to desktop clears obsolete modal focus containment;
- playback continues without interruption.

### Starting a New Experiment

After confirmation:

- the Laboratory unmounts;
- focus moves to the Welcome heading or upload control.

---

## 5.34 Visual Design

The Laboratory uses the established Synesthesia visual language:

- warm white background;
- charcoal typography;
- sage accents;
- muted lavender;
- dusty blue;
- light grey borders;
- restrained pixel-inspired details.

### Pixel Motif

The pixel motif may appear in:

- the logo;
- active mode indicator;
- subtle separators;
- the playback cursor;
- visualization marks;
- small icons.

It should not be used as a decorative border around every component.

### Visual Hierarchy

Recommended hierarchy:

1. application background;
2. Main Panel;
3. Context Panel;
4. controls and selected states;
5. overlays and dialogs.

The Main Panel should remain the dominant region.

### Motion

Transitions should be:

- brief;
- restrained;
- functional;
- compatible with reduced-motion preferences.

Mode switching must not animate the complete Shell.

---

## 5.35 Suggested State Boundaries

### React State

Suitable for:

- active mode;
- selected Microscope representation;
- selected descriptor;
- Canvas preset;
- mapping configuration;
- open dialogs;
- mobile Context Panel state;
- low-frequency visible playback values;
- seek-preview position while the user is dragging.

### Mutable or Controller State

Suitable for:

- authoritative committed playback time;
- active source node;
- AudioContext timing;
- animation-frame identifiers;
- reusable Canvas buffers;
- particle positions;
- last rendered frame index;
- playback offset before interruption.

### Immutable Experiment Data

Suitable for:

- `AudioBuffer`;
- waveform data;
- FFT-derived arrays;
- spectrogram data;
- descriptor timelines;
- mel-energy values.

---

## 5.36 Suggested Implementation Structure

```text
src/
├── laboratory/
│   ├── LaboratoryShell.tsx
│   ├── LaboratoryHeader.tsx
│   ├── LaboratoryWorkspace.tsx
│   ├── ContextPanel.tsx
│   ├── PlaybackBar.tsx
│   ├── laboratory.types.ts
│   ├── laboratory.reducer.ts
│   └── hooks/
│       ├── useLaboratoryState.ts
│       ├── usePlaybackController.ts
│       ├── usePlaybackSnapshot.ts
│       ├── usePageVisibility.ts
│       ├── useRenderInvalidation.ts
│       └── useActiveRenderer.ts
├── microscope/
│   ├── MicroscopeWorkspace.tsx
│   └── MicroscopeContext.tsx
├── canvas/
│   ├── CanvasWorkspace.tsx
│   └── CanvasContext.tsx
└── audio/
    ├── PlaybackController.ts
    └── playback.types.ts
```

This structure is illustrative rather than mandatory.

`LaboratoryShell.tsx` should remain a coordination component and should not accumulate all playback, rendering and mode logic.

---

## 5.37 Suggested Component Contracts

### Laboratory Shell

```ts
interface LaboratoryShellProps {
  experiment: LaboratoryExperiment;
  onFinishExperiment(
    result: LaboratoryExitSnapshot
  ): void;
  onStartNewExperiment(): void;
}
```

### Exit Snapshot

```ts
interface LaboratoryExitSnapshot {
  playheadTime: number;
  activeMode: LaboratoryMode;
  microscope: MicroscopeViewState;
  canvas: CanvasViewState;
}
```

### Header

```ts
interface LaboratoryHeaderProps {
  activeMode: LaboratoryMode;
  onModeChange(mode: LaboratoryMode): void;
  onOpenAbout(): void;
  onFinishExperiment(): void;
  onRequestNewExperiment(): void;
}
```

### Playback Bar

```ts
interface PlaybackBarProps {
  snapshot: PlaybackSnapshot;
  previewTime: number | null;
  commands: PlaybackCommands;

  onSeekPreview(time: number): void;
  onSeekCommit(time: number): void;
  onSeekCancel(): void;
}
```

### Context Panel

```ts
interface ContextPanelProps {
  mode: LaboratoryMode;
  children: React.ReactNode;
  mobileOpen: boolean;
  onMobileClose(): void;
}
```

The final implementation may replace some prop chains with focused contexts or custom hooks.

---

## 5.38 Cleanup Requirements

### Mode Change

When the active mode changes:

- cancel the previous renderer;
- remove mode-specific event listeners;
- remove mode-specific observers;
- release temporary mode resources;
- preserve lightweight mode configuration;
- preserve playback;
- preserve experiment data.

### Laboratory Exit to Reflection

When leaving for Reflection:

- stop playback;
- preserve the final playhead position if required;
- release the active source;
- dispose of Laboratory rendering resources;
- remove Laboratory-specific listeners and observers;
- preserve experiment and mapping data required by Reflection.

### Experiment Discard

When starting a new experiment:

- stop and dispose of playback;
- disconnect owned audio nodes;
- cancel all animation frames;
- clear seek-preview state;
- remove playback subscriptions;
- remove visibility listeners;
- remove resize observers;
- remove pointer and keyboard listeners;
- reset Canvas backing dimensions where appropriate;
- clear reusable renderer buffers;
- revoke all temporary object URLs;
- clear references to the decoded `AudioBuffer`;
- clear references to the immutable `AnalysisResult`;
- clear references to the original uploaded file when no longer required;
- make large typed arrays eligible for garbage collection.

Cleanup must not rely only on eventual component replacement.

Owned resources must be explicitly disconnected or dereferenced where applicable.

---

## 5.39 State Persistence Matrix

| State | Owner | Preserved across mode switch | Preserved for Reflection | Reset for new experiment |
|---|---|---:|---:|---:|
| File metadata | Experiment | Yes | Yes | Yes |
| AudioBuffer | Experiment | Yes | Project decision | Yes |
| AnalysisResult | Experiment | Yes | Yes | Yes |
| Playback time | Playback Controller | Yes | As snapshot | Yes |
| Playback status | Playback Controller | Yes | No | Yes |
| Volume | Playback Controller | Yes | No | Project decision |
| Mute | Playback Controller | Yes | No | Project decision |
| Seek-preview time | Playback Bar / Shell | No | No | Yes |
| Active mode | Laboratory Shell | Not applicable | Optional | Yes |
| Microscope selection | Microscope state | Yes | Optional | Yes |
| Selected Canvas preset | Canvas state | Yes | Yes | Yes |
| Custom mappings | Canvas state | Yes | Yes | Yes |
| Canvas introduction seen | Canvas state | Yes | No | Yes |
| Rendered pixels | Active workspace | No | No | Yes |
| Animation frame ID | Active workspace | No | No | Yes |
| Temporary drawing buffers | Active workspace | No | No | Yes |
| Temporary object URLs | Experiment lifecycle | Yes | Only if required | Yes |

Volume and mute may either reset with each experiment or persist as application-level preferences. This decision should be made during implementation.

Reflection should retain only the data it requires. It should not retain the decoded audio buffer solely because the Laboratory previously used it.

---

## 5.40 Performance Validation

The Laboratory should be tested for:

- duplicate animation loops;
- unnecessary React rerenders;
- retained Canvas elements;
- retained listeners or observers;
- duplicated analysis arrays;
- repeated FFT work;
- audio-visual drift;
- excessive Canvas resolution;
- repeated source creation during seek dragging;
- CPU use while paused;
- CPU use in hidden tabs;
- progressive slowdown after repeated mode changes;
- memory release after starting a new experiment.

Recommended test sequence:

```text
Enter Laboratory
↓
Play audio
↓
Drag seek control continuously
↓
Commit seek
↓
Switch modes repeatedly
↓
Pause
↓
Change visual settings
↓
Open and close About
↓
Open and cancel New Experiment confirmation
↓
Hide browser tab
↓
Return to tab
↓
Simulate AudioContext suspension
↓
Resume playback
↓
Finish experiment
```

A separate cleanup test should run:

```text
Load long audio file
↓
Enter Laboratory
↓
Switch modes repeatedly
↓
Start new experiment
↓
Load another file
↓
Compare retained memory
```

The tests must not produce:

- duplicate sound;
- stale animation;
- incorrect playhead state;
- one source per pointer movement;
- increasing memory use without release;
- progressively slower mode switching;
- playback continuing after the Laboratory has been exited.

Performance expectations are:

- no continuous visual animation while paused unless explicitly required;
- no more than one primary visualization canvas;
- no repeated DSP work during mode switching;
- no sustained frame backlog;
- responsive controls for the longest supported audio file;
- stable memory use after repeated mode switching;
- memory becoming reclaimable after an experiment is discarded.

---

## 5.41 Operational Decisions

The following rules are fixed for the Laboratory Shell:

- About does not pause playback.
- Opening the mobile Context Panel does not pause playback.
- Canvas onboarding pauses playback and preserves the current time.
- The Start New Experiment confirmation pauses playback and preserves the current time.
- Cancelling a blocking dialog does not automatically resume playback.
- An unrecoverable Laboratory error stops playback.
- Leaving the Laboratory for Reflection stops playback and releases the active source.
- Mapping changes apply immediately and require no separate Save action.
- Pointer-based seek interaction previews visual position continuously and commits audio seeking on release.
- Keyboard seek interaction may commit each discrete change.
- Responsive layout changes do not reset experiment or mode state.
- Browser audio interruptions are reconciled through the single Playback Controller.
- AudioContext interruption recovery must never create duplicate sources.
- Temporary object URLs and large experiment references are released when an experiment is discarded.
- The application prioritizes playback correctness and synchronization over decorative visual complexity.

---

## 5.42 Acceptance Criteria

### Layout

- The Header, workspace and Playback Bar form one persistent Shell.
- The Main Panel and Context Panel are separate regions.
- The Context Panel remains on the right on desktop.
- Mobile provides an accessible drawer or bottom-sheet alternative.
- Responsive changes do not reset mode or experiment state.
- Mode switching does not reconstruct the complete page layout.

### Mode Behaviour

- Microscope is active on initial entry.
- Users can switch between Microscope and Canvas.
- Switching modes does not restart playback.
- Switching modes preserves playback time.
- Microscope selections persist.
- Canvas settings and mappings persist.
- Canvas onboarding appears only once per experiment.
- Only the active visual workspace is mounted.
- Lightweight inactive mode state performs no rendering work.

### Playback

- One Playback Controller owns audio.
- One authoritative playback clock is used.
- Play, pause, stop, seek, mute and volume work in both modes.
- Seeking updates the active visual output.
- Pointer dragging does not recreate the audio source on every movement.
- A pointer seek is committed when the interaction ends.
- Mode switching preserves audio-visual synchronization.
- No mode creates its own playback source or timer.
- Browser interruption recovery does not create duplicate sources.
- Leaving the Laboratory stops playback and releases the active source.

### Analysis Integrity

- The analysis result is immutable.
- Microscope and Canvas use the same analysis data.
- FFT processing is not repeated.
- Descriptors are not recalculated.
- Mel energies are not recalculated.
- Descriptor values cannot be edited.
- Users modify mappings rather than analysis data.
- Large analysis structures are not duplicated for each mode.
- Current-frame lookup does not require large per-frame object allocation.

### Resource Efficiency

- No more than one animation loop runs.
- Inactive visual workspaces do not retain active Canvas rendering.
- Continuous rendering stops while paused where possible.
- One-time visual changes request one redraw.
- Visual rendering stops while the tab is hidden.
- Large analytical arrays are not duplicated.
- Playback updates do not rerender the complete Shell every frame.
- Canvas resolution is controlled.
- Reusable drawing structures are used where practical.
- All mode-specific resources are cleaned up on unmount.
- Object URLs and experiment references are released when discarded.
- Memory remains stable across repeated mode changes.
- Discarded experiment data becomes eligible for garbage collection.

### Dialog and Exit Behaviour

- About preserves playback.
- Canvas onboarding pauses playback.
- New Experiment confirmation pauses playback.
- Cancelling a blocking dialog does not resume playback automatically.
- Finish Experiment stops Laboratory playback.
- Start New Experiment requires confirmation.
- Experiment cleanup completes before returning to Welcome.

### Accessibility

- The Mode Selector uses tab semantics.
- Playback controls have accessible names.
- The Context Panel is a labelled complementary region.
- Seek previews do not create excessive announcements.
- Dialog focus is managed correctly.
- Mobile panel focus is managed correctly.
- Responsive changes remove obsolete modal focus containment.
- Reduced-motion preferences are respected.
- Continuously changing values are not repeatedly announced.

### Error Handling

- Missing experiment data produces a Laboratory-level error.
- Unrecoverable errors stop playback.
- Recoverable playback errors preserve the active experiment.
- Interruption recovery reconciles existing playback state.
- Mode-specific rendering errors remain local where possible.
- Experiment cleanup occurs before returning to Welcome.

---

## 5.43 Architectural Rule

> The Laboratory Shell is a persistent application frame containing a Header, a two-region workspace and a shared Playback Bar. It owns active-mode coordination, playback access, experiment references and lightweight mode-state persistence. Microscope and Canvas provide their own Main Panel and Context Panel content, but only the active visual workspace is mounted and permitted to render. Analysis data is created once, stored immutably and shared by reference. Audio playback uses one authoritative source and clock. Pointer-based seeking separates visual preview from committed audio seeking, and browser audio interruptions are reconciled through the shared Playback Controller. High-frequency rendering remains isolated from broad React state updates, while inactive rendering, temporary resources, object URLs and discarded experiment references are suspended or released to keep CPU and memory consumption at a minimum.

---

## 6. Microscope Mode

# 6. Microscope

## 6.1 Overview

Microscope is the analytical exploration mode of Synesthesia.

It allows the user to inspect objective representations derived from the uploaded audio and understand how measurable properties change over time.

Microscope is educational and investigative rather than editable.

> Microscope reveals what the analysis detected. It does not allow the user to alter analytical results.

Users may:

- select an analytical representation;
- inspect descriptor values;
- move through the audio timeline;
- compare related analytical views;
- inspect frequencies, amplitudes and mel bands;
- read plain-language explanations;
- adjust presentation options.

Users may not:

- modify descriptor values;
- alter FFT output;
- recalculate the analysis;
- modify mel-band energies;
- define subjective visualization mappings;
- change the underlying analytical data.

Subjective mapping belongs to Canvas.

---

## 6.2 Architectural Position

Microscope exists inside the persistent Laboratory Shell.

```text
LaboratoryShell
├── LaboratoryHeader
├── LaboratoryWorkspace
│   ├── MainPanel
│   │   └── MicroscopeWorkspace
│   └── ContextPanel
│       └── MicroscopeContext
└── PlaybackBar
```

The Laboratory Shell provides:

- the active experiment;
- immutable analysis data;
- the shared Playback Controller;
- persistent layout;
- saved Microscope interface state;
- the Context Panel container.

Microscope provides:

- representation selection;
- analytical rendering;
- descriptor inspection;
- local visualization interaction;
- educational interpretation;
- Microscope-specific Context Panel content.

Microscope does not own playback or analysis computation.

---

## 6.3 Core Principle

One analytical dataset supports several representations, but only one primary representation is displayed at a time.

```ts
type MicroscopeRepresentation =
  | "waveform"
  | "spectrum"
  | "spectrogram"
  | "mel";
```

The available representations are:

- **Waveform**, showing amplitude across time;
- **Spectrum**, showing frequency magnitude at the current playback position;
- **Spectrogram**, showing frequency energy across the complete duration;
- **Mel Bands**, showing twelve perceptually grouped energy values at the current playback position.

Each representation is derived from the same immutable `AnalysisResult`.

Switching representations must not initiate a new analytical process.

---

## 6.4 Ownership Boundary

```text
Laboratory Shell
├── Experiment reference
├── Playback Controller
├── Saved Microscope state
└── Context Panel container

Microscope Workspace
├── Representation composition
├── Active renderer
├── Playhead overlay
├── Local pointer interaction
├── Render invalidation
└── Temporary rendering resources

Microscope Context
├── Representation controls
├── Descriptor selection
├── Current values
├── Educational explanation
└── Display options
```

Microscope may read:

- waveform display data;
- stored FFT magnitude data;
- spectrogram source data;
- descriptor timelines;
- twelve-band mel-energy data;
- frame metadata;
- playback time;
- seek-preview time.

Microscope must not:

- duplicate complete analysis datasets;
- modify analysis arrays;
- create a second playback clock;
- create its own audio source;
- perform new FFT calculations;
- retain inactive representation renderers.

---

## 6.5 Initial State

When Microscope is opened for the first time during an experiment:

- Waveform is selected;
- RMS is selected as the initial descriptor;
- the complete audio duration is visible;
- the shared playhead is positioned at the authoritative playback time;
- the representation grid is visible;
- the playhead is visible;
- the normalized descriptor trend is visible;
- no explanation section is expanded;
- no zoom or time-range selection is applied.

Suggested default state:

```ts
const defaultMicroscopeState: MicroscopeViewState = {
  selectedRepresentation: "waveform",
  selectedDescriptor: "rms",
  expandedExplanation: null,
  displayOptions: {
    showGrid: true,
    showPlayhead: true,
    showDescriptorOverlay: true,
    normalizeSpectrumDisplay: true,
  },
};
```

Returning to Microscope after visiting Canvas restores the previously selected representation, descriptor and display options.

---

## 6.6 Layout

### Desktop

```text
┌──────────────────────────────────────┬─────────────────────┐
│ Representation Header                │ Representation      │
├──────────────────────────────────────┤ Navigation          │
│                                      ├─────────────────────┤
│ Representation Stage                 │ Descriptor          │
│                                      │ Inspector           │
│                                      ├─────────────────────┤
│                                      │ Current Values      │
├──────────────────────────────────────┤                     │
│ Descriptor Trend Strip               ├─────────────────────┤
│                                      │ Explanation         │
└──────────────────────────────────────┴─────────────────────┘
```

The Main Panel contains:

- the representation heading;
- the primary visualization;
- the shared playhead where applicable;
- an optional descriptor trend strip;
- local inspection feedback.

The Context Panel contains:

- representation navigation;
- descriptor selection;
- current values;
- educational explanations;
- secondary display options.

### Tablet

The design should:

- preserve a large usable representation stage;
- reduce Context Panel width where necessary;
- simplify axis labels;
- reduce decorative grid density;
- retain representation and descriptor selection;
- retain readable current values.

### Mobile

The Main Panel uses the available width.

The Context Panel appears through the Laboratory Shell’s mobile drawer or bottom sheet.

A compact status summary remains visible outside the drawer.

Example:

```text
Waveform · RMS 0.42
```

The user must be able to identify the active representation and selected descriptor without opening the Context Panel.

---

## 6.7 Component Structure

```text
MicroscopeWorkspace
├── MicroscopeViewport
│   ├── RepresentationHeader
│   │   ├── RepresentationTitle
│   │   ├── RepresentationDescription
│   │   └── OptionalDisplayActions
│   ├── RepresentationStage
│   │   ├── WaveformView
│   │   ├── SpectrumView
│   │   ├── SpectrogramView
│   │   └── MelView
│   ├── DescriptorTrendStrip
│   ├── PlayheadOverlay
│   ├── HoverInspector
│   └── RepresentationStatus
└── MicroscopeContext
    ├── RepresentationNavigation
    ├── DescriptorInspector
    ├── CurrentValues
    ├── EducationalExplanation
    └── DisplayOptions
```

Only one of the following primary representation components may be mounted:

- `WaveformView`;
- `SpectrumView`;
- `SpectrogramView`;
- `MelView`.

Shared lightweight components may remain mounted when they perform no inactive rendering work.

---

## 6.8 State Model

Suggested Microscope state:

```ts
interface MicroscopeViewState {
  selectedRepresentation: MicroscopeRepresentation;
  selectedDescriptor: DescriptorId;
  expandedExplanation: MicroscopeExplanationId | null;
  displayOptions: MicroscopeDisplayOptions;
}
```

Suggested display options:

```ts
interface MicroscopeDisplayOptions {
  showGrid: boolean;
  showPlayhead: boolean;
  showDescriptorOverlay: boolean;
  normalizeSpectrumDisplay: boolean;
}
```

Only controls with clear analytical or educational value should be exposed.

Microscope state may contain:

- representation selection;
- descriptor selection;
- explanation state;
- lightweight display preferences;
- future viewport configuration.

It must not contain:

- copied FFT frames;
- copied spectrogram matrices;
- copied descriptor timelines;
- copied mel-energy arrays;
- rendered canvas frames;
- a second playback position.

---

## 6.9 Representation Navigation

Representation navigation belongs in the Microscope Context Panel.

A compact indication of the active representation may appear above the Main Panel, but the primary control remains inside the Context Panel.

The available options are:

```text
Waveform
Amplitude over time

Spectrum
Frequency energy at the playhead

Spectrogram
Frequency energy across time

Mel Bands
Perceptually grouped frequency energy
```

A native radio group or equivalent accessible single-selection control is preferred.

Selecting a representation must:

- preserve the active experiment;
- preserve playback status;
- preserve the committed playhead position;
- preserve seek-preview state where appropriate;
- preserve descriptor selection;
- unmount the previous representation renderer;
- release temporary resources owned by the previous renderer;
- mount the selected renderer;
- draw it at the authoritative playback time;
- update the representation explanation.

Selecting a representation must not:

- seek the audio;
- pause playback;
- restart playback;
- repeat DSP analysis;
- reset the selected descriptor;
- clear other Microscope settings unnecessarily.

---

## 6.10 Representation Header

The Main Panel identifies the active representation with:

- a heading;
- a concise analytical description;
- optional lightweight display actions.

### Waveform

**Waveform**

Amplitude variation across the complete audio signal.

### Spectrum

**Spectrum**

Frequency distribution at the current playback position.

### Spectrogram

**Spectrogram**

Frequency content across the duration of the audio.

### Mel Bands

**Mel Bands**

Energy grouped into twelve perceptually spaced frequency bands.

The heading must remain visible even when the visualization itself is graphical.

---

## 6.11 Representation Stage

All primary representations render inside one persistent stage container.

```text
RepresentationStage
├── ActiveRepresentationCanvas
├── OverlayLayer
└── InteractionLayer
```

The stage owns:

- viewport measurement;
- canvas sizing;
- device-pixel-ratio handling;
- shared coordinate conversion;
- pointer interaction;
- visual status overlays;
- accessible representation descriptions.

The stage does not own:

- DSP calculation;
- playback timing;
- persistent analysis storage;
- mode switching.

The outer stage remains stable while the active internal renderer changes.

---

## 6.12 Shared Time Coordinate

Time-based representations use a consistent horizontal time axis.

This applies to:

- Waveform;
- Spectrogram;
- descriptor trend strips;
- playhead overlays;
- seek-preview indicators.

Conceptual conversion:

```ts
function timeToX(
  time: number,
  duration: number,
  width: number
): number {
  if (duration <= 0 || width <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(width, (time / duration) * width)
  );
}
```

The inverse operation supports click-to-seek and drag-to-preview:

```ts
function xToTime(
  x: number,
  width: number,
  duration: number
): number {
  if (width <= 0 || duration <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(duration, (x / width) * duration)
  );
}
```

These conversions should be shared rather than reimplemented separately by each time-based representation.

---

## 6.13 Waveform View

### Purpose

Waveform displays signal amplitude across the complete audio duration.

It helps the user identify:

- loud and quiet passages;
- silence or near-silence;
- broad dynamic structure;
- attacks;
- repeated sections;
- the current playback position.

### Data Source

Waveform uses precomputed display-resolution waveform data.

It must not read and reduce the complete `AudioBuffer` every time the component mounts.

Suggested structure:

```ts
interface WaveformData {
  min: Float32Array;
  max: Float32Array;
  bucketCount: number;
}
```

For the initial implementation, the waveform should display a combined mono overview.

If the source audio contains multiple channels, channel combination must occur during analysis rather than during every render.

### Rendering Model

Waveform is primarily static.

```text
Mount or resize
↓
Draw waveform base once

Playback update
↓
Move or redraw playhead only
```

Recommended layer structure:

```text
WaveformView
├── WaveformBaseCanvas
├── DescriptorOverlayCanvas
└── PlayheadOverlay
```

The base waveform redraws only when:

- the representation mounts;
- the viewport size changes;
- device pixel ratio changes;
- a waveform display option changes.

It must not redraw the complete waveform for every playback frame.

### Playhead

The Waveform playhead is displayed as a vertical line positioned from the authoritative playback time.

It may be implemented using:

- a lightweight HTML element;
- an SVG line;
- a transparent overlay canvas.

The chosen implementation must avoid redrawing the static waveform unnecessarily.

### Interaction

Users may:

- click the waveform to commit a seek;
- drag across the waveform to preview a seek;
- release to commit the preview;
- inspect the time beneath the pointer or keyboard focus.

The shared Laboratory seek-preview rules apply.

### Descriptor Overlay

When enabled, the selected scalar descriptor may appear as a normalized trend over the waveform.

Supported descriptors include:

- RMS;
- spectral centroid;
- spectral spread;
- spectral flatness;
- spectral flux;
- onset strength.

The overlay must be identified as a normalized display.

Example label:

```text
Normalized descriptor trend
```

The interface must not imply that the descriptor uses the same unit or raw scale as waveform amplitude.

---

## 6.14 Spectrum View

### Purpose

Spectrum displays frequency magnitude at the current playback position.

It helps the user inspect:

- low-frequency concentration;
- high-frequency energy;
- harmonic peaks;
- broad spectral shape;
- spectral centroid;
- spectral spread;
- tonal or noise-like characteristics.

### Data Source

Spectrum uses the stored FFT magnitude frame nearest to the authoritative playback time.

It must not:

- create a new analyser node;
- perform a new FFT;
- read directly from live audio output;
- copy the complete frame during every redraw.

Suggested storage:

```ts
interface SpectrumData {
  magnitudes: Float32Array;
  frameCount: number;
  binCount: number;
}
```

Frame access should use a lightweight typed-array view:

```ts
function getSpectrumFrameView(
  data: SpectrumData,
  frameIndex: number
): Float32Array {
  const start = frameIndex * data.binCount;
  const end = start + data.binCount;

  return data.magnitudes.subarray(start, end);
}
```

### Axes

The horizontal axis represents frequency.

The initial implementation should use logarithmic frequency positioning with clear labels such as:

```text
50 Hz
100 Hz
500 Hz
1 kHz
5 kHz
10 kHz
```

The vertical axis represents normalized display magnitude.

If the analysis pipeline stores reliable decibel values, the implementation may use a decibel scale instead. The selected scale must be documented and labelled.

### Rendering Behaviour

While playback is active:

```text
Read authoritative playback time
↓
Resolve analysis frame index
↓
Compare with last rendered frame
↓
Draw only when the frame index changes
```

Conceptual guard:

```ts
if (frameIndex === lastRenderedFrameIndex) {
  return;
}
```

While paused:

- the current spectrum remains visible;
- seeking requests one redraw;
- resizing requests one redraw;
- display-option changes request one redraw.

### Display Smoothing

Visual smoothing may be used as a presentation technique.

It must:

- leave the original analytical data unchanged;
- be deterministic;
- avoid large per-frame allocations;
- remain visually restrained;
- not imply greater analytical resolution than the source data contains.

---

## 6.15 Spectrogram View

### Purpose

Spectrogram displays frequency energy across time.

It combines:

- horizontal time;
- vertical frequency;
- visual intensity.

It helps the user observe:

- harmonic structure;
- transients;
- sustained tones;
- broadband energy;
- narrow frequency bands;
- changing pitch regions;
- periods of silence.

### Data Source

Spectrogram uses the stored FFT-derived data in the shared `AnalysisResult`.

It must not initiate a new FFT process.

### Rendering Strategy

The spectrogram separates a static analytical base from a dynamic playhead.

```text
Stored FFT magnitude data
↓
Resolution-aware sampling
↓
Static spectrogram base
↓
Dynamic playhead overlay
```

The base spectrogram redraws only when:

- the representation first mounts;
- the viewport size changes;
- the device pixel ratio changes;
- the colour scale changes;
- the frequency scale changes;
- a relevant display option changes.

It must not redraw continuously during ordinary playback.

### Horizontal Sampling

When the number of analysis frames exceeds the available canvas width, multiple frames map to one display column.

The renderer may aggregate values using a documented strategy such as:

- maximum magnitude;
- average magnitude;
- energy-weighted average.

The selected strategy must remain consistent.

A maximum or weighted aggregation may be used to prevent short transients from disappearing during downsampling.

### Vertical Sampling

When the number of FFT bins exceeds the available canvas height:

- multiple bins may map to one display row;
- bins may be aggregated without altering the original data;
- the renderer should support the same frequency scale used for labelling;
- a secondary full-resolution matrix should not be created without a strict memory limit.

### Render Cache

A viewport-sized rendered base may be cached for the currently active Spectrogram view.

The cache must be released when:

- Spectrogram unmounts;
- Microscope unmounts;
- the experiment is discarded;
- the viewport changes substantially;
- the rendering configuration becomes invalid.

The application must not retain multiple full-size spectrogram caches for inactive viewport configurations.

### Intensity Encoding

The intensity scale must:

- use a monotonic luminance progression;
- remain readable against the Main Panel surface;
- include an explanatory label or legend;
- avoid communicating intensity through hue alone;
- remain usable for users with colour-vision deficiencies.

### Playhead

The playhead is a separate dynamic layer.

During ordinary playback, the implementation should move or redraw only the playhead where possible.

---

## 6.16 Mel-Band View

### Purpose

Mel Bands displays the twelve stored mel-energy values at the current playback position.

It helps users understand how frequency energy may be grouped into perceptually motivated bands.

> Mel energy is a multidimensional representation consisting of twelve simultaneous band values.

Mel Bands must not be presented as a single scalar descriptor.

### Primary Design

The primary visualization uses twelve ordered bars, from lower to higher frequency.

```text
Low frequency                             High frequency
Band 1  Band 2  Band 3  ...  Band 11  Band 12
  ▇       ▇       ▇              ▇        ▇
```

Suggested structure:

```text
MelView
├── MelBandChart
│   ├── TwelveBandMarks
│   └── CurrentEnergyIndicators
├── FrequencyRangeLabels
└── OptionalHistoryTrail
```

### Current and Historical Information

The primary view shows the current twelve-band energy vector.

A lightweight temporal trail may be added only when:

- it remains visually distinct from the Spectrogram;
- it does not require substantial additional storage;
- it remains responsive;
- it provides clear educational value.

A second full mel spectrogram is outside the initial scope.

### Data Source

Suggested structure:

```ts
interface MelBandTimeline {
  values: Float32Array;
  frameCount: number;
  bandCount: 12;
  bandEdgesHz: Float32Array;
}
```

Current frame access should use a typed-array view:

```ts
function getMelFrameView(
  data: MelBandTimeline,
  frameIndex: number
): Float32Array {
  const start = frameIndex * data.bandCount;

  return data.values.subarray(
    start,
    start + data.bandCount
  );
}
```

### Rendering

Mel Bands redraws when:

- playback enters a new analysis frame;
- a seek is previewed;
- a seek is committed;
- the view resizes;
- a display option changes;
- the representation becomes active.

It should not redraw multiple times for the same analysis frame.

Continuous interpolation between frames is optional and should be used only when it improves readability without causing drift.

### Labelling

Each band should expose:

- band number or short identifier;
- approximate frequency range;
- current normalized energy;
- an accessible textual value.

Avoid assigning speculative perceptual labels such as:

- warmth;
- brilliance;
- body;
- harshness.

Approximate frequency descriptions may be provided when clearly identified as explanatory rather than analytical classifications.

---

## 6.17 Descriptor Inspector

Microscope supports the following scalar descriptors:

```ts
type DescriptorId =
  | "rms"
  | "spectralCentroid"
  | "spectralSpread"
  | "spectralFlatness"
  | "spectralFlux"
  | "onsetStrength";
```

Descriptors are scalar measurements that vary over time.

They may be represented through:

- a current value;
- a normalized trend;
- a compact timeline;
- an explanation;
- a relationship to the active representation.

Descriptor selection remains independent from representation selection.

For example:

- RMS may be inspected while viewing the Spectrogram;
- spectral centroid may be inspected while viewing the Waveform;
- onset strength may be inspected while viewing Mel Bands.

The active representation may suggest related descriptors, but it must not restrict the user’s choice.

### Descriptor Options

The Descriptor Inspector uses a single-selection list.

Each descriptor option should include:

- descriptor name;
- concise meaning;
- selected state;
- optional current normalized indicator.

Example:

```text
● RMS
  Overall signal energy

○ Spectral Centroid
  Centre of spectral energy

○ Spectral Spread
  Distribution around the centroid

○ Spectral Flatness
  Tonal versus noise-like distribution

○ Spectral Flux
  Amount of spectral change

○ Onset Strength
  Strength of detected attacks
```

### Related Descriptor Guidance

The interface may indicate descriptors most directly related to the active representation.

| Representation | Closely related descriptors |
|---|---|
| Waveform | RMS, Onset Strength |
| Spectrum | Spectral Centroid, Spectral Spread, Spectral Flatness |
| Spectrogram | Spectral Flux, Onset Strength, Spectral Centroid |
| Mel Bands | RMS, Spectral Centroid, Spectral Spread |

These relationships are educational suggestions only.

The user remains free to select any supported descriptor.

---

## 6.18 Current Descriptor Values

The Current Values section displays the selected descriptor at the authoritative playback or preview time.

Suggested structure:

```text
Current Value
Descriptor Name
Primary Value
Unit or Scale
Interpretive Description
```

Example:

```text
Spectral Centroid
2.84 kHz
Energy is currently centred higher in the frequency range.
```

Example:

```text
Spectral Flatness
0.18
The current spectrum is more tonal than noise-like.
```

Interpretive descriptions must remain cautious.

Avoid absolute claims such as:

```text
This sound is bright.
```

Prefer analytical descriptions such as:

```text
The spectral energy is currently concentrated higher in the frequency range.
```

### Update Frequency

Visible numerical values do not need to update at display refresh rate.

They should update:

- when the current analysis frame changes;
- when the user previews a different time;
- when the selected descriptor changes;
- after a committed seek.

Visible React updates may be throttled to a modest rate while direct canvas rendering remains synchronized independently.

### Units and Scales

Where meaningful, display standard units.

Recommended presentation:

| Descriptor | Display |
|---|---|
| RMS | Normalized amplitude or project-defined energy scale |
| Spectral Centroid | Hz or kHz |
| Spectral Spread | Hz or kHz |
| Spectral Flatness | Unitless ratio |
| Spectral Flux | Documented normalized project scale |
| Onset Strength | Documented normalized project scale |

Any project-specific normalization must be documented in `DSP_NOTES.md`.

---

## 6.19 Descriptor Trend Strip

A compact descriptor trend may appear beneath the primary representation.

```text
Representation Stage
├── Primary Representation
├── Descriptor Trend Strip
└── Shared Playhead
```

The trend strip should:

- use the selected descriptor;
- share the horizontal time scale for the complete audio duration;
- display a normalized trend;
- share the committed or preview playhead;
- clearly identify the descriptor name;
- avoid suggesting that different descriptors share raw units.

The strip must not compete visually with the primary representation.

Changing the selected descriptor requests one trend redraw.

For long audio files, the trend should be downsampled to the available viewport width.

It must not create one DOM or SVG element per analysis frame.

The strip may remain visible below Spectrum and Mel Bands to provide historical context, even though their primary views show only the current frame.

---

## 6.20 Educational Explanation

The Microscope Context Panel includes an explanation for:

- the active representation;
- the selected descriptor;
- their analytical relationship;
- important limitations.

Suggested structure:

```text
EducationalExplanation
├── What You Are Seeing
├── How to Read It
├── Related Descriptor
└── Important Limitation
```

Example for Spectrum:

```text
What you are seeing

The spectrum shows how energy is distributed across frequencies at the current playhead position.

How to read it

Peaks indicate frequencies with stronger energy. Their position and height change as the audio changes.

Related descriptor

Spectral centroid summarizes where the overall spectral energy is centred.

Important limitation

The spectrum represents one analysis frame and does not describe the complete sound by itself.
```

### Progressive Disclosure

Explanations should use progressive disclosure.

Recommended levels:

1. plain-language explanation;
2. expanded analytical detail;
3. formula or implementation note.

The initial interface should show the plain-language explanation.

Detailed formulas and implementation notes remain collapsed by default.

Educational text must not present descriptors as infallible interpretations of perception or emotion.

---

## 6.21 Playhead Behaviour

The playhead position comes exclusively from the shared Playback Controller.

```text
Playback Controller
↓
Authoritative current time
↓
Shared coordinate conversion
↓
Microscope playhead
```

Microscope must not maintain an independent playhead timer.

### Time-Based Views

Waveform and Spectrogram show a horizontal-time playhead as a vertical line.

The descriptor trend strip uses the same horizontal position.

### Current-Frame Views

Spectrum and Mel Bands represent the current frame directly.

They should display:

- current formatted time;
- playback status;
- current frame content.

A moving horizontal playhead is not required inside their primary chart.

### Seek Preview

During seek preview:

- time-based playheads move to the preview time;
- Spectrum and Mel Bands display the preview frame;
- descriptor values display preview values;
- the committed playback position remains unchanged;
- the audio source is not recreated;
- cancelling the interaction restores the committed time;
- releasing the interaction commits the seek.

---

## 6.22 Pointer Interaction

### Click-to-Seek

The following time-based areas may support click-to-seek:

- Waveform;
- Spectrogram;
- descriptor trend strip.

Clicking commits a seek through the shared Playback Controller.

### Drag-to-Preview

Pointer dragging:

- creates a temporary preview time;
- updates the visible playhead;
- updates preview descriptor values;
- updates Spectrum or Mel content where applicable;
- does not create a new audio source during every pointer movement;
- commits the seek on release.

### Spectrum Inspection

Pointer or keyboard inspection may reveal:

- frequency;
- normalized magnitude;
- approximate bin position.

Selecting an ordinary spectrum mark does not seek the audio.

### Mel-Band Inspection

Pointer or keyboard inspection may reveal:

- band number;
- approximate frequency range;
- current normalized energy.

Selecting a mel band does not change the audio or analytical data.

### Interaction Restraint

Graphical marks should become interactive only when the interaction has a clear educational purpose.

The interface should not make every rendered element focusable or clickable.

---

## 6.23 Hover and Focus Inspector

A lightweight inspector may display analytical information beneath the pointer or keyboard focus.

### Waveform

May display:

- time;
- minimum amplitude;
- maximum amplitude.

### Spectrum

May display:

- frequency;
- normalized magnitude;
- optional decibel value when supported.

### Spectrogram

May display:

- time;
- frequency;
- normalized intensity.

### Mel Bands

May display:

- band number;
- approximate frequency range;
- normalized energy.

The inspector must:

- remain visually subordinate;
- avoid obstructing important content;
- support keyboard alternatives where practical;
- avoid broad React rerenders at pointer-event frequency;
- disappear when no point is being inspected;
- remain separate from the authoritative Current Values section.

Renderer-local drawing or direct lightweight DOM updates may be used for high-frequency pointer movement.

---

## 6.24 Zoom

Zoom is outside the initial Microscope scope.

The full audio duration remains visible in time-based views.

Zoom is deferred because it would add:

- viewport-range state;
- navigation controls;
- additional seek behaviour;
- more spectrogram cache states;
- more complex time-axis calculations;
- additional accessibility requirements;
- increased rendering and testing cost.

The architecture should not prevent future zoom support.

Possible future state:

```ts
interface MicroscopeViewportRange {
  startTime: number;
  endTime: number;
}
```

For the initial implementation:

```text
startTime = 0
endTime = audio duration
```

---

## 6.25 Rendering Lifecycle

Only the selected representation renderer may be active.

```text
Waveform selected
→ Waveform renderer mounted
→ Other representation renderers unmounted

Spectrum selected
→ Spectrum renderer mounted
→ Other representation renderers unmounted
```

A representation switch must:

- cancel pending animation frames;
- remove representation-specific listeners;
- release temporary canvases or image buffers;
- preserve lightweight Microscope state;
- mount and size the selected renderer;
- draw the current analytical state.

Representation components must not remain mounted and hidden through CSS.

---

## 6.26 Static and Dynamic Rendering

Where possible, renderers should separate static and dynamic layers.

### Waveform

```text
Static waveform base
+
Optional descriptor trend
+
Dynamic playhead
```

### Spectrum

```text
Static axes and grid
+
Current FFT frame
```

The current frame redraws only when the frame index changes.

### Spectrogram

```text
Static spectrogram image
+
Dynamic playhead
```

### Mel Bands

```text
Static axes and labels
+
Current twelve-band values
```

The band values redraw only when the frame index changes.

This separation is required to reduce unnecessary drawing work.

---

## 6.27 Rendering Invalidation

Suggested invalidation reasons:

```ts
type MicroscopeRenderReason =
  | "mount"
  | "playback-frame"
  | "representation-change"
  | "descriptor-change"
  | "seek-preview"
  | "seek-commit"
  | "resize"
  | "display-option-change"
  | "visibility-return";
```

Each renderer decides which layers must be redrawn.

| Reason | Waveform | Spectrum | Spectrogram | Mel Bands |
|---|---|---|---|---|
| Playback frame | Playhead only | New frame only | Playhead only | New frame only |
| Descriptor change | Descriptor layer | Trend/context | Trend layer | Trend/context |
| Resize | Full redraw | Full redraw | Full redraw | Full redraw |
| Seek preview | Playhead and values | Preview frame | Playhead and values | Preview frame |
| Seek commit | Playhead and values | Current frame | Playhead and values | Current frame |
| Display option change | Relevant layers | Relevant layers | Relevant layers | Relevant layers |
| Visibility return | Synchronize playhead | Current frame | Synchronize playhead | Current frame |

A one-time invalidation must request one redraw.

It must not start an unnecessary continuous animation loop.

---

## 6.28 Rendering During Playback

While audio is playing:

```text
requestAnimationFrame
↓
Read authoritative playback time
↓
Resolve current frame index
↓
Update the active representation
↓
Schedule the next frame only if required
```

The renderer must not maintain its own elapsed-time calculation.

Waveform and Spectrogram should generally update only their playhead during ordinary playback.

Spectrum and Mel Bands should redraw only when playback enters a different analysis frame.

The renderer should avoid allocating:

- new large arrays;
- frame objects;
- geometry collections;
- persistent DOM nodes;

during every animation frame.

---

## 6.29 Rendering While Paused

While playback is paused:

- continuous Microscope animation stops;
- the current analytical state remains visible;
- changing representation requests a redraw;
- changing descriptor requests a redraw;
- changing a display option requests a redraw;
- seeking requests a redraw;
- resizing requests a redraw;
- pointer inspection may update only its local overlay.

```text
Paused
→ No continuous animation

State change
→ Invalidate relevant layer
→ Draw once
```

---

## 6.30 Page Visibility

When the document is hidden:

- Microscope rendering stops;
- the active renderer does not process missed frames;
- no hidden playhead animation continues;
- static representation data remains available;
- audio behaviour follows the Laboratory Shell rules.

When the document becomes visible:

- the renderer reads the authoritative playback time;
- resolves the current frame;
- redraws the required layers once;
- resumes continuous rendering only if playback is active.

---

## 6.31 Resource Consumption Requirements

Resource efficiency is a formal Microscope requirement.

### Active Representation

- Only one primary representation renderer may be mounted.
- Inactive representations must not retain animation loops.
- Inactive representation canvases must not retain large backing buffers.
- Lightweight state may remain stored without rendering.

### Typed Arrays

Renderers should use shared typed arrays and lightweight views.

Avoid:

- converting typed arrays to ordinary arrays;
- copying complete FFT frames;
- creating one object per analysis frame;
- creating one DOM element per frequency bin;
- creating one DOM element per timeline point;
- using `.map()` to construct large temporary collections during every draw.

### React Updates

React state may update for:

- representation selection;
- descriptor selection;
- explanation state;
- display options;
- low-frequency visible descriptor values;
- local errors.

React state should not update for:

- every playhead movement;
- every animation frame;
- every spectrum frame;
- every mel frame;
- every hover coordinate;
- canvas geometry.

### Long Audio Files

For long files:

- Waveform uses fixed display-resolution envelope data;
- Spectrogram uses viewport-aware sampling;
- descriptor trends are downsampled to viewport width;
- no representation creates one visual node per frame;
- temporary caches remain bounded;
- rendering cost depends primarily on viewport dimensions rather than total duration.

### Cleanup

Representation renderers must release:

- pending animation frames;
- resize observers;
- pointer listeners;
- keyboard listeners;
- cached viewport images;
- temporary drawing buffers;
- renderer-local subscriptions.

---

## 6.32 Context Panel

Recommended Context Panel order:

```text
MicroscopeContext
├── RepresentationNavigation
├── DescriptorInspector
├── CurrentValues
├── EducationalExplanation
└── DisplayOptions
```

### Priority

The order reflects expected interaction frequency:

1. choose a representation;
2. choose a descriptor;
3. read the current value;
4. understand the relationship;
5. adjust secondary presentation options.

Representation and descriptor selection should remain easy to reach.

Detailed educational information may be collapsible.

Display options should be collapsed by default when space is limited.

### Display Options

Potential options include:

- show or hide grid;
- show or hide playhead;
- show or hide descriptor trend;
- normalize Spectrum display.

Display options must affect presentation only.

They must not change analysis data.

---

## 6.33 Responsive Behaviour

### Desktop

Desktop provides:

- a large Main Panel;
- persistent right-side Context Panel;
- complete representation axes;
- descriptor trend strip;
- full educational explanation access.

### Tablet

Tablet may:

- reduce Context Panel width;
- shorten axis labels;
- reduce tick density;
- reduce grid density;
- collapse secondary explanations;
- retain all representation and descriptor controls.

### Mobile

On mobile:

- the Main Panel uses full width;
- the Context Panel opens as a drawer or bottom sheet;
- the representation heading remains visible;
- the selected descriptor and current value remain available in compact form;
- the playhead remains visible;
- axes use fewer labels;
- secondary grid lines may be hidden;
- the visualization must not require horizontal page scrolling.

### Small Rendering Areas

When available space is limited:

- reduce tick count;
- shorten units;
- remove nonessential grid lines;
- retain essential axis meaning;
- retain the playhead;
- retain selected-state labels;
- avoid overlapping text;
- avoid rendering dense unreadable labels.

Responsive simplification must not alter analytical values.

---

## 6.34 Accessibility

### Representation Selection

Representation selection should use native radio controls or an equivalent accessible single-selection pattern.

Suggested semantics:

```html
<fieldset>
  <legend>Representation</legend>

  <label>
    <input
      type="radio"
      name="representation"
      value="waveform"
    />
    Waveform
  </label>
</fieldset>
```

The control must expose:

- the group name;
- the selected representation;
- keyboard navigation;
- visible focus;
- concise representation descriptions.

### Visualization Naming

Each visualization must have an accessible name.

Examples:

```text
Waveform visualization
```

```text
Spectrum at the current playback position
```

```text
Spectrogram across the complete audio duration
```

```text
Twelve-band mel-energy visualization
```

### Textual Alternative

Canvas-based graphics require a concise textual alternative containing relevant information such as:

- active representation;
- committed or preview time;
- selected descriptor;
- current descriptor value;
- broad analytical summary.

Example:

```text
Spectrum at 1 minute 24 seconds. Energy is concentrated in the lower and middle frequency range. Spectral centroid is 2.84 kilohertz.
```

The textual alternative must not update or announce continuously during playback.

It may update:

- at a restrained interval;
- when playback pauses;
- after seeking;
- when the user requests inspection;
- when representation or descriptor selection changes.

### Keyboard Seeking

Focusable time-based representations should support:

- Left and Right Arrow for defined seek increments;
- Home for the start;
- End for the end;
- Shift with Arrow for a larger increment where implemented.

These controls must use the same Playback Controller seek commands as the Playback Bar.

### Keyboard Inspection

Where practical, users should be able to:

- move between meaningful Spectrum frequency points;
- move between Mel bands;
- inspect values without a pointer.

Not every FFT bin needs to become a separate focus target.

Inspection may use a controlled cursor or grouped navigation model.

### Colour and Contrast

Representations must not communicate information through colour alone.

Use combinations of:

- position;
- line height;
- bar height;
- luminance;
- outlines;
- labels;
- texture where necessary.

Grid lines, playheads and text must meet appropriate contrast requirements.

### Motion

When reduced motion is requested:

- remove nonessential representation transitions;
- avoid decorative interpolation;
- update Spectrum and Mel values directly;
- preserve meaningful playhead movement;
- preserve analytical changes necessary to understand playback.

### Announcements

Do not continuously announce:

- playhead movement;
- descriptor changes on every frame;
- spectrum updates;
- mel-energy updates;
- hover values.

Announcements should be limited to meaningful user-triggered changes and errors.

---

## 6.35 Error and Empty States

### Missing Representation Data

If data for one representation is unavailable while the remaining analysis is valid:

- show a local error inside the Main Panel;
- preserve the Laboratory Shell;
- preserve playback where safe;
- allow selection of another representation;
- do not discard the complete experiment.

Example:

```text
The spectrogram could not be displayed.

The waveform, spectrum and descriptor data remain available.
```

### Invalid Frame Access

If playback or preview time resolves beyond the available frame range:

- clamp to the nearest valid frame;
- preserve the interface;
- avoid throwing from the rendering loop;
- report persistent inconsistencies during development.

### Silent Audio

A valid silent or near-silent file is not an error.

Expected display may include:

- a flat or near-flat Waveform;
- near-zero Spectrum values;
- low Mel-band values;
- descriptor values consistent with silence.

An explanation may clarify that little measurable energy is present.

### Zero Rendering Size

If the representation stage temporarily reports zero width or height:

- do not allocate an invalid backing canvas;
- wait for a valid resize;
- retain the selected representation;
- display a local preparation message only if the condition persists.

Example:

```text
Preparing the analytical view…
```

### Renderer Failure

A representation-specific rendering failure should remain local.

Possible recovery actions include:

- retry representation;
- select another representation;
- reset display options.

It must not trigger new DSP analysis automatically.

---

## 6.36 Suggested Contracts

### Workspace

```ts
interface MicroscopeWorkspaceProps {
  analysis: AnalysisResult;
  playback: PlaybackController;
  state: MicroscopeViewState;

  onStateChange(
    update: Partial<MicroscopeViewState>
  ): void;
}
```

### Context Panel Content

```ts
interface MicroscopeContextProps {
  state: MicroscopeViewState;
  currentFrameIndex: number;
  currentDescriptorValue: DescriptorValue;

  onRepresentationChange(
    representation: MicroscopeRepresentation
  ): void;

  onDescriptorChange(
    descriptor: DescriptorId
  ): void;

  onDisplayOptionsChange(
    options: Partial<MicroscopeDisplayOptions>
  ): void;
}
```

### Renderer

```ts
interface MicroscopeRenderer {
  resize(
    width: number,
    height: number,
    pixelRatio: number
  ): void;

  drawBase(): void;

  drawFrame(
    frameIndex: number,
    playbackTime: number
  ): void;

  drawPreview(
    frameIndex: number,
    previewTime: number
  ): void;

  dispose(): void;
}
```

Not every renderer needs every method to perform substantial work.

Examples:

- Waveform `drawFrame()` may update only the playhead.
- Spectrogram `drawFrame()` may update only the playhead.
- Spectrum `drawBase()` may draw axes and grid.
- Mel `drawFrame()` may update only the current band values.

### Frame Locator

```ts
interface FrameLocator {
  getFrameIndex(time: number): number;
}
```

The shared frame locator should return an index or lightweight typed-array view rather than constructing a new frame object during every update.

---

## 6.37 Suggested Implementation Structure

```text
src/
├── microscope/
│   ├── MicroscopeWorkspace.tsx
│   ├── MicroscopeContext.tsx
│   ├── MicroscopeViewport.tsx
│   ├── RepresentationNavigation.tsx
│   ├── DescriptorInspector.tsx
│   ├── CurrentDescriptorValue.tsx
│   ├── EducationalExplanation.tsx
│   ├── DisplayOptions.tsx
│   ├── microscope.types.ts
│   ├── microscope.constants.ts
│   ├── renderers/
│   │   ├── WaveformRenderer.ts
│   │   ├── SpectrumRenderer.ts
│   │   ├── SpectrogramRenderer.ts
│   │   ├── MelRenderer.ts
│   │   └── renderer.types.ts
│   ├── components/
│   │   ├── WaveformView.tsx
│   │   ├── SpectrumView.tsx
│   │   ├── SpectrogramView.tsx
│   │   ├── MelView.tsx
│   │   ├── PlayheadOverlay.tsx
│   │   ├── DescriptorTrendStrip.tsx
│   │   └── HoverInspector.tsx
│   └── hooks/
│       ├── useMicroscopeRenderer.ts
│       ├── useCurrentAnalysisFrame.ts
│       ├── useMicroscopeSeek.ts
│       └── useMicroscopeInvalidation.ts
└── analysis/
    ├── FrameLocator.ts
    └── analysis.types.ts
```

This structure is illustrative rather than mandatory.

Renderer logic should remain independent from React where practical.

This improves:

- testability;
- disposal;
- rendering performance;
- reuse;
- isolation from component rerenders.

---

## 6.38 State Persistence Matrix

| State | Owner | Preserved across representation switch | Preserved across mode switch | Reset for new experiment |
|---|---|---:|---:|---:|
| Selected representation | Microscope state | Not applicable | Yes | Yes |
| Selected descriptor | Microscope state | Yes | Yes | Yes |
| Expanded explanation | Microscope state | Yes | Yes | Yes |
| Display options | Microscope state | Yes | Yes | Yes |
| Playback time | Playback Controller | Yes | Yes | Yes |
| Seek-preview time | Laboratory interaction state | During interaction | No | Yes |
| Analysis data | Experiment | Yes | Yes | Yes |
| Current frame index | Derived | Recalculated | Recalculated | Yes |
| Hover inspector position | Active view | No | No | Yes |
| Static representation cache | Active renderer | No | No | Yes |
| Animation-frame identifier | Active renderer | No | No | Yes |

Representation-specific rendering resources are temporary and must not be treated as persistent Microscope state.

---

## 6.39 Performance Validation

Microscope should be tested for:

- duplicate representation renderers;
- repeated FFT work;
- complete Waveform redraw during playback;
- complete Spectrogram redraw during playback;
- unnecessary Spectrum redraws for unchanged frame indices;
- unnecessary Mel redraws for unchanged frame indices;
- copied typed arrays;
- large per-frame allocations;
- retained viewport caches;
- excessive React updates;
- incorrect seek-preview behaviour;
- audio-visual drift;
- progressive slowdown after repeated representation changes.

Recommended test sequence:

```text
Open Microscope
↓
Play Waveform
↓
Drag and commit a seek
↓
Select Spectrum
↓
Pause playback
↓
Seek while paused
↓
Select Spectrogram
↓
Resize the viewport
↓
Select Mel Bands
↓
Inspect multiple bands
↓
Switch repeatedly between representations
↓
Switch to Canvas
↓
Return to Microscope
```

The sequence must not produce:

- repeated DSP calculation;
- duplicate playheads;
- stale current-frame values;
- multiple active animation loops;
- continuously increasing memory use;
- source recreation during seek preview;
- loss of representation or descriptor state;
- progressively slower representation switching.

Performance expectations are:

- one active representation renderer;
- no complete Waveform redraw for ordinary playhead movement;
- no complete Spectrogram redraw for ordinary playhead movement;
- no duplicate-frame Spectrum or Mel redraw;
- no per-frame copying of complete analysis frames;
- responsive representation switching;
- stable memory use after repeated switching.

---

## 6.40 Acceptance Criteria

### General

- Microscope opens with Waveform selected.
- RMS is selected by default.
- Exactly one primary representation renderer is mounted.
- Users can select Waveform, Spectrum, Spectrogram or Mel Bands.
- Representation switching preserves playback.
- Representation switching preserves descriptor selection.
- Returning from Canvas restores Microscope state.
- No representation performs new DSP analysis.

### Waveform

- Waveform displays the complete audio duration.
- It uses precomputed display data.
- Its base layer does not redraw for every playback update.
- Its playhead remains synchronized with the Playback Controller.
- It supports click-to-seek.
- It supports drag-to-preview and release-to-commit.
- Its descriptor overlay is clearly identified as normalized.

### Spectrum

- Spectrum displays the stored FFT frame nearest the current time.
- It does not create a new FFT or analyser node.
- It uses lightweight frame views where practical.
- It redraws only when the analysis frame changes.
- It preserves the current frame while paused.
- It exposes meaningful frequency labels.
- Visual smoothing does not alter analytical data.

### Spectrogram

- Spectrogram displays frequency energy across time.
- It uses the shared FFT-derived dataset.
- It uses viewport-aware horizontal and vertical sampling.
- It separates its static base from the dynamic playhead.
- It does not redraw its full base during ordinary playback.
- It does not retain multiple full-size rendered caches.
- Its intensity scale uses more than hue alone.

### Mel Bands

- Mel Bands displays exactly twelve energy values.
- It treats mel data as multidimensional.
- It shows the current values at the committed or preview time.
- It uses shared typed-array data.
- It does not represent mel as a scalar descriptor.
- Each band exposes an approximate frequency range.
- It redraws only when the relevant frame changes.

### Descriptors

- Microscope supports RMS, spectral centroid, spectral spread, spectral flatness, spectral flux and onset strength.
- Descriptor selection remains independent from representation selection.
- Current values come from the authoritative frame.
- Preview values come from the preview frame.
- Descriptor values cannot be edited.
- Standard units are used where meaningful.
- Project-specific normalized scales are documented.
- Interpretive descriptions remain analytically cautious.

### Descriptor Trend

- The trend uses the complete audio duration.
- It uses a normalized visual scale.
- It shares the same playhead as time-based representations.
- It does not imply that unlike descriptors share raw units.
- It is downsampled for the current viewport.
- It does not create one DOM element per analysis frame.

### Playback and Interaction

- Microscope uses the shared Playback Controller.
- It does not create an independent timer or audio source.
- Click-to-seek uses the shared seek command.
- Dragging previews without continuously recreating the source.
- Releasing commits the seek.
- Cancelling restores the committed position.
- Paused views redraw only when invalidated.
- Returning from a hidden tab immediately resynchronizes.

### Performance

- Only one primary representation renderer is active.
- Waveform and Spectrogram separate static and dynamic layers.
- Spectrum and Mel skip unchanged analysis frames.
- Large arrays are not copied during rendering.
- No representation creates one DOM element per analysis value.
- React does not rerender at display refresh rate for playhead movement.
- Viewport caches remain bounded.
- Representation resources are released on unmount.
- Memory remains stable across repeated representation changes.

### Responsive Behaviour

- Desktop uses the persistent right-side Context Panel.
- Mobile uses the Shell-provided drawer or bottom sheet.
- The active representation remains identifiable outside the mobile panel.
- Essential current descriptor information remains available.
- Small layouts reduce label density without changing analytical values.
- Visualizations do not require horizontal page scrolling.

### Accessibility

- Representation selection uses accessible single-selection semantics.
- Each visualization has an accessible name.
- Canvas graphics provide a concise textual alternative.
- Continuously changing graphics are not continuously announced.
- Time-based seek interaction is keyboard accessible.
- Spectrum and Mel provide meaningful keyboard inspection where practical.
- Colour is not the only information channel.
- Focus states are visible.
- Reduced-motion preferences are respected.

### Error Handling

- Missing data for one representation produces a local error.
- Other valid representations remain available.
- Invalid frame access is clamped safely.
- Silent audio is displayed as valid analytical data.
- Zero-size canvases are not allocated.
- Renderer failures do not automatically trigger new analysis.
- Local errors do not discard the active experiment.

---

## 6.41 Architectural Rule

> Microscope is a read-only analytical workspace that presents one primary representation at a time from the single immutable analysis result. Waveform, Spectrum, Spectrogram and twelve-band Mel views share playback timing, frame-location utilities and analytical data without repeating DSP work. Waveform and Spectrogram separate static analytical layers from dynamic playheads, while Spectrum and Mel redraw only when the active analysis frame changes. Descriptor inspection remains independent from representation selection, and descriptor trends are presented as normalized contextual views rather than editable data. All playback, seeking and synchronization remain controlled by the Laboratory-level Playback Controller, while inactive representations are unmounted and release their temporary rendering resources.

---

## 7. Canvas Introduction

# 7. Canvas

## 7.1 Overview

Canvas is the experimental environment of Synesthesia. While the Microscope presents objective measurements of an audio signal, Canvas enables users to construct subjective visual interpretations from those measurements.

Unlike traditional music visualizers, Canvas is not intended to generate predefined visual effects synchronized to music. Instead, it exposes the relationship between measurable audio descriptors and visual properties, allowing users to experiment with different mappings and observe how objective signal characteristics can produce multiple valid visual representations.

Canvas therefore functions as an interactive laboratory rather than a passive visualization.

Its primary educational objective is to demonstrate that identical analytical information can produce fundamentally different visual outcomes depending on how that information is interpreted.

---

## 7.2 Purpose

Canvas transforms immutable audio analysis into dynamic visual representations.

Its responsibilities are to:

- interpret descriptor values through user-defined mappings;
- generate animated graphics synchronized with playback;
- provide immediate visual feedback while mappings are modified;
- encourage exploration of relationships between sound and image;
- preserve synchronization with the global playback state.

Canvas does **not** perform audio analysis.

It does **not** modify descriptors.

It does **not** generate new measurements.

Instead, it consumes the shared `AnalysisResult` produced by the analysis pipeline and converts it into visual states.

---

## 7.3 Architectural Position

Canvas occupies the interpretation stage of the application.

The complete processing pipeline is therefore divided into two independent layers.

### Objective Analysis

```text
Audio File
    ↓
Audio Decoding
    ↓
DSP Pipeline
    ↓
AnalysisResult
```

### Subjective Interpretation

```text
AnalysisResult
        ↓
Mapping Resolver
        ↓
Visual State
        ↓
Canvas Renderer
        ↓
Rendered Frame
```

This separation is a fundamental architectural principle.

The DSP pipeline measures.

The Canvas pipeline interprets.

Neither pipeline should contain logic belonging to the other.

---

## 7.4 Core Philosophy

Canvas is built around the following principle:

> **Analysis is objective. Representation is subjective.**

Every descriptor contained in the shared `AnalysisResult` represents a measurable property of the audio signal.

Examples include:

- RMS
- Spectral Centroid
- Spectral Spread
- Spectral Flatness
- Spectral Flux
- Onset Strength
- Mel-band energies

These values remain immutable after analysis.

Canvas never modifies them.

Instead, Canvas allows users to decide how descriptor values influence visual parameters.

For example:

- RMS may control particle size.
- Spectral Centroid may control colour.
- Flux may control movement speed.
- Onsets may trigger visual events.
- Mel energies may influence spatial distribution.

None of these mappings alter the analysis itself.

Only the interpretation changes.

Consequently, multiple visualizations generated from the same audio remain equally valid because they are alternative representations of identical analytical data.

This distinction represents the conceptual foundation of Synesthesia.

---

## 7.5 Ownership Boundary

Canvas owns only visualization-specific state.

It does not own playback.

It does not own analysis.

It does not own audio timing.

The ownership model is intentionally strict.

### Canvas owns

- active visualization preset;
- descriptor mappings;
- visual configuration parameters;
- renderer-specific state;
- animation state;
- transient interaction state.

### Canvas reads

- current playback time;
- playback state;
- current analysis frame;
- descriptor values;
- experiment metadata.

### Canvas never owns

- AudioContext;
- AudioBuffer;
- playback clock;
- playhead position;
- analysis pipeline;
- descriptor computation.

Playback timing remains exclusively controlled by the shared `PlaybackController`.

The Canvas renderer queries the playback controller whenever a new frame is rendered.

This guarantees that every visualization remains synchronized with the rest of the laboratory.

No renderer should maintain an independent animation timeline derived from elapsed rendering time.

Animation always follows playback.

If playback pauses, animation pauses.

If playback seeks, animation immediately reflects the new playback position.

If playback restarts, visualization resumes from the corresponding analysis frame.

This ensures that all representations within the laboratory remain temporally consistent.

---

### Architectural Consequences

This ownership model produces several important properties.

**Deterministic rendering**

Given the same:

- AnalysisResult,
- playback position,
- mapping configuration,

Canvas should always generate the same visual output.

---

**Shared synchronization**

Microscope and Canvas observe exactly the same playback clock.

Neither mode performs timing calculations independently.

---

**Independent experimentation**

Changing visual mappings never requires recomputing analysis.

The DSP pipeline executes once.

Users may experiment with multiple visual interpretations using the same immutable analytical dataset.

---

**Clear separation of concerns**

The application architecture naturally divides into three layers.

```text
Playback
        ↓
Analysis
        ↓
Visualization
```

Each layer has a single responsibility and communicates only through clearly defined interfaces.

This separation improves maintainability, simplifies reasoning about the application, and reinforces the educational distinction between objective signal analysis and subjective visual interpretation.

## 7.6 Initial State

When Canvas is first opened for a newly analysed audio file, it should present a complete visualization immediately without requiring user configuration.

The initial experience should encourage exploration rather than setup.

The default state should therefore provide:

- a predefined visualization preset;
- default descriptor mappings;
- sensible visual parameter values;
- synchronized playback behaviour;
- an immediately responsive editing interface.

The initial preset should demonstrate the core philosophy of Synesthesia by making the relationship between descriptors and visual behaviour easy to perceive.

Users may modify the preset freely without affecting the underlying analysis.

---

## 7.7 Workspace Layout

Canvas occupies the Main Panel of the Laboratory Shell.

The overall layout remains consistent with Microscope.

```text
Laboratory Shell
├── Header
├── Workspace
│   ├── Canvas Stage
│   └── Context Panel
└── Playback Bar
```

The Canvas Stage contains the active visualization.

The Context Panel contains all controls used to inspect and modify the visualization.

Maintaining the same shell layout across laboratory modes reinforces that users are interacting with different perspectives of the same experiment rather than switching between separate applications.

---

### Canvas Stage

The Canvas Stage provides the entire drawing surface for the active visualization.

It is responsible only for rendering.

No editing controls should overlap the visualization itself.

The drawing surface should resize with the available workspace while preserving rendering quality.

Canvas should occupy all available space inside the stage.

---

### Context Panel

The Context Panel acts as the control centre for Canvas.

Unlike the Microscope Context Panel, which primarily presents information, the Canvas Context Panel allows users to modify how analysis is interpreted.

Typical sections include:

- Visualization Presets
- Active Mapping Summary
- Mapping Editor
- Visual Parameters
- Educational Explanation

The Context Panel should remain persistent while the active visualization changes.

Only its contents should update according to the current visualization.

---

## 7.8 Component Structure

Canvas is intentionally organised around a small number of focused components.

```text
CanvasWorkspace
├── CanvasStage
│   └── Renderer
└── CanvasContext
    ├── PresetSelector
    ├── MappingSummary
    ├── MappingEditor
    ├── ParameterControls
    └── MappingExplanation
```

Each component has a single responsibility.

---

### CanvasWorkspace

Coordinates the visualization workspace.

Responsibilities:

- connect playback state;
- provide analysis data;
- own visualization configuration;
- coordinate renderer updates.

---

### CanvasStage

Hosts the HTML Canvas element.

Responsibilities:

- sizing;
- render lifecycle;
- renderer mounting;
- animation loop.

CanvasStage should not contain mapping logic.

---

### Renderer

Produces pixels.

Responsibilities:

- receive resolved visual state;
- render the current frame;
- remain synchronized with playback.

The renderer should not know where descriptor values originate.

It receives only the visual state required to draw the frame.

---

### CanvasContext

Hosts all visualization controls.

Responsibilities:

- preset selection;
- mapping editing;
- parameter adjustment;
- educational explanations.

The Context Panel should never perform rendering.

---

## 7.9 State Model

Canvas maintains only state directly related to visual interpretation.

Suggested state includes:

```ts
interface CanvasState {
    preset: VisualizationPreset;

    mappings: DescriptorMapping[];

    parameters: VisualizationParameters;

    rendererState: RendererState;

    selectedMapping?: string;
}
```

This state is independent from playback.

Whenever playback advances, Canvas queries the shared analysis data rather than storing descriptor histories locally.

---

### Preset State

Represents the currently selected visualization configuration.

Changing presets should:

- replace mappings;
- replace visual parameters;
- preserve playback position;
- preserve analysis;
- preserve experiment state.

---

### Mapping State

Stores the relationship between descriptors and visual properties.

Mappings represent interpretation only.

Changing a mapping should immediately update rendering without recomputing analysis.

---

### Parameter State

Stores renderer-specific configuration.

Examples include:

- particle count;
- line thickness;
- opacity;
- colour palette;
- smoothing amount;
- decay rate.

These parameters modify appearance but never influence descriptor computation.

---

### Renderer State

Renderer state contains transient values required to animate the visualization.

Examples include:

- particle positions;
- previous animation values;
- interpolation buffers;
- temporal effects.

Renderer state exists only while the renderer is active.

It should be recreated when a new visualization requiring different internal state is selected.

---

## 7.10 Rendering Pipeline

Canvas rendering follows a deterministic sequence.

```text
Playback Time
        ↓
Current Analysis Frame
        ↓
Descriptor Values
        ↓
Mapping Resolution
        ↓
Visual State
        ↓
Canvas Renderer
        ↓
Displayed Frame
```

Each stage has a single responsibility.

---

### Step 1 — Playback Position

The renderer requests the current playback time from the shared PlaybackController.

Playback remains the authoritative timing source.

---

### Step 2 — Analysis Frame

The playback time determines the active frame within the immutable AnalysisResult.

No DSP computation occurs during rendering.

---

### Step 3 — Descriptor Retrieval

The renderer retrieves the descriptor values corresponding to the active frame.

For example:

- RMS
- Spectral Centroid
- Flux
- Spread
- Flatness
- Mel-band energies

These values are read-only.

---

### Step 4 — Mapping Resolution

Descriptor values are converted into visual properties.

For example:

```text
Centroid
        ↓
Hue

Flux
        ↓
Motion Speed

RMS
        ↓
Scale
```

This transformation is entirely configurable.

It represents the central interaction of Canvas.

---

### Step 5 — Visual State

The resolved visual properties are assembled into a renderer-independent visual description.

For example:

```ts
interface VisualState {
    colour: Colour;

    scale: number;

    velocity: number;

    opacity: number;

    emphasis: number;
}
```

VisualState acts as the bridge between descriptor mappings and rendering.

The renderer should not know which descriptors produced these values.

It simply draws the current visual state.

---

### Step 6 — Rendering

The renderer draws the current frame.

Rendering should remain deterministic.

Given identical:

- playback position;
- analysis result;
- mappings;
- parameters;

the generated frame should always be identical.

This property simplifies debugging, improves reproducibility, and reinforces the distinction between objective analysis and subjective interpretation.

## 7.11 Visualization Presets

Canvas provides a collection of predefined visualization presets.

A preset represents a complete visual interpretation of the analysed audio rather than a collection of independent rendering settings.

Its purpose is to provide meaningful starting points for experimentation while demonstrating that identical analytical data can produce different visual outcomes.

Presets should encourage exploration, not restrict it.

Users may freely modify any preset after it has been selected.

---

### Preset Responsibilities

A preset defines:

- the renderer to use;
- descriptor-to-property mappings;
- default visual parameters;
- colour palette;
- animation behaviour;
- renderer-specific configuration.

A preset does **not** define:

- playback behaviour;
- audio analysis;
- descriptor computation;
- experiment metadata.

---

### Preset Lifecycle

Selecting a preset should:

- preserve playback position;
- preserve analysis data;
- preserve playback state;
- replace visualization configuration;
- immediately redraw the Canvas.

Changing presets should never interrupt audio playback.

The transition should feel immediate, allowing users to compare visual interpretations while listening to the same moment of audio.

---

## 7.12 Visualization Renderer

A renderer is responsible for producing a particular style of visualization.

Each renderer interprets the resolved `VisualState` according to its own drawing strategy.

Renderers should remain independent from descriptor computation.

They should never request descriptor values directly.

Instead, they receive only the visual properties required to draw the current frame.

This separation ensures that multiple renderers can reuse the same mapping system.

---

### Renderer Responsibilities

Every renderer should:

- initialize renderer-specific resources;
- receive the current `VisualState`;
- update internal animation state;
- draw the current frame;
- release resources when unmounted.

A renderer should never:

- perform DSP calculations;
- own playback timing;
- modify mappings;
- modify descriptor values.

---

### Renderer Independence

Different renderers may represent identical descriptor values in completely different ways.

For example:

```text
VisualState
│
├── Particle Renderer
├── Line Renderer
├── Geometry Renderer
└── Field Renderer
```

Because renderers consume the same `VisualState`, users can compare alternative visual styles without changing the analytical interpretation.

This separation reinforces the distinction between *mapping* and *drawing*.

---

## 7.13 Descriptor Mappings

Mappings define how descriptor values influence visual properties.

They represent the core interaction of Canvas.

Each mapping connects one descriptor to one visual parameter.

For example:

```text
Spectral Centroid
            │
            ▼
        Colour Hue
```

or

```text
RMS
 │
 ▼
Particle Size
```

Mappings express relationships rather than calculations.

They answer the question:

> "Which property of the sound influences which property of the image?"

---

### Mapping Principles

Mappings should be:

- easy to understand;
- visually meaningful;
- immediately observable;
- independent from renderer implementation.

A mapping should describe *intent*, not drawing logic.

For example:

```text
Flux
    ↓
Motion Speed
```

is preferable to

```text
Flux
    ↓
Particle Velocity Vector
```

The renderer decides how motion speed affects individual particles.

The mapping only specifies the conceptual relationship.

---

### Multiple Mappings

Several descriptors may influence the same visualization.

Example:

```text
Centroid
        ┐
        │
        ▼
    Colour

Flux
        │
        ▼
Movement

RMS
        │
        ▼
Scale
```

Likewise, a single descriptor may influence multiple visual properties.

```text
RMS
├── Scale
├── Brightness
└── Opacity
```

This flexibility allows users to construct richer visual interpretations while maintaining a clear conceptual model.

---

## 7.14 Mapping Resolution

Before each frame is rendered, Canvas resolves all active mappings.

The Mapping Resolver converts descriptor values into renderer-independent visual properties.

Conceptually:

```text
Descriptors
        │
        ▼
Mapping Resolver
        │
        ▼
Visual State
```

The Mapping Resolver acts as the bridge between objective measurements and subjective visualization.

It contains no drawing code.

Likewise, the renderer contains no mapping logic.

---

### Resolution Process

For every frame:

1. Retrieve descriptor values.
2. Evaluate active mappings.
3. Compute visual properties.
4. Assemble the `VisualState`.
5. Render the frame.

Because this process occurs every animation frame, modifications made by the user become visible immediately.

No analysis needs to be recomputed.

---

## 7.15 Mapping Editor

The Mapping Editor allows users to modify how descriptors influence the visualization.

It is the primary interaction mechanism within Canvas.

The editor should prioritise clarity over flexibility.

Users should always understand which descriptor controls which visual property.

---

### Editing Behaviour

Changing a mapping should:

- update the visualization immediately;
- preserve playback;
- preserve analysis;
- preserve renderer state whenever possible.

Editing should feel continuous.

Users should be encouraged to experiment while the audio is playing.

---

### Educational Role

The Mapping Editor is more than a configuration panel.

It exposes the relationship between measurable signal properties and visual interpretation.

By observing how different mappings affect the same audio passage, users develop an understanding of both the descriptors themselves and their expressive potential.

The editor therefore serves both an experimental and educational purpose.

---

## 7.16 Active Mapping Summary

The Context Panel should always display a concise summary of the active descriptor mappings.

For example:

```text
Colour
← Spectral Centroid

Size
← RMS

Motion
← Spectral Flux

Opacity
← Spectral Flatness
```

This summary provides users with a quick overview of the current visual interpretation without requiring them to inspect every individual parameter.

It also reinforces the conceptual distinction between descriptors and visual properties.

---

## 7.17 Visual Parameters

Visual parameters configure the renderer independently from descriptor mappings.

Unlike mappings, parameters do not depend on audio analysis.

Examples include:

- particle count;
- line thickness;
- trail length;
- blur amount;
- colour palette;
- background colour;
- decay rate;
- smoothing factor.

These parameters influence presentation only.

Changing them should never modify descriptor values or mapping relationships.

---

### Parameter Scope

Parameters belong to the currently active renderer.

Different renderers may expose different configuration options.

For example, a particle renderer may provide particle density, while a geometric renderer may provide polygon complexity.

This allows renderers to remain specialised without affecting the shared mapping architecture.

---

## 7.18 Renderer Switching

Changing to a visualization that uses a different renderer should be treated as replacing the rendering engine rather than resetting the experiment.

The following state should be preserved:

- playback position;
- playback state;
- analysed audio;
- experiment session.

The following state may change:

- renderer-specific parameters;
- renderer-specific animation state;
- renderer-specific resources.

The renderer should initialize its internal state using the current playback position so that the new visualization immediately reflects the correct moment of the audio.

Transitions should therefore feel continuous rather than restarting the experiment.

## 7.19 Animation Model

Canvas animations are driven by audio playback rather than by an independent simulation clock.

Every rendered frame corresponds to the current playback position within the analysed audio.

Consequently, animation is deterministic.

Given the same:

- playback position;
- analysis result;
- visualization preset;
- mapping configuration;

the visualization should always produce the same frame.

This behaviour allows users to repeatedly inspect the same musical moment while experimenting with different visual mappings.

---

### Continuous Animation

Visual properties should evolve continuously as descriptor values change over time.

Rather than treating every frame as an isolated snapshot, renderers should interpolate naturally between consecutive analysis frames whenever appropriate.

Interpolation improves perceived smoothness without altering the underlying analysis.

The interpolation method is renderer-specific and should not modify descriptor values.

---

### Event-Based Animation

Some descriptors represent events rather than continuously varying quantities.

For example:

- onset strength;
- sudden increases in spectral flux.

These descriptors may trigger discrete visual events such as:

- bursts;
- flashes;
- pulses;
- temporary emphasis.

Such events should remain synchronized with playback and occur consistently whenever the same audio passage is revisited.

---

## 7.20 Playback Synchronization

Canvas shares the global PlaybackController with every other component of the laboratory.

Playback synchronization is therefore inherited rather than implemented independently.

The renderer observes the current playback state and updates its visualization accordingly.

---

### Playing

While playback is active:

- the renderer requests the current playback time;
- resolves the corresponding analysis frame;
- computes the visual state;
- renders the next animation frame.

Rendering should continue only while playback is active.

---

### Paused

When playback is paused:

- the current frame remains visible;
- animation stops advancing;
- no new playback positions are requested.

The visualization should behave as a frozen representation of the current analytical frame.

---

### Seeking

Seeking immediately changes the playback position.

The renderer should:

- discard the previous frame;
- resolve the new analysis frame;
- redraw immediately.

Seeking should never replay intermediate animation frames.

The visualization always reflects the current playback position.

---

### End of Playback

When playback reaches the end of the experiment:

- animation stops;
- the final frame remains visible;
- renderer state remains available until playback restarts or a new experiment begins.

---

## 7.21 Rendering Lifecycle

The renderer follows a predictable lifecycle managed by the Canvas workspace.

```text
Mount
    ↓
Initialize
    ↓
Render Frames
    ↓
Pause / Resume
    ↓
Unmount
```

Each stage has clearly defined responsibilities.

---

### Initialization

When mounted, the renderer should:

- allocate rendering resources;
- initialise renderer-specific state;
- prepare the drawing surface.

Initialization should not perform analysis or modify mappings.

---

### Active Rendering

During playback the renderer repeatedly:

1. requests playback time;
2. resolves descriptor values;
3. computes the visual state;
4. updates animation;
5. renders the frame.

This sequence should remain identical for every visualization.

---

### Cleanup

When the renderer is unmounted it should release any resources that are no longer required.

Examples include:

- animation buffers;
- temporary arrays;
- offscreen canvases;
- cached drawing resources.

Cleanup prevents unnecessary memory consumption when switching between visualizations.

---

## 7.22 Render Invalidation

Canvas should redraw only when necessary.

A new frame should be rendered when:

- playback advances;
- playback seeks;
- playback resumes;
- playback pauses;
- visualization parameters change;
- mappings change;
- presets change;
- renderer size changes.

Redrawing should not occur for unrelated interface updates.

This keeps rendering isolated from the React component lifecycle.

---

## 7.23 Canvas Resizing

The Canvas Stage should adapt to the available workspace while preserving rendering quality.

Whenever the drawing area changes size:

- the canvas resolution should be updated;
- renderer dimensions recalculated;
- the current frame redrawn.

Resizing should not reset playback or renderer configuration.

Where appropriate, renderers should preserve their internal state across resize events.

---

## 7.24 Background and Scene Composition

Each renderer is responsible for composing its complete visual scene.

A typical rendering sequence may include:

1. clear background;
2. update animation state;
3. draw primary elements;
4. draw overlays or effects;
5. present final frame.

The exact drawing strategy is renderer-dependent.

However, every renderer should produce a complete frame during each render pass.

No renderer should assume that previous frames remain available unless that behaviour is intentionally implemented (for example, motion trails).

---

## 7.25 Performance Considerations

Canvas should prioritise smooth interaction over visual complexity.

The application should remain responsive while:

- audio playback continues;
- mappings are edited;
- parameters are adjusted;
- presets are switched.

Performance optimisations should remain implementation details rather than architectural features.

Examples include:

- reusing typed arrays;
- minimising allocations during rendering;
- avoiding unnecessary object creation;
- separating React updates from animation.

These optimisations should improve efficiency without affecting the conceptual architecture.

---

## 7.26 Educational Feedback

Canvas should continuously communicate the relationship between sound and image.

Whenever possible, the interface should explain:

- which descriptor is influencing a visual property;
- why the visualization changes;
- how modifying a mapping alters interpretation.

The educational objective is not simply to present attractive graphics, but to make the transformation from measurable sound to subjective visual representation understandable.

Every interaction within Canvas should reinforce the central idea of Synesthesia:

> The audio analysis remains constant.

> The visual interpretation is entirely determined by the mappings chosen by the user.

## 7.27 Context Panel

The Canvas Context Panel provides all controls required to inspect and modify the current visualization.

Unlike the Microscope Context Panel, which primarily presents analytical information, the Canvas Context Panel supports active experimentation.

Its purpose is to make the transformation from sound to image understandable and editable.

The Context Panel should remain visible throughout the experiment and should not interrupt playback while users adjust visualization settings.

---

### Suggested Organization

The Context Panel should be organised into five logical sections.

```text
Canvas Context Panel
├── Visualization Presets
├── Active Mapping Summary
├── Mapping Editor
├── Visual Parameters
└── Educational Explanation
```

This organisation mirrors the user's reasoning process:

1. choose a visualization;
2. understand the current mappings;
3. modify relationships;
4. adjust appearance;
5. understand the resulting behaviour.

---

## 7.28 Responsive Behaviour

Canvas should remain functional across different screen sizes while prioritising the visualization itself.

The visualization should always receive the largest available area.

The Context Panel should adapt according to available horizontal space.

Possible behaviours include:

- fixed side panel on large screens;
- collapsible panel on medium screens;
- stacked layout on narrow screens.

Regardless of layout changes, playback controls should remain accessible at all times.

Changing the layout must never interrupt playback or reset the visualization.

---

## 7.29 Accessibility

Canvas is primarily a visual environment, but it should remain understandable for users with varying levels of experience.

Accessibility should focus on clarity rather than exhaustive compliance.

Recommended considerations include:

- descriptive labels for controls;
- keyboard accessibility where practical;
- sufficient interface contrast;
- readable parameter names;
- consistent terminology across the application.

Educational explanations should avoid unnecessary technical jargon whenever simpler language communicates the same idea.

---

### Colour Independence

Visual meaning should not rely exclusively on colour.

Whenever possible, changes should also be communicated through:

- size;
- motion;
- position;
- opacity;
- density;
- shape.

This allows different mappings to remain distinguishable even when colour perception varies.

---

## 7.30 Error Handling

Canvas should fail gracefully whenever rendering cannot continue.

Typical situations include:

- unsupported renderer configuration;
- invalid mapping values;
- unavailable analysis data;
- unexpected rendering exceptions.

Whenever possible:

- playback should continue;
- the application should remain responsive;
- users should receive a clear explanation;
- recovery should not require restarting the experiment.

A rendering error should never invalidate the analysed audio.

---

## 7.31 Suggested Interfaces

The following interfaces illustrate the intended separation between mappings, visual state and rendering.

These interfaces describe architectural responsibilities rather than implementation requirements.

```ts
interface DescriptorMapping {
    descriptor: DescriptorId;

    property: VisualProperty;

    enabled: boolean;
}
```

```ts
interface VisualState {
    colour: Colour;

    scale: number;

    opacity: number;

    motion: number;

    emphasis: number;
}
```

```ts
interface Renderer {

    initialize(): void;

    render(state: VisualState): void;

    resize(width: number, height: number): void;

    dispose(): void;
}
```

Concrete implementations may evolve during development provided that the architectural responsibilities remain unchanged.

---

## 7.32 Suggested Folder Structure

One possible organisation is:

```text
canvas/
│
├── CanvasWorkspace.tsx
├── CanvasStage.tsx
├── CanvasContext.tsx
│
├── mappings/
│   ├── mappingResolver.ts
│   ├── defaultMappings.ts
│   └── mappingTypes.ts
│
├── presets/
│   ├── presets.ts
│   └── presetTypes.ts
│
├── renderers/
│   ├── ParticleRenderer.ts
│   ├── GeometryRenderer.ts
│   ├── LineRenderer.ts
│   └── RendererTypes.ts
│
├── controls/
│   ├── MappingEditor.tsx
│   ├── ParameterControls.tsx
│   └── PresetSelector.tsx
│
└── types/
```

This structure separates:

- user interface;
- mapping logic;
- rendering logic;
- renderer implementations;
- shared types.

The exact folder names may evolve during implementation.

---

## 7.33 State Persistence

Switching between Microscope and Canvas should preserve:

- playback position;
- playback state;
- analysed audio;
- selected experiment.

Canvas should additionally preserve:

- current preset;
- active mappings;
- visual parameters.

This allows users to compare objective analysis and subjective visualization without losing their current experiment.

Renderer-specific animation state does not need to persist if doing so introduces unnecessary implementation complexity.

---

## 7.34 Performance Validation

Canvas should remain responsive during normal interaction.

Successful behaviour includes:

- smooth playback;
- responsive mapping edits;
- immediate preset switching;
- consistent synchronization with playback.

Performance should be evaluated primarily from the user's perspective rather than through strict numerical targets.

The implementation should favour predictable behaviour and maintainable code over aggressive optimisation.

---

## 7.35 Acceptance Criteria

Canvas is considered complete when it satisfies the following criteria.

### Core Acceptance Criteria

- Canvas renders a visualization from the analysed audio.
- Playback remains synchronized with the shared PlaybackController.
- Visualization updates continuously during playback.
- Descriptor mappings influence visual properties.
- Mappings can be modified interactively.
- Presets provide alternative visual interpretations.
- Changing mappings never recomputes analysis.
- Changing presets never interrupts playback.
- The Context Panel exposes the active visualization configuration.
- Canvas and Microscope remain synchronized throughout the experiment.

### Extended Acceptance Criteria

Where development time permits, the implementation should also provide:

- renderer-specific parameter controls;
- educational mapping explanations;
- graceful rendering recovery;
- responsive layout adaptations;
- efficient rendering with minimal unnecessary redraws.

These enhancements improve usability and robustness but are not essential to the central research contribution of Synesthesia.

---

## 7.36 Architectural Rule

Canvas exists to transform immutable analytical information into editable visual interpretations.

Accordingly:

- analysis remains objective;
- mappings remain subjective;
- renderers remain independent of DSP;
- playback remains the single source of temporal truth.

Every visualization should therefore be understood as an interpretation of the same analytical reality rather than as a different analysis of the audio.

This distinction defines the architectural identity of Canvas and represents the central research contribution of Synesthesia.

---

## 8. Canvas Mode

# 8. Analysis Pipeline

## 8.1 Overview

The Analysis Pipeline is responsible for transforming decoded audio into an immutable collection of descriptors that can be reused throughout the application.

Its purpose is to perform all computationally intensive Digital Signal Processing (DSP) operations once, immediately after an audio file has been decoded.

The resulting analysis becomes the shared source of truth for every visualization and interaction within the laboratory.

No component should recompute descriptors during playback.

This approach ensures:

- deterministic analysis;
- consistent results across representations;
- efficient rendering;
- clear separation between analysis and visualization.

---

## 8.2 Purpose

The Analysis Pipeline converts raw audio into measurable information.

Its responsibilities include:

- reading decoded audio samples;
- computing time-domain descriptors;
- computing frequency-domain descriptors;
- organizing results into immutable structures;
- exposing analysis results to the rest of the application.

The pipeline does not:

- perform visualization;
- manage playback;
- interpret descriptor values;
- apply visual mappings.

Analysis ends once the immutable `AnalysisResult` has been produced.

---

## 8.3 Architectural Position

The Analysis Pipeline forms the bridge between audio decoding and visualization.

```text
Audio File
        ↓
Audio Decoding
        ↓
Analysis Pipeline
        ↓
AnalysisResult
       ↙      ↘
Microscope   Canvas
```

Every laboratory mode consumes exactly the same analysis.

Neither mode performs additional DSP.

This guarantees that all visual representations describe the same underlying audio.

---

## 8.4 Core Principle

The analysis is performed exactly once.

Once computed, descriptor values never change.

Every subsequent operation within Synesthesia operates on immutable analytical data.

This provides several important benefits.

### Consistency

Every representation observes identical descriptor values.

Changing visualization settings cannot change the analysis.

---

### Performance

DSP calculations are isolated from rendering.

Playback requires only descriptor lookup rather than repeated signal processing.

---

### Reproducibility

Given the same:

- audio file;
- analysis parameters;

the generated `AnalysisResult` should always be identical.

This deterministic behaviour supports both debugging and educational use.

---

## 8.5 Pipeline Stages

The Analysis Pipeline consists of a sequence of independent stages.

```text
Decoded Audio
        ↓
Frame Segmentation
        ↓
Window Function
        ↓
FFT
        ↓
Descriptor Computation
        ↓
AnalysisResult
```

Each stage has a single responsibility.

---

### Frame Segmentation

The decoded audio buffer is divided into overlapping analysis frames.

Each frame represents a short temporal window of the original signal.

Frame segmentation establishes the temporal resolution of every descriptor.

---

### Window Function

Before spectral analysis, a window function is applied to each frame.

Windowing reduces spectral leakage and improves the stability of frequency-domain measurements.

The selected window should remain consistent throughout the experiment.

---

### FFT

Each windowed frame is transformed into the frequency domain using a Fast Fourier Transform.

The FFT is computed once per analysis frame.

Every spectral descriptor should reuse this shared FFT result.

No descriptor should perform an independent FFT calculation.

This principle is fundamental to the efficiency of the analysis pipeline.

---

### Descriptor Computation

Descriptors are computed from either:

- the original time-domain frame;
- the shared FFT result.

Each descriptor represents one measurable property of the audio signal.

The pipeline computes descriptors independently before assembling them into a shared result.

---

### Analysis Result

After every frame has been processed, descriptor values are assembled into a single immutable structure.

This structure becomes the only analytical input used by Microscope and Canvas.

No additional DSP should occur after this stage.

## 8.6 Frame Configuration

The temporal resolution of the analysis is determined by the analysis frame configuration.

Each analysis frame represents a short portion of the decoded audio signal from which descriptors are computed.

The selected frame size and hop size should remain constant throughout a single analysis.

Using a fixed configuration ensures that all descriptors share the same temporal reference.

Every descriptor computed for a given frame therefore corresponds to the same instant in time.

---

### Analysis Frames

Each analysis frame contains:

- a fixed number of audio samples;
- a corresponding timestamp;
- the descriptors computed for that interval.

Conceptually:

```text
Audio Signal

|------ Frame 0 ------|
        |------ Frame 1 ------|
                |------ Frame 2 ------|
```

Overlapping frames improve temporal continuity without affecting the immutability of the resulting analysis.

---

### Time Reference

Each frame should be associated with a timestamp representing its position within the analysed audio.

Playback synchronization is achieved by selecting the analysis frame corresponding to the current playback position.

Neither Canvas nor Microscope should estimate descriptor values independently.

Both retrieve the descriptor values associated with the active frame.

---

## 8.7 Descriptor Categories

Descriptors are grouped according to the type of information they measure.

This grouping is conceptual rather than structural.

It helps distinguish between measurements originating from different stages of the DSP pipeline.

---

### Time-Domain Descriptors

Time-domain descriptors are computed directly from the windowed audio samples.

Current descriptors include:

- Root Mean Square (RMS)

Additional descriptors may be incorporated in future versions provided they operate directly on the time-domain signal.

---

### Frequency-Domain Descriptors

Frequency-domain descriptors are derived from the shared FFT.

Current descriptors include:

- Spectral Centroid
- Spectral Spread
- Spectral Flatness
- Spectral Flux
- Onset Strength
- Mel-band energies

All frequency-domain descriptors reuse the same FFT result.

No descriptor should trigger an additional spectral transform.

---

## 8.8 Descriptor Independence

Each descriptor measures a distinct property of the signal.

Descriptors should be computed independently whenever possible.

For example:

- RMS measures signal energy.
- Spectral Centroid estimates spectral balance.
- Spectral Spread measures spectral dispersion.
- Flatness estimates spectral noisiness.
- Flux measures spectral change.
- Onset Strength estimates transient activity.

Although descriptors may be derived from shared intermediate data, their semantic meaning remains independent.

Visualization mappings should therefore treat descriptors as separate analytical quantities.

---

## 8.9 Shared FFT Principle

The Fast Fourier Transform is the most computationally expensive stage of the analysis pipeline.

To maximise efficiency, every spectral descriptor should reuse the same FFT result.

Conceptually:

```text
Windowed Frame
        │
        ▼
       FFT
 ┌──────┼───────────────┐
 │      │       │       │
 ▼      ▼       ▼       ▼
Centroid Spread Flatness Flux
                │
                ▼
          Mel Energies
```

This architecture avoids redundant computation and guarantees that all frequency-domain descriptors originate from the same spectral representation.

The FFT therefore acts as a shared analytical foundation rather than as a descriptor itself.

---

## 8.10 AnalysisResult

The output of the Analysis Pipeline is the immutable `AnalysisResult`.

This structure aggregates every descriptor computed during analysis together with the metadata required to interpret those values.

Conceptually:

```text
AnalysisResult
├── Metadata
├── Frame Timeline
├── RMS
├── Spectral Centroid
├── Spectral Spread
├── Spectral Flatness
├── Spectral Flux
├── Onset Strength
└── Mel Energies
```

Once created, the `AnalysisResult` remains unchanged for the lifetime of the experiment.

Any component requiring analytical information reads from this shared structure.

No component modifies it.

---

## 8.11 Timeline Consistency

Every descriptor stored within the `AnalysisResult` shares the same temporal indexing.

For frame *n*:

- RMS[n]
- Centroid[n]
- Spread[n]
- Flatness[n]
- Flux[n]
- OnsetStrength[n]
- MelEnergies[n]

all describe the same analysis interval.

This alignment allows visualizations to combine descriptors without performing additional synchronization.

Temporal consistency is therefore guaranteed by construction rather than by runtime logic.

---

## 8.12 Immutability

The `AnalysisResult` is immutable.

After analysis completes:

- descriptor arrays are never modified;
- frame count remains constant;
- timestamps remain constant;
- metadata remains constant.

Subsequent application behaviour depends exclusively on reading analytical information.

If a different analysis configuration is required, the entire pipeline should be executed again to produce a new `AnalysisResult`.

This approach simplifies reasoning about application state and prevents inconsistencies between different representations.

---

## 8.13 Consumers

The `AnalysisResult` is shared across the application.

Primary consumers include:

```text
AnalysisResult
      │
 ┌────┴──────────┐
 ▼               ▼
Microscope    Canvas
```

Additional consumers may be introduced in future versions, including:

- statistical summaries;
- export functionality;
- comparison tools;
- educational modules.

Because the analysis is immutable and independent of presentation, new consumers can be added without modifying the DSP pipeline.

---

## 8.14 Architectural Consequences

The Analysis Pipeline establishes several key architectural properties.

**Single computation**

Every descriptor is computed once.

---

**Shared analytical foundation**

All representations observe the same immutable dataset.

---

**Separation of concerns**

Analysis, playback, and visualization remain independent systems connected only through well-defined interfaces.

---

**Deterministic behaviour**

Given identical audio and identical analysis parameters, the resulting `AnalysisResult` is always identical.

This determinism underpins the scientific and educational objectives of Synesthesia by ensuring that every visual interpretation originates from the same objective analytical foundation.

## 8.15 Descriptor Definitions

Each descriptor included in the Analysis Pipeline represents one measurable property of the analysed audio signal.

Descriptors are computed independently but share the same temporal indexing.

Together, they provide complementary perspectives on the behaviour of the signal over time.

---

### Root Mean Square (RMS)

RMS estimates the short-term energy of the audio signal.

Higher values generally correspond to louder or more energetic regions.

RMS is computed directly from the time-domain signal.

Typical applications include:

- loudness visualization;
- emphasis detection;
- animation scaling;
- energy monitoring.

---

### Spectral Centroid

The Spectral Centroid estimates the balance of spectral energy across frequencies.

Signals dominated by higher frequencies generally produce larger centroid values.

The centroid is often interpreted perceptually as a measure of spectral brightness.

Typical applications include:

- colour mapping;
- brightness visualization;
- timbral comparison.

---

### Spectral Spread

Spectral Spread measures how widely spectral energy is distributed around the centroid.

Compact spectra produce smaller spread values.

Broad spectra produce larger spread values.

Typical applications include:

- visual complexity;
- spatial dispersion;
- geometric expansion.

---

### Spectral Flatness

Spectral Flatness estimates how noise-like or tone-like a spectrum is.

Lower values indicate concentrated harmonic energy.

Higher values indicate a flatter spectrum with more evenly distributed energy.

Typical applications include:

- opacity;
- texture variation;
- surface roughness.

---

### Spectral Flux

Spectral Flux measures the amount of spectral change between consecutive analysis frames.

Rapid spectral changes produce larger flux values.

Stable signals produce smaller values.

Typical applications include:

- movement speed;
- animation intensity;
- transition emphasis.

---

### Onset Strength

Onset Strength estimates the likelihood of transient events.

Large values frequently correspond to note attacks, percussion hits or other sudden changes.

Typical applications include:

- pulses;
- flashes;
- particle bursts;
- event triggering.

---

### Mel-band Energies

Mel-band energies represent spectral energy distributed across perceptually motivated frequency bands.

Unlike scalar descriptors, mel energies form a vector for each analysis frame.

These values preserve coarse spectral structure while reducing dimensionality.

Typical applications include:

- bar visualizations;
- radial layouts;
- spatial distributions;
- frequency-dependent animation.

---

## 8.16 Scalar and Vector Descriptors

Descriptors fall into two structural categories.

### Scalar Descriptors

Scalar descriptors produce one value per analysis frame.

Current scalar descriptors include:

- RMS
- Spectral Centroid
- Spectral Spread
- Spectral Flatness
- Spectral Flux
- Onset Strength

Scalar descriptors are typically mapped directly to individual visual properties.

---

### Vector Descriptors

Vector descriptors produce multiple values for each analysis frame.

Currently:

- Mel-band energies

Each mel band represents the energy contained within a perceptual frequency region.

Vector descriptors are particularly suitable for visualizations that require multiple simultaneous visual elements.

---

## 8.17 Descriptor Normalization

The Analysis Pipeline computes descriptor values using their natural numerical scales.

Normalization is not considered part of the analysis itself.

Instead, normalization occurs during visualization whenever required.

This distinction preserves the integrity of the original measurements while allowing different visualizations to interpret descriptor ranges according to their own requirements.

Conceptually:

```text
Descriptor
        │
        ▼
Raw Value
        │
        ▼
Visualization Mapping
        │
        ▼
Normalized Visual Property
```

Keeping normalization outside the analysis pipeline allows different visualizations to apply different scaling strategies without modifying the underlying analytical data.

---

## 8.18 Analysis Metadata

In addition to descriptor values, the `AnalysisResult` should contain metadata describing how the analysis was produced.

Typical metadata includes:

- sample rate;
- frame size;
- hop size;
- analysis duration;
- frame count;
- window function;
- FFT size;
- mel-band count.

Metadata allows consumers to interpret descriptor arrays correctly without requiring knowledge of the analysis implementation.

---

## 8.19 Descriptor Extensibility

The architecture should support the addition of new descriptors without requiring changes to existing visualization systems.

Adding a descriptor should involve:

1. computing the descriptor within the pipeline;
2. storing the results in the `AnalysisResult`;
3. exposing the descriptor to the mapping system.

Existing renderers should continue functioning without modification.

Only visualizations that explicitly use the new descriptor need to be updated.

This extensibility follows the principle that analytical capabilities may evolve independently from visual representations.

---

## 8.20 Acceptance Criteria

The Analysis Pipeline is considered complete when it satisfies the following criteria.

### Core Acceptance Criteria

- Audio is analysed once after decoding.
- Every analysis frame shares the same temporal indexing.
- The FFT is computed once per frame.
- All spectral descriptors reuse the shared FFT.
- Time-domain descriptors are computed independently from spectral descriptors.
- Descriptor values are stored in an immutable `AnalysisResult`.
- Playback never triggers additional DSP computation.
- Microscope and Canvas consume the same analytical data.

### Extended Acceptance Criteria

Where development time permits, the implementation should also provide:

- configurable analysis parameters;
- additional descriptors;
- analysis progress reporting;
- descriptor validation utilities;
- exportable analysis metadata.

These extensions improve flexibility but are not required for the core educational objectives of Synesthesia.

---

## 8.21 Architectural Rule

The Analysis Pipeline exists to measure the audio signal objectively.

Accordingly:

- descriptors describe measurable properties of the signal;
- descriptor values remain immutable after analysis;
- every representation consumes the same analytical dataset;
- visualization never alters analysis.

The Analysis Pipeline therefore defines the objective foundation upon which every subsequent visual interpretation is constructed.

---

## 9. Experiment Wrap-Up

# 9. Data Model

## 9.1 Overview

The data model defines how analytical information, playback state and visualization configuration are represented within Synesthesia.

Its purpose is to provide a clear separation between:

- immutable analytical data;
- mutable application state;
- visualization configuration;
- transient rendering state.

This separation reflects the overall architecture of the application and reinforces the distinction between objective analysis and subjective interpretation.

---

## 9.2 Design Principles

The data model follows four guiding principles.

### Immutability

Analytical information never changes after analysis has completed.

Immutable structures simplify reasoning, improve consistency and prevent synchronization errors between different representations.

---

### Single Ownership

Every piece of mutable state has exactly one owner.

Components may observe shared state, but they should not duplicate ownership.

---

### Separation of Concerns

Different categories of information are stored independently.

For example:

- analysis data should not contain visualization settings;
- playback state should not contain analytical descriptors;
- renderer state should not contain playback information.

Each structure exists for a single purpose.

---

### Shared Consumption

Whenever multiple components require the same information, they should reference a shared data structure rather than maintaining independent copies.

This minimizes duplication and guarantees consistency throughout the application.

---

## 9.3 Data Categories

Application data is organised into four conceptual groups.

```text
Application Data
│
├── Analysis Data
├── Playback State
├── Visualization State
└── UI State
```

Each category evolves independently while communicating through well-defined interfaces.

---

## 9.4 Analysis Data

Analysis data represents the immutable result of the DSP pipeline.

Its primary structure is the `AnalysisResult`.

Conceptually:

```text
AnalysisResult
├── Metadata
├── Timeline
├── Descriptors
└── Mel Energies
```

Analysis data is shared across the entire application.

No component modifies it after analysis has completed.

---

## 9.5 Playback State

Playback state represents the current status of audio reproduction.

Typical information includes:

- playback position;
- playback status;
- duration;
- volume;
- mute state.

Playback state is owned exclusively by the `PlaybackController`.

Every visualization observes this shared state.

---

## 9.6 Visualization State

Visualization state describes how analytical information should be interpreted visually.

Typical information includes:

- active preset;
- descriptor mappings;
- visual parameters;
- selected renderer.

Unlike analysis, visualization state is expected to change frequently as users experiment with different representations.

---

## 9.7 UI State

UI state contains temporary interface information that does not affect playback or analysis.

Examples include:

- expanded panels;
- selected controls;
- open menus;
- active tabs;
- temporary selections.

UI state exists solely to support interaction.

It should never influence descriptor computation or playback timing.

---

## 9.8 State Relationships

The relationships between the major data structures can be summarised as follows.

```text
AnalysisResult
        │
        ▼
Visualization State
        │
        ▼
Renderer

Playback State
        │
        ▼
Current Analysis Frame
```

Playback determines *which* analytical frame is observed.

Visualization determines *how* that frame is interpreted.

The renderer determines *how* it is drawn.

These responsibilities remain independent.

---

## 9.9 AnalysisResult Structure

The `AnalysisResult` should contain all information required to reproduce every analysis-based representation.

Conceptually:

```ts
interface AnalysisResult {

    metadata: AnalysisMetadata;

    timeline: Timeline;

    descriptors: DescriptorCollection;

    melEnergies: Float32Array[];
}
```

This interface illustrates the architectural organisation rather than prescribing a fixed implementation.

Concrete structures may evolve as development progresses.

---

## 9.10 Descriptor Collection

Scalar descriptors may be grouped together for clarity.

One possible organisation is:

```ts
interface DescriptorCollection {

    rms: Float32Array;

    centroid: Float32Array;

    spread: Float32Array;

    flatness: Float32Array;

    flux: Float32Array;

    onsetStrength: Float32Array;
}
```

Each array contains one value for every analysis frame.

All arrays therefore share identical indexing.

---

## 9.11 Timeline

The timeline associates analysis frames with playback time.

Conceptually:

```ts
interface Timeline {

    timestamps: Float32Array;
}
```

Each timestamp identifies the temporal position of one analysis frame.

Playback synchronization is achieved by selecting the frame corresponding to the current playback position.

The timeline therefore provides the bridge between audio playback and immutable analysis.

---

## 9.12 Metadata

Metadata describes the conditions under which the analysis was produced.

Possible fields include:

```ts
interface AnalysisMetadata {

    sampleRate: number;

    frameSize: number;

    hopSize: number;

    fftSize: number;

    frameCount: number;

    duration: number;

    melBandCount: number;
}
```

Metadata is immutable and shared alongside the descriptor data.

Consumers should use metadata when interpreting descriptor values rather than relying on hardcoded assumptions.

---

## 9.13 Architectural Consequences

This data model provides several architectural advantages.

**Immutable analysis**

Analytical information remains stable throughout the experiment.

---

**Shared playback**

Every visualization follows the same playback timeline.

---

**Independent visualization**

Visual interpretation evolves without modifying analysis.

---

**Simple reasoning**

Each category of application data has a single responsibility and a single owner, reducing coupling between components and making the application easier to understand and maintain.

## 9.14 Playback State

Playback state represents the current status of the audio engine.

Unlike the `AnalysisResult`, playback state changes continuously during user interaction.

Playback state is owned exclusively by the `PlaybackController`.

Every component requiring playback information observes this shared state rather than maintaining its own copy.

Conceptually:

```ts
interface PlaybackState {

    currentTime: number;

    duration: number;

    isPlaying: boolean;

    volume: number;

    muted: boolean;
}
```

The exact implementation may differ, but ownership should remain centralized.

---

## 9.15 Visualization State

Visualization state describes how the immutable analysis should be interpreted visually.

Unlike analytical data, visualization state is expected to change frequently.

Typical information includes:

```ts
interface VisualizationState {

    preset: VisualizationPreset;

    mappings: DescriptorMapping[];

    parameters: VisualizationParameters;
}
```

Changing visualization state never modifies the underlying analysis.

Instead, it changes how descriptor values are transformed into visual properties.

---

## 9.16 Renderer State

Renderer state contains temporary information required only while rendering.

Unlike visualization state, renderer state is implementation-specific and generally not meaningful outside the renderer itself.

Examples include:

- particle positions;
- interpolation buffers;
- animation accumulators;
- temporary geometry;
- cached drawing resources.

Renderer state should remain private to the active renderer.

Other application components should neither access nor modify it.

---

## 9.17 UI State

User interface state stores transient interaction information.

Typical examples include:

- selected preset;
- expanded sections;
- selected mapping;
- focused controls;
- temporary editing values.

UI state exists solely to support interaction.

It should never influence:

- descriptor computation;
- playback timing;
- analysis results.

This separation allows interface behaviour to evolve independently from the analytical architecture.

---

## 9.18 State Ownership

Every mutable structure has a single owner.

The ownership model can be summarised as follows.

| State | Owner |
|--------|-------|
| AnalysisResult | Analysis Pipeline |
| PlaybackState | PlaybackController |
| VisualizationState | Canvas Workspace |
| RendererState | Active Renderer |
| UI State | React Components |

Consumers observe shared state through clearly defined interfaces.

Ownership should never be duplicated.

---

## 9.19 Data Flow

Information flows through the application in one direction.

```text
Decoded Audio
        │
        ▼
Analysis Pipeline
        │
        ▼
AnalysisResult
        │
 ┌──────┴────────┐
 ▼               ▼
Microscope    Canvas
                    │
                    ▼
             Visual State
                    │
                    ▼
               Renderer
```

Playback influences which analysis frame is observed, but it never modifies analytical data.

Visualization influences interpretation, but it never modifies descriptors.

This unidirectional flow simplifies reasoning and debugging.

---

## 9.20 Mutable vs Immutable Data

The application distinguishes clearly between immutable and mutable information.

### Immutable

- AnalysisResult
- Descriptor arrays
- Timeline
- Metadata

These structures are created once and never modified.

---

### Mutable

- Playback state
- Visualization state
- Renderer state
- UI state

These structures evolve throughout user interaction.

Separating immutable and mutable data reduces unintended side effects and simplifies state management.

---

## 9.21 Lifetime

Different categories of data exist for different durations.

```text
Application
│
├── AnalysisResult
│      Entire experiment
│
├── Playback State
│      During playback
│
├── Visualization State
│      While Canvas is active
│
└── Renderer State
       While a renderer is mounted
```

Understanding these lifetimes helps determine where each structure should be created and destroyed.

---

## 9.22 Serialization

Only persistent application data should be considered for serialization.

Suitable candidates include:

- analysis metadata;
- descriptor values;
- visualization presets;
- descriptor mappings.

Transient structures such as renderer state or playback state should not be serialized because they represent temporary runtime behaviour rather than experiment configuration.

---

## 9.23 Extensibility

The data model should support future extensions without requiring structural redesign.

Examples include:

- additional descriptors;
- new visualization presets;
- renderer-specific configuration;
- experiment annotations;
- comparison sessions.

New data should be incorporated into the existing ownership model rather than introducing parallel state structures.

---

## 9.24 Acceptance Criteria

The Data Model is considered complete when it satisfies the following criteria.

### Core Acceptance Criteria

- Analytical data is immutable.
- Mutable state has a single owner.
- Playback state is independent from visualization state.
- Visualization state is independent from analysis.
- Renderer state remains private to the renderer.
- Components consume shared state rather than duplicating it.
- Information flows unidirectionally through the application.

### Extended Acceptance Criteria

Where development time permits, the implementation should also provide:

- serialization support for reusable visualization presets;
- validation of data structures during development;
- clear TypeScript interfaces for all shared models;
- runtime consistency checks for critical state transitions.

These extensions improve maintainability but are not required for the core architecture.

---

## 9.25 Architectural Rule

The Data Model exists to organise information according to responsibility rather than implementation convenience.

Accordingly:

- immutable data represents objective analysis;
- mutable data represents user interaction;
- visualization configuration represents interpretation;
- renderer state represents implementation details.

Every structure should therefore have a single purpose, a single owner and a clearly defined lifetime.

This organisation supports the broader architectural goal of Synesthesia: maintaining a clear separation between objective signal analysis and subjective visual representation.

---

## 10. Experiment Reset

# 10. Application Flow

## 10.1 Overview

The Application Flow describes how information moves through Synesthesia from the moment an audio file is loaded until it is visualized.

Rather than focusing on individual components, this section describes the overall execution sequence of the application.

The objective is to demonstrate how independent subsystems cooperate while maintaining clear separation of responsibilities.

---

## 10.2 Design Principles

The application flow follows four guiding principles.

### Sequential Processing

Each stage completes its responsibility before passing information to the next stage.

The application therefore progresses through a predictable sequence of transformations.

---

### Single Responsibility

Each subsystem performs one clearly defined task.

Examples include:

- decoding audio;
- analysing the signal;
- controlling playback;
- rendering visualizations.

Responsibilities should never overlap.

---

### Immutable Analysis

Once analysis has completed, analytical data becomes read-only.

Subsequent stages consume the analysis but never modify it.

---

### Shared State

Whenever information must be accessed by multiple subsystems, it is exposed through shared immutable structures or single-owner controllers rather than duplicated.

---

## 10.3 High-Level Flow

The complete application flow can be summarised as follows.

```text
Audio File
        ↓
Audio Decoding
        ↓
Analysis Pipeline
        ↓
AnalysisResult
        ↓
Laboratory Shell
      ↙         ↘
Microscope    Canvas
```

Each stage produces the information required by the following stage.

---

## 10.4 Experiment Lifecycle

An experiment progresses through a series of well-defined phases.

```text
Idle
    ↓
Audio Loaded
    ↓
Analysis
    ↓
Laboratory Ready
    ↓
Playback
    ↓
Experiment Complete
```

The application should always occupy exactly one phase at any given time.

---

## 10.5 Audio Loading

When the user selects an audio file:

1. the file is validated;
2. the file is decoded;
3. the decoded audio buffer is created;
4. playback resources are prepared.

At this stage no descriptor computation has yet occurred.

The decoded audio becomes the input to the Analysis Pipeline.

---

## 10.6 Analysis Phase

Immediately after decoding, the Analysis Pipeline processes the entire audio buffer.

This phase performs all descriptor computation required by the application.

Upon completion:

- the immutable `AnalysisResult` is created;
- playback can begin;
- laboratory modes become available.

Analysis should occur only once for each loaded audio file.

---

## 10.7 Laboratory Initialization

Once analysis has completed, the Laboratory Shell initializes its shared components.

Initialization includes:

- creating the `PlaybackController`;
- providing the `AnalysisResult`;
- selecting the default laboratory mode;
- loading the default visualization preset.

The laboratory is then ready for interaction.

---

## 10.8 Playback Loop

During playback, the application repeatedly performs the following sequence.

```text
Playback Time
        ↓
Current Analysis Frame
        ↓
Descriptor Retrieval
        ↓
Representation Update
        ↓
Rendered Frame
```

Neither Microscope nor Canvas performs DSP during playback.

They only retrieve descriptor values corresponding to the current playback position.

---

## 10.9 Mode Switching

Users may switch between Microscope and Canvas at any time.

Switching modes should:

- preserve playback position;
- preserve playback state;
- preserve analysis;
- preserve experiment configuration.

Only the active workspace changes.

Because both modes consume the same `AnalysisResult`, switching does not require additional computation.

---

## 10.10 Continuous Interaction

While playback continues, users may interact with the application by:

- seeking;
- pausing;
- changing representations;
- selecting presets;
- modifying mappings;
- adjusting visualization parameters.

These interactions affect playback or visualization only.

They never invalidate or recompute the analysis.

---

## 10.11 Completion

When playback reaches the end of the audio:

- playback stops;
- the final analysis frame remains available;
- the current representation remains visible;
- experiment state is preserved.

Users may immediately replay the experiment without repeating the analysis phase.

---

## 10.12 Architectural Consequences

The Application Flow establishes several important properties.

**Single analysis pass**

Every audio file is analysed exactly once.

---

**Shared analytical foundation**

All laboratory modes consume the same immutable dataset.

---

**Independent representations**

Microscope and Canvas operate independently while remaining synchronized through shared playback and analysis.

---

**Deterministic behaviour**

Given identical input audio and identical user interactions, the application always follows the same execution sequence.

This predictable flow reinforces the architectural separation between decoding, analysis, playback and visualization while supporting the educational objectives of Synesthesia.

## 10.13 State Transitions

The application progresses through a finite number of well-defined states.

Conceptually:

```text
Idle
 │
 ▼
Loading
 │
 ▼
Analysing
 │
 ▼
Ready
 │
 ▼
Playing
 │
 ├────────► Paused
 │              │
 │              ▼
 └──────────────┘
 │
 ▼
Finished
```

Each state has clearly defined entry and exit conditions.

This prevents ambiguous application behaviour and simplifies reasoning about the overall execution flow.

---

## 10.14 User Actions

User interaction modifies only the parts of the application directly related to the requested action.

Typical actions include:

| User Action | Affected System |
|-------------|-----------------|
| Load audio | Audio Loader + Analysis Pipeline |
| Play | PlaybackController |
| Pause | PlaybackController |
| Seek | PlaybackController |
| Switch mode | Laboratory Shell |
| Select representation | Microscope |
| Select preset | Canvas |
| Edit mapping | Canvas |
| Modify parameters | Canvas |

Each action has a clearly defined owner.

No action should unexpectedly modify unrelated application state.

---

## 10.15 Playback-Driven Updates

Playback acts as the application's temporal driver.

Whenever playback advances:

1. the current playback time is updated;
2. the corresponding analysis frame is selected;
3. active representations retrieve descriptor values;
4. the interface is redrawn if necessary.

Conceptually:

```text
PlaybackController
        │
        ▼
Current Time
        │
        ▼
AnalysisResult
        │
   ┌────┴────┐
   ▼         ▼
Microscope Canvas
```

Playback therefore determines *when* information is displayed.

Representations determine *how* it is displayed.

---

## 10.16 Representation Updates

Representations remain passive observers of shared state.

Neither Microscope nor Canvas requests new analysis.

Instead, they respond to:

- playback changes;
- user interaction;
- configuration changes.

Whenever a representation requires new information, it queries the immutable `AnalysisResult` using the current playback position.

---

## 10.17 Visualization Updates

Canvas introduces an additional interpretation stage.

The visualization flow becomes:

```text
Playback Time
        │
        ▼
Analysis Frame
        │
        ▼
Descriptor Values
        │
        ▼
Mappings
        │
        ▼
Visual State
        │
        ▼
Renderer
```

Only the mapping and rendering stages are affected when users modify visualization settings.

The descriptor values remain unchanged.

---

## 10.18 Data Dependencies

Each subsystem depends only on the information it requires.

```text
Audio Decoder
        │
        ▼
Analysis Pipeline
        │
        ▼
AnalysisResult
        │
 ┌──────┴─────────┐
 ▼                ▼
Playback      Representations
```

This dependency structure prevents circular relationships between components.

The direction of information flow remains consistent throughout the application.

---

## 10.19 Error Recovery

Errors occurring during one stage should not unnecessarily invalidate completed stages.

For example:

- a rendering error should not invalidate analysis;
- a visualization error should not stop playback;
- a playback interruption should not require recomputing descriptors.

Whenever possible, completed work should be preserved.

This minimizes disruption and improves the robustness of the application.

---

## 10.20 Restarting an Experiment

Restarting playback should reuse the existing experiment.

The application should preserve:

- decoded audio;
- analysis results;
- visualization configuration;
- laboratory state.

Only the playback position returns to the beginning of the timeline.

Analysis should not be repeated unless a different audio file is loaded.

---

## 10.21 Loading a New Audio File

Loading a different audio file begins a new experiment.

The following sequence occurs:

1. stop playback;
2. release playback resources;
3. decode the new audio;
4. execute the Analysis Pipeline;
5. create a new `AnalysisResult`;
6. initialize the laboratory.

The previous analysis is discarded because it no longer corresponds to the current audio.

---

## 10.22 Extensibility

The application flow should support future additions without modifying the existing execution sequence.

Possible extensions include:

- additional laboratory modes;
- new descriptor types;
- alternative visualization systems;
- experiment comparison tools;
- export functionality.

New features should consume existing application state rather than introducing alternative execution paths.

---

## 10.23 Acceptance Criteria

The Application Flow is considered complete when it satisfies the following criteria.

### Core Acceptance Criteria

- Audio is decoded before analysis.
- Analysis occurs exactly once per experiment.
- The `AnalysisResult` is created before playback begins.
- Playback drives all temporal updates.
- Microscope and Canvas consume the same analysis.
- Switching modes preserves playback and analysis.
- Playback never triggers additional DSP.
- Loading a new audio file creates a new experiment.

### Extended Acceptance Criteria

Where development time permits, the implementation should also provide:

- progress feedback during analysis;
- graceful recovery from recoverable errors;
- clear application state transitions;
- logging suitable for debugging development builds.

These enhancements improve usability and maintainability but are not essential to the core architecture.

---

## 10.24 Architectural Rule

The Application Flow exists to coordinate independent subsystems while preserving clear boundaries between their responsibilities.

Accordingly:

- decoding prepares audio;
- analysis measures the signal;
- playback determines time;
- representations consume analysis;
- visualization interprets descriptors.

Each stage performs one responsibility before passing control to the next.

This sequential organisation ensures that Synesthesia remains deterministic, maintainable and faithful to its central architectural principle: objective analysis followed by subjective visual interpretation.

---

## 11. Shared Error States

# 11. Performance Considerations

## 11.1 Overview

Synesthesia is designed as an interactive laboratory in which visual feedback should remain responsive throughout playback and experimentation.

Performance considerations are therefore incorporated into the architecture from the outset.

Rather than relying on aggressive optimisation, the application prioritises a design that naturally minimizes unnecessary computation.

The primary objective is to ensure that analysis, playback and visualization remain responsive while preserving a clear and maintainable architecture.

---

## 11.2 Design Principles

Performance decisions follow four principles.

### Compute Once

Expensive computations should be performed only when necessary.

Audio analysis is therefore executed once immediately after decoding.

Descriptor values are subsequently reused throughout the experiment.

---

### Reuse Shared Data

Whenever multiple systems require the same information, they should consume a shared structure rather than recomputing it.

Examples include:

- FFT results;
- descriptor arrays;
- playback state.

---

### Separate Computation from Rendering

DSP calculations should never occur during rendering.

Rendering should only retrieve existing analytical information and transform it into visual output.

This separation ensures that visualization complexity remains independent from analytical complexity.

---

### Minimise Unnecessary Updates

Components should update only when their observed state changes.

Unrelated interface updates should not trigger additional rendering or analysis.

---

## 11.3 Analysis Performance

The Analysis Pipeline represents the most computationally intensive stage of the application.

Its cost is intentionally concentrated into a single preprocessing step.

Once analysis completes:

- no additional FFT computations occur;
- descriptors remain immutable;
- playback requires only descriptor lookup.

This design shifts computational cost away from real-time interaction.

---

## 11.4 Playback Performance

Playback should remain lightweight.

Its responsibilities are limited to:

- controlling audio reproduction;
- maintaining playback position;
- exposing playback state.

Playback should never:

- compute descriptors;
- modify analysis;
- perform visualization.

Keeping playback independent from analysis ensures stable timing throughout the experiment.

---

## 11.5 Visualization Performance

Visualization performance depends primarily on rendering efficiency.

During playback the renderer should:

1. query playback time;
2. retrieve descriptor values;
3. resolve mappings;
4. render the current frame.

These operations should avoid unnecessary allocations and repeated calculations whenever possible.

---

## 11.6 Rendering Loop

Rendering should operate independently from the React rendering lifecycle.

The animation loop should:

- query shared state;
- compute the current visual state;
- draw directly to the canvas.

React should manage interface state rather than frame-by-frame animation.

This separation reduces unnecessary component updates and improves rendering consistency.

---

## 11.7 Memory Usage

Memory consumption should remain predictable throughout the experiment.

The primary long-lived structures include:

- decoded audio;
- immutable analysis results;
- visualization configuration.

Temporary rendering resources should exist only while required by the active renderer.

Unused resources should be released when no longer needed.

---

## 11.8 Allocation Strategy

During continuous playback, unnecessary memory allocation should be avoided.

Where practical, implementations should favour:

- reusable typed arrays;
- reusable temporary objects;
- cached renderer resources;
- preallocated buffers.

Reducing allocation frequency helps minimise garbage collection interruptions during interaction.

---

## 11.9 Shared Resources

Several resources are intentionally shared across the application.

Examples include:

```text
Decoded Audio
        │
        ▼
Analysis Pipeline
        │
        ▼
AnalysisResult
      ┌─┴────────┐
      ▼          ▼
Microscope    Canvas
```

Sharing these resources reduces memory duplication while ensuring consistent behaviour across representations.

---

## 11.10 Rendering Frequency

Canvas rendering should remain synchronized with playback.

A renderer should update only while visual output can change.

Typical situations requiring rendering include:

- playback advancing;
- playback seeking;
- parameter changes;
- mapping changes;
- preset changes;
- canvas resizing.

Rendering should not occur solely because unrelated interface components are updated.

---

## 11.11 Scalability

The architecture should support future extensions without requiring fundamental redesign.

Potential future additions include:

- additional descriptors;
- new renderers;
- larger visualization libraries;
- alternative laboratory modes.

Because analysis, playback and visualization are already separated, these extensions should primarily increase functionality rather than architectural complexity.

---

## 11.12 Architectural Consequences

The performance strategy establishes several architectural properties.

**Analysis cost is isolated**

Computationally expensive DSP occurs only once.

---

**Playback remains lightweight**

Playback focuses exclusively on temporal control.

---

**Rendering remains independent**

Canvas consumes existing data rather than generating new analysis.

---

**Scalable architecture**

Future functionality can build upon existing shared structures without introducing redundant computation.

## 11.13 React Performance

React is responsible for managing the user interface rather than real-time animation.

Components should re-render only when application state changes in ways that affect the interface.

Examples include:

- loading a new experiment;
- switching laboratory modes;
- changing visualization presets;
- modifying mappings;
- updating interface controls.

Continuous playback should not trigger React re-renders for every animation frame.

Instead, animated rendering should occur directly through the Canvas rendering loop.

---

## 11.14 Canvas Performance

The Canvas renderer should minimize work performed during each animation frame.

Each frame should consist of the following sequence:

1. retrieve playback time;
2. resolve the current analysis frame;
3. compute the visual state;
4. render the visualization.

Operations unrelated to the current frame should not occur during rendering.

Whenever possible, expensive initialization should occur only once when the renderer is created.

---

## 11.15 Analysis Lookup

Descriptor retrieval should be treated as a read-only lookup operation.

For each playback position:

```text
Playback Time
        │
        ▼
Frame Index
        │
        ▼
Descriptor Arrays
```

No descriptor should be recomputed during playback.

The analysis stage exists specifically to avoid repeated DSP calculations during interaction.

---

## 11.16 Mapping Performance

Mapping resolution should remain computationally lightweight.

Mappings operate on existing descriptor values rather than raw audio samples.

Conceptually:

```text
Descriptor Value
        │
        ▼
Mapping Rule
        │
        ▼
Visual Property
```

Because mappings transform only numerical values, modifying them should immediately update the visualization without introducing noticeable delay.

---

## 11.17 Renderer Performance

Renderers should perform only the work necessary to produce the current frame.

Typical responsibilities include:

- updating animation state;
- computing drawing geometry;
- issuing drawing commands.

Renderers should avoid:

- descriptor computation;
- playback management;
- user interface updates.

Maintaining this separation keeps rendering predictable and simplifies optimisation.

---

## 11.18 Resource Lifetime

Resources should exist only for as long as they are required.

Typical lifetimes include:

| Resource | Lifetime |
|----------|----------|
| Decoded audio | Entire experiment |
| AnalysisResult | Entire experiment |
| PlaybackController | Entire experiment |
| Visualization configuration | While experiment is active |
| Renderer resources | While renderer is mounted |
| Temporary drawing buffers | During rendering |

Explicit resource lifetimes reduce unnecessary memory usage and simplify cleanup.

---

## 11.19 Cleanup

Whenever an experiment ends or a renderer is replaced, resources that are no longer required should be released.

Examples include:

- animation loops;
- event listeners;
- offscreen canvases;
- temporary buffers;
- renderer caches.

Cleanup should not affect immutable analysis or shared playback state unless the experiment itself is being discarded.

---

## 11.20 Measuring Performance

Performance should be evaluated from the perspective of user interaction rather than isolated implementation metrics.

Successful behaviour includes:

- responsive interface controls;
- uninterrupted playback;
- smooth visualization updates;
- immediate response to mapping changes;
- rapid switching between laboratory modes.

The implementation should favour predictable responsiveness over maximum rendering complexity.

---

## 11.21 Future Optimisations

The current architecture intentionally leaves room for future optimisation if required.

Possible improvements include:

- incremental rendering techniques;
- offscreen rendering;
- Web Workers for preprocessing;
- GPU-accelerated rendering;
- descriptor caching strategies.

These optimisations should enhance performance without altering the fundamental architecture.

The core design should remain valid even if implementation strategies evolve.

---

## 11.22 Acceptance Criteria

The Performance Considerations are considered satisfied when the following criteria are met.

### Core Acceptance Criteria

- Audio analysis is performed once per experiment.
- Playback performs no DSP calculations.
- The FFT is reused by all spectral descriptors.
- Canvas rendering is independent from the React rendering lifecycle.
- Playback remains responsive while visualizations update.
- Mapping edits immediately affect the visualization.
- Shared analytical data is reused across the application.

### Extended Acceptance Criteria

Where development time permits, the implementation should also provide:

- reusable rendering buffers;
- efficient resource cleanup;
- minimal unnecessary allocations;
- profiling support during development.

These enhancements improve scalability but are not essential to the architectural objectives of Synesthesia.

---

## 11.23 Architectural Rule

Performance is achieved primarily through architectural decisions rather than implementation-specific optimisations.

Accordingly:

- expensive computations are performed once;
- immutable data is reused;
- playback remains lightweight;
- rendering consumes existing analysis rather than generating new analysis.

This approach ensures that responsiveness emerges naturally from the system design while preserving the conceptual clarity of the application architecture.

# 12. Error Handling and Robustness

## 12.1 Overview

Synesthesia is designed as an interactive laboratory intended for experimentation.

Errors should therefore be handled in a way that preserves as much of the current experiment as possible.

Whenever feasible, failures should remain isolated to the subsystem in which they occur.

A visualization error should not invalidate audio analysis.

A playback interruption should not invalidate visualization configuration.

The application should recover gracefully while maintaining a consistent internal state.

---

## 12.2 Design Principles

Error handling follows four guiding principles.

### Fail Locally

Errors should remain confined to the subsystem where they originate.

Failures should not propagate unnecessarily throughout the application.

---

### Preserve Completed Work

Successfully completed stages should not be repeated unless required.

For example:

- completed analysis should remain valid after a rendering error;
- visualization settings should remain valid after playback stops.

---

### Maintain Consistency

The application should never enter a partially updated state.

If an operation cannot be completed safely, the previous valid state should be preserved.

---

### Inform the User

Whenever practical, recoverable errors should be communicated clearly.

Messages should describe:

- what happened;
- what functionality is affected;
- whether the experiment can continue.

Technical implementation details should not be exposed to end users.

---

## 12.3 Audio Loading Errors

Errors may occur while opening or decoding an audio file.

Possible causes include:

- unsupported file format;
- corrupted audio data;
- decoding failure;
- unavailable browser features.

If loading fails:

- no experiment should be created;
- no analysis should begin;
- the laboratory should remain in the Idle state.

The user should be informed that the selected file could not be processed.

---

## 12.4 Analysis Errors

Failures during analysis should prevent creation of an incomplete `AnalysisResult`.

If analysis cannot complete successfully:

- partially computed descriptor data should be discarded;
- playback should not begin;
- the user should receive an appropriate error message.

The application should return to a consistent pre-analysis state.

---

## 12.5 Playback Errors

Playback interruptions should affect only the playback subsystem.

Examples include:

- AudioContext interruptions;
- browser autoplay restrictions;
- unexpected playback termination.

Whenever possible:

- playback may be restarted;
- analysis should remain available;
- visualization configuration should remain unchanged.

The experiment should not require reanalysis.

---

## 12.6 Rendering Errors

Rendering failures should remain isolated to the active renderer.

Possible causes include:

- unexpected renderer exceptions;
- invalid renderer configuration;
- unavailable rendering resources.

Whenever possible:

- playback should continue;
- analysis should remain valid;
- other laboratory modes should remain usable.

The renderer may display a fallback message instead of terminating the application.

---

## 12.7 Invalid Configuration

Visualization settings may become invalid through future extensions or implementation changes.

Examples include:

- missing presets;
- unsupported renderer parameters;
- invalid descriptor mappings.

Whenever possible, the application should:

- restore safe defaults;
- ignore invalid configuration values;
- preserve remaining valid settings.

The objective is graceful degradation rather than complete failure.

---

## 12.8 State Recovery

Whenever an operation fails, the application should recover to the most recent valid state.

Conceptually:

```text
Valid State
      │
      ▼
Operation
      │
      ├── Success
      │      │
      │      ▼
      │  Updated State
      │
      └── Failure
             │
             ▼
      Previous Valid State
```

This approach prevents partially completed updates from producing inconsistent application behaviour.

---

## 12.9 Error Boundaries

Subsystems should remain as independent as possible.

Conceptually:

```text
Audio Loading
        │
Analysis Pipeline
        │
Playback
   ┌────┴─────┐
   ▼          ▼
Microscope  Canvas
```

Failures should not automatically propagate across subsystem boundaries.

Each subsystem should manage its own recovery whenever practical.

---

## 12.10 Logging

Development builds should provide sufficient information to diagnose unexpected behaviour.

Useful information may include:

- subsystem where the error occurred;
- operation being performed;
- relevant configuration values;
- error message.

Logging exists to support development and debugging.

It should not replace user-facing feedback.

---

## 12.11 Acceptance Criteria

The error handling strategy is considered complete when the following criteria are met.

### Core Acceptance Criteria

- Invalid audio files do not create experiments.
- Failed analyses do not produce partial `AnalysisResult` objects.
- Playback failures do not invalidate completed analysis.
- Rendering failures remain isolated to the active visualization.
- Invalid visualization configuration falls back to a safe state whenever possible.
- The application remains internally consistent after recoverable errors.

### Extended Acceptance Criteria

Where development time permits, the implementation should also provide:

- descriptive user-facing error messages;
- development logging;
- graceful renderer fallbacks;
- recovery guidance for common failures.

These additions improve usability and debugging but are not essential to the core architecture.

---

## 12.12 Architectural Rule

Errors should be handled according to subsystem responsibility.

Accordingly:

- loading errors affect loading;
- analysis errors affect analysis;
- playback errors affect playback;
- rendering errors affect rendering.

Completed stages remain valid whenever possible.

This approach preserves the integrity of the experiment while reinforcing the modular architecture of Synesthesia.

# 13. Future Extensions

## 13.1 Overview

Synesthesia has been designed around a modular architecture intended to support future expansion without requiring fundamental redesign.

The current implementation focuses on the core educational objective:

> transforming objective audio analysis into interactive visual representations.

Several architectural decisions intentionally leave room for future development beyond the scope of the present project.

These extensions are not required for the successful completion of the application but demonstrate the flexibility of the proposed architecture.

---

## 13.2 Design Philosophy

Future features should extend existing systems rather than replace them.

New functionality should:

- reuse the immutable `AnalysisResult`;
- integrate with the existing playback architecture;
- follow the established ownership model;
- preserve the separation between analysis and visualization.

Extensions should build upon the current architecture instead of introducing parallel systems.

---

## 13.3 Additional Audio Descriptors

Future versions may incorporate additional analytical descriptors.

Possible examples include:

- spectral rolloff;
- spectral skewness;
- spectral kurtosis;
- zero-crossing rate;
- harmonic ratio;
- chroma features;
- MFCCs;
- tonal descriptors.

New descriptors should become additional members of the `AnalysisResult`.

Existing visualizations should continue functioning without modification.

---

## 13.4 Additional Visualizations

Canvas has been designed to support multiple renderer implementations.

Future renderers may include:

- force-directed particle systems;
- fluid simulations;
- vector field visualizations;
- procedural geometry;
- three-dimensional scenes;
- network representations.

Each renderer should consume the same `VisualState` abstraction rather than directly accessing descriptor values.

---

## 13.5 Additional Laboratory Modes

The current laboratory consists of two complementary perspectives:

- Microscope;
- Canvas.

Future laboratory modes may provide alternative ways of exploring the same analysis.

Examples include:

- statistical summaries;
- descriptor comparison tools;
- timeline inspection;
- annotation environments;
- multi-track comparison.

Each new mode should consume the shared `AnalysisResult` rather than performing independent analysis.

---

## 13.6 Preset Library

Future versions may include an expanded collection of visualization presets.

Possible additions include:

- educational presets;
- artistic presets;
- descriptor-focused presets;
- perceptual presets.

Because presets modify only visualization configuration, they can be added without affecting the DSP pipeline.

---

## 13.7 Experiment Persistence

Future work may allow experiments to be saved and restored.

Persistent information could include:

- visualization presets;
- descriptor mappings;
- parameter values;
- annotations;
- user-created configurations.

Immutable analysis may also be stored to avoid repeating computationally expensive preprocessing.

---

## 13.8 Data Export

Future versions may support exporting analytical information.

Possible export formats include:

- CSV;
- JSON;
- image snapshots;
- visualization recordings;
- analysis reports.

Export functionality should operate as an additional consumer of the `AnalysisResult`.

It should never modify the analysis itself.

---

## 13.9 Collaborative Features

The current application is designed for individual experimentation.

Future extensions may explore collaborative workflows such as:

- shared presets;
- shared mapping configurations;
- classroom demonstrations;
- collaborative annotation.

These features would extend the user experience without requiring changes to the analysis architecture.

---

## 13.10 Research Opportunities

The architecture also supports future research beyond the scope of this project.

Potential directions include:

- perceptual evaluation of descriptor mappings;
- comparison of alternative visualization strategies;
- educational effectiveness studies;
- interactive learning environments;
- user-generated visualization systems.

The separation between analysis and interpretation makes these investigations possible without redesigning the analytical foundation.

---

## 13.11 Scope Boundaries

The following features are intentionally excluded from the current implementation:

- real-time audio input;
- live microphone analysis;
- distributed collaboration;
- cloud synchronization;
- machine learning models;
- three-dimensional rendering;
- plugin systems.

These features represent potential future work rather than missing functionality.

Their exclusion allows the project to remain focused on its primary educational and architectural objectives.

---

## 13.12 Architectural Rule

Future extensions should preserve the core architectural principles established throughout this specification.

Accordingly:

- analysis remains objective;
- playback remains the temporal authority;
- visualization remains interpretative;
- components retain clear ownership boundaries.

Any future functionality should strengthen these principles rather than introducing exceptions or alternative execution paths.

This ensures that Synesthesia can evolve while maintaining a coherent conceptual and architectural identity.