// Announcement ticker that runs below the navbar. Toggle and content live here
// so a non-coder can flip it on/off and edit copy without touching markup.
//
// HOW TO USE
//   - enabled: set to false to hide the banner everywhere. That's the on/off.
//   - lead: short label shown once at the very start (e.g. "What's on").
//   - items: the ordered ticker content. Each item is one of:
//       { type: "events" }
//           Expands, in place, to every upcoming UC show/jam/workshop pulled
//           live from the feed. Each becomes a link to its detail page with its
//           date. Put this wherever you want the auto list to appear.
//       { type: "message", text: "...", href: "/somewhere/" }
//           A custom message. `href` is optional; with it the whole message is
//           a link (internal path or full URL), without it it's plain text.
//           Drop these between events to add "selling fast", "we're touring",
//           etc. exactly where the example asked.
//
// The template (banner.njk) reads this, builds the strip, and marquees it.
// Nothing here needs to know about animation or layout.

export default {
  enabled: true,

  lead: "What's on",

  items: [
    { type: "events" },
    {
      type: "message",
      text: "Workshops available on request, get in touch",
      href: "/contact/",
    },
  ],
};
