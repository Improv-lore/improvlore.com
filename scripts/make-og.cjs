const sharp = require("sharp");

async function generate() {
  const width = 1200;
  const height = 630;

  const poster = await sharp("src/assets/apnw/poster-p.png")
    .resize(400, 533, { fit: "cover" })
    .toBuffer();

  const roundedPoster = await sharp(poster)
    .composite([{
      input: Buffer.from('<svg><rect x="0" y="0" width="400" height="533" rx="14" ry="14"/></svg>'),
      blend: "dest-in"
    }])
    .toBuffer();

  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0b4868"/>
          <stop offset="60%" stop-color="#07334d"/>
          <stop offset="100%" stop-color="#031f30"/>
        </linearGradient>
        <radialGradient id="glow" cx="80%" cy="20%" r="60%">
          <stop offset="0%" stop-color="#19bdea" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#0b4868" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
      <rect width="${width}" height="${height}" fill="url(#glow)"/>

      <!-- Accent Top Border -->
      <rect x="0" y="0" width="${width}" height="6" fill="#ffe642"/>

      <!-- Left Poster Frame shadow border -->
      <rect x="58" y="46" width="404" height="537" rx="16" fill="none" stroke="#ffe642" stroke-width="2.5"/>

      <!-- Right Content Group -->
      <g transform="translate(510, 0)">
        <!-- Badge -->
        <rect x="0" y="58" width="220" height="34" rx="6" fill="#ffe642"/>
        <rect x="0" y="58" width="220" height="34" rx="6" fill="none" stroke="#1a1a1a" stroke-width="2"/>
        <text x="110" y="81" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" fill="#1a1a1a" text-anchor="middle" letter-spacing="2">12-HOUR FESTIVAL</text>

        <!-- Big Title -->
        <text x="0" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-1">ALL PLAY</text>
        <text x="0" y="210" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="900" fill="#ffe642" letter-spacing="-1">NO WORK</text>
        <text x="0" y="256" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" fill="#8ae6ff" letter-spacing="0">12-Hour Improv Marathon · Bengaluru</text>

        <!-- Thin separator line -->
        <line x1="0" y1="288" x2="630" y2="288" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>

        <!-- Date Row -->
        <g transform="translate(0, 318)">
          <!-- Calendar Icon -->
          <rect x="0" y="-18" width="22" height="22" rx="4" fill="none" stroke="#ffe642" stroke-width="2"/>
          <line x1="0" y1="-10" x2="22" y2="-10" stroke="#ffe642" stroke-width="2"/>
          <rect x="4" y="-22" width="3" height="5" rx="1" fill="#ffe642"/>
          <rect x="15" y="-22" width="3" height="5" rx="1" fill="#ffe642"/>
          <text x="34" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#ffffff">
            Friday, 2nd October 2026 · 2:00 PM – 2:00 AM
          </text>
        </g>

        <!-- Venue Row -->
        <g transform="translate(0, 364)">
          <!-- Pin Icon -->
          <circle cx="10" cy="-10" r="6" fill="none" stroke="#ffe642" stroke-width="2"/>
          <path d="M5,-8 L10,1 L15,-8 Z" fill="#ffe642"/>
          <text x="34" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#ffe642">
            Underline Center, Indiranagar, Bangalore
          </text>
        </g>

        <!-- Tag pills row -->
        <g transform="translate(0, 405)">
          <rect x="0" y="0" width="170" height="38" rx="8" fill="rgba(8, 76, 108, 0.85)" stroke="#19bdea" stroke-width="1.5"/>
          <text x="85" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">7 ORIGINAL SHOWS</text>

          <rect x="182" y="0" width="180" height="38" rx="8" fill="rgba(8, 76, 108, 0.85)" stroke="#19bdea" stroke-width="1.5"/>
          <text x="272" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">2 COMMUNITY JAMS</text>

          <rect x="374" y="0" width="160" height="38" rx="8" fill="rgba(8, 76, 108, 0.85)" stroke="#ffe642" stroke-width="1.5"/>
          <text x="454" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#ffe642" text-anchor="middle" letter-spacing="0.5">MARATHON PASSES</text>
        </g>

        <!-- Host and URL line -->
        <g transform="translate(0, 505)">
          <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#a5d8f0">
            Presented by Improvlore · Support Your Local Theatre
          </text>
          <text x="0" y="34" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="900" fill="#ffe642" letter-spacing="0.5">
            improvlore.com/marathon
          </text>
        </g>
      </g>
    </svg>
  `);

  await sharp(svgOverlay)
    .composite([
      { input: roundedPoster, top: 48, left: 60 }
    ])
    .png({ quality: 90 })
    .toFile("src/assets/apnw-og.png");

  console.log("src/assets/apnw-og.png created successfully!");
}

generate().catch(console.error);
