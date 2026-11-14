import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { moonPanelMarkup } from '../src/moon-stories.js';
import { es, vi } from '../src/locales/six-missions.js';

test('both Moon routes share one aligned 3D machine stage with an honest fallback', async () => {
  const markup = moonPanelMarkup();
  const scene = await readFile(new URL('../src/moon-machine-scene.js', import.meta.url), 'utf8');
  assert.match(markup, /class="moon-machine-view"/);
  assert.equal((markup.match(/data-moon-machine-scene/g) || []).length, 1);
  assert.match(markup, /Original Mission Alive 3D reconstruction/);
  assert.match(scene, /apollo17: 'Apollo 17 Lunar Roving Vehicle'/);
  assert.match(scene, /surveyor3: 'Surveyor 3'/);
  assert.equal((scene.match(/camera\.position\.set\(4\.8, 3\.1, 5\.7\)/g) || []).length, 2, 'initial and reset views use the same framing');
  assert.match(scene, /powerPreference: 'low-power'/);
  assert.match(scene, /IntersectionObserver/);
  assert.match(scene, /webglcontextlost/);
  assert.doesNotMatch(scene, /\/assets\//, 'the procedural models do not introduce an uncredited external asset');
});

test('Moon 3D instructions and fallback are complete in Spanish and Vietnamese', () => {
  for (const line of [
    '3D MACHINE VIEW',
    'Meet the machine before training.',
    'Drag to orbit. When the model has focus, use ← → to turn, + − to zoom, or 0 to reset.',
    '3D view unavailable.',
    'The mission remains fully playable below.',
    'Original Mission Alive 3D reconstruction. Simplified for learning; not engineering scale.',
  ]) {
    assert.ok(es[line], `Missing Spanish: ${line}`);
    assert.ok(vi[line], `Missing Vietnamese: ${line}`);
  }
});
