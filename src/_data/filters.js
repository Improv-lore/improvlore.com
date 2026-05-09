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

  shortText(text, n = 140) {
    if (!text) return "";
    const cleaned = text.replace(/\s+/g, " ").trim();
    return cleaned.length > n ? cleaned.slice(0, n).trim() + "…" : cleaned;
  },

  eventType(title = "") {
    const t = title.toLowerCase();
    if (t.includes("jam")) return "jam";
    if (t.includes("workshop")) return "workshop";
    return "show";
  }
};
