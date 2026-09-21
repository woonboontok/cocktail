/**
 * HOME BAR GUIDE - COMPLETE DATASET
 * Contains Inventory (user bottles & shopping list)
 * and all Cocktails, Mocktails, and Shots.
 */

const INVENTORY_CATEGORIES = {
  spirits: "Base Spirits",
  liqueurs: "Liqueurs & Cordials",
  fortified: "Fortified Wines & Aperitifs",
  sparkling: "Sparkling Wines",
  mixers_sodas: "Mixers, Sodas & Juices",
  bitters_syrups: "Bitters, Syrups & Sweeteners",
  fresh_garnishes: "Fresh Produce, Dairy & Garnishes"
};

const INVENTORY_LAST_UPDATED = "17 September 2026";
const INVENTORY_SYNC_VERSION = "20260917_2";

const INVENTORY_UPDATE_OVERRIDES = {
  "simple-syrup": { inStock: true, quantity: 1 },
  "chang-soda-water": { inStock: true, quantity: 24, unit: "bottle" },
  "whipped-cream": { inStock: true, quantity: 1 },
  "whipping-heavy-cream": { inStock: true, quantity: 1 },
  "egg-white": { inStock: true, quantity: 1 },
  "ice": { inStock: true, quantity: 1 },
  "fresh-espresso": { inStock: true, quantity: 1, unit: "on demand" },
  "cranberry-juice": { inStock: true, quantity: 1, unit: "carton" },
  "hennessy-vsop-cognac": { inStock: true, incoming: false, quantity: 1, unit: "bottle" },
  "premier-french-brandy-napoleon-special-reserve": { inStock: true, quantity: 1, unit: "bottle" },
  "otard-xo-gold-cognac": { inStock: true, quantity: 1, unit: "bottle" },
  "bacardi-superior": { inStock: true, quantity: 2, unit: "bottle" },
  "sambuca": { inStock: true, quantity: 1, unit: "bottle" },
  "goslings-black-seal-151": { inStock: true, incoming: false, quantity: 1, unit: "bottle" },
  "mount-gay-black-barrel": { inStock: true, incoming: false, quantity: 1, unit: "bottle" },
  "topanito-mezcal-artesanal-espadin": { inStock: true, incoming: false, quantity: 1, unit: "bottle" },
  "jagermeister": { inStock: true, incoming: false, quantity: 2, unit: "bottle" },
  "frangelico": { inStock: true, incoming: false, quantity: 1, unit: "bottle" },
  "orgeat-syrup": { inStock: true, incoming: false, quantity: 1, unit: "bottle" },
  "coffee-beans": { inStock: true, incoming: false, quantity: 1, unit: "pack" },
  "fresh-oranges": { inStock: true, quantity: 1, unit: "fruit" },
  "fresh-limes": { inStock: true, quantity: 1, unit: "fruit" },
  "grapefruit-juice": { inStock: true, quantity: 1, unit: "fruit" },
  "pineapple-juice": { inStock: true, quantity: 1, unit: "fruit" },
  "tanqueray-gin": { inStock: true, quantity: 2, unit: "bottle" },
  "tabasco-sauce": { inStock: true, quantity: 1, unit: "bottle" },
  "fever-tree-ginger-beer": { inStock: true, quantity: 6, unit: "pack" },
  "bundaberg-ginger-beer": { inStock: true },
  "ginger-beer": { inStock: true, aliasOf: "fever-tree-ginger-beer" },
  "fever-tree-indian-tonic": { inStock: true, quantity: 6, unit: "pack" },
  "tonic-water": { inStock: true, aliasOf: "fever-tree-indian-tonic" },
  "energy-drink": { inStock: true, quantity: 4, unit: "can" }
};

const INGREDIENT_GROUPS = {
  "prosecco": {
    label: "Prosecco",
    inventoryIds: ["gio-prosecco", "zonin-prosecco-brut", "bottega-spumante-venezia"]
  },
  "white-rum": {
    label: "White Rum",
    inventoryIds: ["bacardi-superior"]
  },
  "dark-rum": {
    label: "Dark Rum",
    inventoryIds: ["myers-dark-rum", "mount-gay-black-barrel"]
  },
  "overproof-rum": {
    label: "Overproof Rum",
    inventoryIds: ["goslings-black-seal-151"]
  },
  "cachaca": {
    label: "Cachaça",
    inventoryIds: ["cachaca"]
  },
  "gin": {
    label: "London Dry Gin",
    inventoryIds: ["tanqueray-gin"]
  },
  "vodka": {
    label: "Vodka",
    inventoryIds: ["absolut-blue", "smirnoff-red"]
  },
  "bourbon": {
    label: "Bourbon Whiskey",
    inventoryIds: ["jim-beam-black"]
  },
  "rye-whiskey": {
    label: "Rye Whiskey",
    inventoryIds: ["jd-bonded-rye"]
  },
  "scotch": {
    label: "Scotch Whisky",
    inventoryIds: ["jw-black-label"]
  },
  "irish-whiskey": {
    label: "Irish Whiskey",
    inventoryIds: ["irish-whiskey"]
  },
  "tequila": {
    label: "Tequila",
    inventoryIds: ["teremana-tequila"]
  },
  "mezcal": {
    label: "Mezcal",
    inventoryIds: ["topanito-mezcal-artesanal-espadin"]
  },
  "brandy-cognac": {
    label: "Cognac / French Brandy",
    inventoryIds: ["hennessy-vsop-cognac", "otard-xo-gold-cognac", "premier-french-brandy-napoleon-special-reserve"]
  },
  "pisco": {
    label: "Pisco",
    inventoryIds: ["pisco"]
  },
  "triple-sec": {
    label: "Triple Sec / Orange Liqueur",
    inventoryIds: ["cointreau", "grand-marnier", "lumina-triple-sec", "curacao-bleu"]
  },
  "coffee-liqueur": {
    label: "Coffee Liqueur",
    inventoryIds: ["kahlua", "walcher-coffee"]
  },
  "sambuca": {
    label: "White Sambuca",
    inventoryIds: ["sambuca"]
  },
  "amaretto": {
    label: "Amaretto",
    inventoryIds: ["disaronno-amaretto"]
  },
  "hazelnut-liqueur": {
    label: "Hazelnut Liqueur",
    inventoryIds: ["frangelico", "disaronno-amaretto"]
  },
  "irish-cream": {
    label: "Irish Cream",
    inventoryIds: ["baileys-irish-cream"]
  },
  "peach-liqueur": {
    label: "Peach Liqueur",
    inventoryIds: ["hoffmann-peach"]
  },
  "cherry-liqueur": {
    label: "Cherry Liqueur",
    inventoryIds: ["cherry-heering"]
  },
  "elderflower-liqueur": {
    label: "Elderflower Liqueur",
    inventoryIds: ["st-germain"]
  },
  "coconut-rum": {
    label: "Coconut Rum",
    inventoryIds: ["malibu-rum"]
  },
  "herbal-liqueur": {
    label: "Herbal Liqueur",
    inventoryIds: ["jagermeister"]
  },
  "maraschino": {
    label: "Maraschino Liqueur",
    inventoryIds: ["maraschino-liqueur"]
  },
  "creme-de-violette": {
    label: "Crème de Violette",
    inventoryIds: ["creme-de-violette"]
  },
  "creme-de-cassis": {
    label: "Crème de Cassis",
    inventoryIds: ["creme-de-cassis"]
  },
  "creme-de-mure": {
    label: "Crème de Mûre",
    inventoryIds: ["creme-de-mure"]
  },
  "drambuie": {
    label: "Drambuie",
    inventoryIds: ["drambuie"]
  },
  "green-chartreuse": {
    label: "Green Chartreuse",
    inventoryIds: ["green-chartreuse"]
  },
  "yellow-chartreuse": {
    label: "Yellow Chartreuse",
    inventoryIds: ["yellow-chartreuse"]
  },
  "midori": {
    label: "Midori Melon Liqueur",
    inventoryIds: ["midori"]
  },
  "fireball": {
    label: "Cinnamon Whisky",
    inventoryIds: ["fireball"]
  },
  "absinthe": {
    label: "Absinthe",
    inventoryIds: ["absinthe"]
  },
  "tequila-rose": {
    label: "Strawberry Cream Liqueur",
    inventoryIds: ["tequila-rose"]
  },
  "dry-vermouth": {
    label: "Dry Vermouth",
    inventoryIds: ["martini-extra-dry"]
  },
  "sweet-vermouth": {
    label: "Sweet Vermouth",
    inventoryIds: ["martini-rosso"]
  },
  "aperol": {
    label: "Aperol",
    inventoryIds: ["aperol"]
  },
  "campari": {
    label: "Campari",
    inventoryIds: ["campari"]
  },
  "lillet-blanc": {
    label: "Lillet Blanc",
    inventoryIds: ["lillet-blanc"]
  },
  "amaro": {
    label: "Amaro",
    inventoryIds: ["amaro-nonino"]
  },
  "ginger-beer": {
    label: "Ginger Beer",
    inventoryIds: ["fever-tree-ginger-beer", "bundaberg-ginger-beer", "ginger-beer"]
  },
  "tonic-water": {
    label: "Tonic Water",
    inventoryIds: ["fever-tree-indian-tonic", "tonic-water"]
  },
  "fresh-lime": { label: "Fresh Lime", inventoryIds: ["fresh-limes"] },
  "fresh-lemon": { label: "Fresh Lemon", inventoryIds: ["fresh-lemons"] },
  "fresh-mint": { label: "Fresh Mint", inventoryIds: ["fresh-mint"] },
  "soda-water": { label: "Soda Water", inventoryIds: ["chang-soda-water"] },
  "simple-syrup": { label: "Simple Syrup", inventoryIds: ["simple-syrup"] }
};

const INGREDIENT_GROUP_BY_INVENTORY_ID = Object.entries(INGREDIENT_GROUPS).reduce((groups, [groupId, group]) => {
  group.inventoryIds.forEach(inventoryId => {
    if (!groups[inventoryId]) groups[inventoryId] = groupId;
  });
  return groups;
}, {});
// Optimized multi-group mapping configuration
const INGREDIENT_GROUPS_BY_INVENTORY_ID = Object.entries(INGREDIENT_GROUPS).reduce((groups, [groupId, group]) => {
  group.inventoryIds.forEach(inventoryId => {
    if (!groups[inventoryId]) groups[inventoryId] = [];
    groups[inventoryId].push(groupId);
  });
  return groups;
}, {});

const DEFAULT_INVENTORY = [
  // --- BASE SPIRITS (User In Stock) ---
  { id: "jd-bonded-rye", name: "Jack Daniel's Bonded Rye Tennessee Whiskey", category: "spirits", subCategory: "Whiskey › Tennessee Rye", spiritFamily: "Whiskey", spiritStyle: "Tennessee Rye", inStock: true, abv: 50, notes: "Bold 100-proof rye with cracked pepper, baking spice, and oak." },
  { id: "jim-beam-black", name: "Jim Beam Black Aged Bourbon", category: "spirits", subCategory: "Whiskey › Bourbon", spiritFamily: "Whiskey", spiritStyle: "Bourbon", inStock: true, abv: 43, notes: "Extra-aged Kentucky straight bourbon. Rich caramel and vanilla." },
  { id: "jw-black-label", name: "Johnnie Walker Black Label Scotch Whisky", category: "spirits", subCategory: "Whiskey › Scotch", spiritFamily: "Whiskey", spiritStyle: "Scotch", inStock: true, abv: 40, notes: "12-year blended Scotch whisky with balanced fruit and gentle peat smoke." },
  { id: "hennessy-vsop-cognac", name: "Hennessy VSOP Cognac", category: "spirits", subCategory: "Brandy › Cognac", spiritFamily: "Brandy", spiritStyle: "Cognac", inStock: true, incoming: false, quantity: 1, unit: "bottle", abv: 40, notes: "Rich VSOP cognac with orchard fruit, vanilla, and toasted oak." },
  { id: "premier-french-brandy-napoleon-special-reserve", name: "Premier French Brandy Napoléon Special Reserve", category: "spirits", subCategory: "Brandy › French Brandy", spiritFamily: "Brandy", spiritStyle: "French Brandy", inStock: true, abv: 40, notes: "Classic French brandy with warm spice, dried fruit, and vanilla." },
  { id: "otard-xo-gold-cognac", name: "Otard XO Gold Cognac", category: "spirits", subCategory: "Brandy › Cognac", spiritFamily: "Brandy", spiritStyle: "Cognac", inStock: true, abv: 40, notes: "Luxurious XO cognac with orange peel, caramel, and oak depth." },
  { id: "bacardi-superior", name: "Bacardi Carta Blanca Superior White Rum", category: "spirits", subCategory: "Rum › White", spiritFamily: "Rum", spiritStyle: "White", inStock: true, quantity: 2, unit: "bottle", abv: 37.5, notes: "Clean, floral light rum (700ml). Essential for Mojito and Daiquiri." },
  { id: "myers-dark-rum", name: "Myers's Original Dark Rum", category: "spirits", subCategory: "Rum › Dark Jamaican", spiritFamily: "Rum", spiritStyle: "Dark Jamaican", inStock: true, abv: 40, notes: "Rich Jamaican 100% pot-still dark rum with molasses and baking spices." },
  { id: "mount-gay-black-barrel", name: "Mount Gay Barbados Rum Black Barrel Double Cask Blend", category: "spirits", subCategory: "Rum › Aged Barbados", spiritFamily: "Rum", spiritStyle: "Aged Barbados", inStock: true, quantity: 1, unit: "bottle", abv: 43, notes: "Aged Barbados rum finished in charred bourbon casks; a polished alternative for dark rum cocktails." },
  { id: "goslings-black-seal-151", name: "Goslings Black Seal 151 Overproof Rum (75.5% ABV)", category: "spirits", subCategory: "Rum › Overproof 151", spiritFamily: "Rum", spiritStyle: "Overproof 151", inStock: true, quantity: 1, unit: "bottle", proof: "75.5% ABV", abv: 75.5, notes: "High-proof Bermuda dark rum for Zombie floats and other overproof-rum recipes." },
  { id: "tanqueray-gin", name: "Tanqueray London Dry Gin", category: "spirits", subCategory: "Gin › London Dry", spiritFamily: "Gin", spiritStyle: "London Dry", inStock: true, abv: 47.3, notes: "Crisp, juniper-led London Dry gin for Negroni, Dry Martini, and French 75." },
  { id: "teremana-tequila", name: "Teremana Tequila", category: "spirits", subCategory: "Agave › Tequila", spiritFamily: "Agave", spiritStyle: "Tequila", inStock: true, abv: 40, notes: "Small batch 100% blue agave tequila with roasted agave and citrus zest." },
  { id: "topanito-mezcal-artesanal-espadin", name: "Topanito Mezcal Artesanal Espadín 52% ABV", category: "spirits", subCategory: "Agave › Mezcal", spiritFamily: "Agave", spiritStyle: "Mezcal", inStock: true, incoming: false, quantity: 1, unit: "bottle", proof: "52% ABV", abv: 52, notes: "Artisanal mezcal with smoky agave, mineral lift, and citrus." },
  { id: "smirnoff-red", name: "Smirnoff Red Vodka (37.5% ABV)", category: "spirits", subCategory: "Vodka › Neutral", spiritFamily: "Vodka", spiritStyle: "Neutral", inStock: true, abv: 37.5, notes: "Ultra-clean triple-distilled neutral vodka for Moscow Mule and Kamikaze." },
  { id: "absolut-blue", name: "Absolut Vodka Original Blue (40% ABV)", category: "spirits", subCategory: "Vodka › Neutral", spiritFamily: "Vodka", spiritStyle: "Neutral", inStock: true, abv: 40, notes: "Rich Swedish winter wheat vodka for Espresso Martini and Cosmopolitan." },

  // --- BASE SPIRITS (Shopping List / Expansion) ---
  { id: "irish-whiskey", name: "Irish Whiskey (Jameson)", category: "spirits", subCategory: "Whiskey › Irish", spiritFamily: "Whiskey", spiritStyle: "Irish", inStock: false, abv: 40, notes: "Triple distilled smooth whiskey for Irish Coffee & Green Tea Shot." },
  { id: "pisco", name: "Pisco (Peruvian / Chilean)", category: "spirits", subCategory: "Brandy › Pisco", spiritFamily: "Brandy", spiritStyle: "Pisco", inStock: false, abv: 40, notes: "Aromatic unaged grape brandy for Pisco Sour and Pisco Punch." },
  { id: "cachaca", name: "Cachaça", category: "spirits", subCategory: "Rum › Cachaça", spiritFamily: "Rum", spiritStyle: "Cachaça", inStock: false, abv: 40, notes: "Brazilian fresh pressed sugarcane spirit for Caipirinha." },

  // --- LIQUEURS (User In Stock) ---
  { id: "disaronno-amaretto", name: "Disaronno Originale Amaretto Liqueur", category: "liqueurs", subCategory: "Nut & Spice", inStock: true, abv: 28, notes: "Italian almond-apricot stone liqueur. Shines in Amaretto Sour and Godfather." },
  { id: "kahlua", name: "Kahlúa Coffee Liqueur", category: "liqueurs", subCategory: "Coffee", inStock: true, abv: 20, notes: "Mexican Arabica coffee and sugarcane rum liqueur for White Russian and B-52." },
  { id: "walcher-coffee", name: "Walcher Premium Coffee Liqueur", category: "liqueurs", subCategory: "Coffee", inStock: true, abv: 20, notes: "Artisanal South Tyrol organic coffee liqueur with deep espresso roast." },
  { id: "cointreau", name: "Cointreau", category: "liqueurs", subCategory: "Citrus & Orange", inStock: true, abv: 40, notes: "Premier French 40% ABV crystal triple sec. Essential for Margarita and Sidecar." },
  { id: "grand-marnier", name: "Grand Marnier", category: "liqueurs", subCategory: "Citrus & Orange", inStock: true, abv: 40, notes: "Cognac-based bitter orange liqueur. Adds luxury to B-52 and Cadillac Margarita." },
  { id: "lumina-triple-sec", name: "Lumina Triple Sec Liqueur", category: "liqueurs", subCategory: "Citrus & Orange", inStock: true, abv: 24, notes: "Sweet citrus liqueur ideal for Kamikaze and highball mixing." },
  { id: "curacao-bleu", name: "Curaçao Bleu Liqueur (élaboré en France)", category: "liqueurs", subCategory: "Citrus & Orange", inStock: true, abv: 25, notes: "Electric blue orange liqueur for Blue Lagoon and Blue Kamikaze." },
  { id: "hoffmann-peach", name: "Hoffmann Peach Liqueur", category: "liqueurs", subCategory: "Fruit & Floral", inStock: true, abv: 20, notes: "Juicy ripe peach schnapps for Sex on the Beach and Woo Woo." },
  { id: "cherry-heering", name: "Peter Heering Cherry Liqueur", category: "liqueurs", subCategory: "Fruit & Floral", inStock: true, abv: 15, notes: "Danish ruby cherry liqueur since 1818. Backbone of Singapore Sling and Blood and Sand." },
  { id: "st-germain", name: "St-Germain Elderflower Liqueur", category: "liqueurs", subCategory: "Fruit & Floral", inStock: true, abv: 15, notes: "Handpicked wild elderflowers with lychee, pear, and grapefruit notes. Key for Hugo Spritz." },
  { id: "malibu-rum", name: "Malibu Coconut Rum Liqueur", category: "liqueurs", subCategory: "Fruit & Floral", inStock: true, abv: 21, notes: "Caribbean coconut rum for tropical riffs and Surfer on Acid." },
  { id: "sambuca", name: "Vaccari Sambuca", category: "liqueurs", subCategory: "Anise & Herbal", inStock: true, quantity: 1, unit: "bottle", abv: 38, notes: "Authentic Italian anise liqueur (700ml) distilled with Mediterranean star anise. Essential for Flatliner, Slippery Nipple, and Sambuca shooters." },

  // --- LIQUEURS (Shopping List / Expansion) ---
  { id: "baileys-irish-cream", name: "Baileys Irish Cream Liqueur", category: "liqueurs", subCategory: "Cream Liqueurs", inStock: true, abv: 17, notes: "Irish cream for B-52, Blowjob shot, Slippery Nipple, and Nutty Irishman." },
  { id: "maraschino-liqueur", name: "Luxardo Maraschino Liqueur", category: "liqueurs", subCategory: "Fruit & Floral", inStock: false, abv: 32, notes: "Dry cherry pit and herbal liqueur for Aviation, Last Word, and Hemingway Daiquiri." },
  { id: "creme-de-violette", name: "Crème de Violette", category: "liqueurs", subCategory: "Fruit & Floral", inStock: false, abv: 15, notes: "Violet flower liqueur that gives Aviation its sky-blue tint." },
  { id: "creme-de-cassis", name: "Crème de Cassis (Blackcurrant)", category: "liqueurs", subCategory: "Fruit & Floral", inStock: false, abv: 15, notes: "Blackcurrant liqueur for Kir Royale." },
  { id: "creme-de-mure", name: "Crème de Mûre (Blackberry)", category: "liqueurs", subCategory: "Fruit & Floral", inStock: false, abv: 15, notes: "Blackberry liqueur drizzled on the Bramble." },
  { id: "drambuie", name: "Drambuie (Honeyed Scotch Liqueur)", category: "liqueurs", subCategory: "Herbal & Spice", inStock: false, abv: 40, notes: "Scotch, heather honey, and herbs for Rusty Nail." },
  { id: "green-chartreuse", name: "Green Chartreuse", category: "liqueurs", subCategory: "Herbal & Botanical", inStock: false, abv: 55, notes: "130-herb French monk elixir for Last Word." },
  { id: "yellow-chartreuse", name: "Yellow Chartreuse", category: "liqueurs", subCategory: "Herbal & Botanical", inStock: false, abv: 40, notes: "Honey-saffron herbal liqueur for Naked and Famous and Sunflower." },
  { id: "jagermeister", name: "Jägermeister Liqueur (35% ABV)", category: "liqueurs", subCategory: "Herbal & Botanical", inStock: true, quantity: 2, unit: "bottle", abv: 35, notes: "German herbal liqueur with 56 botanicals for Jägerbombs and cocktails alike." },
  { id: "midori", name: "Midori Melon Liqueur", category: "liqueurs", subCategory: "Fruit & Floral", inStock: true, quantity: 1, unit: "bottle", abv: 20, notes: "Vivid neon-green Japanese muskmelon and yubari melon liqueur. Sweet and fragrant."},
  { id: "fireball", name: "Fireball Cinnamon Whisky", category: "liqueurs", subCategory: "Nut & Spice", inStock: false, abv: 33, notes: "Cinnamon whisky for Fireball Apple Pie Shot." },
  { id: "absinthe", name: "Absinthe", category: "liqueurs", subCategory: "Anise & Herbal", inStock: false, abv: 68, notes: "Aromatic anise rinse for Sazerac and Corpse Reviver No. 2." },
  { id: "tequila-rose", name: "Tequila Rose Strawberry Cream Liqueur", category: "liqueurs", subCategory: "Cream Liqueurs", inStock: false, abv: 15, notes: "Strawberry cream and Mexican tequila liqueur for Tequila Rose Shot." },
  { id: "frangelico", name: "Frangelico Hazelnut Liqueur", category: "liqueurs", subCategory: "Nut & Spice", inStock: true, quantity: 1, unit: "bottle", abv: 20, notes: "Hazelnut liqueur for Nutty Irishman and Duck Fart." },

  // --- FORTIFIED WINES & APERITIFS (User In Stock) ---
  { id: "lillet-blanc", name: "Lillet Blanc", category: "fortified", subCategory: "Fortified Wine", inStock: true, abv: 17, notes: "French wine aperitif with candied orange and honey for Vesper and Corpse Reviver No. 2." },
  { id: "martini-extra-dry", name: "Martini Extra Dry Vermouth", category: "fortified", subCategory: "Vermouth", inStock: true, abv: 18, notes: "Crisp dry Italian vermouth scented with Florentine Orris for Dry Martini." },
  { id: "martini-rosso", name: "Martini Rosso Red Vermouth", category: "fortified", subCategory: "Vermouth", inStock: true, abv: 16, notes: "Sweet Italian red vermouth for Negroni, Manhattan, Boulevardier, and Americano." },
  { id: "aperol", name: "Aperol", category: "fortified", subCategory: "Aperitifs / Bitters", inStock: true, abv: 11, notes: "Bittersweet orange, rhubarb, and gentian aperitivo for Aperol Spritz and Paper Plane." },
  { id: "campari", name: "Campari", category: "fortified", subCategory: "Aperitifs / Bitters", inStock: true, abv: 25, notes: "Iconic red bitter aperitif with chinotto citrus and herbs for Negroni and Boulevardier." },
  { id: "amaro-nonino", name: "Amaro Nonino Quintessentia", category: "fortified", subCategory: "Amaro", inStock: false, abv: 16, notes: "Grappa-based alpine amaro for Paper Plane." },

  // --- SPARKLING WINE (User In Stock) ---
  { id: "gio-prosecco", name: "Gio Prosecco Spumante Extra Dry", category: "sparkling", subCategory: "Sparkling Wine", inStock: true, abv: 11.5, notes: "Crisp Italian Prosecco with fine bubbles for Aperol Spritz, French 75, Bellini, and Mimosa." },
  { id: "bottega-spumante-venezia", name: "Bottega Spumante Venezia", category: "sparkling", subCategory: "Sparkling Wine", inStock: true, abv: 11, notes: "Elegant, smooth Italian sparkling blend of Glera & Chardonnay; crisp notes of apple, peach, and almond—ideal premium base for an Aperol Spritz or Mimosa." },
  { id: "zonin-prosecco-brut", name: "Zonin Prosecco Brut", category: "sparkling", subCategory: "Sparkling Wine", inStock: true, abv: 11, notes: "Crisp, dry authentic Italian Prosecco DOC with lively bubbles and bright notes of green apple and citrus—the ultimate classic base for any Spritz, Bellini, or Mimosa." },

  // --- BITTERS & SYRUPS (User In Stock & Shopping List) ---
  { id: "angostura-bitters", name: "Angostura Bitters", category: "bitters_syrups", subCategory: "Bitters", inStock: true, notes: "Trinidad's world-famous aromatic cocktail bitters for Old Fashioned and Manhattan." },
  { id: "peychaud-bitters", name: "Peychaud's Bitters", category: "bitters_syrups", subCategory: "Bitters", inStock: false, notes: "Gentle anise and floral bitters for Sazerac and Vieux Carré." },
  { id: "pomegranate-grenadine", name: "Pomegranate Grenadine", category: "bitters_syrups", subCategory: "Syrups", inStock: true, notes: "Tart-sweet real pomegranate syrup for Tequila Sunrise, Singapore Sling, and Shirley Temple." },
  { id: "raspberry-rhapsody", name: "Raspberry Rhapsody Flavored Syrup", category: "bitters_syrups", subCategory: "Syrups", inStock: true, notes: "Sweet raspberry syrup for Clover Club, Floradora, and Lemon-Berry Fizz." },
  { id: "simple-syrup", name: "Premium Syrup (Simple Syrup, 1:1)", category: "bitters_syrups", subCategory: "Syrups", inStock: true, notes: "Your premium/simple syrup. Equal parts sugar and water; foundation for sour and fizz drinks." },
  { id: "agave-syrup", name: "Agave Syrup / Agave Nectar", category: "bitters_syrups", subCategory: "Syrups", inStock: false, notes: "Pure blue agave sweetener for Tommy's Margarita and Paloma." },
  { id: "orgeat-syrup", name: "Orgeat Syrup (Almond)", category: "bitters_syrups", subCategory: "Syrups", inStock: true, quantity: 1, unit: "bottle", notes: "French sweet almond and orange flower syrup for Mai Tai." },
  { id: "honey-syrup", name: "Honey Syrup (3:1)", category: "bitters_syrups", subCategory: "Syrups", inStock: true, quantity: 1, unit: "bottle", notes: "Liquid clover honey for Penicillin and Bee's Knees." },
  { id: "ginger-syrup", name: "Spicy Ginger Syrup", category: "bitters_syrups", subCategory: "Syrups", inStock: false, notes: "Fresh ginger syrup for Penicillin." },
  { id: "granulated-sugar", name: "Granulated Sugar / Sugar Cubes", category: "bitters_syrups", subCategory: "Sweeteners", inStock: false, notes: "For muddling in Old Fashioned and rimming glasses." },
  { id: "fever-tree-indian-tonic", name: "Fever-Tree Premium Indian Tonic Water", category: "mixers_sodas", subCategory: "Sodas & Carbonated", inStock: true, quantity: 6, unit: "pack", notes: "Premium tonic water with botanical oils and high-quality quinine. Perfect upgrade for a crisp G&T." },
  { id: "fever-tree-ginger-beer", name: "Fever-Tree Premium Ginger Beer", category: "mixers_sodas", subCategory: "Sodas & Carbonated", inStock: true, quantity: 6, unit: "pack", notes: "Brewed with a blend of three natural gingers. Deep, spicy flavor profile that beautifully mimics alcohol proof." },
  { id: "bundaberg-ginger-beer", name: "Bundaberg Ginger Beer", category: "mixers_sodas", subCategory: "Sodas & Carbonated", inStock: true, notes: "Classic craft-brewed Australian ginger beer, rich and sweet." },

  // --- SODAS & MIXERS (User In Stock & Shopping List) ---
  { id: "schweppes-ginger-soda", name: "Schweppes Ginger Soda", category: "mixers_sodas", subCategory: "Sodas & Carbonated", inStock: true, notes: "Crisp, lively ginger soda. Essential for Highballs, Dark 'n' Stormy riffs, and Gunner." },
  { id: "schweppes-ginger-ale", name: "Schweppes Ginger Ale Soda (Fulfilled by Ginger Soda)", category: "mixers_sodas", subCategory: "Sodas & Carbonated", inStock: true, aliasOf: "schweppes-ginger-soda", notes: "User has Schweppes Ginger Soda in stock." },
  { id: "chang-soda-water", name: "Chang Soda Water (24 × 325 ml)", category: "mixers_sodas", subCategory: "Sodas & Carbonated", inStock: true, quantity: 24, unit: "bottle", notes: "24 bottles of extra-fizzy, high-carbonation club soda for Mojitos, Collins, and Spritzes." },
  { id: "ginger-beer", name: "Ginger Beer (Fever-Tree / Bundaberg)", category: "mixers_sodas", subCategory: "Sodas & Carbonated", inStock: true, aliasOf: "fever-tree-ginger-beer", notes: "In stock (Fulfilled by Fever-Tree Premium Ginger Beer and Bundaberg Ginger Beer)." },
  { id: "tonic-water", name: "Tonic Water (Fever-Tree)", category: "mixers_sodas", subCategory: "Sodas & Carbonated", inStock: true, aliasOf: "fever-tree-indian-tonic", notes: "In stock (Fulfilled by Fever-Tree Premium Indian Tonic Water)." },
  { id: "cola", name: "Cola", category: "mixers_sodas", subCategory: "Sodas & Carbonated", inStock: true, quantity: 6, unit: "can", notes: "For Cuba Libre, Long Island, and Roy Rogers." },
  { id: "lemon-lime-soda", name: "Lemon-Lime Soda (Sprite)", category: "mixers_sodas", subCategory: "Sodas & Carbonated", inStock: false, notes: "Bubbly citrus soda for Blue Lagoon, Tequila Slammer, and Green Tea Shot." },
  { id: "energy-drink", name: "Energy Drink (Red Bull)", category: "mixers_sodas", subCategory: "Sodas & Carbonated", inStock: true, notes: "For the Jägerbomb drop." },
  { id: "cranberry-juice", name: "Cranberry Juice", category: "mixers_sodas", subCategory: "Juices", inStock: true, notes: "In stock. Tart crimson juice for Cosmopolitan, Sex on the Beach, Sea Breeze, and Woo Woo." },
  { id: "orange-juice", name: "Orange Juice (Fresh Navel Oranges)", category: "mixers_sodas", subCategory: "Juices", inStock: true, notes: "Squeezed fresh from your in-stock Navel Oranges for Tequila Sunrise, Mimosa, and Ward 8." },
  { id: "pineapple-juice", name: "Fresh Pineapple / Pineapple Juice", category: "mixers_sodas", subCategory: "Juices", inStock: true, quantity: 1, unit: "fruit", notes: "Fresh pineapple for juice and garnish; supports Singapore Sling, Piña Colada, and Pineapple Cooler." },
  { id: "grapefruit-juice", name: "Fresh Grapefruit / Pink Grapefruit Juice", category: "mixers_sodas", subCategory: "Juices", inStock: true, quantity: 1, unit: "fruit", notes: "Fresh grapefruit for juice and garnish; supports Paloma, Hemingway Daiquiri, and Sea Breeze." },
  { id: "apple-juice", name: "Apple Juice / Cider", category: "mixers_sodas", subCategory: "Juices", inStock: false, notes: "Crisp apple juice for Spiced Apple Cider, Washington Apple, and Apple Martini." },
  { id: "mango-juice", name: "Mango Puree / Juice", category: "mixers_sodas", subCategory: "Juices", inStock: false, notes: "Lush tropical puree for Mango Mule." },
  { id: "tomato-juice", name: "Tomato Juice (Seasoned)", category: "mixers_sodas", subCategory: "Juices", inStock: false, notes: "Savory juice for Bloody Mary, Virgin Mary, and Red Snapper." },
  { id: "coconut-cream", name: "Coconut Cream (Cream of Coconut)", category: "mixers_sodas", subCategory: "Juices & Creams", inStock: false, notes: "Sweet rich coconut cream for Piña Colada and Coconut Lime Mocktail." },
  { id: "coconut-water", name: "Pure Coconut Water", category: "mixers_sodas", subCategory: "Juices", inStock: false, notes: "Hydrating tropical water for Coconut Lime Mocktail." },
  { id: "whipping-heavy-cream", name: "Heavy Whipping Cream", category: "mixers_sodas", subCategory: "Dairy & Cream", inStock: true, notes: "Thick liquid cream for floating atop White Russian and Irish Coffee." },
  { id: "whipped-cream", name: "Whipped Cream", category: "mixers_sodas", subCategory: "Dairy & Cream", inStock: true, notes: "Fluffy crown for the Blowjob shot and dessert-style drinks." },

  // --- FRESH PRODUCE & GARNISHES (User In Stock & Shopping List) ---
  { id: "fresh-lemons", name: "Fresh Lemons (Juice & Twists)", category: "fresh_garnishes", subCategory: "Fresh Citrus & Herbs", inStock: true, notes: "Essential souring agent for Whiskey Sour, French 75, Corpse Reviver, and White Lady." },
  { id: "fresh-limes", name: "Fresh Limes (Juice & Wheels)", category: "fresh_garnishes", subCategory: "Fresh Citrus & Herbs", inStock: true, quantity: 1, unit: "fruit", notes: "Fresh limes for juice and wheels; core citrus for Margarita, Daiquiri, Moscow Mule, Mojito, Southside, and Gimlet." },
  { id: "fresh-oranges", name: "Fresh Navel Oranges (Juice, Slices & Peels)", category: "fresh_garnishes", subCategory: "Fresh Citrus & Herbs", inStock: true, quantity: 1, unit: "fruit", notes: "Fresh navel oranges for juice, slices, and fragrant peel oils in Old Fashioned, Negroni, Boulevardier, and Ward 8." },
  { id: "fresh-mint", name: "Fresh Spearmint", category: "fresh_garnishes", subCategory: "Fresh Citrus & Herbs", inStock: true, notes: "Aromatic sprigs for Mojito, Mint Julep, and Hugo Spritz." },
  { id: "fresh-cucumber", name: "Fresh Cucumber", category: "fresh_garnishes", subCategory: "Fresh Citrus & Herbs", inStock: false, notes: "Crisp cucumber slices for Cucumber Mint Cooler and Gimlet." },
  { id: "fresh-rosemary", name: "Fresh Rosemary Sprigs", category: "fresh_garnishes", subCategory: "Fresh Citrus & Herbs", inStock: false, notes: "Woody aromatic herb for Rosemary Grapefruit Spritzer." },
  { id: "fresh-strawberries", name: "Fresh / Frozen Strawberries", category: "fresh_garnishes", subCategory: "Fresh Citrus & Herbs", inStock: false, notes: "For Virgin Strawberry Daiquiri." },
  { id: "maraschino-cherries", name: "Maraschino Cherries", category: "fresh_garnishes", subCategory: "Garnishes", inStock: false, notes: "Classic garnish for Manhattan, Shirley Temple, and Singapore Sling." },
  { id: "fresh-espresso", name: "Fresh Espresso Shots (made to order)", category: "fresh_garnishes", subCategory: "Coffee & Fresh", inStock: true, quantity: 1, unit: "on demand", notes: "Readily available fresh espresso for dense crema on Espresso Martinis and coffee drinks." },
  { id: "coffee-beans", name: "Whole Roasted Coffee Beans", category: "fresh_garnishes", subCategory: "Garnishes", inStock: true, quantity: 1, unit: "pack", notes: "Three floated beans for Espresso Martini and coffee cocktail garnishes." },
  { id: "egg-white", name: "Egg White (Fresh or Aquafaba)", category: "fresh_garnishes", subCategory: "Cocktail Texture", inStock: true, notes: "Creates silky texture and dense meringue foam on Sours." },
  { id: "tabasco-sauce", name: "Tabasco Hot Sauce", category: "fresh_garnishes", subCategory: "Spices & Savory", inStock: true, notes: "Piquant heat for Bloody Mary, Virgin Mary, and Flatliner." },
  { id: "worcestershire-sauce", name: "Worcestershire Sauce", category: "fresh_garnishes", subCategory: "Spices & Savory", inStock: false, notes: "Savory umami for Bloody Mary and Virgin Mary." },
  { id: "coarse-salt", name: "Coarse Kosher Salt", category: "fresh_garnishes", subCategory: "Garnishes", inStock: true, notes: "For glass rims on Margarita, Paloma, and Salty Dog." },
  { id: "ice", name: "Ice Cubes (and crushed ice as needed)", category: "fresh_garnishes", subCategory: "Bar Essentials", inStock: true, notes: "Available ice cubes for chilling and dilution; crush as needed for tiki and julep-style drinks." }
];

