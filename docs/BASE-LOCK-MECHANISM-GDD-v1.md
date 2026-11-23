# GDD Cơ chế ổ khóa bảo vệ base

Phiên bản 1.0 · 23/11/2026

## 1 Tổng quan

Mỗi base có một trụ ổ khóa đặt bên phải miếng vàng. Người chơi đến gần trụ để mở giao diện và nạp vật phẩm khóa. Mỗi vật phẩm nạp thành công bổ sung thời gian bảo vệ base. Trong lúc đang được bảo vệ, người chơi vẫn có thể quay lại nạp thêm mà không cần chờ hết giờ.

Mục đích của cơ chế là cho người chơi chủ động dùng vật phẩm để bảo vệ pet trong base khi tham gia các hoạt động khác. Tài liệu này chỉ mô tả cơ chế gameplay và thao tác nạp.

## 2 Thành phần

### Trụ ổ khóa

- Là vật dụng cố định trong world, thuộc base.
- Đặt sát bên phải miếng vàng; không di chuyển theo nhân vật.
- Cụm trạng thái `BASE ĐÃ KHÓA` và đồng hồ được hiển thị phía trên miếng vàng.
- Nút tương tác nằm trên UI màn hình, không nằm trên trụ trong world.

### Vật phẩm khóa

| Vật phẩm | Thời gian bổ sung mỗi lần nạp | Số lượng tiêu hao |
|---|---:|---:|
| Khóa 2 phút | 2 phút | 1 khóa |
| Khóa 5 phút | 5 phút | 1 khóa |
| Khóa 10 phút | 10 phút | 1 khóa |

Ba loại có số lượng riêng trong túi. Người chơi được nạp xen kẽ các loại; thời gian từ các vật phẩm cùng cộng vào một đồng hồ bảo vệ của base. Một lần thao tác chỉ nạp một khóa, không có bộ chọn số lượng.

## 3 Tiếp cận và tương tác

1. Người chơi đi đến gần trụ ổ khóa.
2. Trong phạm vi tương tác, UI màn hình hiện nút:
   - `NẠP KHÓA` nếu base chưa có thời gian bảo vệ.
   - `NẠP THÊM` nếu base đang được bảo vệ.
3. Bấm nút để mở bảng nạp.
4. Khi ra khỏi phạm vi tương tác, nút được ẩn. Thời gian đã nạp không bị mất và bảo vệ vẫn tiếp tục.

**Chưa chốt:** khoảng cách tương tác cụ thể. Đề xuất thử nghiệm: hiện nút ở khoảng cách không quá 3 m, ẩn khi vượt 3,5 m để tránh hiện/ẩn liên tục ở ranh giới. Quyền nạp đề xuất chỉ dành cho chủ base; cần chốt khi tích hợp với hệ thống sở hữu base.

## 4 Hai phương án thao tác nạp

Hai phương án dùng chung quy tắc vật phẩm và đồng hồ bảo vệ. Hiện giữ cả hai để lựa chọn trải nghiệm phù hợp.

### Phương án 1 Chọn rồi xác nhận

1. Mở bảng từ nút UI khi đứng gần trụ.
2. Chọn một trong ba loại khóa: 2, 5 hoặc 10 phút.
3. Bảng hiển thị thông tin loại đang chọn, số lượng trên thẻ và thời gian bảo vệ còn lại của base.
4. Bấm `NẠP 1 KHÓA` để thực hiện.
5. Nếu thành công, tiêu hao một khóa đúng loại, bổ sung thời gian và đóng bảng.

Chỉ chọn thẻ chưa tiêu hao vật phẩm. Bấm `ĐỂ SAU`, dấu X hoặc Esc thì đóng bảng, không thay đổi số khóa hoặc thời gian bảo vệ.

### Phương án 2 Chọn thẻ nạp ngay

