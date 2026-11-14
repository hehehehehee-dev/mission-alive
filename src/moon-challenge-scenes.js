import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildLunarRover, buildSurveyor, lunarGround } from './moon-model-detail.js';

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
  const dark = material('#172026', .15, .8), frame = material('#b7c2c6', .7, .3), gold = material('#c99a4d', .6, .38);
  const maps = material('#d9c690', .05, .78), tape = material('#9cc8d4', .15, .5), warning = material('#ff9c58', .05, .5), caught = material('#67e0de', .05, .4);
  const { wheels } = buildLunarRover(stage);
  lunarGround(stage);
  const patchPivot = new T.Group(); patchPivot.position.set(-.62, 1.55, .95); scene.add(patchPivot);
  const patch = box([1, .09, .78], maps, patchPivot, [.5, 0, 0]);
  const tapeBand = box([.1, .13, .84], tape, patchPivot, [.24, 0, 0]);
  const clampA = box([.08, .2, .92], frame, patchPivot, [.12, 0, 0]);
  const clampB = box([.08, .2, .92], frame, patchPivot, [.34, 0, 0]);
  // Printed map lines distinguish the astronaut-made patch from a solid panel.
  const mapInk = material('#675d49', 0, .9);
  for (let i = 0; i < 5; i++) box([.006, .008, .74], mapInk, patch, [-.4 + i * .2, .052, 0]);
  for (let i = 0; i < 3; i++) box([.94, .008, .006], mapInk, patch, [0, .053, -.25 + i * .25]);
  const dust = Array.from({ length: 12 }, (_, index) => {
    const dot = mesh(new T.SphereGeometry(.055, 7, 6), warning, scene, [-1.2, .8, 0]);
    dot.visible = false; dot.userData.index = index; return dot;
  });
  let configuration = null, timer = 0, dustFrame = 0, disposed = false;
  const update = ({ configuration: next }) => {
    configuration = next;
    const length = .72 + (next.length - 20) / 60 * 2.25;
    patch.scale.x = length; patch.position.x = length / 2;
    patchPivot.position.y = 1.42 + next.clearance * .035;
    patchPivot.rotation.z = T.MathUtils.degToRad(next.angle);
    patch.visible = next.maps; tapeBand.visible = next.maps && next.tape;
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
  const stage = createStage(host, 'Interactive 3D Surveyor soil and landing simulation', [5.8, 3.8, 7.8], [0, 1.35, 0]);
  if (!stage) return null;
  const { scene, material, mesh, box, cylinder, rod, invalidate } = stage;
  const soilMaterials = [material('#8e8172', 0, .95), material('#706a64', 0, .98), material('#a08b72', 0, .92)];
  const frame = material('#c2cdd0', .65, .3), gold = material('#d0a452', .55, .42), blue = material('#4b7894', .25, .45), dark = material('#20282d', .2, .7);
  lunarGround(stage, 6.1);
  const patches = [-2.25, 0, 2.25].map((x, index) => {
    const pad = cylinder(1, 1.1, .35, 28, soilMaterials[index], scene, [x, 0, 0]);
    const trench = box([1.25, .12, .35], dark, scene, [x, .2, 0]); trench.visible = false;
    return { pad, trench };
  });
  const { lander, footMeshes } = buildSurveyor(stage);
  const probe = cylinder(.055, .055, 1.2, 10, blue, scene, [-2.25, 1.2, 0]);
  probe.position.y = 1.3;
  lander.position.set(-2.25, .25, 0);
  let patchIndex = 0, padWidth = 1, touchdownFrame = 0, probeFrame = 0, disposed = false;
  const update = ({ patchId, padWidth: nextWidth, digs }) => {
    patchIndex = Math.max(0, ['a', 'b', 'c'].indexOf(patchId)); padWidth = nextWidth;
    patches.forEach(({ pad, trench }, index) => { pad.scale.y = index === patchIndex ? 1.25 : 1; trench.visible = Boolean(digs?.[['a', 'b', 'c'][index]]); });
    probe.position.x = patches[patchIndex].pad.position.x;
    lander.position.x = patches[patchIndex].pad.position.x;
    const cameraShift = lander.position.x - stage.controls.target.x;
    stage.controls.target.x = lander.position.x;
    stage.camera.position.x += cameraShift;
    stage.controls.update();
    lander.position.y = .25;
    lander.rotation.z = 0;
    footMeshes.forEach((foot) => { foot.scale.x = foot.scale.z = .72 + padWidth * .18; });
    invalidate();
  };
  const probeSoil = (result) => {
    cancelAnimationFrame(probeFrame);
    const top = 1.3, bottom = .42 - Math.min(.28, result.depth * .055), duration = stage.reduced() ? 0 : 520, start = performance.now();
    const animate = (now) => { if (disposed) return; const p = duration ? Math.min(1, (now - start) / duration) : 1; probe.position.y = T.MathUtils.lerp(top, bottom, Math.sin(p * Math.PI)); invalidate(); if (p < 1) probeFrame = requestAnimationFrame(animate); };
    probeFrame = requestAnimationFrame(animate);
  };
  const trench = (id, count) => { const index = ['a', 'b', 'c'].indexOf(id); if (index >= 0) { patches[index].trench.visible = count > 0; patches[index].trench.scale.x = Math.max(.18, count / 3); invalidate(); } };
  const touchdown = (result) => {
    cancelAnimationFrame(touchdownFrame);
    const startY = 1.4, endY = .25 - Math.max(result.leftSink, result.rightSink) * .12;
    const angle = Math.atan2(result.rightSink - result.leftSink, 3.2), duration = stage.reduced() ? 0 : 900, start = performance.now();
    const animate = (now) => { if (disposed) return; const p = duration ? Math.min(1, (now - start) / duration) : 1; const eased = 1 - Math.pow(1 - p, 3); lander.position.y = T.MathUtils.lerp(startY, endY, eased); lander.rotation.z = angle * eased; invalidate(); if (p < 1) touchdownFrame = requestAnimationFrame(animate); };
    touchdownFrame = requestAnimationFrame(animate);
  };
  const reset = () => { cancelAnimationFrame(touchdownFrame); cancelAnimationFrame(probeFrame); lander.position.set(-2.25, .25, 0); lander.rotation.set(0, 0, 0); patches.forEach(({ trench }) => { trench.visible = false; }); invalidate(); };
  return { update, probe: probeSoil, trench, touchdown, reset, dispose() { disposed = true; cancelAnimationFrame(probeFrame); cancelAnimationFrame(touchdownFrame); stage.dispose(); } };
}
