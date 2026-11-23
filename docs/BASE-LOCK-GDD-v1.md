# GDD Trụ khóa bảo vệ base

Phiên bản 1.0 · 23/11/2026 · Steal a Pet

Trụ khóa là vật dụng cố định trong base. Chủ base đến gần trụ, bấm nút trên UI và nạp khóa để tích lũy thời gian bảo vệ pet. Có ba vật phẩm 2, 5 và 10 phút. Khi đang bảo vệ, người chơi vẫn mở bảng và nạp thêm được. Màu tượng và aura thể hiện thời gian bảo vệ còn lại.

Tài liệu dành cho thiết kế, lập trình, UI/VFX và QA. Phần **Đã chốt** mô tả hướng đã được chọn và mockup hiện tại. Phần **Đề xuất triển khai** cần được xác nhận trước khi đưa vào game. Hai phương án UI vẫn được giữ để lựa chọn; chưa chốt một phương án duy nhất cho bản phát hành.

## 1 Mục tiêu và phạm vi

- Người chơi chủ động dùng vật phẩm để bảo vệ pet trong base.
- Thao tác nạp ngắn, có thể lặp lại khi đang khóa và không yêu cầu chờ hết giờ.
- Thời gian bảo vệ càng dài, tượng càng đẹp và aura càng mạnh.
- Một giao dịch nạp tiêu hao đúng một vật phẩm. Không có bộ chọn số lượng.

Phạm vi bản thiết kế gồm trụ, vật phẩm, thời gian bảo vệ, hai phương án UI và VFX. Giá bán, nguồn nhận khóa, giới hạn thời gian tích lũy và bảo vệ ngoại tuyến chưa được chốt.

## 2 Trụ trong world

**Đã chốt:** dùng tượng ổ khóa vàng trên bệ tròn thấp, mặt trước có huy hiệu khiên. Tượng đặt sát bên phải miếng vàng của base. Chữ `BASE ĐÃ KHÓA`, đồng hồ và cấp bảo vệ đặt phía trên miếng vàng, tách khỏi tượng. Nút nạp là UI cố định trên màn hình, không gắn như một nút trong world.

| Trạng thái | Tượng và world | Nút UI khi ở gần |
|---|---|---|
| Không có thời gian | Màu gốc, không có aura; ẩn cụm đang khóa | NẠP KHÓA |
| Đang bảo vệ | Tượng đổi màu, có aura; hiện đồng hồ trên miếng vàng | NẠP THÊM |
| Đang mở bảng | Tượng giữ trạng thái thực tế; đồng hồ tiếp tục chạy | Ẩn nút tương tác dưới bảng |
| Đứng xa | Tượng và bảo vệ không thay đổi | Ẩn nút nạp |

Khoảng cách cụ thể chưa được đo trong game. **Đề xuất:** hiện nút khi cách điểm tương tác không quá 3 m, ẩn khi vượt 3,5 m để tránh nhấp nháy ở ranh giới. Khi xác nhận nạp, server kiểm tra lại khoảng cách tối đa 3,5 m và quyền sở hữu base.

## 3 Vật phẩm khóa

| ID thiết kế | Tên hiển thị | Thời gian cộng | Màu icon |
|---|---|---:|---|
| BASE_LOCK_2M | Khóa bảo vệ 2 phút | 120 giây | Lam |
| BASE_LOCK_5M | Khóa bảo vệ 5 phút | 300 giây | Tím |
| BASE_LOCK_10M | Khóa bảo vệ 10 phút | 600 giây | Vàng |

Các ID trên là khóa định danh cho cấu hình thiết kế, chưa phải ID vật phẩm đã được đăng ký trong SAP_GDD. Cần ánh xạ với bảng item của dự án khi tích hợp.

Mỗi loại có số lượng riêng. Nạp loại nào thì trừ một đơn vị của đúng loại đó. Người chơi có thể nạp trộn các loại. Bản thử có sẵn ba vật phẩm mỗi loại để so sánh UI; đây không phải chính sách phát vật phẩm cho người chơi thật.

Giá, tiền tệ, nguồn nhận, giới hạn stack và số lượng tặng ban đầu để trống trong config. Không dùng giá 0 để biểu diễn dữ liệu chưa chốt.

