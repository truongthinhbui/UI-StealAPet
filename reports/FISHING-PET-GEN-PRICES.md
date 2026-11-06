# Fishing pet + Gen purchase prices

New authored Fishing policy: ROUND(SpawnPrice × GenPriceMultiplier × ClaimK, 0). Base GDD only defines SpawnPrice × ClaimK; the Gen purchase factor is an explicit extension using source effect magnitudes. It is not asserted as an existing GDD purchase rule. Do not add a MutaGen item price or application attempt fee: Fishing has already granted the trait.

Normal Mutation: use Mutation 2.0 Multiplier. Weather: use 1 + Weather Effects MultiplierPrice. Exactly one Gen per catch; no stacking assumption. Round once after all factors, to whole Money, then store integer cents as strings. No pet/Gen probability changes.

| Gen | Purchase factor |
|---|---:|
| Golden | ×1.33 |
| Soaked | ×1.05 |
| Frozen | ×1.66 |
| Frost | ×1.09 |
| Gale | ×1.08 |
| Magma | ×2.0 |
| Thundered | ×1.12 |
| Clover | ×2.13 |
| Eclipse | ×1.15 |
| Fossilized | ×2.25 |
| Prismatic | ×1.14 |
| Vortex | ×1.16 |
| Sequin | ×1.17 |
| Sweetheart | ×2.3 |
| Crystalline | ×2.37 |
| Radioactive | ×2.5 |
| Webbed | ×2.4 |

Examples: SHRIMP no Gen 605; Golden 805; Soaked 635; Webbed 1,452 Money. SALMON + Webbed = 47,256,000,000,000,000,000 Money. All values are purchase offers, not automatic grants or a promise of sale ROI. Pet base prices and Gen effect data remain unchanged.

New pending catches stamp basePrice, genPriceMultiplier, price and pricingVersion. Already pending/owned rewards keep their old stamped price and are not repriced. Buy deducts the exact stamped price; simulation and CSV log use the same quote function.

Source: Master Data Mutation 2.0 E column, Weather Effects E column, Fishing O/P columns; GDD EventFishing B42 (base rule), Weather System C56 (weather value rule). No source workbook edits.