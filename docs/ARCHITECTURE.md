# Infrastructure Archive: implementation design

## Implementation update

The active local experience now uses fullscreen FPS controls, jumping with gravity and static AABB collisions. This deliberately small flat-world controller is the current implementation; Rapier remains a future option for dynamic bodies. E raycasts the closest visible surface within 2.5m, opening a rising door. Its collision bounds update before the player step. Doors remain open to avoid closing on occupants. The lobby now connects through a corridor to a Linux room shell. Markdown, archive boxes, mobile document mode and additional rooms remain planned. Jumping supersedes the original no-jump design below. Legacy terminal sources are retained but inactive.

## Scope and delivery

Replace the terminal experience with a first-person infrastructure archive. GitHub Pages remains the hosting provider. Phase 1 introduces a strict TypeScript entry point and a static, lazy-loaded R3F scene. Existing JSX terminal files are legacy references and are not imported by the new entry point. They are outside the TypeScript migration boundary.

The first complete journey is Landing → Lobby → Corridor → Linux Room → Archive Box → Markdown Viewer. Six category labels do not imply that six rooms or study repositories are implemented.

## Architecture

DOM shell (landing, menu, documents) → game session controller → lazy R3F Canvas.
Canvas owns rendering, Rapier owns collisions, a player controller owns movement, and interaction resolves typed actions by object ID. Both game mode and document mode consume the same generated content manifest. No GitHub fetch belongs inside a mesh or room component.

## Stack and installation schedule

Phase 1: existing React 19.2.8 and Vite, TypeScript strict, Three.js, React Three Fiber 9, TypeScript ESLint. React is pinned within Fiber's peer support range.
Phase 2: Drei controls and Zustand. Phase 3: @react-three/rapier, after checking installed peers. UI phases: Tailwind CSS for DOM tokens/layout; Motion only for overlays that need it. Phase 8: react-markdown, remark-gfm and rehype-highlight. Do not add unused dependencies ahead of their phase.

## Intended directories

```text
src/
  App.tsx, main.tsx
  config/          game constants, profile settings
  components/game/ Canvas lifecycle, loading and error boundary
  components/ui/   landing, pause menu, HUD
  components/documents/ Markdown viewer and file list
  world/           layout generator, lobby, corridor, room shells
  player/          controller, input, camera and raycast
  objects/         Door, ArchiveBox, Computer
  data/            room source mappings and content types
  store/           session state and UI actions
  pages/           document mode
  styles/          shared tokens and document styles
scripts/           content generation and static archive pages
public/models/     optimized GLB assets
public/textures/   WebP or KTX2 textures
public/data/       generated manifest and separate documents
docs/              architecture, asset license ledger, performance results
```

Directories are added as used. Phase 1 EnvironmentPreview is a disposable visual study, not the final navigable map.

## World layout

One metre equals one world unit. Flat floor; no stairs or jumping. Lobby connects to a central corridor with room sockets. MVP fills one socket with Linux; subsequent room definitions reuse shells with themed props. Geometry placement belongs to a layout definition, not repository paths. Validate non-overlapping sockets, passable doors and safe spawn positions when creating the collision phase.

RoomDefinition contains ID, number, title, virtual folder and nullable source mapping {owner, repository, ref, path}. Layout adds position, rotation, bounds and spawn. Generated BoxDefinition refers to subfolder IDs; DocumentDefinition refers to content paths and original GitHub URLs. Long folder lists use shelves/pages instead of unbounded geometry. Stable IDs retain references when display labels change.

## Session state

Use loading, landing, exploring, paused, reading and error as mutually exclusive modes. Store current room ID, selected object/document ID, soundEnabled=false and quality preference in Zustand. Do not store per-frame vectors there. Player transforms and velocity live in refs/physics. Opening a document clears held keys and exits Pointer Lock. Closing returns to paused; a user click requests lock again. Only pointerlockchange confirming acquisition enters exploring. Handle denied lock, tab blur and context loss explicitly.

## Player and interaction

