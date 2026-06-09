// Static catalog of recurring Improvlore formats.
// Each entry owns the DURABLE content (name, blurb, what-to-expect, slug,
// short link). The live feed (events.js) supplies the DYNAMIC bits per
// occurrence: next date, ticket url, price, image. They're joined at build
// time in catalog.js via `feedMatch`.
//
// `feedMatch`: lowercase substring tested against the feed event title.
// `type`: show | jam | workshop (drives colour + default copy).
// `badges`: optional list of free-text keyword pills, overlaid on the poster
//    on every card (library + about + home) and shown on the event page. Add
//    any string you like, including the cadence ("Every alternate Wednesday",
//    "Available on demand", "International format", "Beginner friendly"); each
//    renders as a pill, tinted by type, in the order listed. Put the cadence
//    first if you want it to lead. This is the ONE place badges come from.
//    Leave it off for none.

const formats = [
  {
    slug: "whimsy",
    short: "whimsy",
    title: "Whimsical Wednesday",
    type: "jam",
    feedMatch: "whimsical wednesday",
    image: "/assets/posters/whimsy.jpg",
    badges: ["off-stage", "No experience needed"],
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
    badges: ["Every alternate Wednesday","Beginner friendly"],
    blurb:
      "The next step, on-stage. Short scenes in a supportive room, designed to help you take the leap into performing.",
    expect:
      "An open-stage jam for when you're ready to play in front of people. Short scenes, gentle coaching, and a room that's rooting for you. No experience needed, just a willingness to try.",
  },
  {
    slug: "make-an-improv-song",
    short: "song",
    title: "Make an Improv Song: Musical Improv Jam",
    type: "jam",
    // "musical improv" alone would collide with the musical-improv workshop
    // (matchFormat returns the first hit), so match on the distinctive title.
    feedMatch: "make an improv song",
    image: "/assets/posters/make-an-improv-song.jpg",
    badges: ["marathon exclusive"],
    blurb:
      "Ease into singing, rhythm, and making things up with a bit of melody. Even if you think you can't sing, especially then.",
    expect:
      "We walk through the basics of finding a beat, building simple rhymes, and shaping a chorus you can come back to. Less about hitting the right note, more about jumping in and letting the music carry you. No stage, no audience, just play.",
  },
  {
    slug: "the-silliest-show-tonight",
    short: "silliest",
    title: "The Silliest Show Tonight",
    type: "show",
    feedMatch: "silliest show",
    image: "/assets/posters/the-silliest-show-tonight.jpg",
    badges: ["Every Friday","Best first step"],
    blurb:
      "A classic good ol' improv show packed with riddles, tongue twisters, and some nostalgia.",
    expect:
      "A live improv show built entirely from your suggestions. Riddles, tongue twisters, and plenty of mischief, made in the moment, in front of you.",
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
      "Part improv show, part tabletop adventure. The audience shapes the quest and our players bring it to life on the spot.",
  },
  {
    slug: "powerpoint-roulette",
    short: "ppt",
    title: "PowerPoint Roulette",
    type: "show",
    feedMatch: "powerpoint roulette",
    image: "/assets/posters/powerpoint-roulette.jpg",
    badges: ["Corporate Favourite"],
    blurb:
      "Presentations from slides nobody has seen before. Business pitches, eulogies, TED talks, and conspiracy theories, all made up on the spot.",
    expect:
      "Our players present slide decks they have never laid eyes on, building the argument in real time as the next slide lands. Expect business pitches, eulogies, TED talks, and conspiracy theories, none of it rehearsed, all of it committed to.",
  },
  {
    slug: "maestro-impro",
    short: "maestro",
    title: "Maestro Impro",
    type: "show",
    feedMatch: "maestro",
    image: "/assets/posters/maestro.jpg",
    badges: ["Licensed format"],
    blurb:
      "Twelve improvisers, scenes and games from the crowd, and a vote after every round until one is crowned the Maestro for the month.",
    expect:
      "A dozen improvisers take the stage and the audience keeps voting players out, round by round, until one is left standing as the Maestro. Scenes and games come straight from the crowd, so the night is yours to shape.",
  },
  {
    slug: "the-great-face-off",
    short: "faceoff",
    title: "The Great Face-Off",
    type: "show",
    feedMatch: "great face-off",
    image: "/assets/posters/great-face-off.jpg",
    badges: ["Licensed format"],
    blurb:
      "Bold choices, quick comebacks, friendly face-offs. Come cheer, gasp, and lean in through an evening of high-energy improv.",
    expect:
      "Two sides, bold choices, and quick comebacks, with you deciding who takes it. A high-energy evening built to be cheered through, gasped at, and leaned into.",
  },
  // Festival formats: the two we take on the road, drawing on traditional
  // Indian storytelling. feedMatch is the slug so it won't collide with the
  // live feed until scheduled. Copy distilled from the troupe's own writing on
  // each format (Reincarnations directed by Balasree Viswanathan).
  {
    slug: "reincarnations",
    short: "reincarnations",
    title: "Reincarnations",
    type: "show",
    feedMatch: "reincarnations",
    image: "/assets/posters/reincarnations.jpg",
    badges: ["International format"],
    blurb:
      "One ordinary problem becomes a doorway to every story ever told. Objects speak, time bends, and a corpse asks the questions.",
    fullText: [
      "Reincarnations plays with one idea: matter is never made or destroyed, it just keeps changing form. So every story is still around, and we can reach any of them from anywhere.",
      "We borrow the shape from the Betal Pachisi, an old collection from the Kathasaritsagara, the eleventh-century Ocean of Stories. A king is told to carry a talking corpse across a graveyard, and the corpse keeps stopping to tell him tales and test what he has learned.",
      "On stage it starts small. The audience names something they hate doing but have to do, like calling their parents or filing taxes. We paint the room where that life happens, an object in it comes alive to talk, and from there any player can pick up a thing in the space and follow it somewhere else: the factory that made it, the painter who made the painting, fifty years back, two hundred feet down. A prashna, an inquiry, snaps us home, and the answer earns a blessing or a curse that pushes the story on.",
      "It is a forgiving format with almost nothing you can do wrong. The hope is that you follow the weird and find some joy and connection on the way.",
    ].join("\n"),
    expect:
      "An audience suggestion becomes the spine of the night. We paint a room, let an object in it start talking, and chase side stories across time and place before an inquiry pulls us back. Built live from one small everyday problem.",
  },
  {
    slug: "panchatantra",
    short: "panchatantra",
    title: "Panchatantra",
    type: "show",
    feedMatch: "panchatantra",
    image: "/assets/posters/panchatantra.jpg",
    badges: ["International format"],
    blurb:
      "The animal kingdom holds court. Crows, jackals, and lions trade fables, and every one of them has a lesson with teeth.",
    fullText: [
      "Panchatantra is Reincarnations' sibling, told through the animal kingdom. It takes its name and its spirit from the old Indian fable cycle, where a crow, a tortoise, a jackal, or a lion can be the one who teaches you something.",
      "The same idea runs underneath: everything has a story, and any creature, river, or tree can be a teacher if you let it. One tale nests inside the next, an animal pauses to ask the moral, and the answer carries the show forward.",
      "On stage we start with a creature and a problem, then let the players follow whatever is in the scene into the next fable: down a burrow, up a tree, back to how the river got its bend. Nobody blinks when the animals speak. That is just how this world works.",
      "Like its sibling it is forgiving and made to be played in. Come for talking animals and stay for the tail-end lesson you did not see coming.",
    ].join("\n"),
    expect:
      "A fable cycle built live, set loose in the animal kingdom. A creature and a problem open the night, then one tale nests into the next until a moral lands. Talking animals, and side stories within side stories.",
  },
  {
    slug: "the-turing-twist",
    short: "turing",
    title: "The Turing Twist",
    type: "show",
    feedMatch: "turing twist",
    badges: ["Our Take on AI","BLR HUBBA 2026"],
    image: "/assets/posters/turing-twist.jpg",
    blurb:
      "A live Turing test on stage. AI and human improvisers on a level field, and the audience has no idea who is who.",
    expect:
      "A live Turing test played for the stage. Human and AI improvisers work the same prompts on a level field, and the room tries to tell which is which. The reveal is half the fun.",
  },
  {
    slug: "improv-101",
    short: "101",
    title: "Improv 101: How Not to Panic on Stage",
    type: "workshop",
    feedMatch: "improv 101",
    image: "/assets/posters/improv-101.jpg",
    badges: ["Beginner friendly", "Multi-day course"],
    // This workshop runs as a multi-day course. The live feed only carries a
    // single date, so the full schedule is kept here and rendered on the event
    // page (see catalog.njk -> event-detail.njk `sessions`). Keep in sync with
    // the UC listing until the ingest emits sessions itself. Source:
    // underline.center/t/.../809
    sessions: {
      note: "Four sessions, 10am to 1pm on all four days.",
      dates: ["Sat 20 June", "Sun 21 June", "Sat 27 June", "Sun 28 June"],
    },
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
    // Multi-day workshop plus a showcase; the feed only carries one date, so
    // the full schedule lives here. Keep in sync with the UC listing until the
    // ingest emits sessions. Source: underline.center/t/.../810
    sessions: {
      note: "Three workshop sessions, plus a showcase on World Music Day.",
      dates: ["Sat 13 June", "Sun 14 June", "Sat 20 June"],
      extra: "Showcase: Sun 21 June, 7pm to 9pm. Test your musical improv skills on World Music Day.",
    },
    blurb:
      "Think you're not musical enough for musical improv? This one's for you. Listening, storytelling, and play.",
    expect:
      "Musical improv isn't about a perfect singing voice. It's about listening, storytelling, and pattern recognition. A hands-on introduction for the curious, no experience needed.",
  },
  {
    slug: "what-is-yes-and",
    short: "yesand",
    title: "What is Yes, And: An Introduction to Improv",
    type: "workshop",
    feedMatch: "what is yes",
    image: "/assets/posters/what-is-yes-and.jpg",
    badges:["Marathon exclusive"],
    blurb:
      "A gentle, structured two hours on how improv actually works. The best place to start if you've been curious but didn't know where to begin.",
    expect:
      "We break down the basics: how to approach spontaneity without overthinking it, how to listen well, how to share control, and how simple ideas grow into stories together. Less about performing, more about reacting in the moment. No pressure to be funny or quick.",
  },
  // Workshops we run on demand rather than on a fixed calendar. The "Available
  // on demand" pill is a plain badge you add/remove by hand, like any other.
  // When you schedule one through the feed (improvlore.json), it picks up the
  // date and becomes bookable; remove the badge here when that happens, and add
  // it back between runs. `feedMatch` is the substring tested against feed
  // titles, so it must match the title you publish for that workshop.
  // Posters self-hosted from Underline Center (see memory: reference-uc-scraping).
  {
    slug: "intensive-course",
    short: "intensive",
    title: "Intensive Course in Improvised Theatre",
    type: "workshop",
    feedMatch: "intensive course in improvised",
    image: "/assets/posters/intensive-course.jpg",
    badges: ["Available on demand", "Two weekends"],
    // Source: underline.center/t/intensive-course-in-improvised-theatre-by-improv-lore/166
    blurb:
      "Our deepest dive. Twelve hours over two weekends to make the stage your friend and handle the moments your mind goes blank, capped with a graduation show for friends and family.",
    fullText: [
      "If you've ever watched Whose Line Is It Anyway? and wondered how the cast pull off that quick-witted play, this course is for you. Our Intensive Course in Improvised Theatre brings out your creative spirit, makes the stage your friend, and gives you the tools for the times your mind goes blank. It's twelve hours of fun and play over two weekends.",
      "It ends with a graduation show, just for your friends and family, never open to the public. A supportive room for taking to the stage for the first time.",
      "We run it on demand. When there's a group ready, we open the next one. Get in touch to put your name down or gather a few friends.",
    ].join("\n"),
    expect:
      "Twelve hours over four mornings, building from no performing experience to loving the stage. Basic stagecraft, trusting your ideas, playing well with others, and the short-form games that make it click. The deeper, more theoretical and hands-on end of what we teach.",
  },
  {
    slug: "improv-essentials",
    short: "essentials",
    title: "Improv Essentials: A Crash Course",
    type: "workshop",
    feedMatch: "improv essentials",
    image: "/assets/posters/improv-essentials.jpg",
    badges: ["Available on demand", "One weekend"],
    // Source: underline.center/t/improv-essentials-a-crash-course-by-improv-lore/494
    blurb:
      "The short way in. Six hours over a weekend that take you from no performing experience to loving the stage, for anyone who keeps missing the longer intensive.",
    fullText: [
      "Want to improvise but keep missing our Level 1 intensive? Learn the basics in our crash course. Six hours over a weekend take you from no performing experience to loving the stage.",
      "We cover the essentials: basic stagecraft, trusting your ideas, playing well with others, short-form improv games, and a first taste of longform. You also get access to select cast-only jams and a discount on the next intensive.",
      "We run it on demand. When there's a group ready, we open the next one. Get in touch to put your name down or gather a few friends.",
    ].join("\n"),
    expect:
      "Six hours over a weekend, the quick path from never having performed to enjoying the stage. Stagecraft, trusting your instincts, playing with others, short-form games, and a taste of longform, plus cast-only jam access and a discount on the next intensive.",
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
