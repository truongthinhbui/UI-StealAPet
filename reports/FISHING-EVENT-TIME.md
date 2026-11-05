> Lịch sử: số liệu Fishing dùng Gen v8, trước lần cân bằng v9. Cấu hình hiện tại xem GEN-TIME-BALANCE-v9.md. Phần nguồn ngoài Fishing vẫn là dữ liệu đối chiếu.

# Thời gian Fishing và đối chiếu các hoạt động

## Cơ sở tính

Dùng Weather Waves trong Master Data và pool pet gốc đang chạy trên web, pool Gen 17 loại sau khi loại Bling Bling / Stormspark / Galaxy / Aurora. Không sửa thêm config. Thời lượng Weather Waves được hiểu theo phút. Các số là kỳ vọng xác suất, không phải cam kết; chưa có pity pet Fishing.

Giả định thuận lợi: 10 giây trọn một lượt kể cả thao tác, mọi tap vàng (60% có Gen), không chest, đủ tiền mua mọi kết quả cần giữ, không mất thời gian đi đến nước, không bỏ lỡ wave, Rebirth cố định. Không cộng 0,35 giây lần nữa vì 10 giây là giả định trọn lượt. Nếu 10 giây chưa gồm reveal/Buy, thông lượng thực tế thấp hơn.

## Lịch Fishing trong một vòng 69 phút

| Khung tính từ đầu chu kỳ | Weather | Thời lượng | Tối đa lượt |
|---|---|---:|---:|
| Phút 6–9 | HighTide | 3 phút | 18 |
| Phút 24–27 | HighTide | 3 phút | 18 |
| Phút 42–44 | HeavyRain | 2 phút | 12 |
| Phút 62–65 | HeavyRain | 3 phút | 18 |

Các lần bắt đầu cách nhau 18 / 18 / 20 / 13 phút, trung bình 17 phút 15 giây. Tổng 11 phút Fishing trên 69 phút = 15,94% thời gian. 66 lượt / chu kỳ = khoảng 57,39 lượt mỗi giờ online nếu có mặt xuyên mọi wave. Mỗi wave trung bình 16,5 lượt, không phải wave nào cũng 18. Không áp mốc wave vào đồng hồ thực nếu chưa có epoch server.

## Fishing Apex + Webbed

p = P(Apex) × 0,60 × Weight_Webbed / tổng Weight_Gen.
Lượt kỳ vọng = 1/p. Giờ câu chủ động = 1/(360p). Giờ trôi qua gồm chờ = (1/p) × 69/66/60. Đây là xấp xỉ theo thông lượng dài hạn; thời điểm bắt đầu phiên gây lệch dưới cỡ một chu kỳ, không đáng kể với combo siêu hiếm.

| Rebirth | Giờ câu chủ động cho Apex + Webbed | Năm trôi qua, tham gia 24/7 | Giờ trôi qua để có Apex thường |
|---|---:|---:|---:|
| R1–R4 | 21,043,771 | 15,068.70 | 158.40 |
| R5–R8 | 3,117,596 | 2,232.40 | 105.60 |
| R9–R13 | 584,549 | 418.58 | 79.20 |
| R14–R18 | 155,880 | 111.62 | 52.80 |
| R19+ | 41,820 | 29.95 | 42.50 |

R19+: 15,055,254 lượt cho combo; 41,820 giờ câu thao tác, tương đương 4,77 năm câu không ngừng. Thêm giới hạn thời tiết: 262,326 giờ, khoảng 29,95 năm trôi qua ngay cả khi theo mọi event. Đây không phải 30 năm gameplay có ý nghĩa; nó cho thấy combo gần như không thể là mục tiêu cá nhân với rate hiện tại.

## Khi chỉ chơi một phần mỗi ngày

Nếu chơi 1 giờ online/ngày, giờ vào game phân bố ngẫu nhiên so với weather và có thể tiếp tục mỗi ngày độc lập về pha, trung bình khoảng 57,39 lượt/ngày. R19+: Apex thường khoảng 42,5 ngày; Apex + Webbed khoảng 262.326 ngày, tức 718,7 năm. Nếu đăng nhập cùng giờ cố định mỗi ngày, phải tính chính xác các khung bị gặp/bỏ lỡ; không áp số trung bình này như bảo đảm.

Nếu canh lịch để chỉ dành 1 giờ/ngày thao tác câu, không tính thời gian chờ vào giờ chơi, R19+ cần khoảng 6,77 ngày cho Apex thường và 41.820 ngày (~114,6 năm) cho combo. Hai cách đo một giờ/ngày khác nhau: một giờ online bao gồm chờ và một giờ chỉ câu. Các giả định bỏ qua coin/Money farming và thời gian travel/offer.

## So hoạt động khác ở R19+

