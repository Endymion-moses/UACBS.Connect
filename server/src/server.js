import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // 1. Import cookie parser
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

config();

const app = express();
// middlewares
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://uacbs-connect-s26l-eawel6ogz-silemmoses-8698s-projects.vercel.app,https://uacbs-connect-s26l.vercel.app,http://localhost:5173").split(",").map(s => s.trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests (curl, postman)
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: origin not allowed'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// api end points
app.use("/auth", authRoute);
app.use("/user", userRoute);




// Fallback to environment configuration file ports if specified
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
});
