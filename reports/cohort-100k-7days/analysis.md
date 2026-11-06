# Mô phỏng 100.000 người × 7 ngày

Pool pet: fishing-1.0.1-source-v5; Gen: merged-gen-21-smooth96-4. Mỗi người seed riêng, seed tổng 20261106. Rebirth đầu kỳ đều R19–R30, không tăng trong tuần.

20% casual 20p/ngày, 60% thường 40p, 20% hardcore 60p: trung bình danh nghĩa 40p/ngày. Tap đỏ/xanh/vàng: 25/55/20; 15/50/35; 5/40/55.

Giờ đăng nhập nền ngẫu nhiên trên chu kỳ weather 69p, giữ cùng giờ mỗi ngày, dao động ±10p. Phút chơi ±20%. Tham gia mỗi ngày 100%; hiệu suất trong event 90%; di chuyển 10 giây/cửa sổ; 10 giây/lượt hoàn chỉnh. Weather mở câu 11p/69p. Các giả định này có thể sửa trong Debug.

Preset online: xanh +8.288100828%, vàng +16.576201656%. Full vàng 49.7286%, không phải 30%. Chưa có telemetry để hiệu chỉnh độ chính xác tap theo rarity.

| Nhóm | Người | Lượt/người trong 7 ngày | Có ≥1 Apex | Có ≥1 Apex + Gen | Có Gen / lượt |
|---|---:|---:|---:|---:|---:|
| Casual | 20000 | 107.94 | 56.87% | 17.89% | 23.65% |
| Thường | 60000 | 217.70 | 81.68% | 39.95% | 29.84% |
| Hardcore | 20000 | 327.33 | 92.48% | 61.35% | 37.32% |
| Tất cả | 100000 | 217.67 | 78.88% | 39.82% | 31.48% |

## Đối chiếu kỹ năng
Cùng người, thời lượng, seed và lịch tham gia; chỉ đổi tất cả tap thành vàng. Tỷ lệ có Apex + Gen trong tuần: 39.82% → 55.17%. Đây là kịch bản trần kỹ năng, không phải dự báo trung bình.

## Cách đọc và giới hạn
Đếm người có ít nhất một lần, không lấy tổng lượt rơi chia cho tổng người để suy ra tỷ lệ sở hữu. Chart ngày là số người từng gặp Apex + Gen tính đến ngày đó.
Kết quả là cơ hội pet xuất hiện/mua được. Chưa trừ tiền mua, sức chứa, bán/thả, bỏ qua pet hoặc rời giữa lượt. Chưa mô hình hóa chênh lệch tap theo rarity/tốc độ, mệt mỏi hoặc tự tương quan lỗi.
Rebirth phân bố đều là giả định đã thống nhất, không phải phân bố người chơi thực. Các pool pet đều ở band R19+; pool Gen đổi tại R21 và R25.
Mỗi người có RNG riêng; cùng seed/settings tái lập được kết quả. Hai stream tách lịch online khỏi drop. Không thay đổi GenConfig.rules khi chạy.

## Kiểm tra cân bằng
Giữ Fossilized và Prismatic 2% mỗi loại sau khi đã có Gen. Không tự đổi pool từ kết quả mô phỏng; cần chọn mục tiêu tỷ lệ người có pet + Gen trong 7 ngày trước khi hiệu chỉnh.
CSV từng người chứa seed, nhóm, Rebirth, số lượt, số Gen, Apex, Apex + Gen và ngày đầu gặp. JSON tổng hợp chứa số người gặp từng pet, Gen, tổ hợp và các setting để tái chạy.

## Đối chiếu giải tích
Từ đúng số lượt từng người: E(người có Apex + Gen) = tổng [1 − (1 − P(Apex) × P(Gen nhóm))^số_lượt]. Kỳ vọng 39676.55 người; Monte Carlo 39819; z = 0.960. Tất cả 11 loại Gen nằm trong ngưỡng 6 độ lệch chuẩn so với kỳ vọng theo Rebirth của từng người.
