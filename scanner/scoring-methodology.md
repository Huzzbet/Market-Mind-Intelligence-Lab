# Scoring methodology (prototype)

## Purpose

The scanner score is a prioritisation aid for further research, not a price target, probability of return, or recommendation. The current UI examples are simulated and do not use the engine's calculated results.

## Current weighting framework

| Factor | Weight | Direction |
|---|---:|---|
| Valuation | 30% | Higher means more attractive valuation under a documented method |
| Momentum | 25% | Higher means stronger defined trend/relative strength |
| Quality | 25% | Higher means stronger fundamentals on defined measures |
| Risk | 20% | Higher means safer / lower measured risk |

The code expects each factor score to be between 0 and 100. The total is the weighted sum rounded to the nearest integer. Component contributions are returned separately so the total can be explained.

## Critical limitations

- The code validates the score inputs; it does not yet calculate valuation, momentum, quality or risk from financial statements or price histories.
- No current fair value is calculated. The valuation band helper only compares a supplied price with a supplied fair value; the fair value must come from a separately documented method.
- The default weights are initial product assumptions, not empirically optimised weights.
- A high score is not an expected return and should not be interpreted as a probability of success.
- Missing factor inputs are rejected rather than silently imputed.
- Scores should include data coverage, as-of dates and confidence/uncertainty notes before they are used for comparisons.

## Proposed next research iteration

1. Define transparent factor formulas and minimum input requirements.
2. Record source, currency, exchange, as-of time and missing-data flags for every input.
3. Test factor behaviour on historical data without look-ahead bias.
4. Compare scores against simple baselines and across different market regimes.
5. Perform sensitivity analysis on weights and input assumptions.
6. Keep a research audit trail for score changes.

## Freshness

`classifyFreshness` compares an observation timestamp against a caller-supplied threshold. Thresholds must be chosen for the feed type, exchange and session. Being within the threshold does not prove the feed is real-time or licensed; source entitlements and feed status must be verified separately.
