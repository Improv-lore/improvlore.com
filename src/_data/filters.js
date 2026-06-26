import { matchFormat } from "./formats.js";
import { eventSlug, shortText, cardText } from "./slug.js";
import social from "./social.js";

const IST = { timeZone: "Asia/Kolkata" };

// Badges for recurring feed-only shows that deliberately have no catalog entry
// (e.g. TheatreSports, which shares the Great Face-Off format page rather than
// duplicating it — see marathon.js). Keyed by a lowercase substring of the feed
// title. Catalog formats still own their own badges in formats.js; this only
// fills the gap for one-offs. Same pill strings as formats.js so they tint and
// read identically.
const ONE_OFF_BADGES = {
  theatresports: ["Licensed format"],
};

export default {
  formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d) ? "" : d.toLocaleDateString("en-IN", { ...IST, month: "short", day: "numeric" });
  },

  formatTime(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d) ? "" : d.toLocaleTimeString("en-IN", { ...IST, hour: "2-digit", minute: "2-digit" });
  },

  formatDay(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d) ? "" : d.toLocaleDateString("en-IN", { ...IST, weekday: "short" });
  },

  formatDayNum(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d) ? "" : d.toLocaleDateString("en-IN", { ...IST, day: "numeric" });
  },

  formatMonth(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d) ? "" : d.toLocaleDateString("en-IN", { ...IST, month: "short" });
  },

  formatDateFull(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d) ? "" : d.toLocaleDateString("en-IN", { ...IST, weekday: "long", month: "long", day: "numeric" });
  },

  formatTimeRange(startStr, endStr) {
    const start = this.formatTime(startStr);
    if (!start) return "";
    const end = this.formatTime(endStr);
    return end ? `${start} – ${end}` : start;
  },

  eventImage(ev = {}) {
    // Prefer the self-hosted format poster so the image survives the event
    // leaving the feed (feed images are hotlinked from underline.center and
    // die when the listing ages out). One-offs fall back to the feed image.
    const fmt = matchFormat(ev.title || "");
    if (fmt && fmt.image) return fmt.image;
    return ev.image_url || "";
  },

  // Google Maps URL for a venue, if we have one. Only Underline Center (our
  // home venue) is mapped; one-offs elsewhere get no link rather than a wrong
  // pin. URL lives in social.js. Matched loosely so "Underline Center,
  // Indiranagar" and any future phrasing of it still resolve.
  venueMapUrl(venue = "") {
    return /underline/i.test(venue) ? social.underlineMap : "";
  },

  // A /contact/ link that prefills the form for an enquiry about a specific
  // event/format. `reason` ("coming soon", "sold out", "on demand", ...) shapes
  // the message so the form opens on a started enquiry instead of blank. Kept
  // here so the static "Get in touch" button (event-detail) and the JS-injected
  // one (ticket-button.js) speak the same language. The contact page reads the
  // `topic`/`message` params; see contact.njk.
  contactUrl(title = "", reason = "") {
    const params = new URLSearchParams({ topic: "General Question" });
    if (title) {
      let ask;
      if (reason === "coming soon") ask = `tickets for "${title}"`;
      else if (reason === "sold out") ask = `when "${title}" runs again`;
      else if (reason === "on demand") ask = `running "${title}" for a group`;
      else ask = `"${title}"`;
      const suffix = reason ? ` (${reason})` : "";
      params.set("message", `Hi, I'd like to know about ${ask}${suffix}.`);
    }
    return "/contact/?" + params.toString();
  },

  // A /contact/ link that just preselects the "What's this about?" topic, for
  // generic CTAs (e.g. the for-teams "Enquire Now"). `topic` must match a form
  // option value exactly (see contact.njk) or the prefill is silently ignored.
  contactTopicUrl(topic = "") {
    if (!topic) return "/contact/";
    return "/contact/?" + new URLSearchParams({ topic }).toString();
  },

  eventSlug(ev = {}) {
    return eventSlug(ev);
  },

  eventPermalink(ev = {}) {
    // Catalog formats own the canonical /event/<catalog-slug>/ page, so a
    // feed event that matches one links there. One-offs use the derived slug.
    const fmt = matchFormat(ev.title || "");
    return `/event/${fmt ? fmt.slug : this.eventSlug(ev)}/`;
  },

  formatPermalink(fmt = {}) {
    return `/event/${fmt.slug}/`;
  },

  // Multi-day workshops carry their full schedule on the catalog format (the
  // feed only has one date). Returns the matching format's `sessions` object,
  // or null. Used to tag event cards with "+N more dates".
  eventSessions(title = "") {
    const fmt = matchFormat(title);
    return (fmt && fmt.sessions) || null;
  },

  // Keyword badges for a feed event, pulled from its matching format in
  // formats.js (the source of truth). Genuine one-offs with no format fall
  // back to ONE_OFF_BADGES below (keyed by a lowercase title substring), so a
  // recurring feed-only show can still carry a pill without a duplicate catalog
  // entry. Lets the upcoming-event cards show the same pills as the library.
  eventBadges(title = "") {
    const fmt = matchFormat(title);
    if (fmt && fmt.badges) return fmt.badges;
    const t = (title || "").toLowerCase();
    const hit = Object.keys(ONE_OFF_BADGES).find((k) => t.includes(k));
    return hit ? ONE_OFF_BADGES[hit] : [];
  },

  // The next N upcoming events of any type, soonest first, for the hero's
  // featured cards. Same filter as bucketedEvents (UC-or-showCustom, past and
  // undated dropped); the feed is pre-sorted but we sort again so the cap is
  // honest regardless of feed order. nextEvent is the n=1 case.
  nextEvents(events = [], showCustom = false, n = 2) {
    const now = Date.now();
    return events
      .filter(ev => {
        if (!ev.event_starts_at) return false;
        const t = new Date(ev.event_starts_at).getTime();
        if (isNaN(t) || t < now) return false;
        const tags = ev.tags || [];
        return showCustom || tags.includes("UC");
      })
      .sort((a, b) => new Date(a.event_starts_at) - new Date(b.event_starts_at))
      .slice(0, n);
  },

  // Single next upcoming event, or null. Thin wrapper over nextEvents for
  // callers that only want one (kept so existing call sites don't change).
  nextEvent(events = [], showCustom = false) {
    return this.nextEvents(events, showCustom, 1)[0] || null;
  },

  // Buckets an event into "this-week", "next-week", or "later" by its start
  // date, in IST, with weeks running Monday–Sunday. Anything already past (or
  // undated) falls into "later" so it never shows above genuinely upcoming
  // events. Used to split the cluttered single grid into time sections.
  weekBucket(dateStr) {
    if (!dateStr) return "later";
    const start = new Date(dateStr);
    if (isNaN(start)) return "later";

    // Day index in IST, Monday = 0 ... Sunday = 6.
    const istNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const istEvent = new Date(start.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    const dayOfWeek = (d) => (d.getDay() + 6) % 7;

    const startOfWeek = new Date(istNow);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek(istNow));

    const startOfNextWeek = new Date(startOfWeek);
    startOfNextWeek.setDate(startOfWeek.getDate() + 7);

    const startOfWeekAfter = new Date(startOfWeek);
    startOfWeekAfter.setDate(startOfWeek.getDate() + 14);

    if (istEvent < startOfNextWeek) return "this-week";
    if (istEvent < startOfWeekAfter) return "next-week";
    return "later";
  },

  // Single-pass grouping for the events page: filter to the shown set (UC, or
  // everything when showCustom), drop past/undated events, then bucket by
  // weekBucket. Returns the non-empty buckets in display order as
  // [{ key, label, events }]. Replaces events.njk's seven separate walks of
  // the array (one total + three counts + three renders). The t < now guard
  // here means past events are dropped outright, not mislabelled as "Coming up"
  // (weekBucket alone sends past dates to "later"); mirrors nextEvent/catalog.js.
  bucketedEvents(events = [], showCustom = false) {
    const now = Date.now();
    const order = [
      { key: "this-week", label: "This week" },
      { key: "next-week", label: "Next week" },
      { key: "later", label: "Coming up" },
    ];
    const groups = { "this-week": [], "next-week": [], later: [] };
    for (const ev of events) {
      const tags = ev.tags || [];
      if (!(showCustom || tags.includes("UC"))) continue;
      const t = new Date(ev.event_starts_at).getTime();
      if (isNaN(t) || t < now) continue;
      groups[this.weekBucket(ev.event_starts_at)].push(ev);
    }
    return order
      .map((b) => ({ ...b, events: groups[b.key] }))
      .filter((b) => b.events.length > 0);
  },

  shortText(text, n = 140) {
    return shortText(text, n);
  },

  cardText(text, n = 260) {
    return cardText(text, n);
  },

  eventType(title = "", tags = []) {
    if (tags.includes("jam")) return "jam";
    if (tags.includes("show")) return "show";
    const t = title.toLowerCase();
    if (t.includes("jam")) return "jam";
    if (t.includes("workshop")) return "workshop";
    return "show";
  },

  // The cadence badge for a format, if it carries one (e.g. "Every alternate
  // Wednesday", "Every Friday"). Lets a recurring night with no live feed match
  // yet show its cadence on the library card instead of "not on the calendar".
  // Matched by keyword so it never mistakes a non-cadence first badge (like
  // "Beginner friendly") for one. Returns the badge string or null.
  cadenceBadge(badges = []) {
    return (badges || []).find((b) => /\b(every|weekly|daily|alternate|wednesday|thursday|friday|saturday|sunday|monday|tuesday)\b/i.test(b)) || null;
  },

  // First N catalog entries of a given type, in catalog order. Used by the
  // home and About pages to show a curated few and defer to the Library for the
  // full set. Done here in JS because the obvious template forms misbehave in
  // this Nunjucks build: `selectattr("type","equalto",t)` runs but returns the
  // whole list unfiltered (silently, no error), and the Python-style `[:n]`
  // slice is a parse error. (`selectattr("attr")` truthiness filtering does
  // work -- see feed.njk -- it's the equality test that doesn't.)
  firstOfType(catalog = [], type = "", n = 3) {
    return catalog.filter((f) => f.type === type).slice(0, n);
  },

  workshopName(title = "") {
    return title
      .split("|")[0]
      .replace(/\bworkshop\b/i, "")
      .replace(/\bby improv ?lore\b/i, "")
      .replace(/[\s:–-]+$/, "")
      .trim() || title.trim();
  }
};
