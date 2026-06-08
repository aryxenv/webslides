---
name: update-pptx-export-template
description: Update the static PowerPoint/PPTX export template for the webslides deck. Use only when the user explicitly asks to update, sync, customize, or fix the PowerPoint export, PPTX export, static export template, or scripts/export-pptx.mjs. Do not use for ordinary slide add/edit/delete/demo work.
---

# Update the PPTX export template

The web deck is the source of truth for presenting and iterating. The native
PowerPoint export is a **separate, hand-built static template** in
`scripts/export-pptx.mjs`; it does not automatically mirror every React slide.
This skill exists so PPTX parity work happens only when the user explicitly asks
for it.

## When to use this skill

Use this skill for requests like:

- "Update the PowerPoint export to match this slide."
- "Fix the PPTX export template."
- "Add this slide to the static PowerPoint export."
- "Change `scripts/export-pptx.mjs`."

Do **not** use it for normal deck edits such as adding, editing, deleting,
theming, or integrating web slides. In those workflows, leave
`scripts/export-pptx.mjs` and `exports/` alone.

## Phase 1 — Scope the static export change

- Confirm which web slide(s), deck order, visual changes, or export-specific
  issue should be reflected in PowerPoint.
- Inspect the corresponding React slide(s) and `src/Presentation.tsx` only to
  understand the intended content and order.
- Inspect `scripts/export-pptx.mjs` to find the matching helper or slide
  function. The file may intentionally render a curated subset of the web deck;
  do not assume every web slide needs a PPTX counterpart.

## Phase 2 — Update only the export template

- Edit `scripts/export-pptx.mjs` surgically: update the relevant static slide
  function, helper, theme constant, metadata, or function call order.
- If adding a new static slide, add one clearly named slide function and call it
  in the intended order near the bottom of the file.
- Keep the PPTX layout at `WEB_WIDE` unless the user explicitly asks to change
  the deck aspect ratio.
- Reuse existing helpers (`addHeader`, `addRoundRect`, `addCardText`,
  `addButton`, etc.) before adding new drawing primitives.
- Do not edit React slide code just to make the static export easier.
- Do not commit generated files from `exports/`.

## Phase 3 — Verify the static artifact

- Run `npm run export:pptx` to generate `exports/webslides.pptx`.
- If the change touches TypeScript or shared app code too, run `npm run build`.
- Open or inspect the generated artifact enough to catch missing text, wrong
  slide order, or obvious layout regressions.
- Leave `exports/` uncommitted; generated local artifacts are private by default.

## Handoff

Tell the user what changed in the static PowerPoint template and whether it now
matches the requested web slide(s). If the PPTX export remains intentionally
curated rather than 1:1 with the web deck, say that plainly.
