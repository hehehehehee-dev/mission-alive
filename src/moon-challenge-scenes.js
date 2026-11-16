import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildLunarRover, buildSurveyor, lunarGround } from './moon-model-detail.js';

// Keep the 3D fender preview on the same teaching geometry as the side-view
// workshop diagram. The diagram's 24 cm wheel radius maps to the 3D wheel's
// .75-unit radius, and its patch begins 8 cm behind the wheel centre.
const LRV_CM_TO_SCENE = .75 / 24;
export function lrvRepairSceneTransform(configuration) {
  return {
    anchor: {
      x: -1.15 - 8 * LRV_CM_TO_SCENE,
      y: .78 + .75 + configuration.clearance * LRV_CM_TO_SCENE,
      z: 1.18,
    },
    length: configuration.length * LRV_CM_TO_SCENE,
    angle: T.MathUtils.degToRad(configuration.angle),
    mountHeight: Math.max(.012, configuration.clearance * LRV_CM_TO_SCENE),
  };
}

function createStage(host, label, cameraPosition = [5, 3.5, 7], target = [0, 1, 0]) {
  let renderer;
  try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
  catch { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.65;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', label);
  host.prepend(canvas);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(35, 1, .1, 50);
  camera.position.set(...cameraPosition);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 4;
  controls.maxDistance = 15;
  controls.maxPolarAngle = Math.PI * .48;
  controls.rotateSpeed = .55;
  controls.dampingFactor = .12;
  controls.target.set(...target);
  scene.add(new T.HemisphereLight(0xcde8f5, 0x21160f, 2.6));
  const key = new T.DirectionalLight(0xffd5a1, 5);
  key.position.set(4, 7, 5); key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  key.shadow.camera.left = key.shadow.camera.bottom = -7;
  key.shadow.camera.right = key.shadow.camera.top = 7;
  key.shadow.bias = -.0015;
  key.shadow.normalBias = .035;
  scene.add(key);
  const rim = new T.DirectionalLight(0x7fcfff, 2.5);
  rim.position.set(-5, 4, -4); scene.add(rim);
  let disposed = false, frame = 0, activeUntil = 0, visible = false, lastFrame = 0;
  const render = (time = 0) => {
    frame = 0;
    if (disposed || !visible || document.hidden || !host.getClientRects().length) return;
    if (time - lastFrame < 30) { frame = requestAnimationFrame(render); return; }
    lastFrame = time;
    controls.update();
    renderer.render(scene, camera);
    if (time < activeUntil) frame = requestAnimationFrame(render);
  };
  const invalidate = (duration = 180) => {
    if (disposed) return;
    activeUntil = Math.max(activeUntil, performance.now() + duration);
    if (!frame) frame = requestAnimationFrame(render);
  };
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) invalidate();
    else { cancelAnimationFrame(frame); frame = 0; }
  });
  visibilityObserver.observe(host);
  controls.addEventListener('change', () => invalidate());
  const resize = () => {
    const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    renderer.setSize(width, height, false); invalidate();
  };
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();
  const material = (color, metalness = .2, roughness = .65) => new T.MeshStandardMaterial({ color, metalness, roughness });
  const mesh = (geometry, mat, parent = scene, position = [0, 0, 0]) => {
    const item = new T.Mesh(geometry, mat); item.position.set(...position); item.castShadow = true; item.receiveShadow = true; parent.add(item); return item;
  };
  const box = (size, mat, parent, position) => mesh(new T.BoxGeometry(...size), mat, parent, position);
  const cylinder = (r1, r2, height, sides, mat, parent, position) => mesh(new T.CylinderGeometry(r1, r2, height, sides), mat, parent, position);
  const rod = (from, to, radius, mat, parent = scene) => {
    const a = new T.Vector3(...from), b = new T.Vector3(...to);
    const item = cylinder(radius, radius, a.distanceTo(b), 9, mat, parent, [0, 0, 0]);
    item.position.copy(a).add(b).multiplyScalar(.5);
    item.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return item;
  };
  const keydown = (event) => {
    const angle = event.key === 'ArrowLeft' ? .12 : event.key === 'ArrowRight' ? -.12 : 0;
    if (angle) { event.preventDefault(); camera.position.sub(controls.target).applyAxisAngle(new T.Vector3(0, 1, 0), angle).add(controls.target); invalidate(); }
    else if (event.key === '+' || event.key === '=') { event.preventDefault(); camera.position.lerp(controls.target, .1); invalidate(); }
    else if (event.key === '-' || event.key === '_') { event.preventDefault(); camera.position.lerp(controls.target, -.1); invalidate(); }
  };
  const contextLost = (event) => {
    event.preventDefault();
    host.closest('.moon-game')?.classList.remove('has-3d-challenge');
  };
  canvas.addEventListener('keydown', keydown);
  canvas.addEventListener('webglcontextlost', contextLost);
  return {
    scene, camera, controls, material, mesh, box, cylinder, rod, invalidate,
    reduced: () => document.body.classList.contains('motion-reduced') || matchMedia('(prefers-reduced-motion: reduce)').matches,
    dispose() {
      disposed = true; cancelAnimationFrame(frame); resizeObserver.disconnect(); visibilityObserver.disconnect(); controls.dispose(); canvas.removeEventListener('keydown', keydown); canvas.removeEventListener('webglcontextlost', contextLost);
      scene.traverse((node) => { node.geometry?.dispose?.(); if (Array.isArray(node.material)) node.material.forEach((m) => m.dispose?.()); else node.material?.dispose?.(); });
      renderer.dispose(); canvas.remove();
    },
  };
}

