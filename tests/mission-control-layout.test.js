import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const scene = readFileSync(new URL('../src/scene.js', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

test('machine anatomy controls live outside the 3D canvas', () => {
  assert.match(index, /class="stage-column"/);
  assert.match(index, /class="part-dock-slot"/);
  assert.match(scene, /querySelector\("\.part-dock-slot"\)/);
  assert.match(scene, /partDock\.addEventListener\("click"/);
  assert.doesNotMatch(scene, /<div class="part-dock"/);
  assert.doesNotMatch(styles, /\.part-dock\s*\{[^}]*position:\s*absolute/s);
  assert.match(styles, /\.stage-column\s*\{[^}]*width:\s*100%[^}]*overflow:\s*hidden/s);
  assert.match(styles, /\.part-dock\s*\{[^}]*max-width:\s*100%/s);
});

test('Ingenuity uses three progressive challenge panels and one-action safe power', () => {
  for (const step of ['plan', 'power', 'fly']) {
    assert.match(main, new RegExp(`data-ingenuity-step="${step}"`));
    assert.match(main, new RegExp(`data-ingenuity-step-target="${step}"`));
  }
  assert.match(main, /state\.rotor = 75/);
  assert.match(main, /showIngenuityStep\("power", true\)/);
  assert.match(main, /showIngenuityStep\("fly", true\)/);
  assert.match(main, /class="flight-log-details"/);
});
