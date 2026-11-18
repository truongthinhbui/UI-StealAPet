from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
p=Path('outputs/lucky-kick-target-model');w,h=512,640
canvas=Image.new('RGB',(3*w,2*h+180),'#202631');d=ImageDraw.Draw(canvas)
font=ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',28);small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',18)
d.text((28,18),'TARGET MEDAL | ACTUAL BLENDER MESH',font=font,fill='#fff3d1');d.text((28,57),'296 triangles  /  174 vertices  /  1 mesh  /  1 material  /  AllPets.png',font=small,fill='#b9d9df')
for row,prefix in enumerate(['color','wire']):
 for col,name in enumerate(['front','side','back']):
  y=100+row*(h+24);canvas.paste(Image.open(p/f'{prefix}-{name}.png').convert('RGB'),(col*w,y));d.text((col*w+18,y+8),f'{name.upper()} | '+('COLOR' if row==0 else 'ACTUAL TRIANGLES'),font=small,fill='#dce3ec')
d.text((28,2*h+145),'Orthographic matched cameras | Static low-poly prop | Front paw patches are intentional open appliques',font=small,fill='#a9b9cc')
canvas.save(p/'TargetMedal-color-wireframe.png')
