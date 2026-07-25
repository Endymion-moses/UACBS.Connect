import express from "express";
import { cancelMyAppointment, createAppointment, getLecturerRequests, getMyAppointments, updateAppointmentStatus } from "../controllers/appointmentController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
router.post("/", verifyToken, createAppointment);
router.get("/mine", verifyToken, getMyAppointments);
router.get("/lecturer/requests", verifyToken, getLecturerRequests);
router.patch("/:id/status", verifyToken, updateAppointmentStatus);
router.patch("/:id/cancel", verifyToken, cancelMyAppointment);

export default router;
