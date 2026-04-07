import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDb } from './db/index.js';
import mealPlanRoutes from './routes/mealPlan.js';
import shoppingListRoutes from './routes/shoppingList.js';
import ratingRoutes from './routes/rating.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/meal-plan', mealPlanRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/rate-recipe', ratingRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Meal Planner API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
