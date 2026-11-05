import fs from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const root='D:/revival-prototype-ui-update',out=path.join(root,'outputs/fishing-v2');
const context={window:{}};vm.createContext(context);
for(const name of ['fishing-config.js','fishing-pool.js','gen-config.js','gen-core.js'])vm.runInContext(await fs.readFile(path.join(root,'assets',name),'utf8'),context);
const fish=context.window.FishingConfig,gen=context.window.GenConfig,core=context.window.GenCore;
const sims=JSON.parse(await fs.readFile(path.join(root,'reports/fishing-simulation.json'),'utf8'));
const col=n=>{let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;};
const palette={ink:'#23394D',blue:'#285B83',pale:'#EEF5FA',line:'#CDDFEB',input:'#FFF2CC',calc:'#17694D'};
function table(wb,name,title,subtitle,headers,rows,widths){
  const s=wb.worksheets.add(name);s.showGridLines=false;
  const last=col(headers.length-1),end=5+rows.length;
  s.getRange(`A1:${last}${Math.max(end,8)}`).format.font={name:'Arial',size:10,color:palette.ink};
  widths.forEach((width,i)=>{s.getRange(`${col(i)}1:${col(i)}${Math.max(end,8)}`).format.columnWidthPx=width;});
  s.getRange('A2').values=[[title]];s.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:palette.blue};s.getRange('A2').format.rowHeight=28;
  s.getRange('A3').values=[[subtitle]];s.getRange('A3').format.font={name:'Arial',size:10,italic:true,color:'#657D90'};s.getRange('A3').format.rowHeight=22;
  s.getRange(`A5:${last}5`).values=[headers];s.getRange(`A5:${last}5`).format={fill:palette.blue,font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},wrapText:true,horizontalAlignment:'center',verticalAlignment:'center',rowHeight:34};
  if(rows.length){
    const body=s.getRange(`A6:${last}${end}`);body.values=rows.map(row=>headers.map((_,i)=>row[i]??null));body.format.verticalAlignment='center';body.format.wrapText=true;body.format.rowHeight=27;
    rows.forEach((row,i)=>{
      const lines=Math.max(1,...row.map((v,c)=>typeof v==='string'?v.split('\n').reduce((n,p)=>n+Math.max(1,Math.ceil(p.length/Math.max(10,Math.floor(widths[c]/6.2)))),0):1));
      s.getRange(`A${i+6}:${last}${i+6}`).format.rowHeight=Math.max(27,lines*13+10);
      if(i%2===1)s.getRange(`A${i+6}:${last}${i+6}`).format.fill=palette.pale;
    });
    s.tables.add(`A5:${last}${end}`,true,'T'+name.replaceAll('_',''));
  }
  s.freezePanes.freezeRows(5);s.tabColor=palette.blue;
  return s;
}
function note(s,row,text,last='E'){s.getRange('A'+row).values=[[text]];s.getRange(`A${row}:${last}${row}`).format.font={name:'Arial',size:9,italic:true,color:'#637B8E'};s.getRange(`A${row}:${last}${row}`).format.rowHeight=20;}
const gdd=Workbook.create();
const overview=[
 ['Phạm vi','Phiên bản','Fishing GDD v2.0, cập nhật 05/11/2026. Mô tả tab 7 và cân bằng hiện tại.','Baseline prototype'],
 ['Mục tiêu','Kỹ năng + tiến trình','Ba tap quyết định số Gen; Rebirth quyết định pool pet và phân bố loại Gen phổ thông.','Đã chốt'],
 ['Mục tiêu','Bảo vệ Gen cao cấp','Fishing không mở Gen cao cấp dù full vàng hoặc Rebirth cao.','Đã chốt'],
 ['Trải nghiệm','Vòng lặp','Đủ điều kiện → mở lượt → 3 tap → xem pet + Gen → Mua hoặc Thả.','Đã chốt'],
 ['Trải nghiệm','Giới hạn sở hữu','Câu trúng tạo offer; chỉ Mua thành công mới thêm pet vào túi.','Theo GDD gốc'],
 ['Mechanic','Tab được dùng','Chỉ tab 7 Simple QTE và debug liên quan hoạt động. Các tab Fishing khác bị khóa.','Đã có prototype'],
 ['Nguồn','Pool pet','Dùng fishing 1.0.1: 44 dòng, 42 dòng có weight dương; TUNA/SALMON bằng 0.','Master Data'],
 ['Nguồn','Danh mục Gen','Gộp 10 target MutaGen và 11 target WeatherGen thành danh mục 21 Gen.','Master Data'],
 ['Nguồn','Cân bằng Fishing','5 Gen được phép; weight theo 5 band Rebirth là cân bằng mới, không phải chance dùng MutaGen.','Cân bằng mới'],
 ['Nguồn','Giữ nguyên item','Grade S/SS/SSS, giá và base chance của item chỉ là metadata tham chiếu.','Không đổi công thức item'],
 ['Giới hạn','Rương','Chưa bật: thiếu ramp được duyệt, bảng thưởng và giá mua rương.','Chờ thiết kế'],
 ['Giới hạn','Hiệu ứng pet','Chưa chốt công thức cộng/nhân chỉ số khi gộp weather effect và mutation.','Chờ thiết kế'],
 ['Giới hạn','Hệ thống thật','Prototype dùng ví/túi local và điều kiện thế giới giả lập qua debug.','Cần tích hợp server'],
 ['Tài liệu','Gameplay','Điều kiện, tap, vùng trúng, state và xử lý thất bại.','Sheet Gameplay'],
 ['Tài liệu','Rewards','Roll pet/Gen, Rebirth, giá, Mua/Thả và lưu offer.','Sheet Rewards'],
 ['Tài liệu','UI & debug','Bảng kết quả, điều khiển, mô phỏng, CSV và feedback.','Sheet UI_Debug'],
 ['Tài liệu','QA & điểm mở','Test case và quyết định còn chờ trước khi production.','Sheet QA_Decisions'],
 ['Nguồn đối chiếu','GDD gốc','[Craftland] Steal A Pet GDD.xlsx → EventFishing; MutaGen.','Nguồn kế thừa'],
 ['Nguồn đối chiếu','Master Data','[Craftland] Steal A Pet Master Data.xlsx → fishing 1.0.1; MutaGen Config; WeatherGen Config.','Nguồn dữ liệu'],
 ['Nguồn đối chiếu','Prototype hiện tại','fishing-config, fishing-pool, fishing-rewards, gen-config, gen-core, gen-debug và debug-navigation.','Snapshot 05/11/2026'],
 ['File Data','Cách dùng','Fishing_Data_v2.xlsx chứa config, pet pool, Gen pool, grades, 27 tap patterns và 30 bộ kết quả mẫu.','Tách khỏi GDD'],
 ['File Data','Đồng bộ runtime','Sửa Excel không tự cập nhật website; cần export và review config trước khi đưa vào game.','Quy trình vận hành']
];
table(gdd,'Overview','Fishing GDD v2.0','Baseline thiết kế và trạng thái tích hợp',[ 'Nhóm','Hạng mục','Nội dung','Trạng thái'],overview,[150,185,650,165]);
const gameplay=[
 ['Điều kiện','Thời tiết','Chỉ HighTide hoặc HeavyRain cho phép mở lượt mới. Rainy thường không đủ.','Chặn Cast; không trừ tiền'],
 ['Điều kiện','Vị trí','Ngoài trời, hướng tới mặt nước hợp lệ. Prototype dùng checkbox debug.','Production kiểm tra server'],
 ['Điều kiện','Offer đang chờ','Không cho mở lượt khác khi chưa Mua hoặc Thả offer hiện tại.','Không reroll'],
 ['Điều kiện','Chi phí Cast','Mở lượt miễn phí. Chỉ trừ Money khi Mua offer.','CastCost = 0'],
 ['Bắt đầu','Tap mở lượt','Tap khi idle bắt đầu QTE; tap này không tính vào 3 chấm kết quả.','Sau đó có đúng 3 tap chấm điểm'],
 ['Bắt đầu','Snapshot Rebirth','Chốt Rebirth và phiên bản pet pool lúc mở lượt. Gen cũng dùng Rebirth này.','Đổi debug chỉ ảnh hưởng lượt sau'],
 ['Vòng chạy','Chu kỳ','Con trỏ hình cá chạy theo vòng; mặc định 2,25 giây/vòng.','Debug: 3 / 2,25 / 1,75 giây'],
 ['Vòng chạy','Vùng xanh','Offset tương đối từ đầu arc: [0; 0,20], tức 20% chu vi.','Good; +20 điểm Gen'],
 ['Vòng chạy','Vùng vàng','Offset tương đối: [0,45; 0,53], tức 8% chu vi.','Excellent; +40 điểm Gen'],
 ['Vòng chạy','Vùng còn lại','Bấm ngoài xanh/vàng là Miss; không có một cung đỏ riêng.','+0 điểm; chấm đỏ'],
 ['Chấm điểm','Công thức offset','Offset = (Marker − ArcStart + 1) mod 1. Mốc biên xanh/vàng được tính trúng.','Tính tại thời điểm tap'],
 ['Chấm điểm','Ba kết quả','Mỗi tap ghi một chấm xanh/vàng/đỏ, không xóa hoặc trừ chấm trước đó.','Tap trượt vẫn dùng một lượt'],
 ['Chấm điểm','Kết thúc','Sau tap chấm điểm thứ ba: reveal đúng một pet offer.','Không cần đủ 3 hit'],
 ['Chấm điểm','Full đỏ','Vẫn có pet offer, không có Gen.','Không tiêu tiền Cast'],
 ['Chấm điểm','Điểm Gen','Tổng ba tap: 0–120. Không tích lũy sang lượt khác.','Reset ở lượt mới'],
 ['Vị trí vùng','Lúc mở lượt','ArcStart ngẫu nhiên từ 0 đến dưới 1.','Không phụ thuộc Rebirth'],
 ['Vị trí vùng','Sau hit thứ 1/2','ArcStart = (ArcStart + 0,25 + Random×0,5) mod 1.','Chỉ đổi sau hit'],
 ['Vị trí vùng','Sau miss','Giữ nguyên vị trí xanh/vàng.','Không đổi theo thời gian'],
 ['Nhịp chơi','Cooldown','Không khóa tap theo vòng quay; không cooldown riêng.','Giữ thao tác nhanh'],
 ['Nhịp chơi','Timeout','Tab 7 không có timeout gameplay tự động.','Chờ đủ 3 tap'],
 ['Thiết bị','Touch','Chặn long-press select/callout/context menu; tránh click touch bị tính hai lần.','Một hành động = một tap'],
 ['Thiết bị','Ẩn trang','Dừng/pause vòng cập nhật và feedback; không tự roll offer khác.','Tiếp tục khi quay lại'],
 ['Thời tiết','Kết thúc wave','Không mở lượt mới; lượt đã mở và offer đang chờ vẫn được giải quyết.','Theo GDD gốc'],
 ['State','Idle','Hiện vòng, TAP, ba chấm rỗng và chỉ số Gen.','Chờ tap mở lượt'],
 ['State','Active','Chạy con trỏ, nhận đúng ba tap, cộng điểm và feedback.','Không có offer khác'],
 ['State','Pending offer','Hiện bảng kết quả; khóa thao tác QTE cho tới Mua/Thả.','Không tự đóng theo timer'],
 ['State','Resolved','Mua thành công hoặc Thả → trở lại idle.','Một CatchID chỉ giải quyết một lần']
];
table(gdd,'Gameplay','Gameplay & điều kiện câu','3 tap chấm điểm; không hold, stamina hoặc cooldown',['Nhóm','Hạng mục','Quy tắc','Kết quả / giới hạn'],gameplay,[145,180,650,220]);
const rewardRows=[
 ['Thứ tự roll','1. Kết thúc tap','Lấy điểm Gen 0–120 và Rebirth đã snapshot.','Đúng 3 tap'],
 ['Thứ tự roll','2. Số Gen','floor(Điểm/100) + một lần roll phần dư. Tối đa 2 Gen.','Không phụ thuộc Rebirth'],
 ['Thứ tự roll','3. Loại Gen','Weighted draw không hoàn lại từ 5 Gen được phép ở band Rebirth.','Không trùng Gen trên cùng pet'],
 ['Thứ tự roll','4. Pet','Weighted draw từ cột weight của fishing 1.0.1 đúng band Rebirth.','Chuẩn hóa tổng weight thực'],
 ['Thứ tự roll','5. Stamp offer','Lưu CatchID, PetID, rarity, giá, Rebirth, phiên bản pool, điểm và Gen.','Không reroll khi mở lại'],
 ['Pet pool','5 band','R1–R4 / R5–R8 / R9–R13 / R14–R18 / R19+.','Weight và tỉ lệ trong Data'],
 ['Pet pool','Zero weight','TUNA và SALMON không rơi ở mọi band hiện tại.','Không fallback đều'],
 ['Pet pool','Rarity pet','Điểm tap/Gen không nhân xác suất rarity pet; dùng nguyên bảng đã chọn.','Tách số Gen khỏi độ hiếm pet'],
 ['Gen','Pool phổ thông','Golden, Soaked, Frozen, Frost, Gale. Frozen và Frost là hai target khác nhau.','5/21 Gen mở'],
 ['Gen','Pool bị khóa','16 target còn lại luôn có xác suất 0 trong Fishing.','Không mở bằng vàng/Rebirth'],
 ['Gen','100 điểm','Bảo đảm đúng 1 Gen từ pool phổ thông.','Không bảo đảm Gen hiếm'],
 ['Gen','120 điểm','1 Gen chắc chắn + 20% nhận thêm Gen thứ hai khác loại.','Không tăng tier'],
 ['Gen','60 điểm','60% nhận 1 Gen; 40% không có Gen.','Full xanh'],
 ['Gen','Rebirth','R1: Golden/Soaked chiếm 85% lượt chọn đầu; R19+: 73%.','Đa dạng tăng dần trong whitelist'],
 ['Gen','Lượt chọn thứ hai','Loại Gen đã chọn bị loại khỏi pool; chuẩn hóa lại weight còn lại.','Không dùng lại tỉ lệ lượt đầu'],
 ['Gen','Tương thích effect','Danh mục phần thưởng gộp chung; công thức áp effect/chỉ số còn chờ game.','Không tự cộng/nhân multiplier'],
 ['Kinh tế','Giá pet','ClaimPrice = SpawnPrice × ClaimK (1,10). Prototype lưu cent nguyên, làm tròn half-up tới cent.','Production cần chốt đơn vị Money'],
 ['Kinh tế','Giá và Gen','Giá offer hiện dùng giá pet gốc; không cộng phụ phí Gen.','Quy tắc prototype; cần review EV'],
 ['Kinh tế','Mua','Kiểm tra CatchID, tiền, sức chứa; trừ đúng giá đã stamp rồi cấp đúng pet + Gen.','Không roll lại khi Mua'],
 ['Kinh tế','Không đủ tiền','Giữ offer, không cấp pet hoặc trừ tiền.','Có thể Thả miễn phí'],
 ['Kinh tế','Túi đầy','Không trừ tiền; giữ offer cho tới có chỗ hoặc người chơi Thả.','Không tự thay pet'],
 ['Kinh tế','Thả','Hủy offer, không cộng pet/Gen và không trừ tiền.','Không có điểm carry'],
 ['Lưu trữ','Reload','Khôi phục cùng CatchID, pet, Gen và giá đang chờ.','Prototype localStorage'],
 ['Lưu trữ','Offer cũ','Giữ reward đã stamp trước khi đổi phiên bản cân bằng.','Không hồi tố reroll'],
 ['Production','Giao dịch','Server làm chủ RNG, snapshot, CatchID và transaction; một offer mỗi người chơi.','Cần tích hợp'],
 ['Production','Destination','Base / Event Pet Inventory phải có tuyến nhận, capacity và trạng thái lỗi rõ.','Prototype dùng túi thử local'],
 ['Production','Chase cap','Pool mới có APEX vượt cap <0,05% trong GDD cũ; chưa tự sửa weight.','PO cần duyệt']
];
table(gdd,'Rewards','Pet, Gen & Mua/Thả','Cân bằng Gen mới; pool pet kế thừa fishing 1.0.1',['Nhóm','Hạng mục','Quy tắc','Giới hạn / trạng thái'],rewardRows,[150,180,650,220]);
const uiRows=[
 ['Gameplay','Vòng QTE','Dùng reel artwork; con trỏ hình cá; vùng xanh/vàng rõ. Giữ background game sáng.','Chỉ tab 7 mở'],
 ['Gameplay','TAP và ba chấm','Trong vòng chỉ TAP và 3 chấm. Dùng nút tap sẵn trong cảnh.','Không thêm nút trùng'],
 ['Gameplay','Mutation Luck','Badge gọn thể hiện điểm/phần trăm hiện tại. ≥100 hiện bảo đảm 1 + phần dư.','Không thêm bảng 21 icon'],
 ['Kết quả','Một bảng','Header ĐÃ BẮT ĐƯỢC CÁ; rarity, tên pet; Gen nằm ngay dưới tên.','Bỏ banner và bảng Gen rời'],
 ['Kết quả','Thông tin mua','Giá Money và hai nút Thả/Mua; không hiện dòng tiền hiện có.','Chỉ hiện lỗi khi cần'],
 ['Feedback','Xanh','Feedback nhẹ, chấm xanh, +20 điểm.','Rõ nhưng không che vòng'],
 ['Feedback','Vàng','Feedback mạnh nhất, chấm vàng, +40 điểm, glow/particles/pháo hoa.','Tôn trọng reduced motion'],
 ['Feedback','Đỏ','Chấm đỏ, juice miss và âm fail tab 7; không trừ điểm đã có.','Không làm lệch tâm vòng'],
 ['Feedback','Âm/rung','Có bật/tắt, mức rung và thử rung; phụ thuộc khả năng thiết bị/browser.','Không cam kết phần cứng rung'],
 ['Điện thoại','Điều khiển','Rotate/fullscreen và hit area touch. Không chọn chữ khi giữ nút lâu.','Test layout và touch'],
 ['Debug','3 mục','Mô phỏng / Chơi thử / Danh mục Gen. Giữ kết quả khi đổi tab debug.','Một mục hiển thị mỗi lúc'],
 ['Debug','Chơi thử','Tốc độ, vòng chạy, chơi lại, pause, frame step, đổi vùng, force win/fail, khôi phục.','Chỉ điều khiển tab 7'],
 ['Debug','Điều kiện','Rebirth, thời tiết, ngoài trời, hướng nước; tiền/capacity trong mục thu gọn.','Không phải validation server'],
 ['Mô phỏng','Mặc định','1.000 lượt, Full vàng, Rebirth 1; có preset đỏ/xanh/vàng và 6 kịch bản.','Dễ kiểm nhanh'],
 ['Mô phỏng','Số lượt','1.000 / 10.000 / 100.000 / 1.000.000 cho mỗi bộ kịch bản × band.','Hiện tổng lượt trước khi chạy'],
 ['Mô phỏng','So sánh Rebirth','Chạy R1 / R5 / R9 / R14 / R19. Không thay Rebirth của lượt đang chơi.','Tối đa 30 bộ với 6 kịch bản'],
 ['Mô phỏng','Nâng cao','Seed cố định và mix tap đỏ/xanh/vàng; tổng mix phải bằng 100%.','Mix chỉ dùng khi random/all'],
 ['Mô phỏng','Thuật toán','Dùng cùng pick pet, count Gen và choose Gen như live play.','Không mô phỏng affordability'],
 ['Mô phỏng','Kết quả','Chọn một run; tabs Tổng quan / Pet / Gen / Pet+Gen / Từng lượt.','Bấm dòng tổng quan để xem Pet'],
 ['Mô phỏng','Chỉ số','Lượt câu, số loại pet, số pet có Gen, số pet có 2 Gen.','Gen incidence tính / lượt'],
 ['Mô phỏng','Nhật ký','Lượt, Rebirth, 3 tap, điểm, PetID, rarity, Gen và giá. Tìm pet/lọc Gen/phân trang.','50 dòng/trang'],
 ['Mô phỏng','Giới hạn log','Browser giữ tối đa 10.000 dòng đầu mỗi run; thống kê vẫn tính đủ toàn bộ.','1.000 lượt giữ đủ 1.000 dòng'],
 ['Mô phỏng','Dừng/CSV','Có Dừng; đánh dấu kết quả partial. Xuất CSV tổng hợp hoặc nhật ký đã lọc.','Không thay ví/túi/offer'],
 ['Mô phỏng','RNG so sánh','Cùng seed + mode + Rebirth + pattern/mix tái lập cùng kết quả.','Gen-only khác RNG full pet+Gen'],
 ['Danh mục','21 Gen','Hiện tên, family, nhóm, trạng thái khóa và metadata S; có bảng tỉ lệ 5 Rebirth.','Galaxy/Aurora thiếu giá/chance']
];
table(gdd,'UI_Debug','UI, feedback & debug','Giữ giao diện gọn; dữ liệu chi tiết nằm trong debug',['Nhóm','Hạng mục','Đặc tả','Ghi chú'],uiRows,[145,180,650,220]);
const qaRows=[
 ['QA01','Full đỏ','Sau 3 tap vẫn đúng 1 pet offer, 0 Gen, không trừ Money.','Prototype'],
 ['QA02','Full xanh','Điểm 60; xác suất 1 Gen 60%; không có 2 Gen.','Prototype'],
 ['QA03','Full vàng','Điểm 120; luôn có ≥1 Gen, 20% có 2 Gen khác nhau.','Prototype'],
 ['QA04','Biên vùng','Offset 0 / 0,20 là xanh; 0,45 / 0,53 là vàng; ngoài là đỏ.','Prototype'],
 ['QA05','Vùng ngẫu nhiên','Chỉ đổi sau hit thứ 1/2; miss và thời gian không đổi arc.','Prototype'],
 ['QA06','Đếm tap','Touch và click tổng hợp không tính hai lần; activation tap không tính điểm.','Prototype'],
 ['QA07','Rebirth snapshot','Đổi Rebirth giữa lượt không thay pool pet hoặc Gen của lượt đang chạy.','Prototype'],
 ['QA08','Hard lock Gen','16 Gen bị khóa xuất hiện 0 lần ở mọi Rebirth và mọi pattern.','Prototype'],
 ['QA09','Pet zero weight','TUNA/SALMON không xuất hiện ở bất kỳ band.','Prototype'],
 ['QA10','Mua','Trừ đúng giá stamp một lần; pet + Gen đúng offer; không reroll.','Prototype + server'],
 ['QA11','Thả','Không trừ tiền/cấp pet; offer hết chặn cast sau Thả.','Prototype + server'],
 ['QA12','Thiếu tiền/túi đầy','Không trừ tiền hoặc mất offer; còn đường xử lý.','Prototype + server'],
 ['QA13','Reload pending','Cùng CatchID, pet, Gen, giá; không có offer thứ hai.','Prototype + server'],
 ['QA14','Thời tiết kết thúc','Chặn lượt mới; lượt đang mở và pending vẫn resolve được.','Prototype + server'],
 ['QA15','Mô phỏng 1.000 lượt','Đủ 1.000 log; tổng pet = tổ hợp = số lượt; count Gen khớp số Gen trên pet.','Đã chạy 30 bộ mẫu'],
 ['QA16','Seed','Cùng input tái lập kết quả; khác Rebirth có phân bố đúng band.','Prototype'],
 ['QA17','Nhật ký lớn','Giới hạn log được ghi rõ; không cắt thống kê tổng.','Prototype'],
 ['QA18','Mô phỏng độc lập','Chạy, Dừng và CSV không thay Money, inventory hoặc pending hiện tại.','Prototype'],
 ['QA19','Debug navigation','Chuyển tab không mất settings/results; seed/mix nâng cao đúng ngữ cảnh.','Prototype'],
 ['QA20','Touch/layout','Không overflow trang ở 390px; bảng debug cuộn riêng; nút vẫn bấm được.','Emulated; cần máy thật'],
 ['DEC01','Chốt cân bằng Gen','Duyệt 5 profile weight; không coi số liệu prototype là cân bằng đã release.','PO cần duyệt'],
 ['DEC02','Cap chase pet','Duyệt pool mới so với cap <0,05% và whitelist trong GDD cũ.','PO cần quyết định'],
 ['DEC03','Chỉ số Gen','Chốt GameEffectID, xung đột, stacking, giá trị/income và cách hiển thị trên pet.','Chưa có công thức hợp nhất'],
 ['DEC04','Giá có Gen','Review EV và ClaimK khi pet có 1/2 Gen; hiện chưa có phụ phí Gen.','Cần balance economy'],
 ['DEC05','Rương','Chốt contents/prices/ramp và 9/17/30 hay legacy; hiện để tắt.','Chờ dữ liệu'],
 ['DEC06','Server & inventory','Tích hợp vị trí, wave, RNG, CatchID, atomic buy, capacity, Base/buffer và reconnect.','Chưa phải production'],
 ['DEC07','Money precision','Chốt Money nguyên hay cent; không lưu giá lớn bằng floating point/Excel numeric.','Data dùng exact string'],
 ['DEC08','Metadata thiếu/lệch','Galaxy/Aurora thiếu giá/chance; Gale S=60, SS=40, SSS=70 không tăng đều.','Giữ nguyên nguồn; cần review']
];
table(gdd,'QA_Decisions','QA & quyết định còn mở','Tách rõ prototype đã có và yêu cầu trước production',['ID','Tình huống','Kết quả mong đợi / việc cần chốt','Phạm vi'],qaRows,[95,200,650,220]);

