# Concept/model fidelity: design lock and mesh-backed final sheets

Apply to SAP/Craftland pets and associated props when planning concepts, building from references or claiming an exact match. This rule addresses the Target Medal regression: a smooth-looking 300-triangle AI concept became an angular 296-triangle model with flat polygon paw patches, sharp star edges, a blocky base and poor side shading. Its technical audit passed, but its visual fidelity needed revision. Do not treat that result as a newly approved design or a validated baseline.

## What must match

The approved concept is the design authority. Before detailed modeling, record its silhouette, normalized dimensions, component placement/count, thickness/depth, roundness, bevel widths, front/side/back features, color boundaries and material intent. Identify the signature features that must survive optimization, such as the rounded paw pads, softened star, oval base and rim in the Medal. Preserve approved eye construction for pets. Note ambiguous rear details and reconcile contradictory concept views instead of inventing different geometry for each view.

Do not replace rounded modeled details with angular planes, detachments or painted patches solely to satisfy a triangle count. Geometry-versus-texture construction is part of the design contract when it affects silhouette, depth, mounting or response to light. Deliberate separate rigid pieces can be valid, but disclose them and verify their visible joins; one object is not proof of a continuous surface.

## Feasibility before production claims

- Allocate the scoped total triangle cap by component before finalizing a production concept. Reserve geometry for silhouette curvature, focal features, required eyes and attachment transitions first; then secondary bevels and ornaments. Include all visible accessory costs and evaluated modifiers. The cap is a ceiling, not a target.
- Prove the silhouette and signature features with a measured low-poly blockout or test mesh when modeling is within the authorized task. Concept-only work without a mesh stays `DESIGN EXPLORATION / FEASIBILITY NOT VERIFIED`, even with a tris badge or AI wireframe. A skill rule does not authorize starting unrelated or unrequested Blender work.
- Do not produce a highly rounded, detailed image and invent a small numeric cap afterward. Smooth shading cannot make a polygonal silhouette round. Sparse AI wire lines do not prove an achievable topology or triangle count.
- If the fixed cap and the approved design genuinely cannot both be met, report the conflict with component estimates and the smallest concrete tradeoff. Preserve the cap and approved design as unresolved constraints; do not silently raise the cap, simplify a signature feature or claim completion. Routine corrections within scope do not require another approval checkpoint.

## Independent fidelity gates

1. **Blockout:** compare the model to the approved reference in matched front, true side, back and required 3/4 views, at the same apparent size. Review silhouettes and neutral clay before UV polish. Declare task-specific measurement tolerances from the available reference resolution before accepting a result; do not invent an accuracy percentage or adjust tolerances after seeing a failure.
2. **Features and budget:** compare each locked feature: contour, relative size, depth, bevel, mounting and component arrangement. Recover triangles from redundant internal/back surfaces and unnecessary planar density where safe, before reducing focal features. Investigate long thin triangles and shading pinches in visible areas; intentional efficient planar cap fans are allowed when visually stable.
3. **Color and shading:** use the approved AllPets base-color regions and real UV islands. Check color boundaries, side/back shading and ordinary-light appearance. Correct normals, overly broad smoothing and clipped highlights. Do not hide silhouette errors with light, emission, bloom, a flattering camera or a new material. Do not silently substitute the nearest available color after design approval; select feasible atlas colors during concept planning or identify the mismatch.
4. **Final mesh:** pass technical QA AND the visual comparison separately. Review expected shells/open surfaces and contact boundaries. Do not widen floating/z-fighting tolerances merely to make warnings vanish. Evidence must describe what the chosen tolerances establish and any intentional construction exceptions. Technical PASS with a major visual defect remains overall `NEEDS REVISION`.

Correct mismatches in the model to satisfy the approved design. Do not silently redraw or relabel the concept to match a deficient model. A requested or authorized design revision must be recorded as a revision, not presented as proof the original was matched.

## Exact final concept/model correspondence

For a final technical sheet that must depict precisely the same geometry as the model:

- Use the accepted, within-budget Blender mesh as the single geometry source for both final color views and actual triangle wireframes. Render these views in Blender; do not regenerate their geometry with an image model or draw plausible-looking replacement edges.
- Preserve the approved design reference alongside this mesh-backed final sheet. Check the model against that reference before declaring the final sheet accepted. Rendering an inaccurate model cannot by itself prove concept fidelity.
- Match object revision, evaluated modifiers, pose, transforms, axis conventions, orthographic framing and view scale for all paired views. Record mesh hash/revision, scoped triangles/vertices, material/atlas identifiers and camera settings. If delivery export is requested, compare the actual reimported export and use its geometry for final evidence when relevant.
- Keep source `.blend` and existing/requested mesh files with the handoff so Blender/MCP can reuse exact geometry, rather than reconstruct from pixels. Exact topology correspondence requires geometry comparison, not image inspection alone.
- Regenerate affected views, wireframes and reports after any model edit. Never mix old concept views with a newer wireframe or stale counts.

The literal guarantee is limited to a verified shared geometry source: the final technical sheet depicts that exact mesh revision. It is not a promise that an arbitrary AI picture can be reconstructed with 100% fidelity, or that renders across devices have identical pixels. Record any reconstruction tolerance and only claim an exact comparison that was actually performed.

## Delivery verdict

Report independent technical, reference-fidelity, final-sheet/source-correspondence and target-game outcomes. Use `PASS`, `NEEDS REVISION` or `NOT CHECKED` with evidence. Provide the approved reference versus actual model comparison, clean/wireframe matched views, scoped counts and remaining differences. Do not mark an existing asset fixed merely because these rules were updated.
