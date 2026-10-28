# Prototype readiness checklist

This checklist tracks readiness before real market data is enabled. It is not evidence that an item has passed.

## 1. Build and tests
- [ ] GitHub Actions run completes successfully on `prototype/intelligence-lab`.
- [ ] Scoring and provider tests pass in CI.
- [ ] Add CI tests for missing timestamps, stale quotes, invalid currency, provider error payloads and HTTP rate limits.
- [ ] Confirm Pages deployment only occurs after tests pass.

## 2. Scoring model
Current default weights: valuation 30%, momentum 25%, quality 25%, risk 20%.

Before using scores for decisions:
- [ ] Define reproducible calculation rules for each factor and score range.
- [ ] Document how missing data is handled; do not silently replace missing inputs with zero or sample data.
- [ ] Display factor contributions and the overall score.
- [ ] Confirm that a higher risk subscore means safer / lower risk, consistently.
- [ ] Add sensitivity checks so small input changes do not create misleading certainty.
- [ ] Label all scores as research signals, not recommendations or forecasts.

## 3. Data provenance and freshness
Every real observation should carry:
- symbol, instrument name, exchange and currency
- price and provider timestamp
- retrieval timestamp and provider/source name
- feed status: live, delayed, end-of-day, stale, unavailable or simulated
- provider error and entitlement status where relevant

- [ ] Set explicit freshness thresholds per market and feed type.
- [ ] Display stale/unavailable warnings.
- [ ] Never silently fall back from a failed live request to demo prices.

## 4. Guided opportunity detail
Each candidate should show:
- concise thesis and what evidence supports it
- valuation method, assumptions and fair-value range (where available)
- momentum and quality inputs, with dates and sources
- risks, counter-evidence and potential thesis invalidation
- upcoming catalysts and relevant dates, if verified
- what additional information is missing
- score breakdown and confidence/data-quality indicator

Do not generate precise fair values or confidence labels from unverified or incomplete inputs.

## 5. Security and provider terms
- [ ] API credentials are stored only as server-side deployment secrets.
- [ ] No keys or private configuration in browser code, Git history or public logs.
- [ ] Confirm provider plan, exchange entitlements, rate limits and permitted display/use.
- [ ] Confirm redistribution terms before showing ASX data publicly.
- [ ] Restrict backend endpoints, validate symbols, add caching/rate limiting and allowlisted CORS.
- [ ] Keep a clear demo mode while live data is not approved.

## 6. Release gates
Do not label the scanner "live" until:
1. CI is green.
2. Real provider requests succeed in the server environment.
3. Symbol, price, currency and timestamps validate.
4. Stale/error cases have been tested.
5. Data entitlements and intended display use are confirmed.
6. The UI visibly distinguishes live/delayed/EOD/demo states.

## Current known status
- Scoring engine and tests: added; execution still needs confirmation.
- Twelve Data adapter: added; not connected to the UI or deployed as a backend.
- API key: not configured.
- ASX public redistribution entitlement: not verified.
- Existing dashboard cards: simulated demo data.
