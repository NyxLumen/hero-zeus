# ZEUS

> A scroll-driven mythological WebGL hero experiment.

**ZEUS** is a single-screen cinematic web experiment built from a sequence of pre-rendered WebP frames.

The visual concept:

**ancient mythology × modern brutalist typography × corrupted digital imagery**

The generated cinematic frames are raw material. A custom WebGL shader gives them a cohesive visual identity, while GSAP ScrollTrigger turns the sequence into one continuous scroll-driven composition.

---

## Concept

Zeus is already present when the page loads.

The user sees:
- Zeus
- minimal copy on the left
- a dark cinematic composition

As the user scrolls, the copy fades and the cinematic sequence begins.

Scroll position continuously controls the frame sequence. As the imagery evolves, short narrative statements appear at carefully selected moments.

The shader reacts to the cinematic progression with subtle distortion, temporal ghosting, grain, dithering, and controlled glitch behavior.

The sequence eventually collapses into black.

After a short visual pause, a large final statement about Zeus appears.

This is intentionally **not a full website**.

It is one focused interaction:

> **scroll through a myth.**

---

## Visual Direction

### Mythic
- stone
- marble
- muted gold
- deep red
- darkness
- monumental scale
- cinematic atmosphere

### Digital
- temporal ghosting
- procedural displacement
- subtle spectral separation
- grain
- dithering
- controlled image tearing
- scroll-reactive distortion

The goal is not cyberpunk. The goal is to make the mythology feel like it is being transmitted through a strange digital medium.

The glitch should feel intentional and supernatural rather than like a stock effect.

---

## Experience Flow

```text
PAGE LOAD
   │
   ▼
ZEUS ALREADY PRESENT
   │
   │  Intro copy visible
   ▼
USER SCROLLS
   │
   ▼
INTRO COPY FADES
   │
   ▼
CINEMATIC FRAME SEQUENCE
   │
   ├── Narrative beat
   ├── Scene evolution
   ├── Shader response
   ├── Narrative beat
   ├── Scene evolution
   └── Narrative beat
   │
   ▼
VISUAL COLLAPSE
   │
   ▼
BLACK
   │
   ▼
FINAL LARGE STATEMENT
```

The cinematic should feel like one continuous movement, not a collection of webpage sections.

---

## Tech Stack

- React
- TypeScript
- Vite
- Three.js
- GSAP
- ScrollTrigger
- WebGL / GLSL
- WebP frame sequence

---

## Rendering Architecture

The cinematic source is a collection of WebP frames stored in `frames/`.

There is deliberately no HTML video element driving the hero.

```text
WebP frames
     │
     ▼
Frame loader
     │
     ▼
Current frame texture
     │
     ▼
Three.js / WebGL
     │
     ▼
Mythic Glitch Shader
     │
     ▼
Canvas
     │
     ├───────────────┐
     ▼               ▼
Cinematic image   DOM typography
```

Scroll progress determines the current frame.

Conceptually:

```ts
const frameIndex = Math.floor(
  progress * (frameCount - 1)
);
```

GSAP remains responsible for orchestration.

---

## Scroll System

GSAP ScrollTrigger pins the cinematic hero and maps scroll progress to the master timeline.

```text
Scroll position
      ↓
ScrollTrigger
      ↓
Master GSAP timeline
      ├── frame progress
      ├── shader parameters
      ├── typography
      ├── scene transitions
      └── final blackout
```

The timeline is scrubbed so the user directly controls the cinematic through scrolling.

Avoid a collection of unrelated scroll handlers.

---

## Shader

The shader exists to solve a specific visual problem:

**the generated frames should not look like untouched AI video.**

It is an artistic treatment layer, not a generic effects stack.

### Base treatment
- subtle grain
- dithering
- controlled contrast
- vignette
- slight lens distortion
- restrained highlight / bloom treatment
- procedural displacement

### Dynamic treatment
- temporal feedback
- directional displacement
- restrained spectral separation
- noise-based distortion
- transition glitches

### Palette

```text
BLACK
STONE
MUTED GOLD
DEEP RED
```

Avoid rainbow RGB cyberpunk.

Start with one custom shader pass, but keep the architecture extensible so additional passes can be added later if genuinely needed.

---

## Typography

Direction: **modern brutalist**.

The imagery is ancient; the typography is not. That contrast is intentional.

Copy should be:
- large
- sparse
- confident
- editorial
- readable
- short

Intro copy is visible on load, then fades. Narrative statements appear at deliberate beats. The final statement is substantially larger and more dominant.

---

## Assets

### Frame sequence

```text
frames/
```

Contains the pre-split WebP cinematic frames.

These frames are the authoritative visual source for the hero.

Do not replace them with a video unless the project direction is explicitly changed.

---

## Suggested Project Structure

```text
.
├── frames/
│   └── *.webp
├── public/
├── src/
│   ├── components/
│   │   └── ZeusHero/
│   ├── rendering/
│   │   └── shader/
│   ├── animation/
│   ├── data/
│   └── styles/
├── AGENTS.md
├── README.md
├── package.json
└── vite.config.ts
```

The exact structure can evolve with implementation.

---

## Development

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Implementation Roadmap

### 01 — Foundation
Set up React, TypeScript, Vite, Three.js, GSAP, ScrollTrigger, the hero canvas, and the page structure.

### 02 — Frame Renderer
Implement WebP discovery, loading, texture management, frame selection, and fullscreen rendering.

### 03 — Scroll Cinematic
Implement ScrollTrigger pinning, the scrubbed master timeline, continuous frame progression, and the initial copy fade.

### 04 — Narrative
Add narrative data, beat timing, copy transitions, and the final statement.

### 05 — Shader
Implement base image treatment, grain, dithering, distortion, temporal feedback, restrained spectral separation, and timeline-reactive parameters.

### 06 — Ending
Implement the visual collapse, blackout, final statement, and end of the scroll sequence.

### 07 — Polish
Tune typography, timing, shader intensity, frame loading, GPU usage, responsive behavior, and final composition.

---

## Design Constraints

This project intentionally avoids:
- generic glassmorphism
- dashboard UI
- cards
- unnecessary navigation
- random particles
- generic neon effects
- excessive RGB glitch
- unnecessary 3D assets
- long paragraphs
- conventional multi-section website structure

The project should remain focused.

### The test

For every visual addition, ask:

> **Does this make the experience feel more authored?**

If not, remove it.

---

## Definition of Done

The project is finished when the user can:

1. Load the page and immediately see Zeus.
2. Understand the primary visual/copy relationship without interaction.
3. Scroll and directly control the cinematic.
4. Move continuously through the frame sequence.
5. Encounter narrative statements at deliberate moments.
6. Feel the shader treatment without seeing a generic filter.
7. Reach a controlled blackout.
8. Encounter a strong final statement.
9. Leave with the impression of an interactive digital artwork rather than an AI video embedded in a webpage.

---

## Status

**Creative direction: LOCKED**

**Technology: LOCKED**

**Frame-based cinematic approach: LOCKED**

**GSAP + ScrollTrigger: LOCKED**

**Shader architecture: LOCKED**

**Narrative copy: To be written during implementation**

**Final visual polish: Pending implementation**
