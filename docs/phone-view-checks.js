// Regression checks for the 2026-10-16 bug fixes. Run against a fresh page (phone-view uses a fresh profile):
//   node ~/.claude/tools/phone-view.mjs http://localhost:8120/ --eval "$(cat docs/phone-view-checks.js)"
// Keys ending in _should_be_X must equal X; *_ok / *_removed / *_shown_as_text / *_restores_list must be true.
(() => {
  const r = {};
  const setScore = (id, a, b) => { document.getElementById('score1-' + id).value = a; document.getElementById('score2-' + id).value = b; };
  // A: re-submitting a group match must not double-count standings
  try {
  setScore('G1', 2, 1); submitMatch('G1'); setScore('G1', 2, 1); submitMatch('G1');
  const usa = gameState.standings.A.find(t => t.team === 'USA');
  r.A_resubmit_played_should_be_1 = usa.played; r.A_points_should_be_3 = usa.points;
  resetMatch('G1');
  } catch (e) { r['A_section_error'] = e.message; }

  // B: removing a player who played a match must not crash the stats
  try {
  document.getElementById('new-player-name').value = 'Ann'; addPlayer();
  document.getElementById('new-player-name').value = 'Bob'; addPlayer();
  document.getElementById('new-player-name').value = 'Cat'; addPlayer();
  updateMatchPlayer('G2', 1, 'Ann'); updateMatchPlayer('G2', 2, 'Bob');
  setScore('G2', 1, 0); submitMatch('G2');
  try { removePlayer('Ann'); r.B_remove_player_ok = true; } catch (e) { r.B_remove_player_ok = 'CRASH: ' + e.message; }
  resetMatch('G2');
  } catch (e) { r['B_section_error'] = e.message; }

  // C: a name with an apostrophe can be removed with its x button
  try {
  document.getElementById('new-player-name').value = "O'Brien"; addPlayer();
  const tag = [...document.querySelectorAll('.player-tag')].find(t => t.textContent.includes("O'Brien"));
  try { tag.querySelector('.remove-player').click(); } catch (e) {}
  r.C_apostrophe_removed = !gameState.players.includes("O'Brien");
  } catch (e) { r['C_section_error'] = e.message; }

  // C2: a name with HTML is shown as text, not markup
  try {
  document.getElementById('new-player-name').value = '<b>Zed</b>'; addPlayer();
  r.C2_html_name_shown_as_text = [...document.querySelectorAll('.player-tag span:first-child')].some(s => s.textContent === '<b>Zed</b>');
  } catch (e) { r['C2_section_error'] = e.message; }

  // D: Load Progress button shows the saved state
  try {
  saveData();
  document.getElementById('new-player-name').value = 'Unsaved'; addPlayer();
  document.querySelector('.data-btn.load').click();
  r.D_load_restores_list = ![...document.querySelectorAll('.player-tag')].some(t => t.textContent.includes('Unsaved'));
  } catch (e) { r['D_section_error'] = e.message; }

  // E: R32 slot clears when its group is no longer complete
  try {
  const gA = Object.values(gameState.groupMatches).filter(m => m.group === 'A');
  gA.forEach((m, i) => { setScore(m.id, 3, i % 2); submitMatch(m.id); });
  r.E_r32_filled = gameState.knockoutMatches.R32_1.team1;
  resetMatch(gA[0].id);
  r.E_r32_after_reset_should_be_null = gameState.knockoutMatches.R32_1.team1;
  } catch (e) { r['E_section_error'] = e.message; }

  // F: resetting a knockout match clears the team it sent to the next round
  try {
  const k = gameState.knockoutMatches;
  k.R32_1.team1 = 'USA'; k.R32_1.team2 = 'Netherlands'; k.R32_1.team1Source = '1A';
  openKnockoutModal('R32_1');
  document.getElementById('modal-score1').value = 2; document.getElementById('modal-score2').value = 0;
  submitKnockoutMatch('R32_1');
  r.F_r16_filled = k.R16_1.team1;
  openKnockoutModal('R32_1'); resetKnockoutMatch('R32_1');
  r.F_r16_after_reset_should_be_null = k.R16_1.team1;

  } catch (e) { r['F_section_error'] = e.message; }
  // G: typed-but-unsubmitted scores survive another submit; reset and Reset All clear them
  try {
  resetMatch('G1');
  document.getElementById('score1-G7').value = 4;
  setScore('G1', 1, 0); submitMatch('G1');
  r.G_typed_kept_should_be_4 = document.getElementById('score1-G7').value;
  resetMatch('G1');
  r.G_reset_clears_should_be_empty = document.getElementById('score1-G1').value + '|' + document.getElementById('score2-G1').value;
  window.confirm = () => true; resetAll();
  r.G_resetall_clears_should_be_empty = document.getElementById('score1-G7').value;
  } catch (e) { r['G_section_error'] = e.message; }
  localStorage.removeItem('worldcup2026');
  return JSON.stringify(r);
})()
