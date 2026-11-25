import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const dir=new URL('.',import.meta.url);
const cfg=JSON.parse(await fs.readFile(new URL('base-lock-config.v3.json',dir),'utf8'));
const wb=Workbook.create();
const fixes=wb.worksheets.add('Sai lech v2');
const items=wb.worksheets.add('Khoa va Aura');
const integ=wb.worksheets.add('He thong lien quan');
const sync=wb.worksheets.add('Master Data sync');
const feedback=wb.worksheets.add('Phan hoi nap');
const sim=wb.worksheets.add('Mo phong');

function base(sheet,range,widths,title){
 sheet.showGridLines=false;
 sheet.getRange(range).format.font={name:'Arial',size:11,color:'#233B50'};
 sheet.getRange(range).format.rowHeight=28;sheet.getRange(range).format.verticalAlignment='center';
 widths.forEach((width,i)=>sheet.getRangeByIndexes(0,i,Number(range.match(/\d+$/)[0]),1).format.columnWidth=width);
 sheet.getRange('A2').values=[[title]];sheet.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:'#173F68'};
}
function header(sheet,row,labels){const r=sheet.getRangeByIndexes(row-1,0,1,labels.length);r.values=[labels];r.format.fill='#245481';r.format.font={name:'Arial',size:11,bold:true,color:'#FFFFFF'};r.format.horizontalAlignment='center';r.format.rowHeight=30;}
function note(sheet,range,text){sheet.getRange(range.split(':')[0]).values=[[text]];sheet.getRange(range).format.font={italic:true,size:10,color:'#637D94'};}

/* --- 1. Sai lech v2 --- */
base(fixes,'A1:D14',[26,54,58,48],'Sáu điểm v1/v2 làm sai');fixes.tabColor='#A33B3B';
note(fixes,'A3:D3','Đối chiếu với GDD và Master Data chính thức ngày 25/11/2026. Cột C là câu chữ trong file nguồn.');
header(fixes,5,['Hạng mục','v1 / v2 viết','Nguồn chính thức','Sửa ở v3']);
const fixRows=[
 ['Thời lượng khóa','Cộng 2 / 5 / 10 phút, không nêu rủi ro','Rebirth 2.2!BaseLockTime = 30-160 giây theo RB; passive Stronghold chỉ +1-5 giây','Giữ thang phút theo quyết định 25/11/2026; phải chốt một cách bù'],
 ['Chặn người lạ','Chặn người lạ vào base khi đang bảo vệ','UnlockCost: "Enter any base freely"','Khóa chỉ chặn mở cửa để trộm, không chặn đi vào'],
 ['Đẩy người lạ ra','Cảnh báo 3 giây rồi đưa ra điểm an toàn','Không có cơ chế này; Unlocking Rule để steal rules ngoài phạm vi','Bỏ hoàn toàn'],
 ['Quy ước ID','BASE_LOCK_2M, chưa ánh xạ item SAP','ShopConfig dùng Name PascalCase + HUD_SHOP_ITEM_* / HUD_SHOP_DETAILS_*','BaseLockKeyShort/Mid/Long, ID 16-18'],
 ['Giá và nguồn','Chưa chốt, đừng mặc định bán','Shop System ID 15 Under Protection 240 Pet Coin RB7; Current Plan 3.5.0 và 3.6.0','Neo theo hai dòng đó, giá vẫn để trống'],
 ['Force-unlock','Không nhắc tới','UnlockCost + UnlockCooldown đang chạy trong game','Chốt bảo vệ cứng: force-unlock không mở được; xem tab He thong lien quan'],
 ['Chuỗi UI','KHÓA BASE','Localization Key: LOCK_BASE, VN = "Khóa nhà"','Lấy chuỗi từ bảng localization']
];
fixes.getRange(`A6:D${5+fixRows.length}`).values=fixRows;
fixes.getRange(`A6:A${5+fixRows.length}`).format.font={bold:true};
fixes.getRange(`B6:B${5+fixRows.length}`).format.fill='#FBE3E3';
fixes.getRange(`D6:D${5+fixRows.length}`).format.fill='#DFF3E4';
fixes.getRange(`A6:D${5+fixRows.length}`).format.rowHeight=46;
fixes.getRange(`A6:D${5+fixRows.length}`).format.wrapText=true;
fixes.freezePanes.freezeRows(5);

