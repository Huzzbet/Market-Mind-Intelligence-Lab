/**
 * Market Mind Intelligence Lab — deterministic research scoring.
 * Input observations must come from verified providers and include timestamps.
 * This module deliberately does not fetch data or fabricate prices.
 */
export const DEFAULT_WEIGHTS = Object.freeze({ valuation: 0.30, momentum: 0.25, quality: 0.25, risk: 0.20 });

function validScore(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new TypeError(`${name} must be a finite number from 0 to 100`);
  }
  return value;
}

export function scoreCandidate(factors, weights = DEFAULT_WEIGHTS) {
  const keys = Object.keys(DEFAULT_WEIGHTS);
  for (const key of keys) validScore(factors?.[key], `factors.${key}`);
  const weightTotal = keys.reduce((sum, key) => sum + Number(weights[key] ?? 0), 0);
  if (keys.some(key => !Number.isFinite(weights[key]) || weights[key] < 0) || Math.abs(weightTotal - 1) > 1e-8) {
    throw new TypeError('Weights must be non-negative and sum to 1');
  }
  // Risk is defined as a higher-is-safer score, not a higher-risk score.
  const raw = keys.reduce((sum, key) => sum + factors[key] * weights[key], 0);
  return { score: Math.round(raw), components: Object.fromEntries(keys.map(key => [key, Math.round(factors[key] * weights[key] * 100) / 100])), weights: { ...weights } };
}

export function valuationBand(price, fairValue) {
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(fairValue) || fairValue <= 0) {
    throw new TypeError('Price and fair value must be positive finite numbers');
  }
  const discount = (fairValue - price) / fairValue;
  let label;
  if (discount >= 0.20) label = 'Deep value';
  else if (discount >= 0.10) label = 'Good value';
  else if (discount >= -0.10) label = 'Fair value';
  else label = 'Above value';
  return { label, discountPct: Math.round(discount * 1000) / 10 };
}

export function validateObservation(observation) {
  const errors = [];
  if (!observation || typeof observation !== 'object') return ['Observation must be an object'];
  if (!observation.symbol || typeof observation.symbol !== 'string') errors.push('Missing symbol');
  if (!Number.isFinite(observation.price) || observation.price <= 0) errors.push('Price must be positive');
  if (!observation.currency || typeof observation.currency !== 'string') errors.push('Missing currency');
  if (!observation.source || typeof observation.source !== 'string') errors.push('Missing source attribution');
  if (!observation.asOf || Number.isNaN(Date.parse(observation.asOf))) errors.push('Missing or invalid asOf timestamp');
  const age = observation.asOf ? Date.now() - Date.parse(observation.asOf) : Infinity;
  if (age < -5 * 60_000) errors.push('Observation timestamp is in the future');
  return errors;
}
