# GDD Trụ khóa bảo vệ base — v3 (đã đối chiếu Master Data)

Phiên bản 3.0 · 25/11/2026 · Steal a Pet

Bản này thay thế `docs/BASE-LOCK-GDD-v1.md` và `docs/BASE-LOCK-GDD-v2.md` ở những điểm mâu thuẫn với hai nguồn chính thức:

- `[Craftland] Steal A Pet GDD.xlsx` — sheet **Unlocking Rule**, **Base Passives**, **Shop System**, **Current Plan**, **Localization Key**, **Player Log**.
- `[Craftland] Steal A Pet Master Data.xlsx` — sheet **Rebirth 2.2**, **UnlockCost**, **ShopConfig**, **Tooltips**, **PassiveItem**, **TierItem**, **DailyActivity**, **OnboardingMissionList**.

## 1 Sáu điểm v1/v2 làm sai

| # | v1/v2 viết | Nguồn chính thức | Sửa ở v3 |
|---|---|---|---|
| 1 | Khóa cộng **2 / 5 / 10 phút**, không nêu rủi ro | `Rebirth 2.2!BaseLockTime` = **30–160 giây** theo RB; passive `Stronghold` chỉ +1–5 **giây**; `Lockdown` +1 giây | **Giữ thang phút theo quyết định 25/11/2026**, nhưng ghi rõ rủi ro và ba cách bù (mục 3) |
| 2 | "Chặn người lạ vào base khi đang bảo vệ" | `UnlockCost!A12`: **"Enter any base freely"** — ai cũng vào được, khóa chỉ chặn **mở cửa để trộm** | Khóa = chặn mở cửa/trộm, không chặn đi vào (mục 4) |
| 3 | "Đưa người lạ đã ở trong ra điểm an toàn sau 3 giây" | Không có cơ chế nào như vậy; `Unlocking Rule!A9` ghi rõ steal rules, laser wall, natural opening **out of scope** | Bỏ hoàn toàn đề xuất đẩy người chơi |
| 4 | ID `BASE_LOCK_2M`, "chưa ánh xạ item SAP" | `ShopConfig` dùng Name PascalCase + `HUD_SHOP_ITEM_*` / `HUD_SHOP_DETAILS_*`; `TierItem` cần tier; `Tooltips` cần một dòng | Đặt tên theo đúng quy ước, kèm bảng dòng cần thêm (mục 7) |
| 5 | "Giá / nguồn nhận chưa chốt, đừng mặc định bán" | `Shop System!A41`: **"Under Protection — Protect your base for 24 hours — 240 Pet Coin — RB7 — PENDING"**; `Current Plan` 3.5.0: *Item protect base like VRising (purchase by diamond, claim through 7d reward)*; 3.6.0: *Item Protect Base by time* | Tính năng này **đã có chỗ trong kế hoạch**; neo giá và nguồn theo đó (mục 6) |
| 6 | Không nhắc tới force-unlock | Cả một hệ thống `UnlockCost` + `UnlockCooldown` đang chạy | Mục 4 chốt **bảo vệ cứng**: force-unlock không mở được, kèm danh sách thứ bị phá vỡ |

## 2 Vị trí tính năng trong roadmap

Trụ khóa là phần triển khai của hai dòng đã nằm trong `Current Plan` / `Detail Planning`:

- **3.5.0 · P0** — *Item protect base like VRising (purchase by diamond and claim through 7d reward)*.
- **3.6.0 · P2** — *Item Protect Base by time*.

Và trùng ý định với `Shop System` ID 15 **Under Protection** (240 Pet Coin, RB7, trạng thái PENDING). Khác biệt: Under Protection là một lần 24 giờ; trụ khóa là vật phẩm cộng dồn theo giây, nạp nhiều lần. **Cần chốt** hai thứ này là một tính năng hay hai: nếu là một thì Under Protection nên bị thay, nếu là hai thì phải giải thích cho người chơi vì sao có hai cách bảo vệ base.