/* --- 2. Khoa va Aura --- */
base(items,'A1:H26',[22,26,28,16,16,16,16,30],'Khóa và aura · thang phút đã chốt');items.tabColor='#245481';
note(items,'A3:H3','Ô vàng chỉnh được. Thời lượng ở cột D phải khớp ShopConfig của Master Data.');
header(items,5,['ShopConfig ID','Name','Tên hiển thị','Giây cộng','Màu icon','Tiêu hao','RB yêu cầu','NameLocalize']);
items.getRange('A6:H8').values=cfg.core.items.map(x=>[x.shop_config_id,x.name,x.display_vi,x.duration_seconds,x.icon_tier,x.consume_per_request,7,x.name_localize]);
items.getRange('D6:D8').format.fill='#FFF1C9';
for(const [row,color] of [[6,'#E4F4FF'],[7,'#F0E7FA'],[8,'#FFF1CD']])items.getRange(`E${row}`).format.fill=color;
items.getRange('A10').values=[['So sánh với khóa tự nhiên của base']];items.getRange('A10').format.font={size:13,bold:true,color:'#173F68'};
header(items,11,['Rebirth','BaseLockTime (giây)','UnlockCooldown (giây)','Khóa 2 phút bằng','Khóa 5 phút bằng','Khóa 10 phút bằng']);
const rbRows=[[1,30,15],[5,50,30],[10,90,45],[15,140,60],[20,160,90],[30,160,180]];
items.getRange(`A12:C${11+rbRows.length}`).values=rbRows;
for(let i=0;i<rbRows.length;i++){
 const r=12+i;
 items.getRange(`D${r}:F${r}`).formulas=[[`=$D$6/B${r}`,`=$D$7/B${r}`,`=$D$8/B${r}`]];
}
items.getRange(`D12:F${11+rbRows.length}`).setNumberFormat('0.00"x"');
note(items,`A${13+rbRows.length}:H${13+rbRows.length}`,'Khóa 10 phút = 3,75 lần khóa tự nhiên ở RB trần. Phải chốt một cách bù: trần tích lũy, giá cao, hoặc force-unlock xuyên khóa.');
items.getRange('A20').values=[['Aura theo tổng giây thực còn lại']];items.getRange('A20').format.font={size:13,bold:true,color:'#173F68'};
header(items,21,['Aura ID','Cận dưới loại trừ','Cận trên bao gồm','Số vòng sáng','Số hạt sáng','Tia sáng','Màu aura']);
items.getRange('A22:G25').values=cfg.core.display.tiers.map(t=>[t.id,t.min_seconds_exclusive??'Không giới hạn',t.max_seconds_inclusive??'Không giới hạn',t.rings,t.particles,t.rays?'Có':'Không',t.color_hex??'Không aura']);
items.getRange('B23:C24').format.fill='#FFF1C9';
items.getRange('A6:H8').format.horizontalAlignment='left';
items.freezePanes.freezeRows(5);

