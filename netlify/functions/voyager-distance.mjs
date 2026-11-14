import { fetchVoyagerDistance } from "../../server/voyager-horizons.mjs";

export default async (request) => {
  if (request.method !== "GET")
    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers: { Allow: "GET" } },
    );
  try {
    const payload = await fetchVoyagerDistance();
    return Response.json(payload, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Voyager distance function failed", error);
    return Response.json(
      { error: "Voyager distance is temporarily unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
};

export const config = {
  path: "/api/voyager-distance",
};
