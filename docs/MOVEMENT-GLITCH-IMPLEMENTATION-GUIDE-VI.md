# Guide bàn giao — Di chuyển 3D và minigame Glitch

**Ngày:** 11/11/2026 · **Phiên bản:** 1.0 · **Nguồn đối chiếu:** code prototype trong repository này.

Tài liệu dành cho người triển khai gameplay, animation, VFX và QA. Mục tiêu là tái hiện hành vi đã thống nhất, có thông số và điều kiện nghiệm thu rõ ràng. Cảm giác mong muốn: phản hồi nhanh, nhân vật đổi hướng mượt, camera góc nhìn thứ ba; Free Fire là tham chiếu cảm giác, không phải cam kết sao chép controller của game đó.

Các giá trị thưởng hiện là config thử nghiệm. Tài liệu phân biệt hành vi đang có với các việc phải bổ sung khi đưa vào game thật. Không tự chuyển phần thưởng thử thành vật phẩm trong tài khoản thật.

## 1. Trải nghiệm cần làm

Người chơi xuất phát trên sàn, ngoài khu minigame. Phía trước có một điểm glitch tím nhỏ. Người chơi tự đi tới; khi đủ gần, điểm glitch bùng lửa và mở rộng thành sân tròn. Sau khi sân mở xong, vòng xanh xuất hiện bên trong. Chạm vòng xanh trước hạn là nhận thưởng ngay, tăng streak và xuất hiện vòng xanh tiếp theo. Càng giữ streak lâu, vòng càng nhỏ và thời gian càng ngắn. Bước ra ngoài sân là kết thúc lượt, không chết. Hết giờ mà chưa chạm vòng xanh là thua, phát animation Death. Không có cơ chế về nhà.

Luồng chính:

```text
Ngoài sân → Tiếp cận điểm glitch → Mở sân 0,6 giây
          → Chạm vòng → Nhận thưởng → Vòng tiếp theo → ...
          → Ra ngoài sân: kết thúc lượt
          → Hết giờ: thua → Chơi lại → Ngoài sân
```

Trong bản bàn giao này, mechanic chính là **Vòng tròn Glitch trong tab 3D**. Mục Nhảy dây đang khóa; tab Movement Mini Game đã được bỏ. Chế độ Di chuyển tự do vẫn tồn tại để thử animation.

## 2. Config chuẩn và đơn vị

Đơn vị khoảng cách là **world unit của prototype**, được dựng để nhân vật cao 1,72 đơn vị. Khi port sang engine khác, chọn một tỷ lệ thống nhất rồi nhân tất cả khoảng cách và tốc độ theo cùng tỷ lệ; không lấy trực tiếp giá trị này làm stud hoặc đơn vị engine khác mà chưa quy đổi.

### Controller trong chế độ Glitch

| Tham số | Giá trị | Ý nghĩa |
|---|---:|---|
| Chiều cao Kelly | 1,72 | Chuẩn tỷ lệ model |
| Tốc độ đi | 2,8 unit/giây | Bắt đầu và dừng ngay theo input |
| Dead zone input | 0,04 | Độ dài vector input nhỏ hơn hoặc bằng mức này coi như không di chuyển |
| Đổi hướng model | `1 − exp(−30 × dt)` | Blend góc hiển thị theo cung ngắn nhất |
| Quãng lao khi nhảy | 0,45 unit | Cộng thêm vào di chuyển thường |
| Thời gian lao | 0,22 giây | Mạnh lúc đầu, giảm dần |
| Thời lượng Jump | Khoảng 0,8833 giây | Clip đã bỏ phần lấy đà |
| Phạm vi sàn thử | X/Z trong khoảng −17 đến +17 | Giới hạn map thử, không phải mép sân minigame |

**Khác biệt có chủ ý của prototype:** chế độ Di chuyển tự do dùng tốc độ 1,55 unit/giây và xoay model tức thì; Glitch dùng 2,8 unit/giây và blend góc. Không nhầm hai bộ thông số khi nghiệm thu minigame.

### Camera

