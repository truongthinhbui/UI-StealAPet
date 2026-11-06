# Apex + Gen: hai preset thời gian

Mục tiêu là Apex bất kỳ + Gen bất kỳ, không phải một PetID hoặc Gen cụ thể. Mỗi preset nhắm kỳ vọng 4,5 ngày với 1 giờ/ngày theo cách đo của nó. Không có một cấu hình duy nhất đạt đồng thời hai cách đo vì chỉ 11/69 thời gian có thể Fishing.

| Preset | Full vàng có Gen | Giờ thực sự câu kỳ vọng | Giờ gồm chờ kỳ vọng |
|---|---:|---:|---:|
| Online (mặc định) | 49,7286% | 0,7174 | 4,5 |
| Thực sự câu | 7,92775% | 4,5 | 28,2273 |

Chọn trong Debug → Mô phỏng → Mục tiêu Apex + Gen. Áp dụng cho chơi thử và mô phỏng; không đổi giữa lượt đang câu hoặc mô phỏng đang chạy. Config JSON export gồm preset đang chọn và cả hai lựa chọn. Tap contribution khác nhau theo preset: online xanh 8,2881 điểm %, vàng 16,5762; thực sự câu xanh 1,3213, vàng 2,6426. Full đỏ vẫn 0 Gen, max 1 Gen. Counter hiển thị tỉ lệ thực tế, làm tròn 2 chữ số; tính toán dùng đầy đủ độ chính xác.

Cơ sở: fishing 1.0.1, P(Apex) = 7769/997769 ≈ 0,778637% từ R9+, cast trọn 10 giây, full vàng. 66 casts trong chu kỳ 69 phút; online phân bố đều theo weather, không travel/đọc offer/mua thêm thời gian, đủ Money mua pet và không mất kết quả. Tốc độ vòng theo rarity không đảm bảo mọi người đạt full vàng hoặc 10s/cast; đó là giả định cân bằng.

P(Apex+Gen) = P(Apex) × P(có Gen). Giờ thực câu = 10/[3600 × P(Apex+Gen)]. Giờ online trung bình = giờ thực câu × 69/11. Không thay pool pet hoặc phân phối 17 loại Gen. Gen cùng rarity vẫn bằng nhau. R25+ Webbed cụ thể chiếm 3,7638% Gen, nên cần khoảng 119,56 ngày theo cùng cách đo của preset. 4–5 ngày chỉ là kỳ vọng cho Gen bất kỳ, không phải guarantee hoặc pity.

Kiểm tra: hai mục tiêu sai số < 0,000001 giờ; 400.000 casts, rate có Gen quan sát 49,811% / 7,9755% so lý thuyết 49,7286% / 7,92775%; tối đa một Gen. Browser: chuyển preset, stamp kết quả, chặn giữa cast, mobile 390px và export JSON.
