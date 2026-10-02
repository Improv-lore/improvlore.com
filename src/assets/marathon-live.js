// =========================================================================
// ALL PLAY NO WORK: 12-HOUR MARATHON LIVE STAGE & KICKOFF ENGINE
// Authentic theatre call sheet, 15s logo reveal, QR ticketing, 15m turnovers,
// terrace food tracking (4 PM start), and projector view.
// =========================================================================

(function () {
  const COUNTDOWN_CONTAINER_ID = 'hero-marathon-countdown';
  const TARGET_DATE_STR = '2026-10-02T14:00:00+05:30';
  const FESTIVAL_START = new Date(TARGET_DATE_STR).getTime();
  const FESTIVAL_END = new Date('2026-10-03T02:00:00+05:30').getTime();
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
  const initialTime = Date.now();
  const initialLoadWasBeforeStart = (initialTime < FESTIVAL_START);
  let hasCelebrated = !initialLoadWasBeforeStart;
  let celebrationDismissed = !initialLoadWasBeforeStart;
  let lastBeepSec = null;
  let testHour12Mode = false;
  let hasCelebratedHour12 = false;
  let hour12ClimaxEndTime = null;

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
    } catch (e) { }
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
    } catch (e) { }
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
    if (testHour12Mode) {
      return {
        type: 'COMPLETED_12',
        elapsedMs: 12 * 3600 * 1000,
        totalMs: 12 * 3600 * 1000
      };
    }

    if (now < FESTIVAL_START) {
      return { type: 'COUNTDOWN', diff: FESTIVAL_START - now };
    }

    if (now >= FESTIVAL_END) {
      return {
        type: 'COMPLETED_12',
        elapsedMs: 12 * 3600 * 1000,
        totalMs: 12 * 3600 * 1000
      };
    }

    const elapsed = now - FESTIVAL_START;
    const total = FESTIVAL_END - FESTIVAL_START;
    const remainingToHour12 = total - elapsed;

    // Final 10 seconds of Hour 12 theatrical climax countdown
    if (remainingToHour12 <= 10000 && remainingToHour12 > 0) {
      return {
        type: 'CLIMAX_12',
        diff: remainingToHour12,
        elapsedMs: elapsed,
        totalMs: total
      };
    }

    return {
      type: 'LIVE_MARATHON',
      elapsedMs: elapsed,
      totalMs: total
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

  // Render 12-Hour Physical Stage Ruler (Hours 01 to 12)
  function renderHourRuler(currentHour, hoursElapsed) {
    let html = '';
    for (let hr = 1; hr <= 12; hr++) {
      const isPast = hr <= hoursElapsed;
      const isCurrent = hr === currentHour;
      let cls = 'ruler-step';
      if (isPast) cls += ' is-past';
      else if (isCurrent) cls += ' is-current';
      else cls += ' is-future';

      html += `
        <div class="${cls}">
          <span class="ruler-num">${pad(hr)}</span>
          ${isCurrent ? '<span class="ruler-now-tag">NOW</span>' : ''}
        </div>
      `;
    }
    return html;
  }

  // Render Live Marathon Hours Timer (Bespoke Stage Chrono - No generic card clutter)
  function renderLiveHoursTimer(container, state, isProjector) {
    const elapsed = state.elapsedMs || 0;
    const total = state.totalMs || (12 * 3600 * 1000);
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
    const hoursElapsed = Math.floor(elapsed / (3600 * 1000));
    const minutesElapsed = Math.floor((elapsed % (3600 * 1000)) / 60000);
    const secondsElapsed = Math.floor((elapsed % 60000) / 1000);
    const currentHour = Math.min(12, hoursElapsed + 1);

    const existingChrono = container.querySelector('.marathon-stage-board--live-chrono');
    if (existingChrono) {
      const hoursEl = existingChrono.querySelector('.chrono-hours-digit');
      const hoursLabelEl = existingChrono.querySelector('.chrono-hours-label');
      const runningEl = existingChrono.querySelector('.chrono-running-digits');
      const editionBadge = existingChrono.querySelector('.chrono-edition-badge');
      const contextEl = existingChrono.querySelector('.chrono-context-text');
      const scaleFill = existingChrono.querySelector('.chrono-scale-fill');
      const rulerTrack = existingChrono.querySelector('.chrono-ruler-track');
      const metaDone = existingChrono.querySelector('.chrono-meta-done');
      const metaLeft = existingChrono.querySelector('.chrono-meta-left');

      if (hoursEl && hoursEl.textContent !== String(hoursElapsed)) hoursEl.textContent = String(hoursElapsed);
      if (hoursLabelEl && hoursLabelEl.textContent !== (hoursElapsed === 1 ? 'HOUR' : 'HOURS')) {
        hoursLabelEl.textContent = hoursElapsed === 1 ? 'HOUR' : 'HOURS';
      }
      if (runningEl) runningEl.textContent = `${pad(minutesElapsed)}m ${pad(secondsElapsed)}s`;
      if (editionBadge) editionBadge.textContent = `HOUR ${currentHour} OF 12`;
      if (contextEl) contextEl.innerHTML = `INTO HOUR <strong>${currentHour}</strong>`;
      if (scaleFill) scaleFill.style.width = `${pct}%`;
      if (metaDone) metaDone.textContent = `${hoursElapsed} ${hoursElapsed === 1 ? 'Hour Down' : 'Hours Down'}`;
      if (metaLeft) metaLeft.textContent = (12 - hoursElapsed > 0) ? `${12 - hoursElapsed}h Left` : 'Final Hour';

      if (rulerTrack && rulerTrack.dataset.currentHour !== String(currentHour)) {
        rulerTrack.dataset.currentHour = String(currentHour);
        rulerTrack.innerHTML = renderHourRuler(currentHour, hoursElapsed);
      }

      attachToolbarEvents(container, isProjector);
      return;
    }

    container.innerHTML = `
      <div class="marathon-stage-board marathon-stage-board--live-chrono">
        ${isProjector ? `
        <div class="projector-brand-header">
          <img src="/assets/apnw-c.png" alt="All Play No Work" class="projector-logo-img" width="140" height="140" />
        </div>
        ` : ''}

        <!-- Top Header Strip: Clean Live Stage Chrono Status -->
        <div class="chrono-header-strip">
          <div class="chrono-cue-wrap">
            <span class="chrono-cue-lamp" aria-hidden="true"></span>
            <span class="chrono-cue-text">LIVE STAGE CHRONO</span>
          </div>
          <div class="chrono-edition-wrap">
            <span class="chrono-edition-badge">HOUR ${currentHour} OF 12</span>
          </div>
        </div>

        <!-- Hero Counter: Massive, Sculptural Hours Display -->
        <div class="chrono-hero-face">
          <div class="chrono-primary-block">
            <span class="chrono-hours-digit" data-unit="hours">${hoursElapsed}</span>
            <span class="chrono-hours-label">${hoursElapsed === 1 ? 'HOUR' : 'HOURS'}</span>
          </div>

          <div class="chrono-sub-block">
            <div class="chrono-running-row">
              <span class="chrono-running-digits" data-unit="running">${pad(minutesElapsed)}m ${pad(secondsElapsed)}s</span>
              <span class="chrono-running-tag">LIVE ON STAGE</span>
            </div>
            <div class="chrono-context-row">
              <span class="chrono-context-text">INTO HOUR <strong>${currentHour}</strong></span>
            </div>
          </div>
        </div>

        <!-- 12-Hour Physical Stage Ruler & Scale -->
        <div class="chrono-ruler-wrap" aria-label="12-Hour Marathon Timeline">
          <div class="chrono-ruler-track" data-current-hour="${currentHour}">
            ${renderHourRuler(currentHour, hoursElapsed)}
          </div>
          <div class="chrono-scale-track">
            <div class="chrono-scale-fill" style="width: ${pct}%;"></div>
          </div>
          <div class="chrono-ruler-meta">
            <span class="chrono-meta-done">${hoursElapsed} ${hoursElapsed === 1 ? 'Hour Down' : 'Hours Down'}</span>
            <span class="chrono-meta-range">2 PM → 2 AM</span>
            <span class="chrono-meta-left">${12 - hoursElapsed > 0 ? `${12 - hoursElapsed}h Left` : 'Final Hour'}</span>
          </div>
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
          ${rehearsalEndTime ? `
            <button type="button" class="btn-stage-tool btn-stage-tool--return js-reset-rehearsal" title="Return to real-world live timer">
              ↺ Return to Live Timer
            </button>
          ` : ''}
        </div>
        `}
      </div>
    `;

    attachToolbarEvents(container, isProjector);
  }

  // Theatrical Climax in Final Seconds to Hour 12 Completion
  function renderHour12Climax(container, diffMs, isProjector) {
    const totalSecs = Math.max(0, Math.floor(diffMs / 1000));
    const existingClimax = container.querySelector('.theatre-call-card--hour12-climax');
    if (existingClimax) {
      const numEl = existingClimax.querySelector('.theatre-call-num');
      if (numEl) numEl.textContent = totalSecs;
      if (lastBeepSec !== totalSecs) {
        lastBeepSec = totalSecs;
        playCountdownBeep(520 + (10 - totalSecs) * 44, 0.14);
      }
      return;
    }

    container.innerHTML = `
      <div class="theatre-call-card theatre-call-card--hour12-climax">
        ${isProjector ? `
        <div class="projector-brand-header">
          <img src="/assets/apnw-c.png" alt="All Play No Work" class="projector-logo-img" width="140" height="140" />
        </div>
        ` : ''}
        <div class="theatre-call-badge">
          <span class="theatre-sticker theatre-sticker--accent">FINAL SECONDS TO HOUR 12</span>
        </div>
        <div class="theatre-call-countdown">
          <span class="theatre-call-num">${totalSecs}</span>
          <span class="theatre-call-unit">SECONDS TO 12-HOUR COMPLETION</span>
        </div>
        <p class="theatre-call-sub">
          Places for the final curtain! <strong>12 straight hours</strong> of unscripted improv in Bangalore!
        </p>
      </div>
    `;

    if (lastBeepSec !== totalSecs) {
      lastBeepSec = totalSecs;
      playCountdownBeep(520 + (10 - totalSecs) * 44, 0.14);
    }
  }

  const TYPEWRITER_QUOTE = "12 hour of all play no work no play all work work all no play play it on the work ughhh whatever the f***\nanyways thank you, for being here. see you again soon";

  function startTypewriter(el, text) {
    if (!el || el.dataset.typed === '1') return;
    const content = el.querySelector('.typewriter-content');
    if (!content) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      content.textContent = text;
      el.dataset.typed = '1';
      return;
    }

    el.dataset.typed = '1';
    content.textContent = '';
    let i = 0;

    function step() {
      if (i < text.length) {
        const char = text.charAt(i);
        content.textContent += char;
        i++;

        let delay = 75; // Much slower, deliberate mechanical typewriter pace
        if (char === '\n') {
          delay = 700; // Dramatic pause before "thank you."
        } else if (char === '*' && text.charAt(i) !== '*') {
          delay = 300; // Pause after the asterisk sequence
        }
        setTimeout(step, delay);
      }
    }

    setTimeout(step, 200);
  }

  // Special Thing at Completing Hour 12: Typewriter Style Finale
  function renderHour12Completion(container, isProjector) {
    const existingCompleted = container.querySelector('.marathon-stage-board--completed-finale');
    if (existingCompleted) {
      attachToolbarEvents(container, isProjector);
      return;
    }

    container.innerHTML = `
      <div class="marathon-stage-board marathon-stage-board--completed-finale">
        ${isProjector ? `
        <div class="projector-brand-header">
          <img src="/assets/apnw-c.png" alt="All Play No Work" class="projector-logo-img" width="140" height="140" />
        </div>
        ` : ''}

        <div class="finale-layout">

          <!-- Typewriter Message: Pure unscripted marathon delirium -->
          <div class="finale-typewriter-card">
            <p class="finale-typewriter-text"><span class="typewriter-content">${TYPEWRITER_QUOTE}</span><span class="typewriter-cursor" aria-hidden="true">▌</span></p>
          </div>

          <div class="finale-actions">
            <button type="button" class="btn-apnw-primary js-retrigger-celebration" style="cursor: pointer;">
              ★ Sound the Fanfare &amp; Confetti
            </button>
            <a class="btn-apnw-ghost" href="https://chat.whatsapp.com/CRv3J3K0xRG8iQnTBI4hMa" target="_blank" rel="noopener">
              Join WhatsApp Community ↗
            </a>
            ${testHour12Mode ? `
            <button type="button" class="btn-stage-tool btn-stage-tool--return js-reset-hour12" title="Return to live hours timer">
              ↺ Return to Stage Chrono
            </button>
            ` : ''}
          </div>
        </div>

        ${isProjector ? '' : `
        <div class="stage-controls-strip">
          <button type="button" class="btn-stage-tool js-toggle-projector" title="Fullscreen Projector View (Shift+P)">
            ⛶ Projector View
          </button>
          <button type="button" class="btn-stage-tool js-toggle-sound" title="Toggle audio cues">
            ${soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
          </button>
        </div>
        `}
      </div>
    `;

    startTypewriter(container.querySelector('.finale-typewriter-text'), TYPEWRITER_QUOTE);
    attachToolbarEvents(container, isProjector);
  }

  // Trigger celebration effects for Hour 12 completion
  function triggerHour12Celebration() {
    triggerStageFlash();
    fireConfetti();
    playKickoffFanfare();
  }

  // Toggle Hour 12 Completed Mode for preview/testing
  function toggleTestHour12() {
    getAudioCtx();
    testHour12Mode = !testHour12Mode;
    rehearsalEndTime = null;
    hour12ClimaxEndTime = null;
    testTurnoverMode = false;
    test1pmMode = false;

    const c = document.getElementById(COUNTDOWN_CONTAINER_ID);
    if (c) c.innerHTML = '';
    const pt = document.getElementById('projector-overlay-target');
    if (pt) pt.innerHTML = '';

    if (testHour12Mode) {
      triggerHour12Celebration();
    }
    updateFestivalUI();
  }

  function resetHour12Test() {
    testHour12Mode = false;
    hour12ClimaxEndTime = null;
    const c = document.getElementById(COUNTDOWN_CONTAINER_ID);
    if (c) c.innerHTML = '';
    const pt = document.getElementById('projector-overlay-target');
    if (pt) pt.innerHTML = '';
    updateFestivalUI();
  }

  // Start a 5-second countdown climax into Hour 12 completion
  function startHour12Climax(seconds) {
    getAudioCtx();
    testHour12Mode = false;
    rehearsalEndTime = null;
    lastBeepSec = null;
    hasCelebratedHour12 = false;
    hour12ClimaxEndTime = Date.now() + (seconds || 5) * 1000;

    const c = document.getElementById(COUNTDOWN_CONTAINER_ID);
    if (c) c.innerHTML = '';
    const pt = document.getElementById('projector-overlay-target');
    if (pt) pt.innerHTML = '';

    updateFestivalUI();
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

    const testHour12Btn = container.querySelector('.js-trigger-test-hour12');
    if (testHour12Btn && !testHour12Btn.dataset.bound) {
      testHour12Btn.dataset.bound = '1';
      testHour12Btn.addEventListener('click', toggleTestHour12);
    }

    const resetHour12Btn = container.querySelector('.js-reset-hour12');
    if (resetHour12Btn && !resetHour12Btn.dataset.bound) {
      resetHour12Btn.dataset.bound = '1';
      resetHour12Btn.addEventListener('click', resetHour12Test);
    }

    const retriggerCelebrationBtn = container.querySelector('.js-retrigger-celebration');
    if (retriggerCelebrationBtn && !retriggerCelebrationBtn.dataset.bound) {
      retriggerCelebrationBtn.dataset.bound = '1';
      retriggerCelebrationBtn.addEventListener('click', () => {
        getAudioCtx();
        triggerHour12Celebration();
        const twText = container.querySelector('.finale-typewriter-text');
        if (twText) {
          twText.dataset.typed = '0';
          startTypewriter(twText, TYPEWRITER_QUOTE);
        }
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
    testHour12Mode = false;
    hour12ClimaxEndTime = null;
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
    testHour12Mode = false;
    hour12ClimaxEndTime = null;
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
    } else if (hour12ClimaxEndTime !== null) {
      const remainingClimax = hour12ClimaxEndTime - now;
      if (remainingClimax > 0) {
        effectiveNow = FESTIVAL_END - remainingClimax;
      } else {
        effectiveNow = FESTIVAL_END + 1000;
        hour12ClimaxEndTime = null;
      }
    }

    const state = getFestivalState(effectiveNow);

    // Remove other hero text when festival is live/completed or in 1:00 PM final countdown
    const isOnePmFinalHour = (effectiveNow >= ONE_PM_TIMESTAMP && effectiveNow < FESTIVAL_START) || test1pmMode;
    const isFestivalLiveOrDone = state.type !== 'COUNTDOWN';
    const shouldRemoveOtherHeroText = isOnePmFinalHour || isFestivalLiveOrDone;

    const heroSplit = document.querySelector('.marathon-hero-split');
    const heroWrap = document.querySelector('.marathon-hero-wrap');
    if (shouldRemoveOtherHeroText) {
      if (heroSplit) heroSplit.classList.add('marathon-hero-split--timer-only');
      if (heroWrap) heroWrap.classList.add('marathon-hero-wrap--timer-only');
      document.body.classList.add('hero-mode-1pm');
    } else {
      if (heroSplit) heroSplit.classList.remove('marathon-hero-split--timer-only');
      if (heroWrap) heroWrap.classList.remove('marathon-hero-wrap--timer-only');
      document.body.classList.remove('hero-mode-1pm');
    }

    // Check if crossing zero kickoff right now
    if (state.type !== 'COUNTDOWN' && !hasCelebrated && !celebrationDismissed && !testTurnoverMode && !testHour12Mode) {
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
      } else if (state.type === 'CLIMAX_12') {
        renderHour12Climax(el, state.diff, isProjector);
      } else if (state.type === 'COMPLETED_12') {
        if (!hasCelebratedHour12) {
          hasCelebratedHour12 = true;
          triggerHour12Celebration();
        }
        renderHour12Completion(el, isProjector);
      } else {
        renderLiveHoursTimer(el, state, isProjector);
      }
    });
  }

  // Auto-check URL for ?testKickoff=1 or ?rehearse=1 or ?projector=1 or ?testHour12=1 or ?testClimax=1
  function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('testHour12') || params.has('hour12') || params.has('complete12')) {
      toggleTestHour12();
    }
    if (params.has('testClimax') || params.has('climax')) {
      startHour12Climax(5);
    }
    if (params.has('testKickoff') || params.has('rehearse')) {
      startRehearsal(5);
    }
    if (params.has('testTurnover')) {
      setTimeout(() => testTurnover(), 600);
    }
    if (params.has('test1pm') || params.has('onePm')) {
      setTimeout(() => toggleTest1pm(), 600);
    }
    if (params.has('projector')) {
      toggleProjectorMode();
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
      if (e.shiftKey && (e.key === 'H' || e.key === 'h' || e.key === '@' || e.key === '2')) {
        toggleTestHour12();
      }
      if (e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        startHour12Climax(5);
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
    toggleTestHour12,
    resetHour12Test,
    startHour12Climax,
    triggerHour12Celebration,
    testTurnover,
    toggleTest1pm,
    resetRehearsal,
    toggleProjectorMode,
    getFestivalState
  };
})();
