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