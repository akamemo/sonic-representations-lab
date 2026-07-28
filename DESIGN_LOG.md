# Design Log

Record important decisions in chronological order.

Use this structure:

```text
## YYYY-MM-DD — Decision title

**Context:**  
What problem or choice was being considered?

**Decision:**  
What was selected?

**Reasoning:**  
Why was this option chosen?

**Alternatives considered:**  
What other options were discussed?

**Consequences:**  
What does this simplify, limit, or require?
```

---

## 2026-07-26 — Unify analytical and artistic concepts

**Context:**  
The project initially included separate ideas: a multimodal translation laboratory and a sound microscope.

**Decision:**  
Treat them as two views powered by one shared DSP analysis engine.

**Reasoning:**  
This creates a coherent project narrative while avoiding duplicated technical work.

**Alternatives considered:**  
Build only an artistic visualizer or only an analytical DSP tool.

**Consequences:**  
The architecture must separate analysis from presentation.

---

## 2026-07-26 — Restrict the MVP to uploaded audio

**Context:**  
Microphone input was considered.

**Decision:**  
Use uploaded audio files for the MVP.

**Reasoning:**  
Offline analysis is easier to test, repeat, and synchronize. It reduces browser-permission and real-time-processing risks.

**Consequences:**  
Microphone input becomes a stretch goal.

---

## 2026-07-26 — Exclude machine learning

**Context:**  
Acoustic-event recognition and classification were considered.

**Decision:**  
Do not include machine learning in the MVP.

**Reasoning:**  
Dataset creation, training, validation, and safety claims would consume too much of the two-week schedule.

**Consequences:**  
The project remains centered on interpretable DSP and creative mapping.

## 2026-07-26 — Establish the project repository

**Context:**  
The project needed a structured and traceable development process.

**Decision:**  
Create a public GitHub repository containing project, architecture, DSP, testing, roadmap, and design-log documentation before implementation begins.

**Reasoning:**  
This allows design decisions, implementation progress, and testing evidence to be documented continuously rather than reconstructed at the end.

**Consequences:**  
Documentation will be updated alongside the code throughout development.

## 2026-07-26 — Project identity

**Context:**
The project required a public identity that reflected both its artistic and analytical goals.

**Decision:**
Adopt **Synesthesia** as the application name with the subtitle:

*"An Interactive Laboratory for Sound Exploration."*

**Reasoning:**
While the repository remains descriptively named *sonic-representations-lab*, the application benefits from a memorable identity. The term *Synesthesia* communicates the project's central idea of exploring relationships between sound and visual representation without restricting it to literal audio-to-image translation.

**Consequences:**
All future documentation, interface mock-ups and presentations will use this identity consistently.

## 2026-07-26 — Confirm the analytical core of Synesthesia

**Context**

The audio analysis layer is the foundation of both Microscope Mode and Canvas Mode. The initial list of descriptors was intentionally reconsidered to balance educational value, implementation complexity, computational cost, and expressive visual potential.

**Decision**

The MVP will be based on:

### Core scalar descriptors

- RMS Energy
- Spectral Centroid
- Spectral Spread
- Spectral Flatness
- Spectral Flux
- Onset Strength

### Perception-oriented representation

- 12-band Mel-energy representation

The Mel representation is treated as a multidimensional perceptual view of the spectrum rather than as an additional set of scalar descriptors.

**Rationale**

The selected descriptors provide complementary information describing:

- signal intensity;
- spectral brightness;
- spectral distribution;
- timbral character;
- spectral evolution;
- transient activity.

Together they provide a compact but expressive representation of the analysed signal while remaining computationally lightweight.

The Mel representation was included because it introduces a perception-oriented view of frequency content and offers significantly richer visual possibilities without requiring an additional FFT.

**Alternatives Considered**

The following features were evaluated but postponed:

- spectral rolloff;
- zero-crossing rate;
- pitch estimation;
- chroma;
- beat and tempo estimation;
- MFCCs;
- psychoacoustic roughness;
- sharpness;
- dissonance;
- machine-learning descriptors.

These remain candidates for future versions once the core application has been completed and evaluated.

**Consequences**

The analysis architecture will follow one guiding principle:

