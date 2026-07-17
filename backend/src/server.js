import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalError, globalResponse } from "./middleware/responseHandler.js";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.routes.js"
import resumeRouter from "./routes/upload.routes.js";
import jobListingRouter from "./routes/jobs.routes.js";


const app = express();
connectDB();
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost:5174"], //process.env.FRONTEND_URL,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(globalResponse);

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user",resumeRouter)
app.use("/api/v1/daTeam",jobListingRouter)



app.use(globalError);

app.listen(process.env.PORT || 3000, () =>
  console.log(`server is up and running on port: ${process.env.PORT}`),
);
