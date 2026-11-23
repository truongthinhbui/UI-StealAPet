import bpy, bmesh, math, json, hashlib
from pathlib import Path
from mathutils import Vector, Matrix, Quaternion
OUT=Path('D:/revival-prototype-ui-update/outputs/base-lock/blender')
source=json.loads((OUT.parent/'lockshield-mesh.json').read_text())
regions=json.loads((OUT/'atlas-regions.json').read_text())
assert bpy.context.mode=='OBJECT'
assert 'COL_Lockshield' not in bpy.data.collections, 'Existing asset needs inspection before replacement'
root=bpy.data.collections.new('COL_Lockshield');bpy.context.scene.collection.children.link(root)
geo=bpy.data.collections.new('COL_Lockshield_GEO');root.children.link(geo)
studio=bpy.data.collections.new('COL_Lockshield_STUDIO');root.children.link(studio)
allpoints=[]
for part in source['parts']:
    matrix=Matrix([part['matrix'][i::4] for i in range(4)])
    allpoints += [matrix@Vector(part['positions'][i:i+3]) for i in range(0,len(part['positions']),3)]
height=max(p.y for p in allpoints)-min(p.y for p in allpoints)
scale=1.2/height
def world(v):return (v.x*scale,-v.z*scale,v.y*scale)
def norm(v):return (v.x,-v.z,v.y)
parts=[]
for part in source['parts']:
    matrix=Matrix([part['matrix'][i::4] for i in range(4)])
    nm=matrix.to_3x3().inverted().transposed()
    raw=[matrix@Vector(part['positions'][i:i+3]) for i in range(0,len(part['positions']),3)]
    raw_norm=[(nm@Vector(part['normals'][i:i+3])).normalized() for i in range(0,len(part['normals']),3)]
    vertices=[];weld={};remap=[]
    for v in raw:
        key=tuple(round(c,8) for c in v)
        if key not in weld:weld[key]=len(vertices);vertices.append(world(v))
        remap.append(weld[key])
    indices=part['indices'] or list(range(len(raw)))
    faces=[];loopnorms=[]
    for i in range(0,len(indices),3):
        ids=indices[i:i+3];f=tuple(remap[j] for j in ids)
        if len(set(f))<3:continue
        if (Vector(vertices[f[1]])-Vector(vertices[f[0]])).cross(Vector(vertices[f[2]])-Vector(vertices[f[0]])).length<1e-12:continue
        faces.append(f);loopnorms.extend(norm(raw_norm[j]) for j in ids)
    # Add invisible backing to flat blue inset and keyhole details so all rigid parts close.
    boundary={}
    for f in faces:
        for a,b in zip(f,f[1:]+f[:1]):
            k=tuple(sorted((a,b)))
            if k in boundary:boundary.pop(k)
            else:boundary[k]=(a,b)
    if part['name'] in ('Blue shield emblem','Gold badge keyhole','Badge keyhole stem'):
        count=len(vertices);depth=(.009 if part['name']=='Blue shield emblem' else .006)*scale
        vertices += [(x,y+depth,z) for x,y,z in vertices]
        originals=list(faces)
        for f in originals:faces.append(tuple(v+count for v in reversed(f)))
        for a,b in boundary.values():faces.extend([(b,a,a+count),(b,a+count,b+count)])
    elif boundary:
        # The tubular shackle has two open ends, deliberately seated within the lock housing.
        bm=bmesh.new();bmverts=[bm.verts.new(v) for v in vertices]
        for f in faces:bm.faces.new([bmverts[i] for i in f])
        bm.verts.index_update();bm.faces.index_update()
        edges=[e for e in bm.edges if e.is_boundary]
        if edges:bmesh.ops.holes_fill(bm,edges=edges,sides=0)
        bmesh.ops.triangulate(bm,faces=[f for f in bm.faces if len(f.verts)>3])
        bm.verts.index_update();faces=[tuple(v.index for v in f.verts) for f in bm.faces];vertices=[tuple(v.co) for v in bm.verts]
        bm.free();loopnorms=[]
    mesh=bpy.data.meshes.new(part['name']);mesh.from_pydata(vertices,[],faces);mesh.update()
    obj=bpy.data.objects.new('PART_'+part['name'].replace(' ','_'),mesh);geo.objects.link(obj)
    for p in mesh.polygons:p.use_smooth=True
    if loopnorms and len(loopnorms)<=len(mesh.loops):
        rest=[]
        for p in mesh.polygons:
            if p.loop_start>=len(loopnorms):rest.extend([tuple(p.normal)]*p.loop_total)
        mesh.normals_split_custom_set(loopnorms+rest)
    else:
        mesh.set_sharp_from_angle(angle=math.radians(40))
    group=obj.vertex_groups.new(name=part['name'].replace(' ','_'));group.add(list(range(len(vertices))),1,'REPLACE')
    obj['sap_color']=part['color'];parts.append(obj)
# Temporary color IDs allow UV islands to be grouped before collapsing to one atlas material.
temp=[]
for color in regions:
    mat=bpy.data.materials.new('TEMP_Lockshield_'+color);temp.append(mat)
