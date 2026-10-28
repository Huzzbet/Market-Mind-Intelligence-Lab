# Market data provider options

Status: research note only. No provider is connected and no market data in the dashboard should be described as live until the feed is implemented and freshness is verified.

## What the scanner needs

- ASX and US equity coverage, with symbol mapping and currency metadata.
- Latest quote or close, timestamp, and explicit delayed / real-time / end-of-day status.
- Historical daily prices for momentum, volatility and later backtesting.
- Fundamentals and corporate actions where available, with source and as-of date.
- Documented API terms allowing the intended display and analysis use.
- Server-side credential handling; never put API secrets in browser code or a public repository.
- Rate-limit handling, caching, timeout behaviour, and a visible unavailable/stale state. Never silently substitute demo data.

## Shortlist to evaluate

### 1. Twelve Data
Its public exchange catalogue includes ASX instruments and its API documents quote, price, time-series and statistics endpoints. It may be a practical single-provider candidate for an initial ASX + US adapter. Before choosing it, confirm the current plan's ASX coverage, quota, latency, historical depth, fundamentals availability and terms for displaying data in this app.

Reference: https://twelvedata.com/exchanges/xasx

### 2. Openmarkets
Australian market-data APIs document quotes, time series, trades and securities information, with Australian and international market coverage. This could suit a more professional integration, but requires onboarding and appropriate API credentials/entitlements.

References:
- https://docs.openmarkets.com.au/api/market-data/overview
- https://openmarkets.com.au/developers/

### 3. Split-provider option: licensed ASX feed + US provider
ASX explains that real-time and delayed data are provided directly or through authorised vendors, and that licensing depends on the intended access and use. A split-provider architecture may be appropriate if one provider cannot meet both markets' requirements.

References:
- https://www.asx.com.au/connectivity-and-data/information-services/price-data.html
- https://www.asx.com.au/connectivity-and-data/information-services/price-data/how-to-access-asx-price-data

### 4. Alpaca (US market only)
Alpaca provides US stock data and historical endpoints. Its free/basic equity feed is IEX-only and has limitations compared with consolidated all-exchange coverage, so it is not by itself a complete ASX + US solution. It could be considered for US data if its feed limitations and terms suit the intended use.

Reference: https://docs.alpaca.markets/us/docs/about-market-data-api

## Recommended next step

Evaluate Twelve Data first as the simplest potential single-provider prototype, then compare it with Openmarkets if stronger Australian market coverage or adviser-oriented entitlements are needed. This is a shortlist, not a final selection. Do not connect a provider until plan limits, exchange entitlements, permitted use, and secret storage have been confirmed.

## Acceptance checks before showing a real-data badge

1. The API request succeeds from a server-side adapter.
2. Returned symbol, currency, price and timestamp are parsed and validated.
3. UI shows the source and the data's as-of time.
4. Stale or failed requests display a clear warning rather than demo values.
5. Tests cover malformed, missing, stale and future-dated observations.
6. Any provider key is stored in deployment secrets and is never committed to Git.
