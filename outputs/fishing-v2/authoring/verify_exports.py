import openpyxl, pathlib
base=pathlib.Path('D:/revival-prototype-ui-update/outputs/fishing-v2')
for name,expected in [('Fishing_GDD_v2.xlsx',5),('Fishing_Data_v2.xlsx',7)]:
 w=openpyxl.load_workbook(base/name,data_only=True)
 assert len(w.sheetnames)==expected
 errors=[(s.title,c.coordinate,c.value) for s in w for row in s for c in row if c.data_type=='e']
 assert not errors,errors
 print(name,len(w.sheetnames),'sheets',len(errors),'errors',(base/name).stat().st_size,'bytes')
 if expected==7:
  assert w['Rules']['B7'].value==20
  assert w['TapOutcomes']['E19'].value==60
  assert abs(w['TapOutcomes']['H32'].value-.2)<1e-9
  assert w['GenWeights']['D6'].value==550000
  assert w['GenWeights']['D29'].value==1000000
  assert isinstance(w['PetPool']['H49'].value,str)
  assert w['PetPool']['H49'].data_type=='s'
  assert w['PetPool']['I6'].value==110229
  assert all(abs(w['GenWeights'].cell(30,c).value-1)<1e-9 for c in range(9,14))
  assert sum(w['Simulation'].cell(r,5).value for r in range(6,36))==30000
  f=openpyxl.load_workbook(base/name,data_only=False)
  assert f['GenWeights']['I6'].data_type=='f'
  assert f['PetPool']['N6'].data_type=='f'
  print('Verified exported formulas, cached values, exact price text, restored inputs, 30k simulation casts.')