| Tham số | Giá trị |
|---|---:|
| Góc nhìn | Thứ ba, orbit quanh nhân vật |
| FOV dọc | 48° |
| Điểm nhìn | Root nhân vật + cao 1,10 unit |
| Khoảng cách mặc định | 4,2 unit |
| Zoom | 2,2–7 unit |
| Pitch mặc định | 0,24 rad, khoảng 13,8° |
| Giới hạn pitch | −0,08 đến 0,8 rad, khoảng −4,6° đến 45,8° |
| Độ nhạy ngang | 0,004 rad/pixel |
| Độ nhạy dọc | 0,003 rad/pixel |
| Viewport dọc hẹp | Nếu width/height < 0,8, cộng 0,7 unit vào khoảng cách camera |

### Sân minigame

| Tham số | Giá trị |
|---|---:|
| Tâm sân | (0, 0, 0) trong hệ tọa độ sân |
| Vị trí xuất phát | (0, 0, 5), cách tâm 5 unit |
| Hướng nhìn khi khởi tạo/reset toàn bộ | Hướng −Z, về phía tâm sân |
| Bán kính hình điểm glitch | 0,65 unit |
| Khoảng cách kích hoạt | ≤ 0,70 unit từ root tới tâm trên mặt phẳng XZ |
| Bán kính sân | 3 unit |
| Thời gian mở sân | 0,60 giây |
| Bán kính vòng xanh ban đầu | 0,85 unit |
| Thời gian vòng đầu | 3 giây |

## 3. Điều khiển và cảm giác di chuyển

### PC

- W/A/S/D hoặc phím mũi tên: đi theo hướng camera.
- Space: nhảy. Chỉ nhận lần bấm mới; giữ Space không tự nhảy liên tiếp.
- Nhấp trái hoặc phải vào canvas: focus sân và yêu cầu khóa con trỏ chuột.
- Khi khóa chuột: xoay camera bằng độ dịch chuyển chuột, không cần giữ nút chuột.
- Esc: thả con trỏ, xóa input đang giữ để tránh nhân vật tiếp tục chạy.
- Cuộn chuột: zoom trong giới hạn cho phép.
- Nếu trình duyệt không cho khóa chuột: vẫn kéo chuột để xoay, có dòng thông báo phù hợp.
- R là phím reset phục vụ prototype. Khi đưa vào game thật, không dùng phím debug này làm thao tác gameplay mặc định.

### Mobile

- Joystick bên trái để đi; vuốt canvas bằng ngón khác để xoay camera.
- Nút Nhảy bên phải; nhấn không được làm mất input joystick đang giữ.
- Tách pointer ID cho joystick và camera. Nhả/cancel ngón nào chỉ xóa dữ liệu ngón đó.
- Không yêu cầu pointer lock trên thiết bị cảm ứng.

### Quy tắc chuyển input thành chuyển động

1. Đọc input thành vector 2D `(x, z)`. Quy ước W = z âm, D = x dương.
2. Nếu độ dài ≤ 0,04: không có vận tốc đi.
3. Nếu vượt dead zone: normalize vector về độ dài 1. Prototype hiện là **tốc độ cố định**, kéo joystick nhẹ qua dead zone vẫn đi đủ tốc độ; chưa có đi chậm analog.
4. Xoay vector theo yaw camera:

```text
worldX = x × cos(yaw) + z × sin(yaw)
worldZ = −x × sin(yaw) + z × cos(yaw)
position += (worldX, 0, worldZ) × 2,8 × dt
```

5. Hướng di chuyển đổi ngay khi input đổi. Chỉ hướng hiển thị của model được blend:

```text
targetAngle = atan2(worldX, worldZ)
angleDelta = atan2(sin(targetAngle − currentAngle), cos(targetAngle − currentAngle))
currentAngle += angleDelta × (1 − exp(−30 × dt))
```

6. Không normalize tốc độ riêng trên từng trục. W+D phải cùng tốc độ tổng với W.
7. Thả input thì phần di chuyển thường dừng ngay. Ngoại lệ: phần lao của cú nhảy đã bắt đầu vẫn chạy hết quãng còn lại.
8. Không đợi animation bắt đầu hoặc phát hết mới di chuyển. Đường đi gameplay và pose animation phải độc lập.

