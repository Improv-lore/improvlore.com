import { dateToRfc3339 } from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy({"src/assets": "assets"});

    // Posters ship as 1600x900-ish JPGs but render in ~360px cards, so we resize
    // them at build time and serve modern WebP with a JPEG fallback. This runs as
    // an HTML transform (not a shortcode) so it rewrites every local <img> after
    // render, including ones produced inside Nunjucks macros, which async
    // shortcodes can't reach. Remote feed image_url <img>s (absolute http URLs)
    // are left untouched: they're hotlinked from underline.center and die when a
    // listing ages out, so there's nothing durable to optimise.
    // Per-image `sizes`/`loading`/`fetchpriority` come from the <img> attributes.
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        extensions: "html",
        formats: ["webp", "jpeg"],
        widths: [400, 800, 1200],
        // Only touch our own posters; leaves logo/icon/motif PNGs and remote
        // feed images alone.
        urlPath: "/assets/img/",
        outputDir: "_site/assets/img/",
        sharpJpegOptions: { quality: 78, mozjpeg: true },
        sharpWebpOptions: { quality: 72 },
        defaultAttributes: {
            loading: "lazy",
            decoding: "async",
        },
    });

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
