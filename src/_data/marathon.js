// All Play No Work: our 12-hour improv marathon (the Improvathon). Single source
// of truth for the marathon recap shown on /festivals/ and referenced on /about/.
//
// This was our FIRST marathon and is a PAST event (it ran 1 May 2026), so the
// lineup reads as a recap of what ran, not a bookable schedule: no ticket links,
// just the running order. We mean to do it again but no date is set, so copy
// must not promise a "next edition" on a schedule. The fuller story (and word on
// when we run the next one) lives at marathon.improvlore.com.
//
// Exposed to templates as `marathon` (this default export): `marathon.meta` for
// the day's details, `marathon.lineup` for the running order.
//
// `time` is the start time as it ran; titles are trimmed of the "by Improv Lore"
// tail since the whole day was ours. Keep the lineup chronological.

const meta = {
  name: "All Play No Work",
  tagline: "A 12-hour improv marathon",
  date: "1 May 2026",
  year: 2026,
  venue: "Underline Center, Indiranagar",
  url: "https://marathon.improvlore.com",
  first: true,
  intro:
    "Our first marathon, and really just an excuse to spend a day stepping away from everything that feels like work, and leaning into something more playful. Twelve hours of shows and jams back to back, so you could sit and watch the sharpest performers in the shed, or get your hands dirty and try improv yourself. No one had to perform if they didn't want to.",
};

// The running order, as it ran. type tints the card; slug links to the format's
// /event/ page (every lineup item is a catalog format in formats.js, so the
// carousel's posters and the format pages never drift). poster is the self-
// hosted image, kept here so the recap renders without re-joining the catalog.
const lineup = [
  {
    // TheatreSports is the same format we run as The Great Face-Off, so the slug
    // points at that one format page (no duplicate catalog entry).
    title: "TheatreSports™",
    slug: "the-great-face-off",
    type: "show",
    time: "12:00 pm",
    poster: "/assets/posters/great-face-off.jpg",
    blurb: "Four teams battle it out through fast, unpredictable challenges. Judges, rules, and controlled chaos to set the tone for the day.",
  },
  {
    title: "Make Friends with the Stage",
    slug: "make-friends-with-the-stage",
    type: "jam",
    time: "2:00 pm",
    poster: "/assets/posters/make-friends-with-the-stage.jpg",
    blurb: "Step in and play. Simple scenes, gentle guidance, jump in for a scene or two and step back whenever you like.",
  },
  {
    title: "Yes, And Dragons",
    slug: "yes-and-dragons",
    type: "show",
    time: "3:30 pm",
    poster: "/assets/posters/yes-and-dragons.jpg",
    blurb: "Long-form improv meets chaotic fantasy. The audience builds the world, a giant D20 decides the fate, and the heroes try to survive your curveballs.",
  },
  {
    title: "Whimsical Wednesday: Friday Edition",
    slug: "whimsy",
    type: "jam",
    time: "5:30 pm",
    poster: "/assets/posters/whimsy.jpg",
    blurb: "Our whimsical jam, off the calendar for the day. Collaborative theatre games in pairs and groups. No stage, no audience, just play.",
  },
  {
    title: "What is Yes, And",
    slug: "what-is-yes-and",
    type: "workshop",
    time: "6:00 pm",
    poster: "/assets/posters/what-is-yes-and.jpg",
    blurb: "A gentle, structured two hours on how improv works. Listening, sharing control, and letting simple ideas grow into stories together.",
  },
  {
    title: "Make an Improv Song",
    slug: "make-an-improv-song",
    type: "jam",
    time: "7:00 pm",
    poster: "/assets/posters/make-an-improv-song.jpg",
    blurb: "Ease into singing, rhythm, and making things up with a bit of melody. Even if you think you can't sing. Especially then.",
  },
  {
    title: "PowerPoint Roulette",
    slug: "powerpoint-roulette",
    type: "show",
    time: "8:30 pm",
    poster: "/assets/posters/powerpoint-roulette.jpg",
    blurb: "Improvisers present slide decks they've never seen. Business pitches, eulogies, TED talks, and conspiracy theories, all on the spot.",
  },
  {
    title: "The Silliest Show Tonight",
    slug: "the-silliest-show-tonight",
    type: "show",
    time: "9:30 pm",
    poster: "/assets/posters/the-silliest-show-tonight.jpg",
    blurb: "A classic good ol' improv show to close the night, packed with riddles, tongue twisters, and some nostalgia.",
  },
];

export default { meta, lineup };
