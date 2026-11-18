from pathlib import Path
import json,hashlib,shutil,sys
root=Path(r'C:/Users/truongthinh.bui_ctv/.codex/skills/sap-pet-production')
work=Path(__file__).resolve().parent
stage=work/'staged'
hashof=lambda p:hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None
if '--apply' in sys.argv:
    plan=json.loads((work/'update-plan.json').read_text(encoding='utf-8'))
    for name,expected in plan['before'].items():
        if hashof(root/name)!=expected:raise RuntimeError('Source changed since staging: '+name)
    for name in plan['files']:
        dst=root/name
        if dst.exists():
            backup=work/'backups'/name;backup.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(dst,backup)
        dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(stage/name,dst)
    for name in plan['files']:
        assert hashof(root/name)==hashof(stage/name),name
    print('Applied SAP wireframe update 2.3.1; '+str(len(plan['files']))+' files verified; backups in '+str(work/'backups'))
    sys.exit(0)
changes={}
s=(root/'SKILL.md').read_text(encoding='utf-8')
needle='| Acceptance |'
pos=s.index(needle)
s=s[:pos]+'| Wireframe evidence | Automatically include real-mesh wireframe previews whenever an in-scope model exists; pair them with matching clean views. Concept-only topology must be labeled proposed. Read [wireframe-reference.md](references/wireframe-reference.md). |\n'+s[pos:]
needle='- **Requested rig/animation/SAP technical export:**'
pos=s.index(needle)
s=s[:pos]+'- **Any generated concept, existing model, or model preview:** [wireframe-reference.md](references/wireframe-reference.md). Supply the matched wireframe companion automatically; never present AI-drawn edges as measured mesh topology.\n'+s[pos:]
s=s.replace('Inspect matched color/clay and actual triangle wireframes, front/side/back/3/4,','Automatically deliver and inspect matched color/clay and actual triangle wireframes per [wireframe-reference.md](references/wireframe-reference.md), front/side/back/3/4,')
changes['SKILL.md']=s
changes['references/wireframe-reference.md']='''# Automatic wireframe references for SAP concepts and models

Apply to in-scope SAP/Craftland pets and associated props. When generating concepts or presenting an existing model, include a wireframe companion without waiting for a separate request. Preserve the latest user-requested view layout and approved geometry, eyes, palette and triangle cap. This requirement does not authorize modifying unrelated models or starting unrequested modeling/export work.

## Choose the evidence source

- **A model exists:** inspect the latest user-edited source through actual Blender/MCP capabilities. Generate wireframe evidence from that mesh, never from an image generator. If only a rendered image exists and the mesh cannot be accessed, report real wireframe NOT CHECKED; do not trace invented edges and call them the original topology.
- **Concept only:** generate matching clean views and a companion proposed-topology view with sparse, plausible edge flow and the planned triangle cap. Label it `PROPOSED TOPOLOGY - NO MESH YET`. Reconcile inconsistent views and mark inferred hidden structure before Blender modeling. These drawn edges are guidance, not triangle measurements or an exact blueprint. Do not fabricate dense wire lines solely to appear technical. Replace the proposal with actual mesh evidence once modeling exists.
- Use `ACTUAL MESH WIREFRAME` only for views derived from actual evaluated mesh triangles; use `PLANNED TRI LIMIT` for a concept budget and `MEASURED TRIS / VERTICES` only after measurement. An existing model's preview must not silently substitute an older approved export for newer live edits.

## Real-model preview pair

1. Snapshot or use an isolated copy. Establish asset-local Front, Right Side and Back axes, transforms, bounding box, units and current dimensions. Orthographic views have no perspective or vertical tilt. Keep the same framing, pose, scale, resolution and visible components between clean and wireframe counterparts. Add a 3/4 view if requested or needed by the current presentation template.
2. Evaluate the exact geometry intended for export. Use an isolated triangulated evaluated mesh or reimport the actual delivery export when one is requested. Show real triangle edges, including triangulation diagonals; a quad cage or subdivision control cage is not final-triangle evidence. Measure triangles/vertices separately and state whether these are source, evaluated or reimported export counts. Include eyes and all visible accessories in the scoped total.
3. Render thin contrasting triangle lines over neutral clay or desaturated solid shading so the silhouette and topology remain readable. Include a clean color companion. A separately labeled X-ray/hidden-edge view may supplement them, not replace ordinary visible-surface inspection. Do not add bevels, subdivision or wireframe thickness to the delivered mesh just to make the preview.
4. Preserve source modifiers, materials, palette UVs, shading, scene hierarchy, selection and unsaved changes. Create any display lines/helpers on a temporary copy in the asset's helper/studio scope, exclude them from geometry counts and exports, and remove them after capture. Do not save helper geometry into the render-asset GEO subtree.
5. Deliver the clean and wireframe sheets inline or as linked image files in the same response. Record source filename, scoped object names, revision/hash, axes, dimensions, modifier evaluation, triangle/vertex counts and matching camera settings in the asset report. If a mesh changes, regenerate affected wireframe/clean pairs before claiming completion. For unrequested exports, retain references to the existing source rather than creating new delivery formats.

The bundled `scripts/review_shots.py --mode wire` can help with actual mesh inspection, but its default cameras are perspective with a slight vertical offset, and its Wireframe modifier follows existing mesh edges. It does not by itself establish orthographic final-triangle views: use an isolated triangulated copy and explicitly orthographic, untilted matched cameras for the three-view deliverable. Do not claim those properties from its default output.

## Modeling handoff and acceptance

Use paired views to compare silhouette, major proportions, component mounting, color boundaries and visible edge flow. For Blender/MCP, prefer the actual approved mesh and saved transforms/cameras over reconstructing geometry from pictures. Record reconciliation of ambiguous rear/side features and measured tolerances in the brief.

Wireframe images improve guidance but cannot guarantee a 100% identical reconstruction. Exact topology/vertex correspondence requires access to the source mesh and a geometry comparison; an FBX/GLB/.blend plus hashes is a stronger handoff than rendered references alone. Do not invent an accuracy percentage. Keep technical, visual and target-game checks separate, and report unavailable real-mesh evidence as NOT CHECKED.
'''
s=(root/'references/concept-sheet.md').read_text(encoding='utf-8')
s+='''\n## Automatic wireframe companion\n\nFor every new or refined in-scope concept, follow [wireframe-reference.md](wireframe-reference.md) and include a companion with the same view layout. If an actual model exists, use its real evaluated triangle wireframe and matched clean renders. Without a mesh, label the companion `PROPOSED TOPOLOGY - NO MESH YET` and the cap `PLANNED TRI LIMIT`; do not present generated lines as actual exported topology or promise exact reconstruction. The user's latest three-view layout overrides the default hero layout when explicitly requested.\n'''
changes['references/concept-sheet.md']=s
s=(root/'references/visual-acceptance.md').read_text(encoding='utf-8')
s+='''\n## Automatic delivery evidence\n\nWhen an in-scope model exists, automatically deliver matched clean and real-triangle wireframe Front/Right Side/Back previews per [wireframe-reference.md](wireframe-reference.md), including scoped counts and source revision. Keep the requested layout; add 3/4 when appropriate. Generated topology guides cannot satisfy this real-mesh evidence requirement. If the model is inaccessible, report the wireframe check as NOT CHECKED and finish the independent work. A skill update alone does not retroactively validate old assets.\n'''
changes['references/visual-acceptance.md']=s
contract=json.loads((root/'production-contract.json').read_text(encoding='utf-8'))
contract['package_version']='2.3.1'
contract['defaults']['wireframe_evidence']={
 'automatic':True,
 'scope':'SAP/Craftland pets and associated props in the current task',
 'when_mesh_exists':'matched clean and actual evaluated/final triangle wireframe previews',
 'when_concept_only':'matched proposed-topology companion, explicitly labeled NO MESH YET',
 'required_views':['front','right_side','back'],
 'user_layout_override':True,
 'source_geometry_mutation_for_preview':False,
 'accuracy_guarantee':None,
 'reference':'references/wireframe-reference.md'
}
changes['production-contract.json']=json.dumps(contract,ensure_ascii=False,indent=2)+'\n'
manifest=json.loads((root/'package-manifest.json').read_text(encoding='utf-8'))
manifest['package_version']='2.3.1'
for name,text in changes.items():
    data=text.encode('utf-8');manifest['files'][name]={'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
changes['package-manifest.json']=json.dumps(manifest,ensure_ascii=False,indent=2)+'\n'
for name,text in changes.items():
    dst=stage/name;dst.parent.mkdir(parents=True,exist_ok=True);dst.write_bytes(text.encode('utf-8'))
plan={'version':'2.3.1','files':list(changes),'before':{name:hashof(root/name) for name in changes}}
(work/'update-plan.json').write_text(json.dumps(plan,indent=2),encoding='utf-8')
print('Staged '+str(len(changes))+' files; original skill unchanged until apply.')
