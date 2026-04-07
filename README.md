# 🥗 AI Meal Planner NZ

An AI-powered meal planning application designed for New Zealand households. Generate personalised weekly meal plans, optimised for budget and ingredient reuse, complete with a grouped shopping list and NZD price estimates.

---

## Features

- 🤖 **AI-generated meal plans** using OpenAI GPT-4o Mini
- 🥝 **NZ-focused recipes** — mince, kumara, lamb, stir fry, and more
- 💰 **Budget optimisation** — plans meals to reuse ingredients across the week
- 🛒 **Smart shopping list** — grouped by category (Produce, Meat, Dairy, Pantry, etc.) with NZD cost estimates
- 🔄 **Regenerate any meal** — swap a day's recipe with one click
- 👍 **Like / Dislike ratings** — track which recipes you enjoyed
- 🎭 **Demo mode** — works without an OpenAI key using mock NZ meal data

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Zustand |
| Backend    | Node.js, Express, ES Modules        |
| AI         | OpenAI API (gpt-4o-mini)            |
| Database   | PostgreSQL 15                       |
| Dev DB     | Docker Compose                      |

---

## Project Structure

```
/client                     React + Vite frontend
  /src
    /components             RecipeCard, ShoppingList, RatingButtons, MealPlanForm
    /pages                  Home, MealPlanPage
    /store                  useMealPlanStore (Zustand)
    /services               api.js (Axios)

/server                     Express backend
  /routes                   mealPlan.js, shoppingList.js, rating.js
  /services                 aiService.js, recipeService.js, mealPlannerService.js, shoppingListService.js
  /db                       index.js (pg Pool), schema.sql
  /utils                    priceTable.js (NZ price estimates)

docker-compose.yml          PostgreSQL dev database
```

---

## Setup & Installation

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for PostgreSQL)
- An OpenAI API key _(optional — app works in demo mode without one)_

### 1. Clone and install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure environment variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/meal_planner
OPENAI_API_KEY=sk-your-key-here    # Leave as-is for demo mode
PORT=3001
```

### 3. Start the database

```bash
# From the project root
docker-compose up -d
```

This starts PostgreSQL on port 5432 and automatically runs the schema.

### 4. Run the application

**Start the backend** (from `/server`):

```bash
npm run dev
```

**Start the frontend** (from `/client`):

```bash
npm run dev
```

The frontend runs at **http://localhost:5173** and proxies API calls to `http://localhost:3001`.

---

## API Documentation

### Base URL: `http://localhost:3001/api`

#### `POST /meal-plan/generate`
Generate a new AI meal plan.

**Request body:**
```json
{
  "days": 5,
  "budget": 120,
  "availableIngredients": ["rice", "onion", "garlic"],
  "constraints": "no seafood, max prep time: 30 minutes"
}
```

**Response:**
```json
{
  "mealPlanId": 1,
  "meals": [
    {
      "id": 1,
      "title": "Kiwi Mince and Kumara Bake",
      "description": "...",
      "instructions": "...",
      "prepTime": 15,
      "cookTime": 40,
      "servings": 4,
      "estimatedCost": 18.50,
      "dayNumber": 1,
      "ingredients": [...]
    }
  ]
}
```

#### `POST /meal-plan/regenerate`
Replace a single day's recipe.

**Request body:**
```json
{
  "mealPlanId": 1,
  "dayNumber": 3,
  "constraints": "vegetarian"
}
```

#### `GET /meal-plan/:id`
Get a saved meal plan with all recipes.

#### `GET /shopping-list/:mealPlanId`
Generate a shopping list for a meal plan.

**Response:**
```json
{
  "items": {
    "Produce": [{ "name": "kumara", "quantity": 1, "unit": "kg", "estimatedCost": 3.50 }],
    "Meat": [...],
    "Pantry": [...]
  },
  "estimatedTotal": 87.50
}
```

#### `POST /rate-recipe`
Rate a recipe.

**Request body:**
```json
{
  "recipeId": 1,
  "rating": "like",
  "tags": ["quick", "family-friendly"]
}
```

---

## Demo Mode

If no valid `OPENAI_API_KEY` is set, the app returns a selection of mock NZ recipes including:

- Kiwi Mince and Kumara Bake
- Chicken Stir Fry with Rice
- Lamb Chops with Roast Vegetables
- Pasta Bolognese
- Salmon with Steamed Greens
- Egg Fried Rice
- Beef and Vegetable Soup

---

## Database Schema

See [`server/db/schema.sql`](server/db/schema.sql) for the full PostgreSQL schema including:

- `recipes` — AI-generated recipe data
- `ingredients` — normalised ingredient names
- `recipe_ingredients` — many-to-many join with quantity/unit
- `meal_plans` — plan metadata (days, budget)
- `meal_plan_recipes` — links recipes to days within a plan
- `ratings` — like/dislike feedback
- `ingredient_prices` — price reference data

---

## License

MIT