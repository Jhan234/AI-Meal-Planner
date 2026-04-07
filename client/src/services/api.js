import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export async function generateMealPlan(params) {
  const response = await api.post('/meal-plan/generate', params)
  return response.data
}

export async function regenerateRecipe(mealPlanId, dayNumber, constraints) {
  const response = await api.post('/meal-plan/regenerate', { mealPlanId, dayNumber, constraints })
  return response.data
}

export async function getShoppingList(mealPlanId) {
  const response = await api.get(`/shopping-list/${mealPlanId}`)
  return response.data
}

export async function rateRecipe(recipeId, rating, tags = []) {
  const response = await api.post('/rate-recipe', { recipeId, rating, tags })
  return response.data
}
