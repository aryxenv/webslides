# Webslides template

React + Vite + Tailwind starter for building slide decks as web applications. Each slide can be a self-contained mini-app while sharing the presentation UI system in `src/components/ui`.

Inspired & driven by...

- Github Copilot App "Pick & Polish" feature.
- Powerful models & reasoning of Github Copilot.
- In-slide demos to deliver presentations in a unique & powerful way.

## Run locally

### Client (Presentation)

```pwsh
npm install
npm run dev
```

Open http://localhost:5173.

### Server (Optional)

```pwsh
uv sync
uv run fastapi dev
```

Available at http://localhost:8000 (no config needed - automatically available on client)

## Build and present

Use the browser as the live deck and GitHub Copilot App as the authoring surface.
Start locally, open http://localhost:5173, then ask Copilot for slide, layout,
demo, copy, or theme changes.

Presentation controls:

- **Left / Right arrows** move between slides.
- **Spacebar** cycles interactive states inside the active slide.
- **Swipe** moves between slides on phones.

Repo skills in `.github/skills/` cover common deck work:

- **Add/Edit/Delete slides**: change the story without learning the file layout.
- **Theming**: update palette and account logo.
- **Integrate demo into slides**: map an app into the deck and backend.
- **Update PPTX export**: verify native editable and image PowerPoint exports after slide changes.

## Export and share

| Path             | Use when                                  | Output                                                                |
| ---------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| **Local export** | You need private files                    | `webslides.pdf`, `webslides.pptx`, `webslides-img.pptx` in `exports/` |
| **GitHub Pages** | The deck is public and static             | `https://<owner>.github.io/<repo>/`                                   |
| **Azure**        | The hosted deck needs the FastAPI backend | Two Azure Container Apps                                              |

Local file exports use the footer **Export** menu and require the FastAPI server.
Generated files in `exports/` are ignored by git.
In local development, PowerPoint export endpoints save `exports/` artifacts and
return saved artifact metadata; production download endpoints return the file
response. The editable PowerPoint export generates the private PDF artifact
first, then uses the local `services/editable-pptx/` converter to create an
editable `webslides.pptx` from the rendered web deck without changing the
saved/downloaded response shape. The default `native-editable` mode emits
visible text, cards, boxes, borders, buttons, badges, and simple icons as native
PowerPoint objects and forbids duplicate baked visible text. Complex photos,
canvas/WebGL, and other non-decomposable visuals are bounded raster fallback
regions and are reported. By default, `npm run export:pptx` writes both
`exports/webslides.pptx` and `exports/webslides.pptx.report.json`; the report
includes native object counts, fallback raster counts, fallback area, reasons,
and the editability score. Use
`npm run export:pptx -- --mode debug-fidelity` or
`npm run export:pptx -- --debug-fidelity` only when you need an explicit
emergency raster fallback for visual comparison. The server accepts the same
mode as an optional `/exports/pptx/editable` JSON field; omit it for the default
native editable export. Production download endpoints keep returning only the
file response to preserve the existing API shape.
The image PowerPoint export remains the faithful raster fallback in
`webslides-img.pptx`.

Editable PPTX quality gates run generated native fixtures through package
inspection and report checks:

```pwsh
npm run test:editable-pptx
```

Optional Windows-only desktop PowerPoint smoke (manual, not CI): after
exporting `exports\webslides.pptx`, run this in PowerShell on a machine with
PowerPoint installed. Any repair dialog or export failure means the smoke failed.

```pwsh
$pptx = (Resolve-Path .\exports\webslides.pptx).Path
$pdf = Join-Path (Resolve-Path .\exports).Path 'webslides-powerpoint-smoke.pdf'
$powerpoint = New-Object -ComObject PowerPoint.Application
$deck = $powerpoint.Presentations.Open($pptx, $true, $false, $false)
$deck.ExportAsFixedFormat($pdf, 2)
$deck.Close()
$powerpoint.Quit()
```

Deploy to Azure with:

```pwsh
azd up
npm run azure:url
```

## Project reference

- Slides: `src/components/slides`
- Deck order: `src/Presentation.tsx`
- Shared UI: `src/components/ui`
- Theme tokens: `src/index.css`
- Backend routes: `server/`
