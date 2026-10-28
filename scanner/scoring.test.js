import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreCandidate, valuationBand, validateObservation } from './scoring.js';

test('score is deterministic and weighted', () => {
  const result = scoreCandidate({ valuation: 80, momentum: 70, quality: 90, risk: 60 });
  assert.equal(result.score, 75);
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
