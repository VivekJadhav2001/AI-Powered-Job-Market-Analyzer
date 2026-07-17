import express from "express"
import { getAllJobs, uploadJobListings } from "../controllers/job.controller.js";

const router = express.Router()

router.post("/uploadJobListing",uploadJobListings);
router.get("/getAllJobs",getAllJobs);

export default router