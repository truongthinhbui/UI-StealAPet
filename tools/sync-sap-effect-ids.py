import csv,hashlib,json,sys
from pathlib import Path
import openpyxl
source=Path(r'C:/Users/truongthinh.bui_ctv/Downloads/[Craftland] Steal A Pet Master Data.xlsx')
w=openpyxl.load_workbook(source,read_only=True,data_only=True)
root=Path.cwd();out=root/'reports/sap-effect-id-audit'
p=root/'assets/gen-config.js';text=p.read_text(encoding='utf-8-sig');config=json.loads(text[text.index('=')+1:].strip().rstrip(';'))
if not (out/'before-config.json').exists():
 (out/'before-config.json').write_text(json.dumps(config,ensure_ascii=False),encoding='utf-8')
tables={}
for table,sheet,headers in [('Mutation','Mutation (V2.3.1)',['ID','Name','MaterialKey','EffectKey','Multiplier','Weight','FUSIONWEIGHT','Tier','LvUpCostMultiplier']),('WeatherEffect','Weather Effects',['ID','Name','Icon','Chance','MultiplierPrice','LvUpCostMultiplier'])]:
 entries=[]
 for rownum,row in enumerate(w[sheet].iter_rows(values_only=True),1):
  if not row or not isinstance(row[0],(int,float)):continue
  entry=dict(zip(headers,row[:len(headers)]));entry['ID']=int(entry['ID']);entry['sourceRow']=rownum
  if any(e['ID']==entry['ID'] for e in entries):raise ValueError('Duplicate ID '+sheet)
  entries.append(entry)
 tables[table]={'sheet':sheet,'rows':entries}
changes=[]
for gen in config['catalog']+config.get('retiredCatalog',[]):
 table='Mutation' if gen['family']=='MutaGen' else 'WeatherEffect';data=tables[table];old=gen['effectSource'];record=next((r for r in data['rows'] if r['ID']==old['sourceId']),None)
 if not record or record['Name']!=gen['name']:raise ValueError('ID/name mismatch '+gen['id'])
 gen['effectType']=table;gen['effectId']=record['ID'];gen['effectRef']=table+':'+str(record['ID'])
 gen['mutationId']=record['ID'] if table=='Mutation' else None;gen['weatherEffectId']=record['ID'] if table=='WeatherEffect' else None
 gen['effectSource']={**old,'sheet':data['sheet'],'sourceRow':record['sourceRow'],'sourceName':record['Name'],'sourceId':record['ID'],'materialKey':record.get('MaterialKey'),'effectKey':record.get('EffectKey'),'iconKey':record.get('Icon'),'valueField':'Multiplier' if table=='Mutation' else 'MultiplierPrice','value':record.get('Multiplier',record.get('MultiplierPrice')),'levelCostMultiplier':record['LvUpCostMultiplier']}
 changes.append({'GenID':gen['id'],'Name':gen['name'],'EffectType':table,'ID':record['ID'],'EffectRef':gen['effectRef'],'SourceSheet':data['sheet'],'MaterialKey':record.get('MaterialKey'),'EffectKey':record.get('EffectKey'),'Icon':record.get('Icon'),'ValueField':gen['effectSource']['valueField'],'Value':gen['effectSource']['value'],'FishingActive':gen in config['catalog']})
config['effectTables']=tables
config['effectSourceAudit']={'workbook':source.name,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'localFileModified':'2026-11-05','mutationSheet':'Mutation (V2.3.1)','weatherSheet':'Weather Effects','weatherIdMeaning':'WeatherID = WeatherEffectID; not WeatherType','weatherEffectKeyNote':'Source has Icon, not EffectKey. Preserve Icon separately; do not infer a VFX key.','idPolicy':'id is the stable Gen alias; use effectType + effectId for SAP references.','footballNote':'Mutation ID 10 Football uses RadioactiveEffect in source; preserved without guessing.'}
p.write_text('window.GenConfig = '+json.dumps(config,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(out/'sap-source-effects.json').write_text(json.dumps({'source':config['effectSourceAudit'],'tables':tables,'mapping':changes},ensure_ascii=False,indent=2),encoding='utf-8')
with (out/'gen-id-mapping.csv').open('w',encoding='utf-8-sig',newline='') as f:
 writer=csv.DictWriter(f,fieldnames=list(changes[0]));writer.writeheader();writer.writerows(changes)
with (out/'sap-effect-tables.csv').open('w',encoding='utf-8-sig',newline='') as f:
 fields=['EffectType','ID','Name','MaterialKey','EffectKey','Icon','Multiplier','MultiplierPrice','Chance','LvUpCostMultiplier','Weight','FUSIONWEIGHT','Tier','SourceSheet','sourceRow'];writer=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');writer.writeheader()
 for table,data in tables.items():
  for row in data['rows']:writer.writerow({'EffectType':table,'SourceSheet':data['sheet'],**row})
print(json.dumps({'rows':{k:len(v['rows']) for k,v in tables.items()},'mapped':len(changes),'active':len(config['catalog'])}))
