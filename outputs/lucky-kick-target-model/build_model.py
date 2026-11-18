import bpy,bmesh,math,json,hashlib,shutil
from pathlib import Path
from mathutils import Vector
from mathutils.geometry import tessellate_polygon
OUT=Path(r'D:/revival-prototype-ui-update/outputs/lucky-kick-target-model');OUT.mkdir(exist_ok=True,parents=True)
ATLAS=Path(r'C:/Users/truongthinh.bui_ctv/.codex/skills/sap-pet-production/assets/OnlyModel/AllPets.png')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'before-modeling.blend'),copy=True)
original_scene=bpy.context.scene
scene=bpy.data.scenes.new('LuckyKick_TargetMedal_300T');bpy.context.window.scene=scene
root=bpy.data.collections.new('COL_LuckyKick_TargetMedal');scene.collection.children.link(root)
geo=bpy.data.collections.new('COL_LuckyKick_TargetMedal_GEO');root.children.link(geo)
studio=bpy.data.collections.new('COL_LuckyKick_TargetMedal_STUDIO');root.children.link(studio)
vertices=[];faces=[];facecolors=[];facegroups=[];uvcoords=[];components={}
def vert(p,component):
 i=len(vertices);vertices.append(tuple(p));components.setdefault(component,[]).append(i);return i
def face(ids,color,group,uv):faces.append(ids);facecolors.append(color);facegroups.append(group);uvcoords.append(uv)
def planar(ids,color,group,r=.7,cx=0,cz=1.05):
 face(ids,color,group,[((vertices[i][0]-cx)/(2*r)+.5,(vertices[i][2]-cz)/(2*r)+.5) for i in ids])
# Disc: efficient 16-sided bevel profile, colored front rings, planar caps.
n=16;profile=[(.65,.09),(.70,.045),(.70,-.045),(.65,-.10),(.53,-.10),(.43,-.10)];rings=[]
for r,y in profile:rings.append([vert((r*math.cos(2*math.pi*j/n),y,1.05+r*math.sin(2*math.pi*j/n)),'Disc') for j in range(n)])
for k in range(len(rings)-1):
 color='gold' if k<3 else 'orange' if k==3 else 'cream';group='disc_edge' if k<3 else 'front_orange_band' if k==3 else 'front_cream_band'
 for j in range(n):
  a,b=rings[k],rings[k+1];ids=[a[j],a[(j+1)%n],b[(j+1)%n],b[j]]
  if k<3:face(ids,color,group,[(j/n,k/3),((j+1)/n,k/3),((j+1)/n,(k+1)/3),(j/n,(k+1)/3)])
  else:planar(ids,color,group)
planar(list(reversed(rings[0])),'cream','disc_back');planar(rings[-1],'orange','disc_center')
# Closed shallow five-point star.
star=[]
for y in [.045,-.135]:
 star.append([vert(((.235 if j%2==0 else .112)*math.cos(math.pi/2+j*math.pi/5),y,1.83+(.235 if j%2==0 else .112)*math.sin(math.pi/2+j*math.pi/5)),'Star') for j in range(10)])
planar(list(reversed(star[0])),'gold','star_back',.25,0,1.83);planar(star[1],'gold','star_front',.25,0,1.83)
for j in range(10):face([star[0][j],star[0][(j+1)%10],star[1][(j+1)%10],star[1][j]],'gold','star_side',[(j/10,0),((j+1)/10,0),((j+1)/10,1),(j/10,1)])
# Beveled octagonal oval base, all actual triangles after conversion.
base=[]
for rx,ry,z in [(.39,.21,0),(.40,.22,.105),(.35,.18,.15)]:base.append([vert((rx*math.cos(2*math.pi*j/8),ry*math.sin(2*math.pi*j/8),z),'Base') for j in range(8)])
for k in range(2):
 for j in range(8):face([base[k][j],base[k][(j+1)%8],base[k+1][(j+1)%8],base[k+1][j]],'aqua','base_sides',[(j/8,k/2),((j+1)/8,k/2),((j+1)/8,(k+1)/2),(j/8,(k+1)/2)])
for ring,label in [(list(reversed(base[0])),'base_bottom'),(base[-1],'base_top')]:face(ring,'aqua',label,[(vertices[i][0]/.8+.5,vertices[i][1]/.44+.5) for i in ring])
# Rectangular stem intersects the base and disc as a deliberate rigid assembly.
stem=[vert((x,y,z),'Stem') for z in [.13,.42] for y in [-.065,.065] for x in [-.09,.09]]
for j,ids in enumerate([[0,2,3,1],[4,5,7,6],[0,1,5,4],[2,6,7,3],[0,4,6,2],[1,3,7,5]]):face([stem[i] for i in ids],'aqua','stem_'+str(j),[(0,0),(1,0),(1,1),(0,1)])
# Paw as five intentional thin, open cream appliques on the front cap (5mm offset).
for j,(x,z,rx,rz) in enumerate([(-.195,1.115,.060,.075),(-.075,1.195,.064,.079),(.075,1.195,.064,.079),(.195,1.115,.060,.075)]):
 ids=[vert((x+rx*math.cos(math.pi/2+k*2*math.pi/5),-.105,z+rz*math.sin(math.pi/2+k*2*math.pi/5)),'Paw') for k in range(5)];planar(ids,'cream','toe_'+str(j),.082,x,z)
