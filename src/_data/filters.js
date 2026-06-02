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

  eventSlug(ev = {}) {
    const title = (ev.title || "untitled")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
    const t = ev.event_starts_at ? new Date(ev.event_starts_at).getTime() : 0;
    return `ev-${title}-${t}`;
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
        const title = (ev.title || "").toLowerCase();
        const isWorkshop = tags.includes("workshop") || title.includes("workshop");
        return !isWorkshop;
      })
      .sort((a, b) => new Date(a.event_starts_at) - new Date(b.event_starts_at))
      .slice(0, 7);
  },

  shortText(text, n = 140) {
    if (!text) return "";
    const cleaned = text.replace(/\s+/g, " ").trim();
    const sentenceMatch = cleaned.match(/^.*?[.!?](?=\s|$)/);
    const firstSentence = sentenceMatch ? sentenceMatch[0] : cleaned;
    return firstSentence.length > n ? firstSentence.slice(0, n).trim() + "…" : firstSentence;
  },

  eventType(title = "", tags = []) {
    if (tags.includes("jam")) return "jam";
    if (tags.includes("show")) return "show";
    const t = title.toLowerCase();
    if (t.includes("jam")) return "jam";
    if (t.includes("workshop")) return "workshop";
    return "show";
  }
};
