# JOURNEY — Independent Editorial Monograph

> **Skill Showcase & Frontend Craft Demonstration**  
> *This repository is a non-commercial, fictional digital editorial publication created as an Awwwards-caliber resume and portfolio demonstration to showcase elite frontend animation, layout discipline, and interactive choreography.*

---

## Live Demonstration

Explore the live publication on GitHub Pages:  
**[https://ghostbat101.github.io/JOURNEY/](https://ghostbat101.github.io/JOURNEY/)**

---

## Creative Direction: Analog Photography Meets Digital Choreography

**JOURNEY** marries the tactile warmth and deliberate pacing of a large-format physical print monograph with cutting-edge frontend engineering. Text and elements remain sparse, poetic, and disciplined, allowing motion craft and typography to take center stage.

- **Surface Palette:** Warm tactile paper tones (`#fbf9f4`, `#f5f3ee`), deep highway asphalt (`#121311`), and vibrant silkscreen Cobalt Blue (`#1062b8`).
- **Typography Stack:** Monumental condensed display (`Anton`), contemporary grotesque reading text (`Hanken Grotesk`), and tabular monospaced metadata (`JetBrains Mono`).
- **Tactile Grain:** Procedural 35mm film grain generated on a lightweight, non-blocking HTML5 canvas running at 60fps.

---

## Interactive Choreography & Motion Architecture

1. **Scene 01: Masthead & Hero:** Pinned 220vh viewport sequence featuring staggered masked word lifts through overflow containers, camera zoom, and floating GPS coordinates.
2. **Scene 02: Typography Interlude 1:** Dark asphalt kinetic speed ticker with scrubbed velocity skew.
3. **Scene 03: Featured Coastal Dispatch:** Pinned 280vh Big Sur sequence featuring a multi-stage polygon `clip-path` wipe revealing ocean swells, exposure specs, and field notes.
4. **Scene 04: Pinned Horizontal Stories:** 360vh horizontal story track scrub moving 4 photographic dispatches sideways with multi-depth parallax and scale transitions.
5. **Scene 05: Typography Interlude 2:** Reverse typographic ribbon in terracotta and rust.
6. **Scene 06: Perspective Vanishing Highway:** 260vh desert vanishing-point vector simulation with approaching roadside landmark waypoints (*Red Mesa Trading Post*, *Timberline Junction*).
7. **Scene 07: Topography & Route Topologies:** Procedural SVG vector route line drawing synchronized with interactive corridor hover states and coordinate readouts.
8. **Scene 08: Photo Essay Lookbook & Matter.js 2D Physics:** Horizontal drag-and-swipe contact sheet paired with a real-time Matter.js 2D rigid-body sandbox: collectible roadside motel keytags, Route 66 stamps, and Pacific badges that tumble, collide, and can be tossed with the mouse.
9. **Scene 09: Journal Dispatches:** 3 reflective essays framed with Swiss hairlines and reading-time metadata.
10. **Scene 10: Panoramic Resolution Outro:** Golden rolling hills expand in a pinned panoramic dissolve as the ambient `JOURNEY` brandmark resolves.
11. **Scene 11: Editorial Colophon & Footer:** Minimalist print colophon with publication specs, typography credits, and copyright.

---

## Technical Stack & Libraries

- **Styling:** Tailwind CSS (Utility-first styling with custom editorial tokens)
- **Smooth Scroll:** [Lenis](https://github.com/darkroomengineering/lenis) synchronized directly with GSAP's ticker (`lenis.raf(time * 1000)`)
- **Animation Choreography:** [GSAP 3.12+](https://greensock.com/gsap/) (ScrollTrigger, Draggable)
- **2D Rigid-Body Physics:** [Matter.js](https://brm.io/matter-js/)
- **Analog Texture:** HTML5 Canvas procedural film grain with throttled 32-bit pixel rendering
- **Interaction:** Custom magnetic loupe cursor follower with `gsap.quickTo`
- **Accessibility:** Full `@media (prefers-reduced-motion: reduce)` tiering unpinning timelines and gracefully degrading motion

---

## Local Development

Open `index.html` directly in any modern browser:

```powershell
Start-Process "index.html"
```

Or serve locally with any static HTTP server:

```powershell
npx serve .
```

---

## License & Credits

- Created by **GhostBat101** as an independent creative technology showcase.
- Photography sourced from [Unsplash](https://unsplash.com) under the Unsplash License.
