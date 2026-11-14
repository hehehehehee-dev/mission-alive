import test from 'node:test';
import assert from 'node:assert/strict';
import { Object3D, Vector3, Group } from 'three';
import { orientWebbMirror, webbWingAngle } from '../src/webb-pose.js';
import { evaluateLrvRepair, lrvRepairHint } from '../src/moon-lrv-game.js';

test('mirror hexagons share a forward-facing plane after their orientation turns', () => {
  const mirror = orientWebbMirror(new Object3D());
  const normal = new Vector3(0,1,0).applyEuler(mirror.rotation);
  assert.ok(Math.abs(normal.x) < 1e-8 && Math.abs(normal.y) < 1e-8);
  assert.ok(normal.z > .99999, 'gold faces point at the front camera, not sideways');
});

test('opening a mirror wing physically increases its visible width', () => {
  for (const side of [-1,1]) {
    const wing = new Group(); wing.position.x = side * 1.02;
    const segment = new Object3D(); segment.position.x = side * .42; wing.add(segment);
    wing.rotation.y = webbWingAngle(side, 0); wing.updateMatrixWorld(true);
    const folded = segment.getWorldPosition(new Vector3());
    wing.rotation.y = webbWingAngle(side, 1); wing.updateMatrixWorld(true);
    const open = segment.getWorldPosition(new Vector3());
    assert.ok(Math.abs(open.x) > Math.abs(folded.x) + .6);
    assert.equal(open.z, 0);
  }
});

test('failed repair hints identify a useful dimension and direction without leaking a winning setting', () => {
  const config = { maps:true, tape:true, attachment:'clamps', length:22, angle:-20, clearance:2 };
  const hint = lrvRepairHint(evaluateLrvRepair(config,{tested:true}));
  assert.match(hint,/Angle: lift.*Clearance: raise/);
  assert.doesNotMatch(hint,/\d/);
  const lengthHint = lrvRepairHint(evaluateLrvRepair({...config, angle:0, clearance:8},{tested:true}));
  assert.match(lengthHint,/Length: extend/);
  assert.doesNotMatch(lengthHint,/\d/);
});
