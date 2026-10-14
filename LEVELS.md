# Level system

- `levels.js` builds level *n* from its number with a seeded random generator, so a level is always the same.
- 20 worlds × 50 levels. Level 50, 100, 150… are **challenge levels** (hand-designed layouts). After level 1000 the worlds repeat ("Lap 2").
- Each level has: board size (7×7, 7×9, 8×8), move limit, goals, blockers, jelly, star thresholds, boosters allowed, theme.
- **Win rule**: see `WIN_RULE` in `levels.js` (default `'both'`: all tasks done AND the 3-star score reached).
- `validateLevel(config)` checks sizes, candy types, move limits, star order, blocker positions/overlaps, goals that have something to do, collect counts, challenge data. A level that fails is replaced by a simplified version and logged — an invalid level can never silently reach the map.
- `level-tuning.js` stores per-level move / score adjustments produced by `tools/calibrate.js`.
- Levels are built lazily (only when opened) and cached; the map only draws unlocked levels plus a few ahead.

## Validation and simulation
```
node tools/validate-levels.js 1 1000 8      # validation + bot simulation, summary in the console
node tools/calibrate.js 1 1000 10 5 out.json  # tune difficulty (merge the result into level-tuning.js)
```
`reports/level-report.json` is the last full report. The bot is a simple greedy player with no boosters. If it wins a level, that level **is** winnable; if it never wins, the level is only *flagged* for review.
