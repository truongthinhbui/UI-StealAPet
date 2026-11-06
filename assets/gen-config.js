window.GenConfig = {
  "version": "merged-gen-25-price-rarity",
  "source": "[Craftland] Steal A Pet Master Data.xlsx",
  "rules": {
    "green": 10,
    "gold": 34,
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
        "sheet": "Mutation 2.0",
        "sourceName": "Golden",
        "sourceId": 2,
        "materialKey": "GoldenMat",
        "effectKey": "goldenEffect",
        "valueField": "Multiplier",
        "value": 1.33,
        "levelCostMultiplier": 1.15,
        "mergedStackingRule": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 30
      }
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
        "effectKey": "Soaked",
        "valueField": "MultiplierPrice",
        "value": 0.05,
        "levelCostMultiplier": 1.03,
        "mergedStackingRule": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 25
      }
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
        "sheet": "Mutation 2.0",
        "sourceName": "Frozen",
        "sourceId": 3,
        "materialKey": "IceMat",
        "effectKey": "frozenEffect",
        "valueField": "Multiplier",
        "value": 1.66,
        "levelCostMultiplier": 1.3,
        "mergedStackingRule": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 50
      }
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
        "effectKey": "Frost",
        "valueField": "MultiplierPrice",
        "value": 0.09,
        "levelCostMultiplier": 1.05,
        "mergedStackingRule": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 50
      }
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
        "effectKey": "Gale",
        "valueField": "MultiplierPrice",
        "value": 0.08,
        "levelCostMultiplier": 1.05,
        "mergedStackingRule": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 70
      }
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
        "sheet": "Mutation 2.0",
        "sourceName": "Magma",
        "sourceId": 4,
        "materialKey": "MagmaMat",
        "effectKey": "magmaEffect",
        "valueField": "Multiplier",
        "value": 2,
        "levelCostMultiplier": 1.45,
        "mergedStackingRule": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 100
      }
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
        "effectKey": "Thundered",
        "valueField": "MultiplierPrice",
        "value": 0.12,
        "levelCostMultiplier": 1.07,
        "mergedStackingRule": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 120
      }
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
        "sheet": "Mutation 2.0",
        "sourceName": "Clover",
        "sourceId": 5,
        "materialKey": "CloverMat",
        "effectKey": "cloverEffect",
        "valueField": "Multiplier",
        "value": 2.13,
        "levelCostMultiplier": 1.5,
        "mergedStackingRule": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 180
      }
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
        "effectKey": "Eclipse",
        "valueField": "MultiplierPrice",
        "value": 0.15,
        "levelCostMultiplier": 1.08,
        "mergedStackingRule": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 180
      }
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
        "sheet": "Mutation 2.0",
        "sourceName": "Fossilized",
        "sourceId": 6,
        "materialKey": "FossilizedMat",
        "effectKey": "fossilizedEffect",
        "valueField": "Multiplier",
        "value": 2.25,
        "levelCostMultiplier": 1.6,
        "mergedStackingRule": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 275
      }
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
        "effectKey": "Prismatic",
        "valueField": "MultiplierPrice",
        "value": 0.14,
        "levelCostMultiplier": 1.08,
        "mergedStackingRule": null
      },
      "rarityBasis": {
        "field": "BuyCostPetCoin",
        "grade": "SSS",
        "value": 250
      }
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
    "reference": "Gameplay aligned with saved simulation: green +10 points, gold +34, red 0; 3 taps capped at 100%; max 1 Gen. Seven-day cohort snapshot 601/1000, not guaranteed.",
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
      "label": "4–5 ngày · 1 giờ online/ngày",
      "timeBasis": "online-with-weather-wait",
      "targetDays": 4.5,
      "hoursPerDay": 1,
      "green": 8.288100828,
      "gold": 16.576201656,
      "red": 0
    },
    "active": {
      "label": "4–5 ngày · 1 giờ thực sự câu/ngày",
      "timeBasis": "active-fishing",
      "targetDays": 4.5,
      "hoursPerDay": 1,
      "green": 1.321291436,
      "gold": 2.642582873,
      "red": 0
    },
    "weekly": {
      "label": "7 ngày · mục tiêu 75–80% có Apex + Gen",
      "timeBasis": "seven-day-cohort",
      "targetShareMin": 0.75,
      "targetShareMax": 0.8,
      "green": 40,
      "gold": 60,
      "red": 0
    },
    "saved": {
      "label": "Gameplay mặc định · xanh 10% / vàng 34%",
      "timeBasis": "seven-day-cohort",
      "green": 10,
      "gold": 34,
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
  }
};
