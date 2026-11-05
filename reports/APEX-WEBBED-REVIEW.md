> Lịch sử: số liệu Fishing dùng Gen v8, trước lần cân bằng v9. Cấu hình hiện tại xem GEN-TIME-BALANCE-v9.md. Phần nguồn ngoài Fishing vẫn là dữ liệu đối chiếu.

# Đối chiếu Apex + Webbed sau khi bỏ 4 Gen

Đã bỏ Bling Bling, Stormspark, Galaxy, Aurora khỏi pool fishing và Excel. Còn 17 Gen; chuẩn hóa tỉ lệ còn lại về tổng 1.000.000 mỗi band, không đổi data pet. Không thay đổi nguồn GDD/Master Data.

## Kết luận

Fishing trực tiếp Apex + Webbed đang cực hiếm, không lấn át đường dùng MutaGen. Đường item giữ Apex để thử lại, trong khi fishing trực tiếp phải đồng thời trúng pet và Webbed. Không thể quy đổi Pet Coin sang giờ chơi vì nguồn chưa khóa tốc độ kiếm coin hoặc stock Merchant.

## Fishing trực tiếp

Giả định: full vàng mọi lượt (60% có Gen), 10 giây/lượt, 18 lượt/event 3 phút; không có chest; đủ Money để mua kết quả. Mục tiêu là bất kỳ pet APEX nào trong Fishing kèm Webbed, không phải một PetID cố định.

P(Apex + Webbed) = P(Apex theo fish pool) × 0,60 × P(Webbed | có Gen, Rebirth).

| Rebirth | Apex / lượt | Webbed / lần có Gen | Apex + Webbed / lượt | Số lượt kỳ vọng | Event 18 lượt kỳ vọng |
|---|---:|---:|---:|---:|---:|
| R1–R4 | 0.011000% | 0.0002% | 0.0000000132% | 7,575,757,576 | 420,875,421 |
| R5–R8 | 0.016500% | 0.0009% | 0.0000000891% | 1,122,334,456 | 62,351,915 |
| R9–R13 | 0.022000% | 0.0036% | 0.0000004752% | 210,437,710 | 11,690,984 |
| R14–R18 | 0.033000% | 0.0090% | 0.0000017820% | 56,116,723 | 3,117,596 |
| R19+ | 0.041001% | 0.0270% | 0.0000066422% | 15,055,254 | 836,403 |

R19+: Apex thường trung bình 2.439 lượt, khoảng 6 giờ 46 phút câu chủ động. Apex + Webbed trung bình 15.055.254 lượt, khoảng 4,77 năm câu liên tục, chưa chờ event. Xác suất ít nhất một Apex + Webbed trong 18 lượt chỉ khoảng 0,00011956%. Đợi combo trực tiếp cần trung bình số lượt gấp 6.173 lần so với chỉ tìm Apex. Đây là tỉ số số lượt fishing, không phải so sánh tổng thời gian kiếm Pet Coin.

Kỳ vọng = 1/p không phải bảo đảm; xác suất event = 1 − (1 − p)^18. Full xanh làm combo hiếm hơn 4 lần; full đỏ không có combo. Các tổ hợp siêu hiếm được tính giải tích; không suy ra từ việc Monte Carlo không thấy drop.

## Apex rồi dùng Webbed MutaGen

Master Data MutaGen Config: BaseChance × PetRarityMult × SecretMult, clamp 2%–75%. APEX/DIVINE multiplier 0,45; Secret multiplier 0,55. Fail mất item và Money, pet không đổi. Các lần thử độc lập, không pity.

| Grade | Giá / item (Pet Coin) | Thành công Apex không Secret | Số lần thử kỳ vọng | Tổng Pet Coin kỳ vọng | Money Lv1 kỳ vọng, rank 401–500 |
|---|---:|---:|---:|---:|---:|
| S | 500 | 9% | 11,11 | 5.556 | 38,89T |
| SS | 550 | 14,4% | 6,94 | 3.819 | 24,31T |
| SSS | 600 | 18% | 5,56 | 3.333 | 19,44T |