> One FFT per analysis frame. Multiple representations derived from the same spectral data.

This decision establishes the analytical identity of Synesthesia and will guide both future implementation and visualization design.

## UX, Interaction and Visual Identity Decisions

### Experience Goals

Synesthesia is designed as an interactive laboratory for learning through exploration.

The primary audience includes:

- engineering students;
- music technology students;
- computer science students.

Secondary audiences include:

- musicians;
- producers;
- creative coders;
- digital artists.

The principal user goal is:

> Understand sound through multiple complementary representations.

The interface should make the user feel that they are conducting an experiment rather than configuring technical software.

The experience should be:

- minimalist;
- calm;
- self-explanatory;
- educational;
- focused;
- approachable;
- visually distinctive;
- progressively disclosed.

White space is treated as an active design element rather than unused space.

Synesthesia should not resemble:

- a digital audio workstation;
- conventional engineering software;
- a dense analytics dashboard;
- a futuristic control room;
- a cyberpunk interface;
- a heavily nostalgic video game.

The intended experience is closer to a contemporary interactive science exhibit: technically grounded, visually engaging and easy to approach.

---

### Core Experience Principle

The analytical and artistic parts of Synesthesia serve different purposes:

- **Microscope Mode** supports observation and understanding.
- **Canvas Mode** supports interpretation and experimentation.

This distinction can be summarized as:

> Analysis is objective. Representation is interpretive.

Canvas Mode may be expressive and abstract, but its behaviour must remain traceable to the analysed sound.

---

### Shared Laboratory Workspace

Microscope Mode and Canvas Mode will exist as two perspectives inside one shared laboratory workspace rather than as unrelated pages.

A persistent mode selector allows movement between:

```text
Microscope ↔ Canvas
```

Switching modes must:

- happen without a page reload;
- preserve the loaded audio;
- preserve playback position;
- preserve playback state where practical;
- preserve the prepared analysis;
- avoid decoding or analysing the audio again.

Both modes consume the same analysis data produced by the shared DSP pipeline.

The shared laboratory shell should contain:

- lightweight application identity;
- the Microscope/Canvas mode selector;
- a primary workspace;
- a mode-specific contextual area;
- persistent playback controls;
- access to experiment-ending actions without cluttering the principal workspace.

The shell remains visually consistent while its central content changes according to the selected mode.

---

### Immutable Audio Analysis

Audio descriptors and representations are outputs of the DSP pipeline and must be treated as immutable ground truth.

The user must never be allowed to directly edit:

- RMS energy;
- spectral centroid;
- spectral spread;
- spectral flatness;
- spectral flux;
- onset strength;
- 12-band mel energies;
- waveform data;
- spectrum data;
- spectrogram data.

The application distinguishes clearly between:

#### Audio Parameters

Immutable analytical values produced from the uploaded audio.

#### Visualization Settings

Editable rules controlling how analytical values affect the generative visualization.

The conceptual data flow is:

```text
Audio
  ↓
Shared DSP Analysis
  ↓
Immutable Descriptors and Representations
  ↓
Visualization Mapping
  ↓
Canvas
```

The user may alter only the visualization-mapping layer.

Changing an audio descriptor would imply changing the source signal or its analysis. Changing a mapping produces a new visual interpretation while preserving analytical integrity.

The governing statement is:

> One sound can have many visual interpretations, but all of them originate from the same underlying data.

---

### Shared DSP and Interface Consistency

The interface must reflect the shared-analysis architecture.

One FFT analysis per frame is reused for:

- waveform presentation where applicable;
- magnitude spectrum;
- spectrogram;
- spectral centroid;
- spectral spread;
- spectral flatness;
- spectral flux;
- onset strength;
- 12-band mel energies.

RMS energy is also computed as part of the shared descriptor pipeline.

Microscope and Canvas should not present themselves as separate analyses. They are complementary views of one prepared experiment.

---

### Progressive Disclosure

The interface should reveal complexity only when it becomes relevant.

Before audio is selected, the user should not see:

- plots;
- descriptor values;
- mapping controls;
- playback controls;
- preset controls;
- export controls.

The opening screen presents only the project identity, its purpose and one obvious action.

After analysis, the laboratory reveals analytical and artistic tools in a structured sequence.