export function mountLrvChallengeScene(host) {
  const stage = createStage(host, 'Interactive 3D Apollo 17 dust-fender simulation', [-5.8, 4.4, 7.2], [0, 1.25, 0]);
  if (!stage) return null;
  const { scene, material, mesh, box, cylinder, rod, invalidate } = stage;
  const frame = material('#b9c6cb', .7, .3);
  // These colors intentionally match the SVG workshop diagram so the learner
  // recognises one design in two views rather than two different repairs.
  const maps = material('#567f67', .05, .78), tape = material('#e9ece5', .15, .5), clamp = material('#efaf6b', .35, .42);
  const warning = material('#ff9c58', .05, .5), caught = material('#67e0de', .05, .4);
  const { wheels } = buildLunarRover(stage);
  lunarGround(stage);
  const patchPivot = new T.Group(); scene.add(patchPivot);
  const patch = box([1, .065, .28], maps, patchPivot, [.5, 0, 0]);
  const tapeBandA = box([.075, .1, .32], tape, patchPivot, [.3, 0, 0]);
  const tapeBandB = box([.075, .1, .32], tape, patchPivot, [.63, 0, 0]);
  const clampA = box([.055, .15, .36], clamp, patchPivot, [.08, 0, 0]);
  const clampB = box([.055, .15, .36], clamp, patchPivot, [.2, 0, 0]);
  // The connector is the same short vertical mount drawn beside the wheel in
  // the 2D diagram. It changes with clearance but stays fixed to that wheel.
  const patchMount = box([.065, 1, .28], frame, scene, [0, 0, 0]);
  // Printed map lines distinguish the astronaut-made patch from a solid panel.
  const mapInk = material('#675d49', 0, .9);
  for (let i = 0; i < 5; i++) box([.006, .008, .24], mapInk, patch, [-.4 + i * .2, .037, 0]);
  for (let i = 0; i < 3; i++) box([.94, .008, .006], mapInk, patch, [0, .038, -.08 + i * .08]);
  const dust = Array.from({ length: 12 }, (_, index) => {
    const dot = mesh(new T.SphereGeometry(.055, 7, 6), warning, scene, [-1.2, .8, 0]);
    dot.visible = false; dot.userData.index = index; return dot;
  });
  let configuration = null, timer = 0, dustFrame = 0, disposed = false;
  const update = ({ configuration: next, result }) => {
    configuration = next;
    const transform = lrvRepairSceneTransform(next);
    patch.scale.x = transform.length; patch.position.x = transform.length / 2;
    patchPivot.position.set(transform.anchor.x, transform.anchor.y, transform.anchor.z);
    patchPivot.rotation.z = transform.angle;
    patchMount.position.set(transform.anchor.x, 1.53 + transform.mountHeight / 2, transform.anchor.z);
    patchMount.scale.y = transform.mountHeight;
    patchMount.visible = next.maps;
    const geometryFailure = !result?.wheelSafe || !result?.equipmentSafe;
    maps.color.set(geometryFailure ? '#a9383a' : '#567f67');
    frame.color.set(geometryFailure ? '#ff766e' : '#b9c6cb');
    patch.visible = next.maps; tapeBandA.visible = tapeBandB.visible = next.maps && next.tape;
    clampA.visible = clampB.visible = next.maps && next.tape && next.attachment === 'clamps';
    invalidate();
  };
  const test = (result) => {
    clearTimeout(timer);
    cancelAnimationFrame(dustFrame);
    const duration = stage.reduced() ? 0 : 1100;
    dust.forEach((dot, index) => {
      dot.visible = true;
      dot.material = index < result.dustReaching ? warning : caught;
      dot.position.set(-1.35, .72 + (index % 4) * .18, .95 + (index % 3 - 1) * .2);
    });
    const start = performance.now();
    const animate = (now) => {
      if (disposed) return;
      const progress = duration ? Math.min(1, (now - start) / duration) : 1;
      dust.forEach((dot, index) => {
        const escaped = index < result.dustReaching;
        dot.position.x = -1.35 + progress * (escaped ? 2.9 : 1.25);
        dot.position.y = .72 + (index % 4) * .18 + Math.sin(progress * Math.PI) * .5;
      });
      wheels.forEach(wheel => { wheel.rotation.y = progress * Math.PI * 2; });
      invalidate();
      if (progress < 1) dustFrame = requestAnimationFrame(animate);
      else timer = window.setTimeout(() => { dust.forEach((dot) => { dot.visible = false; }); invalidate(); }, 700);
    };
    dustFrame = requestAnimationFrame(animate);
  };
  return { update, test, dispose() { disposed = true; clearTimeout(timer); cancelAnimationFrame(dustFrame); stage.dispose(); } };
}

