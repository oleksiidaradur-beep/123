/* ═══════════════════════════════════════════════════
   OPSIS — Mockup Tool (Canvas-based)
   Draws clothing silhouettes, places logo/text,
   supports drag, color change, PNG export.
   ═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  const canvas  = document.getElementById('mockupCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const W       = canvas.width;
  const H       = canvas.height;

  /* ─── State ────────────────────────────────────── */
  const state = {
    garment:   'tshirt',
    color:     '#FFFFFF',
    placement: 'front-chest',
    logo:      null,       // HTMLImageElement or null
    text:      '',
    textColor: '#1a1d23',
    textSize:  26,
    logoSize:  90,
    // Logo drag
    logoPosX: 0,
    logoPosY: 0,
    dragging: false,
    dragOffX: 0,
    dragOffY: 0,
  };

  /* ─── Placement zones (center x, y) ────────────── */
  const ZONES = {
    'front-chest': { x: W * 0.5,  y: H * 0.38 },
    'front-full':  { x: W * 0.5,  y: H * 0.45 },
    'back':        { x: W * 0.5,  y: H * 0.40 },
    'left-sleeve': { x: W * 0.24, y: H * 0.42 },
  };

  /* ─── Drawing functions ────────────────────────── */

  function drawTshirt(color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = darken(color, 30);
    ctx.lineWidth = 2;

    // Body
    ctx.beginPath();
    ctx.moveTo(W*0.20, H*0.22);
    ctx.lineTo(W*0.10, H*0.35);
    ctx.lineTo(W*0.18, H*0.36);
    ctx.lineTo(W*0.18, H*0.78);
    ctx.lineTo(W*0.82, H*0.78);
    ctx.lineTo(W*0.82, H*0.36);
    ctx.lineTo(W*0.90, H*0.35);
    ctx.lineTo(W*0.80, H*0.22);
    // Collar
    ctx.quadraticCurveTo(W*0.65, H*0.18, W*0.55, H*0.20);
    ctx.quadraticCurveTo(W*0.5,  H*0.24, W*0.45, H*0.20);
    ctx.quadraticCurveTo(W*0.35, H*0.18, W*0.20, H*0.22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Shoulder seams
    ctx.beginPath();
    ctx.moveTo(W*0.20, H*0.22);
    ctx.lineTo(W*0.27, H*0.24);
    ctx.moveTo(W*0.80, H*0.22);
    ctx.lineTo(W*0.73, H*0.24);
    ctx.strokeStyle = darken(color, 20);
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function drawHoodie(color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = darken(color, 30);
    ctx.lineWidth = 2;

    // Body
    ctx.beginPath();
    ctx.moveTo(W*0.18, H*0.22);
    ctx.lineTo(W*0.08, H*0.37);
    ctx.lineTo(W*0.16, H*0.38);
    ctx.lineTo(W*0.16, H*0.80);
    ctx.lineTo(W*0.84, H*0.80);
    ctx.lineTo(W*0.84, H*0.38);
    ctx.lineTo(W*0.92, H*0.37);
    ctx.lineTo(W*0.82, H*0.22);
    // Hood
    ctx.quadraticCurveTo(W*0.72, H*0.14, W*0.60, H*0.12);
    ctx.quadraticCurveTo(W*0.5,  H*0.10, W*0.40, H*0.12);
    ctx.quadraticCurveTo(W*0.28, H*0.14, W*0.18, H*0.22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hood opening
    ctx.beginPath();
    ctx.ellipse(W*0.5, H*0.19, W*0.12, H*0.07, 0, 0, Math.PI*2);
    ctx.fillStyle = darken(color, 15);
    ctx.fill();
    ctx.stroke();

    // Pocket
    ctx.beginPath();
    ctx.roundRect(W*0.36, H*0.60, W*0.28, H*0.12, 8);
    ctx.fillStyle = darken(color, 10);
    ctx.fill();
    ctx.stroke();

    // Zipper line
    ctx.beginPath();
    ctx.moveTo(W*0.5, H*0.22);
    ctx.lineTo(W*0.5, H*0.80);
    ctx.strokeStyle = darken(color, 40);
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4,3]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawPolo(color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = darken(color, 30);
    ctx.lineWidth = 2;

    // Body
    ctx.beginPath();
    ctx.moveTo(W*0.22, H*0.22);
    ctx.lineTo(W*0.12, H*0.34);
    ctx.lineTo(W*0.20, H*0.36);
    ctx.lineTo(W*0.20, H*0.78);
    ctx.lineTo(W*0.80, H*0.78);
    ctx.lineTo(W*0.80, H*0.36);
    ctx.lineTo(W*0.88, H*0.34);
    ctx.lineTo(W*0.78, H*0.22);
    ctx.quadraticCurveTo(W*0.65, H*0.17, W*0.56, H*0.19);
    ctx.lineTo(W*0.56, H*0.30);
    ctx.lineTo(W*0.44, H*0.30);
    ctx.lineTo(W*0.44, H*0.19);
    ctx.quadraticCurveTo(W*0.35, H*0.17, W*0.22, H*0.22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Collar
    ctx.beginPath();
    ctx.moveTo(W*0.44, H*0.19);
    ctx.lineTo(W*0.44, H*0.30);
    ctx.lineTo(W*0.56, H*0.30);
    ctx.lineTo(W*0.56, H*0.19);
    ctx.fillStyle = darken(color, 8);
    ctx.fill();
    ctx.stroke();

    // Buttons
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(W*0.5, H*(0.21 + i * 0.04), 3, 0, Math.PI*2);
      ctx.fillStyle = darken(color, 50);
      ctx.fill();
    }
  }

  /* ─── Logo / text overlay ──────────────────────── */
  function drawLogoOrText() {
    const zone = ZONES[state.placement] || ZONES['front-chest'];
    const cx = state.logoPosX || zone.x;
    const cy = state.logoPosY || zone.y;

    if (state.logo) {
      const s = state.logoSize;
      const ratio = state.logo.naturalHeight / state.logo.naturalWidth || 1;
      const sw = s;
      const sh = s * ratio;
      ctx.drawImage(state.logo, cx - sw/2, cy - sh/2, sw, sh);
    }

    if (state.text) {
      ctx.save();
      ctx.font = `bold ${state.textSize}px Inter, sans-serif`;
      ctx.fillStyle = state.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Shadow for visibility
      ctx.shadowColor = isLight(state.color) ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';
      ctx.shadowBlur = 4;
      ctx.fillText(state.text, cx, state.logo ? cy + state.logoSize * 0.6 + state.textSize : cy);
      ctx.restore();
    }
  }

  /* ─── Main draw ────────────────────────────────── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background hint
    ctx.fillStyle = '#F7F8FA';
    ctx.fillRect(0, 0, W, H);

    switch (state.garment) {
      case 'tshirt': drawTshirt(state.color); break;
      case 'hoodie': drawHoodie(state.color); break;
      case 'polo':   drawPolo(state.color);   break;
      default:       drawTshirt(state.color);
    }

    drawLogoOrText();
  }

  // Expose for catalog.js
  window.mockupDraw = draw;
  window.mockupSetGarment = (g) => { state.garment = g; draw(); };

  /* ─── Controls ─────────────────────────────────── */

  // Garment buttons
  document.getElementById('garmentBtns')?.addEventListener('click', e => {
    const btn = e.target.closest('.garment-btn');
    if (!btn) return;
    document.querySelectorAll('.garment-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.garment = btn.dataset.garment;
    resetLogoPos();
    draw();
  });

  // Clothing color swatches
  document.getElementById('clothingColors')?.addEventListener('click', e => {
    const btn = e.target.closest('.color-swatch');
    if (!btn) return;
    document.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.color = btn.dataset.color;
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
    draw();
  });

  // Logo upload
  document.getElementById('logoUpload')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        state.logo = img;
        resetLogoPos();
        draw();
      };
      img.src = ev.target.result;
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

  // Clear
  document.getElementById('clearMockup')?.addEventListener('click', () => {
    state.logo    = null;
    state.text    = '';
    state.logoPosX = 0;
    state.logoPosY = 0;
    const textInput = document.getElementById('mockupText');
    if (textInput) textInput.value = '';
    const logoInput = document.getElementById('logoUpload');
    if (logoInput) logoInput.value = '';
    draw();
  });

  // Download PNG
  document.getElementById('downloadMockup')?.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'opsis-mockup.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  // Close mockup modal
  document.getElementById('mockupClose')?.addEventListener('click', () => {
    document.getElementById('mockupOverlay')?.classList.remove('modal-overlay--visible');
    document.body.style.overflow = '';
  });

  document.getElementById('mockupOverlay')?.addEventListener('click', e => {
    if (e.target === document.getElementById('mockupOverlay')) {
      document.getElementById('mockupOverlay').classList.remove('modal-overlay--visible');
      document.body.style.overflow = '';
    }
  });

  /* ─── Drag & drop logo on canvas ───────────────── */
  function canvasXY(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top)  * scaleY,
    };
  }

  function logoHitTest(x, y) {
    if (!state.logo && !state.text) return false;
    const zone  = ZONES[state.placement] || ZONES['front-chest'];
    const cx    = state.logoPosX || zone.x;
    const cy    = state.logoPosY || zone.y;
    const half  = (state.logoSize || 90) / 2 + 20;
    return Math.abs(x - cx) < half && Math.abs(y - cy) < half;
  }

  canvas.addEventListener('mousedown', e => {
    const { x, y } = canvasXY(e);
    if (logoHitTest(x, y)) {
      const zone = ZONES[state.placement] || ZONES['front-chest'];
      const cx   = state.logoPosX || zone.x;
      const cy   = state.logoPosY || zone.y;
      state.dragging = true;
      state.dragOffX = x - cx;
      state.dragOffY = y - cy;
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
      canvas.style.cursor = logoHitTest(x, y) ? 'grab' : 'default';
    }
  });

  canvas.addEventListener('mouseup', () => {
    state.dragging = false;
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('mouseleave', () => { state.dragging = false; });

  // Touch support
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const { x, y } = canvasXY(e);
    if (logoHitTest(x, y)) {
      const zone = ZONES[state.placement] || ZONES['front-chest'];
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
  function darken(hex, amount) {
    const c = hexToRgb(hex);
    if (!c) return '#888';
    return `rgb(${Math.max(0,c.r-amount)},${Math.max(0,c.g-amount)},${Math.max(0,c.b-amount)})`;
  }

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : null;
  }

  function isLight(hex) {
    const c = hexToRgb(hex);
    if (!c) return true;
    return (c.r*0.299 + c.g*0.587 + c.b*0.114) > 186;
  }

  function resetLogoPos() {
    state.logoPosX = 0;
    state.logoPosY = 0;
  }

  /* ─── Initial draw when modal opens ───────────── */
  document.getElementById('mockupOverlay')?.addEventListener('transitionend', () => {
    if (document.getElementById('mockupOverlay')?.classList.contains('modal-overlay--visible')) {
      draw();
    }
  });

  // Also draw immediately when already visible
  if (document.getElementById('mockupOverlay')?.classList.contains('modal-overlay--visible')) {
    draw();
  }

  // Polyfill roundRect for older browsers
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
      this.beginPath();
      this.moveTo(x+r, y);
      this.lineTo(x+w-r, y);
      this.quadraticCurveTo(x+w, y, x+w, y+r);
      this.lineTo(x+w, y+h-r);
      this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
      this.lineTo(x+r, y+h);
      this.quadraticCurveTo(x, y+h, x, y+h-r);
      this.lineTo(x, y+r);
      this.quadraticCurveTo(x, y, x+r, y);
      this.closePath();
    };
  }

})();
