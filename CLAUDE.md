# World Cup 2026 Bracket

A bracket tracker for playing the 2026 World Cup out as FIFA video-game matches with friends. Tim adds the people playing, enters each match score, and the app builds group standings, the knockout bracket and per-player stats (record, win %, goals, head-to-head). Used on his iPhone and laptop. No accounts, no backend.

- **Live:** https://timothyhadfield.github.io/world-cup-bracket/
- **Repo:** TimothyHadfield/world-cup-bracket (public), branch `main`
- **Handoff file:** `progress.md` (state, traps, NOT verified)

## File map
- `index.html`: the whole app. CSS in `<style>`, plain JS in one `<script>` at the bottom. Sections in the script:
  - data: `worldCupGroups` (12 groups x 4 teams, slot 4 of each is `'TBD'`), `flags` (emoji), `gameState`
  - init: `initializeGroupMatches` (72 matches, ids `G1`..`G72`), `initializeStandings`, `initializeKnockout` (ids `R32_1..12`, `R16_1..6`, `QF_1..3`, `SF_1`, `3RD`, `FINAL`)
  - rendering: `renderAll` re-renders every tab from `gameState` (it also refreshes R32 teams from the standings). `renderGroupMatches` keeps scores typed into unfinished cards; `clearTypedScores` empties them on reset/load
  - actions: `submitMatch`/`resetMatch` (group), `submitKnockoutMatch`/`resetKnockoutMatch` (modal), `updateStandings`/`reverseStandings`, `updateKnockoutProgression`
  - persistence: `saveData`, `loadData`, `loadProgress` (Load button), `resetAll`
- `docs/phone-view-checks.js`: regression checks (see Test).
- `README.md`: the public showcase page. `docs/screenshots/*.png`: its images (made-up players).

## Data
- Everything lives in `localStorage` key `worldcup2026` as JSON of `gameState` (`players`, `groupMatches`, `knockoutMatches`, `standings`).
- Nothing saves automatically: only the **Save Progress** button writes. The page loads the saved copy on open.
- Standings are kept as running totals (not recomputed from matches). Any code that changes a finished group result must call `reverseStandings` with the old scores first.

## Run locally
```
python -m http.server 8120     # from the repo folder, background option
```
Then open http://localhost:8120/ or use `node ~/.claude/tools/phone-view.mjs http://localhost:8120/ --out shot.png` (`--desktop` for laptop width). Tabs are buttons: `--do "click:.tab-btn:nth-child(2)"` is Group Stage, 3 Knockout, 4 Statistics.

## Test
No test suite and no build step. Verify with phone-view `--eval` scripts that call the page's own functions (`submitMatch('G1')`, `openKnockoutModal('R32_1')`, ...) and read `gameState`. Regression checks for the 2026-10-16 fixes are in `docs/phone-view-checks.js` (run command at its top; it fails on the pre-fix build and passes now): group re-submit, removed player in head-to-head, names with `'` or `<`, Load button, R32 slot clearing, knockout reset, typed scores kept across a submit.

## Deploy
GitHub Pages from `main` (root). Push to `main` and Pages rebuilds in about a minute; check with `python ~/.claude/hooks/live-check.py <repo folder>`.

## Traps
- Player names are user text: always pass them through `escapeHtml()` when building HTML (and `playerOptions()` for dropdowns). Inline `onclick` handlers use the player's index, never the name, so names with quotes work.
- Flags are emoji. On Windows headless WebKit they render as letters ("US"); on the iPhone they are flags. Not a bug.
- The knockout bracket is the app's own 24-team design (12 R32 matches, 3 QFs, QF_3 winner goes straight to the final, third place is SF_1 loser vs QF_3 loser). It is not FIFA's real 2026 format. Don't "fix" it without Tim.
- Group line-ups are a placeholder draw (each group's fourth team is `TBD`). Changing teams changes saved games' meaning: Tim's call.
- `#groups-tab` is very tall on a phone (about 32,000 px), so `--full` phone screenshots of it fail (WebKit limit 32,767 px). Use viewport shots or `--eval` measurements.
- Grids use `minmax(min(Npx, 100%), 1fr)` so phones narrower than 390px don't scroll sideways. Keep the `min()`.

## Standing instructions
- Tim's global orders in `~/.claude/CLAUDE.md` apply. No project-specific quotes from Tim are recorded yet.
- Looks, wording, layout, team list and bracket rules are Tim's. Bug fixes must leave the screen pixel-identical unless he asks.
