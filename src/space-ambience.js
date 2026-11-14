const PALETTES = {
  lobby: ["#73b9ef", "#f2aa67", "#8a5bc9"],
  curiosity: ["#e26032", "#ffad6f", "#582039"],
  ingenuity: ["#f07b4a", "#84d5f6", "#7c365e"],
  webb: ["#75aaff", "#b879ff", "#ffc56d"],
  voyager: ["#6ca5f7", "#f3bd63", "#283e89"],
};

function rgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function rgba(color, alpha) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

function seeded(index, salt = 0) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function createSpaceAmbience(canvas) {
  const context = canvas?.getContext("2d", { alpha: true });
  if (!canvas || !context) {
    return { setTheme() {}, setReduced() {}, warp: () => Promise.resolve(), dispose() {} };
  }

  let width = 1;
  let height = 1;
  let ratio = 1;
  let frame = 0;
  let running = true;
  let reduced = false;
  let palette = PALETTES.lobby.map(rgb);
  let nextPalette = palette.map((color) => [...color]);
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let lastTime = 0;
  let meteorClock = 2.5;
  let meteor = null;
  let warpStarted = 0;
  let warpDuration = 0;

  const starCount = matchMedia("(max-width: 700px)").matches ? 190 : 340;
  const stars = Array.from({ length: starCount }, (_, index) => ({
    x: (seeded(index, 1) - 0.5) * 2.2,
    y: (seeded(index, 2) - 0.5) * 2.2,
    z: 0.08 + seeded(index, 3) * 0.92,
    radius: 0.35 + seeded(index, 4) * 1.65,
    phase: seeded(index, 5) * Math.PI * 2,
    warmth: seeded(index, 6),
    velocity: 0.62 + seeded(index, 7) * 0.76,
  }));
  const dust = Array.from({ length: 34 }, (_, index) => ({
    x: seeded(index, 8),
    y: seeded(index, 9),
    size: 18 + seeded(index, 10) * 68,
    phase: seeded(index, 11) * Math.PI * 2,
  }));

  function resetStar(star, atFarPlane = true) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.1 + Math.random() * 1.18;
    star.x = Math.cos(angle) * radius;
    star.y = Math.sin(angle) * radius;
    star.z = atFarPlane ? 1 : 0.12 + Math.random() * 0.88;
  }

  function resize() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (reduced) draw(performance.now());
  }

  function nebula(x, y, radius, color, opacity) {
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, rgba(color, opacity));
    gradient.addColorStop(0.27, rgba(color, opacity * 0.52));
    gradient.addColorStop(0.62, rgba(color, opacity * 0.12));
    gradient.addColorStop(1, rgba(color, 0));
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function blendPalette() {
    palette = palette.map((color, index) =>
      color.map(
        (channel, channelIndex) =>
          channel + (nextPalette[index][channelIndex] - channel) * 0.04,
      ),
    );
  }

  function currentWarp(now) {
    if (!warpStarted || !warpDuration) return 0;
    const progress = (now - warpStarted) / warpDuration;
    if (progress >= 1) {
      warpStarted = 0;
      warpDuration = 0;
      return 0;
    }
    return Math.sin(Math.PI * Math.max(0, progress));
  }

  function drawNebula(now, warp) {
    context.save();
    context.globalCompositeOperation = "screen";
    const drift = reduced ? 0 : now * 0.000018;
    const pulse = 1 + warp * 0.42;
    nebula(
      width * (0.13 + Math.sin(drift) * 0.09) + pointerX * 28,
      height * (0.27 + Math.cos(drift * 1.7) * 0.05) + pointerY * 20,
      Math.max(width, height) * 0.68 * pulse,
      palette[0],
      0.16 + warp * 0.11,
    );
    nebula(
      width * (0.86 + Math.cos(drift * 1.25) * 0.07) - pointerX * 34,
      height * (0.58 + Math.sin(drift * 0.82) * 0.06) - pointerY * 25,
      Math.max(width, height) * 0.62 * pulse,
      palette[1],
      0.12 + warp * 0.08,
    );
    nebula(
      width * 0.52 + Math.sin(drift * 0.7) * width * 0.12,
      height * 0.94,
      Math.max(width, height) * 0.72,
      palette[2],
      0.1,
    );
    context.restore();
  }

  function drawDust(now, warp) {
    context.save();
    context.globalCompositeOperation = "screen";
    for (const particle of dust) {
      const x =
        ((particle.x * width + Math.sin(now * 0.00009 + particle.phase) * 58 + width) % width) +
        pointerX * 16;
      const y =
        ((particle.y * height + Math.cos(now * 0.00007 + particle.phase) * 42 + height) % height) +
        pointerY * 12;
      const radius = particle.size * (1 + warp * 0.8);
      const glow = context.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, rgba(palette[particle.size % 2 > 1 ? 0 : 2], 0.035 + warp * 0.025));
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    context.restore();
  }

  function drawStars(now, delta, warp) {
    const speed = reduced ? 0 : 0.026 + warp * 1.82;
    const centerX = width * (0.5 + pointerX * 0.028);
    const centerY = height * (0.47 + pointerY * 0.024) - (window.scrollY || 0) * 0.008;
    const projection = Math.min(width, height) * 0.72;
    context.save();
    context.globalCompositeOperation = "screen";

    for (const star of stars) {
      const previousZ = star.z;
      star.z -= delta * speed * star.velocity;
      if (star.z < 0.035) resetStar(star);

      const inverseZ = 1 / star.z;
      const x = centerX + star.x * projection * inverseZ;
      const y = centerY + star.y * projection * inverseZ;
      if (x < -180 || x > width + 180 || y < -180 || y > height + 180) {
        resetStar(star);
        continue;
      }

      const previousInverse = 1 / Math.max(previousZ, 0.04);
      const previousX = centerX + star.x * projection * previousInverse;
      const previousY = centerY + star.y * projection * previousInverse;
      const twinkle = reduced ? 0.78 : 0.60 + Math.sin(now * 0.0015 + star.phase) * 0.38;
      const proximity = Math.min(1, 0.36 + inverseZ * 0.18);
      const alpha = Math.max(0.12, twinkle * proximity);
      const color =
        star.warmth > 0.88
          ? palette[1]
          : star.warmth < 0.1
            ? palette[0]
            : [232, 241, 249];
      const radius = Math.min(3.2, star.radius * (0.48 + inverseZ * 0.13));

      if (warp > 0.04) {
        const trailScale = 1 + warp * 13;
        const tailX = x + (previousX - x) * trailScale;
        const tailY = y + (previousY - y) * trailScale;
        const streak = context.createLinearGradient(x, y, tailX, tailY);
        streak.addColorStop(0, rgba(color, Math.min(1, alpha + warp * 0.5)));
        streak.addColorStop(1, rgba(color, 0));
        context.strokeStyle = streak;
        context.lineWidth = radius * (0.7 + warp * 1.25);
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(tailX, tailY);
        context.stroke();
      } else {
        context.fillStyle = rgba(color, alpha);
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        if (radius > 1.55) {
          context.strokeStyle = rgba(color, alpha * 0.2);
          context.lineWidth = 0.55;
          context.beginPath();
          context.moveTo(x - radius * 5, y);
          context.lineTo(x + radius * 5, y);
          context.moveTo(x, y - radius * 5);
          context.lineTo(x, y + radius * 5);
          context.stroke();
        }
      }
    }
    context.restore();
  }

  function drawMeteor(delta) {
    if (reduced || warpStarted) return;
    meteorClock += delta;
    if (!meteor && meteorClock > 8.5) {
      meteorClock = 0;
      meteor = {
        x: width * (0.45 + Math.random() * 0.45),
        y: -70,
        life: 0,
        speed: 410 + Math.random() * 130,
      };
    }
    if (!meteor) return;
    meteor.life += delta;
    meteor.x -= meteor.speed * delta * 0.7;
    meteor.y += meteor.speed * delta;
    const alpha = Math.max(0, 1 - meteor.life / 1.35);
    const trail = context.createLinearGradient(
      meteor.x,
      meteor.y,
      meteor.x + 120,
      meteor.y - 172,
    );
    trail.addColorStop(0, `rgba(248,251,255,${alpha})`);
    trail.addColorStop(1, rgba(palette[0], 0));
    context.strokeStyle = trail;
    context.lineWidth = 1.4;
    context.beginPath();
    context.moveTo(meteor.x, meteor.y);
    context.lineTo(meteor.x + 120, meteor.y - 172);
    context.stroke();
    if (meteor.life > 1.35 || meteor.y > height + 190) meteor = null;
  }

  function draw(now) {
    const delta = Math.min((now - lastTime) / 1000 || 0, 0.05);
    lastTime = now;
    blendPalette();
    pointerX += (targetX - pointerX) * 0.045;
    pointerY += (targetY - pointerY) * 0.045;
    context.clearRect(0, 0, width, height);
    const warp = currentWarp(now);
    drawNebula(now, warp);
    drawDust(now, warp);
    drawStars(now, delta, warp);
    drawMeteor(delta);
  }

  function loop(now) {
    draw(now);
    if (running && !reduced && !document.hidden) frame = requestAnimationFrame(loop);
  }

  function start() {
    cancelAnimationFrame(frame);
    if (running && !reduced && !document.hidden) frame = requestAnimationFrame(loop);
    else draw(performance.now());
  }

  function onPointer(event) {
    targetX = event.clientX / Math.max(width, 1) - 0.5;
    targetY = event.clientY / Math.max(height, 1) - 0.5;
  }

  function onVisibility() {
    start();
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  resize();
  start();

  return {
    setTheme(name) {
      nextPalette = (PALETTES[name] || PALETTES.lobby).map(rgb);
      canvas.dataset.theme = name;
      if (reduced) draw(performance.now());
    },
    setReduced(value) {
      reduced = Boolean(value);
      if (reduced) {
        warpStarted = 0;
        warpDuration = 0;
      }
      start();
    },
    warp() {
      if (reduced) return Promise.resolve();
      warpStarted = performance.now();
      warpDuration = 400;
      meteor = null;
      start();
      return new Promise((resolve) => window.setTimeout(resolve, 180));
    },
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