1. Mở bảng từ nút UI khi đứng gần trụ.
2. Bảng hiển thị ba thẻ khóa với thời lượng và số lượng tương ứng.
3. Bấm một thẻ để nạp ngay một khóa của loại đó, không có bước xác nhận thứ hai.
4. Nếu thành công, tiêu hao một khóa đúng loại, bổ sung thời gian và đóng bảng.

Bấm `ĐÓNG`, dấu X hoặc Esc thì chỉ đóng bảng. Thẻ hết vật phẩm không thể bấm nạp.

## 5 Quy tắc cộng dồn thời gian

### Khi base chưa được bảo vệ

Nạp loại khóa nào thì đồng hồ bắt đầu từ thời lượng của loại đó. Ví dụ nạp khóa 5 phút thì base có 5 phút bảo vệ.

### Khi base đang được bảo vệ

Thời lượng của khóa mới cộng trực tiếp vào thời gian còn lại. Không ghi đè, không làm mới về riêng thời lượng của vật phẩm vừa nạp và không yêu cầu chờ khóa cũ kết thúc.

```text
Thời gian sau khi nạp = thời gian còn lại tại lúc nạp thành công
                       + thời lượng của một khóa vừa nạp
```

| Thời gian trước khi nạp | Vật phẩm nạp | Thời gian ngay sau khi nạp |
|---|---|---|
| 00:00 | Khóa 2 phút | 02:00 |
| 01:30 | Khóa 5 phút | 06:30 |
| 04:00 | Khóa 10 phút | 14:00 |
| 08:00 | Khóa 2 phút | 10:00 |

Người chơi được mở lại bảng và lặp lại thao tác nạp khi còn vật phẩm. Đổi loại khóa hoặc đổi phương án UI không làm thay đổi đồng hồ đang chạy.

Đồng hồ tiếp tục đếm khi bảng nạp đang mở. Kết quả cộng dồn dựa trên thời gian còn lại **lúc giao dịch thành công**, không lấy thời gian đã nhìn thấy khi vừa mở bảng.

**Chưa chốt:** giới hạn thời gian tích lũy cho game thật. Bản thử hiện không đặt trần và không có cooldown nạp. Không áp dụng lại quy tắc khóa một lần rồi phải chờ hết giờ mới được nạp tiếp.

## 6 Trạng thái của base

| Trạng thái | Điều kiện | Hành vi |
|---|---|---|
| Đang mở | Thời gian bảo vệ bằng 0 | Không áp dụng bảo vệ từ trụ; có thể nạp khóa để bắt đầu |
| Đang bảo vệ | Thời gian bảo vệ lớn hơn 0 | Hiện trạng thái và đồng hồ; vẫn cho mở bảng để nạp thêm |

Mở bảng nạp không phải một trạng thái bảo vệ riêng. Base vẫn mở hoặc đang bảo vệ theo đồng hồ thực tế.

Khi thời gian về 0:

- Bảo vệ từ trụ kết thúc ngay.
- Ẩn trạng thái `BASE ĐÃ KHÓA` và đồng hồ đang bảo vệ.
- Nút UI khi đứng gần trở về `NẠP KHÓA`.
- Không hoàn lại vật phẩm đã sử dụng.
- Nếu bảng nạp đang mở, giữ bảng mở để người chơi có thể nạp tiếp. Khóa mới bắt đầu bảo vệ từ thời điểm nạp thành công.

## 7 Tác dụng bảo vệ base

Ý định gameplay: trong thời gian khóa, ngăn người khác vào base để lấy pet. Khi hết giờ, các tương tác trộm trở lại theo luật thông thường của game.

Các quy tắc chi tiết dưới đây là **đề xuất cần chốt**, chưa được kiểm chứng bằng cơ chế hàng rào trong mockup:

| Tình huống | Đề xuất |
|---|---|
| Chủ base ra hoặc vào | Cho phép bình thường |
| Người lạ ở ngoài muốn vào | Chặn tại ranh giới base khi còn thời gian bảo vệ |
| Người lạ đang ở trong lúc khóa bắt đầu | Cảnh báo rồi đưa ra điểm an toàn trước cửa; cần chốt thời gian cảnh báo |
| Pet đã bị lấy trước khi khóa bắt đầu | Không tự thu hồi pet và không hủy lượt trộm đã hợp lệ |

