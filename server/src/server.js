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

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// api end points
app.use("/auth", authRoute);
app.use("/user", userRoute)

// Fallback to environment configuration file ports if specified
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
});
