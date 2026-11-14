import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { lrvGameMarkup } from '../src/moon-lrv-game.js';
import { surveyorGameMarkup } from '../src/moon-surveyor-game.js';
import { es, vi } from '../src/locales/six-missions.js';

test('both Moon challenges progressively enhance their existing 2D simulations with synchronized 3D stages', async () => {
  const lrv = lrvGameMarkup();
  const surveyor = surveyorGameMarkup();
  const scenes = await readFile(new URL('../src/moon-challenge-scenes.js', import.meta.url), 'utf8');
  assert.match(lrv, /data-lrv-challenge-3d/);
  assert.match(lrv, /class="moon-challenge-2d"/);
  assert.match(surveyor, /data-surveyor-challenge-3d/);
  assert.match(surveyor, /class="moon-challenge-2d"/);
  assert.match(scenes, /mountLrvChallengeScene/);
  assert.match(scenes, /mountSurveyorChallengeScene/);
  assert.match(scenes, /dust\.forEach/);
  assert.match(scenes, /touchdown/);
  assert.doesNotMatch(scenes, /\/assets\//);
  const caption = 'Interactive 3D training simulation. Use the controls on this page; every result is also explained in text.';
  assert.ok(es[caption]);
  assert.ok(vi[caption]);
});