outline=[(-.16,.95),(-.13,1.035),(0,1.085),(.13,1.035),(.16,.95),(0,.91)]
ids=[vert((x,-.105,z),'Paw') for x,z in outline];planar(list(reversed(ids)),'cream','paw_pad',.18,0,1.0)
# Atlas UVs: connected, nonzero-area component islands packed by verified flat-color patches.
patches={'aqua':{'rgb':[111,158,164],'rect':[934,1693,959,1735]},'cream':{'rgb':[249,228,198],'rect':[569,614,594,659]},'orange':{'rgb':[216,146,72],'rect':[711,1642,745,1709]},'gold':{'rgb':[237,201,44],'rect':[565,287,578,301]}}
groups={}
for color,group in zip(facecolors,facegroups):groups.setdefault(color,[]);groups[color]+=[] if group in groups[color] else [group]
mesh=bpy.data.meshes.new('SM_LuckyKick_TargetMedal_Triangles');mesh.from_pydata(vertices,[],faces);mesh.update();ob=bpy.data.objects.new('SM_LuckyKick_TargetMedal',mesh);geo.objects.link(ob)
uv=mesh.uv_layers.new(name='UVChannel_1')
for poly,color,group,coords in zip(mesh.polygons,facecolors,facegroups,uvcoords):
 names=groups[color];idx=names.index(group);cols=math.ceil(math.sqrt(len(names)));rows=math.ceil(len(names)/cols);x0,y0,x1,y1=patches[color]['rect'];pad=.75;w=(x1-x0-2*pad)/cols;h=(y1-y0-2*pad)/rows
 for li,(u,v) in zip(poly.loop_indices,coords):
  px=x0+pad+(idx%cols)*w+.25+min(1,max(0,u))*(w-.5);py=y0+pad+(idx//cols)*h+.25+min(1,max(0,v))*(h-.5);uv.data[li].uv=(px/2048,1-py/2048)
for name,indices in components.items():ob.vertex_groups.new(name=name).add(indices,1,'REPLACE')
bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.triangulate(bm,faces=list(bm.faces));bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(mesh);bm.free();mesh.update()
# Smooth only curved disc/base walls; keep planar caps and decorative star crisp.
for p in mesh.polygons:p.use_smooth=abs(p.normal.y)<.95 and p.center.z<1.76
tex=OUT/'AllPets.png';shutil.copy2(ATLAS,tex);image=bpy.data.images.load(str(tex),check_existing=True);image.colorspace_settings.name='sRGB';image.pack()
mat=bpy.data.materials.new('M_LuckyKick_AllPets');mat.use_nodes=True;bsdf=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED');node=mat.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;node.interpolation='Closest';mat.node_tree.links.new(node.outputs['Color'],bsdf.inputs['Base Color']);bsdf.inputs['Roughness'].default_value=.66;mesh.materials.append(mat)
ob['triangle_limit']=300;ob['construction']='Rigid disc, star, stem and base; five front paw applique shells intentionally open';ob['static_asset']=True
scene.world=bpy.data.worlds.new('LuckyKick_StudioWorld');scene.world.use_nodes=True;next(n for n in scene.world.node_tree.nodes if n.type=='BACKGROUND').inputs['Color'].default_value=(.025,.03,.045,1)
camdata=bpy.data.cameras.new('LuckyKick_Ortho');camdata.type='ORTHO';camdata.ortho_scale=2.45;cam=bpy.data.objects.new('LuckyKick_Ortho',camdata);studio.objects.link(cam);scene.camera=cam
for name,loc,power,size in [('Key',(-3,-4,5),450,4),('Fill',(3,-2,3),230,3),('Rim',(0,3,4),360,3)]:
 data=bpy.data.lights.new('LuckyKick_'+name,'AREA');data.energy=power;data.shape='DISK';data.size=size;light=bpy.data.objects.new(data.name,data);studio.objects.link(light);light.location=loc;light.rotation_euler=(Vector((0,0,1))-light.location).to_track_quat('-Z','Y').to_euler()
scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=512;scene.render.resolution_y=640;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.view_settings.view_transform='Standard';scene.render.film_transparent=False
for o in bpy.context.selected_objects:o.select_set(False)
ob.select_set(True);bpy.context.view_layer.objects.active=ob
for window in bpy.context.window_manager.windows:
 for area in window.screen.areas:
  if area.type=='VIEW_3D':
   area.spaces.active.region_3d.view_distance=3.5;area.spaces.active.region_3d.view_location=(0,0,1.05);area.spaces.active.region_3d.view_rotation=Vector((0,-1,.15)).to_track_quat('Z','Y');area.spaces.active.region_3d.view_perspective='ORTHO';area.spaces.active.shading.type='MATERIAL'
mesh.calc_loop_triangles();assert len(mesh.loop_triangles)<=300
report={'object':ob.name,'triangles':len(mesh.loop_triangles),'vertices':len(mesh.vertices),'dimensions':[1.4,.44,2.065],'materials':1,'texture_sha256':hashlib.sha256(tex.read_bytes()).hexdigest(),'palette':patches,'uv_channel':uv.name,'status':'MODELED_NOT_YET_REVIEWED','original_scene':original_scene.name,'scene':scene.name}
(OUT/'model-report.json').write_text(json.dumps(report,indent=2));bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'LuckyKick_TargetMedal.blend'))
result=report
