import openpyxl,json,sys,warnings
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8');warnings.filterwarnings('ignore')
w=openpyxl.load_workbook('C:/Users/truongthinh.bui_ctv/Downloads/[Craftland] Steal A Pet Master Data.xlsx',data_only=True)
fish=json.loads(Path('assets/fishing-config.js').read_text(encoding='utf-8').split('=',1)[1].strip().rstrip(';'));gen=json.loads(Path('assets/gen-config.js').read_text(encoding='utf-8').split('=',1)[1].strip().rstrip(';'))
rows=[]
for i,b in enumerate(fish['bands']):
 total=sum(p['weights'][i] for p in fish['pets']);p=sum(p['weights'][i] for p in fish['pets'] if p['rarity']=='APEX')/total;web=gen['rebirthProfiles'][i]['weights']['webbed']/sum(gen['rebirthProfiles'][i]['weights'].values());joint=p*.6*web
 rows.append({'band':b['label'],'apexPerCast':p,'webGivenGen':web,'webPerCastGold':.6*web,'apexWebPerCastGold':joint,'meanCasts':1/joint,'mean18CastEvents':1/(-__import__('math').expm1(18*__import__('math').log1p(-joint))),'meanActiveYears':1/joint*10/(3600*24*365),'extraCastFactorOverApexOnly':1/(.6*web)})
print('FISH',json.dumps(rows,indent=2))
for secret in [False,True]:
 for grade,cost,base in [('S',500,.2),('SS',550,.32),('SSS',600,.4)]:
  p=max(.02,min(.75,base*.45*(.55 if secret else 1)));print('ITEM',secret,grade,'success',p,'attempts',1/p,'coins',cost/p,'money normal3.5T',3.5/p,'money secret20T',20/p)
s=w['LuckyBox Config'];boxes={}
for r in range(12,s.max_row+1):
 
 try: bid=float(s.cell(r,1).value);weight=float(s.cell(r,7).value)
 except (ValueError,TypeError): continue
 if bid in [60001,60002,60003] and isinstance(weight,(int,float)):
  box=boxes.setdefault(bid,{'total':0,'apex':0});box['total']+=weight
  if s.cell(r,4).value=='APEX':box['apex']+=weight
print('BOX',boxes)
s=w['MoleDigging'];total=sum(s.cell(r,6).value or 0 for r in range(2,37));apex=sum(s.cell(r,6).value or 0 for r in range(2,37) if s.cell(r,9).value=='APEX');print('DIG Mythic',total,apex,apex/total)
s=w['Weather Waves'];duration=sum(s.cell(r,3).value or 0 for r in range(3,28));fishing=sum(s.cell(r,3).value or 0 for r in range(3,28) if s.cell(r,4).value in ['HighTide','HeavyRain']);print('WEATHER',duration,fishing,'fraction',fishing/duration)
Path('reports/apex-webbed-analysis.json').write_text(json.dumps({'assumptions':{'secondsPerCast':10,'castsPerEvent':18,'tapChance':.6,'chests':False},'fishing':rows,'luckyBox':boxes,'digMythic':{'total':total,'apex':apex,'rate':apex/total},'weather':{'cycleMinutes':duration,'fishingMinutes':fishing}},indent=2),encoding='utf-8')