const data=Workbook.create();
const ruleRows=[
 ['ScoredTaps',3,'tap','Đã chốt','Tap mở lượt không tính vào 3 tap chấm điểm.'],
 ['GreenPoints',20,'điểm','Đã chốt','Good cộng 20 điểm phần trăm.'],
 ['GoldPoints',40,'điểm','Đã chốt','Excellent cộng 40 điểm phần trăm.'],
 ['RedPoints',0,'điểm','Đã chốt','Miss không trừ điểm và vẫn nhận pet offer sau đủ tap.'],
 ['MaxGen',2,'Gen/pet','Đã chốt','Không trùng ID Gen trên cùng pet.'],
 ['CarryProgress',false,'boolean','Đã chốt','Không giữ điểm dư sang lượt khác.'],
 ['LapSeconds',2.25,'giây/vòng','Prototype','Debug có 3 / 2,25 / 1,75.'],
 ['GreenArcStart',0,'fraction','Prototype','Offset tương đối từ ArcStart.'],
 ['GreenArcWidth',0.20,'fraction','Prototype','Biên 0 và 0,20 được tính xanh.'],
 ['GoldArcStart',0.45,'fraction','Prototype','Tách riêng với xanh.'],
 ['GoldArcWidth',0.08,'fraction','Prototype','Biên 0,45 và 0,53 được tính vàng.'],
 ['ArcAdvanceMin',0.25,'fraction','Prototype','Sau hit thứ 1/2.'],
 ['ArcAdvanceMax',0.75,'fraction','Prototype','Cận trên không bao gồm; miss không đổi vùng.'],
 ['CooldownSeconds',0,'giây','Đã chốt','Không one-hit-per-revolution guard.'],
 ['TimeoutEnabled',false,'boolean','Prototype','Không timeout tự động cho tab 7.'],
 ['CastCost',0,'Money','GDD gốc','Mua offer mới trừ tiền.'],
 ['ClaimK',1.10,'multiplier','Master Data','Giá cơ sở; chưa cộng phụ phí Gen.'],
 ['AllowedWeather','HighTide, HeavyRain','enum','GDD gốc','Rainy đơn lẻ không đủ điều kiện.'],
 ['SnapshotRebirth',true,'boolean','Đã có','Cả pet và Gen dùng Rebirth lúc Cast.'],
 ['MaxPendingOffer',1,'offer/người','GDD gốc','Chặn Cast đến khi Mua hoặc Thả.'],
 ['ChestsEnabled',false,'boolean','Chờ dữ liệu','Không tự tạo contents, giá hoặc ramp mới.'],
 ['DefaultSimCasts',1000,'lượt/run','Debug','Mặc định Full vàng, Rebirth 1.'],
 ['MaxSimCasts',1000000,'lượt/run','Debug','6 kịch bản × 5 Rebirth có thể tạo 30 run.'],
 ['DefaultSeed',20261105,'uint32','Debug','Seed chỉ tái lập khi giữ nguyên mode/config/input.'],
 ['BrowserLogLimit',10000,'dòng/run','Debug','Thống kê tổng luôn tính đủ mọi lượt.'],
 ['CliLogLimit',1000,'dòng/run','Debug','CLI full fishing giữ tối đa 1.000 dòng mỗi run.'],
 ['LogPageSize',50,'dòng/trang','Debug','Lọc pet/Gen và CSV nhật ký đã lọc.'],
 ['GenConfigVersion',gen.version,'string','Prototype','5 Gen mở; 16 Gen khóa ở mọi Rebirth.'],
 ['PetConfigVersion',fish.version,'string','Master Data','44 pet rows; 42 có weight dương.'],
 ['BalanceStatus','Prototype baseline','status','Cân bằng mới','Weight Gen cần review; không phải drop rate gốc của MutaGen.'],
 ['PriceStorage','Exact decimal string','type','Precision','SpawnPrice/ClaimCents là text vì Excel chỉ giữ ~15 chữ số số học.'],
 ['EffectStacking','TBD','decision','Chưa chốt','Chưa có GameEffectID/stacking/income chung cho weather + mutation.'],
 ['ExcelToRuntime','Manual review + export','workflow','Không đồng bộ tự động','Thay ô Excel không tự sửa website hoặc server.']
];
const rules=table(data,'Rules','Fishing Data v2.0','Ngày 05/11/2026 · config đang dùng và cân bằng mới',['Key','Value','Unit','Origin','Meaning'],ruleRows,[210,200,125,150,590]);
const ruleCell=Object.fromEntries(ruleRows.map((row,i)=>[row[0],'Rules!$B$'+(i+6)]));
rules.getRange('B7:B9').format.fill=palette.input;rules.getRange('B6:B32').format.font.color=palette.ink;
rules.dataValidations.add({range:'B7:B9',rule:{type:'whole',operator:'between',formula1:0,formula2:40}});
rules.getRange('B12').setNumberFormat('0.00');rules.getRange('B22').setNumberFormat('0.00');
note(rules,42,'Source: user-approved prototype 05/11/2026; fishing-config.js; gen-config.js; gen-core.js.');
note(rules,43,'Source: [Craftland] Steal A Pet Master Data.xlsx — fishing 1.0.1!A1:R46; MutaGen Config!A23:M53; WeatherGen Config!A23:G56.');
note(rules,44,'Source: [Craftland] Steal A Pet GDD.xlsx — EventFishing!A12:D107; MutaGen!A4:C25.');
const pets=table(data,'PetPool','Pet pool · fishing 1.0.1','Source: Master Data, fishing 1.0.1!A1:R46 · exact-price columns are text',['ID','Pet','Rank','Rarity','Tag','SpawnPrice exact','ClaimK','ClaimCents exact',...fish.bands.map(b=>'Weight '+b.label),...fish.bands.map(b=>'Rate '+b.label)],fish.pets.map(p=>[p.id,p.name,p.rank,p.rarity,p.tier,p.spawnPrice,Number(p.claimK),p.claimCents,...p.weights,...Array(5).fill(null)]),[75,230,75,120,90,210,80,230,...Array(5).fill(125),...Array(5).fill(120)]);
pets.freezePanes.freezeColumns(2);pets.getRange('F6:F49').setNumberFormat('@');pets.getRange('H6:H49').setNumberFormat('@');pets.getRange('G6:G49').setNumberFormat('0.00');pets.getRange('I6:M49').setNumberFormat('#,##0');
for(let i=0;i<44;i++)for(let b=0;b<5;b++){const r=i+6,w=col(8+b);pets.getCell(r-1,13+b).formulas=[[`=${w}${r}/SUM(${w}$6:${w}$49)`]];}
pets.getRange('N6:R49').setNumberFormat('0.0000%');pets.getRange('N6:R49').format.font.color=palette.calc;
pets.getRange('H52').values=[['Totals']];for(let b=0;b<5;b++){pets.getCell(51,8+b).formulas=[[`=SUM(${col(8+b)}6:${col(8+b)}49)`]];pets.getCell(51,13+b).formulas=[[`=SUM(${col(13+b)}6:${col(13+b)}49)`]];}pets.getRange('I52:M52').setNumberFormat('#,##0');pets.getRange('N52:R52').setNumberFormat('0.00%');
const catalog=table(data,'GenCatalog','Shared Gen catalog','Source targets: MutaGen Config + WeatherGen Config; internal icon IDs are retained',['ID','Target name','Original family','Fishing tier','Enabled (1/0)','Source configured','Icon kind','Icon asset','Atlas col','Atlas row','Source sheet','GameEffectID'],gen.catalog.map(g=>[g.id,g.name,g.family,g.tier,g.fishingEnabled?1:0,g.configured,g.icon.file?'file':'atlas',g.icon.file||'assets/mutations/gen-atlas.png',g.icon.atlas===undefined?null:g.icon.atlas%4,g.icon.atlas===undefined?null:Math.floor(g.icon.atlas/4),g.source.sheet,null]),[130,155,135,125,120,125,90,290,95,95,170,140]);
catalog.getRange('E6:E26').dataValidation={rule:{type:'list',values:['1','0']}};
note(catalog,29,'GameEffectID chưa chốt; không dùng internal icon ID thay cho ID effect server. Frozen và Frost là hai target riêng.');
const weightRows=gen.catalog.map((g,i)=>[g.id,g.name,null,...gen.rebirthProfiles.map(p=>p.weights[g.id]||0),...Array(5).fill(null),null]);
const weights=table(data,'GenWeights','Gen weights by Rebirth','Authored Fishing balance v2; locked catalog entries are excluded from eligible totals',['ID','Gen','Enabled',...gen.rebirthProfiles.map(p=>'Weight '+p.label),...gen.rebirthProfiles.map(p=>'Rate '+p.label),'Validation'],weightRows,[125,155,100,...Array(5).fill(125),...Array(5).fill(120),230]);
for(let i=0;i<21;i++){
 const r=i+6;weights.getRange('C'+r).formulas=[[`=GenCatalog!E${r}`]];
 for(let b=0;b<5;b++){const w=col(3+b);weights.getCell(r-1,8+b).formulas=[[`=IF($C${r},${w}${r}/SUMIFS(${w}$6:${w}$26,$C$6:$C$26,1),0)`]];}
 weights.getRange('N'+r).formulas=[[`=IF(AND(C${r}=0,SUM(D${r}:H${r})>0),"Blocked weight ignored","")`]];
 if(gen.catalog[i].fishingEnabled)weights.getRange(`D${r}:H${r}`).format.fill=palette.input;
}
weights.getRange('D6:H26').setNumberFormat('#,##0');weights.getRange('I6:M26').setNumberFormat('0.00%');weights.getRange('I6:M26').format.font.color=palette.calc;
weights.getRange('N6:N26').conditionalFormats.add('containsText',{text:'Blocked',format:{fill:'#FCE4D6',font:{color:'#9C3A21'}}});
weights.getRange('B29').values=[['Eligible total']];weights.getRange('B30').values=[['Probability sum']];
for(let b=0;b<5;b++){const w=col(3+b);weights.getCell(28,3+b).formulas=[[`=SUMIFS(${w}6:${w}26,$C$6:$C$26,1)`]];weights.getCell(29,8+b).formulas=[[`=SUM(${col(8+b)}6:${col(8+b)}26)`]];}
weights.getRange('D29:H29').setNumberFormat('#,##0');weights.getRange('I30:M30').setNumberFormat('0.00%');
note(weights,33,'Yellow = authored editable weight. Formula rates normalize eligible weights only; second Gen draw removes the first type and renormalizes.');
const gradeRows=gen.catalog.flatMap(g=>g.source.grades.map(row=>[g.id,g.name,g.family,row.grade,row.petCoinCost,row.baseChance,g.source.sheet,row.row,row.petCoinCost!==null&&row.baseChance!==null]));
const grades=table(data,'GenGrades','Original item grade metadata','Source: Master Data, MutaGen Config!A23:M53 and WeatherGen Config!A23:G56',['ID','Target','Family','Grade','Pet Coin cost','Base apply chance','Source sheet','Source row','Configured'],gradeRows,[130,155,130,80,135,150,190,100,110]);grades.getRange('E6:E68').setNumberFormat('#,##0');grades.getRange('F6:F68').setNumberFormat('0.00%');
note(grades,71,'Blank = missing in source, not zero. These are item base chances before pet/Secret multipliers and clamps; not Fishing draw rates.');
const tapRows=[];for(const a of ['red','green','gold'])for(const b of ['red','green','gold'])for(const c of ['red','green','gold'])tapRows.push(['P'+String(tapRows.length+1).padStart(2,'0'),a,b,c,...Array(7).fill(null)]);
const taps=table(data,'TapOutcomes','All 27 three-tap outcomes','Live formulas linked to Rules; no carry and at most two distinct Gen',['Pattern','Tap 1','Tap 2','Tap 3','Points','P(0 Gen)','P(1 Gen)','P(2 Gen)','P(any Gen)','Expected Gen','P sum'],tapRows,[90,100,100,100,100,120,120,120,125,130,100]);
for(let i=0;i<27;i++){
 const r=i+6,score=['B','C','D'].map(c=>`IF(${c}${r}="gold",${ruleCell.GoldPoints},IF(${c}${r}="green",${ruleCell.GreenPoints},${ruleCell.RedPoints}))`).join('+');
 taps.getRange('E'+r).formulas=[['='+score]];taps.getRange(`F${r}:K${r}`).formulas=[[`=1-MIN(1,E${r}/100)`,`=MIN(1,E${r}/100)-MAX(0,E${r}/100-1)`,`=MAX(0,E${r}/100-1)`,`=1-F${r}`,`=G${r}+2*H${r}`,`=SUM(F${r}:H${r})`]];
}
taps.getRange('B6:D32').dataValidation={rule:{type:'list',values:['red','green','gold']}};taps.getRange('B6:D32').format.fill=palette.input;taps.getRange('F6:I32').setNumberFormat('0.00%');taps.getRange('K6:K32').setNumberFormat('0.00%');taps.getRange('J6:J32').setNumberFormat('0.00');taps.getRange('E6:K32').format.font.color=palette.calc;
const simRows=sims.reports.map(r=>[r.rebirth,r.band,r.name,r.seed,r.iterations,r.none,r.one,r.two,null,1-r.expected.none,Object.keys(r.petCounts).length,0]);
const sim=table(data,'Simulation','Full pet + Gen simulation sample','Seed 20261105 · 1,000 casts × 6 scenarios × 5 Rebirth bands; revealed offers, before buying',['Rebirth','Band','Scenario','Seed','Casts','No Gen','One Gen','Two Gen','Any observed','Any expected','Unique pets','Locked Gen'],simRows,[100,120,230,135,110,110,110,110,140,140,125,120]);
for(let i=0;i<30;i++){const r=i+6;sim.getRange('I'+r).formulas=[[`=(G${r}+H${r})/E${r}`]];}
sim.getRange('D6:H35').setNumberFormat('#,##0');sim.getRange('I6:J35').setNumberFormat('0.0000%');sim.getRange('I6:I35').format.font.color=palette.calc;
note(sim,38,'Sample output snapshot, not drop-rate inputs. Re-run the simulator after changing balance. Full logs remain in reports/fishing-casts.csv.');

