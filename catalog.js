/* ═══════════════════════════════════════════════════
   OPSIS — Clothing Catalog
   ═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── Product data (loaded from data/catalog.json) ─ */
  let PRODUCTS = [];

  /* ─── State ────────────────────────────────────── */
  const state = {
    activeCat: 'all',
    quantities: {},
  };

  /* ─── DOM refs ─────────────────────────────────── */
  const grid        = document.getElementById('catalogGrid');
  const emptyState  = document.getElementById('catalogEmpty');
  const categoryTabs= document.getElementById('categoryTabs');
  const resetFilters  = document.getElementById('resetFilters');

  /* ─── Render products ──────────────────────────── */
  function render() {
    const filtered = PRODUCTS.filter(p =>
      state.activeCat === 'all' || p.category === state.activeCat
    );

    grid.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    filtered.forEach(p => {
      const qty = state.quantities[p.id] || 1;
      const card = document.createElement('div');
      card.className = 'catalog-card';
      card.dataset.id = p.id;
      card.innerHTML = `
        <div class="catalog-card__img-wrap">
          <img src="${p.img}" alt="${p.name}" loading="lazy" class="catalog-card__img"
            onerror="this.src='https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop'">
        </div>
        <div class="catalog-card__body">
          <h4 class="catalog-card__name">${p.name}</h4>
          <div class="catalog-card__colors">
            ${p.colors.map(c => `<span class="item-swatch" style="background:${c}" title="${c}"></span>`).join('')}
          </div>
          <p class="catalog-card__price">Fra <strong>${p.price} NOK</strong>/stk</p>
          <div class="catalog-card__controls">
            <div class="qty-control">
              <button class="qty-btn qty-minus" data-id="${p.id}">−</button>
              <span class="qty-value" id="qty-${p.id}">${qty}</span>
              <button class="qty-btn qty-plus" data-id="${p.id}">+</button>
            </div>
          </div>
          <div class="catalog-card__actions">
            <button class="btn btn--primary btn--sm add-to-cart" data-id="${p.id}">
              Legg i kurv
            </button>
            ${p.garment ? `<button class="btn btn--ghost btn--sm open-mockup" data-id="${p.id}" data-garment="${p.garment}">
              Design mockup
            </button>` : ''}
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    bindCardEvents();
  }

  /* ─── Card events ──────────────────────────────── */
  function bindCardEvents() {
    grid.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        state.quantities[id] = Math.max(1, (state.quantities[id] || 1) - 1);
        document.getElementById(`qty-${id}`).textContent = state.quantities[id];
      });
    });

    grid.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        state.quantities[id] = Math.min(9999, (state.quantities[id] || 1) + 1);
        document.getElementById(`qty-${id}`).textContent = state.quantities[id];
      });
    });

    grid.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const product = PRODUCTS.find(p => p.id === id);
        if (!product || !window.OpsisCart) return;
        const qty = state.quantities[id] || 1;
        window.OpsisCart.add({
          type: 'catalog',
          serviceKey: 'produkter',
          label: product.name,
          details: `${qty} stk`,
          min: product.price * qty,
          max: product.price * qty * 1.2,
          qty,
          icon: '👕',
        });
        btn.textContent = '✓ Lagt i kurv!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Legg i kurv';
          btn.disabled = false;
        }, 2000);
      });
    });

    grid.querySelectorAll('.open-mockup').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const product = PRODUCTS.find(p => p.id === id);
        if (product) window.openMockup(product.garment, product.img, product.name);
      });
    });
  }

  /* ─── Filters ──────────────────────────────────── */
  categoryTabs?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-tab');
    if (!btn) return;
    categoryTabs.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeCat = btn.dataset.cat;
    render();
  });

  resetFilters?.addEventListener('click', () => {
    state.activeCat = 'all';
    categoryTabs.querySelectorAll('.filter-tab').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
    render();
  });

  /* ─── Expose openMockup ─────────────────────────── */
  window.openMockup = function(garment, imgUrl, productName) {
    const overlay = document.getElementById('mockupOverlay');
    if (!overlay) return;
    if (garment) {
      const garmentBtns = document.querySelectorAll('.garment-btn');
      garmentBtns.forEach(b => b.classList.toggle('active', b.dataset.garment === garment));
      if (window.mockupSetGarment) window.mockupSetGarment(garment);
    }
    if (imgUrl && window.mockupSetPhoto) {
      window.mockupSetPhoto(imgUrl);
    }
    overlay.classList.add('modal-overlay--visible');
    document.body.style.overflow = 'hidden';
    if (window.mockupDraw) window.mockupDraw();
  };

  /* ─── Init ─────────────────────────────────────── */
  fetch('/data/catalog.json')
    .then(r => r.json())
    .then(data => {
      PRODUCTS = data.products || [];
      render();
    });

})();
