// Authored Rebirth progression; original species and Gen retained.
window.GenConfig = {
  "version": "merged-gen-7-rebirth-progression",
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
      "min": 1,
      "max": 4,
      "label": "R1–R4",
      "weights": {
        "gold": 617500,
        "soaked": 332500,
        "frost": 32340,
        "ice": 14700,
        "wind": 1960,
        "coral": 428,
        "thundered": 285,
        "clover": 142,
        "lunar": 95,
        "fossilized": 16,
        "rainbow": 10,
        "vortex": 6,
        "sequin": 5,
        "sweetheart": 3,
        "diamond": 2,
        "radioactive": 2,
        "webbed": 2,
        "bling": 1,
        "stormspark": 1,
        "cosmic": 1,
        "aurora": 1
      }
    },
    {
      "min": 5,
      "max": 8,
      "label": "R5–R8",
      "weights": {
        "gold": 585000,
        "soaked": 315000,
        "frost": 62700,
        "ice": 28500,
        "wind": 3800,
        "coral": 2025,
        "thundered": 1350,
        "clover": 675,
        "lunar": 450,
        "fossilized": 180,
        "rainbow": 113,
        "vortex": 67,
        "sequin": 54,
        "sweetheart": 36,
        "diamond": 11,
        "radioactive": 10,
        "webbed": 9,
        "bling": 8,
        "stormspark": 7,
        "cosmic": 3,
        "aurora": 2
      }
    },
    {
      "min": 9,
      "max": 13,
      "label": "R9–R13",
      "weights": {
        "gold": 539500,
        "soaked": 290500,
        "frost": 99000,
        "ice": 45000,
        "wind": 6000,
        "coral": 8100,
        "thundered": 5400,
        "clover": 2700,
        "lunar": 1800,
        "fossilized": 720,
        "rainbow": 450,
        "vortex": 270,
        "sequin": 216,
        "sweetheart": 144,
        "diamond": 45,
        "radioactive": 40,
        "webbed": 36,
        "bling": 32,
        "stormspark": 27,
        "cosmic": 12,
        "aurora": 8
      }
    },
    {
      "min": 14,
      "max": 18,
      "label": "R14–R18",
      "weights": {
        "gold": 481000,
        "soaked": 259000,
        "frost": 145200,
        "ice": 66000,
        "wind": 8800,
        "coral": 15750,
        "thundered": 10500,
        "clover": 5250,
        "lunar": 3500,
        "fossilized": 1800,
        "rainbow": 1125,
        "vortex": 675,
        "sequin": 540,
        "sweetheart": 360,
        "diamond": 113,
        "radioactive": 99,
        "webbed": 90,
        "bling": 81,
        "stormspark": 67,
        "cosmic": 30,
        "aurora": 20
      }
    },
    {
      "min": 19,
      "max": null,
      "label": "R19+",
      "weights": {
        "gold": 409500,
        "soaked": 220500,
        "frost": 198000,
        "ice": 90000,
        "wind": 12000,
        "coral": 27000,
        "thundered": 18000,
        "clover": 9000,
        "lunar": 6000,
        "fossilized": 3400,
        "rainbow": 2125,
        "vortex": 1275,
        "sequin": 1020,
        "sweetheart": 680,
        "diamond": 338,
        "radioactive": 297,
        "webbed": 270,
        "bling": 243,
        "stormspark": 202,
        "cosmic": 90,
        "aurora": 60
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
      "fishingWeight": 617500,
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
      "fishingWeight": 332500,
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
      "fishingWeight": 32340,
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
      "fishingWeight": 14700,
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
      "fishingWeight": 1960,
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
      "fishingWeight": 428,
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
      "fishingWeight": 285,
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
      "fishingWeight": 142,
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
      "fishingWeight": 95,
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
      "fishingWeight": 16,
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
      "fishingWeight": 10,
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
      "fishingWeight": 6,
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
      "fishingWeight": 5,
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
      "fishingWeight": 3,
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
      "fishingWeight": 2,
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
      "fishingWeight": 2,
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
      "fishingWeight": 2,
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
    },
    {
      "id": "bling",
      "name": "Bling Bling",
      "family": "WeatherGen",
      "tier": "epic",
      "fishingEnabled": true,
      "fishingWeight": 1,
      "icon": {
        "atlas": 5
      },
      "source": {
        "sheet": "WeatherGen Config",
        "grades": [
          {
            "row": 48,
            "grade": "S",
            "petCoinCost": 420,
            "baseChance": 0.05
          },
          {
            "row": 49,
            "grade": "SS",
            "petCoinCost": 450,
            "baseChance": 0.15
          },
          {
            "row": 50,
            "grade": "SSS",
            "petCoinCost": 480,
            "baseChance": 0.25
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Weather Effects",
        "sourceName": "Sparkle",
        "sourceId": 9,
        "materialKey": null,
        "effectKey": "Sparkle",
        "valueField": "MultiplierPrice",
        "value": 0.2,
        "levelCostMultiplier": 1.3,
        "mergedStackingRule": null
      }
    },
    {
      "id": "stormspark",
      "name": "Stormspark",
      "family": "WeatherGen",
      "tier": "epic",
      "fishingEnabled": true,
      "fishingWeight": 1,
      "icon": {
        "atlas": 6
      },
      "source": {
        "sheet": "WeatherGen Config",
        "grades": [
          {
            "row": 51,
            "grade": "S",
            "petCoinCost": 450,
            "baseChance": 0.05
          },
          {
            "row": 52,
            "grade": "SS",
            "petCoinCost": 480,
            "baseChance": 0.15
          },
          {
            "row": 53,
            "grade": "SSS",
            "petCoinCost": 510,
            "baseChance": 0.25
          }
        ]
      },
      "configured": true,
      "effectSource": {
        "sheet": "Weather Effects",
        "sourceName": "Stormspark",
        "sourceId": 11,
        "materialKey": null,
        "effectKey": "Stormspark",
        "valueField": "MultiplierPrice",
        "value": 0.2,
        "levelCostMultiplier": 1.3,
        "mergedStackingRule": null
      }
    },
    {
      "id": "cosmic",
      "name": "Galaxy",
      "family": "MutaGen",
      "tier": "exclusive",
      "fishingEnabled": true,
      "fishingWeight": 1,
      "icon": {
        "file": "assets/mutations/cosmic.png"
      },
      "source": {
        "sheet": "MutaGen Config",
        "grades": [
          {
            "row": 51,
            "grade": "S",
            "petCoinCost": null,
            "baseChance": null
          },
          {
            "row": 52,
            "grade": "SS",
            "petCoinCost": null,
            "baseChance": null
          },
          {
            "row": 53,
            "grade": "SSS",
            "petCoinCost": null,
            "baseChance": null
          }
        ]
      },
      "configured": false,
      "effectSource": {
        "sheet": "Mutation 2.0",
        "sourceName": "Galaxy",
        "sourceId": 12,
        "materialKey": "GalaxyMat",
        "effectKey": "GalaxyEffect",
        "valueField": "Multiplier",
        "value": null,
        "levelCostMultiplier": null,
        "mergedStackingRule": null
      }
    },
    {
      "id": "aurora",
      "name": "Aurora",
      "family": "WeatherGen",
      "tier": "exclusive",
      "fishingEnabled": true,
      "fishingWeight": 1,
      "icon": {
        "atlas": 7
      },
      "source": {
        "sheet": "WeatherGen Config",
        "grades": [
          {
            "row": 54,
            "grade": "S",
            "petCoinCost": null,
            "baseChance": null
          },
          {
            "row": 55,
            "grade": "SS",
            "petCoinCost": null,
            "baseChance": null
          },
          {
            "row": 56,
            "grade": "SSS",
            "petCoinCost": null,
            "baseChance": null
          }
        ]
      },
      "configured": false,
      "effectSource": {
        "sheet": "Weather Effects",
        "sourceName": "Aurora",
        "sourceId": 10,
        "materialKey": null,
        "effectKey": "Aurora",
        "valueField": "MultiplierPrice",
        "value": 0.18,
        "levelCostMultiplier": 1.15,
        "mergedStackingRule": null
      }
    }
  ],
  "notes": [
    "All 21 Gen may drop in Fishing. Rare Gen have positive, very small weights.",
    "Weights are authored Fishing balance, not item application chances.",
    "Rebirth changes type weights, not tap score or guaranteed rarity.",
    "Item prices and effect stacking gaps remain source metadata; they do not disable authored Fishing drops.",
    "Rebirth progression v7: all Gen remain possible; higher Rebirth increases quality, not chance to receive a Gen. Green 5%, gold 20%, red 0%; max one Gen."
  ],
  "rollOrder": [
    "fish",
    "genCount",
    "genTypes"
  ],
  "rarityBudgetByBand": [
    {
      "basic": 950000,
      "uncommon": 49000,
      "advanced": 950,
      "rare": 40,
      "epic": 8,
      "exclusive": 2
    },
    {
      "basic": 900000,
      "uncommon": 95000,
      "advanced": 4500,
      "rare": 450,
      "epic": 45,
      "exclusive": 5
    },
    {
      "basic": 830000,
      "uncommon": 150000,
      "advanced": 18000,
      "rare": 1800,
      "epic": 180,
      "exclusive": 20
    },
    {
      "basic": 740000,
      "uncommon": 220000,
      "advanced": 35000,
      "rare": 4500,
      "epic": 450,
      "exclusive": 50
    },
    {
      "basic": 630000,
      "uncommon": 300000,
      "advanced": 60000,
      "rare": 8500,
      "epic": 1350,
      "exclusive": 150
    }
  ]
};
