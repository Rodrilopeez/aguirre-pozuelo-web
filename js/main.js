/* =================================================================
   AGUIRRE POZUELO — Editorial Redesign
   ================================================================= */

(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isReduced = () => reducedMotion.matches;

  document.documentElement.classList.add('js');

  /* ============================================================
     LOADER (only first visit, localStorage)
     ============================================================ */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    const seen = sessionStorage.getItem('aguirre-loader-seen');

    if (seen || isReduced()) {
      loader.classList.add('is-hidden');
      setTimeout(() => loader.remove(), 50);
      onLoaderDone();
      return;
    }

    // Sweep animation defined in CSS: ~900ms total
    setTimeout(() => {
      loader.classList.add('is-hidden');
      sessionStorage.setItem('aguirre-loader-seen', '1');
      setTimeout(() => loader.remove(), 500);
      onLoaderDone();
    }, 1100);
  }

  function onLoaderDone() {
    const hero = document.getElementById('hero');
    if (hero) hero.classList.add('is-loaded');
  }

  /* ============================================================
     HERO TITLE WORD-SPLIT (CSS-driven stagger)
     ============================================================ */
  function splitHeroTitle() {
    const title = document.querySelector('.hero__title[data-split]');
    if (!title) return;
    const html = title.innerHTML;
    // Wrap each word in a span without breaking <em>...</em>
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    function wrapWords(node) {
      const out = [];
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = child.textContent.split(/(\s+)/);
          parts.forEach((p) => {
            if (/^\s+$/.test(p)) {
              out.push(document.createTextNode(p));
            } else if (p.length) {
              const span = document.createElement('span');
              span.className = 'word';
              span.textContent = p;
              out.push(span);
            }
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          // recursively wrap inside (preserves <em>)
          const clone = child.cloneNode(false);
          const parts = child.textContent.split(/(\s+)/);
          parts.forEach((p) => {
            if (/^\s+$/.test(p)) {
              clone.appendChild(document.createTextNode(p));
            } else if (p.length) {
              const span = document.createElement('span');
              span.className = 'word';
              span.textContent = p;
              clone.appendChild(span);
            }
          });
          out.push(clone);
        }
      });
      return out;
    }
    const wrapped = wrapWords(tmp);
    title.innerHTML = '';
    wrapped.forEach((n) => title.appendChild(n));

    // Apply stagger via CSS variable
    const words = title.querySelectorAll('.word');
    words.forEach((w, i) => {
      w.style.transitionDelay = `${0.35 + i * 0.08}s`;
    });
  }

  /* ============================================================
     HEADER scrolled state
     ============================================================ */
  function initHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    let ticking = false;

    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 80);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    update();
  }

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('mobileNav');
    if (!toggle || !nav) return;

    const links = nav.querySelectorAll('a');

    const close = () => {
      toggle.classList.remove('is-open');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      toggle.classList.toggle('is-open', open);
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    links.forEach((l) => l.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
    });
  }

  /* ============================================================
     HERO SLIDER (cross-fade + auto + pagination + counter + swipe)
     ============================================================ */
  function initHeroSlider() {
    const slidesEl = document.getElementById('heroSlides');
    if (!slidesEl) return;
    const slides = Array.from(slidesEl.querySelectorAll('.hero__slide'));
    if (slides.length < 2) return;

    const pagBtns = Array.from(document.querySelectorAll('.hero__pag-btn'));
    const counterCurrent = document.getElementById('heroCounterCurrent');
    const counterTotal = document.getElementById('heroCounterTotal');
    if (counterTotal) counterTotal.textContent = String(slides.length).padStart(2, '0');

    let current = 0;
    let timer = null;
    const DURATION = 7000;
    const hero = document.getElementById('hero');

    function goTo(idx) {
      if (idx === current) return;
      slides[current].classList.remove('is-active');
      pagBtns[current]?.classList.remove('is-active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      pagBtns[current]?.classList.add('is-active');
      if (counterCurrent) counterCurrent.textContent = String(current + 1).padStart(2, '0');
      resetTimer();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function resetTimer() {
      clearInterval(timer);
      if (!isReduced()) timer = setInterval(next, DURATION);
    }

    pagBtns.forEach((b) => b.addEventListener('click', () => goTo(parseInt(b.dataset.slide, 10))));

    // Swipe
    let touchStartX = 0;
    hero.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) (diff > 0 ? next : prev)();
    });

    // Pause on hover
    hero.addEventListener('mouseenter', () => clearInterval(timer));
    hero.addEventListener('mouseleave', resetTimer);

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && isHeroInView()) prev();
      if (e.key === 'ArrowRight' && isHeroInView()) next();
    });

    function isHeroInView() {
      const r = hero.getBoundingClientRect();
      return r.bottom > 100 && r.top < window.innerHeight * 0.8;
    }

    resetTimer();
  }

  /* ============================================================
     LENIS smooth scroll
     ============================================================ */
  let lenis = null;
  function initLenis() {
    if (isReduced() || typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }

  /* ============================================================
     SMOOTH ANCHOR SCROLL (works with or without Lenis)
     ============================================================ */
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerH = document.querySelector('.site-header')?.offsetHeight || 80;
        const y = target.getBoundingClientRect().top + window.scrollY - headerH;
        if (lenis) lenis.scrollTo(y, { duration: 1.4 });
        else window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
     REVEAL ANIMATIONS (IntersectionObserver)
     ============================================================ */
  function initReveals() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (isReduced()) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          // Cascade stagger to children if parent has data-stagger
          if (entry.target.hasAttribute('data-stagger')) {
            entry.target.querySelectorAll('[data-reveal]').forEach((c) => c.classList.add('is-in'));
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach((el) => io.observe(el));

    // Also observe [data-stagger]
    document.querySelectorAll('[data-stagger]').forEach((el) => {
      io.observe(el);
    });
  }

  /* ============================================================
     BELTZA scrollytelling
     ============================================================ */
  function initBeltza() {
    const sticky = document.getElementById('beltzaSticky');
    if (!sticky) return;
    const chapters = Array.from(document.querySelectorAll('.beltza__chapter'));
    const images = Array.from(sticky.querySelectorAll('.beltza__sticky-img'));
    const caption = document.getElementById('beltzaCaption');
    const captions = [
      '1906 · Lesaka, Navarra',
      'Hotel Londres · San Sebastián',
      'Pozuelo · hoy'
    ];

    if (!chapters.length || !images.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const idx = parseInt(entry.target.dataset.chapter, 10);
          images.forEach((img, i) => img.classList.toggle('is-active', i === idx));
          if (caption) {
            caption.classList.remove('is-active');
            setTimeout(() => {
              caption.textContent = captions[idx];
              caption.classList.add('is-active');
            }, 300);
          }
        }
      });
    }, { threshold: [0.5, 0.7], rootMargin: '-20% 0px -20% 0px' });

    chapters.forEach((c) => io.observe(c));
  }

  /* ============================================================
     LIGHTBOX
     ============================================================ */
  function initLightbox() {
    const gallery = document.getElementById('gallery');
    const lb = document.getElementById('lightbox');
    if (!gallery || !lb) return;

    const items = Array.from(gallery.querySelectorAll('.gallery__item'));
    const imgEl = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    let current = 0;
    let lastFocus = null;

    function open(idx) {
      current = idx;
      lastFocus = document.activeElement;
      const src = items[idx].dataset.img;
      const alt = items[idx].querySelector('img')?.alt || '';
      imgEl.src = src;
      imgEl.alt = alt;
      counter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lenis?.stop();
      closeBtn.focus();
    }
    function close() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      lenis?.start();
      imgEl.src = '';
      lastFocus?.focus();
    }
    function go(delta) {
      open((current + delta + items.length) % items.length);
    }

    items.forEach((it, i) => it.addEventListener('click', () => open(i)));
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
  }

  /* ============================================================
     TESTIMONIALS carousel
     ============================================================ */
  function initTestimonials() {
    const wrap = document.getElementById('tmSlides');
    if (!wrap) return;
    const slides = Array.from(wrap.querySelectorAll('.reviews__slide'));
    const bar = document.getElementById('tmProgressBar');
    const prev = document.getElementById('tmPrev');
    const next = document.getElementById('tmNext');
    let current = 0;
    let timer = null;
    const DURATION = 7000;

    function update() {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      if (bar) {
        bar.style.transition = 'none';
        bar.style.transform = 'scaleX(0)';
        // force reflow
        // eslint-disable-next-line no-unused-expressions
        bar.offsetWidth;
        bar.style.transition = `transform ${DURATION}ms linear`;
        bar.style.transform = 'scaleX(1)';
      }
    }

    function go(idx) {
      current = (idx + slides.length) % slides.length;
      update();
      reset();
    }
    function reset() {
      clearInterval(timer);
      if (!isReduced()) timer = setInterval(() => go(current + 1), DURATION);
    }

    prev?.addEventListener('click', () => go(current - 1));
    next?.addEventListener('click', () => go(current + 1));

    // Swipe
    let startX = 0;
    wrap.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) (diff > 0 ? go(current + 1) : go(current - 1));
    });

    // Pause on hover/focus
    wrap.addEventListener('mouseenter', () => clearInterval(timer));
    wrap.addEventListener('mouseleave', reset);

    update();
    reset();
  }

  /* ============================================================
     PAGE TRANSITIONS (curtain)
     ============================================================ */
  function initPageTransitions() {
    if (isReduced()) return;
    const curtain = document.getElementById('pageCurtain');
    if (!curtain) return;

    document.addEventListener('click', (e) => {
      const link = e.target.closest && e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
      try {
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.hash) return;
      } catch { return; }
      e.preventDefault();
      sessionStorage.setItem('aguirre-transitioning', '1');
      curtain.classList.add('is-up');
      setTimeout(() => { window.location.href = link.href; }, 480);
    });

    // On load — slide curtain down ONLY if we came from a transition
    if (sessionStorage.getItem('aguirre-transitioning') === '1') {
      sessionStorage.removeItem('aguirre-transitioning');
      curtain.classList.add('is-up');
      requestAnimationFrame(() => {
        curtain.classList.remove('is-up');
        curtain.classList.add('is-down');
        setTimeout(() => curtain.classList.remove('is-down'), 600);
      });
    }
  }

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     WHATSAPP tooltip
     ============================================================ */
  function initWhatsApp() {
    const tip = document.getElementById('whatsappTooltip');
    if (!tip) return;
    setTimeout(() => tip.classList.add('is-visible'), 3500);
    window.addEventListener('scroll', () => tip.classList.remove('is-visible'), { once: true, passive: true });
    document.querySelector('.whatsapp-float')?.addEventListener('click', () => tip.classList.remove('is-visible'));
  }

  /* ============================================================
     COOKIES banner
     ============================================================ */
  function initCookies() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    const choice = localStorage.getItem('aguirre-cookies');
    if (choice) { banner.remove(); return; }
    setTimeout(() => {
      banner.classList.add('is-open');
      requestAnimationFrame(() => banner.classList.add('is-visible'));
    }, 1200);
    const set = (v) => {
      localStorage.setItem('aguirre-cookies', v);
      banner.classList.remove('is-visible');
      setTimeout(() => banner.remove(), 400);
    };
    document.getElementById('cookieAccept')?.addEventListener('click', () => set('accepted'));
    document.getElementById('cookieReject')?.addEventListener('click', () => set('rejected'));
  }

  /* ============================================================
     FORMS (basic ajax + validation)
     ============================================================ */
  function initForms() {
    const forms = document.querySelectorAll('form[data-ajax]');
    forms.forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Clear errors
        form.querySelectorAll('.field--error').forEach((f) => f.classList.remove('field--error'));

        // Validate
        let ok = true;
        form.querySelectorAll('[required]').forEach((field) => {
          const val = field.type === 'checkbox' ? field.checked : (field.value || '').trim();
          if (!val) { ok = false; field.closest('.field, .newsletter__input')?.classList.add('field--error'); }
        });
        const email = form.querySelector('input[type="email"]');
        if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
          ok = false;
          email.closest('.field, .newsletter__input')?.classList.add('field--error');
        }
        if (!ok) return showFeedback(form, 'error', 'Completa todos los campos obligatorios.');

        // Submit
        const submit = form.querySelector('button[type="submit"]');
        const orig = submit ? submit.innerHTML : '';
        if (submit) { submit.disabled = true; submit.innerHTML = 'Enviando…'; }

        try {
          const action = form.getAttribute('action');
          if (action) {
            const res = await fetch(action, { method: form.method || 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error('server');
          } else {
            // No backend wired up — simulate success
            await new Promise((r) => setTimeout(r, 600));
          }
          form.reset();
          showFeedback(form, 'success', '¡Recibido! Te respondemos pronto.');
        } catch {
          showFeedback(form, 'error', 'Ha fallado el envío. Escríbenos a contacto@aguirreplace.es o llama al 911 527 529.');
        }
        if (submit) { submit.disabled = false; submit.innerHTML = orig; }
      });
    });
  }
  function showFeedback(form, type, msg) {
    const existing = form.querySelector('.form-feedback');
    if (existing) existing.remove();
    const el = document.createElement('p');
    el.className = 'form-feedback';
    el.style.cssText = `margin-top: 16px; padding: 12px 14px; font-size: 0.875rem; border-radius: 2px; ${type === 'success' ? 'background: #E8F2EC; color: #1F5234;' : 'background: #F8E4E2; color: #7E1F26;'}`;
    el.textContent = msg;
    form.appendChild(el);
    if (type === 'success') setTimeout(() => el.remove(), 5500);
  }

  /* ============================================================
     UTIL: current year & active nav
     ============================================================ */
  function initStaticBits() {
    document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-header__nav a, .site-header__nav-left a').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href) return;
      if (href === path || (path === '' && href === 'index.html')) a.classList.add('is-active');
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    splitHeroTitle();
    initLoader();
    initHeader();
    initMobileNav();
    initHeroSlider();
    initLenis();
    initAnchorScroll();
    initReveals();
    initBeltza();
    initLightbox();
    initTestimonials();
    initPageTransitions();
    initBackToTop();
    initWhatsApp();
    initCookies();
    initForms();
    initStaticBits();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
