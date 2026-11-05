# Fishing config v3 — cá trước, Gen sau

> Gen rarity policy below is superseded by GEN-BALANCE-v4.md: all 21 Gen now have positive weights. The legacy fish pool and fish-first resolution remain current. The five-Gen whitelist below is historical.

## Nguồn pool cá

Chọn lại `[Craftland] Steal A Pet Master Data.xlsx` → **Fishing!A1:Q37**, không dùng `fishing 1.0.1`.

- 35 dòng cá, tất cả có weight dương. TUNA và SALMON được roll lại theo weight nguồn cũ.
- Không có PIG, DOG, GOOSE, SHOEBILL, SWAN hoặc pet Halloween của pool mới.
- Band: R1–R5, R6–R10, R11–R15, R16–R20, R21+. Nguồn cuối là RB21–25; trên RB25 dùng lại band cuối, được ghi rõ trong config.
- Tổng weight thực: 1.000.000 / 1.000.000 / 1.000.000 / 1.000.000 / 999.970. Luôn chuẩn hóa theo tổng thực, không coi mọi cột đã bằng 1 triệu.
- Giá tiếp tục tính SpawnPrice × ClaimK (1,10), lưu cent nguyên dạng string. Cached ClaimPrice của SALMON không khớp O×P nên không dùng làm nguồn giá.

## Thứ tự giải quyết lượt câu

Sau tap chấm điểm thứ ba:

1. Roll **cá** theo Rebirth đã snapshot lúc Cast.
2. Từ điểm ba tap, roll **số Gen**: đỏ +0, xanh +20, vàng +40; 100 điểm bảo đảm 1, 120 điểm bảo đảm 1 + 20% thêm 1.
3. Roll **loại Gen** trong một pool gộp MutaGen + WeatherGen, theo band Rebirth. Không roll family riêng, không thêm một lượt Weather miễn phí.
4. Gen thứ hai khác Gen thứ nhất, chuẩn hóa lại pool còn lại. Không đổi PetID/rarity đã roll.
5. Stamp một offer với cá, Gen, giá và phiên bản config. Mua cấp đúng offer; Thả cấp 0; reload không reroll.

`GenCore.catchRoll` là đường roll chung cho live và full simulation, bảo đảm thứ tự RNG **Fish → GenCount → GenTypes**. Mô phỏng không trừ ví hoặc tự mua pet.

## Pool Gen gộp

Danh mục có 21 target, giữ `family` để đối chiếu nguồn. Giá item, grade S/SS/SSS và base apply chance vẫn là metadata gốc, không phải drop chance khi câu.

| Gen | R1–R5 | R6–R10 | R11–R15 | R16–R20 | R21+ |
|---|---:|---:|---:|---:|---:|
| Golden | 55% | 50% | 45% | 40% | 35% |
| Soaked | 30% | 32% | 34% | 36% | 38% |
| Frozen | 10% | 12% | 14% | 16% | 18% |
| Frost | 4,5% | 5,25% | 6% | 6,75% | 7,5% |
| Gale | 0,5% | 0,75% | 1% | 1,25% | 1,5% |

Đây là cân bằng Fishing mới, mô tả lần chọn Gen đầu tiên, có điều kiện đã nhận Gen. 16 Gen cao cấp khác có weight 0 và không được mở bằng Rebirth hoặc tap vàng. Frozen và Frost là hai Gen riêng.

## Config bàn giao

- `outputs/fishing-v3/Fishing_Muta_Weather_Config_v3.xlsx`: 8 sheet FlowRules, FishPool, GenPool, GenWeights, ItemGrades, SourceEffects, TapOutcomes, Simulation.
- `outputs/fishing-v3/Fishing_Gen_Config_v3.json`: snapshot machine-readable cùng giá trị với runtime.
- `assets/fishing-config.js`: 35 cá và 5 band cũ.
- `assets/gen-config.js`: danh mục Gen, weight, grade metadata và source effect metadata.
- `assets/fishing-pool.js` và `assets/gen-core.js`: roll dùng chung, không dựa vào cached rate.

SourceEffects giữ các trường `Multiplier` và `MultiplierPrice` nguyên bản, có namespace theo family cho Source ID. Công thức stacking/income hợp nhất chưa được chốt; không tự cộng hai kiểu giá trị này. Galaxy và Aurora thiếu một số giá/chance nguồn, để trống và vẫn khóa trong Fishing.

Excel không tự sửa runtime. Cần review và export config sau khi đổi weight. Các file GDD/Data v2 giữ lại như snapshot lịch sử, không phải pool đang chạy.

## Kiểm tra

Đã chạy 1.000 lượt × 6 kịch bản × 5 band = 30.000 lượt theo pool cũ và thứ tự fish-first. Báo cáo hiện tại ở `reports/fishing-simulation.md`, full log ở `reports/fishing-casts.csv`. Debug so sánh các mốc 1 / 6 / 11 / 16 / 21. Gen bị khóa vẫn xuất hiện 0 lần.

Offer đã tồn tại từ phiên bản cũ được giữ nguyên, không bị reroll; pool mới áp dụng từ lượt Cast mới.
