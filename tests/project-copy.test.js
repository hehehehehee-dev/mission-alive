import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { educationResearch } from '../src/resource-credits.js';
import { es, vi } from '../src/locales/six-missions.js';
import { t } from '../src/i18n.js';

const hook = [
  'Pick a machine.',
  'Take a mission.',
];

test('the lobby opens with a short action addressed to the child', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const line of hook) assert.match(html, new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(html, /Some of NASA's machines cannot be brought back/);
  assert.ok(html.indexOf(hook[0]) < html.indexOf('id="passport-title"'));
});

test('the lobby uses one visual six-mission certification deck before optional certificate setup', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /data-launch-exhibit=|class="launch-bay"/);
  assert.match(html, /Choose your mission/);
  assert.equal((main.match(/missionIconSvgs\s*=\s*\{/g) || []).length, 1);
  for (const id of ['apollo17', 'surveyor3', 'curiosity', 'ingenuity', 'webb', 'voyager']) {
    assert.match(main, new RegExp(`\\b${id}: '<svg`));
  }
  assert.match(html, /data-academy-page="mission-notes"/);
  assert.doesNotMatch(html, /class="mobile-header-menu"/);
  assert.match(main, /route === "lobby-missions"/);
  assert.ok(html.indexOf('id="lobby-missions"') < html.indexOf('id="crew-name"'));
  assert.match(html, /Your name \(optional\)/);
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

test('the public privacy notice matches classroom publication and removal behavior', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const policy = await readFile(new URL('../docs/PRIVACY.md', import.meta.url), 'utf8');
  const netlify = await readFile(new URL('../netlify.toml', import.meta.url), 'utf8');
  assert.match(html, /id="privacy-footer-link"/);
  assert.match(html, /id="privacy-dialog"/);
  assert.match(html, /Anyone visiting Mission Alive may read it or play its audio/);
  assert.match(html, /there is currently no automatic end-of-year deletion/);
  assert.match(policy, /Every submission remains pending until the teacher reviews it/);
  assert.match(netlify, /Content-Security-Policy/);
  assert.match(netlify, /microphone=\(self\)/);
});

test('the deployment policy lets the Curiosity gallery reach NASA and nothing else external', async () => {
  const netlify = await readFile(new URL('../netlify.toml', import.meta.url), 'utf8');
  const gallery = await readFile(new URL('../src/curiosity-gallery.js', import.meta.url), 'utf8');
  const policy = netlify.match(/Content-Security-Policy = "([^"]+)"/)[1];
  const directive = (name) => policy.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name} `));
  // Every host the gallery uses must be allowed, or its images silently disappear in production.
  for (const url of gallery.match(/https:\/\/images-assets\.nasa\.gov/g)) assert.ok(directive('img-src').includes(url));
  assert.match(gallery, /https:\/\/images-api\.nasa\.gov\/search/);
  assert.ok(directive('connect-src').includes('https://images-api.nasa.gov'));
  const external = [...policy.matchAll(/https:\/\/[^\s;]+/g)].map((match) => match[0]);
  assert.deepEqual([...new Set(external)].sort(), ['https://images-api.nasa.gov', 'https://images-assets.nasa.gov']);
  assert.match(directive('script-src'), /^script-src 'self'$/);
});

test('the Moon route back button has a matching accessible name in every language', async () => {
  const moon = await readFile(new URL('../src/moon-stories.js', import.meta.url), 'utf8');
  const nov14 = await import('../src/locales/nov14.js');
  assert.match(moon, /textContent = '← Back to academy';\s*closeButton\.setAttribute\('aria-label', 'Back to academy'\)/);
  assert.match(moon, /textContent = 'Close';\s*closeButton\.setAttribute\('aria-label', 'Close Moon training'\)/);
  for (const line of ['← Back to academy', 'Back to academy']) {
    assert.ok(nov14.es[line], `Missing Spanish: ${line}`);
    assert.ok(nov14.vi[line], `Missing Vietnamese: ${line}`);
  }
});

test('the lobby hook is complete in Spanish and Vietnamese', () => {
  for (const line of hook) {
    assert.notEqual(t(line, 'es'), line, `Missing Spanish: ${line}`);
    assert.notEqual(t(line, 'vi'), line, `Missing Vietnamese: ${line}`);
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

test('the Golden Record logo is the same mark in the header and the browser tab, and respects reduced motion', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../src/style.css', import.meta.url), 'utf8');
  const pulse = '7,26 14,26 18.5,12 24,34 29.5,12 34,26 41,26';
  assert.match(html, /<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true"/);
  assert.equal(html.split(pulse).length - 1, 2, 'header mark and favicon share one pulse shape');
  assert.match(html, /rel="icon"\s+type="image\/svg\+xml"\s+href="data:image\/svg\+xml,/);
  assert.match(css, /body\.motion-allowed \.brand-pulse \{ animation: brand-pulse/);
  assert.doesNotMatch(css, /^\.brand-pulse \{[^}]*animation/m, 'the pulse only animates when motion is allowed');
});
