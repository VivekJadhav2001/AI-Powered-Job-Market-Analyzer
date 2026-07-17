import express from "express"
import { upload } from "../middleware/multer.js";
import { calculateAtsScores, deleteResume, getCurrentUser, uploadResume } from "../controllers/upload.controller.js";
import { matchResume } from "../controllers/match.controller.js";

const router = express.Router()

router.get("/me", getCurrentUser);
router.post("/resume", upload.single("resume"), uploadResume);
router.post('/matches', matchResume)
router.delete("/resume", deleteResume);
router.post("/ats-scores", calculateAtsScores);

export default router
