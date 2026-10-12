# Portfolio Handover

Last updated: August 16, 2026

## Project snapshot

This repo is the in-progress rebuild of Justin Yang's portfolio.

Current concept:

- A scroll-driven "futuristic city drive" experience
- The visitor feels like they are moving forward through a neon city at night
- Each major portfolio chapter appears like a stop along the route
- The background is currently a high-performance layered CSS parallax scene
- Smooth scrolling and motion orchestration now use Lenis + GSAP ScrollTrigger

This is not yet the final visual direction, but it is now on a stronger motion architecture than the earlier drafts.

## Current stack

- Vite
- React
- TypeScript
- GSAP
- GSAP ScrollTrigger
- Lenis

Installed but not currently active in the rendered app:

- three
- @react-three/fiber
- @react-three/drei
- @react-three/postprocessing

Those Three.js packages were added earlier and can be reused for the next phase if the background is upgraded from CSS parallax to a real WebGL city scene.

## What exists now

### Motion system

The app now uses:

- `Lenis` for smooth scroll timing
- `GSAP ScrollTrigger` for scrubbed motion and section reveals

This replaces the earlier approach that depended on React scroll state for scene movement.

### Visual concept

The background currently includes:

- night sky glow
- far skyline layer
- mid skyline layer
- road horizon
- perspective road grid
- lane light trails
- floating city signs

The content panels alternate left/right so they feel like route stops.

### Content structure

The portfolio content is still data-driven and lives in one source file. Experience, projects, about copy, and links are all separated from presentation logic.

## Important files

### App and layout

- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/SectionShell.tsx`
- `src/components/ProjectCard.tsx`

### Motion

- `src/hooks/useSmoothScroll.ts`
- `src/hooks/useCityDriveMotion.ts`
- `src/hooks/usePrefersReducedMotion.ts`

### Content

- `src/data/siteContent.ts`

### Styling

- `src/index.css`

### Assets

- `public/images/headshot.jpg`
- `public/images/projects/*`

### Older experimental file

- `src/scene/PortfolioScene.tsx`

This file is from the earlier React Three Fiber prototype and is not currently used by `src/App.tsx`.

## How to run

From the project root:

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Current build status as of August 16, 2026:

- `npm run build` passes

## Design decisions already made

1. Keep the portfolio content in HTML, not inside WebGL text.
2. Keep navigation usable and recruiter-friendly.
3. Use scroll progress to support a guided narrative, not just visual effects.
4. Avoid generic developer portfolio tropes like floating laptops or random particles with no purpose.
5. Move to a real smooth-scroll system now so later Three.js work does not need to be retrofitted awkwardly.

## Biggest current limitations

1. The city is still a layered CSS illusion, not a true 3D city.
2. The route stops are visually closer to strong concept panels than fully cinematic "arrivals."
3. The motion is improved, but the illusion of driving can still be pushed much further.
4. Some older dependencies remain from previous experiments and are not yet cleaned up.

## Recommended next steps

### Option A: Push the current CSS concept further

Best if the goal is speed and a lighter build.

Suggested work:

- add stronger arrival animations for each stop
- reduce how many cards are visible at once
- add foreground silhouettes like windshield framing, dash reflections, or overhead rails
- introduce light weather, haze, or scanline details carefully

### Option B: Upgrade the background to Three.js

Best if the goal is a true premium cinematic experience.

Suggested work:

- keep Lenis + ScrollTrigger as the motion backbone
- replace the CSS city layers with a real Three.js street/city scene
- map ScrollTrigger progress to camera position, camera target, and environmental lighting
- treat each section as a physical stop in the scene

If this happens, the old `src/scene/PortfolioScene.tsx` file can be used as a rough starting point, but it should probably be rebuilt around the new city-drive concept instead of reused as-is.

## Suggested implementation plan for the next agent

1. Decide whether the next pass stays CSS-based or moves to Three.js.
2. If staying CSS-based, focus on stronger stop choreography and foreground driving cues.
3. If moving to Three.js, keep Lenis + ScrollTrigger and build a simple graybox road/city scene first.
4. Tighten the hero copy once the visual direction is locked.
5. After the scene feels right, refine the experience/project panels so they feel integrated with the route.

## Notes on source material

This project was originally informed by:

- Justin's existing GitHub Pages portfolio content
- the attached portfolio handoff doc
- later visual pivots requested in chat, including:
  - scenic image-led concept
  - Igloo-inspired minimal concept
  - current futuristic city driving concept

The current version reflects the latest requested direction:

- parallax scrolling
- futuristic city background
- first-person motion through the streets
- portfolio sections appearing as stops along the route

## Short summary for the next person

The repo is in a decent transition state.

The content model is clean.
The motion architecture is much better than before.
The visual concept is now aligned around a city-drive experience.

The next real decision is whether to:

- keep finessing the CSS-based fake-3D version
- or move the background into a real Three.js scene while preserving the new Lenis + ScrollTrigger setup
