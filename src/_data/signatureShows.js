// The marquee show formats we're known for. Posters were scraped from
// Underline Center (see memory: reference-uc-scraping); blurbs are tightened
// from the troupe's own UC event descriptions. Shared by the landing page
// poster grid and the /about/ page so the two never drift.
//
// These are the older/signature formats that don't live in formats.js (which
// only holds the currently-scheduled recurring formats with /event/ pages).

export default [
  {
    title: "The Silliest Show Tonight",
    image: "/assets/posters/the-silliest-show-tonight.jpg",
    url: "/event/the-silliest-show-tonight/",
    blurb:
      "A classic good ol' improv show packed with riddles, tongue twisters, and plenty of mischief. Built from your suggestions, gone by morning.",
  },
  {
    title: "PowerPoint Roulette",
    image: "/assets/posters/powerpoint-roulette.jpg",
    url: "/event/powerpoint-roulette/",
    blurb:
      "Presentations from slides nobody has seen before. Business pitches, eulogies, TED talks, and conspiracy theories, all made up on the spot.",
  },
  {
    title: "Yes, And Dragons",
    image: "/assets/posters/yes-and-dragons.jpg",
    url: "/event/yes-and-dragons/",
    blurb:
      "Dungeons and Dragons meets improv. A one-night campaign, rolled and made up as we go.",
  },
  {
    title: "The Turing Twist",
    image: "/assets/posters/turing-twist.jpg",
    url: "/event/the-turing-twist/",
    blurb:
      "A live Turing test on stage. AI and human improvisers on a level field, and the audience has no idea who is who.",
  },
  // TODO: High Calibre Show — add as a format in formats.js (with poster) and
  // point url at its /event/<slug>/ page when available.
  // Festival formats drawing on traditional Indian storytelling. Blurbs mirror
  // formats.js; images are festival photos rather than designed posters. The
  // `festival` flag drives the international-format badge on the poster cards.
  {
    title: "Reincarnations",
    image: "/assets/posters/reincarnations.jpg",
    url: "/event/reincarnations/",
    festival: true,
    blurb:
      "One ordinary problem becomes a doorway to every story ever told. Objects speak, time bends, and a corpse asks the questions.",
  },
  {
    title: "Panchatantra",
    image: "/assets/posters/panchatantra.jpg",
    url: "/event/panchatantra/",
    festival: true,
    blurb:
      "The animal kingdom holds court. Crows, jackals, and lions trade fables, and every one of them has a lesson with teeth.",
  },
  // Maestro and the Great Face-Off round out the list.
  {
    title: "Maestro Impro",
    image: "/assets/posters/maestro.jpg",
    url: "/event/maestro-impro/",
    blurb:
      "Twelve improvisers, scenes and games from the crowd, and a vote after every round until one is crowned the Maestro for the month.",
  },
  {
    title: "The Great Face-Off",
    image: "/assets/posters/great-face-off.jpg",
    url: "/event/the-great-face-off/",
    blurb:
      "Bold choices, quick comebacks, friendly face-offs. Come cheer, gasp, and lean in through an evening of high-energy improv.",
  },
];
