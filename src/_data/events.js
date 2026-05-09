import rawCalendar from "./rawCalendar.js";
import { transformCalendar } from "../../scripts/transformCalendar.js";
import { readFile } from "fs/promises";

export default async function () {
  const transformed = await transformCalendar(await rawCalendar());

  let customData = [];
  try {
    const raw = await readFile("./custom.json", "utf8");
    const parsed = JSON.parse(raw);
    const now = new Date();
    customData = parsed.filter(ev => !ev.event_starts_at || new Date(ev.event_starts_at.replace(/ +/, "T")) > now);
  } catch {
    // custom.json missing or malformed — skip silently
  }

  const parseDate = s => new Date((s || "").replace(/ +/, "T"));
  return [...transformed, ...customData].sort(
    (a, b) => parseDate(a.event_starts_at) - parseDate(b.event_starts_at)
  );
}
