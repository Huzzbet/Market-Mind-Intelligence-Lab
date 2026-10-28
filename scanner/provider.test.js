import test from "node:test";
import assert from "node:assert/strict";
import { createTwelveDataProvider } from "./provider.js";

const validPayload = {
  symbol: "AAPL",
  name: "Apple Inc",
  close: "225.50",
  currency: "USD",
  datetime: "2026-10-28",
  status: "ok",
};

function fakeFetch(payload, status = 200) {
  return async (_url, options) => {
    assert.equal(options.headers.Authorization, "apikey test-secret");
    return { ok: status >= 200 && status < 300, status, json: async () => payload };
  };
}

test("normalises a valid quote and preserves provenance", async () => {
  const provider = createTwelveDataProvider({
    apiKey: "test-secret",
    fetchImpl: fakeFetch(validPayload),
    now: () => new Date("2026-10-28T23:00:00.000Z"),
  });
  const quote = await provider.getQuote("AAPL");
  assert.equal(quote.symbol, "AAPL");
  assert.equal(quote.price, 225.5);
  assert.equal(quote.currency, "USD");
  assert.equal(quote.source, "Twelve Data");
  assert.equal(quote.status, "provider-data-unverified-entitlement");
  assert.ok(quote.timestamp);
  assert.ok(quote.retrievedAt);
});

test("requires a server-side API key", () => {
  assert.throws(() => createTwelveDataProvider({ apiKey: "" }), /Missing TWELVE_DATA_API_KEY/);
});

test("rejects malformed symbols", async () => {
  const provider = createTwelveDataProvider({ apiKey: "test-secret", fetchImpl: fakeFetch(validPayload) });
  await assert.rejects(provider.getQuote("AAPL&apikey=leak"), /Invalid symbol/);
});

test("rejects invalid prices", async () => {
  const provider = createTwelveDataProvider({
    apiKey: "test-secret",
    fetchImpl: fakeFetch({ ...validPayload, close: "0" }),
  });
  await assert.rejects(provider.getQuote("AAPL"), /invalid price/);
});

test("rejects future timestamps", async () => {
  const provider = createTwelveDataProvider({
    apiKey: "test-secret",
    fetchImpl: fakeFetch({ ...validPayload, datetime: "2099-01-01" }),
    now: () => new Date("2026-10-28T23:00:00.000Z"),
  });
  await assert.rejects(provider.getQuote("AAPL"), /future timestamp/);
});

test("rejects HTTP errors without returning demo values", async () => {
  const provider = createTwelveDataProvider({
    apiKey: "test-secret",
    fetchImpl: fakeFetch({}, 429),
  });
  await assert.rejects(provider.getQuote("AAPL"), /HTTP 429/);
});
