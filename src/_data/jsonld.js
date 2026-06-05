// Builds schema.org Event JSON-LD for an event/catalog page. Google reads
// this for rich event results (date, venue, ticket link shown in search).
// Returned as a JSON string so the layout can inline it via `jsonLd` exactly
// like the other computed meta strings (title, pageImage).
//
// Pass already-resolved values so this stays the single shape both the
// one-off (event.11tydata.js) and catalog (catalog.11tydata.js) paths feed.

const SITE_URL = "https://improvlore.com";

const abs = (u) => {
  if (!u) return undefined;
  return /^https?:\/\//i.test(u) ? u : SITE_URL + (u.startsWith("/") ? "" : "/") + u;
};

export function eventJsonLd({ name, description, image, startsAt, endsAt, url, ticketUrl, venue }) {
  if (!name) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    organizer: {
      "@type": "Organization",
      name: "Improvlore",
      url: SITE_URL + "/",
    },
  };

  if (description) data.description = description;
  if (image) data.image = abs(image);
  if (startsAt) data.startDate = startsAt;
  if (endsAt) data.endDate = endsAt;
  if (url) data.url = abs(url);

  // schema.org requires a location for an Event; use the venue name, or fall
  // back to the city so the markup is still valid when venue is missing.
  data.location = venue
    ? {
        "@type": "Place",
        name: venue,
        address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
      }
    : {
        "@type": "Place",
        name: "Bangalore",
        address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
      };

  if (ticketUrl) {
    data.offers = {
      "@type": "Offer",
      url: ticketUrl,
      availability: "https://schema.org/InStock",
    };
  }

  return JSON.stringify(data);
}