/* --- 3. He thong lien quan --- */
base(integ,'A1:D35',[34,40,24,58],'Tương tác với hệ thống đang chạy');integ.tabColor='#54799C';
note(integ,'A3:D3','Đã chốt 25/11/2026: bảo vệ cứng - không ai mở được base bằng Pet Coin khi trụ còn thời gian. Dòng đỏ là thứ quyết định này phá vỡ.');
header(integ,5,['Hệ thống','Quy tắc hiện có','Nguồn','Trụ khóa phải làm gì']);
const integRows=[
 ['Vào base','Enter any base freely','UnlockCost','Không chặn người lạ đi vào'],
 ['Trần rarity trộm','Chỉ trộm tới trần rarity theo RB','UnlockCost','Không đổi'],
 ['Giá mở cửa','Dòng config theo rarity cao nhất trộm được và RB gap','UnlockCost','Không hiện giá khi base đang bảo vệ'],
 ['Force-unlock','Trả Pet Coin để mở base đang khóa','Unlocking Rule','BỊ CHẶN HOÀN TOÀN khi trụ còn thời gian (chốt 25/11)'],
 ['Defender cooldown','15 đến 180 giây theo RB người thủ','Rebirth 2.2!UnlockCooldown','Không có điểm kích hoạt vì không ai mở trả phí được'],
 ['Khóa tự nhiên','30 đến 160 giây theo RB','Rebirth 2.2!BaseLockTime','Khóa nạp cộng vào, không thay thế'],
 ['Passive Lockdown','+1 giây vào thời gian khóa, meter 300','Base Passives / PassiveItem ID 4','Cộng một lần vào khóa tự nhiên'],
 ['Passive Stronghold','Thêm 1 đến 5 giây cho lần khóa kế tiếp','Base Passives','Cần chốt có áp cho khóa nạp không'],
 ['Passive Fortify','+20 Pet Coin vào giá mở cửa, meter 250','Base Passives / PassiveItem ID 3','Vô tác dụng khi base đang bảo vệ'],
 ['Mission LockBase','MISSION_LOCK_BASE, daily lock base 2 và 5 lần','DailyActivity, CallbackMissionList','Mỗi lần nạp tính một lần LockBase'],
 ['Onboarding','Lock your Base to protect your pets','OnboardingMissionList','Không đổi bước onboarding'],
 ['Laser wall','Chủ nhà mở, khóa trộm khi bật','Change Logs 2.7.1','Ngoài phạm vi, không đụng'],
 ['Double Cost','Nhân đôi giá mở cửa trong thời gian ngắn','Shop System ID 3','Vô tác dụng khi base đang bảo vệ'],
 ['Under Protection','Bảo vệ base 24 giờ, 240 Pet Coin, RB7, PENDING','Shop System ID 15','Cần chốt là một hay hai tính năng'],
 ['Player Log','Field 71 total base lock time (giây), first_base_lock_time','Player Log','Thêm field tách thời gian do vật phẩm'],
 ['Localization','LOCK_BASE, VN = Khóa nhà','Localization Key dòng 162','Đổi chuỗi UI của prototype'],
 ['Roadmap 3.5.0','Item protect base like VRising, mua bằng diamond, claim qua 7d reward','Current Plan','Đây là nguồn phát được duyệt'],
 ['Roadmap 3.6.0','Item Protect Base by time','Current Plan','Đây chính là trụ khóa'],
 ['Keep stealing','Tóm tắt cả hệ thống mở khóa là "Keep stealing"','Unlocking Rule!A5','XUNG ĐỘT: bảo vệ cứng lấy đi đường trả phí vào base'],
 ['Sink Pet Coin','UnlockCost là một sink Pet Coin chính','Unlocking Rule','Giảm sink; cần bù ở chỗ khác'],
 ['Trần tích lũy','Chưa có trong hệ thống nào','Mới','BẮT BUỘC chốt: không có trần thì bất khả xâm phạm vô hạn'],
 ['Khan hiếm nguồn phát','7-day reward, số lượng cố định','Current Plan 3.5.0','BẮT BUỘC chốt: giới hạn khóa nhận mỗi ngày'],
 ['Dấu hiệu từ ngoài','Tượng, aura, băng NHÀ ĐANG ĐƯỢC BẢO VỆ','Prototype','Đã dựng; còn chốt khoảng cách nhìn thấy'],
 ['Popup mở khóa','XÁC NHẬN MỞ KHÓA + giá Pet Coin','Game hiện tại','Nhà đang bảo vệ: đổi sang KHÔNG THỂ MỞ KHÓA, giấu giá']
];
integ.getRange(`A6:D${5+integRows.length}`).values=integRows;
integ.getRange(`A6:A${5+integRows.length}`).format.font={bold:true};
integ.getRange(`C6:C${5+integRows.length}`).format.font={size:10,color:'#637D94'};
integ.getRange(`D6:D${5+integRows.length}`).conditionalFormats.add('containsText',{text:'Cần chốt',format:{fill:'#FFF1CC',font:{color:'#90681D',bold:true}}});
 integ.getRange(`D6:D${5+integRows.length}`).conditionalFormats.add('containsText',{text:'BẮT BUỘC',format:{fill:'#FFE0E0',font:{color:'#A33B3B',bold:true}}});
 integ.getRange(`D6:D${5+integRows.length}`).conditionalFormats.add('containsText',{text:'XUNG ĐỘT',format:{fill:'#FFE0E0',font:{color:'#A33B3B',bold:true}}});
 integ.getRange(`D6:D${5+integRows.length}`).conditionalFormats.add('containsText',{text:'Vô tác dụng',format:{fill:'#FBE3E3',font:{color:'#8A4444'}}});
