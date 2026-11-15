import * as T from 'three';

// Original teaching reconstructions, using the same metal/foil palette and
// directional lighting vocabulary as the four established machine scenes.
export function lunarGround(stage, radius = 5.8) {
  const { scene, mesh, material } = stage;
  const ground = mesh(new T.CylinderGeometry(radius, radius, .16, 64), material('#69645f', 0, 1), scene, [0, -.12, 0]);
  ground.castShadow = false;
  const rocks = new T.InstancedMesh(new T.IcosahedronGeometry(1, 0), material('#89827a', 0, 1), 34);
  const transform = new T.Object3D();
  for (let i = 0; i < 34; i++) {
    const angle = i * 2.39996, distance = 2.5 + (i % 7) * .4;
    const size = .045 + (i % 5) * .025;
    transform.position.set(Math.cos(angle) * distance, size * .18, Math.sin(angle) * distance);
    transform.scale.set(size * 1.4, size * .6, size);
    transform.rotation.set(i, i * .7, i * .3);
    transform.updateMatrix(); rocks.setMatrixAt(i, transform.matrix);
  }
  scene.add(rocks);
}

export function buildLunarRover(stage) {
  const { scene, material, mesh, box, cylinder, rod } = stage;
  const rover = new T.Group(); scene.add(rover);
  const silver = material('#aab1b1', .7, .3), white = material('#d1d3cd', .3, .65);
  const gold = material('#c69749', .8, .3), dark = material('#1f2529', .3, .6);
  const rubber = material('#333538', .25, .85);
  const wheels = [];
  const fenders = [];
  for (const x of [-1.15, 1.15]) for (const z of [-.95, .95]) {
    const wheel = cylinder(.75, .75, .3, 24, rubber, rover, [x, .78, z]);
    wheel.rotation.x = Math.PI / 2; wheels.push(wheel);
    for (const side of [-1, 1]) {
      const rim = mesh(new T.TorusGeometry(.57, .027, 5, 24), silver, rover, [x, .78, z + side * .16]);
      // Wheel mesh and chevrons suggest the rover's wire wheels without a
      // costly transparent double-sided mesh or dozens of shadow casters.
      for (let j = 0; j < 8; j++) {
        const a = j * Math.PI / 4;
        rod([x, .78, z + side * .17], [x + Math.cos(a) * .56, .78 + Math.sin(a) * .56, z + side * .17], .012, silver, rover).castShadow = false;
      }
      rim.castShadow = false;
    }
    cylinder(.18, .18, .37, 12, gold, rover, [x, .78, z]).rotation.x = Math.PI / 2;
    rod([x * .65, 1.35, 0], [x, .78, z], .045, silver, rover);
    if (!(x < 0 && z > 0)) {
      // The wheel axle runs along Z. Rotate the cylinder axis onto Z, with
      // its half-arc above the hub; an additional Z rotation turns it sideways.
      const fender = mesh(new T.CylinderGeometry(.81, .81, .38, 16, 1, true, -Math.PI / 2, Math.PI), gold, rover, [x, .78, z]);
      fender.rotation.x = -Math.PI / 2;
      fenders.push(fender);
    }
  }
  box([2.65, .14, 1.45], silver, rover, [0, 1.35, 0]);
  box([1.8, .24, 1.15], gold, rover, [.05, 1.15, 0]);
  for (const z of [-.76, .76]) rod([-1.4, 1.42, z], [1.35, 1.42, z], .035, silver, rover);
  for (const z of [-.43, .43]) {
    box([.63, .1, .57], white, rover, [0, 1.72, z]);
    const seat = box([.12, .73, .57], white, rover, [.35, 2.04, z]); seat.rotation.z = -.16;
    for (const x of [-.23, .23]) rod([x, 1.4, z], [x, 1.7, z], .025, silver, rover);
  }
  box([.3, .35, .2], dark, rover, [-.45, 1.8, 0]);
  rod([-.45, 1.9, 0], [-.63, 2.22, 0], .025, silver, rover);
  box([.2, .04, .16], silver, rover, [-.63, 2.22, 0]);
  box([.65, .42, 1.05], gold, rover, [-1.02, 1.64, 0]);
  for (let i = 0; i < 6; i++) box([.018, .012, 1.07], silver, rover, [-1.3 + i * .1, 1.86, 0]);
  rod([-1.2, 1.9, -.5], [-1.2, 3.05, -.5], .025, silver, rover);
  const antenna = new T.Group(); antenna.position.set(-1.2, 3.05, -.5); antenna.rotation.z = -.5; rover.add(antenna);
  mesh(new T.CylinderGeometry(.44, .1, .13, 24, 1, true), white, antenna);
  rod([0, 0, 0], [0, .48, 0], .018, silver, antenna);
  for (const a of [0, 2.094, 4.188]) rod([Math.cos(a) * .4, .08, Math.sin(a) * .4], [0, .48, 0], .012, silver, antenna);
  rod([-.8, 1.8, .48], [-.8, 2.5, .48], .022, silver, rover);
  box([.25, .17, .2], white, rover, [-.8, 2.5, .48]);
  cylinder(.07, .07, .15, 12, dark, rover, [-.8, 2.5, .61]).rotation.x = Math.PI / 2;
  box([.75, .15, 1.15], dark, rover, [1.1, 1.48, 0]);
  for (const z of [-.5, .5]) rod([.8, 1.5, z], [1.5, 1.8, z], .024, silver, rover);
  return { rover, wheels, fenders };
}

