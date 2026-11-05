# Fishing thử nghiệm v5 — tối đa một Gen

- Giữ 3 tap chấm điểm: đỏ +0%, xanh +10%, vàng +20%.
- Chance = tổng điểm / 100; roll thành công mới chọn đúng một Gen. Không có lượt roll Gen thứ hai, không carry điểm.
- Full đỏ: 0%; full xanh: 30%; full vàng: 60%. Full vàng không bảo đảm nhận Gen.
- Runtime chặn cứng tối đa 1 Gen ở cả hàm đếm và hàm chọn; kể cả debug truyền điểm/số lượng quá cao.
- Giữ pool cũ 35 cá, thứ tự cá trước rồi Gen, 21 loại Gen có weight dương và cân bằng rarity/Rebirth v4.
- Debug/metric/CSV giao diện không còn cột 2 Gen. Bộ đếm `two` nội bộ và report lịch sử giữ lại để kiểm tra luôn bằng 0.
- Offer đã stamp ở phiên bản trước giữ nguyên; luật mới áp dụng cho lượt mới. Không xóa Gen đã có khỏi túi thử.

Mô phỏng Gen-only R1, seed 20261105, 1 triệu lượt/kịch bản: đỏ 0%, xanh 30,075%, vàng 60,0674%; cả 6 triệu lượt không có double Gen. Full fish+Gen đã chạy lại 30.000 lượt ở 5 band.

Config runtime: `assets/gen-config.js` (merged-gen-5-single), `assets/fishing-config.js`. JSON snapshot ở `outputs/fishing-v5/Fishing_Gen_Config_v5.json`. GDD/config v2–v4 là snapshot trước thử nghiệm; công thức số Gen cũ trong các file đó không áp dụng cho v5.
