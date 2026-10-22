/* Pure recipe calculations used by the catalog and recipe modal. */
(function (root) {
  "use strict";

  function getDrinkVolume(drink) {
    let totalMl = 0;
    let hasTopUp = false;
    drink.ingredients.forEach(ingredient => {
      const amount = String(ingredient.amountMl || ingredient.amountOz || "").toLowerCase();
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

  function getAbv(drink) {
    const match = String(drink.alcoholLevel || "").match(/(?:~)?(\d+(?:\.\d+)?)%\s*ABV/i);
    return match ? `${match[1]}% ABV` : "ABV not specified";
  }

  function getDrinkAbvValue(drink) {
    return parseAbvText(drink && drink.alcoholLevel);
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

  root.BoonBarRecipeUtils = { getDrinkVolume, getAbv, getDrinkAbvValue, parseAbvText, getInventoryAbv };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarRecipeUtils;
})(typeof window !== "undefined" ? window : globalThis);
