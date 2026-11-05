# Fishing — Rebirth progression

Applied to website configs; source Excel files are unchanged. Supersedes previous rarity budgets. All original 35 fish and 21 merged Muta/Weather Gen remain eligible.

Pet weights and prices are restored exactly to the original Fishing data (35 species, all five weight columns). No custom pet rarity budgets apply. Existing user-requested Rebirth ranges stay R1–4 / R5–8 / R9–13 / R14–18 / R19+. Only Muta/Weather Gen rarity is rebalanced.

Gen type probabilities below are conditional on receiving a Gen, not per cast.

| Rebirth | Basic | Uncommon | Advanced | Rare | Epic | Exclusive |
|---|---:|---:|---:|---:|---:|---:|
| R1–4 | 95% | 4.9% | 0.095% | 0.004% | 0.0008% | 0.0002% |
| R5–8 | 90% | 9.5% | 0.45% | 0.045% | 0.0045% | 0.0005% |
| R9–13 | 83% | 15% | 1.8% | 0.18% | 0.018% | 0.002% |
| R14–18 | 74% | 22% | 3.5% | 0.45% | 0.045% | 0.005% |
| R19+ | 63% | 30% | 6% | 0.85% | 0.135% | 0.015% |

Fish first → Gen chance from three taps → weighted Gen type. Green +5%, gold +20%, red +0%. Max one Gen; full green 15%, full gold 60%. Rebirth changes quality, not the chance to receive any Gen. Red still catches a fish without Gen.

Each Gen band totals 1,000,000 weight. Within-tier relative weights from the previous config are retained, apportioned to integer weights by largest remainder. Species, prices, and Gen effects are retained. Every Gen rarity threshold has a strictly higher combined probability in each later band. Rebirth remains constant within a band; R19+ uses the final band.

Example: full gold gives Rare-or-better Gen per cast of 60% × 0.005% = 0.003% at R1–4, versus 60% × 1% = 0.6% at R19+. These are independent random draws, without pity or guaranteed timing.

Validation: 10,000 casts × six tap scenarios × five bands = 300,000 casts. Reports in reports/fishing-simulation.md and JSON/CSV. Exact assertions verify original pet rows, positive Gen weights, Gen totals, increasing Gen rarity thresholds, unchanged tap scores, and no double Gen.