Custom mapping controls appear only when the user chooses to customize a visualization.

Export controls appear near the end of an experiment rather than occupying the main workspace throughout the session.

---

### Welcome Screen

The selected welcome-screen direction is:

> **Option A — Centered Pixel Wave Background**

The welcome screen has one principal purpose:

> Invite the user to begin an experiment.

It contains:

- the Synesthesia identity;
- the subtitle **An Interactive Laboratory for Sound Exploration**;
- a short mission statement;
- one prominent **Upload Audio** action;
- drag-and-drop guidance;
- concise supported-format information;
- a local-processing notice;
- a subtle animated pixel waveform.

The working mission statement is:

> Explore how sound can be analysed, understood and artistically represented through multiple complementary views.

The opening interface must remain centered, spacious and visually calm.

It must not expose laboratory controls before an audio file has been selected.

---

### Upload and Drag-and-Drop Interaction

The full welcome screen, rather than only a small file-input target, should respond when the user drags an audio file over the interface.

During a valid drag-over state:

- the pixel waveform becomes slightly more active;
- the upload area becomes more visually prominent;
- the page may brighten subtly;
- the upload boundary may strengthen;
- the instruction changes to:

> Drop your audio to begin the experiment.

The response should feel deliberate but restrained.

The animation must not resemble an arcade effect or distract from the upload action.

---

### Local Processing Notice

The welcome screen includes the statement:

> Your audio never leaves your device. All analysis is performed locally in your browser.

This message communicates both:

- user privacy;
- an important client-side architectural property.

It should be visible but visually secondary to the upload action.

The statement must remain factually accurate. If a future feature sends data to a server, the copy and design decision must be reviewed.

---

### Upload, Analysis and Readiness States

Uploading, analysing and exploring are treated as distinct stages.

The intended sequence is:

```text
Audio Selected
  ↓
Upload or File Preparation
  ↓
Analysis in Progress
  ↓
Analysis Complete
  ↓
Start Exploring
  ↓
Laboratory Workspace
```

The analysis progress interface should communicate meaningful preparation stages rather than showing an unexplained loading spinner.

Possible stages include:

1. Reading or decoding the audio.
2. Preparing time-domain data.
3. Computing FFT-based analysis.
4. Building the spectrum and spectrogram data.
5. Extracting scalar descriptors.
6. Preparing the 12-band mel representation.
7. Preparing Canvas visualization data.

The exact labels may be refined once the actual implementation pipeline is known. The interface must not claim that a stage is separate if it is not genuinely represented in the implementation.

The progress display is educational but should not expose unnecessary low-level detail.

---

### Analysis Complete State

After all required preparation has finished, the interface displays a distinct completion state.

Suggested copy:

> Analysis complete.

> Your audio has been transformed into multiple complementary representations.

The **Start Exploring** button:

- is unavailable while analysis is incomplete;
- becomes available after successful preparation;
- waits for deliberate user interaction;
- does not trigger another analysis;
- transitions the user into the prepared laboratory.

This creates a meaningful separation between preparation and exploration.

The user should feel:

> The laboratory is ready. Enter when you are ready.

---

### Entering the Laboratory

Selecting **Start Exploring** initiates a short transition rather than an abrupt screen replacement.

The transition may include:

- the completion content fading;
- the application identity shifting into the laboratory header;
- the pixel waveform transforming or receding;
- the shared workspace appearing;
- playback controls appearing after the main workspace.

The transition should be approximately 300–700 milliseconds and should feel intentional without delaying the user.

Reduced-motion preferences must be respected during implementation.

---

### Microscope Mode

Microscope Mode presents analytical views of the uploaded sound.

Its MVP representations are:

- waveform;
- magnitude spectrum;
- spectrogram;
- 12-band mel-energy representation;
- descriptor inspector;
- educational explanations.

The scalar descriptor set is:

- RMS energy;
- spectral centroid;
- spectral spread;
- spectral flatness;
- spectral flux;
- onset strength.

The 12-band mel-energy view is not treated as an additional scalar descriptor. It is a multidimensional, perception-oriented representation of spectral energy.

Microscope Mode should emphasize one primary representation at a time rather than displaying every plot at equal prominence.

