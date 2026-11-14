import test from "node:test";
import assert from "node:assert/strict";
import flightLog from "../src/data/ingenuity-flights.json" with { type: "json" };
import {
  flightComparisonText,
  flightComparisonMarkup,
  renderFlightComparison,
  ingenuityRecordFlight,
} from "../src/ingenuity-flight-comparison.js";

test("NASA final flight log retains all 72 flights and the record flight's final measurements", () => {
  assert.deepEqual(flightLog.flights.map((flight) => flight.flight), Array.from({ length: 72 }, (_, index) => index + 1));
  assert.equal(flightLog.source.url, "https://science.nasa.gov/wp-content/uploads/2024/06/ingenuity-helicopter-flight-log.pdf");
  assert.match(flightLog.source.pdf_sha256, /^[a-f\d]{64}$/);
  assert.deepEqual(ingenuityRecordFlight, {
    flight: 61,
    date: "2023-10-05",
    sol: 933,
    duration_s: 129.5,
    max_altitude_m: 24,
    distance_m: 0,
    max_groundspeed_mps: 0,
  });
  assert.equal(Math.max(...flightLog.flights.map((flight) => flight.max_altitude_m)), 24);
  for (const check of flightLog.source.spot_checks) {
    const row = flightLog.flights.find((flight) => flight.flight === check.flight);
    for (const [key, value] of Object.entries(check)) assert.equal(row[key], value);
  }
});

test("comparison uses measured maximum altitude and duration, never a horizontal-distance comparison", () => {
  const text = flightComparisonText({ maxAltitudeM: 2.184, durationS: 7.916, distanceM: 999 });
  assert.equal(text, "Your flight: 2.2 m, 7.9 s. Flight 61, the real record: 24 m, 129.5 s, straight up and back down.");
  assert.doesNotMatch(text, /999|distance|groundspeed/i);
  assert.match(flightComparisonMarkup(), /hidden/);
  assert.match(flightComparisonMarkup(), />Flight data: NASA Ingenuity flight log</);
});

test("missing or invalid simulator measurements silently select the exact factual fallback", () => {
  const expected = "The real Ingenuity flew 72 times. Its highest flight, number 61, reached 24 meters, straight up and back down.";
  for (const stats of [undefined, null, {}, { maxAltitudeM: 2.2 }, { durationS: 7.9 }, { maxAltitudeM: NaN, durationS: 7.9 }, { maxAltitudeM: 2.2, durationS: Infinity }, { maxAltitudeM: -1, durationS: 7.9 }, { maxAltitudeM: "2.2", durationS: 7.9 }]) {
    assert.equal(flightComparisonText(stats), expected);
  }
});

test("completed attempts reveal their comparison without touching progress or requiring a DOM library", () => {
  const line = { textContent: "" };
  const container = { hidden: true, querySelector: () => line };
  renderFlightComparison(container, { maxAltitudeM: 2.184, durationS: 7.916 });
  assert.equal(container.hidden, false);
  assert.equal(line.textContent, "Your flight: 2.2 m, 7.9 s. Flight 61, the real record: 24 m, 129.5 s, straight up and back down.");
  renderFlightComparison(container);
  assert.match(line.textContent, /^The real Ingenuity flew 72 times\./);
  assert.doesNotThrow(() => renderFlightComparison(null));
});
