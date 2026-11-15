import test from 'node:test';
import assert from 'node:assert/strict';
import { t } from '../src/i18n.js';
import { es, vi } from '../src/locales/mission-actions.js';

test('consolidated listening, saving and guidance labels are translated', () => {
  for (const text of ['How to play', 'Story & science', 'Greeting collections', 'Golden Record · 1977', 'Visitor greetings', 'Share with a classroom', 'Share your greeting', 'Your greeting or transcript', 'Name, country & translation (optional)', 'Choose a language and add your words or a recording.']) {
    assert.ok(es[text] && vi[text], text);
    assert.notEqual(t(text, 'es'), text);
    assert.notEqual(t(text, 'vi'), text);
  }
});

function node(tag = 'div') {
  return {
    tag, children: [], dataset: {}, listeners: {}, value: '', textContent: '', hidden: false, paused: true,
    append(...items) { this.children.push(...items); },
    replaceChildren(...items) { this.children = items; },
    setAttribute(name, value) { this[name] = value; },
    addEventListener(event, callback) { this.listeners[event] = callback; },
    querySelectorAll(tag) { return this.children.flatMap(child => typeof child === 'object' ? [...(child.tag === tag ? [child] : []), ...child.querySelectorAll(tag)] : []); },
    pause() { this.paused = true; this.pauseCalls = (this.pauseCalls || 0) + 1; },
    focus() { this.focused = true; },
    scrollIntoView() {},
  };
}

test('public voices need no class code; filtering stops removed audio and sharing requires consent', async context => {
  const originals = new Map(['location', 'document', 'window', 'fetch', 'localStorage'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  context.after(() => {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  const elements = new Map();
  const find = selector => { if (!elements.has(selector)) elements.set(selector, node()); return elements.get(selector); };
  const requests = [];
  const entry = {id: 'local-test', code: 'ABCDEF123456', name: 'Listener', language: 'Vietnamese', country: 'Vietnam', message: 'Xin chào', classTitle: 'Test class', hasAudio: true, createdAt: '2026-11-14T12:00:00Z'};
  for (const [key, value] of Object.entries({
    location: {protocol: 'https:', port: '', origin: 'https://test.example'},
    document: {createElement: node, createTextNode: text => text},
    window: {setInterval: () => 1},
    localStorage: {getItem: () => null},
    fetch: async (url, options) => { requests.push({url, options}); return {ok: true, json: async () => ({recordings: [entry]})}; },
  })) Object.defineProperty(globalThis, key, {configurable: true, writable: true, value});

  const { mountClassRecord } = await import('../src/class-record.js?gallery-ui-regression');
  const controller = mountClassRecord({querySelector: find, querySelectorAll: () => []});
  context.after(() => controller.dispose());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, '/api/class-record?action=gallery');
  assert.equal(requests[0].options, undefined, 'listening never sends a teacher key or POST');
  const list = find('#class-gallery-list');
  const audio = list.querySelectorAll('audio')[0];
  assert.match(audio.src, /action=audio&code=ABCDEF123456&id=local-test$/);
  assert.equal(audio.controls, true);
  audio.paused = false;

  find('#class-gallery-search').value = 'no matches';
  find('#class-gallery-search').listeners.input();
  assert.equal(audio.paused, true, 'filtered-out audio cannot keep playing invisibly');
  assert.equal(audio.pauseCalls, 1);
  assert.match(list.children[0].textContent, /No approved classroom greetings match/);
  assert.equal(find('#class-gallery-clear').hidden, false);
  find('#class-gallery-clear').listeners.click();
  assert.equal(list.querySelectorAll('audio').length, 1);
  assert.equal(find('#class-gallery-search').focused, true);

  await assert.rejects(controller.submit({message: 'Private draft'}), /Open a class record first/);
  assert.equal(find('#voyager-class-sharing').open, true);
  assert.equal(find('#class-code').focused, true);
  assert.equal(requests.length, 1, 'no private greeting was submitted');
});
