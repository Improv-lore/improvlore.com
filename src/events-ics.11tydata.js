import { matchFormat } from "./_data/formats.js";
import { eventSlug, shortText } from "./_data/slug.js";
import { eventsIcs } from "./_data/ics.js";

// Builds /events.ics: a single calendar holding every upcoming event shown on
// the events page, for the "Add all to calendar" button. We mirror the events
// page's filter here (UC-tagged or showCustom, future-dated) so the file always
// matches what's on screen. Slug resolves to the canonical page the same way
// the per-event templates do (catalog format slug if matched, else eventSlug),
// so each VEVENT's URL/UID points at the real /event/<slug>/ page.

export default {
  permalink: "/events.ics",
  eleventyExcludeFromCollections: true,
  eleventyComputed: {
    icsBody(data) {
      const now = Date.now();
      const upcoming = (data.events || [])
        .filter((ev) => (ev.tags || []).includes("UC"))
        .filter((ev) => {
          const t = new Date(ev.event_starts_at).getTime();
          return !isNaN(t) && t >= now;
        })
        .map((ev) => {
          const fmt = matchFormat(ev.title || "");
          return {
            title: ev.title,
            description: shortText(ev.excerpt || ev.full_content, 300),
            startsAt: ev.event_starts_at,
            endsAt: ev.event_ends_at,
            venue: ev.venue,
            url: ev.url,
            slug: (fmt && fmt.slug) || eventSlug(ev),
          };
        });
      return eventsIcs(upcoming) || "";
    },
  },
};
