---
name: cocktail-bar-manager
description: >-
  Use this skill when managing the cocktail inventory, updating bottle stock, adding new spirits or liqueurs, adjusting cocktail and drink recipes, refactoring code, or verifying the data integrity of Boon's Home Bar.
---

# Cocktail Bar Manager & System Architecture Skill

This skill guides AI coding assistants through managing the inventory and recipe data, maintaining front-end architecture, and following development standards for **Boon's Home Bar**.

---

## 1. Project Architecture & Contracts

**Boon's Home Bar** is a zero-dependency, vanilla JavaScript single-page application (SPA).

| File | Role | Key Considerations |
|---|---|---|
| [`index.html`](../../index.html) | Semantic shell, modals, static navigation | Uses accessible modal dialogs, responsive nav toggle, SVG icons |
| [`css/style.css`](../../css/style.css) | All styling, 7 dynamic time-of-day themes, CSS grid | Dynamic themes via `data-theme` on `<html>`. Font display: `--font-display`. Accent colors: `--accent-gold`, `--accent-copper`. |
| [`js/data.js`](../../js/data.js) | **Single Source of Truth** for inventory & recipes | Must remain valid ES/CommonJS (consumable by Node.js validation scripts) |
| [`js/app.js`](../../js/app.js) | State machine, stock resolution, rendering engine | Caches core DOM nodes on `init()`, modular helpers hoisted to file scope |

### Core Data Contracts (`js/data.js`)
- `INVENTORY_LAST_UPDATED`: Current date string (e.g. `"22 October 2026"`).
- `INVENTORY_SYNC_VERSION`: Increment this on every inventory update (e.g. `"20261022_1"`).
- `INVENTORY_UPDATE_OVERRIDES`: Live stock flags, quantities, units, and notes mapped by item `id`.
- `INGREDIENT_GROUPS`: Multi-spirit groupings (e.g., `"sake"`, `"tequila"`, `"gin"`, `"amaro"`, `"prosecco"`).
- `DEFAULT_INVENTORY`: Array of full bottle and ingredient definitions.
- `DEFAULT_DRINKS`: Array of cocktail/mocktail/shot recipes.

---

## 2. Inventory Update Runbook

When a user mentions receiving, purchasing, or running out of bottles:

1. **Locate or Add the Inventory Item**:
   - Check if an entry already exists in `DEFAULT_INVENTORY`.
   - If present, set `inStock: true` or `inStock: false` (with `quantity: 0` if depleted), and verify `abv`, `unit`, and bottle size.
   - If new, create an entry with a slugified `id`, descriptive `name`, appropriate `category`, `subCategory`, `abv`, and tasting notes.

2. **Update Overrides & Versioning**:
   - In `INVENTORY_UPDATE_OVERRIDES`, add/update the entry with:
     ```javascript
     "item-id": { inStock: true, incoming: false, quantity: 1, unit: "bottle", abv: ..., notes: "..." }
     ```
   - Bump `INVENTORY_SYNC_VERSION` and update `INVENTORY_LAST_UPDATED`.

3. **Check Ingredient Groups & Reserve Classification**:
   - If the item belongs to an existing spirit family (e.g. sake, tequila, gin, amaro, whiskey, prosecco), ensure its `id` is listed under the matching `INGREDIENT_GROUPS` entry.
   - **Reserve Tag (`premium: true`)**: See Section 3 for strict classification rules.
   - **Refrigerate Tag (`refrigerate: true`)**: Set `refrigerate: true` for perishable items, wine bases, unfortified juice, syrups (vermouths, amari, simple/agave/honey syrups, fresh citrus), and carbonated sodas/tonics/ginger beers/beers (user rotates <6 cans/bottles into the fridge for icy temperature and peak effervescence).

4. **Adjust Cocktails & Preserve Reserve Spirits**:
   - Review cocktails that use the item or previously used substitutes (e.g., Rusty Nail for Drambuie, Paper Plane for Amaro Nonino).
   - If recipes previously pointed to substitute `inventoryId`s, update them to point directly to the newly in-stock bottle.
   - **Preserving Reserve Spirits (`preferNonPremium: true`)**:
     - Follow the strict matrix in Section 3 below.
   - If new classic/signature drinks are unlocked by the addition, add them to `DEFAULT_DRINKS` with dual volume units (`amountOz` & `amountMl`), tags (`"in-stock"`), and helpful `proTip`s.

---

## 3. Reserve Spirit Decision Framework (`✦ Reserve` & `preferNonPremium`)

### A. When to Tag an Inventory Bottle as `premium: true` (✦ Reserve)
Mark `premium: true` on a bottle **ONLY** if it meets at least two of the following criteria:
1. **Exceptional Craft / Foraging / Botanicals**: Artisanal distillation featuring rare or intricate botanicals (e.g., *The Botanist Islay Dry Gin* with 22 hand-foraged Islay botanicals, *Monkey 47* with 47 Black Forest botanicals).
2. **Extended Age Statement / Top-Shelf Classification**: XO, Extra Añejo, or double-cask aged spirits (e.g., *Otard XO Gold Cognac*, *Mount Gay Black Barrel Double Cask Rum*, *Código 1530 Reposado Cristalino*).
3. **High Replacement Cost / Sipping Profile**: Distinct sipping nuance meant to be evaluated neat or in spirit-forward builds rather than used as high-volume well spirits.

