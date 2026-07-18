import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // 1. Import cookie parser
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

config();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 2. Activate cookie parsing before processing routes

// api end points

app.use("/auth", authRoute);
app.use("/user", userRoute);

app.use(cors({
  origin: [
    "https://uacbs-connect-s26l.vercel.app", // Your live Vercel frontend
    "http://localhost:5173"                                                    // Local development testing
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added OPTIONS to handle browser preflight checks
  allowedHeaders: ["Content-Type", "Authorization"]
}));




// Fallback to environment configuration file ports if specified
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
});