## 3 Vật phẩm khóa — giữ thang phút

**Đã chốt 25/11/2026: giữ 2 / 5 / 10 phút.** Mục này ghi lại con số đã chốt, rủi ro cân bằng kèm theo và cách bù, không đề xuất đổi nữa.

Khóa tự nhiên của base chỉ dài 30–160 giây:

| RB | BaseLockTime | UnlockCooldown |
|---:|---:|---:|
| 1 | 30 s | 15 s |
| 5 | 50 s | 30 s |
| 10 | 90 s | 45 s |
| 15 | 140 s | 60 s |
| 17–30 | 160 s (trần) | 60–180 s |

Cấu hình đã chốt:

| Name (ShopConfig) | ID | Cộng thêm | So với khóa tự nhiên RB7 (65 s) | So với RB trần (160 s) | Màu icon |
|---|---:|---:|---:|---:|---|
| `BaseLockKey2M` | 16 | 120 giây | 1,85× | 0,75× | Lam |
| `BaseLockKey5M` | 17 | 300 giây | 4,62× | 1,88× | Tím |
| `BaseLockKey10M` | 18 | 600 giây | 9,23× | 3,75× | Vàng |

ID 16–18 là ba ô trống kế tiếp trong `Shop System!A42:A44`. Nếu cấp qua 7-day reward thay vì shop, vẫn giữ Name và localize key, chỉ đổi nguồn phát.

### Rủi ro cân bằng phải xử lý

Một khóa 10 phút dài gấp **3,75 lần** toàn bộ khóa tự nhiên ở RB trần, trong khi passive mạnh nhất của hệ thống (`Stronghold` rank max) chỉ thêm **5 giây**. Hệ quả: người chơi giữ vài khóa 10 phút gần như miễn nhiễm trộm, và vòng tiêu Pet Coin qua force-unlock (`UnlockCost`) mất tác dụng trong khoảng thời gian đó.

Rủi ro này **nặng thêm** sau quyết định bảo vệ cứng ở mục 4: không còn đường trả phí để phá khóa, nên không có van xả nào ngoài đồng hồ.

| Cách bù | Nội dung | Trạng thái |
|---|---|---|
| Trần tích lũy | Giới hạn tổng thời gian nạp, ví dụ 2× `BaseLockTime` của RB | **Bắt buộc**, cần chốt con số |
| Khan hiếm nguồn phát | Giới hạn số khóa nhận mỗi ngày / mỗi event; phát qua 7-day reward theo `Current Plan` 3.5.0 | **Bắt buộc**, cần chốt con số |
| Giá cao | Neo theo `Under Protection` (240 Pet Coin / 24 giờ) thay vì quy đổi theo thời lượng | Nên làm |
| ~~Force-unlock xuyên khóa~~ | ~~Trả Pet Coin mở được cả khóa nạp~~ | **Đã loại** bởi quyết định mục 4 |

Khuyến nghị cũ (30 / 60 / 120 giây) giữ lại trong `base-lock-config.v3.json` ở `duration_scale.aligned_seconds_recommended` để đối chiếu nếu số liệu live cho thấy khóa quá mạnh.

## 4 Khóa bảo vệ cái gì

Theo `UnlockCost!A12-A14`:

> Vào base nào cũng được. Chỉ trộm được pet tới trần rarity của RB mình. Giá mở cửa = dòng config của rarity cao nhất thực sự trộm được trong base đó.

**Đã chốt 25/11/2026: bảo vệ cứng.** Trong thời gian trụ còn thời gian, **không ai mở được base bằng Pet Coin**. Cách duy nhất để base mở lại là hết giờ.

