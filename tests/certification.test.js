import test from 'node:test';
import assert from 'node:assert/strict';
import { certificationComplete, restoredStamps, missionIds, MISSION_COUNT } from '../src/certification.js';
import { t } from '../src/i18n.js';

test('old four-stamp progress survives and needs two Moon missions to graduate', () => {
  const old = ['curiosity', 'ingenuity', 'webb', 'voyager'];
  const stamps = restoredStamps(old);
  assert.deepEqual([...stamps], old);
  assert.equal(certificationComplete(stamps), false);
  stamps.add('apollo17');
  assert.equal(certificationComplete(stamps), false);
  stamps.add('surveyor3');
  assert.equal(certificationComplete(stamps), true);
  assert.equal(MISSION_COUNT, 6);
  assert.deepEqual(missionIds, ['apollo17', 'surveyor3', ...old]);
});

test('invalid saved stamps cannot duplicate credentials or cause early graduation', () => {
  assert.deepEqual([...restoredStamps(['apollo17', 'apollo17', 'unknown', '__proto__'])], ['apollo17']);
  for (const invalid of [null, {}, 'curiosity', 4]) assert.equal(restoredStamps(invalid).size, 0);
  assert.equal(certificationComplete(new Set(['unknown', 'a', 'b', 'c', 'd', 'e'])), false);
});

test('six-mission progress and direct-manipulation instructions have Spanish and Vietnamese copy', () => {
  for (const locale of ['es', 'vi']) {
    for (const text of ['5 / 6 stamped', 'Open crew certification · 5 of 6 stamps earned', 'Dig one scoop', 'Apply selected tool to the wheel', 'MOON TRAINING · TWO MISSIONS · TWO STAMPS']) {
      assert.notEqual(t(text, locale), text, `${locale}: ${text}`);
    }
    assert.match(t('5 / 6 stamped', locale), /5 \/ 6/);
  }
});
