# improvlore.com

Source for the [Improv Lore](https://improvlore.com) website. Displays upcoming shows pulled from [UC-ingest](https://github.com/heresmohit/UC-ingest), a separate pipeline that fetches from underline.center and publishes a static `events.json` daily.

This repo has no fetching logic. It just consumes that JSON at build time and renders it.

## Dev

```bash
npm install
npm run dev    # local server
npm run build  # one-off build
```

## Custom events / toggling

Custom events are managed in the ingest repo via its `custom.json`. To toggle them on/off here, flip `showCustomEvents` at the top of `src/index.njk`.

## Short links

Vanity short links live in `src/_redirects.njk` (built to a Cloudflare Pages `_redirects` file). Most are auto-generated from the catalog: add a `short` field to a format in `src/_data/formats.js` and `improvlore.com/<short>` starts pointing at its page. A few are hand-written for socials and one-off events.

**Socials / pages**

| Link | Goes to |
| --- | --- |
| `/whatsapp` | WhatsApp community group |
| `/instagram` | Instagram |
| `/email` | `/contact/` |

**Shows**

| Link | Goes to |
| --- | --- |
| `/silliest` | The Silliest Show Tonight |
| `/musical` | Musical Improv Show |
| `/ppt` | PowerPoint Roulette |
| `/maestro` | Maestro Impro |
| `/faceoff` | The Great Face-Off |
| `/reincarnations` | Reincarnations |
| `/panchatantra` | Panchatantra |
| `/turing` | The Turing Twist |
| `/ts` | TheatreSports (one-off, hand-written) |

**Jams**

| Link | Goes to |
| --- | --- |
| `/whimsy` | Whimsical Wednesday |
| `/stage` | Make Friends with the Stage |
| `/song` | Make an Improv Song |

**Workshops**

| Link | Goes to |
| --- | --- |
| `/101` | Improv 101 |
| `/musical-workshop` | Musical Improv: An Introduction |
| `/yesand` | What is Yes, And |
| `/intensive` | Intensive Course in Improvised Theatre |
| `/essentials` | Improv Essentials |

## Forms

The contact and testimonial forms POST to `functions/submit.js`, which verifies a Cloudflare Turnstile token before forwarding to Google Forms. This needs `TURNSTILE_SECRET_KEY` set as a Pages environment variable (Production and Preview); without it the forms reject everything.

## License and usage

Copyright (c) Improv Lore. All rights reserved.

This repository is public so the work can be read, referenced, and contributed to by invitation. It is not licensed for reuse: the code, and especially the Improv Lore branding, event copy, posters, and other content, may not be copied, redistributed, or used to run a derivative site without permission. If you would like to use any part of it, please get in touch first.
