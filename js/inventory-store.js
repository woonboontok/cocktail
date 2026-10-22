/* Persistence and migration helpers for inventory state. */
(function (root) {
  "use strict";

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

  function isValidInventoryRecord(item, categories) {
    return Boolean(item && typeof item === "object" && !Array.isArray(item) &&
      typeof item.id === "string" && item.id.trim() &&
      typeof item.name === "string" && item.name.trim() &&
      Object.prototype.hasOwnProperty.call(categories, item.category) &&
      ["subCategory", "brand", "spiritFamily", "spiritStyle", "notes", "unit", "proof", "aliasOf"].every(key => item[key] === undefined || item[key] === null || typeof item[key] === "string") &&
      (item.inStock === undefined || typeof item.inStock === "boolean") &&
      (item.incoming === undefined || typeof item.incoming === "boolean") &&
      (item.premium === undefined || typeof item.premium === "boolean") &&
      (item.refrigerate === undefined || typeof item.refrigerate === "boolean") &&
      (item.abv === undefined || typeof item.abv === "number" || typeof item.abv === "string") &&
      (item.quantity === undefined || (Number.isFinite(Number(item.quantity)) && Number(item.quantity) >= 0)) &&
      (item.unit === undefined || typeof item.unit === "string"));
  }

  function normalizeInventoryRecord(item) {
    return {
      ...item,
      id: item.id.trim(),
      name: item.name.trim(),
      inStock: item.inStock === true,
      incoming: item.incoming === true,
      quantity: item.quantity === undefined ? (item.inStock ? 1 : 0) : Math.max(0, Number(item.quantity)),
      unit: typeof item.unit === "string" && item.unit.trim() ? item.unit.trim() : getDefaultUnit(item)
    };
  }

  function mergeInventoryRecords(savedRecords, defaultInventory, removedIds) {
    const savedById = new Map(savedRecords.map(item => [item.id, item]));
    const merged = defaultInventory.map(def => {
      const saved = savedById.get(def.id);
      if (!saved) return { ...def, quantity: getDefaultQuantity(def), unit: getDefaultUnit(def) };

      const inStock = saved.inStock !== undefined ? saved.inStock : def.inStock;
      const incoming = saved.incoming !== undefined ? saved.incoming : def.incoming;
      let quantity = saved.quantity !== undefined ? saved.quantity : getDefaultQuantity(def);
      if (inStock && quantity <= 0) quantity = 1;
      if (!inStock && !incoming && quantity > 0) quantity = 0;

      return {
        ...def,
        ...saved,
        id: def.id,
        inStock,
        incoming,
        quantity,
        unit: saved.unit || getDefaultUnit(def),
        refrigerate: saved.refrigerate !== undefined ? saved.refrigerate : def.refrigerate
      };
    });

    const defaultIds = new Set(defaultInventory.map(item => item.id));
    savedRecords.forEach(item => {
      if (!defaultIds.has(item.id) && item.id !== "overproof-rum" && !removedIds.includes(item.id)) {
        merged.push(normalizeInventoryRecord(item));
      }
    });
    return merged;
  }

  function loadInventory({ storage, storageKey, updateKey, defaultInventory, categories, overrides, removedIds }) {
    try {
      const saved = storage.getItem(storageKey);
      if (saved) {
        const decoded = JSON.parse(saved);
        if (!Array.isArray(decoded)) throw new Error("Saved inventory must be an array");
        const parsed = decoded.filter(item => isValidInventoryRecord(item, categories)).map(normalizeInventoryRecord);
        if (parsed.length !== decoded.length) console.warn("Skipped invalid saved inventory records");
        const merged = mergeInventoryRecords(parsed, defaultInventory, removedIds);

        if (!storage.getItem(updateKey)) {
          merged.forEach(item => {
            if (overrides[item.id]) Object.assign(item, overrides[item.id]);
          });
          storage.setItem(storageKey, JSON.stringify(merged));
          storage.setItem(updateKey, "true");
        }
        return merged;
      }
    } catch (error) {
      console.warn("Error loading inventory from localStorage", error);
    }
    return defaultInventory.map(def => ({
      ...def,
      quantity: getDefaultQuantity(def),
      unit: getDefaultUnit(def)
    }));
  }

  function saveInventory(storage, storageKey, inventory) {
    try {
      storage.setItem(storageKey, JSON.stringify(inventory));
    } catch (error) {
      console.warn("Error saving inventory", error);
    }
  }

  root.BoonBarInventoryStore = {
    getDefaultUnit,
    getDefaultQuantity,
    isValidInventoryRecord,
    normalizeInventoryRecord,
    mergeInventoryRecords,
    loadInventory,
    saveInventory
  };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarInventoryStore;
})(typeof window !== "undefined" ? window : globalThis);
