import test from 'node:test';
import assert from 'node:assert/strict';
import { readLobbyTheme } from '../src/lobby-theme.js';
import { t } from '../src/i18n.js';
test('lobby defaults to sunlight and only restores a deliberate Moon choice', () => {
  for (const value of [null, 'light', 'invalid', 'false']) assert.equal(readLobbyTheme({getItem: () => value}), 'light');
  assert.equal(readLobbyTheme({getItem: () => 'dark'}), 'dark');
  assert.equal(readLobbyTheme({getItem() { throw Error('Blocked storage'); }}), 'light');
});
test('sunlight lobby actions and theme controls have Spanish and Vietnamese labels', () => {
  for (const text of ['Pick a machine.', 'Take a mission.', 'Six missions. Six stamps. Your adventure.', 'Your mission stamps', 'Tap a machine to play', 'Play mission →', 'Play again →', 'Stamp earned ✓', 'Use Moon mode', 'Use Sun mode']) {
    for (const locale of ['es', 'vi']) assert.notEqual(t(text, locale), text);
  }
});
