# Boon's Home Bar

Boon's Home Bar is a zero-dependency, browser-based portal for managing a home-bar inventory and browsing cocktails, mocktails, and shots. This guide describes the current app and the practical workflows for running and maintaining it, especially updating inventory and recipes.

## Run the portal

The app is a static site with no build step or package installation.

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). You can also open `index.html` directly in a browser, though serving it locally gives a more representative environment.

## Update inventory

Built-in inventory data lives in `js/data.js`. The app saves each user's current inventory in browser storage, so changing a default item does not automatically replace their saved stock choices. Use the versioned override mechanism to apply intended changes to existing browsers without wiping their unrelated edits.

### Change stock for an existing item

1. Find the item's stable `id` in `DEFAULT_INVENTORY` and check its existing override in `INVENTORY_UPDATE_OVERRIDES`.
2. Use the inventory patcher to update or add the override. It preserves existing override fields and updates `INVENTORY_LAST_UPDATED` and `INVENTORY_SYNC_VERSION` for you. Pass all fields for one item in the same command:

   ```bash
   node .agents/skills/cocktail-bar-manager/scripts/patch-inventory.js \
     --id "tanqueray-gin" inStock=true incoming=false quantity=1 unit=bottle
   ```

3. Update the item's entry in `DEFAULT_INVENTORY` too when the new values should apply to fresh installs or a manual reset.
4. Review recipes that use the item, then run the validation commands below.

The override only changes the fields it lists. This preserves the user's other saved choices. Never reuse a sync version: each browser applies a given version's overrides only once. Use `INVENTORY_UPDATE_REMOVE_IDS` when an item is being removed and should not return as a custom item in older saved inventories.

### Add a new bottle or ingredient

1. Add an item to `DEFAULT_INVENTORY` with a unique, stable `id`, display `name`, valid `category`, `subCategory`, stock fields, quantity, unit, notes, and ABV when applicable. Follow nearby entries for the full schema.
2. Add its ID to the appropriate `INGREDIENT_GROUPS` entry if recipes can use it as an interchangeable option (for example, gin, rum, tequila, or sake).
3. If existing users should receive its initial stock state, add an override with the patcher. For a new ID, the patcher creates the override and bumps `INVENTORY_SYNC_VERSION` and `INVENTORY_LAST_UPDATED`:

   ```bash
   node .agents/skills/cocktail-bar-manager/scripts/patch-inventory.js \
     --id "new-bottle-id" inStock=true incoming=false quantity=1 unit=bottle
   ```

   When changing defaults or removal IDs without using the patcher, update the date and sync version manually.
4. Review whether existing recipes should reference it and whether it unlocks useful recipes.
5. Run validation and inspect the inventory and recipe availability in the app.

Use `premium: true` for Reserve bottles that are rare, costly to replace, or worth preserving for their distinctive profile. Set `refrigerate` to `"must"` for perishables, `"preferred"` for quality or serving temperature, and omit it or use `false` when no guidance is needed.

## Update recipes

Built-in recipes live in `DEFAULT_DRINKS` in `js/data.js`. Keep recipe edits there so catalog data remains in one place.

1. Give each recipe a unique, stable `id`, a name, and the correct category (`Cocktail`, `Mocktail`, or `Shot`).
2. For each ingredient, provide clear `amountOz` and `amountMl` measurements, a human-readable `item`, and an `inventoryId` that matches an ID in `DEFAULT_INVENTORY`.
3. Add `ingredientGroup` when equivalent bottles can satisfy the ingredient. Ensure all IDs in that group exist in inventory.
4. Include preparation instructions, glassware, base spirit, taste profile, difficulty, `bestMoment`, and useful tags. Update `"in-stock"` tags when appropriate; availability is also calculated from current inventory.
5. Use `preferNonPremium: true` when strong modifiers are likely to mask a Reserve spirit and an everyday alternative exists. Leave it unset for spirit-forward or delicate drinks where the spirit is the focus.
6. Check affected recipes in the portal and run the validation commands below.

Every drink's `bestMoment` should help the user decide whether it suits the moment. Mention a fitting occasion or time, the mood it suits, and how to serve or savor it. Tie the suggestion to the drink's actual flavor and method: for example, a lively sparkling drink for a warm afternoon should be served before it loses its bubbles, while a spirit-forward drink may suit a quiet evening and slow sipping. Keep practical technique, ingredient variants or substitutions, and any verified history in `proTip`; use separate paragraphs so the detail view can present them in labeled sections. Avoid inventing historical claims.

