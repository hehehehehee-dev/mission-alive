import { emptyDsnSnapshot, fetchDsnNow } from "../../server/dsn-now.mjs";

export default async (request) => {
  if (request.method !== "GET")
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "GET" } });
  try {
    const result = await fetchDsnNow();
    return Response.json(result, {
      headers: { "Cache-Control": "public, max-age=20, s-maxage=60", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return Response.json(emptyDsnSnapshot(), {
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  }
};

export const config = { path: "/api/dsn-now" };
