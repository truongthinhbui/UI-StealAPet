window.GenConfig = {
  "version": "merged-gen-25-price-rarity",
  "source": "[Craftland] Steal A Pet Master Data.xlsx",
  "rules": {
    "green": 50,
    "gold": 100,
    "red": 0,
    "taps": 1,
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
      "max": 10,
      "label": "R9–R10",
      "weights": {
        "gold": 322500,
        "soaked": 322500,
        "frost": 90000,
        "ice": 90000,
        "wind": 47500,
        "coral": 47500,
        "thundered": 30000,
        "clover": 20000,
        "lunar": 20000,
        "fossilized": 5000,
        "rainbow": 5000
      }
    },
    {
      "min": 11,
      "max": 12,
      "label": "R11–R12",
      "weights": {
        "gold": 293125,
        "soaked": 293125,
        "frost": 97500,
        "ice": 97500,
        "wind": 55625,
        "coral": 55625,
        "thundered": 37500,
        "clover": 25000,
        "lunar": 25000,
        "fossilized": 10000,
        "rainbow": 10000
      }
    },
    {
      "min": 13,
      "max": 15,
      "label": "R13–R15",
      "weights": {
        "gold": 263750,
        "soaked": 263750,
        "frost": 105000,
        "ice": 105000,
        "wind": 63750,
        "coral": 63750,
        "thundered": 45000,
        "clover": 30000,
        "lunar": 30000,
        "fossilized": 15000,
        "rainbow": 15000
      }
    },
    {
      "min": 16,
      "max": 18,
      "label": "R16–R18",
      "weights": {
        "gold": 234375,
        "soaked": 234375,
        "frost": 112500,
        "ice": 112500,
        "wind": 71875,
        "coral": 71875,
        "thundered": 52500,
        "clover": 35000,
        "lunar": 35000,
        "fossilized": 20000,
        "rainbow": 20000
      }
    },
    {
      "min": 19,
      "max": null,
      "label": "R19+",
      "weights": {
        "gold": 205000,
        "soaked": 205000,
        "frost": 120000,
        "ice": 120000,
        "wind": 80000,
        "coral": 80000,
        "thundered": 60000,
        "clover": 40000,
        "lunar": 40000,
        "fossilized": 25000,
        "rainbow": 25000
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
      "fishingWeight": 322500,
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
        "sheet": "Mutation (V2.3.1)",
        "sourceName": "Golden",
        "sourceId": 2,
        "materialKey": "GoldenMat",
        "effectKey": "goldenEffect",
        "valueField": "Multiplier",
        "value": 1.33,
        "levelCostMultiplier": 1.15,
        "mergedStackingRule": null,
        "sourceRow": 4,
        "iconKey": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 30
      },
      "effectType": "Mutation",
      "effectId": 2,
      "effectRef": "Mutation:2",
      "mutationId": 2,
      "weatherEffectId": null
    },
    {
      "id": "soaked",
      "name": "Soaked",
      "family": "WeatherGen",
      "tier": "basic",
      "fishingEnabled": true,
      "fishingWeight": 322500,
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
        "effectKey": null,
        "valueField": "MultiplierPrice",
        "value": 0.05,
        "levelCostMultiplier": 1.03,
        "mergedStackingRule": null,
        "sourceRow": 3,
        "iconKey": "Soaked"
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 25
      },
      "effectType": "WeatherEffect",
      "effectId": 1,
      "effectRef": "WeatherEffect:1",
      "mutationId": null,
      "weatherEffectId": 1
    },
    {
      "id": "frost",
      "name": "Frozen",
      "family": "MutaGen",
      "tier": "uncommon",
      "fishingEnabled": true,
      "fishingWeight": 90000,
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
        "sheet": "Mutation (V2.3.1)",
        "sourceName": "Frozen",
        "sourceId": 3,
        "materialKey": "IceMat",
        "effectKey": "frozenEffect",
        "valueField": "Multiplier",
        "value": 1.66,
        "levelCostMultiplier": 1.3,
        "mergedStackingRule": null,
        "sourceRow": 5,
        "iconKey": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 50
      },
      "effectType": "Mutation",
      "effectId": 3,
      "effectRef": "Mutation:3",
      "mutationId": 3,
      "weatherEffectId": null
    },
    {
      "id": "ice",
      "name": "Frost",
      "family": "WeatherGen",
      "tier": "uncommon",
      "fishingEnabled": true,
      "fishingWeight": 90000,
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
        "effectKey": null,
        "valueField": "MultiplierPrice",
        "value": 0.09,
        "levelCostMultiplier": 1.05,
        "mergedStackingRule": null,
        "sourceRow": 4,
        "iconKey": "Frost"
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 50
      },
      "effectType": "WeatherEffect",
      "effectId": 2,
      "effectRef": "WeatherEffect:2",
      "mutationId": null,
      "weatherEffectId": 2
    },
    {
      "id": "wind",
      "name": "Gale",
      "family": "WeatherGen",
      "tier": "advanced",
      "fishingEnabled": true,
      "fishingWeight": 47500,
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
        "effectKey": null,
        "valueField": "MultiplierPrice",
        "value": 0.08,
        "levelCostMultiplier": 1.05,
        "mergedStackingRule": null,
        "sourceRow": 5,
        "iconKey": "Gale"
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 70
      },
      "effectType": "WeatherEffect",
      "effectId": 3,
      "effectRef": "WeatherEffect:3",
      "mutationId": null,
      "weatherEffectId": 3
    },
    {
      "id": "coral",
      "name": "Magma",
      "family": "MutaGen",
      "tier": "advanced",
      "fishingEnabled": true,
      "fishingWeight": 47500,
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
        "sheet": "Mutation (V2.3.1)",
        "sourceName": "Magma",
        "sourceId": 4,
        "materialKey": "MagmaMat",
        "effectKey": "magmaEffect",
        "valueField": "Multiplier",
        "value": 2.0,
        "levelCostMultiplier": 1.45,
        "mergedStackingRule": null,
        "sourceRow": 6,
        "iconKey": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 100
      },
      "effectType": "Mutation",
      "effectId": 4,
      "effectRef": "Mutation:4",
      "mutationId": 4,
      "weatherEffectId": null
    },
    {
      "id": "thundered",
      "name": "Thundered",
      "family": "WeatherGen",
      "tier": "rare",
      "fishingEnabled": true,
      "fishingWeight": 30000,
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
        "effectKey": null,
        "valueField": "MultiplierPrice",
        "value": 0.12,
        "levelCostMultiplier": 1.07,
        "mergedStackingRule": null,
        "sourceRow": 6,
        "iconKey": "Thundered"
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 120
      },
      "effectType": "WeatherEffect",
      "effectId": 4,
      "effectRef": "WeatherEffect:4",
      "mutationId": null,
      "weatherEffectId": 4
    },
    {
      "id": "clover",
      "name": "Clover",
      "family": "MutaGen",
      "tier": "epic",
      "fishingEnabled": true,
      "fishingWeight": 20000,
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
        "sheet": "Mutation (V2.3.1)",
        "sourceName": "Clover",
        "sourceId": 5,
        "materialKey": "CloverMat",
        "effectKey": "cloverEffect",
        "valueField": "Multiplier",
        "value": 2.13,
        "levelCostMultiplier": 1.5,
        "mergedStackingRule": null,
        "sourceRow": 7,
        "iconKey": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 180
      },
      "effectType": "Mutation",
      "effectId": 5,
      "effectRef": "Mutation:5",
      "mutationId": 5,
      "weatherEffectId": null
    },
    {
      "id": "lunar",
      "name": "Eclipse",
      "family": "WeatherGen",
      "tier": "epic",
      "fishingEnabled": true,
      "fishingWeight": 20000,
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
        "effectKey": null,
        "valueField": "MultiplierPrice",
        "value": 0.15,
        "levelCostMultiplier": 1.08,
        "mergedStackingRule": null,
        "sourceRow": 7,
        "iconKey": "Eclipse"
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 180
      },
      "effectType": "WeatherEffect",
      "effectId": 5,
      "effectRef": "WeatherEffect:5",
      "mutationId": null,
      "weatherEffectId": 5
    },
    {
      "id": "fossilized",
      "name": "Fossilized",
      "family": "MutaGen",
      "tier": "exclusive",
      "fishingEnabled": true,
      "fishingWeight": 5000,
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
        "sheet": "Mutation (V2.3.1)",
        "sourceName": "Fossilized",
        "sourceId": 6,
        "materialKey": "FossilizedMat",
        "effectKey": "fossilizedEffect",
        "valueField": "Multiplier",
        "value": 2.25,
        "levelCostMultiplier": 1.6,
        "mergedStackingRule": null,
        "sourceRow": 8,
        "iconKey": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 275
      },
      "effectType": "Mutation",
      "effectId": 6,
      "effectRef": "Mutation:6",
      "mutationId": 6,
      "weatherEffectId": null
    },
    {
      "id": "rainbow",
      "name": "Prismatic",
      "family": "WeatherGen",
      "tier": "exclusive",
      "fishingEnabled": true,
      "fishingWeight": 5000,
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
        "effectKey": null,
        "valueField": "MultiplierPrice",
        "value": 0.14,
        "levelCostMultiplier": 1.08,
        "mergedStackingRule": null,
        "sourceRow": 8,
        "iconKey": "Prismatic"
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 250
      },
      "effectType": "WeatherEffect",
      "effectId": 6,
      "effectRef": "WeatherEffect:6",
      "mutationId": null,
      "weatherEffectId": 6
    }
  ],
  "notes": [
    "Merged Muta/Weather pool, active 11 Gen only; no retired Gen reintroduced.",
    "Rarity based on SSS item purchase Pet Coin cost. Soaked 25 / Golden 30: COMMON; Frozen/Frost 50: RARE; Gale 70/Magma 100: EPIC; Thundered 120: LEGENDARY; Clover/Eclipse 180: MYTHIC; Prismatic 250/Fossilized 275: APEX.",
    "Five Gen bands R9-10, R11-12, R13-15, R16-18, R19+. Fish pool unchanged.",
    "Gameplay green +10, gold +34, red 0, cap 100%, maximum one Gen."
  ],
  "rollOrder": [
    "fish",
    "genCount",
    "genTypes"
  ],
  "rarityBudgetByBand": [
    {
      "basic": 645000,
      "uncommon": 180000,
      "advanced": 95000,
      "rare": 30000,
      "epic": 40000,
      "exclusive": 10000
    },
    {
      "basic": 586250,
      "uncommon": 195000,
      "advanced": 111250,
      "rare": 37500,
      "epic": 50000,
      "exclusive": 20000
    },
    {
      "basic": 527500,
      "uncommon": 210000,
      "advanced": 127500,
      "rare": 45000,
      "epic": 60000,
      "exclusive": 30000
    },
    {
      "basic": 468750,
      "uncommon": 225000,
      "advanced": 143750,
      "rare": 52500,
      "epic": 70000,
      "exclusive": 40000
    },
    {
      "basic": 410000,
      "uncommon": 240000,
      "advanced": 160000,
      "rare": 60000,
      "epic": 80000,
      "exclusive": 50000
    }
  ],
  "timeBalance": {
    "reference": "Single-tap gameplay: green 50%, gold 100%, red 0%; max 1 Gen. Cohort results depend on player skill and session assumptions.",
    "defaultPreset": "saved",
    "secondsPerCast": 10,
    "weatherCycleMinutes": 69,
    "fishingMinutesPerCycle": 11,
    "castsPerCycle": 66,
    "targetDays": 7,
    "hoursPerDay": 0.6666666666666666,
    "target": "any-apex-any-gen",
    "fishPoolChanged": false,
    "removedGenIds": [
      "vortex",
      "sequin",
      "sweetheart",
      "diamond",
      "radioactive",
      "webbed"
    ]
  },
  "balancePresets": {
    "online": {
      "label": "Thử nghiệm · xanh 8,29% / vàng 16,58%",
      "timeBasis": "online-with-weather-wait",
      "targetDays": 4.5,
      "hoursPerDay": 1,
      "green": 8.288100828,
      "gold": 16.576201656,
      "red": 0
    },
    "active": {
      "label": "Thử nghiệm · xanh 1,32% / vàng 2,64%",
      "timeBasis": "active-fishing",
      "targetDays": 4.5,
      "hoursPerDay": 1,
      "green": 1.321291436,
      "gold": 2.642582873,
      "red": 0
    },
    "weekly": {
      "label": "Thử nghiệm · xanh 40% / vàng 60%",
      "timeBasis": "seven-day-cohort",
      "targetShareMin": 0.75,
      "targetShareMax": 0.8,
      "green": 40,
      "gold": 60,
      "red": 0
    },
    "saved": {
      "label": "Gameplay mặc định · xanh 50% / vàng 100%",
      "timeBasis": "seven-day-cohort",
      "green": 50,
      "gold": 100,
      "red": 0
    }
  },
  "activeBalancePreset": "saved",
  "retiredCatalog": [
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
        "effectKey": null,
        "valueField": "MultiplierPrice",
        "value": 0.16,
        "levelCostMultiplier": 1.09,
        "mergedStackingRule": null,
        "sourceRow": 9,
        "iconKey": "Vortex"
      },
      "effectType": "WeatherEffect",
      "effectId": 7,
      "effectRef": "WeatherEffect:7",
      "mutationId": null,
      "weatherEffectId": 7
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
        "effectKey": null,
        "valueField": "MultiplierPrice",
        "value": 0.17,
        "levelCostMultiplier": 1.1,
        "mergedStackingRule": null,
        "sourceRow": 10,
        "iconKey": "Sequin"
      },
      "effectType": "WeatherEffect",
      "effectId": 8,
      "effectRef": "WeatherEffect:8",
      "mutationId": null,
      "weatherEffectId": 8
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
        "sheet": "Mutation (V2.3.1)",
        "sourceName": "Sweetheart",
        "sourceId": 7,
        "materialKey": "SweetheartMat",
        "effectKey": "sweetheartEffect",
        "valueField": "Multiplier",
        "value": 2.3,
        "levelCostMultiplier": 1.65,
        "mergedStackingRule": null,
        "sourceRow": 9,
        "iconKey": null
      },
      "effectType": "Mutation",
      "effectId": 7,
      "effectRef": "Mutation:7",
      "mutationId": 7,
      "weatherEffectId": null
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
        "sheet": "Mutation (V2.3.1)",
        "sourceName": "Crystalline",
        "sourceId": 8,
        "materialKey": "CrystallineMat",
        "effectKey": "crystallineEffect",
        "valueField": "Multiplier",
        "value": 2.37,
        "levelCostMultiplier": 1.85,
        "mergedStackingRule": null,
        "sourceRow": 10,
        "iconKey": null
      },
      "effectType": "Mutation",
      "effectId": 8,
      "effectRef": "Mutation:8",
      "mutationId": 8,
      "weatherEffectId": null
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
        "sheet": "Mutation (V2.3.1)",
        "sourceName": "Radioactive",
        "sourceId": 11,
        "materialKey": "RadioactiveMat",
        "effectKey": "RadioactiveEffect",
        "valueField": "Multiplier",
        "value": 2.5,
        "levelCostMultiplier": 2.15,
        "mergedStackingRule": null,
        "sourceRow": 13,
        "iconKey": null
      },
      "effectType": "Mutation",
      "effectId": 11,
      "effectRef": "Mutation:11",
      "mutationId": 11,
      "weatherEffectId": null
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
        "sheet": "Mutation (V2.3.1)",
        "sourceName": "Webbed",
        "sourceId": 9,
        "materialKey": "WebbedMat",
        "effectKey": "webbedEffect",
        "valueField": "Multiplier",
        "value": 2.4,
        "levelCostMultiplier": 2.05,
        "mergedStackingRule": null,
        "sourceRow": 11,
        "iconKey": null
      },
      "effectType": "Mutation",
      "effectId": 9,
      "effectRef": "Mutation:9",
      "mutationId": 9,
      "weatherEffectId": null
    }
  ],
  "typeGroups": {
    "rarityOrder": [
      "COMMON",
      "RARE",
      "EPIC",
      "LEGENDARY",
      "MYTHIC",
      "APEX"
    ],
    "basis": "BuyCostPetCoin at SSS grade, active 11 Gen only. Not pet price multiplier or item application chance.",
    "apex": {
      "ids": [
        "fossilized",
        "rainbow"
      ],
      "eachRateByBand": [
        0.005,
        0.01,
        0.015,
        0.02,
        0.025
      ]
    },
    "method": "One merged pool. Equal weight within rarity, higher rarity less frequent at every band, normalize to 1000000."
  },
  "effectTables": {
    "Mutation": {
      "sheet": "Mutation (V2.3.1)",
      "rows": [
        {
          "ID": 1,
          "Name": "Normal",
          "MaterialKey": "None",
          "EffectKey": "None",
          "Multiplier": 1.0,
          "Weight": 3550.0,
          "FUSIONWEIGHT": 2500.0,
          "Tier": 0.0,
          "LvUpCostMultiplier": 1.0,
          "sourceRow": 3
        },
        {
          "ID": 2,
          "Name": "Golden",
          "MaterialKey": "GoldenMat",
          "EffectKey": "goldenEffect",
          "Multiplier": 1.33,
          "Weight": 700.0,
          "FUSIONWEIGHT": 2000.0,
          "Tier": 1.0,
          "LvUpCostMultiplier": 1.15,
          "sourceRow": 4
        },
        {
          "ID": 3,
          "Name": "Frozen",
          "MaterialKey": "IceMat",
          "EffectKey": "frozenEffect",
          "Multiplier": 1.66,
          "Weight": 420.0,
          "FUSIONWEIGHT": 1750.0,
          "Tier": 2.0,
          "LvUpCostMultiplier": 1.3,
          "sourceRow": 5
        },
        {
          "ID": 4,
          "Name": "Magma",
          "MaterialKey": "MagmaMat",
          "EffectKey": "magmaEffect",
          "Multiplier": 2.0,
          "Weight": 210.0,
          "FUSIONWEIGHT": 1420.0,
          "Tier": 3.0,
          "LvUpCostMultiplier": 1.45,
          "sourceRow": 6
        },
        {
          "ID": 5,
          "Name": "Clover",
          "MaterialKey": "CloverMat",
          "EffectKey": "cloverEffect",
          "Multiplier": 2.13,
          "Weight": 76.0,
          "FUSIONWEIGHT": 1200.0,
          "Tier": 4.0,
          "LvUpCostMultiplier": 1.5,
          "sourceRow": 7
        },
        {
          "ID": 6,
          "Name": "Fossilized",
          "MaterialKey": "FossilizedMat",
          "EffectKey": "fossilizedEffect",
          "Multiplier": 2.25,
          "Weight": 20.0,
          "FUSIONWEIGHT": 730.0,
          "Tier": 5.0,
          "LvUpCostMultiplier": 1.6,
          "sourceRow": 8
        },
        {
          "ID": 7,
          "Name": "Sweetheart",
          "MaterialKey": "SweetheartMat",
          "EffectKey": "sweetheartEffect",
          "Multiplier": 2.3,
          "Weight": 10.0,
          "FUSIONWEIGHT": 200.0,
          "Tier": 6.0,
          "LvUpCostMultiplier": 1.65,
          "sourceRow": 9
        },
        {
          "ID": 8,
          "Name": "Crystalline",
          "MaterialKey": "CrystallineMat",
          "EffectKey": "crystallineEffect",
          "Multiplier": 2.37,
          "Weight": 5.0,
          "FUSIONWEIGHT": 70.0,
          "Tier": 7.0,
          "LvUpCostMultiplier": 1.85,
          "sourceRow": 10
        },
        {
          "ID": 9,
          "Name": "Webbed",
          "MaterialKey": "WebbedMat",
          "EffectKey": "webbedEffect",
          "Multiplier": 2.4,
          "Weight": 3.0,
          "FUSIONWEIGHT": 50.0,
          "Tier": 8.0,
          "LvUpCostMultiplier": 2.05,
          "sourceRow": 11
        },
        {
          "ID": 10,
          "Name": "Football",
          "MaterialKey": "FootballMat",
          "EffectKey": "RadioactiveEffect",
          "Multiplier": 2.37,
          "Weight": 5.0,
          "FUSIONWEIGHT": 70.0,
          "Tier": 7.0,
          "LvUpCostMultiplier": 1.65,
          "sourceRow": 12
        },
        {
          "ID": 11,
          "Name": "Radioactive",
          "MaterialKey": "RadioactiveMat",
          "EffectKey": "RadioactiveEffect",
          "Multiplier": 2.5,
          "Weight": 1.0,
          "FUSIONWEIGHT": 10.0,
          "Tier": 9.0,
          "LvUpCostMultiplier": 2.15,
          "sourceRow": 13
        }
      ]
    },
    "WeatherEffect": {
      "sheet": "Weather Effects",
      "rows": [
        {
          "ID": 1,
          "Name": "Soaked",
          "Icon": "Soaked",
          "Chance": 0.04,
          "MultiplierPrice": 0.05,
          "LvUpCostMultiplier": 1.03,
          "sourceRow": 3
        },
        {
          "ID": 2,
          "Name": "Frost",
          "Icon": "Frost",
          "Chance": 0.02,
          "MultiplierPrice": 0.09,
          "LvUpCostMultiplier": 1.05,
          "sourceRow": 4
        },
        {
          "ID": 3,
          "Name": "Gale",
          "Icon": "Gale",
          "Chance": 0.05,
          "MultiplierPrice": 0.08,
          "LvUpCostMultiplier": 1.05,
          "sourceRow": 5
        },
        {
          "ID": 4,
          "Name": "Thundered",
          "Icon": "Thundered",
          "Chance": 0.009,
          "MultiplierPrice": 0.12,
          "LvUpCostMultiplier": 1.07,
          "sourceRow": 6
        },
        {
          "ID": 5,
          "Name": "Eclipse",
          "Icon": "Eclipse",
          "Chance": 0.0077,
          "MultiplierPrice": 0.15,
          "LvUpCostMultiplier": 1.08,
          "sourceRow": 7
        },
        {
          "ID": 6,
          "Name": "Prismatic",
          "Icon": "Prismatic",
          "Chance": 0.0082,
          "MultiplierPrice": 0.14,
          "LvUpCostMultiplier": 1.08,
          "sourceRow": 8
        },
        {
          "ID": 7,
          "Name": "Vortex",
          "Icon": "Vortex",
          "Chance": 0.0082,
          "MultiplierPrice": 0.16,
          "LvUpCostMultiplier": 1.09,
          "sourceRow": 9
        },
        {
          "ID": 8,
          "Name": "Sequin",
          "Icon": "Sequin",
          "Chance": 0.0082,
          "MultiplierPrice": 0.17,
          "LvUpCostMultiplier": 1.1,
          "sourceRow": 10
        },
        {
          "ID": 9,
          "Name": "Sparkle",
          "Icon": "Sparkle",
          "Chance": 0.0,
          "MultiplierPrice": 0.2,
          "LvUpCostMultiplier": 1.3,
          "sourceRow": 11
        },
        {
          "ID": 10,
          "Name": "Aurora",
          "Icon": "Aurora",
          "Chance": 0.0082,
          "MultiplierPrice": 0.18,
          "LvUpCostMultiplier": 1.15,
          "sourceRow": 12
        },
        {
          "ID": 11,
          "Name": "Stormspark",
          "Icon": "Stormspark",
          "Chance": 0.005,
          "MultiplierPrice": 0.2,
          "LvUpCostMultiplier": 1.3,
          "sourceRow": 13
        }
      ]
    }
  },
  "effectSourceAudit": {
    "workbook": "[Craftland] Steal A Pet Master Data.xlsx",
    "sha256": "63a0e439773fbdaa32ed7e82e654a9c059c8d1f045add50dce41dfede4da31a1",
    "localFileModified": "2026-11-05",
    "mutationSheet": "Mutation (V2.3.1)",
    "weatherSheet": "Weather Effects",
    "weatherIdMeaning": "WeatherID = WeatherEffectID; not WeatherType",
    "weatherEffectKeyNote": "Source has Icon, not EffectKey. Preserve Icon separately; do not infer a VFX key.",
    "idPolicy": "id is the stable Gen alias; use effectType + effectId for SAP references.",
    "footballNote": "Mutation ID 10 Football uses RadioactiveEffect in source; preserved without guessing."
  }
};
