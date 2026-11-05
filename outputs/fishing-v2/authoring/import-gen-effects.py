import openpyxl,json,pathlib
root=pathlib.Path('D:/revival-prototype-ui-update');p=root/'assets/gen-config.js'
g=json.loads(p.read_text(encoding='utf8').split('window.GenConfig = ',1)[1].rsplit(';',1)[0])
w=openpyxl.load_workbook('C:/Users/truongthinh.bui_ctv/Downloads/[Craftland] Steal A Pet Master Data.xlsx',read_only=True,data_only=True)
mut={row[1]:row for row in w['Mutation 2.0'].iter_rows(min_row=3,values_only=True) if len(row)>1 and row[1]}
weather={row[1]:row for row in w['Weather Effects'].iter_rows(min_row=3,values_only=True) if len(row)>1 and row[1]}
for gen in g['catalog']:
 if gen['family']=='MutaGen':
  row=mut.get(gen['name'])
  gen['effectSource']={'sheet':'Mutation 2.0','sourceName':gen['name'],'sourceId':int(row[0]) if row else None,'materialKey':row[2] if row else None,'effectKey':row[3] if row else None,'valueField':'Multiplier','value':row[4] if row else None,'levelCostMultiplier':row[8] if row and len(row)>8 else None}
 else:
  name='Sparkle' if gen['name']=='Bling Bling' else gen['name'];row=weather.get(name)
  gen['effectSource']={'sheet':'Weather Effects','sourceName':name,'sourceId':int(row[0]) if row else None,'materialKey':None,'effectKey':row[2] if row else None,'valueField':'MultiplierPrice','value':row[4] if row else None,'levelCostMultiplier':row[5] if row else None}
 gen['effectSource']['mergedStackingRule']=None
p.write_text('// Unified Gen config v3: fish first, single merged Gen pool; source effects are reference metadata only.\nwindow.GenConfig = '+json.dumps(g,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