Money / attempt rank 401–500 ở Lv1 = 3,5T. Rank 501–9999 = 20T, tách khỏi điều kiện IsSecret. Nếu là Secret, chance S / SS / SSS còn 4,95% / 7,92% / 9,9%; kỳ vọng 20,20 / 12,63 / 10,10 item và 10.101 / 6.944 / 6.061 Pet Coin. Rank 501+ + Secret ở Lv1 tốn kỳ vọng 404,04T / 252,53T / 202,02T Money, chưa tính giá mua Apex.

Với cùng PetID / level và đúng Webbed attribute, nguồn acquisition không định nghĩa bonus khác nhau. Mutation 2.0 Webbed Multiplier 2,4, LvUpCostMultiplier 2,05. Không nhân tiếp xác suất apply item vào fishing: fishing đã roll thành công thì Gen gắn trực tiếp. Prototype hiện ghi nhận Gen và giá pet gốc × 1,1; chưa áp dụng đầy đủ kinh tế passive/level/sale vào reward.

## So với event khác

| Đường | Kết quả theo nguồn | Rào cản / giới hạn |
|---|---|---|
| Dig | MoleDigging Cast5: tổng APEX 17.600 / 999.600 = 1,760704% trên một paid Mythic dig. Cao hơn fishing R19+ khoảng 42,94 lần trên một roll pet. | Mythic spot không bảo đảm có; giá 500Q. R19+ thấy ít nhất một Mythic trong 5 spots khoảng 34,09% / scan; tối đa 3 scans/wave, chọn một spot mỗi scan. |
| Dig Chase pity | 48 điểm; Mythic dig +4 → tối đa 12 Mythic paid digs để kích pity nếu chưa ra Chase. | Tối đa 8 digs/ngày có điểm. Đối tượng là Chase list (Goldenmole), không phải cá Apex cụ thể và không kèm Webbed. |
| Lucky Box | Data DrawWeight: LEGENDARY box APEX 30 / 179.431 ≈ 0,0167209%; MYTHIC box 541 / 34.542 ≈ 1,5662093%. MYTHIC khoảng 63,85 box / Apex, so fishing R19+ ~2.439 lượt. | Giá MYTHIC 500Q, LEGENDARY 2,1Q; pool PetID khác fishing; spawn shared/FCFS, không thể quy thẳng ra phút. Không có quy tắc cho Webbed sẵn trong flow GDD được đọc. |
| Meteor / Mole / Collector | Event Frame v16: tối đa 100 Gems/ngày. Featured normal/Secret 400, Limited 700 → tối thiểu 4 / 7 ngày nếu ngày nào cũng đủ cap và không chi trước. | PetID featured do event chọn, không mặc định Apex + Webbed. Đây là tiến độ có mục tiêu, không cùng kiểu lottery. |
| Windy Tree | High/Crown tối đa 2 offer, Mythic-equivalent target ≤2%; Golden Tree 10%. | Pool và giá vẫn TBD; không có căn cứ gán Apex + Webbed hoặc thời gian farm tương đương. |

Các tỉ lệ khác event chỉ so trên một cơ hội roll tương ứng, không khẳng định efficiency Money/phút hoặc cùng chất lượng pet. Khác PetID, giá, level, Secret, thời gian và xác suất có cơ hội roll đều phải được giữ riêng.

## Điểm lệch GDD / Data cần lưu ý

- MutaGen GDD ghi grade B/A/S và level multiplier 1,5; Master Data ghi S/SS/SSS, B4 = 1,04 dù note vẫn nói 1,5. Phân tích dùng numeric config và công thức trong Master Data. Lv1 không chịu lệch multiplier; ví dụ Lv10: 1,04^9 ≈ 1,423, còn 1,5^9 ≈ 38,443 (chênh ~27 lần).
- EventFishing GDD có chest, còn prototype hiện pet-only. Nếu bật chest, xác suất pet mỗi cast phải nhân thêm P(fish), đồng thời xét counter state; các ước lượng direct combo hiện là trường hợp thuận lợi.
- Weather Waves data: chu kỳ 69 phút, Fishing tổng 11 phút; HighTide 3 phút, có một HeavyRain chỉ 2 phút. 18 lượt/event là giả định chuẩn hóa của người dùng, không áp dụng nguyên cho mọi wave.
- LuckyBox GDD còn giá/EV cũ và duration 90s/60s lệch nhau. Master Data giá mới 6M / 2,1Q / 500Q. Pool còn KIRIN LIMITED weight 1 dù note nói LIMITED excluded, và một số cached Drop Rate không khớp DrawWeight hoặc vẫn khác 0 khi weight 0. Phân tích chuẩn hóa DrawWeight thô (bao gồm dòng KIRIN); cần xác nhận whitelist trước dùng production.
- EventMeteorite tự đánh dấu superseded; đối chiếu dùng Event Frame v16, không dùng Stars/threshold 4–9 cũ.

