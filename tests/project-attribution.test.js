import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { projectTools, siDisclosure } from '../src/project-attribution.js';

test('public attribution covers the direct dependencies and each supplied synthetic narration', () => {
  const manifest = JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  for (const dependency of Object.keys(manifest.dependencies)) {
    assert.ok(projectTools.some(entry => entry.title.toLowerCase().includes(dependency.toLowerCase())), dependency);
  }
  const voices = projectTools.filter(entry => entry.kind === 'AI-generated narration');
  assert.equal(voices.length,4);
  for (const entry of voices) {
    assert.match(entry.credit,/ElevenLabs/);
    assert.match(entry.presentation,/Not an actual NASA spacecraft recording/);
    assert.ok(existsSync(new URL(`../${entry.files[0]}`,import.meta.url)));
  }
  assert.equal(new Set(projectTools.map(entry => entry.id)).size,projectTools.length);
  assert.match(siDisclosure,/implementation, debugging, test design, translations, narrative drafts/);
  assert.match(siDisclosure,/programmatic illustrations/);
});
