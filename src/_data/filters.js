import { matchFormat } from "./formats.js";
import { eventSlug, shortText, cardText } from "./slug.js";

const IST = { timeZone: "Asia/Kolkata" };

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
  // formats.js (the source of truth). Genuine one-offs with no format get
  // none. Lets the upcoming-event cards show the same pills as the library.
  eventBadges(title = "") {
    const fmt = matchFormat(title);
    return (fmt && fmt.badges) || [];
  },

  // Next upcoming event of any type, so the hero's featured card always has
  // something to show as long as anything is scheduled.
  nextEvent(events = [], showCustom = false) {
    const now = Date.now();
    return events
      .filter(ev => {
        if (!ev.event_starts_at) return false;
        const t = new Date(ev.event_starts_at).getTime();
        if (isNaN(t) || t < now) return false;
        const tags = ev.tags || [];
        return showCustom || tags.includes("UC");
      })
      .sort((a, b) => new Date(a.event_starts_at) - new Date(b.event_starts_at))[0] || null;
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
  // home page to show a curated few shows and defer to the Library for the full
  // set. Done here in JS because this Nunjucks build's `selectattr`/`slice`
  // filters don't actually filter, and an in-loop counter won't persist.
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
