/* ═══════════════════════════════════════════════════
   OPSIS — Price Calculator
   All prices in NOK, shown as ranges ("fra X til Y")
   ═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── Pricing data ────────────────────────────── */
  const PRICING = {
    skilt: {
      title: 'Skilt og storformat print',
      materials: {
        vinyl:    { label: 'Vinyl folie',   pricePerM2: 180 },
        aluminium:{ label: 'Aluminium',     pricePerM2: 380 },
        acrylic:  { label: 'Akryl/plexiglass', pricePerM2: 520 },
        dibond:   { label: 'Dibond',        pricePerM2: 310 },
      },
      setup: 350,
      qtyBreaks: [[1,1],[2,0.92],[6,0.82],[11,0.72],[21,0.62]],
    },
    produkter: {
      title: 'Produkter og klær med trykk',
      products: {
        tshirt:  { label: 'T-skjorte',    base: 149 },
        polo:    { label: 'Polo',          base: 229 },
        hoodie:  { label: 'Hoodie',        base: 349 },
        jakke:   { label: 'Softshell-jakke', base: 549 },
        bag:     { label: 'Bag/sekk',      base: 199 },
        mug:     { label: 'Kopp/krus',     base: 89 },
        cap:     { label: 'Caps',          base: 149 },
      },
      methods: {
        transfer:    { label: 'Transfertrykk', mult: 1.0 },
        silk:        { label: 'Silketrykk',    mult: 0.88 },
        embroidery:  { label: 'Broderi',       mult: 1.25 },
        digital:     { label: 'Digitaltrykk',  mult: 1.1 },
      },
      qtyBreaks: [[1,1],[10,0.90],[25,0.80],[50,0.72],[100,0.62],[250,0.52]],
    },
    arbeidstoy: {
      title: 'Arbeidstøy med trykk',
      brands: {
        univern:    { label: 'Univern',     mult: 1.0 },
        bjornklader:{ label: 'Björnkläder', mult: 1.12 },
        sievi:      { label: 'Sievi',       mult: 1.18 },
      },
      items: {
        tshirt:  { label: 'T-skjorte',      base: 189 },
        polo:    { label: 'Polo',            base: 279 },
        shirt:   { label: 'Skjorte',         base: 399 },
        bukse:   { label: 'Arbeidsbukse',    base: 549 },
        jakke:   { label: 'Arbeidsjakke',    base: 749 },
        softshell: { label: 'Softshell',     base: 649 },
        overall: { label: 'Overall/kjeledress', base: 849 },
      },
      printBase: 79,
      qtyBreaks: [[1,1],[5,0.92],[10,0.84],[25,0.76],[50,0.68]],
    },
    trykksaker: {
      title: 'Trykksaker',
      formats: {
        visittkort: { label: 'Visittkort (85×54mm)', base100: 490 },
        A6:  { label: 'A6 flyer', base100: 690 },
        A5:  { label: 'A5 brosjyre', base100: 990 },
        A4:  { label: 'A4 brosjyre', base100: 1490 },
        A3:  { label: 'A3 plakat',  base100: 1990 },
      },
      papers: {
        standard: { label: 'Standard papir',  mult: 1.0 },
        premium:  { label: 'Premium papir',   mult: 1.35 },
        glossy:   { label: 'Gloss laminert',  mult: 1.5 },
        matt:     { label: 'Matt laminert',   mult: 1.45 },
      },
      sidesMult: { '1': 1.0, '2': 1.28 },
      qtyBreaks: [[100,1],[250,0.72],[500,0.58],[1000,0.46],[2500,0.36]],
    },
    grafisk: {
      title: 'Grafisk design',
      projects: {
        logo:       { label: 'Logodesign',           min: 3500, max: 8000 },
        branding:   { label: 'Merkevare/profil',     min: 7000, max: 18000 },
        visittkort: { label: 'Visittkort-design',    min: 890,  max: 1890 },
        brosure:    { label: 'Brosjyre/katalog',     min: 2500, max: 8500 },
        plakat:     { label: 'Plakat/banner-design', min: 1200, max: 3500 },
        web:        { label: 'Sosiale medier-grafikk', min: 890, max: 2500 },
        emballasje: { label: 'Emballasje-design',   min: 4500, max: 12000 },
      },
      complexity: {
        simple:  { label: 'Enkel',    mult: 0.8 },
        medium:  { label: 'Middels',  mult: 1.0 },
        complex: { label: 'Kompleks', mult: 1.5 },
      },
    },
    dekor: {
      title: 'Interiørdekor',
      materials: {
        matt:        { label: 'Matt folie',        pricePerM2: 420 },
        transparent: { label: 'Transparent folie', pricePerM2: 380 },
        print:       { label: 'Print folie',       pricePerM2: 580 },
        wallpaper:   { label: 'Fototapet',         pricePerM2: 490 },
        frosted:     { label: 'Frosted glass',     pricePerM2: 450 },
      },
      setup: 500,
      installation: 350, // per m²
    },
    bilfoliering: {
      title: 'Bilfoliering',
      vehicles: {
        car:    { label: 'Personbil',       fullArea: 22 },
        van:    { label: 'Varebil',         fullArea: 35 },
        truck:  { label: 'Lastebil/buss',   fullArea: 70 },
        bike:   { label: 'MC/elsykkel',     fullArea: 6 },
      },
      coverage: {
        '25':   { label: 'Del (25%)',   mult: 0.25 },
        '50':   { label: 'Halvfolie',  mult: 0.50 },
        '100':  { label: 'Helfolie',   mult: 1.0  },
      },
      pricePerM2: 680,
      installPerM2: 420,
    },
    messe: {
      title: 'Messeutstyr',
      items: {
        rollup:    { label: 'Roll-up (85×200cm)',  min: 890,  max: 1490  },
        rollupXL:  { label: 'Roll-up XL (100×200)', min: 1190, max: 1890 },
        banner:    { label: 'Banner/streamer',     min: 490,  max: 990   },
        flag:      { label: 'Flagg (reklameflagg)', min: 790,  max: 1490  },
        messevegg: { label: 'Messevegg (3×3m)',    min: 8900, max: 16900 },
        popup:     { label: 'Pop-up display',      min: 4500, max: 8500  },
        bord:      { label: 'Messebord m/trykk',   min: 1490, max: 2990  },
      },
      qtyDiscount: 0.08, // 8% per extra unit after 1st
    },
  };

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
          ${Object.entries(PRICING.grafisk.complexity).map(([k,v]) =>
            `<label class="radio-label">
               <input type="radio" name="complexity" value="${k}" ${k==='medium'?'checked':''}>
               ${v.label}
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
      const mat = PRICING.skilt.materials[v('c-material')] || PRICING.skilt.materials.vinyl;
      const qty = parseInt(f('c-qty')) || 1;
      const disc = getQtyDiscount(PRICING.skilt.qtyBreaks, qty);
      const unit = m2 * mat.pricePerM2 + PRICING.skilt.setup / qty;
      const total = unit * qty * disc;
      return range(total * 0.9, total * 1.15);
    },
    produkter(f) {
      const prod   = PRICING.produkter.products[v('c-product')]  || PRICING.produkter.products.tshirt;
      const method = PRICING.produkter.methods[v('c-method')]    || PRICING.produkter.methods.transfer;
      const qty    = parseInt(f('c-qty')) || 1;
      const disc   = getQtyDiscount(PRICING.produkter.qtyBreaks, qty);
      const unit   = prod.base * method.mult;
      const total  = unit * qty * disc;
      return range(total * 0.9, total * 1.12);
    },
    arbeidstoy(f) {
      const brand  = PRICING.arbeidstoy.brands[v('c-brand')] || PRICING.arbeidstoy.brands.univern;
      const item   = PRICING.arbeidstoy.items[v('c-item')]   || PRICING.arbeidstoy.items.tshirt;
      const qty    = parseInt(f('c-qty')) || 1;
      const disc   = getQtyDiscount(PRICING.arbeidstoy.qtyBreaks, qty);
      const unit   = (item.base + PRICING.arbeidstoy.printBase) * brand.mult;
      const total  = unit * qty * disc;
      return range(total * 0.9, total * 1.12);
    },
    trykksaker(f) {
      const fmt    = PRICING.trykksaker.formats[v('c-format')] || PRICING.trykksaker.formats.visittkort;
      const paper  = PRICING.trykksaker.papers[v('c-paper')]   || PRICING.trykksaker.papers.standard;
      const sides  = PRICING.trykksaker.sidesMult[v('c-sides')] || 1;
      const qty    = Math.max(100, parseInt(f('c-qty')) || 100);
      const disc   = getQtyDiscount(PRICING.trykksaker.qtyBreaks, qty);
      const base   = fmt.base100 * (qty / 100) * disc * paper.mult * sides;
      return range(base * 0.9, base * 1.15);
    },
    grafisk(f) {
      const proj = PRICING.grafisk.projects[v('c-project')] || PRICING.grafisk.projects.logo;
      const compEl = document.querySelector('input[name="complexity"]:checked');
      const comp = compEl ? (PRICING.grafisk.complexity[compEl.value] || PRICING.grafisk.complexity.medium) : PRICING.grafisk.complexity.medium;
      return { min: Math.round(proj.min * comp.mult), max: Math.round(proj.max * comp.mult) };
    },
    dekor(f) {
      const w  = parseFloat(f('c-width'))  || 200;
      const h  = parseFloat(f('c-height')) || 120;
      const m2 = (w / 100) * (h / 100);
      const mat = PRICING.dekor.materials[v('c-material')] || PRICING.dekor.materials.matt;
      const install = document.getElementById('c-install')?.checked ? PRICING.dekor.installation * m2 : 0;
      const base = m2 * mat.pricePerM2 + PRICING.dekor.setup + install;
      return range(base * 0.9, base * 1.15);
    },
    bilfoliering(f) {
      const vehicle  = PRICING.bilfoliering.vehicles[v('c-vehicle')]  || PRICING.bilfoliering.vehicles.car;
      const coverage = PRICING.bilfoliering.coverage[v('c-coverage')] || PRICING.bilfoliering.coverage['100'];
      const qty = parseInt(f('c-qty')) || 1;
      const area = vehicle.fullArea * coverage.mult;
      const disc = qty >= 5 ? 0.82 : qty >= 3 ? 0.90 : 1;
      const unit = area * (PRICING.bilfoliering.pricePerM2 + PRICING.bilfoliering.installPerM2);
      const total = unit * qty * disc;
      return range(total * 0.9, total * 1.15);
    },
    messe(f) {
      const item = PRICING.messe.items[v('c-item')] || PRICING.messe.items.rollup;
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
  function optionsFrom(obj) {
    return Object.entries(obj)
      .map(([k, o]) => `<option value="${k}">${o.label}</option>`)
      .join('');
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
