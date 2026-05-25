/* ================================================================
   AGUIRRE POZUELO — Taberna Contemporánea
   JavaScript Principal
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initWhatsApp();
  initCookieBanner();
  initSmoothScroll();
  initBackToTop();
  initForms();
  initAnimations();
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
          if (scrollY > 800) {
            backToTop.classList.add('visible');
          } else {
            backToTop.classList.remove('visible');
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  });
}

/* --- WhatsApp Floating Button --- */
function initWhatsApp() {
  const btn = document.querySelector('.whatsapp-float');
  const tooltip = document.querySelector('.whatsapp-tooltip');

  if (!btn) return;

  // Show tooltip after 3 seconds
  if (tooltip) {
    setTimeout(() => {
      tooltip.classList.add('visible');
    }, 3000);

    // Hide tooltip when clicking WhatsApp button
    btn.addEventListener('click', () => {
      tooltip.classList.remove('visible');
    });

    // Hide tooltip when scrolling
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

  // Check if user already made a choice
  const cookieChoice = localStorage.getItem('aguirre-cookie-consent');
  if (cookieChoice) {
    banner.remove();
    return;
  }

  // Show banner after a short delay
  setTimeout(() => {
    banner.classList.add('active');
  }, 800);

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

/* --- Form Validation & Submission --- */
function initForms() {
  const forms = document.querySelectorAll('form[data-ajax]');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation
      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });

      // Email validation
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          valid = false;
          emailField.classList.add('error');
        }
      }

      // Checkbox validation
      const checkbox = form.querySelector('input[type="checkbox"][required]');
      if (checkbox && !checkbox.checked) {
        valid = false;
        checkbox.classList.add('error');
      }

      if (!valid) {
        showFormMessage(form, 'error', 'Por favor, completa todos los campos obligatorios correctamente.');
        return;
      }

      // Simulate submission (replace with real endpoint)
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        // For demo: simulate network request
        await new Promise(resolve => setTimeout(resolve, 1200));
        showFormMessage(form, 'success', 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.');
        form.reset();
      } catch (err) {
        showFormMessage(form, 'error', 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
}

function showFormMessage(form, type, message) {
  // Remove existing messages
  const existing = form.querySelector('.form-message');
  if (existing) existing.remove();

  const msgEl = document.createElement('div');
  msgEl.className = `form-message form-message--${type}`;
  msgEl.textContent = message;
  msgEl.style.cssText = `
    padding: 12px 16px;
    border-radius: 8px;
    margin-top: 16px;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    animation: fadeInUp 0.4s ease-out;
  `;

  if (type === 'success') {
    msgEl.style.backgroundColor = '#EDF7F0';
    msgEl.style.color = '#2D6A4F';
    msgEl.style.border = '1px solid #BFE8D0';
  } else {
    msgEl.style.backgroundColor = '#FEF2F2';
    msgEl.style.color = '#991B1B';
    msgEl.style.border = '1px solid #FECACA';
  }

  form.appendChild(msgEl);

  // Auto-remove success messages
  if (type === 'success') {
    setTimeout(() => {
      msgEl.style.opacity = '0';
      msgEl.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => msgEl.remove(), 300);
    }, 4000);
  }
}

/* --- Scroll-triggered Animations --- */
function initAnimations() {
  const elements = document.querySelectorAll('.fade-in-up, .reveal');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
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
    if (href === currentPath || (href !== '/' && currentPath.includes(href.replace('./', '')))) {
      link.classList.add('active');
    }
  });
})();
