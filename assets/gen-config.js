window.GenConfig = {
  "version": "merged-gen-14-r9-five-bands",
  "source": "[Craftland] Steal A Pet Master Data.xlsx",
  "rules": {
    "green": 5,
    "gold": 20,
    "red": 0,
    "taps": 3,
    "maxGen": 1,
    "carry": false,
    "distinct": true,
    "fishRarityBoost": false,
    "familySelection": "single-merged-weighted-pool",
    "repeatSameGen": false
  },
  "rebirthProfiles": [
    {
      "min": 9,
      "max": 12,
      "label": "R9–R12",
      "weights": {
        "gold": 370000,
        "soaked": 370000,
        "frost": 68000,
        "ice": 68000,
        "wind": 68000,
        "coral": 10000,
        "thundered": 10000,
        "clover": 10000,
        "lunar": 10000,
        "fossilized": 2600,
        "rainbow": 2600,
        "vortex": 2600,
        "sequin": 2600,
        "sweetheart": 2600,
        "diamond": 1000,
        "radioactive": 1000,
        "webbed": 1000
      }
    },
    {
      "min": 13,
      "max": 16,
      "label": "R13–R16",
      "weights": {
        "gold": 300000,
        "soaked": 300000,
        "frost": 85000,
        "ice": 85000,
        "wind": 85000,
        "coral": 22000,
        "thundered": 22000,
        "clover": 22000,
        "lunar": 22000,
        "fossilized": 9600,
        "rainbow": 9600,
        "vortex": 9600,
        "sequin": 9600,
        "sweetheart": 9600,
        "diamond": 3000,
        "radioactive": 3000,
        "webbed": 3000
      }
    },
    {
      "min": 17,
      "max": 20,
      "label": "R17–R20",
      "weights": {
        "gold": 225000,
        "soaked": 225000,
        "frost": 95000,
        "ice": 95000,
        "wind": 95000,
        "coral": 40000,
        "thundered": 40000,
        "clover": 40000,
        "lunar": 40000,
        "fossilized": 16800,
        "rainbow": 16800,
        "vortex": 16800,
        "sequin": 16800,
        "sweetheart": 16800,
        "diamond": 7000,
        "radioactive": 7000,
        "webbed": 7000
      }
    },
    {
      "min": 21,
      "max": 24,
      "label": "R21–R24",
      "weights": {
        "gold": 160000,
        "soaked": 160000,
        "frost": 95000,
        "ice": 95000,
        "wind": 95000,
        "coral": 52000,
        "thundered": 52000,
        "clover": 52000,
        "lunar": 52000,
        "fossilized": 28400,
        "rainbow": 28400,
        "vortex": 28400,
        "sequin": 28400,
        "sweetheart": 28400,
        "diamond": 15000,
        "radioactive": 15000,
        "webbed": 15000
      }
    },
    {
      "min": 25,
      "max": null,
      "label": "R25+",
      "weights": {
        "gold": 100003,
        "soaked": 100003,
        "frost": 80000,
        "ice": 80000,
        "wind": 80000,
        "coral": 60000,
        "thundered": 60000,
        "clover": 60000,
        "lunar": 60000,
        "fossilized": 41416,
        "rainbow": 41416,
        "vortex": 41416,
        "sequin": 41416,
        "sweetheart": 41416,
        "diamond": 37638,
        "radioactive": 37638,
        "webbed": 37638
      }
    }
  ],
  "catalog": [
    {
      "id": "gold",
      "name": "Golden",
      "family": "MutaGen",
      "tier": "basic",
      "fishingEnabled": true,
      "fishingWeight": 370000,
      "icon": {
        "file": "assets/mutations/gold.png"
      },
      "source": {
        "sheet": "MutaGen Config",
        "grades": [
          {
            "row": 24,
            "grade": "S",
            "petCoinCost": 20,
            "baseChance": 0.6
          },
          {
            "row": 25,
            "grade": "SS",
            "petCoinCost": 25,
            "baseChance": 0.72
          },
          {
            "row": 26,
            "grade": "SSS",
            "petCoinCost": 30,
            "baseChance": 0.8
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Mutation 2.0",
        "sourceName": "Golden",
        "sourceId": 2,
        "materialKey": "GoldenMat",
        "effectKey": "goldenEffect",
        "valueField": "Multiplier",
        "value": 1.33,
        "levelCostMultiplier": 1.15,
        "mergedStackingRule": null
      }
    },
    {
      "id": "soaked",
      "name": "Soaked",
      "family": "WeatherGen",
      "tier": "basic",
      "fishingEnabled": true,
      "fishingWeight": 370000,
      "icon": {
        "atlas": 0
      },
      "source": {
        "sheet": "WeatherGen Config",
        "grades": [
          {
            "row": 24,
            "grade": "S",
            "petCoinCost": 15,
            "baseChance": 0.45
          },
          {
            "row": 25,
            "grade": "SS",
            "petCoinCost": 20,
            "baseChance": 0.55
          },
          {
            "row": 26,
            "grade": "SSS",
            "petCoinCost": 25,
            "baseChance": 0.65
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Weather Effects",
        "sourceName": "Soaked",
        "sourceId": 1,
        "materialKey": null,
        "effectKey": "Soaked",
        "valueField": "MultiplierPrice",
        "value": 0.05,
        "levelCostMultiplier": 1.03,
        "mergedStackingRule": null
      }
    },
    {
      "id": "frost",
      "name": "Frozen",
      "family": "MutaGen",
      "tier": "uncommon",
      "fishingEnabled": true,
      "fishingWeight": 68000,
      "icon": {
        "file": "assets/mutations/frost.png"
      },
      "source": {
        "sheet": "MutaGen Config",
        "grades": [
          {
            "row": 27,
            "grade": "S",
            "petCoinCost": 35,
            "baseChance": 0.55
          },
          {
            "row": 28,
            "grade": "SS",
            "petCoinCost": 40,
            "baseChance": 0.67
          },
          {
            "row": 29,
            "grade": "SSS",
            "petCoinCost": 50,
            "baseChance": 0.75
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Mutation 2.0",
        "sourceName": "Frozen",
        "sourceId": 3,
        "materialKey": "IceMat",
        "effectKey": "frozenEffect",
        "valueField": "Multiplier",
        "value": 1.66,
        "levelCostMultiplier": 1.3,
        "mergedStackingRule": null
      }
    },
    {
      "id": "ice",
      "name": "Frost",
      "family": "WeatherGen",
      "tier": "uncommon",
      "fishingEnabled": true,
      "fishingWeight": 68000,
      "icon": {
        "atlas": 1
      },
      "source": {
        "sheet": "WeatherGen Config",
        "grades": [
          {
            "row": 27,
            "grade": "S",
            "petCoinCost": 30,
            "baseChance": 0.35
          },
          {
            "row": 28,
            "grade": "SS",
            "petCoinCost": 40,
            "baseChance": 0.45
          },
          {
            "row": 29,
            "grade": "SSS",
            "petCoinCost": 50,
            "baseChance": 0.55
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Weather Effects",
        "sourceName": "Frost",
        "sourceId": 2,
        "materialKey": null,
        "effectKey": "Frost",
        "valueField": "MultiplierPrice",
        "value": 0.09,
        "levelCostMultiplier": 1.05,
        "mergedStackingRule": null
      }
    },
    {
      "id": "wind",
      "name": "Gale",
      "family": "WeatherGen",
      "tier": "uncommon",
      "fishingEnabled": true,
      "fishingWeight": 68000,
      "icon": {
        "file": "assets/mutations/wind.png"
      },
      "source": {
        "sheet": "WeatherGen Config",
        "grades": [
          {
            "row": 30,
            "grade": "S",
            "petCoinCost": 60,
            "baseChance": 0.4
          },
          {
            "row": 31,
            "grade": "SS",
            "petCoinCost": 40,
            "baseChance": 0.5
          },
          {
            "row": 32,
            "grade": "SSS",
            "petCoinCost": 70,
            "baseChance": 0.6
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Weather Effects",
        "sourceName": "Gale",
        "sourceId": 3,
        "materialKey": null,
        "effectKey": "Gale",
        "valueField": "MultiplierPrice",
        "value": 0.08,
        "levelCostMultiplier": 1.05,
        "mergedStackingRule": null
      }
    },
    {
      "id": "coral",
      "name": "Magma",
      "family": "MutaGen",
      "tier": "advanced",
      "fishingEnabled": true,
      "fishingWeight": 10000,
      "icon": {
        "file": "assets/mutations/coral.png"
      },
      "source": {
        "sheet": "MutaGen Config",
        "grades": [
          {
            "row": 30,
            "grade": "S",
            "petCoinCost": 60,
            "baseChance": 0.5
          },
          {
            "row": 31,
            "grade": "SS",
            "petCoinCost": 80,
            "baseChance": 0.62
          },
          {
            "row": 32,
            "grade": "SSS",
            "petCoinCost": 100,
            "baseChance": 0.7
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Mutation 2.0",
        "sourceName": "Magma",
        "sourceId": 4,
        "materialKey": "MagmaMat",
        "effectKey": "magmaEffect",
        "valueField": "Multiplier",
        "value": 2,
        "levelCostMultiplier": 1.45,
        "mergedStackingRule": null
      }
    },
    {
      "id": "thundered",
      "name": "Thundered",
      "family": "WeatherGen",
      "tier": "advanced",
      "fishingEnabled": true,
      "fishingWeight": 10000,
      "icon": {
        "atlas": 2
      },
      "source": {
        "sheet": "WeatherGen Config",
        "grades": [
          {
            "row": 33,
            "grade": "S",
            "petCoinCost": 90,
            "baseChance": 0.3
          },
          {
            "row": 34,
            "grade": "SS",
            "petCoinCost": 100,
            "baseChance": 0.4
          },
          {
            "row": 35,
            "grade": "SSS",
            "petCoinCost": 120,
            "baseChance": 0.5
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Weather Effects",
        "sourceName": "Thundered",
        "sourceId": 4,
        "materialKey": null,
        "effectKey": "Thundered",
        "valueField": "MultiplierPrice",
        "value": 0.12,
        "levelCostMultiplier": 1.07,
        "mergedStackingRule": null
      }
    },
    {
      "id": "clover",
      "name": "Clover",
      "family": "MutaGen",
      "tier": "advanced",
      "fishingEnabled": true,
      "fishingWeight": 10000,
      "icon": {
        "file": "assets/mutations/clover.png"
      },
      "source": {
        "sheet": "MutaGen Config",
        "grades": [
          {
            "row": 33,
            "grade": "S",
            "petCoinCost": 125,
            "baseChance": 0.45
          },
          {
            "row": 34,
            "grade": "SS",
            "petCoinCost": 150,
            "baseChance": 0.57
          },
          {
            "row": 35,
            "grade": "SSS",
            "petCoinCost": 180,
            "baseChance": 0.65
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Mutation 2.0",
        "sourceName": "Clover",
        "sourceId": 5,
        "materialKey": "CloverMat",
        "effectKey": "cloverEffect",
        "valueField": "Multiplier",
        "value": 2.13,
        "levelCostMultiplier": 1.5,
        "mergedStackingRule": null
      }
    },
    {
      "id": "lunar",
      "name": "Eclipse",
      "family": "WeatherGen",
      "tier": "advanced",
      "fishingEnabled": true,
      "fishingWeight": 10000,
      "icon": {
        "file": "assets/mutations/lunar.png"
      },
      "source": {
        "sheet": "WeatherGen Config",
        "grades": [
          {
            "row": 36,
            "grade": "S",
            "petCoinCost": 130,
            "baseChance": 0.2
          },
          {
            "row": 37,
            "grade": "SS",
            "petCoinCost": 160,
            "baseChance": 0.3
          },
          {
            "row": 38,
            "grade": "SSS",
            "petCoinCost": 180,
            "baseChance": 0.4
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Weather Effects",
        "sourceName": "Eclipse",
        "sourceId": 5,
        "materialKey": null,
        "effectKey": "Eclipse",
        "valueField": "MultiplierPrice",
        "value": 0.15,
        "levelCostMultiplier": 1.08,
        "mergedStackingRule": null
      }
    },
    {
      "id": "fossilized",
      "name": "Fossilized",
      "family": "MutaGen",
      "tier": "rare",
      "fishingEnabled": true,
      "fishingWeight": 2600,
      "icon": {
        "atlas": 8
      },
      "source": {
        "sheet": "MutaGen Config",
        "grades": [
          {
            "row": 36,
            "grade": "S",
            "petCoinCost": 200,
            "baseChance": 0.35
          },
          {
            "row": 37,
            "grade": "SS",
            "petCoinCost": 240,
            "baseChance": 0.47
          },
          {
            "row": 38,
            "grade": "SSS",
            "petCoinCost": 275,
            "baseChance": 0.55
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Mutation 2.0",
        "sourceName": "Fossilized",
        "sourceId": 6,
        "materialKey": "FossilizedMat",
        "effectKey": "fossilizedEffect",
        "valueField": "Multiplier",
        "value": 2.25,
        "levelCostMultiplier": 1.6,
        "mergedStackingRule": null
      }
    },
    {
      "id": "rainbow",
      "name": "Prismatic",
      "family": "WeatherGen",
      "tier": "rare",
      "fishingEnabled": true,
      "fishingWeight": 2600,
      "icon": {
        "file": "assets/mutations/rainbow.png"
      },
      "source": {
        "sheet": "WeatherGen Config",
        "grades": [
          {
            "row": 39,
            "grade": "S",
            "petCoinCost": 200,
            "baseChance": 0.2
          },
          {
            "row": 40,
            "grade": "SS",
            "petCoinCost": 230,
            "baseChance": 0.3
          },
          {
            "row": 41,
            "grade": "SSS",
            "petCoinCost": 250,
            "baseChance": 0.4
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Weather Effects",
        "sourceName": "Prismatic",
        "sourceId": 6,
        "materialKey": null,
        "effectKey": "Prismatic",
        "valueField": "MultiplierPrice",
        "value": 0.14,
        "levelCostMultiplier": 1.08,
        "mergedStackingRule": null
      }
    },
    {
      "id": "vortex",
      "name": "Vortex",
      "family": "WeatherGen",
      "tier": "rare",
      "fishingEnabled": true,
      "fishingWeight": 2600,
      "icon": {
        "atlas": 3
      },
      "source": {
        "sheet": "WeatherGen Config",
        "grades": [
          {
            "row": 42,
            "grade": "S",
            "petCoinCost": 260,
            "baseChance": 0.15
          },
          {
            "row": 43,
            "grade": "SS",
            "petCoinCost": 290,
            "baseChance": 0.25
          },
          {
            "row": 44,
            "grade": "SSS",
            "petCoinCost": 320,
            "baseChance": 0.35
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Weather Effects",
        "sourceName": "Vortex",
        "sourceId": 7,
        "materialKey": null,
        "effectKey": "Vortex",
        "valueField": "MultiplierPrice",
        "value": 0.16,
        "levelCostMultiplier": 1.09,
        "mergedStackingRule": null
      }
    },
    {
      "id": "sequin",
      "name": "Sequin",
      "family": "WeatherGen",
      "tier": "rare",
      "fishingEnabled": true,
      "fishingWeight": 2600,
      "icon": {
        "atlas": 4
      },
      "source": {
        "sheet": "WeatherGen Config",
        "grades": [
          {
            "row": 45,
            "grade": "S",
            "petCoinCost": 330,
            "baseChance": 0.05
          },
          {
            "row": 46,
            "grade": "SS",
            "petCoinCost": 360,
            "baseChance": 0.15
          },
          {
            "row": 47,
            "grade": "SSS",
            "petCoinCost": 390,
            "baseChance": 0.25
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Weather Effects",
        "sourceName": "Sequin",
        "sourceId": 8,
        "materialKey": null,
        "effectKey": "Sequin",
        "valueField": "MultiplierPrice",
        "value": 0.17,
        "levelCostMultiplier": 1.1,
        "mergedStackingRule": null
      }
    },
    {
      "id": "sweetheart",
      "name": "Sweetheart",
      "family": "MutaGen",
      "tier": "rare",
      "fishingEnabled": true,
      "fishingWeight": 2600,
      "icon": {
        "atlas": 9
      },
      "source": {
        "sheet": "MutaGen Config",
        "grades": [
          {
            "row": 39,
            "grade": "S",
            "petCoinCost": 300,
            "baseChance": 0.3
          },
          {
            "row": 40,
            "grade": "SS",
            "petCoinCost": 350,
            "baseChance": 0.42
          },
          {
            "row": 41,
            "grade": "SSS",
            "petCoinCost": 375,
            "baseChance": 0.5
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Mutation 2.0",
        "sourceName": "Sweetheart",
        "sourceId": 7,
        "materialKey": "SweetheartMat",
        "effectKey": "sweetheartEffect",
        "valueField": "Multiplier",
        "value": 2.3,
        "levelCostMultiplier": 1.65,
        "mergedStackingRule": null
      }
    },
    {
      "id": "diamond",
      "name": "Crystalline",
      "family": "MutaGen",
      "tier": "epic",
      "fishingEnabled": true,
      "fishingWeight": 1000,
      "icon": {
        "file": "assets/mutations/diamond.png"
      },
      "source": {
        "sheet": "MutaGen Config",
        "grades": [
          {
            "row": 42,
            "grade": "S",
            "petCoinCost": 400,
            "baseChance": 0.25
          },
          {
            "row": 43,
            "grade": "SS",
            "petCoinCost": 440,
            "baseChance": 0.37
          },
          {
            "row": 44,
            "grade": "SSS",
            "petCoinCost": 480,
            "baseChance": 0.45
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Mutation 2.0",
        "sourceName": "Crystalline",
        "sourceId": 8,
        "materialKey": "CrystallineMat",
        "effectKey": "crystallineEffect",
        "valueField": "Multiplier",
        "value": 2.37,
        "levelCostMultiplier": 1.85,
        "mergedStackingRule": null
      }
    },
    {
      "id": "radioactive",
      "name": "Radioactive",
      "family": "MutaGen",
      "tier": "epic",
      "fishingEnabled": true,
      "fishingWeight": 1000,
      "icon": {
        "atlas": 10
      },
      "source": {
        "sheet": "MutaGen Config",
        "grades": [
          {
            "row": 45,
            "grade": "S",
            "petCoinCost": 500,
            "baseChance": 0.25
          },
          {
            "row": 46,
            "grade": "SS",
            "petCoinCost": 550,
            "baseChance": 0.37
          },
          {
            "row": 47,
            "grade": "SSS",
            "petCoinCost": 600,
            "baseChance": 0.45
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Mutation 2.0",
        "sourceName": "Radioactive",
        "sourceId": 11,
        "materialKey": "RadioactiveMat",
        "effectKey": "RadioactiveEffect",
        "valueField": "Multiplier",
        "value": 2.5,
        "levelCostMultiplier": 2.15,
        "mergedStackingRule": null
      }
    },
    {
      "id": "webbed",
      "name": "Webbed",
      "family": "MutaGen",
      "tier": "epic",
      "fishingEnabled": true,
      "fishingWeight": 1000,
      "icon": {
        "atlas": 11
      },
      "source": {
        "sheet": "MutaGen Config",
        "grades": [
          {
            "row": 48,
            "grade": "S",
            "petCoinCost": 500,
            "baseChance": 0.2
          },
          {
            "row": 49,
            "grade": "SS",
            "petCoinCost": 550,
            "baseChance": 0.32
          },
          {
            "row": 50,
            "grade": "SSS",
            "petCoinCost": 600,
            "baseChance": 0.4
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Mutation 2.0",
        "sourceName": "Webbed",
        "sourceId": 9,
        "materialKey": "WebbedMat",
        "effectKey": "webbedEffect",
        "valueField": "Multiplier",
        "value": 2.4,
        "levelCostMultiplier": 2.05,
        "mergedStackingRule": null
      }
    }
  ],
  "notes": [
    "Weights are authored Fishing balance, not item application chances.",
    "Rebirth changes type weights, not tap score or guaranteed rarity.",
    "Item prices and effect stacking gaps remain source metadata; they do not disable authored Fishing drops.",
    "Fishing excludes Bling Bling, Stormspark, Galaxy and Aurora. Remaining 17 weights proportionally normalized to 1,000,000 per band. Fish data unchanged.",
    "v13: all Gen of a rarity have exactly equal probabilities per Rebirth band. COMMON > RARE > EPIC > LEGENDARY > MYTHIC per Gen. R19+ full-gold Apex + any specific MYTHIC Gen takes ~300 active fishing hours at 10s/cast. Original fish pool and tap rules unchanged.",
    "Fishing unlocks R9. Gen bands: R9-12, R13-16, R17-20, R21-24, R25+. Fish source weights/bands unchanged."
  ],
  "rollOrder": [
    "fish",
    "genCount",
    "genTypes"
  ],
  "rarityBudgetByBand": [
    {
      "basic": 740000,
      "uncommon": 204000,
      "advanced": 40000,
      "rare": 13000,
      "epic": 3000,
      "exclusive": 0
    },
    {
      "basic": 600000,
      "uncommon": 255000,
      "advanced": 88000,
      "rare": 48000,
      "epic": 9000,
      "exclusive": 0
    },
    {
      "basic": 450000,
      "uncommon": 285000,
      "advanced": 160000,
      "rare": 84000,
      "epic": 21000,
      "exclusive": 0
    },
    {
      "basic": 320000,
      "uncommon": 285000,
      "advanced": 208000,
      "rare": 142000,
      "epic": 45000,
      "exclusive": 0
    },
    {
      "basic": 200006,
      "uncommon": 240000,
      "advanced": 240000,
      "rare": 207080,
      "epic": 112914,
      "exclusive": 0
    }
  ],
  "timeBalance": {
    "reference": "300 active fishing hours for Apex + Webbed, full gold, final Gen band R25+; fish weights and original fish bands retained.",
    "secondsPerCast": 10,
    "weatherCycleMinutes": 69,
    "fishingMinutesPerCycle": 11,
    "castsPerCycle": 66,
    "referenceTapChance": 0.6,
    "webbedConditionalByBand": [
      0.001,
      0.003,
      0.007,
      0.015,
      0.037638
    ],
    "method": "Equal per-Gen weight within each rarity; strictly decreasing probability by rarity; R19+ MYTHIC 37638 each preserves active 300h Apex + Webbed target.",
    "baselineVersion": "merged-gen-12-webbed-active300h",
    "fishPoolChanged": false,
    "targetElapsedHours": null,
    "actualElapsedHours": 1881.8249867014797,
    "rarityOrderException": null,
    "targetActiveHours": 300,
    "actualActiveHours": 300.0010848364678
  }
};
