import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ExplorePage from "./pages/ExplorePage";
import MatchesPage from "./pages/MatchesPage";
import UploadPage from "./pages/UploadPage";
import ProfilePage from "./pages/ProfilePage";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobs } from "./features/jobSlice";
import { useState, useEffect } from "react";
import { getDashboardMetrics, getFastestGrowingRoles, getMarketMomentum, getTopSkills } from "./features/dashboardSlice";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(false);

  const {topSkills,  fastestGrowingRoles} = useSelector((state)=>state.dashboard)

  useEffect(() => {
    
    Promise.allSettled([
      // dispatch(fetchMe()).unwrap(),
      dispatch(getAllJobs()).unwrap(),
      dispatch(getTopSkills()).unwrap(),
      dispatch(getFastestGrowingRoles()).unwrap(),
      dispatch(getDashboardMetrics()).unwrap(),
      dispatch(getMarketMomentum()).unwrap(),
    ]).finally(() => {
      setInitializing(false);
    });
  }, [dispatch]);

  if (initializing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

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
  );
}

export default App;
