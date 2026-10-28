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
  const briefs = {
    CBA: {
      subtitle: "Commonwealth Bank · ASX · illustrative template",
      thesis: "Assess franchise strength and earnings resilience against the price being paid. A strong business is not automatically an attractive investment at every valuation.",
      evidence: "Verify current results, net interest margin, deposit mix, arrears, capital ratios, dividend outlook and a valuation range based on documented assumptions.",
      risks: "Credit deterioration, mortgage competition, regulatory changes, funding costs, margin compression and valuation multiple contraction.",
      invalidation: "The thesis weakens if credit losses rise materially, earnings quality deteriorates, or the verified valuation no longer offers an adequate return for the risks.",
      next: "Retrieve latest company disclosures, compare peer valuation, document base/bull/bear assumptions, and stress-test rates, margins and credit losses."
    },
    WDS: {
      subtitle: "Woodside Energy · ASX · illustrative template",
      thesis: "Analyse the company's cash generation across commodity cycles rather than extrapolating a single oil or LNG price.",
      evidence: "Verify production guidance, realised prices, operating costs, capex, project timelines, balance sheet, hedging and dividend coverage.",
      risks: "Oil and LNG price volatility, project execution, cost inflation, policy changes, emissions obligations and capital allocation.",
      invalidation: "The thesis weakens if project costs rise, delivery slips, commodity assumptions break down or distributions are not supported by sustainable cash flow.",
      next: "Build commodity sensitivities, review project-level disclosures, estimate through-cycle cash flow and compare enterprise value with relevant peers."
    },
    AMD: {
      subtitle: "Advanced Micro Devices · US · illustrative template",
      thesis: "Evaluate whether product competitiveness and potential growth justify the expectations embedded in the share price.",
      evidence: "Verify segment revenue, gross margins, product roadmaps, customer concentration, data-centre demand, competitive positioning and valuation assumptions.",
      risks: "Competitive pressure, execution risk, export restrictions, customer concentration, cyclicality and a valuation that assumes exceptional growth.",
      invalidation: "The thesis weakens if market-share gains stall, margins disappoint, growth expectations reset or the price leaves insufficient room for execution risk.",
      next: "Review latest filings and earnings commentary, compare peer multiples, map product-cycle catalysts and test downside scenarios."
    }
  };
  const backdrop = document.querySelector('#detailBackdrop');
  const close = document.querySelector('#closeDetail');
  function closeBrief() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.open-detail').forEach(button => {
    button.addEventListener('click', () => {
      const ticker = button.dataset.ticker;
      const brief = briefs[ticker];
      if (!brief) return;
      document.querySelector('#detailTitle').textContent = ticker + ' research brief';
      document.querySelector('#detailSubtitle').textContent = brief.subtitle;
      document.querySelector('#detailThesis').textContent = brief.thesis;
      document.querySelector('#detailEvidence').textContent = brief.evidence;
      document.querySelector('#detailRisks').textContent = brief.risks;
      document.querySelector('#detailInvalidation').textContent = brief.invalidation;
      document.querySelector('#detailNext').textContent = brief.next;
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      close.focus();
    });
  });
  close.addEventListener('click', closeBrief);
  backdrop.addEventListener('click', event => {
    if (event.target === backdrop) closeBrief();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && backdrop.classList.contains('open')) closeBrief();
  });
  applyFilters();
});