const DEFAULT_DRINKS = [
  // =========================================================================
  // COCKTAILS (1 - 60 + Blue Lagoon, Pineapple Cooler, SunFlower)
  // =========================================================================
  {
    id: "singapore-sling",
    name: "Singapore Sling",
    otherNames: "Straits Sling, Raffles Hotel Classic",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Highball / Hurricane",
    alcoholLevel: "Medium (~16% ABV)",
    alcoholScore: 3,
    tasteProfile: "Fruity, Herbal, Complex & Refreshing",
    difficulty: 3,
    popularity: 9.6,
    proTip: "Shaking aggressively aerates the pineapple juice, producing a luxuriant pink froth head without needing egg whites.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Peter Heering Cherry Liqueur", substitute: "Cherry brandy or Maraschino + Grenadine", inventoryId: "cherry-heering" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Cointreau", substitute: "Lumina Triple Sec or Grand Marnier", inventoryId: "cointreau" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "D.O.M. Bénédictine (or St-Germain)", substitute: "St-Germain Elderflower or herbal amaro", inventoryId: "st-germain" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Pineapple Juice", substitute: "Fresh pineapple juice", inventoryId: "pineapple-juice" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-limes" },
      { amountOz: "0.33 oz", amountMl: "10 ml", item: "Pomegranate Grenadine", substitute: "Raspberry Rhapsody syrup", inventoryId: "pomegranate-grenadine" },
      { amountOz: "1 dash", amountMl: "1 dash", item: "Angostura Bitters", substitute: "Aromatic bitters", inventoryId: "angostura-bitters" }
    ],
    instructions: [
      "Chill a highball or hurricane glass with ice.",
      "Add gin, cherry Heering, Cointreau, herbal modifier, pineapple juice, lime juice, grenadine, and bitters into a shaker filled with ice.",
      "Shake vigorously for 15 seconds to create a dense, velvety foam head.",
      "Strain into the prepared glass over fresh ice.",
      "Garnish with a fresh pineapple wedge and a maraschino cherry on a cocktail skewer."
    ],
    tags: ["gin", "classic", "tropical", "raffles", "fruity", "refreshing"]
  },
  {
    id: "old-fashioned",
    name: "Old Fashioned",
    otherNames: "Whiskey Cocktail, Rum Old Fashioned, Oaxaca Old Fashioned",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Rocks / Old Fashioned",
    alcoholLevel: "High (~32% ABV)",
    alcoholScore: 5,
    tasteProfile: "Spirit-Forward, Rich, Caramel & Aromatic",
    difficulty: 2,
    popularity: 9.9,
    proTip: "Never muddle cherries or orange pulp into the drink. Only express the essential oils from the orange peel over the top to avoid muddying the spirit.\n\nClassic 1-Ingredient Spirit Variants:\n• Rum Old Fashioned: Swap whiskey for 2 oz Mount Gay Black Barrel (or Myers's Dark Rum) for rich molasses, baking spices, and toasted bourbon-cask oak.\n• Oaxaca Old Fashioned: Split the base with 1.5 oz Reposado Tequila and 0.5 oz Topanito Mezcal with agave syrup.\n• Brandy Old Fashioned: Swap whiskey for Hennessy VSOP Cognac or French Brandy.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Jack Daniel's Bonded Rye (or Jim Beam Black)", substitute: "Mount Gay Black Barrel (Rum Old Fashioned) or Jim Beam Black", inventoryId: "jd-bonded-rye" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Simple Syrup (or 1 sugar cube)", substitute: "Rich demerara syrup or brown sugar", inventoryId: "simple-syrup" },
      { amountOz: "3 dashes", amountMl: "3 dashes", item: "Angostura Bitters", substitute: "Orange bitters + aromatic bitters", inventoryId: "angostura-bitters" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Orange Peel & Maraschino Cherry", substitute: "Expressed orange twist", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "In a rocks glass or mixing glass, combine simple syrup and 3 healthy dashes of Angostura bitters.",
      "Add half the whiskey (or rum) and 1 large ice cube; stir 15 seconds to initiate chill and dilution.",
      "Add the remaining spirit and fill with fresh ice. Stir smoothly for another 20 seconds.",
      "Express an orange peel over the glass, rub the rim with the peel, and drop it into the glass with a brandied cherry."
    ],
    tags: ["whiskey", "bourbon", "rye", "rum", "classic", "spirit-forward", "speakeasy", "in-stock"]
  },
  {
    id: "margarita",
    name: "Classic Margarita",
    otherNames: "Cadillac Margarita (when Grand Marnier used)",
    category: "Cocktail",
    baseSpirit: "Tequila/Mezcal",
    glassware: "Coupe or Rocks",
    alcoholLevel: "Medium-High (~24% ABV)",
    alcoholScore: 4,
    tasteProfile: "Crisp, Citrusy, Tart & Saline",
    difficulty: 2,
    popularity: 9.9,
    proTip: "Salt only half the rim! That allows the drinker to choose between salted and unsalted sips and prevents salt from dissolving prematurely into the drink.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Teremana Tequila", substitute: "Any 100% blue agave blanco or reposado", inventoryId: "teremana-tequila" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Cointreau", substitute: "Grand Marnier (Cadillac style) or Lumina Triple Sec", inventoryId: "cointreau" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lime Juice", substitute: "Fresh pressed lime only", inventoryId: "fresh-limes" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Agave Syrup (Optional, to balance)", substitute: "Simple syrup", inventoryId: "agave-syrup" },
      { amountOz: "Rim", amountMl: "Rim", item: "Coarse Kosher Salt & Lime Wheel", substitute: "Tajin seasoning", inventoryId: "coarse-salt" }
    ],
    instructions: [
      "Run a lime wedge around half the rim of a coupe or rocks glass, then dip lightly in coarse salt.",
      "Add tequila, Cointreau, fresh lime juice, and agave syrup into a cocktail shaker with plenty of ice.",
      "Shake hard for 12 seconds until the shaker exterior is frosted.",
      "Double strain into the prepared coupe (or over fresh ice in a rocks glass).",
      "Garnish with a fresh lime wheel on the rim."
    ],
    tags: ["tequila", "cointreau", "citrus", "sour", "party", "classic"]
  },
  {
    id: "negroni",
    name: "Negroni",
    otherNames: "Count Negroni's Americano Con Gin",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Rocks / Old Fashioned",
    alcoholLevel: "High (~26% ABV)",
    alcoholScore: 4,
    tasteProfile: "Bittersweet, Botanical, Rich & Bold",
    difficulty: 1,
    popularity: 9.8,
    proTip: "The golden equal-parts rule: 1:1:1. Use one dense crystal-clear ice block so dilution is slow, allowing the herbal layers to evolve as you sip.",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry gin", inventoryId: "tanqueray-gin" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Campari", substitute: "Aperol (for a milder, sweeter Contessa)", inventoryId: "campari" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Martini Rosso Red Vermouth", substitute: "Sweet red vermouth", inventoryId: "martini-rosso" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Orange Peel", substitute: "Orange slice", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Combine Tanqueray gin, Campari, and Martini Rosso in a mixing glass filled with ice.",
      "Stir gracefully for 25–30 seconds until well-chilled and integrated.",
      "Strain into a rocks glass over a single large clear ice cube.",
      "Express an orange peel over the glass to release citrus oils and twist gently into the glass."
    ],
    tags: ["gin", "campari", "vermouth", "bitter", "classic", "aperitivo"]
  },
  {
    id: "dry-martini",
    name: "Classic Dry Martini",
    otherNames: "The Silver Bullet",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Martini / Nick & Nora",
    alcoholLevel: "High (~34% ABV)",
    alcoholScore: 5,
    tasteProfile: "Bone-Dry, Botanical, Crisp & Clean",
    difficulty: 2,
    popularity: 9.7,
    proTip: "Pre-chill both the glass and your mixing vessel in the freezer. A lukewarm Martini is an unforgivable cocktail sin; it must be ice cold.",
    ingredients: [
      { amountOz: "2.5 oz", amountMl: "75 ml", item: "Tanqueray London Dry Gin", substitute: "Smirnoff Red / Absolut Blue (for Vodka Martini)", inventoryId: "tanqueray-gin" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Martini Extra Dry Vermouth", substitute: "Lillet Blanc (for delicate floral dryness)", inventoryId: "martini-extra-dry" },
      { amountOz: "1 dash", amountMl: "1 dash", item: "Orange Bitters (Optional)", substitute: "Angostura orange bitters", inventoryId: "angostura-bitters" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Lemon Peel Twist or Spanish Green Olive", substitute: "Cocktail onion (Gibson)", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Store a martini or Nick & Nora glass in the freezer for at least 15 minutes before serving.",
      "Fill a mixing glass with clean, dense ice cubes.",
      "Pour in Tanqueray gin and Martini Extra Dry vermouth.",
      "Stir gently and continuously for 30–40 seconds until frosty cold.",
      "Fine strain into the chilled glass.",
      "Express a lemon peel twist over the surface and drop it in, or skewer a green olive."
    ],
    tags: ["gin", "dry", "martini", "classic", "elegant"]
  },
  {
    id: "espresso-martini",
    name: "Espresso Martini",
    otherNames: "Vodka Espresso, Hazelnut Espresso Martini (Frangelico)",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Coupe / Martini",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Roasty, Rich, Coffee Crema & Velvety",
    difficulty: 2,
    popularity: 9.9,
    proTip: "Freshly pulled hot espresso produces the thickest crema! The temperature contrast against ice shocks the oils into creating a luxuriant, velvety froth. Float 3 coffee beans for health, wealth, and happiness.\n\nClassic 1-Ingredient Variants:\n• Hazelnut Espresso Martini: Add or swap 0.75 oz of Frangelico Hazelnut Liqueur for a toasted nutty, Nutella-like finish.\n• Mezcal Espresso Martini: Swap vodka for Topanito Mezcal for an astonishing pairing of smoke, roasted agave, and espresso.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Absolut Vodka Original Blue", substitute: "Smirnoff Red Vodka", inventoryId: "absolut-blue" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Kahlúa Coffee Liqueur", substitute: "Frangelico Hazelnut Liqueur (Hazelnut Martini) or Walcher Coffee", inventoryId: "kahlua" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Espresso (Hot or Room Temp)", substitute: "Strong cold brew concentrate", inventoryId: "fresh-espresso" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Simple Syrup", substitute: "Agave or Demerara syrup", inventoryId: "simple-syrup" },
      { amountOz: "3 beans", amountMl: "3 beans", item: "Whole Coffee Beans (Garnish)", substitute: "Cocoa powder dusting", inventoryId: "coffee-beans" }
    ],
    instructions: [
      "Pull a fresh shot of rich espresso.",
      "Add vodka, Kahlúa (or Frangelico), simple syrup, and espresso into a cocktail shaker.",
      "Fill shaker with dense ice and shake aggressively for 15 seconds.",
      "Double strain through a fine mesh strainer into a chilled coupe or martini glass.",
      "Carefully float 3 coffee beans on the center of the dense crema foam (health, wealth, happiness)."
    ],
    tags: ["vodka", "kahlua", "frangelico", "coffee", "espresso", "modern-classic", "after-dinner", "in-stock"]
  },
  {
    id: "mojito",
    name: "Classic Mojito",
    otherNames: "Cuban Highball",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Highball / Collins",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Crisp, Minty, Sweet & Refreshing",
    difficulty: 2,
    popularity: 9.8,
    proTip: "Press mint leaves gently—do not shred or pulverize them! Shredding releases bitter chlorophyll; a light muddle releases pure essential oils.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "White Rum", substitute: "Any crisp light rum", inventoryId: "bacardi-superior", ingredientGroup: "white-rum" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Half a fresh lime cut into wedges", inventoryId: "fresh-limes", ingredientGroup: "fresh-lime" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Simple Syrup (or 2 tsp sugar)", substitute: "Granulated sugar or agave", inventoryId: "simple-syrup", ingredientGroup: "simple-syrup" },
      { amountOz: "8-10 leaves", amountMl: "8-10 leaves", item: "Fresh Spearmint Leaves", substitute: "Fresh mint sprigs", inventoryId: "fresh-mint", ingredientGroup: "fresh-mint" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water", ingredientGroup: "soda-water" }
    ],
    instructions: [
      "In a tall highball glass, gently press mint leaves with simple syrup and lime juice using a muddler.",
      "Add white rum and fill the glass halfway with crushed ice.",
      "Stir with a bar spoon to bring the mint and spirit together.",
      "Pack the glass to the top with more crushed ice and top with Chang Soda Water.",
      "Slap a mint sprig against your palm to awaken aromatics, and nestle it beside a lime wheel."
    ],
    tags: ["rum", "mint", "summer", "refreshing", "cuba", "classic"]
  },
  {
    id: "whiskey-sour",
    name: "Whiskey Sour",
    otherNames: "Boston Sour (with egg white), Rum Sour, New York Sour",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Coupe or Rocks",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Tart, Velvety, Citrus & Oak",
    difficulty: 2,
    popularity: 9.7,
    proTip: "Perform a 'dry shake' (shake all liquid ingredients without ice first) to emulsify the egg white, followed by a 'wet shake' with ice. Drop 2-3 drops of Angostura bitters atop the white foam.\n\nClassic 1-Ingredient Sour Variants:\n• Rum Sour: Swap bourbon for 2 oz Mount Gay Black Barrel Barbados Rum (or Bacardi Superior) for a bright, tropical, sugarcane-rich sour.\n• New York Sour: Gently float 0.5 oz of dry red wine over the top of the foam.\n• Amaretto Sour: Swap bourbon for Disaronno Amaretto (or use 1.5 oz amaretto + 0.75 oz bourbon).",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Jim Beam Black Bourbon (or JD Bonded Rye)", substitute: "Mount Gay Black Barrel Rum (for Rum Sour) or Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh pressed lemon or lime juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Simple Syrup", substitute: "Agave or honey syrup", inventoryId: "simple-syrup" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Egg White (or Aquafaba)", substitute: "Omit for classic non-foamy sour", inventoryId: "egg-white" },
      { amountOz: "2 drops", amountMl: "2 drops", item: "Angostura Bitters", substitute: "Aromatic bitters on foam", inventoryId: "angostura-bitters" }
    ],
    instructions: [
      "Add spirit (bourbon or rum), citrus juice, simple syrup, and egg white to a shaker without ice.",
      "Dry shake vigorously for 10 seconds to create an emulsion.",
      "Add ice cubes and wet shake hard for 12 seconds until frosty.",
      "Fine strain into a chilled coupe or rocks glass over fresh ice.",
      "Gently place 2-3 drops of Angostura bitters atop the white foam, dragging a toothpick through to create hearts."
    ],
    tags: ["whiskey", "sour", "rum", "egg-white", "classic", "velvety", "in-stock"]
  },
  {
    id: "aperol-spritz",
    name: "Aperol Spritz",
    otherNames: "Spritz Veneziano",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Large Wine Glass",
    alcoholLevel: "Low (~11% ABV)",
    alcoholScore: 2,
    tasteProfile: "Bittersweet, Bubbly, Citrus & Aperitivo",
    difficulty: 1,
    popularity: 9.9,
    proTip: "Remember the 3-2-1 rule: 3 parts Prosecco, 2 parts Aperol, 1 splash of soda. Always add Prosecco before Aperol to avoid settling at the bottom.",
    ingredients: [
      { amountOz: "3 oz", amountMl: "90 ml", item: "Prosecco", substitute: "Any crisp dry sparkling wine or Champagne", inventoryId: "gio-prosecco", ingredientGroup: "prosecco" },
      { amountOz: "2 oz", amountMl: "60 ml", item: "Aperol", substitute: "Campari (for a bolder, bitter Spritz)", inventoryId: "aperol", ingredientGroup: "aperol" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water", ingredientGroup: "soda-water" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Orange Slice & Green Olive", substitute: "Orange wheel", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Fill a large wine glass generously with ice cubes.",
      "Pour in Prosecco first.",
      "Add Aperol in a circular motion to naturally blend.",
      "Top with a splash of Chang Soda Water.",
      "Stir gently once with a bar spoon so you do not break the bubbles.",
      "Garnish with a fresh orange slice."
    ],
    tags: ["aperol", "prosecco", "spritz", "summer", "bubbly", "italian"]
  },
  {
    id: "daiquiri",
    name: "Classic Daiquiri",
    otherNames: "The Barman's Litmus Test",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 3,
    tasteProfile: "Crisp, Tart, Sweet & Pure Rum",
    difficulty: 1,
    popularity: 9.7,
    proTip: "The ultimate bartender test of balance: exactly 2:1:0.75 (Rum, Lime, Sugar). Shake as hard as humanly possible for 10 seconds to create tiny ice shards.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "White Rum", substitute: "Any quality light rum", inventoryId: "bacardi-superior", ingredientGroup: "white-rum" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lime Juice", substitute: "Fresh lime only", inventoryId: "fresh-limes", ingredientGroup: "fresh-lime" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Simple Syrup", substitute: "Demerara syrup or superfine sugar", inventoryId: "simple-syrup", ingredientGroup: "simple-syrup" }
    ],
    instructions: [
      "Chill a coupe glass in the freezer.",
      "Combine white rum, fresh lime juice, and simple syrup in a cocktail shaker.",
      "Fill shaker with ice and shake with maximum power for 10-12 seconds.",
      "Double strain through a fine mesh strainer into the chilled coupe.",
      "Garnish with a clean lime wheel floated or on the rim."
    ],
    tags: ["rum", "sour", "classic", "cuba", "simple", "balanced"]
  },
  {
    id: "manhattan",
    name: "Manhattan",
    otherNames: "The Queen of Cocktails",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Coupe / Nick & Nora",
    alcoholLevel: "High (~30% ABV)",
    alcoholScore: 5,
    tasteProfile: "Spicy, Herbal, Dark Cherry & Warming",
    difficulty: 2,
    popularity: 9.7,
    proTip: "Always use Rye whiskey for classic spice and bite. Bourbon can make a Manhattan overly cloying when paired with sweet vermouth.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Jack Daniel's Bonded Rye", substitute: "Jim Beam Black Aged Bourbon", inventoryId: "jd-bonded-rye" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Martini Rosso Red Vermouth", substitute: "Sweet red vermouth", inventoryId: "martini-rosso" },
      { amountOz: "2 dashes", amountMl: "2 dashes", item: "Angostura Bitters", substitute: "Aromatic bitters", inventoryId: "angostura-bitters" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Maraschino Cherry (Luxardo style)", substitute: "Orange twist", inventoryId: "maraschino-cherries" }
    ],
    instructions: [
      "Chill a coupe or Nick & Nora glass.",
      "In a mixing glass, combine rye whiskey, Martini Rosso vermouth, and Angostura bitters.",
      "Add ice and stir smoothly for 30 seconds until ice cold.",
      "Strain into the chilled glass.",
      "Drop in a rich maraschino cherry."
    ],
    tags: ["whiskey", "rye", "vermouth", "classic", "spirit-forward"]
  },
  {
    id: "moscow-mule",
    name: "Moscow Mule",
    otherNames: "Vodka Buck, Kentucky Mule, Bourbon & Ginger, London Mule, Mexican Mule",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Copper Mug / Highball",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Zesty, Spicy Ginger & Ice Cold",
    difficulty: 1,
    popularity: 9.8,
    proTip: "A copper mug conducts cold immediately, frosting the rim so every sip is shockingly refreshing. Both in-stock ginger beers shine here: Fever-Tree brings a dry, punchy fiery snap, while Bundaberg offers a richer, sweet craft-brewed depth.\n\nClassic 1-Ingredient Mule / Buck Variants:\n• Kentucky Mule (Bourbon & Ginger): Swap vodka for 2 oz Jim Beam Black Bourbon with an expressed orange peel for warm oak, caramel, and spicy ginger heat.\n• Dark 'n' Stormy (Bermuda Mule): Swap vodka for Myers's Original Dark Rum.\n• London Mule (Gin Buck): Swap vodka for Tanqueray London Dry Gin.\n• Mexican Mule: Swap vodka for Teremana Tequila or Topanito Mezcal.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Smirnoff Red Vodka (or Absolut Blue)", substitute: "Absolut Vodka Original Blue", inventoryId: "smirnoff-red" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh pressed lime juice", inventoryId: "fresh-limes" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Fever-Tree Premium Ginger Beer (or Bundaberg)", substitute: "Bundaberg Ginger Beer or Schweppes Ginger Ale", inventoryId: "fever-tree-ginger-beer", ingredientGroup: "ginger-beer" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Lime Wheel & Mint Sprig", substitute: "Candied ginger", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Fill a copper mug or highball glass with crushed ice.",
      "Add vodka and fresh lime juice.",
      "Top with premium fiery ginger beer (Fever-Tree or Bundaberg).",
      "Stir gently with a bar spoon to combine.",
      "Garnish with a lime wheel and a fresh sprig of slapped mint."
    ],
    tags: ["vodka", "ginger", "ginger-beer", "refreshing", "mule", "copper-mug", "in-stock"]
  },
  {
    id: "pina-colada",
    name: "Piña Colada",
    otherNames: "Puerto Rican National Cocktail",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Hurricane / Highball",
    alcoholLevel: "Medium (~14% ABV)",
    alcoholScore: 3,
    tasteProfile: "Tropical, Creamy, Coconut & Sweet",
    difficulty: 2,
    popularity: 9.8,
    proTip: "Float a dark rum cap (Myers's Dark Rum) over the top just before serving for a rich, aromatic molasses aroma on your first sip.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Bacardi Superior White Rum", substitute: "Malibu Coconut Rum for sweeter profile", inventoryId: "bacardi-superior" },
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Coconut Cream (Cream of Coconut)", substitute: "Coconut milk + simple syrup", inventoryId: "coconut-cream" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Pineapple Juice", substitute: "Fresh crushed pineapple", inventoryId: "pineapple-juice" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lime", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz float", amountMl: "15 ml float", item: "Dark/Aged Rum (Myers's or Mount Gay Black Barrel)", substitute: "Aged dark rum float", inventoryId: "myers-dark-rum" }
    ],
    instructions: [
      "Add white rum, coconut cream, pineapple juice, lime juice, and a cup of crushed ice into a blender (or shaker).",
      "Blend until smooth and frosty (or shake aggressively for 20 seconds).",
      "Pour into a chilled hurricane glass.",
      "Float Myers's Dark Rum gently on top using the back of a spoon.",
      "Garnish with a pineapple wedge, maraschino cherry, and cocktail umbrella."
    ],
    tags: ["rum", "tiki", "tropical", "coconut", "pineapple", "summer"]
  },
  {
    id: "cosmopolitan",
    name: "Cosmopolitan",
    otherNames: "The Cosmo",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Coupe / Martini",
    alcoholLevel: "Medium (~20% ABV)",
    alcoholScore: 3,
    tasteProfile: "Tart, Citrusy, Crisp & Pink",
    difficulty: 2,
    popularity: 9.6,
    proTip: "The cranberry juice is meant to provide a blush pink hue and tart acidity, not turn it into a red fruit punch. Use 100% tart cranberry juice.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Absolut Vodka Original Blue", substitute: "Citron / lemon flavored vodka", inventoryId: "absolut-blue" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Cointreau", substitute: "Lumina Triple Sec or Grand Marnier", inventoryId: "cointreau" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lime juice", inventoryId: "fresh-limes" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Cranberry Juice", substitute: "Tart unsweetened cranberry", inventoryId: "cranberry-juice" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Flamed Orange Peel", substitute: "Lime wheel", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Chill a martini or coupe glass.",
      "Add Absolut vodka, Cointreau, lime juice, and cranberry juice into a shaker with ice.",
      "Shake vigorously for 12 seconds until thoroughly chilled.",
      "Double strain into the chilled glass.",
      "Flame an orange peel over the glass to express caramelized citrus oils over the pink surface."
    ],
    tags: ["vodka", "cointreau", "cranberry", "citrus", "modern-classic"]
  },
  {
    id: "bloody-mary",
    name: "Bloody Mary",
    otherNames: "The Morning After Remedy",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Highball / Collins",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Savory, Spicy, Umami & Tomato",
    difficulty: 2,
    popularity: 9.4,
    proTip: "Do not shake hard with ice! Shaking thins out the tomato juice and makes it watery. 'Roll' it gently between shaker tins 4-5 times.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Smirnoff Red Vodka (or Absolut Blue)", substitute: "Absolut Vodka Original Blue", inventoryId: "smirnoff-red" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Tomato Juice", substitute: "Clamato juice (Bloody Caesar)", inventoryId: "tomato-juice" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "3 dashes", amountMl: "3 dashes", item: "Worcestershire Sauce", substitute: "Soy sauce + balsamic", inventoryId: "worcestershire-sauce" },
      { amountOz: "3 drops", amountMl: "3 drops", item: "Tabasco Hot Sauce", substitute: "Sriracha or black pepper", inventoryId: "tabasco-sauce" },
      { amountOz: "Pinch", amountMl: "Pinch", item: "Celery Salt & Black Pepper", substitute: "Kosher salt", inventoryId: "coarse-salt" }
    ],
    instructions: [
      "Rim a highball glass with celery salt.",
      "Add vodka, tomato juice, lemon juice, Worcestershire, Tabasco, salt, and pepper to a shaker tin with ice.",
      "Gently roll the mixture back and forth between two shaker tins to mix without aerating or watering down.",
      "Strain into the prepared glass over fresh ice.",
      "Garnish with a celery stalk, lemon wedge, and olive skewer."
    ],
    tags: ["vodka", "savory", "brunch", "spicy", "tomato"]
  },
  {
    id: "french-75",
    name: "French 75",
    otherNames: "Soixante-Quinze, French 95 (Bourbon), French 76 (Vodka)",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Champagne Flute / Coupe",
    alcoholLevel: "Medium-High (~20% ABV)",
    alcoholScore: 4,
    tasteProfile: "Effervescent, Crisp, Botanical & Citrus",
    difficulty: 2,
    popularity: 9.6,
    proTip: "Named after the French 75mm field artillery cannon because it hits with surprising punch! Chill the flute beforehand and pour the cold Prosecco slowly down a spiral bar spoon to keep the carbonation lively.\n\nFamous 1-Ingredient Bubbly Variants:\n• French 95: Swap London Dry Gin for 1.5 oz Jim Beam Black Bourbon for a richer, oaky, caramel-and-vanilla sparkling cocktail.\n• French 76: Swap Gin for Absolut Vodka for a crisp, citrus-driven sparkling cocktail.\n• French 75 (Cognac Style): Swap Gin for Hennessy VSOP Cognac for the historic 1915 Paris original.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "London Dry Gin", substitute: "Jim Beam Black Bourbon (French 95) or Hennessy VSOP Cognac", inventoryId: "tanqueray-gin", ingredientGroup: "gin" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Sugar syrup", inventoryId: "simple-syrup", ingredientGroup: "simple-syrup" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Prosecco", substitute: "Dry Champagne or sparkling wine", inventoryId: "gio-prosecco", ingredientGroup: "prosecco" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Long Lemon Spiral Twist", substitute: "Lemon peel", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Chill a champagne flute.",
      "In a shaker filled with ice, combine gin (or bourbon/cognac), fresh lemon juice, and simple syrup.",
      "Shake vigorously for 10 seconds.",
      "Strain into the chilled flute.",
      "Slowly top with cold Prosecco.",
      "Garnish with an elegant spiral lemon twist draped inside the flute."
    ],
    tags: ["gin", "bourbon", "prosecco", "champagne", "bubbly", "celebration", "classic", "in-stock"]
  },
  {
    id: "mai-tai",
    name: "Mai Tai",
    otherNames: "Trader Vic's 1944 Original",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Rocks / Double Old Fashioned",
    alcoholLevel: "High (~28% ABV)",
    alcoholScore: 4,
    tasteProfile: "Nutty, Citrusy, Molasses & Island Spice",
    difficulty: 3,
    popularity: 9.8,
    proTip: "Mai Tai means 'Out of this world - the best' in Tahitian. Authentic 1944 Mai Tai contains zero pineapple juice or orange juice—only rum, lime, curacao, and almond orgeat.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Bacardi Superior White Rum", substitute: "Aged amber rum", inventoryId: "bacardi-superior" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Dark/Aged Rum (Myers's or Mount Gay Black Barrel)", substitute: "Jamaican pot still dark rum", inventoryId: "myers-dark-rum" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Cointreau (or Grand Marnier)", substitute: "Grand Marnier or Lumina Triple Sec", inventoryId: "cointreau" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Orgeat Syrup", substitute: "Disaronno Amaretto + drop of simple syrup", inventoryId: "orgeat-syrup" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lime juice", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Save the spent lime shell half after juicing.",
      "In a shaker with crushed ice, combine Bacardi rum, Cointreau, orgeat, and fresh lime juice.",
      "Shake vigorously for 10 seconds.",
      "Pour unstrained (with the crushed ice) into a double rocks glass.",
      "Float Myers's Dark Rum over the top.",
      "Invert the spent lime shell onto the ice (representing an island) and plant a slapped mint bouquet next to it (representing a palm tree)."
    ],
    tags: ["rum", "tiki", "orgeat", "exotic", "classic", "tropical"]
  },
  {
    id: "boulevardier",
    name: "Boulevardier",
    otherNames: "The Bourbon Negroni",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Coupe or Rocks",
    alcoholLevel: "High (~28% ABV)",
    alcoholScore: 5,
    tasteProfile: "Bittersweet, Warm Bourbon, Cherry & Herbal",
    difficulty: 2,
    popularity: 9.6,
    proTip: "Try a 1.5 : 1 : 1 ratio (1.5 oz Bourbon to 1 oz Campari and 1 oz Sweet Vermouth) so the whiskey shines through the assertive bitterness of Campari.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Jim Beam Black Aged Bourbon", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Campari", substitute: "Aperol (sweeter, lower ABV)", inventoryId: "campari" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Martini Rosso Red Vermouth", substitute: "Sweet red vermouth", inventoryId: "martini-rosso" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Orange Peel Twist", substitute: "Brandied cherry", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Fill a mixing glass with plenty of ice.",
      "Pour in Jim Beam Black bourbon, Campari, and Martini Rosso red vermouth.",
      "Stir gracefully for 30 seconds until well-chilled and smooth.",
      "Strain into a chilled coupe or over a large rock in a lowball glass.",
      "Express orange peel oil over the surface and drop it into the glass."
    ],
    tags: ["bourbon", "whiskey", "campari", "vermouth", "speakeasy", "bittersweet"]
  },
  {
    id: "paloma",
    name: "Paloma",
    otherNames: "The National Drink of Mexico, Smoky Mezcal Paloma",
    category: "Cocktail",
    baseSpirit: "Tequila/Mezcal",
    glassware: "Highball / Collins",
    alcoholLevel: "Low-Medium (~13% ABV)",
    alcoholScore: 2,
    tasteProfile: "Grapefruit, Citrus, Tart, Salty & Fizzy",
    difficulty: 1,
    popularity: 9.8,
    proTip: "A tiny pinch of sea salt directly inside the drink cuts through the bitterness of the grapefruit and heightens the sweet agave notes of Teremana. Salt only half the rim so you have the choice of salted or crisp sips.\n\nClassic 1-Ingredient Variant:\n• Smoky Mezcal Paloma: Swap Teremana Tequila for 2 oz Topanito Mezcal Artesanal Espadín (52% ABV) for an incredible earthy campfire smoke and mineral depth that cuts through the tart grapefruit.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Teremana Tequila", substitute: "Topanito Mezcal (for Smoky Mezcal Paloma)", inventoryId: "teremana-tequila" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh pressed lime", inventoryId: "fresh-limes" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Agave Syrup", substitute: "Simple syrup", inventoryId: "agave-syrup" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Pink Grapefruit Juice", substitute: "Grapefruit soda (Jarritos / Squirt)", inventoryId: "grapefruit-juice" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water" },
      { amountOz: "Rim", amountMl: "Rim", item: "Salt Rim & Grapefruit Wedge", substitute: "Tajin or smoked chili salt rim", inventoryId: "coarse-salt" }
    ],
    instructions: [
      "Rim half of a highball glass with coarse salt.",
      "Fill the glass with ice cubes.",
      "Add Teremana tequila (or Mezcal), fresh lime juice, and agave syrup.",
      "Add grapefruit juice and top with Chang Soda Water.",
      "Stir gently to combine, and garnish with a fresh grapefruit slice."
    ],
    tags: ["tequila", "mezcal", "grapefruit", "mexico", "refreshing", "summer", "in-stock"]
  },
  {
    id: "dark-n-stormy",
    name: "Dark 'n' Stormy",
    otherNames: "Bermuda Highball, Spicy Storm, Rum Buck",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Highball",
    alcoholLevel: "Medium (~15% ABV)",
    alcoholScore: 3,
    tasteProfile: "Spicy Ginger, Dark Molasses, Lime & Rich Fizz",
    difficulty: 1,
    popularity: 9.7,
    proTip: "Pour ginger beer and fresh lime juice first, then gently float Myers's Dark Rum (or Mount Gay Black Barrel) over the back of a spoon to create the ominous dark storm-cloud layer. Fever-Tree's 3-ginger blend provides the fiery ginger snap that balances the sweet molasses of the dark rum. For a lighter, sweeter highball, substitute with Schweppes Ginger Ale.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Dark/Aged Rum (Myers's or Mount Gay Black Barrel)", substitute: "Mount Gay Barbados Rum Black Barrel", inventoryId: "myers-dark-rum" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Fever-Tree Premium Ginger Beer (or Bundaberg)", substitute: "Bundaberg Ginger Beer or Schweppes Ginger Ale", inventoryId: "fever-tree-ginger-beer", ingredientGroup: "ginger-beer" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lime wedge squeezed", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Fill a tall highball glass with clean ice cubes.",
      "Add in-stock Fever-Tree ginger beer and fresh lime juice; stir once.",
      "Using the back of a bar spoon against the inside edge of the glass, slowly float Myers's Dark Rum on top.",
      "Do not stir before serving to preserve the dramatic two-tone layer.",
      "Garnish with a lime wheel on the rim."
    ],
    tags: ["dark-rum", "rum", "ginger", "ginger-beer", "bermuda", "refreshing", "layered", "in-stock"]
  },
  {
    id: "tom-collins",
    name: "Tom Collins",
    otherNames: "The Sparkling Gin Lemonade, John Collins (Vodka), Colonel Collins (Bourbon)",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Collins / Highball",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Crisp, Sparkling Lemonade & Botanical",
    difficulty: 1,
    popularity: 9.5,
    proTip: "Think of this as the ultimate adult sparkling lemonade. Shaking the Tanqueray gin, fresh lemon, and simple syrup before adding soda prevents sugar from settling at the base. Tanqueray's bold juniper easily stands up to the heavy fizz of Chang Soda Water.\n\nClassic 1-Ingredient Collins Variants:\n• John Collins (Vodka Collins): Swap gin for 2 oz Absolut Vodka for a clean, sparkling citrus cooler.\n• Colonel Collins: Swap gin for 2 oz Jim Beam Black Bourbon for a refreshing whiskey fizz.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Tanqueray London Dry Gin", substitute: "Absolut Vodka (John Collins) or Jim Beam Black (Colonel Collins)", inventoryId: "tanqueray-gin", ingredientGroup: "gin" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Simple Syrup", substitute: "Rich simple syrup", inventoryId: "simple-syrup", ingredientGroup: "simple-syrup" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water", ingredientGroup: "soda-water" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Lemon Wheel & Maraschino Cherry", substitute: "Lemon slice & mint sprig", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Combine Tanqueray gin, fresh lemon juice, and simple syrup in a shaker with ice.",
      "Shake for 10 seconds and strain into a tall Collins glass filled with fresh ice.",
      "Top with cold Chang Soda Water.",
      "Stir gently with a bar spoon to mix carbonation.",
      "Garnish with a lemon wheel and a maraschino cherry."
    ],
    tags: ["gin", "citrus", "collins", "summer", "refreshing", "in-stock"]
  },
  {
    id: "gimlet",
    name: "Classic Gimlet",
    otherNames: "The Royal Navy Sour, Vodka Gimlet",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~24% ABV)",
    alcoholScore: 4,
    tasteProfile: "Zesty, Crisp, Sweet-Tart & Botanical",
    difficulty: 1,
    popularity: 9.5,
    proTip: "Fresh lime juice paired with simple syrup produces a far crisper, brighter cocktail than artificial bottled lime cordial. Shake hard with plenty of ice for 12 seconds to achieve proper chilling and dilution.\n\nClassic 1-Ingredient Variants:\n• Vodka Gimlet: Swap Tanqueray London Dry Gin for 2 oz Absolut Vodka Original Blue.\n• Southside: Add 6–8 fresh mint leaves directly to the shaker for Al Capone's classic.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Tanqueray London Dry Gin", substitute: "Absolut Vodka (for a Vodka Gimlet)", inventoryId: "tanqueray-gin", ingredientGroup: "gin" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh squeezed lime only", inventoryId: "fresh-limes", ingredientGroup: "fresh-lime" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Simple Syrup", substitute: "Agave syrup", inventoryId: "simple-syrup", ingredientGroup: "simple-syrup" }
    ],
    instructions: [
      "Chill a coupe glass in your freezer for 5 minutes.",
      "Add Tanqueray gin, fresh lime juice, and simple syrup into a shaker filled with plenty of ice.",
      "Shake with energy for 12 seconds until ice-cold.",
      "Fine strain into the chilled coupe.",
      "Garnish with a thin lime wheel floating on top."
    ],
    tags: ["gin", "lime", "sour", "classic", "sharp", "in-stock"]
  },
  {
    id: "sazerac",
    name: "Sazerac",
    otherNames: "The Official Cocktail of New Orleans",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Rocks (No Ice)",
    alcoholLevel: "High (~35% ABV)",
    alcoholScore: 5,
    tasteProfile: "Spicy Rye, Anise, Bitter & Warm",
    difficulty: 3,
    popularity: 9.6,
    proTip: "Serve neat in a thoroughly chilled glass with no ice. The absinthe rinse should coat the glass walls before being discarded, leaving an ethereal herbal aroma.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Jack Daniel's Bonded Rye", substitute: "Jim Beam Black or Cognac", inventoryId: "jd-bonded-rye" },
      { amountOz: "1 tsp", amountMl: "5 ml", item: "Absinthe (Rinse)", substitute: "White Sambuca or Herbsaint rinse", inventoryId: "sambuca" },
      { amountOz: "1 cube", amountMl: "1 cube", item: "Sugar Cube (or 0.25 oz Simple Syrup)", substitute: "Simple syrup", inventoryId: "simple-syrup" },
      { amountOz: "3 dashes", amountMl: "3 dashes", item: "Peychaud's Bitters", substitute: "Angostura bitters (2 dashes)", inventoryId: "angostura-bitters" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Expressed Lemon Peel (Discarded)", substitute: "Lemon twist", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Chill an Old Fashioned rocks glass with crushed ice and water.",
      "In a mixing glass, muddle the sugar cube with Peychaud's (or Angostura) bitters and a splash of water until dissolved.",
      "Add Jack Daniel's Bonded Rye and ice cubes; stir for 30 seconds.",
      "Dump the ice from the chilled rocks glass and pour in a dash of absinthe; roll to coat the inside walls and discard the excess.",
      "Strain the chilled rye into the absinthe-rinsed glass without ice.",
      "Express lemon peel oils over the drink, then discard the peel (traditional New Orleans style)."
    ],
    tags: ["rye", "new-orleans", "absinthe", "classic", "spirit-forward"]
  },
  {
    id: "sidecar",
    name: "Sidecar",
    otherNames: "The Paris Ritz Classic, White Lady (Chelsea Sidecar), Between the Sheets",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~26% ABV)",
    alcoholScore: 4,
    tasteProfile: "Oak, Orange, Sweet-Tart & Rich",
    difficulty: 2,
    popularity: 9.5,
    proTip: "Sugar only half the coupe rim so the crunchy sweetness is optional. The classic 2 : 0.75 : 0.75 ratio strikes an ideal balance between rich grape spirit and tart citrus.\n\nFamous 1-Ingredient Sour / Daisy Family Variants:\n• White Lady (Chelsea Sidecar): Swap Cognac for 1.5 oz Tanqueray London Dry Gin (and optionally add 0.5 oz egg white) for a crisp, floral, porcelain-foamed classic.\n• Between the Sheets: Split the base with 1 oz Bacardi Superior White Rum and 1 oz Cognac/Bourbon with Cointreau and lemon juice for a drier, prohibition-era twist.\n• Margarita: Swap Cognac for Tequila and lemon for fresh lime juice!",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Cognac / French Brandy (or Bourbon)", substitute: "Tanqueray Gin (White Lady), Bacardi White Rum (Between the Sheets), or Jim Beam Black", inventoryId: "hennessy-vsop-cognac", ingredientGroup: "brandy-cognac" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Cointreau", substitute: "Grand Marnier (Grand Sidecar) or Lumina Triple Sec", inventoryId: "cointreau", ingredientGroup: "triple-sec" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons", ingredientGroup: "fresh-lemon" },
      { amountOz: "Rim", amountMl: "Rim", item: "Granulated Sugar", substitute: "Superfine sugar rim", inventoryId: "granulated-sugar" }
    ],
    instructions: [
      "Wet half the rim of a coupe glass with a lemon wedge and dip into granulated sugar.",
      "Combine spirit (cognac, gin, or rum), Cointreau, and fresh lemon juice in a shaker with ice.",
      "Shake with vigor for 12 seconds until frosty.",
      "Double strain into the prepared coupe glass.",
      "Garnish with an expressed orange or lemon twist."
    ],
    tags: ["brandy", "cognac", "gin", "rum", "cointreau", "sour", "classic", "paris", "in-stock"]
  },
  {
    id: "penicillin",
    name: "Penicillin",
    otherNames: "Sam Ross Modern Classic (2005)",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Rocks",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 4,
    tasteProfile: "Smoky Peat, Spicy Ginger, Honey & Citrus",
    difficulty: 3,
    popularity: 9.8,
    proTip: "The Johnnie Walker Black Label brings sweet malt and subtle smoke to the base. If you have an Islay single malt, float a barspoon on top for an unforgettable smoky nose.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Johnnie Walker Black Label Scotch", substitute: "Any blended Scotch whisky", inventoryId: "jw-black-label" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.38 oz", amountMl: "11 ml", item: "Honey Syrup (3:1 honey/water)", substitute: "Simple syrup with honey", inventoryId: "honey-syrup" },
      { amountOz: "0.38 oz", amountMl: "11 ml", item: "Spicy Ginger Syrup", substitute: "Schweppes Ginger Ale reduction or muddled fresh ginger", inventoryId: "ginger-syrup" },
      { amountOz: "0.25 oz float", amountMl: "7.5 ml float", item: "Johnnie Walker Black (or Islay Peated)", substitute: "Smoky Scotch float", inventoryId: "jw-black-label" }
    ],
    instructions: [
      "Add blended Scotch, lemon juice, honey syrup, and ginger syrup into a shaker with ice.",
      "Shake vigorously for 12 seconds.",
      "Strain over a large single ice cube in a rocks glass.",
      "Carefully float a barspoon of smoky Scotch on top.",
      "Garnish with candied ginger or a fresh lemon wheel."
    ],
    tags: ["scotch", "ginger", "honey", "smoky", "modern-classic"]
  },
  {
    id: "irish-coffee",
    name: "Irish Coffee",
    otherNames: "Buena Vista Classic",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Irish Coffee Glass / Mug",
    alcoholLevel: "Medium (~15% ABV)",
    alcoholScore: 3,
    tasteProfile: "Hot Roasty Coffee, Warming Whiskey & Sweet Cold Cream",
    difficulty: 2,
    popularity: 9.7,
    proTip: "Lightly whip heavy cream just until it forms soft ribbons—do NOT whip to stiff peaks. Pour it gently over the back of a warm spoon so it floats on hot coffee.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Irish Whiskey (or Jim Beam Black)", substitute: "Jim Beam Black Aged Bourbon", inventoryId: "jim-beam-black" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Hot Fresh Brewed Coffee", substitute: "Fresh Americano / espresso + hot water", inventoryId: "fresh-espresso" },
      { amountOz: "1 tsp", amountMl: "5 ml", item: "Brown Sugar / Demerara Syrup", substitute: "Granulated sugar", inventoryId: "granulated-sugar" },
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Heavy Whipping Cream (Lightly whipped)", substitute: "Chilled fresh heavy cream", inventoryId: "whipping-heavy-cream" }
    ],
    instructions: [
      "Preheat an Irish coffee mug with hot boiling water; discard the water.",
      "Add brown sugar and hot coffee; stir until sugar is completely dissolved.",
      "Pour in whiskey and stir once.",
      "In a small shaker or bowl, lightly whip cold cream until thickened but still pourable.",
      "Place a warm barspoon just above the surface of the coffee and slowly pour cream over the back of the spoon to float a pristine 1/2-inch layer.",
      "Sip the hot whiskey-coffee through the cold velvety cream."
    ],
    tags: ["whiskey", "coffee", "hot", "cream", "winter", "cozy"]
  },
  {
    id: "long-island-iced-tea",
    name: "Long Island Iced Tea",
    otherNames: "LIIT, Tokyo Tea (Melon Variant), Adios Motherfucker / AMF (Blue Variant)",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Highball / Collins / Hurricane",
    alcoholLevel: "High (~22% ABV)",
    alcoholScore: 5,
    tasteProfile: "Boozy, Sweet-Tart Citrus Lemon & Deceptively Smooth",
    difficulty: 2,
    popularity: 9.8,
    proTip: "The ultimate five-spirit highball alchemy. Despite containing zero tea, the combination of white spirits, citrus, and sweet elements perfectly mimics refreshing iced tea. To ensure the drink remains crisp rather than heavy, flash-shake the spirits with citrus and sugar first, strain over raw ice, and treat the soda topper as a coloring agent rather than a mixer.\n\nFamous 1-Ingredient Riffs with Fancy Names:\n• Tokyo Tea: A vibrant neon-green twist. Swap out the orange Triple Sec/Cointreau entirely for 0.5 oz Midori Melon Liqueur, and trade the dark cola for bubbly lemon-lime soda (Sprite). The Midori functions as both the primary color identity and a lush, honeydew sweetener, eliminating the chemical baseline burn of the underlying spirits.\n• Adios Motherfucker (AMF): An electric blue party showstopper. Retain the underlying four clear base spirits, but substitute the orange Triple Sec/Cointreau for 0.5 oz Curaçao Bleu Liqueur, and top up with lemon-lime soda. The blue curaçao provides a punchy, candied-orange citrus profile that clashes visually and flavor-wise with the traditional cola build.",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Smirnoff Red Vodka", substitute: "Absolut Vodka Original Blue", inventoryId: "smirnoff-red", ingredientGroup: "vodka" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Bacardi Superior White Rum", substitute: "Any quality light white rum", inventoryId: "bacardi-superior", ingredientGroup: "white-rum" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin", ingredientGroup: "gin" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Teremana Tequila", substitute: "Blanco or reposado tequila", inventoryId: "teremana-tequila", ingredientGroup: "tequila" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Cointreau / Midori (Tokyo Tea) / Curaçao Bleu (AMF)", substitute: "Swap out Cointreau for Midori Melon Liqueur when building a Tokyo Tea, or Curaçao Bleu Liqueur when building an AMF", inventoryId: "cointreau", ingredientGroup: "triple-sec" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh house-made sour mix", inventoryId: "fresh-lemons", ingredientGroup: "fresh-lemon" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Premium sugar syrup", inventoryId: "simple-syrup", ingredientGroup: "simple-syrup" },
      { amountOz: "Top up", amountMl: "Top up", item: "Cola / Lemon-Lime Soda (Tokyo Tea & AMF)", substitute: "Use Coca-Cola for the standard classic, or swap completely for Sprite/Lemon-Lime Soda when crafting a Tokyo Tea or an AMF", inventoryId: "cola" }
    ],
    instructions: [
      "Fill a tall highball, Collins, or hurricane glass to the absolute brim with large ice blocks.",
      "Add your vodka, white rum, gin, tequila, and your choice of modifier liqueur (Cointreau for classic, Midori for Tokyo Tea, or Curaçao Bleu for AMF) into a shaker with ice.",
      "Add the fresh pressed lemon juice and premium simple syrup.",
      "Shake with maximum speed for exactly 6 to 8 seconds to drop the temperature without over-diluting the spirits.",
      "Strain into your prepared glass over the raw ice stack.",
      "Slowly float your top-up soda layer over the crown (Cola for classic, Lemon-Lime Soda for Tokyo Tea/AMF) to complete the color profile.",
      "Garnish elegantly with a fresh lemon wheel on the rim and a maraschino cherry."
    ],
    tags: ["vodka", "rum", "gin", "tequila", "cointreau", "midori", "curacao-bleu", "party", "potent", "layered", "in-stock"]
  },
  {
    id: "tequila-sunrise",
    name: "Tequila Sunrise",
    otherNames: "The Rolling Stones Drink",
    category: "Cocktail",
    baseSpirit: "Tequila/Mezcal",
    glassware: "Highball / Hurricane",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Fruity, Citrus, Sweet & Stunning Visuals",
    difficulty: 1,
    popularity: 9.6,
    proTip: "Do not stir after pouring the grenadine! Because grenadine has high sugar density, it sinks directly to the base and creates the iconic red-to-golden sunrise gradient.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Teremana Tequila", substitute: "Any blanco or reposado tequila", inventoryId: "teremana-tequila" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Fresh Orange Juice", substitute: "Sweet orange juice", inventoryId: "orange-juice" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Pomegranate Grenadine", substitute: "Raspberry Rhapsody syrup", inventoryId: "pomegranate-grenadine" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Orange Slice & Maraschino Cherry", substitute: "Cherry on pick", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Fill a highball glass with ice cubes.",
      "Pour in Teremana tequila and fresh orange juice; stir briefly to combine.",
      "Slowly pour Pomegranate Grenadine down the inside wall of the glass.",
      "Watch it settle at the bottom and gradually rise into a radiant gradient.",
      "Garnish with an orange wheel and a maraschino cherry on a skewer."
    ],
    tags: ["tequila", "orange", "grenadine", "tropical", "visual", "sweet"]
  },
  {
    id: "amaretto-sour",
    name: "Amaretto Sour",
    otherNames: "Jeffrey Morgenthaler Style",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Rocks / Lowball",
    alcoholLevel: "Medium (~16% ABV)",
    alcoholScore: 3,
    tasteProfile: "Sweet Almond, Rich Bourbon, Tart Citrus & Silky Foam",
    difficulty: 2,
    popularity: 9.8,
    proTip: "The Morgenthaler secret: pairing Disaronno Amaretto with high-proof bourbon (Jim Beam Black / JD Bonded Rye) cuts the sweet almond liqueur into a magnificent, balanced masterpiece.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Disaronno Originale Amaretto", substitute: "Almond liqueur", inventoryId: "disaronno-amaretto" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Jim Beam Black Aged Bourbon", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Simple Syrup", substitute: "Demerara or agave", inventoryId: "simple-syrup" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Egg White", substitute: "Aquafaba or omit", inventoryId: "egg-white" }
    ],
    instructions: [
      "Add Disaronno, bourbon, fresh lemon juice, simple syrup, and egg white to a shaker without ice.",
      "Dry shake vigorously for 10 seconds to generate silky foam.",
      "Fill with ice and wet shake hard for 12 seconds.",
      "Strain over fresh ice in a rocks glass.",
      "Garnish with a brandied cherry and a lemon peel twist."
    ],
    tags: ["amaretto", "bourbon", "disaronno", "sour", "egg-white", "top-tier"]
  },
  {
    id: "white-russian",
    name: "White Russian",
    otherNames: "The Dude's Drink (The Big Lebowski), Black Russian, Mudslide",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Rocks / Old Fashioned",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Decadent Coffee, Creamy Vanilla & Smooth",
    difficulty: 1,
    popularity: 9.8,
    proTip: "Gently float heavy cream over the back of a spoon onto the vodka/Kahlúa base. Don't stir right away—admire the swirling marble cascade!\n\n1-Ingredient Variants:\n• Black Russian: Simply omit the heavy whipping cream (2 oz Absolut Vodka + 1 oz Kahlúa over ice) for the original 1949 dark, potent, coffee-forward nightcap.\n• Mudslide: Add 1 oz Baileys Irish Cream alongside the Kahlúa and cream for an ultra-rich dessert cocktail.\n• White Belgian: Swap cream for chocolate liqueur.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Absolut Vodka Original Blue", substitute: "Smirnoff Red Vodka", inventoryId: "absolut-blue", ingredientGroup: "vodka" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Kahlúa Coffee Liqueur", substitute: "Walcher Premium Coffee Liqueur", inventoryId: "kahlua", ingredientGroup: "coffee-liqueur" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Heavy Whipping Cream (or omit for Black Russian)", substitute: "Omit for Black Russian, or use whole milk / half-and-half / oat milk", inventoryId: "whipping-heavy-cream" }
    ],
    instructions: [
      "Fill a rocks glass with ice cubes.",
      "Pour in Absolut vodka and Kahlúa; stir briefly to chill.",
      "Carefully pour heavy cream over the back of a bar spoon so it floats on top (or omit cream for a Black Russian).",
      "Serve with a straw or enjoy watching the cream cascade down into the dark coffee layer."
    ],
    tags: ["vodka", "kahlua", "cream", "dessert", "classic", "movie", "in-stock"]
  },
  {
    id: "caipirinha",
    name: "Caipirinha",
    otherNames: "Brazil's National Cocktail",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Rocks / Lowball",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 4,
    tasteProfile: "Grassy Cane, Tart Lime & Pure Sugar",
    difficulty: 1,
    popularity: 9.5,
    proTip: "Cut the lime into small wedges and remove the white pith from the center to eliminate bitterness before muddling vigorously with sugar.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Cachaça (or Bacardi White Rum)", substitute: "Bacardi Superior White Rum (Caipirissima)", inventoryId: "bacardi-superior" },
      { amountOz: "1 whole", amountMl: "1 whole", item: "Fresh Lime (Cut into 8 wedges)", substitute: "Fresh lime wedges", inventoryId: "fresh-limes" },
      { amountOz: "2 tsp", amountMl: "10 ml", item: "Granulated Sugar", substitute: "Simple syrup", inventoryId: "granulated-sugar" }
    ],
    instructions: [
      "Place lime wedges and sugar directly into a sturdy rocks glass.",
      "Muddle firmly to extract all the lime juice and dissolve the sugar crystals in the citrus oils.",
      "Fill the glass with crushed ice.",
      "Pour in cachaça (or Bacardi white rum).",
      "Stir thoroughly from the bottom up to integrate and serve with short straws."
    ],
    tags: ["cachaca", "rum", "lime", "brazil", "refreshing"]
  },
  {
    id: "mint-julep",
    name: "Mint Julep",
    otherNames: "Kentucky Derby Classic",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Julep Cup / Rocks",
    alcoholLevel: "High (~30% ABV)",
    alcoholScore: 4,
    tasteProfile: "Sweet Oak, Bourbon Warmth & Frosty Mint",
    difficulty: 2,
    popularity: 9.6,
    proTip: "Pack the crushed ice in high like a snowcone dome. As you hold the silver julep cup by the rim or base, frost will bloom over the exterior.",
    ingredients: [
      { amountOz: "2.5 oz", amountMl: "75 ml", item: "Jim Beam Black Aged Bourbon", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Rich demerara syrup", inventoryId: "simple-syrup" },
      { amountOz: "8-10 leaves", amountMl: "8-10 leaves", item: "Fresh Mint Leaves", substitute: "Fresh spearmint", inventoryId: "fresh-mint" }
    ],
    instructions: [
      "In the bottom of a julep cup or rocks glass, gently press mint leaves with simple syrup.",
      "Fill the cup halfway with crushed ice and pour in half the bourbon.",
      "Stir until the outside of the vessel begins to frost.",
      "Add more crushed ice, pour in the remaining bourbon, and pack crushed ice into a mounded dome over the top.",
      "Insert a bouquet of mint next to the straw so you inhale mint with every sip."
    ],
    tags: ["bourbon", "whiskey", "mint", "crushed-ice", "derby"]
  },
  {
    id: "aviation",
    name: "Aviation",
    otherNames: "Hugo Ensslin 1916 Classic",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~25% ABV)",
    alcoholScore: 4,
    tasteProfile: "Floral, Tart, Cherry Pit & Sky Blue",
    difficulty: 3,
    popularity: 9.4,
    proTip: "Go easy on the Crème de Violette—just a quarter ounce is enough to impart the signature pale periwinkle sky color without making it taste like soap.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Maraschino Liqueur", substitute: "Peter Heering Cherry + touch of dry vermouth", inventoryId: "cherry-heering" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Crème de Violette", substitute: "St-Germain Elderflower (Aviation riff)", inventoryId: "st-germain" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Chill a coupe glass.",
      "Add gin, maraschino, crème de violette, and fresh lemon juice to a shaker with ice.",
      "Shake vigorously for 12 seconds.",
      "Fine strain into the chilled coupe.",
      "Garnish with a dark maraschino cherry sank to the bottom like an airplane propeller."
    ],
    tags: ["gin", "floral", "classic", "vintage", "violette"]
  },
  {
    id: "pisco-sour",
    name: "Pisco Sour",
    otherNames: "The Andean National Drink",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Coupe / Rocks",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Grape Floral, Tart Lime, Silky Egg Foam & Aromatic Bitters",
    difficulty: 2,
    popularity: 9.5,
    proTip: "Always drop Angostura bitters directly onto the egg white foam rather than into the shaker. The bitters sit as aromatic art on top.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Pisco (or Tanqueray Gin / Bacardi Rum)", substitute: "Tanqueray Gin (Gin Sour) or Bacardi Rum", inventoryId: "tanqueray-gin" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lime Juice", substitute: "Fresh key lime juice", inventoryId: "fresh-limes" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Simple Syrup", substitute: "Rich simple syrup", inventoryId: "simple-syrup" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Egg White", substitute: "Aquafaba", inventoryId: "egg-white" },
      { amountOz: "3 drops", amountMl: "3 drops", item: "Angostura Bitters (on foam)", substitute: "Aromatic bitters", inventoryId: "angostura-bitters" }
    ],
    instructions: [
      "Dry shake pisco, lime juice, simple syrup, and egg white without ice for 10 seconds.",
      "Add ice and wet shake hard for 12 seconds until thoroughly chilled and foamy.",
      "Double strain into a chilled coupe glass.",
      "Carefully drop 3 drops of Angostura bitters on the dense white foam."
    ],
    tags: ["pisco", "sour", "egg-white", "south-america", "silky"]
  },
  {
    id: "bramble",
    name: "Bramble",
    otherNames: "Dick Bradsell Modern Classic (1984)",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Rocks / Old Fashioned",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Tart Blackberry, Fresh Lemon, Botanical & Crushed Ice",
    difficulty: 2,
    popularity: 9.6,
    proTip: "Drizzle the berry liqueur (or Raspberry Rhapsody) over the crushed ice *after* straining the gin sour base so it bleeds beautifully through the ice.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Sugar syrup", inventoryId: "simple-syrup" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Crème de Mûre (or Raspberry Rhapsody)", substitute: "Raspberry Rhapsody Flavored Syrup / Peter Heering", inventoryId: "raspberry-rhapsody" }
    ],
    instructions: [
      "Combine Tanqueray gin, lemon juice, and simple syrup in a shaker with ice.",
      "Shake for 10 seconds and strain into a rocks glass packed with crushed ice.",
      "Slowly drizzle the blackberry liqueur (or Raspberry Rhapsody) over the crown of crushed ice.",
      "Garnish with a lemon half-wheel and fresh blackberries or raspberries."
    ],
    tags: ["gin", "berry", "bramble", "crushed-ice", "london", "modern-classic"]
  },
  {
    id: "french-connection",
    name: "French Connection",
    otherNames: "Cognac & Amaretto Duo",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Rocks / Snifter",
    alcoholLevel: "High (~32% ABV)",
    alcoholScore: 5,
    tasteProfile: "Warm Oak, Sweet Marzipan & Velvety Smooth",
    difficulty: 1,
    popularity: 9.3,
    proTip: "Equal parts or 1.5 : 1 ratio. Disaronno's sweet almond marries gorgeously with the rich oak and vanilla of Cognac (or Jim Beam Black Bourbon).",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Cognac / French Brandy (or Bourbon)", substitute: "Jim Beam Black Aged Bourbon", inventoryId: "jim-beam-black" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Disaronno Originale Amaretto", substitute: "Walcher Amaretto", inventoryId: "disaronno-amaretto" }
    ],
    instructions: [
      "Fill a rocks glass or brandy snifter with ice cubes.",
      "Pour in Cognac (or bourbon) and Disaronno amaretto.",
      "Stir gently for 20 seconds to blend and chill.",
      "Serve neat or on the rocks."
    ],
    tags: ["cognac", "bourbon", "amaretto", "duo", "after-dinner", "smooth"]
  },
  {
    id: "vesper",
    name: "Vesper Martini",
    otherNames: "James Bond's Casino Royale Cocktail",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe / Martini",
    alcoholLevel: "High (~34% ABV)",
    alcoholScore: 5,
    tasteProfile: "Crisp, Herbal Quinine, Silky & Cold as Ice",
    difficulty: 2,
    popularity: 9.7,
    proTip: "'Three measures of Gordon's, one of vodka, half a measure of Kina Lillet. Shake it very well until it's ice-cold, then add a large thin slice of lemon peel.'",
    ingredients: [
      { amountOz: "2.5 oz", amountMl: "75 ml", item: "Tanqueray London Dry Gin", substitute: "Any high-proof London dry gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Absolut Vodka Original Blue", substitute: "Smirnoff Red Vodka", inventoryId: "absolut-blue" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Lillet Blanc", substitute: "Cocchi Americano or Dry Vermouth", inventoryId: "lillet-blanc" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Wide Lemon Peel Twist", substitute: "Lemon peel", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Chill a coupe or deep martini glass until frosty.",
      "Add Tanqueray gin, Absolut vodka, and Lillet Blanc into a shaker with abundant ice.",
      "Shake aggressively for 15 seconds (Bond style!).",
      "Fine strain into the chilled glass.",
      "Express a wide, thin slice of lemon peel over the glass and drop it in."
    ],
    tags: ["gin", "vodka", "lillet", "james-bond", "classic", "potent"]
  },
  {
    id: "clover-club",
    name: "Clover Club",
    otherNames: "Philadelphia Men's Club (1880s)",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Sweet Raspberry, Tart Lemon, Botanical & Velvet Cloud",
    difficulty: 2,
    popularity: 9.5,
    proTip: "Use your stocked Raspberry Rhapsody flavored syrup! It creates the radiant pink hue and lush berry backbone against Tanqueray gin.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Raspberry Rhapsody Flavored Syrup", substitute: "Fresh raspberries muddled with simple syrup", inventoryId: "raspberry-rhapsody" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Egg White (or Aquafaba)", substitute: "Omit for lighter texture", inventoryId: "egg-white" }
    ],
    instructions: [
      "Add gin, lemon juice, Raspberry Rhapsody syrup, and egg white to a shaker without ice.",
      "Dry shake vigorously for 12 seconds to whip the egg white.",
      "Add ice and shake hard for 12 seconds until icy cold.",
      "Double strain into a chilled coupe glass.",
      "Garnish with 3 fresh raspberries on a cocktail skewer."
    ],
    tags: ["gin", "raspberry", "sour", "egg-white", "pink", "pre-prohibition"]
  },
  {
    id: "last-word",
    name: "Last Word",
    otherNames: "Detroit Athletic Club (1915)",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe",
    alcoholLevel: "High (~28% ABV)",
    alcoholScore: 4,
    tasteProfile: "Herbal, Piquant Lime, Maraschino Cherry & Alpine",
    difficulty: 2,
    popularity: 9.7,
    proTip: "The ultimate equal parts masterpiece: 0.75 oz Gin, 0.75 oz Green Chartreuse, 0.75 oz Maraschino, 0.75 oz Lime. None dominates; they harmonize into alchemy.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Green Chartreuse", substitute: "St-Germain or Yellow Chartreuse", inventoryId: "green-chartreuse" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Luxardo Maraschino Liqueur", substitute: "Peter Heering Cherry + Cointreau", inventoryId: "cherry-heering" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lime juice", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Chill a coupe glass.",
      "Add equal parts gin, Green Chartreuse, Maraschino, and fresh lime juice into a shaker.",
      "Fill with ice and shake with high energy for 12 seconds.",
      "Fine strain into the chilled coupe.",
      "Garnish with a brandied cherry in the center."
    ],
    tags: ["gin", "chartreuse", "maraschino", "equal-parts", "prohibition", "elite"]
  },
  {
    id: "paper-plane",
    name: "Paper Plane",
    otherNames: "Sam Ross Modern Classic (2008)",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Coupe / Nick & Nora",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 4,
    tasteProfile: "Bittersweet, Caramel Bourbon, Herbal Rhubarb & Bright Citrus",
    difficulty: 2,
    popularity: 9.8,
    proTip: "Equal parts 4-way harmony: Bourbon, Aperol, Amaro Nonino, and Lemon Juice. Shaken cold, it is one of the most celebrated modern classics of the 21st century.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Jim Beam Black Aged Bourbon", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Aperol", substitute: "Campari (for a darker, more bitter riff)", inventoryId: "aperol" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Amaro Nonino (or Disaronno/Campari mix)", substitute: "Martini Rosso or Disaronno + splash Campari", inventoryId: "martini-rosso" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh pressed lemon juice", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Chill a coupe glass.",
      "Combine bourbon, Aperol, Amaro Nonino (or sweet vermouth/Disaronno substitute), and lemon juice in a shaker.",
      "Fill with ice and shake vigorously for 12 seconds.",
      "Double strain into the chilled coupe glass.",
      "Optionally garnish with a tiny origami paper plane clipped to the rim."
    ],
    tags: ["bourbon", "aperol", "modern-classic", "equal-parts", "bittersweet"]
  },
  {
    id: "naked-and-famous",
    name: "Naked and Famous",
    otherNames: "Joaquín Simó Death & Co Classic (2011)",
    category: "Cocktail",
    baseSpirit: "Tequila/Mezcal",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 4,
    tasteProfile: "Smoky Agave, Bittersweet Aperol, Herbal Gentian & Lime",
    difficulty: 2,
    popularity: 9.7,
    proTip: "The lovechild of the Last Word and the Paper Plane. Equal parts Mezcal, Aperol, Yellow Chartreuse, and fresh lime juice.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Artisanal Mezcal (or Teremana Tequila)", substitute: "Teremana Tequila (for unsmoked agave riff)", inventoryId: "teremana-tequila" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Aperol", substitute: "Campari", inventoryId: "aperol" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Yellow Chartreuse (or St-Germain)", substitute: "St-Germain Elderflower Liqueur", inventoryId: "st-germain" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lime juice", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Chill a coupe glass.",
      "Add mezcal/tequila, Aperol, Yellow Chartreuse (or St-Germain), and fresh lime juice to a shaker with ice.",
      "Shake vigorously for 12 seconds.",
      "Fine strain into the chilled coupe.",
      "No garnish needed; admire the luminous amber-orange hue."
    ],
    tags: ["mezcal", "tequila", "aperol", "death-and-co", "equal-parts"]
  },
  {
    id: "zombie",
    name: "Zombie",
    otherNames: "Donn Beach 1934 Legend",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Tiki Mug / Highball",
    alcoholLevel: "High (~32% ABV)",
    alcoholScore: 5,
    tasteProfile: "Potent Rum, Tropical Citrus, Cinnamon & Anise",
    difficulty: 4,
    popularity: 9.6,
    proTip: "Donn Beach famously limited customers to two Zombies per night because 'it makes you walk like the dead.' Pack with crushed ice to manage dilution.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Bacardi Superior White Rum", substitute: "Light Puerto Rican rum", inventoryId: "bacardi-superior" },
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Dark/Aged Rum (Myers's or Mount Gay Black Barrel)", substitute: "Jamaican dark rum", inventoryId: "myers-dark-rum" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Goslings Black Seal 151 Proof Rum (Float)", substitute: "Additional Myers's Dark Rum", inventoryId: "goslings-black-seal-151" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lime", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Grapefruit Juice", substitute: "Pink grapefruit juice", inventoryId: "grapefruit-juice" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Pomegranate Grenadine", substitute: "Raspberry Rhapsody syrup", inventoryId: "pomegranate-grenadine" },
      { amountOz: "1 dash", amountMl: "1 dash", item: "Angostura Bitters", substitute: "Aromatic bitters", inventoryId: "angostura-bitters" }
    ],
    instructions: [
      "Combine rums (except overproof), juices, grenadine, and bitters in a shaker with crushed ice.",
      "Shake for 10 seconds and pour unstrained into a tall tiki mug or hurricane glass.",
      "Top with more crushed ice and gently float the overproof/dark rum on top.",
      "Garnish extravagantly with a mint sprig, lime wheel, and cherry."
    ],
    tags: ["rum", "tiki", "potent", "legendary", "tropical"]
  },
  {
    id: "sea-breeze",
    name: "Sea Breeze",
    otherNames: "Cape Codder Riff",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Highball",
    alcoholLevel: "Low-Medium (~11% ABV)",
    alcoholScore: 2,
    tasteProfile: "Tart Cranberry, Tangy Grapefruit & Clean Vodka",
    difficulty: 1,
    popularity: 9.3,
    proTip: "The ultimate beach cooler: simple, thirst-quenching, and tart. 4 parts cranberry to 3 parts grapefruit juice creates the ideal balance.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Smirnoff Red Vodka (or Absolut Blue)", substitute: "Absolut Vodka Original Blue", inventoryId: "smirnoff-red" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Cranberry Juice", substitute: "Tart cranberry juice", inventoryId: "cranberry-juice" },
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Grapefruit Juice", substitute: "Fresh pink grapefruit juice", inventoryId: "grapefruit-juice" }
    ],
    instructions: [
      "Fill a highball glass with ice cubes.",
      "Add vodka.",
      "Add cranberry juice and grapefruit juice.",
      "Stir gently with a bar spoon.",
      "Garnish with a fresh lime wheel on the rim."
    ],
    tags: ["vodka", "cranberry", "grapefruit", "summer", "refreshing"]
  },
  {
    id: "sex-on-the-beach",
    name: "Sex on the Beach",
    otherNames: "Spring Break Classic",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Highball / Hurricane",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Sweet Peach, Orange Citrus, Tart Cranberry & Fruity",
    difficulty: 1,
    popularity: 9.7,
    proTip: "Layer the cranberry juice on the bottom, then shake the vodka, peach schnapps, and orange juice and float gently on top for a two-toned sunset presentation.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Absolut Vodka Original Blue", substitute: "Smirnoff Red Vodka", inventoryId: "absolut-blue" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Hoffmann Peach Liqueur", substitute: "Peach schnapps", inventoryId: "hoffmann-peach" },
      { amountOz: "2 oz", amountMl: "60 ml", item: "Orange Juice", substitute: "Fresh orange juice", inventoryId: "orange-juice" },
      { amountOz: "2 oz", amountMl: "60 ml", item: "Cranberry Juice", substitute: "Tart cranberry juice", inventoryId: "cranberry-juice" }
    ],
    instructions: [
      "Fill a hurricane or highball glass with ice.",
      "Pour cranberry juice into the bottom.",
      "In a shaker with ice, shake vodka, Hoffmann peach liqueur, and orange juice.",
      "Slowly strain the orange-peach mix over the back of a spoon onto the cranberry layer.",
      "Garnish with an orange wheel and a maraschino cherry."
    ],
    tags: ["vodka", "peach", "cranberry", "orange", "party", "fruity"]
  },
  {
    id: "pisco-punch",
    name: "Pisco Punch",
    otherNames: "Bank Exchange San Francisco (1850s)",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Coupe / Rocks",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Pineapple Infused, Aromatic Grape, Citrus & Silky",
    difficulty: 2,
    popularity: 9.4,
    proTip: "Duncan Nichol's historic Gold Rush recipe. Shaking with rich pineapple syrup or juice creates a natural velvety foam.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Pisco (or Tanqueray Gin / Bacardi Rum)", substitute: "Bacardi Superior White Rum", inventoryId: "bacardi-superior" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Pineapple Juice", substitute: "Fresh pressed pineapple juice", inventoryId: "pineapple-juice" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Demerara or pineapple syrup", inventoryId: "simple-syrup" }
    ],
    instructions: [
      "Add pisco (or rum), pineapple juice, lemon juice, and simple syrup into a shaker with ice.",
      "Shake vigorously for 12 seconds to froth the pineapple enzymes.",
      "Strain into a chilled coupe or over fresh ice in a rocks glass.",
      "Garnish with a fresh pineapple chunk."
    ],
    tags: ["pisco", "rum", "pineapple", "san-francisco", "historic"]
  },
  {
    id: "hemingway-daiquiri",
    name: "Hemingway Daiquiri",
    otherNames: "Papa Doble, El Floridita Special",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 4,
    tasteProfile: "Dry Grapefruit, Maraschino Cherry, Lime & Rum",
    difficulty: 2,
    popularity: 9.6,
    proTip: "Ernest Hemingway drank these at El Floridita in Havana. He requested no sugar and double rum! Adding a touch of maraschino brings floral balance.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Bacardi Superior White Rum", substitute: "Any dry white rum", inventoryId: "bacardi-superior" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Luxardo Maraschino Liqueur", substitute: "Peter Heering Cherry + Cointreau", inventoryId: "cherry-heering" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lime juice", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Grapefruit Juice", substitute: "Fresh pink grapefruit juice", inventoryId: "grapefruit-juice" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Simple Syrup (Optional)", substitute: "Simple syrup to balance", inventoryId: "simple-syrup" }
    ],
    instructions: [
      "Chill a coupe glass in the freezer.",
      "Add Bacardi white rum, maraschino, fresh lime juice, and grapefruit juice into a shaker with plenty of ice.",
      "Shake vigorously for 12 seconds.",
      "Double strain into the chilled coupe.",
      "Garnish with a lime wheel or maraschino cherry."
    ],
    tags: ["rum", "hemingway", "grapefruit", "havana", "classic"]
  },
  {
    id: "corpse-reviver-no-2",
    name: "Corpse Reviver No. 2",
    otherNames: "Harry Craddock Savoy Cocktail Book (1930)",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~24% ABV)",
    alcoholScore: 4,
    tasteProfile: "Crisp Botanical, Lillet Honey, Orange & Whispering Anise",
    difficulty: 2,
    popularity: 9.7,
    proTip: "Equal parts: Gin, Cointreau, Lillet Blanc, and Lemon Juice, rinsed with Absinthe. 'Four of these taken in swift succession will unrevive the corpse again.'",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Cointreau", substitute: "Grand Marnier or Lumina Triple Sec", inventoryId: "cointreau" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Lillet Blanc", substitute: "Cocchi Americano or dry vermouth", inventoryId: "lillet-blanc" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "1 dash", amountMl: "1 dash", item: "Absinthe Rinse", substitute: "White Sambuca rinse", inventoryId: "sambuca" }
    ],
    instructions: [
      "Rinse the inside of a chilled coupe with a dash of absinthe and discard the excess.",
      "Combine Tanqueray gin, Cointreau, Lillet Blanc, and fresh lemon juice in a cocktail shaker filled with ice.",
      "Shake with vigor for 12 seconds.",
      "Fine strain into the prepared absinthe-scented coupe.",
      "Garnish with an expressed lemon peel twist."
    ],
    tags: ["gin", "cointreau", "lillet", "absinthe", "savoy", "classic"]
  },
  {
    id: "vieux-carre",
    name: "Vieux Carré",
    otherNames: "The Old French Quarter Cocktail (1938)",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Rocks / Lowball",
    alcoholLevel: "High (~30% ABV)",
    alcoholScore: 5,
    tasteProfile: "Complex Oak, Herbal Spices, Rich Vermouth & Bitters",
    difficulty: 2,
    popularity: 9.6,
    proTip: "Walter Bergeron created this at the Monteleone Carousel Bar. The split base of spicy Rye and rich Cognac/Bourbon produces unmatched sophistication.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Jack Daniel's Bonded Rye", substitute: "Straight rye whiskey", inventoryId: "jd-bonded-rye" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Cognac / French Brandy (or Jim Beam Black)", substitute: "Jim Beam Black Aged Bourbon", inventoryId: "jim-beam-black" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Martini Rosso Red Vermouth", substitute: "Sweet red vermouth", inventoryId: "martini-rosso" },
      { amountOz: "1 tsp", amountMl: "5 ml", item: "Bénédictine (or St-Germain)", substitute: "St-Germain Elderflower Liqueur", inventoryId: "st-germain" },
      { amountOz: "1 dash", amountMl: "1 dash", item: "Angostura Bitters", substitute: "Aromatic bitters", inventoryId: "angostura-bitters" },
      { amountOz: "1 dash", amountMl: "1 dash", item: "Peychaud's Bitters", substitute: "Angostura bitters", inventoryId: "angostura-bitters" }
    ],
    instructions: [
      "Combine rye whiskey, cognac (or bourbon), Martini Rosso vermouth, herbal liqueur, and bitters in a mixing glass with ice.",
      "Stir gracefully for 30 seconds until well-chilled.",
      "Strain into a rocks glass over a single large ice cube.",
      "Express a lemon peel over the top and garnish with a brandied cherry."
    ],
    tags: ["rye", "cognac", "vermouth", "new-orleans", "complex", "classic"]
  },
  {
    id: "singapore-gin-sling-classic",
    name: "Singapore Gin Sling (Classic Style)",
    otherNames: "Original 19th Century Sling",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Highball",
    alcoholLevel: "Medium (~15% ABV)",
    alcoholScore: 3,
    tasteProfile: "Dry Botanical, Tart Lemon, Cherry & Bubbly Soda",
    difficulty: 2,
    popularity: 9.4,
    proTip: "Before the 1915 Raffles pineapple version, the 19th-century Gin Sling was a light, effervescent highball of gin, cherry liqueur, lemon, and soda water.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Peter Heering Cherry Liqueur", substitute: "Cherry brandy", inventoryId: "cherry-heering" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Pomegranate grenadine", inventoryId: "simple-syrup" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water" }
    ],
    instructions: [
      "Add Tanqueray gin, cherry Heering, lemon juice, and simple syrup to a shaker with ice.",
      "Shake for 10 seconds and strain into a highball glass filled with ice.",
      "Top with cold Chang Soda Water.",
      "Garnish with a lemon wheel and a maraschino cherry."
    ],
    tags: ["gin", "sling", "singapore", "historic", "refreshing"]
  },
  {
    id: "americano",
    name: "Americano",
    otherNames: "Milano-Torino Con Soda",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Highball / Rocks",
    alcoholLevel: "Low (~9% ABV)",
    alcoholScore: 1,
    tasteProfile: "Bittersweet, Effervescent, Herbal & Orange",
    difficulty: 1,
    popularity: 9.4,
    proTip: "The drink James Bond orders in Casino Royale when he doesn't want a heavy cocktail. Equal parts Campari and Sweet Vermouth topped with fizz.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Campari", substitute: "Aperol (sweeter version)", inventoryId: "campari" },
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Martini Rosso Red Vermouth", substitute: "Sweet red vermouth", inventoryId: "martini-rosso" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Orange Slice & Lemon Twist", substitute: "Orange wheel", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Fill a highball or rocks glass with ice cubes.",
      "Pour in Campari and Martini Rosso red vermouth.",
      "Top with bubbly Chang Soda Water.",
      "Stir gently once to lift the vermouth.",
      "Garnish with a fresh orange slice."
    ],
    tags: ["campari", "vermouth", "aperitivo", "low-abv", "italy"]
  },
  {
    id: "bellini",
    name: "Bellini",
    otherNames: "Harry's Bar Venice Classic (1948)",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Champagne Flute",
    alcoholLevel: "Low (~9% ABV)",
    alcoholScore: 1,
    tasteProfile: "Sweet White Peach, Effervescent Prosecco & Floral",
    difficulty: 1,
    popularity: 9.6,
    proTip: "Giuseppe Cipriani named it after painter Giovanni Bellini because the pink peach color reminded him of a saint's toga in a Bellini painting.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "White Peach Puree (or Hoffmann Peach Liqueur)", substitute: "Hoffmann Peach Liqueur + splash peach juice", inventoryId: "hoffmann-peach", ingredientGroup: "peach-liqueur" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Prosecco", substitute: "Any dry sparkling wine or Champagne", inventoryId: "gio-prosecco", ingredientGroup: "prosecco" }
    ],
    instructions: [
      "Chill a champagne flute.",
      "Add peach puree (or Hoffmann peach liqueur) to the flute.",
      "Slowly pour Prosecco, tilting the glass to preserve carbonation.",
      "Stir very gently with a long spoon to incorporate.",
      "Garnish with a fresh peach slice if in season."
    ],
    tags: ["prosecco", "peach", "venice", "brunch", "sparkling", "sweet"]
  },
  {
    id: "mimosa",
    name: "Mimosa",
    otherNames: "Buck's Fizz Riff",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Champagne Flute",
    alcoholLevel: "Low (~8% ABV)",
    alcoholScore: 1,
    tasteProfile: "Bright Citrus Orange & Crisp Bubbles",
    difficulty: 1,
    popularity: 9.8,
    proTip: "Always pour Prosecco first, then orange juice! The bubbles will naturally mix with the juice without requiring a spoon that can deflate the bubbles.",
    ingredients: [
      { amountOz: "3 oz", amountMl: "90 ml", item: "Prosecco", substitute: "Dry sparkling wine / Champagne", inventoryId: "gio-prosecco", ingredientGroup: "prosecco" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Fresh Orange Juice", substitute: "Strained fresh orange juice", inventoryId: "orange-juice" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Grand Marnier (Optional Luxury Float)", substitute: "Cointreau", inventoryId: "grand-marnier", ingredientGroup: "triple-sec" }
    ],
    instructions: [
      "Hold a chilled champagne flute at a 45-degree angle.",
      "Pour in cold Prosecco first.",
      "Top gently with fresh orange juice.",
      "Optionally float a splash of Grand Marnier for a Grand Mimosa.",
      "Garnish with a strawberry or small orange wedge on the rim."
    ],
    tags: ["prosecco", "orange", "brunch", "sparkling", "effortless"]
  },
  {
    id: "kir-royale",
    name: "Kir Royale",
    otherNames: "The French Aristocrat",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Champagne Flute",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Tart Blackcurrant Berry & Effervescent Sparkling Wine",
    difficulty: 1,
    popularity: 9.5,
    proTip: "A little cassis goes a long way. Just half an ounce creates a deep ruby sparkle without burying the crisp wine acidity.",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Crème de Cassis (Blackcurrant)", substitute: "Raspberry Rhapsody syrup or Peter Heering", inventoryId: "raspberry-rhapsody", ingredientGroup: "creme-de-cassis" },
      { amountOz: "4.5 oz", amountMl: "135 ml", item: "Prosecco", substitute: "Brut Champagne or dry sparkling wine", inventoryId: "gio-prosecco", ingredientGroup: "prosecco" }
    ],
    instructions: [
      "Pour crème de cassis (or raspberry liqueur) into the bottom of a chilled champagne flute.",
      "Slowly fill with ice-cold Prosecco.",
      "The dark liqueur will swirl upward, turning the drink into a sparkling jewel.",
      "Garnish with a fresh raspberry or blackberry dropped into the glass."
    ],
    tags: ["prosecco", "champagne", "berry", "bubbly", "france", "elegant"]
  },
  {
    id: "paloma-mezcal",
    name: "Paloma Mezcal",
    otherNames: "Smoky Paloma, Oaxaca Sunrise",
    category: "Cocktail",
    baseSpirit: "Tequila/Mezcal",
    glassware: "Highball / Collins",
    alcoholLevel: "Medium (~14% ABV)",
    alcoholScore: 3,
    tasteProfile: "Woodsmoke Agave, Tart Grapefruit, Lime & Saline",
    difficulty: 1,
    popularity: 9.6,
    proTip: "If you don't have mezcal, split Teremana tequila with a drop of smoky peated Johnnie Walker Black Scotch or use smoked sea salt on the rim!",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Artisanal Mezcal (or Teremana Tequila)", substitute: "Teremana Tequila + splash of smoky Scotch", inventoryId: "teremana-tequila" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lime", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Agave Syrup", substitute: "Simple syrup", inventoryId: "agave-syrup" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Grapefruit Juice", substitute: "Pink grapefruit soda", inventoryId: "grapefruit-juice" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water" },
      { amountOz: "Rim", amountMl: "Rim", item: "Smoked Sea Salt / Chili Salt", substitute: "Kosher salt rim", inventoryId: "coarse-salt" }
    ],
    instructions: [
      "Rim a highball glass with lime and smoked chili salt.",
      "Fill with ice cubes.",
      "Add mezcal (or tequila), lime juice, and agave syrup.",
      "Add grapefruit juice and top with Chang Soda Water.",
      "Stir gently and garnish with a charred grapefruit wheel."
    ],
    tags: ["mezcal", "tequila", "smoky", "grapefruit", "mexico"]
  },
  {
    id: "whiskey-highball",
    name: "Whiskey Highball",
    otherNames: "Japanese Highball (Haibōru)",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Highball / Collins",
    alcoholLevel: "Low-Medium (~10% ABV)",
    alcoholScore: 2,
    tasteProfile: "Crisp, Effervescent, Oak & Lemon Oil",
    difficulty: 1,
    popularity: 9.6,
    proTip: "The Japanese ritual: stir the whiskey and ice 13.5 times clockwise, then pour Chang Soda Water down the spiraled handle of the bar spoon so not a single bubble is lost.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Johnnie Walker Black (or Jim Beam Black)", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jw-black-label" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Chang Soda Water (Super Chilled)", substitute: "Extra-fizzy club soda", inventoryId: "chang-soda-water" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Expressed Lemon Twist", substitute: "Lemon wheel", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Chill a tall highball glass in the freezer.",
      "Fill with large, crystal-clear ice cubes.",
      "Pour in Johnnie Walker Black Scotch and stir 13 times to chill the glass and whiskey.",
      "Add more ice if needed, then slowly tilt and pour Chang Soda Water down the glass edge.",
      "Lift the bar spoon once gently from the bottom (do not stir vigorously).",
      "Express lemon peel oils over the surface."
    ],
    tags: ["scotch", "whiskey", "highball", "japan", "effervescent", "refreshing"]
  },
  {
    id: "godfather",
    name: "The Godfather",
    otherNames: "Marlon Brando's Favorite",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Rocks / Old Fashioned",
    alcoholLevel: "High (~32% ABV)",
    alcoholScore: 5,
    tasteProfile: "Smoky Peat Scotch, Sweet Almond Marzipan & Warm",
    difficulty: 1,
    popularity: 9.5,
    proTip: "The Johnnie Walker Black Label brings peat smoke, while the Disaronno Amaretto brings rich Italian marzipan. A 2:1 ratio prevents it from becoming too sweet.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Johnnie Walker Black Label Scotch", substitute: "Jim Beam Black Bourbon or JD Bonded Rye", inventoryId: "jw-black-label" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Disaronno Originale Amaretto", substitute: "Almond liqueur", inventoryId: "disaronno-amaretto" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Orange Peel Twist", substitute: "Brandied cherry", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Fill an Old Fashioned rocks glass with ice (ideally a single large cube).",
      "Pour in Johnnie Walker Black Scotch and Disaronno amaretto.",
      "Stir gently for 20 seconds until cold.",
      "Express an orange peel over the top and tuck it into the glass."
    ],
    tags: ["scotch", "amaretto", "disaronno", "godfather", "classic", "movie"]
  },
  {
    id: "godmother",
    name: "The Godmother",
    otherNames: "Vodka Godfather",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Rocks / Old Fashioned",
    alcoholLevel: "High (~30% ABV)",
    alcoholScore: 4,
    tasteProfile: "Silky Sweet Almond, Clean Vodka & Warming",
    difficulty: 1,
    popularity: 9.2,
    proTip: "The clean neutrality of Absolut Vodka lets the luscious Italian almond, toasted apricot stone, and vanilla notes of Disaronno shine completely unhindered.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Absolut Vodka Original Blue", substitute: "Smirnoff Red Vodka", inventoryId: "absolut-blue" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Disaronno Originale Amaretto", substitute: "Almond liqueur", inventoryId: "disaronno-amaretto" }
    ],
    instructions: [
      "Fill a rocks glass with ice cubes.",
      "Add Absolut vodka and Disaronno amaretto.",
      "Stir gently for 20 seconds until chilled.",
      "Garnish with an orange twist or maraschino cherry."
    ],
    tags: ["vodka", "amaretto", "disaronno", "simple", "sweet"]
  },
  {
    id: "rusty-nail",
    name: "Rusty Nail",
    otherNames: "Rat Pack 1960s Icon",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Rocks / Old Fashioned",
    alcoholLevel: "High (~34% ABV)",
    alcoholScore: 5,
    tasteProfile: "Heather Honey, Peat Smoke, Herbal Scotch & Warmth",
    difficulty: 1,
    popularity: 9.3,
    proTip: "If you don't have Drambuie, create a home bar substitute by gently warming honey syrup with a drop of Johnnie Walker and herbal spices.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Johnnie Walker Black Label Scotch", substitute: "Any blended or single malt Scotch", inventoryId: "jw-black-label" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Drambuie (Honey Scotch Liqueur)", substitute: "Honey syrup + dash herbal amaro / Disaronno", inventoryId: "honey-syrup" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Expressed Lemon Peel Twist", substitute: "Lemon peel", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Fill a rocks glass with a large clear ice cube.",
      "Pour Johnnie Walker Black Scotch and Drambuie directly over the ice.",
      "Stir slowly for 20 seconds.",
      "Express a lemon peel twist over the drink to brighten the rich honey profile."
    ],
    tags: ["scotch", "drambuie", "honey", "rat-pack", "classic"]
  },
  {
    id: "french-95",
    name: "French 95",
    otherNames: "Bourbon French 75",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Flute / Coupe",
    alcoholLevel: "Medium-High (~20% ABV)",
    alcoholScore: 4,
    tasteProfile: "Caramel Bourbon, Tart Lemon, Effervescent Prosecco",
    difficulty: 2,
    popularity: 9.5,
    proTip: "A glorious twist on the French 75 where bourbon replaces gin. The oak and caramel notes of Jim Beam Black pair shockingly well with sparkling Prosecco.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Bourbon Whiskey", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black", ingredientGroup: "bourbon" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Demerara or sugar syrup", inventoryId: "simple-syrup", ingredientGroup: "simple-syrup" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Prosecco", substitute: "Dry Champagne or sparkling wine", inventoryId: "gio-prosecco", ingredientGroup: "prosecco" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Lemon Twist & Maraschino Cherry", substitute: "Lemon peel", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Chill a champagne flute.",
      "In a shaker with ice, shake bourbon, lemon juice, and simple syrup for 10 seconds.",
      "Strain into the flute.",
      "Top with chilled Prosecco.",
      "Garnish with a lemon peel spiral and drop in a cherry."
    ],
    tags: ["bourbon", "prosecco", "french-75", "bubbly", "celebration"]
  },
  {
    id: "blue-lagoon",
    name: "Blue Lagoon",
    otherNames: "Electric Blue Highball",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Hurricane / Highball",
    alcoholLevel: "Medium (~15% ABV)",
    alcoholScore: 3,
    tasteProfile: "Vibrant Citrus, Candied Orange, Bubbly & Sweet",
    difficulty: 1,
    popularity: 9.5,
    proTip: "Your stocked French Curaçao Bleu turns this into a visual showstopper. Mix with lemon juice and clear soda for a neon aquamarine glow.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Smirnoff Red Vodka (or Absolut Blue)", substitute: "Absolut Vodka Original Blue", inventoryId: "smirnoff-red" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Curaçao Bleu Liqueur", substitute: "Blue Curaçao", inventoryId: "curacao-bleu" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lime juice", inventoryId: "fresh-lemons" },
      { amountOz: "Top up", amountMl: "Top up", item: "Lemon-Lime Soda (or Chang Soda Water)", substitute: "Chang Soda Water for a drier finish", inventoryId: "lemon-lime-soda" }
    ],
    instructions: [
      "Fill a hurricane or highball glass with ice.",
      "Add vodka, Curaçao Bleu, and fresh lemon juice.",
      "Top with lemon-lime soda (or Chang Soda Water).",
      "Stir gently with a bar spoon to integrate the electric blue color.",
      "Garnish with a lemon wheel and a maraschino cherry."
    ],
    tags: ["vodka", "blue-curacao", "colorful", "party", "citrus", "summer"]
  },
  {
    id: "pineapple-cooler",
    name: "Pineapple Cooler",
    otherNames: "Tropical Rum Fizz",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Highball / Collins",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Juicy Pineapple, Vanilla Rum, Mint & Sparkling Ginger",
    difficulty: 1,
    popularity: 9.4,
    proTip: "Shaking pineapple juice creates a creamy natural foam head. Top with Schweppes Ginger Ale for a bubbly spicy finish.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Bacardi Superior White Rum (or Malibu)", substitute: "Malibu Coconut Rum for extra tropical punch", inventoryId: "bacardi-superior" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Pineapple Juice", substitute: "Fresh pineapple juice", inventoryId: "pineapple-juice" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lime juice", inventoryId: "fresh-limes" },
      { amountOz: "Top up", amountMl: "Top up", item: "Schweppes Ginger Ale Soda", substitute: "Chang Soda Water", inventoryId: "schweppes-ginger-ale" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Mint Sprig & Pineapple Wedge", substitute: "Lime wheel", inventoryId: "fresh-mint" }
    ],
    instructions: [
      "Add rum, pineapple juice, and lime juice to a shaker with ice.",
      "Shake vigorously for 12 seconds.",
      "Strain into a highball glass filled with ice.",
      "Top with bubbly Schweppes Ginger Ale.",
      "Garnish with a slapped mint sprig and a pineapple wedge."
    ],
    tags: ["rum", "pineapple", "ginger-ale", "summer", "refreshing"]
  },
  {
    id: "sunflower",
    name: "Sunflower",
    otherNames: "Sam Ross Modern Classic (Corpse Reviver Riff)",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 4,
    tasteProfile: "Floral Elderflower, Crisp Gin, Candied Orange & Anise",
    difficulty: 2,
    popularity: 9.6,
    proTip: "Equal parts Gin, St-Germain, Cointreau, and Lemon juice in an absinthe-rinsed glass. St-Germain's floral sweetness replaces the dry fortified wine.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "St-Germain Elderflower Liqueur", substitute: "Elderflower cordial", inventoryId: "st-germain" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Cointreau", substitute: "Grand Marnier or Lumina Triple Sec", inventoryId: "cointreau" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "1 dash", amountMl: "1 dash", item: "Absinthe (Rinse)", substitute: "White Sambuca rinse", inventoryId: "sambuca" }
    ],
    instructions: [
      "Rinse a chilled coupe glass with a dash of absinthe and discard the excess.",
      "Add Tanqueray gin, St-Germain, Cointreau, and fresh lemon juice to a cocktail shaker filled with ice.",
      "Shake vigorously for 12 seconds.",
      "Fine strain into the absinthe-scented coupe.",
      "Garnish with an edible yellow flower or expressed lemon peel."
    ],
    tags: ["gin", "st-germain", "cointreau", "absinthe", "floral", "modern-classic"]
  },

  // =========================================================================
  // SHOTS (61 - 80+)
  // =========================================================================
  {
    id: "b-52",
    name: "B-52 Layered Shot",
    otherNames: "The Stratosphere Shot",
    category: "Shot",
    baseSpirit: "Liqueur/Wine",
    glassware: "Shot Glass",
    alcoholLevel: "Medium-High (~26% ABV)",
    alcoholScore: 4,
    tasteProfile: "Rich Coffee, Creamy Caramel & Bitter Orange",
    difficulty: 3,
    popularity: 9.9,
    proTip: "Layer order is governed by density: 1. Kahlúa (heaviest), 2. Baileys (middle), 3. Grand Marnier (lightest). Pour slowly over the back of a warm spoon!",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Kahlúa Coffee Liqueur", substitute: "Walcher Premium Coffee Liqueur", inventoryId: "kahlua" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Baileys Irish Cream", substitute: "Disaronno Amaretto + touch of heavy cream", inventoryId: "baileys-irish-cream" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Grand Marnier (or Cointreau)", substitute: "Cointreau", inventoryId: "grand-marnier" }
    ],
    instructions: [
      "Pour Kahlúa directly into the base of a clear shot glass.",
      "Place a bar spoon upside down with the tip touching the inside wall just above the Kahlúa.",
      "Slowly drizzle Baileys Irish Cream over the spoon back to form the middle white stratum.",
      "Raise the spoon slightly and slowly drizzle Grand Marnier to create the top amber stratum.",
      "Drink in one swift gulp to taste all three distinct layers."
    ],
    tags: ["shot", "layered", "b-52", "kahlua", "grand-marnier", "baileys", "legendary"]
  },
  {
    id: "b-53",
    name: "B-53 Shot",
    otherNames: "B-52 Sambuca / Vodka Variant",
    category: "Shot",
    baseSpirit: "Liqueur/Wine",
    glassware: "Shot Glass",
    alcoholLevel: "High (~30% ABV)",
    alcoholScore: 4,
    tasteProfile: "Coffee, Sweet Cream, Anise & Spirit",
    difficulty: 3,
    popularity: 9.3,
    proTip: "Replacing the orange liqueur with White Sambuca (or Vodka) gives this layered shot an intense aromatic punch.",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Coffee Liqueur", substitute: "Walcher Premium Coffee Liqueur", inventoryId: "kahlua", ingredientGroup: "coffee-liqueur" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Irish Cream", substitute: "Disaronno Amaretto + cream", inventoryId: "baileys-irish-cream", ingredientGroup: "irish-cream" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "White Sambuca", substitute: "Vodka", inventoryId: "sambuca", ingredientGroup: "sambuca" }
    ],
    instructions: [
      "Pour coffee liqueur into the bottom of a shot glass.",
      "Gently layer Irish cream over the back of a bar spoon.",
      "Slowly layer White Sambuca (or vodka) as the clear top tier.",
      "Shoot immediately."
    ],
    tags: ["shot", "layered", "kahlua", "sambuca"]
  },
  {
    id: "b-54",
    name: "B-54 Shot",
    otherNames: "B-52 Amaretto Variant",
    category: "Shot",
    baseSpirit: "Liqueur/Wine",
    glassware: "Shot Glass",
    alcoholLevel: "Medium-High (~26% ABV)",
    alcoholScore: 4,
    tasteProfile: "Coffee, Creamy Marzipan, Almond & Orange",
    difficulty: 3,
    popularity: 9.4,
    proTip: "Your stocked Disaronno Amaretto is the star here! Layered between Kahlúa and Grand Marnier, it tastes like Italian tiramisu.",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Kahlúa Coffee Liqueur", substitute: "Walcher Premium Coffee Liqueur", inventoryId: "kahlua" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Disaronno Originale Amaretto", substitute: "Almond liqueur", inventoryId: "disaronno-amaretto" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Grand Marnier (or Cointreau)", substitute: "Cointreau", inventoryId: "grand-marnier" }
    ],
    instructions: [
      "Pour Kahlúa into the base of the shot glass.",
      "Float Disaronno Amaretto carefully over a spoon.",
      "Float Grand Marnier as the top layer.",
      "Enjoy the complex almond-orange coffee harmony."
    ],
    tags: ["shot", "layered", "amaretto", "disaronno", "kahlua"]
  },
  {
    id: "kamikaze",
    name: "Kamikaze Shot",
    otherNames: "The Dive Bar Classic",
    category: "Shot",
    baseSpirit: "Vodka",
    glassware: "Shot Glass",
    alcoholLevel: "Medium-High (~25% ABV)",
    alcoholScore: 4,
    tasteProfile: "Sharp Citrus, Sweet Orange & Crisp Vodka",
    difficulty: 1,
    popularity: 9.7,
    proTip: "Shake hard with plenty of ice before straining into shots. It should be icy, frosted, and smooth going down.",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Smirnoff Red Vodka (or Absolut Blue)", substitute: "Absolut Vodka Original Blue", inventoryId: "smirnoff-red" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Lumina Triple Sec (or Cointreau)", substitute: "Cointreau", inventoryId: "lumina-triple-sec" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh pressed lime", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Add vodka, Triple Sec, and fresh lime juice into a shaker filled with ice.",
      "Shake with high energy for 10 seconds.",
      "Strain into a standard shot glass.",
      "Serve with a lime wedge on the side."
    ],
    tags: ["shot", "vodka", "citrus", "party", "quick"]
  },
  {
    id: "duck-fart",
    name: "Duck Fart Shot",
    otherNames: "Alaska's Official State Shot",
    category: "Shot",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Shot Glass",
    alcoholLevel: "Medium-High (~28% ABV)",
    alcoholScore: 4,
    tasteProfile: "Rich Coffee, Creamy Caramel & Warming Whiskey",
    difficulty: 3,
    popularity: 9.5,
    proTip: "Originated in Homer, Alaska. Layered in three strata: Kahlúa on the bottom, Baileys in the middle, and Crown Royal / Bourbon on top.",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Kahlúa Coffee Liqueur", substitute: "Walcher Premium Coffee Liqueur", inventoryId: "kahlua" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Baileys Irish Cream", substitute: "Disaronno + splash heavy cream", inventoryId: "baileys-irish-cream" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Jim Beam Black Bourbon (or JD Rye)", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" }
    ],
    instructions: [
      "Pour Kahlúa into the bottom of the shot glass.",
      "Float Baileys Irish Cream gently over the back of a bar spoon.",
      "Float Jim Beam Black bourbon on top as the final whiskey layer.",
      "Shoot all at once."
    ],
    tags: ["shot", "layered", "bourbon", "kahlua", "alaska"]
  },
  {
    id: "lemon-drop-shot",
    name: "Lemon Drop Shot",
    otherNames: "Sweet & Sour Shooter",
    category: "Shot",
    baseSpirit: "Vodka",
    glassware: "Shot Glass",
    alcoholLevel: "Medium (~20% ABV)",
    alcoholScore: 3,
    tasteProfile: "Sweet-Tart Lemon, Sugar Rim & Crisp Vodka",
    difficulty: 1,
    popularity: 9.8,
    proTip: "Rim the shot glass with sugar and prepare a sugar-coated lemon wedge. Take the chilled shot, then immediately bite into the sugared lemon!",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Absolut Vodka Original Blue", substitute: "Smirnoff Red Vodka", inventoryId: "absolut-blue" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Lumina Triple Sec (or Cointreau)", substitute: "Cointreau", inventoryId: "lumina-triple-sec" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Simple Syrup", substitute: "Granulated sugar", inventoryId: "simple-syrup" },
      { amountOz: "Rim", amountMl: "Rim", item: "Granulated Sugar & Lemon Wedge", substitute: "Sugar rim", inventoryId: "granulated-sugar" }
    ],
    instructions: [
      "Dip the rim of a shot glass in lemon juice, then in granulated sugar.",
      "Shake vodka, Triple Sec, lemon juice, and simple syrup with ice for 10 seconds.",
      "Strain into the sugared shot glass.",
      "Serve alongside a lemon wedge sprinkled with sugar."
    ],
    tags: ["shot", "lemon", "sugar-rim", "party", "sour"]
  },
  {
    id: "jagerbomb",
    name: "Jägerbomb",
    otherNames: "The Drop Shot",
    category: "Shot",
    baseSpirit: "Liqueur/Wine",
    glassware: "Rocks Glass + Shot Glass",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Herbal Botanicals, Sweet Energy Soda & Electric Buzz",
    difficulty: 1,
    popularity: 9.8,
    proTip: "Pour half a can of Red Bull into a rocks glass. Fill a shot glass with ice-cold Jägermeister. Drop the entire shot glass into the rocks glass and chug!",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Jägermeister Herbal Liqueur", substitute: "Any complex herbal amaro", inventoryId: "jagermeister" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Red Bull / Energy Drink", substitute: "Any chilled energy drink", inventoryId: "energy-drink" }
    ],
    instructions: [
      "Fill a lowball or rocks glass halfway with cold Red Bull.",
      "Fill a shot glass to the brim with chilled Jägermeister.",
      "Carefully balance or drop the shot glass directly into the energy drink.",
      "Chug immediately in one continuous draught."
    ],
    tags: ["shot", "jager", "energy", "party", "drop-shot"]
  },
  {
    id: "washington-apple-shot",
    name: "Washington Apple Shot",
    otherNames: "Orchard Crisp Shooter",
    category: "Shot",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Shot Glass",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Crisp Apple, Tart Cranberry & Smooth Whiskey",
    difficulty: 1,
    popularity: 9.6,
    proTip: "Equal parts Whiskey, Sour Apple (or Peach) liqueur, and Cranberry juice shaken over ice until frost coats the shaker.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Jim Beam Black Bourbon (or JD Rye)", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Sour Apple Liqueur (or Hoffmann Peach)", substitute: "Hoffmann Peach Liqueur", inventoryId: "hoffmann-peach" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Cranberry Juice", substitute: "Tart cranberry juice", inventoryId: "cranberry-juice" }
    ],
    instructions: [
      "Combine whiskey, apple/peach liqueur, and cranberry juice in a cocktail shaker with ice.",
      "Shake vigorously for 10 seconds.",
      "Strain into a tall shot glass.",
      "Garnish with a thin apple slice on the rim."
    ],
    tags: ["shot", "whiskey", "apple", "cranberry", "fruity"]
  },
  {
    id: "green-tea-shot",
    name: "Green Tea Shot",
    otherNames: "Jameson Green Tea",
    category: "Shot",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Shot Glass",
    alcoholLevel: "Medium (~16% ABV)",
    alcoholScore: 3,
    tasteProfile: "Sweet Peach, Zesty Citrus, Fizz & Zero Bitterness",
    difficulty: 1,
    popularity: 9.9,
    proTip: "Despite the name, there is zero tea in this shot! It looks luminous green-yellow like green tea and goes down remarkably smooth.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Irish Whiskey (or Jim Beam Black)", substitute: "Jim Beam Black Aged Bourbon", inventoryId: "jim-beam-black" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Hoffmann Peach Liqueur", substitute: "Peach schnapps", inventoryId: "hoffmann-peach" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Sweet & Sour Mix (or Lemon+Simple)", substitute: "Equal parts lemon juice and simple syrup", inventoryId: "fresh-lemons" },
      { amountOz: "Splash", amountMl: "Splash", item: "Lemon-Lime Soda (Sprite)", substitute: "Chang Soda Water", inventoryId: "lemon-lime-soda" }
    ],
    instructions: [
      "In a shaker filled with ice, combine whiskey, Hoffmann peach liqueur, and sour mix.",
      "Shake hard for 10 seconds.",
      "Strain into shot glasses.",
      "Top with a tiny splash of Sprite or soda for effervescence.",
      "Down it in one go."
    ],
    tags: ["shot", "peach", "whiskey", "party", "crowd-pleaser"]
  },
  {
    id: "mind-eraser",
    name: "Mind Eraser Shot",
    otherNames: "The Chugger",
    category: "Shot",
    baseSpirit: "Vodka",
    glassware: "Rocks / Double Shot",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Effervescent Soda, Clean Vodka & Sweet Coffee",
    difficulty: 2,
    popularity: 9.5,
    proTip: "Drink through a straw placed at the very bottom of the glass! You drink the Kahlúa first, then vodka, and finish with bubbly soda to erase the burn.",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Kahlúa Coffee Liqueur", substitute: "Walcher Premium Coffee Liqueur", inventoryId: "kahlua" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Smirnoff Red Vodka (or Absolut Blue)", substitute: "Absolut Vodka Original Blue", inventoryId: "smirnoff-red" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Chang Soda Water (or Lemon-Lime Soda)", substitute: "Club soda", inventoryId: "chang-soda-water" }
    ],
    instructions: [
      "Fill a rocks or double-shot glass with crushed ice.",
      "Pour Kahlúa directly onto the bottom.",
      "Float vodka over the back of a spoon.",
      "Top with Chang Soda Water.",
      "Insert a straw to the bottom and drink as fast as possible in one pull."
    ],
    tags: ["shot", "kahlua", "vodka", "straw", "party"]
  },
  {
    id: "red-snapper-shot",
    name: "Red Snapper Shot",
    otherNames: "Crown Red Snapper",
    category: "Shot",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Shot Glass",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Smooth Whiskey, Almond Sweetness & Tart Cranberry",
    difficulty: 1,
    popularity: 9.4,
    proTip: "Whiskey, Disaronno Amaretto, and Cranberry Juice shaken with ice. The amaretto smooths the whiskey bite completely.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Jim Beam Black Bourbon (or JD Rye)", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Disaronno Originale Amaretto", substitute: "Almond liqueur", inventoryId: "disaronno-amaretto" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Cranberry Juice", substitute: "Tart cranberry juice", inventoryId: "cranberry-juice" }
    ],
    instructions: [
      "Combine bourbon, Disaronno amaretto, and cranberry juice in a cocktail shaker filled with ice.",
      "Shake vigorously for 10 seconds.",
      "Strain into shot glasses and serve immediately."
    ],
    tags: ["shot", "bourbon", "amaretto", "cranberry", "smooth"]
  },
  {
    id: "pornstar-shot",
    name: "Pornstar Shot",
    otherNames: "Passion Fruit Shooter",
    category: "Shot",
    baseSpirit: "Vodka",
    glassware: "Shot Glass + Flute Chaser",
    alcoholLevel: "Medium (~16% ABV)",
    alcoholScore: 3,
    tasteProfile: "Passion Fruit, Vanilla, Tangy & Sparkling Prosecco",
    difficulty: 2,
    popularity: 9.8,
    proTip: "Serve alongside a tiny shot of cold Prosecco! Take the tropical fruity shot first, then chase with effervescent Prosecco.",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Vodka", substitute: "Vanilla or wheat vodka", inventoryId: "absolut-blue", ingredientGroup: "vodka" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Passion Fruit Puree (or Peach Liqueur)", substitute: "Hoffmann Peach Liqueur", inventoryId: "hoffmann-peach", ingredientGroup: "peach-liqueur" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lime", inventoryId: "fresh-limes" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Simple Syrup (or Vanilla syrup)", substitute: "Sugar syrup", inventoryId: "simple-syrup", ingredientGroup: "simple-syrup" },
      { amountOz: "1 oz Chaser", amountMl: "30 ml Chaser", item: "Prosecco", substitute: "Chilled dry sparkling wine or Champagne", inventoryId: "gio-prosecco", ingredientGroup: "prosecco" }
    ],
    instructions: [
      "Shake vodka, passion fruit (or peach), lime juice, and syrup with ice for 10 seconds.",
      "Strain into a shooter glass.",
      "Pour 1 oz of cold Prosecco into a side shot or mini flute.",
      "Shoot the fruity vodka shooter, followed immediately by the bubbly Prosecco."
    ],
    tags: ["shot", "prosecco", "party", "modern", "chaser"]
  },
  {
    id: "flatliner",
    name: "Flatliner Shot",
    otherNames: "The Fiery Heartbeat",
    category: "Shot",
    baseSpirit: "Tequila/Mezcal",
    glassware: "Shot Glass",
    alcoholLevel: "High (~34% ABV)",
    alcoholScore: 5,
    tasteProfile: "Sweet Anise, Blazing Hot Tabasco & Raw Agave Heat",
    difficulty: 3,
    popularity: 9.1,
    proTip: "The Tabasco drops must stay suspended between the sweet Sambuca on the bottom and the fiery Tequila on top like an EKG line on a heart monitor.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "White Sambuca", substitute: "Disaronno Amaretto (for a sweeter base)", inventoryId: "sambuca", ingredientGroup: "sambuca" },
      { amountOz: "5-6 drops", amountMl: "5-6 drops", item: "Tabasco Hot Sauce", substitute: "Spicy hot sauce", inventoryId: "tabasco-sauce" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Tequila", substitute: "100% agave tequila", inventoryId: "teremana-tequila", ingredientGroup: "tequila" }
    ],
    instructions: [
      "Pour White Sambuca into the bottom of a shot glass.",
      "Gently drop 5 to 6 dashes of red Tabasco hot sauce across the surface so it forms a crimson suspended middle barrier.",
      "Carefully float tequila on top using the back of a bar spoon.",
      "Gulp down in one shot and brace for the sweet-to-fiery rollercoaster."
    ],
    tags: ["shot", "spicy", "tabasco", "tequila", "dare", "potent"]
  },
  {
    id: "blowjob-shot",
    name: "Blowjob Shot",
    otherNames: "Hands-Free Bar Trick",
    category: "Shot",
    baseSpirit: "Liqueur/Wine",
    glassware: "Shot Glass",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Rich Coffee, Creamy Almond Marzipan & Fluffy Cream",
    difficulty: 2,
    popularity: 9.8,
    proTip: "Bar tradition dictates you must take this shot without using your hands! Put your hands behind your back, pick up the shot glass with your mouth, tilt back, and swallow.",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Kahlúa Coffee Liqueur", substitute: "Walcher Premium Coffee Liqueur", inventoryId: "kahlua" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Baileys Irish Cream (or Disaronno)", substitute: "Disaronno Originale Amaretto", inventoryId: "disaronno-amaretto" },
      { amountOz: "Crown", amountMl: "Crown", item: "Whipped Cream (Aerosol)", substitute: "Fresh whipped cream", inventoryId: "whipped-cream" }
    ],
    instructions: [
      "Pour Kahlúa into the bottom of the shot glass.",
      "Layer Baileys Irish Cream (or Disaronno) over the back of a bar spoon.",
      "Top with a generous, fluffy dome of whipped cream.",
      "Place on the bar, clasp hands behind your back, and lift the glass with only your mouth and teeth."
    ],
    tags: ["shot", "kahlua", "whipped-cream", "party", "hands-free", "sweet"]
  },
  {
    id: "woo-woo-shot",
    name: "Woo Woo Shot",
    otherNames: "The 80s Disco Shooter",
    category: "Shot",
    baseSpirit: "Vodka",
    glassware: "Shot Glass",
    alcoholLevel: "Medium (~16% ABV)",
    alcoholScore: 3,
    tasteProfile: "Sweet Peach, Tart Cranberry & Clean Vodka",
    difficulty: 1,
    popularity: 9.6,
    proTip: "Equal parts Vodka, Hoffmann Peach Liqueur, and Cranberry Juice. Shaken until frosty cold, it goes down like liquid fruit candy.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Smirnoff Red Vodka (or Absolut Blue)", substitute: "Absolut Vodka Original Blue", inventoryId: "smirnoff-red" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Hoffmann Peach Liqueur", substitute: "Peach schnapps", inventoryId: "hoffmann-peach" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Cranberry Juice", substitute: "Tart cranberry juice", inventoryId: "cranberry-juice" }
    ],
    instructions: [
      "Add vodka, Hoffmann peach liqueur, and cranberry juice into a cocktail shaker with ice.",
      "Shake with vigor for 10 seconds.",
      "Strain into shot glasses.",
      "Down in one celebratory gulp."
    ],
    tags: ["shot", "vodka", "peach", "cranberry", "sweet", "party"]
  },
  {
    id: "alabama-slammer-shot",
    name: "Alabama Slammer Shot",
    otherNames: "Crimson Tide Shooter",
    category: "Shot",
    baseSpirit: "Liqueur/Wine",
    glassware: "Shot Glass",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Sweet Almond, Tangy Citrus, Whiskey & Herb",
    difficulty: 1,
    popularity: 9.5,
    proTip: "Disaronno Amaretto + Bourbon + Lemon/Orange juice creates a smooth, crimson collegiate classic.",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Disaronno Originale Amaretto", substitute: "Almond liqueur", inventoryId: "disaronno-amaretto" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Jim Beam Black Bourbon (or Southern Comfort)", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Tanqueray London Dry Gin (or Sloe Gin)", substitute: "Any dry gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Orange Juice", substitute: "Fresh orange juice", inventoryId: "orange-juice" }
    ],
    instructions: [
      "Combine Disaronno, bourbon, gin, and orange juice in a shaker with ice.",
      "Shake for 10 seconds until ice cold.",
      "Strain into a tall shooter glass."
    ],
    tags: ["shot", "amaretto", "bourbon", "gin", "party"]
  },
  {
    id: "surfer-on-acid",
    name: "Surfer on Acid",
    otherNames: "Eric Tecosky 1990s Classic",
    category: "Shot",
    baseSpirit: "Liqueur/Wine",
    glassware: "Shot Glass / Rocks",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Herbal Botanicals, Sweet Coconut & Frothy Pineapple",
    difficulty: 1,
    popularity: 9.6,
    proTip: "Equal parts Jägermeister, Malibu Coconut Rum, and Pineapple Juice. The sweet coconut and pineapple tame the bitter herbs of Jäger into an addictive tropical shooter.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Jägermeister Herbal Liqueur", substitute: "Any herbal amaro (Campari riff)", inventoryId: "jagermeister" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Malibu Coconut Rum Liqueur", substitute: "Coconut rum", inventoryId: "malibu-rum" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Pineapple Juice", substitute: "Fresh pineapple juice", inventoryId: "pineapple-juice" }
    ],
    instructions: [
      "Add Jägermeister, Malibu, and pineapple juice into a shaker filled with ice.",
      "Shake with energy for 12 seconds to froth the pineapple.",
      "Strain into a shot glass (or over ice in a rocks glass).",
      "Enjoy the unexpected tropical-herbal perfection."
    ],
    tags: ["shot", "jagermeister", "malibu", "pineapple", "tropical"]
  },
  {
    id: "slippery-nipple",
    name: "Slippery Nipple Shot",
    otherNames: "Sambuca & Irish Cream Shooter",
    category: "Shot",
    baseSpirit: "Liqueur/Wine",
    glassware: "Shot Glass",
    alcoholLevel: "Medium-High (~25% ABV)",
    alcoholScore: 4,
    tasteProfile: "Sweet Black Anise, Creamy Vanilla & Grenadine Center",
    difficulty: 3,
    popularity: 9.3,
    proTip: "Pour White Sambuca on bottom, float Baileys in middle, then drop a single drop of red Grenadine in the center. The heavy grenadine sinks to create the namesake look.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "White Sambuca", substitute: "Disaronno Originale Amaretto", inventoryId: "sambuca", ingredientGroup: "sambuca" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Irish Cream", substitute: "Heavy cream + touch of whiskey", inventoryId: "baileys-irish-cream", ingredientGroup: "irish-cream" },
      { amountOz: "1 drop", amountMl: "1 drop", item: "Pomegranate Grenadine", substitute: "Raspberry Rhapsody syrup", inventoryId: "pomegranate-grenadine" }
    ],
    instructions: [
      "Pour White Sambuca into the shot glass.",
      "Float Irish cream gently over the back of a bar spoon.",
      "Using a dropper or straw, carefully drop one drop of red Grenadine into the dead center of the cream; it sinks through to the bottom.",
      "Shoot immediately."
    ],
    tags: ["shot", "layered", "sambuca", "baileys", "sweet", "novelty"]
  },
  {
    id: "nutty-irishman-shot",
    name: "Nutty Irishman Shot",
    otherNames: "Baileys & Frangelico Duo",
    category: "Shot",
    baseSpirit: "Liqueur/Wine",
    glassware: "Shot Glass",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Toasted Hazelnut, Sweet Almond & Rich Irish Cream",
    difficulty: 1,
    popularity: 9.6,
    proTip: "Equal parts Baileys Irish Cream and Frangelico (or Disaronno Amaretto). Tastes exactly like hazelnut praline melted in sweet dairy cream.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Baileys Irish Cream", substitute: "Heavy cream + splash of whiskey", inventoryId: "baileys-irish-cream" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Frangelico Hazelnut Liqueur (or Disaronno Amaretto)", substitute: "Disaronno Originale Amaretto", inventoryId: "frangelico" }
    ],
    instructions: [
      "Combine Baileys Irish Cream and Disaronno (or Frangelico) in a shaker with ice.",
      "Shake for 8 seconds until chilled.",
      "Strain into a shot glass.",
      "Optionally dust with freshly grated nutmeg."
    ],
    tags: ["shot", "amaretto", "baileys", "cream", "dessert", "nutty"]
  },
  {
    id: "tequila-rose-shot",
    name: "Tequila Rose Shot",
    otherNames: "Strawberry Silk Shot",
    category: "Shot",
    baseSpirit: "Liqueur/Wine",
    glassware: "Shot Glass",
    alcoholLevel: "Low-Medium (~15% ABV)",
    alcoholScore: 2,
    tasteProfile: "Luscious Strawberry Cream & Gentle Tequila Warmth",
    difficulty: 1,
    popularity: 9.5,
    proTip: "Keep the bottle in the freezer! Tequila Rose must be served ice-cold to enjoy its velvety strawberry milkshake texture.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Tequila Rose Liqueur", substitute: "Teremana Tequila (0.5 oz) + Strawberry Cream / Baileys (1 oz)", inventoryId: "tequila-rose" }
    ],
    instructions: [
      "Pour chilled Tequila Rose directly into a shot glass from the freezer.",
      "Optionally dip the rim in pink sugar or garnish with a fresh strawberry slice.",
      "Drink ice cold."
    ],
    tags: ["shot", "strawberry", "cream", "tequila", "sweet"]
  },
  {
    id: "mexican-firing-squad-shot",
    name: "Mexican Firing Squad Shot",
    otherNames: "Gentleman's Companion 1937",
    category: "Shot",
    baseSpirit: "Tequila/Mezcal",
    glassware: "Shot Glass",
    alcoholLevel: "Medium-High (~24% ABV)",
    alcoholScore: 4,
    tasteProfile: "Agave Pepper, Tart Lime, Rich Grenadine & Angostura Bitters",
    difficulty: 1,
    popularity: 9.5,
    proTip: "A historic 1930s cocktail transformed into a potent shooter. Teremana tequila, fresh lime, pomegranate grenadine, and aromatic bitters.",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Teremana Tequila", substitute: "100% blue agave blanco tequila", inventoryId: "teremana-tequila" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lime juice", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Pomegranate Grenadine", substitute: "Raspberry Rhapsody syrup", inventoryId: "pomegranate-grenadine" },
      { amountOz: "2 dashes", amountMl: "2 dashes", item: "Angostura Bitters", substitute: "Aromatic bitters", inventoryId: "angostura-bitters" }
    ],
    instructions: [
      "Add Teremana tequila, lime juice, grenadine, and Angostura bitters into a shaker filled with ice.",
      "Shake with high energy for 10 seconds.",
      "Strain into a shooter glass.",
      "Down in one swift gulp."
    ],
    tags: ["shot", "tequila", "grenadine", "lime", "angostura", "historic"]
  },
  {
    id: "scooby-snack",
    name: "Scooby Snack Shot",
    otherNames: "The Neon Green Shooter",
    category: "Shot",
    baseSpirit: "Liqueur/Wine",
    glassware: "Shot Glass",
    alcoholLevel: "Medium (~16% ABV)",
    alcoholScore: 3,
    tasteProfile: "Melon Honeydew, Coconut Rum, Pineapple & Cream",
    difficulty: 1,
    popularity: 9.7,
    proTip: "Melon liqueur + Malibu Coconut Rum + Pineapple Juice + splash of heavy cream. Shaken until frosty, it tastes like melon candy ice cream.",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Midori Melon Liqueur", substitute: "Curaçao Bleu + orange juice (green color riff)", inventoryId: "midori" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Malibu Coconut Rum Liqueur", substitute: "Coconut rum", inventoryId: "malibu-rum" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Pineapple Juice", substitute: "Fresh pineapple juice", inventoryId: "pineapple-juice" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Heavy Whipping Cream", substitute: "Half-and-half or Baileys", inventoryId: "whipping-heavy-cream" }
    ],
    instructions: [
      "Combine melon liqueur, Malibu, pineapple juice, and heavy cream in a cocktail shaker with ice.",
      "Shake vigorously for 12 seconds.",
      "Strain into a shot glass and enjoy the pastel green goodness."
    ],
    tags: ["shot", "melon", "malibu", "cream", "pineapple", "fun"]
  },
  {
    id: "fireball-apple-pie-shot",
    name: "Fireball Apple Pie Shot",
    otherNames: "Baked Apple Pie Shooter",
    category: "Shot",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Shot Glass",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Warm Cinnamon Spice, Crisp Apple Cider & Sweet Crust",
    difficulty: 1,
    popularity: 9.8,
    proTip: "Rim the shot glass with cinnamon and brown sugar. When Fireball cinnamon whisky is shaken with apple cider, it genuinely tastes like hot homemade apple pie.",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fireball Cinnamon Whisky (or JD Rye + pinch cinnamon)", substitute: "Jack Daniel's Bonded Rye + pinch cinnamon syrup", inventoryId: "fireball" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Apple Juice / Sweet Apple Cider", substitute: "Fresh cloudy apple cider", inventoryId: "apple-juice" },
      { amountOz: "Rim", amountMl: "Rim", item: "Cinnamon Sugar Rim", substitute: "Brown sugar rim", inventoryId: "granulated-sugar" }
    ],
    instructions: [
      "Dip the rim of the shot glass in apple juice, then coat with cinnamon sugar.",
      "Shake Fireball cinnamon whisky and apple juice with ice for 10 seconds.",
      "Strain into the rimmed shot glass.",
      "Shoot and savor the warm holiday bakery flavor."
    ],
    tags: ["shot", "fireball", "cinnamon", "apple", "autumn", "comfort"]
  },

  // =========================================================================
  // CASA BLANCA FEATURED COCKTAIL
  // =========================================================================
  {
    id: "casa-blanca-1945",
    name: "Casa Blanca (1945 Classic)",
    otherNames: "Casa Blanca Rum Cocktail, Casablanca",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Coupe / Martini",
    alcoholLevel: "Medium-High (~24% ABV)",
    alcoholScore: 4,
    tasteProfile: "Citrus, Maraschino Cherry, Orange & Aged Rum",
    difficulty: 2,
    popularity: 9.1,
    proTip: "Mount Gay Black Barrel gives this mid-century rum cocktail a richer Barbados character. Keep the lime fresh and the maraschino dry to preserve its balance.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Mount Gay Barbados Rum Black Barrel Double Cask Blend", substitute: "Bacardi Superior White Rum for a lighter classic style", inventoryId: "mount-gay-black-barrel" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Luxardo Maraschino Liqueur", substitute: "Peter Heering Cherry Liqueur, sweeter and fruitier", inventoryId: "maraschino-liqueur" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Cointreau", substitute: "Grand Marnier or Lumina Triple Sec", inventoryId: "cointreau" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-limes" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Maraschino Cherry & Orange Twist", substitute: "Orange peel", inventoryId: "maraschino-cherries" }
    ],
    instructions: [
      "Chill a coupe or martini glass.",
      "Shake Mount Gay rum, maraschino liqueur, Cointreau, and fresh lime juice with ice.",
      "Double strain into the chilled glass.",
      "Garnish with a maraschino cherry and expressed orange twist."
    ],
    tags: ["rum", "mount-gay", "casa-blanca", "casablanca", "1945", "maraschino", "classic"]
  },

  // =========================================================================
  // FRANGELICO FEATURED COCKTAILS
  // =========================================================================
  {
    id: "nutty-irishman",
    name: "Nutty Irishman",
    otherNames: "Frangelico Irish Cream Cocktail",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Rocks / Lowball",
    alcoholLevel: "Medium (~14% ABV)",
    alcoholScore: 3,
    tasteProfile: "Hazelnut, Irish Cream, Coffee & Vanilla",
    difficulty: 1,
    popularity: 9.2,
    proTip: "Serve it over one large cube for a short after-dinner drink, or warm the cream gently for a dessert-style winter version.",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Frangelico Hazelnut Liqueur", substitute: "Disaronno Amaretto", inventoryId: "frangelico" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Baileys Irish Cream", substitute: "Heavy cream plus simple syrup", inventoryId: "baileys-irish-cream" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Espresso", substitute: "Strong cold brew concentrate", inventoryId: "fresh-espresso" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Coffee Beans & Grated Nutmeg", substitute: "Cocoa powder", inventoryId: "coffee-beans" }
    ],
    instructions: [
      "Add Frangelico, Baileys, and fresh espresso to a shaker with ice.",
      "Shake briefly until chilled and silky.",
      "Strain over one large cube in a rocks glass.",
      "Garnish with coffee beans and a light grate of nutmeg."
    ],
    tags: ["frangelico", "hazelnut", "irish-cream", "coffee", "dessert", "after-dinner"]
  },
  {
    id: "frangelico-espresso-martini",
    name: "Frangelico Espresso Martini",
    otherNames: "Hazelnut Espresso Martini",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Coupe / Martini",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 4,
    tasteProfile: "Espresso, Toasted Hazelnut, Vanilla & Cocoa",
    difficulty: 2,
    popularity: 9.4,
    proTip: "Shake hard with fresh espresso to build the signature crema. Frangelico adds hazelnut depth without needing extra syrup.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Absolut Vodka Original Blue", substitute: "Smirnoff Red Vodka", inventoryId: "absolut-blue" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Frangelico Hazelnut Liqueur", substitute: "Disaronno Amaretto", inventoryId: "frangelico" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Espresso", substitute: "Strong cold brew concentrate", inventoryId: "fresh-espresso" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Kahlúa Coffee Liqueur", substitute: "Walcher Premium Coffee Liqueur", inventoryId: "kahlua" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Three Coffee Beans", substitute: "Cocoa powder dusting", inventoryId: "coffee-beans" }
    ],
    instructions: [
      "Add vodka, Frangelico, fresh espresso, and Kahlúa to a shaker with ice.",
      "Shake hard for 12 to 15 seconds to create a thick crema.",
      "Double strain into a chilled coupe or martini glass.",
      "Float three coffee beans on the crema."
    ],
    tags: ["frangelico", "hazelnut", "espresso-martini", "vodka", "coffee"]
  },
  {
    id: "frangelico-brandy-alexander",
    name: "Frangelico Brandy Alexander",
    otherNames: "Hazelnut Alexander",
    category: "Cocktail",
    baseSpirit: "Brandy",
    glassware: "Coupe",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Hazelnut, Brandy, Chocolate & Cream",
    difficulty: 1,
    popularity: 9.0,
    proTip: "The classic Alexander is built from equal parts spirit, cacao, and cream; Frangelico replaces the cacao liqueur for a toasted hazelnut finish.",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Otard XO Gold Cognac", substitute: "Hennessy VSOP Cognac", inventoryId: "otard-xo-gold-cognac" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Frangelico Hazelnut Liqueur", substitute: "Disaronno Amaretto", inventoryId: "frangelico" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Heavy Whipping Cream", substitute: "Baileys Irish Cream for a sweeter variation", inventoryId: "whipping-heavy-cream" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Freshly Grated Nutmeg", substitute: "Cocoa powder", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Add cognac, Frangelico, and heavy cream to a shaker with ice.",
      "Shake until thoroughly chilled and lightly aerated.",
      "Double strain into a chilled coupe.",
      "Finish with freshly grated nutmeg."
    ],
    tags: ["frangelico", "hazelnut", "brandy", "cream", "dessert", "after-dinner"]
  },

  // =========================================================================
  // MOUNT GAY FEATURED COCKTAILS
  // =========================================================================
  {
    id: "mount-gay-rum-old-fashioned",
    name: "Mount Gay Rum Old Fashioned",
    otherNames: "Barbados Rum Old Fashioned",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Rocks / Old Fashioned",
    alcoholLevel: "High (~32% ABV)",
    alcoholScore: 5,
    tasteProfile: "Oak, Molasses, Citrus & Baking Spice",
    difficulty: 1,
    popularity: 9.2,
    proTip: "Black Barrel's bourbon-cask finish gives this spirit-forward build vanilla, toasted oak, and enough structure to replace whiskey in an Old Fashioned.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Mount Gay Barbados Rum Black Barrel Double Cask Blend", substitute: "Myers's Original Dark Rum", inventoryId: "mount-gay-black-barrel" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Premium Simple Syrup", substitute: "Demerara syrup or one sugar cube", inventoryId: "simple-syrup" },
      { amountOz: "2 dashes", amountMl: "2 dashes", item: "Angostura Bitters", substitute: "Aromatic bitters", inventoryId: "angostura-bitters" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Orange Peel", substitute: "Orange slice", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Add Mount Gay rum, simple syrup, and Angostura bitters to a mixing glass with ice.",
      "Stir for 20 to 30 seconds until chilled and diluted.",
      "Strain over one large cube in a chilled rocks glass.",
      "Express a fresh orange peel over the drink and place it on top."
    ],
    tags: ["rum", "mount-gay", "barbados", "old-fashioned", "spirit-forward", "in-stock"]
  },
  {
    id: "barbados-rum-punch",
    name: "Barbados Rum Punch",
    otherNames: "Mount Gay Rum Punch, One of Sour Two of Sweet",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Highball / Collins",
    alcoholLevel: "Medium (~16% ABV)",
    alcoholScore: 3,
    tasteProfile: "Citrus, Tropical Fruit, Grenadine & Aged Rum",
    difficulty: 1,
    popularity: 9.3,
    proTip: "Use the classic island balance: one of sour, two of sweet, three of strong, and four of weak. Mount Gay adds a dry oak and vanilla backbone.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Mount Gay Barbados Rum Black Barrel Double Cask Blend", substitute: "Myers's Original Dark Rum", inventoryId: "mount-gay-black-barrel" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Premium Simple Syrup", substitute: "Pomegranate Grenadine", inventoryId: "simple-syrup" },
      { amountOz: "2 oz", amountMl: "60 ml", item: "Fresh Orange Juice", substitute: "Orange juice", inventoryId: "orange-juice" },
      { amountOz: "2 oz", amountMl: "60 ml", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Orange Slice & Nutmeg", substitute: "Orange wheel", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Fill a highball glass with ice.",
      "Add Mount Gay rum, fresh lime juice, simple syrup, and orange juice.",
      "Top with Chang Soda Water and stir gently.",
      "Garnish with an orange slice and a light grate of nutmeg."
    ],
    tags: ["rum", "mount-gay", "barbados", "punch", "citrus", "tropical"]
  },
  {
    id: "mount-gay-rum-sour",
    name: "Mount Gay Rum Sour",
    otherNames: "Barbados Rum Sour",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Coupe or Rocks",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 4,
    tasteProfile: "Bright Lime, Oak, Vanilla & Balanced Sweetness",
    difficulty: 2,
    popularity: 9.1,
    proTip: "A short shake keeps the aged rum at the center. Add egg white for a silky texture when you want a richer sour.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Mount Gay Barbados Rum Black Barrel Double Cask Blend", substitute: "Myers's Original Dark Rum", inventoryId: "mount-gay-black-barrel" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-limes" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Premium Simple Syrup", substitute: "Honey syrup", inventoryId: "simple-syrup" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Egg White (Optional)", substitute: "Aquafaba or omit", inventoryId: "egg-white" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Lime Wheel", substitute: "Fresh orange peel", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Add Mount Gay rum, lime juice, simple syrup, and egg white to a shaker.",
      "Dry shake without ice, then add ice and shake again until chilled.",
      "Double strain into a coupe, or strain over fresh ice in a rocks glass.",
      "Garnish with a fresh lime wheel."
    ],
    tags: ["rum", "mount-gay", "barbados", "sour", "lime", "aged-rum"]
  },

  // =========================================================================
  // MOCKTAILS (1 - 20)
  // =========================================================================
  {
    id: "virgin-mojito",
    name: "Virgin Mojito (Nojito)",
    otherNames: "Mint Lime Cooler",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball / Collins",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Fresh Mint, Tart Lime, Sweet Cane & Sparkling Fizz",
    difficulty: 1,
    popularity: 9.9,
    proTip: "Use crushed ice! The high surface area of crushed ice chills the mint and lime instantly while keeping the Chang Soda Water intensely fizzy.",
    ingredients: [
      { amountOz: "10-12 leaves", amountMl: "10-12 leaves", item: "Fresh Spearmint Leaves", substitute: "Fresh mint sprigs", inventoryId: "fresh-mint" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lime Juice", substitute: "Whole lime cut into wedges", inventoryId: "fresh-limes" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Simple Syrup (or Demerara syrup)", substitute: "Agave syrup or brown sugar", inventoryId: "simple-syrup" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda or sparkling water", inventoryId: "chang-soda-water" }
    ],
    instructions: [
      "Gently press mint leaves, simple syrup, and lime juice in the bottom of a highball glass with a muddler.",
      "Fill the glass with crushed ice to the brim.",
      "Top with ice-cold Chang Soda Water.",
      "Stir gently from the bottom up to lift the mint through the ice.",
      "Garnish with a slapped mint bouquet and a lime wheel."
    ],
    tags: ["mocktail", "mint", "lime", "summer", "refreshing", "zero-proof"]
  },
  {
    id: "shirley-temple",
    name: "Shirley Temple",
    otherNames: "Hollywood Classic Mocktail",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Bubbly Ginger, Sweet Pomegranate & Cherry",
    difficulty: 1,
    popularity: 9.9,
    proTip: "Created at Chasen's in Beverly Hills for child actress Shirley Temple. Use real Pomegranate Grenadine rather than artificial red syrup for authentic tart flavor.",
    ingredients: [
      { amountOz: "4 oz", amountMl: "120 ml", item: "Schweppes Ginger Ale Soda", substitute: "Lemon-lime soda (Sprite)", inventoryId: "schweppes-ginger-ale" },
      { amountOz: "2 oz", amountMl: "60 ml", item: "Lemon-Lime Soda (Sprite)", substitute: "Chang Soda Water for lower sweetness", inventoryId: "lemon-lime-soda" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Pomegranate Grenadine", substitute: "Raspberry Rhapsody syrup", inventoryId: "pomegranate-grenadine" },
      { amountOz: "2 whole", amountMl: "2 whole", item: "Maraschino Cherries", substitute: "Luxardo cherries", inventoryId: "maraschino-cherries" }
    ],
    instructions: [
      "Fill a tall highball glass with ice cubes.",
      "Pour in Schweppes Ginger Ale and lemon-lime soda.",
      "Slowly drizzle Pomegranate Grenadine over the top and let it cascade down.",
      "Drop in two maraschino cherries.",
      "Stir gently before sipping."
    ],
    tags: ["mocktail", "ginger-ale", "grenadine", "classic", "kid-friendly", "nostalgic"]
  },
  {
    id: "virgin-mary",
    name: "Virgin Mary",
    otherNames: "Bloody Shame",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Savory Tomato, Piquant Tabasco, Umami & Celery Salt",
    difficulty: 1,
    popularity: 9.3,
    proTip: "Without vodka to dilute, the rich tomato seasoning shines even brighter. Add a barspoon of pickle juice or olive brine for incredible savory depth.",
    ingredients: [
      { amountOz: "5 oz", amountMl: "150 ml", item: "Tomato Juice (Seasoned)", substitute: "Clamato juice", inventoryId: "tomato-juice" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon", inventoryId: "fresh-lemons" },
      { amountOz: "3 dashes", amountMl: "3 dashes", item: "Worcestershire Sauce", substitute: "Soy sauce + balsamic vinegar", inventoryId: "worcestershire-sauce" },
      { amountOz: "3 drops", amountMl: "3 drops", item: "Tabasco Hot Sauce", substitute: "Sriracha hot sauce", inventoryId: "tabasco-sauce" },
      { amountOz: "Pinch", amountMl: "Pinch", item: "Celery Salt & Fresh Ground Pepper", substitute: "Kosher salt", inventoryId: "coarse-salt" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Crisp Celery Stalk & Lemon Wedge", substitute: "Pickled green beans", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Rim a highball glass with celery salt.",
      "Add ice to the glass.",
      "In a shaker tin with ice, roll tomato juice, lemon juice, Worcestershire, Tabasco, salt, and pepper.",
      "Strain into the prepared glass.",
      "Garnish with a leafy celery stalk, lemon wedge, and cocktail olives."
    ],
    tags: ["mocktail", "tomato", "savory", "brunch", "spicy"]
  },
  {
    id: "cinderella",
    name: "Cinderella Mocktail",
    otherNames: "The Fairy Tale Punch",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball / Hurricane",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Tropical Citrus Trio, Sweet Grenadine & Effervescence",
    difficulty: 1,
    popularity: 9.5,
    proTip: "Equal parts Orange Juice, Pineapple Juice, and Lemon Juice shaken hard, then topped with Schweppes Ginger Ale or Chang Soda Water.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Orange Juice", substitute: "Fresh orange juice", inventoryId: "orange-juice" },
      { amountOz: "2 oz", amountMl: "60 ml", item: "Pineapple Juice", substitute: "Fresh pineapple juice", inventoryId: "pineapple-juice" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lemon Juice", substitute: "Fresh lime juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Pomegranate Grenadine", substitute: "Raspberry Rhapsody syrup", inventoryId: "pomegranate-grenadine" },
      { amountOz: "Top up", amountMl: "Top up", item: "Schweppes Ginger Ale Soda", substitute: "Chang Soda Water", inventoryId: "schweppes-ginger-ale" }
    ],
    instructions: [
      "In a shaker filled with ice, shake orange juice, pineapple juice, lemon juice, and grenadine for 10 seconds.",
      "Strain into a tall glass over fresh ice.",
      "Top with bubbly Schweppes Ginger Ale.",
      "Garnish with an orange wheel and pineapple wedge."
    ],
    tags: ["mocktail", "citrus", "tropical", "pineapple", "fruity"]
  },
  {
    id: "virgin-pina-colada",
    name: "Virgin Piña Colada (Nada Colada)",
    otherNames: "Island Coconut Dream",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Hurricane / Highball",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Luscious Sweet Coconut, Tropical Pineapple & Lime",
    difficulty: 2,
    popularity: 9.8,
    proTip: "A squeeze of fresh lime juice is essential! The citrus acidity cuts through the heavy sweetness of coconut cream, elevating it to resort quality.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Coconut Cream (Cream of Coconut)", substitute: "Thick coconut milk + simple syrup", inventoryId: "coconut-cream" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Pineapple Juice", substitute: "Fresh pineapple juice", inventoryId: "pineapple-juice" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lime", inventoryId: "fresh-limes" },
      { amountOz: "1 cup", amountMl: "1 cup", item: "Crushed Ice", substitute: "Ice cubes", inventoryId: "ice" }
    ],
    instructions: [
      "Combine coconut cream, pineapple juice, lime juice, and crushed ice in a blender.",
      "Blend on high speed until frosty and velvety smooth.",
      "Pour into a chilled hurricane glass.",
      "Garnish with a fresh pineapple slice, maraschino cherry, and cocktail umbrella."
    ],
    tags: ["mocktail", "coconut", "pineapple", "frozen", "tropical", "resort"]
  },
  {
    id: "virgin-strawberry-daiquiri",
    name: "Virgin Strawberry Daiquiri",
    otherNames: "Frosty Berry Slush",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Coupe / Hurricane",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Sweet Strawberries, Tart Lime & Frosty Refreshment",
    difficulty: 2,
    popularity: 9.7,
    proTip: "Use frozen strawberries rather than extra ice cubes. That way your daiquiri stays intensely strawberry-packed and doesn't get watered down.",
    ingredients: [
      { amountOz: "1 cup", amountMl: "1 cup", item: "Fresh or Frozen Strawberries", substitute: "Fresh ripe strawberries", inventoryId: "fresh-strawberries" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lime Juice", substitute: "Fresh lime", inventoryId: "fresh-limes" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Simple Syrup", substitute: "Agave or honey syrup", inventoryId: "simple-syrup" },
      { amountOz: "0.5 cup", amountMl: "0.5 cup", item: "Crushed Ice", substitute: "Ice cubes", inventoryId: "ice" }
    ],
    instructions: [
      "Place strawberries, lime juice, simple syrup, and crushed ice into a blender.",
      "Blend until smooth, thick, and slushy.",
      "Pour into a chilled coupe or hurricane glass.",
      "Garnish with a fresh strawberry slotted onto the rim and a lime wheel."
    ],
    tags: ["mocktail", "strawberry", "frozen", "summer", "berry"]
  },
  {
    id: "sunset-sparkler",
    name: "Sunset Sparkler",
    otherNames: "Golden Hour Fizz",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Citrus Orange, Tart Cranberry, Pomegranate & Fizz",
    difficulty: 1,
    popularity: 9.6,
    proTip: "Layer carefully for gorgeous sunset photography! Pour grenadine first, then orange juice over ice, and float cranberry and Chang Soda Water on top.",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Pomegranate Grenadine", substitute: "Raspberry Rhapsody syrup", inventoryId: "pomegranate-grenadine" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Orange Juice", substitute: "Fresh orange juice", inventoryId: "orange-juice" },
      { amountOz: "2 oz", amountMl: "60 ml", item: "Cranberry Juice", substitute: "Tart cranberry juice", inventoryId: "cranberry-juice" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water" }
    ],
    instructions: [
      "Drizzle Pomegranate Grenadine into the bottom of a highball glass.",
      "Carefully fill the glass with ice cubes.",
      "Gently pour orange juice down the inside wall.",
      "Top with cranberry juice and a splash of Chang Soda Water.",
      "Garnish with an orange wheel."
    ],
    tags: ["mocktail", "layered", "visual", "sunset", "orange", "cranberry"]
  },
  {
    id: "faux-mopolitan",
    name: "Faux-mopolitan",
    otherNames: "Virgin Cosmo",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Coupe / Martini",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Tart Cranberry, Tangy Lime, Sweet Orange & Elegant",
    difficulty: 1,
    popularity: 9.5,
    proTip: "To mimic the orange triple sec liqueur (Cointreau), use a dash of orange blossom water or fresh orange juice shaken with a flamed orange peel.",
    ingredients: [
      { amountOz: "3 oz", amountMl: "90 ml", item: "Cranberry Juice", substitute: "Tart unsweetened cranberry juice", inventoryId: "cranberry-juice" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Orange Juice", substitute: "Mandarina / blood orange juice", inventoryId: "orange-juice" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lime", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Agave nectar", inventoryId: "simple-syrup" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Flamed Orange Peel Twist", substitute: "Lime wheel", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Chill a martini glass.",
      "Add cranberry juice, orange juice, lime juice, and simple syrup to a shaker with ice.",
      "Shake with energy for 12 seconds.",
      "Fine strain into the chilled glass.",
      "Express orange peel oils over the surface."
    ],
    tags: ["mocktail", "cosmo", "cranberry", "citrus", "elegant"]
  },
  {
    id: "virgin-apple-martini",
    name: "Virgin Apple Martini",
    otherNames: "Appletini Zero",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Martini / Coupe",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Crisp Green Apple, Tart Lemon, Sweet & Refreshing",
    difficulty: 1,
    popularity: 9.4,
    proTip: "Cloudy fresh apple cider or Granny Smith apple juice gives rich body and tart orchard crunch without needing alcohol.",
    ingredients: [
      { amountOz: "3 oz", amountMl: "90 ml", item: "Apple Juice / Fresh Apple Cider", substitute: "Granny Smith fresh pressed apple juice", inventoryId: "apple-juice" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lime juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Honey syrup", inventoryId: "simple-syrup" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water" }
    ],
    instructions: [
      "Chill a martini glass.",
      "Shake apple juice, lemon juice, and simple syrup in a shaker with ice.",
      "Strain into the chilled glass.",
      "Top with a splash of Chang Soda Water for subtle sparkle.",
      "Garnish with a fan of 3 thin green apple slices."
    ],
    tags: ["mocktail", "apple", "martini", "crisp", "orchard"]
  },
  {
    id: "virgin-mai-tai",
    name: "Virgin Mai Tai",
    otherNames: "Tiki Dream Zero",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Double Rocks / Tiki Mug",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Almond Orgeat, Tart Lime, Orange & Pineapple Foam",
    difficulty: 2,
    popularity: 9.6,
    proTip: "The secret to an authentic virgin Mai Tai is the Orgeat almond syrup. Paired with lime and orange juice, it delivers true tiki complexity.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Pineapple Juice", substitute: "Fresh pineapple juice", inventoryId: "pineapple-juice" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Orange Juice", substitute: "Fresh orange juice", inventoryId: "orange-juice" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lime juice", inventoryId: "fresh-limes" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Orgeat Syrup (Almond)", substitute: "Almond extract + simple syrup", inventoryId: "orgeat-syrup" },
      { amountOz: "0.25 oz", amountMl: "7.5 ml", item: "Pomegranate Grenadine", substitute: "Raspberry Rhapsody syrup", inventoryId: "pomegranate-grenadine" }
    ],
    instructions: [
      "Add pineapple juice, orange juice, lime juice, and orgeat to a shaker with ice.",
      "Shake vigorously for 12 seconds to build a dense froth.",
      "Strain into a rocks glass packed with crushed ice.",
      "Drizzle grenadine over the top.",
      "Garnish with a slapped mint bouquet and a lime wheel."
    ],
    tags: ["mocktail", "tiki", "orgeat", "pineapple", "tropical"]
  },
  {
    id: "coconut-lime-mocktail",
    name: "Coconut Lime Mocktail",
    otherNames: "Brazilian Limonada",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball / Rocks",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Creamy Coconut, Zesty Lime & Hydrating Sweetness",
    difficulty: 1,
    popularity: 9.7,
    proTip: "Shaking creamy coconut milk or coconut cream with pure coconut water and fresh lime gives a velvety, thirst-quenching Caribbean cooler.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Coconut Cream", substitute: "Full-fat coconut milk", inventoryId: "coconut-cream" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Pure Coconut Water", substitute: "Chang Soda Water", inventoryId: "coconut-water" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lime Juice", substitute: "Fresh lime", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Agave nectar", inventoryId: "simple-syrup" }
    ],
    instructions: [
      "Combine coconut cream, coconut water, lime juice, and simple syrup in a shaker with ice.",
      "Shake vigorously for 15 seconds.",
      "Strain over fresh ice in a rocks glass or highball.",
      "Garnish with a lime wheel and toasted coconut flakes on the rim."
    ],
    tags: ["mocktail", "coconut", "lime", "tropical", "creamy"]
  },
  {
    id: "mango-mule",
    name: "Mango Mule",
    otherNames: "Tropical Buck Mocktail",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Copper Mug / Highball",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Lush Mango, Spicy Ginger, Tart Lime & Crisp Fizz",
    difficulty: 1,
    popularity: 9.7,
    proTip: "Muddle a couple slices of cucumber with the mango puree before topping with ginger beer for an unexpected crisp, cooling twist.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Mango Puree / Juice", substitute: "Fresh mango blended with touch of water", inventoryId: "mango-juice" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lime", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Agave syrup", inventoryId: "simple-syrup" },
      { amountOz: "Top up", amountMl: "Top up", item: "Ginger Beer (or Schweppes Ginger Ale)", substitute: "Schweppes Ginger Ale Soda", inventoryId: "ginger-beer" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Mint Sprig & Lime Wheel", substitute: "Cucumber slice", inventoryId: "fresh-mint" }
    ],
    instructions: [
      "Fill a copper mug or highball glass with crushed ice.",
      "Add mango puree, fresh lime juice, and simple syrup.",
      "Top with spicy ginger beer (or Schweppes ginger ale).",
      "Stir gently with a bar spoon.",
      "Garnish with a lime wheel and a fresh sprig of mint."
    ],
    tags: ["mocktail", "mango", "ginger", "mule", "tropical"]
  },
  {
    id: "cucumber-mint-cooler",
    name: "Cucumber Mint Cooler",
    otherNames: "Spa Day Refresher",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball / Collins",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Ultra-Refreshing, Crisp Cucumber, Cool Mint & Bubbly",
    difficulty: 1,
    popularity: 9.6,
    proTip: "Muddle thin cucumber ribbons and fresh mint gently. Use Chang Soda Water for high carbonation that lifts the herbal aromas with every sip.",
    ingredients: [
      { amountOz: "4-5 slices", amountMl: "4-5 slices", item: "Fresh Cucumber", substitute: "English cucumber ribbons", inventoryId: "fresh-cucumber" },
      { amountOz: "8-10 leaves", amountMl: "8-10 leaves", item: "Fresh Spearmint", substitute: "Fresh mint sprigs", inventoryId: "fresh-mint" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Agave syrup", inventoryId: "simple-syrup" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Tonic water for a bitter twist", inventoryId: "chang-soda-water" }
    ],
    instructions: [
      "In a tall highball glass, gently press cucumber slices and mint leaves with simple syrup and lime juice.",
      "Fill the glass with ice cubes.",
      "Top with ice-cold Chang Soda Water.",
      "Stir gently to distribute the cucumber and mint.",
      "Garnish with a long cucumber ribbon pressed against the inside glass wall."
    ],
    tags: ["mocktail", "cucumber", "mint", "spa", "ultra-refreshing"]
  },
  {
    id: "virgin-gin-tonic",
    name: "Virgin Gin & Tonic",
    otherNames: "Botanical Zero G&T",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Copa Glass / Highball",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Bitter Quinine, Botanical Juniper, Citrus & Rosemary",
    difficulty: 1,
    popularity: 9.3,
    proTip: "Bruise juniper berries and a sprig of fresh rosemary directly into premium tonic water. The botanicals infuse instantly with zero alcohol.",
    ingredients: [
      { amountOz: "5 oz", amountMl: "150 ml", item: "Tonic Water", substitute: "Chilled premium tonic", inventoryId: "tonic-water", ingredientGroup: "tonic-water"  },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-limes" },
      { amountOz: "1 sprig", amountMl: "1 sprig", item: "Fresh Rosemary", substitute: "Fresh thyme or juniper berries", inventoryId: "fresh-rosemary" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Lime Wheel & Juniper Berries", substitute: "Grapefruit peel", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Fill a large copa wine glass or highball glass with dense ice.",
      "Clap a sprig of rosemary between your palms and place it in the glass.",
      "Add fresh lime juice.",
      "Slowly pour tonic water down a bar spoon to preserve maximum effervescence.",
      "Stir once gently and garnish with a lime wheel."
    ],
    tags: ["mocktail", "tonic", "botanical", "gin-and-tonic", "herbal"]
  },
  {
    id: "rosemary-grapefruit-spritzer",
    name: "Rosemary Grapefruit Spritzer",
    otherNames: "Herbal Pink Spritz",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball / Wine Glass",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Tart Pink Grapefruit, Woody Rosemary, Sweet Agave & Fizz",
    difficulty: 1,
    popularity: 9.5,
    proTip: "Torching the rosemary sprig with a lighter for 2 seconds before inserting it as garnish releases a campfire pine fragrance that transforms the drink.",
    ingredients: [
      { amountOz: "3 oz", amountMl: "90 ml", item: "Pink Grapefruit Juice", substitute: "Fresh squeezed pink grapefruit", inventoryId: "grapefruit-juice" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lime", inventoryId: "fresh-limes" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Agave Syrup (or Simple Syrup)", substitute: "Rosemary-infused simple syrup", inventoryId: "agave-syrup" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water" },
      { amountOz: "1 sprig", amountMl: "1 sprig", item: "Fresh Rosemary Sprig", substitute: "Fresh mint sprig", inventoryId: "fresh-rosemary" }
    ],
    instructions: [
      "In a shaker, shake grapefruit juice, lime juice, and agave syrup with ice for 10 seconds.",
      "Strain into a tall glass filled with ice.",
      "Top with Chang Soda Water.",
      "Lightly toast the tip of a fresh rosemary sprig and place it into the drink beside a pink grapefruit slice."
    ],
    tags: ["mocktail", "grapefruit", "rosemary", "spritz", "sophisticated"]
  },
  {
    id: "spiced-apple-cider",
    name: "Spiced Apple Cider (Iced or Warm)",
    otherNames: "Autumn Orchard Harvest",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Mug or Rocks Glass",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Baking Spices, Cinnamon, Sweet Apple & Orange Zest",
    difficulty: 1,
    popularity: 9.6,
    proTip: "Can be served cold over ice with a splash of ginger ale, or heated gently in a mug with a cinnamon stick and clove studs for cold evenings.",
    ingredients: [
      { amountOz: "5 oz", amountMl: "150 ml", item: "Apple Juice / Sweet Apple Cider", substitute: "Fresh cloudy apple cider", inventoryId: "apple-juice" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lemon Juice", substitute: "Fresh orange juice", inventoryId: "fresh-lemons" },
      { amountOz: "1 stick", amountMl: "1 stick", item: "Cinnamon Stick", substitute: "Pinch ground cinnamon", inventoryId: "granulated-sugar" },
      { amountOz: "Splash", amountMl: "Splash", item: "Schweppes Ginger Ale (if iced)", substitute: "Chang Soda Water", inventoryId: "schweppes-ginger-ale" }
    ],
    instructions: [
      "For Iced: Shake apple cider and lemon juice with ice. Strain into a rocks glass over ice, top with ginger ale, and stir with a cinnamon stick.",
      "For Warm: Heat apple cider in a saucepan with a cinnamon stick and orange peel for 3 minutes; pour into a warm mug.",
      "Garnish with a dehydrated apple wheel and a star anise."
    ],
    tags: ["mocktail", "apple", "cinnamon", "autumn", "warm-or-iced"]
  },
  {
    id: "virgin-moscow-mule",
    name: "Virgin Moscow Mule",
    otherNames: "Ginger Lime Fizz",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Copper Mug / Highball",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Zesty Lime, Fiery Ginger, Mint & Frosty Cold",
    difficulty: 1,
    popularity: 9.7,
    proTip: "Use a spicy fermented ginger beer rather than mild ginger ale to get that signature ginger bite that mimics the proof of alcohol.",
    ingredients: [
      { amountOz: "5 oz", amountMl: "150 ml", item: "Spicy Ginger Beer", substitute: "Schweppes Ginger Ale Soda", inventoryId: "ginger-beer" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lime Juice", substitute: "Fresh lime juice", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Agave nectar", inventoryId: "simple-syrup" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Mint Sprig & Lime Wheel", substitute: "Candied ginger", inventoryId: "fresh-mint" }
    ],
    instructions: [
      "Fill a copper mug or highball glass with crushed ice.",
      "Add fresh lime juice and simple syrup.",
      "Top with spicy ginger beer.",
      "Stir gently with a bar spoon.",
      "Garnish generously with a slapped mint sprig and lime wheel."
    ],
    tags: ["mocktail", "ginger", "lime", "mule", "refreshing", "copper-mug"]
  },
  {
    id: "pomegranate-ginger-spritz",
    name: "Pomegranate Ginger Spritz",
    otherNames: "Ruby Ginger Sparkler",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Wine Glass / Highball",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Tart Ruby Pomegranate, Spicy Ginger & Effervescent",
    difficulty: 1,
    popularity: 9.6,
    proTip: "Your stocked Pomegranate Grenadine and Schweppes Ginger Ale are built for this! Mix with fresh lime juice for an effortless 60-second mocktail.",
    ingredients: [
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Pomegranate Grenadine", substitute: "Raspberry Rhapsody syrup", inventoryId: "pomegranate-grenadine" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-limes" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Schweppes Ginger Ale Soda", substitute: "Chang Soda Water", inventoryId: "schweppes-ginger-ale" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Extra ginger ale", inventoryId: "chang-soda-water" }
    ],
    instructions: [
      "Fill a wine glass or highball glass with ice.",
      "Add Pomegranate Grenadine and fresh lime juice.",
      "Pour in Schweppes Ginger Ale and top with Chang Soda Water.",
      "Stir gently to create a sparkling crimson color.",
      "Garnish with a lime wheel and fresh pomegranate arils or mint."
    ],
    tags: ["mocktail", "pomegranate", "ginger-ale", "bubbly", "easy"]
  },
  {
    id: "lemon-berry-fizz",
    name: "Lemon-Berry Fizz",
    otherNames: "Raspberry Rhapsody Fizz",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball / Collins",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Sweet Ripe Raspberry, Sharp Lemon & High Carbonation",
    difficulty: 1,
    popularity: 9.7,
    proTip: "Highlighting your stocked Raspberry Rhapsody flavored syrup! Shaken with lemon juice and topped with super-fizzy Chang Soda Water, it beats any commercial soda.",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Raspberry Rhapsody Flavored Syrup", substitute: "Pomegranate Grenadine", inventoryId: "raspberry-rhapsody" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lemon Juice", substitute: "Fresh lime juice", inventoryId: "fresh-lemons" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda or sparkling water", inventoryId: "chang-soda-water" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Lemon Wheel & Mint Sprig", substitute: "Fresh raspberries", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "In a cocktail shaker with ice, shake Raspberry Rhapsody syrup and fresh lemon juice for 10 seconds.",
      "Strain into a tall Collins glass filled with ice.",
      "Top with icy Chang Soda Water.",
      "Stir gently once from bottom to top.",
      "Garnish with a lemon wheel and a mint sprig."
    ],
    tags: ["mocktail", "raspberry", "lemon", "fizz", "chang-soda", "in-stock"]
  },
  {
    id: "safe-sex-on-the-beach",
    name: "Safe Sex on the Beach",
    otherNames: "Virgin Beach Cruiser",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball / Hurricane",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Sweet Peach Nectar, Fresh Orange & Tart Cranberry",
    difficulty: 1,
    popularity: 9.8,
    proTip: "Use peach nectar (or peach iced tea / peach puree) with orange and cranberry juice. All the flavor of the famous party drink with zero alcohol.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Peach Nectar / Puree (or Peach Tea)", substitute: "Apple juice + touch of simple syrup", inventoryId: "apple-juice" },
      { amountOz: "2 oz", amountMl: "60 ml", item: "Fresh Orange Juice", substitute: "Orange juice", inventoryId: "orange-juice" },
      { amountOz: "2 oz", amountMl: "60 ml", item: "Cranberry Juice", substitute: "Tart cranberry juice", inventoryId: "cranberry-juice" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Orange Slice & Cocktail Cherry", substitute: "Maraschino cherry", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Fill a hurricane or highball glass with ice.",
      "Pour in cranberry juice first.",
      "In a shaker with ice, shake peach nectar and orange juice.",
      "Slowly strain the peach-orange mix over the back of a spoon onto the cranberry layer.",
      "Garnish with an orange wheel and a maraschino cherry."
    ],
    tags: ["mocktail", "peach", "cranberry", "orange", "party", "summer"]
  },

  // =========================================================================
  // ADDITIONAL FAMOUS COCKTAILS, SHOTS & MOCKTAILS (Including 今夜不回家)
  // =========================================================================
  {
    id: "tonight-not-going-home",
    name: "Tonight Not Going Home (今夜不回家)",
    otherNames: "Jīn Yè Bù Huí Jiā, Chinese Knockout Flaming Cocktail",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Brandy Snifter / Rocks Glass",
    alcoholLevel: "Very High (~40% ABV)",
    alcoholScore: 5,
    tasteProfile: "Fiery, Potent, Orange Citrus, Oak & Molasses Warmth",
    difficulty: 3,
    popularity: 9.9,
    proTip: "China and Taiwan's most famous nightlife challenge cocktail. Created by marrying equal parts high-proof Rum, Tequila, Whiskey, and an orange liqueur (Cointreau or Grand Marnier). In Chinese clubs, bartenders warm the snifter and ignite the vapors, sprinkling ground cinnamon from above to unleash a starry meteor shower of golden sparks. Always blow out the flame before drinking!",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Goslings Black Seal 151 Overproof Rum", substitute: "Bacardi Superior White Rum, then Myers's Original Dark Rum", inventoryId: "goslings-black-seal-151" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Teremana Tequila", substitute: "100% blue agave blanco or reposado", inventoryId: "teremana-tequila" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Jack Daniel's Bonded Rye (or Jim Beam Black)", substitute: "Jim Beam Black Aged Bourbon or Johnnie Walker Black", inventoryId: "jd-bonded-rye" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Grand Marnier (or Cointreau)", substitute: "Cointreau or Lumina Triple Sec", inventoryId: "grand-marnier" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Ground Cinnamon (for spark flame) & Fresh Orange Peel", substitute: "Navel orange twist", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Pour Goslings 151 Rum, Teremana Tequila, Jack Daniel's Rye, and Grand Marnier into a heavy-walled brandy snifter or rocks glass.",
      "Swirl gently to marry the high-proof spirits.",
      "Optional Flaming Ritual: Use a long bar lighter to carefully warm the rim and ignite the surface vapors into a dancing blue flame.",
      "Sprinkle a pinch of ground cinnamon high above the flame to create crackling golden sparks (fireworks effect).",
      "Extinguish the flame immediately by covering with a coaster or shaker tin before drinking with a fireproof straw, or chill over a large ice cube for a frosty knockout cocktail."
    ],
    tags: ["tonight-not-going-home", "jin-ye-bu-hui-jia", "flaming", "chinese-bar", "potent", "in-stock"]
  },
  {
    id: "tonight-not-going-home-shot",
    name: "Tonight Not Going Home Shot (今夜不回家子弹杯)",
    otherNames: "Jīn Yè Bù Huí Jiā Shooter",
    category: "Shot",
    baseSpirit: "Rum",
    glassware: "Shot Glass",
    alcoholLevel: "Very High (~42% ABV)",
    alcoholScore: 5,
    tasteProfile: "Intense Spirit Heat, Caramel Oak, Agave & Candied Orange",
    difficulty: 2,
    popularity: 9.8,
    proTip: "The high-potency shooter edition designed to be taken down in one breathless gulp. Using your stocked Bacardi Rum, Teremana Tequila, Jim Beam Bourbon, and Cointreau gives it maximum proof with a surprisingly smooth citrus finish.",
    ingredients: [
      { amountOz: "0.38 oz", amountMl: "11 ml", item: "Goslings Black Seal 151 Overproof Rum", substitute: "Bacardi Superior White Rum, then Myers's Original Dark Rum", inventoryId: "goslings-black-seal-151" },
      { amountOz: "0.38 oz", amountMl: "11 ml", item: "Teremana Tequila", substitute: "Blanco or reposado tequila", inventoryId: "teremana-tequila" },
      { amountOz: "0.38 oz", amountMl: "11 ml", item: "Jim Beam Black Aged Bourbon", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" },
      { amountOz: "0.38 oz", amountMl: "11 ml", item: "Cointreau (or Grand Marnier)", substitute: "Grand Marnier or Lumina Triple Sec", inventoryId: "cointreau" }
    ],
    instructions: [
      "Pour the Goslings 151 Rum and the other 3 spirits directly into a heavy shot glass.",
      "Stir once with a cocktail pick to blend.",
      "Shoot down in one single celebratory swallow."
    ],
    tags: ["shot", "tonight-not-going-home", "jin-ye-bu-hui-jia", "potent", "in-stock"]
  },
  {
    id: "amf",
    name: "Adios Motherfucker (AMF)",
    otherNames: "Blue Motorcycle, Electric Long Island Iced Tea",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Hurricane / Highball",
    alcoholLevel: "High (~22% ABV)",
    alcoholScore: 5,
    tasteProfile: "Electric Blue Citrus, Sweet-Tart Lemon & High Octane",
    difficulty: 2,
    popularity: 9.8,
    proTip: "The vibrant blue sibling of the Long Island Iced Tea. Swapping triple sec for Curaçao Bleu and cola for citrus soda turns this into the ultimate party centerpiece.",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Smirnoff Red Vodka (or Absolut Blue)", substitute: "Absolut Vodka Original Blue", inventoryId: "smirnoff-red" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Bacardi Superior White Rum", substitute: "Any light white rum", inventoryId: "bacardi-superior" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Teremana Tequila", substitute: "Blanco tequila", inventoryId: "teremana-tequila" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Curaçao Bleu Liqueur", substitute: "Blue Curaçao", inventoryId: "curacao-bleu" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lemon Juice", substitute: "Sweet & sour mix", inventoryId: "fresh-lemons" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup", substitute: "Sugar syrup", inventoryId: "simple-syrup" },
      { amountOz: "Top up", amountMl: "Top up", item: "Lemon-Lime Soda (or Chang Soda Water)", substitute: "Chang Soda Water or Schweppes Ginger Soda", inventoryId: "lemon-lime-soda" }
    ],
    instructions: [
      "Fill a hurricane or tall highball glass with ice cubes.",
      "Combine vodka, rum, tequila, gin, Curaçao Bleu, lemon juice, and simple syrup in a shaker with ice.",
      "Shake with vigor for 8 seconds.",
      "Strain into the tall glass over fresh ice.",
      "Top with lemon-lime soda (or Chang Soda Water).",
      "Garnish with a fresh lemon wheel and a maraschino cherry."
    ],
    tags: ["vodka", "rum", "tequila", "gin", "blue-curacao", "party", "potent", "in-stock"]
  },
  {
    id: "southside",
    name: "Southside",
    otherNames: "The Gin Mojito, Al Capone's Chicago Club Classic",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 3,
    tasteProfile: "Crisp Botanical Juniper, Spearmint & Sharp Fresh Lime",
    difficulty: 2,
    popularity: 9.7,
    proTip: "Regarded as the Mojito's refined, high-society cousin served 'up' in a coupe glass. Shaking fresh mint leaves directly with ice bruises the herbs gently and blankets the gin in refreshing essential oils.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lime Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-limes" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Simple Syrup", substitute: "Rich simple syrup", inventoryId: "simple-syrup" },
      { amountOz: "6-8 leaves", amountMl: "6-8 leaves", item: "Fresh Spearmint Leaves", substitute: "Fresh mint sprigs", inventoryId: "fresh-mint" }
    ],
    instructions: [
      "Add mint leaves, Tanqueray gin, fresh lime juice, and simple syrup to a cocktail shaker.",
      "Fill with plenty of ice cubes.",
      "Shake with maximum power for 12 seconds until shaker frosts over.",
      "Double strain through a fine mesh strainer into a chilled coupe glass.",
      "Float a single fresh mint leaf on the surface as an aromatic crown."
    ],
    tags: ["gin", "mint", "sour", "classic", "prohibition", "in-stock"]
  },
  {
    id: "bees-knees",
    name: "Bee's Knees",
    otherNames: "Prohibition Honey Gin Sour (1920s)",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 3,
    tasteProfile: "Floral Wildflower Honey, Tart Lemon & Juniper Gin",
    difficulty: 1,
    popularity: 9.7,
    proTip: "Make honey syrup by mixing 3 parts pure honey to 1 part warm water so it pours and dissolves effortlessly when shaken with ice. The honey coats Tanqueray's bold juniper with velvety warmth.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Honey Syrup (3:1 honey to warm water)", substitute: "Simple syrup with honey", inventoryId: "honey-syrup" }
    ],
    instructions: [
      "Chill a coupe glass in the freezer.",
      "Add Tanqueray gin, fresh lemon juice, and honey syrup into a shaker with ice.",
      "Shake vigorously for 12 seconds.",
      "Fine strain into the chilled coupe.",
      "Garnish with an elegant lemon peel twist."
    ],
    tags: ["gin", "honey", "lemon", "prohibition", "classic", "in-stock"]
  },
  {
    id: "whiskey-smash",
    name: "Whiskey Smash",
    otherNames: "Dale DeGroff Revival, Mint Julep's Tangy Sister",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Rocks / Lowball",
    alcoholLevel: "Medium-High (~24% ABV)",
    alcoholScore: 4,
    tasteProfile: "Muddled Citrus Oils, Sweet Caramel Oak & Cool Spearmint",
    difficulty: 2,
    popularity: 9.7,
    proTip: "Muddle whole lemon wedges (with skin on!) directly with simple syrup. Muddling the skin expresses fragrant essential oils from the peel into the bourbon that juice alone cannot match.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Jim Beam Black Aged Bourbon", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" },
      { amountOz: "3-4 wedges", amountMl: "3-4 wedges", item: "Fresh Lemon (Half a lemon cut into wedges)", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Simple Syrup", substitute: "Demerara syrup or sugar", inventoryId: "simple-syrup" },
      { amountOz: "8 leaves", amountMl: "8 leaves", item: "Fresh Spearmint", substitute: "Fresh mint sprigs", inventoryId: "fresh-mint" }
    ],
    instructions: [
      "In the bottom of a cocktail shaker, firmly muddle the fresh lemon wedges, simple syrup, and mint leaves to express juices and peel oils.",
      "Add Jim Beam Black bourbon and fill shaker with ice cubes.",
      "Shake hard for 12 seconds.",
      "Double strain over fresh crushed ice in an Old Fashioned rocks glass.",
      "Garnish with a slapped mint sprig and a lemon wheel."
    ],
    tags: ["bourbon", "whiskey", "mint", "lemon", "muddled", "summer", "in-stock"]
  },
  {
    id: "white-lady",
    name: "White Lady",
    otherNames: "IBA Official Unforgettable, Harry MacElhone Classic (1919)",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~26% ABV)",
    alcoholScore: 4,
    tasteProfile: "Crisp Botanical, Sweet Candied Orange, Tart Lemon & Silky Cloud",
    difficulty: 2,
    popularity: 9.6,
    proTip: "The gin-based counterpart of the Sidecar. Dry shaking with egg white produces an ethereal porcelain-white froth cap that floats on top of the pale golden nectar.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Cointreau", substitute: "Grand Marnier or Lumina Triple Sec", inventoryId: "cointreau" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Egg White (Optional for foam)", substitute: "Aquafaba or omit", inventoryId: "egg-white" }
    ],
    instructions: [
      "Add Tanqueray gin, Cointreau, fresh lemon juice, and egg white into a shaker without ice.",
      "Dry shake vigorously for 10 seconds to whip the egg white.",
      "Add ice and wet shake hard for 12 seconds until frosty cold.",
      "Fine strain into a chilled coupe glass.",
      "Garnish with an expressed lemon peel twist."
    ],
    tags: ["gin", "cointreau", "sour", "iba-unforgettable", "classic", "in-stock"]
  },
  {
    id: "between-the-sheets",
    name: "Between the Sheets",
    otherNames: "Harry's New York Bar Paris Classic (1930s)",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Coupe",
    alcoholLevel: "High (~30% ABV)",
    alcoholScore: 5,
    tasteProfile: "Warm Oak, Sugarcane Rum, Candied Orange & Tart Lemon",
    difficulty: 2,
    popularity: 9.5,
    proTip: "A split-base cocktail uniting Rum and Bourbon/Cognac with Cointreau and lemon juice. Bacardi White Rum brings crisp sugarcane sweetness that elevates the rich oak of the bourbon.",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Bacardi Superior White Rum", substitute: "Any light or aged rum", inventoryId: "bacardi-superior" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Jim Beam Black Bourbon (or Cognac)", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Cointreau", substitute: "Grand Marnier or Lumina Triple Sec", inventoryId: "cointreau" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Chill a coupe glass in the freezer.",
      "Combine Bacardi rum, bourbon, Cointreau, and fresh lemon juice in a shaker with ice.",
      "Shake vigorously for 12 seconds.",
      "Strain into the chilled coupe.",
      "Flame a fresh Navel orange peel over the glass to express fragrant oils."
    ],
    tags: ["rum", "bourbon", "cointreau", "classic", "potent", "in-stock"]
  },
  {
    id: "ward-8",
    name: "Ward 8",
    otherNames: "Boston Locke-Ober Classic (1898)",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 4,
    tasteProfile: "Spicy Rye, Fresh Navel Orange, Tart Lemon & Pomegranate",
    difficulty: 2,
    popularity: 9.5,
    proTip: "Created in 1898 at Boston's Locke-Ober cafe. Squeezing fresh Navel oranges rather than bottled juice makes the world of difference against the spicy 100-proof rye.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Jack Daniel's Bonded Rye", substitute: "Jim Beam Black Aged Bourbon", inventoryId: "jd-bonded-rye" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon juice", inventoryId: "fresh-lemons" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Navel Orange Juice", substitute: "Strained fresh orange juice", inventoryId: "fresh-oranges" },
      { amountOz: "1 tsp", amountMl: "5 ml", item: "Pomegranate Grenadine", substitute: "Raspberry Rhapsody syrup", inventoryId: "pomegranate-grenadine" }
    ],
    instructions: [
      "Add rye whiskey, fresh lemon juice, fresh navel orange juice, and Pomegranate Grenadine to a shaker with ice.",
      "Shake hard for 12 seconds.",
      "Strain into a chilled coupe glass.",
      "Garnish with two maraschino cherries speared on a cocktail pick."
    ],
    tags: ["rye", "whiskey", "boston", "classic", "grenadine", "orange", "in-stock"]
  },
  {
    id: "tequila-slammer",
    name: "Tequila Slammer Shot",
    otherNames: "The Popper, Tequila Boom Boom",
    category: "Shot",
    baseSpirit: "Tequila/Mezcal",
    glassware: "Rocks / Sturdy Shot Glass",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Explosive Citrus Fizz, Sweet Ginger & Agave Rush",
    difficulty: 1,
    popularity: 9.6,
    proTip: "Fill equal parts Teremana Tequila and Schweppes Ginger Soda. Cover the top of the glass with your hand or a folded napkin, SLAM the glass down firmly on the bar mat, and drink immediately while the liquid erupts into dense white fizz!",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Teremana Tequila", substitute: "Any 100% blue agave tequila", inventoryId: "teremana-tequila" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Schweppes Ginger Soda", substitute: "Lemon-lime soda (Sprite) or Chang Soda", inventoryId: "schweppes-ginger-soda" }
    ],
    instructions: [
      "Pour Teremana Tequila and Schweppes Ginger Soda into a thick, sturdy rocks or double-shot glass.",
      "Leave 1 inch of headspace at the top for foam expansion.",
      "Cover the rim tightly with a folded bar napkin or the palm of your hand.",
      "Slam the base of the glass firmly down onto the counter or bar mat once.",
      "As the carbonation erupts into a creamy white foam head, instantly drink it down in one gulp!"
    ],
    tags: ["shot", "tequila", "ginger-soda", "slammer", "party", "in-stock"]
  },
  {
    id: "pickleback",
    name: "Pickleback Shot",
    otherNames: "The Bushwick Brooklyn Two-Step (2006)",
    category: "Shot",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Two Shot Glasses",
    alcoholLevel: "High (~40% ABV shot, 0% chaser)",
    alcoholScore: 4,
    tasteProfile: "Spicy Rye Whiskey Warmth Followed by Instant Cooling Dill Saline",
    difficulty: 1,
    popularity: 9.7,
    proTip: "The salt, brine, and vinegar in the pickle juice instantly and completely neutralize the heat of 100-proof Jack Daniel's Bonded Rye or Jim Beam Bourbon on your tongue! A certified bartender favorite.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Jack Daniel's Bonded Rye (or Jim Beam Black)", substitute: "Jim Beam Black Aged Bourbon", inventoryId: "jd-bonded-rye" },
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Chilled Dill Pickle Brine", substitute: "Olive brine", inventoryId: "coarse-salt" }
    ],
    instructions: [
      "Pour Jack Daniel's Bonded Rye whiskey into the first shot glass.",
      "Pour chilled dill pickle brine from a pickle jar into the second shot glass.",
      "Shoot the whiskey first.",
      "Immediately follow by shooting the cold pickle brine chaser.",
      "Notice how all alcohol burn vanishes in half a second!"
    ],
    tags: ["shot", "whiskey", "pickleback", "chaser", "brooklyn", "in-stock"]
  },
  {
    id: "gunner",
    name: "Gunner (Classic Hong Kong / British Club Mocktail)",
    otherNames: "The Colonial Club Refresher, Hong Kong Gunner",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball / Collins",
    alcoholLevel: "Zero-Proof (Trace <0.5% ABV from bitters)",
    alcoholScore: 0,
    tasteProfile: "Spicy Ginger, Crisp High Carbonation, Tangy Lime & Aromatic Spices",
    difficulty: 1,
    popularity: 9.8,
    proTip: "The most beloved non-alcoholic order across golf clubs and speakeasies in Hong Kong and Singapore. Equal parts Schweppes Ginger Soda and Chang Soda Water, a squeeze of fresh lime, and 3-4 generous dashes of Angostura Bitters.",
    ingredients: [
      { amountOz: "3 oz", amountMl: "90 ml", item: "Schweppes Ginger Soda", substitute: "Ginger beer or ginger ale", inventoryId: "schweppes-ginger-soda" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice (Half a lime squeezed)", substitute: "Fresh lemon juice", inventoryId: "fresh-limes" },
      { amountOz: "4 dashes", amountMl: "4 dashes", item: "Angostura Bitters", substitute: "Aromatic bitters", inventoryId: "angostura-bitters" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Lime Wheel & Mint Sprig", substitute: "Lemon wheel", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Fill a tall Collins or highball glass with ice cubes.",
      "Pour in Schweppes Ginger Soda and Chang Soda Water.",
      "Squeeze in half a fresh lime.",
      "Shake 4 dashes of Angostura Bitters over the surface.",
      "Stir gently from bottom to top to swirl the amber bitters throughout the fizz.",
      "Garnish with a lime wheel."
    ],
    tags: ["mocktail", "gunner", "hong-kong", "ginger-soda", "chang-soda", "angostura", "in-stock"]
  },
  {
    id: "arnold-palmer",
    name: "Arnold Palmer",
    otherNames: "Half & Half, The Golfer's Refresher",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball / Collins",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Brisk Tannic Black Tea, Sweet-Tart Lemonade & Crisp Cold",
    difficulty: 1,
    popularity: 9.9,
    proTip: "Named after golfing icon Arnold Palmer who regularly ordered this at the bar. Brew fresh black tea and chill it cold. Combine equal parts fresh lemonade and iced black tea over plenty of ice.",
    ingredients: [
      { amountOz: "3 oz", amountMl: "90 ml", item: "Chilled Brewed Black Tea (Unsweetened)", substitute: "Earl Grey or English Breakfast tea", inventoryId: "apple-juice" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Fresh Lemonade (Fresh lemon juice + simple syrup + water)", substitute: "Fresh lemon juice + simple syrup", inventoryId: "fresh-lemons" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Simple Syrup (To taste)", substitute: "Honey syrup", inventoryId: "simple-syrup" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Lemon Wheel & Mint Sprig", substitute: "Lemon slice", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Fill a tall highball glass with ice.",
      "Pour in cold brewed black tea.",
      "Add freshly squeezed lemonade and simple syrup.",
      "Stir with a bar spoon to marry the golden amber tea and citrus.",
      "Garnish with a fresh lemon wheel and a spearmint sprig."
    ],
    tags: ["mocktail", "arnold-palmer", "tea", "lemonade", "classic", "zero-proof"]
  },
  {
    id: "air-mail",
    name: "Air Mail",
    otherNames: "The Tropical French 75",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Champagne Flute / Coupe",
    alcoholLevel: "Medium-High (~18% ABV)",
    alcoholScore: 4,
    tasteProfile: "Effervescent, Honeyed Oak, Tart Lime & Sugarcane",
    difficulty: 2,
    popularity: 9.4,
    proTip: "The rum cousin of the French 75. Shaking rich honey syrup with gold/dark rum and lime juice creates an incredible flavor anchor before being stretched out by bubbly Prosecco.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Mount Gay Barbados Rum Black Barrel", substitute: "Bacardi Carta Blanca Superior White Rum", inventoryId: "mount-gay-black-barrel" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh pressed lime juice", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Honey Syrup (3:1)", substitute: "Premium Simple Syrup", inventoryId: "honey-syrup" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Prosecco", substitute: "Zonin Prosecco Brut or dry sparkling wine", inventoryId: "gio-prosecco" }
    ],
    instructions: [
      "Chill a champagne flute or coupe glass.",
      "Combine Mount Gay rum, fresh lime juice, and honey syrup in a cocktail shaker filled with ice.",
      "Shake vigorously for 10–12 seconds until frosty cold.",
      "Strain into your chilled glass.",
      "Slowly top with cold Prosecco to lift the tropical and rich honey aromas.",
      "Garnish with a sleek lime wheel or discardable lime twist."
    ],
    tags: ["rum", "mount-gay", "honey", "prosecco", "bubbly", "classic", "in-stock"]
  },
  {
    id: "raspberry-lime-rickey",
    name: "Raspberry Lime Rickey",
    otherNames: "New England Soda Classic",
    category: "Mocktail",
    baseSpirit: "Non-Alcoholic",
    glassware: "Highball / Collins",
    alcoholLevel: "Zero-Proof (0% ABV)",
    alcoholScore: 0,
    tasteProfile: "Tart Lime, Sweet Raspberry & High Carbonation",
    difficulty: 1,
    popularity: 9.6,
    proTip: "Highlighting your stocked Raspberry Rhapsody syrup! Pouring the soda down a bar spoon ensures the carbonation stays extra hot, lifting the heavy berry sweetness.",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Raspberry Rhapsody Flavored Syrup", substitute: "Pomegranate Grenadine", inventoryId: "raspberry-rhapsody" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice (Half a lime)", substitute: "Fresh lemon juice", inventoryId: "fresh-limes" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Fever-Tree Premium Tonic Water for a bitter twist", inventoryId: "chang-soda-water" }
    ],
    instructions: [
      "Fill a tall highball glass to the brim with clean ice cubes.",
      "Add your Raspberry Rhapsody syrup and squeeze in the fresh lime juice.",
      "Top slowly with crisp, high-carbonation Chang Soda Water.",
      "Stir gently from the bottom up exactly twice to swirl the beautiful magenta layers together without deflating the fizz.",
      "Garnish with a fresh lime wheel and drop a couple of fresh raspberries into the ice glass."
    ],
    tags: ["mocktail", "raspberry", "lime", "soda-water", "refreshing", "easy", "in-stock"]
  },
    // =========================================================================
  // POPULAR CLASSICS & NEW SHOTS (Newly Added)
  // =========================================================================
  {
    id: "classic-gin-and-tonic",
    name: "Classic Gin & Tonic",
    otherNames: "G&T, The Botanical Highball",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Copa / Highball",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Crisp, Bitter Quinine, Botanical & Effervescent",
    difficulty: 1,
    popularity: 9.9,
    proTip: "Pairing your Tanqueray London Dry with Fever-Tree Indian Tonic is an elite tier match. Rub the lime wheel along the rim of the glass before dropping it in to distribute essential citrus oils.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Fever-Tree Premium Indian Tonic Water", substitute: "Any quality tonic water", ingredientGroup: "tonic-water" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Lime Wheels", substitute: "Lemon or grapefruit twist", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Fill a large Copa (balloon) wine glass or tall highball glass completely with dense ice cubes.",
      "Pour Tanqueray gin over the ice.",
      "Slowly pour Fever-Tree Indian Tonic Water down the inside of the glass to keep the carbonation sharp.",
      "Stir gently once from the bottom to blend without losing the fizz.",
      "Garnish with two fresh lime wheels slid into the ice stack."
    ],
    tags: ["gin", "tonic", "classic", "refreshing", "summer", "in-stock"]
  },
  {
    id: "dark-n-stormy-fever-tree",
    name: "Dark 'n' Stormy (Premium Style)",
    otherNames: "Bermuda Highball, Spicy Storm",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Highball",
    alcoholLevel: "Medium (~15% ABV)",
    alcoholScore: 3,
    tasteProfile: "Spicy Ginger, Dark Molasses, Lime & Rich Fizz",
    difficulty: 1,
    popularity: 9.7,
    proTip: "Using Fever-Tree Premium Ginger Beer elevates this drink tremendously. Its 3-ginger blend mimics alcohol burn, providing a deep, robust background to the molasses-heavy Myers's rum.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Myers's Original Dark Rum", substitute: "Mount Gay Barbados Rum", inventoryId: "myers-dark-rum" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Fever-Tree Premium Ginger Beer", substitute: "Bundaberg Ginger Beer", ingredientGroup: "ginger-beer" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lime wedge", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Fill a tall highball glass with clean ice cubes.",
      "Add fresh lime juice and top with Fever-Tree ginger beer, leaving 1.5 inches of space at the top.",
      "Slowly float your Myers's Dark Rum over the back of a bar spoon to form a dark, stormy layer.",
      "Garnish with a lime wheel and serve unstrained for visual drama."
    ],
    tags: ["rum", "ginger-beer", "dark-rum", "classic", "layered", "in-stock"]
  },
  {
    id: "classic-moscow-mule",
    name: "Classic Moscow Mule (Premium Brew)",
    otherNames: "Vodka Buck",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Copper Mug / Highball",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Zesty, Fiery Ginger, Crisp & Shockingly Chilled",
    difficulty: 1,
    popularity: 9.8,
    proTip: "Your original Moscow Mule recipe lacked the group configuration! Now, using either Bundaberg (sweeter) or Fever-Tree (spicier) will satisfy the drink perfectly based on your mood.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Absolut Vodka (or Smirnoff Red)", substitute: "Smirnoff Red Vodka", inventoryId: "absolut-blue" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh pressed lime juice", inventoryId: "fresh-limes" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Fever-Tree Premium Ginger Beer", substitute: "Bundaberg Ginger Beer", ingredientGroup: "ginger-beer" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Lime Wheel & Mint Sprig", substitute: "Expressed lime zest", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Pack a copper mug or highball glass with crushed ice.",
      "Pour in Absolut vodka and fresh lime juice.",
      "Top with your in-stock premium ginger beer.",
      "Give it a single gentle stir to lift the citrus.",
      "Garnish with a lime wheel and a slapped sprig of spearmint."
    ],
    tags: ["vodka", "ginger-beer", "mule", "refreshing", "copper-mug", "in-stock"]
  },
  {
    id: "rum-and-tonic",
    name: "Rum & Tonic",
    otherNames: "The Havana Highball",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Highball",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Sugarcane, Crisp Quinine, Dry & Tropical Citrus",
    difficulty: 1,
    popularity: 9.1,
    proTip: "While vodka and gin rule the tonic world, crisp Bacardi Superior White Rum paired with Fever-Tree tonic creates a shockingly refreshing, highly underutilized beach highball.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Bacardi Carta Blanca White Rum", substitute: "Mount Gay Barbados Rum", inventoryId: "bacardi-superior" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Fever-Tree Premium Indian Tonic Water", substitute: "Any quality tonic water", ingredientGroup: "tonic-water" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Lime wedge squeeze", inventoryId: "fresh-limes" }
    ],
    instructions: [
      "Fill a highball glass with large ice blocks.",
      "Squeeze in a lime wedge, then drop the hull into the glass.",
      "Add white rum and top up entirely with chilled Fever-Tree tonic water.",
      "Stir gracefully once and serve immediately."
    ],
    tags: ["rum", "tonic", "refreshing", "easy", "caribbean", "in-stock"]
  },
  {
    id: "vodka-tonic",
    name: "Vodka Tonic",
    otherNames: "The Clean Slate",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Highball",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Ultra-Clean, Effervescent, Crisp Bitterness & Bright Lemon",
    difficulty: 1,
    popularity: 9.5,
    proTip: "Because vodka is neutral, the quality of your tonic water is 80% of the drink. Fever-Tree's real fruit oils shine beautifully against Absolut's winter wheat base.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Absolut Vodka Original Blue", substitute: "Smirnoff Red Vodka", inventoryId: "absolut-blue" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Fever-Tree Premium Indian Tonic Water", substitute: "Any quality tonic water", ingredientGroup: "tonic-water" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Lemon or Lime Wedge", substitute: "Lemon twist", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Store your vodka bottle in the freezer beforehand for ultimate coldness.",
      "Fill a tall highball glass with ice.",
      "Add vodka, top with Fever-Tree tonic water, and squeeze a fresh lemon wedge right over the top.",
      "Stir once to consolidate."
    ],
    tags: ["vodka", "tonic", "clean", "classic", "simple", "in-stock"]
  },
  {
    id: "bourbon-and-ginger",
    name: "Bourbon & Ginger",
    otherNames: "Kentucky Buck Riff, Whiskey Ginger",
    category: "Cocktail",
    baseSpirit: "Whiskey/Bourbon",
    glassware: "Rocks / Highball",
    alcoholLevel: "Low-Medium (~13% ABV)",
    alcoholScore: 2,
    tasteProfile: "Sweet Caramel Oak, Warm Vanilla, Fiery Ginger & Spice",
    difficulty: 1,
    popularity: 9.6,
    proTip: "The rich vanilla and charred oak sweetness of Jim Beam Black acts as a beautiful counterweight to the fiery snap of Fever-Tree ginger beer.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Jim Beam Black Aged Bourbon", substitute: "Jack Daniel's Bonded Rye", inventoryId: "jim-beam-black" },
      { amountOz: "4 oz", amountMl: "120 ml", item: "Fever-Tree Premium Ginger Beer", substitute: "Bundaberg Ginger Beer", ingredientGroup: "ginger-beer" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Fresh Orange Peel Twist", substitute: "Lime wheel", inventoryId: "fresh-oranges" }
    ],
    instructions: [
      "Fill a rocks or highball glass with large ice blocks.",
      "Pour your aged bourbon over the ice.",
      "Top up with premium fiery ginger beer.",
      "Stir gently and express a fresh orange peel across the rim to introduce aromatic citrus oils."
    ],
    tags: ["bourbon", "whiskey", "ginger-beer", "highball", "comfort", "in-stock"]
  },
  {
    id: "turbo-flatliner-shot",
    name: "Turbo Flatliner Shot",
    otherNames: "Premium Fiery Heartbeat Shooter",
    category: "Shot",
    baseSpirit: "Tequila/Mezcal",
    glassware: "Shot Glass",
    alcoholLevel: "High (~35% ABV)",
    alcoholScore: 5,
    tasteProfile: "Intense Herbal Anise, Sweet Ginger Bite, Blazing Heat & Agave",
    difficulty: 3,
    popularity: 9.2,
    proTip: "An elite party variant of the Flatliner. By adding a barspoon of Fever-Tree ginger beer to your White Sambuca base, you create a complex, fizzy barrier that suspends the hot Tabasco sauce spectacularly before the tequila float.",
    ingredients: [
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Vaccari Sambuca", substitute: "White Sambuca", inventoryId: "sambuca" },
      { amountOz: "1 tsp", amountMl: "5 ml", item: "Fever-Tree Premium Ginger Beer", substitute: "Bundaberg Ginger Beer", ingredientGroup: "ginger-beer" },
      { amountOz: "5 drops", amountMl: "5 drops", item: "Tabasco Hot Sauce", substitute: "Spicy red chili sauce", inventoryId: "tabasco-sauce" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Teremana Tequila", substitute: "Topanito Mezcal", inventoryId: "teremana-tequila" }
    ],
    instructions: [
      "Pour your sweet Vaccari Sambuca directly into the base of a heavy shot glass.",
      "Gently layer a teaspoon of Fever-Tree ginger beer on top using a spoon back.",
      "Drop 5 precise beads of red Tabasco hot sauce across the surface; they will float suspended in the ginger tier.",
      "Slowly float your Teremana Tequila over the top as the final crystal clear layer. Gulp down in one breathless go."
    ],
    tags: ["shot", "tequila", "sambuca", "spicy", "tabasco", "layered", "in-stock"]
  },
  {
    id: "classic-tom-collins",
    name: "Classic Tom Collins",
    otherNames: "The Sparkling Gin Lemonade",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Collins / Highball",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Crisp, Sparkling Lemonade & Sharp Botanical",
    difficulty: 1,
    popularity: 9.5,
    proTip: "Think of this as the ultimate adult sparkling lemonade. Shaking the gin, lemon, and syrup before adding soda prevents the sugar from settling at the base. Tanqueray's bold juniper easily stands up to the heavy fizz.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lemon Juice", substitute: "Fresh lemon wedges", inventoryId: "fresh-lemons" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Premium Simple Syrup", substitute: "Sugar syrup", ingredientGroup: "simple-syrup" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda", ingredientGroup: "soda-water" },
      { amountOz: "Garnish", amountMl: "Garnish", item: "Lemon Wheel & Mint Sprig", substitute: "Lemon slice", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Combine Tanqueray gin, fresh lemon juice, and simple syrup in a cocktail shaker with ice.",
      "Shake quickly for 10 seconds to chill.",
      "Strain into a tall Collins glass packed with clean ice blocks.",
      "Top up with icy Chang Soda Water.",
      "Stir gently once from the bottom up to lift the citrus, and garnish with a lemon wheel."
    ],
    tags: ["gin", "citrus", "collins", "summer", "refreshing", "in-stock"]
  },
  {
    id: "classic-southside",
    name: "Classic Southside",
    otherNames: "The Gin Mojito, Al Capone's Chicago Club Classic",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~22% ABV)",
    alcoholScore: 3,
    tasteProfile: "Crisp Botanical Juniper, Spearmint & Sharp Fresh Lime",
    difficulty: 2,
    popularity: 9.7,
    proTip: "Regarded as the Mojito's refined, high-society cousin served 'up' in a coupe glass. Shaking fresh mint leaves directly with ice bruises the herbs gently and blankets the gin in refreshing essential oils without shredding them.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lime Juice", substitute: "Fresh lemon juice", ingredientGroup: "fresh-lime" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Premium Simple Syrup", substitute: "Rich simple syrup", ingredientGroup: "simple-syrup" },
      { amountOz: "6-8 leaves", amountMl: "6-8 leaves", item: "Fresh Spearmint Leaves", substitute: "Fresh mint sprigs", ingredientGroup: "fresh-mint" }
    ],
    instructions: [
      "Add fresh mint leaves, Tanqueray gin, fresh lime juice, and simple syrup to a cocktail shaker.",
      "Fill with plenty of ice cubes.",
      "Shake with maximum power for 12 seconds until the shaker exterior frosts over.",
      "Double strain through a fine mesh strainer into a chilled coupe glass to filter out fine mint flecks.",
      "Float a single pristine fresh mint leaf on the surface as an aromatic crown."
    ],
    tags: ["gin", "mint", "sour", "classic", "prohibition", "in-stock"]
  },
  {
    id: "classic-gin-gimlet",
    name: "Classic Gin Gimlet",
    otherNames: "The Royal Navy Sour",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~24% ABV)",
    alcoholScore: 4,
    tasteProfile: "Zesty, Crisp, Sweet-Tart & Botanical",
    difficulty: 1,
    popularity: 9.5,
    proTip: "Historically made with Rose's Lime Cordial to prevent scurvy in the navy. Modern craft bars favor fresh lime juice paired with simple syrup, which creates a far brighter, cleaner flavor anchor against the gin.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Tanqueray London Dry Gin", substitute: "Absolut Vodka (for a Vodka Gimlet)", inventoryId: "tanqueray-gin" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh squeezed lime only", ingredientGroup: "fresh-lime" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Premium Simple Syrup", substitute: "Agave syrup", ingredientGroup: "simple-syrup" }
    ],
    instructions: [
      "Chill a coupe glass in your freezer for 5 minutes.",
      "Add Tanqueray gin, fresh lime juice, and simple syrup into a shaker filled with plenty of ice.",
      "Shake with energy for 12 seconds until ice-cold.",
      "Fine strain into the chilled coupe, and garnish with a thin lime wheel floating on top."
    ],
    tags: ["gin", "lime", "sour", "classic", "sharp", "in-stock"]
  },
  {
    id: "midori-sour",
    name: "Classic Midori Sour",
    otherNames: "Melon Sour",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Rocks or Coupe",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Sweet Melon, Bright Citrus & Perfectly Tart",
    difficulty: 2,
    popularity: 9.7,
    proTip: "The original 1980s recipe relied heavily on artificial sweet-and-sour mix, which made it cloying. Using equal parts fresh lemon and lime juice transforms it into a beautifully balanced craft masterpiece. Adding an egg white delivers a striking, velvety foam crown.",
    ingredients: [
      { amountOz: "2 oz", amountMl: "60 ml", item: "Midori Melon Liqueur", substitute: "Any melon liqueur", inventoryId: "midori" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lime juice only", inventoryId: "fresh-lemons" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lime Juice", substitute: "Fresh lemon juice only", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Egg White (Optional for foam)", substitute: "Aquafaba or omit", inventoryId: "egg-white" },
      { amountOz: "Top up", amountMl: "Top up", item: "Chang Soda Water", substitute: "Club soda", inventoryId: "chang-soda-water", ingredientGroup: "soda-water" }
    ],
    instructions: [
      "Combine Midori, fresh lemon juice, fresh lime juice, and egg white in a shaker without ice.",
      "Dry shake vigorously for 10 seconds to fully emulsify and fluff up the egg white.",
      "Fill the shaker with ice blocks and wet shake hard for 12 seconds until frosty cold.",
      "Strain into a rocks glass over fresh ice (or up in a chilled coupe).",
      "Gently splash a top-up of crisp Chang Soda Water through the foam layer.",
      "Garnish with a fresh lime wheel and a maraschino cherry."
    ],
    tags: ["midori", "melon", "sour", "egg-white", "classic", "neon-green", "in-stock"]
  },
  {
    id: "japanese-slipper",
    name: "Japanese Slipper",
    otherNames: "1980s Melbourne Classic",
    category: "Cocktail",
    baseSpirit: "Liqueur/Wine",
    glassware: "Coupe / Cocktail Glass",
    alcoholLevel: "Medium (~18% ABV)",
    alcoholScore: 3,
    tasteProfile: "Sweet Muskmelon, Candied Orange & Crisp Citrus",
    difficulty: 1,
    popularity: 9.4,
    proTip: "Created in 1984 by Jean-Paul Bourguignon at Mietta's in Melbourne. It features a perfect 1:1:1 equal-parts build where the sharpness of fresh lemon and the clean orange of Cointreau carve right through the sweet honeydew base.",
    ingredients: [
      { amountOz: "1 oz", amountMl: "30 ml", item: "Midori Melon Liqueur", substitute: "Any melon liqueur", inventoryId: "midori" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Cointreau", substitute: "Lumina Triple Sec or Grand Marnier", inventoryId: "cointreau", ingredientGroup: "triple-sec" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Fresh Lemon Juice", substitute: "Fresh lime juice", inventoryId: "fresh-lemons" }
    ],
    instructions: [
      "Chill a coupe or martini glass in the freezer for 5 minutes.",
      "Add equal parts Midori, Cointreau, and fresh pressed lemon juice into a cocktail shaker.",
      "Pack with dense ice cubes and shake with power for 12 seconds.",
      "Double strain into your frosty chilled glass.",
      "Garnish cleanly by dropping a maraschino cherry right into the center of the radiant emerald green liquid."
    ],
    tags: ["midori", "cointreau", "equal-parts", "australian", "modern-classic", "in-stock"]
  },
  {
    id: "melon-ball-highball",
    name: "Melon Ball",
    otherNames: "Melon Baller Highball",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Highball / Collins",
    alcoholLevel: "Low-Medium (~12% ABV)",
    alcoholScore: 2,
    tasteProfile: "Lush Honeydew, Sweet Orange Citrus & Clean Polish",
    difficulty: 1,
    popularity: 9.5,
    proTip: "The ultimate effortless summer highball. The neutral profile of Absolut Vodka allows the vibrant fruit notes to stretch out beautifully. Layer the orange juice carefully over the melon-vodka base to create a stunning sunset aesthetic.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Absolut Vodka Original Blue", substitute: "Smirnoff Red Vodka", inventoryId: "absolut-blue", ingredientGroup: "vodka" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Midori Melon Liqueur", substitute: "Any melon liqueur", inventoryId: "midori" },
      { amountOz: "3 oz", amountMl: "90 ml", item: "Orange Juice", substitute: "Freshly squeezed navel oranges", inventoryId: "orange-juice" }
    ],
    instructions: [
      "Fill a tall highball glass completely with fresh ice blocks.",
      "Pour your Absolut vodka and Midori directly into the glass over the ice; stir once.",
      "Slowly pour fresh orange juice over the back of a bar spoon to float it on top.",
      "Observe the striking green-to-orange gradient layer profile before serving with a straw."
    ],
    tags: ["vodka", "midori", "orange", "highball", "sweet", "layered", "in-stock"]
  },
  {
    id: "midori-illusion",
    name: "Midori Illusion",
    otherNames: "Illusion Shaker Highball",
    category: "Cocktail",
    baseSpirit: "Vodka",
    glassware: "Hurricane / Highball",
    alcoholLevel: "Medium (~15% ABV)",
    alcoholScore: 3,
    tasteProfile: "Tropical Pineapple, Lush Melon & Candied Sweetness",
    difficulty: 2,
    popularity: 9.5,
    proTip: "A staple of beach resorts and highball bars. Shaking pineapple juice with vodka and citrus creates an intensely frothy, silky textures head. Using Cointreau rather than cheap triple sec binds the orange and melon oils beautifully.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Absolut Vodka Original Blue", substitute: "Smirnoff Red Vodka", inventoryId: "absolut-blue", ingredientGroup: "vodka" },
      { amountOz: "1 oz", amountMl: "30 ml", item: "Midori Melon Liqueur", substitute: "Any melon liqueur", inventoryId: "midori" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Cointreau", substitute: "Lumina Triple Sec or Grand Marnier", inventoryId: "cointreau", ingredientGroup: "triple-sec" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lemon Juice", substitute: "Fresh lime juice", inventoryId: "fresh-lemons" },
      { amountOz: "2 oz", amountMl: "60 ml", item: "Pineapple Juice", substitute: "Fresh pressed pineapple juice", inventoryId: "pineapple-juice" }
    ],
    instructions: [
      "Pre-chill a hurricane glass with ice cubes.",
      "Combine Absolut vodka, Midori, Cointreau, fresh lemon juice, and pineapple juice in a cocktail shaker.",
      "Pack with abundant ice blocks and shake vigorously for a full 12 seconds to generate a thick, frothy pineapple head.",
      "Strain cleanly into the prepared glass over fresh ice.",
      "Garnish creatively with a fresh pineapple wedge and a slapped mint sprig nestled in the froth head."
    ],
    tags: ["vodka", "midori", "cointreau", "pineapple", "tropical", "summer", "in-stock"]
  },
  {
    id: "black-widower-cocktail",
    name: "Black Widower",
    otherNames: "Anise Gin Sour",
    category: "Cocktail",
    baseSpirit: "Gin",
    glassware: "Coupe",
    alcoholLevel: "Medium-High (~24% ABV)",
    alcoholScore: 4,
    tasteProfile: "Botanical, Intense Anise, Sharp Citrus & Complex",
    difficulty: 2,
    popularity: 9.2,
    proTip: "White Sambuca functions exactly like a high-proof absinthe or pastis modifier here. The heavy, sweet licorice profile coats the mouth, while your high-proof Tanqueray Gin and fresh lemon juice slice cleanly through it so it never feels cloying. Shake vigorously with sharp ice to get maximum dilution.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Tanqueray London Dry Gin", substitute: "Any dry botanical gin", inventoryId: "tanqueray-gin" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Vaccari Sambuca", substitute: "White Sambuca", inventoryId: "sambuca" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Fresh Lemon Juice", substitute: "Fresh lime juice", inventoryId: "fresh-lemons" },
      { amountOz: "1 dash", amountMl: "1 dash", item: "Angostura Bitters", substitute: "Aromatic bitters", inventoryId: "angostura-bitters" }
    ],
    instructions: [
      "Chill a coupe glass in the freezer for 5 minutes.",
      "Add Tanqueray gin, Vaccari Sambuca, fresh lemon juice, and a healthy dash of Angostura bitters into a shaker.",
      "Pack tightly with clean ice cubes and wet shake with maximum speed for 12 seconds.",
      "Double strain through a fine mesh strainer into the chilled coupe.",
      "Garnish cleanly with a thin lemon twist expressed over the surface."
    ],
    tags: ["gin", "sambuca", "anise", "sour", "classic", "complex", "in-stock"]
  },
  {
    id: "sambuca-con-mosca",
    name: "Sambuca con Mosca",
    otherNames: "Sambuca with Flies, Traditional Flaming Sambuca",
    category: "Shot",
    baseSpirit: "Liqueur/Wine",
    glassware: "Shot Glass or Snifter",
    alcoholLevel: "High (~38% ABV)",
    alcoholScore: 4,
    tasteProfile: "Sweet Star Anise, Roasty Coffee & Warm Heat",
    difficulty: 2,
    popularity: 9.6,
    proTip: "The definitive Italian digestif ritual. The three coffee beans represent health, wealth, and prosperity. Chewing the roasted coffee beans directly alongside the sweet anise liqueur creates a marvelous, unexpected dark mocha harmony on the palate. Always blow out the flame completely before shooting!",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Vaccari Sambuca", substitute: "Any premium White Sambuca", inventoryId: "sambuca" },
      { amountOz: "3 whole", amountMl: "3 whole", item: "Whole Roasted Coffee Beans", substitute: "Dark chocolate espresso beans", inventoryId: "coffee-beans" }
    ],
    instructions: [
      "Pour your Vaccari Sambuca directly into a heavy-walled shot glass or small brandy snifter.",
      "Drop exactly three whole roasted coffee beans cleanly into the liquid.",
      "Optional Flaming Ritual: Use a long bar lighter to carefully ignite the surface vapors; let the blue flame toast the coffee oils for 5 seconds.",
      "Place your hand firmly over the glass rim to extinguish the flame instantly.",
      "Shoot down the warm liquid in one gulp, then chew the toasted coffee beans."
    ],
    tags: ["shot", "sambuca", "coffee", "traditional", "flaming", "digestif", "in-stock"]
  },
  {
    id: "jungle-bird",
    name: "Jungle Bird",
    otherNames: "Kuala Lumpur Hilton Classic (1973)",
    category: "Cocktail",
    baseSpirit: "Rum",
    glassware: "Rocks or Double Old Fashioned",
    alcoholLevel: "Medium (~15% ABV)",
    alcoholScore: 3,
    tasteProfile: "Tropical, Bittersweet, Citrus & Complex",
    difficulty: 2,
    popularity: 9.7,
    proTip: "The definitive tropical bittersweet masterpiece. While most Tiki drinks use triple sec or almond orgeat for sweetness, the Jungle Bird uses Campari. Aggressive shaking is essential because the pineapple juice transforms under high aeration into a gorgeous, frothy, velvety head.",
    ingredients: [
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Myers's Original Dark Rum (or Mount Gay Black Barrel)", substitute: "Mount Gay Barbados Rum Black Barrel Blend", inventoryId: "myers-dark-rum" },
      { amountOz: "0.75 oz", amountMl: "22.5 ml", item: "Campari", substitute: "Aperol for a lighter, sweeter bird", inventoryId: "campari" },
      { amountOz: "1.5 oz", amountMl: "45 ml", item: "Pineapple Juice", substitute: "Fresh pressed pineapple juice", inventoryId: "pineapple-juice" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Fresh Lime Juice", substitute: "Fresh lime only", inventoryId: "fresh-limes" },
      { amountOz: "0.5 oz", amountMl: "15 ml", item: "Premium Simple Syrup", substitute: "Rich demerara or molasses syrup", inventoryId: "simple-syrup" }
    ],
    instructions: [
      "Combine dark rum, Campari, pineapple juice, fresh lime juice, and simple syrup in a cocktail shaker.",
      "Fill the shaker completely with clean ice cubes.",
      "Shake with high velocity for 12 to 15 seconds until the shaker exterior forms a thick frost.",
      "Strain over fresh crushed ice (or a single large clear cube) into a rocks glass.",
      "Garnish extravagantly by skewering a fresh pineapple wedge and a maraschino cherry to look like a tropical bird, flanked by slapped mint fronds."
    ],
    tags: ["rum", "campari", "pineapple", "tiki", "tropical", "bittersweet", "classic", "in-stock"]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { INVENTORY_CATEGORIES, DEFAULT_INVENTORY, DEFAULT_DRINKS };
}
