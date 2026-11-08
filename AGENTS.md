# Boon's Home Bar — AI Agent Guide (`AGENTS.md`)

This guide instructs AI coding assistants (Antigravity, Claude, ChatGPT/Codex, Cursor, Copilot, etc.) on the project architecture, data contracts, and operational workflows for **Boon's Home Bar**.

---

## 1. Project Overview

**Boon's Home Bar** is a zero-dependency, vanilla JavaScript single-page application (SPA) for inventory management and cocktail/mocktail recipe matching.

### File Structure & Roles
- [`index.html`](file:///Users/tokwoonboon/workspace/cocktail/index.html): Semantic layout, navigation tabs, modal dialogs, and UI shell.
- [`css/style.css`](file:///Users/tokwoonboon/workspace/cocktail/css/style.css): Responsive styles, mobile navbar, theme definitions, and card layouts.
- [`js/data.js`](file:///Users/tokwoonboon/workspace/cocktail/js/data.js): **Single Source of Truth** for inventory catalogs, ingredient groups, and recipe databases.
- [`js/app.js`](file:///Users/tokwoonboon/workspace/cocktail/js/app.js): State management, stock calculations, filtering, dynamic rendering, and `localStorage` synchronization.

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
  refrigerate: false,  // Set true for perishables, vermouths, fortified wines, syrups, dairy, and juices
  notes: "..."
}
```

#### Reserve & Refrigeration Rules for Inventory:
- **`premium: true` (✦ Reserve Tag)**:
  - Reserve status is primarily about scarcity and replacement cost: use it for spirits that are rare, difficult to replace, or significantly more expensive than everyday alternatives. As a rule, the bottle should meet at least two signals: rarity/scarcity, high replacement cost, or a distinctive complex profile worth sipping and preserving. Craft, age, or brand prestige alone does not qualify a bottle.
  - Examples include *The Botanist Islay Dry Gin*, *Monkey 47 Dry Gin*, *Código 1530 Reposado Cristalino*, *Otard XO Gold Cognac*, and *Mount Gay Black Barrel*.
  - Renders the `✦ Reserve` badge in the inventory table.
  - The badge identifies a bottle worth protecting; recipe-level `preferNonPremium` decides when a drink's other ingredients would overpower it. Do not confuse “good in a spirit-forward drink” with the reason a bottle qualifies as Reserve.
- **`refrigerate: true` (❄ Refrigerate Tag)**:
  - Must be set on all vermouths (*Martini Extra Dry*, *Martini Rosso*), aperitifs/amari with wine bases (*Lillet Blanc*, *Aperol*, *Campari*, *Amaro Nonino*), syrups (*simple*, *demerara*, *agave*, *orgeat*, *honey*), dairy/creams, fresh citrus/herbs, opened juices, and carbonated sodas/tonics/ginger beers/beers (where <6 are kept chilled in fridge for effervescence & temperature control).
  - Renders the snowflake icon badge in the inventory table.

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
  difficulty: 1,        // 1 to 3 scale
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
- Always link each ingredient to a valid `inventoryId` (matching an `id` in `DEFAULT_INVENTORY`).
- If variants exist (e.g. swapping base spirits), document them in `proTip` and assign an `ingredientGroup`.
- If the cocktail can now be made with in-stock bottles, include `"in-stock"` in the `tags` array.
- Preparation tools are inferred dynamically via `getDrinkTools(drink)` in `js/app.js` (including automatically adding a **Bottle opener** for drinks featuring bottled carbonated mixers like Chang Soda Water, Chang Lime Soda, Fever-Tree Tonic Water, and ginger beers).

---

## 4. Verification & Quality Checklist

Before completing any task, run these checks:

```bash
# 1. Syntax check
node -e "
const fs = require('fs'), vm = require('vm');
new vm.Script(fs.readFileSync('js/data.js', 'utf8'));
new vm.Script(fs.readFileSync('js/app.js', 'utf8'));
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
