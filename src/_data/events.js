import eleventyFetch from "@11ty/eleventy-fetch";

// Served by the UC-ingest admin Worker (see UC-ingest/admin), backed by D1 —
// reflects admin edits/disables made at improvlore.com/admin, not just the
// raw ingest output. Falls back to the GitHub Release if the Worker is ever
// unreachable, so a build never fails outright over this.
const PRIMARY = "https://improvlore.com/api/improvlore.json";
const FALLBACK =
  "https://github.com/heresmohit/UC-ingest/releases/download/events-latest/improvlore.json";

const MARATHON_EVENT = {
  title: "All Play No Work: 12-Hour Improv Marathon",
  author: "improvlore",
  excerpt:
    "Twelve hours straight of unscripted theatre: 7 shows and 2 community jams from 2:00 PM to 2:00 AM at Underline Center. Grab an all-access or 4-show pass, drop in for single sessions, or stay the whole day.",
  full_content:
    "We're giving improv a full day to itself again. Twelve hours straight of unscripted theatre: 7 original shows, 2 community jams, and late-night madness. Drop in for an hour, hang around after dinner, or stay from 2:00 in the afternoon until 2:00 in the morning at Underline Center. Zero scripts, all play.",
  image_url: "/assets/apnw-c.png",
  event_starts_at: "2026-10-02T08:30:00.000Z", // 2:00 PM IST (UTC+5:30)
  event_ends_at: "2026-10-02T20:30:00.000Z",   // 2:00 AM IST next day
  venue: "Underline Center, Indiranagar",
  url: "/marathon/",
  permalink: "/marathon/",
  slug: "all-play-no-work-marathon",
  buttonLabel: "View Schedule & Passes",
  typeBadge: "12-Hour Marathon",
  timeDisplay: "02:00 pm – 02:00 am",
  allTypes: true,
  tags: ["UC", "show", "jam", "marathon"],
};

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


export default async function () {
  const list = await getRawEvents();

  // Sub-events belonging to the All Play No Work marathon (Oct 2)
  const isMarathonSubEvent = (ev = {}) => {
    if (ev.slug === "all-play-no-work-marathon") return false;
    const title = (ev.title || "").toLowerCase();
    const slug = (ev.slug || "").toLowerCase();
    return title.includes("all play no work") || slug.includes("all-play-no-work");
  };

  // Collapse all individual marathon events into one single clean card on the upcoming calendar
  const collapsed = (list || []).filter((ev) => !isMarathonSubEvent(ev));

  const hasMainMarathon = collapsed.some(
    (ev) =>
      ev.slug === "all-play-no-work-marathon" ||
      (ev.title || "").toLowerCase() === "all play no work: 12-hour improv marathon"
  );

  if (!hasMainMarathon) {
    collapsed.push(MARATHON_EVENT);
  }

  return collapsed.sort(
    (a, b) => new Date(a.event_starts_at) - new Date(b.event_starts_at)
  );
}
