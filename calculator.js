/* ═══════════════════════════════════════════════════
   OPSIS — Price Calculator
   All prices in NOK, shown as ranges ("fra X til Y")
   ═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── Pricing data (loaded from data/pricing.json) ─ */
  let PRICING = {};
  fetch('/data/pricing.json').then(r => r.json()).then(data => { PRICING = data; });

  /* ─── Form templates for each service ─────────── */
  const FORMS = {
    skilt: () => `
      <div class="calc-row">
        <div class="calc-field">
          <label>Bredde (cm)</label>
          <input type="number" id="c-width" min="10" max="5000" value="100" class="calc-input">
        </div>
        <div class="calc-field">
          <label>Høyde (cm)</label>
          <input type="number" id="c-height" min="10" max="5000" value="60" class="calc-input">
        </div>
      </div>
      <div class="calc-field">
        <label>Materiale</label>
        <select id="c-material" class="calc-input">
          ${optionsFrom(PRICING.skilt.materials)}
        </select>
      </div>
      <div class="calc-field">
        <label>Antall</label>
        <input type="number" id="c-qty" min="1" max="1000" value="1" class="calc-input">
      </div>`,

    produkter: () => `
      <div class="calc-field">
        <label>Produkt</label>
        <select id="c-product" class="calc-input">
          ${optionsFrom(PRICING.produkter.products)}
        </select>
      </div>
      <div class="calc-field">
        <label>Trykkmetode</label>
        <select id="c-method" class="calc-input">
          ${optionsFrom(PRICING.produkter.methods)}
        </select>
      </div>
      <div class="calc-field">
        <label>Antall</label>
        <input type="number" id="c-qty" min="1" max="5000" value="10" class="calc-input">
      </div>`,

    arbeidstoy: () => `
      <div class="calc-field">
        <label>Merke</label>
        <select id="c-brand" class="calc-input">
          ${optionsFrom(PRICING.arbeidstoy.brands)}
        </select>
      </div>
      <div class="calc-field">
        <label>Plagtype</label>
        <select id="c-item" class="calc-input">
          ${optionsFrom(PRICING.arbeidstoy.items)}
        </select>
      </div>
      <div class="calc-field">
        <label>Antall</label>
        <input type="number" id="c-qty" min="1" max="500" value="5" class="calc-input">
      </div>`,

    trykksaker: () => `
      <div class="calc-field">
        <label>Format</label>
        <select id="c-format" class="calc-input">
          ${optionsFrom(PRICING.trykksaker.formats)}
        </select>
      </div>
      <div class="calc-field">
        <label>Papir/finish</label>
        <select id="c-paper" class="calc-input">
          ${optionsFrom(PRICING.trykksaker.papers)}
        </select>
      </div>
      <div class="calc-field">
        <label>Sider</label>
        <select id="c-sides" class="calc-input">
          <option value="1">Ensidig</option>
          <option value="2">Tosidig</option>
        </select>
      </div>
      <div class="calc-field">
        <label>Opplag (min. 100)</label>
        <input type="number" id="c-qty" min="100" max="100000" step="100" value="100" class="calc-input">
      </div>`,

    grafisk: () => `
      <div class="calc-field">
        <label>Prosjekttype</label>
        <select id="c-project" class="calc-input">
          ${optionsFrom(PRICING.grafisk.projects)}
        </select>
      </div>
      <div class="calc-field">
        <label>Kompleksitet</label>
        <div class="radio-group">
          ${(PRICING.grafisk?.complexity || []).map(c =>
            `<label class="radio-label">
               <input type="radio" name="complexity" value="${c.id}" ${c.id==='medium'?'checked':''}>
               ${c.label}
             </label>`).join('')}
        </div>
      </div>`,

    dekor: () => `
      <div class="calc-row">
        <div class="calc-field">
          <label>Bredde (cm)</label>
          <input type="number" id="c-width" min="10" max="2000" value="200" class="calc-input">
        </div>
        <div class="calc-field">
          <label>Høyde (cm)</label>
          <input type="number" id="c-height" min="10" max="2000" value="120" class="calc-input">
        </div>
      </div>
      <div class="calc-field">
        <label>Materiale</label>
        <select id="c-material" class="calc-input">
          ${optionsFrom(PRICING.dekor.materials)}
        </select>
      </div>
      <div class="calc-field">
        <label class="checkbox-label">
          <input type="checkbox" id="c-install"> Inkluder montering
        </label>
      </div>`,

    bilfoliering: () => `
      <div class="calc-field">
        <label>Kjøretøytype</label>
        <select id="c-vehicle" class="calc-input">
          ${optionsFrom(PRICING.bilfoliering.vehicles)}
        </select>
      </div>
      <div class="calc-field">
        <label>Dekningsgrad</label>
        <select id="c-coverage" class="calc-input">
          ${optionsFrom(PRICING.bilfoliering.coverage)}
        </select>
      </div>
      <div class="calc-field">
        <label>Antall kjøretøy</label>
        <input type="number" id="c-qty" min="1" max="100" value="1" class="calc-input">
      </div>`,

    messe: () => `
      <div class="calc-field">
        <label>Utstyrstype</label>
        <select id="c-item" class="calc-input">
          ${optionsFrom(PRICING.messe.items)}
        </select>
      </div>
      <div class="calc-field">
        <label>Antall</label>
        <input type="number" id="c-qty" min="1" max="50" value="1" class="calc-input">
      </div>`,
  };

  /* ─── Calculation logic ────────────────────────── */
  const CALCULATORS = {
    skilt(f) {
      const w  = parseFloat(f('c-width'))  || 100;
      const h  = parseFloat(f('c-height')) || 60;
      const m2 = (w / 100) * (h / 100);
      const mat = findById(PRICING.skilt.materials, v('c-material')) || PRICING.skilt.materials[0];
      const qty = parseInt(f('c-qty')) || 1;
      const disc = getQtyDiscount(PRICING.skilt.qtyBreaks, qty);
      const unit = m2 * mat.pricePerM2 + PRICING.skilt.setup / qty;
      const total = unit * qty * disc;
      return range(total * 0.9, total * 1.15);
    },
    produkter(f) {
      const prod   = findById(PRICING.produkter.products, v('c-product'))  || PRICING.produkter.products[0];
      const method = findById(PRICING.produkter.methods,  v('c-method'))   || PRICING.produkter.methods[0];
      const qty    = parseInt(f('c-qty')) || 1;
      const disc   = getQtyDiscount(PRICING.produkter.qtyBreaks, qty);
      const unit   = prod.base * method.mult;
      const total  = unit * qty * disc;
      return range(total * 0.9, total * 1.12);
    },
    arbeidstoy(f) {
      const brand  = findById(PRICING.arbeidstoy.brands, v('c-brand')) || PRICING.arbeidstoy.brands[0];
      const item   = findById(PRICING.arbeidstoy.items,  v('c-item'))  || PRICING.arbeidstoy.items[0];
      const qty    = parseInt(f('c-qty')) || 1;
      const disc   = getQtyDiscount(PRICING.arbeidstoy.qtyBreaks, qty);
      const unit   = (item.base + PRICING.arbeidstoy.printBase) * brand.mult;
      const total  = unit * qty * disc;
      return range(total * 0.9, total * 1.12);
    },
    trykksaker(f) {
      const fmt    = findById(PRICING.trykksaker.formats, v('c-format')) || PRICING.trykksaker.formats[0];
      const paper  = findById(PRICING.trykksaker.papers,  v('c-paper'))  || PRICING.trykksaker.papers[0];
      const sides  = PRICING.trykksaker.sidesMult[v('c-sides')] || 1;
      const qty    = Math.max(100, parseInt(f('c-qty')) || 100);
      const disc   = getQtyDiscount(PRICING.trykksaker.qtyBreaks, qty);
      const base   = fmt.base100 * (qty / 100) * disc * paper.mult * sides;
      return range(base * 0.9, base * 1.15);
    },
    grafisk(f) {
      const proj = findById(PRICING.grafisk.projects, v('c-project')) || PRICING.grafisk.projects[0];
      const compEl = document.querySelector('input[name="complexity"]:checked');
      const comp = compEl ? (findById(PRICING.grafisk.complexity, compEl.value) || PRICING.grafisk.complexity[1]) : PRICING.grafisk.complexity[1];
      return { min: Math.round(proj.min * comp.mult), max: Math.round(proj.max * comp.mult) };
    },
    dekor(f) {
      const w  = parseFloat(f('c-width'))  || 200;
      const h  = parseFloat(f('c-height')) || 120;
      const m2 = (w / 100) * (h / 100);
      const mat = findById(PRICING.dekor.materials, v('c-material')) || PRICING.dekor.materials[0];
      const install = document.getElementById('c-install')?.checked ? PRICING.dekor.installation * m2 : 0;
      const base = m2 * mat.pricePerM2 + PRICING.dekor.setup + install;
      return range(base * 0.9, base * 1.15);
    },
    bilfoliering(f) {
      const vehicle  = findById(PRICING.bilfoliering.vehicles, v('c-vehicle'))  || PRICING.bilfoliering.vehicles[0];
      const coverage = findById(PRICING.bilfoliering.coverage, v('c-coverage')) || PRICING.bilfoliering.coverage[2];
      const qty = parseInt(f('c-qty')) || 1;
      const area = vehicle.fullArea * coverage.mult;
      const disc = qty >= 5 ? 0.82 : qty >= 3 ? 0.90 : 1;
      const unit = area * (PRICING.bilfoliering.pricePerM2 + PRICING.bilfoliering.installPerM2);
      const total = unit * qty * disc;
      return range(total * 0.9, total * 1.15);
    },
    messe(f) {
      const item = findById(PRICING.messe.items, v('c-item')) || PRICING.messe.items[0];
      const qty  = parseInt(f('c-qty')) || 1;
      const extra = qty > 1 ? (qty - 1) * PRICING.messe.qtyDiscount : 0;
      const disc = 1 - extra;
      return {
        min: Math.round(item.min * qty * disc),
        max: Math.round(item.max * qty * disc),
      };
    },
  };

  /* ─── Helpers ──────────────────────────────────── */
  function v(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }
  function f(id) {
    return v(id);
  }
  function findById(arr, id) {
    return (arr || []).find(o => o.id === id);
  }
  function optionsFrom(arr) {
    return (arr || []).map(o => `<option value="${o.id}">${o.label}</option>`).join('');
  }
  function getQtyDiscount(breaks, qty) {
    let mult = 1;
    for (const [threshold, m] of breaks) {
      if (qty >= threshold) mult = m;
    }
    return mult;
  }
  function range(min, max) {
    return { min: Math.round(min / 10) * 10, max: Math.round(max / 10) * 10 };
  }
  function fmt(n) {
    return n.toLocaleString('nb-NO') + ' NOK';
  }

  /* ─── Service icons ────────────────────────────── */
  const SERVICE_ICONS = {
    skilt: '🪟', produkter: '👕', arbeidstoy: '🦺',
    trykksaker: '🖨️', grafisk: '🎨', dekor: '🖼️',
    bilfoliering: '🚗', messe: '🏛️',
  };

  /* ─── Modal controller ─────────────────────────── */
  let currentService = null;
  let lastResult = null;

  const overlay      = document.getElementById('modalOverlay');
  const modal        = document.getElementById('calcModal');
  const titleEl      = document.getElementById('modalTitle');
  const bodyEl       = document.getElementById('modalBody');
  const resultEl     = document.getElementById('modalResult');
  const rangeEl      = document.getElementById('priceRange');
  const sendBtn      = document.getElementById('modalSend');
  const addToCartBtn = document.getElementById('modalAddToCart');
  const cancelBtn    = document.getElementById('modalCancel');
  const closeBtn     = document.getElementById('modalClose');

  function openCalc(service) {
    currentService = service;
    const cfg = PRICING[service];
    if (!cfg || !FORMS[service]) return;

    titleEl.textContent = cfg.title;
    bodyEl.innerHTML = FORMS[service]();
    resultEl.style.display = 'none';

    // Live recalculation on any input change
    bodyEl.addEventListener('input', recalc);
    bodyEl.addEventListener('change', recalc);

    overlay.classList.add('modal-overlay--visible');
    document.body.style.overflow = 'hidden';

    // Initial calculation
    recalc();
  }

  function recalc() {
    const calc = CALCULATORS[currentService];
    if (!calc) return;
    try {
      const result = calc(v);
      lastResult = result;
      rangeEl.textContent = `Fra ${fmt(result.min)} til ${fmt(result.max)}`;
      resultEl.style.display = 'block';
    } catch (e) {
      // ignore partial input
    }
  }

  function buildDetails() {
    // Build a human-readable details string from current inputs
    const parts = [];
    const inputs = bodyEl.querySelectorAll('.calc-input, input[type="radio"]:checked, input[type="checkbox"]:checked');
    inputs.forEach(el => {
      const label = bodyEl.querySelector(`label[for="${el.id}"]`)?.textContent?.trim();
      const val = el.type === 'checkbox' ? (el.checked ? el.closest('label')?.textContent?.trim() : null) : el.options?.[el.selectedIndex]?.text || el.value;
      if (label && val) parts.push(`${label}: ${val}`);
    });
    return parts.join(' · ') || PRICING[currentService]?.title || '';
  }

  function closeCalc() {
    overlay.classList.remove('modal-overlay--visible');
    document.body.style.overflow = '';
    currentService = null;
    bodyEl.innerHTML = '';
    resultEl.style.display = 'none';
  }

  // Open from "Beregn pris" buttons
  document.querySelectorAll('.calc-trigger').forEach(btn => {
    btn.addEventListener('click', () => openCalc(btn.dataset.service));
  });

  closeBtn?.addEventListener('click', closeCalc);
  cancelBtn?.addEventListener('click', closeCalc);

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeCalc();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCalc();
  });

  // "Legg i kurv" button
  addToCartBtn?.addEventListener('click', () => {
    if (!lastResult || !currentService) return;
    const cart = window.OpsisCart;
    if (!cart) return;

    cart.add({
      type: 'service',
      serviceKey: currentService,
      label: PRICING[currentService]?.title || currentService,
      details: buildDetails(),
      min: lastResult.min,
      max: lastResult.max,
      qty: 1,
      icon: SERVICE_ICONS[currentService] || '📦',
    });

    // Visual feedback
    addToCartBtn.innerHTML = '✓ Lagt i kurv!';
    addToCartBtn.style.background = '#059669';
    setTimeout(() => {
      addToCartBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Legg i kurv`;
      addToCartBtn.style.background = '';
    }, 1800);

    setTimeout(() => closeCalc(), 900);
  });

  // "Send direkte forespørsel" — pre-fills contact form directly
  sendBtn?.addEventListener('click', () => {
    const serviceSelect = document.getElementById('service');
    if (serviceSelect && currentService) {
      serviceSelect.value = currentService;
    }
    const msgField = document.getElementById('message');
    if (msgField && rangeEl) {
      const est = rangeEl.textContent;
      msgField.value = `Jeg ønsker tilbud på ${PRICING[currentService]?.title || currentService}.\nSpesifikasjon: ${buildDetails()}\nEstimert prisrange: ${est}.\n\n`;
      msgField.dataset.autoFilled = 'true';
    }
    closeCalc();
    const kontakt = document.getElementById('kontakt');
    if (kontakt) {
      const offset = kontakt.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
    setTimeout(() => document.getElementById('name')?.focus(), 600);
  });

})();
