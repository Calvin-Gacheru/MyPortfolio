/* ═══════════════════════════════════════════════════════════════
   CALVIN GACHERU MWANGI — Portfolio Script
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   0. THEME TOGGLE — light/dark with storage
─────────────────────────────────────────── */
(function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const storageKey = 'portfolio-theme';
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

  const savedTheme = readSavedTheme();
  const initialTheme = savedTheme || (mediaQuery.matches ? 'light' : 'dark');
  applyTheme(initialTheme, false);

  toggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme, true);
  });

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', (event) => {
      if (readSavedTheme()) return;
      applyTheme(event.matches ? 'light' : 'dark', false);
    });
  }

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
    root.dataset.theme = isLight ? 'light' : 'dark';
    toggle.setAttribute('aria-pressed', String(isLight));
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    toggle.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');

    if (!persist) return;

    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Ignore storage failures in private/restricted modes.
    }
  }
})();

/* ──────────────────────────────────────────
   1. NAVBAR — scroll shadow + active section
─────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-links');
  const sections  = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  }, { passive: true });

  function highlightActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= 90) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = target.getBoundingClientRect().top + window.scrollY - 68;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  highlightActiveLink();
})();


/* ──────────────────────────────────────────
   2. SKILL BARS — animate on intersection
─────────────────────────────────────────── */
(function initSkillBars() {
  const resumeSection = document.getElementById('resume');
  if (!resumeSection) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateBars();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.12 }
  );

  observer.observe(resumeSection);

  function animateBars() {
    const items = document.querySelectorAll('.skill-item');
    items.forEach((item, idx) => {
      const pct = item.getAttribute('data-pct');
      const bar = item.querySelector('.skill-bar');
      if (!bar || !pct) return;
      setTimeout(() => { bar.style.width = pct + '%'; }, idx * 100);
    });
  }
})();


/* ──────────────────────────────────────────
   3. REVEAL ANIMATIONS — fade-up on scroll
─────────────────────────────────────────── */
(function initReveal() {
  const targets = [
    '.resume-card', '.pcard', '.about-text', '.about-image-wrap',
    '.tl-item', '.meta-item', '.chip', '.contact-card',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.classList.add('reveal'));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement?.children || []);
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('visible'), idx * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────
   4. LOGO — scroll to top
─────────────────────────────────────────── */
(function initLogoClick() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ──────────────────────────────────────────
   5. PORTFOLIO CARD — 3D tilt on hover
─────────────────────────────────────────── */
(function initCardTilt() {
  document.querySelectorAll('.pcard:not(.cert-card)').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const cx   = rect.width  / 2;
      const cy   = rect.height / 2;
      const rotX = ((y - cy) / cy) * -4;
      const rotY = ((x - cx) / cx) *  4;
      card.style.transform = `translateY(-4px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();


/* ──────────────────────────────────────────
   6. CERTIFICATION CARDS — click to flip
─────────────────────────────────────────── */
(function initCertificationCards() {
  const cards = document.querySelectorAll('.cert-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const inner = card.querySelector('.cert-card-inner');
    const faces = card.querySelectorAll('.cert-face');

    const syncCardHeight = () => {
      if (!inner || !faces.length) return;

      let maxHeight = 0;
      faces.forEach(face => {
        maxHeight = Math.max(maxHeight, face.scrollHeight);
      });

      const height = Math.ceil(maxHeight);
      if (height > 0) {
        inner.style.minHeight = `${height}px`;
        card.style.minHeight = `${height}px`;
      }
    };

    const previews = card.querySelectorAll('.cert-preview');
    previews.forEach(preview => {
      const image = preview.querySelector('.cert-image');
      if (!image) return;

      const onLoad = () => {
        if (image.naturalWidth > 0) preview.classList.remove('is-missing');
        syncCardHeight();
      };

      const onError = () => {
        preview.classList.add('is-missing');
        syncCardHeight();
      };

      image.addEventListener('load', onLoad);
      image.addEventListener('error', onError);

      if (image.complete) {
        if (image.naturalWidth > 0) onLoad();
        else onError();
      }
    });

    syncCardHeight();
    window.addEventListener('resize', syncCardHeight);

    const toggleCard = () => {
      const isFlipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(isFlipped));
    };

    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button, .cert-preview, .cert-pdf')) return;
      toggleCard();
    });

    card.querySelectorAll('[data-cert-toggle]').forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleCard();
      });
    });

    card.addEventListener('keydown', (event) => {
      const isToggleKey = event.key === 'Enter' || event.key === ' ';
      if (!isToggleKey) return;
      if (event.target.closest('a, button')) return;

      event.preventDefault();
      toggleCard();
    });
  });
})();


document.addEventListener('click', (e) => {
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');

  // Ensure menu is open and the click wasn't on the hamburger button
  if (navLinks.classList.contains('open') && !hamburger.contains(e.target)) {
    
    // Close if clicking outside the nav, exactly on the nav (the backdrop), or on a link
    if (!navLinks.contains(e.target) || e.target === navLinks || e.target.closest('.nav-link')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  }
});
