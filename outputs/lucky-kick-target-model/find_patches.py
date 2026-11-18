from PIL import Image
import numpy as np,json
from pathlib import Path
p=Path('outputs/lucky-kick-target-model');a=np.asarray(Image.open(r'C:/Users/truongthinh.bui_ctv/.codex/skills/sap-pet-production/assets/OnlyModel/AllPets.png').convert('RGBA'));code=a[:,:,0].astype('uint32')*65536+a[:,:,1].astype('uint32')*256+a[:,:,2].astype('uint32');heights=np.ones(code.shape[1],int);best={}
for y,row in enumerate(code):
 if y:heights=np.where(row==code[y-1],heights+1,1)
 splits=np.r_[0,np.flatnonzero(row[1:]!=row[:-1])+1,len(row)]
 for start,end in zip(splits[:-1],splits[1:]):
  if end-start<12:continue
  stack=[]
  for x in range(int(start),int(end)+1):
   height=int(heights[x]) if x<end else 0;left=x
   while stack and stack[-1][1]>height:
    xx,hh=stack.pop();w=x-xx;area=w*hh
    if min(w,hh)>=12 and area>best.get(int(row[start]),(0,None))[0]:best[int(row[start])]=(area,(int(xx),int(y-hh+1),int(x),int(y+1)))
    left=xx
   if height and(not stack or stack[-1][1]<height):stack.append((left,height))
result={}
for name,target in [('aqua',(87,150,157)),('cream',(244,230,202)),('orange',(222,145,51)),('gold',(237,201,44))]:
 candidates=[]
 for key,(area,rect) in best.items():
  rgb=(key>>16,(key>>8)&255,key&255);d=sum((rgb[i]-target[i])**2 for i in range(3));candidates.append((d, -area,rgb,rect))
 _,area,rgb,rect=min(candidates);result[name]={'hex':'#%02X%02X%02X'%rgb,'rgb':rgb,'rect':rect,'area':-area}
(p/'atlas-patches.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
