import test from "node:test";
import assert from "node:assert/strict";
import { createFrictionFeedback } from "../src/friction-feedback.js";

test("each exhibit introduces its virtue once, then keeps later actionable failure hints", () => {
  const feedback = createFrictionFeedback();
  assert.equal(feedback.failure("curiosity", "Boundary collision."),
    "Rovers move slowly and think first. Replan, then roll.");
  assert.equal(feedback.failure("curiosity", "Rock collision; turn first."), "Rock collision; turn first.");
  assert.equal(feedback.failure("curiosity", "Battery depleted; shorten the route."), "Battery depleted; shorten the route.");
  assert.equal(feedback.failure("ingenuity", "Unsafe touchdown."),
    "Every flight was a risk they chose. Set it up and go again.");
  assert.equal(feedback.failure("ingenuity", "Choose level terrain."), "Choose level terrain.");
  assert.equal(feedback.failure("webb", "Move star A closer."),
    "Eighteen stars is not failure. It is where alignment starts.");
  assert.equal(feedback.failure("webb", "Two images remain; move them to the crosshair."),
    "Two images remain; move them to the crosshair.");
  assert.equal(feedback.failure("voyager", "No one is listening right now. I'm still talking."),
    "No one is listening right now. I'm still talking.");
});

test("independent sequences and explicit exhibit resets restore only the intended first failure", () => {
  const first = createFrictionFeedback();
  const second = createFrictionFeedback();
  const cue = first.failure("curiosity", "First hint.");
  first.failure("webb", "First Webb hint.");
  assert.equal(second.failure("curiosity", "Different sequence."), cue);
  assert.equal(first.failure("curiosity", "Retry within sequence."), "Retry within sequence.");
  first.reset("curiosity");
  assert.equal(first.failure("curiosity", "New attempt sequence."), cue);
  assert.equal(first.failure("webb", "Webb has not reset."), "Webb has not reset.");
  first.reset();
  assert.equal(first.failure("webb", "New session."), "Eighteen stars is not failure. It is where alignment starts.");
  assert.equal(first.failure("toString", "Unknown module hint."), "Unknown module hint.");
});
