import express from "express";
import { updateProfile } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Guarded Route: Infuses security token to block anonymous traffic
router.put("/update", verifyToken, updateProfile);

export default router;
