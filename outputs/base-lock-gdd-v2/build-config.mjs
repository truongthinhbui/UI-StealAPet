import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const dir=new URL('.',import.meta.url);
const cfg=JSON.parse(await fs.readFile(new URL('base-lock-config.v2.json',dir),'utf8'));
const wb=Workbook.create();
const items=wb.worksheets.add('Khoa va Aura');
const feedback=wb.worksheets.add('Phan hoi nap');
const rules=wb.worksheets.add('Quy tac');
const sim=wb.worksheets.add('Mo phong');
function base(sheet,range,widths,title){
 sheet.showGridLines=false;
 sheet.getRange(range).format.font={name:'Arial',size:11,color:'#233B50'};
 sheet.getRange(range).format.rowHeight=28;sheet.getRange(range).format.verticalAlignment='center';
 widths.forEach((width,i)=>sheet.getRangeByIndexes(0,i,Number(range.match(/\d+$/)[0]),1).format.columnWidth=width);
 sheet.getRange('A2').values=[[title]];sheet.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:'#173F68'};
}
function header(sheet,row,labels){const r=sheet.getRangeByIndexes(row-1,0,1,labels.length);r.values=[labels];r.format.fill='#245481';r.format.font={name:'Arial',size:11,bold:true,color:'#FFFFFF'};r.format.horizontalAlignment='center';r.format.rowHeight=30;}

/* --- Sheet 1: khoa va aura --- */
base(items,'A1:G24',[28,32,16,16,16,16,32],'Cấu hình khóa và aura · v2');items.tabColor='#245481';
items.getRange('A3').values=[['Cơ chế đã chốt. Chỉnh giây ở cột C; phút ở cột D tự tính.']];items.getRange('A3:G3').format.font={italic:true,color:'#637D94',size:10};
header(items,4,['Item ID','Tên vật phẩm','Giây cộng thêm','Phút quy đổi','Màu icon','Tiêu hao','Trạng thái']);
items.getRange('A5:G7').values=cfg.core.items.map(x=>[x.id,x.name,x.duration_seconds,null,x.icon_tier,x.consume_per_request,'Đã chốt']);
items.getRange('D5:D7').formulas=[['=C5/60'],['=C6/60'],['=C7/60']];
items.getRange('C5:C7').format.fill='#FFF1C9';items.getRange('F5:F7').format.fill='#FFF1C9';
for(const [row,color] of [[5,'#E4F4FF'],[6,'#F0E7FA'],[7,'#FFF1CD']])items.getRange(`E${row}`).format.fill=color;
items.getRange('A10').values=[['Aura theo tổng giây thực còn lại']];items.getRange('A10').format.font={size:13,bold:true,color:'#173F68'};
header(items,12,['Aura ID','Cận dưới loại trừ','Cận trên bao gồm','Số vòng sáng','Số hạt sáng','Tia sáng','Màu aura']);
items.getRange('A13:G16').values=cfg.core.display.tiers.map(t=>[t.id,t.min_seconds_exclusive??'Không giới hạn',t.max_seconds_inclusive??'Không giới hạn',t.rings,t.particles,t.rays?'Có':'Không',t.color_hex??'Không aura']);
items.getRange('B14:C15').format.fill='#FFF1C9';
items.getRange('A18').values=[['Đúng 120 giây: lam. Đúng 300 giây: tím. Từ 301 giây: vàng.']];
items.getRange('A19').values=[['Aura bám giây THỰC còn lại, không bám con số đang chạy animation.']];
items.getRange('A20').values=[['Icon giữ màu theo loại khóa; tượng đổi màu theo tổng thời gian còn lại.']];
items.getRange('A21').values=[['ID thiết kế cần ánh xạ với item SAP trước khi tích hợp.']];
items.getRange('A18:G21').format.font={size:10,color:'#637D94'};
items.getRange('C5:D7').setNumberFormat('0');items.getRange('F5:F7').setNumberFormat('0');
items.getRange('C5:F7').format.horizontalAlignment='right';
items.dataValidations.add({range:'C5:C7',rule:{type:'whole',operator:'greaterThanOrEqual',formula1:1}});

