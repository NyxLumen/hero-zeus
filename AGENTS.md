# AGENTS.md

## Project: ZEUS — Mythic Glitch Hero Experiment

A single-screen, scroll-driven cinematic web experiment built from pre-rendered WebP frames depicting Zeus. The goal is not a full website. The goal is one highly art-directed hero experience that makes generated cinematic material feel authored, interactive, and visually distinctive.

## Locked Creative Direction

**Core idea:** mythology interpreted through a corrupted digital medium.

Visual language:
- Ancient / mythological imagery
- Modern brutalist typography
- Controlled digital distortion
- Cinematic motion
- Black, stone, muted gold, deep red
- Minimal interface
- Editorial pacing

Avoid generic AI-cinematic aesthetics and generic cyberpunk glitch aesthetics. The glitch should feel like a visual force affecting the mythology, not a stock effect.

### Hero behavior

On load:
- Zeus is already visible.
- Intro copy is visible on the left.
- No enter screen or intro interaction.

On scroll:
1. Intro copy fades.
2. The cinematic sequence begins.
3. Scroll continuously controls the frame sequence.
4. The cinematic area stays pinned while the sequence progresses.
5. Short narrative copy appears at deliberate moments.
6. Scene changes feel continuous, not like separate website sections.
7. The sequence resolves into black.
8. The scroll-driven sequence ends.
9. A large final statement appears.

## Technology

Required stack:
- React
- TypeScript
- Vite
- Three.js
- GSAP
- GSAP ScrollTrigger
- WebGL / GLSL
- WebP frame sequence

The cinematic source is **not a video element**. The source is a folder of WebP frames.

Rendering model:

```text
WebP frame sequence
        ↓
frame loader / texture management
        ↓
current frame texture
        ↓
Three.js / WebGL
        ↓
custom shader
        ↓
canvas
        ↓
DOM typography overlay
```

Do not replace the frame sequence with video unless explicitly requested.

## Frame Sequence

The authoritative cinematic assets live in `frames/` and are already WebP.

Conceptually:

```ts
frameIndex = Math.floor(progress * (frameCount - 1));
```

Implementation must avoid unnecessary texture churn. Preload intelligently, cache textures, and consider GPU memory before holding every full-resolution frame at once.

## Scroll Architecture

GSAP ScrollTrigger is the source of truth for cinematic progression.

Use a pinned, scrubbed master timeline:

```text
ScrollTrigger
    ↓
normalized progress 0 → 1
    ↓
master GSAP timeline
    ├── frame sequence progress
    ├── shader parameters
    ├── copy opacity / position
    ├── scene transitions
    └── final blackout
```

Avoid scattered `window.scrollY` calculations and independent animation systems fighting over the same properties.

## Shader Direction

The shader exists to make the generated imagery feel like authored digital artwork, not simply to make it more cinematic.

Base treatment:
- subtle film grain
- restrained dithering
- controlled contrast
- subtle vignette
- slight lens distortion
- restrained highlight / bloom treatment
- procedural noise displacement

Dynamic treatment:
- temporal ghosting / feedback
- directional displacement
- restrained spectral / RGB separation
- procedural noise distortion
- glitch pulses during major transitions

Palette:
- black
- stone / marble
- muted gold
- deep red

Do not turn it into rainbow RGB cyberpunk.

Start with **one custom shader pass**, but keep the shader architecture extensible so more passes can be added later if genuinely needed.

## Scroll-Reactive Shader

The shader should be calm during normal scrolling and react to the cinematic timeline.

Normal:
- subtle treatment

Scene transition:
- distortion rises
- temporal feedback rises
- spectral separation can briefly increase

Major event:
- short glitch pulse

After transition:
- effects settle back down

The shader should feel integrated with the cinematic movement rather than permanently screaming “glitch.”

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

Do not hard-code final prose into animation logic. Keep narrative content in data.

## Narrative Structure

Conceptual beats:

- INTRO: ZEUS + identity
- BEAT 01: statement about Zeus
- BEAT 02: domain / power
- BEAT 03: escalation
- BEAT 04: conflict / consequence
- BEAT 05: revelation
- END: large final statement

Final copy should be written after the interaction and visual timing work.

## Final Sequence