## 4 Quy tắc thời gian đã chốt

Gọi `t` là thời điểm hiện tại, `E` là thời điểm kết thúc đang lưu và `D` là thời lượng của khóa được nạp. Sau một lần nạp thành công:

```text
E_mới = max(E, t) + D
Thời gian còn lại = max(0, E_mới − t)
Số vật phẩm loại đã chọn = số hiện tại − 1
```

Không đặt lại thời gian về thời lượng riêng của khóa vừa nạp. Mở bảng, đổi loại khóa, hủy bảng hay thay phương án UI không làm mất thời gian đang có. Không có cooldown hoặc giới hạn tích lũy trong mockup hiện tại. Giới hạn cho game thật cần quyết định riêng, không tự áp dụng lại quy tắc phải chờ hết khóa trước khi nạp.

| Ví dụ | Kết quả ngay khi nạp |
|---|---|
| Base đang mở, nạp khóa 2 phút | 02:00 |
| Còn 01:30, nạp khóa 5 phút | 06:30 |
| Còn 04:00, nạp khóa 10 phút | 14:00 |
| Còn 00:45, nạp khóa 2 phút | 02:45 |
| Đã hết giờ, nạp khóa 5 phút | 05:00 |

Đồng hồ dùng dạng `MM:SS`, có thể vượt 59 phút, ví dụ `65:00`. Giây hiển thị được làm tròn lên. Khi thời gian thực còn lại bằng 0, base trở về trạng thái mở ngay, không giữ aura thêm một giây.

## 5 Hai phương án nạp đã giữ

### Phương án 1 Chọn rồi xác nhận

1. Đến gần trụ và bấm `NẠP KHÓA` hoặc `NẠP THÊM` trên UI.
2. Bảng hiện ba loại khóa 2, 5 và 10 phút, số lượng ở từng thẻ, thông tin loại đang chọn và thời gian bảo vệ hiện tại.
3. Bấm thẻ chỉ đổi lựa chọn, chưa trừ vật phẩm.
4. Bấm `NẠP 1 KHÓA` để xác nhận. Thành công thì bảng đóng, trừ một khóa, cộng thời gian và cập nhật tượng/aura.
5. `ĐỂ SAU`, dấu X hoặc Esc đóng bảng mà không tiêu hao.

Nếu loại được chọn đã hết, nút xác nhận hiện `HẾT KHÓA` và bị vô hiệu hóa; người chơi vẫn chọn được loại khác còn vật phẩm.

### Phương án 2 Chọn thẻ nạp ngay

1. Đến gần trụ và mở bảng bằng nút UI.
2. Bảng hiện ba thẻ lớn, mỗi thẻ có icon màu, thời lượng, số lượng và nhãn `Nạp ngay`.
3. Bấm một thẻ là gửi yêu cầu nạp một khóa của loại đó, không có bước xác nhận thứ hai.
4. Thành công thì bảng đóng, trừ vật phẩm và cộng thời gian như phương án 1.
5. Thẻ hết vật phẩm bị vô hiệu hóa. `ĐÓNG`, X hoặc Esc chỉ đóng bảng.

Hai phương án là biến thể trình bày của cùng một cơ chế, dùng chung số lượng và thời gian. Thanh chọn phương án và các nút thử tình huống chỉ phục vụ prototype, không phải UI bắt buộc trong game.

### Nội dung UI đã loại bỏ

Không thêm lại dòng `Trong túi` ở phần thông tin vật phẩm, bộ chọn `Số lượng nạp`, dòng `Sau khi nạp`, hướng dẫn `Bấm để tương tác` hoặc ô tồn kho ở góc phải màn hình. Số lượng vẫn được thể hiện trên icon/thẻ. Mockup hiện vẫn có chú thích nhỏ dưới nút về số khóa của loại đang chọn còn lại sau giao dịch.

## 6 Màu tượng và aura đã chốt

Màu vật phẩm thể hiện loại khóa. Màu tượng thể hiện **tổng thời gian còn lại**, không bám cố định vào khóa cuối cùng được nạp.