/* --- Sheet 2: phan hoi nap (moi o v2) --- */
base(feedback,'A1:E34',[40,46,14,20,62],'Phản hồi khi nạp khóa · mới ở v2');feedback.tabColor='#2F8F55';
feedback.getRange('A3').values=[['Bảng không đóng sau khi nạp. Thời gian còn lại chạy số tăng dần. Ô vàng là đầu vào chỉnh được.']];
feedback.getRange('A3:E3').format.font={italic:true,size:10,color:'#637D94'};
header(feedback,5,['Tham số','Giá trị','Đơn vị','Trạng thái','Giải thích']);
const a=cfg.core.feedback.refill_animation;
const fbRows=[
 ['refill.close_dialog_on_success',false,'boolean','Đã chốt v2','Nạp xong bảng vẫn mở để nạp tiếp'],
 ['refill.allow_consecutive_refills_without_reopen',true,'boolean','Đã chốt v2','Không cần mở lại bảng giữa hai lần nạp'],
 ['refill.close_dialog_on_expiry',false,'boolean','Đã chốt','Hết giờ khi bảng mở thì bảng vẫn mở'],
 ['ui.focus_after_success',cfg.core.ui.focus_after_success,'enum','Đã chốt v2','Giữ focus ở nút nạp; hết khóa thì về nút đóng'],
 ['ui.dialog_close_triggers',cfg.core.ui.dialog_close_triggers.join(', '),'enum','Đã chốt','Chỉ ba thao tác này đóng bảng'],
 ['anim.enabled',a.enabled,'boolean','Đã chốt v2','Bật hiệu ứng số chạy khi cộng thời gian'],
 ['anim.type',a.type,'enum','Đã chốt v2','Đếm tăng dần giá trị giây còn lại'],
 ['anim.duration_ms',a.duration_ms,'ms','Đã chốt v2','Thời lượng một lần chạy số'],
 ['anim.easing',a.easing,'enum','Đã chốt v2','1 − (1 − t)³, nhanh đầu chậm cuối'],
 ['anim.value_from',a.value_from,'field','Đã chốt v2','Mốc đầu là giây còn lại trước khi nạp'],
 ['anim.value_to',a.value_to,'field','Đã chốt v2','Mốc cuối là giây còn lại sau khi nạp'],
 ['anim.targets',a.targets.join(', '),'enum','Đã chốt v2','Đồng hồ trong bảng và đồng hồ trên trụ'],
 ['anim.scale_peak',a.scale_peak,'tỉ lệ','Đã chốt v2','Phóng to tối đa ở mốc 25%'],
 ['anim.scale_settle',a.scale_settle,'tỉ lệ','Đã chốt v2','Giữ nhẹ ở mốc 60% rồi về 1,0'],
 ['anim.highlight_color_hex',a.highlight_color_hex,'màu','Đã chốt v2','Màu nhấn khi số đang tăng'],
 ['anim.glow',a.glow,'css','Đã chốt v2','Quầng sáng quanh chữ số'],
 ['anim.tick_source',a.tick_source,'enum','Đã chốt v2','Chạy theo khung hình, không theo interval 250 ms'],
 ['anim.blocks_input',a.blocks_input,'boolean','Đã chốt v2','Vẫn bấm nạp tiếp được giữa chừng'],
 ['anim.restart_on_new_refill',true,'boolean','Đã chốt v2','Nạp tiếp thì thay animation, không chạy chồng'],
 ['anim.cancel_on',a.cancel_on.join(', '),'enum','Đã chốt v2','Đóng bảng hoặc reset thì dừng ngay'],
 ['anim.authority','client_visual_only','enum','Đã chốt v2','expires_at cộng ngay, không chờ animation'],
 ['anim.reduced_motion',a.reduced_motion,'policy','Đã chốt v2','Giảm chuyển động thì nhảy thẳng giá trị cuối'],
 ['gain_badge.enabled',cfg.core.feedback.gain_badge.enabled,'boolean','Đã bỏ','Nhãn +N phút bỏ ngày 25/11/2026'],
 ['toast.enabled',cfg.core.feedback.toast_on_success.enabled,'boolean','Đã chốt','Vẫn hiện toast xác nhận đã nạp'],
 ['toast.duration_ms',cfg.core.feedback.toast_on_success.duration_ms,'ms','Đã chốt','Thời gian hiện toast'],
 ['sfx.refill','Chưa chốt','asset','Chưa chốt','Chưa chọn âm thanh khi nạp khóa']
];
feedback.getRange(`A6:E${5+fbRows.length}`).values=fbRows;
feedback.getRange(`B6:B${5+fbRows.length}`).format.fill='#FFF1C9';
feedback.getRange(`D6:D${5+fbRows.length}`).conditionalFormats.add('containsText',{text:'v2',format:{fill:'#DFF3E4',font:{color:'#1E6B3C',bold:true}}});
feedback.getRange(`D6:D${5+fbRows.length}`).conditionalFormats.add('containsText',{text:'Chưa chốt',format:{fill:'#FFF1CC',font:{color:'#90681D'}}});
feedback.freezePanes.freezeRows(5);feedback.freezePanes.freezeColumns(1);