| Hành vi | Khi đang bảo vệ |
|---|---|
| Người lạ đi vào base | **Vẫn vào được**. Không chặn, không đẩy ra |
| Người lạ mở cửa để trộm | **Bị chặn tuyệt đối** |
| Force-unlock bằng Pet Coin | **Không dùng được.** Không hiện giá, không trừ tiền |
| `UnlockCooldown` của chủ base | Không có điểm kích hoạt, vì không có lần mở trả phí nào xảy ra |
| Passive `Fortify` (+20 Pet Coin giá mở cửa) | Vô tác dụng trong thời gian bảo vệ |
| Item `Double Cost` (nhân đôi giá mở cửa) | Vô tác dụng trong thời gian bảo vệ |
| Laser wall, storage, Favorite Pet, relock | Không đổi; `Unlocking Rule!A9` để ngoài phạm vi |
| Chủ base | Ra vào tự do |

### Luồng phía người đi trộm

Đã dựng trong prototype (tab **Khóa Base** → chọn góc nhìn **Người đi trộm**). Hai nhánh:

**Nhánh A — nhà không được bảo vệ.** Giữ nguyên luồng hiện có trong game: nút tròn `MỞ KHÓA` bên phải màn hình → popup `XÁC NHẬN MỞ KHÓA` → *"Bạn có muốn mở khóa nhà này với giá:"* + số Pet Coin → `KHÔNG` / `CÓ`.

**Nhánh B — nhà đang được bảo vệ bằng khóa nhà.** Thay đổi:

| Thành phần | Trạng thái |
|---|---|
| Nút tròn | Đổi từ xanh sang **đỏ**, nhãn đổi từ `MỞ KHÓA` sang `XEM KHÓA` — nhìn là biết không vào được |
| Băng trên đầu màn hình | `NHÀ ĐANG ĐƯỢC BẢO VỆ` + đồng hồ đếm ngược, hiện ngay khi tới gần |
| Popup | Tiêu đề đỏ `KHÔNG THỂ MỞ KHÓA` thay cho `XÁC NHẬN MỞ KHÓA` |
| Nội dung | *"Nhà này đang được bảo vệ bởi Khóa nhà cấp cao."* |
| Giá Pet Coin | **Không hiện.** Không có số, không có icon coin |
| Dòng lý do | *"Không thể mở bằng Pet Coin. Chờ hết thời gian bảo vệ."* |
| Ô đếm ngược | `Mở lại sau 01:58`, chạy theo thời gian thực |
| Nút | Một nút `ĐÃ HIỂU`. Không có `KHÔNG` / `CÓ` |

Nguyên tắc: **không bao giờ hiện giá rồi mới từ chối.** Người chơi không được phép bấm `CÓ` để rồi nhận lỗi — giá biến mất hoàn toàn ở nhánh B, nên không có đường nào trừ nhầm Pet Coin.

**Tầm hiện — đã chốt 25/11/2026: cùng tầm với nút mở khóa.** Băng, nút và popup dùng chung một điều kiện khoảng cách (`show_button_distance_m` = 3 m, ẩn ở 3,5 m theo đề xuất mục 8 của v1). Đứng xa thì cả ba đều tắt, chỉ còn dòng nhắc "Đến gần để xem khóa nhà".

Hệ quả cần biết: người đi trộm **chỉ biết nhà bị khóa khi đã chạy tới nơi**. Thứ duy nhất đọc được từ xa là tượng và aura của trụ — tượng đổi màu theo thời gian còn lại (lam → tím → vàng), nhìn thấy ở tầm xa hơn nhiều so với băng. Nếu sau này số liệu cho thấy người chơi mất quá nhiều thời gian chạy tới nhà không vào được, hai cách nới: cho băng hiện sớm hơn nút, hoặc đánh dấu trên minimap.

Băng `NHÀ ĐANG ĐƯỢC BẢO VỆ` cộng với màu nút đỏ chính là hạng mục bắt buộc "dấu hiệu nhìn từ ngoài" ở mục 3.

