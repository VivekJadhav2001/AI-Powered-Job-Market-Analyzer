import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { globalError, globalResponse } from "./middleware/responseHandler.js";
import connectDB from "./config/connectDB.js";
import resumeRouter from "./routes/upload.routes.js";
import jobListingRouter from "./routes/jobs.routes.js";


const app = express();
connectDB();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost:5174"], //process.env.FRONTEND_URL,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Public-Client-Id"],
  }),
);

app.use(globalResponse);

app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.error(503, "Database is unavailable. Check the MongoDB connection and Atlas network access list.");
  }
  next();
});

app.use("/api/v1/user",resumeRouter)
app.use("/api/v1/daTeam",jobListingRouter)



app.use(globalError);

app.listen(process.env.PORT || 3000, () =>
  console.log(`server is up and running on port: ${process.env.PORT}`),
);
