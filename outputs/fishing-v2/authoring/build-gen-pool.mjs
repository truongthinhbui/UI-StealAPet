import fs from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const root='D:/revival-prototype-ui-update',out=path.join(root,'outputs/gen-pool-current');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(await fs.readFile(path.join(root,'assets/gen-config.js'),'utf8'),ctx);
const config=ctx.window.GenConfig,book=Workbook.create(),s=book.worksheets.add('GenPool');
s.showGridLines=false;s.tabColor='#285B83';
const bandNames=['R9-R12','R13-R16','R17-R20','R21-R24','R25+'];
const headers=['ID',...bandNames.map(label=>'Weight_'+label),'Name','Rarity group','Family',...bandNames.map(label=>'Rate_'+label),'Enabled'];
const tiers={basic:'COMMON',uncommon:'RARE',advanced:'EPIC',rare:'LEGENDARY',epic:'MYTHIC',exclusive:'APEX'};
const rows=config.catalog.map(g=>[g.id,...config.rebirthProfiles.map(p=>p.weights[g.id]||0),g.name,tiers[g.tier],g.family,...Array(5).fill(null),g.fishingEnabled?1:0]);
s.getRange('A1:O18').format.font={name:'Arial',size:10,color:'#203C50'};
const widths=[135,125,125,125,125,125,160,125,135,115,115,115,115,115,95];
widths.forEach((w,i)=>s.getRangeByIndexes(0,i,27,1).format.columnWidthPx=w);
s.getRange('A1:O1').values=[headers];s.getRange('A1:O1').format={fill:'#285B83',font:{name:'Arial',size:10,color:'#FFFFFF',bold:true},horizontalAlignment:'center',verticalAlignment:'center',wrapText:true,rowHeight:40};
s.getRange('A2:O18').values=rows;s.getRange('A2:O18').format.rowHeight=29;s.getRange('A2:O18').format.verticalAlignment='center';
s.tables.add('A1:O18',true,'UnifiedGenPool');s.freezePanes.freezeRows(1);s.freezePanes.freezeColumns(1);
for(let i=0;i<17;i++){
 const row=i+2;
 for(let b=0;b<5;b++){const w=String.fromCharCode(66+b);s.getCell(row-1,9+b).formulas=[[`=IF($O${row}=1,${w}${row}/SUMIFS(${w}$2:${w}$18,$O$2:$O$18,1),0)`]];}
 if(config.catalog[i].fishingEnabled)s.getRange(`B${row}:F${row}`).format.fill='#FFF2CC';
}
s.getRange('B2:F18').setNumberFormat('#,##0');s.getRange('J2:N18').setNumberFormat('0.0000%');s.getRange('J2:N18').format.font.color='#17694D';
s.getRange('O2:O18').dataValidation={rule:{type:'list',values:['1','0']}};
s.getRange('A20').values=[['POOL_TOTAL']];for(let b=0;b<5;b++){const w=String.fromCharCode(66+b),p=String.fromCharCode(74+b);s.getCell(19,1+b).formulas=[[`=SUMIFS(${w}2:${w}18,$O$2:$O$18,1)`]];s.getCell(19,9+b).formulas=[[`=SUM(${p}2:${p}18)`]];}
s.getRange('A20:O20').format={fill:'#E3EDF5',font:{name:'Arial',size:10,bold:true,color:'#285B83'},rowHeight:30};s.getRange('B20:F20').setNumberFormat('#,##0');s.getRange('J20:N20').setNumberFormat('0.0000%');
const notes=[
 'GIẢI THÍCH POOL MUTA / WEATHER GEN',
 'Mở khóa từ R9. Roll pet theo fishing 1.0.1, tính cơ hội nhận Gen từ 3 tap, sau đó chọn 1 Gen theo Rebirth. Pet không bị chỉnh sửa.',
 'Pool còn 17 Gen. Đã bỏ Bling Bling, Stormspark, Galaxy, Aurora; weight còn lại được chuẩn hóa theo cùng tỉ lệ.',
 'ID là mã Gen; Name là tên; Family là MutaGen hoặc WeatherGen. Hai nguồn dùng chung một pool.',
 'Rarity group: COMMON, RARE, EPIC, LEGENDARY, MYTHIC, APEX. Gen rarity cao hơn có Rate thấp hơn; pool chưa có APEX Gen.',
 'Weight là trọng số tương đối. Rate = Weight / tổng Weight Enabled = 1 trong cùng mốc Rebirth.',
 'Rate tính KHI ĐÃ được nhận Gen, không phải xác suất nhận Gen đó trên mọi lượt câu.',
 'Enabled = 1: có thể rơi; 0: bỏ khỏi pool. Sửa Weight màu vàng hoặc Enabled thì Rate tự tính lại.',
 'Rebirth dùng đúng một cột R9–12 / R13–16 / R17–20 / R21–24 / R25+. Trong cùng mốc, pool không đổi.',
 'Rebirth cao tăng chất lượng Gen; không cộng thêm cơ hội nhận Gen và không sửa tỉ lệ pet.',
 'Có 2 preset trong Debug áp dụng cả chơi thật và mô phỏng. Mặc định: 1 giờ online/ngày, tính cả chờ event.',
 'Xác suất Gen X / lượt câu = cơ hội có Gen từ tap × Rate Gen X. Full đỏ vẫn câu được pet, không có Gen.',
 'Xác suất pet + Gen X = xác suất pet theo data gốc × cơ hội có Gen từ tap × Rate Gen X theo Rebirth.',
 'Webbed theo Rebirth: 0,1% / 0,3% / 0,7% / 1,5% / 3,7638% khi đã nhận Gen.',
 'Preset online: xanh +8,2881%, vàng +16,5762%; full vàng 49,7286% có Gen. Apex + Gen bất kỳ kỳ vọng 4,5 giờ online.',
 'Preset thực sự câu: xanh +1,3213%, vàng +2,6426%; full vàng 7,9277% có Gen. Apex + Gen bất kỳ kỳ vọng 4,5 giờ câu.',
 'Mỗi preset tương ứng 4,5 ngày × 1 giờ/ngày theo đúng cách đo. Full đỏ 0 Gen; tối đa 1 Gen; weight loại Gen không đổi.',
 'Webbed cụ thể ở R25+ kỳ vọng khoảng 119,6 ngày theo cách đo của preset, không phải mục tiêu 4–5 ngày.',
 'Kỳ vọng không phải bảo đảm. Các lượt roll độc lập, không pity. Chỉnh Excel không tự cập nhật website.',
 'Source: gen-config.js ('+config.version+'); danh mục đối chiếu Master Data, MutaGen Config và WeatherGen Config.'
];
notes.forEach((text,i)=>{s.getRange('A'+(23+i)+':O'+(23+i)).merge();s.getRange('A'+(23+i)).values=[[text]];s.getRange('A'+(23+i)).format.font={name:'Arial',size:10,italic:true,color:'#617B90'};s.getRange('A'+(23+i)).format.rowHeight=23;});
// Check normalization and linked updates before restoring exported values.
s.getRange('B2').values=[[0]];assert.equal(s.getRange('J2').values[0][0],0);s.getRange('B2').values=[[config.rebirthProfiles[0].weights[config.catalog[0].id]]];
book.recalculate();
for(let b=0;b<5;b++){assert.equal(s.getCell(19,1+b).values[0][0],1000000);assert(Math.abs(s.getCell(19,9+b).values[0][0]-1)<1e-9);}
assert.equal(rows.length,17);
console.log((await book.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',options:{useRegex:true,maxResults:10},summary:'Formula error check',maxChars:700})).ndjson);
await fs.mkdir(path.join(out,'previews'),{recursive:true});console.log((await book.inspect({kind:'table',range:'GenPool!A1:O3',include:'values,formulas',tableMaxRows:3,tableMaxCols:15,maxChars:2500})).ndjson);const preview=await book.render({sheetName:'GenPool',range:'A1:O44',scale:1,format:'png'});await fs.writeFile(path.join(out,'previews/GenPool-simple.png'),new Uint8Array(await preview.arrayBuffer()));
await (await SpreadsheetFile.exportXlsx(book)).save(path.join(out,'Muta_Weather_Gen_Pool.xlsx'));
console.log('Created single-sheet GenPool: 17 rows, 5 weight columns, 5 calculated rate columns, totals and enabled flag.');
