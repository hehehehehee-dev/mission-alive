import test from "node:test";
import assert from "node:assert/strict";
import { parseDsnNow } from "../server/dsn-now.mjs";

const config = `<config><sites>
  <site name="gdscc" friendlyName="Goldstone"><dish name="DSS26"/></site>
  <site name="mdscc" friendlyName="Madrid"><dish name="DSS54"/></site>
  <site name="cdscc" friendlyName="Canberra"><dish name="DSS34"/></site>
</sites><spacecraftMap>
  <spacecraft name="jwst" friendlyName="James Webb Space Telescope"/>
  <spacecraft name="vgr1" friendlyName="Voyager 1"/>
</spacecraftMap></config>`;

test("DSN feed shows only active links and expands NASA spacecraft names", () => {
  const now = Date.parse("2026-10-07T21:30:00Z");
  const feed = `<dsn>
    <station friendlyName="Goldstone" timeUTC="${now - 5000}"/>
    <station friendlyName="Madrid" timeUTC="${now - 5000}"/>
    <station friendlyName="Canberra" timeUTC="${now - 5000}"/>
    <dish name="DSS26"><upSignal active="true" spacecraft="JWST"/><downSignal active="true" spacecraft="JWST"/><downSignal active="false" spacecraft="VGR1"/></dish>
    <dish name="DSS54"><target name="DSN"/><downSignal active="true" spacecraft="DSN"/></dish>
    <dish name="DSS34"><downSignal active="true" spacecraft="VGR1"/></dish>
  </dsn>`;
  const result = parseDsnNow(feed, config, now);
  assert.equal(result.live, true);
  assert.deepEqual(result.stations.map((station) => station.name), ["Goldstone", "Madrid", "Canberra"]);
  assert.deepEqual(result.stations[0].links[0], { antenna: "DSS26", code: "JWST", spacecraft: "James Webb Space Telescope", sending: true, receiving: true });
  assert.equal(result.stations[1].links.length, 0);
  assert.equal(result.stations[2].links[0].spacecraft, "Voyager 1");
  assert.equal(result.stations[2].links[0].sending, false);
});

test("stale NASA timestamps cannot be presented as live", () => {
  const now = Date.parse("2026-10-07T21:30:00Z");
  const feed = `<dsn><station friendlyName="Goldstone" timeUTC="${now - 180000}"/><dish name="DSS26"><downSignal active="true" spacecraft="JWST"/></dish></dsn>`;
  const result = parseDsnNow(feed, config, now);
  assert.equal(result.live, false);
  assert.equal(result.stations[0].available, false);
  assert.equal(result.stations[0].links.length, 0);
});

test("a Webb assignment without an active JWST signal is not a contact", () => {
  const now = Date.parse("2026-10-21T12:00:00Z");
  const start = `<dsn><station friendlyName="Goldstone" timeUTC="${now}"/><dish name="DSS26"><target name="JWST" id="170"/>`;
  for (const signals of ["", '<upSignal active="false" spacecraft="JWST"/><downSignal active="false" spacecraft="JWST"/>']) {
    const result = parseDsnNow(start + signals + "</dish></dsn>", config, now);
    assert.deepEqual(result.stations[0].links, []);
  }
  const active = parseDsnNow(start + '<upSignal active="true" spacecraft="JWST"/></dish></dsn>', config, now);
  assert.deepEqual(active.stations[0].links, [{ antenna: "DSS26", code: "JWST", spacecraft: "James Webb Space Telescope", sending: true, receiving: false }]);
});