// Check linked calculations using temporary edits, then restore baseline before export.
rules.getRange('B7').values=[[10]];assert.equal(taps.getRange('E19').values[0][0],30);rules.getRange('B7').values=[[20]];
weights.getRange('D6').values=[[0]];assert.equal(weights.getRange('I6').values[0][0],0);assert(Math.abs(weights.getRange('I10').values[0][0]-5000/450000)<1e-9);weights.getRange('D6').values=[[550000]];
catalog.getRange('E6').values=[[0]];assert.equal(weights.getRange('I6').values[0][0],0);catalog.getRange('E6').values=[[1]];
const originalPetWeight=fish.pets[0].weights[0];pets.getRange('I6').values=[[0]];assert.equal(pets.getRange('N6').values[0][0],0);pets.getRange('I6').values=[[originalPetWeight]];
// Final calculation after restoring all temporary values.
gdd.recalculate();data.recalculate();
assert.equal(data.worksheets.getItem('TapOutcomes').getRange('E6').values[0][0],0);
assert.equal(data.worksheets.getItem('TapOutcomes').getRange('E19').values[0][0],60);
assert.equal(data.worksheets.getItem('TapOutcomes').getRange('E32').values[0][0],120);
assert(Math.abs(taps.getRange('H32').values[0][0]-.2)<1e-10);
for(let b=0;b<5;b++){assert.equal(weights.getCell(28,3+b).values[0][0],1000000);assert(Math.abs(weights.getCell(29,8+b).values[0][0]-1)<1e-9);assert(Math.abs(pets.getCell(51,13+b).values[0][0]-1)<1e-9);}
console.log((await data.inspect({kind:'table',range:'TapOutcomes!E30:K32',tableMaxRows:3,tableMaxCols:7,maxChars:1500})).ndjson);
console.log((await data.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:20},summary:'Formula errors',maxChars:1200})).ndjson);
await fs.mkdir(path.join(out,'previews'),{recursive:true});
for(const [wb,sheets] of [[gdd,['Overview','Gameplay','Rewards','UI_Debug','QA_Decisions']],[data,['Rules','PetPool','GenCatalog','GenWeights','GenGrades','TapOutcomes','Simulation']]]){
 for(const name of sheets){const preview=await wb.render({sheetName:name,range:name==='PetPool'?'A1:M13':name==='GenCatalog'?'A1:G14':name==='GenWeights'?'A1:M12':name==='GenGrades'?'A1:I14':name==='TapOutcomes'?'A1:K15':name==='Simulation'?'A1:L14':name==='Rules'?'A1:E15':'A1:D14',scale:1,format:'png'});await fs.writeFile(path.join(out,'previews',name+'.png'),new Uint8Array(await preview.arrayBuffer()));}
}
await (await SpreadsheetFile.exportXlsx(gdd)).save(path.join(out,'Fishing_GDD_v2.xlsx'));
await (await SpreadsheetFile.exportXlsx(data)).save(path.join(out,'Fishing_Data_v2.xlsx'));
console.log('Exported GDD (5 sheets) and Data (7 sheets); formulas and 12 previews verified.');
