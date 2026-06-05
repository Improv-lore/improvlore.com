import { dateToRfc3339 } from "@11ty/eleventy-plugin-rss";

export default function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
    // Just the date filter the hand-rolled sitemap/feed templates need. The
    // full feedPlugin generates its own virtual feed template from a named
    // collection; our feed is built from the live `events` global instead.
    // Coerce strings (the feed's ISO `event_starts_at`) to Date first; the
    // plugin filter calls .toISOString() and only accepts Date objects.
    eleventyConfig.addFilter("dateToRfc3339", (d) => dateToRfc3339(d instanceof Date ? d : new Date(d)));
    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "layouts"
        }
    };
}
