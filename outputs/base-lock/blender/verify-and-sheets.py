from pathlib import Path
import json, math, numpy as np
from PIL import Image,ImageDraw,ImageFont
OUT=Path(__file__).parent
regions=json.loads((OUT/'atlas-regions.json').read_text())
faces=json.loads((OUT/'uv-faces.json').read_text())
atlas=np.asarray(Image.open(OUT/'AllPets.png').convert('RGB'))
triangles=[];sample_errors=[]
for i,f in enumerate(faces):
    t=np.array(f['uv'])*2048
    triangles.append(t)
    probes=list(t)+[(t[0]+t[1])/2,(t[1]+t[2])/2,(t[2]+t[0])/2,t.mean(0)]
    expected=regions[f['color']]['rgb']
    for u,v in probes:
        actual=atlas[min(2047,max(0,2047-int(v))),min(2047,max(0,int(u)))]
        if not np.array_equal(actual,expected):sample_errors.append(i);break
def cross(a,b):return float(a[0]*b[1]-a[1]*b[0])
def area(poly):return abs(sum(cross(a,b) for a,b in zip(poly,poly[1:]+poly[:1])))*.5 if len(poly)>=3 else 0
def intersection(a,b):
    poly=[v for v in a];orient=1 if cross(b[1]-b[0],b[2]-b[0])>=0 else -1
    for c,d in zip(b,np.roll(b,-1,axis=0)):
        result=[]
        if not poly:return []
        prev=poly[-1];dp=orient*cross(d-c,prev-c)
        for cur in poly:
            dc=orient*cross(d-c,cur-c)
            if (dc>=-1e-10)!=(dp>=-1e-10):result.append(prev+(cur-prev)*(dp/(dp-dc)))
            if dc>=-1e-10:result.append(cur)
            prev,dp=cur,dc
        poly=result
    return poly
boxes=[(t.min(0),t.max(0)) for t in triangles];overlaps=[]
for i,a in enumerate(triangles):
    for j in range(i):
        if np.any(boxes[i][1]<=boxes[j][0]+1e-9) or np.any(boxes[j][1]<=boxes[i][0]+1e-9):continue
        overlap=area(intersection(a,triangles[j]))
        if overlap>1e-7:overlaps.append({'faces':[j,i],'area_px2':overlap})
report={'triangles_checked':len(faces),'color_sample_errors':sample_errors,'exact_uv_overlap_pairs':overlaps,'uv_areas_px2':{'min':min(area(list(t)) for t in triangles),'max':max(area(list(t)) for t in triangles)},'note':'Packed connected surface islands in small exact-color atlas patches. Base-color only; not suitable for detailed texture painting. Game mip/filter behavior not checked.'}
(OUT/'uv-validation.json').write_text(json.dumps(report,indent=2))
assert not sample_errors, sample_errors[:10]
assert not overlaps, overlaps[:10]
font=lambda size,bold=False:ImageFont.truetype('C:/Windows/Fonts/arial'+('bd' if bold else '')+'.ttf',size)
for mode in ['color','wire']:
    sheet=Image.new('RGB',(1600,1080),'#2d2d38');d=ImageDraw.Draw(sheet)
    d.line((50,38,1550,38),fill='#b7a2d2',width=2)
    d.text((55,57),'SAP / CRAFTLAND · LOCKSHIELD',font=font(23),fill='#cbbce3')
    d.text((55,94),'TRỤ KHÓA HUY HIỆU KHIÊN',font=font(47,True),fill='white')
    d.text((55,154),'BLENDER MODEL · '+('ACTUAL TRIANGLE WIREFRAME' if mode=='wire' else 'COLOR VIEWS · AllPets.png'),font=font(22),fill='#d6c4f7')
    hero=Image.open(OUT/f'{mode}-hero.png').convert('RGB').resize((780,780),Image.Resampling.LANCZOS)
    sheet.paste(hero,(80,205));d.text((80,990),'3/4 Hero View',font=font(21),fill='#e5d8f7')
    for name,y in [('front',210),('side',470),('back',730)]:
        im=Image.open(OUT/f'{mode}-{name}.png').convert('RGB').resize((245,245),Image.Resampling.LANCZOS)
        sheet.paste(im,(1060,y));d.text((1340,y+110),name.title(),font=font(24),fill='#e5d8f7')
    d.text((80,1036),'1,316 TRIANGLES  ·  686 VERTICES  ·  1 MESH  ·  1 MATERIAL  ·  STATIC',font=font(20),fill='#cbc5d7')
    sheet.save(OUT/f'lockshield-{mode}-sheet.png')
print(json.dumps({'uv_validation':'PASS','triangles':len(faces),'overlaps':len(overlaps),'color_errors':len(sample_errors),'sheets':'created'}))
