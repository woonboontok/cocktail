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

## Updating the inventory

The default stock list lives in the `DEFAULT_INVENTORY` array inside `js/data.js`. This is the source of truth for what appears in the inventory glossary and stock filters.

### 1) Edit the correct inventory list
Open `js/data.js` and find the `DEFAULT_INVENTORY` array near the top of the file.

Each inventory item is an object with fields like:

- `id`: unique key used throughout the app
- `name`: the brand and product name shown in the UI
- `category`: one of the bar categories such as `spirits`, `liqueurs`, `fortified`, `sparkling`, or `mixers_sodas`
- `subCategory`: product type, for example “Rum › White” or “Herbal & Botanical”
- `inStock`: whether it is currently on hand
- `incoming`: true for bottles already ordered but not yet received
- `quantity`: stock count
- `unit`: bottle, carton, can, etc.
- `abv`: alcohol by volume value, usually a number such as `40` or `37.5`
- `notes`: optional notes used in the inventory cards and admin view

### 2) Add or update an item correctly
Use this pattern when adding or updating a bottle:

```js
{ id: "brand-item-name", name: "Brand Item Name", category: "spirits", subCategory: "Rum › White", inStock: true, abv: 37.5, quantity: 1, unit: "bottle", notes: "Short note about use or style." }
```

For incoming bottles, use:

```js
{ id: "brand-item-name", name: "Brand Item Name", category: "spirits", subCategory: "Rum › White", inStock: false, incoming: true, quantity: 1, unit: "bottle", abv: 52, notes: "Incoming purchase." }
```

### 3) Keep the ABV aligned to official product data
When changing bottle ABV, prefer the brand’s official product page or a trusted official publication from the producer. Common examples include:

- producer product page
- brand factsheet
- verified distillery or winery technical sheet

If the product page lists an official ABV in the bottle/specification section, use that exact figure. For generic shopping-list items, match the standard producer ABV for the bottle style you are cataloguing (for example, classic London Dry Gin at 47.3% or standard Green Chartreuse at 55%).

Keep the value in the `abv` field as a plain number such as `40`, `47.3`, or `75.5`.

### 4) Refresh the saved browser inventory if needed
Because the app stores the live inventory in browser local storage, the inventory may persist between edits. If you want to reset everything to the latest defaults:

1. Open the app in the browser.
2. Go to the admin/inventory view.
3. Use the reset or import/export tools as needed.
4. Or clear browser storage for the site if you want a clean reset.

### 5) Validate after editing
After updating the inventory data, refresh the browser and check:

- the inventory glossary shows the updated item names
- the ABV column displays the right values
- the stock status is correct
- the “can I make it?” calculations reflect your current stock

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
