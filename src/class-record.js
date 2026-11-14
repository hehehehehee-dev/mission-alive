import { formatJourney } from "./greeting-journey.js";
import { t } from "./i18n.js";
import { greetings } from "./greetings-catalog.js";

const configuredApi = (import.meta.env?.VITE_CLASSROOM_API_URL || "").trim().replace(/\/$/, "");
const api = configuredApi || (location.protocol === "https:" || location.port === "8888" ? "/api/class-record" : "");
const STORAGE_KEY = "mission-alive-class-record";
function visitorWords(value) {
  const span = document.createElement("span");
  span.dataset.userContent = "";
  span.textContent = value;
  return span;
}
function displayName(value) {
  if (value && value !== "Anonymous Earthling") return visitorWords(value);
  const span = document.createElement("span");
  span.textContent = "Anonymous Earthling";
  return span;
}
const comparisonCountries = new Set(greetings.flatMap((entry) => entry.countries));
const getStored = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {}; } catch { return {}; } };
const saveStored = (value) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { /* Shared school devices may block storage. */ } };

async function request(body) {
  const response = await fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Class record unavailable.");
  return result;
}

async function base64Audio(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  return btoa(binary);
}

export function classRecordMarkup() {
  if (!api) return "";
  return `<section class="class-record" aria-labelledby="class-record-heading">
    <div class="library-heading"><h4 id="class-record-heading">Our classroom Golden Record</h4><span>CREATE · SHARE · LISTEN</span></div>
    <p class="fine">A teacher creates a class code. Students join and submit their own-language greeting, with an optional English translation. The teacher listens and approves before anyone can hear it. No account is needed.</p>
    <div class="class-record-start">
      <div><label for="class-code">Join with a class code</label><div class="class-inline"><input id="class-code" maxlength="12" autocomplete="off" spellcheck="false" placeholder="12-character code"><button id="class-join">Open record</button></div></div>
      <div><label for="class-title">Teacher: create a class record</label><div class="class-inline"><input id="class-title" maxlength="70" placeholder="e.g. Room 8 · Earth, 2026"><button id="class-create">Create record</button></div></div>
    </div>
    <p class="fine" id="class-status" role="status">Enter a code or create a record.</p>
    <div id="class-active" hidden>
      <div class="class-code-card"><strong id="class-active-title"></strong><span>CLASS CODE <b id="class-active-code"></b></span><button id="class-copy-code">Copy code</button><button id="class-leave">Leave this record</button></div>
      <label class="publish-consent"><input type="checkbox" id="class-consent"> I created this greeting and agree that my audio, words, chosen name, language, and country may be heard publicly after teacher review.</label>
      <p class="fine">First save a voice or written greeting above. Then use “Send to class” on your saved greeting. The teacher can reject submissions. Use a nickname or leave the name blank.</p>
      <div class="library-heading"><h5>Approved voices</h5><span id="class-count">0 APPROVED</span></div>
      <div class="class-record-list" id="class-record-list"></div>
      <div id="class-teacher"><h5>Teacher review</h5><p class="fine">Keep your teacher key private. Save it outside this browser so you can return at the end of the year.</p><div class="class-inline"><input id="class-teacher-key" type="password" autocomplete="off" placeholder="Paste your teacher key"><button id="class-save-key">Save key on this device</button><button id="class-copy-key">Copy key</button></div><button id="class-refresh-queue">Load pending greetings</button><div class="class-record-list" id="class-pending-list"></div></div>
    </div>
    <div class="class-gallery"><div class="library-heading"><h5>Classroom voices from Earth</h5><span>TEACHER APPROVED</span></div><label for="class-gallery-search">Find a language, country, or class</label><div class="class-inline"><input type="search" id="class-gallery-search" placeholder="Try Vietnamese or Vietnam"><button id="class-refresh-gallery">Refresh voices</button></div><p class="fine" id="class-gallery-status" role="status">Loading approved classroom greetings…</p><div class="class-record-list" id="class-gallery-list"></div></div>
  </section>`;
}

