// Optional automatic screening for shared greetings. Runs only when the site
// owner configures CLASSROOM_OPENAI_API_KEY; otherwise every check reports
// "not-configured" and nothing is sent to OpenAI.
const clean = (value, max) => typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";

export async function moderateText(text) {
  const apiKey = process.env.CLASSROOM_OPENAI_API_KEY;
  if (!apiKey) return "not-configured";
  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "omni-moderation-latest", input: text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return "unavailable";
    const result = await response.json();
    return result.results?.[0]?.flagged ? "flagged" : "clear";
  } catch { return "unavailable"; }
}

export async function transcribeAudio(bytes, mimeType) {
  const apiKey = process.env.CLASSROOM_OPENAI_API_KEY;
  if (!apiKey) return "";
  try {
    const form = new FormData();
    form.set("model", "gpt-4o-mini-transcribe");
    form.set("file", new File([bytes], `greeting.${mimeType.includes("mp4") ? "m4a" : mimeType.includes("ogg") ? "ogg" : "webm"}`, { type: mimeType }));
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: form,
      signal: AbortSignal.timeout(15000),
    });
    return response.ok ? clean((await response.json()).text, 1000) : "";
  } catch { return ""; }
}
