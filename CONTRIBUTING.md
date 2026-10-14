# Contributing
1. Fork, create a branch, make your change.
2. Run `npm test` (and `npm run test:browser` if you changed gameplay or screens).
3. If you change level generation, run `node tools/validate-levels.js 1 1000 8` and keep "invalid" at 0.
4. Open a pull request describing what changed and how you tested it.
