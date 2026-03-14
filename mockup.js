/* ═══════════════════════════════════════════════════
   OPSIS — Mockup Tool (Photo-based + Canvas overlay)
   ═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  const canvas = document.getElementById('mockupCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  const W      = canvas.width;
  const H      = canvas.height;
  const bgImg  = document.getElementById('mockupBgImg');

  /* ─── Garment photo mapping ──────────────────────
     Each garment has front + side (sleeve) views    */
  const GARMENT_PHOTOS = {
    tshirt: {
      front: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=480&h=540&fit=crop',
      side:  'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=480&h=540&fit=crop',
    },
    hoodie: {
      front: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=480&h=540&fit=crop',
      side:  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=480&h=540&fit=crop',
    },
    polo: {
      front: 'https://images.unsplash.com/photo-1625910513178-c8b3c1d4b55d?w=480&h=540&fit=crop',
      side:  'https://images.unsplash.com/photo-1625910513178-c8b3c1d4b55d?w=480&h=540&fit=crop',
    },
    jakke: {
      front: 'https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=480&h=540&fit=crop',
      side:  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=480&h=540&fit=crop',
    },
    caps: {
      front: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=480&h=540&fit=crop',
      side:  'https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=480&h=540&fit=crop',
    },
    bukse: {
      front: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=480&h=540&fit=crop',
      side:  'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=480&h=540&fit=crop',
    },
  };

  /* ─── State ────────────────────────────────────── */
  const state = {
    garment:            'tshirt',
    placement:          'front-chest',
    logo:               null,
    text:               '',
    textColor:          '#ffffff',
    textSize:           26,
    logoSize:           90,
    logoPosX:           0,
    logoPosY:           0,
    dragging:           false,
    dragOffX:           0,
    dragOffY:           0,
    qty:                1,
    currentProductImg:  null,
  };

  /* ─── Placement zones (canvas coords) ───────────── */
  const ZONES = {
    'front-chest':  { x: W * 0.50, y: H * 0.40 },
    'front-full':   { x: W * 0.50, y: H * 0.52 },
    'back':         { x: W * 0.50, y: H * 0.42 },
    'left-sleeve':  { x: W * 0.25, y: H * 0.50 },
    'right-sleeve': { x: W * 0.75, y: H * 0.50 },
  };

  /* ─── Photo helpers ─────────────────────────────── */
  function isSleeve() {
    return state.placement === 'left-sleeve' || state.placement === 'right-sleeve';
  }

  function updateBgPhoto() {
    if (!bgImg) return;
    if (state.currentProductImg) {
      bgImg.src = state.currentProductImg;
      return;
    }
    const photos = GARMENT_PHOTOS[state.garment] || GARMENT_PHOTOS.tshirt;
    bgImg.src = isSleeve() ? photos.side : photos.front;
  }

  /* ─── Draw (transparent canvas, logo/text only) ─── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawLogoOrText();
  }

  function drawLogoOrText() {
    const zone = ZONES[state.placement] || ZONES['front-chest'];
    const cx = state.logoPosX || zone.x;
    const cy = state.logoPosY || zone.y;

    if (state.logo) {
      const s     = state.logoSize;
      const ratio = state.logo.naturalHeight / state.logo.naturalWidth || 1;
      const sw    = s;
      const sh    = s * ratio;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur  = 6;
      ctx.drawImage(state.logo, cx - sw / 2, cy - sh / 2, sw, sh);
      ctx.restore();
    }

    if (state.text) {
      ctx.save();
      ctx.font         = `bold ${state.textSize}px Inter, sans-serif`;
      ctx.fillStyle    = state.textColor;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor  = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur   = 5;
      const textY = state.logo
        ? cy + (state.logo.naturalHeight / state.logo.naturalWidth * state.logoSize) / 2 + state.textSize + 6
        : cy;
      ctx.fillText(state.text, cx, textY);
      ctx.restore();
    }
  }

  /* ─── Expose API for catalog.js ─────────────────── */
  window.mockupDraw = draw;

  window.mockupSetGarment = (g) => {
    state.garment = g;
    state.currentProductImg = null;
    resetLogoPos();
    updateBgPhoto();
    draw();
  };

  window.mockupSetPhoto = (url) => {
    state.currentProductImg = url;
    if (bgImg) bgImg.src = url;
  };

  /* ─── Controls ──────────────────────────────────── */

  // Garment buttons
  document.getElementById('garmentBtns')?.addEventListener('click', e => {
    const btn = e.target.closest('.garment-btn');
    if (!btn) return;
    document.querySelectorAll('.garment-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.garment = btn.dataset.garment;
    state.currentProductImg = null;
    resetLogoPos();
    updateBgPhoto();
    draw();
  });

  // Placement buttons
  document.getElementById('placementBtns')?.addEventListener('click', e => {
    const btn = e.target.closest('.placement-btn');
    if (!btn) return;
    document.querySelectorAll('.placement-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.placement = btn.dataset.placement;
    resetLogoPos();
    updateBgPhoto();
    draw();
  });

  // Logo upload
  document.getElementById('logoUpload')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img   = new Image();
      img.onload  = () => { state.logo = img; resetLogoPos(); draw(); };
      img.src     = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Text input
  document.getElementById('mockupText')?.addEventListener('input', e => {
    state.text = e.target.value;
    draw();
  });

  // Text color
  document.getElementById('textColor')?.addEventListener('input', e => {
    state.textColor = e.target.value;
    draw();
  });

  // Text size
  document.getElementById('textSize')?.addEventListener('change', e => {
    state.textSize = parseInt(e.target.value);
    draw();
  });

  // Logo size
  document.getElementById('logoSize')?.addEventListener('input', e => {
    state.logoSize = parseInt(e.target.value);
    draw();
  });

  // Qty controls
  document.getElementById('mockupQtyMinus')?.addEventListener('click', () => {
    state.qty = Math.max(1, state.qty - 1);
    const el = document.getElementById('mockupQtyVal');
    if (el) el.textContent = state.qty;
  });

  document.getElementById('mockupQtyPlus')?.addEventListener('click', () => {
    state.qty = Math.min(9999, state.qty + 1);
    const el = document.getElementById('mockupQtyVal');
    if (el) el.textContent = state.qty;
  });

  // Add to cart
  document.getElementById('mockupAddToCart')?.addEventListener('click', () => {
    if (!window.OpsisCart) return;
    const GARMENT_NAMES = { tshirt: 'T-skjorte', hoodie: 'Hoodie', polo: 'Polo', jakke: 'Jakke', caps: 'Caps', bukse: 'Bukse' };
    const PLACEMENT_NAMES = {
      'front-chest':  'Bryst foran',
      'front-full':   'Midt foran',
      'back':         'Rygg',
      'left-sleeve':  'Venstre erme',
      'right-sleeve': 'Høyre erme',
    };
    const gLabel = GARMENT_NAMES[state.garment] || state.garment;
    const pLabel = PLACEMENT_NAMES[state.placement] || state.placement;
    const details = `${gLabel} · Plassering: ${pLabel}${state.text ? ` · Tekst: "${state.text}"` : ''}`;
    const basePrices = { tshirt: 149, hoodie: 349, polo: 229, jakke: 749, caps: 149, bukse: 549 };
    const base = (basePrices[state.garment] || 200) + 79; // +79 for print

    window.OpsisCart.add({
      type:       'catalog',
      serviceKey: 'produkter',
      label:      `Profilplagg: ${gLabel}`,
      details,
      min:        base * state.qty,
      max:        Math.round(base * state.qty * 1.3),
      qty:        state.qty,
      icon:       '👕',
    });
    const btn = document.getElementById('mockupAddToCart');
    btn.textContent  = '✓ Lagt i kurv!';
    btn.style.background = '#059669';
    setTimeout(() => {
      btn.textContent  = 'Legg i kurv';
      btn.style.background = '';
    }, 2000);
  });

  // Go to checkout
  document.getElementById('mockupGoToCart')?.addEventListener('click', () => {
    document.getElementById('mockupOverlay')?.classList.remove('modal-overlay--visible');
    document.body.style.overflow = '';
    const kontakt = document.getElementById('kontakt');
    if (kontakt) {
      setTimeout(() => kontakt.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  });

  // Clear
  document.getElementById('clearMockup')?.addEventListener('click', () => {
    state.logo     = null;
    state.text     = '';
    state.logoPosX = 0;
    state.logoPosY = 0;
    const textInput = document.getElementById('mockupText');
    if (textInput) textInput.value = '';
    const logoInput = document.getElementById('logoUpload');
    if (logoInput) logoInput.value = '';
    draw();
  });

  // Download (composite: photo + canvas overlay)
  document.getElementById('downloadMockup')?.addEventListener('click', () => {
    const tmp    = document.createElement('canvas');
    tmp.width    = W;
    tmp.height   = H;
    const tmpCtx = tmp.getContext('2d');
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      tmpCtx.drawImage(bgImg, 0, 0, W, H);
    }
    tmpCtx.drawImage(canvas, 0, 0);
    const link      = document.createElement('a');
    link.download   = 'opsis-mockup.png';
    link.href       = tmp.toDataURL('image/png');
    link.click();
  });

  // Close modal
  document.getElementById('mockupClose')?.addEventListener('click', closeModal);
  document.getElementById('mockupOverlay')?.addEventListener('click', e => {
    if (e.target === document.getElementById('mockupOverlay')) closeModal();
  });

  function closeModal() {
    document.getElementById('mockupOverlay')?.classList.remove('modal-overlay--visible');
    document.body.style.overflow = '';
  }

  /* ─── Drag & drop logo on canvas ────────────────── */
  function canvasXY(e) {
    const rect   = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }

  function logoHitTest(x, y) {
    if (!state.logo && !state.text) return false;
    const zone = ZONES[state.placement] || ZONES['front-chest'];
    const cx   = state.logoPosX || zone.x;
    const cy   = state.logoPosY || zone.y;
    const half = (state.logoSize || 90) / 2 + 20;
    return Math.abs(x - cx) < half && Math.abs(y - cy) < half;
  }

  canvas.addEventListener('mousedown', e => {
    const { x, y } = canvasXY(e);
    if (logoHitTest(x, y)) {
      const zone     = ZONES[state.placement] || ZONES['front-chest'];
      state.dragging = true;
      state.dragOffX = x - (state.logoPosX || zone.x);
      state.dragOffY = y - (state.logoPosY || zone.y);
      canvas.style.cursor = 'grabbing';
    }
  });

  canvas.addEventListener('mousemove', e => {
    const { x, y } = canvasXY(e);
    if (state.dragging) {
      state.logoPosX = x - state.dragOffX;
      state.logoPosY = y - state.dragOffY;
      draw();
    } else {
      canvas.style.cursor = logoHitTest(x, y) ? 'grab' : 'crosshair';
    }
  });

  canvas.addEventListener('mouseup',    () => { state.dragging = false; canvas.style.cursor = 'crosshair'; });
  canvas.addEventListener('mouseleave', () => { state.dragging = false; });

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const { x, y } = canvasXY(e);
    if (logoHitTest(x, y)) {
      const zone     = ZONES[state.placement] || ZONES['front-chest'];
      state.dragging = true;
      state.dragOffX = x - (state.logoPosX || zone.x);
      state.dragOffY = y - (state.logoPosY || zone.y);
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!state.dragging) return;
    const { x, y } = canvasXY(e);
    state.logoPosX = x - state.dragOffX;
    state.logoPosY = y - state.dragOffY;
    draw();
  }, { passive: false });

  canvas.addEventListener('touchend', () => { state.dragging = false; });

  /* ─── Helpers ──────────────────────────────────── */
  function resetLogoPos() { state.logoPosX = 0; state.logoPosY = 0; }

  /* ─── Init on modal open ─────────────────────────── */
  document.getElementById('mockupOverlay')?.addEventListener('transitionend', () => {
    if (document.getElementById('mockupOverlay')?.classList.contains('modal-overlay--visible')) {
      updateBgPhoto();
      draw();
    }
  });

  if (document.getElementById('mockupOverlay')?.classList.contains('modal-overlay--visible')) {
    updateBgPhoto();
    draw();
  }

})();
