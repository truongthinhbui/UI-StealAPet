# Fishing prototype configuration

> Historical v2 review. Active configuration now uses the original Fishing pool and fish-first resolution. See FISHING-CONFIG-v3.md and outputs/fishing-v3 for current data. The notes below describe the previous fishing 1.0.1 selection.

## Selected source

User decision: use **Master Data → fishing 1.0.1**, keeping the approved tab 7 mechanic and Mutation Luck rules. Only tab 7 can be selected or started, including through debug.

- `[Craftland] Steal A Pet Master Data.xlsx`, `fishing 1.0.1!A1:R45`: 44 entries, 42 with positive draw weights. TUNA and SALMON are CHASE entries with zero weights in all bands, and cannot drop.
- Rebirth bands: 1–4, 5–8, 9–13, 14–18, 19+. Actual weight totals: 999777, 999509, 997769, 997769, 997769. These agree with row 46. Draws normalize the active weight column; cached percentage columns are not used.
- Claim price uses SpawnPrice × ClaimK (1.10), stored as integer cents to avoid JavaScript floating point loss on very large prices. Rounded cached ClaimPrice values are not used for transactions. Workbook source precision remains the limit.
- No global Luck multiplier is applied to fish rarity: the selected fishing table does not define such a formula. Mutation Luck remains separate.

## GDD behavior used

`[Craftland] Steal A Pet GDD.xlsx`, `EventFishing!A12:B25`, `A29:D33`, `A42:D50`, `A69:B76`:

- Casting is free; eligible weather is HeavyRain or HighTide. Outdoor/water checks are exposed as debug inputs because the prototype is a static scene, not a world simulation.
- Rebirth and pool version are snapshotted at cast start. Both pet weights and the new Gen Rebirth profile use that snapshot. Ending weather does not cancel an existing cast.
- Three scored taps reveal one pending pet offer. Green adds 20 mutation percentage points, gold 40, miss 0. All-red still reveals a pet with no mutations.
- 100% guarantees one Gen; the remainder rolls an additional distinct Gen. The shared 21-entry MutaGen + WeatherGen catalog and the conservative five-entry Fishing whitelist are defined in `assets/gen-config.js`. See `GEN-BALANCE.md` for the new authored weights and simulations; they are not workbook drop rates.
- Buy deducts the stamped price once; Release charges nothing and grants nothing. An unaffordable or full-inventory purchase leaves the offer pending. Pending offers survive reload and block another cast.
- A local test wallet and inventory stand in for the real account, Base and Event Pet Inventory. Debug can set money, fund a pending offer, adjust capacity and clear the test inventory.

## Source conflicts and missing data

- GDD `EventFishing!A94:B107` references older `Fishing` pools, a 29-pet/no-COMMON target and a <0.05% per-entry chase cap. The selected newer `fishing 1.0.1` table includes COMMON/non-fish pets and higher APEX rates in later bands (for example PIRANHA: 2232 / 997769 ≈ 0.2237%). Preserve the selected data; balancing remains a design decision.
- GDD `EventFishing!A54:D56` targets chest starts 15% / 7% / 2% and guarantees 9 / 17 / 30; legacy `Fishing!X1:AA52` instead contains old ramps and guarantees 30 / 40 / 50. Chest contents and prices are explicitly TBD in `EventFishing!A96:B96`. Chests are disabled in this prototype; no ramps, contents or prices are fabricated.
- Gen names now map to the MutaGen Config and WeatherGen Config targets. Frozen and Frost are separate entries. Existing icon filenames are retained for compatibility; twelve missing icons are in a shared atlas. Fishing-specific weights are new balance assumptions, not approved workbook values.
- There is no server, real account transaction, world-position validation or cross-device inventory. Local persistence demonstrates the flow only. Production requires authoritative catch IDs, transactions and persistence described by `EventFishing!A80:D86`.

## Implementation

`assets/fishing-config.js` owns imported pool data and the selected mechanic settings. `assets/fishing-pool.js` shares pet selection between live play and full simulations. `assets/gen-config.js` owns authored Gen Rebirth profiles. `assets/fishing-rewards.js` owns local offers, exact-money accounting and debug conditions. `assets/fishing.js` owns the tab 7 interaction and mutation feedback. Source workbooks are unchanged.
