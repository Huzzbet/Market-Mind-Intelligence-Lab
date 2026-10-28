// Prototype-only interactions. All displayed market figures remain simulated.
document.addEventListener('DOMContentLoaded', () => {
  const cards = [...document.querySelectorAll('.idea')];
  const heading = document.querySelector('.sectionhead');
  if (!heading || !cards.length) return;
  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.style.margin = '0 0 16px';
  controls.innerHTML = '<select id="marketFilter" aria-label="Filter market"><option value="all">All markets</option><option value="ASX">ASX</option><option value="US">US</option></select><input id="tickerSearch" class="field" aria-label="Search candidates" placeholder="Search ticker or company"><button id="demoScan" class="primary" type="button">Run demo scan ↗</button><span id="scanStatus" class="muted" aria-live="polite">Sample dataset · not live</span>';
  heading.after(controls);
  const market = controls.querySelector('#marketFilter');
  const search = controls.querySelector('#tickerSearch');
  const status = controls.querySelector('#scanStatus');
  function applyFilters() {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const marketText = card.querySelector('.ticker')?.textContent || '';
      const matchMarket = market.value === 'all' || marketText.includes(market.value);
      const matchQuery = !q || text.includes(q);
      card.hidden = !(matchMarket && matchQuery);
      if (!card.hidden) shown++;
    });
    status.textContent = shown + ' sample candidate' + (shown === 1 ? '' : 's') + ' shown · not live';
  }
  market.addEventListener('change', applyFilters);
  search.addEventListener('input', applyFilters);
  controls.querySelector('#demoScan').addEventListener('click', () => {
    applyFilters();
    status.textContent = 'Demo scan complete · sample data only';
  });
  applyFilters();
});