Giá ở nhánh A lấy đúng `UnlockCost`: rarity cao nhất trộm được × RB gap band. Prototype có hai ô chọn để thử cả 28 bảng giá; ảnh tham chiếu trong game (APEX, gap <3) ra 28 Pet Coin, khớp với bảng.

### Quyết định này phá vỡ cái gì

Phải nói thẳng: `Unlocking Rule!A5` tóm tắt cả hệ thống mở khóa bằng đúng hai chữ **"Keep stealing"**, và toàn bộ mục 2–3 của sheet đó được thiết kế để *luôn có* đường trả phí vào một base đang khóa. Bảo vệ cứng lấy đi đường đó.

| Thứ bị ảnh hưởng | Hệ quả |
|---|---|
| Sink Pet Coin | `UnlockCost` là một trong những chỗ tiêu Pet Coin chính; mỗi phút base được bảo vệ là một khoảng không ai tiêu được tiền ở đó |
| Passive `Fortify` | Giá trị passive này tụt xuống gần 0 với người chơi có khóa, vì nó chỉ cộng giá cho một hành động đã bị chặn |
| Item `Double Cost` | Tương tự, mất tác dụng với chính nhóm base đáng đánh nhất |
| Cân bằng defender cooldown | `Unlocking Rule` mục 3 tồn tại để cho người thủ thời gian hồi sau một lần bị phá; nay vật phẩm làm việc đó mạnh hơn và không tốn gì của đối thủ |
| Người đi trộm | Mất thời gian chạy tới một base không thể vào — cần dấu hiệu nhìn từ ngoài |

### Ba thứ bắt buộc phải chốt kèm

Trước đây có ba cách bù cho thang 10 phút và "force-unlock xuyên khóa" là một trong ba. Quyết định này **loại bỏ cách đó**, nên hai cách còn lại không còn là tùy chọn:

1. **Trần tích lũy — bắt buộc.** Không có trần thì một người chơi có 10 khóa 10 phút là bất khả xâm phạm 100 phút liên tục, và chồng tiếp được vô hạn. Đề xuất: trần = 2× `BaseLockTime` của RB người chơi, hoặc một con số tuyệt đối do balance chọn.
2. **Khan hiếm nguồn phát — bắt buộc.** Nếu bán không giới hạn trong shop thì trần tích lũy cũng vô nghĩa vì nạp lại ngay khi hết. Hợp với `Current Plan` 3.5.0: phát qua 7-day reward, số lượng cố định. Cần giới hạn số khóa nhận mỗi ngày hoặc mỗi event.
3. **Dấu hiệu nhìn từ ngoài — bắt buộc.** Tượng đổi màu và aura đã có sẵn, nhưng phải nhìn thấy từ ngoài base, đủ xa để người đi trộm quyết định trước khi chạy tới. Đây là thứ duy nhất trả lại chút công bằng cho người đi trộm.

Và một thứ nên cân nhắc: **bù sink Pet Coin** ở chỗ khác, vì bảo vệ cứng rút bớt lượng tiêu Pet Coin của cả server.

## 5 Quan hệ với passive đã có

`Base Passives` có hai passive đụng trực tiếp:

| Passive | Hiệu ứng ghi trong GDD | Xử lý |
|---|---|---|
| `Lockdown` (`HUD_PASSIVE_TITLE_LOCKDOWN`, PassiveItem ID 4) | +1 giây vào thời gian khóa, meter 300, rank 1–3 (70/25/5%) | Cộng vào khóa **tự nhiên**, không nhân với khóa nạp |
| `Stronghold` | Thêm 1–5 giây cho lần khóa base kế tiếp | Áp cho lần khóa kế tiếp, kể cả khóa nạp bằng vật phẩm — cần chốt |
| `Fortify` (PassiveItem ID 3) | +20 Pet Coin vào giá mở cửa, meter 250 | Không đổi |

