# MG Candy Blast

**Match • Blast • Win!** — a colourful match-3 candy puzzle game for phones, tablets and desktop browsers.
Plain HTML5 + CSS + vanilla JavaScript: no frameworks, no accounts, no ads, works offline once loaded.
Made by **MG Cowbell** (MGCowbell / MGTECH), Ghana.

> Play it: after you publish (see [docs/PUBLISHING.md](docs/PUBLISHING.md)) the game lives at
> `https://<your-github-name>.github.io/<repository-name>/`

## Features
- **1,000+ levels** in **20 themed worlds** (50 levels each; the worlds then repeat as "Lap 2", "Lap 3"…). Levels are generated from the level number, so they never change, and each one is validated before it can be played.
- **Goals**: reach a score, collect candies, clear jelly, remove chocolate, break wooden boxes and crates, free frozen candies, create special candies, and mixed goals. A **challenge level** closes every world (Candy Monster, Chocolate Castle, Ice Queen, Giant Candy Crusher, Rainbow Guardian).
- **Blockers**: wooden boxes (1–3 hits), crates (2–4 hits, durability shown), frozen candies (1–3 layers), chocolate, jelly, and immovable stone.
- **Special candies**: striped, wrapped, colour bomb, and cross-blast (6 in a line), plus special + special combinations.
- **Boosters**: Hammer, Striped, Colour Bomb, Hand, Extra Moves, Shuffle, Row Blaster, Area Bomb.
- Daily rewards, daily challenges, achievements, lucky spin, shop (in-game coins only), lives, high scores, tutorial.
- Voice announcements that read the on-screen messages (device speech engine, or your own recordings), separate music / effects / voice volumes.
- Android friendly: portrait layout, safe areas, back-button handling, auto-pause, offline cache (service worker).

### The win rule
`WIN_RULE` at the top of [`levels.js`](levels.js):
- `'both'` (default): a level is won the moment **all tasks are done AND the 3-star score is reached**, even with moves left. If moves run out first → Game Over. One or two stars never complete a level.
- `'either'`: tasks **or** three stars complete the level.

## Run it
- **Quick test**: open `MG-Candy-Blast-single.html` in Chrome (everything is inside that one file). Rebuild it with `node tools/build-single.js`.
- **Full project**: `python3 -m http.server 8080` (or `npm run serve`), then open `http://localhost:8080`.

## Publish on GitHub (summary)
1. Create a repository, upload this folder, push to `main`.
2. Settings → Pages → Source: **GitHub Actions**. The included workflow deploys the game.
3. Open the Pages link. Full walkthrough: [docs/PUBLISHING.md](docs/PUBLISHING.md).

## Project layout
| Path | What it is |
|---|---|
| `index.html`, `style.css` | page shell and styling |
| `engine.js` | pure match-3 rules (matches, specials, blockers, gravity, shuffle) |
| `levels.js`, `level-tuning.js` | level generator for 1,000+ levels, validator, difficulty tuning data |
| `game.js` | board drawing, input, animations, boosters, win / lose |
| `ui.js` | menus, level map, worlds, settings, rewards, tutorial |
| `art.js`, `effects.js`, `audio.js`, `storage.js` | procedural art, particles/messages, sound + voice, save data |
| `service-worker.js`, `manifest.json` | offline cache and installable web app |
| `assets/` | icons, home artwork, voice-file instructions |
| `tools/` | level validator, bot simulator, difficulty calibrator, single-file builder |
| `tests/` | Node unit tests and Playwright browser tests |
| `docs/` | publishing guide, level system, architecture |

## Testing
```
npm test                 # engine + obstacle unit tests, validation of all 1,000 level configs
npm run test:browser     # needs: pip install playwright && playwright install chromium
```
Level reports: `node tools/validate-levels.js 1 1000 8` (see [docs/LEVELS.md](docs/LEVELS.md)). A bot win proves a level can be won; a bot loss only flags a level for review — it is not proof that it is impossible.

## Known limits
- Not tested on real Android hardware (headless desktop Chromium only).
- Voice is synthetic (device speech engine) unless you add recordings (`assets/voice/README.txt`).
- Not implemented from the wish-list: candy chains, sugar walls, mystery boxes, lightning / area / rainbow special candies, candy themes, bonus levels, key/gate and region goals.
- Daily limits use the phone's clock (no server), so they can be bypassed by changing the clock.
- Difficulty is calibrated with a simple bot; real players will differ.

## Licence
MIT for the code (see [LICENSE](LICENSE)). The artwork in `assets/images/home.jpg` was supplied by the project owner.
