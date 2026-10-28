/**
 * Server-side Twelve Data adapter.
 * Keep this module behind a server endpoint (e.g. Cloudflare Worker).
 * Never import it into browser code and never expose TWELVE_DATA_API_KEY.
 */
export function createTwelveDataProvider({
  apiKey,
  fetchImpl = fetch,
  baseUrl = "https://api.twelvedata.com",
  now = () => new Date(),
} = {}) {
  if (!apiKey) throw new Error("Missing TWELVE_DATA_API_KEY server secret");

  return {
    async getQuote(symbol, { exchange, country } = {}) {
      if (typeof symbol !== "string" || !/^[A-Za-z0-9.:-]{1,20}$/.test(symbol)) {
        throw new TypeError("Invalid symbol");
      }

      const url = new URL("/quote", baseUrl);
      url.searchParams.set("symbol", symbol);
      if (exchange) url.searchParams.set("exchange", exchange);
      if (country) url.searchParams.set("country", country);

      const response = await fetchImpl(url, {
        headers: { Authorization: `apikey ${apiKey}`, Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        throw new Error(`Market data provider returned HTTP ${response.status}`);
      }

      const payload = await response.json();
      if (payload.status === "error" || payload.code || payload.message && !payload.close) {
        throw new Error("Market data provider returned an error or unavailable quote");
      }

      const price = Number(payload.close ?? payload.price);
      const currency = payload.currency;
      const timestampRaw = payload.timestamp ?? payload.datetime;
      const timestamp = typeof timestampRaw === "number"
        ? new Date(timestampRaw * 1000)
        : new Date(timestampRaw);
      if (!Number.isFinite(price) || price <= 0) throw new Error("Provider returned an invalid price");
      if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) {
        throw new Error("Provider returned a missing or invalid currency");
      }
      if (Number.isNaN(timestamp.getTime()) || timestamp > now()) {
        throw new Error("Provider returned a missing, invalid, or future timestamp");
      }

      return {
        symbol: payload.symbol || symbol,
        name: payload.name || payload.symbol || symbol,
        price,
        currency,
        timestamp: timestamp.toISOString(),
        source: "Twelve Data",
        status: "provider-data-unverified-entitlement",
        retrievedAt: now().toISOString(),
        rawProviderStatus: payload.status || null,
      };
    },
  };
}
