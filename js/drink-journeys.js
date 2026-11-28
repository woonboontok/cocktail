/* Curated, purpose-led tasting journeys for newcomers and experienced drinkers. */
(function (root) {
  "use strict";

  const JOURNEY_COURSES = [
    {
      key: "opening",
      title: "Open the palate",
      purpose: "Begin with a gentler bitter aperitif. It wakes the palate and sets an easy, unhurried pace.",
      beginner: { drinkId: "americano", note: "The Americano cushions bitter orange with soda and bubbles, so the first sip feels light and approachable." },
      advanced: { drinkId: "negroni", note: "Use the Negroni to compare gin botanicals, sweet vermouth, and bitter orange; notice how a little dilution softens the edges." }
    },
    {
      key: "brightener",
      title: "Find the bright line",
      purpose: "Move into citrus. This course shows how acid, sweetness, and texture create a crisp change of pace.",
      beginner: { drinkId: "tom-collins", note: "Lemon and soda make the Tom Collins bright and refreshing; notice how the bubbles lengthen the drink." },
      advanced: { drinkId: "pisco-sour", note: "Compare the tart citrus with the silky egg-white foam, then follow how aromatic bitters change the nose." }
    },
    {
      key: "feature",
      title: "Choose the feature pour",
      purpose: "Make this the centre of the journey: a balanced, expressive drink worth slowing down to savour.",
      beginner: { drinkId: "margarita", note: "The Margarita puts tequila, lime, and orange in clear conversation; try a sip with the salted rim and one without." },
      advanced: { drinkId: "last-word", note: "The Last Word is equal parts. Track how the gin, herbal Chartreuse, maraschino, and lime take turns in the finish." }
    },
    {
      key: "slow-sip",
      title: "Slow the pace",
      purpose: "Shift from bright and lively to spirit-led. Give the aroma and dilution time to unfold.",
      beginner: { drinkId: "old-fashioned", note: "Take small sips of the Old Fashioned and revisit it as the ice opens the whiskey and bitters." },
      advanced: { drinkId: "sazerac", note: "Notice the absinthe rinse first, then follow the rye, bitters, and changing dilution across the glass." }
    },
    {
      key: "soft-landing",
      title: "Land on something soft",
      purpose: "Close the core flight with a rounder, after-dinner profile that feels like a final chapter rather than another opener.",
      beginner: { drinkId: "white-russian", note: "Coffee and cream make a familiar, dessert-like finish; enjoy it slowly while it stays cold." },
      advanced: { drinkId: "espresso-martini", note: "Focus on the contrast between roast, sweetness, and fresh espresso crema; smell the coffee before each sip." }
    },
    {
      key: "reset",
      title: "Reset with zero proof",
      purpose: "Give the palate a real pause with a crisp, alcohol-free drink before deciding whether to continue.",
      beginner: { drinkId: "shirley-temple", note: "Ginger ale, citrus, and grenadine keep the pause playful and familiar." },
      advanced: { drinkId: "virgin-mojito", note: "Notice how mint aroma, lime acidity, sweetness, and carbonation create a complete alcohol-free course." }
    },
    {
      key: "digestif",
      title: "Finish with a digestif-style sip",
      purpose: "If you want one last small pour, choose a contemplative close with warmth or a lingering herbal finish.",
      beginner: { drinkId: "french-connection", note: "Cognac and amaretto make a simple, rounded final sip; serve it over ice and let the almond aroma lead." },
      advanced: { drinkId: "hanky-panky", note: "Let the small measure of Fernet sit behind the gin and vermouth; it should lengthen the herbal finish, not dominate it." }
    }
  ];

  const COURSE_PLANS = {
    "1": [2],
    "2": [0, 2],
    "3": [0, 2, 4],
    "4": [0, 1, 2, 4],
    "5": [0, 1, 2, 3, 4],
    open: [0, 1, 2, 3, 4, 5, 6]
  };

  const JOURNEY_PURPOSES = {
    unwind: {
      label: "Unwind after work", description: "Ease out of the day with a slower, softer arc.",
      drinks: { beginner: ["americano", "whiskey-sour", "old-fashioned", "manhattan", "white-russian", "cucumber-mint-cooler", "french-connection"], advanced: ["negroni", "pisco-sour", "boulevardier", "sazerac", "espresso-martini", "rosemary-grapefruit-spritzer", "hanky-panky"] }
    },
    quick: {
      label: "Quick drink", description: "A single, clear choice for a short pause. Pick one course and savour it at an easy pace.",
      drinks: { beginner: ["aperol-spritz", "gimlet", "margarita", "whiskey-highball", "bellini", "sunset-sparkler", "godmother"], advanced: ["kir-royale", "daiquiri", "naked-and-famous", "dry-martini", "parisian-cocktail", "virgin-gin-tonic", "toronto"] }
    },
    refresh: {
      label: "Thirst-quenching", description: "Lean toward tall, bright, sparkling drinks; keep water alongside your cocktail.",
      drinks: { beginner: ["tom-collins", "paloma", "mojito", "whiskey-highball", "virgin-strawberry-daiquiri", "raspberry-lime-rickey", "virgin-pina-colada"], advanced: ["americano", "french-75", "paloma-mezcal", "irish-whiskey-highball", "virgin-mojito", "pomegranate-ginger-spritz", "classic-gin-and-tonic"] }
    },
    solo: {
      label: "A quiet moment alone", description: "A personal tasting with room to notice aroma, texture, and how the drink changes in the glass.",
      drinks: { beginner: ["americano", "margarita", "whiskey-sour", "old-fashioned", "white-russian", "spiced-apple-cider", "godfather"], advanced: ["negroni", "daiquiri", "paper-plane", "sazerac", "espresso-martini", "virgin-mojito", "toronto"] }
    },
    company: {
      label: "Long conversation", description: "Choose sociable, easy-to-sip serves, and let conversation set the pace.",
      drinks: { beginner: ["americano", "tom-collins", "kir-royale", "mint-julep", "pina-colada", "cinderella", "french-connection"], advanced: ["negroni", "french-75", "aviation", "manhattan", "bellini", "virgin-gin-tonic", "hanky-panky"] }
    },
    celebrate: {
      label: "Celebrate", description: "Start bright, build to a festive feature, then finish when the moment feels complete.",
      drinks: { beginner: ["bellini", "french-75", "margarita", "whiskey-highball", "pink-russian", "sunset-sparkler", "french-connection"], advanced: ["kir-royale", "french-75", "last-word", "manhattan", "espresso-martini", "pomegranate-ginger-spritz", "vieux-carre"] }
    },
    party: {
      label: "Party with friends", description: "Keep the gathering lively with shareable punch and bowl-style pours, a coordinated optional shot toast, and a zero-proof refresh. Pour standard serves and let everyone set their own pace.",
      drinks: {
        beginner: ["barbados-rum-punch", "bavarian-russ", "maksa", "soju-tonic", "batida-de-limao", "cinderella", "somaek"],
        advanced: ["jungle-bird", "somaek", "batida-de-limao", "whiskey-highball", "maksa", "virgin-gin-tonic", "bavarian-russ"]
      }
    },
    game: {
      label: "Truth or Dare · party game", description: "Add a playful game to the gathering with globally inspired, quick-build drinks and familiar ingredients. Drinks are optional and never a forfeit; everyone chooses their own pace and can switch to a zero-proof option.",
      drinks: {
        beginner: ["mango-mule", "soju-tonic", "batida-de-limao", "sea-breeze", "cinderella", "yakult-fizz", "bavarian-russ"],
        advanced: ["maksa", "somaek", "peach-soju", "gunner", "virgin-mojito", "virgin-gin-tonic", "bavarian-russ"]
      }
    },
    comfort: {
      label: "Looking for comfort", description: "Choose something gentle and familiar. If you are feeling low, an alcohol-free option or a conversation with someone you trust may be a kinder fit.",
      drinks: { beginner: ["shirley-temple", "cinderella", "virgin-pina-colada", "spiced-apple-cider", "coconut-lime-mocktail", "virgin-mojito", "virgin-apple-martini"], advanced: ["cucumber-mint-cooler", "virgin-strawberry-daiquiri", "faux-mopolitan", "virgin-pina-colada", "yakult-fizz", "sunset-sparkler", "spiced-apple-cider"] }
    },
    decompress: {
      label: "Wind down · measured pours", description: "Choose a familiar, balanced cocktail and take your time with a standard serve. Keep water and food nearby; this is for a relaxed pause, not to make yourself pass out.",
      drinks: {
        beginner: ["americano", "tom-collins", "whiskey-sour", "manhattan", "white-russian", "shirley-temple", "french-connection"],
        advanced: ["aperol-spritz", "penicillin", "boulevardier", "sazerac", "espresso-martini", "virgin-mojito", "toronto"]
      }
    },
    spiritForward: {
      label: "Spirit-forward tasting · paced", description: "For bold base-spirit character: choose aromatic, spirit-led classics and take time with each standard serve. Keep water and food alongside; this is about flavor intensity, not drinking more.",
      drinks: {
        beginner: ["negroni", "dry-martini", "old-fashioned", "sazerac", "godfather", "virgin-gin-tonic", "manhattan"],
        advanced: ["montenegroni", "corpse-reviver-no-2", "last-word", "toronto", "hanky-panky", "virgin-mojito", "vieux-carre"]
      }
    }
  };

  function create(context) {
    const { getAllDrinks, getDrinkStockStatus, escapeHTML, openDrinkModal } = context;
    let courseCount = "3";
    let audience = "beginner";
    let purpose = "unwind";
    let container = null;

    function render() {
      if (!container) return;
      const drinksById = new Map(getAllDrinks().map(drink => [drink.id, drink]));
      const selectedCourses = COURSE_PLANS[courseCount].map(index => JOURNEY_COURSES[index]);
      const planTitle = courseCount === "open" ? "Unlimited · open-ended tasting" : `${courseCount}-course journey`;
      const audienceLabel = audience === "beginner" ? "New to cocktails" : "Experienced drinker";
      const partyGuide = purpose === "party" ? `
        <aside class="journey-party-guide" aria-label="Sharing drinks at a party">
          <h3>Make it a shared pour</h3>
          <p>Scale the Barbados Rum Punch recipe evenly for a jug, or pour Maksa into small cups for the table. Keep a zero-proof jug and water nearby so everyone has an easy choice.</p>
          <p class="journey-party-toast">Optional coordinated toast: <button type="button" class="journey-inline-drink" data-journey-drink="${audience === "beginner" ? "kamikaze" : "green-tea-shot"}">${audience === "beginner" ? "Kamikaze Shot" : "Green Tea Shot"}</button>. Make one measured serving per person who opts in; skip the round or toast with a zero-proof drink instead.</p>
        </aside>
      ` : "";
      const gameGuide = purpose === "game" ? `
        <aside class="journey-game-guide" aria-label="Truth or Dare game rules">
          <h3>Play a few rounds</h3>
          <p>Take turns choosing Truth or Dare. Let the group offer a light prompt, and let anyone pass or swap prompts without penalty. Keep score for completed prompts; after three rounds, the lowest scorer chooses a Truth or Dare prompt. No one owes a drink—pause for an optional sip only if each person wants one.</p>
          <div class="journey-game-prompts">
            <p><strong>Truth:</strong> What song always improves your mood?</p>
            <p><strong>Dare:</strong> Give a 10-second dramatic toast to the host.</p>
          </div>
        </aside>
      ` : "";
      const courseCards = selectedCourses.map((course, index) => {
        const defaultSuggestion = course[audience];
        const purposeProfile = JOURNEY_PURPOSES[purpose];
        const purposeDrinks = purposeProfile.drinks[audience];
        const purposeDrinkId = purposeDrinks[JOURNEY_COURSES.indexOf(course)];
        const courseName = course.key.replace(/-/g, " ");
        const courseArticle = /^[aeiou]/i.test(courseName) ? "An" : "A";
        const suggestion = purposeDrinkId
          ? {
            drinkId: purposeDrinkId,
            note: purposeDrinkId === defaultSuggestion.drinkId
              ? defaultSuggestion.note
              : `${courseArticle} ${courseName} pick for ${purposeProfile.label.toLowerCase()}; use the recipe for its serving and tasting cues.`
          }
          : defaultSuggestion;
        const drink = drinksById.get(suggestion.drinkId);
        if (!drink) return "";
        const stock = getDrinkStockStatus(drink);
        const stockClass = stock.canMake ? "journey-stock-ready" : "journey-stock-missing";
        const stockLabel = stock.canMake
          ? "Ready with your bar"
          : stock.missingCount
            ? `Needs ${stock.missingCount} ingredient${stock.missingCount === 1 ? "" : "s"}`
            : "Check unlinked ingredients";
        return `
          <article class="journey-course-card">
            <div class="journey-course-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</div>
            <div class="journey-course-purpose">
              <span class="journey-course-kicker">Course ${index + 1} · ${escapeHTML(courseName)}</span>
              <h3>${escapeHTML(course.title)}</h3>
              <p>${escapeHTML(course.purpose)}</p>
            </div>
            <div class="journey-course-pick">
              <div class="journey-pick-heading">Suggested for ${escapeHTML(audienceLabel)}</div>
              <button type="button" class="journey-drink-button" data-journey-drink="${escapeHTML(drink.id)}">
                <span class="journey-drink-name">${escapeHTML(drink.name)}</span>
                <span class="journey-stock ${stockClass}">${escapeHTML(stockLabel)}</span>
                <span class="journey-taste">${escapeHTML(drink.tasteProfile || "Balanced & expressive")}</span>
                <span class="journey-drink-meta">${escapeHTML(drink.glassware || "Cocktail glass")} · Difficulty ${Number(drink.difficulty) || 2}/5</span>
              </button>
              <p class="journey-tasting-note">${escapeHTML(suggestion.note)}</p>
            </div>
          </article>
        `;
      }).join("");

      container.innerHTML = `
        <section class="journey-page" aria-labelledby="journey-title">
          <header class="journey-header">
            <div class="journey-eyebrow">Guided tasting</div>
            <h2 id="journey-title">Build a drink journey</h2>
            <p>Start with the moment you want the drink to suit. Then set the course count and choose how much tasting guidance you prefer.</p>
          </header>

          <section class="journey-controls" aria-label="Tasting journey choices">
            <div class="journey-control-block journey-purpose-control">
              <h3>What is the moment?</h3>
              <div class="journey-choice-row" role="group" aria-label="Choose the occasion">
                ${Object.entries(JOURNEY_PURPOSES).map(([key, profile]) => `<button type="button" class="journey-choice ${purpose === key ? "active" : ""}" data-journey-purpose="${key}" aria-pressed="${purpose === key}">${escapeHTML(profile.label)}</button>`).join("")}
              </div>
            </div>
            <div class="journey-secondary-controls">
              <div class="journey-control-block">
                <h3>How many courses?</h3>
                <div class="journey-choice-row" role="group" aria-label="Choose number of courses">
                  ${["1", "2", "3", "4", "5"].map(count => `<button type="button" class="journey-choice ${courseCount === count ? "active" : ""}" data-journey-count="${count}" aria-pressed="${courseCount === count}">${count} ${count === "1" ? "course" : "courses"}</button>`).join("")}
                  <button type="button" class="journey-choice ${courseCount === "open" ? "active" : ""}" data-journey-count="open" aria-pressed="${courseCount === "open"}">∞ Unlimited</button>
                </div>
              </div>
              <div class="journey-control-block">
                <h3>Choose your guide</h3>
                <div class="journey-choice-row" role="group" aria-label="Choose tasting guidance level">
                  <button type="button" class="journey-choice ${audience === "beginner" ? "active" : ""}" data-journey-audience="beginner" aria-pressed="${audience === "beginner"}">New to cocktails</button>
                  <button type="button" class="journey-choice ${audience === "advanced" ? "active" : ""}" data-journey-audience="advanced" aria-pressed="${audience === "advanced"}">Experienced drinker</button>
                </div>
              </div>
            </div>
          </section>

          <div class="journey-plan-heading">
            <div>
              <span class="journey-eyebrow">Your selection</span>
              <h2>${escapeHTML(planTitle)} · ${escapeHTML(JOURNEY_PURPOSES[purpose].label)}</h2>
            </div>
            <p>${escapeHTML(JOURNEY_PURPOSES[purpose].description)} ${courseCount === "open" ? "The open-ended arc includes a zero-proof reset and optional close." : courseCount === "1" ? "One drink chosen for this moment." : "Each course changes the flavor or pace; use the recipe link to see the full build."}</p>
          </div>

          <div class="journey-flight-tip">
            <span aria-hidden="true">◉</span>
            <p>For a multi-course flight, share standard serves or reduce every ingredient in the same proportion for small tasting pours. Keep water nearby so each course gets a fresh start.</p>
          </div>

          ${gameGuide}
          ${partyGuide}
          <div class="journey-courses">${courseCards}</div>
          ${courseCount === "open" ? `
            <aside class="journey-continuation">
              <h3>Want to linger?</h3>
              <p>Repeat the zero-proof reset, revisit a favourite in a smaller pour, or finish here. The journey is a guide, not a drinking target.</p>
            </aside>
          ` : ""}
        </section>
      `;
    }

    function setup(target) {
      container = target;
      if (!container || container.dataset.journeysReady) return;
      container.dataset.journeysReady = "true";
      container.addEventListener("click", event => {
        const countButton = event.target.closest("[data-journey-count]");
        if (countButton) {
          courseCount = countButton.getAttribute("data-journey-count");
          render();
          container.querySelector(`[data-journey-count="${courseCount}"]`)?.focus();
          return;
        }
        const audienceButton = event.target.closest("[data-journey-audience]");
        if (audienceButton) {
          audience = audienceButton.getAttribute("data-journey-audience");
          render();
          container.querySelector(`[data-journey-audience="${audience}"]`)?.focus();
          return;
        }
        const purposeButton = event.target.closest("[data-journey-purpose]");
        if (purposeButton) {
          purpose = purposeButton.getAttribute("data-journey-purpose");
          render();
          container.querySelector(`[data-journey-purpose="${purpose}"]`)?.focus();
          return;
        }
        const drinkButton = event.target.closest("[data-journey-drink]");
        if (drinkButton) openDrinkModal(drinkButton.getAttribute("data-journey-drink"));
      });
    }

    return { setup, render };
  }

  root.BoonBarDrinkJourneys = { create };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarDrinkJourneys;
})(typeof window !== "undefined" ? window : globalThis);