Thứ tự cộng đề xuất: `thời gian cuối = BaseLockTime(RB) + Lockdown + Stronghold + tổng khóa đã nạp`. Không nhân chồng.

## 6 Nguồn phát và giá

| Hạng mục | Giá trị | Nguồn |
|---|---|---|
| Tiền tệ shop | Pet Coin | `ShopConfig!Cost` dùng Pet Coin cho mọi item |
| Neo giá | Under Protection = 240 Pet Coin / 24 giờ | `Shop System!A41` |
| RB yêu cầu | 7 | cùng dòng trên |
| Nguồn khác | Diamond + claim qua 7-day reward | `Current Plan` 3.5.0 |
| Nhiệm vụ liên quan | `MISSION_LOCK_BASE`, action `LockBase`, daily "Lock base 2/5 times" | `DailyActivity!15-16`, `CallbackMissionList`, `OnboardingMissionList` |

Nạp khóa bằng vật phẩm **phải tính là một lần `LockBase`** cho các nhiệm vụ trên, nếu không người chơi dùng trụ sẽ không hoàn thành được daily. Đây là điểm v1/v2 bỏ sót hoàn toàn.

Giá đề xuất, quy đổi tuyến tính từ neo 240 Pet Coin / 86.400 giây là vô nghĩa (ra 0,08 coin cho 30 giây). Giá phải đặt theo giá trị chống trộm, không theo thời lượng. **Chưa chốt**, để trống trong config; không dùng 0.

## 7 Dòng cần thêm vào Master Data

`ShopConfig` (ID | Name | Cost | Description | TimeLock | Requirement | NameLocalize):

```
16 | BaseLockKeyShort | TBD | HUD_SHOP_DETAILS_BASE_LOCK_KEY_SHORT | TBD | 7 | HUD_SHOP_ITEM_BASE_LOCK_KEY_SHORT
17 | BaseLockKeyMid   | TBD | HUD_SHOP_DETAILS_BASE_LOCK_KEY_MID   | TBD | 7 | HUD_SHOP_ITEM_BASE_LOCK_KEY_MID
18 | BaseLockKeyLong  | TBD | HUD_SHOP_DETAILS_BASE_LOCK_KEY_LONG  | TBD | 7 | HUD_SHOP_ITEM_BASE_LOCK_KEY_LONG
```

`Tooltips` (ID | Name | Description | Obtain) — tiếp sau ID 28:

```
29 | HUD_ITEM_TITLE_BASE_LOCK_KEY | HUD_REWARD_DETAIL_BASE_LOCK_KEY | HUD_OBTAIN_BASE_LOCK_KEY
```

`TierItem` (TypeItem | Tier): `BaseLockKey | Epic` — ngang `RandomItem`, `Daily Mission Milestone Points`. **Cần chốt** với người giữ bảng tier.

`Localization Key`: thêm `LOCK_BASE_KEY`, `LOCK_BASE_TIME_LEFT`, `LOCK_BASE_REFILL`. Dòng `LOCK_BASE` đã có, VN là **"Khóa nhà"** — UI prototype đang viết "KHÓA BASE", phải đổi theo bảng localization.

`Player Log`: đã có field 71 *Total base lock time, in seconds* và `first_base_lock_time`. Thêm field cho số khóa đã nạp và thời gian do vật phẩm sinh ra, để tách khỏi khóa tự nhiên khi đọc số liệu.

## 8 Phần giữ nguyên từ v2

Hai thay đổi UI của v2 không mâu thuẫn với nguồn nào, giữ nguyên:

- Bảng nạp **không đóng** sau khi nạp thành công; chỉ `ĐỂ SAU` / X / Esc mới đóng.
- Thời gian còn lại **chạy số tăng dần** 900 ms, ease-out cubic, phóng 1,14×, màu `#1E8F44`, chạy theo `requestAnimationFrame`; aura bám giây thực, không bám số đang chạy.