## 4. Camera thứ ba và khóa con trỏ

Trong Glitch, camera theo root gameplay, không theo đầu/hông đang chuyển động trong clip Jump hoặc Death. Đây là điều kiện quan trọng để camera không nảy theo animation.

```text
target = (player.x, 1,10, player.z)
back = zoomDistance + (aspectRatio < 0,8 ? 0,7 : 0)
orbit = (sin(yaw)cos(pitch), sin(pitch), cos(yaw)cos(pitch))
cameraPosition = target + orbit × back
camera nhìn về target
```

- Camera cập nhật trong cùng frame sau chuyển động, không thêm độ trễ follow vào bản chuẩn.
- Xoay camera không tự quay thân nhân vật khi nhân vật đang đứng yên; hướng thân đổi khi có hướng đi.
- Pointer lock chỉ được yêu cầu sau thao tác nhấp của người chơi. Không tự khóa lại ngay sau Esc.
- Mất focus, chuyển tab hoặc ẩn trang: xóa input, thả con trỏ, dừng vòng render khi không hiển thị.
- Khôi phục focus không được tái sử dụng input cũ hoặc cộng một delta thời gian rất lớn.
- Khi triển khai trên map có vật cản: bổ sung xử lý camera bị tường che; prototype sàn trống chưa có camera collision.

## 5. Nhảy và lao về trước

### Điều kiện

Chỉ được nhảy nếu nhân vật còn sống, đã tải xong, chưa ở giữa một cú nhảy và state cho phép di chuyển. Không double jump. Trong Glitch có thể nhảy ở `ready`, `expanding`, `dodge`, `ended`; không nhảy ở `failed`.

### Trình tự

1. Nhận Space hoặc nút Nhảy.
2. Phát Jump ngay, blend vào trong 0,06 giây.
3. Chốt hướng lao theo **góc model tại thời điểm bấm nhảy**, không theo camera và không thay đổi hướng lao giữa cú nhảy.
4. Lao tổng 0,45 unit trong 0,22 giây, trong khi input đi bình thường vẫn hoạt động.
5. Kết thúc thời lượng Jump thì phát landing VFX một lần và chuyển về Walking nếu còn input, nếu không thì Idle.
6. Chết/reset phải hủy phần lao còn lại.

Công thức lao không phụ thuộc frame rate:

```text
r = thời gian lao còn lại; T = 0,22; D = 0,45
before = r / T
r = max(0, r − dt)
after = r / T
travelThisFrame = D × (before² − after²)
position += forwardAtTakeoff × travelThisFrame
```

**Quy tắc xét vòng hiện tại:** chỉ kiểm tra vị trí root trên mặt phẳng XZ. Đang nhảy vẫn nhận vòng nếu hình chiếu root vào vùng xanh; nhảy ra khỏi mép sân vẫn kết thúc lượt. Không dùng chân hoặc hình ảnh mesh đang bay để tính thưởng.

**Giới hạn prototype:** độ cao nhảy đang lấy từ chuyển động dọc trong clip FBX; root gameplay không có ballistic jump, gravity hay va chạm vật lý theo chiều cao. Nếu triển khai game thật có địa hình/va chạm, phải làm controller nhảy vật lý riêng và đồng bộ pose; không coi clip animation là mô phỏng vật lý hoàn chỉnh.

## 6. Animation

Dùng một rig chung và bốn clip: Idle, Walking, Jump, Flying Back Death. Scale nhân vật về cao 1,72 unit.

| Chuyển trạng thái | Blend |
|---|---:|
| Idle ↔ Walking | 0,10 giây |
| Sang Jump | 0,06 giây |
| Jump → Idle/Walking | 0,12 giây |
| Sang Death | 0,10 giây |

