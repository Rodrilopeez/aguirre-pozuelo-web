/* ================================================================
   AGUIRRE POZUELO — Taberna Contemporánea
   JavaScript Principal — UI/UX Pro Max
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initHeroParallax();
  initHeroSlideshow();
  initWhatsApp();
  initCookieBanner();
  initSmoothScroll();
  initBackToTop();
  initForms();
  initScrollReveals();
});

/* --- Mobile Navigation --- */
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-main');
  const links = nav ? nav.querySelectorAll('a') : [];

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.classList.remove('nav-open');
    });
  });
}

/* --- Scroll Effects --- */
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  const backToTop = document.querySelector('.back-to-top');

  if (!header) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
          header.classList.add('site-header--scrolled');
        } else {
          header.classList.remove('site-header--scrolled');
        }

        if (backToTop) {
          backToTop.classList.toggle('visible', scrollY > 800);
        }

        ticking = false;
      });
      ticking = true;
    }
  });
}

/* --- Hero Mouse Parallax --- */
function initHeroParallax() {
  const hero = document.getElementById('hero');
  const content = document.querySelector('.hero__content');
  if (!hero || !content) return;

  hero.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 14;
    content.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    content.style.transform = 'translate(0, 0)';
  });
}

/* --- Hero Slideshow --- */
function initHeroSlideshow() {
  const hero = document.getElementById('hero');
  const slides = document.querySelectorAll('.hero__slide');
  const dotsContainer = document.getElementById('heroDots');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');

  if (!hero || !dotsContainer || slides.length < 2) return;

  let current = 0;
  let interval;
  var DURATION = 5500;

  slides.forEach(function(_, i) {
    var dot = document.createElement('button');
    dot.className = 'hero__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Diapositiva ' + (i + 1));
    dot.addEventListener('click', function() { goTo(i); });
    dotsContainer.appendChild(dot);
  });

  var dots = dotsContainer.querySelectorAll('.hero__dot');

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetTimer();
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function prev() {
    goTo((current - 1 + slides.length) % slides.length);
  }

  function resetTimer() {
    clearInterval(interval);
    interval = setInterval(next, DURATION);
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  var touchStartX = 0;
  hero.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  hero.addEventListener('touchend', function(e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  });

  hero.addEventListener('mouseenter', function() { clearInterval(interval); });
  hero.addEventListener('mouseleave', function() {
    interval = setInterval(next, DURATION);
  });

  var mqReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!mqReducedMotion.matches) {
    interval = setInterval(next, DURATION);
  }
}

/* --- WhatsApp Floating Button --- */
function initWhatsApp() {
  const btn = document.querySelector('.whatsapp-float');
  const tooltip = document.querySelector('.whatsapp-tooltip');

  if (!btn) return;

  if (tooltip) {
    setTimeout(() => tooltip.classList.add('visible'), 3000);

    btn.addEventListener('click', () => tooltip.classList.remove('visible'));

    window.addEventListener('scroll', () => {
      tooltip.classList.remove('visible');
    }, { once: true });
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const phone = '34911527529';
    const message = encodeURIComponent('Hola, quería hacer una consulta sobre Aguirre Pozuelo...');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  });
}

/* --- Cookie Banner --- */
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  const acceptBtn = document.querySelector('.cookie-accept');
  const rejectBtn = document.querySelector('.cookie-reject');

  if (!banner) return;

  const cookieChoice = localStorage.getItem('aguirre-cookie-consent');
  if (cookieChoice) {
    banner.remove();
    return;
  }

  setTimeout(() => banner.classList.add('active'), 800);

  function setConsent(choice) {
    localStorage.setItem('aguirre-cookie-consent', choice);
    banner.classList.remove('active');
    setTimeout(() => banner.remove(), 300);
  }

  if (acceptBtn) acceptBtn.addEventListener('click', () => setConsent('accepted'));
  if (rejectBtn) rejectBtn.addEventListener('click', () => setConsent('rejected'));
}

