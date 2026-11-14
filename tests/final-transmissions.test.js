import test from "node:test";
import assert from "node:assert/strict";
import { storyLayer } from "../src/story-layer.js";
import { t } from "../src/i18n.js";

const finalScripts = {
  curiosity: "I was only supposed to work for two years. Fourteen years later, I'm still here, still climbing. My wheels are worn down and I move slowly, but nobody told me to stop.",
  ingenuity: "Honestly, I was just an experiment. Five flights, just to see if flying on Mars was even possible. I ended up flying seventy-two times. My rotor broke on the last one. But hey, I got to fly.",
  webb: "I'm the new one out here. I only started watching a few years ago, and the light I catch is older than anything you've ever seen. I've got a long watch ahead of me. I'm just getting started.",
  voyager: "They built me to last five years. It's been forty-nine. I'm so far away now that when I say something, it takes a whole day to reach home. But I'm still here. I'm still talking.",
};

test("all four stamp transmissions match the supplied recordings and have local captions", () => {
  for (const [id, script] of Object.entries(finalScripts)) {
    assert.equal(storyLayer[id].transmission, script, id);
    for (const locale of ["es", "vi"]) {
      const caption = t(script, locale);
      assert.notEqual(caption, script, `${id} ${locale}`);
      assert.ok(caption.length > 40, `${id} ${locale}`);
    }
  }
});
