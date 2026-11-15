import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
test('lobby has direct choices without asking for a certificate name early', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const lobby = html.slice(html.indexOf('id="lobby"'), html.indexOf('id="academy-page"'));
  assert.doesNotMatch(lobby, /<details|<summary/);
  assert.doesNotMatch(lobby, /id="crew-name"|Your name \(optional\)/);
  assert.match(html, /id="graduate-name"/);
  assert.ok(lobby.indexOf('id="hidden-fact-passport-slot"') < lobby.indexOf('id="location-map-slot"'));
  assert.doesNotMatch(lobby, /Choose your mission|class="lobby-missions"|journey-entry/);
  for (const id of ['academy-mission-notes', 'academy-about']) assert.ok(html.includes(`id="${id}"`));
  assert.match(html, /id="motion"[^>]*hidden/);
  assert.match(html, /id="teachers-footer-link" hidden/);
  assert.match(html, /id="credits-footer-link" hidden/);
});
