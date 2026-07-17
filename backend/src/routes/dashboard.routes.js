import express from "express"
import { getDashboardMetrics, getFastestGrowingRoles, getMarketMomentum, getSkillDemand } from "../controllers/dashboard.controller.js"

const router = express.Router()


router.get("/getTopSkills",getSkillDemand)
router.get("/fastestGrowingRoles",getFastestGrowingRoles)
router.get("/getDashboardMetrics",getDashboardMetrics)
router.get("/getMarketMomentum",getMarketMomentum)


export default router