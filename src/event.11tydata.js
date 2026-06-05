import { matchFormat } from "./_data/formats.js";
import { eventSlug, shortText } from "./_data/slug.js";

// Computed data for event.njk's paginated feed pages (one-off events only).
// - permalink: false for events covered by a catalog format (rendered by
//   catalog.njk instead), avoiding two templates writing the same path.
// - meta set here as plain strings so base.njk escapes them once; templating
//   them in front matter double-escapes apostrophes.

const eventImage = (ev) =>
  (ev && (ev.thumbnails?.[0]?.url || ev.image_url)) || "";

export default {
  eleventyComputed: {
    permalink(data) {
      const ev = data.ev;
      if (!ev) return false;
      const covered = matchFormat(ev.title || "") !== null;
      return covered ? false : `/event/${eventSlug(ev)}/index.html`;
    },
    title: (data) => (data.ev ? `${data.ev.title} – Improvlore` : data.title),
    pageDescription: (data) =>
      data.ev ? shortText(data.ev.excerpt || data.ev.full_content, 200) : data.pageDescription,
    pageImage: (data) => (data.ev ? eventImage(data.ev) : data.pageImage),
  },
};
