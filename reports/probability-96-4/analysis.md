# Pool Gen 96/4 — xác suất kết hợp với fishing 1.0.1

Fossilized và Prismatic: mỗi loại 2% khi đã có Gen. 9 Gen còn lại: 96%. 1% giải phóng chuyển đều cho 4 EPIC. Không đổi pool pet hoặc cơ hội có Gen.

P(pet + Gen X) = P(pet ở rebirth hiện tại) × P(có Gen từ 3 tap) × Weight(X)/Tổng Weight.

Mặc định preset online; full vàng 49.7286% có Gen, không phải 30%. Full xanh 24.8643%; full đỏ 0%. Tối đa 1 Gen.

Giả định 40 phút online/ngày, 10 giây/lượt, 11 phút câu trong chu kỳ 69 phút. Model trung bình: 38.2609 lượt/ngày. Mô phỏng 50.000 người/mục tiêu: giờ đăng nhập cố định mỗi ngày, pha bắt đầu ngẫu nhiên, chỉ tính lượt đủ 10 giây trong event. Đủ tiền mua, chưa tính di chuyển.

| Mục tiêu R25+ | Kỳ vọng trung bình (ngày) | Mô phỏng ngày TB | Trung vị | P90 | Có trong 7 ngày |
|---|---:|---:|---:|---:|---:|
| Apex bất kỳ | 3.36 | 3.89 | 3 | 8 | 87.48% |
| Apex + Gen bất kỳ | 6.75 | 7.28 | 5 | 16 | 64.56% |
| Apex + một trong hai LEGENDARY | 168.75 | 169.42 | 118 | 391 | 4.06% |
| Apex + Fossilized | 337.50 | 340.81 | 238 | 779 | 2.01% |
| Apex + Prismatic | 337.50 | 336.20 | 234 | 773 | 2.08% |

## Nhận xét cân bằng
Apex + Gen bất kỳ không đổi khi chỉ phân bổ lại loại Gen. Mỗi Fossilized/Prismatic giảm từ 2,5% xuống 2% nên thời gian tìm đúng loại tăng 25%.
Các Gen cùng rarity có tỷ lệ bằng nhau. Rebirth tăng chuyển tỷ trọng COMMON sang RARE/EPIC; LEGENDARY giữ 2% mỗi loại. Vì vậy rebirth hiện chưa làm tăng tỷ lệ Fossilized/Prismatic.
Pet và Gen roll độc lập: không có tăng/giảm Gen riêng cho pet Apex. Nếu muốn bảo đảm thời gian sở hữu cần thêm mục tiêu/pity, không thể suy từ kỳ vọng thành cam kết.
CSV chứa đủ 5 mốc Rebirth × 6 rarity pet × 11 Gen. Dữ liệu là cơ hội gặp/mua được pet, không bảo đảm sở hữu nếu không đủ tiền.