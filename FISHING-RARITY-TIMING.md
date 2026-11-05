# Fishing rarity timing

Config: FishingConfig.mechanic.rarityTiming in assets/fishing-config.js. Applies to tab 7. secondsPerRevolution is seconds for one full turn; lower is faster. color is fish body, finColor is fins. These fields are included in the existing full JSON config download.

| Pet rarity | Seconds / turn | Fish color |
|---|---:|---|
| COMMON | 2.8 | #a9bdce |
| RARE | 2.5 | #42aaff |
| EPIC | 2.25 | #ac69f0 |
| LEGENDARY | 2.0 | #ffca45 |
| MYTHIC | 1.8 | #f56389 |
| APEX | 1.6 | #27d9bd |

Pet is drawn exactly once at cast start and retained through reveal. Tap results only roll Gen; they do not reroll the pet. The running fish icon uses that pet rarity immediately. Reset clears the rarity color; restoring a pending offer restores its color. Debug timing is a multiplier relative to the rarity config: default 1x, slow 0.75x, fast 1.29x.

No pet weight, price, Gen weight, tap score, number of taps or reveal delay is changed. The 300-active-hour target remains conditional on full gold and 10 seconds per cast; player accuracy and actual cast duration may change with difficulty.

Verified all six speeds against a 1/30-second debug step, all colors, single draw per cast, and identity match between the preselected pet and final offer.
