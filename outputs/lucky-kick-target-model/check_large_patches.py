exec(open('outputs/lucky-kick-target-model/find_patches.py').read().split('result={}')[0])
import json
for name,target in [('aqua',(87,150,157)),('cream',(244,230,202)),('orange',(222,145,51)),('gold',(237,201,44))]:
 candidates=[]
 for key,(area,rect) in best.items():
  if area<1024 or min(rect[2]-rect[0],rect[3]-rect[1])<24:continue
  rgb=(key>>16,(key>>8)&255,key&255);d=sum((rgb[i]-target[i])**2 for i in range(3));candidates.append((d,-area,rgb,rect))
 print(name,sorted(candidates)[:2])
