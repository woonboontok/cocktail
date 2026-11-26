/* Pure catalog filtering, search, and sort operations for drink discovery. */
(function (root) {
  "use strict";

  const SPIRIT_OPTIONS = [
    { value: "Whiskey/Bourbon", label: "Bourbon & Whiskey" },
    { value: "Gin", label: "Gin" },
    { value: "Rum", label: "Rum" },
    { value: "Tequila/Mezcal", label: "Tequila & Mezcal" },
    { value: "Vodka", label: "Vodka" },
    { value: "Liqueur/Wine", label: "Liqueur & Wine" },
    { value: "Non-Alcoholic", label: "Non-Alcoholic" }
  ];
  const DIFFICULTY_LABELS = {
    1: "Beginner (Build / Pour)",
    2: "Easy (Standard Shake / Stir)",
    3: "Moderate (Layering / Infusions)",
    4: "Advanced (Tiki / Multi-step)",
    5: "Master"
  };
  const TASTE_OPTIONS = [
    { value: "Citrus", label: "Citrus & Tart", pattern: /citrus|lime|lemon|grapefruit|tart|sour/i },
    { value: "Spirit-Forward", label: "Spirit-Forward", pattern: /spirit.forward|boozy|bone.dry|dry botanical|oak|whiskey|bourbon|rye|aged rum|brandy|cognac/i },
    { value: "Sweet", label: "Sweet & Fruity", pattern: /sweet|fruit|berry|peach|mango|melon|pineapple|strawberr/i },
    { value: "Bittersweet", label: "Bittersweet & Herbal", pattern: /bitter|herbal|botanical|anise|gentian|amaro/i },
    { value: "Coffee", label: "Coffee & Cream", pattern: /coffee|espresso|cream|marzipan/i },
    { value: "Tropical", label: "Tropical & Tiki", pattern: /tropical|coconut|pineapple|tiki|island/i },
    { value: "Ginger", label: "Ginger & Spicy", pattern: /ginger|spic|pepper|heat|cinnamon/i }
  ];
  const GLASS_OPTIONS = [
    { value: "coupe", label: "Coupe / Martini", pattern: /coupe|martini|nick\s*&\s*nora/i },
    { value: "rocks", label: "Rocks / Old Fashioned", pattern: /rocks|old fashioned|lowball|snifter/i },
    { value: "highball", label: "Highball / Collins", pattern: /highball|collins|copa|hurricane|tumbler/i },
    { value: "shot", label: "Shot Glass", pattern: /shot/i },
    { value: "sparkling", label: "Flute / Wine / Beer", pattern: /flute|wine|beer|pint|stein|spritz/i },
    { value: "mug", label: "Mug / Tiki", pattern: /mug|tiki|julep cup|bowl/i }
  ];

  function matchesSpirit(drink, spiritVal, normalizeSearchText) {
    if (!spiritVal || spiritVal === "all") return true;
    const base = String(drink.baseSpirit || "");
    if (spiritVal === "Whiskey/Bourbon") return /whiskey|bourbon|scotch|rye/i.test(base);
    if (spiritVal === "Tequila/Mezcal") return /tequila|mezcal/i.test(base);
    if (spiritVal === "Liqueur/Wine") return /liqueur|wine|brandy|cognac|champagne|pisco|amaro|vermouth/i.test(base);
    if (spiritVal === "Non-Alcoholic") return base === "Non-Alcoholic" || drink.category === "Mocktail";
    if (spiritVal === "Gin") return /gin/i.test(base);
    if (spiritVal === "Vodka") return /vodka/i.test(base);
    if (spiritVal === "Rum") return /rum|cachaça|cachaca/i.test(base);
    return normalizeSearchText(base).includes(normalizeSearchText(spiritVal));
  }

  function matchesTaste(drink, tasteVal) {
    const option = TASTE_OPTIONS.find(candidate => candidate.value === tasteVal);
    return Boolean(option && option.pattern.test(String(drink.tasteProfile || "")));
  }

  function matchesGlass(drink, glassVal) {
    const option = GLASS_OPTIONS.find(candidate => candidate.value === glassVal);
    return Boolean(option && option.pattern.test(String(drink.glassware || "")));
  }

  function getDiscoveryFilterOptions(drinks, normalizeSearchText) {
    const countWhere = predicate => drinks.filter(predicate).length;
    const all = [{ value: "all", label: "All", count: drinks.length }];
    const spirit = SPIRIT_OPTIONS
      .filter(option => countWhere(drink => matchesSpirit(drink, option.value, normalizeSearchText)) > 0)
      .map(option => ({ ...option, count: countWhere(drink => matchesSpirit(drink, option.value, normalizeSearchText)) }));
    const difficulty = [...new Set(drinks.map(drink => Number(drink.difficulty)).filter(Number.isFinite))]
      .sort((a, b) => a - b)
      .map(value => ({ value: String(value), label: DIFFICULTY_LABELS[value] || `Level ${value}`, count: countWhere(drink => Number(drink.difficulty) === value) }));
    const taste = TASTE_OPTIONS
      .filter(option => countWhere(drink => matchesTaste(drink, option.value)) > 0)
      .map(option => ({ ...option, count: countWhere(drink => matchesTaste(drink, option.value)) }));
    const glass = GLASS_OPTIONS
      .filter(option => countWhere(drink => matchesGlass(drink, option.value)) > 0)
      .map(option => ({ ...option, count: countWhere(drink => matchesGlass(drink, option.value)) }));

    return {
      spirit: [...all, ...spirit],
      difficulty: [{ ...all[0], label: "All Levels" }, ...difficulty],
      taste: [{ ...all[0], label: "All Flavors" }, ...taste],
      glass: [{ ...all[0], label: "All Glassware" }, ...glass]
    };
  }

  function filterAndSortDrinks(state, helpers) {
    const {
      getDrinkStockStatus,
      getDrinkStatus,
      getIngredientCandidates,
      getInventoryItem,
      ingredientGroups,
      normalizeSearchText,
      getDrinkAbvValue
    } = helpers;
    let drinks = [...state.drinks];

    if (state.currentTab === "cocktails") drinks = drinks.filter(d => d.category === "Cocktail");
    else if (state.currentTab === "mocktails") drinks = drinks.filter(d => d.category === "Mocktail");
    else if (state.currentTab === "shots") drinks = drinks.filter(d => d.category === "Shot");

    if (state.filterOnlyMyBar) drinks = drinks.filter(d => getDrinkStockStatus(d).canMake);
    if (state.drinkStatusFilters.tried !== null) {
      drinks = drinks.filter(d => Boolean(getDrinkStatus(d.id).tried) === state.drinkStatusFilters.tried);
    }
    if (state.drinkStatusFilters.constructed !== null) {
      drinks = drinks.filter(d => Boolean(getDrinkStatus(d.id).constructed) === state.drinkStatusFilters.constructed);
    }
    if (state.selectedSpirit !== "all") {
      drinks = drinks.filter(d => matchesSpirit(d, state.selectedSpirit, normalizeSearchText));
    }
    if (state.selectedDifficulty !== "all") {
      drinks = drinks.filter(d => String(d.difficulty) === String(state.selectedDifficulty));
    }
    if (state.selectedGlass !== "all") {
      drinks = drinks.filter(d => matchesGlass(d, state.selectedGlass));
    }
    if (state.selectedTaste !== "all") {
      drinks = drinks.filter(d => matchesTaste(d, state.selectedTaste));
    }
    if (state.inventoryRecipeFilterIds) {
      drinks = drinks.filter(d => state.inventoryRecipeFilterIds.includes(d.id));
    }

    if (state.searchQuery.trim()) {
      const q = normalizeSearchText(state.searchQuery.trim());
      const rawTokens = q.split(/\s+/).filter(Boolean);
      const searchStopWords = new Set([
        "drinks", "drink", "cocktails", "cocktail", "shots", "shot",
        "to", "make", "with", "using", "for", "in", "a", "an", "the",
        "can", "i", "how", "recipes", "recipe"
      ]);
      const nonStopTokens = rawTokens.filter(token => !searchStopWords.has(token));
      const tokens = nonStopTokens.length ? nonStopTokens : rawTokens;

      drinks = drinks.filter(drink => {
        const candidateBottleFields = [];
        drink.ingredients.forEach(ingredient => {
          getIngredientCandidates(ingredient).forEach(candidateId => {
            const item = getInventoryItem(candidateId);
            if (item) candidateBottleFields.push(item.name, item.subCategory, item.spiritStyle);
          });
        });

        const searchableFields = [
          drink.name,
          drink.otherNames || "",
          drink.baseSpirit || "",
          drink.category || "",
          drink.tasteProfile || "",
          drink.proTip || "",
          ...(drink.tags || []),
          ...drink.ingredients.map(ingredient => ingredient.item || ""),
          ...drink.ingredients.map(ingredient => ingredient.substitute || ""),
          ...drink.ingredients.map(ingredient => {
            if (!ingredient.inventoryId) return "";
            const item = getInventoryItem(ingredient.inventoryId);
            return item ? item.name : "";
          }),
          ...drink.ingredients.map(ingredient => {
            if (!ingredient.ingredientGroup || !ingredientGroups[ingredient.ingredientGroup]) return "";
            return ingredientGroups[ingredient.ingredientGroup].label;
          }),
          ...candidateBottleFields
        ].map(normalizeSearchText);

        return tokens.every(token => searchableFields.some(field => field.includes(token)));
      });
    }

    drinks.sort((a, b) => {
      switch (state.sortBy) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "popularity-desc": {
          if (state.searchQuery.trim()) {
            const q = normalizeSearchText(state.searchQuery.trim());
            const aNameMatch = normalizeSearchText(a.name).includes(q) || (a.otherNames && normalizeSearchText(a.otherNames).includes(q));
            const bNameMatch = normalizeSearchText(b.name).includes(q) || (b.otherNames && normalizeSearchText(b.otherNames).includes(q));
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;
          }
          return (b.popularity || 0) - (a.popularity || 0);
        }
        case "difficulty-asc": return (a.difficulty || 1) - (b.difficulty || 1);
        case "difficulty-desc": return (b.difficulty || 1) - (a.difficulty || 1);
        case "alcohol-desc": {
          const aAbv = getDrinkAbvValue(a);
          const bAbv = getDrinkAbvValue(b);
          if (aAbv !== null && bAbv !== null && aAbv !== bAbv) return bAbv - aAbv;
          return (b.alcoholScore || 0) - (a.alcoholScore || 0) || (b.popularity || 0) - (a.popularity || 0);
        }
        case "ingredients-asc": return a.ingredients.length - b.ingredients.length;
        default: return 0;
      }
    });

    return drinks;
  }

  root.BoonBarDrinkCatalog = { filterAndSortDrinks, getDiscoveryFilterOptions };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarDrinkCatalog;
})(typeof window !== "undefined" ? window : globalThis);
