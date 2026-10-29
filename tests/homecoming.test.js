import test from 'node:test';
import assert from 'node:assert/strict';
import { createHomecomingTimeline, missionViews } from '../src/journey-experience.js';
import { readFileSync } from 'node:fs';

function harness({ brokenCancel = false } = {}) {
  let now = 0, count = 0;
  const tasks = new Map(), phases = [];
  const timeline = createHomecomingTimeline({
    onPhase: phase => phases.push(phase),
    onComplete: () => count++,
    schedule(callback, delay) { const id = Symbol(); tasks.set(id, { callback, at: now + delay }); return id; },
    cancel(id) { if (!brokenCancel) tasks.delete(id); },
  });
  return { timeline, phases, get completions() { return count; }, get pending() { return tasks.size; },
    advance(ms) { now += ms; for (const [id, task] of [...tasks]) if (task.at <= now) { tasks.delete(id); task.callback(); } },
  };
}

test('homecoming shows the real photo then yields to graduation once, without delaying reduced-motion users', () => {
  const h = harness();
  h.timeline.start();
  assert.deepEqual(h.phases, ['flight']);
  h.advance(2400);
  assert.deepEqual(h.phases, ['flight', 'photo']);
  h.advance(4800);
  assert.equal(h.completions, 1);
  assert.equal(h.phases.at(-1), 'complete');
  h.timeline.finish();
  assert.equal(h.completions, 1);
  const reduced = harness();
  reduced.timeline.start({ reducedMotion: true });
  assert.deepEqual(reduced.phases, ['complete']);
  assert.equal(reduced.pending, 0);
});

test('skip, close, and restart cancel old homecoming work even if a late timer still fires', () => {
  const closed = harness({ brokenCancel: true });
  closed.timeline.start();
  closed.timeline.stop();
  closed.advance(10000);
  assert.equal(closed.completions, 0);
  assert.deepEqual(closed.phases, ['flight']);
  const skipped = harness({ brokenCancel: true });
  skipped.timeline.start();
  skipped.timeline.finish();
  skipped.advance(10000);
  assert.equal(skipped.completions, 1);
  assert.deepEqual(skipped.phases, ['flight', 'complete']);
  const replay = harness({ brokenCancel: true });
  replay.timeline.start();
  replay.advance(1000);
  replay.timeline.start();
  replay.advance(1400);
  assert.deepEqual(replay.phases, ['flight', 'flight']);
  replay.advance(5800);
  assert.equal(replay.completions, 1);
});

test('four mission perspectives use shipped official observations and identify historical Voyager imagery', () => {
  assert.deepEqual(Object.keys(missionViews), ['curiosity', 'ingenuity', 'webb', 'voyager']);
  for (const view of Object.values(missionViews)) {
    assert.ok(view.credit && view.caption && view.voice && view.kind);
    assert.match(new URL(view.source).hostname, /(?:^|\.)nasa\.gov$/);
    assert.ok(readFileSync(new URL(`../public${view.image}`, import.meta.url)).length > 10000);
  }
  assert.match(missionViews.voyager.caption, /1990.*2020/);
  assert.match(missionViews.webb.kind, /Infrared composite/);
});
