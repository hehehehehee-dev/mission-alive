import { greetings } from "./greetings-catalog.js";
import { t, canonicalOptionValue } from "./i18n.js";
import { formatJourney } from "./greeting-journey.js";
import { classRecordMarkup, mountClassRecord } from "./class-record.js";

const DB_NAME = "mission-alive-personal-records";
const STORE_NAME = "recordings";
const DB_VERSION = 1;
const MAX_SECONDS = 30;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
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
function countryLabel(value) {
  const span = document.createElement("span");
  span.textContent = value;
  return span;
}
const communityApi = (import.meta.env?.VITE_COMMUNITY_API_URL || "")
  .trim()
  .replace(/\/$/, "");
const languageOptions = greetings.map((item) => item.language);
const countryOptions = [...new Set(greetings.flatMap((item) => item.countries))].sort();

function formatDuration(seconds) {
  const value = Math.max(0, Math.min(MAX_SECONDS, Math.round(seconds)));
  return `00:${String(value).padStart(2, "0")}`;
}

function chooseMimeType() {
  const options = [
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ];
  return options.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("Local recording storage is unavailable."));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME))
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore(mode, operation) {
  const db = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const request = operation(transaction.objectStore(STORE_NAME));
      transaction.oncomplete = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.onabort = () => reject(transaction.error);
      transaction.onerror = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}

const getLocalRecords = () => withStore("readonly", (store) => store.getAll());
const saveLocalRecord = (record) =>
  withStore("readwrite", (store) => store.put(record));
const deleteLocalRecord = (id) =>
  withStore("readwrite", (store) => store.delete(id));

async function blobToBase64(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk)
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  return btoa(binary);
}

