# Pet visual acceptance and regression prevention

Apply to SAP/Craftland pets alongside eyes-standard.md, attachment-and-rotation.md and production-checks.md. The selected concept and current user brief determine proportions; examples below are failure cases, not a template imposed on every species. A new rule does not retroactively fix a mesh.

## 1. Establish measurable visual targets before modeling

- Extract a short design brief from the selected reference: silhouette, head/body ratio, visible leg length, ear outline/thickness, tail curve, muzzle projection, flipper shape, color-boundary shape and intended expression.
- Record eye outer diameter relative to head width, eye-center spacing and height relative to facial landmarks, and intended gaze in a head-local frame. Use normalized measurements rather than the source animal's world coordinates.
- Set tolerances appropriate to the reference resolution and task. If using a numeric screen-space tolerance, declare it before judging the model; do not invent a universal percentage or adjust it after seeing a failure.
- If an AI concept's different views contradict each other, identify a primary view and reconcile the others before detailed modeling. Label inferred anatomy and retain the chosen interpretation in the brief.

## 2. Gate the blockout before UV and polish

Compare front, side and 3/4 views at the same apparent size and equivalent perspective. Use silhouette or neutral clay as well as color. Match the camera before changing geometry to explain an apparent mismatch. For autonomous work, perform this gate yourself and continue correcting within the authorized design; another approval is not required by this rule.

Do not advance a blockout with an unresolved major mismatch in head/body proportion, limb length, eye prominence, ear orientation or tail silhouette. A recognizable animal assembled from primitives is not yet a matched pet design. Once primary shapes pass, refine expression, secondary shapes and markings.

## 3. Eyes must match visually as well as geometrically

- Preserve the approved eye profile and source ratios as a rigid assembly, using copied fronts or visually validated optimized topology per [eye-optimization.md](eye-optimization.md). Source vertex/face equality is required only for an exact-copy claim; it does not prove correct appearance, placement or an efficient budget.
- Compare both eyes at matched head size in front, 3/4, left/right profile, close-up and a small gameplay-size preview (for example 128 and 256 pixels; use the intended game's actual view if available). Declare the simulated size when no game test exists.
- Judge outer diameter/head ratio, spacing, facial height, visible rim, depth and gaze together. Eyes must remain the primary focal point unless the selected design says otherwise. Do not solve curvature problems by shrinking eyes until they fit or allowing the face/muzzle to overwhelm them.
- Do not inherit gaze from a single supporting triangle or from its surface normal alone. A best-fit surface frame can improve seating but still produce excessive upward or sideways gaze. Record pitch/yaw in the head-local frame and compare with the concept; there is no universal forward-facing angle for all species.
- If the intended eye size and gaze cannot seat cleanly, reshape the local forehead/socket or move the whole rigid assembly, then recheck the complete contact boundary. Do not independently stretch the dark center or change the approved eye curvature; a later user-approved flat pupil should stay flat.
- Check pair symmetry against the design, including tilt and apparent size; a hero camera can conceal asymmetry. Geometry, attachment and visual expression require separate verdicts.

## 4. Rounded silhouette and clean transitions

- Smooth shading changes normals, not silhouette. Inspect unlit/neutral outlines at intended viewing distance and a close-up. Allocate polygons to the visible head, ears, paws, fins and tail curvature before hidden/internal surfaces; keep protected eye fronts unchanged.
- Ear thickness, root blend, tip curvature and inner-ear plane must follow the concept. Avoid thin upright slabs and razor edges on a soft pet unless deliberately designed.
- Match leg length and paw fullness to the concept. Short chibi limbs must not become long tapered cones merely because that primitive is convenient.
- Match the whole tail centerline and width profile. Check that a raised tail neither replaces the intended side curl nor hides the head in front/back views. Preserve readable paired tail lobes where the creature has them.
- Muzzle and flipper roots need a deliberate transition. Overlapping spheres/ellipsoids can leave a pasted-on muzzle or bead-like shoulders despite closed geometry. Review seams in clay, profile, rear/above views and ordinary light.
- Soft mouths need a readable smooth curve. Avoid an angular wire-like W when the concept has rounded arcs. Do not add modeled catchlights or unsupported facial layers as a shortcut to expression.
- Use selective sharp edges/split normals only for intended hard features. Do not mark every face smooth and assume this resolves hard corners or pinching.

## 5. Marking shape and palette

- Validate the shape of a color region, not just its RGB. Rounded belly patches must keep their oval outline; a straight rectangular upper edge or stair-stepped border is a visual failure when absent from the concept.
- Adapt edge flow/UV boundaries to important markings, or use a texture solution compatible with the brief. Keep the limited shared palette, exact base swatches and distributed nonzero-area UV rules; do not add materials or colors just to hide a poor boundary.
- Keep concept art distinct from real-model renders. Palette swatches for delivery must come from actual texture/material values, not shaded pixels or generated concept approximations.

## 6. Topology and scope

- One Blender object is not necessarily one connected surface. Count disconnected shells and explain their roles. Separate eyes, teeth, rigid accessories and deliberately overlapping static parts can be valid; neither one universal shell count nor welding everything is required.
- Intersecting volumes or several inside samples do not establish a seamless attachment. Inspect the entire visible join and contact footprint. A manifold shell test does not detect all self-intersections or unwanted internal faces.
- For static delivery, disclose overlapping shells and unresolved transition artifacts. For a requested deforming pet, use suitable connected topology or an explicitly validated separate-part solution at shoulders, hips, flipper roots and other bending regions. Inspect weights and the relevant motion range before claiming animation readiness.
- Recover budget from unnecessary internal/back faces only where safe. Do not remove faces needed in poses or future views without verifying the intended scope. Recheck normals, silhouette, source eyes and exported triangles after optimization.

## 7. Review evidence and honest completion

Record two independent outcomes:

1. **Technical:** measured final/exported triangles and vertices, material count, texture size/format, UV area/overlap/padding, source-eye check, attachment checks and actual export reimport results.
2. **Visual:** concept comparisons, eye prominence/gaze, proportions, silhouette, markings and joins. Use PASS / NEEDS REVISION / NOT CHECKED with specific evidence and remaining defects.

Overall status is NEEDS REVISION while any major visual defect remains, even when technical checks pass. A static model with no rig must be labeled STATIC, not animation/game ready. Distinguish Blender validation, simulated gameplay previews and actual target-game import/play testing. Do not report an unperformed test as PASS.

After a change, regenerate affected views and exports, update reports and rebuild the delivery ZIP. Do not use stale renders as evidence. Re-review the changed regions and their dependencies rather than rerunning unrelated checks indefinitely.

## Regression cases from Winterland Trio

| Asset | Observed issue | Required regression check |
|---|---|---|
| Frosty Fox | Long thin legs, small body, slab-like ears and tall straight tail diverged from the short rounded concept | Match normalized body/leg ratios, soft ear thickness and side-curved tail silhouette before UV |
| Snowcap Penguin | Rectangular belly upper edge, block-like feet and insufficiently prominent eyes | Oval belly boundary, low broad webbed-foot outline and reference-relative eye size/gaze |
| Mochi Seal | Strong separate muzzle bulge, angular mouth, upward gaze and low unreadable tail lobes | Integrated muzzle transition, rounded mouth, intended gaze and clearly separated paired tail silhouette |
| All three | Numeric PASS was mistaken for completed visual quality; joined objects retained many independent shells | Separate technical/visual verdicts; review transitions and declare static vs deforming topology |
