# ILxUC Calendar

Front-end for Improvlore's event listing. Displays upcoming shows pulled from [UC-ingest](https://github.com/heresmohit/UC-ingest), a separate pipeline that fetches from underline.center and publishes a static `events.json` daily.

This repo has no fetching logic — it just consumes that JSON at build time and renders it.

## Dev

```bash
npm install
npm run dev    # local server
npm run build  # one-off build
```

## Custom events / toggling

Custom events are managed in the ingest repo via its `custom.json`. To toggle them on/off here, flip `showCustomEvents` at the top of `src/index.njk`.