- Jump dùng đoạn frame 36–90 của animation nguồn, quy chiếu 60 FPS; đã bỏ khoảng 0,6 giây crouch/lấy đà. Clip thực tế khoảng 0,8833 giây.
- Jump và Death phát một lần. Death giữ tư thế cuối đến khi reset.
- Ưu tiên Death > Jump > Walking/Idle. Di chuyển trong lúc nhảy không được cắt Jump thành Walking.
- Khi blend bị ngắt bởi state mới, blend từ trọng số pose đang có. Không snap về pose đầu của clip trước đó.
- Loại bỏ root motion X/Z của Idle/Walking/Jump để tránh vừa controller đẩy, vừa animation tự kéo nhân vật. Giữ chuyển động dọc Jump. Death giữ phần knockback của mesh trong clip.
- Action có weight về 0 phải dừng sau blend. Tổng trọng số pose phải ổn định, không để clip cũ tiếp tục ảnh hưởng.

## 7. State machine minigame

| State | Di chuyển/nhảy | Điều kiện chuyển | Kết quả |
|---|---|---|---|
| `ready` | Có | Root cách tâm ≤ 0,70 | Sang `expanding`, phát mở sân |
| `expanding` | Có | Qua 0,60 giây, còn trong sân | Sinh vòng đầu, sang `dodge` |
| `expanding` | Có | Ra ngoài bán kính 3 | Sang `ended` |
| `dodge` | Có | Ra ngoài bán kính 3 | Sang `ended`, không Death |
| `dodge` | Có | Chạm vòng xanh đúng hạn | Cộng thưởng, tăng streak, sinh vòng tiếp theo |
| `dodge` | Có | Hết hạn, chưa chạm | Sang `failed`, phát Death |
| `ended` | Có | Bấm Chơi lại | Reset lượt và xuất phát lại ngoài sân |
| `failed` | Không | Bấm Chơi lại | Reset lượt, bỏ trạng thái chết |

`ended` không tự chạy lại minigame dù người chơi đi vào tâm. Người chơi cần bấm Chơi lại để chuẩn bị lượt mới.

### Thứ tự xét trong một frame của `dodge`

1. Kiểm tra ra ngoài sân trước: `distanceXZ(player, center) > 3` → kết thúc ngay, không trả thưởng.
2. Cộng thời gian của vòng.
3. Nếu thời gian **vượt** deadline → thua, dù cùng frame này root đã ở trong vòng xanh.
4. Nếu còn đúng hạn và `distanceXZ(player, safeCenter) ≤ safeRadius` → thành công.
5. Nếu thời gian bằng deadline nhưng không ở trong vùng xanh → thua.

Điểm nằm đúng mép sân, khoảng cách bằng 3, vẫn tính là trong sân. Điểm nằm đúng mép vòng xanh vẫn nhận thưởng. Chạm vào vòng là đủ, không phải đứng chờ hết giờ.

Khi thành công, tối đa trả thưởng một lần trong một lần update: chốt kết quả vòng hiện tại → cộng thưởng → tăng streak → tạo vòng mới. Không lặp lại xét vòng mới trong cùng frame.

### Reset lượt

Đưa root về (0,0,5), xóa input, hủy jump/lao và các hiệu ứng còn lại, bỏ Death, về Idle. Streak, số vòng và độ khó về ban đầu. Tiền, vật phẩm, best streak giữ trong phiên hiện tại.

Nút Đặt lại vị trí/Chơi lại trong prototype chưa reset yaw camera hoặc góc thân, khác với phím R/reset toàn bộ. Khi làm bản giao cho người dùng, nên thống nhất reset lại cả hướng nhìn về tâm để tránh bắt đầu quay lưng với điểm glitch; đây là phần cần chỉnh, không phải hành vi đã có đầy đủ.

## 8. Sinh vòng và độ khó

Không spawn vòng xanh bên ngoài sân. Prototype chọn góc ngẫu nhiên 0–2π, khoảng cách tâm vòng tới tâm sân từ 1,25 đến 2,00 unit. Nếu tâm mới quá gần tâm cũ, khoảng cách nhỏ hơn 2 lần bán kính xanh hiện tại, dùng điểm đối xứng của tâm cũ qua tâm sân.

Các kiểm tra quan trọng:

- `distanceXZ(safeCenter, arenaCenter) + safeRadius ≤ arenaRadius`.
- Không spawn vòng mới ngay dưới chân người chơi sau khi nhận vòng cũ để farm tự động.
- Hình vùng xanh phải khớp bán kính xét thưởng. Scale visual không được làm vùng xanh nhìn rộng hơn hit area.
- Spawn vòng tiếp theo không teleport người chơi.
- Không chặn người chơi tại rìa sân. Người chơi phải thực sự đi ra được.

Độ khó tính từ streak **sau lần nhận thưởng gần nhất**:

```text
level = 1 + min(6, floor(streak / 5))
duration = 3,0 − 0,2 × (level − 1)
safeRadius = 0,85 − 0,05 × (level − 1)
```

| Streak đã đạt | Level | Thời gian vòng mới | Bán kính xanh |
|---|---:|---:|---:|
| 0–4 | 1 | 3,0 giây | 0,85 |
| 5–9 | 2 | 2,8 giây | 0,80 |
| 10–14 | 3 | 2,6 giây | 0,75 |
| 15–19 | 4 | 2,4 giây | 0,70 |
| 20–24 | 5 | 2,2 giây | 0,65 |
| 25–29 | 6 | 2,0 giây | 0,60 |
| Từ 30 | 7 | 1,8 giây | 0,55 |

Số vòng không giới hạn, nhưng độ khó có trần. Không tiếp tục giảm thời gian dưới 1,8 giây. Khoảng cách xa nhất giữa hai tâm khoảng 4 unit; ở cấp cuối, đường tới mép vòng khoảng 3,45 unit / 2,8 ≈ 1,23 giây, còn khoảng 0,57 giây cho phản ứng nếu chọn đường thẳng. Đây chỉ là kiểm tra khả thi hình học, chưa chứng minh cân bằng với người chơi thật.

## 9. Streak và thưởng

### Streak

Mỗi vòng xanh nhận thành công tăng streak 1. `bestStreak = max(bestStreak, streak)`. Khi thua hoặc ra ngoài, lưu streak kết thúc để hiện kết quả rồi đưa streak hiện tại về 0. Best streak không reset khi chơi lại trong cùng phiên.

### Tiền

Tiền cơ sở đang là 1/vòng. Tính hệ số theo streak **vừa đạt**, rồi mới cộng tiền:

```text
multiplier = min(3, 1 + floor(streakAfterSuccess / 5))
moneyGain = baseMoneyPerCircle × multiplier
```

Lần thành công thứ 1–4: +1 tiền; thứ 5–9: +2 tiền; từ thứ 10: +3 tiền. Cộng trực tiếp khi chạm, không cần bấm Claim. HUD phải hiển thị đúng thưởng của vòng sắp nhận: tại streak 4, vòng tiếp theo cho +2, dù hệ số vừa đạt hiện vẫn là ×1.

### Vật phẩm dùng lại icon Revival

| Loại | Icon trong repo | Mốc lặp thử nghiệm |
|---|---|---|
| Tiền | `assets/polish-cash.png` | Mỗi vòng |
| Dust | `assets/polish-dust.png` | Bội số 5 |
| Spins | `assets/polish-spins.png` | Bội số 10 |
| MutaGen | `assets/polish-mutation.png` | Bội số 15 |
| Pet | `assets/polish-pet1.png` | Bội số 20 |

Mỗi mốc chỉ nhận **một loại vật phẩm**, đồng thời vẫn nhận tiền. Ưu tiên khi trùng mốc: Pet > MutaGen > Spins > Dust. Ví dụ streak 10 chỉ +1 Spins, không cộng thêm Dust; streak 30 +1 MutaGen; streak 40 +1 Pet. Các mốc lặp theo bội số, không phải chỉ cấp một lần duy nhất.

Tên đúng trong data là **Spins**, không phải pin/năng lượng. Pet hiện chỉ là bộ đếm và icon; chưa chọn pet cụ thể, rarity hoặc tạo pet trong túi tài khoản. MutaGen cũng chưa xác định loại gen cụ thể. Những phần này cần bảng reward production riêng trước khi phát quà thật.

