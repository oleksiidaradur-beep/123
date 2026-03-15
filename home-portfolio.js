/**
 * home-portfolio.js
 * Loads portfolio items with showOnHome: true from /data/portfolio.json
 * and renders them into #homePortfolioGrid on the homepage.
 */
(function () {
  const grid = document.getElementById('homePortfolioGrid');
  if (!grid) return;

  const CAT_LABELS = {
    skilt:  'Skilt & storformat',
    bil:    'Bilfoliering',
    klaer:  'Profilklær',
    design: 'Grafisk design',
    trykk:  'Trykksaker',
    dekor:  'Dekorasjon',
    messe:  'Messeutstyr',
  };

  function sizeClass(size) {
    if (size === 'wide' || size === 'feature') return 'portfolio-item--wide';
    return '';
  }

  function render(projects) {
    grid.innerHTML = projects.map(p => `
      <div class="portfolio-item ${sizeClass(p.size)}" data-category="${p.cat}">
        <div class="portfolio-item__img" style="background-image:url('${p.img}');background-size:cover;background-position:center;">
          <div class="portfolio-item__overlay">
            <span class="portfolio-item__tag">${CAT_LABELS[p.cat] || p.cat}</span>
            <h4>${p.title}</h4>
            ${p.client ? `<p style="color:rgba(255,255,255,.7);font-size:.8rem;margin:0">${p.client}</p>` : ''}
          </div>
        </div>
      </div>`).join('');

    /* Re-attach filter buttons */
    document.querySelectorAll('.portfolio__filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.portfolio__filters .filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
        this.classList.add('filter-btn--active');
        const filter = this.dataset.filter;
        grid.querySelectorAll('.portfolio-item').forEach(item => {
          item.style.display = (filter === 'all' || item.dataset.category === filter) ? '' : 'none';
        });
      });
    });
  }

  fetch('/data/portfolio.json')
    .then(r => r.json())
    .then(data => {
      const homeItems = (data.projects || []).filter(p => p.showOnHome);
      render(homeItems);
    })
    .catch(() => {
      grid.innerHTML = '<p style="padding:2rem;grid-column:1/-1;color:#999">Kunne ikke laste prosjekter.</p>';
    });
})();