The user can move between focused views such as:

```text
Waveform
Spectrum
Spectrogram
Mel Representation
```

The selected representation should receive sufficient space for clear interpretation.

The descriptor inspector remains synchronized with playback and provides current values, trends or explanations as appropriate.

Educational explanations should communicate:

- what each representation shows;
- how it is derived at an accessible level;
- what changes the user should observe;
- how it relates to what they hear.

---

### Canvas Mode Introduction

The first time a user enters Canvas Mode during an experiment, a short educational overlay appears.

The overlay explains that:

- Canvas uses the same audio features explored in Microscope Mode;
- the underlying analysis does not change;
- the user can modify how features are represented;
- descriptor values themselves cannot be edited.

Suggested conceptual copy:

> Canvas Mode transforms the same audio analysis into an artistic interpretation.

> Change how the features are represented without changing the analysis itself.

After dismissal, the overlay should not appear again during the same experiment.

Subsequent transitions into Canvas Mode should be immediate.

---

### Guided Creativity

Canvas Mode is not an unrestricted visualizer editor.

It is:

> A guided exploration of how the same audio analysis can produce multiple meaningful artistic interpretations.

The application should not expose every technically possible descriptor-to-visual-property combination.

It should expose only combinations that are:

- perceptible;
- explainable;
- educationally useful;
- artistically coherent;
- sufficiently distinct;
- practical to control;
- unlikely to mislead the user.

The guiding rule is:

> Do not expose every possibility. Expose the meaningful possibilities.

The interface should make users feel that they are experimenting, not configuring a node-based system.

---

### Mapping Eligibility Rules

A descriptor-to-visual mapping may be included only when it satisfies all of the following principles.

#### Explainability

The relationship can be described clearly.

For example, increasing energy may reasonably increase visual scale or intensity.

#### Perceptibility

Changes in the descriptor produce a visible result under realistic audio conditions.

Mappings with imperceptible or inconsistent effects should not be offered.

#### Interpretability

The visual behaviour helps the user form a relationship between what is heard and what is seen.

#### Artistic Coherence

The mapping contributes to a visually intentional composition rather than arbitrary movement.

#### Distinctiveness

The mapping does not unnecessarily duplicate another control or create several controls with indistinguishable outcomes.

#### Stability

The mapping should remain usable across a reasonable variety of audio files.

#### Data Integrity

The mapping may alter interpretation but must not obscure the fact that the source descriptors remain unchanged.

Potentially intuitive relationships include:

- greater RMS energy → increased scale, intensity or brightness;
- higher spectral centroid → a shift in colour or visual sharpness;
- greater spectral spread → wider spatial dispersion;
- greater spectral flux → increased movement or rate of change;
- stronger onset strength → pulses, accents or bursts;
- changing mel-band distribution → internal structure, deformation or regional activity;
- spectral flatness → texture, regularity or noise-like visual complexity.

These are design directions rather than guarantees that every listed target will be exposed. Each final mapping must be validated during prototyping.

---

### Visualization Presets

Canvas Mode includes three curated presets and one customizable mode.

The preset selector should communicate a progression from direct observation toward personal interpretation.

#### Scientific

The default preset.

It emphasizes clear and direct relationships between descriptors and visual behaviour.

Its purpose is educational legibility rather than decorative complexity.

Short explanation:

> Emphasizes direct relationships between audio descriptors and visual behaviour.

#### Organic

A fluid interpretation emphasizing continuous change, growth, deformation and natural movement.

Short explanation:

> Uses smooth, flowing mappings to emphasize continuous changes in the sound.

#### Geometric

A structured interpretation emphasizing order, pattern, symmetry, divisions and defined shapes.

Short explanation:

> Highlights structure and pattern through ordered geometric mappings.

#### Custom

Allows the user to create a personal interpretation using a curated set of meaningful mapping choices.

Short explanation:

> Create your own interpretation within carefully selected mapping possibilities.

Custom Mode does not:

- unlock descriptor editing;
- expose every descriptor to every visual property;
- become a programming environment;
- become a node editor;
- remove the application's educational guidance.

Custom Mode may begin from the currently selected preset so users can modify a coherent existing configuration rather than always starting from an empty state.