function safeAudioUrl(value) {
  try {
    const url = new URL(value, communityApi || location.origin);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

export function personalRecordMarkup() {
  return `<section class="personal-record-studio" aria-labelledby="personal-record-heading">
    <div class="studio-heading"><div><p class="eyebrow">YOUR TIME CAPSULE</p><h3 id="personal-record-heading" tabindex="-1">Make your own Golden Record</h3></div><span>PRIVATE UNTIL PUBLISHED</span></div>
    <p class="studio-intro">Write a greeting or record up to ${MAX_SECONDS} seconds. Save it privately, then choose whether to share it.</p>
    <div class="recording-card">
      <div class="recording-fields">
        <label for="personal-language">Your greeting's language</label><input id="personal-language" maxlength="40" required aria-describedby="personal-record-status" list="personal-language-options" placeholder="e.g. Vietnamese"><datalist id="personal-language-options">${languageOptions.map((language) => `<option value="${language}"></option>`).join("")}</datalist>
        <label for="personal-message">Your greeting or transcript</label><textarea id="personal-message" maxlength="240" rows="3" aria-describedby="personal-record-status" placeholder="Write a greeting in the language you speak at home."></textarea>
        <details class="greeting-optional-fields"><summary>Name, country & translation (optional)</summary><div>
          <label for="personal-name">Your display name <span>(optional)</span></label><input id="personal-name" maxlength="40" placeholder="Space listener">
          <label for="personal-country">Country or region <span>(optional)</span></label><input id="personal-country" maxlength="50" list="personal-country-options" placeholder="e.g. Vietnam"><datalist id="personal-country-options">${countryOptions.map((country) => `<option value="${country}"></option>`).join("")}</datalist>
          <label for="personal-translation">English translation <span>(optional)</span></label><textarea id="personal-translation" maxlength="240" rows="2" placeholder="Help another listener understand your words."></textarea>
        </div></details>
      </div>
      <div class="recording-console">
        <div class="recording-orbit" aria-hidden="true"><i></i><b></b></div>
        <output id="personal-timer" role="timer" aria-live="off" aria-label="Recording duration">00:00 / 00:${MAX_SECONDS}</output>
        <div class="recording-actions"><button type="button" class="primary" id="start-personal-recording">Start recording</button><button type="button" id="stop-personal-recording" disabled>Stop</button></div>
        <audio id="personal-preview" controls hidden aria-label="Preview your recorded greeting"></audio>
        <p class="fine">Your browser will ask for microphone access only after you press Start recording.</p>
      </div>
    </div>
    <div class="greeting-save"><button type="button" class="primary" id="save-personal-recording" disabled>Save privately on this device</button><p class="fine">Writing counts toward the Voyager stamp.</p><p class="fine" id="personal-record-status">Choose a language and add your words or a recording.</p></div>
    <p class="journey-explainer">Imagine your greeting traveling beside Voyager 1. The counters below use NASA's approximate speed of 17 km/s relative to the Sun. Your recording stays here; it is not actually on the spacecraft. <a href="https://science.nasa.gov/mission/voyager/voyager-1/" target="_blank" rel="noopener">NASA speed source ↗</a></p>
    <div class="personal-library">
      <div class="library-heading"><h4>My saved greetings</h4><span id="personal-record-count">0 SAVED</span></div>
      <div id="personal-record-list" class="personal-record-list"></div>
    </div>
    ${communityApi ? `<div class="community-library">
      <div class="library-heading"><h4>Community record</h4><span id="community-record-count">ONLINE ARCHIVE</span></div>
      <p class="fine" id="community-status"></p>
      <label class="publish-consent"><input type="checkbox" id="publish-consent"> I created this recording and agree to share its audio and the details above publicly after moderation.</label>
      <button id="refresh-community-records">Refresh community voices</button>
      <div id="community-record-list" class="community-record-list"></div>
    </div>` : ""}
    ${classRecordMarkup()}
  </section>`;
}

export function mountPersonalRecords(
  container,
  { onPlay, onPause, onSave = () => {}, onAnnounce = () => {}, reducedMotion = false },
) {
  const find = (selector) => container.querySelector(selector);
  const startButton = find("#start-personal-recording");
  const stopButton = find("#stop-personal-recording");
  const saveButton = find("#save-personal-recording");
  const preview = find("#personal-preview");
  const timer = find("#personal-timer");
  const status = find("#personal-record-status");
  const localList = find("#personal-record-list");
  const communityList = find("#community-record-list");
  let recorder = null;
  let stream = null;
  let chunks = [];
  let currentBlob = null;
  let lastSavedTextKey = "";
  let previewUrl = "";
  let timerId = 0;
  let startedAt = 0;
  let disposed = false;
  const localUrls = new Set();
  const classroom = mountClassRecord(container, { onPlay, onPause, reducedMotion });

  function setStatus(message, target = status) {
    target.textContent = message;
    if (!disposed) onAnnounce(message);
  }

  function stopStream() {
    stream?.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = 0;
  }

  function updateTimer() {
    const seconds = Math.min(MAX_SECONDS, (Date.now() - startedAt) / 1000);
    timer.textContent = `${formatDuration(seconds)} / 00:${MAX_SECONDS}`;
    if (seconds >= MAX_SECONDS && recorder?.state === "recording") recorder.stop();
  }

  function clearPreviewUrl() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = "";
  }

  function metadata() {
    return {
      name: find("#personal-name").value.trim() || "Anonymous Earthling",
      language: find("#personal-language").value.trim(),
      country: canonicalOptionValue(find("#personal-country").value.trim(), countryOptions),
      message: find("#personal-message").value.trim(),
      translation: find("#personal-translation").value.trim(),
    };
  }

  function updateSaveAvailability() {
    const details = metadata();
    if (details.language) find("#personal-language").removeAttribute("aria-invalid");
    if (details.message) find("#personal-message").removeAttribute("aria-invalid");
    const textKey = `${details.language}\n${details.message}\n${details.translation}`;
    saveButton.disabled = recorder?.state === "recording" || (!currentBlob?.size && (!details.language || !details.message || textKey === lastSavedTextKey));
  }

  function validateMetadata() {
    if (metadata().language) return true;
    find("#personal-language").setAttribute("aria-invalid", "true");
    find("#personal-language").focus();
    setStatus("Add the language of your greeting before saving it.");
    return false;
  }

  async function startRecording() {
    const restoreFocus = document.activeElement === startButton;
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setStatus("Audio recording is unavailable here. Write a greeting below to complete the mission.");
      find("#personal-message").focus();
      return;
    }
    preview.pause();
    clearPreviewUrl();
    currentBlob = null;
    updateSaveAvailability();
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: false,
      });
      if (disposed) {
        stopStream();
        return;
      }
      const mimeType = chooseMimeType();
      recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      chunks = [];
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size) chunks.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        const moveToSave = document.activeElement === stopButton;
        stopTimer();
        stopStream();
        find(".recording-console").classList.remove("is-recording");
        if (disposed) return;
        currentBlob = new Blob(chunks, {
          type: recorder.mimeType || chunks[0]?.type || "audio/webm",
        });
        clearPreviewUrl();
        previewUrl = URL.createObjectURL(currentBlob);
        preview.src = previewUrl;
        preview.hidden = false;
        startButton.disabled = false;
        stopButton.disabled = true;
        updateSaveAvailability();
        const seconds = Math.min(MAX_SECONDS, (Date.now() - startedAt) / 1000);
        timer.textContent = `${formatDuration(seconds)} / 00:${MAX_SECONDS}`;
        setStatus("Recording ready. Listen to the preview, then save it privately.");
        if (moveToSave) saveButton.focus();
      });
      recorder.start(250);
      updateSaveAvailability();
      startedAt = Date.now();
      timer.textContent = `00:00 / 00:${MAX_SECONDS}`;
      timerId = window.setInterval(updateTimer, 200);
      startButton.disabled = true;
      stopButton.disabled = false;
      if (restoreFocus) stopButton.focus();
      find(".recording-console").classList.add("is-recording");
      setStatus("Recording… speak clearly and press Stop when your greeting is complete.");
    } catch (error) {
      stopStream();
      find(".recording-console").classList.remove("is-recording");
      startButton.disabled = false;
      stopButton.disabled = true;
      setStatus(
        error?.name === "NotAllowedError"
          ? "Microphone access was not granted. Write a greeting below instead."
          : "The microphone could not start. Check that another app is not using it.",
      );
      if (restoreFocus) find("#personal-message").focus();
    }
  }

  function stopRecording() {
    if (recorder?.state === "recording") recorder.stop();
    find(".recording-console").classList.remove("is-recording");
  }

  function makeAudio(blob, label) {
    const audio = document.createElement("audio");
    const url = URL.createObjectURL(blob);
    localUrls.add(url);
    audio.controls = true;
    audio.preload = "none";
    audio.src = url;
    audio.setAttribute("aria-label", label);
    audio.addEventListener("playing", (event) => {
      setStatus(`Playing ${label}.`);
      onPlay(event);
    });
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    return audio;
  }

  async function drawLocalRecords({ focusRecordId } = {}) {
    try {
      const records = (await getLocalRecords()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      if (disposed) return;
      localList.querySelectorAll("audio").forEach(audio => audio.pause());
      localUrls.forEach((url) => URL.revokeObjectURL(url));
      localUrls.clear();
      localList.replaceChildren();
      find("#personal-record-count").textContent = `${records.length} SAVED`;
      if (!records.length) {
        const empty = document.createElement("p");
        empty.className = "empty-greetings";
        empty.textContent = "No private greetings yet. Your first recording or written message will appear here.";
        localList.append(empty);
        return;
      }
      records.forEach((record) => {
        const article = document.createElement("article");
        article.className = "personal-record-item";
        const heading = document.createElement("h5");
        heading.textContent = record.language;
        heading.tabIndex = -1;
        const byline = document.createElement("p");
        byline.className = "fine";
        byline.append(displayName(record.name));
        if (record.country) byline.append(" · ", countryLabel(record.country));
        byline.append(document.createTextNode(` · ${record.audio ? "audio" : "written"} greeting · private on this device`));
        article.append(heading, byline);
        if (record.country) {
          const origin = document.createElement("p");
          origin.className = "greeting-origin";
          origin.textContent = `◉ Earth · ${record.country}`;
          article.append(origin);
        }
        const journey = document.createElement("p");
        journey.className = "greeting-journey";
        journey.dataset.journeyStart = record.createdAt;
        journey.textContent = `Imagined journey since saving · ${formatJourney(record.createdAt)}`;
        article.append(journey);
        if (countryOptions.includes(record.country)) {
          const compare = document.createElement("button");
          compare.type = "button";
          compare.className = "compare-country";
          compare.textContent = `Explore original voices linked to ${record.country} ↗`;
          compare.addEventListener("click", () => container.dispatchEvent(new CustomEvent("compare-greeting-country", { detail: { country: record.country } })));
          article.append(compare);
        }
        if (record.message) {
          const message = document.createElement("blockquote");
          message.textContent = record.message;
          article.append(message);
        }
        if (record.translation) {
          const translation = document.createElement("p");
          translation.className = "greeting-translation-note";
          translation.append(document.createTextNode("English: "), visitorWords(record.translation));
          article.append(translation);
        }
        if (record.audio)
          article.append(makeAudio(record.audio, `${record.language} personal greeting`));
        const actions = document.createElement("div");
        actions.className = "saved-record-actions";
        if (record.audio) {
          const download = document.createElement("a");
          download.href = URL.createObjectURL(record.audio);
          localUrls.add(download.href);
          download.download = `golden-record-${record.language.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "greeting"}.webm`;
          download.textContent = "Download";
          actions.append(download);
          if (communityApi) {
            const publish = document.createElement("button");
            publish.type = "button";
            publish.textContent = "Submit for publishing";
            publish.addEventListener("click", () => publishRecord(record, publish));
            actions.append(publish);
          }
        }
        if (classroom.available) {
          const sendToClass = document.createElement("button");
          sendToClass.type = "button";
          sendToClass.textContent = "Send to class";
          sendToClass.addEventListener("click", async () => {
            sendToClass.disabled = true;
            try {
              await classroom.submit(record);
              sendToClass.textContent = "Sent for teacher review";
            } catch (error) {
              setStatus(error.message);
              sendToClass.disabled = false;
            }
          });
          actions.append(sendToClass);
        }
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Delete private copy";
        const itemLabel = record.audio ? "recording" : "greeting";
        const cancelDelete = document.createElement('button');
        cancelDelete.type = 'button';
        cancelDelete.textContent = 'Keep private copy';
        cancelDelete.hidden = true;
        let confirming = false;
        cancelDelete.onclick = () => {
          confirming = false;
          cancelDelete.hidden = true;
          remove.textContent = 'Delete private copy';
          setStatus('Private copy kept on this device.');
          remove.focus();
        };
        remove.addEventListener("click", async () => {
          if (!confirming) {
            confirming = true;
            remove.textContent = 'Confirm delete';
            cancelDelete.hidden = false;
            setStatus(`Delete this private ${itemLabel} from this device?`);
            return;
          }
          remove.disabled = true;
          try {
            await deleteLocalRecord(record.id);
            await drawLocalRecords();
            setStatus(`Private ${itemLabel} deleted from this device.`);
            const heading = find('#personal-record-heading');
            heading.tabIndex = -1;
            heading.focus();
          } catch {
            remove.disabled = false;
            setStatus('Could not delete the private copy. Please try again.');
          }
        });
        actions.append(remove, cancelDelete);
        article.append(actions);
        localList.append(article);
        if (record.id === focusRecordId) {
          const disclosure = heading.closest("details");
          if (disclosure) disclosure.open = true;
          heading.focus();
        }
      });
    } catch {
      localList.innerHTML = '<p class="empty-greetings">Private storage is unavailable in this browser.</p>';
    }
  }

  async function saveCurrentRecording() {
    if (!currentBlob) return saveWrittenGreeting();
    if (!currentBlob || !validateMetadata()) return;
    const record = {
      id: crypto.randomUUID(),
      ...metadata(),
      createdAt: new Date().toISOString(),
      mimeType: currentBlob.type,
      audio: currentBlob,
    };
    const moveToSavedGreeting = document.activeElement === saveButton;
    try {
      await saveLocalRecord(record);
      currentBlob = null;
      updateSaveAvailability();
      await drawLocalRecords({ focusRecordId: moveToSavedGreeting ? record.id : undefined });
      setStatus("Recorded greeting saved privately on this device. It stays in this browser unless you download or publish it.");
      onSave(record);
    } catch {
      setStatus("This browser could not save the recording. Download it instead and keep the file safe.");
    }
  }

  async function saveWrittenGreeting() {
    const details = metadata();
    if (!details.language) {
      find("#personal-language").setAttribute("aria-invalid", "true");
      find("#personal-language").focus();
      setStatus("Add the language of your greeting first.");
      return;
    }
    if (!details.message) {
      find("#personal-message").setAttribute("aria-invalid", "true");
      find("#personal-message").focus();
      setStatus("Write your greeting before saving it.");
      return;
    }
    const moveToSavedGreeting = document.activeElement === saveButton;
    saveButton.disabled = true;
    const record = {
      id: crypto.randomUUID(),
      ...details,
      kind: "text",
      createdAt: new Date().toISOString(),
    };
    try {
      await saveLocalRecord(record);
      await drawLocalRecords({ focusRecordId: moveToSavedGreeting ? record.id : undefined });
      setStatus("Written greeting saved privately on this device. It counts toward your stamp.");
    } catch {
      setStatus("Your greeting counts toward the stamp, but this browser could not save a private copy. Copy your words before leaving.");
    }
    onSave(record);
    lastSavedTextKey = `${details.language}\n${details.message}\n${details.translation}`;
    updateSaveAvailability();
  }

  async function publishRecord(record, button) {
    if (!communityApi) return;
    if (!find("#publish-consent").checked) {
      find("#publish-consent").focus();
      setStatus("Confirm the sharing statement before submitting a recording.", find("#community-status"));
      return;
    }
    if (record.audio.size > MAX_UPLOAD_BYTES) {
      setStatus("This recording is too large to publish. Keep it under 8 MB.", find("#community-status"));
      return;
    }
    button.disabled = true;
    button.textContent = "Submitting…";
    try {
      const response = await fetch(`${communityApi}/recordings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: record.id,
          name: record.name,
          language: record.language,
          country: record.country,
          message: record.message,
          translation: record.translation,
          mimeType: record.mimeType || record.audio.type,
          audioBase64: await blobToBase64(record.audio),
          consent: true,
        }),
      });
      if (!response.ok) throw new Error("Upload failed");
      setStatus("Submitted for moderation. It will appear here after approval.", find("#community-status"));
      button.textContent = "Submitted for review";
    } catch {
      button.disabled = false;
      button.textContent = "Try publishing again";
      setStatus("The community archive could not receive this recording. Your private copy is still safe.", find("#community-status"));
    }
  }

  async function loadCommunityRecords() {
    if (!communityApi) return;
    const refresh = find("#refresh-community-records");
    refresh.disabled = true;
    setStatus("Loading community voices…", find("#community-status"));
    try {
      const response = await fetch(`${communityApi}/recordings`);
      if (!response.ok) throw new Error("Archive unavailable");
      const payload = await response.json();
      const records = Array.isArray(payload.recordings) ? payload.recordings : [];
      communityList.replaceChildren();
      find("#community-record-count").textContent = `${records.length} PUBLISHED`;
      setStatus(records.length
        ? "Published community greetings. Each submission passed moderation."
        : "No community greetings have been published yet.", find("#community-status"));
      records.forEach((record) => {
        const audioUrl = safeAudioUrl(record.audioUrl);
        if (!audioUrl && !record.message) return;
        const article = document.createElement("article");
        article.className = "community-record-item";
        const heading = document.createElement("h5");
        heading.textContent = record.language || "Greeting from Earth";
        const byline = document.createElement("p");
        byline.className = "fine";
        byline.append(displayName(record.name));
        if (record.country) byline.append(" · ", countryLabel(record.country));
        const communityAudio = document.createElement("audio");
        communityAudio.controls = true;
        communityAudio.preload = "none";
        communityAudio.src = audioUrl;
        communityAudio.setAttribute("aria-label", `${heading.textContent} community greeting`);
        communityAudio.addEventListener("playing", (event) => {
          setStatus(`Playing ${heading.textContent} community greeting.`);
          onPlay(event);
        });
        communityAudio.addEventListener("pause", onPause);
        communityAudio.addEventListener("ended", onPause);
        article.append(heading, byline);
        if (record.country) {
          const origin = document.createElement("p");
          origin.className = "greeting-origin";
          origin.textContent = `◉ Earth · ${record.country}`;
          article.append(origin);
        }
        const journey = document.createElement("p");
        journey.className = "greeting-journey";
        journey.dataset.journeyStart = record.createdAt || record.publishedAt;
        article.append(journey);
        if (record.message) {
          const message = document.createElement("blockquote");
          message.textContent = record.message;
          article.append(message);
        }
        if (record.translation) {
          const translation = document.createElement("p");
          translation.className = "greeting-translation-note";
          translation.append(document.createTextNode("English: "), visitorWords(record.translation));
          article.append(translation);
        }
        if (audioUrl) article.append(communityAudio);
        communityList.append(article);
      });
      updateJourneys();
    } catch {
      setStatus("The community archive is temporarily unavailable. Private recordings still work.", find("#community-status"));
    } finally {
      refresh.disabled = false;
    }
  }

  function updateJourneys() {
    container.querySelectorAll("[data-journey-start]").forEach((item) => {
      item.textContent = `Imagined journey since saving · ${formatJourney(item.dataset.journeyStart)}`;
    });
  }

  startButton.addEventListener("click", startRecording);
  stopButton.addEventListener("click", stopRecording);
  saveButton.addEventListener("click", saveCurrentRecording);
  find("#personal-language").addEventListener("input", updateSaveAvailability);
  find("#personal-message").addEventListener("input", updateSaveAvailability);
  find("#personal-translation").addEventListener("input", updateSaveAvailability);
  preview.addEventListener("playing", (event) => {
    setStatus(`Playing your ${metadata().language || "recorded"} greeting preview.`);
    onPlay(event);
  });
  preview.addEventListener("pause", onPause);
  preview.addEventListener("ended", onPause);
  find("#refresh-community-records")?.addEventListener("click", loadCommunityRecords);
  drawLocalRecords();
  let journeyTimer = window.setInterval(updateJourneys, reducedMotion ? 30000 : 1000);
  if (communityApi) loadCommunityRecords();

  return {
    setReduced(value) {
      reducedMotion = value;
      clearInterval(journeyTimer);
      journeyTimer = window.setInterval(updateJourneys, reducedMotion ? 30000 : 1000);
      classroom.setReduced(value);
    },
    pause() {
      preview.pause();
      container.querySelectorAll("audio").forEach((item) => item.pause());
    },
    dispose() {
      disposed = true;
      if (recorder?.state === "recording") recorder.stop();
      stopTimer();
      clearInterval(journeyTimer);
      classroom.dispose();
      stopStream();
      preview.pause();
      clearPreviewUrl();
      localUrls.forEach((url) => URL.revokeObjectURL(url));
      localUrls.clear();
    },
  };
}
