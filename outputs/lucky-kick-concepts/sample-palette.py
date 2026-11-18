from PIL import Image
from collections import Counter
im=Image.open(r'C:/Users/truongthinh.bui_ctv/.codex/skills/sap-pet-production/assets/OnlyModel/AllPets.png').convert('RGBA')
c=Counter((r,g,b) for r,g,b,a in im.getdata() if a==255)
colors=[p for p,n in c.items() if n>=100]
for name,desired in [('Aqua',(43,165,174)),('Cream',(245,230,199)),('Orange',(236,145,45)),('Gold',(245,192,51)),('Wood',(151,99,53)),('Charcoal',(51,62,67)),('Green',(112,155,61)),('White',(230,234,226))]:
 p=min(colors,key=lambda p:sum((p[i]-desired[i])**2 for i in range(3)))
 print(name,'#%02X%02X%02X'%p)
