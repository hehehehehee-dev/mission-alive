import test from 'node:test';
import assert from 'node:assert/strict';
import { createStoryVoice } from '../src/story-voice.js';
import { t } from '../src/i18n.js';

function player() {
  const make = tag => ({
    tag, dataset: {}, children: [], hidden: false, listeners: {}, attrs: {},
    classList: { toggle() {} },
    setAttribute(key,value) { this.attrs[key] = value; },
    addEventListener(event,handler) { this.listeners[event] = handler; },
    removeEventListener(event) { delete this.listeners[event]; },
    append(...items) { this.children.push(...items); },
    remove() { this.removed = true; },
  });
  let plays = 0, stops = 0;
  const view = createStoryVoice({ transcript: 'Exact supplied recording.', document: {createElement:make}, onPlay(){plays++;}, onStop(){stops++;} });
  const [button, language, words, status] = view.root.children;
  return { view, button, language, words, status, counts: () => ({plays,stops}) };
}
test('story voice starts only on request, exposes the matching transcript and can stop/replay', () => {
  const p = player();
  assert.deepEqual(p.counts(), {plays:0,stops:0});
  assert.equal(p.words.hidden,true);
  assert.match(p.language.textContent,/English recording/);
  p.button.listeners.click();
  assert.equal(p.words.hidden,false);
  assert.equal(p.words.textContent,'Exact supplied recording.');
  assert.equal(p.button.attrs['aria-pressed'],'true');
  p.view.update('playing');
  p.button.listeners.click();
  assert.deepEqual(p.counts(), {plays:1,stops:1});
  assert.equal(p.button.attrs['aria-pressed'],'false');
  p.button.listeners.click();
  assert.equal(p.counts().plays,2);
  p.view.update('idle');
  assert.equal(p.button.textContent,'Hear my message');
});
test('blocked audio stays readable and retryable; disposing removes its interaction', () => {
  const p = player();
  p.button.listeners.click();
  p.view.update('blocked');
  assert.equal(p.status.hidden,false);
  assert.equal(p.words.hidden,false);
  assert.equal(p.button.attrs['aria-pressed'],'false');
  p.button.listeners.click();
  assert.equal(p.status.hidden,true);
  assert.equal(p.counts().plays,2);
  p.view.dispose();
  assert.equal(p.button.listeners.click,undefined);
  assert.equal(p.view.root.removed,true);
});
test('voice and recovery controls have Spanish and Vietnamese labels', () => {
  for (const locale of ['es','vi']) for (const label of ['Hear my message','Stop my message','English recording · character message','Repair & restart rover','Your blocks stay. Change the route and try again.']) {
    assert.notEqual(t(label,locale), label);
  }
});
