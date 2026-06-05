// Static catalog of recurring Improvlore formats.
// Each entry owns the DURABLE content (name, blurb, what-to-expect, slug,
// short link). The live feed (events.js) supplies the DYNAMIC bits per
// occurrence: next date, ticket url, price, image. They're joined at build
// time in catalog.js via `feedMatch`.
//
// `feedMatch`: lowercase substring tested against the feed event title.
// `type`: show | jam | workshop (drives colour + default copy).

const formats = [
  {
    slug: "whimsy",
    short: "whimsy",
    title: "Whimsical Wednesday",
    type: "jam",
    feedMatch: "whimsical wednesday",
    image: "/assets/posters/whimsy.jpg",
    recurrence: "Every alternate Wednesday",
    blurb:
      "Dive into the whimsical world of improvisation at our Wednesday Jams. Whether you are new to theatre or a maverick on stage, this jam is designed for everyone.",
    fullText: [
      "Dive into the whimsical world of improvisation at our Wednesday Jams!",
      "Whether you’re a novice to theatre, a maverick on stage, or just dipping your toes into the world of unscripted performance, this Jam is designed for everyone. Our facilitators will guide you through a series of engaging improv exercises, help you explore new characters, and set up scenarios that will make your inner wit shine, all on the spot!",
      "Come as you are, leave your inhibitions at the door, and join us on this journey of endless possibility.",
      "Bring a friend, a date, or a group. Our brave space is for everyone!",
    ].join("\n"),
    expect:
      "Our facilitators guide you through engaging improv exercises, help you explore new characters, and set up scenarios that make your inner wit shine, all on the spot. Come as you are, leave your inhibitions at the door.",
  },
  {
    slug: "make-friends-with-the-stage",
    short: "stage",
    title: "Make Friends with the Stage",
    type: "jam",
    feedMatch: "make friends with the stage",
    image: "/assets/posters/make-friends-with-the-stage.jpg",
    recurrence: "Every alternate Wednesday",
    blurb:
      "The next step, on-stage. Short scenes in a supportive room, designed to help you take the leap into performing.",
    expect:
      "An open-stage jam for when you're ready to play in front of people. Short scenes, gentle coaching, and a room that's rooting for you. No experience needed, just a willingness to try.",
  },
  {
    slug: "the-silliest-show-tonight",
    short: "silliest",
    title: "The Silliest Show Tonight",
    type: "show",
    feedMatch: "silliest show",
    image: "/assets/posters/the-silliest-show-tonight.jpg",
    recurrence: "Every Friday",
    blurb:
      "A classic good ol' improv show packed with riddles, tongue twisters, and some nostalgia.",
    expect:
      "A live improv show built entirely from your suggestions. Riddles, tongue twisters, and a hearty laugh. Every night is a one-time-only piece of theatre, made in the moment, in front of you.",
  },
  {
    slug: "yes-and-dragons",
    title: "Yes, And Dragons",
    type: "show",
    feedMatch: "yes, and dragons",
    image: "/assets/posters/yes-and-dragons.jpg",
    blurb:
      "An improvised adventure where the audience steers the quest. Dungeons, dragons, and a lot of yes-and.",
    expect:
      "Part improv show, part tabletop adventure. The audience shapes the quest and our players bring it to life on the spot. No two journeys end the same way.",
  },
  {
    slug: "improv-101",
    short: "101",
    title: "Improv 101: How Not to Panic on Stage",
    type: "workshop",
    feedMatch: "improv 101",
    image: "/assets/posters/improv-101.jpg",
    blurb:
      "A hands-on intro workshop for first-timers. Learn the basics and shake off the stage fright.",
    expect:
      "The workshop for anyone who's curious but nervous. You'll work through guided exercises in a supportive room, at a pace that's friendly to first-timers, and leave a little braver than you came.",
  },
  {
    slug: "musical-improv",
    short: "musical",
    title: "Musical Improv: An Introduction",
    type: "workshop",
    feedMatch: "musical improv",
    image: "/assets/posters/musical-improv.jpg",
    blurb:
      "Think you're not musical enough for musical improv? This one's for you. Listening, storytelling, and play.",
    expect:
      "Musical improv isn't about a perfect singing voice. It's about listening, storytelling, and pattern recognition. A hands-on introduction for the curious, no experience needed.",
  },
];

export default formats;

// The single source of truth for "is this feed event covered by a recurring
// format?". Returns the matching format (so callers can use its canonical
// slug) or null. Used by catalog.js, filters.js, and event.11tydata.js so the
// matching rule can never drift between the join, the permalinks, and the
// page-skipping logic.
export function matchFormat(title = "") {
  const t = title.toLowerCase();
  return formats.find((f) => t.includes(f.feedMatch.toLowerCase())) || null;
}