export function mountSurveyorChallengeScene(host) {
  const stage = createStage(host, 'Interactive 3D Surveyor soil sampling transect', [6.4, 4.6, 8.5], [0, 1.1, 0]);
  if (!stage) return null;
  const { scene, material, mesh, box, cylinder, rod, invalidate } = stage;
  const soilMaterials = [material('#8e8172', 0, .95), material('#706a64', 0, .98), material('#a08b72', 0, .92)];
  const frame = material('#c2cdd0', .65, .3), gold = material('#d0a452', .55, .42), blue = material('#4b7894', .25, .45), dark = material('#20282d', .2, .7);
  const lowerLayer = material('#4f5960', 0, .96), softLayer = material('#c4a777', 0, .92), selected = material('#72c9d4', .2, .48);
  lunarGround(stage, 6.1);

  // A continuous geology transect replaces the three landing circles. Surveyor
  // stays in one place while its probe moves between sample points.
  box([6.9, .34, 2.55], dark, scene, [0, .08, .35]).name = 'surveyor-transect';
  const patches = [-2.25, 0, 2.25].map((x, index) => {
    const surface = box([2.08, .16, 2.15], soilMaterials[index], scene, [x, .31, .35]);
    const marker = mesh(new T.TorusGeometry(.27, .035, 8, 28), selected, scene, [x, .42, .15]);
    marker.rotation.x = Math.PI / 2;
    const trench = new T.Group(); trench.position.set(x, .19, 1.47); trench.visible = false; scene.add(trench);
    box([1.65, .22 + index * .07, .08], softLayer, trench, [0, .08, 0]);
    box([1.65, .34, .08], lowerLayer, trench, [0, -.2, 0]);
    for (let line = 0; line < 4; line++) box([1.45, .012, .09], frame, trench, [0, -.06 - line * .08, .01]);
    return { surface, marker, trench };
  });

  const { lander } = buildSurveyor(stage);
  lander.scale.setScalar(.78);
  // Keep the lander close enough to the transect that the sampling action
  // reads as one machine, not a disconnected prop floating elsewhere on the
  // terrain. The arm below makes the selected point explicit from every angle.
  lander.position.set(0, .28, -.78);
  const probe = cylinder(.055, .055, 1.2, 10, blue, scene, [-2.25, 1.3, .15]);
  const probeBoom = rod([0, 1.72, -.62], [-2.25, 1.3, .15], .032, frame, scene);
  const probeBoomLength = probeBoom.geometry.parameters.height;
  const probeAnchor = new T.Vector3(0, 1.72, -.62);
  const updateBoom = (sampleX) => {
    const target = new T.Vector3(sampleX, 1.3, .15);
    const delta = target.clone().sub(probeAnchor);
    probeBoom.position.copy(probeAnchor).add(target).multiplyScalar(.5);
    probeBoom.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
    probeBoom.scale.y = probeAnchor.distanceTo(target) / probeBoomLength;
  };

  // The final pressure experiment uses a separate two-foot rig. It does not
  // move Surveyor or imitate Ingenuity's takeoff and landing.
  const footprint = new T.Group(); scene.add(footprint); footprint.visible = false;
  box([1.75, .12, .18], frame, footprint, [0, .92, 0]);
  const footprintLegs = [-.65, .65].map((x) => {
    rod([x, .9, 0], [x, .18, 0], .035, frame, footprint);
    return cylinder(.28, .31, .1, 20, gold, footprint, [x, .12, 0]);
  });

  let patchIndex = 0, padWidth = 1, touchdownFrame = 0, probeFrame = 0, disposed = false;
  const update = ({ patchId, padWidth: nextWidth, digs }) => {
    patchIndex = Math.max(0, ['a', 'b', 'c'].indexOf(patchId)); padWidth = nextWidth;
    patches.forEach(({ surface, marker, trench }, index) => {
      const id = ['a', 'b', 'c'][index];
      surface.position.y = index === patchIndex ? .37 : .31;
      marker.visible = index === patchIndex;
      trench.visible = Boolean(digs?.[id]);
      trench.scale.x = Math.max(.12, (digs?.[id] || 0) / 3);
    });
    const sampleX = patches[patchIndex].surface.position.x;
    probe.position.x = sampleX;
    probe.position.y = 1.3;
    updateBoom(sampleX);
    footprint.position.set(sampleX, .34, .15);
    footprint.rotation.z = 0;
    footprint.visible = false;
    footprintLegs.forEach((foot) => { foot.scale.x = foot.scale.z = .72 + padWidth * .18; });
    invalidate();
  };
  const probeSoil = (result) => {
    cancelAnimationFrame(probeFrame);
    const top = 1.3, bottom = .42 - Math.min(.28, result.depth * .055), duration = stage.reduced() ? 0 : 520, start = performance.now();
    const animate = (now) => { if (disposed) return; const p = duration ? Math.min(1, (now - start) / duration) : 1; probe.position.y = T.MathUtils.lerp(top, bottom, Math.sin(p * Math.PI)); invalidate(); if (p < 1) probeFrame = requestAnimationFrame(animate); };
    probeFrame = requestAnimationFrame(animate);
  };
  const trench = (id, count) => {
    const index = ['a', 'b', 'c'].indexOf(id);
    if (index >= 0) { patches[index].trench.visible = count > 0; patches[index].trench.scale.x = Math.max(.12, count / 3); invalidate(); }
  };
  const touchdown = (result) => {
    cancelAnimationFrame(touchdownFrame);
    footprint.visible = true;
    const startY = 1.35, endY = .34 - Math.max(result.leftSink, result.rightSink) * .12;
    const angle = Math.atan2(result.rightSink - result.leftSink, 1.3), duration = stage.reduced() ? 0 : 900, start = performance.now();
    const animate = (now) => {
      if (disposed) return;
      const p = duration ? Math.min(1, (now - start) / duration) : 1, eased = 1 - Math.pow(1 - p, 3);
      footprint.position.y = T.MathUtils.lerp(startY, endY, eased);
      footprint.rotation.z = angle * eased;
      invalidate();
      if (p < 1) touchdownFrame = requestAnimationFrame(animate);
    };
    touchdownFrame = requestAnimationFrame(animate);
  };
  const reset = () => {
    cancelAnimationFrame(touchdownFrame); cancelAnimationFrame(probeFrame);
    footprint.visible = false; footprint.rotation.set(0, 0, 0);
    patches.forEach(({ trench }) => { trench.visible = false; }); invalidate();
  };
  return { update, probe: probeSoil, trench, touchdown, reset, dispose() { disposed = true; cancelAnimationFrame(probeFrame); cancelAnimationFrame(touchdownFrame); stage.dispose(); } };
}
