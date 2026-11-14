import flightLog from "./data/ingenuity-flights.json" with { type: "json" };

export const ingenuityFlightSource = flightLog.source;
export const ingenuityRecordFlight = Object.freeze(
  flightLog.flights.find((flight) => flight.flight === 61),
);

const fallback = "The real Ingenuity flew 72 times. Its highest flight, number 61, reached 24 meters, straight up and back down.";

function hasFlightStat(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function displayStat(value) {
  // The simulator's readout reports tenths; avoid pretending to measure more.
  return String(Number(value.toFixed(1)));
}

export function flightComparisonText(stats) {
  const { maxAltitudeM, durationS } = stats ?? {};
  if (!hasFlightStat(maxAltitudeM) || !hasFlightStat(durationS)) return fallback;
  const real = ingenuityRecordFlight;
  return `Your flight: ${displayStat(maxAltitudeM)} m, ${displayStat(durationS)} s. Flight 61, the real record: ${real.max_altitude_m} m, ${real.duration_s} s, straight up and back down.`;
}

export function flightComparisonMarkup() {
  return `<aside class="flight-comparison" id="flight-comparison" hidden><p class="flight-comparison-text"></p><p class="fine"><a href="${ingenuityFlightSource.url}" target="_blank" rel="noopener noreferrer">Flight data: NASA Ingenuity flight log</a></p></aside>`;
}

export function renderFlightComparison(container, stats) {
  if (!container) return;
  const line = container.querySelector(".flight-comparison-text");
  if (!line) return;
  line.textContent = flightComparisonText(stats);
  container.hidden = false;
}
