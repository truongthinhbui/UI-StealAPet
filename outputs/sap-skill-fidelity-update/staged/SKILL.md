---
name: sap-pet-production
description: Build, revise, optimize or rig SAP/Craftland 3D pets in Blender using the user's eye, symmetry, triangle, palette and UV rules. Excludes ChatGPT companion pets and real-animal care.
---

# SAP pet production

Produce the requested pet asset, preserve the latest approved design, and deliver evidence from the actual export. Respond in the user's language. This skill supplies instructions and references, not a Blender connection.

## ChatGPT and integrated Blender skills

ChatGPT is the primary target for this package. First read [chatgpt.md](references/chatgpt.md) for host/tool capability checks. Use [the integrated Blender library](references/blender/INDEX.md) for modeling, creature/character work, retopology, UVs, materials, rigging, animation, rendering and export. It contains 97 instruction modules and 175 supporting-reference sections; select only the relevant modules, not the entire library at once. Root SAP rules and the latest user source override generic module examples. This library is bundled here; it does not depend on sibling skills already being installed.

## Moving between computers or starting without chat history

Read [portability.md](references/portability.md) and run `scripts/preflight.py` before the first asset operation on a new machine. The versioned defaults are in `production-contract.json`; reconcile them with the current specific user request. The package includes its own visual/rig sources and regression assets. Never depend on previous chat memory, an unbundled sibling skill, an old absolute path or this computer's Blender/MCP configuration.

For "same as before", locate the selected artifact in `assets/baselines/index.json` or the supplied project handoff. Use its actual mesh, palette and saved settings as the source instead of generating another interpretation. Baselines are asset-specific evidence, not a universal pet template or approval to replace newer live edits. Preserve exact source bytes when no change was requested. Before transferring a project, write its current brief/source hashes/eye authority/settings/check results per the portability reference.

## Start with the current source

Inspect the available Blender tools and the active file, scene, mode, objects, modifiers and unsaved changes. Prefer the latest live user-edited mesh over an older export. Snapshot before editing. If Blender is unavailable, use an installed background Blender on a known saved source; if neither works, identify the missing capability and finish only the independent work. Never claim an edit or test that did not run.

Keep a short current brief: selected design/source, requested operation, cap, approved eye construction, symmetry exceptions, palette, UV method, static/rigged scope and deliverables. Current specific user instructions override these defaults; defaults override historical sample values. Ask only for information that blocks the next dependent step. Continue authorized reversible work and perform the visual review yourself.

## Current production contract

| Area | Requirement |
|---|---|
| Geometry | At most **1500 final exported triangles** for the complete pet, including all visible eyes, teeth and accessories. Report vertices separately. The cap is a ceiling, not a target. |
| Appearance | Smooth shading and a rounded silhouette supported by geometry. Deliver an actual clean triangle mesh; quads or hidden diagonals are not triangle savings. |
| Symmetry | Base anatomy, paired eyes and markings mirrored across local sagittal plane, with matching topology and welded center seams where continuous. Decorations can be asymmetric. Declare exceptions from the design; separate shells are not automatically exempt. |
| Eyes | Preserve the latest user-approved eyes. Otherwise inspect OnlyModel and use a copied or visually validated efficient profile. Protect contour, pupil/rim ratio, depth, gaze and mounting. No invented iris or modeled catchlight. Reserve the measured eye cost before optimizing other parts. |
| Palette | **Primary default: the user's AllPets.png**, bundled at [assets/OnlyModel/AllPets.png](assets/OnlyModel/AllPets.png), unchanged 2048×2048 RGBA8. Share this image across all in-scope SAP render models, including pets and associated props, and map UVs to its base-color regions. Generate a different palette or use another image only on explicit user instruction; see [supplied-atlas.md](references/supplied-atlas.md). |
| UVs | **UVChannel_1**, meaningful nonzero-area islands packed into verified flat-color regions of the primary atlas, within the correct color regions, with padding. No point UVs, token microscopic triangle islands or unintended overlaps. Atlas patches may require different density between colors; equal-area rules apply only to an explicitly generated fallback palette. |
| Scene organization | Create a dedicated `COL_<AssetName>` subtree before adding a new pet/prop; put render meshes in its GEO child and helpers separately. Preserve existing unrelated collections. Read [scene-hierarchy.md](references/scene-hierarchy.md). |
| Scope | Do only the requested model, optimization, rig or animation work. A static pet does not require a rig. Use one mesh/material for the SAP render asset; retain meaningful component groups. |
| Wireframe evidence | Automatically include real-mesh wireframe previews whenever an in-scope model exists; pair them with matching clean views. Concept-only topology must be labeled proposed. Read [wireframe-reference.md](references/wireframe-reference.md). |
| Concept/model fidelity | Treat the approved concept as the design contract; prove the feature budget before calling it production-ready. Final technical concept and wireframe must derive from the same accepted mesh revision. Never downgrade the approved design to fit a finished model or equate numeric QA with fidelity. Read [concept-model-fidelity.md](references/concept-model-fidelity.md). |
| Acceptance | Numeric QA and visual review are separate. Inspect actual exported/reimported files; Blender round-trip is not target-game acceptance. |
| Portability | Pack used file textures into the `.blend` and deliver their PNGs beside FBX with relative references. Validate from a relocated folder. Keep all required references/assets in the package; report missing tools rather than substituting style, colors or eye construction. |

