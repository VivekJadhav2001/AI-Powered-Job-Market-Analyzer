import express from "express"
import { uploadJobListings } from "../controllers/job.controller.js";

const router = express.Router()

router.post("/uploadJobListing",uploadJobListings);

export default router