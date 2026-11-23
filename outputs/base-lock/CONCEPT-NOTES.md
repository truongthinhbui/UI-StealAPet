# Trụ Khóa Chân Thú — SAP concept V01

Purpose: a static interactable beside the base entrance. Broad circular foot, short support, thick gold padlock, cream face with dark raised paw emblem and a small keyhole. The lock silhouette communicates protection at gameplay distance without adding another pet character or facial features.

Proposed height: 1.2 m in game; concept geometry is normalized and is not an imported game asset. Front +Z, up +Y. Paired paw pads and shackle are symmetrical across X=0. Rear has a recessed-style access plate. Rigid mounted shells are intentional. No rig, animation or production export requested.

## Interaction proposal

- Owner within 2–3 m: highlight the prop and show the screen action “Khóa Base”.
- Click: existing item confirmation panel opens.
- Confirm: consume one item, close panel, show 03:00 above the prop; status band changes from standby to protection state.
- Expiry: band returns to standby; interaction becomes available again.

## Source and evidence

Applied skill: `C:/Users/truongthinh.bui_ctv/.codex/skills/sap-pet-production/SKILL.md` version 2.4.0. File preflight: PASS, 185 files. Reference: bundled concept-template.png. Colors sampled from the unchanged bundled AllPets.png, SHA-256 c58e12d35117fa3b4e02e1534dc46b3d99ff9d2f6986cb6f063299e231560b86.

| Color | sRGB | Atlas sample (top-left image pixels) | Assignment |
|---|---|---|---|
| Gold | #F2B84F | 1819,1 | Lock body and shackle |
| Cream | #FFE0B5 | 1508,15 | Face and pedestal trim |
| Navy | #344547 | 136,10 | Pedestal, support, paw, rear plate |
| Blue | #6F9EA4 | 901,79 | Status band |
| Dark | #16444B | 1128,13 | Keyhole |

The four views and wireframe are rendered from the same procedural Three.js concept mesh in assets/base-lock-concept.js. Measured concept geometry: 1,348 triangles, 2,458 buffer vertices (includes duplicated normals/UV boundaries, not a welded-vertex measurement), 17 rigid components, five base colors. Real triangle wireframe, not invented topology. Same cameras for clean/wire; true orthographic front/right/back. No externally generated imagery.

## Limits

Concept presentation and shared-view correspondence: PASS after visual review. Triangle feasibility: 1,348 < 1,500 for this concept mesh. Full SAP production asset QA, atlas UV packing, one-material mesh consolidation, normals/manifold/contact audit, Blender export/reimport and target-game checks: NOT CHECKED. This is DESIGN EXPLORATION, not production-ready acceptance.

Live Blender MCP could not connect. Installed portable Blender failed to start due to Windows side-by-side configuration, both sandboxed and outside the sandbox. No Blender scene or unrelated user asset was modified. No Blender/FBX export is claimed.

Source page: assets/base-lock-concept.html; use ?wire=1 for actual concept wireframe. Reproduce image outputs with outputs/base-lock/render-concept.cjs. Browser rendering: local Three.js and Edge, no remote requests required for these sheets.
