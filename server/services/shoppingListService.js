import { query } from '../db/index.js';
import { NZ_PRICE_TABLE } from '../utils/priceTable.js';

const CATEGORY_ORDER = ['Produce', 'Meat', 'Dairy', 'Pantry', 'Frozen', 'Other'];

function normalizeUnit(quantity, unit) {
  const u = (unit || '').toLowerCase().trim();
  if (['g', 'gram', 'grams'].includes(u)) {
    return { quantity: quantity / 1000, unit: 'kg' };
  }
  if (['ml', 'millilitre', 'millilitres', 'milliliter', 'milliliters'].includes(u)) {
    return { quantity: quantity / 1000, unit: 'litre' };
  }
  return { quantity, unit: unit || '' };
}

export async function generateShoppingList(mealPlanId) {
  const result = await query(
    `SELECT i.name_normalized AS name, i.category, ri.quantity, ri.unit
     FROM meal_plan_recipes mpr
     JOIN recipe_ingredients ri ON mpr.recipe_id = ri.recipe_id
     JOIN ingredients i ON ri.ingredient_id = i.id
     WHERE mpr.meal_plan_id = $1`,
    [mealPlanId],
  );

  if (result.rows.length === 0) {
    throw new Error(`No ingredients found for meal plan ${mealPlanId}.`);
  }

  const aggregated = {};

  for (const row of result.rows) {
    const key = `${row.name}__${row.unit || ''}`;
    const normalized = normalizeUnit(Number(row.quantity) || 1, row.unit);

    if (aggregated[key]) {
      aggregated[key].quantity += normalized.quantity;
    } else {
      aggregated[key] = {
        name: row.name.replace(/_/g, ' '),
        rawName: row.name,
        category: row.category || 'Other',
        quantity: normalized.quantity,
        unit: normalized.unit,
      };
    }
  }

  const grouped = {};
  for (const cat of CATEGORY_ORDER) {
    grouped[cat] = [];
  }

  let estimatedTotal = 0;

  for (const item of Object.values(aggregated)) {
    const cat = CATEGORY_ORDER.includes(item.category) ? item.category : 'Other';
    const priceKey = item.rawName.toLowerCase().replace(/\s+/g, '_');
    const priceInfo = NZ_PRICE_TABLE[priceKey];
    let itemCost = 0;

    if (priceInfo) {
      itemCost = Math.round(priceInfo.price * item.quantity * 100) / 100;
    } else {
      itemCost = Math.round(3.00 * item.quantity * 100) / 100;
    }

    estimatedTotal += itemCost;

    grouped[cat].push({
      name: item.name,
      quantity: Math.round(item.quantity * 100) / 100,
      unit: item.unit,
      estimatedCost: itemCost,
    });
  }

  for (const cat of CATEGORY_ORDER) {
    grouped[cat].sort((a, b) => a.name.localeCompare(b.name));
    if (grouped[cat].length === 0) {
      delete grouped[cat];
    }
  }

  return {
    items: grouped,
    estimatedTotal: Math.round(estimatedTotal * 100) / 100,
  };
}
