window.FishingConfig = {
  "version": "fishing-1.0.1-source-v5",
  "source": {
    "workbook": "[Craftland] Steal A Pet Master Data.xlsx",
    "sheet": "fishing 1.0.1",
    "range": "A1:R45",
    "notes": "All 44 source entries retained; 42 have positive weights. TUNA and SALMON are zero-weight CHASE. Normalize actual column totals. Base price = SpawnPrice * ClaimK, stored to cents; no rounding to whole Money for base offers."
  },
  "bands": [
    {
      "min": 1,
      "max": 4,
      "label": "R1–R4"
    },
    {
      "min": 5,
      "max": 8,
      "label": "R5–R8"
    },
    {
      "min": 9,
      "max": 13,
      "label": "R9–R13"
    },
    {
      "min": 14,
      "max": 18,
      "label": "R14–R18"
    },
    {
      "min": 19,
      "max": null,
      "label": "R19+"
    }
  ],
  "allowedWeather": [
    "HighTide",
    "HeavyRain"
  ],
  "castCost": 0,
  "mechanic": {
    "mode": 7,
    "taps": 3,
    "greenMutation": 8.288100828,
    "goldMutation": 16.576201656,
    "missMutation": 0,
    "cooldown": 0,
    "rarityTiming": {
      "COMMON": {
        "secondsPerRevolution": 2.8,
        "color": "#31c779",
        "finColor": "#abf8ce"
      },
      "RARE": {
        "secondsPerRevolution": 2.5,
        "color": "#42aaff",
        "finColor": "#a5d9ff"
      },
      "EPIC": {
        "secondsPerRevolution": 2.25,
        "color": "#ac69f0",
        "finColor": "#dfbaff"
      },
      "LEGENDARY": {
        "secondsPerRevolution": 2,
        "color": "#ffcc40",
        "finColor": "#fff1a6"
      },
      "MYTHIC": {
        "secondsPerRevolution": 1.8,
        "color": "#f05252",
        "finColor": "#ffc0b6"
      },
      "APEX": {
        "secondsPerRevolution": 1.6,
        "color": "#27d9bd",
        "finColor": "#a3fff0"
      }
    },
    "minRebirth": 9
  },
  "chests": {
    "enabled": false,
    "reason": "Chest contents, purchase prices and approved per-counter ramp are not supplied."
  },
  "pets": [
    {
      "id": 4,
      "name": "PIG",
      "rank": 4,
      "rarity": "COMMON",
      "tier": null,
      "weights": [
        110229,
        99033,
        85459,
        70101,
        56477
      ],
      "spawnPrice": "110.0",
      "claimK": "1.1",
      "claimPrice": "121.00",
      "claimCents": "12100"
    },
    {
      "id": 7,
      "name": "GOOSE",
      "rank": 7,
      "rarity": "COMMON",
      "tier": null,
      "weights": [
        110229,
        99033,
        85459,
        70101,
        56477
      ],
      "spawnPrice": "380.0",
      "claimK": "1.1",
      "claimPrice": "418.00",
      "claimCents": "41800"
    },
    {
      "id": 8,
      "name": "DOG",
      "rank": 8,
      "rarity": "COMMON",
      "tier": null,
      "weights": [
        110229,
        99033,
        85458,
        70101,
        56477
      ],
      "spawnPrice": "460.0",
      "claimK": "1.1",
      "claimPrice": "506.00",
      "claimCents": "50600"
    },
    {
      "id": 52,
      "name": "SHRIMP",
      "rank": 9,
      "rarity": "COMMON",
      "tier": null,
      "weights": [
        110230,
        99033,
        85459,
        70101,
        56477
      ],
      "spawnPrice": "550.0",
      "claimK": "1.1",
      "claimPrice": "605.00",
      "claimCents": "60500"
    },
    {
      "id": 1012,
      "name": "MUDSKIPPER",
      "rank": 12,
      "rarity": "COMMON",
      "tier": null,
      "weights": [
        4083,
        3668,
        3165,
        2596,
        2092
      ],
      "spawnPrice": "22222.0",
      "claimK": "1.1",
      "claimPrice": "24444.20",
      "claimCents": "2444420"
    },
    {
      "id": 12,
      "name": "CRAB",
      "rank": 24,
      "rarity": "RARE",
      "tier": null,
      "weights": [
        98781,
        98781,
        97134,
        95488,
        92195
      ],
      "spawnPrice": "5600.0",
      "claimK": "1.1",
      "claimPrice": "6160.00",
      "claimCents": "616000"
    },
    {
      "id": 13,
      "name": "CLOWNFISH",
      "rank": 25,
      "rarity": "RARE",
      "tier": null,
      "weights": [
        98780,
        98780,
        97134,
        95488,
        92195
      ],
      "spawnPrice": "9600.0",
      "claimK": "1.1",
      "claimPrice": "10560.00",
      "claimCents": "1056000"
    },
    {
      "id": 17,
      "name": "TURTLE",
      "rank": 29,
      "rarity": "RARE",
      "tier": null,
      "weights": [
        98780,
        98780,
        97134,
        95488,
        92195
      ],
      "spawnPrice": "42400.0",
      "claimK": "1.1",
      "claimPrice": "46640.00",
      "claimCents": "4664000"
    },
    {
      "id": 1002,
      "name": "SQUID",
      "rank": 31,
      "rarity": "RARE",
      "tier": null,
      "weights": [
        3659,
        3659,
        3598,
        3536,
        3415
      ],
      "spawnPrice": "326592.0",
      "claimK": "1.1",
      "claimPrice": "359251.20",
      "claimCents": "35925120"
    },
    {
      "id": 23,
      "name": "OCTOPUS",
      "rank": 46,
      "rarity": "EPIC",
      "tier": null,
      "weights": [
        25000,
        28334,
        30834,
        33334,
        36667
      ],
      "spawnPrice": "1520000.0",
      "claimK": "1.1",
      "claimPrice": "1672000.00",
      "claimCents": "167200000"
    },
    {
      "id": 24,
      "name": "JELLYFISH",
      "rank": 47,
      "rarity": "EPIC",
      "tier": null,
      "weights": [
        25000,
        28334,
        30834,
        33334,
        36667
      ],
      "spawnPrice": "2320000.0",
      "claimK": "1.1",
      "claimPrice": "2552000.00",
      "claimCents": "255200000"
    },
    {
      "id": 25,
      "name": "DOLPHIN",
      "rank": 48,
      "rarity": "EPIC",
      "tier": null,
      "weights": [
        25000,
        28333,
        30833,
        33333,
        36667
      ],
      "spawnPrice": "3280000.0",
      "claimK": "1.1",
      "claimPrice": "3608000.00",
      "claimCents": "360800000"
    },
    {
      "id": 26,
      "name": "SEALION",
      "rank": 49,
      "rarity": "EPIC",
      "tier": null,
      "weights": [
        25000,
        28333,
        30833,
        33333,
        36667
      ],
      "spawnPrice": "4240000.0",
      "claimK": "1.1",
      "claimPrice": "4664000.00",
      "claimCents": "466400000"
    },
    {
      "id": 27,
      "name": "WALRUS",
      "rank": 50,
      "rarity": "EPIC",
      "tier": null,
      "weights": [
        25000,
        28333,
        30833,
        33333,
        36666
      ],
      "spawnPrice": "5120000.0",
      "claimK": "1.1",
      "claimPrice": "5632000.00",
      "claimCents": "563200000"
    },
    {
      "id": 57,
      "name": "LOBSTER",
      "rank": 52,
      "rarity": "EPIC",
      "tier": null,
      "weights": [
        25000,
        28333,
        30833,
        33333,
        36666
      ],
      "spawnPrice": "6880000.0",
      "claimK": "1.1",
      "claimPrice": "7568000.00",
      "claimCents": "756800000"
    },
    {
      "id": 37,
      "name": "ORCA",
      "rank": 80,
      "rarity": "LEGENDARY",
      "tier": null,
      "weights": [
        18750,
        22500,
        26250,
        32500,
        40000
      ],
      "spawnPrice": "480000000.0",
      "claimK": "1.1",
      "claimPrice": "528000000.00",
      "claimCents": "52800000000"
    },
    {
      "id": 33,
      "name": "ALIGATOR",
      "rank": 82,
      "rarity": "LEGENDARY",
      "tier": null,
      "weights": [
        18750,
        22500,
        26250,
        32500,
        40000
      ],
      "spawnPrice": "142500000.0",
      "claimK": "1.1",
      "claimPrice": "156750000.00",
      "claimCents": "15675000000"
    },
    {
      "id": 55,
      "name": "SHOEBILL",
      "rank": 83,
      "rarity": "LEGENDARY",
      "tier": null,
      "weights": [
        18750,
        22500,
        26250,
        32500,
        40000
      ],
      "spawnPrice": "825000000.0",
      "claimK": "1.1",
      "claimPrice": "907500000.00",
      "claimCents": "90750000000"
    },
    {
      "id": 58,
      "name": "SWAN",
      "rank": 84,
      "rarity": "LEGENDARY",
      "tier": null,
      "weights": [
        18750,
        22500,
        26250,
        32500,
        40000
      ],
      "spawnPrice": "990000000.0",
      "claimK": "1.1",
      "claimPrice": "1089000000.00",
      "claimCents": "108900000000"
    },
    {
      "id": 47,
      "name": "MANATEE",
      "rank": 127,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2388,
        3128,
        4939,
        7162,
        8397
      ],
      "spawnPrice": "175000000000.0",
      "claimK": "1.1",
      "claimPrice": "192500000000.00",
      "claimCents": "19250000000000"
    },
    {
      "id": 44,
      "name": "SMALLWHALE",
      "rank": 129,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2387,
        3128,
        4939,
        7162,
        8397
      ],
      "spawnPrice": "1229200000000.0",
      "claimK": "1.1",
      "claimPrice": "1352120000000.00",
      "claimCents": "135212000000000"
    },
    {
      "id": 50,
      "name": "BELUGA",
      "rank": 131,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2387,
        3128,
        4939,
        7162,
        8397
      ],
      "spawnPrice": "9979200000000.0",
      "claimK": "1.1",
      "claimPrice": "10977120000000.00",
      "claimCents": "1097712000000000"
    },
    {
      "id": 51,
      "name": "NARWHAL",
      "rank": 132,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2387,
        3128,
        4939,
        7162,
        8397
      ],
      "spawnPrice": "31104000000000.0",
      "claimK": "1.1",
      "claimPrice": "34214400000000.00",
      "claimCents": "3421440000000000"
    },
    {
      "id": 60,
      "name": "PLATYPUS",
      "rank": 134,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2387,
        3128,
        4939,
        7162,
        8396
      ],
      "spawnPrice": "3359230000000000.0",
      "claimK": "1.1",
      "claimPrice": "3695153000000000.00",
      "claimCents": "369515300000000000"
    },
    {
      "id": 69,
      "name": "TORTOISE",
      "rank": 141,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2387,
        3128,
        4939,
        7162,
        8396
      ],
      "spawnPrice": "6.627960070005E+17",
      "claimK": "1.1",
      "claimPrice": "7.2907560770055E+17",
      "claimCents": "72907560770055000000"
    },
    {
      "id": 70,
      "name": "SEAHORSE",
      "rank": 142,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2387,
        3128,
        4939,
        7162,
        8396
      ],
      "spawnPrice": "6.927968000005E+17",
      "claimK": "1.1",
      "claimPrice": "7.6207648000055E+17",
      "claimCents": "76207648000055000000"
    },
    {
      "id": 73,
      "name": "CATFISH",
      "rank": 146,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2387,
        3128,
        4939,
        7162,
        8396
      ],
      "spawnPrice": "7.0367967483005E+17",
      "claimK": "1.1",
      "claimPrice": "7.74047642313055E+17",
      "claimCents": "77404764231305500000"
    },
    {
      "id": 78,
      "name": "AXOLOTLBLUE",
      "rank": 150,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2387,
        3128,
        4939,
        7161,
        8396
      ],
      "spawnPrice": "1.54726169536832E+18",
      "claimK": "1.1",
      "claimPrice": "1.701987864905152E+18",
      "claimCents": "170198786490515200000"
    },
    {
      "id": 79,
      "name": "AXOLOTLPINK",
      "rank": 151,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2387,
        3128,
        4939,
        7161,
        8396
      ],
      "spawnPrice": "8.5026169526152E+17",
      "claimK": "1.1",
      "claimPrice": "9.35287864787672E+17",
      "claimCents": "93528786478767200000"
    },
    {
      "id": 80,
      "name": "AXOLOTLGREEN",
      "rank": 152,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2387,
        3128,
        4939,
        7161,
        8396
      ],
      "spawnPrice": "1.65026169526152E+18",
      "claimK": "1.1",
      "claimPrice": "1.815287864787672E+18",
      "claimCents": "181528786478767200000"
    },
    {
      "id": 81,
      "name": "AXOLOTLORANGE",
      "rank": 153,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2387,
        3128,
        4939,
        7161,
        8396
      ],
      "spawnPrice": "1.65026169526152E+18",
      "claimK": "1.1",
      "claimPrice": "1.815287864787672E+18",
      "claimCents": "181528786478767200000"
    },
    {
      "id": 82,
      "name": "AXOLOTLWHITE",
      "rank": 154,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        177,
        232,
        366,
        530,
        622
      ],
      "spawnPrice": "1.65026169526152E+18",
      "claimK": "1.1",
      "claimPrice": "1.815287864787672E+18",
      "claimCents": "181528786478767200000"
    },
    {
      "id": 1011,
      "name": "PENGUIN",
      "rank": 202,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        89,
        116,
        183,
        265,
        311
      ],
      "spawnPrice": "9.49105E+16",
      "claimK": "1.1",
      "claimPrice": "1.0440155E+17",
      "claimCents": "10440155000000000000"
    },
    {
      "id": 1023,
      "name": "SHARK",
      "rank": 206,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        89,
        116,
        183,
        265,
        311
      ],
      "spawnPrice": "6.767676767E+17",
      "claimK": "1.1",
      "claimPrice": "7.4444444437E+17",
      "claimCents": "74444444437000000000"
    },
    {
      "id": 101,
      "name": "PIRANHA",
      "rank": 419,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        223,
        491,
        2232,
        2232,
        2232
      ],
      "spawnPrice": "4.80495071284338E+18",
      "claimK": "1.1",
      "claimPrice": "5.285445784127718E+18",
      "claimCents": "528544578412771800000"
    },
    {
      "id": 107,
      "name": "GOLDFISH",
      "rank": 425,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        223,
        491,
        2231,
        2231,
        2231
      ],
      "spawnPrice": "6.23164006080233E+18",
      "claimK": "1.1",
      "claimPrice": "6.854804066882563E+18",
      "claimCents": "685480406688256300000"
    },
    {
      "id": 108,
      "name": "BASS",
      "rank": 426,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        223,
        491,
        2231,
        2231,
        2231
      ],
      "spawnPrice": "6.50778862712698E+18",
      "claimK": "1.1",
      "claimPrice": "7.158567489839678E+18",
      "claimCents": "715856748983967800000"
    },
    {
      "id": 109,
      "name": "TUNA",
      "rank": 427,
      "rarity": "APEX",
      "tier": "CHASE",
      "weights": [
        0,
        0,
        0,
        0,
        0
      ],
      "spawnPrice": "6.79621408238092E+18",
      "claimK": "1.1",
      "claimPrice": "7.475835490619012E+18",
      "claimCents": "747583549061901200000"
    },
    {
      "id": 1050,
      "name": "SQUID_PUMPKIN",
      "rank": 442,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        25,
        55,
        248,
        248,
        248
      ],
      "spawnPrice": "2.55E+19",
      "claimK": "1.1",
      "claimPrice": "2.805E+19",
      "claimCents": "2805000000000000000000"
    },
    {
      "id": 1051,
      "name": "JELLYFISH_PUMPKIN",
      "rank": 443,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        25,
        55,
        248,
        248,
        248
      ],
      "spawnPrice": "2.5E+19",
      "claimK": "1.1",
      "claimPrice": "2.75E+19",
      "claimCents": "2750000000000000000000"
    },
    {
      "id": 1058,
      "name": "OCTOPUS_SPIDERLEGS",
      "rank": 449,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        25,
        54,
        248,
        248,
        248
      ],
      "spawnPrice": "2.78E+19",
      "claimK": "1.1",
      "claimPrice": "3.058E+19",
      "claimCents": "3058000000000000000000"
    },
    {
      "id": 1059,
      "name": "ALIGATOR_SPIDERLEGS",
      "rank": 450,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        25,
        54,
        248,
        248,
        248
      ],
      "spawnPrice": "2.87E+19",
      "claimK": "1.1",
      "claimPrice": "3.157E+19",
      "claimCents": "3157000000000000000000"
    },
    {
      "id": 1034,
      "name": "CARP",
      "rank": 505,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        8,
        18,
        83,
        83,
        83
      ],
      "spawnPrice": "4.10497336335E+18",
      "claimK": "1.1",
      "claimPrice": "4.515470699685E+18",
      "claimCents": "451547069968500000000"
    },
    {
      "id": 117,
      "name": "SALMON",
      "rank": 515,
      "rarity": "APEX",
      "tier": "CHASE",
      "weights": [
        0,
        0,
        0,
        0,
        0
      ],
      "spawnPrice": "1.79E+19",
      "claimK": "1.1",
      "claimPrice": "1.969E+19",
      "claimCents": "1969000000000000000000"
    }
  ],
  "rollOrder": [
    "fish",
    "genCount",
    "genTypes"
  ],
  "rollTiming": "after-third-scored-tap",
  "pricing": {
    "version": "fish-gen-price-v1",
    "rule": "No Gen: source SpawnPrice * ClaimK to cents. With Gen: ROUND(SpawnPrice * GenPriceMultiplier * ClaimK, 0).",
    "sourceNote": "Authored Fishing purchase policy using Mutation 2.0 Multiplier and Weather Effects MultiplierPrice; base GDD defines SpawnPrice * ClaimK only.",
    "maxGens": 1,
    "genMultiplierById": {
      "gold": "1.33",
      "soaked": "1.05",
      "frost": "1.66",
      "ice": "1.09",
      "wind": "1.08",
      "coral": "2",
      "thundered": "1.12",
      "clover": "2.13",
      "lunar": "1.15",
      "fossilized": "2.25",
      "rainbow": "1.14",
      "vortex": "1.16",
      "sequin": "1.17",
      "sweetheart": "2.3",
      "diamond": "2.37",
      "radioactive": "2.5",
      "webbed": "2.4"
    }
  }
};
