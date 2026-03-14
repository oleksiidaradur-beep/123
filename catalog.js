/* ═══════════════════════════════════════════════════
   OPSIS — Clothing Catalog
   ═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── Product data ─────────────────────────────── */
  // Unsplash photos: royalty-free clothing images
  const PRODUCTS = [
    {
      id: 'u-tshirt-1',
      name: 'Klassisk T-skjorte',
      brand: 'univern',
      brandLabel: 'Univern',
      category: 'topper',
      price: 149,
      colors: ['#FFFFFF','#1a1d23','#0057FF','#E63946','#2D6A4F'],
      img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      garment: 'tshirt',
    },
    {
      id: 'u-polo-1',
      name: 'Polo-skjorte',
      brand: 'univern',
      brandLabel: 'Univern',
      category: 'topper',
      price: 229,
      colors: ['#FFFFFF','#1a1d23','#0057FF','#2D6A4F'],
      img: 'https://images.unsplash.com/photo-1625910513178-c8b3c1d4b55d?w=400&h=400&fit=crop',
      garment: 'polo',
    },
    {
      id: 'u-hoodie-1',
      name: 'Zip Hoodie',
      brand: 'univern',
      brandLabel: 'Univern',
      category: 'topper',
      price: 349,
      colors: ['#FFFFFF','#1a1d23','#6B7280','#0057FF'],
      img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop',
      garment: 'hoodie',
    },
    {
      id: 'bj-jacket-1',
      name: 'Softshell-jakke',
      brand: 'bjornklader',
      brandLabel: 'Björnkläder',
      category: 'jakker',
      price: 749,
      colors: ['#1a1d23','#E63946','#FF5C00','#2D6A4F'],
      img: 'https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=400&h=400&fit=crop',
      garment: 'jakke',
    },
    {
      id: 'bj-vest-1',
      name: 'Vinterjakke Pro',
      brand: 'bjornklader',
      brandLabel: 'Björnkläder',
      category: 'jakker',
      price: 1090,
      colors: ['#1a1d23','#FF5C00','#2D6A4F'],
      img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop',
      garment: 'jakke',
    },
    {
      id: 'bj-tshirt-1',
      name: 'Arbeidsskjorte',
      brand: 'bjornklader',
      brandLabel: 'Björnkläder',
      category: 'topper',
      price: 279,
      colors: ['#FFFFFF','#1a1d23','#FF5C00'],
      img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
      garment: 'tshirt',
    },
    {
      id: 'si-boot-1',
      name: 'Sikkerhetsstøvler S3',
      brand: 'sievi',
      brandLabel: 'Sievi',
      category: 'tilbehor',
      price: 1290,
      colors: ['#1a1d23','#8B4513'],
      img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      garment: null,
    },
    {
      id: 'si-pants-1',
      name: 'Arbeidsbukse Flex',
      brand: 'sievi',
      brandLabel: 'Sievi',
      category: 'bukser',
      price: 549,
      colors: ['#1a1d23','#FF5C00','#2D6A4F'],
      img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
      garment: null,
    },
    {
      id: 'n-tshirt-1',
      name: 'Organic T-skjorte',
      brand: 'neutral',
      brandLabel: 'Neutral',
      category: 'topper',
      price: 179,
      colors: ['#FFFFFF','#1a1d23','#6B7280','#F4A261'],
      img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
      garment: 'tshirt',
    },
    {
      id: 'n-hoodie-1',
      name: 'Organic Hoodie',
      brand: 'neutral',
      brandLabel: 'Neutral',
      category: 'topper',
      price: 399,
      colors: ['#FFFFFF','#1a1d23','#6B7280'],
      img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop',
      garment: 'hoodie',
    },
    {
      id: 'n-cap-1',
      name: 'Klassisk caps',
      brand: 'neutral',
      brandLabel: 'Neutral',
      category: 'caps',
      price: 149,
      colors: ['#FFFFFF','#1a1d23','#0057FF','#E63946','#2D6A4F','#F4A261'],
      img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
      garment: null,
    },
    {
      id: 'u-bag-1',
      name: 'Ryggsekk med logo',
      brand: 'univern',
      brandLabel: 'Univern',
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
    activeBrand: 'all',
    quantities: {},    // productId → qty
    inquiry: [],       // { product, qty }
  };

  /* ─── DOM refs ─────────────────────────────────── */
  const grid        = document.getElementById('catalogGrid');
  const emptyState  = document.getElementById('catalogEmpty');
  const categoryTabs= document.getElementById('categoryTabs');
  const brandPills  = document.getElementById('brandPills');
  const inquiryDrawer = document.getElementById('inquiryDrawer');
  const inquiryList   = document.getElementById('inquiryList');
  const inquiryCount  = document.getElementById('inquiryCount');
  const fabCount      = document.getElementById('fabCount');
  const inquiryFab    = document.getElementById('inquiryFab');
  const inquiryClose  = document.getElementById('inquiryClose');
  const sendInquiryBtn= document.getElementById('sendInquiryBtn');
  const resetFilters  = document.getElementById('resetFilters');

  /* ─── Render products ──────────────────────────── */
  function render() {
    const filtered = PRODUCTS.filter(p => {
      const catOk   = state.activeCat   === 'all' || p.category === state.activeCat;
      const brandOk = state.activeBrand === 'all' || p.brand    === state.activeBrand;
      return catOk && brandOk;
    });

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
          <img src="${p.img}" alt="${p.name}" loading="lazy" class="catalog-card__img" onerror="this.src='https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop'">
          <span class="catalog-card__brand-tag">${p.brandLabel}</span>
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
            <button class="btn btn--primary btn--sm add-to-inquiry" data-id="${p.id}">
              Legg til forespørsel
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

    grid.querySelectorAll('.add-to-inquiry').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const product = PRODUCTS.find(p => p.id === id);
        if (!product) return;
        const qty = state.quantities[id] || 1;
        addToInquiry(product, qty);
        btn.textContent = '✓ Lagt til';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Legg til forespørsel';
          btn.disabled = false;
        }, 2000);
      });
    });

    grid.querySelectorAll('.open-mockup').forEach(btn => {
      btn.addEventListener('click', () => {
        const garment = btn.dataset.garment;
        openMockup(garment);
      });
    });
  }

  /* ─── Inquiry cart ─────────────────────────────── */
  function addToInquiry(product, qty) {
    const existing = state.inquiry.find(i => i.product.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      state.inquiry.push({ product, qty });
    }
    renderInquiry();
    showDrawer();
  }

  function renderInquiry() {
    const total = state.inquiry.reduce((s, i) => s + i.qty, 0);
    inquiryCount.textContent = total;
    fabCount.textContent = total;
    inquiryFab.style.display = total > 0 ? 'flex' : 'none';

    inquiryList.innerHTML = state.inquiry.map((item, idx) => `
      <li class="inquiry-item">
        <img src="${item.product.img}" alt="${item.product.name}" class="inquiry-item__img"
          onerror="this.src='https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=80&h=80&fit=crop'">
        <div class="inquiry-item__info">
          <strong>${item.product.name}</strong>
          <span>${item.product.brandLabel}</span>
        </div>
        <div class="inquiry-item__qty">
          <button class="qty-btn" data-idx="${idx}" data-op="minus">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-idx="${idx}" data-op="plus">+</button>
        </div>
        <button class="inquiry-item__remove" data-idx="${idx}">×</button>
      </li>
    `).join('') || '<li class="inquiry-empty">Ingen varer lagt til ennå.</li>';

    inquiryList.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const op  = btn.dataset.op;
        if (op === 'plus')  state.inquiry[idx].qty++;
        if (op === 'minus') {
          state.inquiry[idx].qty--;
          if (state.inquiry[idx].qty <= 0) state.inquiry.splice(idx, 1);
        }
        renderInquiry();
      });
    });

    inquiryList.querySelectorAll('.inquiry-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        state.inquiry.splice(parseInt(btn.dataset.idx), 1);
        renderInquiry();
        if (state.inquiry.length === 0) hideDrawer();
      });
    });
  }

  function showDrawer()  { inquiryDrawer.classList.add('inquiry-drawer--open'); }
  function hideDrawer()  { inquiryDrawer.classList.remove('inquiry-drawer--open'); }

  inquiryFab?.addEventListener('click',   showDrawer);
  inquiryClose?.addEventListener('click', hideDrawer);

  sendInquiryBtn?.addEventListener('click', () => {
    if (state.inquiry.length === 0) return;
    const lines = state.inquiry.map(i => `- ${i.product.name} (${i.product.brandLabel}) × ${i.qty} stk`).join('\n');
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) serviceSelect.value = 'produkter';
    const msgField = document.getElementById('message');
    if (msgField) {
      msgField.value = `Jeg ønsker tilbud på følgende plagg/produkter:\n${lines}\n\nVennligst oppgi pris per stk og totalpris inkl. trykk.`;
    }
    hideDrawer();
    const kontakt = document.getElementById('kontakt');
    if (kontakt) {
      const offset = kontakt.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });

  /* ─── Filters ──────────────────────────────────── */
  categoryTabs?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-tab');
    if (!btn) return;
    categoryTabs.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeCat = btn.dataset.cat;
    render();
  });

  brandPills?.addEventListener('click', e => {
    const btn = e.target.closest('.brand-pill');
    if (!btn) return;
    brandPills.querySelectorAll('.brand-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeBrand = btn.dataset.brand;
    render();
  });

  resetFilters?.addEventListener('click', () => {
    state.activeCat   = 'all';
    state.activeBrand = 'all';
    categoryTabs.querySelectorAll('.filter-tab').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
    brandPills.querySelectorAll('.brand-pill').forEach(b => b.classList.toggle('active', b.dataset.brand === 'all'));
    render();
  });

  /* ─── Expose openMockup for mockup.js ──────────── */
  window.openMockup = function(garment) {
    const overlay = document.getElementById('mockupOverlay');
    if (!overlay) return;
    // Set initial garment if provided
    if (garment) {
      const garmentBtns = document.querySelectorAll('.garment-btn');
      garmentBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.garment === garment);
      });
      if (window.mockupSetGarment) window.mockupSetGarment(garment);
    }
    overlay.classList.add('modal-overlay--visible');
    document.body.style.overflow = 'hidden';
    if (window.mockupDraw) window.mockupDraw();
  };

  /* ─── Init ─────────────────────────────────────── */
  render();

})();
