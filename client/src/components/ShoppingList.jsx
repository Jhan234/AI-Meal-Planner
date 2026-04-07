const CATEGORY_ICONS = {
  Produce: '🥦',
  Meat: '🥩',
  Dairy: '🧀',
  Pantry: '🥫',
  Frozen: '🧊',
  Other: '🛒',
}

const CATEGORY_COLORS = {
  Produce: 'bg-green-50 border-green-200',
  Meat: 'bg-red-50 border-red-200',
  Dairy: 'bg-yellow-50 border-yellow-200',
  Pantry: 'bg-orange-50 border-orange-200',
  Frozen: 'bg-blue-50 border-blue-200',
  Other: 'bg-gray-50 border-gray-200',
}

const CATEGORY_HEADING = {
  Produce: 'text-green-700',
  Meat: 'text-red-700',
  Dairy: 'text-yellow-700',
  Pantry: 'text-orange-700',
  Frozen: 'text-blue-700',
  Other: 'text-gray-700',
}

export default function ShoppingList({ shoppingList }) {
  if (!shoppingList) return null

  const { items, estimatedTotal } = shoppingList
  const categories = Object.keys(items)

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🛍️ Shopping List</h2>
        <div className="bg-teal-600 text-white px-4 py-2 rounded-xl font-bold text-lg">
          ~${Number(estimatedTotal).toFixed(2)} NZD
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-sm">No items found.</p>
      ) : (
        <div className="space-y-5">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`rounded-xl border p-4 ${CATEGORY_COLORS[cat] || 'bg-gray-50 border-gray-200'}`}
            >
              <h3 className={`font-bold text-base mb-3 flex items-center gap-2 ${CATEGORY_HEADING[cat] || 'text-gray-700'}`}>
                <span>{CATEGORY_ICONS[cat] || '🛒'}</span>
                {cat}
                <span className="ml-auto text-xs font-normal bg-white/70 px-2 py-0.5 rounded-full">
                  {items[cat].length} item{items[cat].length !== 1 ? 's' : ''}
                </span>
              </h3>
              <ul className="space-y-2">
                {items[cat].map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-current opacity-40" />
                      <span className="capitalize font-medium text-gray-700">{item.name.replace(/_/g, ' ')}</span>
                      {item.quantity && item.unit && (
                        <span className="text-gray-500">
                          — {item.quantity} {item.unit}
                        </span>
                      )}
                    </div>
                    {item.estimatedCost > 0 && (
                      <span className="text-gray-400 text-xs">
                        ~${Number(item.estimatedCost).toFixed(2)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-gray-600 font-medium">Estimated Total</span>
        <span className="text-teal-700 font-bold text-xl">
          ${Number(estimatedTotal).toFixed(2)} NZD
        </span>
      </div>
    </div>
  )
}
