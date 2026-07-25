import express from "express";
import { getAvailability, updateMyAvailability } from "../controllers/availabilityController.js";
import {verifyToken} from "../middlewares/verifyToken.js";

const router =express.Router();

router.get("/:id/availability",verifyToken, getAvailability);
router.put("/availability", verifyToken, updateMyAvailability);

export default router;