/* --- Sheet 3: quy tac --- */
base(rules,'A1:E43',[46,38,14,22,68],'Quy tắc nạp khóa');rules.tabColor='#54799C';
rules.getRange('A3').values=[['Đề xuất và Chưa chốt không tự kích hoạt trong game. 3 khóa mỗi loại chỉ là dữ liệu thử.']];rules.getRange('A3:E3').format.font={italic:true,size:10,color:'#637D94'};
header(rules,5,['Tham số','Giá trị','Đơn vị','Trạng thái','Giải thích']);
const rows=[
 ['refill.allow_while_active',true,'boolean','Đã chốt','Cho nạp thêm khi đang bảo vệ'],
 ['refill.allow_mixed_item_types',true,'boolean','Đã chốt','Cộng dồn giữa ba loại khóa'],
 ['refill.quantity_per_request',1,'khóa','Đã chốt','Mỗi giao dịch tiêu hao một khóa'],
 ['refill.cooldown_seconds',0,'giây','Theo mockup','Không có thời gian chờ giữa hai lần nạp'],
 ['refill.expiration_formula',cfg.core.refill.expiration_formula,'formula','Đã chốt','Lấy mốc lớn hơn giữa hạn cũ và hiện tại rồi cộng'],
 ['ui.available_flows','confirm, cards','enum','Đã chốt','Giữ hai phương án để lựa chọn'],
 ['ui.production_selected_flow','Chưa chốt','enum','Chưa chốt','Chưa chọn một UI duy nhất để phát hành'],
 ['ui.show_quantity_selector',false,'boolean','Đã chốt','Không có bộ chọn số lượng'],
 ['ui.show_post_refill_time',false,'boolean','Đã chốt','Không hiện dòng thời gian sau nạp'],
 ['ui.show_inventory_hud',false,'boolean','Đã chốt','Không có ô tồn kho góc màn hình'],
 ['ui.show_count_on_item_cards',true,'boolean','Đã chốt','Số lượng riêng trên từng loại khóa'],
 ['prototype.initial_inventory',3,'khóa/loại','Chỉ thử nghiệm','Không phải quà mặc định cho người chơi thật'],
 ['prototype.accumulation_limit','Không giới hạn','giây','Chỉ thử nghiệm','Chưa chốt trần thời gian production'],
 ['server.authority','server','enum','Đề xuất','Server sở hữu thời gian và tồn kho'],
 ['interaction.show_distance',3,'m','Đề xuất','Hiện nút khi cách trụ không quá mốc này'],
 ['interaction.hide_distance',3.5,'m','Đề xuất','Ẩn nút khi vượt mốc này'],
 ['interaction.submit_max_distance',3.5,'m','Đề xuất','Kiểm tra lại khi nhận yêu cầu nạp'],
 ['interaction.owner_only_refill',true,'boolean','Đề xuất','Chỉ chủ base được nạp'],
 ['barrier.block_nonowner_entry',true,'boolean','Đề xuất','Chặn người lạ vào khi đang bảo vệ'],
 ['barrier.allow_owner_entry',true,'boolean','Đề xuất','Chủ base vẫn đi qua'],
 ['intruder.warning_seconds',3,'giây','Cần chốt','Trước khi đưa người lạ đã ở trong ra ngoài'],
 ['theft.already_stolen_pet','Không tự thu hồi','policy','Cần chốt','Không hủy lượt trộm đã hợp lệ trước khi nạp'],
 ['offline.policy','Tiếp tục thời gian thực','policy','Cần chốt','Đề xuất lưu thời điểm kết thúc'],
 ['transaction.idempotency','request_id','field','Đề xuất','Gửi lại cùng ID không trừ vật phẩm lần hai'],
 ['transaction.atomic_update',true,'boolean','Đề xuất','Tồn kho và thời gian cập nhật trong cùng giao dịch'],
 ['transaction.disable_submit_while_pending',true,'boolean','Đề xuất','Khóa nút trong lúc chờ server, kể cả khi bảng vẫn mở'],
 ['max_accumulated_seconds','Chưa chốt','giây','Chưa chốt','Không tự áp giới hạn từ một bản đề xuất cũ'],
 ['economy.price','Chưa chốt','tiền','Chưa chốt','Không dùng 0 thay cho dữ liệu chưa có'],
 ['economy.acquisition_sources','Chưa chốt','nguồn','Chưa chốt','Nhiệm vụ, shop hoặc sự kiện chưa được chọn'],
 ['economy.initial_player_grant','Chưa chốt','khóa','Chưa chốt','Không lấy tồn kho thử làm quà tặng'],
 ['persistence.rebirth_policy','Chưa chốt','policy','Chưa chốt','Cần quyết định kế thừa hoặc reset'],
 ['persistence.owner_transfer','Chưa chốt','policy','Chưa chốt','Cần quyết định khi base đổi chủ'],
 ['item.sap_id_mapping','Chưa chốt','mapping','Chưa chốt','BASE_LOCK_* hiện là ID thiết kế']
];
rules.getRange(`A6:E${5+rows.length}`).values=rows;rules.getRange(`B6:B${5+rows.length}`).format.fill='#FFF1C9';
rules.getRange(`D6:D${5+rows.length}`).conditionalFormats.add('containsText',{text:'Đề xuất',format:{fill:'#FFF1CC',font:{color:'#90681D'}}});
rules.getRange(`D6:D${5+rows.length}`).conditionalFormats.add('containsText',{text:'chốt',format:{font:{bold:true}}});
rules.freezePanes.freezeRows(5);rules.freezePanes.freezeColumns(1);

