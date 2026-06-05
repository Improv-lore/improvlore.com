import { eventJsonLd } from "./_data/jsonld.js";

// Computed meta for catalog.njk. Set as plain strings (not Nunjucks
// templated values) so the base layout's meta tags escape them exactly
// once. Templating these in front matter double-escapes apostrophes.

export default {
  eleventyComputed: {
    title: (data) => (data.fmt ? `${data.fmt.title} – Improvlore` : data.title),
    pageDescription: (data) => (data.fmt ? data.fmt.blurb : data.pageDescription),
    pageImage: (data) => (data.fmt ? data.fmt.image : data.pageImage),
    // Event JSON-LD only when this format has an upcoming dated occurrence;
    // schema.org Event needs a startDate, so undated evergreen pages skip it.
    jsonLd: (data) => {
      const fmt = data.fmt;
      if (!fmt || !fmt.hasUpcoming) return data.jsonLd;
      return eventJsonLd({
        name: fmt.title,
        description: fmt.blurb,
        image: fmt.image,
        startsAt: fmt.startsAt,
        endsAt: fmt.endsAt,
        url: `/event/${fmt.slug}/`,
        ticketUrl: fmt.ticketUrl,
        venue: fmt.venue,
      });
    },
  },
};
