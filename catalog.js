/* ═══════════════════════════════════════════════════
   OPSIS — Clothing Catalog
   ═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── Product data ─────────────────────────────── */
  const PRODUCTS = [
    {
      id: 'u-tshirt-1',
      name: 'Klassisk T-skjorte',
      category: 'topper',
      price: 149,
      colors: ['#FFFFFF','#1a1d23','#0057FF','#E63946','#2D6A4F'],
      img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      garment: 'tshirt',
    },
    {
      id: 'u-polo-1',
      name: 'Polo-skjorte',
      category: 'topper',
      price: 229,
      colors: ['#FFFFFF','#1a1d23','#0057FF','#2D6A4F'],
      img: 'https://images.unsplash.com/photo-1625910513178-c8b3c1d4b55d?w=400&h=400&fit=crop',
      garment: 'polo',
    },
    {
      id: 'u-hoodie-1',
      name: 'Zip Hoodie',
      category: 'topper',
      price: 349,
      colors: ['#FFFFFF','#1a1d23','#6B7280','#0057FF'],
      img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop',
      garment: 'hoodie',
    },
    {
      id: 'bj-jacket-1',
      name: 'Softshell-jakke',
      category: 'jakker',
      price: 749,
      colors: ['#1a1d23','#E63946','#FF5C00','#2D6A4F'],
      img: 'https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=400&h=400&fit=crop',
      garment: 'jakke',
    },
    {
      id: 'bj-vest-1',
      name: 'Vinterjakke Pro',
      category: 'jakker',
      price: 1090,
      colors: ['#1a1d23','#FF5C00','#2D6A4F'],
      img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop',
      garment: 'jakke',
    },
    {
      id: 'bj-tshirt-1',
      name: 'Arbeidsskjorte',
      category: 'topper',
      price: 279,
      colors: ['#FFFFFF','#1a1d23','#FF5C00'],
      img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
      garment: 'tshirt',
    },
    {
      id: 'si-pants-1',
      name: 'Arbeidsbukse Flex',
      category: 'bukser',
      price: 549,
      colors: ['#1a1d23','#FF5C00','#2D6A4F'],
      img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
      garment: 'bukse',
    },
    {
      id: 'n-tshirt-1',
      name: 'Organic T-skjorte',
      category: 'topper',
      price: 179,
      colors: ['#FFFFFF','#1a1d23','#6B7280','#F4A261'],
      img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
      garment: 'tshirt',
    },
    {
      id: 'n-hoodie-1',
      name: 'Organic Hoodie',
      category: 'topper',
      price: 399,
      colors: ['#FFFFFF','#1a1d23','#6B7280'],
      img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop',
      garment: 'hoodie',
    },
    {
      id: 'n-cap-1',
      name: 'Klassisk caps',
      category: 'caps',
      price: 149,
      colors: ['#FFFFFF','#1a1d23','#0057FF','#E63946','#2D6A4F','#F4A261'],
      img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
      garment: 'caps',
    },
    {
      id: 'u-bag-1',
      name: 'Ryggsekk med logo',
      category: 'tilbehor',
      price: 299,
      colors: ['#1a1d23','#0057FF','#E63946'],
      img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      garment: null,
    },
  ];

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
  render();

})();
