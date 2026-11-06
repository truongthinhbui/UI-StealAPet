import fs from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const root='D:/revival-prototype-ui-update',out=path.join(root,'outputs/gen-pool-current');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(await fs.readFile(path.join(root,'assets/gen-config.js'),'utf8'),ctx);
const config=ctx.window.GenConfig,book=Workbook.create(),s=book.worksheets.add('GenPool');
const end=config.catalog.length+1,totalRow=end+2,noteStart=totalRow+3;
s.showGridLines=false;s.tabColor='#285B83';
const bandNames=['R9-R12','R13-R16','R17-R20','R21-R24','R25+'];
const headers=['ID',...bandNames.map(label=>'Weight_'+label),'Name','Rarity group','Family',...bandNames.map(label=>'Rate_'+label),'Enabled'];
const tiers={basic:'COMMON',uncommon:'RARE',advanced:'EPIC',rare:'LEGENDARY',epic:'MYTHIC',exclusive:'APEX'};
const rows=config.catalog.map(g=>[g.id,...config.rebirthProfiles.map(p=>p.weights[g.id]||0),g.name,tiers[g.tier],g.family,...Array(5).fill(null),g.fishingEnabled?1:0]);
s.getRange(`A1:O${end}`).format.font={name:'Arial',size:10,color:'#203C50'};
const widths=[135,125,125,125,125,125,160,125,135,115,115,115,115,115,95];
widths.forEach((w,i)=>s.getRangeByIndexes(0,i,27,1).format.columnWidthPx=w);
s.getRange('A1:O1').values=[headers];s.getRange('A1:O1').format={fill:'#285B83',font:{name:'Arial',size:10,color:'#FFFFFF',bold:true},horizontalAlignment:'center',verticalAlignment:'center',wrapText:true,rowHeight:40};
s.getRange(`A2:O${end}`).values=rows;s.getRange(`A2:O${end}`).format.rowHeight=29;s.getRange(`A2:O${end}`).format.verticalAlignment='center';
s.tables.add(`A1:O${end}`,true,'UnifiedGenPool');s.freezePanes.freezeRows(1);s.freezePanes.freezeColumns(1);
for(let i=0;i<config.catalog.length;i++){
 const row=i+2;
 for(let b=0;b<5;b++){const w=String.fromCharCode(66+b);s.getCell(row-1,9+b).formulas=[[`=IF($O${row}=1,${w}${row}/SUMIFS(${w}$2:${w}$${end},$O$2:$O$${end},1),0)`]];}
 if(config.catalog[i].fishingEnabled)s.getRange(`B${row}:F${row}`).format.fill='#FFF2CC';
}
s.getRange(`B2:F${end}`).setNumberFormat('#,##0');s.getRange(`J2:N${end}`).setNumberFormat('0.0000%');s.getRange(`J2:N${end}`).format.font.color='#17694D';
s.getRange(`O2:O${end}`).dataValidation={rule:{type:'list',values:['1','0']}};
s.getRange('A'+totalRow).values=[['POOL_TOTAL']];for(let b=0;b<5;b++){const w=String.fromCharCode(66+b),p=String.fromCharCode(74+b);s.getCell(totalRow-1,1+b).formulas=[[`=SUMIFS(${w}2:${w}${end},$O$2:$O$${end},1)`]];s.getCell(totalRow-1,9+b).formulas=[[`=SUM(${p}2:${p}${end})`]];}
s.getRange(`A${totalRow}:O${totalRow}`).format={fill:'#E3EDF5',font:{name:'Arial',size:10,bold:true,color:'#285B83'},rowHeight:30};s.getRange(`B${totalRow}:F${totalRow}`).setNumberFormat('#,##0');s.getRange(`J${totalRow}:N${totalRow}`).setNumberFormat('0.0000%');
for(const [offset,label,operator] of [[1,'GROUP_96','<>LEGENDARY'],[2,'GROUP_4','LEGENDARY']]){
 const row=totalRow+offset;s.getRange('A'+row).values=[[label]];
 for(let b=0;b<5;b++){const w=String.fromCharCode(66+b),r=String.fromCharCode(74+b);s.getCell(row-1,1+b).formulas=[[`=SUMIFS(${w}2:${w}${end},$H$2:$H$${end},"${operator}",$O$2:$O$${end},1)`]];s.getCell(row-1,9+b).formulas=[[`=SUMIFS(${r}2:${r}${end},$H$2:$H$${end},"${operator}",$O$2:$O$${end},1)`]];}
 s.getRange(`A${row}:O${row}`).format={font:{name:'Arial',size:10,color:'#285B83'},rowHeight:27};s.getRange(`B${row}:F${row}`).setNumberFormat('#,##0');s.getRange(`J${row}:N${row}`).setNumberFormat('0.00%');
}
const notes=[
 'GIẢI THÍCH POOL MUTA / WEATHER GEN',
 'Mở khóa từ R9. Roll pet theo fishing 1.0.1, tính cơ hội nhận Gen từ 3 tap, sau đó chọn 1 Gen theo Rebirth. Pet không bị chỉnh sửa.',
 'Pool còn '+config.catalog.length+' Gen. Đã bỏ thêm Vortex, Sequin, Sweetheart, Crystalline, Radioactive, Webbed theo yêu cầu.',
 'Nhóm Golden–Eclipse tổng 96%. Fossilized và Prismatic mỗi loại 2%, tổng 4%, trong cả 5 mốc Rebirth.',
 'ID là mã Gen; Name là tên; Family là MutaGen hoặc WeatherGen. Hai nguồn dùng chung một pool.',
 'Rarity group: COMMON, RARE, EPIC, LEGENDARY, MYTHIC, APEX. Gen cùng rarity có Rate bằng nhau; COMMON > RARE > EPIC > LEGENDARY ở mọi mốc Rebirth.',
 'Weight là trọng số tương đối. Rate = Weight / tổng Weight Enabled = 1 trong cùng mốc Rebirth.',
 'Rate tính KHI ĐÃ được nhận Gen, không phải xác suất nhận Gen đó trên mọi lượt câu.',
 'Enabled = 1: có thể rơi; 0: bỏ khỏi pool. Sửa Weight màu vàng hoặc Enabled thì Rate tự tính lại.',
 'Rebirth dùng đúng một cột R9–12 / R13–16 / R17–20 / R21–24 / R25+. Trong cùng mốc, pool không đổi.',
 'Tỉ lệ tăng/giảm đều qua 5 mốc: COMMON 25% xuống 14%; RARE 9% lên 12%; EPIC 4,75% lên 8%; LEGENDARY giữ 2%.',
 'Có 2 preset trong Debug áp dụng cả chơi thật và mô phỏng. Mặc định: 1 giờ online/ngày, tính cả chờ event.',
 'Xác suất Gen X / lượt câu = cơ hội có Gen từ tap × Rate Gen X. Full đỏ vẫn câu được pet, không có Gen.',
 'Xác suất pet + Gen X = xác suất pet theo data gốc × cơ hội có Gen từ tap × Rate Gen X theo Rebirth.',

 'Preset online: xanh +8,2881%, vàng +16,5762%; full vàng 49,7286% có Gen. Apex + Gen bất kỳ kỳ vọng 4,5 giờ online.',
 'Preset thực sự câu: xanh +1,3213%, vàng +2,6426%; full vàng 7,9277% có Gen. Apex + Gen bất kỳ kỳ vọng 4,5 giờ câu.',
 'Mỗi preset tương ứng 4,5 ngày × 1 giờ/ngày theo đúng cách đo. Full đỏ 0 Gen; tối đa 1 Gen; cơ hội nhận Gen không đổi khi chia nhóm 96/4.',

 'Kỳ vọng không phải bảo đảm. Các lượt roll độc lập, không pity. Chỉnh Excel không tự cập nhật website.',
 'Source: gen-config.js ('+config.version+'); danh mục đối chiếu Master Data, MutaGen Config và WeatherGen Config.'
];
notes.forEach((text,i)=>{s.getRange('A'+(noteStart+i)+':O'+(noteStart+i)).merge();s.getRange('A'+(noteStart+i)).values=[[text]];s.getRange('A'+(noteStart+i)).format.font={name:'Arial',size:10,italic:true,color:'#617B90'};s.getRange('A'+(noteStart+i)).format.rowHeight=23;});
// Check normalization and linked updates before restoring exported values.
s.getRange('B2').values=[[0]];assert.equal(s.getRange('J2').values[0][0],0);s.getRange('B2').values=[[config.rebirthProfiles[0].weights[config.catalog[0].id]]];
book.recalculate();
for(let b=0;b<5;b++){assert.equal(s.getCell(totalRow-1,1+b).values[0][0],1000000);assert(Math.abs(s.getCell(totalRow-1,9+b).values[0][0]-1)<1e-9);}
assert.equal(rows.length,config.catalog.length);for(let b=0;b<5;b++){assert.equal(s.getCell(totalRow,1+b).values[0][0],960000);assert.equal(s.getCell(totalRow+1,1+b).values[0][0],40000);}
// A linked probability exercise: inputs above, one calculation table below.
const fishCtx={window:{}};vm.createContext(fishCtx);vm.runInContext(await fs.readFile(path.join(root,'assets/fishing-config.js'),'utf8'),fishCtx);
const fish=fishCtx.window.FishingConfig,p=book.worksheets.add('Probability');p.showGridLines=false;
p.getRange('A1:H36').format.font={name:'Arial',size:11,color:'#203C50'};
[300,150,145,145,145,145,145,150].forEach((w,i)=>p.getRangeByIndexes(0,i,36,1).format.columnWidthPx=w);
p.getRange('A2:H2').merge();p.getRange('A2').values=[['PET × GEN — BÀI TÍNH XÁC SUẤT']];p.getRange('A2').format.font.bold=true;
const inputs=[['Rebirth',25],['Online phút/ngày',40],['Giây/lượt câu',10],['Phút câu/chu kỳ',11],['Phút/chu kỳ weather',69],['Cơ hội có Gen (full vàng online)',config.balancePresets.online.gold*3/100],['Số ngày để tính khả năng có',7]];
p.getRange('A4:B10').values=inputs;p.getRange('B4:B10').format.fill='#FFF2CC';p.getRange('B9').setNumberFormat('0.0000%');
p.getRange('D4:H4').values=[fish.bands.map(b=>b.label)];p.getRange('C5:C10').values=['COMMON','RARE','EPIC','LEGENDARY','MYTHIC','APEX'].map(x=>[x]);
for(let i=0;i<6;i++)p.getRange(`D${i+5}:H${i+5}`).values=[fish.bands.map((_,b)=>fish.pets.filter(x=>x.rarity===['COMMON','RARE','EPIC','LEGENDARY','MYTHIC','APEX'][i]).reduce((a,x)=>a+x.weights[b],0))];
for(let b=0;b<5;b++){const col=String.fromCharCode(68+b);p.getRange(col+'11').formulas=[[`=SUM(${col}5:${col}10)`]];}
p.getRange('A12:A15').values=[['Cột pet theo data'],['Cột Gen theo Rebirth'],['Lượt/ngày (trung bình)'],['P(Apex)/lượt']];
p.getRange('B12').formulas=[['=IF(B4<5,1,IF(B4<9,2,IF(B4<14,3,IF(B4<19,4,5))))']];
p.getRange('B13').formulas=[['=IF(B4<13,1,IF(B4<17,2,IF(B4<21,3,IF(B4<25,4,5))))']];
p.getRange('B14').formulas=[['=B5*60/B6*B7/B8']];p.getRange('B15').formulas=[['=INDEX(D10:H10,1,B12)/INDEX(D11:H11,1,B12)']];p.getRange('B15').setNumberFormat('0.0000%');
p.getRange('A17:H17').values=[['Mục tiêu','Rate loại Gen','P / lượt','Lượt kỳ vọng','Giờ thực câu','Giờ online','Ngày kỳ vọng','P có sau N ngày']];
for(let i=0;i<13;i++){const r=18+i;p.getRange('A'+r).values=[[i===0?'Apex bất kỳ':i===1?'Apex + Gen bất kỳ':'Apex + '+config.catalog[i-2].name]];p.getRange('B'+r).formulas=[[i<2?'=1':`=INDEX(GenPool!J${i}:N${i},1,$B$13)`]];p.getRange('C'+r).formulas=[[i===0?'=$B$15':`=$B$15*$B$9*B${r}`]];p.getRange('D'+r).formulas=[[`=IF(C${r}>0,1/C${r},0)`]];p.getRange('E'+r).formulas=[[`=D${r}*$B$6/3600`]];p.getRange('F'+r).formulas=[[`=E${r}*$B$8/$B$7`]];p.getRange('G'+r).formulas=[[`=IF($B$14>0,D${r}/$B$14,0)`]];p.getRange('H'+r).formulas=[[`=1-(1-C${r})^($B$14*$B$10)`]];}
p.getRange('B18:C30').setNumberFormat('0.0000%');p.getRange('D18:G30').setNumberFormat('#,##0.00');p.getRange('H18:H30').setNumberFormat('0.00%');
p.getRange('A17:H17').format={fill:'#285B83',font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:38,wrapText:true};p.getRange('A18:H30').format.rowHeight=28;
const context=['Ô vàng: chỉnh giả định. Rate loại Gen liên kết GenPool; không sửa pool pet gốc. Chỉ áp dụng từ R9.', 'Kỳ vọng là trung bình, không bảo đảm. P = P(pet) × P(có Gen) × Rate loại Gen. Đủ tiền mua, không pity.', 'Model trung bình gồm chờ event; 10 giây là toàn bộ một lượt câu. Không tính di chuyển.', 'Mô phỏng 50.000 người/mục tiêu, 40 phút/ngày cùng giờ: Apex + Gen bất kỳ trung bình 7,28 ngày, P90 16 ngày.', 'Nguồn: fishing-config.js / fishing 1.0.1; gen-config.js. Mô phỏng là snapshot; sửa ô không chạy lại mô phỏng.'];
context.forEach((x,i)=>{p.getRange(`A${32+i}:H${32+i}`).merge();p.getRange('A'+(32+i)).values=[[x]];p.getRange('A'+(32+i)).format.font={name:'Arial',size:10,color:'#617B90',italic:true};p.getRange('A'+(32+i)).format.rowHeight=25;});
book.recalculate();assert(Math.abs(p.getRange('G19').values[0][0]-6.75)<1e-6);assert(Math.abs(p.getRange('G29').values[0][0]-337.5)<1e-5);
console.log((await book.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',options:{useRegex:true,maxResults:10},summary:'Formula error check',maxChars:700})).ndjson);
await fs.mkdir(path.join(out,'previews'),{recursive:true});console.log((await book.inspect({kind:'table',range:'GenPool!A1:O3',include:'values,formulas',tableMaxRows:3,tableMaxCols:15,maxChars:2500})).ndjson);const preview=await book.render({sheetName:'GenPool',range:`A1:O${noteStart+notes.length-1}`,scale:1,format:'png'});await fs.writeFile(path.join(out,'previews/GenPool-simple.png'),new Uint8Array(await preview.arrayBuffer()));
await (await SpreadsheetFile.exportXlsx(book)).save(path.join(out,'Muta_Weather_Gen_Pool.xlsx'));
const probabilityPreview=await book.render({sheetName:'Probability',range:'A1:H36',scale:1,format:'png'});await fs.writeFile(path.join(out,'previews/Probability.png'),new Uint8Array(await probabilityPreview.arrayBuffer()));
console.log('Created single-sheet GenPool: 11 rows, 5 weight columns, 5 calculated rate columns, totals and enabled flag.');
