# progress.md: World Cup 2026 Bracket

## START HERE
Last updated 2026-10-16. Read order: this file, then `CLAUDE.md` (file map, run, test, traps). There is no `chat.md` yet.

## Goal right now
None set by Tim. The app is finished and published; work only happens when Tim asks.

## Status
| Area | State |
|---|---|
| App (`index.html`) | Live at https://timothyhadfield.github.io/world-cup-bracket/ |
| Tests | None (single HTML file). Verified with phone-view `--eval` scripts |
| Data | Browser `localStorage` only (`worldcup2026`); no accounts, no backend |
| 2026-10-16 sweep | 8 bugs fixed, accessibility labels added, CLAUDE.md + this file created |

## Authorized next steps
None.

## Standing instructions
- No project-specific quotes from Tim recorded yet. Global orders in `~/.claude/CLAUDE.md` apply.

## Traps
- See `CLAUDE.md` Traps (escape player names, emoji flags look like letters in Windows WebKit, the custom 24-team bracket, very tall Group Stage tab on phone).

## Decisions
- 2026-10-16 (sweep, no Tim input): fixed clear defects only, all pixel-neutral at 393px and 1440px (layout fingerprint identical to the live build): group re-submit double-counted standings; removing a player who had played crashed the Statistics tab; names with `'` couldn't be removed and names with `<` rendered as HTML; Load Progress button did nothing visible; R32 slot kept a team after its group was reset; knockout reset left the winner in the next round; scores typed in other cards were wiped when any match was submitted; sideways scroll on phones narrower than 390px.
- 2026-10-17 (fix wave, Tim's "no browser dialogs" rule): Reset All now asks in an in-page dialog (`appConfirm`, reuses the knockout modal box; Cancel grey, OK red like Reset All) instead of the browser `confirm()`. Cancel/Escape/backdrop reset nothing, OK/Enter reset as before. Checks H in `docs/phone-view-checks.js`.
- 2026-10-16: added meta description, empty favicon (stops a 404), aria-labels on inputs/selects/close and remove buttons.

## NOT verified
- Real iPhone (only Safari's engine via phone-view, iPhone 15 and iPhone SE sizes).
- Saved games from before 2026-10-16 that already contain a double-counted standing are not repaired (standings are running totals, so a reset only removes one copy). Recomputing standings from the matches on load would repair them: not built, Tim's call.

## For Tim (open judgment calls, from the 2026-10-16 sweep)
- Bracket format and the `TBD` fourth team in each group are not FIFA's real 2026 draw.
- Nothing autosaves; closing the tab without Save Progress loses the session.
- Statistics table headers are cut to "Pl...", "W..." on a phone.

## Rejected / parked
- (none)
