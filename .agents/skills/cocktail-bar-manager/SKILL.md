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
| [`index.html`](../../index.html) | Semantic shell, modals, static navigation | Accessible modal dialogs, responsive nav toggle, SVG icons |
| [`css/style.css`](../../css/style.css) | All styling, 7 dynamic time-of-day themes, CSS grid | Dynamic themes via `data-theme` on `<html>`. CSS vars: `--accent-gold`, `--accent-copper`, `--bg-primary`, `--bg-card`, `--text-primary`. |
| [`js/data.js`](../../js/data.js) | **Single Source of Truth** for inventory & recipes | Must remain valid ES/CommonJS (consumable by Node.js validation scripts). **Never read more than the minimum lines needed.** |
| [`js/app.js`](../../js/app.js) | State machine, stock resolution, rendering engine | Caches core DOM nodes on `init()`, modular helpers hoisted to file scope |

### Core Data Contracts (`js/data.js`)
- `INVENTORY_LAST_UPDATED`: Current date string (e.g. `"22 October 2026"`).
- `INVENTORY_SYNC_VERSION`: Format `YYYYMMDD_N`. **Always bump on every inventory edit.** Auto-handled by the patcher script.
- `INVENTORY_UPDATE_OVERRIDES`: Live stock flags, quantities, units, notes — keyed by item `id`. **This is the primary target for all stock updates.**
- `INGREDIENT_GROUPS`: Multi-spirit groupings (e.g., `"sake"`, `"tequila"`, `"gin"`, `"amaro"`, `"prosecco"`).
- `DEFAULT_INVENTORY`: Array of full bottle and ingredient definitions (rarely edited directly).
- `DEFAULT_DRINKS`: Array of cocktail/mocktail/shot recipes.

---

## 2. ⚡ Efficient Inventory Updates — Use the Patcher Script

> [!IMPORTANT]
> **Always use the patcher script for INVENTORY_UPDATE_OVERRIDES edits.** Do NOT use `edit_file` to change override entries — it fails on unicode characters (accents, em-dashes, smart quotes) and wastes many tool calls. The script handles versioning and line editing atomically in one command.

### The Patcher Command

```bash
# Working directory: /Users/tokwoonboon/workspace/cocktail
node .agents/skills/cocktail-bar-manager/scripts/patch-inventory.js \
  --id "<item-id>" field1=value1 field2=value2 ...
```

**Value encoding rules:**
| Value type | Example | Result |
|---|---|---|
| Boolean | `inStock=true` | `true` |
| Number | `quantity=2` or `abv=16` | `2` / `16` |
| String | `unit=bottle` | `"bottle"` |
| String with spaces | Use shell quotes: `notes="In stock: ..."` | `"In stock: ..."` |
| Refrigerate must | `refrigerate=must` | `"must"` |
| Refrigerate preferred | `refrigerate=preferred` | `"preferred"` |

**The script automatically:**
- Finds the `"item-id": { ... }` line in `INVENTORY_UPDATE_OVERRIDES`
- Merges only the fields you pass (preserves all other fields unchanged)
- Updates `INVENTORY_LAST_UPDATED` to today
- Bumps `INVENTORY_SYNC_VERSION` (format `YYYYMMDD_N`)

### Common Inventory Scenarios

**Mark a bottle as received (was `incoming: true`):**
```bash
node .agents/skills/cocktail-bar-manager/scripts/patch-inventory.js \
  --id "creme-de-mure" inStock=true incoming=false
```

**Mark a bottle as depleted:**
```bash
node .agents/skills/cocktail-bar-manager/scripts/patch-inventory.js \
  --id "tanqueray-gin" inStock=false quantity=0
```

**Update quantity:**
```bash
node .agents/skills/cocktail-bar-manager/scripts/patch-inventory.js \
  --id "chang-soda-water" quantity=24
```

**Two bottles at once — run two patcher calls:**
```bash
node .agents/skills/cocktail-bar-manager/scripts/patch-inventory.js \
  --id "creme-de-mure" inStock=true incoming=false
node .agents/skills/cocktail-bar-manager/scripts/patch-inventory.js \
  --id "creme-de-violette" inStock=true incoming=false
```

### When to use `edit_file` directly

Only use `edit_file` for:
1. **New entries in `DEFAULT_INVENTORY`** (full schema object — no unicode in the target anchor, use a unique string like the `id:` field as the target).
2. **New cocktail recipes in `DEFAULT_DRINKS`**.
3. **`INGREDIENT_GROUPS` additions** (pure ASCII structure, safe to target).
4. **`js/app.js` or `css/style.css`** code/style changes.

> [!TIP]
> When you must use `edit_file`, **target the shortest unique ASCII substring possible** — e.g. target only `"item-id":` or a field name that has no accented characters. Never target a full line that contains unicode (accented names, em-dashes, curly quotes) — these will never match.

---

## 3. Full Inventory Update Runbook

When a user mentions receiving, purchasing, or running out of bottles:

### Step 1 — Run the patcher for INVENTORY_UPDATE_OVERRIDES
Use the patcher script above. This handles versioning automatically.

### Step 2 — Check DEFAULT_INVENTORY (lines 1–300 max)
Only read DEFAULT_INVENTORY if:
- The item might not exist there yet (new bottle).
- You need to verify the `abv` or `category` for a recipe addition.

