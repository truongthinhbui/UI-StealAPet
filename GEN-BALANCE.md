# Shared Gen catalog and Fishing balance v2

> Historical v2 snapshot. Current v3 keeps these conservative Gen shares but aligns bands to the original Fishing pool (1–5 / 6–10 / 11–15 / 16–20 / 21+) and rolls fish before Gen. See FISHING-CONFIG-v3.md and outputs/fishing-v3.

The user's requested merge combines the **reward catalog and Fishing draw pool**, not the original item application formulas or pet income formulas. Source workbooks are unchanged. No stacking or income multiplier is invented for combining weather and mutation effects.

## Sources and distinctions

- Master Data, `MutaGen Config!A23:M53`: 10 named targets, each with S/SS/SSS entries. Galaxy prices/chances are blank.
- Master Data, `WeatherGen Config!A23:G56`: 11 named targets. Sparkle item rows target **Bling Bling**; keep that canonical target name. Aurora prices/chances are blank.
- Source prices and base application chances are retained as metadata in `assets/gen-config.js`. They express item investment/application difficulty, not Fishing drop probability. S/SS/SSS grades do not become Gen rarity tiers.
- **Frozen** (MutaGen) and **Frost** (WeatherGen) are distinct, with distinct icons. Do not merge them accidentally because both depict ice.
- Gale pricing is non-monotonic in the source: S=60, SS=40, SSS=70 Pet Coins. Preserve the inputs and flag this for source balancing; do not derive Fishing weights automatically from them.
- Galaxy and Aurora are in the catalog but disabled in Fishing. Their missing prices/chances are not replaced with fabricated numbers.

## Authored conservative Fishing pool at R1–R4

| Gen | Original family | First-draw share, conditional on drawing a Gen |
|---|---|---:|
| Golden | MutaGen | 55% |
| Soaked | WeatherGen | 30% |
| Frozen | MutaGen | 10% |
| Frost | WeatherGen | 4.5% |
| Gale | WeatherGen | 0.5% |

These shares total 100% (integer weight total 1,000,000). They are a new prototype balance based on protecting higher-investment Gen, not copied drop rates or a claim of approved economy balance. Golden/Soaked account for 85% of the first draw.

**Hard locked at 0% in Fishing:** Magma, Thundered, Clover, Eclipse, Fossilized, Prismatic, Vortex, Sequin, Sweetheart, Crystalline, Radioactive, Webbed, Bling Bling, Stormspark, Galaxy, Aurora. Gold hits, Rebirth and global Luck cannot bypass the whitelist.

## Rebirth progression

Pet weights already follow the selected `fishing 1.0.1` Rebirth bands. Gen first-draw shares now also follow these bands, as a new prototype balance:

| Gen | R1–R4 | R5–R8 | R9–R13 | R14–R18 | R19+ |
|---|---:|---:|---:|---:|---:|
| Golden | 55% | 50% | 45% | 40% | 35% |
| Soaked | 30% | 32% | 34% | 36% | 38% |
| Frozen | 10% | 12% | 14% | 16% | 18% |
| Frost | 4.5% | 5.25% | 6% | 6.75% | 7.5% |
| Gale | 0.5% | 0.75% | 1% | 1.25% | 1.5% |

Every column totals 100%. This improves variety gradually while keeping Golden/Soaked dominant (85% at R1, 73% at R19). It does not increase the chance of any Gen, add Gen slots or unlock advanced Gen. Score still determines zero/one/two Gen. The cast-start Rebirth snapshot controls both pet and Gen pools; editing debug Rebirth mid-cast affects only future casts.

## Three-tap rules retained

- Red=0, green=20, gold=40 percentage points. Exactly three scored taps per cast.
- 0–99 points: that probability of one Gen. 100 points: exactly one Gen. 120 points: one guaranteed Gen plus 20% chance of a second distinct Gen.
- No carry between casts. No rarity upgrade from exceeding 100%. No change to the separate fish/pet rarity pool or Buy/Release rules.
- Two Gen are weighted draws **without replacement** from the same five eligible types. The second draw renormalizes after removing the first. It can never unlock an advanced Gen.
- Existing pending offers keep their stamped rewards, including offers created before this pool version. Reloading never rerolls an offer.

## Simulations

Open Fishing → Debug → **Gen · Mô phỏng cân bằng**. Select 1,000 / 10,000 / 100,000 / 1,000,000 casts **per scenario and Rebirth band**, a seed, and a scenario. Set an independent simulation Rebirth or compare all five representative Rebirth levels (1,5,9,14,19). Six scenarios cover all red, all green, 2 green + 1 gold, 1 green + 2 gold, all gold, and independently sampled taps with editable red/green/gold probabilities.

