import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { orientWebbMirror, webbWingAngle } from './webb-pose.js';
import { recordArtifacts } from "./record-artifacts.js";
import { machinePartGuide } from "./machine-parts.js";
import { landingZones } from './ingenuity-flight-game.js';
import {
  createTerrainRockLayout,
  curiosityFieldSites,
  curiosityTerrainRocks,
} from "./mars-terrain.js";
export function createScene(host, id, onFailure, onInspect = () => {}, onViewChange = () => {}, {onSelectSite = () => {}} = {}) {
  const renderer = new T.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.65;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
  renderer.domElement.addEventListener("webglcontextlost", lost);
  function lost(e) {
    e.preventDefault();
    onFailure();
  }
  const scene = new T.Scene(),
    camera = new T.PerspectiveCamera(36, 1, 0.1, 150);
  camera.position.set(8, 5.5, 9);
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.rotateSpeed = id === 'webb' ? .28 : .55;
  orbit.dampingFactor = .09;
  orbit.enablePan = false;
  orbit.minDistance = 5;
  orbit.maxDistance = 42;
  orbit.maxPolarAngle = Math.PI * 0.49;
  orbit.target.set(0, 1, 0);
  const resize = () => {
    const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  scene.add(new T.HemisphereLight(0xc4ddfa, 0x644226, 3));
  const key = new T.DirectionalLight(0xffd5aa, 5);
  key.position.set(2, 7, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -9;
  key.shadow.camera.right = 9;
  key.shadow.camera.top = 9;
  key.shadow.camera.bottom = -9;
  key.shadow.bias = -0.001;
  scene.add(key);
  const rim = new T.DirectionalLight(0x85baff, 3);
  rim.position.set(-5, 3, -4);
  scene.add(rim);
  const mat = (color, metalness = 0.3, roughness = 0.45) =>
    new T.MeshStandardMaterial({ color, metalness, roughness });
  const silver = mat("#aab1b1", 0.7, 0.3),
    dark = mat("#1f2529", 0.3, 0.6),
    gold = mat("#c69749", 0.8, 0.3),
    white = mat("#d1d3cd", 0.3, 0.65),
    rubber = mat("#151b20", 0.1, 0.85);
  const root = new T.Group();
  scene.add(root);
  let wheels = [],
    rotors = [],
    wings = [],
    segments = [],
    record,
    recordSurface,
    ground,
    stars,
    dust,
    dustMaterial,
    washRings = [],
    ingenuitySites = {},
    ingenuitySitePositions = {},
    flightSitesLayer,
    flightRoute,
    flightShadow,
    flightGuideRing,
    flightSmoke,
    flightSmokeMaterial,
    flightSmokeTexture,
    flightWindArrows = [],
    routeSite = null,
    wasFlightActive = false,
    lastRoverPosition = new T.Vector3(),
    roverWheelTravel = 0,
    lastRoverProgress = null,
    roverInitialized = false,
    st = {},
    reduced = false,
    time = 0;
  function mesh(g, m, parent = root, x = 0, y = 0, z = 0) {
    const o = new T.Mesh(g, m);
    o.position.set(x, y, z);
    o.castShadow = true;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  }
  const box = (w, h, d, m, p = root, x = 0, y = 0, z = 0) =>
    mesh(new T.BoxGeometry(w, h, d), m, p, x, y, z);
  function rod(a, b, r, m, p = root) {
    const v1 = new T.Vector3(...a),
      v2 = new T.Vector3(...b),
      o = mesh(new T.CylinderGeometry(r, r, v1.distanceTo(v2), 10), m, p);
    o.position.copy(v1).add(v2).multiplyScalar(0.5);
    o.quaternion.setFromUnitVectors(
      new T.Vector3(0, 1, 0),
      v2.sub(v1).normalize(),
    );
    return o;
  }
  function terrain(radius = 5.5, rockCount = 45, rockLayout = null) {
    ground = mesh(
      new T.CylinderGeometry(radius - 0.3, radius, 0.3, 96),
      mat("#714e39", 0, 0.95),
      scene,
      0,
      -0.2,
      0,
    );
    const rocks = rockLayout || createTerrainRockLayout(radius, rockCount);
    for (const { index: i, x, z, size } of rocks) {
      const rock = mesh(
        new T.DodecahedronGeometry(size, 0),
        mat(i % 2 ? "#88664a" : "#584330", 0, 1),
        scene,
        x,
        0,
        z,
      );
      rock.scale.set(1.4, 0.6, 1);
      rock.rotation.set(i, i / 2, i / 3);
    }
    const ring = mesh(
      new T.TorusGeometry(radius - 0.25, 0.018, 8, 128),
      mat("#bc9871"),
      scene,
      0,
      -0.02,
      0,
    );
    ring.rotation.x = Math.PI / 2;
  }
  if (id === "curiosity") {
    terrain(11.5, 110, curiosityTerrainRocks);
    box(2.3, 0.5, 1.55, white, root, 0, 0.9, 0);
    box(2.5, 0.08, 1.7, silver, root, 0, 1.19, 0);
    box(0.9, 0.55, 1.15, gold, root, -0.9, 1.08, 0);
    for (let side of [-1, 1])
      for (let i = 0; i < 3; i++) {
        const x = (i - 1) * 1.05,
          z = side * 1.02;
        const wheelRig = new T.Group();
        wheelRig.position.set(x, 0.4, z);
        root.add(wheelRig);
        const wheel = mesh(
          new T.CylinderGeometry(0.4, 0.4, 0.29, 28),
          rubber,
          wheelRig,
        );
        wheel.rotation.x = Math.PI / 2;
        wheels.push(wheelRig);
        for (let j = 0; j < 18; j++) {
          const cleat = box(
            0.04,
            0.32,
            0.07,
            silver,
            wheelRig,
            Math.cos((j * Math.PI) / 9) * 0.399,
            Math.sin((j * Math.PI) / 9) * 0.399,
            0,
          );
          cleat.rotation.z = (j * Math.PI) / 9;
        }
        const hub = mesh(
          new T.CylinderGeometry(0.2, 0.2, 0.31, 16),
          silver,
          wheelRig,
        );
        hub.rotation.x = Math.PI / 2;
        rod(
          [x, 0.45, z],
          [i === 0 ? -0.55 : 0.45, 0.85, side * 0.8],
          0.055,
          silver,
        );
      }
    rod([0.65, 1.15, 0], [0.65, 2.5, 0], 0.085, silver);
    box(0.55, 0.3, 0.48, white, root, 0.72, 2.53, 0);
    for (let z of [-0.14, 0.14]) {
      const lens = mesh(
        new T.CylinderGeometry(0.08, 0.08, 0.12, 16),
        dark,
        root,
        1.02,
        2.55,
        z,
      );
      lens.rotation.z = Math.PI / 2;
    }
    rod([0.8, 1, -0.65], [1.6, 0.6, -0.8], 0.08, silver);
    rod([1.6, 0.6, -0.8], [1.8, 0.3, -0.3], 0.075, silver);
    mesh(
      new T.CylinderGeometry(0.2, 0.2, 0.25, 16),
      dark,
      root,
      1.8,
      0.25,
      -0.3,
    );
    rod([-0.7, 1.3, 0.45], [-0.7, 2, 0.45], 0.025, silver);
    const gridWorld = (x, y) => ({ x: -3 + x * 1.5, z: -2.3 + y * 1.15 });
    const targetPoint = gridWorld(4, 0);
    const target = mesh(
      new T.TorusGeometry(0.42, 0.04, 8, 48),
      mat("#efbd7f", 0.25, 0.35),
      scene,
      targetPoint.x,
      0.025,
      targetPoint.z,
    );
    target.rotation.x = Math.PI / 2;
    const gridMaterial = new T.MeshBasicMaterial({
      color: 0xd7ad80,
      transparent: true,
      opacity: 0.19,
      depthWrite: false,
    });
    for (let y = 0; y < 5; y += 1) {
      for (let x = 0; x < 5; x += 1) {
        const point = gridWorld(x, y);
        const tile = mesh(
          new T.RingGeometry(0.36, 0.39, 4),
          gridMaterial,
          scene,
          point.x,
          0.02,
          point.z,
        );
        tile.rotation.x = -Math.PI / 2;
        tile.rotation.z = Math.PI / 4;
      }
    }
    const obstacleMaterial = mat("#3d2a22", 0.05, 1);
    for (const key of ["0,2", "2,3", "3,1", "4,2"]) {
      const [x, y] = key.split(",").map(Number);
      const point = gridWorld(x, y);
      const rock = mesh(
        new T.DodecahedronGeometry(0.34, 0),
        obstacleMaterial,
        scene,
        point.x,
        0.27,
        point.z,
      );
      rock.scale.set(1.2, 0.75, 1);
      rock.rotation.set(x * 0.4, y * 0.35, (x + y) * 0.2);
    }
    const samplePoint = gridWorld(1, 1);
    const sample = mesh(
      new T.OctahedronGeometry(0.2, 0),
      new T.MeshStandardMaterial({
        color: 0x79d7df,
        emissive: 0x164b57,
        emissiveIntensity: 1.4,
        roughness: 0.3,
      }),
      scene,
      samplePoint.x,
      0.22,
      samplePoint.z,
    );
    sample.rotation.z = Math.PI / 4;
    const fieldOutcrop = mesh(
      new T.OctahedronGeometry(0.38, 1),
      new T.MeshStandardMaterial({
        color: 0x71d8df,
        emissive: 0x174b57,
        emissiveIntensity: 1.25,
        roughness: 0.46,
      }),
      scene,
      curiosityFieldSites.outcrop.x,
      0.3,
      curiosityFieldSites.outcrop.z,
    );
    fieldOutcrop.scale.set(1.3, 0.8, 1);
    const outcropRing = mesh(
      new T.TorusGeometry(0.72, 0.035, 8, 48),
      new T.MeshBasicMaterial({ color: 0x7be7ef }),
      scene,
      curiosityFieldSites.outcrop.x,
      0.035,
      curiosityFieldSites.outcrop.z,
    );
    outcropRing.rotation.x = Math.PI / 2;
    const uplinkRing = mesh(
      new T.TorusGeometry(0.82, 0.045, 8, 48),
      new T.MeshBasicMaterial({ color: 0xefbd7f }),
      scene,
      curiosityFieldSites.uplink.x,
      0.035,
      curiosityFieldSites.uplink.z,
    );
    uplinkRing.rotation.x = Math.PI / 2;
    rod(
      [curiosityFieldSites.uplink.x, 0.05, curiosityFieldSites.uplink.z],
      [curiosityFieldSites.uplink.x, 1.05, curiosityFieldSites.uplink.z],
      0.035,
      silver,
      scene,
    );
    const uplinkDish = mesh(
      new T.CylinderGeometry(0.05, 0.36, 0.16, 24),
      gold,
      scene,
      curiosityFieldSites.uplink.x,
      1.1,
      curiosityFieldSites.uplink.z,
    );
    uplinkDish.rotation.z = Math.PI;
    const dustGeometry = new T.BufferGeometry();
    const dustPositions = [];
    for (let i = 0; i < 70; i++) dustPositions.push(0, 0, 0);
    dustGeometry.setAttribute(
      "position",
      new T.Float32BufferAttribute(dustPositions, 3),
    );
    dustMaterial = new T.PointsMaterial({
      color: 0xd5a16c,
      size: 0.075,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    dust = new T.Points(dustGeometry, dustMaterial);
    scene.add(dust);
    camera.fov = 48;
    camera.updateProjectionMatrix();
    camera.position.set(17, 18, 22);
    orbit.target.set(0, 0.65, 0);
  }
  if (id === "ingenuity") {
    terrain(10, 18);
    ingenuitySitePositions = {
      flat: new T.Vector3(-4.6, 0, -1.8),
      crater: new T.Vector3(0, 0, 3.8),
      rocks: new T.Vector3(4.6, 0, -1.8),
    };
    const siteSurface = (site, color) => {
      const group = new T.Group();
      group.position.copy(ingenuitySitePositions[site]);
      scene.add(group);
      const surface = mesh(
        new T.CircleGeometry(2.48, 64),
        mat(color, 0.02, 0.98),
        group,
        0,
        -0.035,
        0,
      );
      surface.rotation.x = -Math.PI / 2;
      const selector = mesh(
        new T.TorusGeometry(2.58, 0.055, 10, 64),
        new T.MeshBasicMaterial({ color: 0xf2ce7d }),
        group,
        0,
        0.035,
        0,
      );
      selector.rotation.x = Math.PI / 2;
      selector.visible = false;
      group.userData.selector = selector;
      return group;
    };
    ingenuitySites.flat = siteSurface("flat", "#8b6048");
    const flatTarget = mesh(
      new T.RingGeometry(1.1, 1.24, 48),
      new T.MeshBasicMaterial({ color: 0x8ed9c6, side: T.DoubleSide }),
      ingenuitySites.flat,
      0,
      0.005,
      0,
    );
    flatTarget.rotation.x = -Math.PI / 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const pebble = mesh(
        new T.DodecahedronGeometry(0.09 + (i % 3) * 0.035, 0),
        mat("#a37255", 0, 0.95),
        ingenuitySites.flat,
        Math.cos(angle) * (1.65 + (i % 2) * 0.3),
        0.04,
        Math.sin(angle) * (1.65 + (i % 2) * 0.3),
      );
      pebble.scale.y = 0.55;
    }

    ingenuitySites.crater = siteSurface("crater", "#6f4939");
    const craterFloor = mesh(
      new T.CircleGeometry(1.25, 64),
      mat("#3f2b28", 0, 1),
      ingenuitySites.crater,
      0.12,
      -0.005,
      0.04,
    );
    craterFloor.rotation.x = -Math.PI / 2;
    const craterSlope = mesh(
      new T.RingGeometry(1.25, 2.25, 64),
      mat("#9a6548", 0, 0.96),
      ingenuitySites.crater,
      0.12,
      0.008,
      0.04,
    );
    craterSlope.rotation.x = -Math.PI / 2;
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 1.96 + Math.sin(i * 2.4) * 0.18;
      const rimRock = mesh(
        new T.DodecahedronGeometry(0.24 + (i % 4) * 0.055, 0),
        mat(i % 2 ? "#80523e" : "#a46c4d", 0, 0.96),
        ingenuitySites.crater,
        0.12 + Math.cos(angle) * radius,
        0.09,
        0.04 + Math.sin(angle) * radius,
      );
      rimRock.scale.y = 0.55 + (i % 3) * 0.12;
    }

    ingenuitySites.rocks = siteSurface("rocks", "#79503d");
    for (let i = 0; i < 32; i++) {
      const angle = i * 2.39996;
      const radius = 0.65 + (i % 7) * 0.24;
      const boulder = mesh(
        new T.DodecahedronGeometry(0.18 + (i % 5) * 0.075, 0),
        mat(i % 3 ? "#85573f" : "#ad7552", 0, 0.94),
        ingenuitySites.rocks,
        Math.cos(angle) * radius,
        0.12,
        Math.sin(angle) * radius,
      );
      boulder.scale.set(1, 0.65 + (i % 4) * 0.1, 0.85);
      boulder.rotation.y = angle;
    }
    const strikeRock = mesh(
      new T.DodecahedronGeometry(0.48, 0),
      mat("#b57b57", 0, 0.92),
      ingenuitySites.rocks,
      0.68,
      0.2,
      0.45,
    );
    strikeRock.scale.set(1.15, 0.72, 0.95);
    box(0.6, 0.55, 0.55, gold, root, 0, 0.9, 0);
    box(0.68, 0.08, 0.6, silver, root, 0, 1.2, 0);
    rod([0, 1.1, 0], [0, 2.2, 0], 0.045, silver);
    for (let y of [1.65, 1.9]) {
      const rotor = new T.Group();
      rotor.position.y = y;
      root.add(rotor);
      box(3.4, 0.028, 0.13, dark, rotor);
      box(0.25, 0.12, 0.16, silver, rotor);
      rotors.push(rotor);
    }
    box(1.1, 0.045, 0.65, mat("#182c41", 0.55, 0.35), root, 0, 2.25, 0);
    for (let i = -4; i <= 4; i++)
      box(0.008, 0.006, 0.65, silver, root, i * 0.12, 2.277, 0);
    for (let x of [-1, 1])
      for (let z of [-1, 1]) {
        rod(
          [x * 0.23, 0.85, z * 0.2],
          [x * 0.85, 0.08, z * 0.65],
          0.026,
          silver,
        );
        box(0.15, 0.035, 0.1, dark, root, x * 0.85, 0.045, z * 0.65);
      }
    for (let i = 0; i < 3; i++) {
      const ring = mesh(
        new T.TorusGeometry(0.65 + i * 0.35, 0.018, 8, 64),
        new T.MeshBasicMaterial({
          color: 0xd9b38b,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
        root,
        0,
        0.01,
        0,
      );
      ring.rotation.x = Math.PI / 2;
      ring.userData.delay = i * 0.33;
      washRings.push(ring);
    }
    camera.fov = 46;
    camera.updateProjectionMatrix();
    camera.position.set(0, 13, 20);
    flightRoute = new T.Group();
    scene.add(flightRoute);
    flightShadow = mesh(new T.CircleGeometry(.38,24),new T.MeshBasicMaterial({color:0x15272c,transparent:true,opacity:.65,depthWrite:false}),scene,0,.03,-5.7);
    flightShadow.rotation.x = -Math.PI/2;
    flightGuideRing = mesh(new T.RingGeometry(.34,.48,32),new T.MeshBasicMaterial({color:0xffd77d,transparent:true,opacity:.92,side:T.DoubleSide,depthWrite:false}),scene,0,.045,-4.5);
    flightGuideRing.rotation.x = -Math.PI/2;
    flightGuideRing.visible = false;
    const smokeCanvas=document.createElement('canvas');smokeCanvas.width=64;smokeCanvas.height=64;
    const smokeContext=smokeCanvas.getContext('2d');
    const smokeGradient=smokeContext.createRadialGradient(32,32,4,32,32,30);
    smokeGradient.addColorStop(0,'rgba(55,61,64,.95)');smokeGradient.addColorStop(.55,'rgba(61,67,69,.68)');smokeGradient.addColorStop(1,'rgba(40,45,47,0)');
    smokeContext.fillStyle=smokeGradient;smokeContext.fillRect(0,0,64,64);
    flightSmokeTexture=new T.CanvasTexture(smokeCanvas);
    const flightSmokeGeometry = new T.BufferGeometry();
    flightSmokeGeometry.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(72*3),3));
    flightSmokeMaterial = new T.PointsMaterial({map:flightSmokeTexture,color:0x697073,size:.78,transparent:true,opacity:0,alphaTest:.025,depthWrite:false,sizeAttenuation:true});
    flightSmoke = new T.Points(flightSmokeGeometry,flightSmokeMaterial);
    scene.add(flightSmoke);
    for (let i=0;i<3;i++) {
      const arrow = new T.ArrowHelper(new T.Vector3(1,0,0), new T.Vector3(), 1.6, 0x9ae8ed, .35, .22);
      arrow.visible = false;
      scene.add(arrow); flightWindArrows.push(arrow);
    }
    flightSitesLayer = document.createElement('div');
    flightSitesLayer.className = 'flight-sites';
    flightSitesLayer.setAttribute('aria-label','Landing zones on the 3D ground');
    Object.entries(landingZones).forEach(([site,zone],i)=>{
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'flight-site-marker'; button.dataset.sceneSite = site;
      const letter = document.createElement('b'); letter.textContent = ['A','B','C'][i];
      const label = document.createElement('span'); label.textContent = zone.label;
      button.append(letter,label);
      button.onclick = () => onSelectSite(site);
      flightSitesLayer.append(button);
    });
    host.append(flightSitesLayer);
    orbit.target.set(0, 1.1, 0);
  }
  if (id === "webb") {
    const hexR = 0.48;
    const backplane = mat("#111820", 0.22, 0.78);
    const frame = mat("#39434b", 0.62, 0.38);
    const actuator = mat("#88939a", 0.72, 0.28);
    for (let q = -2; q <= 2; q++)
      for (let r = -2; r <= 2; r++) {
        if (Math.abs(q + r) > 2 || (q === 0 && r === 0)) continue;
        const x = 1.5 * hexR * q,
          y = Math.sqrt(3) * hexR * (r + q / 2);
        let parent = root;
        if (q === -2 || q === 2) {
          let wing = wings.find((w) => w.userData.side === Math.sign(q));
          if (!wing) {
            wing = new T.Group();
            wing.userData.side = Math.sign(q);
            wing.rotation.y = webbWingAngle(Math.sign(q));
            wing.position.set(Math.sign(q) * 1.02, 1.8, 0);
            root.add(wing);
            wings.push(wing);
          }
          parent = wing;
        }
        const localX = parent === root ? x : x - parent.position.x;
        const localY = parent === root ? y + 1.8 : y;
        const support = mesh(
          new T.CylinderGeometry(hexR * 0.99, hexR * 0.99, 0.14, 6),
          backplane,
          parent,
          localX,
          localY,
          -0.09,
        );
        orientWebbMirror(support);
        for (const [ax, ay] of [
          [0, 0.2],
          [-0.17, -0.11],
          [0.17, -0.11],
        ]) {
          const pin = mesh(
            new T.CylinderGeometry(0.022, 0.022, 0.2, 8),
            actuator,
            parent,
            localX + ax,
            localY + ay,
            -0.2,
          );
          pin.rotation.x = Math.PI / 2;
        }
        const seg = mesh(
          new T.CylinderGeometry(hexR * 0.96, hexR * 0.96, 0.085, 6),
          gold,
          parent,
          localX,
          localY,
          0.02,
        );
        orientWebbMirror(seg);
        segments.push(seg);
      }

    // The dark composite backplane and its hinges carry the mirror segments.
    const centerHub = mesh(
      new T.CylinderGeometry(hexR * 0.78, hexR * 0.78, 0.18, 6),
      backplane,
      root,
      0,
      1.8,
      -0.12,
    );
    centerHub.rotation.x = Math.PI / 2;
    centerHub.rotation.z = Math.PI / 6;
    box(0.12, 2.05, 0.18, frame, root, -1.03, 1.8, -0.2);
    box(0.12, 2.05, 0.18, frame, root, 1.03, 1.8, -0.2);
    for (const wing of wings) {
      rod([0, -0.95, -0.2], [0, 0.95, -0.2], 0.045, frame, wing);
      rod([0, 0, -0.2], [-0.36 * wing.userData.side, 0.72, -0.2], 0.032, frame, wing);
      rod([0, 0, -0.2], [-0.36 * wing.userData.side, -0.72, -0.2], 0.032, frame, wing);
    }
    rod([-0.98, 0.93, -0.2], [0, 1.8, -0.2], 0.045, frame);
    rod([0.98, 0.93, -0.2], [0, 1.8, -0.2], 0.045, frame);
    rod([-0.98, 2.67, -0.2], [0, 1.8, -0.2], 0.045, frame);
    rod([0.98, 2.67, -0.2], [0, 1.8, -0.2], 0.045, frame);

    // Spacecraft bus and tower tie the optical assembly to the sunshield.
    box(1.18, 0.48, 1.18, dark, root, 0, 0.25, -0.5);
    box(0.7, 0.18, 0.72, gold, root, 0, 0.52, -0.45);
    rod([0, 0.48, -0.34], [0, 1.8, -0.22], 0.075, frame);
    rod([0, 0.5, -0.38], [-1.02, 1.02, -0.2], 0.045, frame);
    rod([0, 0.5, -0.38], [1.02, 1.02, -0.2], 0.045, frame);

    for (let x of [-1, 1]) rod([x * 1.25, 1.35, 0], [0, 1.9, 2], 0.028, silver);
    rod([0, 3.3, 0], [0, 1.9, 2], 0.028, silver);
    const secondary = mesh(
      new T.CylinderGeometry(0.19, 0.19, 0.08, 24),
      silver,
      root,
      0,
      1.9,
      2,
    );
    secondary.rotation.x = Math.PI / 2;

    const shieldShape = new T.Shape();
    shieldShape.moveTo(0, -3.65);
    shieldShape.lineTo(3.65, -1.25);
    shieldShape.lineTo(3.28, 2.12);
    shieldShape.lineTo(0, 3.72);
    shieldShape.lineTo(-3.28, 2.12);
    shieldShape.lineTo(-3.65, -1.25);
    shieldShape.closePath();
    for (let i = 0; i < 5; i++) {
      const shield = mesh(
        new T.ShapeGeometry(shieldShape),
        new T.MeshPhysicalMaterial({
          color: i % 2 ? 0xaeb3bd : 0x7f8795,
          metalness: 0.68,
          roughness: 0.34,
          side: T.DoubleSide,
          transparent: true,
          opacity: 0.78 - i * 0.055,
          clearcoat: 0.25,
        }),
        root,
        0,
        -0.08 - i * 0.075,
        0,
      );
      shield.rotation.x = Math.PI / 2;
      shield.scale.setScalar(1 - i * 0.025);
    }
    const shieldEdge = [
      [0, -0.03, -3.65],
      [3.65, -0.03, -1.25],
      [3.28, -0.03, 2.12],
      [0, -0.03, 3.72],
      [-3.28, -0.03, 2.12],
      [-3.65, -0.03, -1.25],
    ];
    shieldEdge.forEach((point, index) =>
      rod(point, shieldEdge[(index + 1) % shieldEdge.length], 0.025, frame),
    );
    rod([-3.55, -0.02, 0], [3.55, -0.02, 0], 0.035, frame);
    rod([0, -0.02, -3.55], [0, -0.02, 3.6], 0.035, frame);

    camera.position.set(3.7, 3.3, 12.5);
    orbit.target.set(0, 1.05, 0);
  }
  const recordTextures = {};
  let disposed = false;
  function recordTexture(face) {
    if (!recordTextures[face]) {
      const texture = new T.TextureLoader().load(
        recordArtifacts[face].image,
        (loaded) => {
          if (disposed) loaded.dispose();
        },
      );
      texture.colorSpace = T.SRGBColorSpace;
      texture.anisotropy = Math.min(
        4,
        renderer.capabilities.getMaxAnisotropy(),
      );
      recordTextures[face] = texture;
    }
    return recordTextures[face];
  }
  if (id === "voyager") {
    record = new T.Group();
    root.add(record);
    record.rotation.x = Math.PI / 2;
    mesh(new T.CylinderGeometry(1.85, 1.85, 0.045, 100), gold, record);
    recordSurface = mesh(
      new T.CircleGeometry(1.85, 128),
      new T.MeshBasicMaterial({
        map: recordTexture("front"),
        toneMapped: false,
      }),
      record,
      0,
      0.027,
      0,
    );
    recordSurface.rotation.x = -Math.PI / 2;
    record.position.y = 1.3;
    const points = [];
    for (let i = 0; i < 500; i++) {
      const a = i * 2.39996,
        r = 8 + (i % 70) * 0.5;
      points.push(Math.cos(a) * r, Math.sin(i * 4.12) * r, Math.sin(a) * r);
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.Float32BufferAttribute(points, 3));
    stars = new T.Points(
      geometry,
      new T.PointsMaterial({
        color: 0x9aaec7,
        size: 0.035,
        transparent: true,
        opacity: 0.8,
      }),
    );
    scene.add(stars);
    camera.position.set(0, 2, 8);
    orbit.target.set(0, 1.3, 0);
    orbit.maxPolarAngle = Math.PI * 0.8;
  }
  orbit.update();
  const startingCamera = camera.position.clone();
  const startingTarget = orbit.target.clone();
  const machineName = { curiosity: "Curiosity rover", ingenuity: "Ingenuity helicopter", webb: "Webb telescope" }[id];
  function viewDescription() {
    const offset = camera.position.clone().sub(orbit.target);
    const horizontal = Math.hypot(offset.x, offset.z);
    const depth = offset.z >= 0 ? "front" : "back";
    const side = Math.abs(offset.x) < horizontal * 0.2 ? "" : offset.x > 0 ? "-right" : "-left";
    const elevation = offset.y > horizontal * 0.7 ? ", high angle" : offset.y < horizontal * 0.12 ? ", low angle" : "";
    const yaw = Math.round(Math.atan2(offset.x, offset.z) * 180 / Math.PI);
    const pitch = Math.round(Math.atan2(offset.y, horizontal) * 180 / Math.PI);
    const subject = id === "voyager" ? `Voyager Golden Record ${st.recordFace === "cover" ? "cover" : "disc"}` : machineName;
    return `3D view of ${subject}, ${depth}${side} angle${elevation}, yaw ${yaw} degrees, pitch ${pitch} degrees, zoom distance ${Math.round(offset.length())}`;
  }
  function updateViewLabel() { host.setAttribute("aria-label", viewDescription()); }
  orbit.addEventListener("change", updateViewLabel);
  updateViewLabel();
  function keyboardOrbit(event) {
    if (event.target !== host) return;
    if (id === 'ingenuity' && st.visualFlight?.active) return;
    const key = event.key;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "_", "0"].includes(key)) return;
    event.preventDefault();
    event.stopPropagation();
    if (key === "0") {
      orbit.target.copy(startingTarget);
      camera.position.copy(startingCamera);
    } else {
      const offset = camera.position.clone().sub(orbit.target);
      const spherical = new T.Spherical().setFromVector3(offset);
      const turn = Math.PI / 18;
      if (key === "ArrowLeft") spherical.theta -= turn;
      if (key === "ArrowRight") spherical.theta += turn;
      if (key === "ArrowUp") spherical.phi -= turn;
      if (key === "ArrowDown") spherical.phi += turn;
      if (key === "+" || key === "=") spherical.radius *= 0.9;
      if (key === "-" || key === "_") spherical.radius *= 1.1;
      spherical.phi = Math.max(0.05, Math.min(orbit.maxPolarAngle, spherical.phi));
      spherical.radius = Math.max(orbit.minDistance, Math.min(orbit.maxDistance, spherical.radius));
      camera.position.copy(orbit.target).add(new T.Vector3().setFromSpherical(spherical));
    }
    orbit.update();
    updateViewLabel();
    onViewChange(viewDescription());
  }
  host.addEventListener("keydown", keyboardOrbit);
  const partGuide = machinePartGuide(id);
  const hotspotLayer = document.createElement("div");
  hotspotLayer.className = "machine-hotspots";
  hotspotLayer.innerHTML = `<p class="parts-hint">✦ SELECT A NUMBERED PART</p><div class="part-markers">${partGuide.parts
    .map(
      (part, index) =>
        `<button class="part-marker" data-part-index="${index}" aria-label="Inspect ${part.label}"><span>${index + 1}</span><small>${part.label}</small></button>`,
    )
    .join("")}</div><article class="part-card" aria-live="polite" hidden><button class="part-card-close" aria-label="Close part information">×</button><p class="eyebrow">MACHINE ANATOMY · <span class="part-counter"></span></p><h3></h3><p class="part-description"></p><a target="_blank" rel="noopener"></a></article>`;
  host.appendChild(hotspotLayer);
  const partDock = document.createElement("div");
  partDock.className = "part-dock";
  partDock.setAttribute("aria-label", "Machine parts");
  partDock.innerHTML = partGuide.parts
    .map(
      (part, index) =>
        `<button data-part-index="${index}"><span class="part-number">0${index + 1}</span><span class="part-name">${part.label}</span></button>`,
    )
    .join("");
  (host.parentElement?.querySelector(".part-dock-slot") || host).appendChild(partDock);
  const partAnchors = partGuide.parts.map((part) => {
    const anchor = new T.Object3D();
    anchor.position.fromArray(part.position);
    root.add(anchor);
    return anchor;
  });
  const markerButtons = [...hotspotLayer.querySelectorAll(".part-marker")];
  const dockButtons = [...partDock.querySelectorAll("button")];
  const partCard = hotspotLayer.querySelector(".part-card");
  let activePart = -1;
  function inspectPart(index) {
    const part = partGuide.parts[index];
    if (!part) return;
    activePart = index;
    markerButtons.forEach((button, buttonIndex) =>
      button.classList.toggle("is-active", buttonIndex === index),
    );
    dockButtons.forEach((button, buttonIndex) =>
      button.classList.toggle("is-active", buttonIndex === index),
    );
    partCard.querySelector(".part-counter").textContent = `${index + 1} / ${partGuide.parts.length}`;
    partCard.querySelector("h3").textContent = part.label;
    partCard.querySelector(".part-description").textContent = part.description;
    const source = partCard.querySelector("a");
    source.href = partGuide.source;
    source.textContent = `${partGuide.sourceLabel} ↗`;
    partCard.hidden = false;
    onInspect(part);
  }
  hotspotLayer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-part-index]");
    if (button) inspectPart(Number(button.dataset.partIndex));
    if (event.target.closest(".part-card-close")) {
      activePart = -1;
      partCard.hidden = true;
      markerButtons.forEach((marker) => marker.classList.remove("is-active"));
      dockButtons.forEach((dockButton) => dockButton.classList.remove("is-active"));
    }
  });
  partDock.addEventListener("click", (event) => {
    const button = event.target.closest("[data-part-index]");
    if (button) inspectPart(Number(button.dataset.partIndex));
  });
  const projectedPart = new T.Vector3();
  function updateHotspots() {
    const hostWidth = host.clientWidth;
    const hostHeight = host.clientHeight;
    if (flightSitesLayer) {
      for (const button of flightSitesLayer.children) {
        const site = button.dataset.sceneSite;
        const point = ingenuitySitePositions[site].clone();
        point.y = .2;
        point.project(camera);
        button.hidden = point.z < -1 || point.z > 1 || Boolean(st.visualFlight?.active && st.landingSite !== site);
        button.style.left = `${Math.max(12,Math.min(88,point.x*.5*100+50))}%`;
        button.style.top = `${Math.max(15,Math.min(hostHeight-30,(-point.y*.5+.5)*hostHeight+25))}px`;
      }
    }
    partAnchors.forEach((anchor, index) => {
      anchor.getWorldPosition(projectedPart);
      projectedPart.project(camera);
      const visible =
        projectedPart.z > -1 &&
        projectedPart.z < 1 &&
        Math.abs(projectedPart.x) < 1.12 &&
        Math.abs(projectedPart.y) < 1.12;
      const marker = markerButtons[index];
      marker.hidden = !visible;
      if (!visible) return;
      marker.style.left = `${(projectedPart.x * 0.5 + 0.5) * hostWidth}px`;
      marker.style.top = `${(-projectedPart.y * 0.5 + 0.5) * hostHeight}px`;
      marker.style.setProperty("--marker-depth", `${Math.max(0.78, 1.12 - projectedPart.z * 0.12)}`);
    });
    if (!partCard.hidden) {
      const hostBounds = host.getBoundingClientRect();
      const cardHeight = partCard.offsetHeight || 210;
      const viewportTop = Math.min(
        Math.max(14, window.innerHeight - cardHeight - 14),
        Math.max(14, hostBounds.top + 58),
      );
      partCard.style.top = `${Math.max(10, viewportTop - hostBounds.top)}px`;
    }
    hotspotLayer.classList.toggle("has-selection", activePart >= 0);
  }
  return {
    updateViewLabel,
    getViewState() { return { position: camera.position.toArray(), target: orbit.target.toArray() }; },
    setViewState(view) {
      if (![view?.position, view?.target].every(vector => Array.isArray(vector) && vector.length === 3 && vector.every(Number.isFinite))) return;
      camera.position.fromArray(view.position);
      orbit.target.fromArray(view.target);
      orbit.update();
      updateViewLabel();
    },
    setReduced(v) {
      reduced = v;
      orbit.enableDamping = !v;
    },
    setState(s) {
      st = s;
      if (id === "curiosity" && !roverInitialized) {
        const x = -3 + (st.roverX || 0) * 1.5;
        const z = -2.3 + (st.roverY ?? 4) * 1.15;
        root.position.set(x, 0, z);
        root.rotation.y = Math.atan2(z, -x);
        lastRoverPosition.set(x, 0, z);
        roverInitialized = true;
      }
    },
    render(dt) {
      time += dt;
      if (id === "curiosity") {
        const driving = Boolean(st.programRunning || (st.freeExplore && st.exploreMoving) || st.motionUntil > performance.now());
        hotspotLayer.style.visibility = driving ? 'hidden' : '';
        hotspotLayer.style.pointerEvents = driving ? 'none' : '';
        hotspotLayer.setAttribute('aria-hidden', String(driving));
        const nextX = st.freeExplore
          ? st.exploreX || 0
          : -3 + (st.roverX || 0) * 1.5;
        const nextZ = st.freeExplore
          ? st.exploreZ || 0
          : -2.3 + (st.roverY ?? 4) * 1.15;
        const positionEase = reduced ? 1 : Math.min(1, dt * 6.5);
        root.position.x += (nextX - root.position.x) * positionEase;
        root.position.z += (nextZ - root.position.z) * positionEase;
        root.rotation.order = "YXZ";
        const idleAtStart =
          !st.freeExplore &&
          !st.programRunning &&
          (st.programCounter || 0) === 0;
        const targetHeading = st.freeExplore
          ? st.exploreHeading || 0
          : idleAtStart
            ? Math.atan2(nextZ, -nextX)
            : [Math.PI / 2, 0, -Math.PI / 2, Math.PI][st.roverDir || 0];
        let headingDelta = targetHeading - root.rotation.y;
        headingDelta = Math.atan2(Math.sin(headingDelta), Math.cos(headingDelta));
        root.rotation.y += headingDelta * (reduced ? 1 : Math.min(1, dt * 8));
        const moving =
          (st.motionType === "move" && st.motionUntil > performance.now()) ||
          (st.freeExplore && st.exploreMoving);
        const colliding =
          st.motionType === "collision" && st.motionUntil > performance.now();
        const bump =
          reduced || (!moving && !colliding)
            ? 0
            : Math.sin(time * (colliding ? 34 : 22)) *
              (colliding ? 0.065 : 0.035);
        root.position.y = bump;
        root.rotation.z = reduced
          ? 0
          : colliding
            ? Math.sin(time * 28) * 0.09
            : moving
              ? Math.sin(time * 16) * 0.018
              : 0;
        if (lastRoverProgress !== null) {
          const flatPosition = new T.Vector3(root.position.x, 0, root.position.z);
          const travel = lastRoverPosition.distanceTo(flatPosition);
          roverWheelTravel += travel / 0.4;
          wheels.forEach((wheel) => (wheel.rotation.z = -roverWheelTravel));
        }
        lastRoverPosition.set(root.position.x, 0, root.position.z);
        lastRoverProgress = st.programCounter || 0;
        if (dust && dustMaterial) {
          const smoking = st.health <= 0;
          const active = smoking || (moving && !reduced);
          dustMaterial.color.set(smoking ? '#565b60' : '#bd9770');
          dustMaterial.size = smoking ? .24 : .075;
          dustMaterial.opacity +=
            ((active ? 0.52 : 0) - dustMaterial.opacity) * Math.min(1, dt * 9);
          const positions = dust.geometry.attributes.position;
          const forwardX = Math.cos(root.rotation.y),
            forwardZ = -Math.sin(root.rotation.y);
          for (let i = 0; i < positions.count; i++) {
            const life = reduced ? i / positions.count : (time * 0.7 + i / positions.count) % 1;
            const lateral = Math.sin(i * 2.39996) * (0.18 + life * 0.65);
            positions.setXYZ(
              i,
              root.position.x - forwardX * (0.65 + life * 1.9) - forwardZ * lateral,
              smoking ? .8 + life * 2.3 : 0.06 + life * 0.42,
              root.position.z - forwardZ * (0.65 + life * 1.9) + forwardX * lateral,
            );
          }
          positions.needsUpdate = active;
        }
        if (st.programRunning || moving) {
          const previousTarget = orbit.target.clone();
          orbit.target.lerp(
            new T.Vector3(root.position.x, 0.8, root.position.z),
            reduced ? 1 : Math.min(1, dt * (st.freeExplore ? 4.2 : 2.4)),
          );
          if (st.freeExplore)
            camera.position.add(orbit.target.clone().sub(previousTarget));
        }
      }
      if (id === "ingenuity") {
        const game = st.visualFlight;
        const flying = Boolean(game?.active);
        wasFlightActive = flying;
        const sitePoint = ingenuitySitePositions[st.landingSite];
        const progress = game?.progress || 0;
        const baseX = (sitePoint?.x || 0)*progress;
        const baseZ = -5.7 + ((sitePoint?.z || 0)+5.7)*progress;
        const routeDirection = sitePoint
          ? new T.Vector3(sitePoint.x,0,sitePoint.z+5.7).normalize()
          : new T.Vector3(0,0,1);
        const routeSide = new T.Vector3(routeDirection.z,0,-routeDirection.x);
        orbit.enabled = !flying;
        Object.entries(ingenuitySites).forEach(([site, group]) => {
          group.userData.selector.visible = st.landingSite === site;
        });
        if (flightSitesLayer) {
          for (const button of flightSitesLayer.children) {
            button.disabled = flying || game?.phase === 'landed';
            button.setAttribute('aria-pressed',String(button.dataset.sceneSite === st.landingSite));
          }
        }
        if (routeSite !== st.landingSite) {
          routeSite = st.landingSite;
          for (const child of [...flightRoute.children]) { child.geometry.dispose(); child.material.dispose(); flightRoute.remove(child); }
          if (sitePoint) {
            for (const edge of [-1.35,0,1.35]) {
              const points = [];
              for (let i=0;i<=24;i++) {
                const p=i/24;
                points.push(new T.Vector3(sitePoint.x*p+routeSide.x*edge,.12,-5.7+(sitePoint.z+5.7)*p+routeSide.z*edge));
              }
              const line = new T.Line(new T.BufferGeometry().setFromPoints(points),
                new T.LineDashedMaterial({color:edge ? 0xb5e7dc : 0xf0d28b,dashSize:.18,gapSize:.15,transparent:true,opacity:edge ? .45 : .85}));
              line.computeLineDistances(); flightRoute.add(line);
            }
          }
        }
        rotors.forEach((rotor, i) => {
          if (!reduced && flying) rotor.rotation.y += dt*78*.9*(i ? -1 : 1);
        });
        root.position.set(baseX+routeSide.x*(game?.offset || 0),st.height || 0,baseZ+routeSide.z*(game?.offset || 0));
        flightShadow.position.set(root.position.x,.03,root.position.z);
        root.rotation.y = Math.atan2(routeDirection.x,routeDirection.z);
        if (flightGuideRing) {
          flightGuideRing.visible = flying && Number.isFinite(st.flightGuideTarget);
          if (flightGuideRing.visible) {
            const ahead = 1.8;
            flightGuideRing.position.set(
              root.position.x+routeDirection.x*ahead+routeSide.x*st.flightGuideTarget,
              .045,
              root.position.z+routeDirection.z*ahead+routeSide.z*st.flightGuideTarget,
            );
            const pulse = reduced ? 1 : .92+Math.sin(time*7)*.12;
            flightGuideRing.scale.setScalar(pulse);
          }
        }
        if (flying) {
          // Chase from behind the helicopter so the chosen terrain stays ahead
          // and pointer-left/right matches the visible flight direction.
          const desiredCamera = new T.Vector3(
            root.position.x-routeDirection.x*5.4,
            root.position.y+3.1,
            root.position.z-routeDirection.z*5.4,
          );
          const desiredTarget = new T.Vector3(
            root.position.x+routeDirection.x*3.2,
            Math.max(.65,root.position.y*.55),
            root.position.z+routeDirection.z*3.2,
          );
          const follow = reduced ? 1 : 1-Math.exp(-dt*5.2);
          camera.position.lerp(desiredCamera,follow);
          orbit.target.lerp(desiredTarget,follow);
          camera.lookAt(orbit.target);
        }
        if (st.crashed) {
          root.position.y = .08;
          root.rotation.z = game?.result === 'slope' ? .85 : -.6;
          root.rotation.x = .2;
          rotors[0].rotation.z = .28;
          rotors[1].rotation.x = -.22;
        } else {
          root.rotation.z = reduced ? 0 : -(game?.tilt || 0);
          root.rotation.x = reduced ? 0 : flying ? -.03 : 0;
          rotors.forEach(rotor=>{rotor.rotation.z=0;rotor.rotation.x=0;});
        }
        if (flightSmoke && flightSmokeMaterial) {
          flightSmokeMaterial.opacity += ((st.crashed ? .96 : 0)-flightSmokeMaterial.opacity)*Math.min(1,dt*7);
          const smokePositions=flightSmoke.geometry.attributes.position;
          for(let i=0;i<smokePositions.count;i++){
            const life=reduced ? i/smokePositions.count : (time*.48+i/smokePositions.count)%1;
            const curl=Math.sin(i*2.39996+life*9)*(.16+life*.72);
            smokePositions.setXYZ(i,root.position.x+curl,root.position.y+.55+life*4.2,root.position.z+Math.cos(i*1.73+life*4)*(.12+life*.48));
          }
          smokePositions.needsUpdate=st.crashed;
        }
        hotspotLayer.hidden = Boolean(game && game.phase !== 'choose');
        if (hotspotLayer.hidden) partCard.hidden = true;
        flightWindArrows.forEach((arrow,i)=>{
          arrow.visible = flying && Boolean(game.wind);
          if (!arrow.visible) return;
          arrow.position.set(root.position.x-1.6,root.position.y+2.8,root.position.z+(i-1)*.65);
          arrow.setDirection(new T.Vector3(Math.sign(game.wind),0,0));
        });
        washRings.forEach(ring=>{
          const pulse = reduced ? .4 : (time*1.2+ring.userData.delay)%1;
          ring.scale.setScalar(.75+pulse*1.05);
          ring.material.opacity = flying && st.height<1.35 && !reduced ? (1-st.height/1.35)*(1-pulse)*.42 : 0;
        });
      }
      if (id === "webb") {
        wings.forEach((w) => {
          const progress =
            w.userData.side < 0
              ? st.webbWingProgress?.left || 0
              : st.webbWingProgress?.right || 0;
          const target = webbWingAngle(w.userData.side, progress);
          w.rotation.y = reduced ? target : T.MathUtils.damp(w.rotation.y, target, 4.2, dt);
        });
        segments.forEach((s, i) => {
          s.rotation.z =
            Math.PI / 6 + (1 - (st.align || 0)) * Math.sin(i * 2.4) * 0.035;
        });
      }
      if (id === "voyager") {
        record.rotation.y =
          ((st.rotation || 0) * Math.PI) / 180 +
          (st.playing && !reduced && st.recordFace !== "cover"
            ? time * 0.2
            : 0);
        const map = recordTexture(
          st.recordFace === "cover" ? "cover" : "front",
        );
        if (recordSurface.material.map !== map) {
          recordSurface.material.map = map;
          recordSurface.material.needsUpdate = true;
        }
        root.scale.setScalar(1 - (st.distance || 0) * 0.52);
        if (!reduced) stars.rotation.y += dt * 0.008;
      }
      orbit.update();
      renderer.render(scene, camera);
      updateHotspots();
    },
    dispose() {
      disposed = true;
      Object.values(recordTextures).forEach((texture) => texture.dispose());
      flightSmokeTexture?.dispose();
      observer.disconnect();
      host.removeEventListener("keydown", keyboardOrbit);
      orbit.removeEventListener("change", updateViewLabel);
      orbit.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      partDock.remove();
      hotspotLayer.remove();
      flightSitesLayer?.remove();
    },
  };
}
