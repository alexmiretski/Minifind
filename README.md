# MiniFind

MiniFind is a desktop-first LEGO minifigure collector app prototype inspired by collection apps like Dex. This repository now contains a fully self-contained browser app with no external dependencies, so it can run directly from this empty repo.

## What the app includes

- Desktop-focused dashboard layout.
- Catalog of minifigure cards with images, names, rarity, year, and market price.
- Simulated live price updates every 6 seconds.
- Search across names, series, sets, themes, and tags.
- Filtering by rarity, theme, year, ownership, and folder.
- Ownership toggle for each minifigure.
- Folder creation and deletion.
- Multi-folder assignment, so one minifigure can belong to more than one folder.
- Local persistence with `localStorage`.
- Custom MiniFind logo featuring a realistic minifigure head.

## Run locally

Because the app is fully static, you can run it with any local web server.

### Option 1

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

### Option 2

Just open `index.html` directly in a browser. A local web server is recommended for the cleanest behavior.

## Important product note

This prototype ships with seeded minifigure data and simulated live pricing so the product vision can be reviewed immediately.

To reach the full product goal of showing **all** minifigures in existence with **accurate live market value**, the next iteration should connect the UI to:

- A canonical LEGO/minifigure catalog source.
- A real market pricing feed or scheduled price ingestion pipeline.
- Real hosted minifigure imagery.
- Optional cloud sync and user accounts.
