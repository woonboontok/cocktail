/**
 * BOON'S HOME BAR APP
 * Interactive Controller for Cocktails, Mocktails, Shots & Inventory
 */

(function () {
  "use strict";

  // ==================== STATE MANAGEMENT ====================
  const STORAGE_KEY_INVENTORY = "speakeasy_inventory_v2";
  const STORAGE_KEY_INVENTORY_UPDATE = `speakeasy_inventory_update_${INVENTORY_SYNC_VERSION}`;
  const STORAGE_KEY_CUSTOM_DRINKS = "speakeasy_custom_drinks_v1";
  const STORAGE_KEY_BOOKMARKS = "speakeasy_bookmarks_v1";
  const STORAGE_KEY_UNIT = "speakeasy_unit_pref_v1";
  const STORAGE_KEY_DRINK_STATUS = "speakeasy_drink_status_v1";
  const STORAGE_KEY_THEME = "speakeasy_theme_pref_v1";
  const THEME_COOKIE = "speakeasy_theme";

  let inventory = loadInventory();
  let customDrinks = loadCustomDrinks();
  let bookmarks = loadBookmarks();
  let drinkStatuses = loadDrinkStatuses();
  let unitPreference = localStorage.getItem(STORAGE_KEY_UNIT) || "both"; // "both", "oz", "ml"

  let currentTab = "all"; // "all", "cocktails", "mocktails", "shots", "glossary", "my-bar"
  let searchQuery = "";
  let selectedSpirit = "all";
  let selectedDifficulty = "all";
  let selectedTaste = "all";
  let selectedGlass = "all";
  let filterOnlyMyBar = false;
  let inventoryRecipeFilterIds = null;
  let sortBy = "popularity-desc";
  let glossaryStockFilter = "all";
  let glossaryView = "list";
  let glossarySort = { column: "category", direction: "asc" };

  // ==================== STORAGE HELPERS ====================
  function getDefaultUnit(item) {
    if (item.unit) return item.unit;
    if (item.category === "fresh_garnishes") {
      const id = item.id.toLowerCase();
      if (id.includes("lemon") || id.includes("lime") || id.includes("orange") || id.includes("peach")) return "pcs";
      if (id.includes("mint") || id.includes("rosemary")) return "bunch";
      if (id.includes("ice")) return "bag";
      return "pack";
    }
    if (item.subCategory && item.subCategory.includes("Sodas")) return "can";
    if (item.subCategory && item.subCategory.includes("Juices")) return "carton";
    return "bottle";
  }

  function getDefaultQuantity(item) {
    if (item.quantity !== undefined) return item.quantity;
    if (!item.inStock) return 0;
    if (item.category === "fresh_garnishes") {
      const id = item.id.toLowerCase();
      if (id.includes("lemon") || id.includes("lime") || id.includes("orange")) return 6;
    }
    if (item.subCategory && item.subCategory.includes("Sodas")) return 6;
    return 1;
  }

  function loadInventory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INVENTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const idMap = new Map(parsed.map(item => [item.id, item]));

        const merged = DEFAULT_INVENTORY.map(def => {
          if (idMap.has(def.id)) {
            const s = idMap.get(def.id);
            const inStock = s.inStock !== undefined ? s.inStock : def.inStock;
            let qty = s.quantity !== undefined ? s.quantity : getDefaultQuantity(def);
            if (inStock && qty <= 0) qty = 1;
            if (!inStock && !def.incoming && qty > 0) qty = 0;
            return {
              ...def,
              inStock: inStock,
              quantity: qty,
              unit: s.unit || getDefaultUnit(def)
            };
          }
          return {
            ...def,
            quantity: getDefaultQuantity(def),
            unit: getDefaultUnit(def)
          };
        });

        // Preserve any custom items added through admin view
        const defaultIds = new Set(DEFAULT_INVENTORY.map(d => d.id));
        parsed.forEach(item => {
          if (!defaultIds.has(item.id) && item.id !== "overproof-rum") {
            merged.push(item);
          }
        });

        // Apply this bar update once without discarding the user's other saved stock and quantities.
        if (!localStorage.getItem(STORAGE_KEY_INVENTORY_UPDATE)) {
          merged.forEach(item => {
            if (INVENTORY_UPDATE_OVERRIDES[item.id]) Object.assign(item, INVENTORY_UPDATE_OVERRIDES[item.id]);
          });
          localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(merged));
          localStorage.setItem(STORAGE_KEY_INVENTORY_UPDATE, "true");
        }

        return merged;
      }
    } catch (e) {
      console.warn("Error loading inventory from localStorage", e);
    }
    return DEFAULT_INVENTORY.map(def => ({
      ...def,
      quantity: getDefaultQuantity(def),
      unit: getDefaultUnit(def)
    }));
  }

  function saveInventory() {
    try {
      localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(inventory));
    } catch (e) {
      console.warn("Error saving inventory", e);
    }
  }

  function loadCustomDrinks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_DRINKS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCustomDrinks() {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_DRINKS, JSON.stringify(customDrinks));
    } catch (e) {
      console.warn("Error saving custom drinks", e);
    }
  }

  function loadBookmarks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  function toggleBookmark(drinkId) {
    const idx = bookmarks.indexOf(drinkId);
    if (idx > -1) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.push(drinkId);
    }
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
    renderApp();
  }

  function loadDrinkStatuses() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_DRINK_STATUS)) || {}; }
    catch (e) { return {}; }
  }

  function toggleDrinkStatus(drinkId, status) {
    const current = drinkStatuses[drinkId] || {};
    current[status] = !current[status];
    drinkStatuses[drinkId] = current;
    localStorage.setItem(STORAGE_KEY_DRINK_STATUS, JSON.stringify(drinkStatuses));
    renderApp();
  }

  function getDrinkStatus(drinkId) { return drinkStatuses[drinkId] || {}; }

  function getDrinkVolume(drink) {
    let totalMl = 0, hasTopUp = false;
    drink.ingredients.forEach(ing => {
      const amount = String(ing.amountMl || ing.amountOz || "").toLowerCase();
      if (/top up|fill|splash/.test(amount)) hasTopUp = true;
      const match = amount.match(/(\d+(?:\.\d+)?)/);
      if (match && /ml|oz|cl|cup|tsp|tbsp/.test(amount)) {
        let value = parseFloat(match[1]);
        if (/oz/.test(amount) && !/ml/.test(amount)) value *= 29.5735;
        else if (/cl/.test(amount)) value *= 10;
        else if (/cup/.test(amount)) value *= 240;
        else if (/tsp/.test(amount)) value *= 5;
        else if (/tbsp/.test(amount)) value *= 15;
        totalMl += value;
      }
    });
    const rounded = Math.round(totalMl / 5) * 5;
    if (!rounded) return hasTopUp ? "Served with mixer" : "Volume varies";
    return `~${rounded} ml${hasTopUp ? " + top-up" : ""}`;
  }

  function getAbv(drink) {
    const match = String(drink.alcoholLevel || "").match(/(?:~)?(\d+(?:\.\d+)?)%\s*ABV/i);
    return match ? `${match[1]}% ABV` : "ABV not specified";
  }

  function getDrinkAbvValue(drink) {
    return parseAbvText(drink && drink.alcoholLevel);
  }

  function parseAbvText(value) {
    if (!value) return null;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const text = String(value).trim();
    const abvMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*ABV/i);
    if (abvMatch) return Number(abvMatch[1]);
    const proofMatch = text.match(/(\d+(?:\.\d+)?)\s*proof/i);
    if (proofMatch) return Number(proofMatch[1]) / 2;
    return null;
  }

  function getInventoryAbv(item) {
    if (!item) return "—";
    const direct = parseAbvText(item.abv || item.proof || item.name);
    if (direct !== null) {
      const fixed = Number.isInteger(direct) ? direct.toFixed(0) : direct.toFixed(1);
      return `${fixed}% ABV`;
    }
    return "—";
  }

  function getRecipesUsingItem(itemId) {
    return getAllDrinks().filter(drink =>
      drink.ingredients.some(ing => {
        if (!ing.inventoryId) return false;
        return ing.inventoryId === itemId || inventory.some(i => i.id === ing.inventoryId && i.aliasOf === itemId);
      })
    );
  }

  function getCookie(name) {
    const entry = document.cookie.split("; ").find(row => row.startsWith(`${name}=`));
    return entry ? decodeURIComponent(entry.split("=")[1]) : "";
  }

  function autoThemeForHour(hour) {
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 19) return "twilight";
    if (hour >= 19 && hour < 22) return "evening";
    if (hour >= 22) return "night";
    return hour < 3 ? "latenight" : "graveyard";
  }

  function getThemePreference() {
    return getCookie(THEME_COOKIE) || localStorage.getItem(STORAGE_KEY_THEME) || "auto";
  }

  function applyTheme(preferredTheme) {
    const preference = preferredTheme || getThemePreference();
    document.documentElement.dataset.theme = preference === "auto" ? autoThemeForHour(new Date().getHours()) : preference;
    const select = document.getElementById("theme-select");
    if (select) select.value = preference;
  }

  // ==================== DRINK HELPERS ====================
  function getAllDrinks() {
    return [...customDrinks, ...DEFAULT_DRINKS];
  }

  function getIngredientGroupId(ingredient) {
    return ingredient.ingredientGroup || INGREDIENT_GROUP_BY_INVENTORY_ID[ingredient.inventoryId] || `inventory:${ingredient.inventoryId}`;
  }

  function getIngredientCandidates(ingredient) {
    const group = INGREDIENT_GROUPS[getIngredientGroupId(ingredient)];
    return group ? group.inventoryIds : [ingredient.inventoryId];
  }

  function getInventoryItem(inventoryId) {
    return inventory.find(item => item.id === inventoryId || (item.aliasOf && item.aliasOf === inventoryId));
  }

  function isItemInStock(inventoryId, ingredient) {
    if (!inventoryId) return true;
    return getIngredientCandidates({ ...(ingredient || {}), inventoryId }).some(candidateId => {
      const item = getInventoryItem(candidateId);
      return item && item.inStock && (item.quantity === undefined || item.quantity > 0);
    });
  }

  function isPerishableIngredient(ingredient) {
    return getIngredientCandidates(ingredient).some(candidateId => getInventoryItem(candidateId)?.category === "fresh_garnishes");
  }

  function getDrinkStockStatus(drink) {
    let totalStockable = 0;
    let missingCount = 0;
    const missingItems = [];
    const missingFreshProduce = [];

    drink.ingredients.forEach(ing => {
      if (ing.inventoryId) {
        totalStockable++;
        if (!isItemInStock(ing.inventoryId, ing)) {
          missingCount++;
          const group = INGREDIENT_GROUPS[getIngredientGroupId(ing)];
          missingItems.push(group ? group.label : ing.item);
          if (isPerishableIngredient(ing)) missingFreshProduce.push(group ? group.label : ing.item);
        }
      }
    });

    return {
      canMake: missingCount === 0,
      missingCount: missingCount,
      missingItems: missingItems,
      missingFreshProduce,
      totalStockable: totalStockable
    };
  }

  // ==================== FILTER & SORT LOGIC ====================
  function getFilteredAndSortedDrinks() {
    let drinks = getAllDrinks();

    // Tab filter
    if (currentTab === "cocktails") {
      drinks = drinks.filter(d => d.category === "Cocktail");
    } else if (currentTab === "mocktails") {
      drinks = drinks.filter(d => d.category === "Mocktail");
    } else if (currentTab === "shots") {
      drinks = drinks.filter(d => d.category === "Shot");
    } else if (currentTab === "my-bar") {
      drinks = drinks.filter(d => getDrinkStockStatus(d).canMake);
    }

    // Secondary filters
    if (filterOnlyMyBar && currentTab !== "my-bar") {
      drinks = drinks.filter(d => getDrinkStockStatus(d).canMake);
    }

    if (selectedSpirit !== "all") {
      drinks = drinks.filter(d => d.baseSpirit === selectedSpirit);
    }

    if (selectedDifficulty !== "all") {
      drinks = drinks.filter(d => String(d.difficulty) === String(selectedDifficulty));
    }

    if (selectedGlass !== "all") {
      drinks = drinks.filter(d => d.glassware && d.glassware.toLowerCase().includes(selectedGlass.toLowerCase()));
    }

    if (selectedTaste !== "all") {
      drinks = drinks.filter(d => d.tasteProfile && d.tasteProfile.toLowerCase().includes(selectedTaste.toLowerCase()));
    }

    if (inventoryRecipeFilterIds) {
      drinks = drinks.filter(d => inventoryRecipeFilterIds.includes(d.id));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      drinks = drinks.filter(d => {
        const nameMatch = d.name.toLowerCase().includes(q);
        const aliasMatch = d.otherNames && d.otherNames.toLowerCase().includes(q);
        const spiritMatch = d.baseSpirit && d.baseSpirit.toLowerCase().includes(q);
        const tasteMatch = d.tasteProfile && d.tasteProfile.toLowerCase().includes(q);
        const ingMatch = d.ingredients.some(ing => 
          ing.item.toLowerCase().includes(q) || 
          (ing.substitute && ing.substitute.toLowerCase().includes(q))
        );
        const tagsMatch = d.tags && d.tags.some(t => t.toLowerCase().includes(q));
        return nameMatch || aliasMatch || spiritMatch || tasteMatch || ingMatch || tagsMatch;
      });
    }

    // Sorting
    drinks.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "popularity-desc":
          return (b.popularity || 0) - (a.popularity || 0);
        case "difficulty-asc":
          return (a.difficulty || 1) - (b.difficulty || 1);
        case "difficulty-desc":
          return (b.difficulty || 1) - (a.difficulty || 1);
        case "alcohol-desc": {
          const aAbv = getDrinkAbvValue(a);
          const bAbv = getDrinkAbvValue(b);
          if (aAbv !== null && bAbv !== null && aAbv !== bAbv) return bAbv - aAbv;
          return (b.alcoholScore || 0) - (a.alcoholScore || 0) || (b.popularity || 0) - (a.popularity || 0);
        }
        case "ingredients-asc":
          return a.ingredients.length - b.ingredients.length;
        default:
          return 0;
      }
    });

    return drinks;
  }

  // ==================== RENDERING UI ====================
  function renderApp() {
    renderTabButtons();
    renderHeroStats();

    const catalogView = document.getElementById("catalog-view");
    const glossaryView = document.getElementById("glossary-view");
    const adminView = document.getElementById("admin-view");

    if (currentTab === "glossary") {
      if (catalogView) catalogView.style.display = "none";
      if (glossaryView) glossaryView.style.display = "block";
      if (adminView) adminView.style.display = "none";
      renderGlossary();
    } else if (currentTab === "admin") {
      if (catalogView) catalogView.style.display = "none";
      if (glossaryView) glossaryView.style.display = "none";
      if (adminView) {
        adminView.style.display = "block";
        renderAdminView();
      }
    } else {
      if (catalogView) catalogView.style.display = "block";
      if (glossaryView) glossaryView.style.display = "none";
      if (adminView) adminView.style.display = "none";
      renderDrinkCards();
    }
  }

  function renderHeroStats() {
    const all = getAllDrinks();
    const cocktails = all.filter(d => d.category === "Cocktail").length;
    const mocktails = all.filter(d => d.category === "Mocktail").length;
    const shots = all.filter(d => d.category === "Shot").length;
    const readyToMake = all.filter(d => getDrinkStockStatus(d).canMake).length;

    const inStockBottles = inventory.filter(i => i.inStock && (i.quantity === undefined || i.quantity > 0)).length;
    const totalBottles = inventory.length;

    const statsEl = document.getElementById("hero-stats");
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-pill">🍸 Cocktails: <strong>${cocktails}</strong></div>
        <div class="stat-pill">🍹 Mocktails: <strong>${mocktails}</strong></div>
        <div class="stat-pill">🥃 Shots: <strong>${shots}</strong></div>
        <div class="stat-pill">🍾 In Bar: <strong>${inStockBottles} / ${totalBottles}</strong></div>
        <div class="stat-pill" style="border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.1);">
          ✨ Ready to Make Now: <strong>${readyToMake}</strong>
        </div>
      `;
    }
  }

  function renderTabButtons() {
    const navBtns = document.querySelectorAll(".nav-btn[data-tab]");
    navBtns.forEach(btn => {
      const tab = btn.getAttribute("data-tab");
      btn.classList.toggle("active", tab === currentTab);
    });
  }

  function getDifficultyStars(level) {
    const full = "★".repeat(level);
    const empty = "☆".repeat(Math.max(0, 5 - level));
    return `<span class="card-rating-stars" title="Difficulty: ${level}/5">${full}${empty}</span>`;
  }

  function getDrinkVisual(drink) {
    const glassware = String(drink.glassware || "").toLowerCase();
    const name = drink.name.toLowerCase();
    let glassShape = "coupe";
    if (glassware.includes("shot")) glassShape = "shot";
    else if (glassware.includes("snifter") || glassware.includes("rocks") || glassware.includes("old fashioned")) glassShape = "rocks";
    else if (glassware.includes("hurricane") || glassware.includes("highball") || glassware.includes("collins") || glassware.includes("tiki") || glassware.includes("mug")) glassShape = "highball";
    else if (glassware.includes("champagne") || glassware.includes("flute")) glassShape = "flute";
    else if (glassware.includes("coupe") || glassware.includes("martini") || glassware.includes("nick & nora")) glassShape = "coupe";

    let color = "var(--accent-gold)";
    if (name.includes("aperol") || name.includes("sunrise")) color = "#ff9f43";
    else if (name.includes("negroni") || name.includes("bloody") || name.includes("mary")) color = "#e95d64";
    else if (drink.category === "Mocktail") color = "#72e0b0";
    else if (drink.category === "Shot") color = "#ff7a9d";
    else if (drink.baseSpirit === "Rum") color = "#e6b35a";

    const glassIcons = {
      coupe: `<svg class="glass-icon" viewBox="0 0 96 96" role="img" aria-label="${drink.glassware || "Coupe glass"}"><path d="M20 20h56L64 42c-4 8-11 13-16 14v17h12v5H36v-5h12V56c-5-1-12-6-16-14L20 20Z"/><path d="M28 27h40"/></svg>`,
      rocks: `<svg class="glass-icon" viewBox="0 0 96 96" role="img" aria-label="${drink.glassware || "Rocks glass"}"><path d="M23 25h50l-5 46H28l-5-46Z"/><path d="M28 35h40M34 52h28"/></svg>`,
      highball: `<svg class="glass-icon" viewBox="0 0 96 96" role="img" aria-label="${drink.glassware || "Highball glass"}"><path d="M29 15h38l-5 64H34l-5-64Z"/><path d="M31 27h34M34 58h28"/></svg>`,
      flute: `<svg class="glass-icon" viewBox="0 0 96 96" role="img" aria-label="${drink.glassware || "Flute glass"}"><path d="M31 15h34L58 48c-2 6-5 10-10 12-5-2-8-6-10-12L31 15Z"/><path d="M48 60v18M38 82h20M35 23h26"/></svg>`,
      shot: `<svg class="glass-icon" viewBox="0 0 96 96" role="img" aria-label="${drink.glassware || "Shot glass"}"><path d="M30 29h36l-4 40H34l-4-40Z"/><path d="M32 37h32"/></svg>`
    };

    return { icon: glassIcons[glassShape], color };
  }

  function renderDrinkCards() {
    const drinks = getFilteredAndSortedDrinks();
    const container = document.getElementById("drinks-grid");
    const countEl = document.getElementById("results-count");

    if (countEl) {
      countEl.innerHTML = `Showing <strong>${drinks.length}</strong> drink${drinks.length === 1 ? "" : "s"}`;
    }

    if (!container) return;

    if (drinks.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🍸</div>
          <h3 style="color: #fff; margin-bottom: 0.5rem; font-size: 1.4rem;">No drinks found</h3>
          <p style="max-width: 420px; margin: 0 auto 1.5rem;">Try clearing some filters or searching for a different spirit, cocktail name, or ingredient.</p>
          <button class="btn-primary" id="btn-reset-filters">Clear All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById("btn-reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", resetFilters);
      }
      return;
    }

    container.innerHTML = drinks.map(drink => {
      const stock = getDrinkStockStatus(drink);
      const categoryClass = drink.category.toLowerCase();
      const isBookmarked = bookmarks.includes(drink.id);
      const status = getDrinkStatus(drink.id);

      const stockBadge = stock.canMake
        ? `<span class="bar-stock-indicator status-ready">✓ In Stock</span>`
        : `<span class="bar-stock-indicator status-missing" title="Missing: ${stock.missingItems.slice(0, 2).join(', ')}">Need ${stock.missingCount}</span>`;
      const freshProduceBadge = stock.missingFreshProduce.length
        ? `<span class="fresh-produce-indicator" title="Missing: ${stock.missingFreshProduce.join(', ')}">🥬 Missing Fresh Produce</span>`
        : "";
      const visual = getDrinkVisual(drink);

      // Ingredients preview (up to 4 tags)
      const ingPreview = drink.ingredients.slice(0, 4).map(i => {
        const shortName = i.item.split("(")[0].trim();
        return `<span class="preview-tag">${shortName}</span>`;
      }).join("");

      return `
        <div class="drink-card card-${categoryClass}" data-id="${drink.id}">
          <div class="card-top-bar">
            <span class="drink-category-badge badge-${categoryClass}">${drink.category}</span>
            <div class="card-statuses">${status.tried ? `<span class="drink-status tried">✓ Tried</span>` : ""}${status.constructed ? `<span class="drink-status constructed">⚗ Made</span>` : ""}${stockBadge}${freshProduceBadge}</div>
          </div>

          <div class="drink-card-visual" style="--drink-accent: ${visual.color};">${visual.icon}</div>

          <div class="card-title-block">
            <h3 class="drink-name">${drink.name}</h3>
            ${drink.otherNames ? `<span class="drink-alias">${drink.otherNames}</span>` : ""}
          </div>

          <div class="card-specs-row">
            <div class="spec-item">
              <span class="spec-key">Glass</span>
              <span class="spec-val">${drink.glassware || "Cocktail"}</span>
            </div>
            <div class="spec-item">
              <span class="spec-key">Alcohol</span>
              <span class="spec-val gold">${getAbv(drink)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-key">Volume</span>
              <span class="spec-val">${getDrinkVolume(drink)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-key">Difficulty</span>
              <span class="spec-val">${getDifficultyStars(drink.difficulty)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-key">Score</span>
              <span class="spec-val gold">★ ${drink.popularity ? drink.popularity.toFixed(1) : "9.0"} / 10</span>
            </div>
          </div>

          <div class="card-ingredients-preview">
            <div class="ingredients-label">Key Ingredients</div>
            <div class="preview-tags">
              ${ingPreview}
              ${drink.ingredients.length > 4 ? `<span class="preview-tag">+${drink.ingredients.length - 4} more</span>` : ""}
            </div>
          </div>

          <div class="card-footer-action">
            <span style="font-size: 0.76rem; color: var(--text-muted);">${drink.baseSpirit || drink.category}</span>
            <span class="view-recipe-link">View Recipe →</span>
          </div>
        </div>
      `;
    }).join("");

    // Add click listeners to cards
    container.querySelectorAll(".drink-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        openDrinkModal(id);
      });
    });
  }

  // ==================== GLOSSARY & INVENTORY ====================
  function getInventoryStatus(item) {
    return item.inStock ? "in-stock" : item.incoming ? "incoming" : "to-buy";
  }

  function sortInventoryItems(items) {
    const statusOrder = { "in-stock": 0, incoming: 1, "to-buy": 2 };
    const { column, direction } = glossarySort;
    const multiplier = direction === "asc" ? 1 : -1;
    return [...items].sort((a, b) => {
      let left, right;
      if (column === "status") {
        left = statusOrder[getInventoryStatus(a)];
        right = statusOrder[getInventoryStatus(b)];
      } else if (column === "quantity") {
        left = a.quantity !== undefined ? a.quantity : getDefaultQuantity(a);
        right = b.quantity !== undefined ? b.quantity : getDefaultQuantity(b);
      } else if (column === "type") {
        left = a.subCategory || "";
        right = b.subCategory || "";
      } else if (column === "category") {
        left = INVENTORY_CATEGORIES[a.category] || a.category || "";
        right = INVENTORY_CATEGORIES[b.category] || b.category || "";
      } else if (column === "abv") {
        left = parseAbvText(a.abv || a.proof || a.name);
        right = parseAbvText(b.abv || b.proof || b.name);
        if (left === null) left = -1;
        if (right === null) right = -1;
      } else {
        left = a.name || "";
        right = b.name || "";
      }
      return typeof left === "number" ? multiplier * (left - right) : multiplier * String(left).localeCompare(String(right));
    });
  }

  function renderGlossary() {
    const container = document.getElementById("glossary-categories");
    if (!container) return;

    const lastUpdated = document.getElementById("inventory-last-updated");
    if (lastUpdated) lastUpdated.textContent = `Inventory data last updated: ${INVENTORY_LAST_UPDATED}`;

    // Count stats
    const inStock = inventory.filter(i => i.inStock).length;
    const incoming = inventory.filter(i => i.incoming && !i.inStock).length;
    const shoppingList = inventory.filter(i => !i.inStock && !i.incoming).length;

    const statsEl = document.getElementById("inv-live-stats");
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="inv-stat-item">
          <div class="inv-stat-num" style="color: #34d399;">${inStock}</div>
          <div class="inv-stat-label">In My Bar</div>
        </div>
        <div class="inv-stat-item">
          <div class="inv-stat-num" style="color: #fbbf24;">${shoppingList}</div>
          <div class="inv-stat-label">Shopping List</div>
        </div>
        ${incoming ? `<div class="inv-stat-item">
          <div class="inv-stat-num" style="color: #60a5fa;">${incoming}</div>
          <div class="inv-stat-label">Incoming</div>
        </div>` : ""}
      `;
    }

    const visibleItems = sortInventoryItems(inventory.filter(item =>
      glossaryStockFilter === "all" || getInventoryStatus(item) === glossaryStockFilter
    ));

    if (glossaryView === "table") {
      const sortHeader = (label, column) => {
        const active = glossarySort.column === column;
        return `<button class="inventory-sort-btn ${active ? "active" : ""}" data-inventory-sort="${column}">${label}${active ? (glossarySort.direction === "asc" ? " ↑" : " ↓") : ""}</button>`;
      };
      const statusLabel = status => status === "in-stock" ? "In Stock" : status === "incoming" ? "Incoming" : "To Buy";
      container.innerHTML = visibleItems.length ? `
        <div class="inventory-table-wrapper">
          <div class="inventory-stock-key"><span><i class="stock-key-dot shelf"></i>Shelf-Stable Bottles</span><span><i class="stock-key-dot fresh"></i>Perishables</span></div>
          <table class="inventory-table">
            <thead><tr>
              <th>${sortHeader("Item", "name")}</th>
              <th>${sortHeader("Category", "category")}</th>
              <th>${sortHeader("Type", "type")}</th>
              <th>${sortHeader("Status", "status")}</th>
              <th>${sortHeader("ABV", "abv")}</th>
              <th>${sortHeader("Quantity", "quantity")}</th>
              <th>Makeable drinks</th>
            </tr></thead>
            <tbody>${visibleItems.map(item => {
              const status = getInventoryStatus(item);
              const quantity = item.quantity !== undefined ? item.quantity : getDefaultQuantity(item);
              const usableRecipes = getRecipesUsingItem(item.id);
              const readyCount = usableRecipes.filter(drink => getDrinkStockStatus(drink).canMake).length;
              const linkLabel = readyCount > 0 ? `${readyCount} ready` : `${usableRecipes.length} recipes`;
              return `<tr>
                <td><label class="inventory-table-item ${item.category === "fresh_garnishes" ? "perishable-item" : "shelf-stable-item"}"><input type="checkbox" class="inv-checkbox" data-id="${item.id}" ${item.inStock ? "checked" : ""}><span>${item.name}</span></label></td>
                <td>${INVENTORY_CATEGORIES[item.category] || item.category || "—"}</td>
                <td>${item.subCategory || "—"}</td>
                <td><span class="inv-badge-stock ${status === "in-stock" ? "stock" : status === "incoming" ? "incoming" : "needed"}">${statusLabel(status)}</span></td>
                <td>${getInventoryAbv(item)}</td>
                <td>${quantity} ${item.unit || getDefaultUnit(item)}</td>
                <td>${usableRecipes.length ? `<button class="inventory-drink-link" data-inventory-item-id="${item.id}">${linkLabel}</button>` : "—"}</td>
              </tr>`;
            }).join("")}</tbody>
          </table>
        </div>` : `<div class="inventory-empty-state">No inventory items match this filter.</div>`;
    } else {
    // Group visible inventory by category for the list view.
    const grouped = {};
    Object.keys(INVENTORY_CATEGORIES).forEach(cat => {
      grouped[cat] = [];
    });

    visibleItems.forEach(item => {
      const cat = item.category || "spirits";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    container.innerHTML = Object.keys(INVENTORY_CATEGORIES).map(catKey => {
      const items = grouped[catKey] || [];
      if (items.length === 0) return "";

      const title = INVENTORY_CATEGORIES[catKey];
      const storageLabel = catKey === "fresh_garnishes" ? "Perishables" : "Shelf-Stable Bottles";

      const renderItemCard = item => {
        const stockLabel = item.inStock ? "In Stock" : item.incoming ? "Incoming" : "To Buy";
        return `
          <div class="inventory-item-card ${item.inStock ? "in-stock" : "shopping-list"}" data-item-id="${item.id}">
            <input type="checkbox" class="inv-checkbox" data-id="${item.id}" ${item.inStock ? "checked" : ""}>
            <div class="inv-content">
              <div class="inv-name-row">
                <span class="inv-name">${item.name}</span>
                <span class="inv-badge-stock ${item.inStock ? "stock" : item.incoming ? "incoming" : "needed"}">
                  ${stockLabel}
                </span>
              </div>
              <div class="inv-meta">${item.subCategory || ""} ${item.proof ? "• " + item.proof : ""}</div>
              ${item.notes ? `<div class="inv-notes">${item.notes}</div>` : ""}
              <button class="inv-used-in-btn" data-filter-ing="${item.id}">See drinks using this →</button>
            </div>
          </div>
        `;
      };

      const itemCards = catKey === "spirits"
        ? Object.entries(items.reduce((families, item) => {
            const family = item.spiritFamily || "Other Spirits";
            const style = item.spiritStyle || item.subCategory || "Other";
            if (!families[family]) families[family] = {};
            if (!families[family][style]) families[family][style] = [];
            families[family][style].push(item);
            return families;
          }, {})).map(([family, styles]) => `
            <section class="spirit-family-group">
              <h4>${family}</h4>
              ${Object.entries(styles).map(([style, styleItems]) => `
                <div class="spirit-style-group">
                  <h5>${style}</h5>
                  <div class="inventory-grid inventory-list-grid">${styleItems.map(renderItemCard).join("")}</div>
                </div>
              `).join("")}
            </section>
          `).join("")
        : `<div class="inventory-grid inventory-list-grid">${items.map(renderItemCard).join("")}</div>`;

      return `
        <div class="inventory-category-group">
          <div class="category-header-title">
            <h3>${title} (${items.filter(i => i.inStock).length}/${items.length} In Stock)</h3>
            <span class="inventory-storage-label ${catKey === "fresh_garnishes" ? "perishable" : "shelf-stable"}">${storageLabel}</span>
          </div>
          ${itemCards}
        </div>
      `;
    }).join("") || `<div class="inventory-empty-state">No inventory items match this filter.</div>`;
    }

    // Add checkbox toggle handlers
    container.querySelectorAll(".inv-checkbox").forEach(cb => {
      cb.addEventListener("change", (e) => {
        const id = e.target.getAttribute("data-id");
        const checked = e.target.checked;
        const item = inventory.find(i => i.id === id);
        if (item) {
          item.inStock = checked;
          saveInventory();
          renderGlossary();
          renderHeroStats();
        }
      });
    });

    container.querySelectorAll(".inventory-sort-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const column = btn.getAttribute("data-inventory-sort");
        glossarySort = {
          column,
          direction: glossarySort.column === column && glossarySort.direction === "asc" ? "desc" : "asc"
        };
        renderGlossary();
      });
    });

    container.querySelectorAll(".inventory-drink-link").forEach(btn => {
      btn.addEventListener("click", () => {
        const itemId = btn.getAttribute("data-inventory-item-id");
        const item = inventory.find(i => i.id === itemId);
        if (!item) return;
        const recipes = getRecipesUsingItem(itemId);
        currentTab = "all";
        inventoryRecipeFilterIds = recipes.map(drink => drink.id);
        searchQuery = "";
        const searchInput = document.getElementById("search-input");
        if (searchInput) searchInput.value = "";
        renderApp();
        window.scrollTo({ top: 300, behavior: "smooth" });
      });
    });

    // Add "See drinks using this" click handlers
    container.querySelectorAll(".inv-used-in-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const ingId = btn.getAttribute("data-filter-ing");
        const found = inventory.find(i => i.id === ingId);
        if (found) {
          currentTab = "all";
          searchQuery = found.name.split(" ")[0];
          const searchInput = document.getElementById("search-input");
          if (searchInput) searchInput.value = searchQuery;
          renderApp();
          window.scrollTo({ top: 300, behavior: "smooth" });
        }
      });
    });

    const stockFilter = document.getElementById("inventory-stock-filter");
    if (stockFilter) {
      stockFilter.value = glossaryStockFilter;
      stockFilter.onchange = e => {
        glossaryStockFilter = e.target.value;
        renderGlossary();
      };
    }
    document.querySelectorAll(".inventory-view-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-inventory-view") === glossaryView);
      btn.onclick = () => {
        glossaryView = btn.getAttribute("data-inventory-view");
        renderGlossary();
      };
    });
  }

  // ==================== ADMINISTRATION & QUANTITY MANAGER ====================
  let adminSearchQuery = "";
  let adminCategoryFilter = "all";
  let adminStockFilter = "all";

  function renderAdminView() {
    const tableBody = document.getElementById("admin-inventory-table-body");
    const kpisEl = document.getElementById("admin-kpis");
    if (!tableBody) return;

    // Compute KPIs
    const totalItems = inventory.length;
    const inStockItems = inventory.filter(i => i.inStock && (i.quantity === undefined || i.quantity > 0)).length;
    const shoppingListItems = totalItems - inStockItems;
    const lowStockItems = inventory.filter(i => i.inStock && i.quantity !== undefined && i.quantity <= 1).length;

    if (kpisEl) {
      kpisEl.innerHTML = `
        <div class="admin-kpi-pill">
          <div class="admin-kpi-num">${totalItems}</div>
          <div class="admin-kpi-label">Catalog Items</div>
        </div>
        <div class="admin-kpi-pill">
          <div class="admin-kpi-num" style="color: #34d399;">${inStockItems}</div>
          <div class="admin-kpi-label">In Stock</div>
        </div>
        <div class="admin-kpi-pill">
          <div class="admin-kpi-num" style="color: #fbbf24;">${shoppingListItems}</div>
          <div class="admin-kpi-label">Shopping List</div>
        </div>
        <div class="admin-kpi-pill" style="border-color: ${lowStockItems > 0 ? "rgba(239, 68, 68, 0.4)" : "var(--border-subtle)"};">
          <div class="admin-kpi-num" style="color: #f87171;">${lowStockItems}</div>
          <div class="admin-kpi-label">Low Stock (≤1)</div>
        </div>
      `;
    }

    // Filter items for table
    let items = [...inventory];

    if (adminCategoryFilter !== "all") {
      items = items.filter(i => i.category === adminCategoryFilter);
    }

    if (adminStockFilter === "in-stock") {
      items = items.filter(i => i.inStock && (i.quantity === undefined || i.quantity > 0));
    } else if (adminStockFilter === "out-of-stock") {
      items = items.filter(i => !i.inStock || i.quantity === 0);
    } else if (adminStockFilter === "low-stock") {
      items = items.filter(i => i.inStock && i.quantity !== undefined && i.quantity <= 1);
    }

    if (adminSearchQuery.trim()) {
      const q = adminSearchQuery.toLowerCase().trim();
      items = items.filter(i => 
        i.name.toLowerCase().includes(q) || 
        (i.subCategory && i.subCategory.toLowerCase().includes(q)) ||
        (i.notes && i.notes.toLowerCase().includes(q)) ||
        (i.brand && i.brand.toLowerCase().includes(q))
      );
    }

    if (items.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            No inventory items match the current search or filters.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = items.map(item => {
      const isStocked = item.inStock && (item.quantity === undefined || item.quantity > 0);
      const qty = item.quantity !== undefined ? item.quantity : (item.inStock ? 1 : 0);
      const unit = item.unit || getDefaultUnit(item);
      const isLowStock = isStocked && qty <= 1;

      return `
        <tr data-id="${item.id}">
          <td style="text-align: center;">
            <label class="switch-container" title="${isStocked ? "In Stock (Click to mark Out of Stock)" : "Out of Stock (Click to mark In Stock)"}">
              <input type="checkbox" class="admin-stock-toggle" data-id="${item.id}" ${isStocked ? "checked" : ""}>
              <span class="switch-slider"></span>
            </label>
          </td>

          <td>
            <div class="item-meta-cell">
              <span class="item-title-text">${item.name}</span>
              <span class="item-subtext">${item.subCategory || ""} ${item.brand ? "• " + item.brand : ""}</span>
            </div>
          </td>

          <td>
            <span style="font-size: 0.76rem; color: var(--text-secondary); background: rgba(255,255,255,0.05); padding: 0.2rem 0.55rem; border-radius: var(--radius-full);">
              ${INVENTORY_CATEGORIES[item.category] || item.category}
            </span>
          </td>

          <td>
            <div style="display: flex; align-items: center;">
              <div class="admin-qty-stepper">
                <button class="qty-step-btn btn-qty-minus" data-id="${item.id}" title="Decrease quantity">−</button>
                <input type="number" class="qty-number-input" data-id="${item.id}" value="${qty}" min="0" step="1">
                <button class="qty-step-btn btn-qty-plus" data-id="${item.id}" title="Increase quantity">＋</button>
              </div>
              <span class="qty-unit-label">${unit}</span>
              ${isLowStock ? `<span class="warning-badge" title="Low stock alert!">Low</span>` : ""}
            </div>
          </td>

          <td>
            <span style="font-size: 0.78rem; color: var(--text-secondary); max-width: 320px; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.notes || ""}">
              ${item.notes || "—"}
            </span>
          </td>

          <td style="text-align: center;">
            <div style="display: inline-flex; gap: 0.4rem;">
              <button class="btn-edit-outline btn-admin-edit" data-id="${item.id}" title="Edit item details">Edit</button>
              <button class="btn-danger-outline btn-admin-delete" data-id="${item.id}" title="Delete item">✕</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Hook up table event listeners
    tableBody.querySelectorAll(".admin-stock-toggle").forEach(cb => {
      cb.addEventListener("change", (e) => {
        const id = cb.getAttribute("data-id");
        toggleItemStock(id);
      });
    });

    tableBody.querySelectorAll(".btn-qty-minus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        updateItemQuantity(id, -1);
      });
    });

    tableBody.querySelectorAll(".btn-qty-plus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        updateItemQuantity(id, 1);
      });
    });

    tableBody.querySelectorAll(".qty-number-input").forEach(input => {
      input.addEventListener("change", (e) => {
        const id = input.getAttribute("data-id");
        const val = parseFloat(input.value) || 0;
        setItemQuantity(id, val);
      });
    });

    tableBody.querySelectorAll(".btn-admin-edit").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        openEditItemModal(id);
      });
    });

    tableBody.querySelectorAll(".btn-admin-delete").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        deleteAdminItem(id);
      });
    });
  }

  function updateItemQuantity(id, delta) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const current = item.quantity !== undefined ? item.quantity : (item.inStock ? 1 : 0);
    const newQty = Math.max(0, current + delta);
    item.quantity = newQty;
    item.inStock = newQty > 0;
    saveInventory();
    renderAdminView();
    renderHeroStats();
  }

  function setItemQuantity(id, val) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, val);
    item.quantity = newQty;
    item.inStock = newQty > 0;
    saveInventory();
    renderAdminView();
    renderHeroStats();
  }

  function toggleItemStock(id) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const willBeStocked = !item.inStock;
    item.inStock = willBeStocked;
    if (willBeStocked) {
      if (item.quantity === undefined || item.quantity <= 0) item.quantity = 1;
    } else {
      item.quantity = 0;
    }
    saveInventory();
    renderAdminView();
    renderHeroStats();
  }

  function openAddItemModal() {
    document.getElementById("admin-item-modal-title").innerText = "Add New Inventory Item";
    document.getElementById("form-item-id").value = "";
    document.getElementById("form-item-name").value = "";
    document.getElementById("form-item-category").value = "spirits";
    document.getElementById("form-item-subcategory").value = "";
    document.getElementById("form-item-quantity").value = "1";
    document.getElementById("form-item-unit").value = "bottle";
    document.getElementById("form-item-notes").value = "";
    document.getElementById("form-item-in-stock").checked = true;

    const modal = document.getElementById("admin-item-modal-backdrop");
    if (modal) modal.classList.add("open");
  }

  function openEditItemModal(id) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    document.getElementById("admin-item-modal-title").innerText = `Edit: ${item.name}`;
    document.getElementById("form-item-id").value = item.id;
    document.getElementById("form-item-name").value = item.name;
    document.getElementById("form-item-category").value = item.category || "spirits";
    document.getElementById("form-item-subcategory").value = item.subCategory || "";
    document.getElementById("form-item-quantity").value = item.quantity !== undefined ? item.quantity : (item.inStock ? 1 : 0);
    document.getElementById("form-item-unit").value = item.unit || getDefaultUnit(item);
    document.getElementById("form-item-notes").value = item.notes || "";
    document.getElementById("form-item-in-stock").checked = item.inStock !== false && (item.quantity === undefined || item.quantity > 0);

    const modal = document.getElementById("admin-item-modal-backdrop");
    if (modal) modal.classList.add("open");
  }

  function closeAdminItemModal() {
    const modal = document.getElementById("admin-item-modal-backdrop");
    if (modal) modal.classList.remove("open");
  }

  function handleSaveAdminItem(e) {
    e.preventDefault();
    const id = document.getElementById("form-item-id").value.trim();
    const name = document.getElementById("form-item-name").value.trim();
    if (!name) return alert("Please enter an item name");

    const category = document.getElementById("form-item-category").value;
    const subCategory = document.getElementById("form-item-subcategory").value.trim();
    const quantity = parseFloat(document.getElementById("form-item-quantity").value) || 0;
    const unit = document.getElementById("form-item-unit").value;
    const notes = document.getElementById("form-item-notes").value.trim();
    const inStock = document.getElementById("form-item-in-stock").checked && quantity > 0;

    if (id) {
      // Edit existing
      const item = inventory.find(i => i.id === id);
      if (item) {
        item.name = name;
        item.category = category;
        item.subCategory = subCategory;
        item.quantity = quantity;
        item.unit = unit;
        item.notes = notes;
        item.inStock = inStock;
      }
    } else {
      // Add new
      const newId = "custom-inv-" + Date.now();
      inventory.push({
        id: newId,
        name: name,
        category: category,
        subCategory: subCategory || INVENTORY_CATEGORIES[category] || "Custom",
        quantity: quantity,
        unit: unit,
        notes: notes,
        inStock: inStock
      });
    }

    saveInventory();
    closeAdminItemModal();
    renderAdminView();
    renderHeroStats();
  }

  function deleteAdminItem(id) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    if (!confirm(`Are you sure you want to remove "${item.name}" from your inventory?`)) return;

    inventory = inventory.filter(i => i.id !== id);
    saveInventory();
    renderAdminView();
    renderHeroStats();
  }

  function exportInventoryJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inventory, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `speakeasy_bar_inventory_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function importInventoryJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const imported = JSON.parse(evt.target.result);
        if (Array.isArray(imported)) {
          inventory = imported;
          saveInventory();
          renderAdminView();
          renderHeroStats();
          alert("Inventory successfully restored from backup!");
        } else {
          alert("Invalid inventory backup file format.");
        }
      } catch (err) {
        alert("Error parsing backup file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function resetInventoryToDefault() {
    if (!confirm("Reset all inventory items and quantities to the factory default bar setup? Any custom-added bottles will be reset.")) return;
    localStorage.removeItem(STORAGE_KEY_INVENTORY);
    inventory = loadInventory();
    saveInventory();
    renderAdminView();
    renderHeroStats();
    alert("Inventory reset to default setup!");
  }

  // ==================== DRINK DETAIL MODAL ====================
  function openDrinkModal(drinkId) {
    const all = getAllDrinks();
    const drink = all.find(d => d.id === drinkId);
    if (!drink) return;

    const modalBackdrop = document.getElementById("drink-modal-backdrop");
    const modalContent = document.getElementById("drink-modal-content");
    if (!modalBackdrop || !modalContent) return;

    const categoryClass = drink.category.toLowerCase();
    const stock = getDrinkStockStatus(drink);
    const status = getDrinkStatus(drink.id);

    // Format ingredient measurement according to user preference
    function formatMeasurement(ing) {
      if (!ing.amountOz && !ing.amountMl) return "";
      if (unitPreference === "oz") {
        return ing.amountOz || ing.amountMl;
      } else if (unitPreference === "ml") {
        return ing.amountMl || ing.amountOz;
      } else {
        // Both
        if (ing.amountOz && ing.amountMl && ing.amountOz !== ing.amountMl) {
          return `${ing.amountOz} <span style="opacity:0.75; font-size:0.85em;">(${ing.amountMl})</span>`;
        }
        return ing.amountOz || ing.amountMl;
      }
    }

    function splitPreferenceList(value) {
      if (!value) return [];
      return String(value)
        .split(/[\/|]/)
        .flatMap(part => part.split(/\s+or\s+/i))
        .map(part => part.replace(/^\[|\]$/g, "").trim())
        .filter(Boolean);
    }

    const preferredSubstituteText = ing => {
      const list = splitPreferenceList(ing.substitute);
      if (!list.length) return "";
      return `<span class="ing-substitute"><strong>Substitute order:</strong> ${list.map((item, idx) => idx === 0 ? `[${item}]` : `[${item}]`).join(" → ")}</span>`;
    };

    const listableIngredients = drink.ingredients.filter(ing => String(ing.amountOz || "").toLowerCase() !== "garnish");
    const garnishEntries = drink.ingredients.filter(ing => String(ing.amountOz || "").toLowerCase() === "garnish");
    const garnishText = garnishEntries.length
      ? garnishEntries.map(ing => ing.item).join("; ")
      : (drink.garnish ? drink.garnish : "");

    const ingredientsHtml = listableIngredients.map(ing => {
      const inStock = isItemInStock(ing.inventoryId);
      const stockBadge = ing.inventoryId
        ? (inStock
            ? `<span class="ing-stock-badge status-ready">✓ In Bar</span>`
            : `<span class="ing-stock-badge status-missing">Need to Buy</span>`)
        : "";

      return `
        <li class="ingredient-row">
          <div class="ing-measure-item">
            <span class="ing-measure">${formatMeasurement(ing)}</span>
            <div class="ing-details">
              <span class="ing-name">${ing.item}</span>
              ${preferredSubstituteText(ing)}
            </div>
          </div>
          ${stockBadge}
        </li>
      `;
    }).join("");

    const garnishHtml = garnishText ? `
      <li class="ingredient-row garnish-row">
        <div class="ing-measure-item">
          <span class="ing-measure">Garnish</span>
          <div class="ing-details">
            <span class="ing-name">${garnishText}</span>
          </div>
        </div>
      </li>
    ` : "";

    const instructionsHtml = drink.instructions.map(step => {
      return `
        <li class="instruction-step">
          <span class="instruction-text">${step}</span>
        </li>
      `;
    }).join("");

    modalContent.innerHTML = `
      <div class="modal-header">
        <button class="modal-close-btn" id="modal-close-x" title="Close (Esc)">✕</button>
        <div class="modal-pretitle">
          <span class="drink-category-badge badge-${categoryClass}">${drink.category}</span>
          <span class="spec-val gold" style="font-size: 0.85rem; font-weight: 600;">Base: ${drink.baseSpirit || "Cocktail"}</span>
          ${stock.canMake 
            ? `<span class="bar-stock-indicator status-ready">✓ Ready to Make with Your Bar</span>` 
            : `<span class="bar-stock-indicator status-missing">Missing ${stock.missingCount} Ingredients</span>`}
        </div>
        <h2 class="modal-drink-title">${drink.name}</h2>
        ${drink.otherNames ? `<div class="modal-drink-aliases">Also known as: ${drink.otherNames}</div>` : ""}
        <div class="drink-actions"><button class="status-action ${status.tried ? "active" : ""}" data-status="tried">${status.tried ? "✓ Tried it" : "Mark as tried"}</button><button class="status-action ${status.constructed ? "active" : ""}" data-status="constructed">${status.constructed ? "⚗ Constructed" : "Mark as constructed"}</button></div>
      </div>

      <div class="modal-body">
        <!-- Specs Table -->
        <div class="specs-table-container">
          <div class="specs-table-title">Cocktail Specifications & Profile</div>
          <table class="specs-table">
            <tbody>
              <tr>
                <th>Glassware</th>
                <td>${drink.glassware || "Cocktail Glass"}</td>
              </tr>
              <tr>
                <th>Alcohol by Volume</th>
                <td><strong class="gold">${getAbv(drink)}</strong> · ${drink.alcoholLevel || "Standard"}</td>
              </tr>
              <tr>
                <th>Serving Volume</th>
                <td>${getDrinkVolume(drink)} <span class="spec-note">before ice dilution</span></td>
              </tr>
              <tr>
                <th>Taste Profile</th>
                <td>${drink.tasteProfile || "Balanced & Refreshing"}</td>
              </tr>
              <tr>
                <th>Difficulty Level</th>
                <td>${getDifficultyStars(drink.difficulty)} (${drink.difficulty}/5 Scale)</td>
              </tr>
              <tr>
                <th>Popularity Rating</th>
                <td><strong class="gold">★ ${drink.popularity ? drink.popularity.toFixed(1) : "9.5"} / 10</strong> (World Ranking)</td>
              </tr>
              <tr>
                <th>Category</th>
                <td>${drink.category}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Ingredients with Dual Measurements & Substitutes -->
        <div>
          <div class="modal-section-title">
            <span>Ingredients & Substitutions</span>
            <div class="unit-toggle-pills" id="modal-unit-pills">
              <button class="unit-pill ${unitPreference === "both" ? "active" : ""}" data-unit="both">Both (oz & ml)</button>
              <button class="unit-pill ${unitPreference === "oz" ? "active" : ""}" data-unit="oz">oz</button>
              <button class="unit-pill ${unitPreference === "ml" ? "active" : ""}" data-unit="ml">ml</button>
            </div>
          </div>
          <ul class="ingredients-list">
            ${ingredientsHtml}${garnishHtml}
          </ul>
        </div>

        <!-- Detailed Step-by-Step Instructions -->
        <div>
          <div class="modal-section-title">
            <span>Preparation Instructions</span>
          </div>
          <ol class="instructions-list">
            ${instructionsHtml}
          </ol>
        </div>

        <!-- Pro-Tip Section -->
        ${drink.proTip ? `
          <div class="pro-tip-box">
            <div class="pro-tip-icon">💡</div>
            <div>
              <div class="pro-tip-title">Speakeasy Pro-Tip & Bar Secret</div>
              <div class="pro-tip-content">${drink.proTip}</div>
            </div>
          </div>
        ` : ""}
      </div>
    `;

    // Add unit toggle in modal
    const unitPills = modalContent.querySelectorAll("#modal-unit-pills .unit-pill");
    unitPills.forEach(pill => {
      pill.addEventListener("click", (e) => {
        const u = pill.getAttribute("data-unit");
        unitPreference = u;
        localStorage.setItem(STORAGE_KEY_UNIT, u);
        openDrinkModal(drinkId); // refresh modal view
      });
    });

    modalContent.querySelectorAll(".status-action").forEach(button => {
      button.addEventListener("click", () => {
        toggleDrinkStatus(drinkId, button.dataset.status);
        openDrinkModal(drinkId);
      });
    });

    const closeBtn = document.getElementById("modal-close-x");
    if (closeBtn) closeBtn.addEventListener("click", closeDrinkModal);

    modalBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrinkModal() {
    const modalBackdrop = document.getElementById("drink-modal-backdrop");
    if (modalBackdrop) modalBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  // ==================== ADD CUSTOM RECIPE ====================
  function openAddRecipeModal() {
    const modal = document.getElementById("add-recipe-modal-backdrop");
    if (modal) modal.classList.add("open");
  }

  function closeAddRecipeModal() {
    const modal = document.getElementById("add-recipe-modal-backdrop");
    if (modal) modal.classList.remove("open");
  }

  function handleSaveCustomRecipe(e) {
    e.preventDefault();
    const name = document.getElementById("form-drink-name").value.trim();
    if (!name) return alert("Please enter a drink name");

    const category = document.getElementById("form-category").value;
    const baseSpirit = document.getElementById("form-base-spirit").value;
    const glassware = document.getElementById("form-glassware").value;
    const difficulty = parseInt(document.getElementById("form-difficulty").value, 10) || 2;
    const tasteProfile = document.getElementById("form-taste-profile").value.trim();
    const proTip = document.getElementById("form-pro-tip").value.trim();
    const ingredientsRaw = document.getElementById("form-ingredients").value.trim();
    const instructionsRaw = document.getElementById("form-instructions").value.trim();

    // Parse ingredients: one per line: "2 oz (60 ml) Gin [Sub: Vodka]"
    const ingredients = ingredientsRaw.split("\n").filter(l => l.trim()).map(line => {
      let item = line.trim();
      let substitute = "";
      let amountOz = "";
      let amountMl = "";

      // Check for substitute [Sub: ...]
      const subMatch = item.match(/\[(.*?)\]/);
      if (subMatch) {
        substitute = subMatch[1].replace(/sub:\s*/i, "").trim();
        item = item.replace(/\[(.*?)\]/, "").trim();
      }

      // Check for measurement
      const ozMatch = item.match(/^([\d\.\/\s]+(?:oz|dash|dashes|drop|drops|tsp|tbsp|cup|leaves|slices|whole)?)\s*(?:\((.*?)\))?\s*(.*)$/i);
      if (ozMatch) {
        amountOz = ozMatch[1].trim();
        amountMl = ozMatch[2] ? ozMatch[2].trim() : amountOz;
        item = ozMatch[3].trim();
      }

      return {
        amountOz: amountOz || "1 part",
        amountMl: amountMl || "30 ml",
        item: item || line.trim(),
        substitute: substitute
      };
    });

    const instructions = instructionsRaw.split("\n").filter(l => l.trim()).map(l => l.replace(/^\d+\.\s*/, "").trim());

    const newDrink = {
      id: "custom-" + Date.now(),
      name: name,
      otherNames: "Home Bar Original Experiment",
      category: category,
      baseSpirit: baseSpirit,
      glassware: glassware,
      alcoholLevel: category === "Mocktail" ? "Zero-Proof (0% ABV)" : "Medium (~18% ABV)",
      alcoholScore: category === "Mocktail" ? 0 : 3,
      tasteProfile: tasteProfile || "Custom Blend",
      difficulty: difficulty,
      popularity: 10.0,
      proTip: proTip,
      ingredients: ingredients,
      instructions: instructions.length ? instructions : ["Combine ingredients and enjoy!"],
      tags: ["experiment", "home-bar", "custom"]
    };

    customDrinks.unshift(newDrink);
    saveCustomDrinks();
    closeAddRecipeModal();
    renderApp();
    openDrinkModal(newDrink.id);
  }

  // ==================== FILTER RESET ====================
  function resetFilters() {
    searchQuery = "";
    inventoryRecipeFilterIds = null;
    selectedSpirit = "all";
    selectedDifficulty = "all";
    selectedTaste = "all";
    selectedGlass = "all";
    filterOnlyMyBar = false;
    sortBy = "popularity-desc";

    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) sortSelect.value = "popularity-desc";

    document.querySelectorAll(".pill-btn").forEach(p => {
      p.classList.remove("active");
      if (p.getAttribute("data-val") === "all") p.classList.add("active");
    });

    renderApp();
  }

  // ==================== EVENT LISTENERS ====================
  function setupEventListeners() {
    const mobileNavToggle = document.getElementById("mobile-nav-toggle");
    const primaryNavigation = document.getElementById("primary-navigation");
    if (mobileNavToggle && primaryNavigation) {
      mobileNavToggle.addEventListener("click", () => {
        const isOpen = primaryNavigation.classList.toggle("open");
        mobileNavToggle.setAttribute("aria-expanded", String(isOpen));
        mobileNavToggle.querySelector(".mobile-nav-toggle-icon").textContent = isOpen ? "×" : "☰";
      });

      primaryNavigation.addEventListener("click", event => {
        if (!event.target.closest(".nav-btn")) return;
        primaryNavigation.classList.remove("open");
        mobileNavToggle.setAttribute("aria-expanded", "false");
        mobileNavToggle.querySelector(".mobile-nav-toggle-icon").textContent = "☰";
      });
    }

    // Navigation tabs
    document.querySelectorAll(".nav-btn[data-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        currentTab = btn.getAttribute("data-tab");
        renderApp();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    // Search input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        inventoryRecipeFilterIds = null;
        searchQuery = e.target.value;
        renderDrinkCards();
      });
    }

    // Sort select
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        sortBy = e.target.value;
        renderDrinkCards();
      });
    }

    // Filter pills (Spirit)
    document.querySelectorAll(".filter-pills[data-filter='spirit'] .pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-pills[data-filter='spirit'] .pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedSpirit = btn.getAttribute("data-val");
        renderDrinkCards();
      });
    });

    // Filter pills (Difficulty)
    document.querySelectorAll(".filter-pills[data-filter='difficulty'] .pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-pills[data-filter='difficulty'] .pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedDifficulty = btn.getAttribute("data-val");
        renderDrinkCards();
      });
    });

    // Filter pills (Taste)
    document.querySelectorAll(".filter-pills[data-filter='taste'] .pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-pills[data-filter='taste'] .pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedTaste = btn.getAttribute("data-val");
        renderDrinkCards();
      });
    });

    // "Only In Stock" toggle button
    const myBarToggleBtn = document.getElementById("btn-my-bar-toggle");
    if (myBarToggleBtn) {
      myBarToggleBtn.addEventListener("click", () => {
        filterOnlyMyBar = !filterOnlyMyBar;
        myBarToggleBtn.classList.toggle("active", filterOnlyMyBar);
        renderDrinkCards();
      });
    }

    // Clear filters button
    const clearBtn = document.getElementById("btn-clear-filters");
    if (clearBtn) clearBtn.addEventListener("click", resetFilters);

    // Unit toggle button (header)
    const unitToggleBtn = document.getElementById("btn-unit-toggle");
    if (unitToggleBtn) {
      unitToggleBtn.addEventListener("click", () => {
        if (unitPreference === "both") unitPreference = "oz";
        else if (unitPreference === "oz") unitPreference = "ml";
        else unitPreference = "both";
        localStorage.setItem(STORAGE_KEY_UNIT, unitPreference);
        unitToggleBtn.innerHTML = `⚖ Units: <strong>${unitPreference.toUpperCase()}</strong>`;
        renderDrinkCards();
      });
      unitToggleBtn.innerHTML = `⚖ Units: <strong>${unitPreference.toUpperCase()}</strong>`;
    }

    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) themeSelect.addEventListener("change", () => {
      const choice = themeSelect.value;
      // The cookie is the hosted-site preference. localStorage mirrors it so previews
      // opened as local files still respond when browsers reject file:// cookies.
      document.cookie = `${THEME_COOKIE}=${encodeURIComponent(choice)}; max-age=31536000; path=/; SameSite=Lax`;
      localStorage.setItem(STORAGE_KEY_THEME, choice);
      applyTheme(choice);
    });

    // Modal backdrop click to close
    const modalBackdrop = document.getElementById("drink-modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) closeDrinkModal();
      });
    }

    // Add recipe modal triggers
    const btnAddRecipe = document.getElementById("btn-add-recipe");
    if (btnAddRecipe) btnAddRecipe.addEventListener("click", openAddRecipeModal);

    const btnCloseAddRecipe = document.getElementById("btn-close-add-recipe");
    if (btnCloseAddRecipe) btnCloseAddRecipe.addEventListener("click", closeAddRecipeModal);

    const addRecipeBackdrop = document.getElementById("add-recipe-modal-backdrop");
    if (addRecipeBackdrop) {
      addRecipeBackdrop.addEventListener("click", (e) => {
        if (e.target === addRecipeBackdrop) closeAddRecipeModal();
      });
    }

    const formAddRecipe = document.getElementById("form-add-recipe");
    if (formAddRecipe) formAddRecipe.addEventListener("submit", handleSaveCustomRecipe);

    // ==================== ADMIN VIEW LISTENERS ====================
    const adminSearch = document.getElementById("admin-search-input");
    if (adminSearch) {
      adminSearch.addEventListener("input", (e) => {
        adminSearchQuery = e.target.value;
        renderAdminView();
      });
    }

    const adminCatFilter = document.getElementById("admin-category-filter");
    if (adminCatFilter) {
      adminCatFilter.addEventListener("change", (e) => {
        adminCategoryFilter = e.target.value;
        renderAdminView();
      });
    }

    const adminStockFilterEl = document.getElementById("admin-stock-filter");
    if (adminStockFilterEl) {
      adminStockFilterEl.addEventListener("change", (e) => {
        adminStockFilter = e.target.value;
        renderAdminView();
      });
    }

    const btnAdminAdd = document.getElementById("btn-admin-add-item");
    if (btnAdminAdd) btnAdminAdd.addEventListener("click", openAddItemModal);

    const btnCloseAdminItem = document.getElementById("btn-close-admin-item");
    if (btnCloseAdminItem) btnCloseAdminItem.addEventListener("click", closeAdminItemModal);

    const formAdminItem = document.getElementById("form-admin-item");
    if (formAdminItem) formAdminItem.addEventListener("submit", handleSaveAdminItem);

    const btnAdminExport = document.getElementById("btn-admin-export");
    if (btnAdminExport) btnAdminExport.addEventListener("click", exportInventoryJSON);

    const btnAdminImport = document.getElementById("btn-admin-import");
    const adminImportFile = document.getElementById("admin-import-file");
    if (btnAdminImport && adminImportFile) {
      btnAdminImport.addEventListener("click", () => adminImportFile.click());
      adminImportFile.addEventListener("change", importInventoryJSON);
    }

    const btnAdminReset = document.getElementById("btn-admin-reset");
    if (btnAdminReset) btnAdminReset.addEventListener("click", resetInventoryToDefault);

    const adminItemBackdrop = document.getElementById("admin-item-modal-backdrop");
    if (adminItemBackdrop) {
      adminItemBackdrop.addEventListener("click", (e) => {
        if (e.target === adminItemBackdrop) closeAdminItemModal();
      });
    }

    // Keyboard shortcuts (Escape closes modals)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDrinkModal();
        closeAddRecipeModal();
        closeAdminItemModal();
      }
    });
  }

  // ==================== INITIALIZATION ====================
  function init() {
    applyTheme();
    setupEventListeners();
    renderApp();
    setInterval(() => { if (getThemePreference() === "auto") applyTheme(); }, 60000);
  }

  // Expose on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
