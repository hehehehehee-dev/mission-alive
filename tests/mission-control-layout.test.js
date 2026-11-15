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

test('Ingenuity uses its visual flight game instead of the retired link, rotor and trim form', () => {
  assert.match(main, /return flightGameMarkup\(\)/);
  assert.match(main, /mountFlightGame\(/);
  assert.doesNotMatch(main, /id="trim-input"|id="link-test"|data-ingenuity-step=/);
});

test('a failed Ingenuity landing has visible 3D damage instead of only text feedback', () => {
  assert.match(scene, /flightSmokeMaterial\.opacity/);
  assert.match(scene, /CanvasTexture\(smokeCanvas\)/);
  assert.match(scene, /rotors\[0\]\.rotation\.z/);
  assert.match(scene, /st\.crashed \? \.96 : 0/);
});
