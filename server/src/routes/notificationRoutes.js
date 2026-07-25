import express from "express";
import { getMyNotifications, markNotificationRead } from "../controllers/notificationController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
router.get("/", verifyToken, getMyNotifications);
router.patch("/:id/read", verifyToken, markNotificationRead);

export default router;