/* --- Sheet 4: mo phong --- */
base(sim,'A1:F30',[38,22,24,22,22,36],'Mô phỏng chuỗi nạp liên tiếp');sim.tabColor='#54799C';
sim.getRange('A3').values=[['Ô vàng là đầu vào. Ở v2 các lần nạp này diễn ra trong cùng một lần mở bảng.']];sim.getRange('A3:F3').format.font={italic:true,color:'#637D94',size:10};
sim.getRange('A5:B5').values=[['Giây còn lại trước chuỗi',90]];
header(sim,7,['Loại khóa','Số lần nạp','Giây mỗi lần','Giây cộng thêm']);
sim.getRange('A8:B10').values=[['Khóa 2 phút',0],['Khóa 5 phút',1],['Khóa 10 phút',0]];
sim.getRange('C8:C10').formulas=[["='Khoa va Aura'!C5"],["='Khoa va Aura'!C6"],["='Khoa va Aura'!C7"]];
sim.getRange('D8:D10').formulas=[['=B8*C8'],['=B9*C9'],['=B10*C10']];
sim.getRange('A12').values=[['Tổng giây nạp thêm']];sim.getRange('B12').formulas=[['=SUM(D8:D10)']];
sim.getRange('A13').values=[['Giây bảo vệ sau chuỗi']];sim.getRange('B13').formulas=[['=MAX(0,B5)+B12']];
sim.getRange('A14').values=[['Đồng hồ sau chuỗi']];sim.getRange('B14').formulas=[['=B13/86400']];sim.getRange('B14').setNumberFormat('[mm]:ss');
sim.getRange('A15').values=[['Cấp tượng']];sim.getRange('B15').formulas=[["=IF(B13<=0,\"idle\",IF(B13<='Khoa va Aura'!C14,\"blue\",IF(B13<='Khoa va Aura'!C15,\"purple\",\"gold\")))"]];
sim.getRange('A16').values=[['Số lần bấm nạp']];sim.getRange('B16').formulas=[['=SUM(B8:B10)']];
sim.getRange('A17').values=[['Số lần mở bảng (v2)']];sim.getRange('B17').formulas=[['=IF(B16=0,0,1)']];
sim.getRange('A18').values=[['Số lần mở bảng (v1)']];sim.getRange('B18').formulas=[['=B16']];
sim.getRange('A19').values=[['Tổng thời lượng animation (giây)']];sim.getRange('B19').formulas=[["=B16*'Phan hoi nap'!B13/1000"]];sim.getRange('B19').setNumberFormat('0.0');
sim.getRange('B5').format.fill='#FFF1C9';sim.getRange('B8:B10').format.fill='#FFF1C9';sim.getRange('A12:D19').format.rowHeight=32;
sim.getRange('B13:B15').format.font={bold:true,color:'#245481',size:13};
sim.getRange('B17').format.font={bold:true,color:'#1E6B3C',size:13};
sim.getRange('A22').values=[['Ví dụ tham chiếu: còn 01:30, nạp một khóa 5 phút thì thành 06:30, cấp vàng.']];
sim.getRange('A23').values=[['Ở v2 nạp ba khóa chỉ cần mở bảng một lần; v1 phải mở lại mỗi lần.']];
sim.getRange('A24').values=[['Tổng thời lượng animation chỉ là hiển thị, không cộng vào thời gian bảo vệ.']];
sim.getRange('A22:F24').format.font={size:10,color:'#637D94'};
sim.getRange('B5:D13').setNumberFormat('0');
sim.dataValidations.add({range:'B8:B10',rule:{type:'whole',operator:'greaterThanOrEqual',formula1:0}});

