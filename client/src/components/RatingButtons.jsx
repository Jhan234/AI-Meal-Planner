import useMealPlanStore from '../store/useMealPlanStore'

export default function RatingButtons({ recipeId, currentRating }) {
  const rateMeal = useMealPlanStore((s) => s.rateMeal)

  const handleRating = (rating) => {
    if (currentRating === rating) return
    rateMeal(recipeId, rating)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 mr-1">Rate:</span>
      <button
        onClick={() => handleRating('like')}
        title="Like this recipe"
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          currentRating === 'like'
            ? 'bg-green-100 text-green-700 ring-2 ring-green-400'
            : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600'
        }`}
      >
        👍 Like
      </button>
      <button
        onClick={() => handleRating('dislike')}
        title="Dislike this recipe"
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          currentRating === 'dislike'
            ? 'bg-red-100 text-red-700 ring-2 ring-red-400'
            : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600'
        }`}
      >
        👎 Dislike
      </button>
    </div>
  )
}