Tất cả tiền/vật phẩm/best streak hiện nằm trong bộ nhớ phiên: chơi lại hoặc đổi chế độ không làm mất; reload trang sẽ mất. Không dùng tài khoản Fishing hoặc Revival để cấp thử các phần thưởng này.

## 10. UI, hiệu ứng và âm thanh

HUD cần có: số tiền + icon, streak, best streak, hệ số thưởng, cấp độ khó, bộ đếm Dust/Spins/Pet/MutaGen, số vòng và thời gian còn lại, thanh thời gian, nút đặt lại/chơi lại và tùy chọn Giảm hiệu ứng.

| Sự kiện | Hình ảnh cần có | Thời lượng prototype |
|---|---|---:|
| Chờ ngoài sân | Điểm tím, viền cyan, 12 mảnh pixel chuyển động | Liên tục trong `ready` |
| Bắt đầu mở sân | Sân nở từ tâm; sóng năng lượng, lửa quanh mép và âm mở | Sân 0,60 giây; lửa 0,80 giây |
| Chạm vòng | Sóng sáng, hạt pixel bung/hút về nhân vật; icon đúng vật phẩm, chữ thưởng nổi; số tiền bật nhẹ | Chữ/sóng khoảng 0,70 giây; hạt hút 0,65 giây |
| Bật nhảy | Vòng năng lượng ở chân và tiếng bật | 0,32 giây |
| Tiếp đất | Vòng chân rộng hơn và tiếng chạm sàn | 0,32 giây |
| Còn ≤ 1 giây | Viền/câu nhắc đổi màu, countdown dễ đọc | Đến khi nhận vòng hoặc thua |
| Ra ngoài sân | Bùng lửa lần nữa, âm kết thúc, ẩn sân và vòng xanh | Lửa 0,80 giây |
| Thua | Death và tiếng thất bại, nhiễu nhẹ | Death một lần; trạng thái thua giữ đến chơi lại |

- Không dừng simulation/input để trình diễn thưởng. Đồng hồ vòng mới chạy ngay sau vòng cũ thành công.
- Hiệu ứng không được đổi bán kính collider hoặc vị trí gameplay.
- Chỉ bùng lửa khi state chuyển sang mở sân/kết thúc, không phát lại mỗi frame.
- Giữ màu xanh dễ nhận biết; không dùng nhiễu toàn màn hình liên tục che mục tiêu.
- Không thêm camera shake thường trực; camera trong bản này ổn định.
- Giảm hiệu ứng: dùng sàn màu thường thay shader, giảm hạt/lửa/độ sáng, bỏ nhiễu chuyển động mạnh. Không giảm gameplay difficulty hoặc thay reward.
- Dùng pool cho hạt/lửa, reset lifetime khi tái sử dụng. Không tạo mesh mới mỗi frame. Reset lượt phải tắt mọi hiệu ứng đang chạy.
- Âm thanh chỉ phát sau tương tác, tuân theo nút bật/tắt âm của web.

## 11. Thứ tự xử lý và việc cần bổ sung cho game thật

### Một frame prototype

```text
Đọc input → Di chuyển theo camera → Lao nhảy → Cập nhật thời lượng Jump
→ Xét state minigame/thoát sân/deadline/thu vòng → Cộng thưởng nếu có
→ Cập nhật HUD/VFX → Chép root vào actor → Blend animation → Mixer
→ Camera theo root → Render
```

Prototype dùng `dt = min(frameElapsed, 0,05 giây)` cho cả gameplay. Vì vậy ở FPS rất thấp thời gian trong game sẽ chậm hơn thời gian thật. Khi làm production, phải thống nhất clock: chuyển động có substep/collision phù hợp, deadline theo clock gameplay đáng tin cậy; không sao chép việc chặn dt rồi coi countdown là thời gian thật.

### Những giới hạn phải biết trước khi port