export function mountClassRecord(container, { onPlay = () => {}, onPause = () => {}, reducedMotion = false } = {}) {
  if (!api) return {
    available: false,
    activeCode: "",
    setReduced() {},
    dispose() {},
    async submit() { throw new Error("Open a class record first."); },
  };
  const find = (selector) => container.querySelector(selector);
  const status = find("#class-status");
  const saved = getStored();
  let code = saved.code || "";
  let teacherKey = saved.teacherKey || "";
  let alive = true;
  let galleryEntries = [];
  const previewUrls = new Set();
  const updateJourneys = () => {
    container.querySelectorAll("[data-class-journey]").forEach((item) => {
      item.textContent = `Imagined journey · ${formatJourney(item.dataset.classJourney)}`;
    });
  };
  let journeyTimer = window.setInterval(updateJourneys, reducedMotion ? 30000 : 1000);

  function say(message) { status.textContent = message; }
  function active(title) {
    find("#class-active").hidden = false;
    find("#class-active-title").textContent = title;
    find("#class-active-code").textContent = code;
    find("#class-teacher").hidden = false;
    find("#class-teacher-key").value = teacherKey;
    saveStored({ code, teacherKey });
  }
  function addEntry(list, entry, pending = false) {
    const article = document.createElement("article");
    article.className = "class-record-item";
    const heading = document.createElement("h6");
    heading.append(visitorWords(entry.language));
    if (entry.country) {
      const country = document.createElement("span");
      country.textContent = entry.country;
      heading.append(" · ", country);
    }
    const byline = document.createElement("p");
    byline.className = "fine";
    byline.append(document.createTextNode("From "), displayName(entry.name));
    if (entry.classTitle) byline.append(" · ", visitorWords(entry.classTitle));
    if (pending) byline.append(document.createTextNode(` · AI check: ${entry.aiReview || "not configured"}`));
    const journey = document.createElement("p");
    journey.className = "greeting-journey";
    journey.dataset.classJourney = entry.createdAt;
    journey.textContent = `Imagined journey · ${formatJourney(entry.createdAt)}`;
    article.append(heading, byline, journey);
    if (entry.country) {
      const origin = document.createElement("p");
      origin.className = "greeting-origin";
      origin.textContent = `◉ Earth · ${entry.country}`;
      article.append(origin);
    }
    if (comparisonCountries.has(entry.country)) {
      const compare = document.createElement("button");
      compare.type = "button";
      compare.className = "compare-country";
      compare.textContent = `Compare original voices linked to ${entry.country} ↗`;
      compare.addEventListener("click", () => container.dispatchEvent(new CustomEvent("compare-greeting-country", { detail: { country: entry.country } })));
      article.append(compare);
    }
    if (entry.message) {
      const message = document.createElement("blockquote");
      message.textContent = entry.message;
      article.append(message);
    }
    if (entry.translation) {
      const translation = document.createElement("p");
      translation.className = "greeting-translation-note";
      translation.append(document.createTextNode("English: "), visitorWords(entry.translation));
      article.append(translation);
    }
    if (pending && entry.transcript) {
      const transcript = document.createElement("p");
      transcript.className = "fine";
      transcript.append(document.createTextNode("Audio transcript for review: "), visitorWords(entry.transcript));
      article.append(transcript);
    }
    if (entry.hasAudio) {
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.preload = "none";
      audio.setAttribute("aria-label", `${entry.language} greeting from ${entry.name}`);
      audio.addEventListener("playing", onPlay);
      audio.addEventListener("pause", onPause);
      audio.addEventListener("ended", onPause);
      if (!pending) audio.src = `${api}?action=audio&code=${encodeURIComponent(entry.code || code)}&id=${encodeURIComponent(entry.id)}`;
      else {
        const loadAudio = document.createElement("button");
        loadAudio.textContent = "Load audio for review";
        loadAudio.addEventListener("click", async () => {
          loadAudio.disabled = true;
          try {
            const result = await request({ action: "pending-audio", code, teacherKey, id: entry.id });
            const binary = atob(result.audioBase64);
            const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
            const objectUrl = URL.createObjectURL(new Blob([bytes], { type: result.mimeType }));
            previewUrls.add(objectUrl);
            audio.src = objectUrl;
            audio.hidden = false;
            loadAudio.remove();
          } catch (error) { say(error.message); loadAudio.disabled = false; }
        });
        article.append(loadAudio);
        audio.hidden = true;
      }
      article.append(audio);
    }
    if (pending) {
      const actions = document.createElement("div");
      actions.className = "saved-record-actions";
      for (const decision of ["approve", "reject"]) {
        const button = document.createElement("button");
        button.textContent = decision === "approve" ? "Approve for public listening" : "Reject and delete";
        button.addEventListener("click", async () => {
          button.disabled = true;
          try {
            await request({ action: "review", code, teacherKey, id: entry.id, decision });
            say(decision === "approve" ? "Greeting approved and now public." : "Greeting rejected and deleted.");
            await Promise.all([load(), loadQueue(), loadGallery()]);
          } catch (error) { say(error.message); button.disabled = false; }
        });
        actions.append(button);
      }
      article.append(actions);
    } else if (teacherKey && entry.code === undefined) {
      const remove = document.createElement("button");
      remove.textContent = "Remove published greeting";
      remove.addEventListener("click", async () => {
        if (!confirm(t("Remove this greeting from the public classroom gallery?"))) return;
        remove.disabled = true;
        try {
          await request({ action: "remove", code, teacherKey, id: entry.id });
          await Promise.all([load(), loadGallery()]);
          say("Published greeting removed.");
        } catch (error) { say(error.message); remove.disabled = false; }
      });
      article.append(remove);
    }
    list.append(article);
  }
  async function load() {
    if (!api || !code) return;
    try {
      const response = await fetch(`${api}?action=class&code=${encodeURIComponent(code)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Class unavailable.");
      if (!alive) return;
      active(data.title);
      const list = find("#class-record-list");
      list.replaceChildren();
      find("#class-count").textContent = `${data.recordings.length} APPROVED`;
      if (!data.recordings.length) list.textContent = "No approved greetings yet. The teacher will hear submissions before they appear here.";
      else data.recordings.forEach((entry) => addEntry(list, entry));
      say(`Class record ${code} is ready.`);
    } catch (error) { say(error.message); }
  }
  async function loadQueue() {
    if (!code || !teacherKey) return;
    try {
      const data = await request({ action: "queue", code, teacherKey });
      const list = find("#class-pending-list");
      list.replaceChildren();
      if (!data.recordings.length) list.textContent = "No greetings waiting for review.";
      else data.recordings.forEach((entry) => addEntry(list, entry, true));
    } catch (error) { say(error.message); }
  }
  function drawGallery() {
    const term = find("#class-gallery-search").value.trim().toLocaleLowerCase();
    const matching = galleryEntries.filter((entry) => [entry.language, entry.country, entry.classTitle].some((value) => (value || "").toLocaleLowerCase().includes(term)));
    const list = find("#class-gallery-list");
    list.replaceChildren();
    if (!matching.length) list.textContent = term ? "No approved classroom greetings match that search." : "No classroom greetings have been approved yet.";
    else matching.forEach((entry) => addEntry(list, entry));
    find("#class-gallery-status").textContent = `${matching.length} of ${galleryEntries.length} approved greetings shown. Country labels describe trainee choices, not nationality.`;
  }
  async function loadGallery() {
    try {
      const response = await fetch(`${api}?action=gallery`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gallery unavailable.");
      if (!alive) return;
      galleryEntries = Array.isArray(data.recordings) ? data.recordings : [];
      drawGallery();
    } catch (error) { find("#class-gallery-status").textContent = error.message; }
  }
  find("#class-join").addEventListener("click", () => {
    const nextCode = find("#class-code").value.trim().toUpperCase();
    if (nextCode !== code) teacherKey = "";
    code = nextCode;
    if (!/^[A-F0-9]{12}$/.test(code)) { say("Enter the 12-character code from your teacher."); return; }
    load();
  });
  find("#class-create").addEventListener("click", async () => {
    const title = find("#class-title").value.trim();
    const button = find("#class-create");
    button.disabled = true;
    try {
      const result = await request({ action: "create", title });
      code = result.code;
      teacherKey = result.teacherKey;
      active(result.title);
      await load();
      await loadQueue();
      say("Class record created. Copy and save your teacher key before sharing the class code.");
    } catch (error) { say(error.message); }
    finally { button.disabled = false; }
  });
  find("#class-copy-code").addEventListener("click", async () => {
    await navigator.clipboard.writeText(code);
    say("Class code copied. Share it with students.");
  });
  find("#class-copy-key").addEventListener("click", async () => {
    if (!teacherKey) return;
    await navigator.clipboard.writeText(teacherKey);
    say("Teacher key copied. Keep it private; you need it for later reviews.");
  });
  find("#class-save-key").addEventListener("click", () => {
    const value = find("#class-teacher-key").value.trim();
    if (!/^[a-f0-9]{64}$/.test(value)) { say("Paste the 64-character teacher key."); return; }
    teacherKey = value;
    saveStored({ code, teacherKey });
    find("#class-teacher").hidden = false;
    loadQueue();
  });
  find("#class-refresh-queue").addEventListener("click", loadQueue);
  find("#class-refresh-gallery").addEventListener("click", loadGallery);
  find("#class-gallery-search").addEventListener("input", drawGallery);
  find("#class-leave").addEventListener("click", () => {
    code = ""; teacherKey = "";
    saveStored({});
    find("#class-active").hidden = true;
    find("#class-code").value = "";
    say("Class record closed on this device.");
  });
  if (api && code) { load(); if (teacherKey) loadQueue(); }
  loadGallery();
  return {
    available: true,
    setReduced(value) {
      reducedMotion = value;
      clearInterval(journeyTimer);
      journeyTimer = window.setInterval(updateJourneys, reducedMotion ? 30000 : 1000);
    },
    get activeCode() { return code; },
    async submit(record) {
      if (!api || !code) throw new Error("Open a class record first.");
      if (!find("#class-consent").checked) throw new Error("Tick the classroom sharing consent first.");
      if (record.audio?.size > 2 * 1024 * 1024) throw new Error("Class audio must be under 2 MB. Write a greeting instead or make a shorter recording.");
      const result = await request({
        action: "submit", code, consent: true,
        name: record.name, language: record.language, country: record.country,
        message: record.message, translation: record.translation,
        createdAt: record.createdAt,
        mimeType: record.mimeType || record.audio?.type || "",
        audioBase64: record.audio ? await base64Audio(record.audio) : undefined,
      });
      say(`Sent to class ${code}. Your teacher will review it before anyone else can hear it.`);
      if (teacherKey) await loadQueue();
      return result;
    },
    dispose() {
      alive = false;
      clearInterval(journeyTimer);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    },
  };
}
