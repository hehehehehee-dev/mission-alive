export function createTerrainRockLayout(radius, count, clearings = []) {
  const scatterRange = Math.max(22, Math.floor((radius - 1.6) * 10));
  const rocks = [];
  for (let index = 0; index < count; index += 1) {
    const angle = index * 2.39996;
    const distance = 1.6 + ((index * 37) % scatterRange) / 10;
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    if (
      clearings.some(
        (clearing) =>
          Math.hypot(x - clearing.x, z - clearing.z) < clearing.radius,
      )
    )
      continue;
    rocks.push({
      index,
      x,
      z,
      size: 0.07 + (index % 6) * 0.025,
    });
  }
  return rocks;
}

export const curiosityFieldSites = {
  start: { x: -3, z: 2.3, radius: 1.55 },
  outcrop: { x: 4.6, z: 3.2, radius: 1.65 },
  uplink: { x: -5.2, z: -4.2, radius: 1.65 },
};

function corridorClearings(from, to, steps = 14) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const progress = index / steps;
    return {
      x: from.x + (to.x - from.x) * progress,
      z: from.z + (to.z - from.z) * progress,
      radius: 1.25,
    };
  });
}

export const curiosityTerrainRocks = createTerrainRockLayout(11.5, 110, [
  curiosityFieldSites.start,
  curiosityFieldSites.outcrop,
  curiosityFieldSites.uplink,
  ...corridorClearings(
    curiosityFieldSites.start,
    curiosityFieldSites.outcrop,
  ),
  ...corridorClearings(
    curiosityFieldSites.outcrop,
    curiosityFieldSites.uplink,
  ),
]);
