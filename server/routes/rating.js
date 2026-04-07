import { Router } from 'express';
import { query } from '../db/index.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { recipeId, rating, tags } = req.body;

    if (!recipeId || !rating) {
      return res.status(400).json({ error: 'recipeId and rating are required.' });
    }

    if (!['like', 'dislike'].includes(rating)) {
      return res.status(400).json({ error: 'rating must be "like" or "dislike".' });
    }

    const result = await query(
      'INSERT INTO ratings (recipe_id, rating, tags) VALUES ($1, $2, $3) RETURNING id',
      [recipeId, rating, tags && tags.length ? tags : null],
    );

    return res.status(201).json({ success: true, ratingId: result.rows[0].id });
  } catch (err) {
    console.error('POST /rate-recipe error:', err.message);
    return res.status(500).json({ error: 'Failed to save rating.', detail: err.message });
  }
});

export default router;
