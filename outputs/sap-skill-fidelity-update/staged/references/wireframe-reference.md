# Automatic wireframe references for SAP concepts and models

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

## Fidelity prerequisite

Follow [concept-model-fidelity.md](concept-model-fidelity.md). A sparse AI wireframe is not a feasibility proof. Before issuing a final technical concept, meet the approved design and scoped cap in an actual accepted mesh, then derive clean and triangle-edge views from that exact revision. Preserve the approved concept alongside the final sheet; do not use a render of an inaccurate model to claim the original design was matched.
