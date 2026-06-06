// Builds an iCalendar (.ics) VEVENT string for one event, so each event page
// can offer an "Add to calendar" download that works with Google Calendar,
// Apple Calendar, Outlook, etc. Static-site friendly: the file is generated
// at build time, no client JS needed.

const SITE_URL = "https://improvlore.com";

// iCal datetime in UTC: 20260610T143000Z. Returns "" for unparseable input.
const toICSDate = (value) => {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d)) return "";
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
};

// Escape per RFC 5545: backslash, comma, semicolon, and newlines.
const esc = (text = "") =>
  String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

// Fold lines to <=75 octets as the spec recommends; long descriptions
// otherwise break strict parsers. Continuation lines start with a space.
const fold = (line) => {
  if (line.length <= 73) return line;
  const out = [];
  let rest = line;
  out.push(rest.slice(0, 73));
  rest = rest.slice(73);
  while (rest.length > 72) {
    out.push(" " + rest.slice(0, 72));
    rest = rest.slice(72);
  }
  if (rest.length) out.push(" " + rest);
  return out.join("\r\n");
};

export function eventIcs({ title, description, startsAt, endsAt, venue, url, slug }) {
  const dtStart = toICSDate(startsAt);
  if (!title || !dtStart) return null; // no point without a title + start time

  // Default to a 2-hour block when the feed has no end time.
  let dtEnd = toICSDate(endsAt);
  if (!dtEnd) {
    const end = new Date(new Date(startsAt).getTime() + 2 * 60 * 60 * 1000);
    dtEnd = toICSDate(end);
  }

  const uid = `${slug || toICSDate(startsAt)}@improvlore.com`;
  const pageUrl = `${SITE_URL}/event/${slug || ""}/`;
  const desc = [description, "", `Details: ${pageUrl}`].filter((l) => l !== undefined).join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Improvlore//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(desc)}`,
    venue ? `LOCATION:${esc(venue)}` : null,
    `URL:${esc(url || pageUrl)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  // CRLF line endings per RFC 5545; fold each property line.
  return lines.map(fold).join("\r\n") + "\r\n";
}
