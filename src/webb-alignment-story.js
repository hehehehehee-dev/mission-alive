export const WEBB_STACK_HOLD_MS = 1200;
export const WEBB_DEEP_FIELD_CAPTION = "This is what alignment made possible: Webb's first deep field, thousands of galaxies in a patch of sky the size of a grain of sand held at arm's length.";
export const WEBB_IMAGE_CREDIT = "Images: NASA/STScI";

export const webbAlignmentAssets = Object.freeze({
  mosaic: "/assets/webb-hd84406-18-dots-mosaic.jpg",
  selfie: "/assets/webb-primary-mirror-selfie.png",
  hexagonal: "/assets/webb-hd84406-hexagonal-array.jpg",
  deepField: "/assets/webb-first-deep-field-smacs0723.png",
});

const webbImageGalleryMarkup = () => `<section class="webb-real-images" aria-labelledby="webb-real-images-title">
  <div class="webb-real-images-heading">
    <p class="eyebrow">REAL WEBB IMAGERY</p>
    <h3 id="webb-real-images-title">From eighteen stars to thousands of galaxies</h3>
    <p>Webb was built jointly by NASA, ESA, and the Canadian Space Agency (CSA). <a href="https://science.nasa.gov/mission/webb/webb-team/" target="_blank" rel="noopener">NASA Webb team source ↗</a></p>
  </div>
  <div class="webb-real-images-grid">
    <figure>
      <img src="${webbAlignmentAssets.mosaic}" width="2487" height="1685" alt="Eighteen scattered images of the star HD 84406, one from each Webb primary mirror segment." loading="lazy" decoding="async">
      <figcaption><strong>Before alignment</strong><span>The same star, HD 84406, appeared 18 times—once from each mirror segment.</span><small>Image credit: NASA</small><a href="https://science.nasa.gov/blogs/webb/2022/02/11/photons-received-webb-sees-its-first-star-18-times/" target="_blank" rel="noopener">Official image source ↗</a></figcaption>
    </figure>
    <figure>
      <img src="${webbAlignmentAssets.selfie}" width="1024" height="1024" alt="Webb engineering selfie showing all 18 primary mirror segments, with one segment glowing brightly." loading="lazy" decoding="async">
      <figcaption><strong>Webb's mirror selfie</strong><span>A special lens inside NIRCam photographed the primary mirror segments during alignment.</span><small>Image credit: NASA</small><a href="https://science.nasa.gov/blogs/webb/2022/02/11/photons-received-webb-sees-its-first-star-18-times/" target="_blank" rel="noopener">Official image source ↗</a></figcaption>
    </figure>
    <figure>
      <img src="${webbAlignmentAssets.deepField}" width="1960" height="2000" alt="Webb's first deep field, SMACS 0723, filled with distant galaxies, bright stars, and stretched arcs of light." loading="lazy" decoding="async">
      <figcaption><strong>After alignment</strong><span>SMACS 0723, Webb's first deep field, reveals thousands of galaxies.</span><small>Image credit: NASA, ESA, CSA, STScI</small><a href="https://science.nasa.gov/mission/webb/webbs-first-images/" target="_blank" rel="noopener">Official image source ↗</a></figcaption>
    </figure>
  </div>
</section>`;

// Eighteen points around a hexagonal array, used only to illustrate image stacking.
// The preceding stages and final field use the real NASA images, not this diagram.
const hexagonalPoints = [
  [-24, -14], [-16, -28], [0, -36], [16, -28], [24, -14], [32, 0],
  [24, 14], [16, 28], [0, 36], [-16, 28], [-24, 14], [-32, 0],
  [-8, -14], [8, -14], [16, 0], [8, 14], [-8, 14], [-16, 0],
];
const scatteredPoints = [
  [-34, 19], [-23, 35], [-10, 9], [0, -39], [19, -22], [31, 33],
  [-28, -27], [-12, -12], [23, 13], [-18, 2], [11, 30], [37, -3],
  [-3, 23], [-21, -1], [5, 1], [-29, 4], [11, -14], [30, -37],
];

export function webbAlignmentStage(value) {
  const progress = Number.isFinite(Number(value)) ? Math.max(0, Math.min(1, Number(value))) : 0;
  if (progress >= 1) return "stacked";
  if (progress >= 2 / 3) return "stacking";
  if (progress >= 1 / 3) return "hexagonal";
  return "scattered";
}

