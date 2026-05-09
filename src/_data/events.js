import eleventyFetch from "@11ty/eleventy-fetch";

export default async function () {
  try {
    return await eleventyFetch(
      "https://github.com/heresmohit/UC-ingest/releases/latest/download/events.json",
      { duration: "1h", type: "json" }
    );
  } catch {
    return [];
  }
}
