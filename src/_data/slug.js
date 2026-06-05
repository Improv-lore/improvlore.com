// Shared pure helpers used by both filters.js (templates) and the
// *.11tydata.js computed-data files. Keep slug + excerpt logic in one
// place so anchors, pages, redirects, and meta tags can never drift.

export function shortText(text, n = 140) {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  const sentenceMatch = cleaned.match(/^.*?[.!?](?=\s|$)/);
  const firstSentence = sentenceMatch ? sentenceMatch[0] : cleaned;
  return firstSentence.length > n ? firstSentence.slice(0, n).trim() + "…" : firstSentence;
}

// Card-length preview: the first paragraph (or the whole text if single
// paragraph), trimmed to a word boundary near n chars. Unlike shortText,
// this keeps multiple sentences so cards can show more than one line.
export function cardText(text, n = 260) {
  if (!text) return "";
  const firstPara = text.split("\n").map((s) => s.trim()).find(Boolean) || "";
  if (firstPara.length <= n) return firstPara;
  const cut = firstPara.slice(0, n);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export function eventSlug(ev = {}) {
  const base = (ev.title || "untitled")
    .toLowerCase()
    .split("|")[0]                                 // drop "| Workshop ..." suffix
    .replace(/\b(by|with)\s+improv\s?lore\b/g, "") // drop troupe name
    .replace(/[:–-]+/g, " ")                       // separators to spaces
    .replace(/\s*\b(open\s+stage\s+)?(workshop|jam)\b\s*$/g, "") // trailing type words
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
  return base || "event";
}