Các loại khóa chỉ khác thời lượng bổ sung. Khóa 10 phút không tạo thêm cấp độ chống trộm hoặc sức bảo vệ khác khóa 2 phút.

## 8 Điều kiện tiêu hao và xử lý ngoại lệ

- Chỉ tiêu hao một khóa sau khi nạp thành công; không trừ khóa khi mở bảng, chọn thẻ ở phương án 1 hoặc đóng bảng.
- Hết một loại khóa chỉ vô hiệu hóa việc nạp loại đó; vẫn sử dụng được các loại khác còn vật phẩm.
- Nạp thất bại không tiêu hao vật phẩm và không bổ sung thời gian.
- Trong khi chờ xử lý, không cho gửi lại cùng một thao tác bằng bấm liên tục. Một giao dịch được xác nhận không được trừ vật phẩm hai lần.
- Hai lần nạp chủ động, riêng biệt vẫn là hai lần hợp lệ, mỗi lần dùng một khóa.
- Mở hoặc đóng UI không dừng đồng hồ và không đặt lại thời gian.

**Đề xuất triển khai:** game kiểm tra lại quyền sở hữu, khoảng cách và số lượng vật phẩm tại thời điểm nạp. Nếu người chơi đã đi quá xa trong khi mở bảng, giao dịch bị từ chối mà không mất khóa.

## 9 Những quyết định còn lại

| Hạng mục | Trạng thái |
|---|---|
| Chọn phương án 1 hay 2 làm UI phát hành | Chưa chốt; hiện giữ cả hai |
| Khoảng cách hiện nút và khoảng cách được phép nạp | Chưa chốt trong game thật |
| Quyền của đồng đội hoặc khách được mời | Chưa chốt |
| Người lạ đã ở trong base khi khóa bắt đầu | Cần thống nhất với luật trộm |
| Nguồn nhận, giá và số lượng khóa phát ban đầu | Chưa chốt |
| Trần thời gian bảo vệ tích lũy | Chưa chốt |
| Thời gian tiếp tục chạy hay tạm dừng khi thoát game | Chưa chốt |
| Giữ thời gian khi đổi server, rebirth hoặc đổi chủ base | Chưa chốt |

Số lượng ba khóa mỗi loại trong mockup chỉ là dữ liệu thử. Không coi đó là quà tặng, giá trị kinh tế hoặc số lượng cấp mặc định cho người chơi thật.

## 10 Tiêu chí nghiệm thu cơ chế

1. Đến gần trụ hiện nút UI; đi xa ẩn nút. Tượng vẫn cố định bên phải miếng vàng.
2. Mỗi loại khóa cộng đúng 120, 300 hoặc 600 giây và chỉ trừ một khóa đúng loại.
3. Còn 90 giây, nạp khóa 5 phút thì được 390 giây ngay tại thời điểm giao dịch.
4. Đang bảo vệ vẫn mở được bảng và nạp thêm ở cả hai phương án.
5. Chọn thẻ ở phương án 1 rồi hủy không tiêu hao; bấm thẻ ở phương án 2 thì nạp ngay.
6. Loại đã hết không nạp được, nhưng các loại khác còn vật phẩm vẫn hoạt động.
7. Thời gian tiếp tục trôi khi mở bảng; hết giờ không ép đóng bảng.
8. Hủy hoặc nạp thất bại không mất vật phẩm và không cộng thời gian.
9. Một thao tác nạp không bị xử lý hai lần do bấm lặp hoặc phản hồi mạng chậm.
10. Khi thời gian về 0, bảo vệ kết thúc; nạp mới sẽ bắt đầu từ thời điểm hiện tại.

Phần UI nạp và đồng hồ đã có mockup để đối chiếu. Việc chặn người lạ, kiểm tra khoảng cách thật và hành vi khi mất kết nối cần nghiệm thu riêng khi tích hợp gameplay.
