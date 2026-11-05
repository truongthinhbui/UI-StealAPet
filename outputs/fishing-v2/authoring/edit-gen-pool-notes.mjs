import fs from 'node:fs/promises';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
import assert from 'node:assert/strict';
const dir='D:/revival-prototype-ui-update/outputs/gen-pool-current',file=dir+'/Muta_Weather_Gen_Pool.xlsx';
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(file)),s=wb.worksheets.getItem('GenPool');
const before=JSON.stringify(s.getRange('A1:O24').values),formulas=JSON.stringify(s.getRange('A1:O24').formulas);
s.getRange('A27:O30').unmerge();s.getRange('A27:O30').clear({applyTo:'all'});
const notes=[
['GIẢI THÍCH POOL MUTA / WEATHER GEN',true],
['1. Trình tự: roll pet theo data gốc, tính cơ hội nhận Gen từ 3 tap, sau đó chọn 1 Gen trong pool của mốc Rebirth.',false],
['2. ID là mã Gen. Name là tên hiển thị. Family phân biệt MutaGen và WeatherGen; cả hai dùng chung một pool.',false],
['3. Rarity group là nhóm độ hiếm. Nhóm hiếm có tổng weight thấp hơn nhóm phổ thông và ít gặp.',false],
['4. Weight_R... là trọng số tương đối theo mốc Rebirth. Ví dụ Weight 100 trên tổng 1.000.000 tương ứng Rate 0,01%.',false],
['5. Rate_R... = Weight của Gen / tổng Weight của các Gen Enabled = 1 trong cùng cột Rebirth.',false],
['6. Rate là xác suất chọn loại Gen KHI ĐÃ nhận được Gen, không phải xác suất nhận Gen đó trên mọi lượt câu.',false],
['7. Enabled = 1: có thể rơi; 0: loại khỏi pool và chuẩn hóa lại Rate. Ô Weight màu vàng có thể chỉnh; Rate tự tính.',false],
['8. Chỉ dùng cột theo Rebirth hiện tại: R1–4, R5–8, R9–13, R14–18 hoặc R19+. Trong cùng một mốc, pool không đổi.',false],
['9. Rebirth cao tăng cơ hội chọn Gen chất lượng cao. Rebirth không cộng thêm % nhận Gen và không sửa pool pet.',false],
['CÁCH TÍNH CƠ HỘI NHẬN GEN',true],
['Mỗi tap: đỏ +0%, xanh lá +5%, vàng +20%. Cộng đúng 3 tap, tối đa 60%. Mỗi pet nhận tối đa 1 Gen.',false],
['Full đỏ: vẫn bắt được pet, không Gen. Full xanh: 15% có Gen. Full vàng: 60% có Gen, 40% không Gen.',false],
['Ví dụ 1 xanh + 1 vàng + 1 đỏ: 5% + 20% + 0% = 25% có Gen. Không có cơ chế double mutation.',false],
['Xác suất nhận Gen X trên một lượt câu = cơ hội có Gen từ tap × Rate của Gen X trong mốc Rebirth.',false],
['VÍ DỤ THEO CONFIG HIỆN TẠI',true],
['R1–4, full vàng, Golden: 60% × 61,75% = 37,05% mỗi lượt câu, trung bình 370,5 trên 1.000 lượt.',false],
['R19+, full vàng, Galaxy: 60% × 0,009% = 0,0054% mỗi lượt câu, trung bình 0,054 trên 1.000 lượt.',false],
['Mốc trung bình không phải bảo đảm. 1.000 lượt có thể chưa ra Gen cực hiếm; các lượt roll độc lập, không có pity.',false],
['Pet + Gen cụ thể: xác suất pet theo data gốc × cơ hội có Gen từ tap × Rate Gen theo Rebirth.',false],
['Chỉnh Excel không tự cập nhật website. Các ví dụ số là minh họa tại thời điểm xuất file, không tự đổi theo Weight.',false],
['Nguồn: cấu hình merged-gen-7-rebirth-progression. Danh mục đối chiếu Master Data, MutaGen Config và WeatherGen Config.',false]
];
for(let i=0;i<notes.length;i++){const row=27+i,[text,heading]=notes[i],r=s.getRange(`A${row}:O${row}`);r.merge();s.getRange(`A${row}`).values=[[text]];r.format={font:{name:'Arial',size:10,color:heading?'#285B83':'#435D72',bold:heading},wrapText:true,verticalAlignment:'center',rowHeight:heading?30:26};if(heading)r.format.fill='#E3EDF5';}
wb.recalculate();assert.equal(JSON.stringify(s.getRange('A1:O24').values),before);assert.equal(JSON.stringify(s.getRange('A1:O24').formulas),formulas);
console.log((await wb.inspect({kind:'table',range:'GenPool!A27:A31',include:'values',tableMaxRows:5,maxChars:1500})).ndjson);
const png=await wb.render({sheetName:'GenPool',range:'A27:O48',scale:1,format:'png'});await fs.writeFile(dir+'/previews/GenPool-explanations.png',new Uint8Array(await png.arrayBuffer()));
await (await SpreadsheetFile.exportXlsx(wb)).save(file);console.log('PASS added explanation below pool; original table values and formulas unchanged.');