The cinematic ends in black as part of the master timeline:

```text
cinematic frame sequence
        ↓
increasing visual distortion
        ↓
visual / luminance collapse
        ↓
black
        ↓
brief visual silence
        ↓
large final statement
```

The ending should feel like a conclusion, not a video reaching its last frame.

## Suggested Structure

```text
src/
  components/
    ZeusHero/
      ZeusHero.tsx
      CinematicCanvas.tsx
      HeroCopy.tsx
      FinalStatement.tsx
  rendering/
    frameSequence.ts
    renderer.ts
    shader/
      mythicGlitch.glsl
  animation/
    cinematicTimeline.ts
    scrollConfig.ts
  data/
    narrative.ts
  styles/
```

This is guidance, not a reason to create abstractions for their own sake.

## Performance Rules

Priorities:
1. Smooth scrolling.
2. Stable frame playback.
3. Minimal React re-renders.
4. GPU-friendly shader work.
5. Efficient texture management.
6. Responsive rendering.

Do not put per-frame animation state into React state unless necessary. Prefer refs, Three.js state, and GSAP for animation-critical values.

Do not trigger React renders every frame.

## Responsive Behavior

Desktop is the primary target.

Smaller screens should degrade gracefully. If needed:
- reduce frame resolution
- reduce shader intensity
- simplify effects
- adjust typography
- alter scroll distance

Do not create a separate mobile experience unless required.

## Design Rules

### Do
- Keep composition sparse.
- Let imagery breathe.
- Use large typography.
- Use black as negative space.
- Make transitions deliberate.
- Keep the shader subtle most of the time.
- Let glitch peak only at meaningful moments.
- Treat generated frames as raw artistic material.

### Do not
- Add unnecessary UI.
- Add navigation unless requested.
- Add cards.
- Add generic glassmorphism.
- Add neon cyberpunk colors.
- Add random glitch effects.
- Add excessive particles.
- Add unnecessary 3D geometry.
- Turn this into a conventional multi-section portfolio site.
- Add long explanatory paragraphs.

## Implementation Phases

### Phase 0 — Foundation
- React + TypeScript + Vite
- Three.js canvas
- GSAP + ScrollTrigger
- project structure
- frame asset discovery

### Phase 1 — Frame Renderer
- WebP loading
- texture management
- frame selection
- fullscreen responsive rendering

### Phase 2 — Scroll Cinematic
- pinned ScrollTrigger
- master timeline
- continuous frame progression
- intro copy transition

### Phase 3 — Narrative Beats
- copy data model
- beat timing
- text transitions
- final statement

### Phase 4 — Mythic Glitch Shader
- base treatment
- grain
- dithering
- distortion
- temporal feedback
- restrained spectral separation
- scroll/timeline-reactive intensity

### Phase 5 — Final Transition
- cinematic collapse to black
- final statement reveal
- scroll sequence termination

### Phase 6 — Polish
- typography
- timing
- performance
- responsive behavior
- loading experience
- visual consistency

## Definition of Done

The experiment is successful when:
- Zeus is visible immediately on load.
- Intro copy is present without interaction.
- Scrolling naturally drives the frame sequence.
- The sequence feels continuous rather than section-based.
- Narrative copy appears at intentional moments.
- Shader treatment makes the imagery feel authored rather than raw AI footage.
- Glitch behavior is restrained except at meaningful transitions.
- The sequence ends cleanly in black.
- A large final statement concludes the experience.
- The implementation remains understandable and maintainable.
- The result feels like an artistic WebGL experiment, not a video player with effects.

## Agent Rules

1. Preserve the locked creative direction unless explicitly instructed otherwise.
2. Inspect existing implementation before introducing architecture.
3. Prefer small, composable changes.
4. Never replace the frame-sequence approach with video without explicit approval.
5. Avoid React state in animation-critical loops without justification.
6. Avoid dependencies for effects that can be implemented cleanly with the existing stack.
7. Do not add effects merely because they are technically possible.
8. Every effect must support the mythic-glitch visual language.
9. Keep the project focused on the hero experiment.
10. Test the actual scroll experience after major animation changes.

The test for every addition is:

> Does this make the experience feel more authored?

If not, do not add it.
