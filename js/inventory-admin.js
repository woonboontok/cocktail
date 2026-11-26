/* Inventory glossary and admin workflows, isolated from app orchestration. */
(function (root) {
  "use strict";

  function create(context) {
    const {
      SNOWFLAKE_SVG, INVENTORY_CATEGORIES, INVENTORY_LAST_UPDATED,
      STORAGE_KEY_INVENTORY, storage,
      getDefaultUnit, getDefaultQuantity, getInventoryAbv, parseAbvText,
      escapeHTML, normalizeSearchText, getDrinkStockStatus, getRecipesUsingItem,
      navigateToRecipesForItem, saveInventory, loadInventory,
      getBackupSnapshot, restoreBackupPayload,
      renderHeroStats, announceStatus, showModal, hideModal
    } = context;
    let inventory = context.inventory;
  // ==================== GLOSSARY & INVENTORY ====================
  let glossaryStockFilter = "all";
  let glossaryView = "list";
  let glossarySort = { column: "category", direction: "asc" };

  function focusInventoryControl(selector, id) {
    const control = [...document.querySelectorAll(selector)].find(element => element.getAttribute("data-id") === id);
    if (control) control.focus();
    return Boolean(control);
  }

  function focusAdminControlAfterRender(id) {
    const active = document.activeElement;
    const focusableClasses = ["admin-stock-toggle", "qty-number-input", "btn-qty-minus", "btn-qty-plus"];
    const activeClass = focusableClasses.find(className => active?.classList?.contains(className));
    const activeId = active?.getAttribute?.("data-id") || id;
    renderAdminView();
    if (activeClass && activeId && !focusInventoryControl(`.${activeClass}`, activeId)) {
      document.getElementById("btn-admin-add-item")?.focus();
    }
  }
  function itemNeedsRefrigeration(item) {
    return Boolean(getRefrigerateLevel(item));
  }

  function getRefrigerateLevel(item) {
    // Returns "must", "preferred", or falsy
    if (!item) return false;
    if (item.refrigerate === "must") return "must";
    if (item.refrigerate === "preferred") return "preferred";
    if (item.refrigerate === true) return "preferred"; // legacy boolean fallback
    return false;
  }

  function renderRefrigerateBadge(item) {
    const level = getRefrigerateLevel(item);
    if (!level) return "";
    if (level === "must") {
      return `<span class="inv-badge-refrigerate inv-badge-refrigerate--must" title="Must Refrigerate — will spoil without cold" aria-label="Must Refrigerate">${SNOWFLAKE_SVG}</span>`;
    }
    return `<span class="inv-badge-refrigerate inv-badge-refrigerate--preferred" title="Preferred Cold — best kept refrigerated for quality &amp; serving temperature" aria-label="Preferred Cold">${SNOWFLAKE_SVG}</span>`;
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
        const direction = glossarySort.direction === "asc" ? "ascending" : "descending";
        return `<th aria-sort="${active ? direction : "none"}"><button type="button" class="inventory-sort-btn ${active ? "active" : ""}" data-inventory-sort="${column}" aria-label="Sort by ${label}${active ? `, ${direction}` : ""}" aria-pressed="${active}">${label}${active ? (glossarySort.direction === "asc" ? " ↑" : " ↓") : ""}</button></th>`;
      };
      const statusLabel = status => status === "in-stock" ? "In Stock" : status === "incoming" ? "Incoming" : "To Buy";
      container.innerHTML = visibleItems.length ? `
        <div class="inventory-table-wrapper">
          <div class="inventory-stock-key">
            <span><i class="stock-key-dot shelf"></i>Shelf-Stable Bottles</span>
            <span><span class="stock-key-refrigerate-icon stock-key-refrigerate-icon--must">${SNOWFLAKE_SVG}</span>Must Refrigerate</span>
            <span><span class="stock-key-refrigerate-icon stock-key-refrigerate-icon--preferred">${SNOWFLAKE_SVG}</span>Preferred Cold</span>
          </div>
          <table class="inventory-table">
            <thead><tr>
              ${sortHeader("Item", "name")}
              ${sortHeader("Category", "category")}
              ${sortHeader("Type", "type")}
              ${sortHeader("Status", "status")}
              ${sortHeader("ABV", "abv")}
              ${sortHeader("Quantity", "quantity")}
              <th>Makeable drinks</th>
            </tr></thead>
            <tbody>${visibleItems.map(item => {
              const status = getInventoryStatus(item);
              const quantity = item.quantity !== undefined ? item.quantity : getDefaultQuantity(item);
              const usableRecipes = getRecipesUsingItem(item.id);
              const readyCount = usableRecipes.filter(drink => getDrinkStockStatus(drink).canMake).length;
              const linkLabel = readyCount > 0 ? `${readyCount} ready` : `${usableRecipes.length} recipes`;
              return `<tr class="${getRefrigerateLevel(item) === 'must' ? 'needs-refrigeration--must' : getRefrigerateLevel(item) === 'preferred' ? 'needs-refrigeration--preferred' : ''}">
                <td><label class="inventory-table-item"><input type="checkbox" class="inv-checkbox" data-id="${escapeHTML(item.id)}" ${item.inStock ? "checked" : ""}><span>${escapeHTML(item.name)}</span>${renderPremiumBadge(item)}${renderRefrigerateBadge(item)}</label></td>
                <td>${escapeHTML(INVENTORY_CATEGORIES[item.category] || item.category || "—")}</td>
                <td>${escapeHTML(item.subCategory || "—")}</td>
                <td><span class="inv-badge-stock ${status === "in-stock" ? "stock" : status === "incoming" ? "incoming" : "needed"}">${statusLabel(status)}</span></td>
                <td>${getInventoryAbv(item)}</td>
                <td>${quantity} ${escapeHTML(item.unit || getDefaultUnit(item))}</td>
                <td>${usableRecipes.length ? `<button class="inventory-drink-link" data-inventory-item-id="${escapeHTML(item.id)}" aria-label="Show ${usableRecipes.length} recipes using ${escapeHTML(item.name)}; ${readyCount} ready to make">${linkLabel}</button>` : "—"}</td>
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
            <input type="checkbox" class="inv-checkbox" data-id="${escapeHTML(item.id)}" aria-label="Mark ${escapeHTML(item.name)} as in stock" ${item.inStock ? "checked" : ""}>
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
              <button class="inv-used-in-btn" data-filter-ing="${escapeHTML(item.id)}" aria-label="See drinks using ${escapeHTML(item.name)}">See drinks using this →</button>
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
          if (!focusInventoryControl(".inv-checkbox", id)) {
            document.getElementById("inventory-stock-filter")?.focus();
          }
          renderHeroStats();
          announceStatus(`${item.name} marked ${checked ? "in stock" : "out of stock"}.`);
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
        const refreshedButton = [...document.querySelectorAll(".inventory-sort-btn")]
          .find(option => option.getAttribute("data-inventory-sort") === column);
        refreshedButton?.focus();
        const label = { name: "item name", category: "category", type: "type", status: "stock status", abv: "ABV", quantity: "quantity" }[column] || column;
        announceStatus(`Inventory sorted by ${label}, ${glossarySort.direction === "asc" ? "ascending" : "descending"}.`);
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
      const active = btn.getAttribute("data-inventory-view") === glossaryView;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
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
      const q = normalizeSearchText(adminSearchQuery.trim());
      const tokens = q.split(/\s+/).filter(t => t.length > 0);
      items = items.filter(i => {
        const searchableFields = [
          i.name || "",
          i.subCategory || "",
          i.notes || "",
          i.brand || "",
          i.spiritFamily || "",
          i.spiritStyle || ""
        ].map(s => normalizeSearchText(s));
        return tokens.every(token => searchableFields.some(field => field.includes(token)));
      });
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
              <input type="checkbox" class="admin-stock-toggle" data-id="${escapeHTML(item.id)}" aria-label="Mark ${escapeHTML(item.name)} as in stock" ${isStocked ? "checked" : ""}>
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
                <button type="button" class="qty-step-btn btn-qty-minus" data-id="${escapeHTML(item.id)}" title="Decrease quantity" aria-label="Decrease ${escapeHTML(item.name)} quantity">−</button>
                <input type="number" class="qty-number-input" data-id="${escapeHTML(item.id)}" aria-label="${escapeHTML(item.name)} quantity" value="${qty}" min="0" step="1">
                <button type="button" class="qty-step-btn btn-qty-plus" data-id="${escapeHTML(item.id)}" title="Increase quantity" aria-label="Increase ${escapeHTML(item.name)} quantity">＋</button>
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
              <button type="button" class="btn-edit-outline btn-admin-edit" data-id="${escapeHTML(item.id)}" title="Edit item details" aria-label="Edit ${escapeHTML(item.name)} details">Edit</button>
              <button type="button" class="btn-danger-outline btn-admin-delete" data-id="${escapeHTML(item.id)}" title="Delete item" aria-label="Delete ${escapeHTML(item.name)}">✕</button>
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
    focusAdminControlAfterRender(id);
    renderHeroStats();
    announceStatus(`${item.name} quantity updated to ${item.quantity} ${item.unit || getDefaultUnit(item)}.`);
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
    focusAdminControlAfterRender(id);
    renderHeroStats();
    announceStatus(`${item.name} marked ${willBeStocked ? "in stock" : "out of stock"}.`);
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
    if (refrigEl) refrigEl.value = "false";

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
    if (refrigEl) refrigEl.value = getRefrigerateLevel(item) || "false";

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
    const refrigerate = refrigEl ? refrigEl.value : false;

    let savedItemId = id;
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
      savedItemId = newId;
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
    const savedItemButton = [...document.querySelectorAll(".btn-admin-edit")]
      .find(button => button.getAttribute("data-id") === savedItemId);
    (savedItemButton || document.getElementById("btn-admin-add-item"))?.focus();
    announceStatus(`Inventory updated for ${name}.`);
  }

  function deleteAdminItem(id) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    if (!confirm(`Are you sure you want to remove "${item.name}" from your inventory?`)) return;

    const deletedIndex = inventory.indexOf(item);
    inventory.splice(0, inventory.length, ...inventory.filter(i => i.id !== id));
    saveInventory();
    renderAdminView();
    renderHeroStats();
    const nextItem = inventory[Math.min(deletedIndex, inventory.length - 1)];
    const nextEditButton = nextItem && [...document.querySelectorAll(".btn-admin-edit")]
      .find(button => button.getAttribute("data-id") === nextItem.id);
    (nextEditButton || document.getElementById("btn-admin-add-item"))?.focus();
    announceStatus(`${item.name} removed from inventory.`);
  }

  function exportFullBackup() {
    const backup = new Blob([JSON.stringify(getBackupSnapshot(), null, 2)], { type: "application/json" });
    const backupUrl = URL.createObjectURL(backup);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", backupUrl);
    downloadAnchor.setAttribute("download", `boons_home_bar_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(backupUrl), 1000);
  }

  function importBackupFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onerror = () => alert("Unable to read the selected backup file.");
    reader.onload = function(evt) {
      try {
        const imported = JSON.parse(evt.target.result);
        if (!Array.isArray(imported) && !confirm("Restore this full backup? It will replace your current inventory, custom recipes, drink progress, and preferences.")) {
          return;
        }
        const result = restoreBackupPayload(imported);
        if (!result.ok) {
          alert(`Unable to restore backup: ${result.error}`);
          return;
        }
        renderAdminView();
        renderHeroStats();
        const scope = result.legacy
          ? "Inventory restored from an older inventory-only backup. Recipes, progress, and preferences were left unchanged."
          : "Full home bar backup restored.";
        announceStatus(result.persistent ? `${scope} Saved in this browser.` : `${scope} Changes are available for this session only because browser storage is unavailable.`);
      } catch (err) {
        alert("Error parsing backup file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function resetInventoryToDefault() {
    if (!confirm("Reset all inventory items and quantities to the factory default bar setup? Any custom-added bottles will be reset.")) return;
    storage.removeItem(STORAGE_KEY_INVENTORY);
    inventory.splice(0, inventory.length, ...loadInventory());
    saveInventory();
    renderAdminView();
    renderHeroStats();
    announceStatus("Inventory reset to the default setup.");
  }


    function setAdminSearchQuery(value) { adminSearchQuery = value; renderAdminView(); }
    function setAdminCategoryFilter(value) { adminCategoryFilter = value; renderAdminView(); }
    function setAdminStockFilter(value) { adminStockFilter = value; renderAdminView(); }

    return {
      renderGlossary, renderAdminView, openAddItemModal, closeAdminItemModal,
      handleSaveAdminItem, exportFullBackup, importBackupFile,
      resetInventoryToDefault, setAdminSearchQuery, setAdminCategoryFilter,
      setAdminStockFilter
    };
  }

  root.BoonBarInventoryAdmin = { create };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarInventoryAdmin;
})(typeof window !== "undefined" ? window : globalThis);