for obj in parts:obj.data.materials.append(temp[list(regions).index(obj['sap_color'])])
bpy.ops.object.select_all(action='DESELECT')
for obj in parts:obj.select_set(True)
bpy.context.view_layer.objects.active=parts[0]
bpy.ops.object.join();obj=bpy.context.object;obj.name='SM_Lockshield';mesh=obj.data
uv=mesh.uv_layers.new(name='UVChannel_1');mesh.uv_layers.active=uv
uv_report={}
for color,region in regions.items():
    mat=temp[list(regions).index(color)];mi=list(mesh.materials).index(mat)
    for p in mesh.polygons:p.select=p.material_index==mi
    bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_mode(type='FACE')
    bpy.ops.mesh.select_all(action='DESELECT')
    bm=bmesh.from_edit_mesh(mesh)
    for f in bm.faces:
        if f.material_index==mi:f.select_set(True)
    bmesh.update_edit_mesh(mesh)
    bpy.ops.uv.smart_project(angle_limit=math.radians(70),island_margin=.025,correct_aspect=True,scale_to_bounds=True)
    bpy.ops.object.mode_set(mode='OBJECT')
    uv=mesh.uv_layers.active
    loops=[li for p in mesh.polygons if p.material_index==mi for li in p.loop_indices]
    low=[min(uv.data[i].uv[k] for i in loops) for k in range(2)]
    high=[max(uv.data[i].uv[k] for i in loops) for k in range(2)]
    x,y,w,h=region['rect'];pad=region['padding_px'];usable=(w-2*pad,h-2*pad)
    for i in loops:
        u,v=uv.data[i].uv
        uv.data[i].uv=((x+pad+(u-low[0])/(high[0]-low[0])*usable[0])/2048,(2048-y-h+pad+(v-low[1])/(high[1]-low[1])*usable[1])/2048)
    uv_report[color]={'faces':sum(p.material_index==mi for p in mesh.polygons),'rectangle':region['rect'],'outer_padding_pixels':pad}
for p in mesh.polygons:p.select=False;p.material_index=0
mesh.materials.clear()
atlas_path=OUT/'AllPets.png'
assert hashlib.sha256(atlas_path.read_bytes()).hexdigest()=='c58e12d35117fa3b4e02e1534dc46b3d99ff9d2f6986cb6f063299e231560b86'
image=bpy.data.images.load(str(atlas_path),check_existing=True);image.name='AllPets.png';image.pack();image.filepath='//AllPets.png'
mat=bpy.data.materials.new('MAT_Lockshield_AllPets');mat.use_nodes=True
nodes=mat.node_tree.nodes;bsdf=next(n for n in nodes if n.type=='BSDF_PRINCIPLED')
bsdf.inputs['Roughness'].default_value=.65;bsdf.inputs['Metallic'].default_value=.08
tex=nodes.new('ShaderNodeTexImage');tex.image=image;tex.interpolation='Closest'
mat.node_tree.links.new(tex.outputs['Color'],bsdf.inputs['Base Color']);mesh.materials.append(mat)
obj['sap_concept_source']='lockshield-mesh.json';obj['sap_height_m']=1.2;obj['sap_construction']='Rigid mounted closed components; intended hidden seating overlaps'
obj['sap_uv_note']='Real smart-project islands in exact-color atlas regions; 2px external padding; low-density base color, no detail texture'
bpy.context.scene.unit_settings.system='METRIC'
bpy.context.view_layer.update()
# Studio helpers stay outside GEO and outside the model counts.
scene=bpy.context.scene
scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=1000;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=False
scene.world=bpy.data.worlds.new('World_Lockshield_Studio');scene.world.use_nodes=True
background=next(n for n in scene.world.node_tree.nodes if n.type=='BACKGROUND');background.inputs[0].default_value=(.07,.08,.12,1);background.inputs[1].default_value=.5
scene.view_settings.view_transform='Standard'
def light(name,location,power,size,color):
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size;data.color=color
    o=bpy.data.objects.new(name,data);studio.objects.link(o);o.location=location;o.rotation_euler=(Vector((0,0,.65))-o.location).to_track_quat('-Z','Y').to_euler()
light('KEY_Lockshield',(-2,-3,4),350,4,(1,.88,.72));light('FILL_Lockshield',(3,-1,2),200,3,(.75,.85,1));light('RIM_Lockshield',(0,3,3),300,3,(.78,.86,1))
camdata=bpy.data.cameras.new('CAM_Lockshield_Review');camera=bpy.data.objects.new('CAM_Lockshield_Review',camdata);studio.objects.link(camera);camdata.type='ORTHO';camdata.ortho_scale=1.65;scene.camera=camera
camera.location=(2.3,-3.6,2.0);camera.rotation_euler=(Vector((0,0,.6))-camera.location).to_track_quat('-Z','Y').to_euler()
for area in bpy.context.screen.areas:
    if area.type=='VIEW_3D':
        space=area.spaces.active;space.shading.type='MATERIAL';space.overlay.show_floor=False
        space.region_3d.view_rotation=camera.rotation_euler.to_quaternion();space.region_3d.view_distance=2.3;space.region_3d.view_location=(0,0,.6);space.region_3d.view_perspective='ORTHO'
for helper in studio.objects:helper.hide_set(True)
bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
mesh.calc_loop_triangles()
report={'source_triangles':1228,'triangles':len(mesh.loop_triangles),'vertices':len(mesh.vertices),'height_m':obj.dimensions.z,'dimensions_m':list(obj.dimensions),'material_count':len(mesh.materials),'texture_sha256':hashlib.sha256(atlas_path.read_bytes()).hexdigest(),'uv':uv_report,'collection':root.name,'object':obj.name}
assert report['triangles']<=1500
(OUT/'build-report.json').write_text(json.dumps(report,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'Lockshield.blend'))
print('LOCKSHIELD_BUILD_RESULT',json.dumps(report))