Choose glassware that fits the finished serving, including ice, foam, and garnish. List the best default vessel first and keep alternatives practical. The recipe detail view shows typical capacity ranges from `getGlasswareCapacity()` in `js/recipe-utils.js`; treat them as estimates because different glass designs have different brim capacities. Planning ranges include Nick & Nora 120–180 ml; coupe 150–220 ml; rocks 180–300 ml (double rocks 300–400 ml); highball 250–350 ml; Collins 300–410 ml; flute 150–240 ml; wine/Copa 350–500 ml; hurricane/Tiki 400–600 ml; shot 30–60 ml; and shooter 60–90 ml. Keep the drink-card SVG in `js/app.js` matched to the primary vessel, and show paired glassware when a drink uses a chaser or separate shot glass.

When adding or changing a recipe ingredient, verify its `inventoryId`, ingredient group, substitute text, measurements, and preparation method together. Do not change an inventory ID casually; recipes, groups, saved stock, and migration rules may refer to it.

## Guided drink journeys

The **Drink Journeys** section offers 1–5-course plans and an open-ended tasting path, tailored by occasion and newcomer or experienced-drinker guidance. Occasion profiles and journey stages live in `js/drink-journeys.js` and reference recipes by stable ID from `DEFAULT_DRINKS`. Keep each stage purposeful, quick occasions concise, and the open-ended route paced with a zero-proof reset and optional close. Party suggestions should support group-scaled punch or bowl serves, include a zero-proof option, and make any coordinated shot toast optional and measured. Truth or Dare game suggestions should be distinctive, easy to build, and use accessible ingredients; game rules must allow passing or swapping prompts, and drinks are optional, never a forfeit or reward. Comfort guidance should offer alcohol-free choices and avoid presenting alcohol as a response to distress. Never design a path to encourage passing out or blacking out. Wind-down and party suggestions may include balanced alcoholic drinks with standard serves, pacing, water, and food. Spirit-forward recommendations can emphasize bold flavor, but should never aim to maximize alcohol intake.

## Verify changes

Run these checks from the repository root after editing inventory, recipes, or app code:

```bash
# Check JavaScript syntax for the app's browser scripts.
node -e '
const fs = require("fs"), vm = require("vm");
for (const file of [
  "js/data.js", "js/app-storage.js", "js/app-backup.js", "js/inventory-store.js",
  "js/ui-utils.js", "js/recipe-utils.js", "js/drink-catalog.js", "js/drink-journeys.js", "js/inventory-admin.js",
  "js/drink-modal.js", "js/app-state.js", "js/modal.js", "js/app-events.js", "js/app.js"
]) new vm.Script(fs.readFileSync(file, "utf8"), { filename: file });
console.log("JavaScript syntax valid");
'

# Check inventory, recipe, and ingredient-group data.
node scripts/validate-data.js

# Check whitespace errors in changed files.
git diff --check
```

For a browser smoke check, start the local server, load the portal, open the inventory and recipe views, and confirm the edited item or recipe appears with the expected stock availability. Stop the server with Ctrl-C when finished.

## How user data works

Inventory, custom recipes, tried/constructed progress, measurement preference, theme, and filter display preference are stored in the browser. Storage access goes through `js/app-storage.js`; if browser storage is blocked or full, the app continues with a session-only in-memory fallback and announces that changes may not persist. In Inventory Admin, **Export Full Backup** downloads inventory, custom recipes, progress, and preferences as JSON. **Import Backup** accepts that versioned format and older inventory-only JSON arrays. Legacy inventory imports leave recipes, progress, and preferences unchanged.

## Current code layout

- `index.html` — page structure, dialogs, navigation, and browser script loading order.
- `css/style.css` — responsive layout, components, and themes.
- `js/data.js` — built-in inventory, ingredient groups, migration overrides, and recipes.
- `js/app.js` — app startup, orchestration, catalog rendering, and persistence coordination.
- `js/app-storage.js`, `js/inventory-store.js`, `js/app-backup.js` — guarded persistence, inventory loading/migration, and backup format handling.
- `js/drink-catalog.js`, `js/drink-journeys.js`, `js/drink-modal.js`, `js/inventory-admin.js` — catalog operations, guided tasting plans, recipe details, and inventory/admin workflows.
- `js/app-state.js`, `js/app-events.js`, `js/modal.js`, `js/ui-utils.js`, `js/recipe-utils.js` — shared UI state, event wiring, modal behavior, rendering helpers, and recipe calculations.
- `scripts/validate-data.js` — data-integrity checks for inventory, groups, and recipes.
