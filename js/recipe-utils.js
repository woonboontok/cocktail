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

  function getGlasswareCapacity(glassware) {
    const text = String(glassware || "").toLowerCase().replace(/nick\s*&\s*nora/g, "nick and nora");
    const choices = text.split(/\s*(?:\/|\+|\bor\b|&)\s*/i).map(part => part.trim()).filter(Boolean);
    const capacities = choices.map(choice => {
      if (/nick and nora/.test(choice)) return ["Nick & Nora", "120–180 ml"];
      if (/irish coffee/.test(choice)) return ["Irish coffee glass", "200–300 ml"];
      if (/tiki/.test(choice)) return ["Tiki mug", "400–600 ml"];
      if (/hurricane/.test(choice)) return ["Hurricane glass", "400–600 ml"];
      if (/julep/.test(choice)) return ["Julep cup", "300–400 ml"];
      if (/coupe/.test(choice)) return ["Coupe", "150–220 ml"];
      if (/martini/.test(choice)) return ["Martini glass", "150–240 ml"];
      if (/flute/.test(choice)) return ["Champagne flute", "150–240 ml"];
      if (/tall shot|double shot/.test(choice)) return ["Shooter glass", "60–90 ml"];
      if (/shot/.test(choice)) return ["Shot glass", "30–60 ml"];
      if (/pint/.test(choice)) return ["Pint glass", "475–570 ml"];
      if (/weizen|beer|stein/.test(choice)) return ["Beer / Weizen glass", "400–570 ml"];
      if (/wine|copa|spritz/.test(choice)) return ["Wine / Copa glass", "350–500 ml"];
      if (/mug/.test(choice)) return ["Mug", "350–500 ml"];
      if (/collins/.test(choice)) return ["Collins glass", "300–410 ml"];
      if (/double rocks|double old fashioned/.test(choice)) return ["Double rocks glass", "300–400 ml"];
      if (/rocks|old fashioned|lowball/.test(choice)) return ["Rocks glass", "180–300 ml"];
      if (/snifter/.test(choice)) return ["Brandy snifter", "250–400 ml"];
      if (/highball|tumbler/.test(choice)) return ["Highball / tumbler", "250–350 ml"];
      if (/bowl/.test(choice)) return ["Ceramic bowl", "300–500 ml"];
      return null;
    }).filter(Boolean);
    const unique = capacities.filter((item, index) => capacities.findIndex(other => other[0] === item[0]) === index);
    if (!unique.length) return "Choose a vessel that leaves room for ice and garnish";
    return unique.map(([label, capacity]) => `${label}: ${capacity}`).join(" · ");
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

  root.BoonBarRecipeUtils = { getDrinkVolume, getGlasswareCapacity, getAbv, getDrinkAbvValue, parseAbvText, getInventoryAbv };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarRecipeUtils;
})(typeof window !== "undefined" ? window : globalThis);
