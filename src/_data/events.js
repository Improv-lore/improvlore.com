import eleventyFetch from "@11ty/eleventy-fetch";

export default async function () {
  try {
    return await eleventyFetch(
      "https://github.com/heresmohit/UC-ingest/releases/download/improvlore-latest/events.json",
      { duration: "5m", type: "json" }
    );
  } catch {
    return [];
  }
}
