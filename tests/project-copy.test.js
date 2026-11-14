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

test('the lobby hook is complete in Spanish and Vietnamese', () => {
  for (const line of hook) {
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
