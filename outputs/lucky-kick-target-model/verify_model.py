import json,hashlib
import numpy as np
from pathlib import Path
from PIL import Image
p=Path('outputs/lucky-kick-target-model');data=json.loads((p/'mesh-evidence.json').read_text());atlas=np.asarray(Image.open(p/'AllPets.png').convert('RGBA'));colors=set();areas=[]
for tri in data['uv_triangles']:
 t=np.array(tri);areas.append(abs(np.linalg.det(np.array([t[1]-t[0],t[2]-t[0]])))/2)
 for a,b,c in [(1,0,0),(0,1,0),(0,0,1),(1/3,1/3,1/3),(.6,.2,.2),(.2,.6,.2),(.2,.2,.6)]:
  u,v=a*t[0]+b*t[1]+c*t[2];x=min(2047,max(0,int(u*2048)));y=min(2047,max(0,int((1-v)*2048)));pixel=tuple(map(int,atlas[y,x]));assert pixel[3]==255;colors.add(pixel[:3])
assert min(areas)>0
expected={(111,158,164),(249,228,198),(216,146,72),(237,201,44)};assert colors==expected,(colors,expected)
verts={tuple(round(v,6) for v in p) for p in data['vertices']};assert all((-x,y,z) in verts for x,y,z in verts)
report=json.loads((p/'model-report.json').read_text());report.update(technical='PASS - saved .blend audited in isolated background Blender',visual='REVIEWED - low-poly interpretation of generated concept; simplified paw contours',texture_sample_colors=[list(c) for c in sorted(colors)],uv_min_triangle_area=float(min(areas)),uv_samples_per_triangle=7,symmetry='PASS mirrored vertex positions at 1e-6 precision',construction='9 intentional shells: disc, star, stem, base and 5 open front paw appliques; static asset',rig='NONE - static prop',game_import='NOT CHECKED',fbx='NOT REQUESTED / NOT EXPORTED',wireframe='Actual 296-triangle mesh; matched orthographic cameras',review_sheet='TargetMedal-color-wireframe.png')
(p/'model-report.json').write_text(json.dumps(report,indent=2));print('PASS 2072 atlas samples match four flat colors; nonzero-area UVs; mirrored geometry; report updated.')