integ.getRange(`A6:D${5+integRows.length}`).format.rowHeight=34;
integ.getRange(`A6:D${5+integRows.length}`).format.wrapText=true;
integ.freezePanes.freezeRows(5);

/* --- 4. Master Data sync --- */
base(sync,'A1:G22',[24,20,30,14,46,16,46],'Dòng cần thêm vào Master Data');sync.tabColor='#2F8F55';
note(sync,'A3:G3','Copy đúng thứ tự cột của từng sheet đích. TBD nghĩa là chưa chốt, không điền 0.');
sync.getRange('A5').values=[['ShopConfig']];sync.getRange('A5').format.font={size:13,bold:true,color:'#173F68'};
header(sync,6,['ID','Name','Description','TimeLock','NameLocalize','Requirement','Cost']);
sync.getRange('A7:G9').values=cfg.master_data_rows_to_add.ShopConfig.map(r=>[r.ID,r.Name,r.Description,'TBD',r.NameLocalize,r.Requirement,'TBD']);
sync.getRange('D7:D9').format.fill='#FFF1CC';sync.getRange('G7:G9').format.fill='#FFF1CC';
sync.getRange('A11').values=[['Tooltips']];sync.getRange('A11').format.font={size:13,bold:true,color:'#173F68'};
header(sync,12,['ID','Name','Description','Obtain']);
sync.getRange('A13:D13').values=[[29,'HUD_ITEM_TITLE_BASE_LOCK_KEY','HUD_REWARD_DETAIL_BASE_LOCK_KEY','HUD_OBTAIN_BASE_LOCK_KEY']];
sync.getRange('A15').values=[['TierItem / Localization Key / Player Log']];sync.getRange('A15').format.font={size:13,bold:true,color:'#173F68'};
header(sync,16,['Sheet','Giá trị','Trạng thái']);
sync.getRange('A17:C22').values=[
 ['TierItem','BaseLockKey | Epic','Cần chốt với người giữ bảng tier'],
 ['Localization Key','LOCK_BASE_KEY','Thêm mới'],
 ['Localization Key','LOCK_BASE_TIME_LEFT','Thêm mới'],
 ['Localization Key','LOCK_BASE_REFILL','Thêm mới'],
 ['Player Log','base_lock_keys_refilled_count','Thêm mới'],
 ['Player Log','base_lock_seconds_from_items','Thêm mới']
];
sync.getRange('C17:C22').conditionalFormats.add('containsText',{text:'Cần chốt',format:{fill:'#FFF1CC',font:{color:'#90681D',bold:true}}});

