# GDD Trụ khóa bảo vệ base — v2

Phiên bản 2.0 · 25/11/2026 · Steal a Pet

Bản này kế thừa toàn bộ `docs/BASE-LOCK-GDD-v1.md` và chỉ thay đổi phần phản hồi khi nạp khóa. Những mục không nhắc tới ở đây giữ nguyên như v1.

## 1 Thay đổi so với v1

| Hạng mục | v1 | v2 |
|---|---|---|
| Bảng nạp sau khi nạp thành công | Đóng bảng | **Giữ nguyên bảng**, người chơi nạp tiếp được ngay |
| Cập nhật thời gian còn lại | Nhảy thẳng sang giá trị mới | **Chạy số tăng dần** trong 0,9 giây |
| Nhãn `+N phút` | Không có | Đã thử rồi **bỏ**; chỉ giữ số chạy |
| Focus sau khi nạp | Về nút tương tác ngoài world | Ở lại nút nạp trong bảng (hoặc nút đóng nếu hết khóa) |

Lý do: người chơi thường nạp nhiều khóa liên tiếp. Đóng bảng sau mỗi lần nạp bắt họ mở lại ba lần cho ba khóa, và vì bảng biến mất ngay nên không thấy thời gian đã tăng bao nhiêu.

## 2 Vòng lặp nạp mới

1. Đến gần trụ, bấm `NẠP KHÓA` hoặc `NẠP THÊM`.
2. Chọn loại khóa 2, 5 hoặc 10 phút.
3. Bấm `NẠP 1 KHÓA`. Trừ một khóa, cộng thời gian.
4. **Bảng ở lại.** Dòng `Thời gian còn lại` chạy số từ giá trị cũ lên giá trị mới; đồng hồ trên trụ ngoài world chạy đồng bộ.
5. Lặp lại bước 2–4 bao nhiêu lần tùy ý, trộn loại khóa được.
6. Chỉ `ĐỂ SAU`, dấu X hoặc Esc mới đóng bảng.

Khi loại đang chọn hết vật phẩm, nút chuyển `HẾT KHÓA` và bị vô hiệu hóa; bảng vẫn mở để người chơi đổi sang loại khác.

Phương án 2 (Chọn thẻ nạp ngay) dùng cùng quy tắc: bấm thẻ là nạp ngay, bảng không đóng, số vẫn chạy.

## 3 Animation thời gian

| Tham số | Giá trị |
|---|---|
| Kiểu | Đếm tăng dần giá trị giây còn lại |
| Thời lượng | 900 ms |
| Easing | ease-out cubic, `1 − (1 − t)³` |
| Giá trị đầu | Giây còn lại **trước** khi nạp |
| Giá trị cuối | Giây còn lại **sau** khi nạp |
| Đối tượng | Đồng hồ trong bảng và đồng hồ trên trụ |
| Phóng to | 1,14× ở mốc 25%, về 1,04× ở 60%, về 1,0× khi kết thúc |
| Màu nhấn | `#1E8F44`, glow `0 0 14px rgba(60,200,110,.65)` |
| Nhịp cập nhật | `requestAnimationFrame` |
| Chặn thao tác | Không. Người chơi nạp tiếp được giữa chừng |

Quy tắc quan trọng:

- Animation **chỉ là hiển thị**. `expires_at` được cộng ngay lập tức, không chờ animation chạy xong.
- Nạp tiếp khi animation đang chạy thì animation hiện tại bị thay bằng animation mới, lấy giá trị đang hiển thị làm mốc đầu. Không cộng dồn hai hiệu ứng.
- Trong lúc chạy animation, vòng cập nhật định kỳ không ghi đè chữ số; khi kết thúc, đồng hồ trả về giá trị thực và tiếp tục đếm ngược.
- Cấp tượng và aura đổi theo **giây thực còn lại**, không theo con số đang chạy. Nạp khóa 10 phút từ base mở thì tượng lên vàng ngay, trong khi số vẫn đang chạy từ 00:00.
- Đóng bảng hoặc reset luồng hủy animation ngay.
- Hỗ trợ giảm chuyển động: áp giá trị cuối tức thì, không phóng to, không glow.

## 4 Tiêu chí nghiệm thu bổ sung

| Mã | Tình huống | Kết quả mong đợi |
|---|---|---|
| BL17 | Nạp khóa 2 phút từ base mở | Bảng vẫn mở; số chạy 00:00 → 02:00 trong ~0,9 s |
| BL18 | Nạp ba khóa liên tiếp không đóng bảng | Trừ đúng ba khóa, cộng đúng tổng thời gian |
| BL19 | Nạp tiếp khi animation chưa xong | Không mất thời gian, không chạy chồng hai hiệu ứng |
| BL20 | Đóng bảng giữa lúc animation chạy | Animation dừng, đồng hồ trụ hiện giá trị thực |
| BL21 | Nạp khóa cuối cùng của một loại | Bảng vẫn mở, nút thành `HẾT KHÓA`, đổi loại khác vẫn nạp được |
| BL22 | Nạp 10 phút từ base mở | Tượng lên vàng ngay dù số mới chạy tới 02:xx |
| BL23 | Bật chế độ giảm chuyển động | Số nhảy thẳng sang giá trị mới, không phóng to |
| BL24 | Đồng hồ trụ ngoài world | Chạy đồng bộ với đồng hồ trong bảng |

BL17–BL22 và BL24 đã kiểm tra trên prototype web. BL23 mới chỉ kiểm tra bằng CSS `prefers-reduced-motion`, chưa thử trên thiết bị thật.

## 5 Bàn giao

- GDD gốc: `docs/BASE-LOCK-GDD-v1.md` (vẫn hiệu lực cho mọi phần khác).
- Excel cấu hình v2: `outputs/base-lock-gdd-v2/Base_Lock_Config_v2.xlsx` (bản sao ở `docs/BASE-LOCK-CONFIG-SHEET-v2.xlsx`).
- JSON cấu hình v2: `outputs/base-lock-gdd-v2/base-lock-config.v2.json`.
- Prototype: tab **Khóa Base** trong `index.html`, code ở `assets/base-lock.js` và `assets/base-lock.css`.

Excel và JSON là bộ thiết kế bàn giao, chưa nối vào runtime. Sửa file không tự đổi hành vi prototype; khi tích hợp cần chọn một nguồn cấu hình chính.

Chưa chốt: âm thanh khi nạp, trần thời gian tích lũy, giá và nguồn nhận khóa, ánh xạ ID vật phẩm SAP. Các mục này giữ nguyên trạng thái "Chưa chốt" như v1.