export function buildSurveyor(stage) {
  const { scene, material, mesh, box, cylinder, rod } = stage;
  const lander = new T.Group(); scene.add(lander);
  const silver = material('#aab1b1', .7, .3), white = material('#d1d3cd', .3, .65);
  const gold = material('#c69749', .8, .3), dark = material('#1f2529', .3, .6);
  const feet = [];
  const vertices = [0, 2.094, 4.188].map(a => [Math.cos(a), Math.sin(a)]);
  for (let i = 0; i < 3; i++) {
    const [x,z] = vertices[i], next = vertices[(i + 1) % 3];
    rod([x * .65, 1.15, z * .65], [next[0] * .65, 1.15, next[1] * .65], .04, silver, lander);
    rod([x * .65, 1.15, z * .65], [0, 2, 0], .035, silver, lander);
    rod([x * .6, 1.1, z * .6], [x * 1.35, .23, z * 1.35], .05, white, lander);
    rod([x * .25, 1.5, z * .25], [x * 1.35, .23, z * 1.35], .023, silver, lander);
    feet.push(cylinder(.26, .31, .1, 20, white, lander, [x * 1.35, .2, z * 1.35]));
    cylinder(.12, .05, .32, 12, dark, lander, [x * .48, .84, z * .48]);
    const equipment = box([.38, .38, .34], i === 1 ? white : gold, lander, [x * .61, 1.33, z * .61]);
    equipment.rotation.y = -i * 2.094;
  }
  cylinder(.24, .12, .4, 16, dark, lander, [0, .78, 0]);
  rod([0, 1.6, 0], [0, 3.04, 0], .045, white, lander);
  const solar = box([1.05, .045, .65], material('#273d54', .45, .4), lander, [0, 2.79, 0]); solar.rotation.z = -.16;
  for (let i = 0; i < 7; i++) box([.008, .008, .63], silver, solar, [-.46 + i * .15, .025, 0]);
  mesh(new T.SphereGeometry(.18, 16, 10), white, lander, [0, 3.15, 0]);
  rod([-.43, 1.5, .25], [-.43, 2.35, .25], .035, white, lander);
  cylinder(.12, .12, .47, 16, white, lander, [-.43, 2.2, .25]);
  box([.17, .18, .15], dark, lander, [-.43, 2.45, .3]);
  rod([.5, 1.3, .3], [.95, .8, .75], .035, silver, lander);
  rod([.95, .8, .75], [1.25, .3, .95], .03, silver, lander);
  box([.24, .12, .22], white, lander, [1.25, .26, .95]);
  return { lander, footMeshes: feet };
}
