let voyagerDistanceCache = null;

function horizonsTime(date) {
  return date.toISOString().slice(0, 16).replace("T", " ");
}

export async function fetchVoyagerDistance({
  now = Date.now(),
  fetchImpl = fetch,
} = {}) {
  if (
    voyagerDistanceCache &&
    now - voyagerDistanceCache.fetchedAt < 60 * 60 * 1000
  )
    return voyagerDistanceCache.payload;

  const observedAt = new Date(Math.floor(now / 60000) * 60000);
  const stopAt = new Date(observedAt.getTime() + 2 * 60000);
  const parameters = new URLSearchParams({
    format: "json",
    COMMAND: "'-31'",
    OBJ_DATA: "'NO'",
    MAKE_EPHEM: "'YES'",
    EPHEM_TYPE: "'OBSERVER'",
    CENTER: "'500@399'",
    START_TIME: `'${horizonsTime(observedAt)}'`,
    STOP_TIME: `'${horizonsTime(stopAt)}'`,
    STEP_SIZE: "'1 min'",
    QUANTITIES: "'20'",
    RANGE_UNITS: "'KM'",
    CSV_FORMAT: "'YES'",
  });
  const response = await fetchImpl(
    `https://ssd.jpl.nasa.gov/api/horizons.api?${parameters}`,
    { signal: AbortSignal.timeout(12000) },
  );
  if (!response.ok) throw new Error(`Horizons returned ${response.status}`);
  const data = await response.json();
  const table = String(data.result || "").match(/\$\$SOE\s*([\s\S]*?)\s*\$\$EOE/);
  const row = table?.[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);
  const columns = row?.split(",").map((value) => value.trim()) || [];
  const distanceKm = Number(columns[3]);
  const rangeRateKmS = Number(columns[4]);
  if (!Number.isFinite(distanceKm) || !Number.isFinite(rangeRateKmS))
    throw new Error("Horizons response did not include range data");

  const payload = {
    distanceKm,
    rangeRateKmS,
    observedAt: observedAt.toISOString(),
    fetchedAt: new Date(now).toISOString(),
    model: "JPL Horizons apparent geocentric range",
    target: "Voyager 1 (-31)",
    center: "Earth center (399)",
    telemetry: false,
    source: "NASA/JPL Horizons API",
    sourceUrl: "https://ssd-api.jpl.nasa.gov/doc/horizons.html",
    apiVersion: data.signature?.version || "unknown",
  };
  voyagerDistanceCache = { fetchedAt: now, payload };
  return payload;
}
