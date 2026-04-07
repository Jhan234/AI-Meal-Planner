import { useState } from 'react'
import useMealPlanStore from '../store/useMealPlanStore'

export default function MealPlanForm() {
  const { generatePlan, isLoading, error } = useMealPlanStore()

  const [formData, setFormData] = useState({
    days: 5,
    budget: '',
    availableIngredients: '',
    maxPrepTime: '',
    skillLevel: 'beginner',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const ingredients = formData.availableIngredients
      ? formData.availableIngredients.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    const constraints = [
      formData.skillLevel !== 'beginner' ? `skill level: ${formData.skillLevel}` : '',
      formData.maxPrepTime ? `max prep time: ${formData.maxPrepTime} minutes` : '',
    ]
      .filter(Boolean)
      .join(', ')

    generatePlan({
      days: Number(formData.days),
      budget: formData.budget ? Number(formData.budget) : null,
      availableIngredients: ingredients,
      constraints: constraints || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-teal-700 mb-6">Plan Your Week</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Number of Days <span className="text-teal-600">({formData.days})</span>
          </label>
          <input
            type="range"
            name="days"
            min="3"
            max="7"
            value={formData.days}
            onChange={handleChange}
            className="w-full accent-teal-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Weekly Budget (NZD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g. 120"
              min="0"
              className="pl-8 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Ingredients You Already Have
          </label>
          <input
            type="text"
            name="availableIngredients"
            value={formData.availableIngredients}
            onChange={handleChange}
            placeholder="e.g. rice, onion, garlic, eggs"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">Comma-separated list</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Max Prep Time (min)
            </label>
            <input
              type="number"
              name="maxPrepTime"
              value={formData.maxPrepTime}
              onChange={handleChange}
              placeholder="e.g. 30"
              min="5"
              max="120"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Skill Level
            </label>
            <select
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-8 w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Generating your plan…
          </>
        ) : (
          <>
            <span>✨</span> Generate Meal Plan
          </>
        )}
      </button>
    </form>
  )
}
