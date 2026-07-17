import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ExplorePage from './pages/ExplorePage'
import MatchesPage from './pages/MatchesPage'
import UploadPage from './pages/UploadPage'
import Signup from './auth/Signup'
import SignIn from './auth/SignIn'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="explore" element={<ExplorePage />} />
        </Route>
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