const tests=[];
for(const [seconds,expected] of [[0,'idle'],[1,'blue'],[120,'blue'],[121,'purple'],[300,'purple'],[301,'gold']]){
 sim.getRange('B5').values=[[seconds]];sim.getRange('B8:B10').values=[[0],[0],[0]];
 const actual=sim.getRange('B15').values[0][0];if(actual!==expected)throw Error(`Tier ${seconds}: ${actual} != ${expected}`);tests.push({seconds,actual});
}
sim.getRange('B5').values=[[0]];sim.getRange('B8:B10').values=[[1],[1],[1]];
if(sim.getRange('B13').values[0][0]!==1020)throw Error('Mixed fill must equal 1020 seconds');
if(sim.getRange('B17').values[0][0]!==1)throw Error('v2 must need one dialog open');
if(sim.getRange('B18').values[0][0]!==3)throw Error('v1 must need three dialog opens');
const animTotal=sim.getRange('B19').values[0][0];
if(Math.abs(animTotal-2.7)>0.001)throw Error('Animation total must be 2.7s for three refills, got '+animTotal);
sim.getRange('B5').values=[[90]];sim.getRange('B8:B10').values=[[0],[1],[0]];
wb.recalculate();
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!',options:{useRegex:true,maxResults:30},maxChars:1500});
await fs.writeFile(new URL('formula-scan.ndjson',dir),errors.ndjson);
for(const [sheetName,range] of [['Khoa va Aura','A1:G22'],['Phan hoi nap','A1:E32'],['Quy tac','A1:E38'],['Mo phong','A1:F25']]){
 const preview=await wb.render({sheetName,range,scale:1,format:'png'});await fs.writeFile(new URL(sheetName.replaceAll(' ','-')+'.png',dir),new Uint8Array(await preview.arrayBuffer()));
}
const file=await SpreadsheetFile.exportXlsx(wb);await file.save(new URL('Base_Lock_Config_v2.xlsx',dir).pathname.replace(/^\/(\w:)/,'$1'));
await fs.writeFile(new URL('validation.json',dir),JSON.stringify({tierTests:tests,mixedSeconds:1020,v2DialogOpens:1,v1DialogOpens:3,animTotalSeconds:2.7,sampleSeconds:sim.getRange('B13').values[0][0],sampleTier:sim.getRange('B15').values[0][0]},null,2));
console.log('CONFIG_EXPORTED',JSON.stringify({sampleSeconds:sim.getRange('B13').values[0][0],sampleTier:sim.getRange('B15').values[0][0],sheets:4}));
