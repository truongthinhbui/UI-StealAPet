import openpyxl,sys,warnings,json
from pathlib import Path
from decimal import Decimal,ROUND_HALF_UP
sys.stdout.reconfigure(encoding='utf-8');warnings.filterwarnings('ignore');base=Path('C:/Users/truongthinh.bui_ctv/Downloads');p=base/'[Craftland] Steal A Pet Master Data.xlsx';v=openpyxl.load_workbook(p,data_only=True);f=openpyxl.load_workbook(p,data_only=False)
s=v['Fishing'];sf=f['Fishing'];cfg=json.loads(Path('assets/fishing-config.js').read_text(encoding='utf-8').split('=',1)[1].strip().rstrip(';'));mismatches=[];cached=[]
print('HEADERS',[(c.coordinate,c.value) for c in sf[1] if c.value is not None])
for row in s.iter_rows(min_row=2,max_row=36):
 id=int(row[0].value);pet=next(x for x in cfg['pets'] if x['id']==id);price=Decimal(str(row[14].value));k=Decimal(str(row[15].value));expected=price*k;cents=str(int((expected*100).to_integral_value(rounding=ROUND_HALF_UP)))
 if pet['claimCents']!=cents:mismatches.append({'id':id,'name':pet['name'],'web':pet['claimCents'],'expected':cents})
 if Decimal(str(row[16].value))!=expected:cached.append({'row':row[0].row,'name':pet['name'],'O':str(price),'P':str(k),'Q':str(row[16].value),'computed':str(expected),'formulaO':sf.cell(row[0].row,15).value,'formulaQ':sf.cell(row[0].row,17).value})
print('WEB MISMATCH',mismatches);print('CACHED Q mismatch',json.dumps(cached,ensure_ascii=False));
for n in ['Fishing','fishing 1.0.1','Pet (Master)']:
 print('\n',n)
 for row in f[n].iter_rows(max_row=4):print(row[0].row,[(c.column_letter,c.value) for c in row if c.value is not None][:20])
g=openpyxl.load_workbook(base/'[Craftland] Steal A Pet GDD.xlsx',data_only=True)
print('\nGDD PRICE RULES')
for row in g['EventFishing']:
 vals=[f'{c.coordinate}={c.value}' for c in row if c.value is not None]
 if any(k in ' '.join(vals).lower() for k in ['price','claimk','mutation','spawnprice','money']):print(' | '.join(vals))