| Thời gian còn lại sau làm tròn lên | Cấp tượng | Hiệu ứng |
|---|---|---|
| 0 giây | Mặc định | Tắt aura và hạt sáng |
| 1 đến 120 giây | Lam | Một vòng sáng, hai hạt sáng nhẹ |
| 121 đến 300 giây | Tím | Hai vòng sáng, năm hạt sáng |
| Từ 301 giây | Vàng kim | Hai vòng đậm, tám hạt sáng và tia sáng |

Đúng `02:00` là lam; đúng `05:00` là tím; `05:01` là vàng. Nạp một khóa 10 phút lên base mở cho cấp vàng. Khi còn 5 phút, tượng về tím; khi còn 2 phút, tượng về lam. Nạp trộn khóa có thể nâng cấp tượng: còn 2 phút, thêm khóa 5 phút thì còn 7 phút và lên vàng.

VFX không thay đổi sức bảo vệ. Cả ba cấp chỉ khác thời gian còn lại và hình thức. Tượng giữ silhouette, kích thước và vị trí. Hỗ trợ giảm chuyển động: giữ màu và vòng sáng tĩnh, tắt chuyển động hạt/rung để dễ nhìn.

## 7 Tác dụng bảo vệ và các đề xuất cần chốt

Ý định gameplay là ngăn người khác vào lấy pet của base trong thời gian bảo vệ. Chi tiết hàng rào và tương tác với lượt trộm hiện có chưa được thực thi trong mockup.

| Hạng mục | Đề xuất triển khai | Trạng thái |
|---|---|---|
| Quyền nạp | Chỉ chủ sở hữu base được nạp | Đề xuất |
| Chủ base ra vào | Chủ base đi qua bình thường | Đề xuất |
| Người lạ vào base | Chặn tại ranh giới khi đang bảo vệ | Đề xuất |
| Người lạ đã ở bên trong | Cảnh báo 3 giây rồi đưa ra điểm an toàn trước cổng | Cần chốt theo luật trộm |
| Pet bị lấy trước khi nạp | Không tự thu hồi, không hủy lượt trộm đã hợp lệ | Cần chốt theo luật trộm |
| Hết giờ | Bỏ chặn ngay theo thời gian server | Đề xuất triển khai |
| Đóng game hoặc mất kết nối | Lưu thời điểm kết thúc và tiếp tục trôi theo thời gian thực | Cần chốt |
| Đổi server | Mang theo thời điểm kết thúc nếu vẫn cùng base và cùng chủ | Cần chốt |
| Rebirth hoặc đổi chủ | Chưa có quy tắc kế thừa thời gian | Cần chốt |
| Trần thời gian tích lũy | Mockup không có trần; chưa chốt trần cho game thật | Cần chốt cân bằng |
| Nguồn nhận và giá | Chưa chốt; không mặc định bán hoặc phát miễn phí | Cần chốt kinh tế |

Nếu luật trộm hiện có mâu thuẫn với đề xuất đưa người lạ ra ngoài, luật trộm phải được thiết kế đồng bộ trước khi triển khai. Không coi những đề xuất trong mục này là thay đổi đã được xác nhận.

## 8 Đề xuất xử lý giao dịch và lưu dữ liệu

Server sở hữu thời điểm kết thúc và số vật phẩm. Client gửi `request_id`, `base_id` và `item_id`, không tự gửi thời lượng được cộng. Một yêu cầu nạp tiêu hao số lượng cố định bằng 1.

Server kiểm tra item nằm trong ba ID cho phép, quyền sở hữu, khoảng cách tương tác và số lượng hiện có. Giao dịch cập nhật số lượng và thời điểm kết thúc phải nguyên tử. Với cùng `request_id`, trả lại kết quả đã xử lý thay vì trừ lần thứ hai. Hai lần nạp chủ động có `request_id` khác nhau vẫn là hai giao dịch hợp lệ.

Trong khi chờ phản hồi, khóa nút/thẻ nạp để tránh gửi trùng. Chỉ trừ vật phẩm và xác nhận thời gian sau khi server báo thành công. Lỗi hoặc timeout không tự báo thành công; retry dùng lại cùng `request_id`. Bản thử hiện chỉ có trạng thái client, chưa chứng minh hành vi mạng hoặc lưu dữ liệu.

```text
BaseLockState
  base_id
  owner_player_id
  expires_at_unix_ms
  revision

Request
  request_id
  base_id
  item_id

Response
  request_id
  result_code
  server_now_unix_ms
  expires_at_unix_ms
  item_id
  remaining_item_count
  revision
```

