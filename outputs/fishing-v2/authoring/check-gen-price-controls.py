import openpyxl,json,warnings
from pathlib import Path
from decimal import Decimal,ROUND_HALF_UP
warnings.filterwarnings('ignore');w=openpyxl.load_workbook('C:/Users/truongthinh.bui_ctv/Downloads/[Craftland] Steal A Pet Master Data.xlsx',data_only=True)
def cfg(n):return json.loads(Path('assets/'+n+'.js').read_text(encoding='utf-8').split('=',1)[1].strip().rstrip(';'))
f,g=cfg('fishing-config'),cfg('gen-config');mult={}
for gen in g['catalog']:
 source=gen['effectSource'];row=next(r for r in w[source['sheet']].iter_rows(min_row=3,values_only=True) if r[1]==source['sourceName']);value=Decimal(str(row[4]));m=1+value if source['valueField']=='MultiplierPrice' else value;assert m==Decimal(f['pricing']['genMultiplierById'][gen['id']]);mult[gen['id']]=m
checks=[]
for pet in f['pets']:
 for id,m in [(None,Decimal(1)),*mult.items()]:
  price=(Decimal(pet['spawnPrice'])*Decimal(pet['claimK'])*m).quantize(Decimal(1),rounding=ROUND_HALF_UP);checks.append({'petId':pet['id'],'genId':id,'cents':str(int(price*100))})
Path('reports/pet-gen-price-controls.json').write_text(json.dumps(checks),encoding='utf-8')
lines=['# Fishing pet + Gen purchase prices','', 'New authored Fishing policy: ROUND(SpawnPrice × GenPriceMultiplier × ClaimK, 0). Base GDD only defines SpawnPrice × ClaimK; the Gen purchase factor is an explicit extension using source effect magnitudes. It is not asserted as an existing GDD purchase rule. Do not add a MutaGen item price or application attempt fee: Fishing has already granted the trait.', '', 'Normal Mutation: use Mutation 2.0 Multiplier. Weather: use 1 + Weather Effects MultiplierPrice. Exactly one Gen per catch; no stacking assumption. Round once after all factors, to whole Money, then store integer cents as strings. No pet/Gen probability changes.', '', '| Gen | Purchase factor |','|---|---:|']
for gen in g['catalog']:lines.append(f"| {gen['name']} | ×{mult[gen['id']]} |")
lines+=['', 'Examples: SHRIMP no Gen 605; Golden 805; Soaked 635; Webbed 1,452 Money. SALMON + Webbed = 47,256,000,000,000,000,000 Money. All values are purchase offers, not automatic grants or a promise of sale ROI. Pet base prices and Gen effect data remain unchanged.', '', 'New pending catches stamp basePrice, genPriceMultiplier, price and pricingVersion. Already pending/owned rewards keep their old stamped price and are not repriced. Buy deducts the exact stamped price; simulation and CSV log use the same quote function.', '', 'Source: Master Data Mutation 2.0 E column, Weather Effects E column, Fishing O/P columns; GDD EventFishing B42 (base rule), Weather System C56 (weather value rule). No source workbook edits.']
Path('reports/FISHING-PET-GEN-PRICES.md').write_text('\n'.join(lines),encoding='utf-8')
