import { matchFormat } from "./_data/formats.js";
import { eventSlug, shortText } from "./_data/slug.js";
import { eventJsonLd } from "./_data/jsonld.js";

// Computed data for event.njk's paginated feed pages (one-off events only).
// - permalink: false for events covered by a catalog format (rendered by
//   catalog.njk instead), avoiding two templates writing the same path.
// - meta set here as plain strings so base.njk escapes them once; templating
//   them in front matter double-escapes apostrophes.

// Prefer the self-hosted format poster (survives the event leaving the feed);
// fall back to the hotlinked feed image for genuine one-offs. Mirrors
// filters.eventImage so the page <img> and the OG meta image never disagree.
const eventImage = (ev) => {
  const fmt = matchFormat((ev && ev.title) || "");
  if (fmt && fmt.image) return fmt.image;
  return (ev && ev.image_url) || "";
};

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
    jsonLd: (data) => {
      const ev = data.ev;
      if (!ev) return data.jsonLd;
      return eventJsonLd({
        name: ev.title,
        description: shortText(ev.excerpt || ev.full_content, 300),
        image: eventImage(ev),
        startsAt: ev.event_starts_at,
        endsAt: ev.event_ends_at,
        url: `/event/${eventSlug(ev)}/`,
        ticketUrl: ev.url,
        venue: ev.venue,
      });
    },
  },
};
