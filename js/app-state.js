/* Shared transient UI state for navigation, recipe filters, and preferences. */
(function (root) {
  "use strict";

  function create(initial = {}) {
    return {
      unitPreference: initial.unitPreference || "both",
      filtersCollapsed: initial.filtersCollapsed !== undefined ? initial.filtersCollapsed : true,
      currentTab: "all",
      searchQuery: "",
      selectedSpirit: "all",
      selectedDifficulty: "all",
      selectedTaste: "all",
      selectedGlass: "all",
      filterOnlyMyBar: false,
      drinkStatusFilters: { tried: null, constructed: null },
      inventoryRecipeFilterIds: null,
      sortBy: "popularity-desc"
    };
  }

  root.BoonBarAppState = { create };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarAppState;
})(typeof window !== "undefined" ? window : globalThis);
