const FILM_SOURCE = "/assets/solar-system-flyout.webm";

export function createMissionFilm(video) {
  let active = false;
  let reduced = false;
  let sourceAttached = false;

  const sync = () => {
    const saveData = navigator.connection?.saveData === true;
    const shouldPlay = active && !reduced && !saveData && !document.hidden;
    video.classList.toggle("is-active", shouldPlay);

    if (!shouldPlay) {
      video.pause();
      return;
    }

    if (!sourceAttached) {
      video.src = FILM_SOURCE;
      video.load();
      sourceAttached = true;
    }
    video.play().catch(() => {
      // The heliosphere still remains visible if autoplay is blocked.
      video.classList.remove("is-active");
    });
  };

  video.addEventListener("canplay", () => video.classList.add("is-ready"));
  video.addEventListener("error", () => video.classList.remove("is-active", "is-ready"));
  document.addEventListener("visibilitychange", sync);

  return {
    setExhibit(id) {
      active = id === "voyager";
      sync();
    },
    setReduced(value) {
      reduced = value;
      sync();
    },
  };
}
