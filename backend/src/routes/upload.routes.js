import express from "express"
import { upload } from "../middleware/multer.js";
import { authorization } from "../middleware/authorization.js";
import { uploadResume } from "../controllers/upload.controller.js";

const router = express.Router()

router.post(
  "/upload/:id",
  authorization, 
  upload.single("resume"),
  uploadResume
);

export default router