## Load only the relevant detail

All paths below are relative to this skill folder. Discover its actual location; do not assume a Codex path or a particular MCP server name.

- **Creating/importing assets into any Blender scene:** read [scene-hierarchy.md](references/scene-hierarchy.md), inspect the existing hierarchy and create/reuse the intended asset subtree before adding objects.
- **Any Blender execution:** [runtime.md](references/runtime.md). Query the actual API/version and tool schema.
- **Any new pet, concept color planning, or UV/material work:** read [supplied-atlas.md](references/supplied-atlas.md). Use the bundled AllPets.png as the primary texture by default, prioritize base colors and preserve the original image. This replaces the former generated-512-palette default.
- **Model/style or palette/UV changes:** [pet-style.md](references/pet-style.md). Inspect a relevant original `assets/OnlyModel/*.png`; thumbnails are not textures. OnlyModel defines appearance, not rigging.
- **Any eye work:** [eyes-standard.md](references/eyes-standard.md), [eye-optimization.md](references/eye-optimization.md). `assets/reference_eye_template.json` is a fallback, not permission to overwrite newer live eyes.
- **Eyes, ears, horns or mounted parts:** [attachment-and-rotation.md](references/attachment-and-rotation.md). Fit and sample the full base on the actual evaluated supporting mesh in one coordinate space. A center hit or intersecting boxes is insufficient.
- **Optimization/retopology:** [mesh-optimization.md](references/mesh-optimization.md), [optimization-skills.md](references/optimization-skills.md). Protect eyes, expression, color borders and contacts. Optimize by component and mirror the chosen side; recheck seam slivers, sampled surface error and shape.
- **Any concept-to-model task or exact-match request:** [concept-model-fidelity.md](references/concept-model-fidelity.md). Use the feasibility, feature-lock and matched-view gates; exact final-sheet geometry correspondence requires an actual shared mesh source.
- **New or refined concept presentation:** [concept-sheet.md](references/concept-sheet.md); view `assets/concept-template.png`. Hero 3/4 left, Front/Side/Back right, exact used palette below. Distinguish concept imagery from actual model renders.
- **Any generated concept, existing model, or model preview:** [wireframe-reference.md](references/wireframe-reference.md). Supply the matched wireframe companion automatically; never present AI-drawn edges as measured mesh topology.
- **Requested rig/animation/SAP technical export:** [rig-and-export.md](references/rig-and-export.md). OnlyRig supplies technical evidence only. Adapt the skeleton to the creature, not the sample fish anatomy.
- **Before delivery:** [visual-acceptance.md](references/visual-acceptance.md), [production-checks.md](references/production-checks.md). Review only checks relevant to the requested scope.

## Execute and finish

1. Establish the brief and baseline front/side/back/3/4 views. Match view and apparent size before judging proportions. Establish a feature lock and component triangle budget per [concept-model-fidelity.md](references/concept-model-fidelity.md); resolve silhouette, feature and marking mismatches before polish.
2. Work in a separate version or isolated scene. Inspect current state again after imports, reconnects or mode changes. Create/reuse the asset collection subtree before geometry, explicitly place new objects there, and keep studio/reference/rig helpers separate. Preserve unrelated hierarchy and stable component names.
3. Iterate changed geometry and mounting. Preserve approved features and measured palette assignments. Keep the model triangulated; diagnose redundant or thin faces before removing them. Do not globally weld or decimate the joined pet.
4. Rebuild real UVs after topology changes. Inspect UV overlay on the actual palette and a temporary checker, then restore the palette. Verify the unchanged primary atlas hash/format, color assignments, area, overlap and padding.
5. Run the bundled read-only audit on an isolated copy. Follow the relevant references for measurements the script does not cover. Fix actual errors; record intentional joins instead of silently ignoring findings.
6. Automatically deliver and inspect matched color/clay and actual triangle wireframes per [wireframe-reference.md](references/wireframe-reference.md), front/side/back/3/4, mounted-part close-ups and a simulated 128/256 px preview. If a major visual defect remains, report **NEEDS REVISION** and correct it within scope.
7. Export only requested files. Reimport the actual export and verify triangles, positions, normals, UVs, colors and attachment; when rigged, verify deformation and animation separation. Refresh matching previews, report and archive after the last change.

Finish with file links, actual exported triangles and vertices, texture/material counts, rig/animation status, checks performed, and meaningful limitations. Distinguish **PASS / NEEDS REVISION / NOT CHECKED** for technical, visual and target-game checks. Keep the reply concise; detailed measurements belong in the delivery report.

## Bundled audit

Run in background Blender, substituting discovered paths and the exact intended mesh names:

```text
blender --background input.blend --python-exit-code 1 --python <skill>/scripts/audit_pet.py -- --objects SM_Pet --texture AllPets.png --texture-mode atlas --report audit.json
```

The audit checks the evaluated triangle cap, general mesh QA, nonzero UV areas and an optional PNG header. It does not establish visual quality, full symmetry, actual palette assignment, mounting, UV padding or target-game compatibility. See [optimization-skills.md](references/optimization-skills.md) for scope and review commands.