Khi server xác nhận hết giờ, hoặc khi đồng hồ đồng bộ đạt thời điểm kết thúc, client bỏ trạng thái bảo vệ. Hết giờ trong lúc bảng nạp đang mở không đóng bảng: người chơi vẫn có thể nạp lại.

## 9 Tiêu chí nghiệm thu

| Mã | Tình huống | Kết quả mong đợi |
|---|---|---|
| BL01 | Đến gần hoặc đi xa trụ | Nút UI hiện/ẩn đúng, tượng ở world không di chuyển |
| BL02 | Nạp từng loại từ base mở | Lần lượt cộng 120, 300 hoặc 600 giây |
| BL03 | Nạp 2 phút rồi 5 rồi 10 | Còn xấp xỉ 17 phút trừ thời gian đã trôi |
| BL04 | Nạp khi còn 90 giây bằng khóa 5 phút | Còn 390 giây; không mất 90 giây cũ |
| BL05 | Chọn thẻ ở phương án 1 rồi đóng | Không trừ khóa, không cộng thời gian |
| BL06 | Bấm thẻ ở phương án 2 | Nạp đúng một khóa, bảng đóng khi thành công |
| BL07 | Một loại hết vật phẩm | Không nạp được loại đó, loại khác vẫn dùng được |
| BL08 | Mở bảng trong khi bảo vệ | Đồng hồ tiếp tục trôi, vẫn nạp thêm được |
| BL09 | Hết giờ khi bảng đang mở | Bảng vẫn mở, đồng hồ về 00:00, nạp mới bắt đầu từ hiện tại |
| BL10 | Còn 120 / 121 / 300 / 301 giây | Lam / tím / tím / vàng, không hở hoặc chồng khoảng |
| BL11 | Còn 0 giây | Tắt aura, ẩn đang khóa, UI trở lại NẠP KHÓA |
| BL12 | Hủy hoặc lỗi giao dịch | Không tiêu hao và không cộng thời gian |
| BL13 | Gửi lại cùng request_id | Chỉ tiêu hao một lần theo đề xuất server |
| BL14 | Đứng ngoài phạm vi hoặc không phải chủ | Server từ chối theo đề xuất quyền/range |
| BL15 | Tắt ứng dụng rồi mở lại | Chỉ áp dụng kết quả theo chính sách ngoại tuyến đã chốt |
| BL16 | Màn hình 320, 390, 768 và 1440 px | Bảng, chữ và nút không bị cắt; cả hai phương án đều thao tác được |

Các kiểm tra nạp, cộng dồn, tồn kho riêng, ranh giới aura, hai phương án và bố cục đã chạy trên prototype. Hàng rào thật, khoảng cách thật, quyền chủ base, mạng và lưu dữ liệu là hạng mục tích hợp chưa nghiệm thu.

## 10 Cấu hình và tài nguyên bàn giao

- Excel cấu hình: `outputs/base-lock-gdd-v1/Base_Lock_Config_v1.xlsx`.
- JSON cấu hình thiết kế: `outputs/base-lock-gdd-v1/base-lock-config.v1.json`.
- `core` trong JSON là cơ chế đã chốt; `production_proposals` chứa đề xuất riêng; `unresolved` chứa quyết định chưa có giá trị cuối cùng.
- Số lượng ba khóa mỗi loại chỉ nằm ở `prototype`, không chuyển thành quà tặng mặc định trong production.
- Model: `outputs/base-lock/blender/Lockshield.blend`, 1.316 tam giác, 686 đỉnh, 1 mesh/material, texture AllPets.png. Model tĩnh, chưa rig.
- Hình tượng trong web: `assets/base-lock/lockshield-prop.png`, `lockshield-blue.png`, `lockshield-purple.png`, `lockshield-gold.png`.
- Giao diện tham chiếu: tab Khóa Base trong `index.html`, hai phương án 1 và 2.

Config này là bộ thiết kế bàn giao, chưa được nối vào runtime của mockup. Chỉnh Excel/JSON không tự thay đổi game; khi tích hợp cần chọn một nguồn cấu hình làm nguồn chính và sinh các định dạng khác từ nguồn đó.
