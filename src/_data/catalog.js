// Joins the static format catalog (formats.js) to the live feed (events.js).
// Each resolved entry = durable catalog content + its NEXT upcoming
// occurrence (date, ticket url, price, image) if one exists in the feed.
//
// Output is consumed by catalog.njk to generate one evergreen page per
// format at /event/<slug>/, scheduled or not.

import formats from "./formats.js";
import getEvents from "./events.js";

export default async function () {
  const events = await getEvents();
  const now = Date.now();

  return formats.map((fmt) => {
    const match = fmt.feedMatch.toLowerCase();

    // Next upcoming feed occurrence whose title contains this format's match
    // string. (Per-format here, so matchFormat — which finds *any* format —
    // isn't the right fit; we want occurrences of one specific format.)
    const next = events
      .filter((ev) => {
        if (!ev.event_starts_at) return false;
        const t = new Date(ev.event_starts_at).getTime();
        if (isNaN(t) || t < now) return false;
        return (ev.title || "").toLowerCase().includes(match);
      })
      .sort((a, b) => new Date(a.event_starts_at) - new Date(b.event_starts_at))[0] || null;

    return {
      ...fmt,
      // Dynamic overlay from the feed (null when nothing is scheduled).
      next,
      hasUpcoming: !!next,
      startsAt: next ? next.event_starts_at : null,
      endsAt: next ? next.event_ends_at : null,
      ticketUrl: next ? next.url : null,
      venue: next ? next.venue : null,
      price: next ? next.price || null : null,
      // Prefer the stored local poster (durable, self-hosted). Fall back to
      // the feed image only if a format has no stored poster yet.
      image:
        fmt.image ||
        (next && (next.thumbnails?.[0]?.url || next.image_url)) ||
        null,
    };
  });
}
