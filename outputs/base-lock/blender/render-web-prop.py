import bpy
from mathutils import Vector
from pathlib import Path
scene=bpy.context.scene
obj=bpy.data.objects['SM_Lockshield']
scene.render.engine='BLENDER_EEVEE'
scene.render.resolution_x=512
scene.render.resolution_y=640
scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.render.image_settings.file_format='PNG'
scene.render.image_settings.color_mode='RGBA'
scene.view_layers[0].material_override=None
camera=scene.camera
camera.data.type='ORTHO'
camera.data.ortho_scale=1.43
camera.location=(2.0,-4.5,2.35)
camera.rotation_euler=(Vector((0,0,.60))-camera.location).to_track_quat('-Z','Y').to_euler()
scene.render.filepath='D:/revival-prototype-ui-update/assets/base-lock/lockshield-prop.png'
bpy.ops.render.render(write_still=True)
print('WEB_PROP_RENDERED',scene.render.filepath)
