#!/usr/bin/env node
"use strict";

const data = require("../js/data.js");
const errors = [];
const inventoryIds = new Set();
const drinkIds = new Set();
const categories = new Set(Object.keys(data.INVENTORY_CATEGORIES));
const drinkCategories = new Set(["Cocktail", "Mocktail", "Shot"]);

function error(message) {
  errors.push(message);
}

for (const item of data.DEFAULT_INVENTORY) {
  if (!item.id || typeof item.id !== "string") error("Inventory item is missing a string ID");
  else if (inventoryIds.has(item.id)) error(`Duplicate inventory ID: ${item.id}`);
  else inventoryIds.add(item.id);
  if (!item.name || typeof item.name !== "string") error(`Inventory item ${item.id || "<unknown>"} is missing a name`);
  if (!categories.has(item.category)) error(`Invalid category for inventory item ${item.id}: ${item.category}`);
}

for (const [groupId, group] of Object.entries(data.INGREDIENT_GROUPS)) {
  if (!group.label || !Array.isArray(group.inventoryIds) || !group.inventoryIds.length) {
    error(`Invalid ingredient group: ${groupId}`);
    continue;
  }
  for (const inventoryId of group.inventoryIds) {
    if (!inventoryIds.has(inventoryId)) error(`Unknown inventory ID in group ${groupId}: ${inventoryId}`);
  }
}

for (const inventoryId of Object.keys(data.INVENTORY_UPDATE_OVERRIDES)) {
  if (!inventoryIds.has(inventoryId)) error(`Unknown inventory ID in update overrides: ${inventoryId}`);
}

for (const drink of data.DEFAULT_DRINKS) {
  if (!drink.id || typeof drink.id !== "string") error("Drink is missing a string ID");
  else if (drinkIds.has(drink.id)) error(`Duplicate drink ID: ${drink.id}`);
  else drinkIds.add(drink.id);
  if (!drink.name || typeof drink.name !== "string") error(`Drink ${drink.id || "<unknown>"} is missing a name`);
  if (!drinkCategories.has(drink.category)) error(`Invalid category for drink ${drink.id}: ${drink.category}`);
  if (!Array.isArray(drink.ingredients) || !drink.ingredients.length) error(`Drink ${drink.id} has no ingredients`);
  if (!Array.isArray(drink.instructions) || !drink.instructions.length) error(`Drink ${drink.id} has no instructions`);
  if (!Number.isInteger(drink.difficulty) || drink.difficulty < 1 || drink.difficulty > 5) error(`Invalid difficulty for drink ${drink.id}: ${drink.difficulty}`);
  if (!Number.isFinite(drink.popularity) || drink.popularity < 0 || drink.popularity > 10) error(`Invalid popularity for drink ${drink.id}: ${drink.popularity}`);
  if (!Array.isArray(drink.tags) || !drink.tags.every(tag => typeof tag === "string")) error(`Invalid tags for drink ${drink.id}`);
  if (drink.tools !== undefined && (!Array.isArray(drink.tools) || !drink.tools.every(tool => typeof tool === "string"))) error(`Invalid tools for drink ${drink.id}`);

  for (const ingredient of drink.ingredients || []) {
    if (!ingredient.item || typeof ingredient.item !== "string") {
      error(`Ingredient without a name in drink ${drink.id}`);
      continue;
    }
    if (!ingredient.inventoryId && !ingredient.ingredientGroup) error(`Unlinked ingredient in drink ${drink.id}: ${ingredient.item}`);
    if (ingredient.inventoryId && !inventoryIds.has(ingredient.inventoryId)) error(`Unknown inventory ID in drink ${drink.id}: ${ingredient.inventoryId}`);
    if (ingredient.ingredientGroup && !Object.prototype.hasOwnProperty.call(data.INGREDIENT_GROUPS, ingredient.ingredientGroup)) {
      error(`Unknown ingredient group in drink ${drink.id}: ${ingredient.ingredientGroup}`);
    }
  }
}

if (errors.length) {
  console.error(`Data validation failed with ${errors.length} error(s):`);
  errors.forEach(message => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(`Data validation passed: ${inventoryIds.size} inventory items, ${drinkIds.size} drinks, and ${Object.keys(data.INGREDIENT_GROUPS).length} ingredient groups.`);
}
