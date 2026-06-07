// Site-wide constants. `url` is the canonical production origin and is the
// single source of truth for sitemap, RSS, canonical tags, and absolute
// OG image URLs. No trailing slash.
const url = "https://improvlore.com";

// Cloudflare Turnstile site key (public, safe to ship to the browser). This is
// the front-end half of the bot check; the secret half is TURNSTILE_SECRET_KEY,
// set as a Pages environment variable and used only by functions/submit.js.
// Override at build time with TURNSTILE_SITE_KEY if you'd rather not commit it.
const turnstileSiteKey =
  process.env.TURNSTILE_SITE_KEY || "0x4AAAAAADgTJL7y4P6HHM46";

export default {
  url,
  name: "Improvlore",
  year: new Date().getFullYear(),
  turnstileSiteKey,

  // Resolve a path or possibly-relative URL to an absolute URL on this origin.
  // Pass-through for anything already absolute (feed images are hotlinked from
  // underline.center). Used for og:image, sitemap, and RSS so crawlers and
  // social cards never see a root-relative path.
  absUrl(pathOrUrl = "") {
    if (!pathOrUrl) return url;
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    return url + (pathOrUrl.startsWith("/") ? "" : "/") + pathOrUrl;
  },
};
