import eleventyFetch from "@11ty/eleventy-fetch";
import { matchFormat } from "./formats.js";
import marathon from "./marathon.js";
import site from "./site.js";

// Served by the UC-ingest admin Worker (see UC-ingest/admin), backed by D1 —
// reflects admin edits/disables made at improvlore.com/admin, not just the
// raw ingest output. Falls back to the GitHub Release if the Worker is ever
// unreachable, so a build never fails outright over this.
const PRIMARY = "https://improvlore.com/api/improvlore.json";
const FALLBACK =
  "https://github.com/heresmohit/UC-ingest/releases/download/events-latest/improvlore.json";

async function getRawEvents() {
  let list = [];
  try {
    list = await eleventyFetch(PRIMARY, { duration: "5m", type: "json" });
  } catch {
    try {
      list = await eleventyFetch(FALLBACK, { duration: "5m", type: "json" });
    } catch {
      list = [];
    }
  }
  return list;
}

const isAllPlayNoWork = (ev = {}) => {
  const title = (ev.title || "").toLowerCase();
  const slug = (ev.slug || "").toLowerCase();
  const startsAt = ev.event_starts_at || "";
  return (
    title.includes("all play no work") ||
    slug.includes("all-play-no-work") ||
    startsAt.includes("2026-10-02")
  );
};

async function getEvents() {
  const list = await getRawEvents();

  // Extract all upstream District URLs for formats
  const upstreamDistrictUrls = new Map();
  for (const item of list || []) {
    if (item.url && item.url.includes("district.in")) {
      const fmt = matchFormat(item.title || "");
      if (fmt) {
        upstreamDistrictUrls.set(fmt.slug, item.url);
      }
    }
  }

  // Deduplicate: if two feed items on the same slot match the same format, prefer the one with a live ticket link
  const seen = new Map();
  for (const ev of list || []) {
    // Drop any synthetic or feed-level bundled marathon cards so only individual shows/jams appear
    if (
      ev.slug === "all-play-no-work-marathon" ||
      (ev.title || "").toLowerCase() === "all play no work: 12-hour improv marathon"
    ) {
      continue;
    }

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
    if (isAllPlayNoWork(ev)) {
      const tags = Array.isArray(ev.tags) ? [...ev.tags] : [];
      if (!tags.includes("ALL PLAY NO WORK")) {
        tags.push("ALL PLAY NO WORK");
      }
      const fmt = matchFormat(ev.title || "");
      const slug = fmt ? fmt.slug : ev.slug;
      const marathonSlot = slug ? marathon.getSlot(slug) : null;

      let districtUrl = upstreamDistrictUrls.get(slug) || (marathonSlot ? marathonSlot.districtUrl : null);
      if (!districtUrl && ev.url && ev.url.includes("district.in")) {
        districtUrl = ev.url;
      }

      // Keep in sync with marathonSlot
      if (marathonSlot && districtUrl) {
        marathonSlot.districtUrl = districtUrl;
      }

      // Never use Thumpn: prefer District URL; fallback to clean non-Thumpn URL or marathon schedule
      let ticketUrl = districtUrl || (ev.url && !ev.url.includes("thumpn.com") ? ev.url : null) || "/marathon/#schedule";

      return {
        ...ev,
        url: ticketUrl,
        thumpnUrl: null,
        districtUrl,
        tags,
        isMarathon: true,
      };
    }

    // Non-marathon events: sanitize any Thumpn URLs
    let ticketUrl = ev.url;
    if (ticketUrl && ticketUrl.includes("thumpn.com")) {
      ticketUrl = null;
    }

    return {
      ...ev,
      url: ticketUrl,
      thumpnUrl: null,
    };
  });

  return result.sort(
    (a, b) => new Date(a.event_starts_at) - new Date(b.event_starts_at)
  );
}

getEvents.getRawEvents = getRawEvents;

export default getEvents;
