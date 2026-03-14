/* ═══════════════════════════════════════════════════
   OPSIS — Portfolio Page
   Data loaded from /data/portfolio.json (managed via Decap CMS)
   ═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── Category labels ──────────────────────────── */
  const CAT_LABELS = {
    skilt:  'Skilt & storformat',
    bil:    'Bilfoliering',
    klaer:  'Profilklær',
    design: 'Grafisk design',
    trykk:  'Trykksaker',
    dekor:  'Interiørdekor',
    messe:  'Messeutstyr',
  };

  /* ─── State ────────────────────────────────────── */
  let PROJECTS     = [];
  let activeCat    = 'all';
  let lbIndex      = 0;
  let filteredList = [];

  /* ─── DOM refs ─────────────────────────────────── */
  const grid      = document.getElementById('pfGrid');
  const emptyEl   = document.getElementById('pfEmpty');
  const filters   = document.getElementById('pfFilters');
  const lbOverlay = document.getElementById('lbOverlay');
  const lbImg     = document.getElementById('lbImg');
  const lbTag     = document.getElementById('lbTag');
  const lbTitle   = document.getElementById('lbTitle');
  const lbClient  = document.getElementById('lbClient');
  const lbDesc    = document.getElementById('lbDesc');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');

  /* ─── Render grid ──────────────────────────────── */
  function render() {
    filteredList = activeCat === 'all'
      ? PROJECTS.slice()
      : PROJECTS.filter(p => p.cat === activeCat);

    grid.innerHTML = '';

    if (filteredList.length === 0) {
      emptyEl.style.display = 'block';
      return;
    }
    emptyEl.style.display = 'none';

    filteredList.forEach((proj, idx) => {
      const el = document.createElement('div');
      el.className = `pf-item pf-item--${proj.size || 'standard'} pf-item--animating`;
      el.dataset.idx = idx;
      el.style.animationDelay = `${idx * 0.04}s`;

      el.innerHTML = `
        <img class="pf-item__img"
          src="${proj.img}"
          alt="${proj.title}"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&h=500&fit=crop'">
        <div class="pf-item__overlay">
          <span class="pf-item__tag">${CAT_LABELS[proj.cat] || proj.cat}</span>
          <h3 class="pf-item__title">${proj.title}</h3>
          <p class="pf-item__client">${proj.client}</p>
        </div>
        <div class="pf-item__zoom">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </div>
      `;

      el.addEventListener('click', () => openLightbox(idx));
      grid.appendChild(el);
    });
  }

  /* ─── Update filter counts ─────────────────────── */
  function updateCounts() {
    const countAll = document.getElementById('count-all');
    if (countAll) countAll.textContent = PROJECTS.length;

    Object.keys(CAT_LABELS).forEach(cat => {
      const el = document.getElementById(`count-${cat}`);
      if (el) el.textContent = PROJECTS.filter(p => p.cat === cat).length;
    });
  }

  /* ─── Filter ────────────────────────────────────── */
  filters?.addEventListener('click', e => {
    const btn = e.target.closest('.pf-filter');
    if (!btn) return;
    filters.querySelectorAll('.pf-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCat = btn.dataset.cat;
    render();
  });

  /* ─── Lightbox ─────────────────────────────────── */
  function openLightbox(idx) {
    lbIndex = idx;
    showProject(filteredList[idx]);
    lbOverlay.classList.add('lb-overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lbOverlay.classList.remove('lb-overlay--visible');
    document.body.style.overflow = '';
  }

  function showProject(proj) {
    lbImg.src = proj.img;
    lbImg.alt = proj.title;
    lbTag.textContent    = CAT_LABELS[proj.cat] || proj.cat;
    lbTitle.textContent  = proj.title;
    lbClient.textContent = proj.client;
    lbDesc.textContent   = proj.desc;
    lbCounter.textContent = `${lbIndex + 1} / ${filteredList.length}`;
    lbPrev.style.opacity = lbIndex === 0                       ? '0.3' : '1';
    lbNext.style.opacity = lbIndex === filteredList.length - 1 ? '0.3' : '1';
  }

  lbClose?.addEventListener('click', closeLightbox);
  lbOverlay?.addEventListener('click', e => { if (e.target === lbOverlay) closeLightbox(); });
  lbPrev?.addEventListener('click', () => {
    if (lbIndex > 0) { lbIndex--; showProject(filteredList[lbIndex]); }
  });
  lbNext?.addEventListener('click', () => {
    if (lbIndex < filteredList.length - 1) { lbIndex++; showProject(filteredList[lbIndex]); }
  });
  document.addEventListener('keydown', e => {
    if (!lbOverlay.classList.contains('lb-overlay--visible')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft'  && lbIndex > 0)                       { lbIndex--; showProject(filteredList[lbIndex]); }
    if (e.key === 'ArrowRight' && lbIndex < filteredList.length - 1) { lbIndex++; showProject(filteredList[lbIndex]); }
  });

  /* ─── Sticky filter bar shadow ─────────────────── */
  window.addEventListener('scroll', () => {
    const bar = document.getElementById('filterBar');
    if (bar) bar.classList.toggle('pf-filter-bar--shadow', window.scrollY > 200);
  }, { passive: true });

  /* ─── Load data from JSON, then init ───────────── */
  fetch('/data/portfolio.json')
    .then(r => r.json())
    .then(data => {
      PROJECTS = data.projects || [];
      updateCounts();
      render();
    })
    .catch(() => {
      // Fallback: show error in grid
      if (grid) grid.innerHTML = '<p style="padding:2rem;color:#999">Kunne ikke laste prosjekter.</p>';
    });

})();