---

### Preset Switching During Playback

The user can switch presets while:

- the audio is playing;
- the playhead continues moving;
- the Canvas visualization continues running.

Changing a preset must not:

- restart playback;
- seek to the beginning;
- recompute the audio analysis;
- replace the underlying descriptor data.

The visualization should transition smoothly between preset states.

A short interpolation or morph reinforces the idea:

> The sound did not change. The interpretation changed.

The transition should be polished but computationally modest enough to maintain reliable browser performance.

---

### Visualization Settings

Editable controls are presented as **Visualization Settings**, not audio controls or descriptor controls.

They may include curated choices such as:

- which eligible descriptor controls a particular property;
- mapping strength;
- visual sensitivity;
- smoothing;
- visual scale;
- motion amount;
- particle or shape density;
- colour response within predefined bounds;
- onset response;
- mel-band influence;
- preset-specific stylistic parameters.

The exact set will be decided through prototype testing.

Every exposed control must produce a meaningful visible effect.

Settings must be grouped and labelled according to their visual outcome, avoiding unnecessary DSP terminology where simpler language is more appropriate.

Explanations may reveal the analytical relationship for educational purposes.

---

### Persistent Playback

Playback controls remain accessible in both Microscope and Canvas modes.

The shared transport should include at minimum:

- play and pause;
- current time;
- total duration;
- seek position;
- volume or mute where feasible.

Playback position should synchronize:

- the waveform cursor;
- time-varying descriptor values;
- the spectrogram position;
- mel energies;
- Canvas animation.

The transport should support the experiment without visually dominating it.

---

### Experiment Wrap-Up

The application should provide a deliberate end to each experiment.

The experience is:

```text
Welcome
  ↓
Prepare Experiment
  ↓
Explore
  ↓
Reflect and Export
  ↓
Start New Experiment
```

The wrap-up should not appear automatically merely because playback reaches the end. The user may wish to replay, inspect or continue adjusting the visualization.

A clear action in the laboratory can open the wrap-up when the user considers the experiment complete.

Suggested heading:

> Experiment Complete

Suggested supporting text:

> You have explored multiple representations of your audio.

The primary concluding action is:

> Start New Experiment

This returns the user to the clean welcome state and prepares the application for another audio file.

Before discarding the current experiment, the application should warn the user when relevant unsaved exports or custom settings would be lost.

---

### Export Placement and Stretch Goals

Export actions belong primarily in the experiment wrap-up rather than the main workspace.

This prevents secondary features from competing with observation and exploration.

Potential stretch goals include:

- save the current Canvas visualization as PNG;
- export scalar descriptor values as CSV;
- export descriptor data as JSON;
- export time-series descriptor data;
- export 12-band mel-energy data;
- save visualization settings;
- export a combined experiment package;
- restore a saved visualization configuration;
- compare two tracks in a future version;
- share an experiment in a future version.

The MVP should not depend on all export features being completed.

The interface should clearly distinguish implemented actions from unavailable future concepts.

---

### Returning to Welcome

Selecting **Start New Experiment** returns the user to the same calm welcome screen used at the beginning.

The previous audio, prepared data and experiment-specific UI state should be cleared safely.

Global interface preferences may remain, but audio-derived state must not leak into the next experiment.

The return transition can reverse aspects of the laboratory-entry animation:

- the workspace recedes;
- the pixel-wave motif returns;
- the upload action becomes available;
- the interface settles into its idle state.

This creates a complete experiential loop.

---

### Selected Visual Identity

The final selected direction is:

> **Centered Pixel Wave**

Synesthesia combines contemporary interaction design with restrained retro-computing and low-bit influences.

The identity is inspired by:

- pixel art;
- early digital graphics;
- low-bit console interfaces;
- waveform displays;
- spectrum bars;
- scientific instruments;
- educational laboratory exhibits.

The influence is expressive rather than heavily nostalgic.

The application should feel crafted and approachable, not like a themed retro game.

---

### Visual Language

The visual language uses:

- a warm off-white or softly tinted background;
- charcoal or deep navy text;
- restrained sage green;
- muted lavender;
- dusty or desaturated blue;
- light neutral greys;
- generous whitespace;
- fine borders;
- soft corners;
- minimal shadows;
- pixel-inspired icons;
- simplified geometric marks;
- pixel-wave and pixel-spectrum motifs;
- highly restrained decoration.

