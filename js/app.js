/**
 * BOON'S HOME BAR APP
 * Interactive Controller for Cocktails, Mocktails, Shots & Inventory
 */

(function () {
  "use strict";

  // ==================== SHARED SVG CONSTANTS ====================
  const SNOWFLAKE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="12" y1="6" x2="9" y2="3"></line><line x1="12" y1="6" x2="15" y2="3"></line><line x1="12" y1="18" x2="9" y2="21"></line><line x1="12" y1="18" x2="15" y2="21"></line><line x1="3.34" y1="7" x2="20.66" y2="17"></line><line x1="6.8" y1="9" x2="3.8" y2="10.73"></line><line x1="6.8" y1="9" x2="5.07" y2="6"></line><line x1="17.2" y1="15" x2="20.2" y2="13.27"></line><line x1="17.2" y1="15" x2="18.93" y2="18"></line><line x1="3.34" y1="17" x2="20.66" y2="7"></line><line x1="6.8" y1="15" x2="5.07" y2="18"></line><line x1="6.8" y1="15" x2="3.8" y2="13.27"></line><line x1="17.2" y1="9" x2="18.93" y2="6"></line><line x1="17.2" y1="9" x2="20.2" y2="10.73"></line></svg>`;

  let DOM = {};
  // ==================== STATE MANAGEMENT ====================
  const STORAGE_KEY_INVENTORY = "speakeasy_inventory_v2";
  const STORAGE_KEY_INVENTORY_UPDATE = `speakeasy_inventory_update_${INVENTORY_SYNC_VERSION}`;
  const STORAGE_KEY_CUSTOM_DRINKS = "speakeasy_custom_drinks_v1";
  const STORAGE_KEY_UNIT = "speakeasy_unit_pref_v1";
  const STORAGE_KEY_DRINK_STATUS = "speakeasy_drink_status_v1";
  const STORAGE_KEY_THEME = "speakeasy_theme_pref_v1";
  const STORAGE_KEY_FILTERS_COLLAPSED = "speakeasy_filters_collapsed_v1";
  const THEME_COOKIE = "speakeasy_theme";
  const inventoryStore = window.BoonBarInventoryStore;
  const { getDefaultUnit, getDefaultQuantity } = inventoryStore;
  const { escapeHTML } = window.BoonBarUIUtils;
  const { getDrinkVolume, getAbv, getDrinkAbvValue, parseAbvText, getInventoryAbv } = window.BoonBarRecipeUtils;
  const { showModal, hideModal, keepFocusInOpenModal } = window.BoonBarModal;

  let inventory = loadInventory();
  let customDrinks = loadCustomDrinks();
  let drinkStatuses = loadDrinkStatuses();
  let unitPreference = localStorage.getItem(STORAGE_KEY_UNIT) || "both"; // "both", "oz", "ml"
  let filtersCollapsed = localStorage.getItem(STORAGE_KEY_FILTERS_COLLAPSED) !== "false"; // default to collapsed to save space

  let currentTab = "all"; // "all", "cocktails", "mocktails", "shots", "glossary"
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
  function loadInventory() {
    return inventoryStore.loadInventory({
      storage: localStorage,
      storageKey: STORAGE_KEY_INVENTORY,
      updateKey: STORAGE_KEY_INVENTORY_UPDATE,
      defaultInventory: DEFAULT_INVENTORY,
      categories: INVENTORY_CATEGORIES,
      overrides: INVENTORY_UPDATE_OVERRIDES,
      removedIds: INVENTORY_UPDATE_REMOVE_IDS
    });
  }

  function saveInventory() {
    inventoryStore.saveInventory(localStorage, STORAGE_KEY_INVENTORY, inventory);
  }

  function loadCustomDrinks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_DRINKS);
      const parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(drink =>
        drink && typeof drink.id === "string" && typeof drink.name === "string" &&
        ["Cocktail", "Mocktail", "Shot"].includes(drink.category) &&
        ["otherNames", "baseSpirit", "glassware", "alcoholLevel", "tasteProfile", "proTip"].every(key => drink[key] === undefined || drink[key] === null || typeof drink[key] === "string") &&
        Array.isArray(drink.ingredients) && drink.ingredients.every(ing => ing && typeof ing.item === "string" &&
          ["amountOz", "amountMl", "substitute", "inventoryId", "ingredientGroup"].every(key => ing[key] === undefined || ing[key] === null || typeof ing[key] === "string")) &&
        Array.isArray(drink.instructions) && drink.instructions.every(step => typeof step === "string") &&
        (drink.tags === undefined || (Array.isArray(drink.tags) && drink.tags.every(tag => typeof tag === "string")))
      ).map(drink => ({
        ...drink,
        difficulty: Math.max(1, Math.min(5, Number(drink.difficulty) || 2)),
        popularity: Number.isFinite(Number(drink.popularity)) ? Number(drink.popularity) : 5,
        tools: Array.isArray(drink.tools) ? drink.tools.filter(tool => typeof tool === "string") : undefined
      }));
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

  function getRecipesUsingItem(itemId) {
    return getAllDrinks().filter(drink =>
      drink.ingredients.some(ing => {
        if (!ing.inventoryId && !ing.ingredientGroup) return false;
        return ing.inventoryId === itemId ||
          inventory.some(i => i.id === ing.inventoryId && i.aliasOf === itemId) ||
          getIngredientCandidates(ing).includes(itemId);
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
    if (ingredient.ingredientGroup && Object.prototype.hasOwnProperty.call(INGREDIENT_GROUPS, ingredient.ingredientGroup)) return ingredient.ingredientGroup;
    if (Object.prototype.hasOwnProperty.call(INGREDIENT_GROUPS, ingredient.inventoryId)) return ingredient.inventoryId;
    if (Object.prototype.hasOwnProperty.call(INGREDIENT_GROUP_BY_INVENTORY_ID, ingredient.inventoryId)) return INGREDIENT_GROUP_BY_INVENTORY_ID[ingredient.inventoryId];
    if (Object.prototype.hasOwnProperty.call(INGREDIENT_GROUPS_BY_INVENTORY_ID, ingredient.inventoryId) && INGREDIENT_GROUPS_BY_INVENTORY_ID[ingredient.inventoryId].length) {
      return INGREDIENT_GROUPS_BY_INVENTORY_ID[ingredient.inventoryId][0];
    }
    return `inventory:${ingredient.inventoryId}`;
  }

  function getIngredientCandidates(ingredient) {
    const groupId = getIngredientGroupId(ingredient);
    const group = Object.prototype.hasOwnProperty.call(INGREDIENT_GROUPS, groupId) ? INGREDIENT_GROUPS[groupId] : null;
    return group && group.inventoryIds && group.inventoryIds.length ? group.inventoryIds : [ingredient.inventoryId].filter(Boolean);
  }

  function getInventoryItem(inventoryId) {
    return inventory.find(item => item.id === inventoryId || (item.aliasOf && item.aliasOf === inventoryId));
  }

  function getIngredientInventoryOptions(ingredient) {
    const candidateIds = [...new Set(getIngredientCandidates(ingredient).filter(Boolean))];
    return candidateIds
      .map(candidateId => getInventoryItem(candidateId))
      .filter(Boolean);
  }

  function getInventoryOptionStatus(item) {
    if (item.inStock && (item.quantity === undefined || item.quantity > 0)) {
      return { label: "In stock", className: "in-stock" };
    }
    return { label: item.incoming ? "Incoming" : "Out of stock", className: item.incoming ? "incoming" : "out-of-stock" };
  }

  function isItemInStock(inventoryId, ingredient) {
    const candidates = getIngredientCandidates({ ...(ingredient || {}), inventoryId: inventoryId || ingredient?.inventoryId });
    return candidates.some(candidateId => {
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
    const untrackedItems = [];

    drink.ingredients.forEach(ing => {
      if (ing.inventoryId || (ing.ingredientGroup && Object.prototype.hasOwnProperty.call(INGREDIENT_GROUPS, ing.ingredientGroup))) {
        totalStockable++;
        if (!isItemInStock(ing.inventoryId, ing)) {
          missingCount++;
          const group = INGREDIENT_GROUPS[getIngredientGroupId(ing)];
          missingItems.push(group ? group.label : ing.item);
          if (isPerishableIngredient(ing)) missingFreshProduce.push(group ? group.label : ing.item);
        }
      } else if (ing.item) {
        untrackedItems.push(ing.item);
      }
    });

    return {
      canMake: missingCount === 0 && untrackedItems.length === 0,
      missingCount: missingCount,
      missingItems: missingItems,
      missingFreshProduce,
      totalStockable: totalStockable,
      untrackedItems
    };
  }

  // ==================== FILTER & SORT LOGIC ====================
  function matchesSpirit(drink, spiritVal) {
    if (!spiritVal || spiritVal === "all") return true;
    const base = String(drink.baseSpirit || "");
    if (spiritVal === "Whiskey/Bourbon") {
      return /whiskey|bourbon|scotch|rye/i.test(base);
    }
    if (spiritVal === "Tequila/Mezcal") {
      return /tequila|mezcal/i.test(base);
    }
    if (spiritVal === "Liqueur/Wine") {
      return /liqueur|wine|brandy|cognac|champagne|pisco|amaro|vermouth/i.test(base);
    }
    if (spiritVal === "Non-Alcoholic") {
      return base === "Non-Alcoholic" || drink.category === "Mocktail";
    }
    if (spiritVal === "Gin") {
      return /gin/i.test(base);
    }
    if (spiritVal === "Vodka") {
      return /vodka/i.test(base);
    }
    if (spiritVal === "Rum") {
      return /rum|cachaça|cachaca/i.test(base);
    }
    return base.toLowerCase().includes(spiritVal.toLowerCase());
  }

  function getFilteredAndSortedDrinks() {
    let drinks = getAllDrinks();

    // Tab filter
    if (currentTab === "cocktails") {
      drinks = drinks.filter(d => d.category === "Cocktail");
    } else if (currentTab === "mocktails") {
      drinks = drinks.filter(d => d.category === "Mocktail");
    } else if (currentTab === "shots") {
      drinks = drinks.filter(d => d.category === "Shot");
    }

    // Secondary filters
    if (filterOnlyMyBar) {
      drinks = drinks.filter(d => getDrinkStockStatus(d).canMake);
    }

    if (selectedSpirit !== "all") {
      drinks = drinks.filter(d => matchesSpirit(d, selectedSpirit));
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
      const tokens = q.split(/\s+/).filter(t => t.length > 0);

      drinks = drinks.filter(d => {
        const searchableFields = [
          d.name,
          d.otherNames || "",
          d.baseSpirit || "",
          d.category || "",
          d.tasteProfile || "",
          ...(d.tags || []),
          ...d.ingredients.map(ing => ing.item),
          ...d.ingredients.map(ing => {
            if (!ing.inventoryId) return "";
            const inv = getInventoryItem(ing.inventoryId);
            return inv ? inv.name : "";
          }),
          ...d.ingredients.map(ing => {
            if (!ing.ingredientGroup || !INGREDIENT_GROUPS[ing.ingredientGroup]) return "";
            return INGREDIENT_GROUPS[ing.ingredientGroup].label;
          })
        ].map(s => s.toLowerCase());

        return tokens.every(token => searchableFields.some(field => field.includes(token)));
      });
    }

    // Sorting
    drinks.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "popularity-desc": {
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            const aNameMatch = a.name.toLowerCase().includes(q) || (a.otherNames && a.otherNames.toLowerCase().includes(q));
            const bNameMatch = b.name.toLowerCase().includes(q) || (b.otherNames && b.otherNames.toLowerCase().includes(q));
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;
          }
          return (b.popularity || 0) - (a.popularity || 0);
        }
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

    const { catalogView, glossaryView, adminView } = DOM;

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
      updateFilterCollapseState();
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

    const statsEl = DOM.heroStats || document.getElementById("hero-stats");
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-pill">🍸 Cocktails: <strong>${cocktails}</strong></div>
        <div class="stat-pill">🍹 Mocktails: <strong>${mocktails}</strong></div>
        <div class="stat-pill">🥃 Shots: <strong>${shots}</strong></div>
        <div class="stat-pill">🍾 In Bar: <strong>${inStockBottles} / ${totalBottles}</strong></div>
        <div class="stat-pill stat-pill-ready">
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
      coupe: `<svg class="glass-icon" viewBox="0 0 96 96" role="img" aria-label="${escapeHTML(drink.glassware || "Coupe glass")}"><path d="M20 20h56L64 42c-4 8-11 13-16 14v17h12v5H36v-5h12V56c-5-1-12-6-16-14L20 20Z"/><path d="M28 27h40"/></svg>`,
      rocks: `<svg class="glass-icon" viewBox="0 0 96 96" role="img" aria-label="${escapeHTML(drink.glassware || "Rocks glass")}"><path d="M23 25h50l-5 46H28l-5-46Z"/><path d="M28 35h40M34 52h28"/></svg>`,
      highball: `<svg class="glass-icon" viewBox="0 0 96 96" role="img" aria-label="${escapeHTML(drink.glassware || "Highball glass")}"><path d="M29 15h38l-5 64H34l-5-64Z"/><path d="M31 27h34M34 58h28"/></svg>`,
      flute: `<svg class="glass-icon" viewBox="0 0 96 96" role="img" aria-label="${escapeHTML(drink.glassware || "Flute glass")}"><path d="M31 15h34L58 48c-2 6-5 10-10 12-5-2-8-6-10-12L31 15Z"/><path d="M48 60v18M38 82h20M35 23h26"/></svg>`,
      shot: `<svg class="glass-icon" viewBox="0 0 96 96" role="img" aria-label="${escapeHTML(drink.glassware || "Shot glass")}"><path d="M30 29h36l-4 40H34l-4-40Z"/><path d="M32 37h32"/></svg>`
    };

    return { icon: glassIcons[glassShape], color };
  }

  function renderDrinkCards() {
    const drinks = getFilteredAndSortedDrinks();
    const container = DOM.drinksGrid || document.getElementById("drinks-grid");
    const countEl = DOM.resultsCount || document.getElementById("results-count");

    if (countEl) {
      countEl.innerHTML = `Showing <strong>${drinks.length}</strong> drink${drinks.length === 1 ? "" : "s"}`;
    }

    if (!container) return;

    if (drinks.length === 0) {
      container.innerHTML = `
        <div class="drinks-grid-empty">
          <div class="drinks-grid-empty-icon">🍸</div>
          <h3 class="drinks-grid-empty-title">No drinks found</h3>
          <p class="drinks-grid-empty-text">Try clearing some filters or searching for a different spirit, cocktail name, or ingredient.</p>
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
      const categoryClass = escapeHTML(drink.category.toLowerCase());
      const status = getDrinkStatus(drink.id);

      const stockBadge = stock.canMake
        ? `<span class="bar-stock-indicator status-ready">✓ In Stock</span>`
        : stock.untrackedItems.length
          ? `<span class="bar-stock-indicator status-missing" title="Not linked to inventory: ${escapeHTML(stock.untrackedItems.join(', '))}">${stock.missingCount ? `Need ${stock.missingCount} · ` : ""}Check ${stock.untrackedItems.length}</span>`
          : `<span class="bar-stock-indicator status-missing" title="Missing: ${escapeHTML(stock.missingItems.slice(0, 2).join(', '))}">Need ${stock.missingCount}</span>`;
      const freshProduceBadge = stock.missingFreshProduce.length
        ? `<span class="fresh-produce-indicator" title="Missing: ${escapeHTML(stock.missingFreshProduce.join(', '))}">🥬 Missing Fresh Produce</span>`
        : "";
      const visual = getDrinkVisual(drink);

      // Ingredients preview (up to 4 tags)
      const ingPreview = drink.ingredients.slice(0, 4).map(i => {
        const shortName = i.item.split("(")[0].trim();
        return `<span class="preview-tag">${escapeHTML(shortName)}</span>`;
      }).join("");

      return `
        <div class="drink-card card-${categoryClass}" data-id="${escapeHTML(drink.id)}" role="button" tabindex="0" aria-label="View ${escapeHTML(drink.name)} recipe">
          <div class="card-top-bar">
            <span class="drink-category-badge badge-${categoryClass}">${escapeHTML(drink.category)}</span>
            <div class="card-statuses">${status.tried ? `<span class="drink-status tried">✓ Tried</span>` : ""}${status.constructed ? `<span class="drink-status constructed">⚗ Made</span>` : ""}${stockBadge}${freshProduceBadge}</div>
          </div>

          <div class="drink-card-visual" style="--drink-accent: ${visual.color};">${visual.icon}</div>

          <div class="card-title-block">
            <h3 class="drink-name">${escapeHTML(drink.name)}</h3>
            ${drink.otherNames ? `<span class="drink-alias">${escapeHTML(drink.otherNames)}</span>` : ""}
          </div>

          <div class="card-specs-row">
            <div class="spec-item">
              <span class="spec-key">Glass</span>
              <span class="spec-val">${escapeHTML(drink.glassware || "Cocktail")}</span>
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
            <span class="drink-base-label">${escapeHTML(drink.baseSpirit || drink.category)}</span>
            <span class="view-recipe-link">View Recipe →</span>
          </div>
        </div>
      `;
    }).join("");

    // Add click listeners to cards
    container.querySelectorAll(".drink-card").forEach(card => {
      const openCard = () => {
        const id = card.getAttribute("data-id");
        openDrinkModal(id);
      };
      card.addEventListener("click", openCard);
      card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openCard();
        }
      });
    });
  }

  // ==================== GLOSSARY & INVENTORY ====================
  function itemNeedsRefrigeration(item) {
    return Boolean(item && item.refrigerate);
  }

  function renderRefrigerateBadge(item) {
    if (!itemNeedsRefrigeration(item)) return "";
    return `<span class="inv-badge-refrigerate" title="Keep Refrigerated" aria-label="Keep Refrigerated">${SNOWFLAKE_SVG}</span>`;
  }


  function renderPremiumBadge(item) {
    if (!item || !item.premium) return "";
    return `<span class="inv-badge-premium" title="Reserve spirit — best enjoyed in spirit-forward or lightly modified cocktails where its complexity can shine">✦ Reserve</span>`;
  }

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
          <div class="inv-stat-num text-status-success">${inStock}</div>
          <div class="inv-stat-label">In My Bar</div>
        </div>
        <div class="inv-stat-item">
          <div class="inv-stat-num text-status-warning">${shoppingList}</div>
          <div class="inv-stat-label">Shopping List</div>
        </div>
        ${incoming ? `<div class="inv-stat-item">
          <div class="inv-stat-num text-status-info">${incoming}</div>
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
          <div class="inventory-stock-key">
            <span><i class="stock-key-dot shelf"></i>Shelf-Stable Bottles</span>
            <span><span class="stock-key-refrigerate-icon">${SNOWFLAKE_SVG}</span>Keep Refrigerated</span>
          </div>
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
              return `<tr class="${itemNeedsRefrigeration(item) ? 'needs-refrigeration' : ''}">
                <td><label class="inventory-table-item"><input type="checkbox" class="inv-checkbox" data-id="${escapeHTML(item.id)}" ${item.inStock ? "checked" : ""}><span>${escapeHTML(item.name)}</span>${renderPremiumBadge(item)}${renderRefrigerateBadge(item)}</label></td>
                <td>${escapeHTML(INVENTORY_CATEGORIES[item.category] || item.category || "—")}</td>
                <td>${escapeHTML(item.subCategory || "—")}</td>
                <td><span class="inv-badge-stock ${status === "in-stock" ? "stock" : status === "incoming" ? "incoming" : "needed"}">${statusLabel(status)}</span></td>
                <td>${getInventoryAbv(item)}</td>
                <td>${quantity} ${escapeHTML(item.unit || getDefaultUnit(item))}</td>
                <td>${usableRecipes.length ? `<button class="inventory-drink-link" data-inventory-item-id="${escapeHTML(item.id)}">${linkLabel}</button>` : "—"}</td>
              </tr>`;
            }).join("")}</tbody>
          </table>
        </div>` : `<div class="inventory-empty-state">No inventory items match this filter.</div>`;
    } else {
    // Group visible inventory by category for the list view.
    const grouped = Object.create(null);
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
        const quantity = item.quantity !== undefined ? item.quantity : getDefaultQuantity(item);
        const unit = item.unit || getDefaultUnit(item);
        const abvDisplay = getInventoryAbv(item);
        const showAbv = abvDisplay !== "—" && (item.category === "spirits" || item.category === "liqueurs" || item.category === "fortified" || item.category === "sparkling");
        return `
          <div class="inventory-item-card ${item.inStock ? "in-stock" : "shopping-list"}" data-item-id="${escapeHTML(item.id)}">
            <input type="checkbox" class="inv-checkbox" data-id="${escapeHTML(item.id)}" ${item.inStock ? "checked" : ""}>
            <div class="inv-content">
              <div class="inv-name-row">
                <span class="inv-name">${escapeHTML(item.name)}</span>
                <div class="inv-badges-wrap">
                  ${renderPremiumBadge(item)}
                  ${renderRefrigerateBadge(item)}
                  <span class="inv-badge-stock ${item.inStock ? "stock" : item.incoming ? "incoming" : "needed"}">
                    ${stockLabel}
                  </span>
                </div>
              </div>
              <div class="inv-meta">${escapeHTML(item.subCategory || "")}${showAbv ? " • " + escapeHTML(abvDisplay) : ""}${item.inStock ? " • " + quantity + " " + escapeHTML(unit) : ""}${item.proof ? " • " + escapeHTML(item.proof) : ""}</div>
              ${item.notes ? `<div class="inv-notes">${escapeHTML(item.notes)}</div>` : ""}
              <button class="inv-used-in-btn" data-filter-ing="${escapeHTML(item.id)}">See drinks using this →</button>
            </div>
          </div>
        `;
      };

      // Group items by subCategory for categories that benefit from it
      const groupBySubCategory = (items) => {
        const groups = Object.create(null);
        items.forEach(item => {
          const sub = item.subCategory || "Other";
          if (!groups[sub]) groups[sub] = [];
          groups[sub].push(item);
        });
        return groups;
      };

      let itemCards;
      if (catKey === "spirits") {
        itemCards = Object.entries(items.reduce((families, item) => {
            const family = item.spiritFamily || "Other Spirits";
            const style = item.spiritStyle || item.subCategory || "Other";
            if (!Object.prototype.hasOwnProperty.call(families, family)) families[family] = Object.create(null);
            if (!Object.prototype.hasOwnProperty.call(families[family], style)) families[family][style] = [];
            families[family][style].push(item);
            return families;
          }, Object.create(null))).map(([family, styles]) => `
            <section class="spirit-family-group">
              <h4>${escapeHTML(family)}</h4>
              ${Object.entries(styles).map(([style, styleItems]) => `
                <div class="spirit-style-group">
                  <h5>${escapeHTML(style)}</h5>
                  <div class="inventory-grid inventory-list-grid">${styleItems.map(renderItemCard).join("")}</div>
                </div>
              `).join("")}
            </section>
          `).join("");
      } else if (catKey === "liqueurs" || catKey === "fortified" || catKey === "mixers_sodas") {
        const subGroups = groupBySubCategory(items);
        itemCards = Object.entries(subGroups).map(([subCat, subItems]) => `
          <div class="spirit-style-group">
            <h5>${escapeHTML(subCat)}</h5>
            <div class="inventory-grid inventory-list-grid">${subItems.map(renderItemCard).join("")}</div>
          </div>
        `).join("");
      } else {
        itemCards = `<div class="inventory-grid inventory-list-grid">${items.map(renderItemCard).join("")}</div>`;
      }

      return `
        <div class="inventory-category-group">
          <div class="category-header-title">
            <h3>${escapeHTML(title)} (${items.filter(i => i.inStock).length}/${items.length} In Stock)</h3>
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
          // Recipe availability requires both the stock flag and a positive quantity.
          // Restore a usable quantity when an item is checked back into stock.
          if (checked && (item.quantity === undefined || item.quantity <= 0)) {
            item.quantity = 1;
          }
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
        if (inventory.find(i => i.id === itemId)) navigateToRecipesForItem(itemId);
      });
    });

    // Add "See drinks using this" click handlers
    container.querySelectorAll(".inv-used-in-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const ingId = btn.getAttribute("data-filter-ing");
        if (inventory.find(i => i.id === ingId)) navigateToRecipesForItem(ingId);
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

  function navigateToRecipesForItem(itemId) {
    const recipes = getRecipesUsingItem(itemId);
    currentTab = "all";
    inventoryRecipeFilterIds = recipes.map(drink => drink.id);
    searchQuery = "";
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";
    renderApp();
    window.scrollTo({ top: 300, behavior: "smooth" });
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
          <div class="admin-kpi-num text-status-success">${inStockItems}</div>
          <div class="admin-kpi-label">In Stock</div>
        </div>
        <div class="admin-kpi-pill">
          <div class="admin-kpi-num text-status-warning">${shoppingListItems}</div>
          <div class="admin-kpi-label">Shopping List</div>
        </div>
        <div class="admin-kpi-pill${lowStockItems > 0 ? " admin-kpi-pill-alert" : ""}">
          <div class="admin-kpi-num text-status-danger">${lowStockItems}</div>
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
          <td colspan="6" class="inventory-empty-cell">
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
        <tr data-id="${escapeHTML(item.id)}" class="${itemNeedsRefrigeration(item) ? 'needs-refrigeration' : ''}">
          <td class="inventory-action-cell">
            <label class="switch-container" title="${isStocked ? "In Stock (Click to mark Out of Stock)" : "Out of Stock (Click to mark In Stock)"}">
              <input type="checkbox" class="admin-stock-toggle" data-id="${escapeHTML(item.id)}" ${isStocked ? "checked" : ""}>
              <span class="switch-slider"></span>
            </label>
          </td>

          <td>
            <div class="item-meta-cell">
              <div class="item-title-row">
                <span class="item-title-text">${escapeHTML(item.name)}</span>
                ${renderRefrigerateBadge(item)}
              </div>
              <span class="item-subtext">${escapeHTML(item.subCategory || "")} ${item.brand ? "• " + escapeHTML(item.brand) : ""}</span>
            </div>
          </td>

          <td>
            <span class="admin-category-chip">
              ${escapeHTML(INVENTORY_CATEGORIES[item.category] || item.category)}
            </span>
          </td>

          <td>
            <div class="admin-quantity-cell">
              <div class="admin-qty-stepper">
                <button class="qty-step-btn btn-qty-minus" data-id="${escapeHTML(item.id)}" title="Decrease quantity">−</button>
                <input type="number" class="qty-number-input" data-id="${escapeHTML(item.id)}" value="${qty}" min="0" step="1">
                <button class="qty-step-btn btn-qty-plus" data-id="${escapeHTML(item.id)}" title="Increase quantity">＋</button>
              </div>
              <span class="qty-unit-label">${escapeHTML(unit)}</span>
              ${isLowStock ? `<span class="warning-badge" title="Low stock alert!">Low</span>` : ""}
            </div>
          </td>

          <td>
            <span class="admin-notes-cell" title="${escapeHTML(item.notes || "")}">
              ${escapeHTML(item.notes || "—")}
            </span>
          </td>

          <td class="inventory-action-cell">
            <div class="inventory-row-actions">
              <button class="btn-edit-outline btn-admin-edit" data-id="${escapeHTML(item.id)}" title="Edit item details">Edit</button>
              <button class="btn-danger-outline btn-admin-delete" data-id="${escapeHTML(item.id)}" title="Delete item">✕</button>
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

  function setItemQuantityDirect(id, newQty) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    item.quantity = Math.max(0, newQty);
    item.inStock = item.quantity > 0;
    saveInventory();
    renderAdminView();
    renderHeroStats();
  }

  function updateItemQuantity(id, delta) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const current = item.quantity !== undefined ? item.quantity : (item.inStock ? 1 : 0);
    setItemQuantityDirect(id, current + delta);
  }

  function setItemQuantity(id, val) {
    setItemQuantityDirect(id, val);
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
    const refrigEl = document.getElementById("form-item-refrigerate");
    if (refrigEl) refrigEl.checked = false;

    const modal = document.getElementById("admin-item-modal-backdrop");
    showModal(modal, "#form-item-name");
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
    const refrigEl = document.getElementById("form-item-refrigerate");
    if (refrigEl) refrigEl.checked = Boolean(item.refrigerate);

    const modal = document.getElementById("admin-item-modal-backdrop");
    showModal(modal, "#form-item-name");
  }

  function closeAdminItemModal() {
    const modal = document.getElementById("admin-item-modal-backdrop");
    hideModal(modal);
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
    const refrigEl = document.getElementById("form-item-refrigerate");
    const refrigerate = refrigEl ? refrigEl.checked : false;

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
        item.refrigerate = refrigerate;
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
        inStock: inStock,
        refrigerate: refrigerate
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
        if (Array.isArray(imported) && imported.length && imported.every(item => inventoryStore.isValidInventoryRecord(item, INVENTORY_CATEGORIES))) {
          const importedIds = imported.map(item => item.id.trim());
          if (new Set(importedIds).size !== importedIds.length) {
            alert("Invalid inventory backup: item IDs must be unique.");
            return;
          }
          const normalized = imported.map(inventoryStore.normalizeInventoryRecord);
          inventory = inventoryStore.mergeInventoryRecords(normalized, DEFAULT_INVENTORY, INVENTORY_UPDATE_REMOVE_IDS);
          saveInventory();
          renderAdminView();
          renderHeroStats();
          alert("Inventory successfully restored from backup!");
        } else {
          alert("Invalid inventory backup: expected a non-empty array of items with valid IDs, names, categories, stock flags, quantities, and units.");
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

  // ==================== INGREDIENT FORMATTING HELPERS ====================
  function formatMeasurement(ing) {
    if (!ing.amountOz && !ing.amountMl) return "";
    if (unitPreference === "oz") {
      return ing.amountOz || ing.amountMl;
    } else if (unitPreference === "ml") {
      return ing.amountMl || ing.amountOz;
    } else {
      if (ing.amountOz && ing.amountMl && ing.amountOz !== ing.amountMl) {
        return `${escapeHTML(ing.amountOz)} <span class="measurement-secondary">(${escapeHTML(ing.amountMl)})</span>`;
      }
      return escapeHTML(ing.amountOz || ing.amountMl);
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

  function preferredSubstituteText(ing) {
    const list = splitPreferenceList(ing.substitute);
    if (!list.length) return "";
    return `<span class="ing-substitute"><strong>Substitute order:</strong> ${list.map(item => `[${escapeHTML(item)}]`).join(" → ")}</span>`;
  }

  // ==================== DRINK DETAIL MODAL ====================
  function getDrinkTools(drink) {
    if (Array.isArray(drink.tools)) return drink.tools;

    const method = (drink.instructions || []).join(" ").toLowerCase();
    const ingredients = (drink.ingredients || [])
      .filter(ing => String(ing.amountOz || "").toLowerCase() !== "garnish")
      .map(ing => String(ing.item || "").toLowerCase());
    const glassware = String(drink.glassware || "").toLowerCase();
    const drinkName = String(drink.name || "").toLowerCase();
    const tools = ["Jigger or measuring cup"];

    const isLayeredShot = drink.category === "Shot" && Array.isArray(drink.tags) && drink.tags.includes("layered");
    if (isLayeredShot || /bar spoon|back of (a )?spoon|spoon back|over a spoon/.test(method)) tools.push("Bar spoon");
    const activelyShakes = /\b(?:dry |wet |flash )?(?:shake|shakes|shaken|shaking)\b/.test(method) && !/\bshake\s+\d+\s+dashes\b/.test(method);
    const mixesInShaker = /\b(?:add|pour|combine|place|put|muddle)\b.{0,100}\b(?:into|in|to)\s+(?:a\s+)?(?:cocktail\s+)?shaker\b|\bshaker\s+(?:filled|with)\s+ice\b/.test(method);
    const usesCocktailShaker = activelyShakes || mixesInShaker;
    if (usesCocktailShaker) tools.push("Cocktail shaker");
    if (/\bwhip\b/.test(method) && /\b(?:shaker or bowl|bowl or shaker)\b/.test(method)) tools.push("Small shaker or mixing bowl");
    if (/\bmixing glass\b/.test(method)) tools.push("Mixing glass");
    if (/\bstir(?:s|red|ring)?\b/.test(method)) tools.push("Bar spoon");
    if (/strain/.test(method)) tools.push("Hawthorne strainer" + (/fine strain/.test(method) ? " and fine-mesh strainer" : ""));
    if (/muddle/.test(method)) tools.push("Muddler");
    if (/blend|blender/.test(method)) tools.push("Blender");
    if (/\bpress\b|squeeze|fresh juice/.test(method) || ingredients.some(item => /lemon|lime|orange|grapefruit/.test(item) && /juice/.test(item))) tools.push("Citrus juicer or hand press");
    if (/zest|peel|express/.test(method) || /peel|zest/.test(ingredients)) tools.push("Peeler or channel knife");
    if (/copper mug|moscow mule/.test(glassware) || /mule/.test(drinkName)) tools.push("500 ml Moscow Mule mug");
    else if (/champagne|flute|coupe|martini|nick & nora/.test(glassware)) tools.push(`Chilled ${drink.glassware || "cocktail glass"}`);
    else tools.push(drink.glassware || "Serving glass");

    if (/highball|collins|copa|hurricane|mug|tiki/.test(glassware)) tools.push("Straight or bent 304 stainless steel straw");
    const crushedIceServe = /crushed|swizzle|tiki|julep/.test(method + " " + glassware);
    const rocksServe = /rocks|old fashioned|snifter/.test(glassware);
    const tallServe = /highball|collins|copa|hurricane|mug|tiki/.test(glassware);
    const shakesWithIce = usesCocktailShaker && /\bice\b/.test(method);
    const stirsWithIce = /\bmixing glass\b/.test(method) && /\bice\b/.test(method);
    if (crushedIceServe) {
      tools.push("Serving ice: crushed ice");
    } else if (rocksServe) {
      tools.push("Serving ice: clear ice cube or sphere");
    } else if (tallServe) {
      tools.push("Serving ice: clear ice cubes");
    }
    if (shakesWithIce) tools.push("Shaker ice: small or medium cubes");
    else if (stirsWithIce) tools.push("Mixing ice: medium or large cubes");
    return [...new Set(tools)];
  }

  function openDrinkModal(drinkId) {
    const all = getAllDrinks();
    const drink = all.find(d => d.id === drinkId);
    if (!drink) return;

    const modalBackdrop = document.getElementById("drink-modal-backdrop");
    const modalContent = document.getElementById("drink-modal-content");
    if (!modalBackdrop || !modalContent) return;

    const categoryClass = escapeHTML(drink.category.toLowerCase());
    const stock = getDrinkStockStatus(drink);
    const status = getDrinkStatus(drink.id);



    const listableIngredients = drink.ingredients.filter(ing => String(ing.amountOz || "").toLowerCase() !== "garnish");
    const garnishEntries = drink.ingredients.filter(ing => String(ing.amountOz || "").toLowerCase() === "garnish");
    const garnishText = garnishEntries.length
      ? garnishEntries.map(ing => escapeHTML(ing.item)).join("; ")
      : (drink.garnish ? escapeHTML(drink.garnish) : "");

    const ingredientsHtml = listableIngredients.map((ing, index) => {
      const inStock = isItemInStock(ing.inventoryId, ing);
      const hasInventoryLink = Boolean(ing.inventoryId || (ing.ingredientGroup && Object.prototype.hasOwnProperty.call(INGREDIENT_GROUPS, ing.ingredientGroup)));
      const stockBadge = hasInventoryLink
        ? (inStock
            ? `<span class="ing-stock-badge status-ready">✓ In Bar</span>`
            : `<span class="ing-stock-badge status-missing">Need to Buy</span>`)
        : "";

      const inventoryOptions = hasInventoryLink ? getIngredientInventoryOptions(ing) : [];
      const optionsId = escapeHTML(`ingredient-options-${drink.id}-${index}`);
      const inventoryOptionsHtml = inventoryOptions.length ? `
        <div class="ingredient-options" id="${optionsId}" hidden>
          <div class="ingredient-options-heading">Your inventory options</div>
          <ul class="ingredient-options-list">
            ${inventoryOptions.map(item => {
              const optionStatus = getInventoryOptionStatus(item);
              const quantity = item.quantity !== undefined ? `${item.quantity} ${escapeHTML(item.unit || getDefaultUnit(item))}` : "Quantity not tracked";
              const reserveBadge = (item.premium && ing.preferNonPremium)
                ? `<span class="ingredient-option-reserve" title="Save for cocktails where it can shine — the modifiers in this recipe tend to mask its complexity">✦ Reserve</span>`
                : "";
              return `
                <li class="ingredient-option${item.premium && ing.preferNonPremium ? " ingredient-option-premium" : ""}">
                  <span class="ingredient-option-name">${escapeHTML(item.name)}</span>
                  <span class="ingredient-option-meta">${quantity}</span>
                  <span class="ingredient-option-status ${optionStatus.className}">${optionStatus.label}</span>
                  ${reserveBadge}
                </li>
              `;
            }).join("")}
          </ul>
          ${inventoryOptions.some(item => item.premium && ing.preferNonPremium) ? `<p class="ingredient-options-reserve-note">✦ <em>Reserve spirits shine best in spirit-forward or lightly modified cocktails — this recipe\'s bold modifiers may mask their character.</em></p>` : ""}
        </div>
      ` : "";

      const rowContent = `
        <div class="ing-measure-item">
          <span class="ing-measure">${formatMeasurement(ing)}</span>
          <div class="ing-details">
            <span class="ing-name">${escapeHTML(ing.item)}</span>
            ${preferredSubstituteText(ing)}
          </div>
        </div>
        <div class="ingredient-row-actions">
          ${stockBadge}
          ${inventoryOptions.length ? `<span class="ingredient-options-trigger">Options <span aria-hidden="true">⌄</span></span>` : ""}
        </div>
      `;

      return `
        <li class="ingredient-row ${inventoryOptions.length ? "ingredient-row-expandable" : ""}">
          ${inventoryOptions.length ? `<button type="button" class="ingredient-row-toggle" aria-expanded="false" aria-controls="${optionsId}">${rowContent}</button>` : rowContent}
          ${inventoryOptionsHtml}
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
          <span class="instruction-text">${escapeHTML(step)}</span>
        </li>
      `;
    }).join("");
    const toolsHtml = getDrinkTools(drink).map(tool => `<li class="drink-tool-item">${escapeHTML(tool)}</li>`).join("");

    modalContent.innerHTML = `
      <button class="modal-close-btn" id="modal-close-x" title="Close (Esc)" aria-label="Close recipe">✕</button>
      <div class="modal-header">
        <div class="modal-pretitle">
          <span class="drink-category-badge badge-${categoryClass}">${escapeHTML(drink.category)}</span>
          <span class="spec-val gold modal-base-label">Base: ${escapeHTML(drink.baseSpirit || "Cocktail")}</span>
          ${stock.canMake 
            ? `<span class="bar-stock-indicator status-ready">✓ Ready to Make with Your Bar</span>` 
            : stock.untrackedItems.length
              ? `<span class="bar-stock-indicator status-missing">${stock.missingCount ? `Missing ${stock.missingCount} · ` : ""}Check ${stock.untrackedItems.length} unlinked Ingredients</span>`
              : `<span class="bar-stock-indicator status-missing">Missing ${stock.missingCount} Ingredients</span>`}
        </div>
        <h2 class="modal-drink-title" id="modal-drink-title">${escapeHTML(drink.name)}</h2>
        ${drink.otherNames ? `<div class="modal-drink-aliases">Also known as: ${escapeHTML(drink.otherNames)}</div>` : ""}
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
                <td>${escapeHTML(drink.glassware || "Cocktail Glass")}</td>
              </tr>
              <tr>
                <th>Alcohol by Volume</th>
                <td><strong class="gold">${getAbv(drink)}</strong> · ${escapeHTML(drink.alcoholLevel || "Standard")}</td>
              </tr>
              <tr>
                <th>Serving Volume</th>
                <td>${getDrinkVolume(drink)} <span class="spec-note">before ice dilution</span></td>
              </tr>
              <tr>
                <th>Taste Profile</th>
                <td>${escapeHTML(drink.tasteProfile || "Balanced & Refreshing")}</td>
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
                <td>${escapeHTML(drink.category)}</td>
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

        <!-- Preparation tools -->
        <div>
          <div class="modal-section-title"><span>Tools</span></div>
          <ul class="drink-tools-list">${toolsHtml}</ul>
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
              <div class="pro-tip-content">${escapeHTML(drink.proTip)}</div>
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

    modalContent.querySelectorAll(".ingredient-row-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const options = document.getElementById(button.getAttribute("aria-controls"));
        if (!options) return;
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        options.hidden = expanded;
      });
    });

    const closeBtn = document.getElementById("modal-close-x");
    if (closeBtn) closeBtn.addEventListener("click", closeDrinkModal);

    showModal(modalBackdrop, "#modal-close-x");
  }

  function closeDrinkModal() {
    const modalBackdrop = document.getElementById("drink-modal-backdrop");
    hideModal(modalBackdrop);
  }

  // ==================== ADD CUSTOM RECIPE ====================
  function openAddRecipeModal() {
    const modal = document.getElementById("add-recipe-modal-backdrop");
    showModal(modal, "#form-drink-name");
  }

  function closeAddRecipeModal() {
    const modal = document.getElementById("add-recipe-modal-backdrop");
    hideModal(modal);
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

  // ==================== FILTER COLLAPSE & STATE ====================
  function updateFilterCollapseState() {
    const container = document.getElementById("filter-groups-container");
    const controlPanel = document.querySelector(".control-panel");
    const toggleBtn = document.getElementById("btn-toggle-filters");
    const badge = document.getElementById("filter-active-count");

    if (!container || !toggleBtn) return;

    if (filtersCollapsed) {
      container.classList.add("collapsed");
      if (controlPanel) controlPanel.classList.add("filters-collapsed");
      toggleBtn.setAttribute("aria-expanded", "false");
    } else {
      container.classList.remove("collapsed");
      if (controlPanel) controlPanel.classList.remove("filters-collapsed");
      toggleBtn.setAttribute("aria-expanded", "true");
    }

    let activeCount = 0;
    if (selectedSpirit !== "all") activeCount++;
    if (selectedDifficulty !== "all") activeCount++;
    if (selectedTaste !== "all") activeCount++;
    if (selectedGlass !== "all") activeCount++;

    if (badge) {
      if (activeCount > 0) {
        badge.textContent = activeCount;
        badge.style.display = "inline-flex";
        toggleBtn.classList.add("has-active-filters");
      } else {
        badge.style.display = "none";
        toggleBtn.classList.remove("has-active-filters");
      }
    }
  }

  // ==================== BACK TO TOP ====================
  function setupBackToTop() {
    const backToTopBtn = document.getElementById("btn-back-to-top");
    if (!backToTopBtn) return;

    const toggleVisibility = () => {
      if (window.scrollY > window.innerHeight) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
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
    updateFilterCollapseState();
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

    // Toggle collapsible filters button
    const toggleFiltersBtn = document.getElementById("btn-toggle-filters");
    if (toggleFiltersBtn) {
      toggleFiltersBtn.addEventListener("click", () => {
        filtersCollapsed = !filtersCollapsed;
        localStorage.setItem(STORAGE_KEY_FILTERS_COLLAPSED, filtersCollapsed);
        updateFilterCollapseState();
      });
    }

    // Setup Back to top button listener
    setupBackToTop();

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

    function setupFilterPills(selector, getValue, setValue) {
      document.querySelectorAll(`${selector} .pill-btn`).forEach(btn => {
        btn.addEventListener("click", () => {
          inventoryRecipeFilterIds = null;
          const val = btn.getAttribute("data-val");
          const current = getValue();
          if (current === val && val !== "all") {
            setValue("all");
            document.querySelectorAll(`${selector} .pill-btn`).forEach(b => {
              b.classList.toggle("active", b.getAttribute("data-val") === "all");
            });
          } else {
            document.querySelectorAll(`${selector} .pill-btn`).forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            setValue(val);
          }
          renderDrinkCards();
          updateFilterCollapseState();
        });
      });
    }

    // Filter pills (Spirit)
    setupFilterPills(".filter-pills[data-filter='spirit']", () => selectedSpirit, v => { selectedSpirit = v; });
    document.querySelectorAll(".filter-pills[data-filter='spirit'] .pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (selectedSpirit === "Non-Alcoholic" && currentTab === "cocktails") {
          currentTab = "mocktails";
          renderTabButtons();
        } else if (selectedSpirit !== "all" && selectedSpirit !== "Non-Alcoholic" && currentTab === "mocktails") {
          currentTab = "all";
          renderTabButtons();
        }
      });
    });

    // Filter pills (Difficulty)
    setupFilterPills(".filter-pills[data-filter='difficulty']", () => selectedDifficulty, v => { selectedDifficulty = v; });

    // Filter pills (Taste)
    setupFilterPills(".filter-pills[data-filter='taste']", () => selectedTaste, v => { selectedTaste = v; });

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
    const btnCancelAddRecipe = document.getElementById("btn-cancel-add-recipe");
    if (btnCancelAddRecipe) btnCancelAddRecipe.addEventListener("click", closeAddRecipeModal);

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
    const btnCancelAdminItem = document.getElementById("btn-cancel-admin-item");
    if (btnCancelAdminItem) btnCancelAdminItem.addEventListener("click", closeAdminItemModal);

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
      } else if (e.key === "Tab") {
        keepFocusInOpenModal(e);
      }
    });
  }

  // ==================== INITIALIZATION ====================
  function init() {
    DOM.catalogView = document.getElementById("catalog-view");
    DOM.glossaryView = document.getElementById("glossary-view");
    DOM.adminView = document.getElementById("admin-view");
    DOM.heroStats = document.getElementById("hero-stats");
    DOM.drinksGrid = document.getElementById("drinks-grid");
    DOM.resultsCount = document.getElementById("results-count");

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
