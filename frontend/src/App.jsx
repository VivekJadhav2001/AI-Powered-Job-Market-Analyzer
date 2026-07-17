import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ExplorePage from './pages/ExplorePage'
import MatchesPage from './pages/MatchesPage'
import UploadPage from './pages/UploadPage'
import ProfilePage from './pages/ProfilePage'
import { useDispatch } from 'react-redux'
import { getAllJobs } from './features/jobSlice'
import { useEffect } from 'react'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()

  // Fetch jobs once on mount
    useEffect(() => {
  dispatch(getAllJobs())
    .unwrap()
    .catch((error) => {
      console.error(error);
    });
}, [dispatch]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
