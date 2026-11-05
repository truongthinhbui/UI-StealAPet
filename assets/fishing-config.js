window.FishingConfig = {
  "version": "fishing-legacy-fish-first-v3-rb14",
  "source": {
    "workbook": "[Craftland] Steal A Pet Master Data.xlsx",
    "sheet": "Fishing",
    "range": "A1:Q37",
    "notes": "Use original 35 fish rows; normalize actual weights. Above RB25 reuse the last source band. Claim price follows SpawnPrice*ClaimK, not stale cached Q.",
    "bandOverride": "User reference: R1–4 / R5–8 / R9–13 / R14–18 / R19+. Original 35 fish weights retained in column order."
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
    "greenMutation": 5,
    "goldMutation": 20,
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
        "color": "#f05252",
        "finColor": "#ffc0b6"
      },
      "MYTHIC": {
        "secondsPerRevolution": 1.8,
        "color": "#ffcc40",
        "finColor": "#fff1a6"
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
      "id": 52,
      "name": "SHRIMP",
      "rank": 9,
      "rarity": "COMMON",
      "tier": null,
      "weights": [
        403323,
        173318,
        73313,
        39970,
        19960
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
        201667,
        86667,
        36667,
        20000,
        10000
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
        71429,
        128572,
        57143,
        42857,
        22857
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
        71429,
        128571,
        57143,
        42857,
        22857
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
        71428,
        128571,
        57143,
        42857,
        22857
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
        35714,
        64286,
        28571,
        21429,
        11429
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
        13334,
        25000,
        75000,
        33334,
        25000
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
        13334,
        25000,
        75000,
        33334,
        25000
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
        13333,
        25000,
        75000,
        33333,
        25000
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
        13333,
        25000,
        75000,
        33333,
        25000
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
        13333,
        25000,
        75000,
        33333,
        25000
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
        13333,
        25000,
        75000,
        33333,
        25000
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
        20000,
        40000,
        75000,
        100000,
        75000
      ],
      "spawnPrice": "142500000.0",
      "claimK": "1.1",
      "claimPrice": "156750000.00",
      "claimCents": "15675000000"
    },
    {
      "id": 33,
      "name": "ALIGATOR",
      "rank": 82,
      "rarity": "LEGENDARY",
      "tier": null,
      "weights": [
        20000,
        40000,
        75000,
        100000,
        75000
      ],
      "spawnPrice": "480000000.0",
      "claimK": "1.1",
      "claimPrice": "528000000.00",
      "claimCents": "52800000000"
    },
    {
      "id": 47,
      "name": "MANATEE",
      "rank": 127,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2295,
        5624,
        8477,
        37039,
        56077
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
        2295,
        5624,
        8477,
        37038,
        56077
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
        2295,
        5624,
        8476,
        37038,
        56076
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
        2295,
        5624,
        8476,
        37038,
        56076
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
        2295,
        5624,
        8476,
        37038,
        56076
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
        2295,
        5624,
        8476,
        37038,
        56076
      ],
      "spawnPrice": "6.62796E+17",
      "claimK": "1.1",
      "claimPrice": "7.290756E+17",
      "claimCents": "72907560000000000000"
    },
    {
      "id": 70,
      "name": "SEAHORSE",
      "rank": 142,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2295,
        5623,
        8476,
        37038,
        56076
      ],
      "spawnPrice": "6.92797E+17",
      "claimK": "1.1",
      "claimPrice": "7.620767E+17",
      "claimCents": "76207670000000000000"
    },
    {
      "id": 73,
      "name": "CATFISH",
      "rank": 146,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        2295,
        5623,
        8476,
        37038,
        56076
      ],
      "spawnPrice": "7.0368E+17",
      "claimK": "1.1",
      "claimPrice": "7.74048E+17",
      "claimCents": "77404800000000000000"
    },
    {
      "id": 78,
      "name": "AXOLOTLBLUE",
      "rank": 150,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        1148,
        2812,
        4238,
        18519,
        28038
      ],
      "spawnPrice": "1.54726E+18",
      "claimK": "1.1",
      "claimPrice": "1.701986E+18",
      "claimCents": "170198600000000000000"
    },
    {
      "id": 79,
      "name": "AXOLOTLPINK",
      "rank": 151,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        1148,
        2812,
        4238,
        18519,
        28038
      ],
      "spawnPrice": "8.50262E+17",
      "claimK": "1.1",
      "claimPrice": "9.352882E+17",
      "claimCents": "93528820000000000000"
    },
    {
      "id": 80,
      "name": "AXOLOTLGREEN",
      "rank": 152,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        1148,
        2812,
        4238,
        18519,
        28038
      ],
      "spawnPrice": "1.65026E+18",
      "claimK": "1.1",
      "claimPrice": "1.815286E+18",
      "claimCents": "181528600000000000000"
    },
    {
      "id": 81,
      "name": "AXOLOTLORANGE",
      "rank": 153,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        1148,
        2812,
        4238,
        18519,
        28038
      ],
      "spawnPrice": "1.65026E+18",
      "claimK": "1.1",
      "claimPrice": "1.815286E+18",
      "claimCents": "181528600000000000000"
    },
    {
      "id": 82,
      "name": "AXOLOTLWHITE",
      "rank": 154,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        1148,
        2812,
        4238,
        18519,
        28038
      ],
      "spawnPrice": "1.65026E+18",
      "claimK": "1.1",
      "claimPrice": "1.815286E+18",
      "claimCents": "181528600000000000000"
    },
    {
      "id": 1011,
      "name": "PENGUIN",
      "rank": 202,
      "rarity": "MYTHIC",
      "tier": null,
      "weights": [
        400,
        400,
        400,
        400,
        400
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
        400,
        400,
        400,
        400,
        400
      ],
      "spawnPrice": "6.76768E+17",
      "claimK": "1.1",
      "claimPrice": "7.444448E+17",
      "claimCents": "74444480000000000000"
    },
    {
      "id": 1034,
      "name": "CARP",
      "rank": 505,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        20,
        30,
        40,
        60,
        80
      ],
      "spawnPrice": "4.80495E+18",
      "claimK": "1.1",
      "claimPrice": "5.285445E+18",
      "claimCents": "528544500000000000000"
    },
    {
      "id": 107,
      "name": "GOLDFISH",
      "rank": 425,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        20,
        30,
        40,
        60,
        80
      ],
      "spawnPrice": "6.23164E+18",
      "claimK": "1.1",
      "claimPrice": "6.854804E+18",
      "claimCents": "685480400000000000000"
    },
    {
      "id": 108,
      "name": "BASS",
      "rank": 426,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        20,
        30,
        40,
        60,
        80
      ],
      "spawnPrice": "6.50779E+18",
      "claimK": "1.1",
      "claimPrice": "7.158569E+18",
      "claimCents": "715856900000000000000"
    },
    {
      "id": 109,
      "name": "TUNA",
      "rank": 427,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        20,
        30,
        40,
        60,
        80
      ],
      "spawnPrice": "6.79621E+18",
      "claimK": "1.1",
      "claimPrice": "7.475831E+18",
      "claimCents": "747583100000000000000"
    },
    {
      "id": 101,
      "name": "PIRANHA",
      "rank": 419,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        20,
        30,
        40,
        60,
        80
      ],
      "spawnPrice": "4.10497E+18",
      "claimK": "1.1",
      "claimPrice": "4.515467E+18",
      "claimCents": "451546700000000000000"
    },
    {
      "id": 117,
      "name": "SALMON",
      "rank": 515,
      "rarity": "APEX",
      "tier": null,
      "weights": [
        10,
        15,
        20,
        30,
        10
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
  "rollTiming": "after-third-scored-tap"
};
