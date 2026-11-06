import openpyxl,json,warnings,sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8');warnings.filterwarnings('ignore');base=Path('C:/Users/truongthinh.bui_ctv/Downloads');w=openpyxl.load_workbook(base/'[Craftland] Steal A Pet Master Data.xlsx',data_only=True);s=w['Fishing'];cfg=json.loads(Path('assets/fishing-config.js').read_text(encoding='utf-8').split('=',1)[1].strip().rstrip(';'))
print('ORIGINAL FISHING HEADER',[(s.cell(1,c).coordinate,s.cell(1,c).value) for c in range(1,10)])
for c in range(2,7):
 rows=[r for r in range(2,37) if isinstance(s.cell(r,1).value,(int,float))];total=sum(s.cell(r,c).value or 0 for r in rows);mythic=sum(s.cell(r,c).value or 0 for r in rows if s.cell(r,9).value=='MYTHIC');print(s.cell(1,c).value,'total',total,'MYTHIC weight',mythic,'rate',mythic/total)
print('weight matches',all(p['weights']==[int(s.cell(r,c).value or 0) for c in range(2,7)] for r in range(2,37) for p in cfg['pets'] if p['id']==int(s.cell(r,1).value)))
print('WEB BANDS',cfg['bands'])
s=w['fishing 1.0.1'];print('\nNEW POOL HEADERS',[(s.cell(1,c).coordinate,s.cell(1,c).value) for c in range(1,11)])
for c in range(6,11):
 rows=[r for r in range(2,46) if isinstance(s.cell(r,1).value,(int,float))];total=sum(s.cell(r,c).value or 0 for r in rows);m=sum(s.cell(r,c).value or 0 for r in rows if s.cell(r,4).value=='MYTHIC');print(s.cell(1,c).value,'total',total,'MYTHIC',m/total)
g=openpyxl.load_workbook(base/'[Craftland] Steal A Pet GDD.xlsx',data_only=True)
for r in [3,35,37,40,41,94,105,106,107]:print('GDD EventFishing',r,[(c.column_letter,c.value) for c in g['EventFishing'][r] if c.value is not None])
