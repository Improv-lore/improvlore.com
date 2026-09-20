import { eventJsonLd } from "./_data/jsonld.js";

// Computed metadata for /marathon/
// Provides rich OpenGraph, Twitter Large Image Card, search keywords,
// and schema.org Event JSON-LD for Google Event search indexing.
export default {
  eleventyComputed: {
    title: "All Play No Work – 12-Hour Improv Marathon Bangalore | Improvlore",
    pageDescription: "12 hours of non-stop unscripted comedy, musical improv, storytelling & community jams at Underline Center, Indiranagar, Bangalore. 2nd Oct 2026, 2:00 PM – 2:00 AM. 7 shows, 2 jams, 4-show passes.",
    pageKeywords: "improv Bangalore, improv marathon Bangalore, All Play No Work, Underline Center Indiranagar, comedy shows Bangalore, things to do in Bangalore, theatre festival Bangalore, unscripted comedy Bangalore, Improvlore",
    pageImage: "/assets/apnw-og.png",
    pageImageAlt: "All Play No Work – 12-Hour Improv Marathon on 2nd October at Underline Center, Indiranagar, Bangalore",
    pageImageWidth: 1200,
    pageImageHeight: 630,
    ogType: "event",
    twitterCard: "summary_large_image",
    jsonLd: () => {
      return eventJsonLd({
        name: "All Play No Work: 12-Hour Improv Marathon",
        description: "12 hours straight of unscripted theatre, comedy, musical improv & community jams at Underline Center, Indiranagar, Bangalore. 7 shows, 2 community jams, from 2:00 PM to 2:00 AM.",
        image: "/assets/apnw-og.png",
        startsAt: "2026-10-02T14:00:00+05:30",
        endsAt: "2026-10-03T02:00:00+05:30",
        url: "/marathon/",
        ticketUrl: "https://improvlore.com/marathon/#passes",
        venue: "Underline Center, Indiranagar, Bangalore",
      });
    },
  },
};