## Khuyến nghị thiết kế (chưa tự áp dụng thêm)

Giữ pet nguyên data. Giữ MutaGen là đường đắt nhưng chọn đích cho pet đang sở hữu. Fishing là jackpot Gen gắn sẵn. Nếu muốn Apex + Webbed là mục tiêu người chơi có thể chủ động đuổi, pool hiện quá thấp; nên chốt mục tiêu số event hoặc bổ sung tiến độ Gen trước khi tăng rate. Điều chỉnh chỉ ở Gen và luôn kiểm tra coin sink / Money sink. Không thể kết luận ưu thế tổng thể so với farm item trước khi có tốc độ kiếm Pet Coin, stock/refresh Merchant, và chi phí thời gian của từng event.

## Nguồn và kiểm tra

GDD: MutaGen!A4:K34; EventFishing!A12:D107; EventDig!A43:J106; EventLuckyBox!A15:G49; EventWindyTree!A84:E97; Event Frame!A11:D120.
Master Data: MutaGen Config!A3:R17, A23:M50, B64:C72; Fishing!A1:Q37; Mutation 2.0!A1:I14; MoleDigging!A1:O37; LuckyBox Config!A3:I142; Weather Waves!A3:E27.
Active authored fishing Gen: merged-gen-8-17-pool. 300.000 mô phỏng kiểm tra luồng và tổng; công thức chính xác dùng cho tổ hợp hiếm. Web charts / JSON export đã kiểm tra với pool 17; pet giữ nguyên snapshot gốc.

## Bổ sung: khả năng mua Webbed trong Merchant

Đã kiểm tra 60 lineup của Rotation Shop (2.12.1), cột A:E. Catalog Q27:V29 định nghĩa Webbed S / SS / SSS là ShopItemID 20025 / 20026 / 20027, map tới MutaGenID 24 / 25 / 26. Không có bất kỳ ID 20025 / 20026 / 20027 nào trong Items của 60 lineup. Hai bảng Rotation Shop và Rotation Shop (Format) cũng không đưa Webbed item vào các lineup được kiểm tra.

Vì vậy, nếu runtime chỉ dùng các lineup này, Webbed không có offer để mua: 0/60 lineup, không có thời gian chờ hữu hạn để mua qua kênh này. Catalog có item và giá không đồng nghĩa item đã được đưa vào rotation. Chưa có bằng chứng runtime dùng một pool sinh shop khác.

Phân tích chi phí item ở trên là CÓ ĐIỀU KIỆN đã kiếm được item, không phải thời gian acquisition hoàn chỉnh. Không thể kết luận đường mua item nhanh hơn fishing khi chưa có offer hợp lệ. Tỉ lệ 3/5000 = 0,06% trong Mutation 2.0 là mutation tự nhiên của pet, không phải cơ hội Webbed Gen xuất hiện trong Merchant.

Khi bổ sung rotation hợp lệ: với p_g là xác suất có offer grade g trong một lần refresh, mua đúng 1 item khi offer xuất hiện và đủ tiền/stock, q_g = p_g × applyChance_g. Nếu chỉ dùng một grade, số refresh kỳ vọng = 1/q_g. Nhiều grade hoặc nhiều stock phải xét lineup, quyền mua và xác suất ít nhất một lần thành công, không cộng các xác suất chồng lặp. Ví dụ nếu mua thử tất cả n_g item trong một lineup, xác suất thành công của lineup = 1 − tích(1 − s_g)^n_g. Nếu rotation theo lịch cố định, dùng lịch thực tế thay cho giả định refresh độc lập.

Duration trong 60 lineup đều bằng 5, còn GDD Mystery Merchant overview nói 4 phút; phải xác nhận đơn vị/cadence runtime trước quy ra giờ. Không tự sửa rotation shop hoặc hệ thống item trong lượt kiểm tra này.
