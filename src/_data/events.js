import eleventyFetch from "@11ty/eleventy-fetch";

export default async function () {
  try {
    return await eleventyFetch(
      "https://github.com/heresmohit/UC-ingest/releases/download/events-latest/improvlore.json",
      { duration: "5m", type: "json" }
    );
  } catch {
    return [];
  }
}
