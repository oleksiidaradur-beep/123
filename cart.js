/* ═══════════════════════════════════════════════════
   OPSIS — Universal Cart System
   Manages both service estimates and clothing items.
   Exposed as window.OpisisCart for use by all modules.
   ═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── Cart state ───────────────────────────────── */
  const cart = {
    items: [],   // { id, type, label, details, min, max, qty, icon }
    listeners: [],
  };

  let _nextId = 1;

  /* ─── Public API ───────────────────────────────── */
  const OpsisCart = {

    add(item) {
      // item: { type:'service'|'product', label, details, min, max, qty, icon, serviceKey? }
      const id = `item-${_nextId++}`;
      cart.items.push({ id, ...item });
      _notify();
      _syncUI();
      _flashFab();
      return id;
    },

    remove(id) {
      cart.items = cart.items.filter(i => i.id !== id);
      _notify();
      _syncUI();
    },

    update(id, changes) {
      const item = cart.items.find(i => i.id === id);
      if (item) Object.assign(item, changes);
      _notify();
      _syncUI();
    },

    clear() {
      cart.items = [];
      _notify();
      _syncUI();
    },

    getItems() { return [...cart.items]; },

    getTotal() {
      return cart.items.reduce(
        (acc, i) => ({
          min: acc.min + (i.min || 0) * (i.qty || 1),
          max: acc.max + (i.max || 0) * (i.qty || 1),
        }),
        { min: 0, max: 0 }
      );
    },

    getCount() {
      return cart.items.reduce((s, i) => s + (i.qty || 1), 0);
    },

    onChange(fn) { cart.listeners.push(fn); },

    // Build pre-filled message for contact form
    buildMessage() {
      if (cart.items.length === 0) return '';
      const lines = cart.items.map(i => {
        const qtyStr = i.qty > 1 ? ` × ${i.qty}` : '';
        const priceStr = i.min ? ` (ca. ${_fmt(i.min * (i.qty||1))}–${_fmt(i.max * (i.qty||1))} NOK)` : '';
        return `• ${i.label}${qtyStr}${priceStr}\n  ${i.details || ''}`;
      }).join('\n');
      const total = OpsisCart.getTotal();
      return `Ønskede tjenester og produkter:\n${lines}\n\nEstimert totalsum: ${_fmt(total.min)}–${_fmt(total.max)} NOK\n\nVennligst send endelig tilbud.`;
    },
  };

  /* ─── UI sync ──────────────────────────────────── */
  function _notify() {
    cart.listeners.forEach(fn => fn(cart.items));
  }

  function _fmt(n) {
    return Math.round(n).toLocaleString('nb-NO');
  }

  function _syncUI() {
    const count = OpsisCart.getCount();
    const total = OpsisCart.getTotal();

    // Floating cart fab
    const fab = document.getElementById('globalCartFab');
    const fabCount = document.getElementById('globalCartCount');
    if (fab) {
      fab.style.display = count > 0 ? 'flex' : 'none';
      if (fabCount) fabCount.textContent = count;
    }

    // Order summary section
    const summarySection = document.getElementById('bestilling');
    const orderItems = document.getElementById('orderItems');
    const orderEmpty  = document.getElementById('orderEmpty');
    const totalMin    = document.getElementById('orderTotalMin');
    const totalMax    = document.getElementById('orderTotalMax');

    if (summarySection) {
      summarySection.style.display = count > 0 ? 'block' : 'none';
    }

    if (orderItems && orderEmpty) {
      if (count === 0) {
        orderItems.innerHTML = '';
        orderEmpty.style.display = 'block';
      } else {
        orderEmpty.style.display = 'none';
        _renderOrderItems(orderItems);
      }
    }

    if (totalMin) totalMin.textContent = _fmt(total.min);
    if (totalMax) totalMax.textContent = _fmt(total.max);

    // Contact sidebar summary
    const contactSummary = document.getElementById('contactCartSummary');
    const contactList    = document.getElementById('contactCartList');
    const contactTotal   = document.getElementById('contactCartTotal');

    if (contactSummary) {
      contactSummary.style.display = count > 0 ? 'block' : 'none';
    }
    if (contactList && count > 0) {
      contactList.innerHTML = cart.items.map(i => `
        <li>
          <span>${i.icon || '•'} ${i.label}${i.qty > 1 ? ` × ${i.qty}` : ''}</span>
          <span>${_fmt(i.min * (i.qty||1))}–${_fmt(i.max * (i.qty||1))} NOK</span>
        </li>
      `).join('');
    }
    if (contactTotal) {
      contactTotal.textContent = `${_fmt(total.min)}–${_fmt(total.max)} NOK`;
    }

    // Pre-fill message textarea
    const msgField = document.getElementById('message');
    if (msgField && count > 0 && msgField.dataset.autoFilled !== 'true') {
      msgField.value = OpsisCart.buildMessage();
      msgField.dataset.autoFilled = 'true';
    } else if (msgField && count === 0) {
      if (msgField.dataset.autoFilled === 'true') msgField.value = '';
      msgField.dataset.autoFilled = 'false';
    }
  }

  function _renderOrderItems(container) {
    container.innerHTML = cart.items.map(item => `
      <div class="order-item" data-id="${item.id}">
        <div class="order-item__icon">${item.icon || '📦'}</div>
        <div class="order-item__body">
          <div class="order-item__header">
            <h4 class="order-item__name">${item.label}</h4>
            <div class="order-item__price">
              ${_fmt(item.min * (item.qty||1))} – ${_fmt(item.max * (item.qty||1))} NOK
            </div>
          </div>
          <p class="order-item__details">${item.details || ''}</p>
          ${item.qty > 1 ? `
            <div class="order-item__qty">
              <button class="qty-btn order-item-qty-minus" data-id="${item.id}">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn order-item-qty-plus" data-id="${item.id}">+</button>
              <span class="order-item__unit-price">á ${_fmt(item.min)}–${_fmt(item.max)} NOK/stk</span>
            </div>
          ` : ''}
        </div>
        <div class="order-item__actions">
          ${item.serviceKey ? `
            <button class="order-item__edit calc-trigger" data-service="${item.serviceKey}" title="Rediger">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          ` : ''}
          <button class="order-item__remove" data-id="${item.id}" title="Fjern">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    // Bind remove / qty buttons
    container.querySelectorAll('.order-item__remove').forEach(btn => {
      btn.addEventListener('click', () => OpsisCart.remove(btn.dataset.id));
    });
    container.querySelectorAll('.order-item-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.items.find(i => i.id === btn.dataset.id);
        if (item && item.qty > 1) OpsisCart.update(btn.dataset.id, { qty: item.qty - 1 });
        else OpsisCart.remove(btn.dataset.id);
      });
    });
    container.querySelectorAll('.order-item-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.items.find(i => i.id === btn.dataset.id);
        if (item) OpsisCart.update(btn.dataset.id, { qty: (item.qty || 1) + 1 });
      });
    });
  }

  function _flashFab() {
    const fab = document.getElementById('globalCartFab');
    if (!fab) return;
    fab.classList.add('global-cart-fab--flash');
    setTimeout(() => fab.classList.remove('global-cart-fab--flash'), 600);
  }

  /* ─── FAB click → scroll to #bestilling ──────── */
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('globalCartFab')?.addEventListener('click', () => {
      const target = document.getElementById('bestilling');
      if (!target) return;
      const navH = (document.getElementById('navbar')?.offsetHeight || 70) + 16;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });

    document.getElementById('clearCartBtn')?.addEventListener('click', () => {
      if (confirm('Vil du tømme hele kurven?')) OpsisCart.clear();
    });

    // Pre-fill message when contact section is scrolled to
    const contactSection = document.getElementById('kontakt');
    if (contactSection) {
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          const msg = document.getElementById('message');
          if (msg && !msg.value && OpsisCart.getCount() > 0) {
            msg.value = OpsisCart.buildMessage();
            msg.dataset.autoFilled = 'true';
          }
        }
      }, { threshold: 0.1 });
      io.observe(contactSection);
    }
  });

  /* ─── Expose globally ──────────────────────────── */
  window.OpsisCart = OpsisCart;

})();
