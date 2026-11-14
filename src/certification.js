// Scene renderers stay separate from the six persistent training credentials.
export const trainingMissions = Object.freeze({
  apollo17: { name: 'Apollo 17 LRV', action: 'Repair', verb: 'REPAIR', heading: 'Keep the dust off the gear' },
  surveyor3: { name: 'Surveyor 3', action: 'Investigate', verb: 'TEST', heading: 'Can this ground hold?' },
  curiosity: { name: 'Curiosity', action: 'Drive', verb: 'DRIVE' },
  ingenuity: { name: 'Ingenuity', action: 'Fly', verb: 'FLY' },
  webb: { name: 'Webb', action: 'Unfold', verb: 'UNFOLD' },
  voyager: { name: 'Voyager 1', action: 'Listen', verb: 'LISTEN' },
});
export const missionIds = Object.freeze(Object.keys(trainingMissions));
export const MISSION_COUNT = missionIds.length;
export function restoredStamps(saved) {
  return new Set(Array.isArray(saved) ? saved.filter(id => Object.hasOwn(trainingMissions, id)) : []);
}
export function certificationComplete(stamps) {
  return missionIds.every(id => stamps.has(id));
}