1. Chưa có collider vật lý, va chạm tường, dốc, bậc hoặc gravity thật. Không dùng prototype sàn phẳng làm bằng chứng đã có controller địa hình.
2. Input và thưởng đang xử lý local. Game multiplayer cần server xác nhận lượt, số vòng, deadline, khoảng cách và giao dịch thưởng; mỗi lần thưởng có ID duy nhất để chống cấp trùng. Đây là yêu cầu triển khai production, chưa có trong web thử.
3. Kiểm tra thu vòng hiện lấy mẫu vị trí từng frame. Controller tốc độ cao cần kiểm tra đoạn di chuyển hoặc trigger đáng tin cậy để không nhảy xuyên một vòng giữa hai frame mà bỏ sót.
4. Không hard-code scene origin nếu map có nhiều hố glitch: tính mọi khoảng cách trong hệ tọa độ cục bộ theo tâm sân đang tham gia.
5. Ranh giới map ±17 được clamp trong bước đi, còn phần lao nhảy cộng sau đó; nếu làm map có biên thật cần giải quyết biên/collision sau tổng chuyển động. Không sao chép lỗi thứ tự này vào production.
6. Bộ sinh vòng prototype chỉ bảo đảm khoảng cách giữa hai tâm theo bán kính mới. Khi bán kính giảm và người chơi vừa chạm ở sát mép vòng cũ, điều này chưa bảo đảm tuyệt đối root nằm ngoài vòng mới. Bản triển khai chuẩn cần kiểm tra thêm `distanceXZ(newSafeCenter, playerRoot) > newSafeRadius + spawnMargin`, đề xuất `spawnMargin = 0,10 unit`; chọn lại điểm hoặc điểm hợp lệ đã kiểm chứng. Vẫn giữ điều kiện vòng nằm trọn trong sân và quãng di chuyển khả thi. Đây là bổ sung cần làm, chưa có trong code hiện tại.
7. Phần thưởng thử, tên pet, gen, tỷ lệ quy đổi và lưu tài khoản phải được duyệt riêng. Không tự suy ra pet cụ thể từ một icon.

## 12. Checklist nghiệm thu

| ID | Thao tác thử | Kết quả bắt buộc |
|---|---|---|
| M01 | Bấm W rồi thả trên PC | Đi/dừng ngay; không chờ animation kết thúc |
| M02 | So W với W+D cùng thời gian | Tổng quãng đường bằng nhau khi không gặp biên |
| M03 | Xoay camera 90°, bấm W | Đi theo hướng nhìn mới |
| M04 | Đảo W sang S | Hướng di chuyển đổi ngay; model quay cung ngắn, không xoay vòng dài |
| M05 | Joystick + vuốt + nhảy bằng nhiều ngón | Ba input hoạt động độc lập, không mất joystick |
| M06 | Khóa chuột, bấm Esc | Con trỏ xuất hiện, không tự khóa lại, không kẹt phím đi |
| M07 | Giữ phím rồi chuyển tab/mất focus | Xóa input; trở lại không tự chạy |
| J01 | Đứng yên, nhảy | Lao đúng 0,45 unit theo hướng chốt; không double jump |
| J02 | So 30/60/120 FPS | Tổng quãng lao như nhau trong sai số tính toán |
| J03 | Vừa nhảy vừa đi hướng khác | Đi vẫn được; phần lao giữ hướng đã chốt |
| J04 | Chết hoặc reset giữa cú lao | Không còn bị đẩy ở lượt tiếp theo |
| A01 | Xuất phát/reset | Root ngoài sân ở khoảng cách 5 unit |
| A02 | Đứng cách tâm > 0,70 | Không tự mở minigame |
| A03 | Đi vào khoảng cách ≤ 0,70 | Tự mở sân, bùng lửa một lần |
| A04 | Trong 0,60 giây mở sân | Chưa chạy countdown vòng 1 |
| A05 | Chạm mép vòng xanh đúng hạn | Nhận tiền một lần; sinh vòng mới ngay |
| A06 | Đứng yên sau khi nhận vòng | Không liên tục farm thưởng trên vòng cũ |
| A07 | Chạm đúng deadline / sau deadline | Đúng deadline được; vượt deadline thua |
| A08 | Root vượt mép sân, kể cả lúc nhảy | Kết thúc lượt và bùng lửa, không Death |
| A09 | Hết giờ ở trong sân nhưng ngoài vòng xanh | Death; không cộng thưởng |
| A10 | Đi vào tâm sau khi đã `ended` | Không tự mở lại; chờ Chơi lại |
| R01 | Thành công thứ 4/5/10 | Đúng mốc tăng hệ số; HUD không báo sai tiền sắp nhận |
| R02 | Streak 5/10/15/20/30/40 | Dust/Spins/MutaGen/Pet/MutaGen/Pet, mỗi mốc một vật phẩm |
| R03 | Thua/ra ngoài/reset | Streak về 0; tiền, đồ và best còn trong phiên |
| D01 | Qua mốc 5,10,...30 | Đúng bảng level, time và bán kính |
| D02 | Qua streak 100 | Vẫn chơi được; time ≥ 1,8, radius ≥ 0,55 |
| V01 | Nhận thưởng/mở/thoát nhiều lần | Hiệu ứng tự tắt, không tăng vô hạn mesh hoặc audio |
| V02 | Bật Giảm hiệu ứng | Hình nhẹ hơn; tiền, va chạm, countdown không đổi |
| V03 | Nhảy/tiếp đất | Camera không nảy theo hông; blend không giật về pose cũ |

