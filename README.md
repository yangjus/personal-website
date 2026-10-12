# Justin Yang — cinematic portfolio

A Next.js App Router portfolio built with React, TypeScript, Tailwind CSS, Framer Motion, Lenis, Anime.js, and Three.js. The rotating cartoon Earth uses accurate Natural Earth coastlines, a single mint land color, and soft cel shading. The site uses Justin’s existing project screenshots, career history, portrait, and social links.

## Run locally

Use Node 22.12+ (or Node 20.19+).

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` followed by `npm start`. Deploy to a Next.js-compatible host, such as Vercel or a Node server.

Production: [justin-yang.vercel.app](https://justin-yang.vercel.app).

To deploy the linked Vercel project from this directory, run `npx vercel deploy --prod`. The `.vercelignore` file excludes local build caches, verification screenshots, tests, and the archived prototype from uploads.

## Experience

- Living cartoon Earth with clean continents, animated coastal tidal bands, billowy cloud banks, and orbiting seagulls with flapping wings. A geographically positioned New York City pin marks Justin’s home base. Drag the globe freely in any direction; release it to coast with Anime.js easing. Arrow keys rotate it and Home returns to New York City.
- The leave-orbit transition gently shrinks the Earth, drifts it upward, and fades it against slower-moving stars as you scroll. It reverses on upward scroll, works with the CSS globe on touch devices, and stays still for reduced motion. The hidden WebGL scene stops rendering after its fade.
- Different scroll speeds for the hero, project screenshots, portrait, and contact atmosphere.
- Filterable project chapters, expandable build notes, a single-open experience accordion, and responsive navigation. Amazon leads the updated career history; Capital One’s two internships share one entry with separate dates, locations, and accomplishments.
- Linked company wordmarks with hover and keyboard focus reactions, plus six technology groups spanning languages, web/mobile, backend/data, AWS infrastructure, delivery, and AI integrations.
- Local fonts, optimized Next.js project images, lazy-loaded Three.js, capped pixel density, a tightly cropped canvas, instanced clouds and birds, and tides rendered directly in the ocean shader without extra draw calls. The globe renders at up to 30 FPS while idle and 60 FPS during interaction; Anime.js shares its animation clock. Rendering pauses outside the hero and in hidden tabs.
- Reduced motion disables smooth scroll and WebGL. Touch-only devices use a lightweight CSS Earth with a single land color, gently pulsing coastal washes, drifting clouds, and flying gulls. This also works when WebGL cannot initialize; reduced motion keeps these layers still.
- Keyboard focus indicators, labeled controls, a skip link, and responsive layouts.
- Interactive footer rocket with a click-to-launch hint, smoke at lift-off, animated flames and embers, and a particle-based return. The launch resets after five seconds, supports touch and keyboard activation, and uses a short fade for reduced motion.

The Higgsfield playground and its backend integration have been removed as requested. No generation services or API credentials are needed.

## Content and styling

- `src/data/siteContent.ts` — career content, project sources, and real social links.
- `src/components/Projects.tsx` — concise case-study presentation and build notes.
- `src/components/Portfolio.tsx` — about, toolkit, experience, and contact.
- `src/app/globals.css` — art direction, responsive layouts, and motion fallbacks.
- `src/scene/Earth.tsx` — WebGL scene, wave shader, drag/keyboard controls, and resource cleanup.
- `src/scene/EarthLife.ts` — instanced cloud banks and animated seagulls.
- `src/scene/EarthLocation.ts` — New York City pin, projection, and visibility.
- `src/components/Hero.tsx` — leave-orbit scroll transition and layered stars.
- `src/scene/rocketFlight.ts` and `src/scene/rocketParticles.ts` — rocket flight, exhaust, and particle assembly.
- `scripts/build-earth-map.py` — reproducible geographic texture and fallback asset generator.
- `scripts/build-earth-tides.mjs` — coastline distance texture for the tidal shader.
- `archive/vite-prototype/` — preserved previous prototype, excluded from the current build.

Contact uses Justin’s existing LinkedIn profile; no email address was invented.

## Verification

```sh
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm test
```

Playwright covers navigation and browser errors, project filtering and build notes, the experience accordion, touch-device navigation and overflow at 320/390/768 pixels, and reduced motion.

## Earth assets

The coastlines are derived from the public-domain [Natural Earth 1:110m land dataset](https://www.naturalearthdata.com/), bundled in `scripts/data/ne_110m_land.geojson`. Run `python3 scripts/build-earth-map.py` followed by `node scripts/build-earth-tides.mjs` to regenerate the uniform surface, ocean mask, coastal wash texture, NYC fallback pin, and coast-distance PNG. Only generated textures are loaded in the browser; the geographic source stays offline. Cloud and bird artwork is original. See `public/images/earth/SOURCES.md` for provenance of the retained earlier NASA textures. No runtime AI service is connected.
