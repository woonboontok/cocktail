# Boon's Home Bar — AI Agent Guide (`AGENTS.md`)

This guide instructs AI coding assistants (Antigravity, Claude, ChatGPT/Codex, Cursor, Copilot, etc.) on the project architecture, data contracts, and operational workflows for **Boon's Home Bar**.

---

## 1. Project Overview

**Boon's Home Bar** is a zero-dependency, vanilla JavaScript single-page application (SPA) for inventory management and cocktail/mocktail recipe matching.

### File Structure & Roles
- [`index.html`](file:///Users/tokwoonboon/workspace/cocktail/index.html): Semantic layout, navigation tabs, modal dialogs, and UI shell.
- [`css/style.css`](file:///Users/tokwoonboon/workspace/cocktail/css/style.css): Responsive styles, mobile navbar, theme definitions, and card layouts.
- [`js/data.js`](file:///Users/tokwoonboon/workspace/cocktail/js/data.js): **Single Source of Truth** for inventory catalogs, ingredient groups, and recipe databases.
- [`js/drink-catalog.js`](file:///Users/tokwoonboon/workspace/cocktail/js/drink-catalog.js): Pure drink filtering, search, and sorting operations, with inventory and state lookups passed in by the app.
- [`js/drink-journeys.js`](file:///Users/tokwoonboon/workspace/cocktail/js/drink-journeys.js): Curated course-by-course tasting journeys for newcomers and experienced drinkers; uses drink IDs and live stock status from the app.
- [`js/inventory-admin.js`](file:///Users/tokwoonboon/workspace/cocktail/js/inventory-admin.js): Inventory glossary and admin rendering and workflows; receives shared app state and services through a context object.
- [`js/drink-modal.js`](file:///Users/tokwoonboon/workspace/cocktail/js/drink-modal.js): Recipe detail rendering, preparation tools, ingredient options, and drink modal interactions; receives app state and services through a context object.
- [`js/app-state.js`](file:///Users/tokwoonboon/workspace/cocktail/js/app-state.js): Shared transient navigation, filter, and unit preference state.
- [`js/app-events.js`](file:///Users/tokwoonboon/workspace/cocktail/js/app-events.js): General page event wiring connected to explicit app and view module actions.
- [`js/app-storage.js`](file:///Users/tokwoonboon/workspace/cocktail/js/app-storage.js): Guarded browser-storage adapter with an in-memory fallback and persistence-failure notification.
- [`js/app-backup.js`](file:///Users/tokwoonboon/workspace/cocktail/js/app-backup.js): Versioned full-app backup validation and legacy inventory-array compatibility.
- [`js/app.js`](file:///Users/tokwoonboon/workspace/cocktail/js/app.js): App orchestration, catalog cards, navigation rendering, and persistence coordination through `app-storage.js`.

---

## 2. Core Data Architecture (`js/data.js`)

Whenever modifying or adding items, follow these strict schemas:

### A. Inventory Constants
```javascript
const INVENTORY_LAST_UPDATED = "15 October 2026"; // Date of last change
const INVENTORY_SYNC_VERSION = "20261015_1";     // Format: YYYYMMDD_N
```
> **CRITICAL**: Whenever `DEFAULT_INVENTORY` or `INVENTORY_UPDATE_OVERRIDES` is updated, **always bump `INVENTORY_SYNC_VERSION` and update `INVENTORY_LAST_UPDATED`**. The app uses `localStorage.getItem("speakeasy_inventory_update_" + INVENTORY_SYNC_VERSION)` to selectively apply new stock overrides without wiping user adjustments.

### B. Inventory Overrides (`INVENTORY_UPDATE_OVERRIDES`)
Keyed by item `id`. Defines live stock flags, quantities, units, and custom notes:
```javascript
"choya-rokkonshojo-sake": {
  inStock: true,
  incoming: false,
  quantity: 1,
  unit: "bottle",
  abv: 15,
  notes: "Choya Rokkonshojo Junmai Ginjo Sake, 15% ABV, 720ml. In stock."
}
```

### C. Ingredient Groups (`INGREDIENT_GROUPS`)
Used to group interchangeable ingredients (e.g., gins, rums, sakes, sweet vermouths):
```javascript
"sake": {
  label: "Sake",
  inventoryIds: ["kawashima-sake", "choya-rokkonshojo-sake"]
}
```
If an ingredient in a recipe specifies `ingredientGroup: "sake"`, the cocktail engine evaluates availability against any candidate item in that group.

### D. Default Inventory Items (`DEFAULT_INVENTORY`)
Schema for items in `DEFAULT_INVENTORY`:
```javascript
{
  id: "drambuie",
  name: "Drambuie (Honeyed Scotch Liqueur)",
  category: "liqueurs", // spirits | liqueurs | fortified | sparkling | mixers_sodas | bitters_syrups | fresh_garnishes
  subCategory: "Herbal & Spice",
  spiritFamily: "Liqueur",
  spiritStyle: "Honeyed Scotch",
  inStock: true,
  incoming: false,
  quantity: 1,
  unit: "bottle",
  abv: 40,
  premium: false,      // Set true for top-shelf / Reserve bottles (e.g. Otard XO, Monkey 47, The Botanist, Codigo Cristalino)
  refrigerate: false,  // false | "preferred" | "must"
  notes: "..."
}
```

#### Reserve & Refrigeration Rules for Inventory:
- **`premium: true` (✦ Reserve Tag)**:
  - Reserve status is primarily about scarcity and replacement cost: use it for spirits that are rare, difficult to replace, or significantly more expensive than everyday alternatives. As a rule, the bottle should meet at least two signals: rarity/scarcity, high replacement cost, or a distinctive complex profile worth sipping and preserving. Craft, age, or brand prestige alone does not qualify a bottle.
  - Examples include *The Botanist Islay Dry Gin*, *Monkey 47 Dry Gin*, *Código 1530 Reposado Cristalino*, *Otard XO Gold Cognac*, and *Mount Gay Black Barrel*.
  - Renders the `✦ Reserve` badge in the inventory table.
  - The badge identifies a bottle worth protecting; recipe-level `preferNonPremium` decides when a drink's other ingredients would overpower it. Do not confuse “good in a spirit-forward drink” with the reason a bottle qualifies as Reserve.
- **`refrigerate: "preferred"` or `"must"` (❄ Refrigerate Tag)**:
  - Use `"must"` for perishables that spoil without cold storage, including fresh citrus/herbs, dairy, and opened fresh juices.
  - Use `"preferred"` for quality and serving temperature, including vermouths, aperitifs/amari with wine bases, syrups, and carbonated sodas/tonics/ginger beers/beers.
  - Use `false` or omit the field when no refrigeration guidance is needed. Legacy saved values `true` and `false` are accepted and normalized when loaded.

### F. Browser Storage and Backups
- Route browser storage reads, writes, and removals through `js/app-storage.js`; do not access `localStorage` directly from app modules.
- The adapter keeps writes in memory if browser storage is blocked or full and announces that they will not survive the current session.
- Inventory Admin full backups use format `boons-home-bar-backup`, version `1`, and include inventory, custom recipes, tried/constructed progress, unit preference, theme, and filter-collapse preference.
- Keep import compatibility for legacy inventory-only JSON arrays. Importing one must leave recipes, progress, and preferences unchanged.

### E. Cocktail & Drink Recipes (`DEFAULT_DRINKS`)
Schema for recipes:
```javascript
{
  id: "saketini",
  name: "Saketini",
  otherNames: "Japanese Sake Martini",
  category: "Cocktail", // Cocktail | Mocktail | Shot
  baseSpirit: "Gin",    // Gin | Rum | Whiskey | Whiskey/Bourbon | Tequila/Mezcal | Vodka | Brandy | Liqueur/Wine | Non-Alcoholic
  glassware: "Martini / Nick & Nora",
  alcoholLevel: "High (~28% ABV)",
  alcoholScore: 4,      // 1 to 5 scale
  tasteProfile: "Delicate, Silky Rice Umami, Crisp Botanical & Clean",
  bestMoment: "Best for a calm evening ... Serve very cold and sip slowly as the aromas open.",
  difficulty: 1,        // Integer from 1 to 5
  popularity: 9.3,      // Out of 10
  proTip: "...",
  ingredients: [
    {
      amountOz: "2.5 oz",
      amountMl: "75 ml",
      item: "Tanqueray London Dry Gin",
      substitute: "The Botanist Islay Dry Gin",
      inventoryId: "tanqueray-gin",
      ingredientGroup: "gin",
      preferNonPremium: false // Set true if high-sugar/cream/mixer modifiers would overpower a Reserve spirit
    }
  ],
  instructions: [
    "Step 1...",
    "Step 2..."
  ],
  tags: ["gin", "sake", "martini", "in-stock"]
}
```

Every built-in drink must include a non-empty `bestMoment`. Write it to help someone choose a drink for the moment: mention a fitting occasion or time, the mood it suits, and how to serve or savor it (for example, a sunny lunch with friends; serve immediately while sparkling, or a quiet after-dinner sip; enjoy slowly as the aromas open). Make the note specific to the drink's flavor profile and preparation. Avoid generic claims or unsupported historical trivia; put verified history and drink variants in `proTip`.

#### Preserving Reserve Spirits in Drink Recipes (`preferNonPremium: true`):
- When a recipe has an `ingredientGroup` that includes both everyday workhorse spirits and `premium: true` reserve spirits (for instance, `gin` containing both *Tanqueray* and *Monkey 47* / *The Botanist*; or `tequila` containing both *Teremana Blanco* and *Código 1530 Cristalino*):
  - **Set `preferNonPremium: true`** when the recipe's strong modifiers are likely to waste or mask the rare spirit's flavor and an everyday alternative is available. Common examples are heavy syrup or liqueur, cream, large amounts of fruit juice, cola, intense spice, or several competing spirits. Drinks such as Long Island Iced Tea, Singapore Sling, Tom Collins, Brandy Alexander, Alabama Slammer, Flatliner, Barbados Rum Punch, Monkey Gland, Floradora, Ramos Gin Fizz, Peach Sake Fizz, Sake Bomb, Tonight Not Going Home (including its shot), and heavily sweetened tiki mixes are common cases.
  - **Do NOT set `preferNonPremium: true`** (leave falsy) on spirit-forward, dry, or delicate cocktails where the reserve spirit is the deliberate star of the show (e.g., Martini, Obituary Cocktail, Saketini, French 75, classic sour riffs).
  - When `preferNonPremium: true` is set, the UI modal displays an advisory badge on reserve options: *“Save for cocktails where it can shine — the modifiers in this recipe tend to mask its complexity.”*

---

## 3. Workflow for Common Tasks

### 1. Adding Newly Received / Purchased Bottles
1. Check if the bottle already exists in `DEFAULT_INVENTORY` (either marked `inStock: false` or `incoming: true`).
2. Update its entry in `DEFAULT_INVENTORY`: set `inStock: true`, `incoming: false`, add package size/ABV notes.
3. Update or add its entry in `INVENTORY_UPDATE_OVERRIDES` with `inStock: true, incoming: false, quantity: N, unit: "bottle"`.
4. If it belongs to an ingredient category (e.g. tequila, gin, sake), ensure its `id` is present in the appropriate `INGREDIENT_GROUPS` entry.
5. Update `INVENTORY_LAST_UPDATED` and bump `INVENTORY_SYNC_VERSION`.
6. Inspect drinks that can now be made or updated (e.g., swapping out generic substitutes for real bottles like Drambuie or Amaro Nonino).
7. If applicable, add classic or modern cocktails unlocked by the new bottle to `DEFAULT_DRINKS`.

### 2. Updating Cocktails or Recipes
- Use clear ratios in both ounces (`amountOz`) and millilitres (`amountMl`).
- Include a tailored `bestMoment` for every new or revised drink: an occasion, a mood, and a serving or savoring cue. This appears as the **Best enjoyed when** card in the recipe detail view.
- Use `proTip` for practical technique, useful ingredient substitutions or variants, and a short verified backstory where one is known. Keep separate ideas in separate paragraphs; the modal presents them in labeled sections.
- Always link each ingredient to a valid `inventoryId` (matching an `id` in `DEFAULT_INVENTORY`).
- If variants exist (e.g. swapping base spirits), document them in `proTip` and assign an `ingredientGroup`.
- Choose `glassware` to fit the finished drink's volume plus ice, foam, and garnish. Put the best default vessel first; list only practical alternatives. The modal shows approximate vessel capacities through `getGlasswareCapacity()` in `js/recipe-utils.js`. Typical planning ranges: Nick & Nora 120–180 ml; coupe 150–220 ml; rocks 180–300 ml (double rocks 300–400 ml); highball 250–350 ml; Collins 300–410 ml; flute 150–240 ml; wine/Copa 350–500 ml; hurricane/Tiki 400–600 ml; shot 30–60 ml; shooter 60–90 ml. Treat these as guides, not exact product specifications, since capacity varies by glass design. Keep the SVG card visual in `js/app.js` aligned with the primary vessel, including a paired-glass visual when a drink is served in multiple glasses.
- Keep guided tasting plans in `js/drink-journeys.js` aligned with real IDs in `DEFAULT_DRINKS`. Let visitors choose an occasion (for example, unwind, quick drink, refreshing, solo, conversation, celebration, comfort, or spirit-forward tasting) as well as course count and experience level. Each course needs a clear role, and the occasion should change the drink recommendations. Keep quick occasions intentionally short; include zero-proof choices for resets and comfort, and avoid framing alcohol as a remedy for distress or a way to become unconscious. Never design a path to encourage passing out or blacking out. A wind-down path may include balanced alcoholic drinks, but should recommend standard serves, pacing, water, and food. Spirit-forward means flavor intensity with standard serves and pacing, never maximizing alcohol quantity. The Unlimited path should explain its arc instead of listing drinks without progression.
- If the cocktail can now be made with in-stock bottles, include `"in-stock"` in the `tags` array.
- Preparation tools are inferred dynamically via `getDrinkTools(drink)` in `js/drink-modal.js` (including automatically adding a **Bottle opener** for drinks featuring bottled carbonated mixers like Chang Soda Water, Chang Lime Soda, Fever-Tree Tonic Water, and ginger beers).

---

## 4. Verification & Quality Checklist

Before completing any task, run these checks:

```bash
# 1. Syntax check
node -e "
const fs = require('fs'), vm = require('vm');
new vm.Script(fs.readFileSync('js/data.js', 'utf8'));
new vm.Script(fs.readFileSync('js/app.js', 'utf8'));
new vm.Script(fs.readFileSync('js/app-storage.js', 'utf8'));
new vm.Script(fs.readFileSync('js/app-backup.js', 'utf8'));
new vm.Script(fs.readFileSync('js/drink-catalog.js', 'utf8'));
new vm.Script(fs.readFileSync('js/inventory-admin.js', 'utf8'));
new vm.Script(fs.readFileSync('js/drink-modal.js', 'utf8'));
new vm.Script(fs.readFileSync('js/app-state.js', 'utf8'));
new vm.Script(fs.readFileSync('js/app-events.js', 'utf8'));
console.log('JS syntax valid');
"

# 2. Data integrity check (IDs, duplicate keys, groups)
node -e "
const data = require('./js/data.js');
const invIds = new Set(data.DEFAULT_INVENTORY.map(i => i.id));
data.DEFAULT_DRINKS.forEach(d => {
  d.ingredients.forEach(ing => {
    if (ing.inventoryId && !invIds.has(ing.inventoryId)) console.warn('Missing invId:', ing.inventoryId, 'in', d.id);
  });
});
console.log('Integrity check passed');
"

# 3. Test local serving
python3 -m http.server 8089 &
PID=$!; sleep 1; curl -s http://localhost:8089/index.html | head -n 10; kill $PID
```

---

## 5. Git & Deployment Protocol
- Keep commits descriptive: `Update inventory: add [Bottle Name] and adjust [Drinks]`.
- Always verify `git status` and test clean builds before pushing to `origin/main`.
