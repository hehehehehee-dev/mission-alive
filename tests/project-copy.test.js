import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { educationResearch } from '../src/resource-credits.js';
import { es, vi } from '../src/locales/six-missions.js';

const hook = [
  'Kids love space but rarely see themselves in it.',
  'Here, you finish the missions of six machines that never came home.',
];

test('the lobby presents the two-line child-readable problem and solution hook', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const line of hook) assert.match(html, new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(html, /Some of NASA's machines cannot be brought back/);
  assert.ok(html.indexOf(hook[0]) < html.indexOf('id="passport-title"'));
});

test('the lobby uses one visual six-mission certification deck before optional certificate setup', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /data-launch-exhibit=|class="launch-bay"/);
  assert.match(html, /LIVE TRAINING DECK · SIX MACHINES · SIX REAL JOBS/);
  assert.equal((main.match(/missionIconSvgs\s*=\s*\{/g) || []).length, 1);
  for (const id of ['apollo17', 'surveyor3', 'curiosity', 'ingenuity', 'webb', 'voyager']) {
    assert.match(main, new RegExp(`\\b${id}: '<svg`));
  }
  assert.match(html, /class="mobile-header-menu"/);
  assert.match(main, /route === "lobby-missions"/);
  assert.ok(html.indexOf('id="lobby-missions"') < html.indexOf('id="crew-name"'));
  assert.match(html, /Add your name for the certificate/);
});

test('journey image credits stay inside their own desktop scenes', async () => {
  const css = await readFile(new URL('../src/style.css', import.meta.url), 'utf8');
  assert.match(css, /\.scene-moon > \.planet-credit,\s*\.scene-mars > \.planet-credit\s*\{\s*position: absolute;\s*bottom: 22px;/s);
  assert.match(css, /\.scene-moon > \.planet-credit \{ position: absolute; left: 7%; bottom: 12px;/);
  assert.match(css, /\.scene-mars > \.planet-credit \{ position: absolute; left: 0; bottom: 12px;/);
});

test('both Moon missions have dedicated routes instead of a shared chooser step', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const moon = await readFile(new URL('../src/moon-stories.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../src/moon-labs.css', import.meta.url), 'utf8');
  assert.match(main, /function renderMoonRoute\(id\)/);
  assert.match(main, /moonPanel\.openRoute\(id/);
  assert.match(moon, /openRoute\(id, onExit\)/);
  assert.match(css, /\.moon-panel\.is-route-page/);
  assert.doesNotMatch(main, /moonPanel\.play\(id, document\.activeElement\)/);
});

test('the lobby hook is complete in Spanish and Vietnamese', () => {
  for (const line of hook) {
    assert.ok(es[line], `Missing Spanish: ${line}`);
    assert.ok(vi[line], `Missing Vietnamese: ${line}`);
  }
});

test('new launch controls are localized in Spanish and Vietnamese', () => {
  for (const line of ['Choose a machine ↓', 'Pick your machine.', 'Open mission →', 'Add your name for the certificate', 'About Mission Alive']) {
    assert.ok(es[line], `Missing Spanish: ${line}`);
    assert.ok(vi[line], `Missing Vietnamese: ${line}`);
  }
});

test('the project problem uses registered sources and avoids banned stock phrasing', async () => {
  const copy = await readFile(new URL('../docs/PROBLEM_SOLUTION.md', import.meta.url), 'utf8');
  assert.match(copy, /LEGO Group \/ The Harris Poll/);
  assert.match(copy, /When STEM\? A Question of Age/);
  assert.doesNotMatch(copy, /[—–]|\b(?:crucial|pivotal|delve|showcase)\b|not just .+ but /i);
  assert.ok(educationResearch.some((entry) => entry.id === 'lego-space-survey-2019'));
  assert.ok(educationResearch.some((entry) => entry.id === 'when-stem-age'));
});
