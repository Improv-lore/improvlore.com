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

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadTicketsConfig() {
  try {
    const filePath = path.join(__dirname, "marathonTickets.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Could not load marathonTickets.json:", err.message);
  }
  return { passes: {}, events: {} };
}

function resolveUrl(entry) {
  if (!entry) return null;
  if (typeof entry === "string") return entry.trim() || null;
  if (typeof entry === "object" && entry.url) return String(entry.url).trim() || null;
  return null;
}

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

// The running order of the first edition, kept for the /festivals/ recap.
const lineup = [
  {
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

// Upcoming 12-Hour Improvathon: 2nd October 2026 (2:00 PM – 2:00 AM)
const upcoming = {
  name: "All Play No Work",
  edition: "Second Edition",
  tagline: "Twelve hours of live, unscripted theatre",
  date: "2 October 2026",
  dateFormatted: "Friday, 2nd October 2026",
  dateShort: "2nd Oct",
  timing: "2:00 PM – 2:00 AM",
  hours: "12 Hours of Play",
  venue: "Underline Center, Indiranagar, Bangalore",
  venueShort: "Underline Center, Indiranagar",
  venueMapsUrl: "https://maps.google.com/?q=Underline+Center+Indiranagar",
  rsvpUrl: "https://chat.whatsapp.com/CRv3J3K0xRG8iQnTBI4hMa",
  ticketUrl: "https://underline.center",
  intro:
    "Bangalore spends too much time staring at screens and rushing through deadlines. This Gandhi Jayanti, we're doing the opposite: twelve straight hours of unscripted comedy, storytelling, live music, and late-night madness in a cozy community space in Indiranagar. Seven shows, two community jams, and zero scripts. Pull up a chair, support your local theatre, and come play.",
  scheduleNote:
    "Doors open at 1:30 PM. Seven shows and two jams from 2:00 in the afternoon until 2:00 in the morning.",
  schedule: [
    {
      time: "02:00 PM",
      endTime: "03:15 PM",
      title: "PowerPoint Roulette",
      slug: "powerpoint-roulette",
      format: "Show",
      formatClass: "show",
      kicker: "The 2 PM Kickoff",
      poster: "/assets/posters/powerpoint-roulette.jpg",
      blurb: "Improvisers present pitch decks, TED talks, and conspiracy theories from slides they have never seen before. Panic on stage, pure joy in the room."
    },
    {
      time: "03:30 PM",
      endTime: "04:45 PM",
      title: "Maestro Impro™",
      slug: "maestro-impro",
      format: "Show",
      formatClass: "show",
      kicker: "Audience Elimination Game",
      poster: "/assets/posters/maestro.jpg",
      blurb: "Twelve actors walk in. You shout suggestions, score every scene, and eliminate players until only one survivor is crowned Maestro."
    },
    {
      time: "05:00 PM",
      endTime: "06:15 PM",
      title: "Yes, and Dragons",
      slug: "yes-and-dragons",
      format: "Show",
      formatClass: "show",
      kicker: "Tabletop Quest",
      poster: "/assets/posters/yes-and-dragons.jpg",
      blurb: "Dungeons & Dragons meets live storytelling. Giant dice, improvised dungeon masters, and heroes running headfirst into audience curveballs."
    },
    {
      time: "06:30 PM",
      endTime: "07:45 PM",
      title: "And, Then?",
      slug: "and-then",
      format: "Show",
      formatClass: "show",
      kicker: "Longform Stories",
      poster: "/assets/posters/and-then.jpg",
      blurb: "Rich, slow-burn characters and intertwined stories made up on the spot by our veteran ensemble. Heart, drama, and unexpected laughs."
    },
    {
      time: "08:00 PM",
      endTime: "09:00 PM",
      title: "The 8 PM Jams: Pick Your Circle",
      slug: "make-an-improv-song",
      format: "2 Jams · Pick 1",
      formatClass: "jam",
      kicker: "Community Jam Hour (8:00 PM – 9:00 PM)",
      poster: "/assets/posters/make-an-improv-song.jpg",
      secondaryPoster: "/assets/posters/make-friends-with-the-stage.jpg",
      isEitherOrJam: true,
      jams: [
        {
          label: "Option A · Sing & Rhyme",
          name: "Make an Improv Song",
          slug: "make-an-improv-song",
          poster: "/assets/posters/make-an-improv-song.jpg",
          desc: "Make up songs with live piano, silly hooks, and zero pressure. Can't sing? Even better."
        },
        {
          label: "Option B · Stage Games",
          name: "Make Friends with the Stage",
          slug: "make-friends-with-the-stage",
          poster: "/assets/posters/make-friends-with-the-stage.jpg",
          desc: "Warm up, step onto the floorboards, and play easy theatre games with friendly strangers."
        }
      ],
      blurb: "Two friendly jams happening at the same time in separate rooms. Pick the room that sounds fun, or grab a chair and cheer from the sidelines."
    },
    {
      time: "09:30 PM",
      endTime: "10:45 PM",
      title: "The Musical Improv Show",
      slug: "musical-improv-show",
      format: "Show",
      formatClass: "show",
      kicker: "Prime Time Musical",
      poster: "/assets/posters/musical-improv-show.jpg",
      blurb: "A brand new Broadway-style musical, built live with a pianist from whatever prompt you shout out. Catchy melodies, zero scripts."
    },
    {
      time: "11:00 PM",
      endTime: "12:15 AM",
      title: "TheatreSports™",
      slug: "the-great-face-off",
      format: "Show",
      formatClass: "show",
      kicker: "Late Night Comedy Clash",
      poster: "/assets/posters/great-face-off.jpg",
      blurb: "Two teams battle it out in lightning-fast comedy rounds. Referee whistles, penalty fouls, and you scoring the winners."
    },
    {
      time: "12:30 AM",
      endTime: "02:00 AM",
      dateLabel: "Sat 3 Oct",
      title: "The Silliest Show Tonight: After Dark",
      slug: "the-silliest-show-tonight",
      format: "Late Night Finale",
      formatClass: "latenight",
      kicker: "The 2 AM Grand Finale",
      poster: "/assets/posters/the-silliest-show-tonight.jpg",
      blurb: "What happens to improvisors after ten hours of adrenaline. Callbacks to the whole day, absurd characters, and not our regular family friendly show."
    }
  ],
  stats: [
    { value: "12", label: "Hours of Play", sub: "2:00 PM to 2:00 AM" },
    { value: "7", label: "Original Shows", sub: "Comedy, stories & music" },
    { value: "2", label: "Community Jams", sub: "Singing or stage games at 8 PM" }
  ],
  passes: [
    {
      name: "4-Show Pass",
      tag: "Best for Most People",
      desc: "Pick any 4 shows across the day that match your schedule. Catch an afternoon block, step out to 12th Main for food, and head back for prime-time and late-night sets.",
      perks: [
        "Entry to any 4 shows of your choice",
        "Come and go freely between your chosen sets",
        "Better value than single session tickets",
        "Directly supports Underline Center & independent local theatre"
      ]
    },
    {
      name: "Single Session Tickets",
      tag: "Drop-In",
      desc: "Got an hour or two? Pick any individual show or jam slot. Perfect if you're dropping in after work or heading over for the midnight set.",
      perks: [
        "Entry for your chosen single show or jam slot",
        "Subject to room capacity at the door",
        "Great for first-timers curious about improv"
      ]
    }
  ],
  faqs: [
    {
      q: "Do I have to perform or talk?",
      a: "No! Most people come purely to sit back, drink coffee or chai, and laugh. If you do want to play, the 8 PM community jams are warm, friendly, and completely low-stakes."
    },
    {
      q: "Can I leave and come back later?",
      a: "Yes, that's why we made it 12 hours. Catch an afternoon show, head out to Indiranagar for lunch or drinks, and pop back in for the prime-time musical and midnight madness."
    },
    {
      q: "Never watched improv before. Will I follow along?",
      a: "Improv has zero prerequisites and no insider jokes. Everything is made up right in front of you from suggestions shouted by the audience. If you can laugh, you're set."
    },
    {
      q: "What is Underline Center like?",
      a: "It's a cozy community space in Indiranagar. Warm, welcoming, great acoustics, and zero corporate stiffness. Steps away from 12th Main and a short walk from Indiranagar Metro Station."
    }
  ]
};

// Attach ticketing URLs from marathonTickets.json if provided
const ticketsConfig = loadTicketsConfig();
upcoming.ticketLinks = ticketsConfig;

const passesConf = ticketsConfig.passes || {};
if (upcoming.passes && upcoming.passes.length >= 2) {
  upcoming.passes[0].ticketUrl = resolveUrl(passesConf.fourShowPass || passesConf["4-show-pass"]);
  upcoming.passes[1].ticketUrl = resolveUrl(passesConf.singleSession || passesConf["single-session"]);
}

const eventsConf = ticketsConfig.events || {};
(upcoming.schedule || []).forEach((slot) => {
  slot.ticketUrl = resolveUrl(eventsConf[slot.slug] || eventsConf[slot.title]);
  if (slot.isEitherOrJam && Array.isArray(slot.jams)) {
    slot.jams.forEach((j) => {
      j.ticketUrl = resolveUrl(eventsConf[j.slug] || eventsConf[j.name]);
    });
  }
});

export default { meta, lineup, upcoming };

