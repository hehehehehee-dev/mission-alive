import test from 'node:test';
import assert from 'node:assert/strict';
import { missionDirections, probeForceFromPull } from '../src/mission-actions.js';
import { t } from '../src/i18n.js';
import { evaluateSurveyorProbe, evaluateSurveyorTouchdown, surveyorSoils } from '../src/moon-surveyor-game.js';

test('probe pulls yield bounded distinct forces and the real model returns different depths', () => {
  const forces = [-30, 34, 67, 120].map(distance => probeForceFromPull(distance, 100));
  assert.deepEqual(forces, [1, 2, 3, 4]);
  for (const soil of surveyorSoils) {
    const depths = forces.map(force => evaluateSurveyorProbe(soil.id, force).depth);
    assert.equal(new Set(depths).size, 4);
    assert.ok(depths.every((depth, index) => index === 0 || depth > depths[index - 1]));
  }
});

test('field tools cannot bypass evidence or make terrain outcomes identical', () => {
  const results = surveyorSoils.map(soil => evaluateSurveyorTouchdown({ patchId: soil.id, padWidth: 1.5 }));
  assert.ok(results.every(result => !result.accepted));
  assert.equal(new Set(results.map(result => result.leftSink)).size, 3);
  assert.equal(results[0].difference, 0);
  assert.ok(results[2].difference > 0);
});

test('every active mission stage has translated action and completion guidance', () => {
  assert.equal(Object.keys(missionDirections).length, 14);
  for (const texts of Object.values(missionDirections)) {
    assert.equal(texts.length, 4);
    for (const text of texts) for (const locale of ['es', 'vi']) assert.notEqual(t(text, locale), text, `${locale}: ${text}`);
  }
});