| Hoạt động | Mô hình thời gian để có một Apex bất kỳ | Apex + Webbed |
|---|---|---|
| Fishing | Khoảng 42,50 giờ trôi qua, tham gia mọi wave; 6,77 giờ câu thực. | Khoảng 29,95 năm trôi qua; 41.820 giờ câu thực. |
| Dig | Khoảng 9.06 giờ trôi qua theo mô hình chọn spot cao nhất và trả tiền cả 3 scans/event, 7 GroundShake / 69 phút; chưa tính Chase pity. | Dig GDD cho mutation None. Webbed item không có offer trong 60 Merchant lineup đã kiểm tra, nên chưa có thời gian hữu hạn qua đường Dig + mua Webbed. |
| Lucky Box Storm | Khoảng 237–356 giờ trôi qua, nếu mỗi vòng 69 phút mua được 2–3 box, tỷ trọng loại 60/30/10, đủ Money và không bị người khác mua trước. | Chưa có quy tắc grant Webbed sẵn và không có offer Webbed item trong rotation đã kiểm tra. Không suy ra thời gian combo từ thời gian Apex. |
| Meteor / Mole / Collector | Featured normal/Secret tối thiểu 4 ngày từ 0 Gem ở cap 100/ngày; Limited 7 ngày. FeaturedPetID có thể không phải Apex. | Không có guarantee Apex + Webbed. Cần xác nhận featured và nguồn Webbed trước khi tính. |
| Windy Tree | Chưa tính được: dedicated egg pool và giá còn TBD. | Chưa có cấu hình combo đủ để tính thời gian. |

Thời gian Dig / Lucky Box là mô hình minh họa có điều kiện từ GDD + Data, không phải đo gameplay hoặc hiệu suất đã xác nhận production. Pool pet các event khác nhau; cùng APEX không có nghĩa cùng PetID, rank, thu nhập, giá trị hay Secret. Chỉ Fishing có số thời gian thao tác người dùng đã cung cấp; Dig chưa có thời lượng mash/di chuyển, LuckyBox chưa có contention thực tế nên không suy ra giờ thao tác tương đương.

## Chi tiết mô hình Dig

R19+ weights spot C/R/E/L/M = 150/250/300/220/80 trên 1.000. Roll 5 spots, mua spot tốt nhất mỗi scan. Xác suất rarity cao nhất r = F(r)^5 − F(r−1)^5. Nhân với tỉ lệ APEX thực của từng MoleDigging Cast (0 / 0 / 0 / 0,0083% / 1,760704%) cho P(Apex/paid scan) ≈ 0.604332%. Kỳ vọng 165.47 paid digs. 3/event × 7/event-cycle = 21/69 phút, ra khoảng 9,06 giờ. Giả định đủ thời gian làm trọn 3 paid digs trong wave 3 phút và đủ tiền; GDD spot mix được ghi là ví dụ, chưa tune.

Pity 48 điểm, Mythic +4: 12 paid Mythic digs đủ kích Chase nếu chưa trúng. Daily cap 8 digs có điểm → nhanh nhất phải qua ít nhất 2 ngày reset đối với đường tích điểm này; không phải bảo đảm 2 ngày theo thực tế vì cần Mythic spots và Money. Natural Chase có thể ra sớm hơn. Daily cap chỉ chặn điểm pity, không chặn paid digs; vì vậy mô hình natural 9,06 giờ không áp cap 8 vào tất cả rolls.

## Chi tiết Lucky Box

Master Data normalize DrawWeight, không dùng cached Drop Rate: LEGENDARY APEX = 30/179431, MYTHIC = 541/34542. Mix 60% EPIC, 30% LEGENDARY, 10% MYTHIC → P(Apex/box) ≈ 0,161637%; kỳ vọng 618,67 box. Weather Waves có một GiftboxStorm 1 phút mỗi 69 phút. GDD LuckyBoxStorm quy định tối đa 3 attempts, first delay 10s, interval 25s: spawn ở 10/35/60s; mốc 60s có thể chạm expiry nên trình bày 2–3 thay vì mặc định 3.

GDD và data dùng tên GiftboxStorm / LuckyBoxStorm khác nhau, overview duration 90s nhưng runtime block 60s; các giá GDD cũ khác data. Các con số thời gian box là điều kiện nếu hai weather ID được map cùng event, dùng cadence này và người chơi mua toàn bộ spawn. Nếu không có mapping hoặc không mua đủ, không thể áp số giờ trên. Dòng LIMITED KIRIN weight 1 trái với note LIMITED excluded cũng cần xác nhận whitelist. Không sửa các hệ thống khác khi đang phân tích.

## Nguồn

Master Data: Weather Waves A3:E27; Fishing A1:Q37; MoleDigging A1:O37; LuckyBox Config A3:I142; Rotation Shop (2.12.1) A1:V62; MutaGen Config A3:R17 và A48:M50.
GDD: EventFishing, EventDig (4. Scan Configuration / 4.3 Chase Pity / 6. Reward Pool), EventLuckyBox runtime block, Event Frame v16, EventWindyTree.
Active Gen config: merged-gen-8-17-pool. Các cơ hội apply item chỉ có ý nghĩa khi item thực sự obtainable; không dùng 0,06% mutation tự nhiên làm rate Merchant.