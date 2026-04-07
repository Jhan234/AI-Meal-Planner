import { Router } from 'express';
import { createMealPlan, regenerateRecipeForDay, getMealPlanById } from '../services/mealPlannerService.js';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { days, budget, availableIngredients, constraints } = req.body;

    if (!days || days < 1 || days > 14) {
      return res.status(400).json({ error: 'days must be between 1 and 14.' });
    }

    const result = await createMealPlan({
      days: Number(days),
      budget: budget ? Number(budget) : null,
      availableIngredients: Array.isArray(availableIngredients)
        ? availableIngredients
        : availableIngredients
        ? availableIngredients.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      constraints: constraints || null,
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error('POST /generate error:', err.message);
    return res.status(500).json({ error: 'Failed to generate meal plan.', detail: err.message });
  }
});

router.post('/regenerate', async (req, res) => {
  try {
    const { mealPlanId, dayNumber, constraints } = req.body;

    if (!mealPlanId || !dayNumber) {
      return res.status(400).json({ error: 'mealPlanId and dayNumber are required.' });
    }

    const newRecipe = await regenerateRecipeForDay(
      Number(mealPlanId),
      Number(dayNumber),
      constraints || null,
    );

    return res.json(newRecipe);
  } catch (err) {
    console.error('POST /regenerate error:', err.message);
    return res.status(500).json({ error: 'Failed to regenerate recipe.', detail: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const mealPlanId = Number(req.params.id);
    if (isNaN(mealPlanId)) {
      return res.status(400).json({ error: 'Invalid meal plan ID.' });
    }

    const plan = await getMealPlanById(mealPlanId);
    if (!plan) {
      return res.status(404).json({ error: 'Meal plan not found.' });
    }

    return res.json(plan);
  } catch (err) {
    console.error('GET /:id error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch meal plan.', detail: err.message });
  }
});

export default router;
