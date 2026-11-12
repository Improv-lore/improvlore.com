import eleventyFetch from "@11ty/eleventy-fetch";
import { matchFormat } from "./formats.js";

// Served by the UC-ingest admin Worker (see UC-ingest/admin), backed by D1 —
// reflects admin edits/disables made at improvlore.com/admin.
// Falls back to the GitHub Release if the Worker is ever unreachable.
const PRIMARY = "https://improvlore.com/api/improvlore.json";
const FALLBACK =
  "https://github.com/heresmohit/UC-ingest/releases/download/events-latest/improvlore.json";

async function getRawEvents() {
  let list = [];
  try {
    list = await eleventyFetch(PRIMARY, { duration: "0s", type: "json" });
  } catch {
    try {
      list = await eleventyFetch(FALLBACK, { duration: "5m", type: "json" });
    } catch {
      list = [];
    }
  }
  return list;
}

async function getEvents() {
  const list = await getRawEvents();

  // Deduplicate by title & starts_at or format & starts_at
  const seen = new Map();
  for (const ev of list || []) {
    const fmt = matchFormat(ev.title || "");
    const key = fmt ? `${fmt.slug}@${ev.event_starts_at}` : `${ev.title}@${ev.event_starts_at}`;
    if (!seen.has(key)) {
      seen.set(key, { ...ev });
    } else {
      const existing = seen.get(key);
      if ((!existing.url || existing.url === "tba") && (ev.url && ev.url !== "tba")) {
        existing.url = ev.url;
      }
      if (!existing.full_content && ev.full_content) {
        existing.full_content = ev.full_content;
      }
    }
  }

  const result = Array.from(seen.values()).map((ev) => {
    let ticketUrl = ev.url || null;
    if (ticketUrl && ticketUrl.includes("thumpn.com")) {
      ticketUrl = null;
    }

    return {
      ...ev,
      url: ticketUrl,
      thumpnUrl: null,
      districtUrl: null,
    };
  });

  return result.sort(
    (a, b) => new Date(a.event_starts_at) - new Date(b.event_starts_at)
  );
}

getEvents.getRawEvents = getRawEvents;

export default getEvents;
