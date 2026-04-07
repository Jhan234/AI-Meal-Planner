import { useState } from 'react'
import useMealPlanStore from '../store/useMealPlanStore'
import RatingButtons from './RatingButtons'

export default function RecipeCard({ meal }) {
  const regenerateRecipe = useMealPlanStore((s) => s.regenerateRecipe)
  const isLoading = useMealPlanStore((s) => s.isLoading)
  const [showInstructions, setShowInstructions] = useState(false)

  const {
    id,
    title,
    description,
    instructions,
    prepTime,
    prep_time,
    cookTime,
    cook_time,
    servings,
    estimatedCost,
    estimated_cost,
    ingredients = [],
    dayNumber,
    day_number,
    userRating,
  } = meal

  const displayDay = dayNumber || day_number
  const displayPrepTime = prepTime || prep_time
  const displayCookTime = cookTime || cook_time
  const displayCost = estimatedCost || estimated_cost

  const instructionSteps = instructions
    ? instructions.split(/\n+/).filter((s) => s.trim())
    : []

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-teal-100 text-sm font-semibold uppercase tracking-wide">
            Day {displayDay}
          </span>
          {displayCost && (
            <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">
              ~${Number(displayCost).toFixed(2)} NZD
            </span>
          )}
        </div>
        <h3 className="text-white text-xl font-bold mt-1 leading-tight">{title}</h3>
      </div>

      <div className="p-6">
        {description && (
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {displayPrepTime && (
            <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full">
              🕐 Prep: {displayPrepTime}min
            </span>
          )}
          {displayCookTime && (
            <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full">
              🍳 Cook: {displayCookTime}min
            </span>
          )}
          {servings && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
              👥 Serves: {servings}
            </span>
          )}
        </div>

        {ingredients.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Ingredients</h4>
            <ul className="grid grid-cols-2 gap-1">
              {ingredients.map((ing, idx) => (
                <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                  {ing.quantity ? `${ing.quantity} ${ing.unit || ''} `.trim() : ''}
                  {ing.name?.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          </div>
        )}

        {instructionSteps.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowInstructions((v) => !v)}
              className="flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors"
            >
              <span>{showInstructions ? '▾' : '▸'}</span>
              {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
            </button>

            {showInstructions && (
              <ol className="mt-3 space-y-2">
                {instructionSteps.map((step, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step.replace(/^\d+\.\s*/, '')}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <RatingButtons recipeId={id} currentRating={userRating} />
          <button
            onClick={() => regenerateRecipe(displayDay)}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 disabled:opacity-40 transition-colors font-medium"
            title="Generate a different recipe for this day"
          >
            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.7-3.7M20 15a9 9 0 01-14.7 3.7" />
            </svg>
            Regenerate
          </button>
        </div>
      </div>
    </div>
  )
}
