import openpyxl,decimal,json,pathlib
root=pathlib.Path('D:/revival-prototype-ui-update')
w=openpyxl.load_workbook('C:/Users/truongthinh.bui_ctv/Downloads/[Craftland] Steal A Pet Master Data.xlsx',read_only=True,data_only=True)
s=w['Fishing'];pets=[]
for row in s.iter_rows(min_row=2,max_row=36,values_only=True):
 if not isinstance(row[0],(int,float)):continue
 price=decimal.Decimal(str(row[14]));k=decimal.Decimal(str(row[15]));claim=price*k
 pets.append(dict(id=int(row[0]),name=row[6],rank=int(row[7]),rarity=row[8],tier=None,weights=[int(x or 0) for x in row[1:6]],spawnPrice=str(price),claimK=str(k),claimPrice=str(claim),claimCents=str(int((claim*100).to_integral_value(rounding=decimal.ROUND_HALF_UP)))))
old=(root/'assets/fishing-config.js').read_text(encoding='utf8');config=json.loads(old.split('window.FishingConfig = ',1)[1].rsplit(';',1)[0])
config['version']='fishing-legacy-fish-first-v3';config['source']={'workbook':'[Craftland] Steal A Pet Master Data.xlsx','sheet':'Fishing','range':'A1:Q37','notes':'Use original 35 fish rows; normalize actual weights. Above RB25 reuse the last source band. Claim price follows SpawnPrice*ClaimK, not stale cached Q.'}
config['bands']=[{'min':a,'max':b,'label':c} for a,b,c in [(1,5,'R1–R5'),(6,10,'R6–R10'),(11,15,'R11–R15'),(16,20,'R16–R20'),(21,None,'R21+')]]
config['rollOrder']=['fish','genCount','genTypes'];config['rollTiming']='after-third-scored-tap';config['pets']=pets
(root/'assets/fishing-config.js').write_text('// Original Fishing pool; fish first, then Gen. Source values preserved; exact prices are strings.\nwindow.FishingConfig = '+json.dumps(config,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
p=root/'assets/gen-config.js';gc=json.loads(p.read_text(encoding='utf8').split('window.GenConfig = ',1)[1].rsplit(';',1)[0]);gc['version']='merged-gen-3-fish-first'
for profile,band in zip(gc['rebirthProfiles'],config['bands']):profile.update(band)
gc['rollOrder']=config['rollOrder'];gc['rules']['fishRarityBoost']=False;gc['rules']['familySelection']='single-merged-weighted-pool';gc['rules']['repeatSameGen']=False
p.write_text('// Unified MutaGen + WeatherGen catalog. Gen probability is separate from fish rarity.\nwindow.GenConfig = '+json.dumps(gc,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
print('Fish:',len(pets),'weights:',[sum(p['weights'][i] for p in pets) for i in range(5)])
