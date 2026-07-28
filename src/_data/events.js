import eleventyFetch from "@11ty/eleventy-fetch";

// Served by the UC-ingest admin Worker (see UC-ingest/admin), backed by D1 —
// reflects admin edits/disables made at improvlore.com/admin, not just the
// raw ingest output. Falls back to the GitHub Release if the Worker is ever
// unreachable, so a build never fails outright over this.
const PRIMARY = "https://improvlore.com/api/improvlore.json";
const FALLBACK =
  "https://github.com/heresmohit/UC-ingest/releases/download/events-latest/improvlore.json";

export default async function () {
  try {
    return await eleventyFetch(PRIMARY, { duration: "5m", type: "json" });
  } catch {
    try {
      return await eleventyFetch(FALLBACK, { duration: "5m", type: "json" });
    } catch {
      return [];
    }
  }
}
