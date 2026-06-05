import { eventIcs } from "./_data/ics.js";

// Emits one /event/<slug>/event.ics per catalog format that has an upcoming
// dated occurrence. The pagination `before` callback drops undated formats so
// no empty/false-permalink pages are produced. Path matches catalog.njk so its
// "Add to calendar" button resolves.

export default {
  pagination: {
    data: "catalog",
    size: 1,
    alias: "fmt",
    before: (arr) => arr.filter((fmt) => fmt.hasUpcoming),
  },
  eleventyComputed: {
    icsBody(data) {
      const fmt = data.fmt;
      if (!fmt) return "";
      return (
        eventIcs({
          title: fmt.title,
          description: fmt.blurb,
          startsAt: fmt.startsAt,
          endsAt: fmt.endsAt,
          venue: fmt.venue,
          url: fmt.ticketUrl,
          slug: fmt.slug,
        }) || ""
      );
    },
  },
};
