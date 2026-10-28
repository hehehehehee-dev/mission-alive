import test from "node:test";
import assert from "node:assert/strict";
import { createStampCycle, STAMP_SETTLE_MS } from "../src/stamp-ceremony.js";

function clock() {
  let now = 0, nextId = 0;
  const pending = new Map();
  return {
    schedule(callback, delay) {
      const id = ++nextId;
      pending.set(id, { at: now + delay, callback });
      return id;
    },
    cancel(id) { pending.delete(id); },
    advance(milliseconds) {
      now += milliseconds;
      for (const [id, entry] of [...pending]) {
        if (entry.at <= now) { pending.delete(id); entry.callback(); }
      }
    },
    get pending() { return pending.size; },
  };
}

test("completion waits for a visitor press and commits only when ink settles", () => {
  const time = clock(), events = [];
  const cycle = createStampCycle({ ...time,
    onPress: () => events.push("pressed"),
    onSettled: () => events.push("committed"),
  });
  time.advance(10000);
  assert.equal(cycle.phase, "waiting");
  assert.deepEqual(events, []);
  assert.equal(cycle.press(), true);
  assert.equal(cycle.phase, "stamping");
  assert.deepEqual(events, ["pressed"]);
  time.advance(STAMP_SETTLE_MS - 1);
  assert.deepEqual(events, ["pressed"]);
  time.advance(1);
  assert.equal(cycle.phase, "settled");
  assert.deepEqual(events, ["pressed", "committed"]);
});

test("repeated activation cannot duplicate a stamp during or after its animation", () => {
  const time = clock();
  let awards = 0, thuds = 0;
  const cycle = createStampCycle({ ...time,
    onPress: () => thuds++, onSettled: () => awards++,
  });
  cycle.press();
  for (let i = 0; i < 4; i++) assert.equal(cycle.press(), false);
  time.advance(STAMP_SETTLE_MS);
  assert.equal(cycle.press(), false);
  time.advance(STAMP_SETTLE_MS);
  assert.equal(thuds, 1);
  assert.equal(awards, 1);
});

test("leaving or resetting during the ceremony cancels an uncommitted stamp", () => {
  const time = clock();
  let awards = 0;
  const old = createStampCycle({ ...time, onSettled: () => awards++ });
  old.press();
  time.advance(350);
  old.dispose();
  const current = createStampCycle({ ...time, onSettled: () => awards++ });
  time.advance(2000);
  assert.equal(awards, 0);
  assert.equal(current.phase, "waiting");
  assert.equal(old.press(), false);
  current.press();
  time.advance(STAMP_SETTLE_MS);
  assert.equal(awards, 1);
});

test("a late cancelled timer cannot award after disposal, even if it still fires", () => {
  let callback, awards = 0;
  const cycle = createStampCycle({
    schedule: (value) => { callback = value; return 1; },
    cancel: () => {},
    onSettled: () => awards++,
  });
  cycle.press();
  cycle.dispose();
  callback();
  assert.equal(awards, 0);
  assert.equal(cycle.phase, "disposed");
});