Đánh giá hiệu năng tại viewport desktop và mobile thực tế, ghi thiết bị/trình duyệt/FPS và lỗi console. Mục tiêu 60 FPS trên máy thử tham chiếu, không phải bảo đảm mọi thiết bị đạt 60 FPS. Theo dõi riêng chi phí shader, số hạt và overdraw.

## 13. Thứ tự thực hiện để bàn giao

1. Làm root/controller và camera trên sàn trống; pass M01–M07.
2. Import rig và blend bốn animation; pass J01–J04, V03.
3. Làm state machine và điểm vào sân, chưa thêm VFX; pass A01–A10.
4. Làm streak, difficulty và reward một lần/vòng; pass R01–R03, D01–D02.
5. Gắn VFX/audio theo sự kiện, thêm Giảm hiệu ứng; pass V01–V02.
6. Kiểm tra cảm giác điều khiển, mobile và FPS; chỉ sau đó chốt cân bằng và kết nối tài khoản thật.

Sản phẩm bàn giao gồm bản chạy được, config có thể chỉnh, bảng asset mapping, kết quả QA, video thử PC/mobile và ghi rõ các phần production chưa làm. Không coi chỉ có video VFX đẹp là đã hoàn thành mechanic.

## 14. File nguồn để đối chiếu

Các đường dẫn dưới đây tính từ root repository:

- `assets/character-3d.js`: input, movement, camera, pointer lock, load FBX, vòng cập nhật.
- `assets/animation-blend.js`: chuyển pose và thời lượng blend.
- `assets/jump-lunge.js`: quãng lao nhảy.
- `assets/glitch-engine.js`: state, deadline, sinh vòng, streak, độ khó, tiền và bonus.
- `assets/glitch-rewards.js`: icon và mốc thưởng vật phẩm.
- `assets/glitch-3d.js`: presentation, HUD, start/reset, hook VFX.
- `assets/glitch-juice.js`: shader sàn, pool hạt, sóng chân và lửa vào/ra.
- `assets/character-3d.css`: layout và hiệu ứng UI.
- `assets/game-audio.js`: âm thanh tổng hợp và trạng thái bật/tắt âm.
- `assets/character-3d/`: rig, animation và texture nguồn.

Các lệnh kiểm tra sẵn có, chạy tại root repo:

```text
node tools/check-instant-movement.mjs
node tools/check-animation-blend.mjs
node tools/check-glitch-game.mjs
node tools/check-glitch-juice.mjs
node tools/check-web-entrypoints.cjs
```

Các kiểm tra tự động hỗ trợ controller, deadline, thưởng, cấp độ và tái sử dụng hiệu ứng. Vẫn phải chạy checklist thao tác thực tế; test tự động không thay thế đánh giá cảm giác điều khiển hoặc phần chưa có như physics, server và lưu tài khoản.
