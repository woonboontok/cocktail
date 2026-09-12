# Boon's Home Bar

A polished, browser-based cocktail guide and personal home-bar inventory manager. Browse curated cocktails, mocktails, and shots; see which recipes your current stock can make; and keep quantities, notes, and backups for every item on your shelf.

## Highlights

- 126 built-in recipes: 78 cocktails, 22 mocktails, and 26 shots
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

## Updating the inventory

Inventory maintenance uses one data file: `js/data.js`. Edit the data there, increment the sync version, and the app will migrate existing browser storage without deleting custom items or unrelated quantities.

### Quick update checklist

1. Edit or add the item in `DEFAULT_INVENTORY`.
2. Update `INVENTORY_LAST_UPDATED`.
3. Increment `INVENTORY_SYNC_VERSION`, for example from `20260912_1` to `20260913_1`.
4. Add the saved-browser change to `INVENTORY_UPDATE_OVERRIDES` when needed.
5. Run the validation commands below, then commit and push `main`.

The inventory page displays `INVENTORY_LAST_UPDATED` so users can see when the default stock information was last reviewed.

### Inventory item fields

- `id`: stable unique key used by recipes and browser storage
- `name`: product or ingredient name shown in the UI
- `category`: such as `spirits`, `liqueurs`, `fortified`, `sparkling`, or `fresh_garnishes`
- `subCategory`: product type, such as `Rum › White` or `Fresh Citrus & Herbs`
- `inStock`: whether it is currently on hand
- `incoming`: true for items ordered but not yet received
- `quantity`: stock count
- `unit`: bottle, fruit, carton, pack, and so on
- `abv`: numeric alcohol by volume for alcoholic products
- `notes`: optional usage or style notes

Use a stable ID because recipes refer to it through `inventoryId`. If an ID changes, update every matching recipe reference.

### Add or update an item

```js
{ id: "brand-item-name", name: "Brand Item Name", category: "spirits", subCategory: "Rum › White", inStock: true, abv: 37.5, quantity: 1, unit: "bottle", notes: "Short note about use or style." }
```

For fresh produce, record the actual purchase unit:

```js
{ id: "fresh-limes", name: "Fresh Limes (Juice & Wheels)", category: "fresh_garnishes", subCategory: "Fresh Citrus & Herbs", inStock: true, quantity: 1, unit: "fruit", notes: "Fresh purchase." }
```

For incoming bottles, use `inStock: false`, `incoming: true`, and a quantity of `1`.

### ABV sourcing

Prefer the producer’s official product page, brand factsheet, or verified distillery/winery technical sheet. Store the exact ABV as a number, such as `40`, `47.3`, or `75.5`.

### Saved-browser synchronization

The app stores live inventory in `localStorage`, so changing `DEFAULT_INVENTORY` alone does not overwrite an existing browser’s stock choices. `INVENTORY_UPDATE_OVERRIDES` is the one-time migration list for changes that should reach saved inventories.

```js
const INVENTORY_SYNC_VERSION = "20260913_1";

const INVENTORY_UPDATE_OVERRIDES = {
    "fresh-limes": { inStock: true, quantity: 1, unit: "fruit" },
    "new-bottle": { inStock: true, quantity: 1, unit: "bottle" }
};
```

When the version changes, each browser applies the overrides once. Existing custom items and unrelated saved quantities are preserved. Never reuse an old version after changing the override list; create a new version instead.

To restore the complete defaults manually, use **Inventory Admin → Reset Inventory to Defaults**. Export a backup first if the current browser inventory must be preserved.

### Validate and publish

From the project directory, run:

```bash
node --check js/app.js
node --check js/data.js
git diff --check
```

Then refresh the app and check the inventory date, item status, ABV column, and “Can I Make It?” results. Publish with:

```bash
git add js/data.js js/app.js README.md
git commit -m "Update inventory"
git push origin main
```

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
