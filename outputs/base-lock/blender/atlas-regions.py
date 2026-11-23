from PIL import Image
import numpy as np, json, shutil, hashlib
from pathlib import Path
out=Path(__file__).parent
src=Path('C:/Users/truongthinh.bui_ctv/.codex/skills/sap-pet-production/assets/OnlyModel/AllPets.png')
a=np.asarray(Image.open(src).convert('RGB'))
colors={'gold':'f2b84f','cream':'ffe0b5','navy':'344547','blue':'6f9ea4'}
regions={}
for key,hx in colors.items():
    rgb=tuple(bytes.fromhex(hx)); mask=(a==rgb).all(2)
    ys,xs=np.where(mask); x0,x1=xs.min(),xs.max()+1; y0,y1=ys.min(),ys.max()+1
    cropped=mask[y0:y1,x0:x1]; heights=np.zeros(cropped.shape[1],dtype=int)
    best=(0,0,0,0,0)
    for y,row in enumerate(cropped):
        heights=np.where(row,heights+1,0); stack=[]
        for x in range(len(heights)+1):
            height=int(heights[x]) if x<len(heights) else 0
            start=x
            while stack and stack[-1][1]>height:
                left,h=stack.pop(); start=left; w=x-left
                # Favor useful aspect ratios for packed UV islands, not long thin slivers.
                if min(w,h)>=12 and w*h>best[0]:best=(w*h,int(x0+left),int(y0+y-h+1),w,h)
            if not stack or stack[-1][1]<height:stack.append((start,height))
    _,x,y,w,h=best
    assert w*h>0 and np.all(a[y:y+h,x:x+w]==rgb)
    regions[key]={'rgb':rgb,'hex':'#'+hx,'rect':[x,y,w,h],'padding_px':2}
shutil.copyfile(src,out/'AllPets.png')
assert hashlib.sha256((out/'AllPets.png').read_bytes()).hexdigest()=='c58e12d35117fa3b4e02e1534dc46b3d99ff9d2f6986cb6f063299e231560b86'
(out/'atlas-regions.json').write_text(json.dumps(regions,indent=2))
print(json.dumps(regions))
