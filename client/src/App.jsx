import useMealPlanStore from './store/useMealPlanStore'
import Home from './pages/Home'
import MealPlanPage from './pages/MealPlanPage'

export default function App() {
  const currentPage = useMealPlanStore((s) => s.currentPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'home' ? <Home /> : <MealPlanPage />}
    </div>
  )
}
