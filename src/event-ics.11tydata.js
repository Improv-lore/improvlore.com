import { matchFormat } from "./_data/formats.js";
import { eventSlug, shortText } from "./_data/slug.js";
import { eventIcs } from "./_data/ics.js";

// Emits one /event/<slug>/event.ics per one-off feed event. The pagination
// `before` callback drops events with no start time (nothing to add) and those
// owned by a catalog format (catalog-ics.njk handles those), so no false /
// duplicate permalinks are produced. Path matches event.njk's permalink rules.

export default {
  pagination: {
    data: "events",
    size: 1,
    alias: "ev",
    before: (arr) =>
      arr.filter((ev) => ev.event_starts_at && matchFormat(ev.title || "") === null),
  },
  eleventyComputed: {
    icsBody(data) {
      const ev = data.ev;
      if (!ev) return "";
      return (
        eventIcs({
          title: ev.title,
          description: shortText(ev.excerpt || ev.full_content, 300),
          startsAt: ev.event_starts_at,
          endsAt: ev.event_ends_at,
          venue: ev.venue,
          url: ev.url,
          slug: eventSlug(ev),
        }) || ""
      );
    },
  },
};
