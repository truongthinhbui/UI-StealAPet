import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const root='D:/revival-prototype-ui-update',out=root+'/outputs/fishing-dev-handoff',c={window:{}};vm.createContext(c);
for(const file of ['fishing-config','gen-config'])vm.runInContext(await fs.readFile(root+'/assets/'+file+'.js','utf8'),c);
const {FishingConfig:f,GenConfig:g}=c.window,book=Workbook.create(),s=book.worksheets.add('MutaWeatherPool');
const blue='#285B83',ink='#203C50',muted='#617B90',yellow='#FFF2CC',tiers={basic:'COMMON',uncommon:'RARE',advanced:'EPIC',rare:'LEGENDARY'};
s.showGridLines=false;s.tabColor=blue;s.getRange('A1:P100').format.font={name:'Arial',size:10,color:ink};s.getRange('A1:P100').format.verticalAlignment='center';
[135,145,130,90,...Array(5).fill(115),...Array(5).fill(115),125,135].forEach((w,i)=>s.getRangeByIndexes(0,i,100,1).format.columnWidthPx=w);
function text(row,value,last='P',height=30){s.getRange(`A${row}:${last}${row}`).merge();s.getRange('A'+row).values=[[value]];s.getRange('A'+row).format={wrapText:true,rowHeight:height,font:{name:'Arial',size:10,color:muted}};}
function head(row,titles){s.getRangeByIndexes(row-1,0,1,titles.length).values=[titles];s.getRangeByIndexes(row-1,0,1,titles.length).format={fill:blue,font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},wrapText:true,rowHeight:38};}
function rows(start,values){s.getRangeByIndexes(start-1,0,values.length,values[0].length).values=values;for(let i=0;i<values.length;i++){s.getRangeByIndexes(start+i-1,0,1,values[0].length).format.rowHeight=30;if(i%2===0)s.getRangeByIndexes(start+i-1,0,1,values[0].length).format.fill='#EEF5FA';}}
function section(row,label){text(row,label,'P',30);s.getRange('A'+row+':P'+row).format={fill:'#E3EDF5',font:{name:'Arial',size:11,bold:true,color:blue}};}
text(2,'POOL MUTA / WEATHER GEN VÀ CƠ CHẾ FISHING','P',32);s.getRange('A2').format.font={name:'Arial',size:15,bold:true,color:blue};
text(3,'Một pool duy nhất cho MutaGen + WeatherGen. Gameplay: xanh +10%, vàng +34%, đỏ 0%; 3 tap, tổng cap 100%, tối đa 1 Gen. Bản bàn giao 06/11/2026.');
text(4,'Nguồn: assets/gen-config.js ('+g.version+'), fishing-config.js/rarityTiming, gen-core.js và fishing.js. Ô vàng là input. Không có bảng Simulation hoặc FishPool.');
head(6,['GenID','Tên hiển thị','Rarity','Enabled',...g.rebirthProfiles.map(p=>'Weight '+p.label),...g.rebirthProfiles.map(p=>'Rate '+p.label),'Giá Gen ×','Nguồn (metadata)']);
rows(7,g.catalog.map(x=>[x.id,x.name,tiers[x.tier],1,...g.rebirthProfiles.map(p=>p.weights[x.id]),...Array(5).fill(null),Number(f.pricing.genMultiplierById[x.id]),x.family]));
s.getRange('D7:I17').format.fill=yellow;s.getRange('E7:I17').setNumberFormat('#,##0');s.getRange('O7:O17').setNumberFormat('0.00"x"');s.getRange('D7:D17').dataValidation={rule:{type:'list',values:['1','0']}};
s.dataValidations.add({range:'E7:I17',rule:{type:'whole',operator:'between',formula1:0,formula2:1000000000}});
for(let row=7;row<=17;row++)for(let b=0;b<5;b++){const w=String.fromCharCode(69+b),r=String.fromCharCode(74+b);s.getRange(r+row).formulas=[[`=IF($D${row}=1,${w}${row}/SUMIFS(${w}$7:${w}$17,$D$7:$D$17,1),0)`]];}
s.getRange('J7:N17').setNumberFormat('0.0000%');s.getRange('J7:N17').format.font.color='#17694D';s.tables.add('A6:P17',true,'UnifiedMutaWeatherPool');
for(const [row,label,filter] of [[19,'TOTAL',null],[20,'COMMON + RARE + EPIC','<>LEGENDARY'],[21,'LEGENDARY','LEGENDARY']]){s.getRange(`A${row}:D${row}`).merge();s.getRange('A'+row).values=[[label]];for(let b=0;b<5;b++){const w=String.fromCharCode(69+b),r=String.fromCharCode(74+b),condition=filter?`,$C$7:$C$17,"${filter}"`:'';s.getRange(w+row).formulas=[[`=SUMIFS(${w}$7:${w}$17,$D$7:$D$17,1${condition})`]];s.getRange(r+row).formulas=[[`=SUMIFS(${r}$7:${r}$17,$D$7:$D$17,1${condition})`]];}s.getRange(`E${row}:I${row}`).setNumberFormat('#,##0');s.getRange(`J${row}:N${row}`).setNumberFormat('0.00%');}
text(23,'Rate là xác suất chọn LOẠI GEN sau khi đã roll CÓ GEN. Fossilized và Prismatic mỗi loại 0,5% / 1% / 1,5% / 2% / 2,5% theo Rebirth. Family chỉ mô tả nguồn, không tạo 2 lượt roll.');
text(24,'Gen band: R9–10 / R11–12 / R13–15 / R16–18 / R19+. Chọn đúng 1 cột. frost = Frozen; ice = Frost. Map bằng GenID, không map bằng tên.');
section(26,'1. THÔNG SỐ GAMEPLAY ĐANG ÁP DỤNG');
const settings=[['Xanh (green)',g.rules.green/100,'GOOD: cộng cơ hội có Gen, không buff rarity pet.'],['Vàng (gold)',g.rules.gold/100,'EXCELLENT: feedback mạnh hơn xanh.'],['Đỏ (red)',g.rules.red/100,'MISS: không cộng cơ hội có Gen; vẫn tính là 1 trong 3 tap.'],['Số tap chấm điểm',3,'Không tính lần bấm để bắt đầu. Cố định 3 tap cho mechanic này.'],['Số Gen tối đa',1,'Chỉ 0 hoặc 1 Gen, không double mutation.'],['Rebirth mở khóa',9,'Chỉ cho bắt đầu câu từ R9.'],['Dừng trước khi hiện cá (s)',.35,'Sau tap thứ 3 dừng chuyển động 0.35 giây rồi hiện offer.'],['Cooldown (s)',0,'Không có timer cooldown. Phải xử lý offer trước lượt tiếp theo.']];
for(let i=0;i<settings.length;i++){const row=27+i;const [name,value,description]=settings[i];s.getRange(`A${row}:C${row}`).merge();s.getRange('A'+row).values=[[name]];s.getRange('D'+row).values=[[value]];s.getRange(`E${row}:P${row}`).merge();s.getRange('E'+row).values=[[description]];s.getRange(`A${row}:P${row}`).format.rowHeight=30;}s.getRange('D27:D29').setNumberFormat('0.00%');s.getRange('D27:D29').format.fill=yellow;s.dataValidations.add({range:'D27:D29',rule:{type:'decimal',operator:'between',formula1:0,formula2:1}});
text(36,'Đơn vị Excel: 0.10 = 10%. Runtime GenConfig dùng điểm 10 = +10%; khi export điểm tap từ Excel sang runtime thì nhân 100. Sửa Excel không tự cập nhật website hoặc server.');
section(38,'2. LUỒNG XỬ LÝ VÀ CÔNG THỨC CHO DEV');
const mechanism=[
['Điều kiện bắt đầu','Rebirth >= 9, weather HighTide hoặc HeavyRain, ngoài trời, hướng mặt nước. Không có cast hay offer đang chờ. Phí bắt đầu = 0.'],
['1. Pre-roll pet','Roll pet bằng config pet hiện có khi bắt đầu cast. Lưu pet và rarity; không roll lại theo tap. Pool pet không nằm trong file này.'],
['2. Khởi tạo vùng trúng','arcStart = U đều trong [0,1). offset = (marker - arcStart + 1) % 1. Xanh: offset <= 0.20. Vàng: 0.45 <= offset <= 0.53. Còn lại đỏ.'],
['3. Chấm 3 tap','Mỗi tap thêm điểm xanh/vàng/đỏ theo thông số trên. PGen = MIN(1, tổng 3 tap). Reset điểm khi bắt đầu lượt mới, không carry. Full đỏ vẫn nhận offer pet nhưng không Gen.'],
['4. Roll số Gen','Sinh U trong [0,1). Nếu U < PGen thì 1 Gen, ngược lại 0. PGen=0 luôn không Gen, PGen=1 luôn có Gen. Không roll lần hai.'],
['5. Chọn loại Gen','Chọn đúng Gen band theo Rebirth. Chỉ dùng Enabled=1, Weight>0. Total = tổng weight thực. Roll R = U × Total, duyệt trừ weight đến khi R<0. Nếu Total<=0 thì từ chối config.'],
['Công thức xác suất','P(pet A + Gen X / lượt) = P(pet A từ hệ thống pet) × PGen × WeightGenX / TotalGenBand. Chỉnh trọng số loại Gen không làm tăng cơ hội có Gen bất kỳ.'],
['6. Hiện kết quả','Dừng 0.35 giây sau tap 3 rồi hiện pet, rarity, mutation và giá trong cùng offer. Mua cần đủ tiền và chỗ túi; Thả bỏ offer. Bắt được là tạo offer, chưa phải thêm inventory.'],
['Đổi vị trí vòng cung','Sau HIT xanh/vàng và chưa đủ 3 tap: arcStart=(arcStart+0.25+U×0.5)%1. Tap đỏ không đổi vùng. Vùng không tự xoay theo thời gian. Marker không reset sau hit.'],
['Giá khi có Gen','ROUND(SpawnPrice × GenPriceMultiplier × ClaimK, 0) Money. GenPriceMultiplier ở cột O. Không Gen: SpawnPrice × ClaimK giữ đến cent theo data pet. Dùng decimal / integer cents cho tiền lớn.'],
['Các nguyên tắc tích hợp','Giữ catchId/pending qua reconnect; không roll lại hay cấp thưởng hai lần. Snapshot tap rules cùng cast. Server nên xác nhận điều kiện, tap, RNG và giao dịch; prototype hiện dùng client/localStorage.'],
['QA cần kiểm tra','Full đỏ/green/gold/mix; cap 100%; đúng 0 hoặc 1 Gen; hai biên 0.45 và 0.53 là vàng, 0.20 là xanh; wrap offset; touch không double tap; mua/thả/reset điểm; normalize sau sửa weight.']
];for(let i=0;i<mechanism.length;i++){const row=39+i;s.getRange(`A${row}:C${row}`).merge();s.getRange('A'+row).values=[[mechanism[i][0]]];s.getRange(`D${row}:P${row}`).merge();s.getRange('D'+row).values=[[mechanism[i][1]]];s.getRange(`A${row}:P${row}`).format={wrapText:true,rowHeight:43,fill:i%2===0?'#EEF5FA':'#FFFFFF'};}
section(52,'3. VÍ DỤ TÍNH ĐIỂM TAP');
head(53,['Kịch bản','Xanh: số tap','Vàng: số tap','Đỏ: số tap','P có Gen','P không Gen']);
rows(54,[['Full đỏ',0,0,3,null,null],['Full xanh',3,0,0,null,null],['Full vàng',0,3,0,null,null],['2 xanh + 1 vàng',2,1,0,null,null],['1 xanh + 2 vàng',1,2,0,null,null],['1 vàng + 2 đỏ',0,1,2,null,null]]);
for(let row=54;row<=59;row++){s.getRange('E'+row).formulas=[[`=MIN(1,B${row}*$D$27+C${row}*$D$28+D${row}*$D$29)`]];s.getRange('F'+row).formulas=[[`=1-E${row}`]];}s.getRange('E54:F59').setNumberFormat('0.00%');text(61,'Full vàng: 34% × 3 = 102% cap thành 100%, không phải nhận 2 Gen. Gen cùng rarity bằng tỷ lệ; không có cơ chế pity trong prototype.');
section(63,'4. TỐC ĐỘ VÒNG QTE THEO RARITY PET');
head(64,['Pet rarity','Giây / vòng','Độ / giây','Vòng / giây','Vùng xanh (ms)','Vùng vàng (ms)','Icon color','Fin color']);rows(65,Object.entries(f.mechanic.rarityTiming).map(([rarity,t])=>[rarity,t.secondsPerRevolution,null,null,null,null,t.color,t.finColor]));s.getRange('B65:B70').format.fill=yellow;
for(let row=65;row<=70;row++){s.getRange('C'+row).formulas=[[`=360/B${row}`]];s.getRange('D'+row).formulas=[[`=1/B${row}`]];s.getRange('E'+row).formulas=[[`=B${row}*0.20*1000`]];s.getRange('F'+row).formulas=[[`=B${row}*0.08*1000`]];}s.getRange('B65:F70').setNumberFormat('0.00');
text(72,'marker = (elapsedSeconds / secondsPerRevolution) % 1 ở debug mặc định. Xanh rộng 20% vòng, vàng rộng 8%. Số ms là thời gian đi qua vùng ở tốc độ đều, không phải timeout.');
text(73,'Giây/vòng thấp hơn = chạy nhanh hơn. Tab 7 không random speed mỗi tap. Pet pre-roll quyết định màu icon và trail. LEGENDARY vàng, MYTHIC đỏ, APEX xanh ngọc.');
section(75,'5. KEY VÀ METADATA ĐỂ MAP GEN');
head(76,['GenID','Nguồn data','Source ID','Material key','Effect key','Source value','Level cost ×','Icon reference']);
rows(77,g.catalog.map(x=>[x.id,x.effectSource.sheet,x.effectSource.sourceId,x.effectSource.materialKey||'',x.effectSource.effectKey,x.effectSource.value,x.effectSource.levelCostMultiplier,x.icon.file||'assets/mutations/gen-atlas.png / index '+x.icon.atlas]));s.getRange('A77:H87').format.wrapText=true;s.getRange('A77:H87').format.rowHeight=50;s.getRange('F77:G87').setNumberFormat('0.00');
text(89,'Weather source MultiplierPrice là phần cộng: Soaked 0.05 => giá ×1.05. Mutation source Multiplier dùng trực tiếp: Golden 1.33 => giá ×1.33. Level cost × chỉ là metadata, không áp dụng trong minigame.');
text(90,'Atlas assets/mutations/gen-atlas.png có 4 cột × 3 hàng; index 0-based, col=index%4, row=floor(index/4). File/key là tham chiếu map asset, ảnh gốc không nhúng trong Excel.');
text(91,'Vortex, Sequin, Sweetheart, Crystalline/diamond, Radioactive, Webbed, Bling Bling, Stormspark, Galaxy/Cosmic, Aurora không thuộc pool active. Không thêm lại metadata legacy vào roll mới.');
s.freezePanes.freezeRows(6);s.freezePanes.freezeColumns(2);
// Test normalization and the tap input dependencies, restoring all inputs.
for(let b=0;b<5;b++){assert.equal(s.getCell(18,4+b).values[0][0],1000000);assert(Math.abs(s.getCell(18,9+b).values[0][0]-1)<1e-9);assert.equal(s.getCell(20,4+b).values[0][0],10000*(b+1));}
s.getRange('D27').values=[[.2]];assert(Math.abs(s.getRange('E55').values[0][0]-.6)<1e-9);s.getRange('D27').values=[[.1]];s.getRange('E7').values=[[0]];assert.equal(s.getRange('J7').values[0][0],0);s.getRange('E7').values=[[g.rebirthProfiles[0].weights[g.catalog[0].id]]];
book.recalculate();assert.equal(s.getRange('E54').values[0][0],0);assert(Math.abs(s.getRange('E55').values[0][0]-.3)<1e-9);assert.equal(s.getRange('E56').values[0][0],1);assert.equal(s.getRange('C70').values[0][0],225);
console.log((await book.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#SPILL!',options:{useRegex:true,maxResults:10},maxChars:700})).ndjson);
await fs.mkdir(out+'/previews',{recursive:true});for(const [label,range] of [['UnifiedPool','A1:P24'],['UnifiedMechanic','A26:P50'],['UnifiedSpeed','A52:H73'],['UnifiedMetadata','A75:H91']]){const image=await book.render({sheetName:'MutaWeatherPool',range,scale:1,format:'png'});await fs.writeFile(out+'/previews/'+label+'.png',new Uint8Array(await image.arrayBuffer()));}
await (await SpreadsheetFile.exportXlsx(book)).save(out+'/Fishing_Config_Dev_Handoff.xlsx');console.log('Created one-sheet unified Gen pool + gameplay spec. No Simulation or FishPool sheets.');
