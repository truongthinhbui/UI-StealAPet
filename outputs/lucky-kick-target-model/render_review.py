import bpy,math,json
from pathlib import Path
from mathutils import Vector
OUT=Path(r'D:/revival-prototype-ui-update/outputs/lucky-kick-target-model');scene=bpy.context.scene;ob=bpy.data.objects['SM_LuckyKick_TargetMedal'];studio=bpy.data.collections['COL_LuckyKick_TargetMedal_STUDIO'];cam=scene.camera
views=[('front',(0,-5,1.02)),('side',(5,0,1.02)),('back',(0,5,1.02))]
for name,loc in views:
 cam.location=loc;cam.rotation_euler=(Vector((0,0,1.02))-cam.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(OUT/('color-'+name+'.png'));bpy.ops.render.render(write_still=True)
clay=bpy.data.materials.new('QA_Target_Clay');clay.diffuse_color=(.45,.48,.52,1);clay.use_nodes=True;next(n for n in clay.node_tree.nodes if n.type=='BSDF_PRINCIPLED').inputs['Base Color'].default_value=(.45,.48,.52,1)
copy=ob.copy();copy.data=ob.data.copy();copy.name='QA_Target_ClayCopy';studio.objects.link(copy);copy.data.materials.clear();copy.data.materials.append(clay);ob.hide_render=True
line_mat=bpy.data.materials.new('QA_Triangle_Lines');line_mat.use_nodes=True;bsdf=next(n for n in line_mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED');bsdf.inputs['Base Color'].default_value=(.015,.025,.04,1);bsdf.inputs['Roughness'].default_value=1
curve=bpy.data.curves.new('QA_ActualTriangleEdges','CURVE');curve.dimensions='3D';curve.bevel_depth=.0017;curve.bevel_resolution=0;curve.resolution_u=1;curve.materials.append(line_mat)
for edge in ob.data.edges:
 sp=curve.splines.new('POLY');sp.points.add(1)
 for p,i in zip(sp.points,edge.vertices):p.co=(*ob.data.vertices[i].co,1)
lines=bpy.data.objects.new('QA_ActualTriangleEdges',curve);studio.objects.link(lines)
for name,loc in views:
 cam.location=loc;cam.rotation_euler=(Vector((0,0,1.02))-cam.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(OUT/('wire-'+name+'.png'));bpy.ops.render.render(write_still=True)
ob.hide_render=False;bpy.data.objects.remove(lines,do_unlink=True);bpy.data.objects.remove(copy,do_unlink=True)
cam.location=(0,-5,1.02);cam.rotation_euler=(Vector((0,0,1.02))-cam.location).to_track_quat('-Z','Y').to_euler();ob.show_wire=True;ob.show_all_edges=True
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'LuckyKick_TargetMedal.blend'))
result={'color':[str(OUT/('color-'+n+'.png')) for n,_ in views],'wire':[str(OUT/('wire-'+n+'.png')) for n,_ in views],'actual_wireframe':True}
