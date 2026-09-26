// Joins the static format catalog (formats.js) to the live feed (events.js).
// Each resolved entry = durable catalog content + its NEXT upcoming
// occurrence (date, ticket url, price, image) if one exists in the feed.
//
// Output is consumed by catalog.njk to generate one evergreen page per
// format at /event/<slug>/, scheduled or not.

import formats, { normalize } from "./formats.js";
import getEvents from "./events.js";
import marathon from "./marathon.js";

export default async function () {
  const rawEvents = await getEvents.getRawEvents();
  const now = Date.now();

  return formats.map((fmt) => {
    const matches = Array.isArray(fmt.feedMatch)
      ? fmt.feedMatch.map(normalize)
      : [normalize(fmt.feedMatch)];

    // Next upcoming feed occurrence whose title contains this format's match
    // string. (Per-format here, so matchFormat — which finds *any* format —
    // isn't the right fit; we want occurrences of one specific format.)
    const next =
      rawEvents
        .filter((ev) => {
          if (!ev.event_starts_at) return false;
          const t = new Date(ev.event_starts_at).getTime();
          if (isNaN(t) || t < now) return false;
          const title = normalize(ev.title || "");
          return matches.some((m) => title.includes(m));
        })
        .sort((a, b) => new Date(a.event_starts_at) - new Date(b.event_starts_at))[0] || null;

    const hasUpcoming = !!next;

    const isMarathon =
      next &&
      ((next.title || "").toLowerCase().includes("all play no work") ||
        (next.slug || "").toLowerCase().includes("all-play-no-work"));

    let ticketUrl = next ? next.url : null;
    if (hasUpcoming) {
      if (isMarathon || !ticketUrl || ticketUrl === "tba") {
        if (isMarathon) {
          ticketUrl = marathon.getTicketUrl(fmt.slug);
        } else if (ticketUrl === "tba") {
          ticketUrl = null;
        }
      }
    }

    return {
      ...fmt,
      // Dynamic overlay from the feed (null when nothing is scheduled).
      next,
      hasUpcoming,
      startsAt: next ? next.event_starts_at : null,
      endsAt: next ? next.event_ends_at : null,
      ticketUrl,
      venue: next ? next.venue : null,
      price: next && next.price && next.price !== "undefined" ? next.price : null,
      // Prefer the stored local poster (durable, self-hosted). Fall back to
      // the feed image only if a format has no stored poster yet.
      image: fmt.image || (next && next.image_url) || null,
    };
  });
}
