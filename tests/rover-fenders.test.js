import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import { buildLunarRover } from '../src/moon-model-detail.js';
import { lrvRepairSceneTransform } from '../src/moon-challenge-scenes.js';

test('fixed rover fenders arch above their wheels and share the wheel axle', () => {
  const scene = new T.Scene();
  const mesh = (geometry, material, parent = scene, position = [0, 0, 0]) => {
    const node = new T.Mesh(geometry, material);
    node.position.set(...position);
    parent.add(node);
    return node;
  };
  const { rover, wheels, fenders } = buildLunarRover({
    scene, mesh,
    material: color => new T.MeshBasicMaterial({ color }),
    box: (size, material, parent, position) => mesh(new T.BoxGeometry(...size), material, parent, position),
    cylinder: (top, bottom, height, segments, material, parent, position) => mesh(new T.CylinderGeometry(top, bottom, height, segments), material, parent, position),
    rod: (start, end, radius, material, parent) => mesh(new T.CylinderGeometry(radius, radius, 1, 3), material, parent, start),
  });
  rover.updateMatrixWorld(true);
  assert.equal(wheels.length, 4);
  assert.equal(fenders.length, 3, 'the repair wheel stays exposed for the learner');
  for (const fender of fenders) {
    const bounds = new T.Box3().setFromObject(fender);
    const size = bounds.getSize(new T.Vector3());
    assert.ok(bounds.min.y >= fender.position.y - 1e-6, 'no part of the arc hangs below the wheel hub');
    assert.ok(Math.abs(size.x - 1.62) < 1e-5, 'arc spans the diameter of the wheel');
    assert.ok(Math.abs(size.y - .81) < 1e-5, 'arc covers the upper half of the wheel');
    assert.ok(Math.abs(size.z - .38) < 1e-5, 'the fender width follows the Z axle');
  }
  rover.traverse(node => { node.geometry?.dispose(); node.material?.dispose(); });
});

test('the Apollo repair preview uses the side-view diagram scale and repair-wheel anchor', () => {
  const short = lrvRepairSceneTransform({ length: 20, angle: 0, clearance: 4 });
  const long = lrvRepairSceneTransform({ length: 80, angle: 35, clearance: 12 });
  assert.deepEqual(short.anchor, { x: -1.4, y: 1.655, z: 1.18 });
  assert.equal(short.length, .625);
  assert.equal(long.length, 2.5);
  assert.ok(long.anchor.y > short.anchor.y, 'raising clearance moves the same wheel-mounted patch upward');
  assert.equal(long.anchor.x, short.anchor.x, 'changing the design must not detach it from the repair wheel');
  assert.equal(long.anchor.z, short.anchor.z);
  assert.equal(long.angle, T.MathUtils.degToRad(35));
});
