# Apex + Webbed ngoài Fishing

Đường tính: pet xuất hiện trên conveyor, roll APEX theo Daily Pool, roll Webbed tự nhiên từ Mutation 2.0. Không dùng event Fishing, không dùng rate Gen fishing.

GDD GlobalCofig B3: MobSpawnInterval = 6000 ms, tức 6 giây/spawn (600 spawn/giờ). Master Data Mutation 2.0 F11: Webbed weight 3; tổng weight F3:F14 = 5000 → 0,06%. Daily pool rates 3.0.1 E5:AM110 cung cấp tỉ lệ từng ngày và band, giả định room thuần band. Room mix thực tế, buff, guarantee hoặc runtime cadence khác cần tính lại.

P(Apex + Webbed/spawn) = P(Apex theo daily band) × 3/5000. Giờ chờ kỳ vọng = 6/[3600 × P(Apex) × 0,0006]. Đây là thời gian canh conveyor để thấy ít nhất một APEX bất kỳ mang Webbed tự nhiên, không phải chắc chắn sở hữu: cần đủ Money và mua trước người khác, không tính farm tiền, theft hoặc Fusion.

| Rebirth | Tổng rate Apex tùy ngày | Giờ online kỳ vọng cho Apex + Webbed |
|---|---:|---:|
| R1–R4 | 0.0490%–0.0504% | 5512.7–5665.1 |
| R5–R8 | 0.1079%–0.1109% | 2504.6–2573.7 |
| R9–R13 | 0.5397%–0.5544% | 501.0–514.6 |
| R14–R18 | 0.6971%–0.7163% | 387.8–398.5 |
| R19+ | 0.9723%–1.0007% | 277.6–285.7 |

Các khoảng là kỳ vọng nếu giữ nguyên rate của từng ngày, không phải khoảng xác suất hay guarantee. Nếu rate tuần lặp và người chơi canh dài hạn phân bố đều, R19+ dùng mean rate cho xấp xỉ khoảng 281,1 giờ online. Tích lũy 1 giờ/ngày ≈ 281 ngày, 4 giờ/ngày ≈ 70 ngày; online liên tục ≈ 11,7 ngày. Lịch phiên cụ thể có thể ưu tiên hoặc bỏ lỡ ngày UP. Không cần đứng chờ một event.

Tại R19+, Apex thường kỳ vọng khoảng 10 phút xuất hiện; chờ đồng thời có Webbed làm thời gian tăng 1/0,0006 = 1.666,7 lần. Đã có sẵn Apex không giúp conveyor gắn Webbed vào pet đó: đây là chờ một instance Apex + Webbed mới.

Đường giữ Apex rồi dùng Webbed Gen: apply S/SS/SSS trên Apex non-Secret là 9% / 14,4% / 18%. Tuy nhiên ShopItemID 20025/20026/20027 chưa có trong 60 Merchant lineup đã kiểm tra, nên nếu dùng đúng rotation đó thì không có thời gian mua hữu hạn. Không dùng 0,06% mutation tự nhiên làm rate item shop.

Fusion là đường khác: cần PetID, rarity / rank, mutation các pet đầu vào, eligibility, luật transfer, hatch time, giá nguyên liệu. Không gán chung thời gian conveyor cho Fusion. Các đường khác chưa đủ config không thể cộng/trộn vào một thời gian acquisition duy nhất.

Nguồn: GDD GlobalCofig B1:B3 và Manual B7:D7; Master Data daily pool rates 3.0.1 A1:AM110, Mutation 2.0 A1:I14, MutaGen Config A48:M50, Rotation Shop (2.12.1) A1:V62. Data daily rotation dùng DOWN ×0,80 trong khi GDD Daily Pool ghi ×0,70; ở đây dùng daily rates có sẵn trong Master Data. Không thay đổi workbook hoặc web config.
