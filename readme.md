# ILxUC Calendar

Pulls upcoming improv events from [underline.center](https://underline.center) and displays them as a simple event listing. Rebuilds twice a day via GitHub Actions and deploys to Vercel.

## Dev

```bash
npm install
npm run dev    # local server
npm run build  # one-off build
```

## Adding Custom Events

For events not on Discourse (other venues, Hubba, etc.), add them to `custom.json`. They get sorted in alongside UC events on the next build.

```json
[
  {
    "title": "Show Name",
    "event_starts_at": "2026-06-15 19:30:00",
    "venue": "Venue Name",
    "url": "https://tickets.link",
    "learn_more": "https://more.info"
  }
]
```

`excerpt` and `image_url` are optional — the card handles missing fields. Past events are skipped automatically.

To toggle custom events on/off without deleting them, flip `showCustomEvents` at the top of `src/index.njk`.
