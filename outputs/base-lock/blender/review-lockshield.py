import bpy,json,math
from pathlib import Path
from mathutils import Vector
OUT=Path('D:/revival-prototype-ui-update/outputs/base-lock/blender')
obj=bpy.data.objects['SM_Lockshield'];me=obj.data;scene=bpy.context.scene
uv=me.uv_layers.active
source=json.loads((OUT.parent/'lockshield-mesh.json').read_text())
colors={p['name'].replace(' ','_'):p['color'] for p in source['parts']}
report=[]
for p in me.polygons:
    groups=set(g.group for g in me.vertices[p.vertices[0]].groups)
    for vi in p.vertices[1:]:groups &= {g.group for g in me.vertices[vi].groups}
    color=colors[obj.vertex_groups[next(iter(groups))].name]
    report.append({'color':color,'uv':[list(uv.data[i].uv) for i in p.loop_indices]})
(OUT/'uv-faces.json').write_text(json.dumps(report))
scene.render.resolution_x=700;scene.render.resolution_y=700;scene.render.resolution_percentage=100
camera=scene.camera;camera.data.ortho_scale=1.50
targets={'hero':(2.3,-3.6,2.0),'front':(0,-4,.6),'side':(4,0,.6),'back':(0,4,.6)}
wire=bpy.data.materials.new('TEMP_ActualTriangleWire');wire.use_nodes=True
nodes=wire.node_tree.nodes;bsdf=next(n for n in nodes if n.type=='BSDF_PRINCIPLED')
wn=nodes.new('ShaderNodeWireframe');wn.use_pixel_size=True;wn.inputs['Size'].default_value=.72
mix=nodes.new('ShaderNodeMixRGB');mix.inputs[1].default_value=(.14,.18,.22,1);mix.inputs[2].default_value=(.70,.48,.94,1)
wire.node_tree.links.new(wn.outputs[0],mix.inputs[0]);wire.node_tree.links.new(mix.outputs[0],bsdf.inputs['Base Color']);bsdf.inputs['Roughness'].default_value=.85
for mode in ('color','wire'):
    scene.view_layers[0].material_override=wire if mode=='wire' else None
    for name,location in targets.items():
        camera.location=location;camera.rotation_euler=(Vector((0,0,.6))-camera.location).to_track_quat('-Z','Y').to_euler()
        scene.render.filepath=str(OUT/f'{mode}-{name}.png');bpy.ops.render.render(write_still=True)
print('LOCKSHIELD_REVIEW_DONE')
