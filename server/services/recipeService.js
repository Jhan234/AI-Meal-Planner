import { query, getClient } from '../db/index.js';

export async function saveRecipe(recipeData, clientArg) {
  const db = clientArg || { query: async (text, params) => query(text, params) };

  const {
    title,
    description,
    instructions,
    prepTime,
    cookTime,
    servings = 4,
    estimatedCost,
    ingredients = [],
  } = recipeData;

  const recipeResult = await db.query(
    `INSERT INTO recipes (title, description, instructions, prep_time, cook_time, servings, is_ai_generated)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     RETURNING id`,
    [title, description, instructions, prepTime, cookTime, servings],
  );

  const recipeId = recipeResult.rows[0].id;

  for (const ing of ingredients) {
    const nameNormalized = ing.name.toLowerCase().replace(/\s+/g, '_');

    let ingredientId;
    const existing = await db.query(
      'SELECT id FROM ingredients WHERE name_normalized = $1',
      [nameNormalized],
    );

    if (existing.rows.length > 0) {
      ingredientId = existing.rows[0].id;
    } else {
      const inserted = await db.query(
        'INSERT INTO ingredients (name_normalized, category) VALUES ($1, $2) RETURNING id',
        [nameNormalized, ing.category || 'Other'],
      );
      ingredientId = inserted.rows[0].id;
    }

    await db.query(
      'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ($1, $2, $3, $4)',
      [recipeId, ingredientId, ing.quantity || null, ing.unit || null],
    );
  }

  return recipeId;
}

export async function getRecipeById(id) {
  const recipeResult = await query('SELECT * FROM recipes WHERE id = $1', [id]);
  if (recipeResult.rows.length === 0) return null;

  const recipe = recipeResult.rows[0];

  const ingredientsResult = await query(
    `SELECT i.name_normalized AS name, i.category, ri.quantity, ri.unit
     FROM recipe_ingredients ri
     JOIN ingredients i ON ri.ingredient_id = i.id
     WHERE ri.recipe_id = $1`,
    [id],
  );

  recipe.ingredients = ingredientsResult.rows;
  return recipe;
}

export async function getLikedRecipes() {
  const result = await query(
    `SELECT DISTINCT r.* FROM recipes r
     JOIN ratings rat ON r.id = rat.recipe_id
     WHERE rat.rating = 'like'
     ORDER BY r.created_at DESC`,
  );
  return result.rows;
}

export async function findCachedRecipe(title) {
  const normalized = title.toLowerCase().trim();
  const result = await query(
    `SELECT * FROM recipes
     WHERE LOWER(TRIM(title)) = $1
     LIMIT 1`,
    [normalized],
  );
  return result.rows[0] || null;
}