export function webbAlignmentMarkup() {
  return `<figure class="webb-alignment-story" id="webb-alignment-story" data-stage="scattered" aria-label="Webb mirror alignment sequence">
    <div class="webb-alignment-frame">
      <img class="webb-alignment-image" data-alignment-image="scattered" src="${webbAlignmentAssets.mosaic}" width="2487" height="1685" alt="NASA's February 2022 mosaic: 18 scattered images of the same star, HD 84406, one from each mirror segment." decoding="async">
      <img class="webb-alignment-image" data-alignment-image="hexagonal" src="${webbAlignmentAssets.hexagonal}" width="1024" height="1024" alt="NASA's next alignment stage: the 18 images of HD 84406 arranged in a hexagonal array." decoding="async" hidden>
      <div class="webb-alignment-stacking" data-alignment-image="stacking" role="img" aria-label="Simplified image stacking: 18 images of one star move toward the same point." hidden>
        ${hexagonalPoints.map(([x, y], index) => `<span class="webb-alignment-dot" style="--dot-x:${x};--dot-y:${y};--scatter-x:${scatteredPoints[index][0]};--scatter-y:${scatteredPoints[index][1]}" aria-hidden="true"></span>`).join("")}
      </div>
      <img class="webb-alignment-image webb-alignment-deep-field" data-alignment-image="deep-field" src="${webbAlignmentAssets.deepField}" width="1960" height="2000" alt="Webb's first deep field, SMACS 0723: thousands of distant galaxies, stretched orange arcs and bright foreground stars." decoding="async" hidden>
    </div>
    <figcaption class="webb-alignment-caption" data-alignment-caption hidden>${WEBB_DEEP_FIELD_CAPTION}</figcaption>
    <p class="fine webb-alignment-credit">${WEBB_IMAGE_CREDIT}</p>
  </figure>${webbImageGalleryMarkup()}`;
}

export function mountWebbAlignment(root, { schedule = setTimeout, cancel = clearTimeout } = {}) {
  if (!root) return { updateProgress() {}, dispose() {} };
  const images = Array.from(root.querySelectorAll("[data-alignment-image]"));
  const caption = root.querySelector("[data-alignment-caption]");
  let revealTimer = null;
  let previousStage = null;
  let disposed = false;
  const failedImages = new Set();
  const errorHandlers = new Map();

  const show = (stage) => {
    if (disposed) return;
    root.dataset.stage = stage;
    const requestedImage = stage === "stacked" ? "stacking" : stage;
    const isFallback = failedImages.has(requestedImage);
    const visibleImage = isFallback ? "stacking" : requestedImage;
    root.dataset.imageFallback = isFallback ? stage : "";
    for (const image of images) image.hidden = image.dataset.alignmentImage !== visibleImage;
    if (caption) caption.hidden = stage !== "deep-field" || isFallback;
    if (visibleImage === "stacking") {
      const image = images.find((item) => item.dataset.alignmentImage === "stacking");
      image?.setAttribute("aria-label", stage === "stacked" || stage === "deep-field"
        ? "The 18 star images are stacked together at one point."
        : stage === "scattered"
        ? "Simplified alignment diagram: 18 scattered images of one star."
        : stage === "hexagonal"
        ? "Simplified alignment diagram: 18 images of one star arranged in a hexagon."
        : "Simplified image stacking: 18 images of one star move toward the same point.");
    }
  };

  for (const image of images) {
    if (image.dataset.alignmentImage === "stacking") continue;
    const onError = () => {
      failedImages.add(image.dataset.alignmentImage);
      show(root.dataset.stage || "scattered");
    };
    image.addEventListener("error", onError);
    errorHandlers.set(image, onError);
    if (image.complete && image.naturalWidth === 0) failedImages.add(image.dataset.alignmentImage);
  }

  return {
    updateProgress(value) {
      if (disposed) return;
      const stage = webbAlignmentStage(value);
      // Drag, animation and render loops can report the same value repeatedly.
      // Do not restart the hold or cover the deep field again on those updates.
      if (stage === previousStage) return;
      previousStage = stage;
      if (revealTimer !== null) {
        cancel(revealTimer);
        revealTimer = null;
      }
      show(stage);
      if (stage === "stacked") {
        revealTimer = schedule(() => {
          revealTimer = null;
          if (previousStage === "stacked") show("deep-field");
        }, WEBB_STACK_HOLD_MS);
      }
    },
    dispose() {
      disposed = true;
      if (revealTimer !== null) cancel(revealTimer);
      revealTimer = null;
      for (const [image, onError] of errorHandlers) image.removeEventListener("error", onError);
    },
  };
}
