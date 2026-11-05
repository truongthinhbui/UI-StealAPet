# Gen v9: cân bằng thời gian và giữ thứ tự độ hiếm

Áp dụng vào web và Excel, giữ nguyên 35 pet / 5 cột weight và giá từ data gốc. Còn 17 Gen; không đưa lại Bling Bling, Stormspark, Galaxy, Aurora.

## Lựa chọn đã chốt

Người dùng chọn giữ 3 tap, tối đa 1 Gen và thứ tự độ hiếm, chấp nhận lâu hơn baseline 281 giờ của conveyor Apex + Webbed. Chỉ đổi trọng số loại Gen. Xanh +5%, vàng +20%, đỏ +0% không đổi.

Muốn Apex + Webbed 281 giờ với pet pool và nhịp Fishing hiện tại cần Webbed chiếm 25,2% mỗi lần nhận Gen. Khi các Gen ít hiếm hơn đều phải có weight lớn hơn, tổng vượt 100%. Vì vậy v9 chọn Webbed R19+ 3%, thay vì giả vờ đạt time parity.

## Mốc Webbed

| Rebirth | Rate Webbed khi có Gen | Apex + Webbed: giờ thao tác | Apex + Webbed: giờ gồm chờ |
|---|---:|---:|---:|
| R1–R4 | 0,1% | 42.087,5 | 264.003,7 |
| R5–R8 | 0,3% | 9.352,8 | 58.667,5 |
| R9–R13 | 0,7% | 3.006,3 | 18.857,4 |
| R14–R18 | 1,5% | 935,3 | 5.866,7 |
| R19+ | 3% | 376,4 | 2.360,9 |

Full vàng, 10 giây/lượt, 66 lượt/chu kỳ weather 69 phút, không chest, đủ tiền mua pet, không bỏ lỡ wave, room/weather theo mô hình đã kiểm tra. Số giờ gồm chờ là xấp xỉ theo thông lượng dài hạn, không phải bảo đảm hoặc giờ thao tác. Full xanh làm thời gian gấp 4; full đỏ không cho Gen. Nếu chỉ chơi 1 giờ online/ngày với pha weather ngẫu nhiên, số ngày kỳ vọng xấp xỉ số giờ gồm chờ trong bảng.

## Toàn bộ 17 Gen ở R19+

| Gen | Nhóm | Rate khi có Gen | Apex + Gen: giờ gồm chờ | Giờ thao tác |
|---|---|---:|---:|---:|
| Golden | COMMON | 11,354% | 623,8 | 99,4 |
| Soaked | COMMON | 10,1461% | 698,1 | 111,3 |
| Frozen | RARE | 9,9496% | 711,9 | 113,5 |
| Frost | RARE | 8,6215% | 821,5 | 131 |
| Gale | RARE | 6,9275% | 1.022,4 | 163 |
| Magma | EPIC | 6,4355% | 1.100,6 | 175,5 |
| Thundered | EPIC | 5,9783% | 1.184,8 | 188,9 |
| Clover | EPIC | 5,6738% | 1.248,3 | 199 |
| Eclipse | EPIC | 5,271% | 1.343,7 | 214,2 |
| Fossilized | LEGENDARY | 4,754% | 1.489,9 | 237,5 |
| Prismatic | LEGENDARY | 4,3648% | 1.622,7 | 258,7 |
| Vortex | LEGENDARY | 3,9781% | 1.780,5 | 283,8 |
| Sequin | LEGENDARY | 3,8202% | 1.854 | 295,6 |
| Sweetheart | LEGENDARY | 3,5482% | 1.996,2 | 318,2 |
| Crystalline | MYTHIC | 3,125% | 2.266,5 | 361,3 |
| Radioactive | MYTHIC | 3,0524% | 2.320,4 | 369,9 |
| Webbed | MYTHIC | 3% | 2.360,9 | 376,4 |

## Phương pháp áp dụng đồng đều

Mỗi band dùng weight mới ∝ weight_v8^alpha, chuẩn hóa tổng 1.000.000 bằng largest remainder. Alpha được giải để Webbed lần lượt bằng 0,1% / 0,3% / 0,7% / 1,5% / 3%. Dùng cùng alpha cho cả MutaGen và WeatherGen trong band; không chọn riêng ưu đãi Webbed. Giữ thứ tự trong cùng nhóm rarity; sắp score theo COMMON > RARE > EPIC > LEGENDARY > MYTHIC trước khi nén để không còn Gale RARE thấp hơn Magma EPIC. Các Gen cùng weight vẫn được coi cùng độ hiếm. Giữ tên hiển thị COMMON / RARE / EPIC / LEGENDARY / MYTHIC / APEX; không còn APEX Gen trong pool sau khi loại Galaxy/Aurora.

Thu hẹp khoảng cách weight là đánh đổi: Gen MYTHIC dễ gặp hơn trước, mức cách biệt với COMMON nhỏ hơn. Không tuyên bố mọi Gen ngang thời gian conveyor: baseline natural của mutation và weather khác nhau về eligibility, lịch weather và chance. Đây là cấu hình giữ thứ tự tương đối với mốc Webbed khả thi, không phải sao chép các hệ thống acquisition khác.

Công thức: P(Apex + Gen X/lượt) = P(Apex theo pet band) × 0,60 × Weight_X/1.000.000. Giờ gồm chờ = 1/P × 69/66/60. Giờ thao tác = 1/P × 10/3.600.

## Kiểm tra

300.000 lượt mô phỏng cho 6 pattern × 5 band; thêm 100.000 full vàng R19+ kiểm tra phân phối Gen. Exact assertions: 17 positive entries, tổng mỗi band 1.000.000, pet không đổi, thứ tự trong nhóm và giữa các nhóm được giữ, tổng xác suất đuôi rarity tăng qua các band, tối đa 1 Gen. Combo Apex + Gen hiếm được báo cáo bằng công thức, không dùng số ít hit Monte Carlo làm bằng chứng kỳ vọng. Website charts, bộ lọc và export JSON được kiểm tra sau thay đổi.

Config: merged-gen-9-time-balanced-17. Nguồn cố định: Gen v8 trước chỉnh và pet pool gốc. Conveyor reference: GDD GlobalCofig 6000 ms/spawn, Master Data daily pool rates 3.0.1 + Mutation 2.0 Webbed weight 3/5000. Không sửa source workbooks hoặc shop.