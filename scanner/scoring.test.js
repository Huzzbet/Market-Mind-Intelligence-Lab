import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreCandidate, valuationBand, validateObservation, classifyFreshness } from './scoring.js';

test('score is deterministic and weighted', () => {
  const result = scoreCandidate({ valuation: 80, momentum: 70, quality: 90, risk: 60 });
  assert.equal(result.score, 76);
});
test('rejects factor scores outside 0–100', () => {
  assert.throws(() => scoreCandidate({ valuation: 110, momentum: 70, quality: 90, risk: 60 }), /0 to 100/);
});
test('rejects weights that do not sum to one', () => {
  assert.throws(() => scoreCandidate({ valuation: 80, momentum: 70, quality: 90, risk: 60 }, { valuation: .5, momentum: .5, quality: .5, risk: .5 }), /sum to 1/);
});
test('valuation band uses fair value discount', () => {
  assert.equal(valuationBand(80, 100).label, 'Deep value');
  assert.equal(valuationBand(90, 100).label, 'Good value');
  assert.equal(valuationBand(100, 100).label, 'Fair value');
  assert.equal(valuationBand(120, 100).label, 'Above value');
});
test('observation validator requires provenance and timestamp', () => {
  assert.deepEqual(validateObservation({ symbol: 'ABC', price: 10, currency: 'AUD' }), ['Missing source attribution', 'Missing or invalid asOf timestamp']);
});

test('returns transparent weighted component contributions', () => {
  const result = scoreCandidate({ valuation: 80, momentum: 70, quality: 90, risk: 60 });
  assert.deepEqual(result.components, { valuation: 24, momentum: 17.5, quality: 22.5, risk: 12 });
  assert.equal(Object.values(result.components).reduce((a, b) => a + b, 0), 76);
});

test('rejects missing factor values instead of silently scoring them', () => {
  assert.throws(() => scoreCandidate({ valuation: 80, momentum: 70, quality: 90 }), /factors.risk/);
});

test('rejects negative weights', () => {
  assert.throws(() => scoreCandidate(
    { valuation: 80, momentum: 70, quality: 90, risk: 60 },
    { valuation: 1.2, momentum: -0.1, quality: 0, risk: -0.1 }
  ), /non-negative and sum to 1/);
});

test('valuation band reports signed discount percentage', () => {
  assert.equal(valuationBand(90, 100).discountPct, 10);
  assert.equal(valuationBand(120, 100).discountPct, -20);
});

test('observation validator flags future timestamps', () => {
  const future = new Date(Date.now() + 60 * 60_000).toISOString();
  assert.deepEqual(
    validateObservation({ symbol: 'ABC', price: 10, currency: 'AUD', source: 'fixture', asOf: future }),
    ['Observation timestamp is in the future']
  );
});

test('classifies stale observations without pretending they are live', () => {
  const now = Date.parse('2026-10-28T12:00:00.000Z');
  const result = classifyFreshness({ asOf: '2026-10-28T10:00:00.000Z' }, { now, maxAgeMs: 30 * 60_000 });
  assert.equal(result.status, 'stale');
  assert.equal(result.ageMs, 2 * 60 * 60_000);
});

test('freshness classification still requires feed entitlement verification', () => {
  const now = Date.parse('2026-10-28T12:00:00.000Z');
  const result = classifyFreshness({ asOf: '2026-10-28T11:59:00.000Z' }, { now, maxAgeMs: 5 * 60_000 });
  assert.equal(result.status, 'within-threshold');
  assert.match(result.reason, /entitlement still must be verified/);
});

test('freshness classification rejects invalid thresholds', () => {
  assert.throws(() => classifyFreshness({ asOf: new Date().toISOString() }, { maxAgeMs: -1 }), /non-negative finite/);
});