/* --- 5. Phan hoi nap --- */
base(feedback,'A1:E42',[38,44,14,20,58],'Phản hồi khi nạp và khi bị chặn');feedback.tabColor='#54799C';
note(feedback,'A3:E3','Giữ nguyên từ v2. Bảng không đóng sau khi nạp; thời gian còn lại chạy số tăng dần.');
header(feedback,5,['Tham số','Giá trị','Đơn vị','Trạng thái','Giải thích']);
const a=cfg.core.feedback.refill_animation;
const fbRows=[
 ['refill.close_dialog_on_success',false,'boolean','Đã chốt','Nạp xong bảng vẫn mở để nạp tiếp'],
 ['refill.allow_consecutive_refills_without_reopen',true,'boolean','Đã chốt','Không cần mở lại bảng giữa hai lần nạp'],
 ['refill.counts_as_lock_base_action',true,'boolean','Mới ở v3','Mỗi lần nạp tính một lần LockBase cho mission'],
 ['refill.multiplicative_stacking',false,'boolean','Mới ở v3','Cộng tuyến tính, không nhân chồng với passive'],
 ['ui.focus_after_success',cfg.core.ui.focus_after_success,'enum','Đã chốt','Giữ focus ở nút nạp'],
 ['anim.enabled',a.enabled,'boolean','Đã chốt','Bật hiệu ứng số chạy khi cộng thời gian'],
 ['anim.duration_ms',a.duration_ms,'ms','Đã chốt','Hợp lý cả với khóa 30 giây'],
 ['anim.easing',a.easing,'enum','Đã chốt','1 − (1 − t)³'],
 ['anim.targets',a.targets.join(', '),'enum','Đã chốt','Đồng hồ trong bảng và trên trụ'],
 ['anim.scale_peak',a.scale_peak,'tỉ lệ','Đã chốt','Phóng to tối đa ở mốc 25%'],
 ['anim.highlight_color_hex',a.highlight_color_hex,'màu','Đã chốt','Màu nhấn khi số đang tăng'],
 ['anim.tick_source',a.tick_source,'enum','Đã chốt','Chạy theo khung hình'],
 ['anim.blocks_input',a.blocks_input,'boolean','Đã chốt','Vẫn bấm nạp tiếp được giữa chừng'],
 ['anim.restart_on_new_refill',a.restart_on_new_refill,'boolean','Đã chốt','Nạp tiếp thì thay animation'],
 ['anim.authority',a.authority,'enum','Đã chốt','expires_at cộng ngay, không chờ animation'],
 ['anim.reduced_motion',a.reduced_motion,'policy','Đã chốt','Nhảy thẳng giá trị cuối'],
 ['display.tier_source',cfg.core.display.tier_source,'enum','Đã chốt','Aura bám giây thực, không bám số đang chạy'],
 ['gain_badge.enabled',false,'boolean','Đã bỏ','Nhãn +N phút bỏ ngày 25/11/2026'],
 ['ui.title_localize_key',cfg.core.ui.title_localize_key,'key','Mới ở v3','VN chính thức là "Khóa nhà"'],
 ['duration_scale.selected','prototype_minutes','enum','Đã chốt 25/11','2 / 5 / 10 phút; thang giây giữ làm khuyến nghị'],
 ['protection.paid_force_unlock_still_available',false,'boolean','Đã chốt 25/11','Không ai mở được base bằng Pet Coin'],
 ['protection.accumulation_cap_seconds','Chưa chốt','giây','BẮT BUỘC','Không có trần thì bất khả xâm phạm vô hạn'],
 ['protection.supply_limit_per_day','Chưa chốt','khóa','BẮT BUỘC','Khan hiếm nguồn phát'],
 ['protection.visible_marker',true,'boolean','Đã làm','Băng NHÀ ĐANG ĐƯỢC BẢO VỆ + nút đỏ, đã dựng trong prototype'],
 ['raider.unprotected_button','MỞ KHÓA','text','Giữ nguyên','Nút tròn xanh như hiện tại trong game'],
 ['raider.protected_button','XEM KHÓA','text','Mới','Nút tròn đỏ, nhìn là biết không vào được'],
 ['raider.protected_dialog_title','KHÔNG THỂ MỞ KHÓA','text','Mới','Thay cho XÁC NHẬN MỞ KHÓA'],
 ['raider.protected_show_price',false,'boolean','Mới','Không hiện giá rồi mới từ chối'],
 ['raider.protected_actions','ĐÃ HIỂU','text','Mới','Một nút, không có KHÔNG / CÓ'],
 ['raider.live_switch_while_open',true,'boolean','Mới','Popup đổi nội dung ngay khi trạng thái bảo vệ đổi'],
 ['raider.visibility_gate','same_as_unlock_button','enum','Đã chốt 25/11','Băng, nút và popup chung một tầm'],
 ['raider.shows_at_distance_m',3,'m','Đề xuất','Hiện khi cách trụ không quá mốc này'],
 ['raider.hides_at_distance_m',3.5,'m','Đề xuất','Ẩn khi vượt mốc này'],
 ['raider.readable_from_afar','Tượng và aura','enum','Đã chốt','Thứ duy nhất đọc được từ xa'],
 ['sfx.refill','Chưa chốt','asset','Chưa chốt','Chưa chọn âm thanh khi nạp']
];
feedback.getRange(`A6:E${5+fbRows.length}`).values=fbRows;
feedback.getRange(`B6:B${5+fbRows.length}`).format.fill='#FFF1C9';
feedback.getRange(`D6:D${5+fbRows.length}`).conditionalFormats.add('containsText',{text:'v3',format:{fill:'#DFF3E4',font:{color:'#1E6B3C',bold:true}}});
feedback.getRange(`D6:D${5+fbRows.length}`).conditionalFormats.add('containsText',{text:'Chưa chốt',format:{fill:'#FFF1CC',font:{color:'#90681D'}}});
 feedback.getRange(`D6:D${5+fbRows.length}`).conditionalFormats.add('containsText',{text:'BẮT BUỘC',format:{fill:'#FFE0E0',font:{color:'#A33B3B',bold:true}}});
