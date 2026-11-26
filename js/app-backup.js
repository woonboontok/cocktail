/* Versioned full-app backup format with support for legacy inventory arrays. */
(function (root) {
  "use strict";

  const FORMAT = "boons-home-bar-backup";
  const VERSION = 1;

  function isPlainObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function createBackup(snapshot) {
    return {
      format: FORMAT,
      version: VERSION,
      exportedAt: new Date().toISOString(),
      data: {
        inventory: snapshot.inventory,
        customDrinks: snapshot.customDrinks,
        drinkStatuses: snapshot.drinkStatuses,
        preferences: snapshot.preferences
      }
    };
  }

  function parseBackup(payload, helpers) {
    const legacy = Array.isArray(payload);
    if (!legacy && (!isPlainObject(payload) || payload.format !== FORMAT || payload.version !== VERSION || !isPlainObject(payload.data))) {
      return { ok: false, error: "Unsupported backup format or version." };
    }

    const data = legacy ? { inventory: payload } : payload.data;
    const { inventory, customDrinks, drinkStatuses, preferences } = data;
    if (!Array.isArray(inventory) || inventory.length === 0 || !inventory.every(item => helpers.isValidInventoryRecord(item))) {
      return { ok: false, error: "Backup inventory must contain valid inventory records." };
    }
    const inventoryIds = inventory.map(item => item.id.trim());
    if (new Set(inventoryIds).size !== inventoryIds.length) {
      return { ok: false, error: "Backup inventory contains duplicate item IDs." };
    }

    const normalizedInventory = inventory.map(helpers.normalizeInventoryRecord);
    if (legacy) return { ok: true, legacy: true, data: { inventory: normalizedInventory } };

    if (!Array.isArray(customDrinks) || !customDrinks.every(helpers.isValidCustomDrink)) {
      return { ok: false, error: "Backup custom recipes are invalid." };
    }
    const drinkIds = customDrinks.map(drink => drink.id.trim());
    if (new Set(drinkIds).size !== drinkIds.length) {
      return { ok: false, error: "Backup contains duplicate custom recipe IDs." };
    }
    if (!isPlainObject(drinkStatuses) || !Object.values(drinkStatuses).every(status =>
      isPlainObject(status) && Object.entries(status).every(([key, value]) =>
        ["tried", "constructed"].includes(key) && typeof value === "boolean"
      )
    )) {
      return { ok: false, error: "Backup drink progress is invalid." };
    }

    const validThemes = ["auto", "morning", "afternoon", "twilight", "evening", "night", "latenight", "graveyard"];
    if (!isPlainObject(preferences) || !["both", "oz", "ml"].includes(preferences.unitPreference) ||
        !validThemes.includes(preferences.theme) || typeof preferences.filtersCollapsed !== "boolean") {
      return { ok: false, error: "Backup preferences are invalid." };
    }

    return {
      ok: true,
      legacy: false,
      data: {
        inventory: normalizedInventory,
        customDrinks: helpers.normalizeCustomDrinks(customDrinks),
        drinkStatuses: JSON.parse(JSON.stringify(drinkStatuses)),
        preferences: { ...preferences }
      }
    };
  }

  root.BoonBarAppBackup = { createBackup, parseBackup };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarAppBackup;
})(typeof window !== "undefined" ? window : globalThis);
