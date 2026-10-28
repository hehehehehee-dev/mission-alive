import { defineConfig } from "vite";
import { fetchDsnNow, emptyDsnSnapshot } from "./server/dsn-now.mjs";

// Keep NASA's undocumented feed server-side in local development and preview,
// using the same parser/cache as the deployed Netlify function.
function missionDataRelay() {
  const install = (server) => {
    server.middlewares.use(async (request, response, next) => {
      if (request.url?.split("?")[0] !== "/api/dsn-now") return next();
      if (request.method !== "GET") {
        response.writeHead(405, { Allow: "GET" });
        response.end();
        return;
      }
      let snapshot;
      try { snapshot = await fetchDsnNow(); }
      catch { snapshot = emptyDsnSnapshot(); }
      response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
      response.end(JSON.stringify(snapshot));
    });
  };
  return { name: "mission-data-relay", configureServer: install, configurePreviewServer: install };
}

export default defineConfig({ plugins: [missionDataRelay()] });
