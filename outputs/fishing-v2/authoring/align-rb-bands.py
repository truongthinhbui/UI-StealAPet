import json,pathlib
root=pathlib.Path('D:/revival-prototype-ui-update');bands=[{'min':a,'max':b,'label':label} for a,b,label in [(1,4,'R1–R4'),(5,8,'R5–R8'),(9,13,'R9–R13'),(14,18,'R14–R18'),(19,None,'R19+')]]
for filename,variable in [('fishing-config.js','FishingConfig'),('gen-config.js','GenConfig')]:
 p=root/'assets'/filename;g=json.loads(p.read_text(encoding='utf8').split('window.'+variable+' = ',1)[1].rsplit(';',1)[0])
 if variable=='FishingConfig':
  g['bands']=bands;g['version']='fishing-legacy-fish-first-v3-rb14';g['source']['bandOverride']='User reference: R1–4 / R5–8 / R9–13 / R14–18 / R19+. Original 35 fish weights retained in column order.'
 else:
  for profile,band in zip(g['rebirthProfiles'],bands):profile.update(band)
  g['version']='merged-gen-6-green5-rb14'
 p.write_text('// Rebirth ranges aligned with user reference; existing draw weights retained.\nwindow.'+variable+' = '+json.dumps(g,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
