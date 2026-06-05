import { matchFormat } from "./formats.js";
import { eventSlug, shortText, cardText } from "./slug.js";

const IST = { timeZone: "Asia/Kolkata" };

export default {
  // True if a feed event is covered by a recurring catalog format.
  // Such events get their page from catalog.njk, so event.njk skips them
  // to avoid two templates writing the same /event/<slug>/ path.
  isInCatalog(title = "") {
    return matchFormat(title) !== null;
  },

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
    if (ev.thumbnails && ev.thumbnails.length) return ev.thumbnails[0].url;
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

  spansBeyondThisWeek(events = []) {
    if (!events.length) return false;
    const now = new Date();
    const day = now.getDay();
    const daysUntilSunday = 7 - day;
    const endOfWeek = new Date(now);
    endOfWeek.setHours(23, 59, 59, 999);
    endOfWeek.setDate(now.getDate() + (day === 0 ? 0 : daysUntilSunday));
    return events.some(ev => {
      const t = new Date(ev.event_starts_at).getTime();
      return !isNaN(t) && t > endOfWeek.getTime();
    });
  },

  upcomingWeek(events = [], showCustom = false) {
    const now = Date.now();
    return events
      .filter(ev => {
        if (!ev.event_starts_at) return false;
        const t = new Date(ev.event_starts_at).getTime();
        if (isNaN(t) || t < now) return false;
        const tags = ev.tags || [];
        const isUC = showCustom || tags.includes("UC");
        if (!isUC) return false;
        return this.eventType(ev.title, tags) !== "workshop";
      })
      .sort((a, b) => new Date(a.event_starts_at) - new Date(b.event_starts_at))
      .slice(0, 7);
  },

  upcomingWorkshops(events = [], showCustom = false) {
    const now = Date.now();
    return events
      .filter(ev => {
        if (!ev.event_starts_at) return false;
        const t = new Date(ev.event_starts_at).getTime();
        if (isNaN(t) || t < now) return false;
        const tags = ev.tags || [];
        const isUC = showCustom || tags.includes("UC");
        if (!isUC) return false;
        return this.eventType(ev.title, tags) === "workshop";
      })
      .sort((a, b) => new Date(a.event_starts_at) - new Date(b.event_starts_at))
      .slice(0, 7);
  },

  upcomingJams(events = [], showCustom = false) {
    const now = Date.now();
    return events
      .filter(ev => {
        if (!ev.event_starts_at) return false;
        const t = new Date(ev.event_starts_at).getTime();
        if (isNaN(t) || t < now) return false;
        const tags = ev.tags || [];
        const isUC = showCustom || tags.includes("UC");
        if (!isUC) return false;
        return this.eventType(ev.title, tags) === "jam";
      })
      .sort((a, b) => new Date(a.event_starts_at) - new Date(b.event_starts_at))
      .slice(0, 7);
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

  workshopName(title = "") {
    return title
      .split("|")[0]
      .replace(/\bworkshop\b/i, "")
      .replace(/\bby improv ?lore\b/i, "")
      .replace(/[\s:–-]+$/, "")
      .trim() || title.trim();
  }
};
