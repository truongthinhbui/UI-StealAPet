import openpyxl,json,pathlib
base=pathlib.Path('D:/revival-prototype-ui-update/outputs/fishing-v3')
p=base/'Fishing_Muta_Weather_Config_v3.xlsx';w=openpyxl.load_workbook(p,data_only=True)
assert len(w.sheetnames)==8
assert not [(s.title,c.coordinate,c.value) for s in w for row in s for c in row if c.data_type=='e']
assert w['FishPool']['B6'].value=='SHRIMP'
assert sum(isinstance(w['FishPool'].cell(r,1).value,(int,float)) for r in range(6,41))==35
assert w['FishPool']['L43'].value==999970
assert w['GenWeights']['E29'].value==1000000
assert w['TapOutcomes']['E32'].value==120
assert abs(w['TapOutcomes']['H32'].value-.2)<1e-9
assert isinstance(w['FishPool']['G40'].value,str)
b=json.loads((base/'Fishing_Gen_Config_v3.json').read_text(encoding='utf8'))
assert b['rollOrder']==['fish','genCount','genTypes']
assert len(b['fishing']['pets'])==35
assert len(b['gen']['catalog'])==21
assert len([g for g in b['gen']['catalog'] if g['fishingEnabled']])==5
assert b['gen']['rebirthProfiles'][-1]['min']==21
print('PASS: 8 sheets, formulas/caches, 35 fish, legacy final total, 21 Gen, 5 eligible, exact prices, fish-first JSON, aligned RB bands.')