feedback.freezePanes.freezeRows(5);

/* --- 6. Mo phong --- */
base(sim,'A1:F28',[36,22,24,22,22,36],'Mô phỏng chuỗi nạp theo RB');sim.tabColor='#54799C';
note(sim,'A3:F3','Ô vàng là đầu vào. Khóa tự nhiên lấy theo RB; khóa nạp cộng thêm vào.');
sim.getRange('A5:B5').values=[['Rebirth của chủ base',10]];
sim.getRange('A6').values=[['Khóa tự nhiên (giây)']];
sim.getRange('B6').formulas=[["=IFERROR(LOOKUP(B5,'Khoa va Aura'!A12:A17,'Khoa va Aura'!B12:B17),30)"]];
sim.getRange('A7:B7').values=[['Giây còn lại trước chuỗi',0]];
header(sim,9,['Loại khóa','Số lần nạp','Giây mỗi lần','Giây cộng thêm']);
sim.getRange('A10:B12').values=[['BaseLockKey2M',1],['BaseLockKey5M',0],['BaseLockKey10M',0]];
sim.getRange('C10:C12').formulas=[["='Khoa va Aura'!D6"],["='Khoa va Aura'!D7"],["='Khoa va Aura'!D8"]];
sim.getRange('D10:D12').formulas=[['=B10*C10'],['=B11*C11'],['=B12*C12']];
sim.getRange('A14').values=[['Tổng giây nạp thêm']];sim.getRange('B14').formulas=[['=SUM(D10:D12)']];
sim.getRange('A15').values=[['Giây bảo vệ sau chuỗi']];sim.getRange('B15').formulas=[['=MAX(0,B7)+B14']];
sim.getRange('A16').values=[['Đồng hồ sau chuỗi']];sim.getRange('B16').formulas=[['=B15/86400']];sim.getRange('B16').setNumberFormat('[mm]:ss');
sim.getRange('A17').values=[['Cấp tượng']];sim.getRange('B17').formulas=[["=IF(B15<=0,\"idle\",IF(B15<='Khoa va Aura'!C23,\"blue\",IF(B15<='Khoa va Aura'!C24,\"purple\",\"gold\")))"]];
sim.getRange('A18').values=[['Bằng bao nhiêu khóa tự nhiên']];sim.getRange('B18').formulas=[['=IFERROR(B15/B6,0)']];sim.getRange('B18').setNumberFormat('0.00"x"');
sim.getRange('A19').values=[['Số lần tính LockBase']];sim.getRange('B19').formulas=[['=SUM(B10:B12)']];
sim.getRange('A20').values=[['Số lần mở bảng']];sim.getRange('B20').formulas=[['=IF(B19=0,0,1)']];
sim.getRange('B5').format.fill='#FFF1C9';sim.getRange('B7').format.fill='#FFF1C9';sim.getRange('B10:B12').format.fill='#FFF1C9';
sim.getRange('A14:D20').format.rowHeight=32;
sim.getRange('B15:B18').format.font={bold:true,color:'#245481',size:13};
note(sim,'A23:F23','Ở RB10 khóa tự nhiên là 90 giây; một khóa 2 phút đã dài hơn cả khóa tự nhiên.');
note(sim,'A24:F24','Mỗi lần nạp tính một lần LockBase, nên nạp ba khóa hoàn thành luôn daily lock base 2 lần.');
note(sim,'A25:F25','Mô phỏng tức thời, chưa trừ thời gian thao tác và chưa tính passive Lockdown / Stronghold.');
sim.getRange('B5:D15').setNumberFormat('0');
sim.dataValidations.add({range:'B10:B12',rule:{type:'whole',operator:'greaterThanOrEqual',formula1:0}});

