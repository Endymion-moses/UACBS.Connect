import express from "express"
import { getAllLecturers } from "../controllers/lecturerController.js"
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();

router.get('/lecturers', verifyToken, getAllLecturers);

export default router ;