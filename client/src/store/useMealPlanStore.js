import { create } from 'zustand'
import * as api from '../services/api'

const useMealPlanStore = create((set, get) => ({
  mealPlanId: null,
  meals: [],
  isLoading: false,
  error: null,
  shoppingList: null,
  currentPage: 'home',

  setPage: (page) => set({ currentPage: page }),

  generatePlan: async (params) => {
    set({ isLoading: true, error: null, meals: [], mealPlanId: null, shoppingList: null })
    try {
      const result = await api.generateMealPlan(params)
      set({
        mealPlanId: result.mealPlanId,
        meals: result.meals,
        isLoading: false,
        currentPage: 'plan',
      })
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to generate meal plan.'
      set({ isLoading: false, error: message })
    }
  },

  regenerateRecipe: async (dayNumber) => {
    const { mealPlanId, meals } = get()
    if (!mealPlanId) return

    set({ isLoading: true, error: null })
    try {
      const newRecipe = await api.regenerateRecipe(mealPlanId, dayNumber)
      const updatedMeals = meals.map((meal) =>
        meal.dayNumber === dayNumber ? { ...newRecipe, dayNumber } : meal,
      )
      set({ meals: updatedMeals, isLoading: false })
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to regenerate recipe.'
      set({ isLoading: false, error: message })
    }
  },

  fetchShoppingList: async () => {
    const { mealPlanId } = get()
    if (!mealPlanId) return

    set({ isLoading: true, error: null })
    try {
      const list = await api.getShoppingList(mealPlanId)
      set({ shoppingList: list, isLoading: false })
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to fetch shopping list.'
      set({ isLoading: false, error: message })
    }
  },

  rateMeal: async (recipeId, rating, tags = []) => {
    try {
      await api.rateRecipe(recipeId, rating, tags)
      const { meals } = get()
      const updatedMeals = meals.map((meal) =>
        meal.id === recipeId ? { ...meal, userRating: rating } : meal,
      )
      set({ meals: updatedMeals })
    } catch (err) {
      console.error('Failed to rate meal:', err.message)
    }
  },
}))

export default useMealPlanStore