#### What NOT to Tag as `premium: true`:
- **High ABV / Overproof alone is NOT premium**: High proof or high ABV (e.g., *Goslings Black Seal 151* at 75.5% ABV, *Topanito Mezcal Artesanal* at 52% ABV, *Jack Daniel's Bonded Rye* at 50% ABV) is a **functional specification** for Tiki floats, flaming serves, or high-proof backbone—not a designation of delicate top-shelf rarity. Goslings 151 is designed specifically as a high-proof utility mixer/float for Zombies and flaming drinks; marking it reserve would discourage its core intended usage.
- **Reliable Workhorse / Well Spirits**: Bottles intended for high-volume, everyday mixing (*Tanqueray London Dry*, *Bacardi Superior*, *Smirnoff Red*, *Jim Beam Black*, *Teremana Blanco*) should remain `premium: false`.

### B. When to Set `preferNonPremium: true` in Drink Recipes
When a drink ingredient references an `ingredientGroup` (e.g., `gin`, `tequila`, `dark-rum`, `brandy-cognac`) that contains both everyday workhorses and `premium: true` bottles:

| Drink Characteristic | `preferNonPremium` Setting | Example Drinks | Rationale |
|---|---|---|---|
| **Heavily modified / Sugary / Creamy / High-Mixer** | **`true`** | Singapore Sling, Long Island Iced Tea, Frangelico Brandy Alexander, Alabama Slammer, Flatliner | Heavy cream, cola, 4 oz fruit juices, or Tabasco completely drown out the delicate botanicals or barrel nuances of reserve bottles. Displays advisory: *"Save for cocktails where it can shine — the modifiers in this recipe tend to mask its complexity."* |
| **Spirit-Forward / Minimal Modifier / Dry Showcase** | **`false` (leave falsy)** | Dry Martini, Saketini, Obituary, Vesper, Classic Gimlet, French 75, Classic Margarita, Paloma, Old Fashioned | The base spirit is the deliberate star of the glass. Reserve spirits elevate the cocktail and should be readily recommended. |

---

## 4. UI & Codebase Patterns (`js/app.js` & `css/style.css`)

When modifying app behavior or styles, adhere to these established patterns:

1. **Shared SVG Constants**: Reusable iconography (like `SNOWFLAKE_SVG`) should be defined at the top of `js/app.js` rather than duplicated inline inside template strings.
2. **DOM Caching**: Primary structural containers (`catalogView`, `glossaryView`, `adminView`, `heroStats`, `drinksGrid`, `resultsCount`) are cached in `DOM` during `init()` to minimize redundant `getElementById` calls across render passes.
3. **Pill Filtering Pattern**: Filter sets (spirit, difficulty, taste) use the shared `setupFilterPills(selector, getter, setter)` helper to maintain uniform active state toggles and reset behaviors.
4. **Theme Awareness**: Use CSS variables for theming (`--bg-primary`, `--bg-card`, `--text-primary`, `--accent-gold`, etc.). Do not hardcode fixed hex colors (like `#fff` or `#f3f4f6`) inside body or card typography, as this breaks contrast in light themes (e.g., Morning theme).
5. **Quantity Updates**: Modifying stock numbers should route through `setItemQuantityDirect(id, newQty)` to ensure `inStock` sync, storage persistence, and header stat updates occur atomically.

---

## 5. Automated Verification & Quality Checklist

Before completing any task, always execute these checks:

```bash
# 1. Syntax check for all JS files
node -e "
const fs = require('fs'), vm = require('vm');
new vm.Script(fs.readFileSync('js/data.js', 'utf8'));
new vm.Script(fs.readFileSync('js/app.js', 'utf8'));
console.log('✓ JS syntax valid');
"

# 2. Data integrity check (IDs, duplicate keys, groups)
node -e "
const data = require('./js/data.js');
const invIds = new Set(data.DEFAULT_INVENTORY.map(i => i.id));
let errors = 0;
Object.entries(data.INGREDIENT_GROUPS).forEach(([grp, def]) => {
  def.inventoryIds.forEach(id => {
    if (!invIds.has(id)) { console.error('Unknown ID in group ' + grp + ':', id); errors++; }
  });
});
data.DEFAULT_DRINKS.forEach(d => {
  d.ingredients.forEach(ing => {
    if (ing.inventoryId && !invIds.has(ing.inventoryId)) {
      console.error('Unknown inventoryId in drink ' + d.id + ':', ing.inventoryId);
      errors++;
    }
  });
});
if (errors === 0) console.log('✓ All inventory, groups, and drinks validated cleanly.');
else process.exit(1);
"

# 3. Test local serving
python3 -m http.server 8089 &
PID=$!; sleep 1.5; curl -s http://localhost:8089/index.html | head -n 10; kill $PID
```
