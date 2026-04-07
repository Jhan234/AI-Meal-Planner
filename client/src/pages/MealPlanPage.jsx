import { useState } from 'react'
import useMealPlanStore from '../store/useMealPlanStore'
import RecipeCard from '../components/RecipeCard'
import ShoppingList from '../components/ShoppingList'

export default function MealPlanPage() {
  const { meals, shoppingList, isLoading, error, fetchShoppingList, setPage, mealPlanId } =
    useMealPlanStore()
  const [showShoppingList, setShowShoppingList] = useState(false)

  const handleViewShoppingList = async () => {
    if (!shoppingList) {
      await fetchShoppingList()
    }
    setShowShoppingList(true)
  }

  const handleStartOver = () => {
    setPage('home')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartOver}
              className="flex items-center gap-1.5 text-gray-500 hover:text-teal-600 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥗</span>
              <span className="font-bold text-teal-700">AI Meal Planner NZ</span>
            </div>
          </div>

          <button
            onClick={handleStartOver}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium hidden sm:block"
          >
            Start Over
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Your Meal Plan</h1>
            <p className="text-gray-500 mt-1">
              {meals.length} day{meals.length !== 1 ? 's' : ''} of delicious Kiwi meals
              {mealPlanId && (
                <span className="text-xs ml-2 text-gray-400">Plan #{mealPlanId}</span>
              )}
            </p>
          </div>

          <button
            onClick={handleViewShoppingList}
            disabled={isLoading}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            {isLoading && !showShoppingList ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <span>🛒</span>
            )}
            View Shopping List
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {isLoading && meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="animate-spin h-10 w-10 mb-4 text-teal-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p>Generating your meal plan…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <RecipeCard key={meal.id || meal.dayNumber || meal.day_number} meal={meal} />
            ))}
          </div>
        )}

        {showShoppingList && (
          <div className="mt-10">
            {isLoading && !shoppingList ? (
              <div className="flex items-center justify-center py-10 text-gray-400 gap-3">
                <svg className="animate-spin h-6 w-6 text-teal-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading shopping list…
              </div>
            ) : (
              <ShoppingList shoppingList={shoppingList} />
            )}
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={handleStartOver}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-600 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.7-3.7M20 15a9 9 0 01-14.7 3.7" />
            </svg>
            Generate a New Plan
          </button>
        </div>
      </main>
    </div>
  )
}
