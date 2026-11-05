import fs from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const root='D:/revival-prototype-ui-update',out=path.join(root,'outputs/fishing-v3');
const ctx={window:{}};vm.createContext(ctx);
for(const file of ['fishing-config.js','fishing-pool.js','gen-config.js','gen-core.js'])vm.runInContext(await fs.readFile(path.join(root,'assets',file),'utf8'),ctx);
const {FishingConfig:fish,GenConfig:gen,GenCore:core}=ctx.window;
const simulation=JSON.parse(await fs.readFile(path.join(root,'reports/fishing-simulation.json'),'utf8'));
const wb=Workbook.create(),nav=[];
const col=n=>{let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;};
function add(name,title,subtitle,headers,rows,widths){
 const sheet=wb.worksheets.add(name),last=col(headers.length-1),end=5+rows.length;sheet.showGridLines=false;
 sheet.getRange(`A1:${last}${end}`).format.font={name:'Arial',size:10,color:'#243C50'};
 widths.forEach((width,i)=>sheet.getRange(`${col(i)}1:${col(i)}${end}`).format.columnWidthPx=width);
 sheet.getRange('A2').values=[[title]];sheet.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:'#285B83'};sheet.getRange('A2').format.rowHeight=28;
 sheet.getRange('A3').values=[[subtitle]];sheet.getRange('A3').format.font={name:'Arial',size:10,italic:true,color:'#617B90'};sheet.getRange('A3').format.rowHeight=22;
 sheet.getRange(`A5:${last}5`).values=[headers];sheet.getRange(`A5:${last}5`).format={fill:'#285B83',font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},rowHeight:36,wrapText:true,horizontalAlignment:'center',verticalAlignment:'center'};
 sheet.getRange(`A6:${last}${end}`).values=rows.map(row=>headers.map((_,i)=>row[i]??null));sheet.getRange(`A6:${last}${end}`).format.wrapText=true;sheet.getRange(`A6:${last}${end}`).format.verticalAlignment='center';
 rows.forEach((row,i)=>{const lines=Math.max(1,...row.map((value,c)=>typeof value==='string'?Math.ceil(value.length/Math.max(10,Math.floor(widths[c]/6.2))):1));sheet.getRange(`A${i+6}:${last}${i+6}`).format.rowHeight=Math.max(28,lines*13+10);});
 sheet.tables.add(`A5:${last}${end}`,true,'Config'+name);sheet.freezePanes.freezeRows(5);sheet.tabColor='#285B83';nav.push(name);return sheet;
}
function note(s,row,text){s.getRange('A'+row).values=[[text]];s.getRange('A'+row).format.font={name:'Arial',size:9,italic:true,color:'#617B90'};}
const rulesRows=[
 ['RollOrder','Fish → GenCount → GenTypes','sequence','Live + simulation','Một lần roll cá, sau đó roll Gen cho chính con cá đó.'],
 ['RollTiming','After third scored tap','event','Live + simulation','Không reroll khi Mua/Thả/reload. Gen không đổi PetID hoặc rarity cá.'],
 ['ScoredTaps',3,'tap','Mechanic','Tap mở lượt không tính vào 3 tap chấm điểm.'],
 ['GreenPoints',20,'points','Gen count','Full xanh = 60% nhận 1 Gen.'],
 ['GoldPoints',40,'points','Gen count','Full vàng = 1 Gen chắc chắn + 20% thêm Gen thứ hai.'],
 ['RedPoints',0,'points','Gen count','Full đỏ vẫn nhận cá offer, không có Gen.'],
 ['MaxGen',2,'Gen/fish','Gen count','Không có hai Gen trùng ID trên cùng cá.'],
 ['CarryProgress',false,'boolean','Gen count','Không carry điểm qua lượt khác.'],
 ['FamilySelection','One merged weighted pool','rule','MutaGen + WeatherGen','Không roll family riêng, không roll một lần Muta rồi thêm một lần Weather.'],
 ['GenTypeDraw','Weighted without replacement','rule','Gen types','Gen thứ hai loại Gen thứ nhất khỏi pool và chuẩn hóa lại.'],
 ['FishRarityBoost',false,'boolean','Separation','Tap/Gen không nâng rarity hoặc đổi weight cá.'],
 ['FishPoolSource','Fishing!A1:Q37','source','Master Data','Pool cũ 35 loài cá; không dùng fishing 1.0.1.'],
 ['RebirthBands','1–5 / 6–10 / 11–15 / 16–20 / 21+','ranges','Fish + Gen','Rebirth được snapshot lúc bắt đầu lượt câu.'],
 ['AboveRB25','Reuse source RB21–25 weights','fallback','Legacy source','Dữ liệu gốc dừng ở band 21–25; từ 26 dùng lại band cuối.'],
 ['PetConfigVersion',fish.version,'version','Snapshot','Offer cũ giữ nguyên reward và giá đã stamp.'],
 ['GenConfigVersion',gen.version,'version','Snapshot','21 target chung; 5 được phép rơi khi câu; 16 luôn khóa.'],
 ['FishingEnabledGen','Golden, Soaked, Frozen, Frost, Gale','whitelist','Gen types','Rebirth chỉ điều chỉnh weight 5 loại này, không mở Gen cao cấp.'],
 ['ItemGrades','S / SS / SSS','metadata','ItemGrades sheet','Giá và base apply chance là thông số item gốc, KHÔNG phải drop chance khi câu.'],
 ['ClaimK',1.10,'multiplier','Price','Giá = SpawnPrice × ClaimK, lưu nguyên cent; không dùng cached ClaimPrice làm tròn cũ.'],
 ['PriceGenSurcharge',0,'Money','Price','Hiện chưa cộng phụ phí Gen; cần review economy trước production.'],
 ['CachedPriceMismatch','SALMON source Q differs from O×P','source issue','Legacy source','Dùng O×P; không nhân thêm hệ số chưa được duyệt.'],
 ['CastCost',0,'Money','Flow','Chỉ Mua offer mới trừ tiền; Thả không cấp cá hoặc Gen.'],
 ['AllowedWeather','HighTide / HeavyRain','enum','Flow','Lượt đã mở vẫn được giải quyết sau khi thời tiết kết thúc.'],
 ['ChestsEnabled',false,'boolean','Flow','Không tự tạo phần thưởng, giá hay ramp rương.'],
 ['EffectApplication','Metadata only; merge formula TBD','integration','SourceEffects sheet','Không cộng trực tiếp Multiplier và MultiplierPrice; cần chốt stacking.'],
 ['MissingItemValues','Galaxy / Aurora','source issue','ItemGrades sheet','Giữ trống giá/chance thiếu; cả hai bị khóa ở Fishing.'],
 ['MoneyPrecision','Exact strings in JSON/Excel','type','FishPool sheet','Excel chỉ giữ khoảng 15 chữ số; không đổi price string sang Number.'],
 ['ConfigEditing','Review and export manually','workflow','Excel + JSON','Sửa Excel không tự đổi website/server. JSON đính kèm là snapshot cùng phiên bản.'],
 ['Sources','Master Data + current prototype','provenance','05/11/2026','[Craftland] Steal A Pet Master Data.xlsx: Fishing, MutaGen Config, WeatherGen Config, Mutation 2.0, Weather Effects.']
];
const rules=add('FlowRules','Fishing + Gen Config v3','Pool cá cũ; thứ tự cá trước, Gen sau; không thay đổi file nguồn',['Key','Value','Unit','Scope','Rule / note'],rulesRows,[200,350,115,150,620]);
const refs=Object.fromEntries(rulesRows.map((row,i)=>[row[0],'FlowRules!$B$'+(i+6)]));rules.getRange('B9:B11').format.fill='#FFF2CC';rules.dataValidations.add({range:'B9:B11',rule:{type:'whole',operator:'between',formula1:0,formula2:40}});
const pets=add('FishPool','Legacy fish pool · 35 loài','Source: Master Data → Fishing!A1:Q37; normalize actual totals; price columns are exact text',['ID','Fish','Rank','Rarity','SpawnPrice exact','ClaimK','ClaimCents exact',...fish.bands.map(b=>'Weight '+b.label),...fish.bands.map(b=>'Rate '+b.label)],fish.pets.map(p=>[p.id,p.name,p.rank,p.rarity,p.spawnPrice,Number(p.claimK),p.claimCents,...p.weights,...Array(5).fill(null)]),[75,220,75,120,215,80,240,...Array(5).fill(125),...Array(5).fill(120)]);
pets.freezePanes.freezeColumns(2);pets.getRange('E6:E40').setNumberFormat('@');pets.getRange('G6:G40').setNumberFormat('@');pets.getRange('F6:F40').setNumberFormat('0.00');pets.getRange('H6:L40').setNumberFormat('#,##0');
for(let i=0;i<35;i++)for(let b=0;b<5;b++){const r=i+6,w=col(7+b);pets.getCell(r-1,12+b).formulas=[[`=${w}${r}/SUM(${w}$6:${w}$40)`]];}
pets.getRange('M6:Q40').setNumberFormat('0.0000%');pets.getRange('M6:Q40').format.font.color='#17694D';pets.getRange('G43').values=[['Total']];
for(let b=0;b<5;b++){pets.getCell(42,7+b).formulas=[[`=SUM(${col(7+b)}6:${col(7+b)}40)`]];pets.getCell(42,12+b).formulas=[[`=SUM(${col(12+b)}6:${col(12+b)}40)`]];}pets.getRange('H43:L43').setNumberFormat('#,##0');pets.getRange('M43:Q43').setNumberFormat('0.00%');
const pool=add('GenPool','Unified MutaGen + WeatherGen','21 target; family retained for traceability, not a separate reward roll',['ID','Target','Source family','Balance group','Enabled 1/0','Source configured','Icon kind','Asset','Atlas col','Atlas row'],gen.catalog.map(g=>[g.id,g.name,g.family,g.tier,g.fishingEnabled?1:0,g.configured,g.icon.file?'file':'atlas',g.icon.file||'assets/mutations/gen-atlas.png',g.icon.atlas===undefined?null:g.icon.atlas%4,g.icon.atlas===undefined?null:Math.floor(g.icon.atlas/4)]),[135,155,135,130,120,130,95,290,95,95]);
pool.getRange('E6:E26').dataValidation={rule:{type:'list',values:['1','0']}};
note(pool,29,'Frozen ≠ Frost. Canonical target Bling Bling uses Sparkle source effect metadata. Disabled rows stay outside every Fishing pool.');
const weights=add('GenWeights','Rebirth Gen draw weights','New authored balance; normalized separately from fish weights and item application chances',['ID','Gen','Family','Enabled',...fish.bands.map(b=>'Weight '+b.label),...fish.bands.map(b=>'Rate '+b.label),'Validation'],gen.catalog.map(g=>[g.id,g.name,null,null,...gen.rebirthProfiles.map(b=>b.weights[g.id]||0),...Array(5).fill(null),null]),[130,155,130,95,...Array(5).fill(125),...Array(5).fill(120),230]);
for(let i=0;i<21;i++){
 const r=i+6;weights.getRange(`C${r}:D${r}`).formulas=[[`=GenPool!C${r}`,`=GenPool!E${r}`]];
 for(let b=0;b<5;b++){const w=col(4+b);weights.getCell(r-1,9+b).formulas=[[`=IF($D${r},${w}${r}/SUMIFS(${w}$6:${w}$26,$D$6:$D$26,1),0)`]];}
 weights.getRange('O'+r).formulas=[[`=IF(AND(D${r}=0,SUM(E${r}:I${r})>0),"Locked weight ignored","")`]];
 if(gen.catalog[i].fishingEnabled)weights.getRange(`E${r}:I${r}`).format.fill='#FFF2CC';
}
weights.getRange('E6:I26').setNumberFormat('#,##0');weights.getRange('J6:N26').setNumberFormat('0.00%');weights.getRange('J6:N26').format.font.color='#17694D';weights.getRange('B29').values=[['Eligible total']];weights.getRange('B31').values=[['MutaGen share']];weights.getRange('B32').values=[['WeatherGen share']];
for(let b=0;b<5;b++){const w=col(4+b),p=col(9+b);weights.getCell(28,4+b).formulas=[[`=SUMIFS(${w}6:${w}26,$D$6:$D$26,1)`]];weights.getCell(28,9+b).formulas=[[`=SUM(${p}6:${p}26)`]];weights.getCell(30,9+b).formulas=[[`=SUMIFS(${p}6:${p}26,$C$6:$C$26,"MutaGen")`]];weights.getCell(31,9+b).formulas=[[`=SUMIFS(${p}6:${p}26,$C$6:$C$26,"WeatherGen")`]];}
weights.getRange('E29:I29').setNumberFormat('#,##0');weights.getRange('J29:N32').setNumberFormat('0.00%');note(weights,35,'Shares above describe the first Gen draw. The second draw removes the selected ID and renormalizes the remaining weights.');
const grades=add('ItemGrades','MutaGen / WeatherGen item reference','Source metadata only: base chance before pet/Secret multipliers and clamps; not a Fishing drop rate',['ID','Target','Family','Grade','Pet Coin cost','Base apply chance','Source sheet','Source row','Configured'],gen.catalog.flatMap(g=>g.source.grades.map(r=>[g.id,g.name,g.family,r.grade,r.petCoinCost,r.baseChance,g.source.sheet,r.row,r.petCoinCost!==null&&r.baseChance!==null])),[130,160,135,80,135,160,185,105,115]);grades.getRange('E6:E68').setNumberFormat('#,##0');grades.getRange('F6:F68').setNumberFormat('0.00%');note(grades,71,'Source: [Craftland] Steal A Pet Master Data.xlsx → MutaGen Config!A23:M53; WeatherGen Config!A23:G56. Blank means missing, not zero.');
const effects=add('SourceEffects','Original effect metadata','Preserve source fields; unified stat stacking / application still requires a game design decision',['ID','Target','Family','Source name','Source ID','Material key','Effect key','Value field','Original value','Level cost mult.','Merged stacking'],gen.catalog.map(g=>{const s=g.effectSource;return [g.id,g.name,g.family,s.sourceName,s.sourceId,s.materialKey,s.effectKey,s.valueField,s.value,s.levelCostMultiplier,'TBD'];}),[130,155,130,155,105,190,190,150,130,135,150]);effects.getRange('I6:J26').setNumberFormat('0.00');note(effects,29,'Source: Master Data → Mutation 2.0!A1:I14 and Weather Effects!A1:F13. Source IDs are namespaced by family.');note(effects,30,'Do not directly add or multiply the two original value fields. No combined income/price effect is invented in this config.');
const patterns=[];for(const a of ['red','green','gold'])for(const b of ['red','green','gold'])for(const c of ['red','green','gold'])patterns.push(['P'+(patterns.length+1),a,b,c,...Array(6).fill(null)]);
const taps=add('TapOutcomes','Gen count from three taps','Fish is already rolled; these formulas affect only the number of Gen on that fish',['Pattern','Tap1','Tap2','Tap3','Points','P(0)','P(1)','P(2)','P(any)','Expected Gen'],patterns,[95,100,100,100,105,120,120,120,125,135]);
for(let i=0;i<27;i++){const r=i+6,formula=['B','C','D'].map(c=>`IF(${c}${r}="gold",${refs.GoldPoints},IF(${c}${r}="green",${refs.GreenPoints},${refs.RedPoints}))`).join('+');taps.getRange('E'+r).formulas=[['='+formula]];taps.getRange(`F${r}:J${r}`).formulas=[[`=1-MIN(1,E${r}/100)`,`=MIN(1,E${r}/100)-MAX(0,E${r}/100-1)`,`=MAX(0,E${r}/100-1)`,`=1-F${r}`,`=G${r}+2*H${r}`]];}
taps.getRange('B6:D32').format.fill='#FFF2CC';taps.getRange('B6:D32').dataValidation={rule:{type:'list',values:['red','green','gold']}};taps.getRange('F6:I32').setNumberFormat('0.00%');taps.getRange('J6:J32').setNumberFormat('0.00');
const sample=add('Simulation','Legacy fish-first simulation sample','Seed 20261105 · 1,000 casts per scenario/band · 30,000 revealed offers, before buying',['Rebirth','Band','Scenario','Seed','Casts','No Gen','One Gen','Two Gen','Any observed','Any expected','Fish types','Locked Gen'],simulation.reports.map(r=>[r.rebirth,r.band,r.name,r.seed,r.iterations,r.none,r.one,r.two,null,1-r.expected.none,Object.keys(r.petCounts).length,gen.catalog.filter(g=>!g.fishingEnabled).reduce((sum,g)=>sum+r.counts[g.id],0)]),[100,135,230,125,100,110,110,110,140,140,115,120]);
for(let i=0;i<30;i++){const r=i+6;sample.getRange('I'+r).formulas=[[`=(G${r}+H${r})/E${r}`]];}sample.getRange('D6:H35').setNumberFormat('#,##0');sample.getRange('I6:J35').setNumberFormat('0.0000%');
// Verify calculations with temporary changes and restore the delivered baseline.
weights.getRange('E6').values=[[0]];assert.equal(weights.getRange('J6').values[0][0],0);weights.getRange('E6').values=[[550000]];
rules.getRange('B9').values=[[10]];assert.equal(taps.getRange('E19').values[0][0],30);rules.getRange('B9').values=[[20]];
wb.recalculate();
assert.equal(fish.pets.length,35);assert.equal(gen.catalog.length,21);assert.equal(gen.catalog.filter(g=>g.fishingEnabled).length,5);
for(let b=0;b<5;b++){assert.equal(weights.getCell(28,4+b).values[0][0],1000000);assert(Math.abs(weights.getCell(28,9+b).values[0][0]-1)<1e-9);assert(Math.abs(pets.getCell(42,12+b).values[0][0]-1)<1e-9);}
assert.equal(taps.getRange('E19').values[0][0],60);assert.equal(taps.getRange('E32').values[0][0],120);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!',options:{useRegex:true,maxResults:20},summary:'Formula error scan',maxChars:1000})).ndjson);
await fs.mkdir(path.join(out,'previews'),{recursive:true});
for(const name of nav){const end=name==='FishPool'?'Q':name==='GenWeights'?'N':name==='GenPool'?'G':name==='SourceEffects'?'K':name==='ItemGrades'?'I':name==='TapOutcomes'?'J':name==='Simulation'?'L':'E';const img=await wb.render({sheetName:name,range:`A1:${end}14`,scale:1,format:'png'});await fs.writeFile(path.join(out,'previews',name+'.png'),new Uint8Array(await img.arrayBuffer()));}
await (await SpreadsheetFile.exportXlsx(wb)).save(path.join(out,'Fishing_Muta_Weather_Config_v3.xlsx'));
const bundle={schemaVersion:3,updatedAt:'2026-11-05',rollOrder:fish.rollOrder,rollTiming:fish.rollTiming,fishing:fish,gen,applicationStatus:'Source effect metadata retained; merged stacking/income formula not yet defined.'};
await fs.writeFile(path.join(out,'Fishing_Gen_Config_v3.json'),JSON.stringify(bundle,null,2));
console.log('Exported unified config: 8 sheets + JSON; 35 fish, 21 Gen, 5 Rebirth profiles.');
