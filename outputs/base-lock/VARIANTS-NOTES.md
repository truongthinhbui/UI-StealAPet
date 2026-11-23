# SAP lock-base concept alternatives

Current direction (user correction): **Lockshield / Trụ Khóa Huy Hiệu Khiên**. Preserve the original padlock statue, shackle, cream inset face, rear panel and circular pedestal exactly; replace only the front paw/keyhole decoration with a raised shield badge and small gold keyhole. The shield is an emblem on the lock, not the main body. Measured concept: 1228 triangles, 2571 buffer vertices, 14 rigid components, four actually used atlas-sampled colors (gold, cream, navy, blue). Four matched clean/wire views. Front +Z; up +Y. Proposed height 1.2 m, not target-game scale acceptance. Activation glow is proposed, not an animation implemented by the static sheets.

Previous Shieldlock direction is retained only for comparison: broad shield with a gold padlock mounted on its face.

Three earlier alternatives are retained for comparison: Guardian Bell, Shield Pup statue and Base Breaker. All are rendered locally using the same concept-sheet layout and atlas-sampled palette established in CONCEPT-NOTES.md. Each clean/wire pair uses the same actual Three.js geometry and matched cameras. Front/side/back are orthographic. No external generated images.

| Concept | Measured concept triangles | Buffer vertices |
|---|---:|---:|
| Shieldlock | 976 | 1810 |
| Guardian Bell | 1352 | 2483 |
| Shield Pup | 1267 | 1371 |
| Base Breaker | 1416 | 3586 |

Buffer vertices include duplicated vertices at normal/UV boundaries and do not represent welded export-vertex counts. All concept counts are below the SAP 1500-triangle ceiling. These are multi-part static concept meshes using five sampled base colors, not consolidated one-material production assets.

Visual review: inspected four-view sheets; corrected the bell activation plaque seating and the Shieldlock paw position. Simplified only tiny switch travel marks to bring the breaker below budget. Dog eye appearance is a new concept proposal inspired by the OnlyModel style (light outer, dark center, no modeled catchlight); exact source-eye geometry, contact and contour validation have not been performed.

PASS: local render, shared clean/wire geometry, concept triangle measurement, source-code syntax. NOT CHECKED: Blender geometry QA, mounting audit, nonmanifold/normals/UV analysis, atlas material/UV packing, production export/reimport, actual game integration. Blender runtime remains unavailable as documented in CONCEPT-NOTES.md. No claim of production readiness.

Web: Khóa Base tab contains the new Shieldlock sheet expanded, the three alternatives collapsed, with each wireframe separately expandable. The earlier Pawlock remains available. Existing item-interaction prototype remains the same.

Reproduce: `node outputs/base-lock/render-concept.cjs shieldlock bell dog breaker`. Source variants: assets/base-lock-variants.js.
