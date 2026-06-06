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

## License and usage

Copyright (c) Improv Lore. All rights reserved.

This repository is public so the work can be read, referenced, and contributed to by invitation. It is not licensed for reuse: the code, and especially the Improv Lore branding, event copy, posters, and other content, may not be copied, redistributed, or used to run a derivative site without permission. If you would like to use any part of it, please get in touch first.
