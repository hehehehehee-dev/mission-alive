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
  for (const text of ['Six machines', 'need your help.', 'Solve the problem each machine faced. Earn six stamps and unlock your certificate.', 'Your mission stamps', 'Tap a signal. Help a machine.', 'Play mission →', 'Play again →', 'Stamp earned ✓', 'Use Moon mode', 'Use Sun mode']) {
    for (const locale of ['es', 'vi']) assert.notEqual(t(text, locale), text);
  }
});
