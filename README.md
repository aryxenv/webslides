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

Use the footer **Export** menu for private files. Local file exports require the
FastAPI server and save ignored artifacts in `exports/`; production exports
download the file.

| Option | Availability | Output or action |
| --- | --- | --- |
| **PDF** | Always | `webslides.pdf` |
| **PowerPoint** | Always | Editable `webslides.pptx` or image `webslides-img.pptx` |
| **GitHub Pages** | Dev only | Publish a public static interactive deck |
| **Azure** | Dev only | Deploy the interactive deck and FastAPI server |

Azure deploys use:

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