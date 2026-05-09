import eleventyFetch from "@11ty/eleventy-fetch";

export default async function () {
  const url = "https://underline.center/c/calendar/5.json";

  const data = await eleventyFetch(url, {
    duration: "1h",
    type: "json"
  });

  return data;
}
