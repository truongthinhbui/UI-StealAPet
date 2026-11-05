# Gen balance v4 — tất cả độ hiếm có thể rơi

> Rarity weights vẫn được giữ ở v5. Luật 20/40 điểm và double Gen bên dưới đã được thay bằng xanh 10%, vàng 20%, tối đa 1 Gen; xem GEN-RULES-v5.md.

Yêu cầu sửa ngày 05/11/2026 thay thế giới hạn khóa Gen cao cấp của v3. Cả 21 MutaGen + WeatherGen đều có Enabled=1 và weight dương ở mọi Rebirth. Giữ nguyên pool cũ 35 cá và thứ tự Fish → GenCount → GenTypes.

## Tổng share của mỗi nhóm trong lần chọn Gen đầu tiên

| Nhóm | R1–R5 | R6–R10 | R11–R15 | R16–R20 | R21+ |
|---|---:|---:|---:|---:|---:|
| Phổ thông | 84,5% | 80,5% | 76,5% | 72,5% | 68,5% |
| Ít gặp | 15% | 18,5% | 22% | 25,5% | 28,5% |
| Nâng cao | 0,45% | 0,9% | 1,3% | 1,7% | 2,4% |
| Hiếm | 0,045% | 0,085% | 0,17% | 0,26% | 0,48% |
| Cao cấp | 0,0045% | 0,013% | 0,025% | 0,035% | 0,1% |
| Cực hiếm | 0,0005% | 0,002% | 0,005% | 0,005% | 0,02% |

Mỗi band có tổng weight 1.000.000. Share trong nhóm được chia theo độ khó tham chiếu từ item; đây là cân bằng Fishing mới, không phải xác suất apply item gốc. Từng loại ở nhóm hiếm hơn có weight nhỏ hơn từng loại ở nhóm phổ biến hơn trong cả năm band.

- Full đỏ vẫn có cá và không Gen; xanh +20, vàng +40; 120 điểm vẫn bảo đảm một Gen và 20% thêm Gen thứ hai.
- Vàng/Rebirth không bảo đảm Gen hiếm. Rebirth chỉ cải thiện phân bố loại Gen.
- Gen thứ hai khác loại, chuẩn hóa sau khi bỏ Gen đã chọn; vì vậy share lần hai khác bảng lần đầu.
- Nhóm cực hiếm ở R1: Galaxy weight=3 (0,0003%), Aurora weight=2 (0,0002%). R21+: 120 (0,012%) và 80 (0,008%).
- Một run 1.000 lượt có thể không xuất hiện Gen cực hiếm dù weight dương. Không dùng số đếm 0 trong mẫu để kết luận xác suất bằng 0.
- Bảng Excel hiển thị tỉ lệ đến bốn chữ số thập phân để không làm tròn Gen cực hiếm thành 0,00%.
- Giá/chance dùng item Galaxy/Aurora và công thức effect stacking còn thiếu trong nguồn; đó là metadata ứng dụng item, không tự động khóa Fishing drop đã được cấu hình mới.

`assets/gen-config.js` và bảng `outputs/fishing-v3/Muta_Weather_Gen_Pool.xlsx` là bản đang dùng. Các config/GDD v2/v3 trước đó là snapshot lịch sử. Pending offer đã stamp không bị reroll khi đổi balance.
