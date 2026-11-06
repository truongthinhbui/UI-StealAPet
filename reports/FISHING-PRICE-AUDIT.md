# Fishing price audit

Rule: Master Data Fishing Q2:Q35 uses ROUND(O*P,0); GDD EventFishing B42 says SpawnPrice × ClaimK. Recompute using exact Decimal, ROUND_HALF_UP to whole Money, then store integer cents as strings for exact transactions. ClaimK = 1.10 for all 35 pets. Pet pool weights, Gen weights and rarity timing unchanged.

Fixed web prices: MUDSKIPPER 24,444.20 → 24,444; SQUID 359,251.20 → 359,251. Other 33 match the recomputed rule numerically.

SALMON Q36 is a hardcoded 29,521,250,000,000,000,000, inconsistent with O36 = 17,900,000,000,000,000,000 and P36 = 1.10. Correct formula price is 19,690,000,000,000,000,000. The web already used the formula result; retained it. Other high-price cached Q discrepancies can reflect stale or low-precision saved values; do not copy cached Q blindly. Source precision remains limited to supplied SpawnPrice.

Already pending offers keep their stamped price, following GDD persistence rules. New catches use the updated config. Source workbooks are unchanged.

| Pet | SpawnPrice | ClaimK | Recomputed ClaimPrice |
|---|---:|---:|---:|
| SHRIMP | 550 | 1.1 | 605 |
| MUDSKIPPER | 22,222 | 1.1 | 24,444 |
| CRAB | 5,600 | 1.1 | 6,160 |
| CLOWNFISH | 9,600 | 1.1 | 10,560 |
| TURTLE | 42,400 | 1.1 | 46,640 |
| SQUID | 326,592 | 1.1 | 359,251 |
| OCTOPUS | 1,520,000 | 1.1 | 1,672,000 |
| JELLYFISH | 2,320,000 | 1.1 | 2,552,000 |
| DOLPHIN | 3,280,000 | 1.1 | 3,608,000 |
| SEALION | 4,240,000 | 1.1 | 4,664,000 |
| WALRUS | 5,120,000 | 1.1 | 5,632,000 |
| LOBSTER | 6,880,000 | 1.1 | 7,568,000 |
| ORCA | 142,500,000 | 1.1 | 156,750,000 |
| ALIGATOR | 480,000,000 | 1.1 | 528,000,000 |
| MANATEE | 175,000,000,000 | 1.1 | 192,500,000,000 |
| SMALLWHALE | 1,229,200,000,000 | 1.1 | 1,352,120,000,000 |
| BELUGA | 9,979,200,000,000 | 1.1 | 10,977,120,000,000 |
| NARWHAL | 31,104,000,000,000 | 1.1 | 34,214,400,000,000 |
| PLATYPUS | 3,359,230,000,000,000 | 1.1 | 3,695,153,000,000,000 |
| TORTOISE | 662,796,000,000,000,000 | 1.1 | 729,075,600,000,000,000 |
| SEAHORSE | 692,797,000,000,000,000 | 1.1 | 762,076,700,000,000,000 |
| CATFISH | 703,680,000,000,000,000 | 1.1 | 774,048,000,000,000,000 |
| AXOLOTLBLUE | 1,547,260,000,000,000,000 | 1.1 | 1,701,986,000,000,000,000 |
| AXOLOTLPINK | 850,262,000,000,000,000 | 1.1 | 935,288,200,000,000,000 |
| AXOLOTLGREEN | 1,650,260,000,000,000,000 | 1.1 | 1,815,286,000,000,000,000 |
| AXOLOTLORANGE | 1,650,260,000,000,000,000 | 1.1 | 1,815,286,000,000,000,000 |
| AXOLOTLWHITE | 1,650,260,000,000,000,000 | 1.1 | 1,815,286,000,000,000,000 |
| PENGUIN | 94,910,500,000,000,000 | 1.1 | 104,401,550,000,000,000 |
| SHARK | 676,768,000,000,000,000 | 1.1 | 744,444,800,000,000,000 |
| CARP | 4,804,950,000,000,000,000 | 1.1 | 5,285,445,000,000,000,000 |
| GOLDFISH | 6,231,640,000,000,000,000 | 1.1 | 6,854,804,000,000,000,000 |
| BASS | 6,507,790,000,000,000,000 | 1.1 | 7,158,569,000,000,000,000 |
| TUNA | 6,796,210,000,000,000,000 | 1.1 | 7,475,831,000,000,000,000 |
| PIRANHA | 4,104,970,000,000,000,000 | 1.1 | 4,515,467,000,000,000,000 |
| SALMON | 17,900,000,000,000,000,000 | 1.1 | 19,690,000,000,000,000,000 |