If the item is **new** (not in DEFAULT_INVENTORY), append a full entry:
```javascript
{
  id: "slugified-name",
  name: "Full Brand Name (Style)",
  category: "liqueurs", // spirits | liqueurs | fortified | sparkling | mixers_sodas | bitters_syrups | fresh_garnishes
  subCategory: "Berry & Fruit",
  spiritFamily: "Liqueur",
  spiritStyle: "Blackberry",
  inStock: true,
  incoming: false,
  quantity: 1,
  unit: "bottle",
  abv: 16,
  premium: false,
  refrigerate: "preferred", // See refrigeration rules in Section 3B
  notes: "In stock: Brand Name, 700ml, 16% ABV. Tasting notes and usage."
}
```

### Step 3 — Check INGREDIENT_GROUPS (lines 108–350 ish)
If the new bottle belongs to an existing spirit family (gin, rum, tequila, sake, amaro, etc.), add its `id` to the matching group. Use `edit_file` targeting the group's `inventoryIds` array — these lines are ASCII-safe.

### Step 4 — Reserve & Refrigeration classification

**Reserve (`premium`):** See Section 4.

**Refrigeration (`refrigerate`):** Use a string value — **never boolean `true`**:

| Value | Meaning | Renders as | Use for |
|---|---|---|---|
| `"must"` | Will spoil/degrade significantly without cold | ❄ **solid bright blue badge** + solid left border | Fresh produce & herbs, fresh-pressed juices, dairy/cream/egg white, Yakult, Makgeolli, coconut cream/water, grenadine syrups |
| `"preferred"` | Quality & serving temperature preservation; shelf-stable if needed | ❄ **muted blue dashed badge** + dashed left border | Fruit liqueurs (Cassis, Mûre, Tequila Rose), vermouths & aperitifs (Lillet, Martini, Aperol, Campari), amaros (Nonino, Fernet, Averna), all syrups, all sodas/tonics/beers/Prosecco, Baileys |
| `false` / omit | No refrigeration needed | *(no badge)* | All base spirits, most herbal/botanical liqueurs (Violette, Frangelico, Drambuie, Sambuca), fortified wines above ~18% ABV |

> [!IMPORTANT]
> **Never set `refrigerate: true` (boolean).** Always use `"must"` or `"preferred"`. The app handles legacy `true` as `"preferred"` for safety, but all new and edited entries must use string values.

### Step 5 — Cocktail recipe review (targeted read)
Search for the item id in drink recipes using grep rather than reading the whole file:
```bash
grep -n "item-id\|SubstituteName" js/data.js | head -40
```
Only read the relevant recipe blocks. Update `inventoryId` or `ingredientGroup` references where needed. Add new classic cocktails unlocked by the new bottle.

### Step 6 — Verify (always last)
```bash
node -e "
const fs = require('fs'), vm = require('vm');
new vm.Script(fs.readFileSync('js/data.js', 'utf8'));
new vm.Script(fs.readFileSync('js/app.js', 'utf8'));
console.log('JS syntax valid');
"
```

---

## 4. Reserve Spirit Decision Framework (`✦ Reserve` & `preferNonPremium`)

### A. When to Tag an Inventory Bottle as `premium: true` (✦ Reserve)
Reserve status is primarily about **rarity and replacement cost**. Mark `premium: true` only when the bottle meets at least two of:
1. **Rare or hard to replace**: limited availability, unusual provenance, or difficulty sourcing.
2. **High replacement cost**: materially more expensive than everyday bottles in the same group.
3. **Distinctive profile worth preserving**: complex craft, meaningful aging, sipping qualities lost when masked.

**NOT Reserve:** High ABV/overproof alone (*Goslings 151*, *Topanito Mezcal*, *JD Bonded Rye*) — these are functional specs. Workhorse mixers (*Tanqueray*, *Bacardi Superior*, *Smirnoff Red*, *Jim Beam Black*, *Teremana Blanco*) are not Reserve.
### B. When to Set `preferNonPremium: true` in Drink Recipes

| Drink Characteristic | Setting | Example Drinks |
|---|---|---|
| **Heavily modified / Sugary / Creamy / High-Mixer** | `true` | Singapore Sling, Long Island Iced Tea, Tom Collins, Brandy Alexander, Alabama Slammer, Flatliner, Barbados Rum Punch, Monkey Gland, Floradora, Ramos Gin Fizz, Peach Sake Fizz, Sake Bomb, Tonight Not Going Home |
| **Spirit-Forward / Dry / Minimal Modifier** | `false` (leave falsy) | Dry Martini, Saketini, Obituary, Vesper, Classic Gimlet, French 75, Classic Margarita, Paloma, Old Fashioned |

---

## 5. UI & Codebase Patterns (`js/app.js` & `css/style.css`)

1. **Shared SVG Constants**: Reusable icons (like `SNOWFLAKE_SVG`) defined at top of `js/app.js`, never duplicated inline.
2. **DOM Caching**: Primary containers cached in `DOM` during `init()`.
3. **Pill Filtering Pattern**: Use shared `setupFilterPills(selector, getter, setter)` helper.
4. **Theme Awareness**: Use CSS variables only — never hardcode hex colors like `#fff` or `#f3f4f6`.
5. **Quantity Updates**: Route through `setItemQuantityDirect(id, newQty)` for atomic sync.
6. **Drink Preparation Tools**: `getDrinkTools(drink)` in `js/app.js` infers equipment. Update the bottle-opener check when new glass-bottled mixers are added.

---

## 6. Verification & Quality Checklist

Run after every change:

```bash
# Syntax check (fast, always run)
node -e "
const fs = require('fs'), vm = require('vm');
new vm.Script(fs.readFileSync('js/data.js', 'utf8'));
new vm.Script(fs.readFileSync('js/app.js', 'utf8'));
console.log('JS syntax valid');
"

# Data integrity check (run when recipes or groups were edited)
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
if (errors === 0) console.log('All inventory, groups, and drinks validated cleanly.');
else process.exit(1);
"
```
