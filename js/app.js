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
  const VALID_THEMES = new Set(["auto", "morning", "afternoon", "twilight", "evening", "night", "latenight", "graveyard"]);
  const inventoryStore = window.BoonBarInventoryStore;
  const appBackup = window.BoonBarAppBackup;
  const { getDefaultUnit, getDefaultQuantity } = inventoryStore;
  const { escapeHTML, normalizeSearchText, announceStatus } = window.BoonBarUIUtils;
  const appStorage = window.BoonBarAppStorage.create({
    getStorage: () => window.localStorage,
    onUnavailable: () => window.setTimeout(() => announceStatus("A browser storage operation failed. The app will continue; some changes may only last for this session. Export a backup before leaving."), 100)
  });
  const savedUnitPreference = appStorage.getItem(STORAGE_KEY_UNIT);
  const { getDrinkVolume, getGlasswareCapacity, getAbv, getDrinkAbvValue, parseAbvText, getInventoryAbv } = window.BoonBarRecipeUtils;
  const { filterAndSortDrinks, getDiscoveryFilterOptions } = window.BoonBarDrinkCatalog;
  const { showModal, hideModal, keepFocusInOpenModal } = window.BoonBarModal;

  let inventory = loadInventory();
  let customDrinks = loadCustomDrinks();
  let drinkStatuses = loadDrinkStatuses();

  // ==================== STORAGE HELPERS ====================
  function loadInventory() {
    return inventoryStore.loadInventory({
      storage: appStorage,
      storageKey: STORAGE_KEY_INVENTORY,
      updateKey: STORAGE_KEY_INVENTORY_UPDATE,
      defaultInventory: DEFAULT_INVENTORY,
      categories: INVENTORY_CATEGORIES,
      overrides: INVENTORY_UPDATE_OVERRIDES,
      removedIds: INVENTORY_UPDATE_REMOVE_IDS
    });
  }

  function saveInventory() {
    return inventoryStore.saveInventory(appStorage, STORAGE_KEY_INVENTORY, inventory);
  }

  function loadCustomDrinks() {
    try {
      const saved = appStorage.getItem(STORAGE_KEY_CUSTOM_DRINKS);
      const parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return normalizeCustomDrinks(parsed);
    } catch (e) {
      return [];
    }
  }

  function isValidCustomDrink(drink) {
    return Boolean(drink && typeof drink === "object" && !Array.isArray(drink) &&
      typeof drink.id === "string" && drink.id.trim() && typeof drink.name === "string" && drink.name.trim() &&
      ["Cocktail", "Mocktail", "Shot"].includes(drink.category) &&
      ["otherNames", "baseSpirit", "glassware", "alcoholLevel", "tasteProfile", "bestMoment", "proTip"].every(key => drink[key] === undefined || drink[key] === null || typeof drink[key] === "string") &&
      Array.isArray(drink.ingredients) && drink.ingredients.every(ing => ing && typeof ing.item === "string" &&
        ["amountOz", "amountMl", "substitute", "inventoryId", "ingredientGroup"].every(key => ing[key] === undefined || ing[key] === null || typeof ing[key] === "string")) &&
      Array.isArray(drink.instructions) && drink.instructions.every(step => typeof step === "string") &&
      (drink.tags === undefined || (Array.isArray(drink.tags) && drink.tags.every(tag => typeof tag === "string"))) &&
      (drink.difficulty === undefined || Number.isFinite(Number(drink.difficulty))) &&
      (drink.popularity === undefined || Number.isFinite(Number(drink.popularity))) &&
      (drink.tools === undefined || (Array.isArray(drink.tools) && drink.tools.every(tool => typeof tool === "string"))));
  }

  function normalizeCustomDrinks(drinks) {
    return drinks.filter(isValidCustomDrink).map(drink => ({
        ...drink,
        difficulty: Math.max(1, Math.min(5, Math.round(Number(drink.difficulty) || 2))),
        popularity: Number.isFinite(Number(drink.popularity)) ? Number(drink.popularity) : 5,
        tools: Array.isArray(drink.tools) ? drink.tools.filter(tool => typeof tool === "string") : undefined
      }));
  }

  function saveCustomDrinks() {
    try {
      return appStorage.setItem(STORAGE_KEY_CUSTOM_DRINKS, JSON.stringify(customDrinks));
    } catch (e) {
      console.warn("Error saving custom drinks", e);
      return false;
    }
  }

  function loadDrinkStatuses() {
    try { return normalizeDrinkStatuses(JSON.parse(appStorage.getItem(STORAGE_KEY_DRINK_STATUS))); }
    catch (e) { return {}; }
  }

  function normalizeDrinkStatuses(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).flatMap(([drinkId, status]) => {
      if (!status || typeof status !== "object" || Array.isArray(status)) return [];
      const normalized = {};
      ["tried", "constructed"].forEach(key => {
        if (typeof status[key] === "boolean") normalized[key] = status[key];
      });
      return Object.keys(normalized).length ? [[drinkId, normalized]] : [];
    }));
  }

  function toggleDrinkStatus(drinkId, status) {
    const current = drinkStatuses[drinkId] || {};
    current[status] = !current[status];
    drinkStatuses[drinkId] = current;
    appStorage.setItem(STORAGE_KEY_DRINK_STATUS, JSON.stringify(drinkStatuses));
    renderApp();
  }

  function getDrinkStatus(drinkId) { return drinkStatuses[drinkId] || {}; }

  function getBackupSnapshot() {
    return appBackup.createBackup({
      inventory,
      customDrinks,
      drinkStatuses,
      preferences: {
        unitPreference: appState.unitPreference,
        theme: getThemePreference(),
        filtersCollapsed: appState.filtersCollapsed
      }
    });
  }

  function restoreBackupPayload(payload) {
    const parsed = appBackup.parseBackup(payload, {
      isValidInventoryRecord: item => inventoryStore.isValidInventoryRecord(item, INVENTORY_CATEGORIES),
      normalizeInventoryRecord: inventoryStore.normalizeInventoryRecord,
      isValidCustomDrink: drink => isValidCustomDrink(drink) && !DEFAULT_DRINKS.some(defaultDrink => defaultDrink.id === drink.id),
      normalizeCustomDrinks
    });
    if (!parsed.ok) return parsed;

    const mergedInventory = inventoryStore.mergeInventoryRecords(
      parsed.data.inventory, DEFAULT_INVENTORY, INVENTORY_UPDATE_REMOVE_IDS
    );
    inventory.splice(0, inventory.length, ...mergedInventory);
    saveInventory();

    if (!parsed.legacy) {
      customDrinks.splice(0, customDrinks.length, ...parsed.data.customDrinks);
      drinkStatuses = parsed.data.drinkStatuses;
      appState.unitPreference = parsed.data.preferences.unitPreference;
      appState.filtersCollapsed = parsed.data.preferences.filtersCollapsed;
      const unitToggleButton = document.getElementById("btn-unit-toggle");
      if (unitToggleButton) unitToggleButton.innerHTML = `⚖ Units: <strong>${appState.unitPreference.toUpperCase()}</strong>`;
      appStorage.setItem(STORAGE_KEY_CUSTOM_DRINKS, JSON.stringify(customDrinks));
      appStorage.setItem(STORAGE_KEY_DRINK_STATUS, JSON.stringify(drinkStatuses));
      appStorage.setItem(STORAGE_KEY_UNIT, appState.unitPreference);
      appStorage.setItem(STORAGE_KEY_THEME, parsed.data.preferences.theme);
      appStorage.setItem(STORAGE_KEY_FILTERS_COLLAPSED, appState.filtersCollapsed);
      try {
        document.cookie = `${THEME_COOKIE}=${encodeURIComponent(parsed.data.preferences.theme)}; max-age=31536000; path=/; SameSite=Lax`;
      } catch (error) {
        console.warn("Unable to restore the theme cookie", error);
      }
      renderDiscoveryFilters();
      resetFilters();
      applyTheme(parsed.data.preferences.theme);
    }

    return { ...parsed, persistent: appStorage.isPersistent() };
  }

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
    try {
      const entry = document.cookie.split("; ").find(row => row.startsWith(`${name}=`));
      return entry ? decodeURIComponent(entry.split("=")[1]) : "";
    } catch (error) {
      return "";
    }
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
    const preference = appStorage.getItem(STORAGE_KEY_THEME) || getCookie(THEME_COOKIE) || "auto";
    return VALID_THEMES.has(preference) ? preference : "auto";
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

  // ==================== CATALOG QUERY ADAPTER ====================
  function getFilteredAndSortedDrinks() {
    return filterAndSortDrinks({
      drinks: getAllDrinks(),
      currentTab: appState.currentTab,
      filterOnlyMyBar: appState.filterOnlyMyBar,
      drinkStatusFilters: appState.drinkStatusFilters,
      selectedSpirit: appState.selectedSpirit,
      selectedDifficulty: appState.selectedDifficulty,
      selectedGlass: appState.selectedGlass,
      selectedTaste: appState.selectedTaste,
      inventoryRecipeFilterIds: appState.inventoryRecipeFilterIds,
      searchQuery: appState.searchQuery,
      sortBy: appState.sortBy
    }, {
      getDrinkStockStatus,
      getDrinkStatus,
      getIngredientCandidates,
      getInventoryItem,
      ingredientGroups: INGREDIENT_GROUPS,
      normalizeSearchText,
      getDrinkAbvValue
    });
  }

  function renderDiscoveryFilters() {
    const optionsByFilter = getDiscoveryFilterOptions(getAllDrinks(), normalizeSearchText);
    const selectedByFilter = {
      spirit: appState.selectedSpirit,
      difficulty: appState.selectedDifficulty,
      taste: appState.selectedTaste,
      glass: appState.selectedGlass
    };

    Object.entries(optionsByFilter).forEach(([filter, options]) => {
      const container = document.querySelector(`.filter-pills[data-filter="${filter}"]`);
      if (!container) return;
      container.innerHTML = options.map(option => `
        <button type="button" class="pill-btn ${selectedByFilter[filter] === option.value ? "active" : ""}"
          data-val="${escapeHTML(option.value)}" aria-pressed="${selectedByFilter[filter] === option.value}">
          ${escapeHTML(option.label)} <span class="filter-option-count">${option.count}</span>
        </button>
      `).join("");
    });
  }

  // ==================== SHARED APP STATE ====================
  const appState = window.BoonBarAppState.create({
    unitPreference: ["both", "oz", "ml"].includes(savedUnitPreference) ? savedUnitPreference : "both",
    filtersCollapsed: appStorage.getItem(STORAGE_KEY_FILTERS_COLLAPSED) !== "false"
  });

  // ==================== RECIPE DETAIL / MODAL MODULE ====================
  const drinkModal = window.BoonBarDrinkModal.create({
    getUnitPreference: () => appState.unitPreference,
    setUnitPreference: value => { appState.unitPreference = value; },
    storage: appStorage,
    storageKeyUnit: STORAGE_KEY_UNIT,
    getAllDrinks, getDrinkStockStatus, getDrinkStatus, isItemInStock,
    getIngredientInventoryOptions, getInventoryOptionStatus, getDefaultUnit,
    getInventoryAbv, getDifficultyStars, getAbv, getDrinkVolume, getGlasswareCapacity,
    ingredientGroups: INGREDIENT_GROUPS, escapeHTML, toggleDrinkStatus,
    showModal, hideModal
  });
  const { openDrinkModal, closeDrinkModal } = drinkModal;

  const drinkJourneys = window.BoonBarDrinkJourneys.create({
    getAllDrinks,
    getDrinkStockStatus,
    escapeHTML,
    openDrinkModal
  });

  // ==================== INVENTORY / ADMIN MODULE ====================
  const inventoryAdmin = window.BoonBarInventoryAdmin.create({
    inventory, SNOWFLAKE_SVG, INVENTORY_CATEGORIES, INVENTORY_LAST_UPDATED,
    STORAGE_KEY_INVENTORY,
    storage: appStorage,
    getBackupSnapshot, restoreBackupPayload,
    getDefaultUnit, getDefaultQuantity, getInventoryAbv, parseAbvText,
    escapeHTML, normalizeSearchText, getDrinkStockStatus, getRecipesUsingItem,
    navigateToRecipesForItem, saveInventory, loadInventory,
    renderHeroStats, announceStatus, showModal, hideModal
  });
  const {
    renderGlossary, renderAdminView, openAddItemModal, closeAdminItemModal,
    handleSaveAdminItem, exportFullBackup, importBackupFile,
    resetInventoryToDefault
  } = inventoryAdmin;

  // ==================== RENDERING UI ====================
  function renderApp() {
    renderTabButtons();
    renderHeroStats();

    const { catalogView, journeysView, glossaryView, adminView } = DOM;

    if (appState.currentTab === "journeys") {
      if (catalogView) catalogView.style.display = "none";
      if (journeysView) journeysView.style.display = "block";
      if (glossaryView) glossaryView.style.display = "none";
      if (adminView) adminView.style.display = "none";
      drinkJourneys.render();
    } else if (appState.currentTab === "glossary") {
      if (catalogView) catalogView.style.display = "none";
      if (journeysView) journeysView.style.display = "none";
      if (glossaryView) glossaryView.style.display = "block";
      if (adminView) adminView.style.display = "none";
      renderGlossary();
    } else if (appState.currentTab === "admin") {
      if (catalogView) catalogView.style.display = "none";
      if (journeysView) journeysView.style.display = "none";
      if (glossaryView) glossaryView.style.display = "none";
      if (adminView) {
        adminView.style.display = "block";
        renderAdminView();
      }
    } else {
      if (catalogView) catalogView.style.display = "block";
      if (journeysView) journeysView.style.display = "none";
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
    const progressCategory = { cocktails: "Cocktail", mocktails: "Mocktail", shots: "Shot" }[appState.currentTab];
    const progressDrinks = progressCategory ? all.filter(d => d.category === progressCategory) : all;
    const constructed = progressDrinks.filter(d => getDrinkStatus(d.id).constructed).length;
    const tried = progressDrinks.filter(d => getDrinkStatus(d.id).tried).length;

    const inStockBottles = inventory.filter(i => i.inStock && (i.quantity === undefined || i.quantity > 0)).length;
    const totalBottles = inventory.length;

    const notConstructed = progressDrinks.length - constructed;
    const notTried = progressDrinks.length - tried;
    const statsEl = DOM.heroStats || document.getElementById("hero-stats");
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-pill"><button type="button" class="stat-filter-btn stat-tab-btn ${appState.currentTab === "all" ? "active" : ""}" data-tab-switch="all" aria-pressed="${appState.currentTab === "all"}" aria-label="Show all drinks">🍹 All: <strong>${cocktails + mocktails + shots}</strong></button></div>
        <div class="stat-pill"><button type="button" class="stat-filter-btn stat-tab-btn ${appState.currentTab === "cocktails" ? "active" : ""}" data-tab-switch="cocktails" aria-pressed="${appState.currentTab === "cocktails"}" aria-label="Show cocktails">🍸 Cocktails: <strong>${cocktails}</strong></button></div>
        <div class="stat-pill"><button type="button" class="stat-filter-btn stat-tab-btn ${appState.currentTab === "mocktails" ? "active" : ""}" data-tab-switch="mocktails" aria-pressed="${appState.currentTab === "mocktails"}" aria-label="Show mocktails">🫧 Mocktails: <strong>${mocktails}</strong></button></div>
        <div class="stat-pill"><button type="button" class="stat-filter-btn stat-tab-btn ${appState.currentTab === "shots" ? "active" : ""}" data-tab-switch="shots" aria-pressed="${appState.currentTab === "shots"}" aria-label="Show shots">🥃 Shots: <strong>${shots}</strong></button></div>
        <div class="stat-pill">🍾 In Bar: <strong>${inStockBottles} / ${totalBottles}</strong></div>
        <div class="stat-pill stat-pill-ready">
          ✨ Ready to Make Now: <strong>${readyToMake}</strong>
        </div>
        <div class="stat-pill">⚗ Constructed:
          <button type="button" class="stat-filter-btn ${appState.drinkStatusFilters.constructed === true ? "active" : ""}" data-status-filter="constructed" data-filter-value="true" aria-pressed="${appState.drinkStatusFilters.constructed === true}" aria-label="Show constructed drinks" title="Show constructed drinks">${constructed}</button>
          /
          <button type="button" class="stat-filter-btn ${appState.drinkStatusFilters.constructed === false ? "active" : ""}" data-status-filter="constructed" data-filter-value="false" aria-pressed="${appState.drinkStatusFilters.constructed === false}" aria-label="Show drinks not yet constructed" title="Show drinks not yet constructed">${notConstructed}</button>
        </div>
        <div class="stat-pill">✓ Tried:
          <button type="button" class="stat-filter-btn ${appState.drinkStatusFilters.tried === true ? "active" : ""}" data-status-filter="tried" data-filter-value="true" aria-pressed="${appState.drinkStatusFilters.tried === true}" aria-label="Show tried drinks" title="Show tried drinks">${tried}</button>
          /
          <button type="button" class="stat-filter-btn ${appState.drinkStatusFilters.tried === false ? "active" : ""}" data-status-filter="tried" data-filter-value="false" aria-pressed="${appState.drinkStatusFilters.tried === false}" aria-label="Show drinks not yet tried" title="Show drinks not yet tried">${notTried}</button>
        </div>
      `;
    }
  }

  function renderTabButtons() {
    const navBtns = document.querySelectorAll(".nav-btn[data-tab]");
    navBtns.forEach(btn => {
      const tab = btn.getAttribute("data-tab");
      const active = tab === appState.currentTab;
      btn.classList.toggle("active", active);
      if (active) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
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
    const primaryGlass = glassware.split(/\s*(?:\/|\bor\b)\s*/i)[0];
    let glassShape = "coupe";
    if (/shot glass.*(?:pint|flute chaser)|pint.*shot glass/.test(glassware)) glassShape = "shot-chaser";
    else if (/shot glass.*side shot/.test(glassware)) glassShape = "shot-trio";
    else if (/shot glass\s*(?:\+|&)|two shot glasses/.test(glassware)) glassShape = "shot-pair";
    else if (/rocks glass\s*\+\s*shot/.test(glassware)) glassShape = "bomb-set";
    else if (/weizen/.test(primaryGlass)) glassShape = "weizen";
    else if (/beer|pint|stein/.test(primaryGlass)) glassShape = "beer";
    else if (/tiki/.test(primaryGlass)) glassShape = "tiki";
    else if (/hurricane/.test(primaryGlass)) glassShape = "hurricane";
    else if (/irish coffee|copper mug|\bmug\b/.test(primaryGlass)) glassShape = "mug";
    else if (/julep/.test(primaryGlass)) glassShape = "julep";
    else if (/bowl/.test(primaryGlass)) glassShape = "bowl";
    else if (/wine|copa|spritz/.test(primaryGlass)) glassShape = "wine";
    else if (/champagne|flute/.test(primaryGlass)) glassShape = "flute";
    else if (/shot/.test(primaryGlass) || drink.category === "Shot") glassShape = "shot";
    else if (/snifter/.test(primaryGlass)) glassShape = "snifter";
    else if (/rocks|old fashioned|lowball|snifter/.test(primaryGlass)) glassShape = "rocks";
    else if (/highball|collins|tumbler/.test(primaryGlass)) glassShape = "highball";
    else if (/martini/.test(primaryGlass)) glassShape = "martini";
    else if (/coupe|nick & nora/.test(primaryGlass)) glassShape = "coupe";

    let color = "var(--accent-gold)";
    if (name.includes("aperol") || name.includes("sunrise")) color = "#ff9f43";
    else if (name.includes("negroni") || name.includes("bloody") || name.includes("mary")) color = "#e95d64";
    else if (drink.category === "Mocktail") color = "#72e0b0";
    else if (drink.category === "Shot") color = "#ff7a9d";
    else if (drink.baseSpirit === "Rum") color = "#e6b35a";

    const iconShapes = {
      coupe: `<path class="glass-liquid" d="M24 22h48c-5 14-13 22-24 25-11-3-19-11-24-25Z"/><path class="glass-outline" d="M17 16h62c-5 20-16 31-31 35-15-4-26-15-31-35ZM48 51v27M35 82h26"/><path class="glass-detail" d="M29 22h38"/>`,
      martini: `<path class="glass-liquid" d="M29 20h38L48 43Z"/><path class="glass-outline" d="M20 15h56L48 49 20 15ZM48 49v29M35 82h26"/><path class="glass-detail" d="M30 20h36"/>`,
      rocks: `<path class="glass-liquid" d="M27 43h42l-3 30H30Z"/><path class="glass-outline" d="M22 22h52l-5 56H27Z"/><path class="glass-detail" d="M27 36h42M32 54l10-9 11 10 9-8"/>`,
      highball: `<path class="glass-liquid" d="M31 35h34l-4 43H35Z"/><path class="glass-outline" d="M27 13h42l-5 68H32Z"/><path class="glass-detail" d="M30 29h36M36 46l8-8 10 11 9-9"/>`,
      flute: `<path class="glass-liquid" d="M36 23h24l-4 28c-2 5-5 8-8 10-3-2-6-5-8-10Z"/><path class="glass-outline" d="M33 15h30l-5 37c-2 6-5 10-10 12-5-2-8-6-10-12ZM48 64v15M37 82h22"/><path class="glass-detail" d="M36 22h24"/>`,
      shot: `<path class="glass-liquid" d="M33 44h30l-3 27H36Z"/><path class="glass-outline" d="M29 28h38l-4 49H33Z"/><path class="glass-detail" d="M31 40h34"/>`,
      wine: `<path class="glass-liquid" d="M27 31h42c-2 13-9 22-21 25-12-3-19-12-21-25Z"/><path class="glass-outline" d="M23 17h50c-1 24-8 36-25 41-17-5-24-17-25-41ZM48 58v21M36 82h24"/><path class="glass-detail" d="M27 30h42"/>`,
      snifter: `<path class="glass-liquid" d="M30 41c1-12 8-18 18-18s17 6 18 18c-1 12-8 20-18 20s-17-8-18-20Z"/><path class="glass-outline" d="M25 39c0-16 9-25 23-25s23 9 23 25c0 17-9 28-23 28S25 56 25 39ZM48 67v12M38 82h20"/><path class="glass-detail" d="M30 39h36"/>`,
      hurricane: `<path class="glass-liquid" d="M32 38h32l-3 35H35Z"/><path class="glass-outline" d="M28 16h40l-3 12 8 9-8 42H31l-8-42 8-9ZM48 79v3M37 84h22"/><path class="glass-detail" d="M31 32h34M34 47h28"/>`,
      mug: `<path class="glass-liquid" d="M28 37h39v37H31Z"/><path class="glass-outline" d="M25 22h45v58H29ZM70 35h7c12 0 12 28 0 28h-7"/><path class="glass-detail" d="M28 34h39M33 48l8-8 10 12 10-10"/>`,
      tiki: `<path class="glass-liquid" d="M29 38h38l-3 36H32Z"/><path class="glass-outline" d="M26 19h44l-4 61H30Z"/><path class="glass-detail" d="M30 32h36M37 45h5M54 45h5M39 60c6 5 12 5 18 0M35 25l7 5M61 25l-7 5"/>`,
      beer: `<path class="glass-liquid" d="M29 32h38l-4 46H33Z"/><path class="glass-foam" d="M29 31c-7-2-5-11 2-11 1-8 12-8 15-2 5-8 17-5 17 3 8-1 11 9 4 11Z"/><path class="glass-outline" d="M27 28h42l-5 53H32Z"/><path class="glass-detail" d="M31 42h34"/>`,
      weizen: `<path class="glass-liquid" d="M33 35h30l-5 44H38Z"/><path class="glass-foam" d="M31 34c-6-3-3-11 3-11 1-7 10-8 14-2 5-7 15-5 15 3 7 0 8 8 2 10Z"/><path class="glass-outline" d="M29 28h38c-1 20-4 41-8 54H37c-4-13-7-34-8-54Z"/><path class="glass-detail" d="M32 39h32"/>`,
      julep: `<path class="glass-liquid" d="M29 39h38l-6 37H35Z"/><path class="glass-outline" d="M25 26h46L65 81H31Z"/><path class="glass-detail" d="M28 36h40M37 48l8-8 9 10 8-8"/>`,
      bowl: `<path class="glass-liquid" d="M23 48h50c-4 12-12 19-25 19s-21-7-25-19Z"/><path class="glass-outline" d="M17 37h62c-4 22-16 35-31 35S21 59 17 37ZM48 72v7M36 82h24"/><path class="glass-detail" d="M24 45h48"/>`,
      "shot-pair": `<path class="glass-liquid" d="M17 48h22l-2 24H19Z M56 48h22l-2 24H58Z"/><path class="glass-outline" d="M14 31h28l-3 47H17Z M53 31h28l-3 47H56Z"/><path class="glass-detail" d="M16 44h24M55 44h24"/>`,
      "shot-trio": `<path class="glass-liquid" d="M12 49h18l-2 22h-14Z M39 49h18l-2 22H41Z M66 49h18l-2 22H68Z"/><path class="glass-outline" d="M9 33h24l-3 46H12Z M36 33h24l-3 46H39Z M63 33h24l-3 46H66Z"/><path class="glass-detail" d="M11 45h20M38 45h20M65 45h20"/>`,
      "shot-chaser": `<path class="glass-liquid" d="M17 49h20l-2 22H19Z M54 33h26l-4 45H58Z"/><path class="glass-outline" d="M14 34h26l-3 45H17Z M51 17h32l-5 64H56Z"/><path class="glass-detail" d="M16 45h22M54 28h27"/>`,
      "shot-pint": `<path class="glass-liquid" d="M16 37h30l-4 42H20Z M57 49h24l-3 28H60Z"/><path class="glass-foam" d="M15 36c-4-5 2-10 6-7 3-8 12-8 15-2 5-6 13-2 12 6Z"/><path class="glass-outline" d="M12 31h38l-5 51H17Z M54 32h30l-4 48H58Z"/><path class="glass-detail" d="M15 44h33M57 44h24"/>`,
      "bomb-set": `<path class="glass-liquid" d="M14 43h44l-3 34H17Z M66 54h17l-2 22h-13Z"/><path class="glass-outline" d="M11 20h50l-5 60H16Z M64 42h21l-3 36H67Z"/><path class="glass-detail" d="M14 38h44M66 51h17"/>`
    };
    if (/shot glass.*pint|pint.*shot glass/.test(glassware)) glassShape = "shot-pint";
    const icon = `<svg class="glass-icon" viewBox="0 0 96 96" role="img" aria-label="${escapeHTML(drink.glassware || "Cocktail glass")}">${iconShapes[glassShape] || iconShapes.coupe}</svg>`;
    return { icon, color };
  }

  function renderDrinkCards() {
    const drinks = getFilteredAndSortedDrinks();
    const container = DOM.drinksGrid || document.getElementById("drinks-grid");
    const countEl = DOM.resultsCount || document.getElementById("results-count");

    if (countEl) {
      const allDrinks = getAllDrinks();
      const category = { cocktails: "Cocktail", mocktails: "Mocktail", shots: "Shot" }[appState.currentTab];
      const scopeTotal = category ? allDrinks.filter(drink => drink.category === category).length : allDrinks.length;
      const scopeLabel = category ? `${category.toLowerCase()}${scopeTotal === 1 ? "" : "s"}` : "drinks";
      countEl.textContent = `Showing ${drinks.length} of ${scopeTotal} ${scopeLabel}`;
    }

    if (!container) return;

    if (drinks.length === 0) {
      container.innerHTML = `
        <div class="drinks-grid-empty">
          <div class="drinks-grid-empty-icon">🍸</div>
          <h3 class="drinks-grid-empty-title">No drinks found</h3>
          <p class="drinks-grid-empty-text">No recipes match this combination. Clear the filters to see the full catalog, or try another spirit, flavor, glass, or ingredient.</p>
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

  function navigateToRecipesForItem(itemId) {
    const recipes = getRecipesUsingItem(itemId);
    appState.currentTab = "all";
    appState.inventoryRecipeFilterIds = recipes.map(drink => drink.id);
    appState.searchQuery = "";
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";
    renderApp();
    window.scrollTo({ top: 300, behavior: "smooth" });
    DOM.resultsCount?.focus();
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
    const bestMoment = document.getElementById("form-best-moment").value.trim();
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
      bestMoment: bestMoment,
      difficulty: difficulty,
      popularity: 10.0,
      proTip: proTip,
      ingredients: ingredients,
      instructions: instructions.length ? instructions : ["Combine ingredients and enjoy!"],
      tags: ["experiment", "home-bar", "custom"]
    };

    customDrinks.unshift(newDrink);
    saveCustomDrinks();
    announceStatus(`Added ${name} to the current recipe guide.`);
    closeAddRecipeModal();
    renderDiscoveryFilters();
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

    if (appState.filtersCollapsed) {
      container.classList.add("collapsed");
      if (controlPanel) controlPanel.classList.add("filters-collapsed");
      toggleBtn.setAttribute("aria-expanded", "false");
    } else {
      container.classList.remove("collapsed");
      if (controlPanel) controlPanel.classList.remove("filters-collapsed");
      toggleBtn.setAttribute("aria-expanded", "true");
    }

    let activeCount = 0;
    if (appState.selectedSpirit !== "all") activeCount++;
    if (appState.selectedDifficulty !== "all") activeCount++;
    if (appState.selectedTaste !== "all") activeCount++;
    if (appState.selectedGlass !== "all") activeCount++;
    if (appState.searchQuery.trim()) activeCount++;
    if (appState.inventoryRecipeFilterIds?.length) activeCount++;
    if (appState.filterOnlyMyBar) activeCount++;
    if (appState.drinkStatusFilters.tried !== null) activeCount++;
    if (appState.drinkStatusFilters.constructed !== null) activeCount++;

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
    appState.searchQuery = "";
    appState.inventoryRecipeFilterIds = null;
    appState.selectedSpirit = "all";
    appState.selectedDifficulty = "all";
    appState.selectedTaste = "all";
    appState.selectedGlass = "all";
    appState.filterOnlyMyBar = false;
    appState.drinkStatusFilters = { tried: null, constructed: null };
    appState.sortBy = "popularity-desc";
    const myBarToggleBtn = document.getElementById("btn-my-bar-toggle");
    if (myBarToggleBtn) {
      myBarToggleBtn.classList.remove("active");
      myBarToggleBtn.setAttribute("aria-pressed", "false");
    }

    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) sortSelect.value = "popularity-desc";

    document.querySelectorAll(".pill-btn").forEach(p => {
      const active = p.hasAttribute("data-val") && p.getAttribute("data-val") === "all";
      p.classList.toggle("active", active);
      if (p.hasAttribute("data-val")) p.setAttribute("aria-pressed", String(active));
    });

    renderApp();
    updateFilterCollapseState();
  }

  // ==================== APP EVENT MODULE ====================
  const appEvents = window.BoonBarAppEvents.create({
    state: appState,
    actions: {
      resetFilters, renderApp, setupBackToTop, renderDrinkCards,
      updateFilterCollapseState, renderTabButtons, applyTheme,
      openAddRecipeModal, closeAddRecipeModal, handleSaveCustomRecipe, announceStatus
    },
    drinkModal, inventoryAdmin,
    storage: appStorage,
    storageKeys: {
      STORAGE_KEY_FILTERS_COLLAPSED, STORAGE_KEY_UNIT, STORAGE_KEY_THEME, THEME_COOKIE
    },
    modalUtils: { keepFocusInOpenModal }
  });

  // ==================== INITIALIZATION ====================
  function init() {
    DOM.catalogView = document.getElementById("catalog-view");
    DOM.journeysView = document.getElementById("journeys-view");
    DOM.glossaryView = document.getElementById("glossary-view");
    DOM.adminView = document.getElementById("admin-view");
    DOM.heroStats = document.getElementById("hero-stats");
    DOM.drinksGrid = document.getElementById("drinks-grid");
    DOM.resultsCount = document.getElementById("results-count");

    drinkJourneys.setup(DOM.journeysView);
    applyTheme();
    renderDiscoveryFilters();
    appEvents.setupEventListeners();
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
