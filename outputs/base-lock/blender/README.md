# Trụ Khóa Huy Hiệu Khiên — Blender model

Created in the user's open Blender 5.3.0 session and saved as Lockshield.blend. The original open scene was empty; a snapshot is before-lockshield.blend. The unrelated default Collection is preserved. The model remains selected and framed in material view in the live window.

## Asset

- Collection: COL_Lockshield / COL_Lockshield_GEO
- Mesh: SM_Lockshield; 14 named component vertex groups
- 1,316 actual triangles; 686 vertices; 1 mesh; 1 material
- Size: 0.7317 × 0.7317 × 1.2 m; origin on ground
- Blender axes: front −Y, up +Z
- Static, no rig or animation. No FBX requested or produced.
- UVChannel_1; real surface islands grouped by four exact atlas colors
- Unchanged AllPets.png, 2048×2048 RGBA, packed and also stored beside .blend
- Atlas SHA-256: c58e12d35117fa3b4e02e1534dc46b3d99ff9d2f6986cb6f063299e231560b86

## Fidelity

Derived directly from the approved Lockshield concept geometry, not regenerated from an image. Original lock housing, U-shackle, cream face, shield badge and plinth silhouette retained. Converted concept front +Z/up +Y to Blender front −Y/up +Z, scaled uniformly to 1.2 m. Final count increased from 1,228 to 1,316 by closing the shackle ends and adding invisible backing/thickness to the blue shield face and keyhole details. Surface colors are exact AllPets samples, with one atlas material.

## Validation

PASS: bundled SAP audit, triangle cap, all-triangle geometry, no boundary/nonmanifold/degenerate faces, consistent outward normals, no detected z-fighting or floating geometry, applied transforms, no collapsed UV triangles. Exact UV clipping check found zero positive-area overlap pairs across all 1,316 UV triangles. Vertex/edge-midpoint/centroid samples all matched expected atlas colors. Flat patch rectangles are verified pixel-by-pixel, with two pixels external padding.

Accepted audit warnings: 23 coincident vertices and 74 back-to-back triangle pairs occur at rigid component interfaces, such as stacked pedestal bands. The 14 shells are intentional mounted closed pieces. These are not a deforming continuous creature mesh. All parts share one object; components were not globally welded across intended rigid joints.

UV density is low because the exact approved colors occur in small flat atlas patches. Islands represent real connected surfaces rather than collapsed points or independent token triangles. The atlas is used for flat base color only; no detail painting or target-game mip/filter acceptance is claimed. Closest interpolation is used in Blender.

Visual review PASS: inspected actual Blender window and four-view color/wire render sheets. Color and real triangle-wire sheets share the exact saved mesh and cameras. Game import, collision, interactions, rigging/animation and FBX round trip: NOT CHECKED / outside this request.

Studio helpers are under COL_Lockshield_STUDIO, hidden in the viewport and excluded from asset counts. The saved file uses packed and relative texture links. Background audit/review runs did not modify the live model.

## Evidence

- audit.json, build-report.json, uv-validation.json
- lockshield-color-sheet.png and lockshield-wire-sheet.png
- color-hero.png / wire-hero.png and matching front/side/back views
- before-lockshield.blend is the untouched initial-scene snapshot

Scripts in this folder document source transfer, atlas patch selection, audit evidence and rendering. Model has not been described as target-game accepted.
