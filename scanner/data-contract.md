# Market data contract

The scanner must not treat demo data as live. Every observation supplied to scoring or UI should carry:

- `symbol`, `market`, `price`, and `currency`
- `source` (provider or official disclosure URL)
- `asOf` (timestamp with timezone, preferably ISO 8601)
- `retrievedAt` (when our adapter fetched the record)
- `delayMinutes` or a clear provider-defined delay status, where known
- optional `volume`, `previousClose`, and corporate-action adjustment metadata

## Adapter requirements

1. Keep provider-specific HTTP and response parsing inside a dedicated adapter; never scrape data silently from an arbitrary site.
2. Validate the response shape, currency, symbol, timestamp and positive price before publishing an observation.
3. Display `LIVE`, `DELAYED`, `STALE`, or `DEMO` based on the actual provider terms and timestamp. Never label data live merely because a request just succeeded.
4. If the provider errors or returns stale/invalid data, show the error and last successful timestamp; do not silently fall back to sample numbers.
5. Store credentials only in deployment secrets/environment variables, never in source control or browser-side JavaScript.
6. Respect licensing, attribution, rate limits and redistribution terms for each data provider.

## Before choosing a provider

Compare ASX and US coverage, price delay, historical depth, fundamentals, corporate actions, API limits, commercial/redistribution rights, and cost. No provider has been selected or connected yet.
