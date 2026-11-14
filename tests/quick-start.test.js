import test from 'node:test';
import assert from 'node:assert/strict';
import { quickStartMarkup, whyMarkup } from '../src/quick-start.js';

test('all six missions provide three concise visual quick-start steps', () => {
  for (const mission of ['apollo17', 'surveyor3', 'curiosity', 'ingenuity', 'webb', 'voyager']) {
    const markup = quickStartMarkup(mission);
    assert.match(markup, /QUICK START/);
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
