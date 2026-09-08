# Boon's Home Bar

A polished, browser-based cocktail guide and personal home-bar inventory manager. Browse curated cocktails, mocktails, and shots; see which recipes your current stock can make; and keep quantities, notes, and backups for every item on your shelf.

## Highlights

- 119 built-in recipes: 71 cocktails, 22 mocktails, and 26 shots
- Search, sort, and filter by base spirit, difficulty, flavour profile, and availability
- Detailed recipes with method, glassware, substitutions, pro tips, and both oz/ml measurements
- **Can I Make It?** view that identifies recipes available from the current inventory
- Inventory glossary and admin area for stock status, quantities, custom items, and low-stock checks
- Add and save personal recipe experiments
- Bookmark recipes and mark them as tried or favourites
- Export and import inventory backups as JSON
- Automatic time-of-day themes, with a manual theme selector

## Run locally

This is a dependency-free static site. Clone the repository and open `index.html` in a modern browser:

```bash
git clone <your-repository-url>
cd cocktail
open index.html
```

Or serve it locally (useful if your browser restricts local-file behaviour):

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## How it works

All data stays in the browser. Inventory changes, custom recipes, bookmarks, drink statuses, measurement preferences, and theme preference are stored with `localStorage`. Use **Export Backup** in Inventory Admin before clearing browser data or moving to another device, and **Import Backup** to restore it.

## Project structure

```text
.
├── index.html     # App markup, navigation, dialogs, and forms
├── css/
│   └── style.css  # Responsive speakeasy design and time-based themes
└── js/
    ├── data.js    # Built-in recipes and default inventory
    └── app.js     # Rendering, filtering, inventory, and browser storage
```

## Customising the collection

- Update `DEFAULT_DRINKS` in `js/data.js` to change the curated recipe catalog.
- Update `DEFAULT_INVENTORY` in `js/data.js` to alter the starting bar setup.
- Use **Log Experiment** and **Add New Bottle / Item** in the app for changes that should remain local to a browser.

## Tech

Vanilla HTML, CSS, and JavaScript. No build step, package manager, or server is required.