The palette should preserve sufficient contrast and accessibility.

Colour should communicate hierarchy and state rather than act as decoration alone.

Canvas itself may use a darker field when needed for the generative visualization, while the surrounding application shell retains the calm, light laboratory identity.

---

### Typography

Pixel influence should be strongest in:

- the wordmark;
- selected headings;
- short labels;
- decorative numeric or status elements.

Long-form explanations, control labels and supporting text must remain highly readable.

A pixel or monospace-inspired display face may be paired with a clean body typeface.

The interface should avoid using a highly stylized pixel font for dense paragraphs or small essential text.

Typography should maintain:

- clear hierarchy;
- comfortable line length;
- accessible sizing;
- restrained use of uppercase;
- consistent spacing.

---

### Pixel Icons and Interface Geometry

Icons may use low-bit or 8-bit-inspired geometry.

They should remain:

- recognizable;
- consistent;
- small in visual complexity;
- understandable without decoration;
- accompanied by labels when meaning may be ambiguous.

Buttons and panels may use subtle pixel influence through:

- crisp one-pixel borders;
- compact corner radii;
- stepped details in decorative elements;
- square status markers.

Primary interface elements should not become jagged or difficult to scan.

Modern layout and usability take priority over stylistic imitation.

---

### Living Pixel Wave

The welcome screen uses a subtle animated pixel waveform as its signature background motif.

The living pixel wave connects:

- sound;
- digital computation;
- signal processing;
- pixel art;
- the application's retro-computing influence.

Its behaviour changes according to application state.

#### Idle

- calm;
- slow;
- low contrast;
- breathing gently;
- visually secondary to the upload action.

#### Drag Over

- slightly brighter;
- more responsive;
- subtly drawn toward the upload area;
- accompanied by the updated drop instruction.

#### Upload or File Preparation

- acknowledges that a file has been accepted;
- may contract, align or reorganize;
- avoids implying analysis is complete.

#### Analysis

- becomes more structured or computational;
- may transform into spectral blocks, grids or decomposed pixel elements;
- supports the progress state without becoming a second data visualization.

#### Analysis Complete

- settles into a stable state;
- supports the appearance of **Start Exploring**.

#### Entering the Laboratory

- recedes, transforms or dissolves into the workspace;
- creates continuity between welcome and exploration.

#### Microscope

- becomes extremely subtle or disappears where analytical plots require visual clarity.

#### Canvas

- yields visual priority to the generative artwork.

#### Start New Experiment

- returns to its calm welcome-state behaviour.

Animation must always support comprehension.

The visual motif must not:

- distract from content;
- imply false audio data before analysis;
- reduce text readability;
- cause poor performance;
- ignore reduced-motion preferences.

---

### Motion Principles

Motion should communicate:

- state change;
- continuity;
- readiness;
- relationship;
- cause and effect.

Motion should not be added solely for spectacle.

Transitions should generally be:

- short;
- smooth;
- interruptible where practical;
- computationally lightweight;
- consistent across the interface.

Preset transitions may be slightly more expressive than navigation transitions because they communicate a changing interpretation.

---

### Optional Interface Sounds

Subtle low-bit-inspired interface sounds may be considered as a stretch goal for:

- successful upload;
- analysis completion;
- preset switching;
- export completion.

These sounds must:

- be optional;
- never overlap intrusively with the analysed track;
- respect browser autoplay restrictions;
- be easy to disable;
- remain subtle and functional.

They are not required for the MVP.

---

### Responsive and Accessible Design

The desktop experience is the primary design target for the course project, but the layout should degrade responsibly on smaller displays.

Responsive decisions must preserve:

- readable plots;
- accessible controls;
- clear hierarchy;
- usable mode navigation;
- uninterrupted playback access.

The implementation should also account for:

- keyboard navigation;
- visible focus states;
- sufficient contrast;
- labelled controls;
- screen-reader-friendly status updates;
- reduced-motion preferences;
- non-colour-only state communication.

Accessibility is part of interface quality rather than a later decorative addition.