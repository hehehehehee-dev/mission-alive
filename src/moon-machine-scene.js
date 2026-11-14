import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const LABELS = Object.freeze({
  apollo17: 'Apollo 17 Lunar Roving Vehicle',
  surveyor3: 'Surveyor 3',
});

function disposeTree(root) {
  root.traverse((node) => {
    node.geometry?.dispose?.();
    if (Array.isArray(node.material)) node.material.forEach((material) => material.dispose?.());
    else node.material?.dispose?.();
  });
}

export function mountMoonMachineScene(host, id, { reducedMotion = false } = {}) {
  if (!host || !LABELS[id]) return { dispose() {} };
  const fallback = host.querySelector('[data-moon-model-fallback]');
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    host.classList.add('is-fallback');
    if (fallback) fallback.hidden = false;
    return { dispose() {} };
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', LABELS[id]);
  host.prepend(canvas);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(4.8, 3.1, 5.7);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 4.5;
  controls.maxDistance = 9;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.target.set(0, 1.05, 0);
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 0.55;
  let interacted = false;

  scene.add(new T.HemisphereLight(0xcde6f2, 0x17130f, 2.5));
  const key = new T.DirectionalLight(0xffd6a0, 5.2);
  key.position.set(3.5, 7, 4.5);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  scene.add(key);
  const rim = new T.DirectionalLight(0x8ad5ff, 2.8);
  rim.position.set(-4, 3, -5);
  scene.add(rim);

  const material = (color, metalness = 0.25, roughness = 0.58) =>
    new T.MeshStandardMaterial({ color, metalness, roughness });
  const palette = {
    frame: material('#b8c1c5', 0.72, 0.28),
    pale: material('#d8d7ce', 0.35, 0.58),
    gold: material('#c89542', 0.68, 0.34),
    dark: material('#151b1e', 0.15, 0.78),
    blue: material('#577f91', 0.35, 0.48),
    solar: material('#234c70', 0.28, 0.38),
  };
  const root = new T.Group();
  root.rotation.y = -0.42;
  scene.add(root);

  const mesh = (geometry, mat, parent = root) => {
    const item = new T.Mesh(geometry, mat);
    item.castShadow = true;
    item.receiveShadow = true;
    parent.add(item);
    return item;
  };
  const box = (size, mat, position, parent = root) => {
    const item = mesh(new T.BoxGeometry(...size), mat, parent);
    item.position.set(...position);
    return item;
  };
  const cylinder = (radiusTop, radiusBottom, height, sides, mat, position, parent = root) => {
    const item = mesh(new T.CylinderGeometry(radiusTop, radiusBottom, height, sides), mat, parent);
    item.position.set(...position);
    return item;
  };
  const rod = (from, to, radius, mat, parent = root) => {
    const start = new T.Vector3(...from);
    const end = new T.Vector3(...to);
    const item = cylinder(radius, radius, start.distanceTo(end), 10, mat, [0, 0, 0], parent);
    item.position.copy(start).add(end).multiplyScalar(0.5);
    item.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), end.clone().sub(start).normalize());
    return item;
  };

  const makeLrv = () => {
    box([2.45, 0.18, 1.35], palette.frame, [0, 0.8, 0]);
    box([1.75, 0.18, 1.05], palette.gold, [0, 0.99, 0]);
    for (const x of [-1.32, 1.32]) for (const z of [-0.72, 0.72]) {
      const wheel = cylinder(0.39, 0.39, 0.25, 24, palette.dark, [x, 0.43, z]);
      wheel.rotation.z = Math.PI / 2;
      const hub = cylinder(0.13, 0.13, 0.3, 16, palette.frame, [x, 0.43, z]);
      hub.rotation.z = Math.PI / 2;
      rod([x, 0.52, z], [x * 0.68, 0.82, z * 0.7], 0.045, palette.frame);
    }
    for (const x of [-0.47, 0.42]) {
      box([0.62, 0.12, 0.55], palette.blue, [x, 1.2, 0.08]);
      const back = box([0.62, 0.64, 0.1], palette.blue, [x, 1.53, 0.3]);
      back.rotation.x = -0.12;
    }
    rod([0.93, 1.04, -0.27], [0.93, 2.1, -0.27], 0.045, palette.frame);
    const dish = mesh(new T.CircleGeometry(0.38, 32), palette.gold);
    dish.position.set(0.93, 2.05, -0.2);
    dish.rotation.set(-0.55, 0.15, 0.12);
    rod([-0.92, 1, -0.2], [-0.92, 1.8, -0.2], 0.04, palette.frame);
    box([0.48, 0.35, 0.38], palette.pale, [-0.92, 1.83, -0.2]);
  };

  const makeSurveyor = () => {
    const body = cylinder(0.72, 0.92, 0.66, 6, palette.gold, [0, 1.22, 0]);
    body.rotation.y = Math.PI / 6;
    const feet = [[-1.48, 0.14, 0.92], [1.48, 0.14, 0.92], [0, 0.14, -1.55]];
    for (const foot of feet) {
      rod([0, 1.13, 0], [foot[0], 0.25, foot[2]], 0.055, palette.frame);
      rod([0, 0.94, 0], [foot[0] * 0.78, 0.38, foot[2] * 0.78], 0.035, palette.frame);
      const pad = cylinder(0.27, 0.32, 0.08, 18, palette.pale, foot);
      pad.scale.z = 0.7;
    }
    rod([0, 1.5, 0], [0, 2.72, 0], 0.045, palette.frame);
    box([0.95, 0.09, 0.64], palette.solar, [0.08, 2.55, 0.02]).rotation.z = -0.18;
    box([0.5, 0.42, 0.42], palette.pale, [-0.5, 1.7, 0.18]);
    const lens = cylinder(0.12, 0.12, 0.13, 18, palette.dark, [-0.5, 1.7, 0.43]);
    lens.rotation.x = Math.PI / 2;
    rod([0.52, 1.12, 0.1], [1.22, 0.42, 0.28], 0.045, palette.frame);
    box([0.34, 0.12, 0.24], palette.gold, [1.27, 0.38, 0.3]);
    const antenna = mesh(new T.CircleGeometry(0.34, 28), palette.pale);
    antenna.position.set(0.52, 1.88, -0.05);
    antenna.rotation.set(-0.48, -0.22, 0.05);
  };

  if (id === 'apollo17') makeLrv();
  else makeSurveyor();

  const ground = cylinder(3.15, 3.3, 0.2, 72, material('#4e4a43', 0, 0.96), [0, -0.08, 0], scene);
  ground.receiveShadow = true;
  const halo = mesh(new T.RingGeometry(2.55, 3.05, 72), new T.MeshBasicMaterial({ color: 0x8cb8cc, transparent: true, opacity: 0.12, side: T.DoubleSide }), scene);
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.025;

  let visible = true;
  let disposed = false;
  let frame = 0;
  const render = () => {
    frame = 0;
    if (disposed || !visible) return;
    controls.update();
    renderer.render(scene, camera);
    if (controls.autoRotate || controls.enableDamping) frame = requestAnimationFrame(render);
  };
  const schedule = () => { if (!frame && !disposed && visible) frame = requestAnimationFrame(render); };
  const resize = () => {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    schedule();
  };
  const stopAuto = () => { interacted = true; controls.autoRotate = false; schedule(); };
  const resetView = () => {
    camera.position.set(4.8, 3.1, 5.7);
    controls.target.set(0, 1.05, 0);
    controls.update();
    schedule();
  };
  const keydown = (event) => {
    const keyMap = { ArrowLeft: 0.12, ArrowRight: -0.12 };
    if (keyMap[event.key]) {
      event.preventDefault();
      stopAuto();
      camera.position.sub(controls.target).applyAxisAngle(new T.Vector3(0, 1, 0), keyMap[event.key]).add(controls.target);
      camera.lookAt(controls.target);
      schedule();
    } else if (event.key === '+' || event.key === '=') {
      event.preventDefault(); stopAuto(); camera.position.lerp(controls.target, 0.1); schedule();
    } else if (event.key === '-' || event.key === '_') {
      event.preventDefault(); stopAuto(); camera.position.lerp(controls.target, -0.1); schedule();
    } else if (event.key === '0') {
      event.preventDefault(); stopAuto(); resetView();
    }
  };
  const contextLost = (event) => {
    event.preventDefault();
    host.classList.add('is-fallback');
    if (fallback) fallback.hidden = false;
  };
  canvas.addEventListener('pointerdown', stopAuto);
  canvas.addEventListener('keydown', keydown);
  canvas.addEventListener('webglcontextlost', contextLost);
  controls.addEventListener('change', schedule);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting !== false;
    if (visible) schedule();
    else if (frame) { cancelAnimationFrame(frame); frame = 0; }
  }, { rootMargin: '120px' });
  intersectionObserver.observe(host);
  const motionObserver = new MutationObserver(() => {
    const reduced = document.body.classList.contains('motion-reduced') || matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotate = !reduced && !interacted;
    if (reduced) { controls.update(); renderer.render(scene, camera); }
    else schedule();
  });
  motionObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  resize();

  return {
    setReduced(value) {
      controls.autoRotate = !value && !interacted;
      if (value) { controls.update(); renderer.render(scene, camera); }
      else schedule();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionObserver.disconnect();
      controls.dispose();
      canvas.removeEventListener('pointerdown', stopAuto);
      canvas.removeEventListener('keydown', keydown);
      canvas.removeEventListener('webglcontextlost', contextLost);
      disposeTree(scene);
      renderer.dispose();
      canvas.remove();
    },
  };
}
