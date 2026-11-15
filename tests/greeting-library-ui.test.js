import test from 'node:test';
import assert from 'node:assert/strict';
import { t } from '../src/i18n.js';
import { es, vi } from '../src/locales/mission-actions.js';
import { es as es14, vi as vi14 } from '../src/locales/nov14.js';

test('consolidated listening, sharing and guidance labels are translated', () => {
  for (const text of ['How to play', 'Story & science', 'Greeting collections', 'Golden Record · 1977', 'Visitor greetings', 'Hear visitor greetings', 'Hear Earth', 'Send yours', 'required for the stamp', 'Choose an original 1977 greeting or hear what Mission Alive visitors have shared.', 'Share your greeting', 'Your greeting or transcript', 'Name, country & translation (optional)', 'Choose a language and add your words or a recording.']) {
    assert.ok(es[text] && vi[text], text);
    assert.notEqual(t(text, 'es'), text);
    assert.notEqual(t(text, 'vi'), text);
  }
  for (const text of ['Share with everyone', 'Voices from Earth today', 'Report', 'Remove from everyone', 'I made this greeting. I did not say my full name, my school, or where I live. Everyone can hear it.']) {
    assert.ok(es14[text] && vi14[text], text);
  }
});

test('Voyager makes sending a greeting the only required action and keeps transcript text separate from visitor audio', async () => {
  const fs = await import('node:fs/promises');
  const main = await fs.readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const shared = await fs.readFile(new URL('../src/shared-greetings.js', import.meta.url), 'utf8');
  assert.match(main, /if \(progress\.greeting\) success\(\)/);
  assert.doesNotMatch(main, /if \(progress\.listen && progress\.greeting\) success\(\)/);
  assert.doesNotMatch(main, /Play or read one Golden Record greeting/);
  assert.match(main, /id="open-your-record"/);
  assert.match(shared, /greeting\.transcript/);
});

test('Voyager keeps its mission and three-step guide visible, with public voices beside the original record', async () => {
  const fs = await import('node:fs/promises');
  const layout = await fs.readFile(new URL('../src/exhibit-layout.js', import.meta.url), 'utf8');
  const quickStart = await fs.readFile(new URL('../src/quick-start.js', import.meta.url), 'utf8');
  const main = await fs.readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(layout, /\["#challenge-heading", "\.challenge-layout"\].*main/);
  assert.doesNotMatch(layout, /\["#challenge-heading", "\.challenge-layout", "#hidden-facts-slot"/);
  assert.match(layout, /find\("\.shared-greetings"\)/);
  assert.match(quickStart, /mission === 'voyager'/);
  assert.match(quickStart, /is-always-visible/);
  assert.match(main, /id="open-your-record"/);
  assert.match(main, /#original-greetings-tab/);
});

function node(tag = 'div') {
  return {
    tag, children: [], dataset: {}, listeners: {}, value: '', textContent: '', hidden: false, paused: true, disabled: false,
    append(...items) { this.children.push(...items); },
    replaceChildren(...items) { this.children = items; },
    remove() { this.removed = true; },
    setAttribute(name, value) { this[name] = value; },
    addEventListener(event, callback) { this.listeners[event] = callback; },
    querySelectorAll(tag) { return this.children.flatMap(child => typeof child === 'object' ? [...(child.tag === tag ? [child] : []), ...child.querySelectorAll(tag)] : []); },
    pause() { this.paused = true; },
  };
}

test('the public gallery lists shared greetings, plays same-origin audio, and Report hides one at once', async context => {
  const originals = new Map(['location', 'document', 'fetch'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  context.after(() => {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  const elements = new Map();
  const find = selector => { if (!elements.has(selector)) elements.set(selector, node()); return elements.get(selector); };
  const requests = [];
  const greeting = { id: '0f8fad5b-d9cb-469f-a165-70867728950e', name: 'Space listener', language: 'Vietnamese', country: 'Vietnam', message: 'Xin chào', hasAudio: true, publishedAt: '2026-11-15T12:00:00Z' };
  for (const [key, value] of Object.entries({
    location: { protocol: 'https:', port: '', origin: 'https://test.example' },
    document: { createElement: node, createTextNode: text => text },
    fetch: async (url, options) => { requests.push({ url, options }); return { ok: true, json: async () => (options ? { status: 'hidden' } : { greetings: [greeting] }) }; },
  })) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });

  const { mountSharedGreetings, sharedGreetingsApi } = await import('../src/shared-greetings.js?gallery-ui-regression');
  assert.equal(sharedGreetingsApi, '/api/greetings');
  const controller = mountSharedGreetings({ querySelector: find });
  context.after(() => controller.dispose());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests[0].url, '/api/greetings?action=list');
  assert.equal(requests[0].options, undefined, 'listening sends nothing');
  const list = find('#shared-greetings-list');
  const article = list.children[0];
  const audio = list.querySelectorAll('audio')[0];
  assert.equal(audio.src, `/api/greetings?action=audio&id=${greeting.id}`);
  const report = article.children.find(child => child.className === 'report-greeting');
  await report.listeners.click();
  assert.equal(JSON.parse(requests[1].options.body).action, 'report');
  assert.equal(article.removed, true, 'a reported greeting disappears immediately');
});
