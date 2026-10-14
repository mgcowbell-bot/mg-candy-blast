# Architecture
- **engine.js** – no DOM. `Board` holds candies, jelly, chocolate, boxes, crates, stone and ice layers. Key methods: `fill`, `findMatches`, `expand` (special candy chains), `combo`, `clear` (one hit per blocker per step), `collapse` (gravity + refill), `moves`/`valid`, `shuffle`.
- **game.js** – drawing (canvas), pointer/keyboard input, tweened animations, `resolve` loop (match → clear → fall → repeat), boosters, `win`/`lose` (guarded so each can happen once), watchdog + error recovery.
- **ui.js** – screens and dialogs built from small HTML templates; back-button handling; loading screen with error/Retry.
- **art.js** – all candy, blocker, scenery and logo art is drawn with canvas/SVG code (no image files except the home artwork).
- **audio.js** – Web Audio synthesised sounds, music loop, voice announcements (speech engine or recordings).
- **storage.js** – versioned save data in `localStorage` with sanitising and migration of old saves.