/* --- kiem tra --- */
const tests=[];
for(const [seconds,expected] of [[0,'idle'],[1,'blue'],[120,'blue'],[121,'purple'],[300,'purple'],[301,'gold']]){
 sim.getRange('B7').values=[[seconds]];sim.getRange('B10:B12').values=[[0],[0],[0]];
 const actual=sim.getRange('B17').values[0][0];
 if(actual!==expected)throw Error(`Tier ${seconds}: ${actual} != ${expected}`);
 tests.push({seconds,actual});
}
sim.getRange('B7').values=[[0]];sim.getRange('B10:B12').values=[[1],[1],[1]];
if(sim.getRange('B15').values[0][0]!==1020)throw Error('Mixed fill must equal 1020 seconds, got '+sim.getRange('B15').values[0][0]);
if(sim.getRange('B19').values[0][0]!==3)throw Error('Three refills must count three LockBase actions');
sim.getRange('B5').values=[[10]];
if(sim.getRange('B6').values[0][0]!==90)throw Error('RB10 BaseLockTime must be 90, got '+sim.getRange('B6').values[0][0]);
const ratio=sim.getRange('B18').values[0][0];
if(Math.abs(ratio-1020/90)>0.001)throw Error('Ratio mismatch: '+ratio);
sim.getRange('B7').values=[[0]];sim.getRange('B10:B12').values=[[1],[0],[0]];
wb.recalculate();
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!',options:{useRegex:true,maxResults:40},maxChars:2000});
await fs.writeFile(new URL('formula-scan.ndjson',dir),errors.ndjson);
for(const [sheetName,range] of [['Sai lech v2','A1:D13'],['Khoa va Aura','A1:H26'],['He thong lien quan','A1:D30'],['Master Data sync','A1:G22'],['Phan hoi nap','A1:E40'],['Mo phong','A1:F26']]){
 const preview=await wb.render({sheetName,range,scale:1,format:'png'});
 await fs.writeFile(new URL(sheetName.replaceAll(' ','-')+'.png',dir),new Uint8Array(await preview.arrayBuffer()));
}
const file=await SpreadsheetFile.exportXlsx(wb);
await file.save(new URL('Base_Lock_Config_v3.xlsx',dir).pathname.replace(/^\/(\w:)/,'$1'));
await fs.writeFile(new URL('validation.json',dir),JSON.stringify({tierTests:tests,mixedSeconds:1020,rb10BaseLockTime:90,lockBaseActions:3,ratioAtRb10:ratio},null,2));
console.log('CONFIG_EXPORTED',JSON.stringify({sheets:6,mixedSeconds:1020,rb10:90}));
