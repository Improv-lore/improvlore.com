// =========================================================================
// ALL PLAY NO WORK: 12-HOUR MARATHON LIVE STAGE & KICKOFF ENGINE
// Authentic theatre call sheet, 15s logo reveal, QR ticketing, 15m turnovers,
// terrace food tracking (4 PM start), and projector view.
// =========================================================================

(function() {
  const COUNTDOWN_CONTAINER_ID = 'hero-marathon-countdown';
  const TARGET_DATE_STR = '2026-10-02T14:00:00+05:30';
  const FESTIVAL_START = new Date(TARGET_DATE_STR).getTime();
  const FESTIVAL_END   = new Date('2026-10-03T02:00:00+05:30').getTime();
  const FOOD_START_TIME = new Date('2026-10-02T16:00:00+05:30').getTime();

  // The 12-Hour Running Order with 15-min turnovers & official ticket booking URLs
  const SCHEDULE = [
    {
      title: "PowerPoint Roulette",
      start: new Date("2026-10-02T14:00:00+05:30").getTime(),
      end: new Date("2026-10-02T15:15:00+05:30").getTime(),
      kicker: "The 2 PM Kickoff",
      slotTime: "2:00 PM – 3:15 PM",
      blurb: "Improvisers present pitch decks, TED talks, and conspiracy theories from slides they have never seen before. Panic on stage, pure joy in the room.",
      ticketUrl: "https://district.in/powerpoint-roulette-by-improv-lore-may1-2026/event"
    },
    {
      title: "Maestro Impro™",
      start: new Date("2026-10-02T15:30:00+05:30").getTime(),
      end: new Date("2026-10-02T16:45:00+05:30").getTime(),
      kicker: "Audience Elimination Game",
      slotTime: "3:30 PM – 4:45 PM",
      blurb: "Twelve actors walk in. You shout suggestions, score every scene, and eliminate players until only one survivor is crowned Maestro.",
      ticketUrl: "https://district.in/maestro-impro-by-improv-lore-oct2-2026/event"
    },
    {
      title: "Yes, and Dragons",
      start: new Date("2026-10-02T17:00:00+05:30").getTime(),
      end: new Date("2026-10-02T18:15:00+05:30").getTime(),
      kicker: "Tabletop Quest",
      slotTime: "5:00 PM – 6:15 PM",
      blurb: "Dungeons & Dragons meets live storytelling. Giant dice, improvised dungeon masters, and heroes running headfirst into audience curveballs.",
      ticketUrl: "https://district.in/yes-and-dragons-a-dungeons-dragons-inspired-show-by-improv-lore-may1-2026/event"
    },
    {
      title: "And, Then?",
      start: new Date("2026-10-02T18:30:00+05:30").getTime(),
      end: new Date("2026-10-02T19:45:00+05:30").getTime(),
      kicker: "Longform Stories",
      slotTime: "6:30 PM – 7:45 PM",
      blurb: "Rich, slow-burn characters and intertwined stories made up on the spot by our veteran ensemble. Heart, drama, and unexpected laughs.",
      ticketUrl: "https://www.district.in/events/and-then-an-improv-show-by-improv-lore-jul26-2026-buy-tickets"
    },
    {
      title: "The 8 PM Jams: Pick Your Circle",
      start: new Date("2026-10-02T20:00:00+05:30").getTime(),
      end: new Date("2026-10-02T21:00:00+05:30").getTime(),
      kicker: "Community Jam Hour (8:00 PM – 9:00 PM)",
      slotTime: "8:00 PM – 9:00 PM",
      blurb: "Two friendly jams happening at the same time in separate rooms: Make an Improv Song (Option A) and Make Friends with the Stage (Option B). Pick your circle and jump right in.",
      ticketUrl: "https://district.in/make-an-improv-song-musical-improv-jam-by-improv-lore-may1-2026/event"
    },
    {
      title: "The Musical Improv Show",
      start: new Date("2026-10-02T21:30:00+05:30").getTime(),
      end: new Date("2026-10-02T22:45:00+05:30").getTime(),
      kicker: "Prime Time Musical",
      slotTime: "9:30 PM – 10:45 PM",
      blurb: "Unscripted melodies, songs, and scenes created live with a pianist from your prompts and suggestions right on the spot. Zero scripts, all made up live.",
      ticketUrl: "https://district.in/musical-improv-show-by-improv-lore-world-music-day-jun21-2026/event"
    },
    {
      title: "TheatreSports™",
      start: new Date("2026-10-02T23:00:00+05:30").getTime(),
      end: new Date("2026-10-03T00:15:00+05:30").getTime(),
      kicker: "Late Night Comedy Clash",
      slotTime: "11:00 PM – 12:15 AM",
      blurb: "Two teams battle it out in lightning-fast comedy rounds. Referee whistles, penalty fouls, and you scoring the winners.",
      ticketUrl: "https://district.in/theatresports-by-improv-lore-may1-2026/event"
    },
    {
      title: "The Silliest Show Tonight: After Dark",
      start: new Date("2026-10-03T00:30:00+05:30").getTime(),
      end: new Date("2026-10-03T02:00:00+05:30").getTime(),
      kicker: "The 12:30 AM Finale",
      slotTime: "12:30 AM – 2:00 AM",
      blurb: "What happens to improvisors after ten hours of adrenaline. Callbacks to the whole day, absurd characters, and not our regular family friendly show.",
      ticketUrl: "https://district.in/the-silliest-show-tonight-by-improv-lore/event"
    }
  ];

  let soundEnabled = true;
  let audioCtx = null;
  let rehearsalEndTime = null;
  let testTurnoverMode = false;
  let test1pmMode = false;
  const ONE_PM_TIMESTAMP = new Date('2026-10-02T13:00:00+05:30').getTime();
  let logoRevealStartTime = null;
  const LOGO_REVEAL_DURATION_MS = 15000; // 15 seconds of pure All Play No Work logo
  let hasCelebrated = false;
  let celebrationDismissed = false;
  let lastBeepSec = null;

  // Initialize Web Audio Context on demand
  function getAudioCtx() {
    if (!soundEnabled) return null;
    try {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioCtx = new AC();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  // Theatrical curtain call chime
  function playCountdownBeep(freq, duration) {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq || 520, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (duration || 0.12));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (duration || 0.12));
    } catch (e) {}
  }

  // Theatrical fanfare chords
  function playKickoffFanfare() {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [
        { f: 261.63, t: 0, d: 0.22 },     // C4
        { f: 329.63, t: 0.16, d: 0.22 },   // E4
        { f: 392.00, t: 0.32, d: 0.3 },    // G4
        { f: 523.25, t: 0.52, d: 1.5 },    // C5
        { f: 659.25, t: 0.52, d: 1.5 },    // E5
        { f: 783.99, t: 0.52, d: 1.8 }     // G5
      ];
      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.2, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch (e) {}
  }

  // Tasteful canvas confetti cannon
  function fireConfetti() {
    let canvas = document.getElementById('marathon-confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'marathon-confetti-canvas';
      canvas.className = 'marathon-confetti-canvas';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    const colors = ['#f1e388', '#ffe642', '#19bdea', '#df5b62', '#ffffff', '#111827'];
    const particles = [];
    const count = 140;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * (canvas.width * 0.6),
        y: canvas.height * 0.42 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 24,
        vy: -Math.random() * 20 - 7,
        w: Math.random() * 11 + 6,
        h: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 360,
        vAngle: (Math.random() - 0.5) * 16,
        alpha: 1,
        decay: Math.random() * 0.004 + 0.003
      });
    }

    let animId;
    const startTime = Date.now();

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = 0;

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.42; // gravity
        p.vx *= 0.985;
        p.angle += p.vAngle;
        p.alpha -= p.decay;

        if (p.alpha > 0 && p.y < canvas.height + 60) {
          active++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.angle * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }

      if (active > 0 && Date.now() - startTime < 9000) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        cancelAnimationFrame(animId);
      }
    }

    animId = requestAnimationFrame(render);
  }

  // Camera Flash
  function triggerStageFlash() {
    const flash = document.createElement('div');
    flash.className = 'stage-flash-overlay';
    document.body.appendChild(flash);
    setTimeout(() => {
      flash.classList.add('fade-out');
      setTimeout(() => flash.remove(), 550);
    }, 40);
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function formatDuration(ms) {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  // Generate QR code image URL
  function getQrCodeUrl(url) {
    const target = url || "https://improvlore.com/marathon/#passes";
    return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=6&data=${encodeURIComponent(target)}`;
  }

  // Terrace food status text based on 4:00 PM start
  function getTerraceFoodInfo(now) {
    if (now < FOOD_START_TIME) {
      return {
        pill: "FOOD AT 4:00 PM",
        text: "Hot Asian rice bowls from <strong>Wabi Bowl</strong> &amp; fresh batches from <strong>Bob’s Browniez</strong> open on the terrace at 4:00 PM."
      };
    }
    return {
      pill: "TERRACE NOW SERVING",
      text: "Hot Asian rice bowls from <strong>Wabi Bowl</strong> &amp; fresh batches from <strong>Bob’s Browniez</strong> are serving on the terrace now!"
    };
  }

  // Calculate current festival live state
  function getFestivalState(now) {
    // If turnover test mode is active
    if (testTurnoverMode) {
      const show2 = SCHEDULE[1]; // Maestro Impro
      return {
        type: 'INTERMISSION',
        prevShow: SCHEDULE[0],
        nextShow: show2,
        minsUntilNext: 14,
        elapsedMs: 76 * 60 * 1000,
        totalMs: FESTIVAL_END - FESTIVAL_START
      };
    }

    if (now < FESTIVAL_START) {
      return { type: 'COUNTDOWN', diff: FESTIVAL_START - now };
    }
    if (now >= FESTIVAL_END) {
      return { type: 'CONCLUDED' };
    }

    // Active Show check
    for (let i = 0; i < SCHEDULE.length; i++) {
      const show = SCHEDULE[i];
      if (now >= show.start && now < show.end) {
        return {
          type: 'LIVE_SHOW',
          showIndex: i + 1,
          totalShows: SCHEDULE.length,
          currentShow: show,
          nextShow: SCHEDULE[i + 1] || null,
          minsRemaining: Math.ceil((show.end - now) / 60000),
          elapsedMs: now - FESTIVAL_START,
          totalMs: FESTIVAL_END - FESTIVAL_START
        };
      }
    }

    // 15-Minute Intermission / Turnover check
    for (let i = 0; i < SCHEDULE.length; i++) {
      const show = SCHEDULE[i];
      if (now < show.start) {
        return {
          type: 'INTERMISSION',
          prevShow: SCHEDULE[i - 1] || null,
          nextShow: show,
          minsUntilNext: Math.ceil((show.start - now) / 60000),
          elapsedMs: now - FESTIVAL_START,
          totalMs: FESTIVAL_END - FESTIVAL_START
        };
      }
    }

    return {
      type: 'LIVE_FESTIVAL',
      elapsedMs: now - FESTIVAL_START,
      totalMs: FESTIVAL_END - FESTIVAL_START
    };
  }

  // Render T-0 Kickoff: 15-Second pure All Play No Work logo reveal
  function renderLogoReveal(container, isProjector) {
    const elapsedLogo = logoRevealStartTime ? (Date.now() - logoRevealStartTime) : 0;
    const remainingMs = Math.max(0, LOGO_REVEAL_DURATION_MS - elapsedLogo);
    const remainingSecs = Math.ceil(remainingMs / 1000);
    const progressPct = Math.min(100, Math.max(0, (elapsedLogo / LOGO_REVEAL_DURATION_MS) * 100));

    const existingLogo = container.querySelector('.marathon-logo-reveal');
    if (existingLogo) {
      const fillEl = existingLogo.querySelector('.logo-reveal-progress-fill');
      if (fillEl) fillEl.style.width = `${progressPct}%`;
      const numEl = existingLogo.querySelector('.logo-reveal-countdown');
      if (numEl) numEl.textContent = `${remainingSecs}s`;
      return;
    }

    container.innerHTML = `
      <div class="marathon-logo-reveal">
        <div class="theatre-board-badge-strip">
          <span class="theatre-sticker theatre-sticker--accent">SECOND EDITION · 2ND OCT</span>
          <span class="theatre-sticker">CURTAIN UP</span>
        </div>

        <div class="logo-reveal-center">
          <img src="/assets/apnw-c.png" alt="All Play No Work" class="logo-reveal-hero-img" />
        </div>

        <div class="logo-reveal-timer-strip">
          <div class="logo-reveal-progress-bar">
            <div class="logo-reveal-progress-fill" style="width: ${progressPct}%;"></div>
          </div>
          <span class="logo-reveal-countdown">${remainingSecs}s</span>
        </div>

        <button type="button" class="btn-apnw-primary js-skip-logo-reveal" style="font-size: 0.9rem; padding: 0.55rem 1.15rem;">
          Open Stage Board →
        </button>
      </div>
    `;

    const skipBtn = container.querySelector('.js-skip-logo-reveal');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        celebrationDismissed = true;
        logoRevealStartTime = null;
        const c = document.getElementById(COUNTDOWN_CONTAINER_ID);
        if (c) c.innerHTML = '';
        const pt = document.getElementById('projector-overlay-target');
        if (pt) pt.innerHTML = '';
        updateFestivalUI();
      });
    }
  }

  // Render Live Festival Stage Call Sheet (Active Show OR 15-Minute Turnover)
  function renderLiveDashboard(container, state, isProjector) {
    const elapsed = state.elapsedMs || 0;
    const total = state.totalMs || (12 * 3600 * 1000);
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
    const currentHour = Math.min(12, Math.floor(elapsed / (3600 * 1000)) + 1);
    const food = getTerraceFoodInfo(FESTIVAL_START + elapsed);

    let stageContent = '';
    if (state.type === 'LIVE_SHOW') {
      const s = state.currentShow;
      const qrUrl = getQrCodeUrl(s.ticketUrl);
      stageContent = `
        <div class="stage-sheet-header">
          <span class="stage-status-pill stage-status-pill--live">● ON STAGE NOW</span>
          <span class="stage-sheet-slot">${s.slotTime}</span>
        </div>
        <h3 class="stage-sheet-title">${s.title}</h3>
        <span class="stage-sheet-kicker">${s.kicker}</span>
        <p class="stage-sheet-blurb">${s.blurb}</p>
        <div class="stage-sheet-footer">
          <span class="stage-chip stage-chip--time">⏱ Ends in ~${state.minsRemaining} mins</span>
          ${state.nextShow ? `<span class="stage-chip stage-chip--next">Up next at ${state.nextShow.slotTime.split('–')[0].trim()}: <strong>${state.nextShow.title}</strong></span>` : ''}
        </div>

        <!-- Stage QR Code Card -->
        <div class="stage-qr-card">
          <img src="${qrUrl}" alt="QR code for ${s.title} passes" class="stage-qr-img" width="86" height="86" />
          <div class="stage-qr-details">
            <span class="stage-qr-kicker">SHOW PASSES &amp; BOOKINGS</span>
            <strong class="stage-qr-title">Book Tickets for ${s.title}</strong>
            <span class="stage-qr-desc">Scan from the room for single session or all-access passes.</span>
          </div>
        </div>
      `;
    } else if (state.type === 'INTERMISSION') {
      const next = state.nextShow;
      const qrUrl = getQrCodeUrl(next.ticketUrl);
      stageContent = `
        <div class="stage-sheet-header">
          <span class="stage-status-pill stage-status-pill--break">● 15-MINUTE TURNOVER &amp; STAGE RESET</span>
          <span class="stage-sheet-slot">Next Show at ${next.slotTime.split('–')[0].trim()}</span>
        </div>
        <h3 class="stage-sheet-title">Up Next: ${next.title}</h3>
        <span class="stage-sheet-kicker">${next.kicker} · Doors Open in ~${state.minsUntilNext} mins</span>
        <p class="stage-sheet-blurb">${next.blurb}</p>
        <div class="stage-sheet-footer">
          <span class="stage-chip stage-chip--urgent">⏱ Next show starts in ~${state.minsUntilNext} mins</span>
        </div>

        <!-- Stage QR Code Card for Next Show -->
        <div class="stage-qr-card">
          <img src="${qrUrl}" alt="QR code for ${next.title} passes" class="stage-qr-img" width="86" height="86" />
          <div class="stage-qr-details">
            <span class="stage-qr-kicker">UPCOMING SHOW TICKETS</span>
            <strong class="stage-qr-title">Grab Passes for ${next.title}</strong>
            <span class="stage-qr-desc">Scan to book your seat before doors open.</span>
          </div>
        </div>
      `;
    } else {
      stageContent = `
        <div class="stage-sheet-header">
          <span class="stage-status-pill stage-status-pill--live">● ALL PLAY NO WORK</span>
          <span class="stage-sheet-slot">2:00 PM – 2:00 AM</span>
        </div>
        <h3 class="stage-sheet-title">12-Hour Improvathon</h3>
        <p class="stage-sheet-blurb">Seven shows, two community jams, and zero scripts. Live at Underline Center, Indiranagar.</p>
      `;
    }

    const isRehearsal = (rehearsalEndTime !== null) || testTurnoverMode;

    // Smooth partial update if stage board already rendered
    const existingDash = container.querySelector('.marathon-stage-board');
    if (existingDash) {
      const hourEl = existingDash.querySelector('.stage-board-tags .marathon-tag--edition');
      if (hourEl) hourEl.textContent = `HOUR ${currentHour} OF 12`;

      const clockEl = existingDash.querySelector('.clock-val');
      if (clockEl) clockEl.textContent = formatDuration(elapsed);

      const fillEl = existingDash.querySelector('.marathon-progress-fill');
      if (fillEl) fillEl.style.width = `${pct}%`;

      const stageSheet = existingDash.querySelector('.stage-active-sheet');
      if (stageSheet) stageSheet.innerHTML = stageContent;

      const tickerPill = existingDash.querySelector('.ticker-pill');
      if (tickerPill) tickerPill.textContent = food.pill;

      const tickerCopy = existingDash.querySelector('.ticker-copy');
      if (tickerCopy) tickerCopy.innerHTML = food.text;

      return;
    }

    container.innerHTML = `
      <div class="marathon-stage-board">
        <!-- Top Status Bar -->
        <div class="stage-board-topbar">
          <div class="stage-board-tags">
            <span class="marathon-tag marathon-tag--edition">HOUR ${currentHour} OF 12</span>
            ${testTurnoverMode ? '<span class="marathon-tag marathon-tag--highlight">TURNOVER TEST</span>' : (rehearsalEndTime ? '<span class="marathon-tag marathon-tag--highlight">CREW REHEARSAL</span>' : '')}
          </div>
          <div class="stage-board-clock" title="Elapsed marathon duration">
            <span class="clock-label">ELAPSED:</span>
            <span class="clock-val">${formatDuration(elapsed)}</span>
          </div>
        </div>

        <!-- 12-Hour Endurance Progress Track -->
        <div class="marathon-progress-track" aria-label="12-Hour Marathon Progress: ${Math.round(pct)}%">
          <div class="marathon-progress-fill" style="width: ${pct}%;"></div>
        </div>

        <!-- Active Stage Call Sheet Card -->
        <div class="stage-active-sheet">
          ${stageContent}
        </div>

        <!-- Terrace Ticker with 4:00 PM notice -->
        <div class="stage-terrace-ticker">
          <span class="ticker-pill">${food.pill}</span>
          <span class="ticker-copy">${food.text}</span>
        </div>

        ${isProjector ? '' : `
        <!-- Controls Strip -->
        <div class="stage-controls-strip">
          <button type="button" class="btn-stage-tool js-toggle-projector" title="Fullscreen Projector View (Shift+P)">
            ⛶ Projector View
          </button>
          <button type="button" class="btn-stage-tool js-toggle-sound" title="Toggle audio cues">
            ${soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
          </button>
          <button type="button" class="btn-stage-tool js-trigger-rehearse" title="Rehearse Kickoff Countdown (Shift+R)">
            🎭 Rehearse Kickoff
          </button>
          <button type="button" class="btn-stage-tool js-trigger-test-turnover" title="Test 15-Minute Stage Turnover / Reset Mode">
            ⏱ Test Turnover
          </button>
          ${isRehearsal ? `
            <button type="button" class="btn-stage-tool btn-stage-tool--return js-reset-rehearsal" title="Return to real-world countdown">
              ↺ Return to Countdown
            </button>
          ` : ''}
        </div>
        `}
      </div>
    `;

    attachToolbarEvents(container, isProjector);
  }

  // Render Countdown Grid (3 EQUAL COLUMNS: Hours, Minutes, Seconds - No Days Block)
  function renderCountdown(container, diffMs, isProjector) {
    const isUnder10s = diffMs <= 10000;
    const totalSecs = Math.max(0, Math.floor(diffMs / 1000));
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    // T-minus Climax: Theatrical Call Card
    if (isUnder10s) {
      const existingClimax = container.querySelector('.theatre-call-card');
      if (existingClimax) {
        const numEl = existingClimax.querySelector('.theatre-call-num');
        if (numEl) numEl.textContent = totalSecs;
        if (lastBeepSec !== totalSecs) {
          lastBeepSec = totalSecs;
          playCountdownBeep(440 + (10 - totalSecs) * 44, 0.14);
        }
        return;
      }

      container.innerHTML = `
        <div class="theatre-call-card">
          <div class="theatre-call-badge">
            <span class="theatre-sticker theatre-sticker--accent">HOUSE LIGHTS DOWN</span>
          </div>
          <div class="theatre-call-countdown">
            <span class="theatre-call-num">${totalSecs}</span>
            <span class="theatre-call-unit">SECONDS TO CURTAIN</span>
          </div>
          <p class="theatre-call-sub">
            Places, please! <strong>All Play No Work</strong> is about to begin.
          </p>
        </div>
      `;
      if (lastBeepSec !== totalSecs) {
        lastBeepSec = totalSecs;
        playCountdownBeep(440 + (10 - totalSecs) * 44, 0.14);
      }
      return;
    }

    // 3 Equal Columns: Hours, Minutes, Seconds
    const existingGrid = container.querySelector('.timer-mosaic-grid--triplet');
    if (existingGrid) {
      // Ensure projector brand header logo is present in projector view
      if (isProjector && !container.querySelector('.projector-brand-header')) {
        const brandHeader = document.createElement('div');
        brandHeader.className = 'projector-brand-header';
        brandHeader.innerHTML = '<img src="/assets/apnw-c.png" alt="All Play No Work" class="projector-logo-img" width="140" height="140" />';
        container.insertBefore(brandHeader, container.firstChild);
      }

      const hEl = container.querySelector('[data-unit="hours"]');
      const mEl = container.querySelector('[data-unit="minutes"]');
      const sEl = container.querySelector('[data-unit="seconds"]');
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(minutes);
      if (sEl) sEl.textContent = pad(seconds);

      // Ensure tools strip is present in container (omit on projector view)
      if (!isProjector && !container.querySelector('.countdown-tools-strip')) {
        const tools = document.createElement('div');
        tools.className = 'countdown-tools-strip';
        tools.innerHTML = `
          <button type="button" class="btn-stage-tool js-toggle-projector" title="Fullscreen Projector View (Shift+P)">
            ⛶ Projector View
          </button>
        `;
        container.appendChild(tools);
      }

      // Always ensure toolbar events are bound
      attachToolbarEvents(container, isProjector);
      return;
    }

    container.innerHTML = `
      ${isProjector ? `
      <div class="projector-brand-header">
        <img src="/assets/apnw-c.png" alt="All Play No Work" class="projector-logo-img" width="140" height="140" />
      </div>
      ` : ''}

      <div class="timer-mosaic-grid timer-mosaic-grid--triplet">
        <div class="timer-block timer-block--hours">
          <div class="timer-block-top">
            <span class="timer-badge-pill">HOURS</span>
          </div>
          <div class="timer-block-main">
            <span class="timer-num" data-unit="hours">${pad(hours)}</span>
          </div>
        </div>

        <div class="timer-block timer-block--minutes">
          <div class="timer-block-top">
            <span class="timer-badge-pill">MINUTES</span>
          </div>
          <div class="timer-block-main">
            <span class="timer-num" data-unit="minutes">${pad(minutes)}</span>
          </div>
        </div>

        <div class="timer-block timer-block--seconds">
          <div class="timer-block-top">
            <span class="timer-badge-pill timer-badge-pill--live">SECONDS</span>
          </div>
          <div class="timer-block-main">
            <span class="timer-num timer-num--pulse" data-unit="seconds">${pad(seconds)}</span>
          </div>
        </div>
      </div>

      ${isProjector ? '' : `
      <!-- Quick Projector Strip -->
      <div class="countdown-tools-strip">
        <button type="button" class="btn-stage-tool js-toggle-projector" title="Fullscreen Projector View (Shift+P)">
          ⛶ Projector View
        </button>
      </div>
      `}
    `;

    attachToolbarEvents(container, isProjector);
  }

  // Attach toolbar interactive button clicks
  function attachToolbarEvents(container, isProjector) {
    const projBtn = container.querySelector('.js-toggle-projector');
    if (projBtn && !projBtn.dataset.bound) {
      projBtn.dataset.bound = '1';
      projBtn.addEventListener('click', toggleProjectorMode);
    }

    const soundBtn = container.querySelector('.js-toggle-sound');
    if (soundBtn && !soundBtn.dataset.bound) {
      soundBtn.dataset.bound = '1';
      soundBtn.addEventListener('click', () => {
        getAudioCtx();
        soundEnabled = !soundEnabled;
        soundBtn.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
        updateFestivalUI();
      });
    }

    const rehearseBtn = container.querySelector('.js-trigger-rehearse');
    if (rehearseBtn && !rehearseBtn.dataset.bound) {
      rehearseBtn.dataset.bound = '1';
      rehearseBtn.addEventListener('click', () => {
        startRehearsal(5);
      });
    }

    const turnoverBtn = container.querySelector('.js-trigger-test-turnover');
    if (turnoverBtn && !turnoverBtn.dataset.bound) {
      turnoverBtn.dataset.bound = '1';
      turnoverBtn.addEventListener('click', () => {
        testTurnover();
      });
    }

    const onePmBtn = container.querySelector('.js-trigger-test-1pm');
    if (onePmBtn && !onePmBtn.dataset.bound) {
      onePmBtn.dataset.bound = '1';
      onePmBtn.addEventListener('click', () => {
        toggleTest1pm();
      });
    }

    const resetBtn = container.querySelector('.js-reset-rehearsal');
    if (resetBtn && !resetBtn.dataset.bound) {
      resetBtn.dataset.bound = '1';
      resetBtn.addEventListener('click', resetRehearsal);
    }
  }

  // Start Rehearsal Sequence (default 5s)
  function startRehearsal(seconds) {
    getAudioCtx();
    hasCelebrated = false;
    celebrationDismissed = false;
    testTurnoverMode = false;
    logoRevealStartTime = null;
    lastBeepSec = null;
    rehearsalEndTime = Date.now() + (seconds || 5) * 1000;

    const c = document.getElementById(COUNTDOWN_CONTAINER_ID);
    if (c) c.innerHTML = '';
    const pt = document.getElementById('projector-overlay-target');
    if (pt) pt.innerHTML = '';

    updateFestivalUI();
  }

  // Test 15-Minute Stage Turnover / Reset Mode
  function testTurnover() {
    getAudioCtx();
    testTurnoverMode = true;
    rehearsalEndTime = null;
    celebrationDismissed = true;
    logoRevealStartTime = null;

    const c = document.getElementById(COUNTDOWN_CONTAINER_ID);
    if (c) c.innerHTML = '';
    const pt = document.getElementById('projector-overlay-target');
    if (pt) pt.innerHTML = '';

    updateFestivalUI();
  }

  // Toggle 1:00 PM Final Hour Massive Timer Mode (Shift+1)
  function toggleTest1pm() {
    test1pmMode = !test1pmMode;
    const c = document.getElementById(COUNTDOWN_CONTAINER_ID);
    if (c) c.innerHTML = '';
    const pt = document.getElementById('projector-overlay-target');
    if (pt) pt.innerHTML = '';
    updateFestivalUI();
  }

  // Reset Rehearsal back to live real-world countdown
  function resetRehearsal() {
    rehearsalEndTime = null;
    testTurnoverMode = false;
    test1pmMode = false;
    logoRevealStartTime = null;
    hasCelebrated = false;
    celebrationDismissed = false;
    lastBeepSec = null;

    const c = document.getElementById(COUNTDOWN_CONTAINER_ID);
    if (c) c.innerHTML = '';
    const pt = document.getElementById('projector-overlay-target');
    if (pt) pt.innerHTML = '';

    updateFestivalUI();
  }

  // Trigger celebration & 15-second logo reveal
  function triggerCelebration() {
    hasCelebrated = true;
    logoRevealStartTime = Date.now();
    triggerStageFlash();
    fireConfetti();
    playKickoffFanfare();

    // Auto dismiss logo reveal after 15 seconds to settle into live stage board
    setTimeout(() => {
      if (!celebrationDismissed) {
        celebrationDismissed = true;
        logoRevealStartTime = null;
        const c = document.getElementById(COUNTDOWN_CONTAINER_ID);
        if (c) c.innerHTML = '';
        const pt = document.getElementById('projector-overlay-target');
        if (pt) pt.innerHTML = '';
        updateFestivalUI();
      }
    }, LOGO_REVEAL_DURATION_MS);
  }

  // Toggle Fullscreen Projector Overlay
  function toggleProjectorMode() {
    getAudioCtx();
    let overlay = document.getElementById('marathon-projector-overlay');
    if (overlay) {
      overlay.remove();
      document.body.classList.remove('marathon-projector-active');
      return;
    }

    overlay = document.createElement('div');
    overlay.id = 'marathon-projector-overlay';
    overlay.className = 'marathon-projector-overlay';
    overlay.innerHTML = `
      <div class="projector-overlay-inner" id="projector-overlay-target"></div>
    `;
    document.body.appendChild(overlay);
    document.body.classList.add('marathon-projector-active');

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('projector-overlay-inner')) {
        toggleProjectorMode();
      }
    });

    updateFestivalUI();
  }

  // Main UI Tick Update
  function updateFestivalUI() {
    const container = document.getElementById(COUNTDOWN_CONTAINER_ID);
    const projectorTarget = document.getElementById('projector-overlay-target');
    if (!container && !projectorTarget) return;

    const now = Date.now();
    let effectiveNow = now;

    // Handle rehearsal simulation
    if (rehearsalEndTime !== null) {
      const remainingRehearsal = rehearsalEndTime - now;
      if (remainingRehearsal > 0) {
        // T-minus rehearsal
        effectiveNow = FESTIVAL_START - remainingRehearsal;
      } else {
        // Crossed T-0 zero mark
        effectiveNow = FESTIVAL_START + Math.abs(remainingRehearsal);
      }
    }

    const state = getFestivalState(effectiveNow);

    // 1:00 PM Final Hour Hero State: remove intro text and display timer full width
    const isOnePmFinalHour = (effectiveNow >= ONE_PM_TIMESTAMP && effectiveNow < FESTIVAL_START) || test1pmMode;
    const heroSplit = document.querySelector('.marathon-hero-split');
    const heroWrap = document.querySelector('.marathon-hero-wrap');
    if (isOnePmFinalHour && state.type === 'COUNTDOWN') {
      if (heroSplit) heroSplit.classList.add('marathon-hero-split--timer-only');
      if (heroWrap) heroWrap.classList.add('marathon-hero-wrap--timer-only');
      document.body.classList.add('hero-mode-1pm');
    } else {
      if (heroSplit) heroSplit.classList.remove('marathon-hero-split--timer-only');
      if (heroWrap) heroWrap.classList.remove('marathon-hero-wrap--timer-only');
      document.body.classList.remove('hero-mode-1pm');
    }

    // Check if crossing zero right now
    if (state.type !== 'COUNTDOWN' && !hasCelebrated && !celebrationDismissed && !testTurnoverMode) {
      triggerCelebration();
    }

    // Check if 15s logo reveal is currently active
    const isShowingLogoReveal = (!celebrationDismissed && logoRevealStartTime && (now - logoRevealStartTime < LOGO_REVEAL_DURATION_MS));

    // Render active targets
    const targets = [];
    if (container) targets.push({ el: container, isProjector: false });
    if (projectorTarget) targets.push({ el: projectorTarget, isProjector: true });

    targets.forEach(({ el, isProjector }) => {
      if (state.type === 'COUNTDOWN') {
        renderCountdown(el, state.diff, isProjector);
      } else if (isShowingLogoReveal) {
        renderLogoReveal(el, isProjector);
      } else {
        renderLiveDashboard(el, state, isProjector);
      }
    });
  }

  // Auto-check URL for ?testKickoff=1 or ?rehearse=1 or ?projector=1 or ?testTurnover=1 or ?test1pm=1
  function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('testKickoff') || params.has('rehearse')) {
      setTimeout(() => startRehearsal(5), 600);
    }
    if (params.has('testTurnover')) {
      setTimeout(() => testTurnover(), 600);
    }
    if (params.has('test1pm') || params.has('onePm')) {
      setTimeout(() => toggleTest1pm(), 600);
    }
    if (params.has('projector')) {
      setTimeout(() => toggleProjectorMode(), 700);
    }
  }

  // Setup keyboard shortcuts & click easter egg
  function setupKeyboardAndClicks() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('marathon-projector-overlay')) {
        toggleProjectorMode();
      }
      if (e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        toggleProjectorMode();
      }
      if (e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        startRehearsal(5);
      }
      if (e.shiftKey && (e.key === 'T' || e.key === 't')) {
        testTurnover();
      }
      if (e.shiftKey && (e.key === '!' || e.key === '1')) {
        toggleTest1pm();
      }
    });
  }

  // Start ticker
  function init() {
    setupKeyboardAndClicks();
    checkUrlParams();
    updateFestivalUI();
    setInterval(updateFestivalUI, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for external test scripts
  window.marathonLive = {
    startRehearsal,
    testTurnover,
    toggleTest1pm,
    resetRehearsal,
    toggleProjectorMode,
    getFestivalState
  };
})();
