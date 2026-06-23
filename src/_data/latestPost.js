import eleventyFetch from "@11ty/eleventy-fetch";

// Newest blog post, regenerated on every blog deploy. Fetched at build time so
// the homepage can surface it without a client-side request. Returns null on
// failure (or before the first blog deploy) so templates can opt out cleanly.
export default async function () {
  try {
    return await eleventyFetch(
      "https://blog.improvlore.com/api/latest.json",
      { duration: "5m", type: "json" }
    );
  } catch {
    return null;
  }
}
