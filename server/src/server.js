import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // 1. Import cookie parser
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import lecturerRoute from "./routes/lecturerRoutes.js";
import availabilityRoute from "./routes/availabilityRoutes.js";
import { connectDB, disconnectDB } from "./config/database.js";
import appointmentRoute from "./routes/appointmentRoutes.js";
import notificationRoute from "./routes/notificationRoutes.js";

config();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 2. Activate cookie parsing before processing routes




app.use(cors({
  origin: [
    "https://uacbs-connect-s26l.vercel.app",// Your live Vercel frontend
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added OPTIONS to handle browser preflight checks
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// api end points
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/lecturer", lecturerRoute);
app.use("/lecturer", availabilityRoute);
app.use("/appointments", appointmentRoute);
app.use("/notifications", notificationRoute);



// Fallback to environment configuration file ports if specified
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
  });

  const shutdown = async () => {
    await disconnectDB();
    server.close(() => process.exit(0));
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
};

startServer().catch((error) => {
  console.error("Unable to start server", error);
  process.exit(1);
});