The debug UI is organized into **Mô phỏng / Chơi thử / Danh mục Gen**. Simulation defaults to 1,000 full-gold casts; quick presets select full red/green/gold or all scenarios. Seed and random-tap proportions are under Advanced. Results show one view at a time: Overview, Pets, Gen, Pet+Gen combinations or individual casts. Select a run in the dropdown, or click a scenario row to jump directly to its pets. Wallet/capacity controls live under the Play test tab's collapsed money/inventory section. Switching views keeps inputs and completed results intact.

Browser simulation uses the exact `GenCore.count`, `GenCore.choose` and `FishingPool.pick` functions used by live play. Every cast rolls both a pet and its Gen combination from the selected Rebirth snapshot. It does not simulate affordability or purchase acceptance, and changes no wallet, inventory or pending offer. Results represent resolved casts; obtaining ownership still requires buying the offer.

In addition to Gen incidence, the result panel contains:

- All 44 pets, including zero-count rows and zero-weight TUNA/SALMON; actual count, expected pet share, mutated pet count and two-Gen count.
- Every observed exact pet + Gen combination, with its occurrence count.
- A paginated per-cast log: cast number, Rebirth, all three tap results, score, pet ID/name, rarity, exact Gen IDs and stamped claim price. Search by pet name/ID, filter by Gen or no Gen, and export the filtered retained log as CSV. Prices use exact integer cents.
- All 1,000 casts are retained for a 1,000-cast run. Browser logs retain the first 10,000 rows per run for larger simulations, explicitly labeled; aggregates always cover all casts, including on partial cancelled runs.

The summary shows zero/one/two Gen and the fraction of casts with at least one Gen. The detail table shows **pet incidence per Gen per cast**, not share of all awarded tokens. Because a pet can have two distinct Gen, the sum of Gen incidence can exceed 100%. A Gen is never duplicated on the same pet.

Expected per-Gen incidence includes second-draw renormalization, rather than incorrectly reusing first-draw shares. Mixed-scenario expectations enumerate all 27 tap patterns. CSV includes seed, pattern/mix, config version and denominators. Cancelled runs are explicitly labeled partial.

Run from the workspace with `node tools/simulate-gen.cjs 1000000 20261105`. The script writes `reports/gen-simulation.json` and `reports/gen-simulation.md`, checks conservation, seed reproducibility, forbidden rewards and sampling error against analytic probabilities.

That command remains a **Gen-only R1 baseline**, with no pet RNG draws interleaved. For the full pet + Gen simulation run `node tools/simulate-fishing.cjs 1000 20261105`. It runs all six scenarios at all five Rebirth bands (30,000 casts), exporting `reports/fishing-simulation.json`, `reports/fishing-simulation.md` and `reports/fishing-casts.csv`. CLI retains the first 1,000 rows per run; all rows are retained for the default run. Full-simulation sample counts differ from Gen-only baseline because the shared RNG also rolls pets. Compare runs with the same mode, seed, Rebirth and tap distribution.

Seed 20261105, 1,000,000 casts each: full red 0% with Gen; full green 60.0674%; 2 green + 1 gold 80.0039%; 1 green + 2 gold 100%; full gold 100%, including 200,439 casts with two Gen. Mixed taps (30% red / 50% green / 20% gold) yield 53.7599% with Gen. All 16 locked types appear zero times across all 6,000,000 casts.

## Icons

Reuse the nine supplied/extracted assets. Twelve missing icons are generated with imagegen as `assets/mutations/gen-atlas.png`, a transparent 4×3 atlas. Row-major order: Soaked, Frost, Thundered, Vortex; Sequin, Bling Bling, Stormspark, Aurora; Fossilized, Sweetheart, Radioactive, Webbed.

Prompt: create twelve individually centered circular token icons in a strict transparent 4×3 grid, matching the reference gold coin's brown rim, saturated inset and bold pixel symbol; preserve the named symbol order, no labels or background. Atlas positions are explicit metadata, shared by gameplay rewards and debug catalog.

## Remaining integration boundary

The catalog is unified for selection/display. Applying permanent effects to real pets still needs the game's authoritative mutation/weather effect IDs, compatibility rules, stat stacking and economy validation. This prototype does not silently substitute Weather Effects additive values for Mutation multipliers.
