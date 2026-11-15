// Public "Voices from Earth" gallery. A shared greeting goes live immediately
// (the owner's choice); anyone can report one, which hides it at once.
const configuredApi = (import.meta.env?.VITE_GREETINGS_API_URL || "").trim().replace(/\/$/, "");
export const sharedGreetingsApi = configuredApi || (typeof location !== "undefined" && (location.protocol === "https:" || location.port === "8888") ? "/api/greetings" : "");

function visitorWords(value) {
  const span = document.createElement("span");
  span.dataset.userContent = "";
  span.textContent = value;
  return span;
}

async function request(body) {
  const response = await fetch(sharedGreetingsApi, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Sharing is temporarily unavailable.");
  return result;
}

export const shareGreeting = (payload) => request({ action: "share", consent: true, ...payload });
export const deleteSharedGreeting = (id, deleteKey) => request({ action: "delete", id, deleteKey });
const reportGreeting = (id) => request({ action: "report", id });

export function sharedGreetingsMarkup() {
  return `<section class="shared-greetings" aria-labelledby="shared-greetings-title">
    <div class="library-heading"><h4 id="shared-greetings-title">Voices from Earth today</h4><span id="shared-greetings-count"></span></div>
    <p class="fine" id="shared-greetings-status" role="status">${sharedGreetingsApi ? "Loading greetings…" : "Shared greetings appear here on the live site."}</p>
    <div id="shared-greetings-list" class="community-record-list"></div>
  </section>`;
}

export function mountSharedGreetings(container, { onPlay = () => {}, onPause = () => {} } = {}) {
  const list = container.querySelector("#shared-greetings-list");
  const status = container.querySelector("#shared-greetings-status");
  const count = container.querySelector("#shared-greetings-count");
  let disposed = false;
  if (!list || !sharedGreetingsApi) return { refresh() {}, dispose() {} };

  function draw(greetings) {
    list.querySelectorAll("audio").forEach((audio) => audio.pause());
    list.replaceChildren();
    count.textContent = `${greetings.length} SHARED`;
    status.textContent = greetings.length
      ? "Greetings shared by visitors. Tap Report if one should not be here."
      : "No greetings yet. Share yours to be the first.";
    for (const greeting of greetings) {
      const article = document.createElement("article");
      article.className = "community-record-item";
      const heading = document.createElement("h5");
      heading.append(visitorWords(greeting.language));
      const byline = document.createElement("p");
      byline.className = "fine";
      byline.append(greeting.name && greeting.name !== "Anonymous Earthling" ? visitorWords(greeting.name) : "Anonymous Earthling");
      if (greeting.country) byline.append(" · ", visitorWords(greeting.country));
      article.append(heading, byline);
      if (greeting.message) {
        const message = document.createElement("p");
        message.className = "community-message";
        message.append(visitorWords(greeting.message));
        article.append(message);
      }
      if (greeting.translation) {
        const translation = document.createElement("p");
        translation.className = "greeting-translation-note";
        translation.append("English: ", visitorWords(greeting.translation));
        article.append(translation);
      }
      if (greeting.transcript) {
        const transcript = document.createElement("p");
        transcript.className = "greeting-translation-note";
        transcript.append("Transcript: ", visitorWords(greeting.transcript));
        article.append(transcript);
      }
      if (greeting.hasAudio) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.preload = "none";
        audio.src = `${sharedGreetingsApi}?action=audio&id=${encodeURIComponent(greeting.id)}`;
        audio.setAttribute("aria-label", `${greeting.language} shared greeting`);
        audio.addEventListener("playing", onPlay);
        audio.addEventListener("pause", onPause);
        audio.addEventListener("ended", onPause);
        article.append(audio);
      }
      const report = document.createElement("button");
      report.type = "button";
      report.className = "report-greeting";
      report.textContent = "Report";
      report.setAttribute("aria-label", `Report ${greeting.language} greeting`);
      report.addEventListener("click", async () => {
        report.disabled = true;
        try {
          await reportGreeting(greeting.id);
          article.remove();
          status.textContent = "Thanks. That greeting is hidden while it is checked.";
        } catch (error) {
          report.disabled = false;
          status.textContent = error.message;
        }
      });
      article.append(report);
      list.append(article);
    }
  }

  async function refresh() {
    try {
      const response = await fetch(`${sharedGreetingsApi}?action=list`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (!disposed) draw(result.greetings || []);
    } catch {
      if (!disposed) status.textContent = "Shared greetings can't load right now. Your own greeting still counts.";
    }
  }

  refresh();
  return {
    refresh,
    dispose() {
      disposed = true;
      list.querySelectorAll("audio").forEach((audio) => audio.pause());
    },
  };
}
