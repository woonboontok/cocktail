---
name: cocktail-bar-manager
description: >-
  Use this skill when managing the cocktail inventory, updating bottle stock, adding new spirits or liqueurs, adjusting cocktail and drink recipes, or verifying the data integrity of Boon's Home Bar.
---

# Cocktail Bar Manager Skill

This skill guides the agent through managing the inventory and recipe system of **Boon's Home Bar**.

## 1. Key Locations & Contracts

- **Core Data**: [`js/data.js`](../../js/data.js)
  - `INVENTORY_LAST_UPDATED`: Current date string (e.g. `"15 October 2026"`).
  - `INVENTORY_SYNC_VERSION`: Increment this on every inventory update (e.g. `"20261015_1"`).
  - `INVENTORY_UPDATE_OVERRIDES`: Object overriding live stock flags and quantities.
  - `INGREDIENT_GROUPS`: Multi-spirit groupings (e.g., `"sake"`, `"tequila"`, `"gin"`, `"amaro"`).
  - `DEFAULT_INVENTORY`: Array of full bottle definitions.
  - `DEFAULT_DRINKS`: Array of cocktail/mocktail/shot recipes.

- **App Logic**: [`js/app.js`](../../js/app.js)
  - Handles stock availability resolution (`isItemInStock`, `getIngredientCandidates`, `getDrinkStockStatus`).

---

## 2. Inventory Update Runbook

When a user mentions receiving, purchasing, or running out of bottles:

1. **Locate or Add the Inventory Item**:
   - Check if an entry already exists in `DEFAULT_INVENTORY`.
   - If present, set `inStock: true`, `incoming: false`, and verify `abv`, `unit`, and bottle size.
   - If new, create an entry with a slugified `id`, descriptive `name`, appropriate `category`, `subCategory`, `abv`, and tasting notes.

2. **Update Overrides & Versioning**:
   - In `INVENTORY_UPDATE_OVERRIDES`, add/update the entry with:
     ```javascript
     "item-id": { inStock: true, incoming: false, quantity: 1, unit: "bottle", abv: ..., notes: "..." }
     ```
   - Bump `INVENTORY_SYNC_VERSION` and update `INVENTORY_LAST_UPDATED`.

3. **Check Ingredient Groups**:
   - If the item belongs to an existing spirit family (e.g. sake, tequila, gin, amaro, whiskey), ensure its `id` is listed under the matching `INGREDIENT_GROUPS` entry.

4. **Adjust Cocktails & Recipes**:
   - Review cocktails that use the item or previously used substitutes (e.g., Rusty Nail for Drambuie, Paper Plane for Amaro Nonino).
   - If recipes previously pointed to substitute `inventoryId`s, update them to point directly to the newly in-stock bottle.
   - If new classic/signature drinks are unlocked by the addition, add them to `DEFAULT_DRINKS` with dual volume units (`amountOz` & `amountMl`), tags (`"in-stock"`), and helpful `proTip`s.

---

## 3. Automated Validation

Always run this validation script before committing:

```bash
node -e "
const data = require('./js/data.js');
const invIds = new Set(data.DEFAULT_INVENTORY.map(i => i.id));
let errors = 0;

// Verify groups
Object.entries(data.INGREDIENT_GROUPS).forEach(([grp, def]) => {
  def.inventoryIds.forEach(id => {
    if (!invIds.has(id)) { console.error('Unknown ID in group ' + grp + ':', id); errors++; }
  });
});

// Verify drinks
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
```
