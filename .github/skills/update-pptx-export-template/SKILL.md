---
name: update-pptx-export-template
description: Update the static PowerPoint/PPTX export template for the webslides deck. Use only when the user explicitly asks to update, sync, customize, or fix the PowerPoint export, PPTX export, static export template, or scripts/export-pptx.mjs. Do not use for ordinary slide add/edit/delete/demo work.
---

# Update the PPTX exports

The web deck is the source of truth for presenting and iterating. PowerPoint has
two local export artifacts:

- **Editable export**: `scripts/export-pptx.mjs` writes
  `exports/webslides.pptx`. This is a separate, hand-built editable template and
  does not automatically mirror every React slide.
- **Image-based export**: `scripts/export-pptx-img.mjs` writes
  `exports/webslides-img.pptx`. This renders the live web deck into full-slide
  images, so it should match the current web slides but is not editable as
  native PowerPoint objects.

The development export UI saves these artifacts under `exports/`. The production
export UI downloads the same files to the user's system from temporary server
artifacts instead of writing to `exports/`.

This skill exists so PPTX parity work happens only when the user explicitly asks
for it. Unless the user scopes the request to one variant, update/generate both
PowerPoint artifacts.

## When to use this skill

Use this skill for requests like:

- "Update the PowerPoint export to match this slide."
- "Fix the PPTX export template."
- "Add this slide to the static PowerPoint export."
- "Change `scripts/export-pptx.mjs`."
- "Use the PPTX export skill."

Do **not** use it for normal deck edits such as adding, editing, deleting,
theming, or integrating web slides. In those workflows, leave
`scripts/export-pptx.mjs`, `scripts/export-pptx-img.mjs`, and `exports/` alone.

## Phase 1 — Scope the static export change

- Confirm which web slide(s), deck order, visual changes, or export-specific
  issue should be reflected in PowerPoint.
- Inspect the corresponding React slide(s) and `src/Presentation.tsx` only to
  understand the intended content and order.
- Inspect `scripts/export-pptx.mjs` to find the matching helper or slide
  function. The file may intentionally render a curated subset of the web deck;
  do not assume every web slide needs a PPTX counterpart.
- Inspect `scripts/export-pptx-img.mjs` only if the image-based export itself is
  broken. Normal parity updates should not require editing it because it renders
  the live web deck.

## Phase 2 — Update only the export template

- For **Editable export**, edit `scripts/export-pptx.mjs` surgically:
  update the relevant static slide function, helper, theme constant, metadata,
  or function call order.
- If adding a new static slide, add one clearly named slide function and call it
  in the intended order near the bottom of the file.
- Keep the PPTX layout at `WEB_WIDE` unless the user explicitly asks to change
  the deck aspect ratio.
- Reuse existing helpers (`addHeader`, `addRoundRect`, `addCardText`,
  `addButton`, etc.) before adding new drawing primitives.
- Do not edit React slide code just to make the static export easier.
- For **Image-based export**, do not hand-edit slide content in
  `scripts/export-pptx-img.mjs`; keep it as the renderer that captures the live
  web deck. Only change this script when the image export pipeline itself needs
  a fix.
- Do not commit generated files from `exports/`.

## Phase 3 — Generate and verify both artifacts

- Run `npm run export:pptx` to generate the editable artifact
  `exports/webslides.pptx`.
- Run `npm run export:pptx-img` to generate the image-based artifact
  `exports/webslides-img.pptx`.
- If the change touches TypeScript or shared app code too, run `npm run build`.
- Open or inspect both generated artifacts enough to catch missing text, wrong
  slide order, or obvious layout regressions. The editable artifact should
  preserve PowerPoint objects; the image-based artifact should visually match
  the live web deck as flattened slide images.
- Leave `exports/` uncommitted; generated local artifacts are private by default.

## Handoff

Tell the user what changed in the editable PowerPoint template, whether
both artifacts were regenerated, and whether each now matches the requested web
slide(s). If the editable PPTX remains intentionally curated rather than 1:1
with the web deck, say that plainly.
