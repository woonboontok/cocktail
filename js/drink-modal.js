/* Drink recipe detail rendering and modal interactions. */
(function (root) {
  "use strict";

  function create(context) {
    const {
      getUnitPreference, setUnitPreference, storageKeyUnit, storage, getAllDrinks,
      getDrinkStockStatus, getDrinkStatus, isItemInStock,
      getIngredientInventoryOptions, getInventoryOptionStatus, getDefaultUnit,
      getInventoryAbv, getDifficultyStars, getAbv, getDrinkVolume, getGlasswareCapacity,
      ingredientGroups, escapeHTML, toggleDrinkStatus, showModal, hideModal
    } = context;
    let unitPreference = getUnitPreference();
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

  function renderProTip(drink) {
    const paragraphs = String(drink.proTip || "")
      .split(/\n\s*\n/)
      .map(part => part.trim())
      .filter(Boolean);
    if (!paragraphs.length) return "";

    const sections = { tip: [], variants: [], story: [] };
    paragraphs.forEach(paragraph => {
      const isVariant = /\b(variants?|substitut(?:e|ion|ions)|swap|alternative)\b/i.test(paragraph) || /^[-•]/m.test(paragraph);
      const isStory = /\b(created|invented|origin|named after|tradition|ritual|means |first (?:made|served|recorded)|dating back|popularized|history)\b/i.test(paragraph);
      sections[isVariant ? "variants" : isStory ? "story" : "tip"].push(paragraph);
    });

    const renderParagraph = text => {
      const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
      const listLines = lines.filter(line => /^[-•]/.test(line));
      const plainLines = lines.filter(line => !/^[-•]/.test(line));
      return `${plainLines.length ? `<p>${plainLines.map(escapeHTML).join(" ")}</p>` : ""}${listLines.length ? `<ul>${listLines.map(line => `<li>${escapeHTML(line.replace(/^[-•]\s*/, ""))}</li>`).join("")}</ul>` : ""}`;
    };

    const blocks = [];
    if (sections.tip.length) blocks.push(`<section class="pro-tip-section"><h4>Bar tip</h4>${sections.tip.map(renderParagraph).join("")}</section>`);
    if (sections.variants.length) blocks.push(`<section class="pro-tip-section"><h4>Variants &amp; substitutions</h4>${sections.variants.map(renderParagraph).join("")}</section>`);
    if (sections.story.length) blocks.push(`<section class="pro-tip-section pro-tip-story"><h4>A little backstory</h4>${sections.story.map(renderParagraph).join("")}</section>`);

    const swaps = [...new Set((drink.ingredients || [])
      .filter(ing => ing.substitute && !/^(?:none|n\/a|no substitute)$/i.test(ing.substitute.trim()))
      .map(ing => `${ing.item}: ${ing.substitute}`))].slice(0, 4);
    if (swaps.length && !sections.variants.length) {
      blocks.push(`<section class="pro-tip-section"><h4>Easy swaps</h4><ul>${swaps.map(swap => `<li>${escapeHTML(swap)}</li>`).join("")}</ul></section>`);
    }
    return blocks.join("");
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
    const bottledMixerIds = new Set([
      "chang-soda-water",
      "chang-lime-soda",
      "fever-tree-indian-tonic",
      "tonic-water",
      "fever-tree-ginger-beer",
      "bundaberg-ginger-beer",
      "ginger-beer",
      "beer-lager"
    ]);
    const bottledMixerGroups = new Set(["soda-water", "lime-soda", "tonic-water", "ginger-beer", "beer"]);
    const usesBottledMixer = (drink.ingredients || []).some(ing => {
      const invId = String(ing.inventoryId || "");
      const grp = String(ing.ingredientGroup || "");
      const item = String(ing.item || "").toLowerCase();
      return bottledMixerIds.has(invId) ||
        bottledMixerGroups.has(grp) ||
        /\b(?:soda water|lime soda|tonic(?: water)?|ginger beer|beer|lager)\b/.test(item);
    });
    if (usesBottledMixer) tools.push("Bottle opener");
    if (/copper mug|moscow mule/.test(glassware) || /mule/.test(drinkName)) tools.push("500 ml Moscow Mule mug");
    else if (/champagne|flute|coupe|martini|nick & nora/.test(glassware)) tools.push(`Chilled ${drink.glassware || "cocktail glass"}`);
    else tools.push(drink.glassware || "Serving glass");

    if (/highball|collins|copa|hurricane|copper mug|tiki/.test(glassware)) tools.push("Straight or bent 304 stainless steel straw");
    const crushedIceServe = /crushed|swizzle|tiki|julep/.test(method + " " + glassware);
    const rocksServe = /rocks|old fashioned|snifter/.test(glassware);
    const tallServe = /highball|collins|copa|hurricane|copper mug|tiki/.test(glassware);
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
    unitPreference = getUnitPreference();
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
      const hasInventoryLink = Boolean(ing.inventoryId || (ing.ingredientGroup && Object.prototype.hasOwnProperty.call(ingredientGroups, ing.ingredientGroup)));
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
          <div class="ingredient-option-header" aria-hidden="true">
            <span>Name</span>
            <span>ABV</span>
            <span>Qty</span>
            <span>Status</span>
          </div>
          <ul class="ingredient-options-list">
            ${inventoryOptions.map(item => {
              const optionStatus = getInventoryOptionStatus(item);
              const quantity = item.quantity !== undefined ? `${item.quantity} ${escapeHTML(item.unit || getDefaultUnit(item))}` : "Quantity not tracked";
              const alcoholLevel = getInventoryAbv(item).replace(/\s*ABV$/i, "");
              const reserveBadge = (item.premium && ing.preferNonPremium)
                ? `<span class="ingredient-option-reserve" title="Save for cocktails where it can shine — the modifiers in this recipe tend to mask its complexity">✦ Reserve</span>`
                : "";
              return `
                <li class="ingredient-option${item.premium && ing.preferNonPremium ? " ingredient-option-premium" : ""}">
                  <span class="ingredient-option-name">${escapeHTML(item.name)} ${reserveBadge}</span>
                  <span class="ingredient-option-alcohol">${alcoholLevel}</span>
                  <span class="ingredient-option-meta">${quantity}</span>
                  <span class="ingredient-option-status ${optionStatus.className}">${optionStatus.label}</span>
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
      <div class="drink-actions"><button type="button" class="status-action ${status.tried ? "active" : ""}" data-status="tried" aria-pressed="${Boolean(status.tried)}">${status.tried ? "✓ Tried it" : "Mark as tried"}</button><button type="button" class="status-action ${status.constructed ? "active" : ""}" data-status="constructed" aria-pressed="${Boolean(status.constructed)}">${status.constructed ? "⚗ Constructed" : "Mark as constructed"}</button></div>
      </div>

      <div class="modal-body">
        <!-- Specs Table -->
        <div class="specs-table-container">
          <div class="specs-table-title">Cocktail Specifications & Profile</div>
          <table class="specs-table">
            <tbody>
              <tr>
                <th>Glassware</th>
                <td>${escapeHTML(drink.glassware || "Cocktail Glass")}<span class="spec-note">Typical capacity: ${escapeHTML(getGlasswareCapacity(drink.glassware))}. Capacities vary by glass model; leave headroom for ice and garnish.</span></td>
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
            <div class="unit-toggle-pills" id="modal-unit-pills" role="group" aria-label="Measurement units">
              <button type="button" class="unit-pill ${unitPreference === "both" ? "active" : ""}" data-unit="both" aria-pressed="${unitPreference === "both"}">Both (oz & ml)</button>
              <button type="button" class="unit-pill ${unitPreference === "oz" ? "active" : ""}" data-unit="oz" aria-pressed="${unitPreference === "oz"}">oz</button>
              <button type="button" class="unit-pill ${unitPreference === "ml" ? "active" : ""}" data-unit="ml" aria-pressed="${unitPreference === "ml"}">ml</button>
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

        ${drink.bestMoment ? `
          <aside class="best-moment-box" aria-label="When and how to enjoy this drink">
            <div class="best-moment-icon" aria-hidden="true">✦</div>
            <div>
              <div class="best-moment-title">Best enjoyed when</div>
              <p>${escapeHTML(drink.bestMoment)}</p>
            </div>
          </aside>
        ` : ""}

        <!-- Pro-Tip Section -->
        ${drink.proTip ? `
          <div class="pro-tip-box">
            <div class="pro-tip-icon">💡</div>
            <div>
              <div class="pro-tip-title">A little more about this drink</div>
              <div class="pro-tip-content">${renderProTip(drink)}</div>
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
        setUnitPreference(u);
        storage.setItem(storageKeyUnit, u);
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


    return { openDrinkModal, closeDrinkModal };
  }

  root.BoonBarDrinkModal = { create };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarDrinkModal;
})(typeof window !== "undefined" ? window : globalThis);
