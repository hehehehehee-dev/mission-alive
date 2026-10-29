import { getLanguage, t } from "./i18n.js";
import { registerArchivePhotoCredits } from './resource-credits.js';

export function localizedNasaImageTitle(item) {
  const translated = t(item.title);
  return getLanguage() === "en" || translated !== item.title
    ? translated
    : `${t("NASA archive image")} · ${item.id}`;
}

const NASA_IMAGE_SEARCH =
  "https://images-api.nasa.gov/search?q=Curiosity%20Mastcam%20Mars&media_type=image&year_start=2023&page_size=12";
const NASA_RAW_IMAGES =
  "https://mars.nasa.gov/msl/multimedia/raw-images/";

const fallbackImages = [
  ["PIA26410", "Curiosity's View Within Gediz Vallis Channel", "https://images-assets.nasa.gov/image/PIA26410/PIA26410~medium.jpg", "2024"],
  ["PIA26048", "Curiosity Views ‘Sequoia’ Using Its Mastcam", "https://images-assets.nasa.gov/image/PIA26048/PIA26048~medium.jpg", "2023"],
  ["PIA26472", "Curiosity Views the Yardang Unit", "https://images-assets.nasa.gov/image/PIA26472/PIA26472~medium.jpg", "2024"],
  ["PIA26014", "Curiosity Views a Crater at ‘Jau’", "https://images-assets.nasa.gov/image/PIA26014/PIA26014~medium.jpg", "2023"],
  ["PIA26671", "Curiosity Views Gale Crater’s Rim", "https://images-assets.nasa.gov/image/PIA26671/PIA26671~medium.jpg", "2026"],
  ["PIA26680", "Curiosity Sends a Postcard From Mount Sharp", "https://images-assets.nasa.gov/image/PIA26680/PIA26680~large.jpg", "2026"],
].map(([id, title, image, year]) => ({
  id,
  title,
  image,
  year,
  credit: "NASA/JPL-Caltech/MSSS",
}));

function safeNasaImage(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith("nasa.gov")
      ? url.href
      : "";
  } catch {
    return "";
  }
}

function normalizeItems(payload) {
  return (payload?.collection?.items || [])
    .map((item) => {
      const data = item.data?.[0] || {};
      const image = safeNasaImage(
        item.links?.find((link) => link.render === "image")?.href,
      );
      if (!data.nasa_id || !data.title || !image) return null;
      return {
        id: data.nasa_id,
        title: data.title.trim(),
        image,
        year: String(data.date_created || "").slice(0, 4) || "NASA archive",
        credit: data.secondary_creator || "NASA/JPL-Caltech/MSSS",
      };
    })
    .filter(Boolean)
    .slice(0, 6);
}

function drawGallery(grid, images) {
  registerArchivePhotoCredits(images);
  grid.replaceChildren();
  images.forEach((item) => {
    const card = document.createElement("a");
    card.className = "curiosity-photo-card";
    card.href = `https://images.nasa.gov/details/${encodeURIComponent(item.id)}`;
    card.target = "_blank";
    card.rel = "noopener";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = localizedNasaImageTitle(item);
    image.dataset.i18nSkip = "";
    image.loading = "lazy";
    image.decoding = "async";

    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = localizedNasaImageTitle(item);
    title.dataset.i18nSkip = "";
    card.addEventListener("mission-image-language-change", () => {
      title.textContent = localizedNasaImageTitle(item);
      image.alt = localizedNasaImageTitle(item);
    });
    const meta = document.createElement("small");
    meta.textContent = `${item.year} · ${item.credit}`;
    copy.append(title, meta);
    card.append(image, copy);
    grid.append(card);
  });
}

export function mountCuriosityGallery(container) {
  const controller = new AbortController();
  const status = container.querySelector("#curiosity-photo-status");
  const grid = container.querySelector("#curiosity-photo-grid");
  const source = container.querySelector("#curiosity-raw-source");
  source.href = NASA_RAW_IMAGES;
  drawGallery(grid, fallbackImages);
  const refreshLanguage = () => grid.querySelectorAll(".curiosity-photo-card").forEach((card) => card.dispatchEvent(new Event("mission-image-language-change")));
  window.addEventListener("mission-language-change", refreshLanguage);

  fetch(NASA_IMAGE_SEARCH, { signal: controller.signal })
    .then((response) => {
      if (!response.ok) throw new Error("NASA image search unavailable");
      return response.json();
    })
    .then((payload) => {
      const images = normalizeItems(payload);
      if (!images.length) throw new Error("NASA returned no Curiosity images");
      drawGallery(grid, images);
      status.textContent =
        "Live selection from NASA’s Image and Video Library · real Curiosity mission imagery.";
    })
    .catch((error) => {
      if (error.name === "AbortError") return;
      status.textContent =
        "Showing a curated NASA fallback while the live image archive is unavailable.";
    });

  return { dispose() { controller.abort(); window.removeEventListener("mission-language-change", refreshLanguage); } };
}
