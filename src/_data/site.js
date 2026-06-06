// Site-wide constants. `url` is the canonical production origin and is the
// single source of truth for sitemap, RSS, canonical tags, and absolute
// OG image URLs. No trailing slash.
const url = "https://improvlore.com";

export default {
  url,
  name: "Improvlore",
  year: new Date().getFullYear(),

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
