# Full Fishing simulation

Seed 20261105. 10000 casts per scenario per Rebirth band. All six patterns and five Rebirth bands; 300000 casts total. Up to the first 1,000 casts of each run are retained in JSON/CSV; aggregates cover every cast. These are revealed offers, not automatic inventory grants.

| Rebirth | Pattern | Unique pets | No Gen | One Gen | Two Gen | Common pets |
|---|---|---:|---:|---:|---:|---:|
| R1–R4 | Full đỏ | 31 | 10000 | 0 | 0 | 60.490% |
| R1–R4 | Full xanh | 30 | 8516 | 1484 | 0 | 60.830% |
| R1–R4 | 2 xanh + 1 vàng | 32 | 7078 | 2922 | 0 | 60.730% |
| R1–R4 | 1 xanh + 2 vàng | 30 | 5537 | 4463 | 0 | 60.990% |
| R1–R4 | Full vàng | 30 | 4038 | 5962 | 0 | 60.870% |
| R1–R4 | Ngẫu nhiên theo tỉ lệ tap | 30 | 8156 | 1844 | 0 | 60.490% |
| R5–R8 | Full đỏ | 31 | 10000 | 0 | 0 | 25.540% |
| R5–R8 | Full xanh | 30 | 8516 | 1484 | 0 | 25.640% |
| R5–R8 | 2 xanh + 1 vàng | 33 | 7078 | 2922 | 0 | 25.360% |
| R5–R8 | 1 xanh + 2 vàng | 31 | 5537 | 4463 | 0 | 25.810% |
| R5–R8 | Full vàng | 31 | 4038 | 5962 | 0 | 25.750% |
| R5–R8 | Ngẫu nhiên theo tỉ lệ tap | 30 | 8156 | 1844 | 0 | 25.920% |
| R9–R13 | Full đỏ | 30 | 10000 | 0 | 0 | 10.910% |
| R9–R13 | Full xanh | 30 | 8516 | 1484 | 0 | 11.150% |
| R9–R13 | 2 xanh + 1 vàng | 33 | 7078 | 2922 | 0 | 10.920% |
| R9–R13 | 1 xanh + 2 vàng | 32 | 5537 | 4463 | 0 | 11.030% |
| R9–R13 | Full vàng | 32 | 4038 | 5962 | 0 | 11.030% |
| R9–R13 | Ngẫu nhiên theo tỉ lệ tap | 31 | 8156 | 1844 | 0 | 11.220% |
| R14–R18 | Full đỏ | 31 | 10000 | 0 | 0 | 5.930% |
| R14–R18 | Full xanh | 32 | 8516 | 1484 | 0 | 6.150% |
| R14–R18 | 2 xanh + 1 vàng | 34 | 7078 | 2922 | 0 | 6.100% |
| R14–R18 | 1 xanh + 2 vàng | 34 | 5537 | 4463 | 0 | 6.080% |
| R14–R18 | Full vàng | 33 | 4038 | 5962 | 0 | 6.090% |
| R14–R18 | Ngẫu nhiên theo tỉ lệ tap | 31 | 8156 | 1844 | 0 | 6.110% |
| R19+ | Full đỏ | 32 | 10000 | 0 | 0 | 3.230% |
| R19+ | Full xanh | 32 | 8516 | 1484 | 0 | 3.220% |
| R19+ | 2 xanh + 1 vàng | 34 | 7078 | 2922 | 0 | 3.210% |
| R19+ | 1 xanh + 2 vàng | 33 | 5537 | 4463 | 0 | 3.200% |
| R19+ | Full vàng | 32 | 4038 | 5962 | 0 | 3.130% |
| R19+ | Ngẫu nhiên theo tỉ lệ tap | 31 | 8156 | 1844 | 0 | 3.220% |

See fishing-casts.csv for individual casts: Rebirth, taps, points, pet ID, pet, rarity and exact Gen combination. fishing-simulation.json additionally contains all pet counts, per-pet Gen incidence and every observed combination. All 21 Gen have positive weights; rare outcomes may be absent in a finite sample.