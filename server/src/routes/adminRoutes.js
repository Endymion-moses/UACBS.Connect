import express from "express";
import { getDashboardOverview, getUsers } from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
router.get("/dashboard", verifyToken, getDashboardOverview);
router.get("/users", verifyToken, getUsers);
export default router;
