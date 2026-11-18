import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const dir='D:/revival-prototype-ui-update/outputs/sap-gen-config-20261116';
const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(await fs.readFile('D:/revival-prototype-ui-update/assets/gen-config.js','utf8'),ctx);
const config=ctx.window.GenConfig;
const wb=Workbook.create(),s=wb.worksheets.add('Config');s.showGridLines=false;
const letters='ABCDEFGHIJKLMNOP'.split('');
const rarity={basic:'COMMON',uncommon:'RARE',advanced:'EPIC',rare:'LEGENDARY',epic:'MYTHIC',exclusive:'APEX'};
const headers=['GenID','Tên hiển thị','Rarity','Enabled','SAP ID','SAP Type',...config.rebirthProfiles.map(p=>'Weight '+p.label),...config.rebirthProfiles.map(p=>'Rate '+p.label)];
s.getRange('A1').values=[['Config pool mutation and weather']];
s.getRange('A1:P19').format.font={name:'Arial',size:10,color:'#173D61'};
s.getRange('A1').format.font={name:'Arial',size:14,bold:true,color:'#111111'};
s.getRange('A1:P1').format.rowHeight=25;
s.getRange('A2:P2').values=[headers];
s.getRange('A2:P2').format={fill:'#2D5F82',font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},rowHeight:34,wrapText:true,verticalAlignment:'center',horizontalAlignment:'center'};
const rows=config.catalog.map(g=>[g.id,g.name,rarity[g.tier],Number(g.fishingEnabled),g.effectId,g.effectType,...config.rebirthProfiles.map(p=>p.weights[g.id]||0),...Array(5).fill(null)]);
s.getRange('A3:P13').values=rows;
s.getRange('A3:P15').format.rowHeight=23;
s.getRange('A3:P15').format.verticalAlignment='center';
for(let r=3;r<=13;r++){
  s.getRange(`A${r}:P${r}`).format.fill=r%2?'#EDF4FA':'#FFFFFF';
  for(let b=0;b<5;b++){
    const w=letters[6+b],rate=letters[11+b];
    s.getRange(`${rate}${r}`).formulas=[[`=IF(${w}$15=0,0,IF($D${r}=1,${w}${r}/${w}$15,0))`]];
  }
}
s.getRange('D3:D13').dataValidation={rule:{type:'list',values:['0','1']}};
s.getRange('D3:D13').format.fill='#FFF2CC';
s.getRange('G3:K13').format.fill='#FFF2CC';
s.getRange('E3:F13').format.fill='#E7EFF6';
s.getRange('G3:K15').setNumberFormat('#,##0');
s.getRange('L3:P15').setNumberFormat('0.00%');
s.getRange('D3:E13').setNumberFormat('0');
s.getRange('D3:E13').format.horizontalAlignment='center';
s.getRange('G3:P15').format.horizontalAlignment='right';
s.getRange('A15').values=[['TOTAL']];
s.getRange('A15:P15').format.font={name:'Arial',size:10,bold:true,color:'#173D61'};
s.getRange('A15:P15').format.borders={top:{style:'thin',color:'#A9B8C3'}};
for(let b=0;b<5;b++){
  const w=letters[6+b],rate=letters[11+b];
  s.getRange(`${w}15`).formulas=[[`=SUMIF($D$3:$D$13,1,${w}3:${w}13)`]];
  s.getRange(`${rate}15`).formulas=[[`=SUM(${rate}3:${rate}13)`]];
}
const widths=[118,106,108,65,62,118,...Array(5).fill(112),...Array(5).fill(105)];
widths.forEach((width,i)=>s.getRange(`${letters[i]}1:${letters[i]}19`).format.columnWidthPx=width);
s.getRange('A17').values=[['Rate = Weight / tổng Weight đang bật của từng mốc Rebirth. Rate là tỷ lệ loại Gen sau khi đã nhận Gen.']];
s.getRange('A18').values=[['Dùng weight và rarity của config web hiện tại; không sao chép các ô Weight / Rate bị lệch trong ảnh mẫu.']];
s.getRange('A19').values=[['SAP ID: Mutation (V2.3.1) và Weather Effects, Master Data bản local 05/11/2026. ID trùng số được phân biệt bằng SAP Type.']];
s.getRange('A17:P19').format.font={name:'Arial',size:10,color:'#56697D'};
s.getRange('A17:P19').format.rowHeight=22;
s.freezePanes.freezeRows(2);
// Prove formulas react to both weight edits and enabled switches.
const initial=s.getRange('G3').values[0][0];
s.getRange('G3').values=[[initial+1000]];
assert(Math.abs(s.getRange('L3').values[0][0]-(initial+1000)/1001000)<1e-10);
s.getRange('G3').values=[[initial]];
s.getRange('D3').values=[[0]];
assert.equal(s.getRange('L3').values[0][0],0);
assert.equal(s.getRange('G15').values[0][0],1000000-initial);
s.getRange('D3').values=[[1]];
wb.recalculate();
for(let b=0;b<5;b++){
  assert.equal(s.getRange(`${letters[6+b]}15`).values[0][0],1000000);
  assert(Math.abs(s.getRange(`${letters[11+b]}15`).values[0][0]-1)<1e-10);
}
for(let i=0;i<11;i++)for(let b=0;b<5;b++)assert(Math.abs(s.getRange(`${letters[11+b]}${i+3}`).values[0][0]-rows[i][6+b]/1000000)<1e-10);
const scan=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!',options:{useRegex:true,maxResults:10},maxChars:1000});
await fs.writeFile(dir+'/formula-check.ndjson',scan.ndjson);
const img=await wb.render({sheetName:'Config',range:'A1:P19',scale:1.5,format:'png'});
await fs.writeFile(dir+'/preview.png',new Uint8Array(await img.arrayBuffer()));
await (await SpreadsheetFile.exportXlsx(wb)).save(dir+'/Config_Gen_SAP_ID.xlsx');
console.log('PASS 11 Gen, 5 band totals 1,000,000 / 100%; all 55 rates match weights; weight/Enabled recalculation verified.');
console.log(scan.ndjson);
