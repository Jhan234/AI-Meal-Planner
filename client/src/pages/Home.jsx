import MealPlanForm from '../components/MealPlanForm'

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI-Powered Planning',
    description: 'GPT-4o generates a personalised meal plan tailored to your budget and preferences.',
  },
  {
    icon: '🥝',
    title: 'NZ Focused',
    description: 'Recipes use common New Zealand ingredients and cooking styles Kiwi families love.',
  },
  {
    icon: '💰',
    title: 'Budget Optimised',
    description: 'Meals are planned to reuse ingredients and keep your grocery bill under control.',
  },
  {
    icon: '🛒',
    title: 'Smart Shopping List',
    description: 'Automatically generates a grouped shopping list with estimated NZD prices.',
  },
  {
    icon: '🔄',
    title: 'Regenerate Anytime',
    description: "Not feeling a meal? Swap it out with one click — the AI finds you an alternative.",
  },
  {
    icon: '👍',
    title: 'Rate & Learn',
    description: 'Like and dislike meals so your preferences can guide future recommendations.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-3xl">🥗</span>
          <div>
            <h1 className="text-xl font-bold text-teal-700 leading-none">AI Meal Planner NZ</h1>
            <p className="text-xs text-gray-500">Smart meals for Kiwi households</p>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-4 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span>✨</span> Powered by GPT-4o Mini
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            AI Meal Planner for<br />
            <span className="text-teal-600">New Zealand Households</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Tell us your budget and what&apos;s in your pantry. We&apos;ll generate a week of delicious,
            budget-friendly Kiwi meals — complete with a shopping list.
          </p>
          <MealPlanForm />
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-10">Everything you need</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
        <p>AI Meal Planner NZ — built with React, Express &amp; OpenAI</p>
      </footer>
    </div>
  )
}
