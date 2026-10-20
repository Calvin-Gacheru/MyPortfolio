/* ═══════════════════════════════════════════════════════════════
   CALVIN GACHERU MWANGI — Portfolio Script
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer   = window.matchMedia('(hover: hover) and (pointer: fine)');

/* ──────────────────────────────────────────
   0. THEME TOGGLE — light/dark with storage
─────────────────────────────────────────── */
(function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!toggle) return;

  const storageKey = 'portfolio-theme';
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

  applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark', false);

  toggle.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
  });

  mediaQuery.addEventListener?.('change', (event) => {
    if (readSavedTheme()) return;
    applyTheme(event.matches ? 'light' : 'dark', false);
  });

  function readSavedTheme() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }

  function applyTheme(theme, persist) {
    const isLight = theme === 'light';
    root.dataset.theme = theme;
    const label = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    metaTheme?.setAttribute('content', isLight ? '#F3F5F1' : '#0A0C0F');

    if (!persist) return;
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Ignore storage failures in private/restricted modes.
    }
  }
})();


/* ──────────────────────────────────────────
   1. NAV — mobile menu, active section, indicator
─────────────────────────────────────────── */
(function initNav() {
  const navBar   = document.querySelector('.nav-bar');
  const menu     = document.getElementById('nav-menu');
  const toggle   = document.getElementById('menu-toggle');
  const links    = [...document.querySelectorAll('.nav-link')];
  const indicator = document.querySelector('.nav-indicator');
  if (!navBar || !menu || !toggle) return;

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  links.forEach(link => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !navBar.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (!menu.classList.contains('open')) return;
    if (e.key === 'Escape') {
      setOpen(false);
      toggle.focus();
      return;
    }
    // Keep keyboard focus inside the nav while the mobile menu is open
    if (e.key === 'Tab') {
      const focusables = [...navBar.querySelectorAll('a[href], button')].filter(el => el.offsetParent !== null);
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Close the mobile menu if the viewport grows past the breakpoint
  window.matchMedia('(min-width: 880px)').addEventListener?.('change', (e) => { if (e.matches) setOpen(false); });

  // Active section tracking
  const sections = links
    .map(link => document.getElementById(link.dataset.section))
    .filter(Boolean);

  const setActive = (id) => {
    let activeLink = null;
    links.forEach(link => {
      const isActive = link.dataset.section === id;
      link.classList.toggle('active', isActive);
      if (isActive) { link.setAttribute('aria-current', 'location'); activeLink = link; }
      else link.removeAttribute('aria-current');
    });
    moveIndicator(activeLink);
  };

  function moveIndicator(link) {
    if (!indicator) return;
    if (!link) { indicator.style.setProperty('--ind-o', '0'); return; }
    indicator.style.setProperty('--ind-x', `${link.offsetLeft}px`);
    indicator.style.setProperty('--ind-w', `${link.offsetWidth}px`);
    indicator.style.setProperty('--ind-o', '1');
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(sec => observer.observe(sec));

  // Clear the highlight while the hero is in view
  const hero = document.getElementById('home');
  if (hero) {
    new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActive(null); },
      { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
  }

  window.addEventListener('resize', () => moveIndicator(links.find(l => l.classList.contains('active'))), { passive: true });
})();


/* ──────────────────────────────────────────
   2. REVEAL — fade-up on scroll, staggered
─────────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  items.forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    el.style.setProperty('--delay', `${(idx % 4) * 80}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      // Drop the stagger delay once revealed so hover transitions stay snappy
      el.addEventListener('transitionend', () => el.style.removeProperty('--delay'), { once: true });
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────
   3. METRICS — count up when visible
─────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.count[data-count]');
  if (!counters.length || reducedMotion.matches) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = String(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(el => {
    el.textContent = '0';
    observer.observe(el);
  });
})();


/* ──────────────────────────────────────────
   4. GLASS SHEEN + MAGNETIC BUTTONS
─────────────────────────────────────────── */
(function initPointerEffects() {
  if (!finePointer.matches) return;

  document.addEventListener('pointermove', (e) => {
    const surface = e.target.closest?.('.tile, .case, .cert, .contact');
    if (!surface) return;
    const rect = surface.getBoundingClientRect();
    surface.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    surface.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, { passive: true });

  if (reducedMotion.matches) return;

  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      btn.style.transform = `translate(${dx * 6}px, ${dy * 5}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
})();


/* ──────────────────────────────────────────
   5. PROJECT INDEX — category filter
─────────────────────────────────────────── */
(function initFilters() {
  const buttons = document.querySelectorAll('.filter[data-filter]');
  const rows    = document.querySelectorAll('#project-index .row');
  const status  = document.getElementById('filter-status');
  if (!buttons.length || !rows.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));

      let shown = 0;
      rows.forEach(row => {
        const match = filter === 'all' || row.dataset.cat === filter;
        row.hidden = !match;
        row.classList.remove('is-entering');
        if (match) {
          shown++;
          if (!reducedMotion.matches) {
            void row.offsetWidth; // restart animation
            row.classList.add('is-entering');
            row.style.animationDelay = `${Math.min(shown - 1, 8) * 40}ms`;
          }
        }
      });

      if (status) {
        const label = filter === 'all' ? '' : ` in ${btn.textContent.trim()}`;
        status.textContent = `Showing ${shown} project${shown === 1 ? '' : 's'}${label}`;
      }
    });
  });
})();


/* ──────────────────────────────────────────
   6. CERTIFICATE DIALOG — accessible PDF preview
─────────────────────────────────────────── */
(function initCertDialog() {
  const dialog   = document.getElementById('cert-dialog');
  const title    = document.getElementById('cert-dialog-title');
  const openLink = document.getElementById('cert-open');
  const closeBtn = document.getElementById('cert-close');
  const triggers = document.querySelectorAll('[data-cert]');
  if (!dialog || !triggers.length) return;

  if (typeof dialog.showModal !== 'function') {
    triggers.forEach(btn => btn.addEventListener('click', () => window.open(btn.dataset.cert, '_blank', 'noopener')));
    return;
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.cert;
      title.textContent = btn.dataset.certTitle || 'Certificate';
      openLink.href = src;

      // Swap the <object> so browsers reliably load the new PDF
      const oldPdf = document.getElementById('cert-pdf');
      const newPdf = oldPdf.cloneNode(true);
      newPdf.data = src;
      oldPdf.replaceWith(newPdf);

      dialog.showModal();
    });
  });

  closeBtn?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
})();


/* ──────────────────────────────────────────
   7. COPY EMAIL
─────────────────────────────────────────── */
(function initCopyEmail() {
  const btn = document.getElementById('copy-email');
  const status = document.getElementById('copy-status');
  if (!btn) return;
  const label = btn.querySelector('.copy-label');
  let timer;

  btn.addEventListener('click', async () => {
    const email = btn.dataset.email;
    let ok = false;
    try {
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch {
      const field = Object.assign(document.createElement('textarea'), { value: email });
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(field);
      field.select();
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      field.remove();
    }

    label.textContent = ok ? 'Copied!' : 'Copy failed';
    status.textContent = ok ? 'Email address copied to clipboard' : 'Could not copy — email is ' + email;
    btn.classList.toggle('is-copied', ok);
    clearTimeout(timer);
    timer = setTimeout(() => {
      label.textContent = 'Copy email';
      btn.classList.remove('is-copied');
    }, 2200);
  });
})();


/* ──────────────────────────────────────────
   8. HERO FIELD — data points that cluster
      around the cursor and link into an agent graph
─────────────────────────────────────────── */
(function initHeroField() {
  const canvas = document.getElementById('hero-field');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;

  let w = 0, h = 0, dpr = 1;
  let points = [];
  let pulses = [];
  let colors = {};
  let running = false;
  let rafId = 0;
  let lastPulse = 0;

  const pointer = { x: 0, y: 0, active: false, lastMove: 0 };
  const hub = { x: 0, y: 0 };

  const RADIUS = () => Math.min(260, Math.max(160, w * 0.2));
  const LINK_DIST = 95;
  const HUB_LINKS = 7;

  function readColors() {
    const s = getComputedStyle(document.documentElement);
    colors = {
      viz:    s.getPropertyValue('--viz').trim() || '#7DD3FC',
      signal: s.getPropertyValue('--signal-text').trim() || '#B8F35A',
      muted:  s.getPropertyValue('--muted').trim() || '#97A1AC',
    };
  }

  function rgba(hex, a) {
    const m = hex.replace('#', '');
    const n = parseInt(m.length === 3 ? m.split('').map(c => c + c).join('') : m, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round(Math.min(240, Math.max(70, (w * h) / 6500)));
    points = Array.from({ length: count }, () => {
      const x = Math.random() * w, y = Math.random() * h;
      return {
        hx: x, hy: y, x, y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.5,
        amp: 6 + Math.random() * 14,
        r: 0.8 + Math.random() * 1.4,
        inf: 0,
      };
    });
    pulses = [];
    if (!pointer.active) { hub.x = w * 0.68; hub.y = h * 0.45; }
  }

  function wanderTarget(t) {
    // Lissajous path biased to the right so it doesn't sit under the headline
    return {
      x: w * (0.68 + 0.18 * Math.sin(t * 0.00023)),
      y: h * (0.46 + 0.22 * Math.sin(t * 0.00031 + 1.3)),
    };
  }

  function step(t) {
    // Hub eases toward the pointer, or wanders when idle
    const idle = !pointer.active || t - pointer.lastMove > 2500;
    const target = idle ? wanderTarget(t) : pointer;
    hub.x += (target.x - hub.x) * (idle ? 0.02 : 0.12);
    hub.y += (target.y - hub.y) * (idle ? 0.02 : 0.12);

    const R = RADIUS();
    for (const p of points) {
      const bx = p.hx + Math.cos(t * 0.0004 * p.speed + p.phase) * p.amp;
      const by = p.hy + Math.sin(t * 0.0005 * p.speed + p.phase) * p.amp;
      const dx = bx - hub.x, dy = by - hub.y;
      const d = Math.hypot(dx, dy);
      const inf = d < R ? Math.pow(1 - d / R, 1.5) : 0;
      // Pull toward the hub, but keep a ring of spread so it reads as a cluster
      const pull = inf * 0.55;
      const tx = bx - dx * pull;
      const ty = by - dy * pull;
      p.x += (tx - p.x) * 0.08;
      p.y += (ty - p.y) * 0.08;
      p.inf += (inf - p.inf) * 0.1;
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);

    const active = points.filter(p => p.inf > 0.12);

    // Neighbour links inside the cluster
    ctx.lineWidth = 1;
    for (let i = 0; i < active.length; i++) {
      const a = active[i];
      for (let j = i + 1; j < active.length; j++) {
        const b = active[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > LINK_DIST) continue;
        const alpha = (1 - d / LINK_DIST) * Math.min(a.inf, b.inf) * 0.7;
        ctx.strokeStyle = rgba(colors.viz, alpha);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }

    // Hub ("agent") links to its nearest nodes ("tools")
    const hubLinks = active
      .map(p => ({ p, d: Math.hypot(p.x - hub.x, p.y - hub.y) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, HUB_LINKS);

    for (const { p } of hubLinks) {
      ctx.strokeStyle = rgba(colors.signal, 0.35 * p.inf + 0.1);
      ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    }

    // Points
    for (const p of points) {
      const alpha = 0.22 + p.inf * 0.7;
      ctx.fillStyle = p.inf > 0.35 ? rgba(colors.signal, alpha) : rgba(colors.viz, alpha);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r + p.inf * 1.6, 0, Math.PI * 2); ctx.fill();
    }

    // Pulses travelling hub → tool and back
    if (t && hubLinks.length && t - lastPulse > 260) {
      const pick = hubLinks[Math.floor(Math.random() * hubLinks.length)].p;
      pulses.push({ p: pick, t: 0, out: Math.random() > 0.35 });
      lastPulse = t;
    }
    pulses = pulses.filter(pl => pl.t <= 1);
    for (const pl of pulses) {
      pl.t += 0.028;
      const k = pl.out ? pl.t : 1 - pl.t;
      const x = hub.x + (pl.p.x - hub.x) * k;
      const y = hub.y + (pl.p.y - hub.y) * k;
      ctx.fillStyle = rgba(colors.signal, 1 - Math.abs(0.5 - pl.t));
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
    }

    // Hub node
    const pulse = t ? (Math.sin(t * 0.003) + 1) / 2 : 0.5;
    ctx.strokeStyle = rgba(colors.signal, 0.25 + pulse * 0.2);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(hub.x, hub.y, 14 + pulse * 6, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = rgba(colors.signal, 0.95);
    ctx.beginPath(); ctx.arc(hub.x, hub.y, 4, 0, Math.PI * 2); ctx.fill();
  }

  function frame(t) {
    step(t);
    draw(t);
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reducedMotion.matches) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  function renderStatic() {
    // Settle the field once and draw a single frame
    hub.x = w * 0.68; hub.y = h * 0.45;
    for (let i = 0; i < 80; i++) step(0);
    hub.x = w * 0.68; hub.y = h * 0.45;
    draw(0);
  }

  readColors();
  resize();

  hero.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
    pointer.lastMove = performance.now();
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.active = false; });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      if (reducedMotion.matches) renderStatic();
    }, 150);
  }, { passive: true });

  // Re-read colours when the theme flips
  new MutationObserver(() => {
    readColors();
    if (!running) renderStatic();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Only animate while the hero is on screen and the tab is visible
  let heroVisible = true;
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    heroVisible && !document.hidden ? start() : stop();
  }).observe(hero);
  document.addEventListener('visibilitychange', () => {
    document.hidden || !heroVisible ? stop() : start();
  });

  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) { stop(); renderStatic(); }
    else if (heroVisible) start();
  });

  if (reducedMotion.matches) renderStatic();
  else start();
})();


/* ──────────────────────────────────────────
   9. FOOTER YEAR
─────────────────────────────────────────── */
(function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
})();