Ngưỡng aura giữ theo thang phút: lam 1–120 s, tím 121–300 s, vàng từ 301 s — đúng như prototype đang chạy.

Hai phương án UI (Chọn rồi xác nhận / Chọn thẻ nạp ngay) và toàn bộ mục tượng, aura, VFX, giao dịch server của v1 vẫn hiệu lực.

## 9 Tiêu chí nghiệm thu bổ sung

| Mã | Tình huống | Kết quả mong đợi |
|---|---|---|
| BL25 | Người lạ đi vào base đang bảo vệ | Vào được bình thường, không bị chặn hay đẩy ra |
| BL26 | Người lạ mở cửa base đang bảo vệ | Bị chặn; **không hiện giá Pet Coin**, không có nút trả phí |
| BL27 | Người lạ có đủ Pet Coin, thử force-unlock | Bị từ chối, **không trừ một xu**, không bật `UnlockCooldown` |
| BL27b | Nạp vượt trần tích lũy | Từ chối nạp, không tiêu khóa, báo rõ lý do |
| BL27c | Nhìn base từ ngoài | Thấy rõ base đang bảo vệ trước khi chạy tới |
| BL32 | Tới gần nhà không bảo vệ | Nút `MỞ KHÓA` xanh; popup xác nhận hiện đúng giá `UnlockCost` |
| BL33 | Tới gần nhà đang bảo vệ | Nút đỏ `XEM KHÓA`; băng `NHÀ ĐANG ĐƯỢC BẢO VỆ` + đồng hồ hiện ngay |
| BL33b | Đứng xa nhà đang bảo vệ | Băng và nút **cùng tắt**; chỉ còn tượng và aura đọc được từ xa |
| BL34 | Mở popup ở nhà đang bảo vệ | Tiêu đề `KHÔNG THỂ MỞ KHÓA`, **không hiện giá**, một nút `ĐÃ HIỂU` |
| BL35 | Hết giờ bảo vệ khi popup chặn đang mở | Popup chuyển về luồng xác nhận bình thường, hiện lại giá |
| BL36 | Bảo vệ bật lên khi popup xác nhận đang mở | Popup chuyển sang trạng thái chặn trước khi người chơi kịp bấm `CÓ` |
| BL37 | Đồng hồ trong popup chặn | Đếm ngược theo thời gian thực, khớp đồng hồ của chủ nhà |
| BL28 | Nạp một khóa | Tính một lần `LockBase` cho `MISSION_LOCK_BASE` và daily |
| BL29 | Có passive Lockdown / Stronghold | Cộng đúng một lần theo công thức mục 5, không nhân chồng |
| BL30 | Đọc Player Log | Tách được thời gian khóa tự nhiên và thời gian do vật phẩm |
| BL31 | Mọi chuỗi chữ UI | Lấy từ Localization Key, VN dùng "Khóa nhà" |

Chưa cái nào được kiểm tra: prototype web không có force-unlock, passive, nhiệm vụ hay localization.

## 10 Bàn giao

- Excel cấu hình v3: `outputs/base-lock-gdd-v3/Base_Lock_Config_v3.xlsx`, bản sao `docs/BASE-LOCK-CONFIG-SHEET-v3.xlsx`.
- JSON cấu hình v3: `outputs/base-lock-gdd-v3/base-lock-config.v3.json`.
- Prototype: tab **Khóa Base** trong `index.html` — thang 2/5/10 phút, **khớp với v3**. Những thứ prototype chưa có: force-unlock, passive, nhiệm vụ, localization, server.
- v1 và v2 giữ lại làm lịch sử; chỗ nào mâu thuẫn thì v3 đúng.

Quy tắc đồng bộ, theo đúng tiền lệ `Unlocking Rule!A19` ("Keep this GDD table and Master Data UnlockCost table the same"): bảng thời lượng và bảng ShopConfig trong file này phải khớp Master Data. Sửa một bên thì sửa cả hai.