/* --- Smooth Scroll for anchor links --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* --- Back to Top Button --- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Form with real submission --- */
function initForms() {
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  const forms = document.querySelectorAll('form[data-ajax]');
  if (!forms.length) return;

  forms.forEach(form => {
    const isBookingForm = form.id === 'bookingForm';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous state
      form.querySelectorAll('.form-input--error').forEach(el => el.classList.remove('form-input--error'));

      // Validate
      let valid = true;
      const required = form.querySelectorAll('[required]');

      required.forEach(field => {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        if (!value) {
          valid = false;
          field.classList.add('form-input--error');
        }
      });

      // Email validation
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          valid = false;
          emailField.classList.add('form-input--error');
        }
      }

      if (!valid) {
        showFeedback(form, 'error', 'Completa todos los campos obligatorios.');
        return;
      }

      // Submit
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = '<span class="form-spinner"></span> Enviando...';
        submitBtn.disabled = true;
      }

      try {
        const actionURL = form.getAttribute('action');
        let res;

        if (actionURL && !actionURL.includes('formsubmit.co')) {
          res = await fetch(actionURL, {
            method: form.getAttribute('method') || 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
          });
        } else {
          res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
          });
        }

        if (res.ok) {
          form.reset();
          showFeedback(form, 'success', '¡Mensaje enviado! Te responderemos pronto.');
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        // Fallback: show success anyway for demo
        showFeedback(form, 'error', 'No se pudo enviar. Escríbenos a contacto@aguirreplace.es o llámanos al 911 527 529.');
      }

      if (submitBtn) {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }
    });
  });
}

function showFeedback(form, type, message) {
  // Try named feedback elements first
  const successEl = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');
  const errorMsg = document.getElementById('formErrorMsg');

  if (type === 'success' && successEl && errorEl) {
    successEl.hidden = false;
    errorEl.hidden = true;
    setTimeout(() => { successEl.hidden = true; }, 5000);
    return;
  }

  if (type === 'error' && errorEl && successEl) {
    errorEl.hidden = false;
    if (errorMsg) errorMsg.textContent = message;
    successEl.hidden = true;
    return;
  }

  // Fallback: create inline message
  const existing = form.querySelector('.form-message');
  if (existing) existing.remove();

  const msgEl = document.createElement('div');
  msgEl.className = `form-feedback form-feedback--${type}`;
  msgEl.textContent = message;
  msgEl.style.marginTop = '1rem';
  form.appendChild(msgEl);

  if (type === 'success') {
    setTimeout(() => {
      msgEl.style.opacity = '0';
      msgEl.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => msgEl.remove(), 300);
    }, 4000);
  }
}

/* --- Scroll-triggered Reveal Animations --- */
function initScrollReveals() {
  // Add directional reveals and stagger delays to cards in grids
  const gridCards = document.querySelectorAll(
    '.star-dish-card, .blog-card, .testimonial-card, .product-card, .event-type'
  );

  gridCards.forEach((card, i) => {
    if (!card.classList.contains('reveal')) {
      card.classList.add('reveal', 'reveal--up');
      // Auto-stagger within the same parent grid
      const parent = card.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(c =>
          c.matches('.star-dish-card, .blog-card, .testimonial-card, .product-card, .event-type')
        );
        const idx = siblings.indexOf(card);
        if (idx >= 0 && idx < 8) {
          card.classList.add('reveal--d' + (idx + 1));
        }
      }
    }
  });

  // Add reveal to section images and content blocks
  document.querySelectorAll('.story-image, .story-text, .events-highlight-image, .section-header, .newsletter-box, .cta-banner').forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal', 'reveal--up');
    }
  });

  // IntersectionObserver
  const allReveals = document.querySelectorAll('.reveal');
  if (!allReveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  allReveals.forEach(el => observer.observe(el));
}

/* --- Current Year for Copyright --- */
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* --- Active nav link based on current page --- */
(function setActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-main a:not(.btn)');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (href === currentPath || (href !== '/' && currentPath.includes(href.replace('./', '')))) {
      link.classList.add('active');
    }
  });
})();
