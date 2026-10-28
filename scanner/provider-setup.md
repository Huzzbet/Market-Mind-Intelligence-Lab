# Provider adapter setup (prototype)

The Twelve Data adapter is implemented in `scanner/provider.js` as a server-side module. It is intentionally not wired into the browser UI: the GitHub Pages site is static, and placing a provider key in browser code would expose it to every visitor.

## Before connecting real ASX data

The current public prototype is not approved to display raw ASX market data publicly. Twelve Data's current terms say ASX data is restricted to internal use unless the required ASX redistribution licence is obtained. Verify the latest licence and plan terms before deploying an ASX feed. See:
- https://support.twelvedata.com/en/articles/5332349-commercial-and-personal-usage
- https://twelvedata.com/pricing

Twelve Data currently lists real-time US stocks on its Grow plan and delayed Australian market data on Pro, while ASX add-on and registration requirements apply. Confirm current entitlements before relying on any endpoint. This project does not claim live access.

## Server-side requirements

1. Deploy a separate backend such as a Cloudflare Worker; do not deploy this module as a browser asset.
2. Store `TWELVE_DATA_API_KEY` as a server secret (for Cloudflare, a Worker secret), never in GitHub files, HTML, JavaScript served to browsers, or commits.
3. Restrict the backend to an allowlist of symbols and permitted request types; add caching, rate limiting, and CORS allowlisting.
4. Return source, timestamp, retrievedAt, and a clear freshness/status label.
5. On provider errors, stale values, missing fields, or quota limits, return an explicit unavailable state. Do not silently substitute sample prices.
6. Confirm licensing for the intended use before displaying provider data publicly.

## Current status

- Adapter: implemented, pending runtime tests and deployment.
- Live API key: not configured.
- ASX entitlement/licensing: not verified.
- UI connection: not implemented.
- Existing demo cards remain simulated and must not be relabelled as live.
