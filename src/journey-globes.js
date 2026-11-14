// Orthographic spheres from NASA's public equirectangular surface maps.
// Draw once per size change; no animation loop or extra WebGL context is needed.
const maps = {
  moon: { src: '/assets/journey-moon-lroc.jpg', longitude: 0, brightness: 1.24 },
  mars: { src: '/assets/journey-mars-viking.jpg', longitude: 100, brightness: 1.08 },
};

export function mountJourneyGlobes(root) {
  let disposed = false;
  const canvases = [...root.querySelectorAll('canvas[data-globe]')];
  const images = new Map();
  const draw = (canvas) => {
    const config = maps[canvas.dataset.globe];
    const image = images.get(canvas.dataset.globe);
    const width = canvas.getBoundingClientRect().width;
    if (!config || !image?.complete || !image.naturalWidth || width < 1 || disposed) return;
    const size = Math.min(768, Math.max(160, Math.round(width * Math.min(devicePixelRatio || 1, 2))));
    if (canvas.width === size && canvas.dataset.rendered === 'true') return;
    canvas.width = canvas.height = size;
    const source = document.createElement('canvas');
    source.width = image.naturalWidth;
    source.height = image.naturalHeight;
    const sourceContext = source.getContext('2d', { willReadFrequently: true });
    sourceContext.drawImage(image, 0, 0);
    const texture = sourceContext.getImageData(0, 0, source.width, source.height).data;
    const context = canvas.getContext('2d');
    const pixels = context.createImageData(size, size);
    const centerLongitude = config.longitude * Math.PI / 180;
    for (let y = 0; y < size; y++) {
      const ny = (y + .5) / size * 2 - 1;
      for (let x = 0; x < size; x++) {
        const nx = (x + .5) / size * 2 - 1;
        const radial = nx * nx + ny * ny;
        if (radial > 1) continue;
        const nz = Math.sqrt(1 - radial);
        const longitude = Math.atan2(nx, nz) + centerLongitude;
        const latitude = Math.asin(-ny);
        const u = ((longitude / (Math.PI * 2) + .5) % 1 + 1) % 1;
        const v = .5 - latitude / Math.PI;
        const sourceX = Math.min(source.width - 1, Math.floor(u * source.width));
        const sourceY = Math.min(source.height - 1, Math.floor(v * source.height));
        const sourceIndex = (sourceY * source.width + sourceX) * 4;
        const targetIndex = (y * size + x) * 4;
        const light = Math.max(0, -.36 * nx - .28 * ny + .89 * nz);
        const shade = (.27 + .73 * light) * config.brightness;
        for (let channel = 0; channel < 3; channel++) pixels.data[targetIndex + channel] = texture[sourceIndex + channel] * shade;
        pixels.data[targetIndex + 3] = Math.min(1, (1 - Math.sqrt(radial)) * size) * 255;
      }
    }
    context.putImageData(pixels, 0, 0);
    canvas.dataset.rendered = 'true';
  };
  for (const [name, config] of Object.entries(maps)) {
    const image = new Image();
    images.set(name, image);
    image.onload = () => canvases.filter(canvas => canvas.dataset.globe === name).forEach(draw);
    image.src = config.src;
  }
  const observer = new ResizeObserver(entries => entries.forEach(({ target }) => draw(target)));
  canvases.forEach(canvas => observer.observe(canvas));
  return { dispose() { disposed = true; observer.disconnect(); images.forEach(image => { image.onload = null; }); } };
}
