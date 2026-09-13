# Infrastructure Archive

A first-person infrastructure lab for exploring a future GitHub study archive.

## Current Status

The local development version contains a fullscreen 3D lab, mouse-look, WASD movement, Space jumping, static collision and an E-operated door leading through a corridor to a Linux room. The door stays open after activation. ESC pauses and releases the mouse. Actual repository contents and archive boxes are not connected yet.

Legacy terminal JSX files remain as migration references; the active entry point is src/main.tsx. See docs/ARCHITECTURE.md for the longer-term design. Changes appear on the public site only after pushing main and a successful deployment.

## Tech Stack

- Vite
- React
- TypeScript (strict for the new application)
- Three.js / React Three Fiber
- CSS
- GitHub REST API (planned)
- GitHub Pages

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run lint
npm run build
node --experimental-strip-types --test tests/physics.test.ts
```

Production builds are deployed to [kidcalmboy.github.io](https://kidcalmboy.github.io/) with GitHub Actions.

## Roadmap

- Add archive boxes and a Markdown document viewer
- Generate content from explicitly configured public study repositories
- Provide accessible document mode and mobile navigation
- Measure rendering performance and improve assets
