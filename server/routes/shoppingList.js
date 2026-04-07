import { Router } from 'express';
import { generateShoppingList } from '../services/shoppingListService.js';

const router = Router();

router.get('/:mealPlanId', async (req, res) => {
  try {
    const mealPlanId = Number(req.params.mealPlanId);
    if (isNaN(mealPlanId)) {
      return res.status(400).json({ error: 'Invalid meal plan ID.' });
    }

    const shoppingList = await generateShoppingList(mealPlanId);
    return res.json(shoppingList);
  } catch (err) {
    console.error('GET /shopping-list/:mealPlanId error:', err.message);
    return res.status(500).json({ error: 'Failed to generate shopping list.', detail: err.message });
  }
});

export default router;
