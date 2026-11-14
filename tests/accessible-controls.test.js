import test from 'node:test';
import assert from 'node:assert/strict';
import { roverMapCells, roverPosition, describeStar, nextFlightCheckpoint } from '../src/accessible-controls.js';
import { readAccessPreferences } from '../src/access-preferences.js';
import { t } from '../src/i18n.js';

const mission = { size: 5, start: { x: 0, y: 4 }, sample: { x: 1, y: 1 }, goal: { x: 4, y: 0 }, obstacles: new Set(['0,2', '2,3', '3,1', '4,2']) };
test('text map exposes hazards and mission targets, and moves the rover without losing underlying tile information', () => {
  const state = { roverX: 0, roverY: 4, roverDir: 0, sampleAnalyzed: false };
  const start = roverMapCells(mission, state);
  assert.deepEqual(start[4][0], ['Start', 'Rover']);
  assert.deepEqual(start[2][0], ['Rock']);
  assert.deepEqual(start[0][4], ['Uplink']);
  assert.deepEqual(start[1][1], ['Drill outcrop']);
  assert.equal(start.flat().filter(labels => labels.includes('Rock')).length, 4);
  const analyzed = roverMapCells(mission, { ...state, roverX: 1, roverY: 1, sampleAnalyzed: true });
  assert.deepEqual(analyzed[4][0], ['Start']);
  assert.deepEqual(analyzed[1][1], ['Analyzed outcrop', 'Rover']);
  assert.equal(analyzed.flat().filter(labels => labels.includes('Rover')).length, 1);
});

test('nonvisual position and alignment descriptions preserve orientation and coordinates in all three languages', () => {
  const position = roverPosition({ roverX: 3, roverY: 1, roverDir: 1 });
  assert.equal(position, 'Rover: row 2, column 4. Facing east.');
  assert.equal(t(position, 'vi'), 'Xe: hàng 2, cột 4. Hướng đông.');
  assert.equal(t(position, 'es'), 'Vehículo: fila 2, columna 4. Orientado al este.');
  const star = `Image B. ${describeStar({ x: .78, y: .35, locked: false })}`;
  assert.equal(t(star, 'vi'), 'Ảnh B. Ngang 78%, dọc 35%. Đích: 50%, 50%.');
  assert.equal(t('Image A. Focused', 'es'), 'Imagen A. Enfocada');
});

test('paced flight advances exactly one stage per action and ends at the existing touchdown time', () => {
  let flight = 0;
  const visited = [];
  for (let step = 0; step < 5; step++) { flight = nextFlightCheckpoint(flight); visited.push(flight); }
  assert.deepEqual(visited, [.9, 2.4, 4.4, 6, 7.9]);
  assert.equal(nextFlightCheckpoint(flight), 7.9);
});

test('display settings recover from blocked, malformed and untrusted storage without coercing arbitrary values', () => {
  const read = value => readAccessPreferences({ getItem: () => value });
  assert.deepEqual(read('{"contrast":true,"textSize":"large"}'), { contrast: true, textSize: 'large' });
  for (const value of ['null', '[]', '{"contrast":"true","textSize":"huge"}', '{']) {
    assert.deepEqual(read(value), { contrast: false, textSize: 'standard' });
  }
  assert.deepEqual(readAccessPreferences({ getItem() { throw Error('blocked'); } }), { contrast: false, textSize: 'standard' });
});
