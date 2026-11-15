import test from 'node:test';
import assert from 'node:assert/strict';
import { quickStartMarkup, whyMarkup } from '../src/quick-start.js';

test('all six missions provide three concise visual quick-start steps', () => {
  for (const mission of ['apollo17', 'surveyor3', 'curiosity', 'ingenuity', 'webb', 'voyager']) {
    const markup = quickStartMarkup(mission);
    assert.match(markup, /QUICK START/);
    assert.match(markup, new RegExp(`data-tutorial-mission="${mission}"`));
    assert.match(markup, /Follow 1 → 2 → 3/);
    assert.equal((markup.match(/<li>/g) || []).length, 3);
    assert.equal((markup.match(/quick-start-icon/g) || []).length, 3);
    assert.doesNotMatch(markup, /button|dialog|onclick/);
  }
});

test('long explanations are optional native disclosures', () => {
  const markup = whyMarkup('<p>Science detail</p>');
  assert.match(markup, /^<details/);
  assert.match(markup, /Why this works/);
  assert.doesNotMatch(markup, / open(?:=|>)/);
});

test('quick-start cards reflow before icon space can squeeze child-readable text', async () => {
  const fs = await import('node:fs/promises');
  const css = await fs.readFile(new URL('../src/quick-start.css', import.meta.url), 'utf8');
  assert.match(css, /repeat\(auto-fit, minmax\(min\(100%, 220px\), 1fr\)\)/);
  assert.match(css, /\.quick-start li > span:last-child \{[^}]*min-width: 0/);
  assert.match(css, /\.quick-start-icon \{ display: none; \}/);
  assert.match(css, /@container \(max-width: 680px\)/);
});
