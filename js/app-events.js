/* General page event wiring, connected through explicit app/module APIs. */
(function (root) {
  "use strict";

  function create(context) {
    const { state, actions, drinkModal, inventoryAdmin, storage, storageKeys, modalUtils } = context;
    const {
      resetFilters, renderApp, setupBackToTop, renderDrinkCards,
      updateFilterCollapseState, renderTabButtons, applyTheme,
      openAddRecipeModal, closeAddRecipeModal, handleSaveCustomRecipe, announceStatus
    } = actions;
    const {
      STORAGE_KEY_FILTERS_COLLAPSED, STORAGE_KEY_UNIT, STORAGE_KEY_THEME, THEME_COOKIE
    } = storageKeys;
    const { openDrinkModal, closeDrinkModal } = drinkModal;
    const { keepFocusInOpenModal } = modalUtils;
    let searchAnnouncementTimer = null;
    const {
      openAddItemModal, closeAdminItemModal, handleSaveAdminItem,
      exportFullBackup, importBackupFile, resetInventoryToDefault,
      setAdminSearchQuery, setAdminCategoryFilter, setAdminStockFilter
    } = inventoryAdmin;
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

    const heroStats = document.getElementById("hero-stats");
    if (heroStats) {
      heroStats.addEventListener("click", event => {
        // Handle category tab-switch buttons (reset filters + switch tab)
        const tabBtn = event.target.closest("button[data-tab-switch]");
        if (tabBtn) {
          const tab = tabBtn.getAttribute("data-tab-switch");
          resetFilters();
          state.currentTab = tab;
          renderApp();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        // Handle tried/constructed status filter buttons
        const button = event.target.closest("button[data-status-filter]");
        if (!button) return;
        const status = button.getAttribute("data-status-filter");
        if (status !== "tried" && status !== "constructed") return;
        const value = button.getAttribute("data-filter-value") === "true";
        state.drinkStatusFilters[status] = state.drinkStatusFilters[status] === value ? null : value;
        renderApp();
        document.getElementById("results-count")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    // Navigation tabs
    document.querySelectorAll(".nav-btn[data-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.currentTab = btn.getAttribute("data-tab");
        renderApp();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    // Toggle collapsible filters button
    const toggleFiltersBtn = document.getElementById("btn-toggle-filters");
    if (toggleFiltersBtn) {
      toggleFiltersBtn.addEventListener("click", () => {
        state.filtersCollapsed = !state.filtersCollapsed;
        storage.setItem(STORAGE_KEY_FILTERS_COLLAPSED, state.filtersCollapsed);
        updateFilterCollapseState();
      });
    }

    // Setup Back to top button listener
    setupBackToTop();

    // Search input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.inventoryRecipeFilterIds = null;
        state.searchQuery = e.target.value;
        const resultsCount = document.getElementById("results-count");
        if (resultsCount) resultsCount.setAttribute("aria-live", "off");
        renderDrinkCards();
        if (searchAnnouncementTimer) window.clearTimeout(searchAnnouncementTimer);
        searchAnnouncementTimer = window.setTimeout(() => {
          if (resultsCount) resultsCount.setAttribute("aria-live", "polite");
          if (resultsCount) announceStatus(resultsCount.textContent);
          searchAnnouncementTimer = null;
        }, 450);
      });
    }

    // Sort select
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        state.sortBy = e.target.value;
        renderDrinkCards();
      });
    }

    const filterStateKeys = {
      spirit: "selectedSpirit",
      difficulty: "selectedDifficulty",
      taste: "selectedTaste",
      glass: "selectedGlass"
    };
    document.querySelectorAll(".filter-pills[data-filter]").forEach(container => {
      container.addEventListener("click", event => {
        const button = event.target.closest("button[data-val]");
        if (!button) return;
        const filter = container.getAttribute("data-filter");
        const stateKey = filterStateKeys[filter];
        if (!stateKey) return;

        const value = button.getAttribute("data-val");
        const nextValue = state[stateKey] === value && value !== "all" ? "all" : value;
        state[stateKey] = nextValue;
        state.inventoryRecipeFilterIds = null;
        container.querySelectorAll("button[data-val]").forEach(option => {
          const active = option.getAttribute("data-val") === nextValue;
          option.classList.toggle("active", active);
          option.setAttribute("aria-pressed", String(active));
        });

        if (filter === "spirit") {
          if (nextValue === "Non-Alcoholic" && state.currentTab === "cocktails") {
            state.currentTab = "mocktails";
            renderTabButtons();
          } else if (nextValue !== "all" && nextValue !== "Non-Alcoholic" && state.currentTab === "mocktails") {
            state.currentTab = "all";
            renderTabButtons();
          }
        }

        renderDrinkCards();
        updateFilterCollapseState();
      });
    });

    // "Only In Stock" toggle button
    const myBarToggleBtn = document.getElementById("btn-my-bar-toggle");
    if (myBarToggleBtn) {
      myBarToggleBtn.addEventListener("click", () => {
        state.filterOnlyMyBar = !state.filterOnlyMyBar;
        myBarToggleBtn.classList.toggle("active", state.filterOnlyMyBar);
        myBarToggleBtn.setAttribute("aria-pressed", String(state.filterOnlyMyBar));
        renderDrinkCards();
        updateFilterCollapseState();
      });
    }

    // Clear filters button
    const clearBtn = document.getElementById("btn-clear-filters");
    if (clearBtn) clearBtn.addEventListener("click", resetFilters);

    // Unit toggle button (header)
    const unitToggleBtn = document.getElementById("btn-unit-toggle");
    if (unitToggleBtn) {
      unitToggleBtn.addEventListener("click", () => {
        if (state.unitPreference === "both") state.unitPreference = "oz";
        else if (state.unitPreference === "oz") state.unitPreference = "ml";
        else state.unitPreference = "both";
        storage.setItem(STORAGE_KEY_UNIT, state.unitPreference);
        unitToggleBtn.innerHTML = `⚖ Units: <strong>${state.unitPreference.toUpperCase()}</strong>`;
        renderDrinkCards();
      });
      unitToggleBtn.innerHTML = `⚖ Units: <strong>${state.unitPreference.toUpperCase()}</strong>`;
    }

    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) themeSelect.addEventListener("change", () => {
      const choice = themeSelect.value;
      // Keep the theme cookie compatible with hosted installs; guarded Web Storage
      // remains the primary preference source and also supports local previews.
      try {
        document.cookie = `${THEME_COOKIE}=${encodeURIComponent(choice)}; max-age=31536000; path=/; SameSite=Lax`;
      } catch (error) {
        console.warn("Unable to persist the theme cookie", error);
      }
      storage.setItem(STORAGE_KEY_THEME, choice);
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
        setAdminSearchQuery(e.target.value);
      });
    }

    const adminCatFilter = document.getElementById("admin-category-filter");
    if (adminCatFilter) {
      adminCatFilter.addEventListener("change", (e) => {
        setAdminCategoryFilter(e.target.value);
      });
    }

    const adminStockFilterEl = document.getElementById("admin-stock-filter");
    if (adminStockFilterEl) {
      adminStockFilterEl.addEventListener("change", (e) => {
        setAdminStockFilter(e.target.value);
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
    if (btnAdminExport) btnAdminExport.addEventListener("click", exportFullBackup);

    const btnAdminImport = document.getElementById("btn-admin-import");
    const adminImportFile = document.getElementById("admin-import-file");
    if (btnAdminImport && adminImportFile) {
      btnAdminImport.addEventListener("click", () => adminImportFile.click());
      adminImportFile.addEventListener("change", importBackupFile);
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
        const openModals = document.querySelectorAll(".modal-backdrop.open");
        const topModal = openModals[openModals.length - 1];
        if (!topModal) return;
        e.preventDefault();
        const closeTopModal = {
          "drink-modal-backdrop": closeDrinkModal,
          "add-recipe-modal-backdrop": closeAddRecipeModal,
          "admin-item-modal-backdrop": closeAdminItemModal
        }[topModal.id];
        closeTopModal?.();
      } else if (e.key === "Tab") {
        keepFocusInOpenModal(e);
      }
    });
  }

    return { setupEventListeners };
  }

  root.BoonBarAppEvents = { create };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarAppEvents;
})(typeof window !== "undefined" ? window : globalThis);
