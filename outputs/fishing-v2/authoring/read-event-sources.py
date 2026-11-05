import openpyxl,json,warnings
from pathlib import Path
warnings.filterwarnings('ignore')
base=Path('C:/Users/truongthinh.bui_ctv/Downloads');out=Path('outputs/fishing-v2/authoring/source-review');out.mkdir(exist_ok=True)
sets={'[Craftland] Steal A Pet GDD.xlsx':['MutaGen','EventFishing','Weather System','EventDig','EventMeteorite','EventWhackAMole','EventWC','EventKickaBall','EventLuckyBox','EventWindyTree','Event Frame','Revival Event'], '[Craftland] Steal A Pet Master Data.xlsx':['MutaGen Config','WeatherGen Config','Weather Effects','Weathers','Weather Waves','Fishing','MoleDigging','digging 1.0.1','meteorShower','EventMole','EventDigMeteorite','EventWC','LuckyBox Config','ShopEventConfig','Revival Event','Rotation Shop']}
for filename,sheets in sets.items():
 w=openpyxl.load_workbook(base/filename,data_only=True)
 prefix='gdd' if 'GDD' in filename else 'data'
 for name in sheets:
  lines=[]
  for row in w[name]:
   cells=['%s=%s'%(c.column_letter,str(c.value)) for c in row if c.value is not None]
   if cells:lines.append(str(row[0].row)+': '+' | '.join(cells))
  (out/(prefix+'-'+name.replace('/','-')+'.txt')).write_text('\n'.join(lines),encoding='utf-8')
for name in ['gdd-MutaGen','data-MutaGen Config','gdd-EventFishing']:
 print('\n### '+name+'\n'+(out/(name+'.txt')).read_text(encoding='utf-8'))
