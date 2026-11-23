import bpy, json, math
from mathutils import Vector
from pathlib import Path
OUT=Path('D:/revival-prototype-ui-update')
obj=bpy.data.objects['SM_Lockshield'];scene=bpy.context.scene
atlas=bpy.data.images['AllPets.png']
import numpy as np
pixels=np.array(atlas.pixels[:],dtype=float).reshape(2048,2048,4)
# Search the unchanged primary atlas for usable flat patches near the requested hues.
rgb=np.rint(pixels[:,:,:3]*255).astype(np.uint8)
colors,counts=np.unique(rgb.reshape(-1,3),axis=0,return_counts=True)
candidates=colors[counts>1500]
def patch(target):
    order=np.argsort(((candidates.astype(float)-np.array(target))**2).sum(1))
    for index in order[:100]:
        color=candidates[index];mask=(rgb==color).all(2).astype(np.int32)
        integral=np.pad(mask,((1,0),(1,0))).cumsum(0).cumsum(1)
        size=9;sums=integral[size:,size:]-integral[:-size,size:]-integral[size:,:-size]+integral[:-size,:-size]
        good=np.argwhere(sums==size*size)
        if len(good):
            y,x=good[len(good)//2];return {'rgb':color.tolist(),'rect':[int(x),int(y),size,size]}
    raise RuntimeError('No usable atlas patch near '+str(target))
tiers={'blue':{'body':patch([112,185,231]),'accent':patch([173,227,242])},'purple':{'body':patch([159,116,215]),'accent':patch([218,185,243])},'gold':{'body':patch([242,184,79]),'accent':patch([255,224,181])}}
regions=json.loads((OUT/'outputs/base-lock/blender/atlas-regions.json').read_text())
uv=obj.data.uv_layers.active
original=[tuple(d.uv) for d in uv.data]
for tier,spec in tiers.items():
    for p in obj.data.polygons:
        center=sum((Vector(original[i]) for i in p.loop_indices),Vector((0,0)))/3
        for key,dest in [('gold',spec['body']),('blue',spec['accent'])]:
            x,y,w,h=regions[key]['rect'];lo=(x/2048,(2048-y-h)/2048);hi=((x+w)/2048,(2048-y)/2048)
            if lo[0]<=center.x<=hi[0] and lo[1]<=center.y<=hi[1]:
                tx,ty,tw,th=dest['rect']
                for i in p.loop_indices:
                    u,v=original[i];u=(u-lo[0])/(hi[0]-lo[0]);v=(v-lo[1])/(hi[1]-lo[1])
                    uv.data[i].uv=((tx+1+u*(tw-2))/2048,(ty+1+v*(th-2))/2048)
                break
            else:
                for i in p.loop_indices:uv.data[i].uv=original[i]
    bsdf=next(n for n in obj.data.materials[0].node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    bsdf.inputs['Metallic'].default_value=.22 if tier=='blue' else .35 if tier=='purple' else .5
    bsdf.inputs['Roughness'].default_value=.40 if tier=='blue' else .34 if tier=='purple' else .28
    scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=512;scene.render.resolution_y=640;scene.render.resolution_percentage=100
    scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
    scene.view_layers[0].material_override=None
    camera=scene.camera;camera.data.type='ORTHO';camera.data.ortho_scale=1.43;camera.location=(2,-4.5,2.35);camera.rotation_euler=(Vector((0,0,.6))-camera.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(OUT/f'assets/base-lock/lockshield-{tier}.png');bpy.ops.render.render(write_still=True)
(OUT/'outputs/base-lock/blender/tier-palette.json').write_text(json.dumps(tiers,indent=2))
print('WEB_TIERS_RENDERED',json.dumps(tiers))
