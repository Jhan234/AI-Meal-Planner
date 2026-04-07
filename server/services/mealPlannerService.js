import { query, getClient } from '../db/index.js';
import { generateMealPlan, regenerateRecipe } from './aiService.js';
import { saveRecipe, getRecipeById } from './recipeService.js';

export async function createMealPlan({ days, budget, availableIngredients, constraints }) {
  const aiMeals = await generateMealPlan({ days, budget, availableIngredients, constraints });

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const mealPlanResult = await client.query(
      'INSERT INTO meal_plans (num_days, budget) VALUES ($1, $2) RETURNING id',
      [days, budget || null],
    );
    const mealPlanId = mealPlanResult.rows[0].id;

    const savedMeals = [];
    for (let i = 0; i < aiMeals.length; i++) {
      const meal = aiMeals[i];
      const dayNumber = i + 1;

      const recipeId = await saveRecipe(meal, client);

      await client.query(
        'INSERT INTO meal_plan_recipes (meal_plan_id, recipe_id, day_number) VALUES ($1, $2, $3)',
        [mealPlanId, recipeId, dayNumber],
      );

      savedMeals.push({
        ...meal,
        id: recipeId,
        dayNumber,
      });
    }

    await client.query('COMMIT');

    return { mealPlanId, meals: savedMeals };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating meal plan:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

export async function regenerateRecipeForDay(mealPlanId, dayNumber, constraints) {
  const existingResult = await query(
    `SELECT r.*, mpr.day_number
     FROM meal_plan_recipes mpr
     JOIN recipes r ON mpr.recipe_id = r.id
     WHERE mpr.meal_plan_id = $1
     ORDER BY mpr.day_number`,
    [mealPlanId],
  );

  if (existingResult.rows.length === 0) {
    throw new Error(`Meal plan ${mealPlanId} not found.`);
  }

  const existingMeals = existingResult.rows;

  if (existingMeals.length > 0) {
    const recipeIds = existingMeals.map((m) => m.id);
    const ingResult = await query(
      `SELECT ri.recipe_id, i.name_normalized AS name, i.category, ri.quantity, ri.unit
       FROM recipe_ingredients ri
       JOIN ingredients i ON ri.ingredient_id = i.id
       WHERE ri.recipe_id = ANY($1)`,
      [recipeIds],
    );
    const ingByRecipe = {};
    for (const row of ingResult.rows) {
      if (!ingByRecipe[row.recipe_id]) ingByRecipe[row.recipe_id] = [];
      ingByRecipe[row.recipe_id].push(row);
    }
    for (const meal of existingMeals) {
      meal.ingredients = ingByRecipe[meal.id] || [];
    }
  }

  const newRecipeData = await regenerateRecipe(existingMeals, dayNumber, constraints);

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const newRecipeId = await saveRecipe(newRecipeData, client);

    await client.query(
      `UPDATE meal_plan_recipes
       SET recipe_id = $1
       WHERE meal_plan_id = $2 AND day_number = $3`,
      [newRecipeId, mealPlanId, dayNumber],
    );

    await client.query('COMMIT');

    return {
      ...newRecipeData,
      id: newRecipeId,
      dayNumber,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error regenerating recipe for day:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

export async function getMealPlanById(mealPlanId) {
  const planResult = await query('SELECT * FROM meal_plans WHERE id = $1', [mealPlanId]);
  if (planResult.rows.length === 0) return null;

  const plan = planResult.rows[0];

  const mealsResult = await query(
    `SELECT r.*, mpr.day_number
     FROM meal_plan_recipes mpr
     JOIN recipes r ON mpr.recipe_id = r.id
     WHERE mpr.meal_plan_id = $1
     ORDER BY mpr.day_number`,
    [mealPlanId],
  );

  const meals = mealsResult.rows;

  if (meals.length > 0) {
    const recipeIds = meals.map((m) => m.id);
    const ingResult = await query(
      `SELECT ri.recipe_id, i.name_normalized AS name, i.category, ri.quantity, ri.unit
       FROM recipe_ingredients ri
       JOIN ingredients i ON ri.ingredient_id = i.id
       WHERE ri.recipe_id = ANY($1)`,
      [recipeIds],
    );
    const ingByRecipe = {};
    for (const row of ingResult.rows) {
      if (!ingByRecipe[row.recipe_id]) ingByRecipe[row.recipe_id] = [];
      ingByRecipe[row.recipe_id].push(row);
    }
    for (const meal of meals) {
      meal.ingredients = ingByRecipe[meal.id] || [];
    }
  }

  return { ...plan, meals };
}
