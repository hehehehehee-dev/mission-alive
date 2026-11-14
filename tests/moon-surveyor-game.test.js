import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { surveyorSoils, surveyorModel, evaluateSurveyorProbe, evaluateSurveyorEvidence, evaluateSurveyorTouchdown, surveyorGameMarkup, mountSurveyorGame } from '../src/moon-surveyor-game.js';

const evidence = (patchId, forces = [1, 4]) => [...forces.map((force) => evaluateSurveyorProbe(patchId, force)), { type: 'trench', patchId }];

test('probe measurements depend on force and invented layers rather than a random outcome', () => {
  for (const soil of surveyorSoils) {
    const values = surveyorModel.forces.map((force) => evaluateSurveyorProbe(soil.id, force));
    assert.ok(values.every((value, index) => !index || value.depth > values[index - 1].depth));
    assert.deepEqual(evaluateSurveyorProbe(soil.id, 2), evaluateSurveyorProbe(soil.id, 2));
    assert.equal(values[0].pressure, 1);
  }
  assert.ok(evaluateSurveyorProbe('b', 1).depth > evaluateSurveyorProbe('a', 1).depth);
  assert.throws(() => evaluateSurveyorProbe('a', 0), RangeError);
  assert.throws(() => evaluateSurveyorProbe('a', '2'), RangeError);
  assert.throws(() => evaluateSurveyorProbe('missing', 1), RangeError);
});

test('acceptance requires two distinct forces and a trench on the selected patch', () => {
  for (const log of [[], evidence('a', [1, 1]), [evaluateSurveyorProbe('a', 1), evaluateSurveyorProbe('a', 4)], evidence('b')]) {
    const trial = evaluateSurveyorTouchdown({ patchId: 'a', padWidth: 4, log });
    assert.equal(trial.stable, true);
    assert.equal(trial.accepted, false);
    assert.equal(trial.reason, 'evidence');
  }
  assert.equal(evaluateSurveyorEvidence('a', evidence('a')).ready, true);
  assert.equal(evaluateSurveyorEvidence('a', null).ready, false);
  const source = evidence('a');
  const before = structuredClone(source);
  evaluateSurveyorTouchdown({ patchId: 'a', padWidth: 2, log: source });
  assert.deepEqual(source, before, 'pure evaluator does not change investigation history');
});

test('load divided by square pad area drives sinking and allows several valid footprints', () => {
  for (const patchId of ['a', 'b', 'c']) {
    const trials = Array.from({ length: 7 }, (_, index) => evaluateSurveyorTouchdown({ patchId, padWidth: 1 + index * .5, log: evidence(patchId) }));
    assert.equal(trials[0].accepted, false);
    assert.ok(trials.filter((trial) => trial.accepted).length >= 2);
    assert.ok(trials.every((trial, index) => !index || trial.leftSink < trials[index - 1].leftSink));
    assert.equal(trials[2].area, 4);
    assert.equal(trials[2].pressure, 3);
  }
  assert.equal(evaluateSurveyorTouchdown({ patchId: 'a', padWidth: 1.5, log: evidence('a') }).accepted, true);
  assert.equal(evaluateSurveyorTouchdown({ patchId: 'b', padWidth: 2, log: evidence('b') }).reason, 'sinking');
  assert.equal(evaluateSurveyorTouchdown({ patchId: 'b', padWidth: 2.5, log: evidence('b') }).accepted, true);
  assert.equal(evaluateSurveyorTouchdown({ patchId: 'c', padWidth: 3, log: evidence('c') }).reason, 'tilting');
  assert.equal(evaluateSurveyorTouchdown({ patchId: 'c', padWidth: 3.5, log: evidence('c') }).accepted, true);
  for (const padWidth of [0, 5, NaN, Infinity, '3']) assert.throws(() => evaluateSurveyorTouchdown({ patchId: 'a', padWidth }), RangeError);
});

test('markup keeps fictional model, real history, accessible controls, and homecoming distinct', () => {
  const markup = surveyorGameMarkup();
  assert.match(markup, /Illustrated simulation · not NASA test data\./);
  assert.match(markup, /dimensionless simulation units/);
  assert.match(markup, /patches and their layers are invented/);
  assert.match(markup, /This adjustable-footpad experiment is fictional/);
  assert.match(markup, /I am still here\. But part of me made it home\./);
  assert.match(markup, /1969, Apollo 12 astronauts returned Surveyor 3’s television camera and soil scoop/);
  assert.match(markup, /https:\/\/science\.nasa\.gov\/mission\/surveyor-3\//);
  assert.match(markup, /https:\/\/www\.jpl\.nasa\.gov\/blog\/2012\/1\/surveyor-3-camera-returned-from-the-moon/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(markup, /<svg[^>]*aria-hidden="true"/);
  assert.equal((markup.match(/data-surveyor-force="/g) || []).length, 4);
  assert.equal((markup.match(/data-surveyor-patch="/g) || []).length, 3);
  assert.doesNotMatch(markup, /disabled|<canvas|<input[^>]*type="range"|<img/);
  assert.notEqual(markup.match(/id="([^"]+)-grains"/)[1], surveyorGameMarkup().match(/id="([^"]+)-grains"/)[1]);
  assert.doesNotThrow(() => mountSurveyorGame(null).dispose());
});

test('optional investigation has no persistence, route, stamp, timer, or external image effects', () => {
  const source = readFileSync(new URL('../src/moon-surveyor-game.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /localStorage|sessionStorage|setInterval|setTimeout|requestAnimationFrame|fetch\(|\.location\b|setProgress|stamp/i);
  assert.match(source, /surveyor-soil-success/);
  assert.match(source, /removeEventListener\('click', onClick\)/);
});
