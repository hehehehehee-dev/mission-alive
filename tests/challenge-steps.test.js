import test from 'node:test';
import assert from 'node:assert/strict';
import { mountChallengeSteps } from '../src/challenge-steps.js';

function element() {
  return {
    children: [], attributes: {}, hidden: false,
    append(...nodes) { this.children.push(...nodes); },
    prepend(node) { this.children.unshift(node); },
    setAttribute(key, value) { this.attributes[key] = value; },
    removeAttribute(key) { delete this.attributes[key]; },
    getClientRects() { return []; },
  };
}

test('step navigation reveals one panel, preserves controls, gates future steps and resets', () => {
  const previous = globalThis.document;
  globalThis.document = { createElement: element };
  try {
    const host = element(), control = { value: 42 };
    const steps = mountChallengeSteps(host, [
      { title: 'Build', nodes: [control] },
      { title: 'Test', nodes: [element()] },
    ]);
    const [nav, first, second] = host.children;
    assert.equal(first.hidden, false);
    assert.equal(second.hidden, true);
    steps.show(1);
    assert.equal(first.hidden, false, 'cannot skip a locked stage');
    steps.unlock(1);
    assert.equal(first.hidden, true);
    assert.equal(second.hidden, false);
    assert.equal(nav.children[1].attributes['aria-current'], 'step');
    steps.show(0);
    assert.equal(first.children[0], control, 'original control instance is retained');
    assert.equal(first.children[0].value, 42);
    steps.reset();
    assert.equal(second.hidden, true);
    assert.equal(nav.children[1].disabled, true);
  } finally { globalThis.document = previous; }
});
