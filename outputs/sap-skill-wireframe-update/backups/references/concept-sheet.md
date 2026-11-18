# Mandatory pet concept sheet

**Primary color source:** new pet concepts use base colors selected from the actual bundled AllPets.png by default. Keep its image unchanged and use its sampled colors for concept swatches; another image/generated palette requires explicit user instruction. See [supplied-atlas.md](supplied-atlas.md).

The user explicitly requested this format for each new pet plan. Visual source: `../assets/concept-template.png`, the supplied Snowglobe Puffer concept board.

## Layout

- One pet per landscape sheet, using the reference's dark charcoal background, thin lavender graphic accents and white italic headings.
- Top: pet name prominently, a smaller theme subtitle, and the Free Fire / Craftland header treatment as shown in the supplied reference. Do not label the concept as officially approved.
- Left: a large full-body 3/4 hero view occupying the main area, labeled `3/4 Hero View`.
- Right: three smaller views stacked vertically, labeled `Front`, `Side`, `Back`. Show an actual side profile and an actual rear view, not three alternate front angles.
- Bottom left: `Color Palette` with the actual base colors used by this pet. Swatch count follows the design; do not force five or six colors, add unused colors, or omit functional colors merely to fit the layout.
- Keep the entire pet visible in every panel, with readable labels and sufficient margins.

## Consistency and scope

All four views depict the same approved design: matching proportions, limb counts, hair shapes, face placement, accessories and color boundaries. The hero view can use expressive posing; technical views should show anatomy clearly in a relaxed neutral pose. Preserve handedness and asymmetric features between views.

## Palette accuracy — mandatory

The user requires the palette to match the model accurately. Establish one shared color specification for the character and its swatches, using exact sRGB HEX/RGB values and part assignments. Include every intentional base color, including eye, mouth interior, tongue, accessory and marking colors when present. Never add a swatch solely to decorate the board. A cyan or navy swatch must correspond to an actual region of the character.

For an existing 3D model, derive the palette from actual material base colors or used texture/palette cells, not from a beauty-render screenshot. For a concept before modeling, record its approved color specification and use those exact values when building the model and texture. Do not claim an existing model was color-validated when only a generated concept image exists.

Distinguish albedo/base color from lighting: highlights, shadows, ambient occlusion and reflections do not become additional palette colors. Gradients or translucent materials require explicit endpoints/material notes where used. Check all four views for the same color assignments.

An image-generation prompt alone does not prove exact numeric color fidelity. Visually compare the output character and swatches against the shared color specification, correct mismatches before approval, and report numeric matching only when checked from actual asset data. If exact swatch values are required on a delivered board, generate or overlay the swatches deterministically from the specification using an appropriate graphics workflow rather than guessing colors from shaded pixels.

Use this as a presentation template, not a requirement for every pet to be a puffer fish, snowglobe, transparent creature or faceted crystal sculpture. Retain the approved individual concept, OnlyModel pet shape language, smooth shading and the current maximum of 1500 final triangles. Images are visual targets, not proof of measured topology.

When asked to plan several pets, the roster can be summarized in a table first; each individual concept must use this sheet format. Generate visual sheets with the available image-generation tool when images are requested; use the template image as layout reference and the chosen pet image as identity reference. Do not silently replace all sheets with a multi-pet lineup. New user instructions may override the layout.
