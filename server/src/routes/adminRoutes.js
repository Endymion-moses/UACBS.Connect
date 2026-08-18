import express from "express";
import { getDashboardOverview } from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
router.get("/dashboard", verifyToken, getDashboardOverview);
export default router;
