import test from 'node:test';
import assert from 'node:assert/strict';
import { mountSurveyorGame } from '../src/moon-surveyor-game.js';

// A small host adapter exercises the real click controller without a browser.
function workshop() {
  const events = [];
  const nodes = new Map();
  const element = () => ({
    dataset: {}, style: {}, children: [], attributes: {}, hidden: false,
    setAttribute(key, value) { this.attributes[key] = value; },
    append(child) { this.children.push(child); },
    replaceChildren(...children) { this.children = children; },
  });
  const forces = [1, 2, 3, 4].map(force => ({ ...element(), dataset: { surveyorForce: String(force) } }));
  let clickHandler;
  const game = {
    ...element(), classList: { add() {}, remove() {} },
    ownerDocument: { createElement: element, defaultView: { CustomEvent } },
    querySelector(selector) { if (!nodes.has(selector)) nodes.set(selector, element()); return nodes.get(selector); },
    querySelectorAll(selector) { return selector === '[data-surveyor-force]' ? forces : []; },
    addEventListener(type, handler) { if (type === 'click') clickHandler = handler; },
    removeEventListener() { clickHandler = null; },
    contains() { return true; },
  };
  const root = { querySelector: () => game, dispatchEvent(event) { events.push(event.type); } };
  const controller = mountSurveyorGame(root);
  return {
    game, forces, events, controller,
    click(dataset) {
      const button = { dataset };
      clickHandler({ target: { closest: () => button } });
    },
  };
}

test('probe force stays selected and a valid landing can be retried after switching patches', () => {
  const lab = workshop();
  assert.equal(lab.game.dataset.surveyorSelectedPatch, 'a');
  assert.equal(lab.game.dataset.surveyorPatch, undefined, 'the game region cannot impersonate a patch-choice button');
  const action = surveyorAction => lab.click({ surveyorAction });
  action('probe'); action('probe');
  assert.equal(lab.forces[0].attributes['aria-pressed'], 'true', 'two measurements do not silently change force');
  lab.click({ surveyorForce: '3' }); action('probe');
  for (let i = 0; i < 3; i++) action('trench');
  assert.equal(lab.game.dataset.surveyorDigs, '3');
  action('wider'); action('touchdown');
  assert.equal(lab.game.dataset.surveyorOutcome, 'accepted');
  assert.deepEqual(lab.events, ['surveyor-soil-success']);
  lab.click({ surveyorPatch: 'b' });
  assert.equal(lab.game.dataset.surveyorOutcome, 'ready');
  lab.click({ surveyorPatch: 'a' }); action('touchdown');
  assert.equal(lab.game.dataset.surveyorOutcome, 'accepted');
  assert.deepEqual(lab.events, ['surveyor-soil-success', 'surveyor-soil-success'], 'host can offer its cancelled completion ceremony again');
  action('restart');
  assert.equal(lab.game.dataset.surveyorSelectedForce, '1');
  assert.equal(lab.game.dataset.surveyorDigs, '0');
  assert.equal(lab.game.dataset.surveyorSelectedPatch, 'a');
  lab.controller.dispose();
});
