/* ═══════════════════════════════════════════════════
   OPSIS.NO — Main JavaScript
   ═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ── Navbar scroll effect ────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Mobile burger menu ──────────────────────── */
  const burger  = document.getElementById('burger');
  const navMenu = document.getElementById('navMenu');

  burger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', open);
    navbar.classList.toggle('nav-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on nav link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      burger.classList.remove('active');
      navbar.classList.remove('nav-open');
      document.body.style.overflow = '';
    });
  });

  /* ── Cookie banner ───────────────────────────── */
  const cookieBanner  = document.getElementById('cookieBanner');
  const cookieAccept  = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  const COOKIE_KEY = 'opsis_cookie_consent';

  if (!localStorage.getItem(COOKIE_KEY)) {
    setTimeout(() => cookieBanner.classList.remove('hidden'), 1200);
  } else {
    cookieBanner.classList.add('hidden');
  }

  const dismissCookies = (value) => {
    localStorage.setItem(COOKIE_KEY, value);
    cookieBanner.classList.add('hidden');
  };

  cookieAccept.addEventListener('click',  () => dismissCookies('all'));
  cookieDecline.addEventListener('click', () => dismissCookies('necessary'));

  /* ── Portfolio filter ────────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.opacity    = show ? '1' : '0.25';
        item.style.transform  = show ? '' : 'scale(0.95)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.pointerEvents = show ? '' : 'none';
      });
    });
  });

  /* ── Scroll reveal ───────────────────────────── */
  const reveals = document.querySelectorAll(
    '.service-card, .process-step, .portfolio-item, .point, ' +
    '.testimonial-card, .contact-detail, .section-header'
  );

  reveals.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));

  /* ── Quote form ──────────────────────────────── */
  const form = document.getElementById('quoteForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data     = new FormData(form);
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Simple client-side validation
    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#EF4444';
        valid = false;
      }
    });

    if (!valid) return;

    // Simulate submission (replace with real endpoint)
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        style="animation: spin 1s linear infinite">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Sender...
    `;

    const style = document.createElement('style');
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        ✓ Forespørsel sendt! Vi kontakter deg innen 2 timer.
      `;
      submitBtn.style.background = '#059669';
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
      }, 6000);
    }, 1500);
  });

  /* ── Smooth anchor links with offset ────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = navbar.offsetHeight + 16;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
