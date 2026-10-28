import test from "node:test";
import assert from "node:assert/strict";
import { fetchVoyagerDistance } from "../server/voyager-horizons.mjs";

test("Voyager Horizons relay requests geocentric range and parses range-rate", async () => {
  const now = Date.parse("2026-10-06T09:00:42Z");
  let requestedUrl = "";
  const payload = await fetchVoyagerDistance({
    now,
    fetchImpl: async (url) => {
      requestedUrl = String(url);
      return {
        ok: true,
        async json() {
          return {
            signature: { version: "test" },
            result: "$$SOE\n2026-Oct-06 09:00, calendar, flag, 25778778563, 38.5490803\n$$EOE",
          };
        },
      };
    },
  });

  const query = new URL(requestedUrl).searchParams;
  assert.equal(query.get("COMMAND"), "'-31'");
  assert.equal(query.get("CENTER"), "'500@399'");
  assert.equal(query.get("QUANTITIES"), "'20'");
  assert.equal(payload.distanceKm, 25778778563);
  assert.equal(payload.rangeRateKmS, 38.5490803);
  assert.equal(payload.observedAt, "2026-10-06T09:00:00.000Z");
  assert.equal(payload.telemetry, false);
});