Capsule-based Rapier character controller; 3.5m/s walking, gravity, no jump. Normalize diagonals and use fixed physics steps; cap large frame deltas. Resolve walls and sliding via collider queries. Camera follows eye height without applying React state updates each frame.

Raycast from screen centre with 2.5m maximum range. Intersect blockers and interactive surfaces together; choose the nearest visible hit. Register {id, type, title, actionKind}; resolve actions in a dispatcher rather than placing closures in serialized content. E consumes one key press. Doors animate a collider consistently with visible geometry. A reading overlay stops physics input. Fast travel resets velocity to a validated spawn.

## Content generation

Build-time Node script reads explicitly configured public GitHub sources. Resolve ref to a commit SHA and record it in manifest. Traverse folder metadata, fetch supported Markdown and enforce document count/size limits. Emit manifest plus separate Markdown files so initial load does not download the entire archive. Null source generates a clear empty state. Configured-source failures fail the build with a useful error rather than silently publishing missing content. Preserve the last successful deployed site.

Use the Actions token only in the build environment when appropriate, never a VITE variable or browser bundle. Handle pagination, rate limits, renamed files and non-Markdown entries. Study updates trigger a manual content build initially; later optionally use a schedule or repository_dispatch. No repository name or profile facts are invented.

## Documents, mobile and SEO

react-markdown renders headings, tables, lists, code and images; highlighting uses an explicit language subset. Disable raw HTML. Validate URL protocols and resolve links/images against source commit/path. Links to another Markdown file open its document; external links use safe target attributes.

Viewer is a labelled accessible dialog with focus trap, restored focus and keyboard close. Mobile defaults to document mode with optional 3D preview; virtual controls are a later enhancement. Generate /archive/<room>/<document>/index.html at build time, including actual sanitized content and metadata, so Pages deep links need no server rewrites. Rendering Markdown only after a click is not the SEO solution.

## Graphics and assets

Concrete grey, charcoal, off-white with muted green/blue/amber. Bright, legible architecture; no cyberpunk neon. Modular PBR materials; standard material by default, physical material only when visually justified. GLB manifest records author, source URL, license, attribution, dimensions and compression. No unlicensed ripped game assets. Shared geometry and materials, instanced repeated equipment; KTX2 and Draco only when corresponding assets and decoders exist. Phase 1 has no downloaded models/textures to compress.

## Performance budget and validation

Target 60 FPS desktop, 45–60 FPS midrange laptop; these are goals, not measured claims. Start with DPR ≤1.5, one 1024 shadow map and demand rendering for the static preview. Exploration uses a continuous loop only while active. Preload the next room on approach, not all rooms at entry. Use LOD for detailed distant props and instancing for repetition. Initial compressed 3D payload target ≤5MB, initial textures ≤1024px unless justified, profile draw calls and GPU time on real hardware. Keep document mode available without Canvas. Sound is OFF by default and only resumes after a user gesture.

## MVP phases and acceptance

1. TypeScript/R3F foundation: DOM loads before 3D; preview click loads Canvas; strict check/lint/build pass; WebGL error has a fallback.
2. FPS: click enters Pointer Lock, WASD/mouse work; ESC/blur clear inputs.
3. Collision: no wall passage, diagonal speed boost or fall-through.
4. Lobby/corridor: readable directory, signs and coherent scale.
5. Door: E at range, animation and collider agree; no through-wall activation.
6. Linux room: recognisable sysadmin workspace and safe paths.
7. Boxes: folder mapping, inspect action, empty state.
8. Viewer: Markdown/code/tables/images, focus management and paused movement.
9. Content: real repository mapping, build generation, failure handling, document routes.
10. Expand rooms using data.
11–13. Assets, lighting, optional sound/animation, measured optimization.
14. Publish complete MVP through existing Actions → dist → Pages pipeline.

Deploying Phase 1 is optional; implementation alone does not replace the currently published portfolio. Future build retains base=/ for the user site. No backend runtime or server routes are required.
